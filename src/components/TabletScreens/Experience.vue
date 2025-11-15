<!-- src/components/Experience.vue -->
<template>
  <div class="container-fluid ExperienceApplication m-0 p-0">
    <div class="containerExperience">
      <!-- Tools -->
      <div class="tools">
        <!-- Logo from app_logos -->
        <img
          class="logoPrinc"
          :src="logoExperience"
          alt="Experience App Logo"
          decoding="async"
          loading="eager"
          @error="onImgError"
        />
        <div class="iconos">
          <i @click="go('Init')" class="bi bi-house-door-fill"></i>
          <i @click="go('Projects')" class="bi bi-folder-fill"></i>
          <i @click="go('Contact')" class="bi bi-chat-quote-fill"></i>
          <i @click="go('About')" class="bi bi-person-fill"></i>
          <a
            v-if="linkedinUrl"
            class="m-0 p-0 text-decoration-none"
            :href="linkedinUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <PillButton class="toolButton" replaceClass="grayPill" text="LinkedIn" />
          </a>
        </div>
      </div>

      <!-- List from BD -->
      <div v-for="exp in uiExperiences" :key="exp.id" class="skillCard">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <!-- Logo empresa -->
          <div class="m-0 p-0">
            <img :src="exp.logoUrl" class="tamanioLogo" alt="Company Logo" @error="onImgError" />
          </div>
          <!-- Títulos -->
          <div class="text-end">
            <p class="text-light m-0 titleSpecificSkill">{{ exp.company }}</p>
            <p class="text-light m-0">{{ exp.role }}</p>
          </div>
        </div>

        <!-- Info -->
        <div class="m-0 p-0">
          <p class="text-light">{{ exp.dateRange }}</p>
          <p class="text-light whiteSpace-text">{{ exp.description }}</p>
          <a
            v-if="exp.companyUrl"
            class="text-anchor"
            target="_blank"
            rel="noopener noreferrer"
            :href="exp.companyUrl"
            >{{ cleanHost(exp.companyUrl) }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PillButton from '@/components/CommonComponents/PillButton.vue'
import { useRedirectStore } from '@/stores/useRedirect'
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useExperiencesStore } from '@/stores/useExperiences'
import { useContactChannelsStore } from '@/stores/useContactChannels'

const redirectStore = useRedirectStore()
const appLogos = useAppLogosStore()
const experiencesStore = useExperiencesStore()
const contactChannels = useContactChannelsStore()
const logoExperience = computed(() => appLogos.getLogo('experience'))
const linkedinUrl = computed(() => contactChannels.getLinkByCode('linkedn'))
const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
const uiExperiences = computed(() =>
  experiencesStore.experiences.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    description: e.description ?? '',
    logoUrl: e.logo_url ?? '',
    companyUrl: ensureUrl(e.company_url ?? ''),
    dateRange: formatRange(e.start_date, e.end_date),
  })),
)
/*****************************************************************************************
 * FUNCTION: formatRange
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Formats a start and end date into a human-readable date range.
 *              - Converts ISO strings into formatted dates.
 *              - Displays "Present" when the end date is null.
 *              - Returns a string in the format "Month Year – Month Year".
 *
 * DESCRIPCIÓN: Da formato a una fecha de inicio y fin en un rango legible.
 *              - Convierte las cadenas ISO en fechas formateadas.
 *              - Muestra "Present" cuando no existe fecha de finalización.
 *              - Devuelve una cadena con el formato "Mes Año – Mes Año".
 *****************************************************************************************/
function formatRange(startISO: string, endISO: string | null) {
  const s = safeDate(startISO)
  const e = endISO ? safeDate(endISO) : null
  const sTxt = s ? fmt.format(s) : startISO
  const eTxt = e ? fmt.format(e) : 'Present'
  return `${sTxt} – ${eTxt}`
}
/*****************************************************************************************
 * FUNCTION: safeDate
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Safely converts a string value into a valid JavaScript Date object.
 *              - Returns `null` if the input is not a valid date.
 *
 * DESCRIPCIÓN: Convierte de forma segura una cadena en un objeto Date válido.
 *              - Devuelve `null` si el valor de entrada no es una fecha válida.
 *****************************************************************************************/
function safeDate(v: string) {
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}
/*****************************************************************************************
 * FUNCTION: ensureUrl
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Ensures that a given string is a valid URL with protocol.
 *              - Adds `https://` if the input lacks an HTTP or HTTPS prefix.
 *              - Returns an empty string for invalid or empty inputs.
 *
 * DESCRIPCIÓN: Garantiza que una cadena sea una URL válida con protocolo.
 *              - Agrega `https://` si la entrada no tiene prefijo HTTP o HTTPS.
 *              - Devuelve una cadena vacía si la entrada es inválida o está vacía.
 *****************************************************************************************/
function ensureUrl(u: string) {
  if (!u) return ''
  return /^https?:\/\//i.test(u) ? u : `https://${u}`
}
/*****************************************************************************************
 * FUNCTION: cleanHost
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Extracts and cleans the host name from a URL string.
 *              - Removes the `www.` prefix for cleaner display.
 *              - Returns the original string if the URL is invalid.
 *
 * DESCRIPCIÓN: Extrae y limpia el nombre del host de una cadena URL.
 *              - Elimina el prefijo `www.` para mostrarlo más limpio.
 *              - Devuelve la cadena original si la URL es inválida.
 *****************************************************************************************/
function cleanHost(u: string) {
  try {
    return new URL(ensureUrl(u)).host.replace(/^www\./, '')
  } catch {
    return u
  }
}
/*****************************************************************************************
 * FUNCTION: onImgError
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles image load failures by replacing the source with a default fallback.
 *              - Removes the error handler to prevent infinite retry loops.
 *              - Uses a generic placeholder image from `/fallbacks/app-default.png`.
 *
 * DESCRIPCIÓN: Maneja errores de carga de imágenes reemplazando la fuente con una por defecto.
 *              - Elimina el manejador de error para evitar bucles infinitos.
 *              - Usa una imagen genérica ubicada en `/fallbacks/app-default.png`.
 *****************************************************************************************/
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation to another tablet screen using the redirect store.
 *              - Redirects only if a valid route key (`to`) is provided.
 *
 * DESCRIPCIÓN: Gestiona la navegación hacia otra pantalla de la tablet usando el store de redirección.
 *              - Redirige solo si se proporciona una clave de ruta (`to`) válida.
 *****************************************************************************************/
function go(to: string) {
  if (to) redirectStore.redirect(to)
}
</script>

<style scoped>
.whiteSpace-text {
  white-space: pre-line;
}
.ExperienceApplication {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  background-color: rgb(238, 235, 235);
  overflow: hidden;
}
.containerExperience {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.9);
  z-index: 999;
  pointer-events: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
.tools {
  width: 80%;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 1.5rem;
}
.iconos {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.bi {
  font-size: 1.5rem;
  color: grey;
}
.bi:hover {
  color: #535353;
}
.logoPrinc {
  width: 6rem;
  height: auto;
  object-fit: contain;
}
.skillCard {
  width: 98%;
  background: rgb(43, 42, 42);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0;
}
.titleSpecificSkill {
  font-size: 1.1rem;
  font-weight: bold;
}
.tamanioLogo {
  width: 7rem;
  height: 100%;
  object-fit: contain;
}
.text-anchor {
  font-size: 0.8rem;
  color: rgb(131, 130, 130);
  text-decoration: none;
}
</style>
