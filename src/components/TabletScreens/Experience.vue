<!-- src/components/Experience.vue -->
<template>
  <div class="container-fluid ExperienceApplication m-0 p-0">
    <div class="containerExperience">
      <!-- Tools -->
      <div class="tools">
        <!-- Logo de la app Experience desde app_logos -->
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
            class="m-0 p-0"
            :href="linkedinUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <PillButton class="toolButton" replaceClass="grayPill" text="LinkedIn" />
          </a>
        </div>
      </div>

      <!-- Lista de experiencias desde BD -->
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
function formatRange(startISO: string, endISO: string | null) {
  const s = safeDate(startISO)
  const e = endISO ? safeDate(endISO) : null
  const sTxt = s ? fmt.format(s) : startISO
  const eTxt = e ? fmt.format(e) : 'Present'
  return `${sTxt} – ${eTxt}`
}
function safeDate(v: string) {
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}
function ensureUrl(u: string) {
  if (!u) return ''
  return /^https?:\/\//i.test(u) ? u : `https://${u}`
}
function cleanHost(u: string) {
  try {
    return new URL(ensureUrl(u)).host.replace(/^www\./, '')
  } catch {
    return u
  }
}
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}

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
