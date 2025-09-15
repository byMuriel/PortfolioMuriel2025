<!-- src/components/Experience.vue -->
<template>
  <div class="container-fluid ExperienceApplication m-0 p-0">
    <div class="containerExperience">
      <!-- Tools Buttons -->
      <div class="tools">
        <img class="logoPrinc" src="@/assets/images/ExperienceLogos/LogoExperience.png" alt="" />
        <div class="iconos">
          <i @click="go('Init')" class="bi bi-house-door-fill"></i>
          <i @click="go('Projects')" class="bi bi-folder-fill"></i>
          <i @click="go('Contact')" class="bi bi-chat-quote-fill"></i>
          <i @click="go('About')" class="bi bi-person-fill"></i>
          <a class="m-0 p-0" href="*" target="_blank" rel="noopener noreferrer">
            <PillButton class="toolButton" replaceClass="grayPill" text="LinkedIn"></PillButton>
          </a>
        </div>
      </div>
      <div v-for="(experience, index) in ExperienceLogo" :key="index" class="skillCard">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <!-- Logo -->
          <div class="m-0 p-0"><img :src="experience.logo" class="tamanioLogo" /></div>
          <!-- Titlles -->
          <div class="text-end">
            <p class="text-light m-0 titleSpecificSkill">{{ experience.name }}</p>
            <p class="text-light m-0">{{ experience.position }}</p>
          </div>
        </div>
        <!-- Info -->
        <div class="m-0 p-0">
          <p class="text-light">{{ experience.initDate }} - {{ experience.finalDate }}</p>
          <p class="text-light whiteSpace-text">{{ experience.functions }}</p>
          <a
            class="text-anchor"
            target="_blank"
            rel="noopener noreferrer"
            :href="experience.link"
            >{{ experience.link }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, type Ref, type ComputedRef } from 'vue'
import PillButton from '@/components/CommonComponents/PillButton.vue'
import { useRedirectStore } from '@/stores/useRedirect'

interface PortfolioData {
  experience: Record<string, ExperienceRaw>
}
interface ExperienceRaw {
  name: string
  position: string
  initDate: string
  finalDate: string
  functions: string
  link: string
  logo: string
  [key: string]: unknown
}
interface ExperienceResolved {
  name: string
  position: string
  initDate: string
  finalDate: string
  functions: string
  link: string
  logo: string
}

const screen: Ref<HTMLDivElement | null> = ref(null)
const data = inject<Ref<PortfolioData>>('data')
if (!data) {
  throw new Error("No se encontró el provider de 'data'")
}
const redirectStore = useRedirectStore()

/*****************************************************************************************
 * CONSTANT: ExperienceContent
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed reference to the experience section from the injected app data.
 *              - Reads `data.value.experience` and exposes it reactively.
 * ***************************************************************************************
 * CONSTANTE: ExperienceContent
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Referencia computada a la sección `experience` de los datos inyectados.
 *              - Lee `data.value.experience` y lo expone de forma reactiva.
 *****************************************************************************************/
const ExperienceContent = computed(() => data.value.experience)
/*****************************************************************************************
 * CONSTANT: rawList
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalized list of raw experience items.
 *              - Converts the experience record into an array for iteration/mapping.
 *              - Falls back to empty object to avoid runtime errors.
 * ***************************************************************************************
 * CONSTANTE: rawList
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Lista normalizada de items crudos de experiencia.
 *              - Convierte el registro de experiencias en arreglo para iterar/mapear.
 *              - Usa objeto vacío por defecto para evitar errores en runtime.
 *****************************************************************************************/
const rawList = computed<ExperienceRaw[]>(() =>
  Object.values(ExperienceContent.value ?? ({} as Record<string, ExperienceRaw>)),
)
/*****************************************************************************************
 * CONSTANT: ExperienceLogo
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: UI-ready experience list with resolved asset paths.
 *              - Maps `rawList` into `ExperienceResolved`.
 *              - Resolves `link`/`logo` via `resolveMaybeAsset` (http(s) or local asset).
 * ***************************************************************************************
 * CONSTANTE: ExperienceLogo
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Lista de experiencias lista para UI con rutas de assets resueltas.
 *              - Mapea `rawList` a `ExperienceResolved`.
 *              - Resuelve `link`/`logo` con `resolveMaybeAsset` (http(s) o asset local).
 *****************************************************************************************/
const ExperienceLogo: ComputedRef<ExperienceResolved[]> = computed(() =>
  rawList.value.map((item) => ({
    name: item.name,
    position: item.position,
    initDate: item.initDate,
    finalDate: item.finalDate,
    functions: item.functions,
    link: resolveMaybeAsset(item.link),
    logo: resolveMaybeAsset(item.logo),
  })),
)
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Navigates to an internal route if `to` is provided; otherwise opens
 *              the external link of the given contact (LinkedIn/GitHub) in a new tab.
 * ***************************************************************************************
 * FUNCIÓN: go
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Navega a una ruta interna si se pasa `to`; de lo contrario abre el
 *              link externo del contacto (LinkedIn/GitHub) en una nueva pestaña.
 *****************************************************************************************/
function go(to: string) {
  if (to !== '') {
    redirectStore.redirect(to)
    return
  }
}
/*****************************************************************************************
 * FUNCTION: resolveMaybeAsset
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns an absolute URL for an asset or leaves http(s) URLs untouched.
 *              - If `path` starts with http(s), returns it as-is.
 *              - Otherwise, resolves relative to the current module (Vite asset pipeline).
 * ***************************************************************************************
 * FUNCIÓN: resolveMaybeAsset
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Devuelve una URL absoluta de un asset o deja intactas URLs http(s).
 *              - Si `path` inicia con http(s), lo retorna tal cual.
 *              - Si no, lo resuelve relativo al módulo actual (pipeline de Vite).
 *****************************************************************************************/
function resolveMaybeAsset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return new URL(path, import.meta.url).href
}
/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Promise that resolves when the component is mounted (DOM ready).
 *              - Useful to coordinate external logic (e.g., Three.js overlay alignment).
 * ***************************************************************************************
 * VARIABLE: domReady
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente está montado (DOM listo).
 *              - Útil para coordinar lógica externa (p. ej., alinear overlays en Three.js).
 *****************************************************************************************/
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(() => resolve())
})
/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Exposes internal refs to the parent component.
 *              - `screen`: root element ref.
 *              - `domReady`: promise to await DOM readiness.
 * ***************************************************************************************
 * LLAMADA DE FUNCIÓN: defineExpose
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Expone refs internas al componente padre.
 *              - `screen`: ref del elemento raíz.
 *              - `domReady`: promesa para esperar el DOM listo.
 *****************************************************************************************/
defineExpose<{
  screen: Ref<HTMLDivElement | null>
  domReady: Promise<void>
}>({
  screen,
  domReady,
})
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
  margin: 0;
  padding: 0;
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
  width: 98%;
  height: fit-content;
  margin: 0;
  padding: 0.2rem;
  background: rgb(43, 42, 42);
  border-radius: 0.5rem;
  transition: border-color 0.2s ease;
  padding: 1rem;
  margin: 0;
}
.skillCard:hover {
  border-color: rgb(48, 47, 47);
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
.tittle {
  font-size: 1.5rem;
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
  justify-content: right;
  align-items: center;
  line-height: 1;
  gap: 0.5rem;
  cursor: pointer;
}
.logoPrinc {
  width: 6rem;
}
.bi {
  font-size: 1.5rem;
  color: grey;
}
.iconos i {
  cursor: pointer;
}
.bi:hover {
  cursor: pointer;
  color: #535353;
}
</style>
