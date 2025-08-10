<!-- src/components/Experience.vue -->
<template>
  <div class="container-fluid ExperienceApplication m-0 p-0">
    <div class="containerExperience">
      <div v-for="(experience, index) in ExperienceLogo" :key="index" class="mt-5 mb-3 skillCard">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <div class="me-2"><img :src="experience.logo" class="tamanioLogo" /></div>
          <div class="text-end">
            <p class="text-light m-0 titleSpecificSkill">{{ experience.name }}</p>
            <p class="text-light m-0">{{ experience.position }}</p>
          </div>
        </div>
        <p class="text-light">{{ experience.initDate }} - {{ experience.finalDate }}</p>
        <p class="text-light whiteSpace-text">{{ experience.functions }}</p>
        <a class="text-anchor" target="_blank" rel="noopener noreferrer" :href="experience.link">{{
          experience.link
        }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*****************************************************************************************
 * MODULE: Experience Screen Logic
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Loads experience items from JSON, resolves asset URLs for logos,
 *              and exposes DOM readiness for projection with Three.js.
 * ***************************************************************************************
 * MÓDULO: Lógica de la pantalla Experience
 * AUTORA: Muriel Vitale.
 * DESCRIPCIÓN: Carga items desde el JSON, resuelve URLs de logos,
 *              y expone el DOM listo para proyección con Three.js.
 *****************************************************************************************/

import { ref, computed, onMounted } from 'vue'
import ExperienceContent from '@/data/experience.json'

/** ===================== Tipos ===================== */
interface ExperienceRaw {
  name: string
  position: string
  initDate: string
  finalDate: string
  functions: string
  link: string // puede ser http(s) o ruta a asset
  logo: string // ruta a asset (png/svg/jpg)
  [key: string]: unknown
}

interface ExperienceResolved {
  name: string
  position: string
  initDate: string
  finalDate: string
  functions: string
  link: string // url final (http o asset resuelto)
  logo: string // url final de logo (asset resuelto)
}

/** ===================== Utils ===================== */
/*****************************************************************************************
 * FUNCTION: resolveMaybeAsset
 * DESCRIPTION: If `path` is an http(s) URL, returns it as-is. Otherwise resolves it
 *              relative to the project assets using import.meta.url.
 * DESCRIPCIÓN: Si `path` es http(s), lo devuelve tal cual. Si no, lo resuelve como asset.
 *****************************************************************************************/
function resolveMaybeAsset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return new URL(path, import.meta.url).href
}

/** ===================== Datos ===================== */
// JSON → arreglo tipado
const rawList: ExperienceRaw[] = Object.values(ExperienceContent as Record<string, ExperienceRaw>)

/** Items resueltos (logo y link con URL final) */
const ExperienceLogo = computed<ExperienceResolved[]>(() =>
  rawList.map((item) => ({
    name: item.name,
    position: item.position,
    initDate: item.initDate,
    finalDate: item.finalDate,
    functions: item.functions,
    link: resolveMaybeAsset(item.link),
    logo: resolveMaybeAsset(item.logo),
  })),
)

/** ===================== Emits ===================== */
const emit = defineEmits<{
  (e: 'change-screen', to: 'Init' | string): void
}>()

/*****************************************************************************************
 * FUNCTION: goBack
 * DESCRIPTION: Emits a screen change event to return to the Init screen.
 * DESCRIPCIÓN: Emite el evento para volver a la pantalla Init.
 *****************************************************************************************/
function goBack(): void {
  emit('change-screen', 'Init')
}

/** ===================== Expuestos al padre (Three.js) ===================== */
const screen = ref<HTMLElement | null>(null)
const domReady: Promise<void> = new Promise((resolve) => {
  onMounted(() => resolve())
})

defineExpose({ screen, domReady })
</script>

<style scoped>
.whiteSpace-text {
  white-space: pre-line;
}
.ExperienceApplication {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  /* background-color: rgb(71, 70, 70); */
  background-color: rgb(165, 163, 163);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow: auto;
}
.containerExperience {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  overflow: auto;
}
.tittle {
  font-size: 1.5rem;
}
.skillCard {
  width: 95%;
  margin: 0;
  padding: 0.75rem;
  background: rgb(43, 42, 42);
  border-radius: 0.75rem;
  border: 1px solid transparent;
  transition: border-color 0.2s ease;
  padding-left: 2rem;
  padding-right: 3rem;
}
.skillCard:hover {
  border-color: rgb(48, 47, 47);
}
.titleSpecificSkill {
  font-size: 1.1rem;
  font-weight: bold;
}
.tamanioLogo {
  width: 12rem;
  height: 100%;
  object-fit: contain;
}
.text-anchor {
  font-size: 0.8rem;
  color: rgb(131, 130, 130);
  text-decoration: none;
}
.tittle {
  font-size: 1.5rem;
}
</style>
