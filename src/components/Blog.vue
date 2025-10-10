<!-- src\components\Blog.vue -->
<template>
  <div class="blogContainer bg-light">
    <!-- Header -->
    <div class="navBar">
      <div class="titleContainer">
        <h1 class="title m-0 p-0">&lt;MAYBE WRONG, BUT WORKED&gt;</h1>
        <p class="subtitle m-0 p-0">Possibly, That’s Not How It’s Done, but It Worked for Me.</p>
      </div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary m-0 p-0">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup" ref="navbarCollapse">
            <div class="navbar-nav ms-auto">
              <a
                class="nav-link"
                href=""
                @click.prevent="(activate('Posts'), closeNavbar())"
                :class="{ active: activeView === 'PostListBlog' }"
                >Posts</a
              >
              <a
                class="nav-link"
                href=""
                @click.prevent="(activate('About'), closeNavbar())"
                :class="{ active: activeView === 'AboutBlog' }"
                >About Me</a
              >
              <a
                class="nav-link"
                href=""
                @click.prevent="(activate('Contact'), closeNavbar())"
                :class="{ active: activeView === 'ContactBlog' }"
                >Contact</a
              >
              <span class="portfolioLink">
                <router-link
                  class="nav-link buttonPortafolio"
                  to="/"
                  :class="{ active: $route.path === '/' }"
                  @click="closeNavbar"
                >
                  Go to my Portfolio
                </router-link>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <!-- Content -->
    <div class="blogContent">
      <PostListBlog v-if="activeView === 'PostListBlog'" />
      <AboutBlog v-else-if="activeView === 'AboutBlog'" :about="about" :imgLoaded="imgLoaded" />
      <ContactBlog
        v-else-if="activeView === 'ContactBlog'"
        :contact="contact"
        :loading="loadingContact"
        :error="errorContact"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import PostListBlog from '@/components/BlogScreens/PostListBlog.vue'
import AboutBlog from '@/components/BlogScreens/AboutBlog.vue'
import ContactBlog from '@/components/BlogScreens/ContactBlog.vue'
import { fetchAboutForBlog, type AboutPayload } from '@/services/about'
import { fetchContactChannels, type ContactChannelDTO } from '@/services/contactChannels'

type Channel = {
  name: string
  link: string
  logo: string
  message: string
  bubbles: string[]
  go_to?: string | null
}

const navbarCollapse = ref<HTMLElement | null>(null)
const activeView = ref<string>('PostListBlog')
const about = ref<AboutPayload | null>(null)
const imgLoaded = ref(false)
const loadingAbout = ref(false)
const errorAbout = ref<string | null>(null)
let abortCtrl: AbortController | null = null
const contact = ref<{
  mail: Channel
  linkedIn: Channel
  gitHub: Channel
}>({
  mail: { name: '', link: '', logo: '', message: '', bubbles: [] },
  linkedIn: { name: '', link: '', logo: '', message: '', bubbles: [] },
  gitHub: { name: '', link: '', logo: '', message: '', bubbles: [] },
})
const loadingContact = ref(false)
const errorContact = ref<string | null>(null)
let abortCtrlContact: AbortController | null = null

/*****************************************************************************************
 * FUNCTION: activate
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Switches the active blog view based on a menu option.
 *              - Maps 'Posts' → PostListBlog, 'About' → AboutBlog, 'Contact' → ContactBlog.
 *              - Defaults to PostListBlog for unknown options.
 *
 * DESCRIPCIÓN: Cambia la vista activa del blog según la opción del menú.
 *              - Mapea 'Posts' → PostListBlog, 'About' → AboutBlog, 'Contact' → ContactBlog.
 *              - Por defecto usa PostListBlog si la opción es desconocida.
 *****************************************************************************************/
function activate(option: 'Posts' | 'Projects' | 'About' | 'Contact') {
  switch (option) {
    case 'Posts':
      activeView.value = 'PostListBlog'
      break
    case 'About':
      activeView.value = 'AboutBlog'
      break
    case 'Contact':
      activeView.value = 'ContactBlog'
      break
    default:
      activeView.value = 'PostListBlog'
  }
}
/*****************************************************************************************
 * FUNCTION: closeNavbar
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Programmatically closes the Bootstrap navbar (mobile menu).
 *              - Removes 'show', resets inline height/visibility, and updates toggler state.
 *
 * DESCRIPCIÓN: Cierra programáticamente la navbar de Bootstrap (menú móvil).
 *              - Quita 'show', reinicia height/visibility en línea y actualiza el botón toggler.
 *****************************************************************************************/
function closeNavbar() {
  const el = navbarCollapse.value
  if (!el) return

  el.classList.remove('show')
  el.style.height = ''
  el.style.visibility = ''

  const btn = document.querySelector(
    '[data-bs-target="#navbarNavAltMarkup"]',
  ) as HTMLButtonElement | null

  if (btn) {
    btn.classList.add('collapsed')
    btn.setAttribute('aria-expanded', 'false')
  }
}
/*****************************************************************************************
 * FUNCTION: preloadImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Preloads an image and resolves regardless of success or failure.
 *              - Uses HTMLImageElement with async decoding and eager loading.
 *
 * DESCRIPCIÓN: Precarga una imagen y resuelve independientemente del éxito o fallo.
 *              - Usa HTMLImageElement con decodificación asíncrona y carga eager.
 *****************************************************************************************/
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const i = new Image()
    i.decoding = 'async'
    i.loading = 'eager'
    i.src = src
    i.onload = () => resolve()
    i.onerror = () => resolve()
  })
}
/*****************************************************************************************
 * FUNCTION: toAbsUrl
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalizes a relative or protocol-relative URL to an absolute one.
 *              - Supports //host, /path, and bare paths using 'https://murielvitale.com'.
 *
 * DESCRIPCIÓN: Normaliza una URL relativa o sin protocolo a una absoluta.
 *              - Soporta //host, /path y rutas simples usando 'https://murielvitale.com'.
 *****************************************************************************************/
function toAbsUrl(url?: string): string {
  const u = (url ?? '').trim()
  if (!u) return ''
  if (/^(https?:)?\/\//i.test(u)) return u.startsWith('//') ? `https:${u}` : u
  if (u.startsWith('/')) return 'https://murielvitale.com' + u
  return 'https://murielvitale.com/' + u
}
/*****************************************************************************************
 * FUNCTION: normalizeLink
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalizes a link based on its code (e.g., mail, linkedin).
 *              - Adds 'mailto:' for email-like codes if missing.
 *              - Ensures http(s) or mailto; otherwise prefixes with https://
 *
 * DESCRIPCIÓN: Normaliza un enlace según su código (p.ej., mail, linkedin).
 *              - Agrega 'mailto:' para códigos tipo correo si falta.
 *              - Asegura http(s) o mailto; de lo contrario antepone https://
 *****************************************************************************************/
function normalizeLink(link: string, code: string): string {
  const l = (link || '').trim()
  const c = (code || '').toLowerCase()
  if (!l) return ''
  if (c.includes('mail') && !/^mailto:/i.test(l)) return `mailto:${l}`
  if (/^(https?:\/\/|mailto:)/i.test(l)) return l
  return `https://${l}`
}
/*****************************************************************************************
 * FUNCTION: normCode
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Produces a normalized, lowercase, alphabet-only code string.
 *              - Useful for consistent keying and comparisons.
 *
 * DESCRIPCIÓN: Genera un código normalizado en minúsculas con solo letras.
 *              - Útil para claves y comparaciones consistentes.
 *****************************************************************************************/
function normCode(s?: string): string {
  return (s ?? '').toLowerCase().replace(/[^a-z]/g, '')
}
/*****************************************************************************************
 * FUNCTION: rowToChannel
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Maps a ContactChannelDTO row into a Channel view model.
 *              - Normalizes link, absolute logo URL, and filters non-empty bubbles.
 *
 * DESCRIPCIÓN: Mapea una fila ContactChannelDTO a un view model Channel.
 *              - Normaliza el enlace, URL absoluta del logo y filtra burbujas no vacías.
 *****************************************************************************************/
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
/*****************************************************************************************
 * FUNCTION: pickChannel
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Selects the best matching contact channel from candidates.
 *              - Tries by normalized code, then active name, then domain heuristic.
 *
 * DESCRIPCIÓN: Selecciona el canal de contacto que mejor coincide entre candidatos.
 *              - Prueba por código normalizado, luego nombre activo y finalmente dominio.
 *****************************************************************************************/
function pickChannel(
  rows: ContactChannelDTO[],
  map: Record<string, ContactChannelDTO | undefined>,
  candidates: string[],
): ContactChannelDTO | undefined {
  for (const c of candidates) {
    const k = normCode(c)
    if (map[k]) return map[k]
  }
  const nameHit = rows.find((r) => r.is_active === 1 && normCode(r.name) === candidates[0])
  if (nameHit) return nameHit
  const domain =
    candidates[0] === 'linkedin' ? 'linkedin.com' : candidates[0] === 'github' ? 'github.com' : ''
  if (domain) {
    const urlHit = rows.find(
      (r) => r.is_active === 1 && (r.link || '').toLowerCase().includes(domain),
    )
    if (urlHit) return urlHit
  }
  return undefined
}

/*****************************************************************************************
 * LIFECYCLE: onMounted (About data)
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Fetches About data for the blog and preloads the hero image.
 *              - Manages loading/error flags and abort controller for safety.
 *
 * DESCRIPCIÓN: Obtiene los datos de About del blog y precarga la imagen principal.
 *              - Gestiona flags de carga/errores y un abort controller por seguridad.
 *****************************************************************************************/
onMounted(async () => {
  loadingAbout.value = true
  abortCtrl = new AbortController()
  abortCtrlContact?.abort()

  try {
    const data = await fetchAboutForBlog(abortCtrl.signal)
    about.value = data

    const src = data?.img
    if (src) await preloadImage(src)

    imgLoaded.value = true
  } catch (e: any) {
    errorAbout.value = e?.message ?? 'Error cargando About'
    imgLoaded.value = true
  } finally {
    loadingAbout.value = false
  }
})
/*****************************************************************************************
 * LIFECYCLE: onMounted (Contact data)
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Fetches contact channels and builds the blog contact view model.
 *              - Creates a code→row map, picks mail/linkedin/github channels, and normalizes them.
 *
 * DESCRIPCIÓN: Obtiene los canales de contacto y construye el view model del blog.
 *              - Crea un mapa código→fila, elige mail/linkedin/github y los normaliza.
 *****************************************************************************************/
onMounted(async () => {
  loadingContact.value = true
  abortCtrlContact = new AbortController()
  try {
    const rows = await fetchContactChannels(abortCtrlContact.signal)

    const map: Record<string, ContactChannelDTO | undefined> = {}
    for (const r of rows) {
      if (r.is_active !== 1) continue
      map[normCode(r.code)] = r
    }

    const mail = pickChannel(rows, map, ['mail', 'email', 'e-mail'])
    const linkedIn = pickChannel(rows, map, ['linkedin', 'linked-in'])
    const gitHub = pickChannel(rows, map, ['github', 'git-hub', 'gitub'])

    contact.value = {
      mail: rowToChannel(mail),
      linkedIn: rowToChannel(linkedIn),
      gitHub: rowToChannel(gitHub),
    }
  } catch (e: any) {
    errorContact.value = e?.message ?? 'Error cargando contactos'
  } finally {
    loadingContact.value = false
  }
})
/*****************************************************************************************
 * LIFECYCLE: onUnmounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Aborts any pending fetch operations to prevent memory leaks.
 *
 * DESCRIPCIÓN: Cancela operaciones fetch pendientes para evitar fugas de memoria.
 *****************************************************************************************/
onUnmounted(() => {
  abortCtrl?.abort()
})
</script>

<style scoped lang="scss">
@use '@/styles/colors' as *;
.blogContainer {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.navBar {
  position: sticky;
  top: 0%;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgb(20, 16, 16);
  color: rgb(100, 100, 100);
  padding: 1rem;
  z-index: 1040;
  background: #f8f9fa;
  @media (prefers-color-scheme: dark) {
    background: #f8f9fa;
  }
}
.title {
  width: fit-content;
  font-weight: 800;
}
.subtitle {
  width: 100%;
  text-align: center;
  position: relative;
  top: -0.5rem;
  font-weight: 600;
}
.navbar-nav {
  margin-top: 0.5rem;
}
.nav-link {
  padding: 0.25rem;
}
.portfolioLink {
  background-color: rgb(165, 236, 227);
  background-color: rgb(58, 55, 55);
  border-radius: 0.7rem;
  color: $brilliantBlue;

  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.blogContent {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.nav-link.active {
  font-weight: 600;
  color: rgba(48, 79, 254, 0.8) !important;
  text-shadow: 0 0 2.5px rgba(234, 128, 252, 0.6);
}
.buttonPortafolio {
  color: rgba(234, 128, 252, 1);
  text-shadow: 0rem 0rem 0.2rem rgba(48, 79, 254, 0.2);
}

@media (max-width: 576px) {
  .blogContainer {
    display: flex !important;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }
  .navBar {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }
  .titleContainer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding-right: 3rem;
  }
  .title {
    font-size: 1.12rem;
    margin: 0;
  }
  .subtitle {
    font-size: 0.7rem;
    margin: 0;
    top: 0;
  }
  .navBar .navbar {
    position: static;
    background: transparent;
    box-shadow: none;
  }
  .navBar .navbar-toggler {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    z-index: 1050;
    margin: 0;
    border: none;
  }
  .navBar .navbar-collapse,
  .navBar .collapsing {
    position: absolute;
    top: 100%;
    right: 0;
    width: 44%;
    background: #f8f9faa6;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 1rem;
    z-index: 1040;
  }
  .navBar .collapsing {
    height: auto !important;
    transition: none !important;
    overflow: visible !important;
  }
  .navBar .navbar-collapse {
    transform-origin: top right;
    transition:
      transform 200ms ease,
      opacity 200ms ease;
  }
  .navBar .navbar-collapse:not(.show) {
    transform: scaleY(0);
    opacity: 0;
    pointer-events: none;
  }
  .navBar .navbar-collapse.show {
    transform: scaleY(1);
    opacity: 1;
  }
  .navBar .navbar-collapse .navbar-nav {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .navBar .navbar-collapse .nav-link {
    padding: 0.5rem 0;
  }
}
</style>
