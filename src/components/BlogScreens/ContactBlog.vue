<!-- src\components\BlogScreens\ContactBlog.vue -->
<template>
  <section class="contactBlog">
    <h2 class="sectionTitle">Contact</h2>
    <div class="cards">
      <!-- Mail -->
      <article class="card">
        <!-- <div class="card__left">
          <img :src="logos.mail" alt="mail" class="logo" />
        </div> -->
        <div class="card__body">
          <h3 class="card__title">{{ contact.mail.name }}</h3>
          <p class="card__text">{{ contact.mail.message }}</p>

          <div class="actions">
            <button class="btn btn-outline" @click="copyEmail(displayEmail(contact.mail.link))">
              Copy
            </button>
            <small class="hint">{{ displayEmail(contact.mail.link) }}</small>
          </div>
        </div>
      </article>

      <!-- LinkedIn -->
      <article class="card">
        <!-- <div class="card__left">
          <img :src="logos.linkedIn" alt="LinkedIn" class="logo" />
        </div> -->
        <div class="card__body">
          <h3 class="card__title">{{ contact.linkedIn.name }}</h3>
          <p class="card__text">{{ contact.linkedIn.message }}</p>

          <div class="actions">
            <a
              class="btn btn-outline"
              :href="contact.linkedIn.link"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              Open LinkedIn
            </a>
          </div>
        </div>
      </article>

      <!-- GitHub -->
      <article class="card">
        <!-- <div class="card__left">
          <img :src="logos.gitHub" alt="GitHub" class="logo" />
        </div> -->
        <div class="card__body">
          <h3 class="card__title">{{ contact.gitHub.name }}</h3>
          <p class="card__text">{{ contact.gitHub.message }}</p>

          <div class="actions">
            <a
              class="btn btn-outline"
              :href="contact.gitHub.link"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              Open GitHub
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchContactChannels, type ContactChannelDTO } from '@/services/contactChannels'

type Channel = {
  name: string
  link: string
  logo: string
  message: string
  bubbles: string[]
  go_to?: string | null
}

const router = useRouter()

const contact = ref<{
  mail: Channel
  linkedIn: Channel
  gitHub: Channel
}>({
  mail: { name: '', link: '', logo: '', message: '', bubbles: [] },
  linkedIn: { name: '', link: '', logo: '', message: '', bubbles: [] },
  gitHub: { name: '', link: '', logo: '', message: '', bubbles: [] },
})

const logos = ref({ mail: '', linkedIn: '', gitHub: '' })
const loading = ref(false)
const error = ref<string | null>(null)

/* ---------- Helpers ---------- */
function toAbsUrl(url?: string): string {
  const u = (url ?? '').trim()
  if (!u) return ''
  if (/^(https?:)?\/\//i.test(u)) return u.startsWith('//') ? `https:${u}` : u
  if (u.startsWith('/')) return 'https://murielvitale.com' + u
  return 'https://murielvitale.com/' + u
}

function normalizeLink(link: string, code: string): string {
  const l = (link || '').trim()
  const c = (code || '').toLowerCase()
  if (!l) return ''
  if (c.includes('mail') && !/^mailto:/i.test(l)) return `mailto:${l}`
  if (/^(https?:\/\/|mailto:)/i.test(l)) return l
  return `https://${l}`
}

function rowToChannel(r?: ContactChannelDTO): Channel {
  return {
    name: r?.name || '',
    link: normalizeLink(r?.link || '', r?.code || ''),
    logo: toAbsUrl(r?.logo_url || ''),
    message: r?.message || '',
    bubbles: [r?.bubble1, r?.bubble2, r?.bubble3].filter(
      (x): x is string => !!x && x.trim().length > 0,
    ),
    go_to: r?.go_to ?? null,
  }
}
function displayEmail(address: string): string {
  return address.replace(/^mailto:/i, '')
}

/* ---------- Carga ---------- */
onMounted(async () => {
  loading.value = true
  try {
    // indexar por code robusto
    // 2) Indexar por code de forma MUY robusta
    function normCode(s?: string): string {
      // quita espacios, números, guiones, etc. y deja solo letras minúsculas
      return (s ?? '').toLowerCase().replace(/[^a-z]/g, '')
    }

    const rows = await fetchContactChannels()

    // Para debug: ver cómo vienen los codes realmente
    console.log(
      '[CONTACT ROWS codes]',
      rows.map((r) => r.code),
    )

    const map: Record<string, ContactChannelDTO | undefined> = {}
    for (const r of rows) {
      if (r.is_active !== 1) continue
      const key = normCode(r.code)
      map[key] = r
    }

    // helper para encontrar por candidatos y, si falla, por heurística
    function pick(candidates: string[]): ContactChannelDTO | undefined {
      // 1) directo por códigos normalizados
      for (const c of candidates) {
        const k = normCode(c)
        if (map[k]) return map[k]
      }
      // 2) buscar por nombre
      const nameHit = rows.find((r) => r.is_active === 1 && normCode(r.name) === candidates[0])
      if (nameHit) return nameHit
      // 3) buscar por URL (dominio típico)
      const domain =
        candidates[0] === 'linkedin'
          ? 'linkedin.com'
          : candidates[0] === 'github'
            ? 'github.com'
            : ''
      if (domain) {
        const urlHit = rows.find(
          (r) => r.is_active === 1 && (r.link || '').toLowerCase().includes(domain),
        )
        if (urlHit) return urlHit
      }
      return undefined
    }

    // 3) Tomar los 3 canales principales (admite typos como "gitub", "linked in", "1 mail", etc.)
    const mail = pick(['mail', 'email', 'e-mail'])
    const linkedIn = pick(['linkedin', 'linked-in'])
    const gitHub = pick(['github', 'git-hub', 'gitub']) // incluimos typo común

    // 4) Adaptar cada canal
    contact.value = {
      mail: rowToChannel(mail),
      linkedIn: rowToChannel(linkedIn),
      gitHub: rowToChannel(gitHub),
    }
    logos.value = {
      mail: toAbsUrl(mail?.logo_url || ''),
      linkedIn: toAbsUrl(linkedIn?.logo_url || ''),
      gitHub: toAbsUrl(gitHub?.logo_url || ''),
    }

    // verificación rápida
    console.log('[CONTACT LINKS]', {
      mail: contact.value.mail.link,
      linkedIn: contact.value.linkedIn.link,
      gitHub: contact.value.gitHub.link,
    })
  } catch (e: any) {
    error.value = e?.message ?? 'Error cargando contactos'
  } finally {
    loading.value = false
  }
})

/* ---------- Acciones ---------- */
function copyEmail(address: string) {
  if (!address) return
  navigator.clipboard.writeText(address).catch(() => {})
}

function openExternal(url?: string) {
  const u = (url ?? '').trim()
  console.log('[openExternal]', u)
  if (!/^(https?:\/\/|mailto:)/i.test(u)) return
  const win = window.open(u, '_blank', 'noopener,noreferrer')
  if (!win) window.location.href = u
}

function goToInternal(pathOrName?: string | null) {
  if (!pathOrName) return
  if (pathOrName.startsWith('/')) router.push(pathOrName)
  else router.push({ name: pathOrName })
}
</script>

<style scoped>
.contactBlog {
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 1.25rem;
  color: #111;
}

.sectionTitle {
  font-weight: 800;
  font-size: 1.35rem;
  margin: 0 0 0.75rem 0;
}

/* GRID */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* CARD */
.card {
  display: grid;
  grid-template-columns: 84px 1fr;
  align-items: center;
  gap: 1rem;
  background: #f5f6f7;
  border: 1px solid #e5e6e8;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.04);
}

.card__left {
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #e1e1e1;
  background: #fff;
}

.card__title {
  margin: 0;
  font-weight: 800;
  font-size: 1.1rem;
}
.card__text {
  margin: 0.25rem 0 0.5rem 0;
  color: #333;
}

/* Bubbles */
.bubbles {
  display: grid;
  gap: 0.4rem;
  margin-top: 0.25rem;
}
.bubble {
  margin: 0;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  line-height: 1.45;
  color: #222;
}
.bubble.alt {
  background: #fcfcfe;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.25rem;
}
.hint {
  color: #666;
}

.btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.btn-primary {
  color: #fff;
  background: #0d6efd;
  border-color: #0d6efd;
}
.btn-primary:hover {
  filter: brightness(0.95);
}
.btn-outline {
  color: #0d6efd;
  background: transparent;
  border-color: #b8d3ff;
}
.btn-outline:hover {
  background: #eaf2ff;
}

/* Responsive */
@media (max-width: 720px) {
  .card {
    grid-template-columns: 64px 1fr;
  }
  .logo {
    width: 56px;
    height: 56px;
  }
}
@media (max-width: 576px) {
  .contactBlog {
    padding: 0.75rem;
  }
  .cards {
    gap: 0.75rem;
  }
  .card {
    grid-template-columns: 48px 1fr;
    padding: 0.85rem;
  }
  .logo {
    width: 48px;
    height: 48px;
    border-radius: 10px;
  }
}
</style>
