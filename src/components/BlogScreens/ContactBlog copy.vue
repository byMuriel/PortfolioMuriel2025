<!-- src\components\BlogScreens\ContactBlog.vue -->
<template>
  <section class="contactBlog">
    <div class="cards mt-5">
      <!-- Mail -->
      <article class="card">
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
  --brand: #304ffe;
  --card-bg: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.12);
  --text: #7f8081;
  --muted: #a8b0bd;
  --ring: rgba(48, 79, 254, 0.45);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  --shadow-hover: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
}

@media (prefers-color-scheme: light) {
  .contactBlog {
    --text: #0e1116;
    --muted: #4b5563;
    --ring: rgba(48, 79, 254, 0.35);
    --shadow: 0 8px 26px rgba(14, 17, 22, 0.08);
    --shadow-hover: 0 0.2rem 0.2rem rgba(14, 17, 22, 0.05);
  }
}

.contactBlog {
  width: min(100%, 1000px);
  padding: 1.25rem;
  min-height: 70dvh;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  border-radius: 16px;
  padding: 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-hover);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  overflow: clip;
}

.card__title {
  margin: 0;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.2px;
}

.card__text {
  margin: 0.15rem 0 0.35rem 0;
  color: var(--muted);
  line-height: 1.5;
}

.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.1rem;
}

.hint {
  color: var(--muted);
  font-size: 0.85rem;
  user-select: all;
}

.btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.52rem 0.95rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
  will-change: transform;
  outline: none;
}

.btn-outline {
  color: rgb(105, 105, 105);
  border-color: color-mix(in oklab, var(--brand), transparent 70%);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--brand), transparent 70%);
}

.btn-outline:hover {
  border-color: color-mix(in oklab, var(--brand), transparent 30%);
  box-shadow: inset 0 0 0 0.2rem color-mix(in oklab, var(--brand), transparent 70%);
}

.btn:focus-visible,
a.btn:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 4px var(--ring);
}

@media (max-width: 720px) {
  .contactBlog {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .cards {
    gap: 0.75rem;
  }
  .card {
    padding: 0.9rem;
  }
  .contactBlog {
    min-height: auto;
  }
}
</style>
