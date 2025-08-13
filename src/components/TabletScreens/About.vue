<!-- src/components/About.vue -->
<template>
  <div class="container-fluid aboutApplication aboutShadow m-0 p-0">
    <div class="containerAbout mt-5 mb-5">
      <!-- Head -->
      <div class="aboutHero">
        <img class="fondoAbout" src="/src/assets/images/AboutMe/fondo.jpg" alt="" />
        <img class="murielImg" src="/src/assets/images/AboutMe/muriel.png" alt="" />
        <h1 class="name m-0 p-0">
          {{ AboutContent.intro }} <span class="font07rem">(She/Her)</span>
        </h1>
        <img
          class="verificationImg m-0 p-0"
          src="/src/assets/images/AboutMe/verification.png"
          alt=""
        />
        <div class="decoratorPlus text-center align-content-center m-0 p-0">
          <p class="plus">+</p>
        </div>
        <div class="initialData">
          <p class="text-dark m-0 p-0 font07rem">{{ AboutContent.Experience }}</p>
          <p class="m-0 p-0 font07rem" :style="{ color: '#969393' }">
            {{ AboutContent.Ubication }}
          </p>
        </div>
        <div class="tags m-0 p-0">
          <p class="text-dark m-0 ps-3 pe-3">
            {{ AboutContent.Position }}
            <span v-for="(skill, index) in AboutContent.Skills">{{ skill }}</span>
          </p>
        </div>
      </div>
      <div class="aboutCard m-0 p-2" v-for="(title, index) in titles" :key="index">
        <div>
          <h5 class="text-dark m-0 p-0 pb-1">{{ title }}</h5>

          <p class="about-text" v-if="expanded[index]">
            {{ paragraphs[index] }}
          </p>

          <span class="pill" v-if="!expanded[index]" @click="showSection(index)">See More</span>
        </div>

        <span class="pill" v-if="expanded[index]" @click="hideSection(index)">See Less</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref, type ComputedRef } from 'vue'
import aboutData from '@/data/about.json'

type StringDict = Record<string, string>
type MaybeList = string[] | StringDict | undefined

interface AboutContentShape {
  intro: string
  Experience: string
  Ubication: string
  Position: string
  Skills: string[]
  AboutMeTittles?: MaybeList
  AboutMe?: MaybeList
}

const AboutContent = aboutData as AboutContentShape

const screen = ref<HTMLDivElement | null>(null)
const more = ref<boolean>(false)
const expanded = ref<boolean[]>([])
const toArray = (v: MaybeList): string[] => (Array.isArray(v) ? v : v ? Object.values(v) : [])
const titles: ComputedRef<string[]> = computed(() => toArray(AboutContent.AboutMeTittles))
const paragraphs: ComputedRef<string[]> = computed(() => toArray(AboutContent.AboutMe))

/*****************************************************************************************
 * FUNCTION: setMore
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Sets the "more" flag to show or hide extra content.
 *              - Accepts a boolean value.
 * ***************************************************************************************
 * DESCRIPCIÓN: Ajusta la bandera "more" para mostrar u ocultar contenido extra.
 *              - Recibe un booleano.
 *****************************************************************************************/
function setMore(value: boolean): void {
  more.value = !!value
}

/*****************************************************************************************
 * FUNCTION: showSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Expands a specific section by index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Expande una sección específica por índice.
 *****************************************************************************************/
function showSection(i: number): void {
  if (i < 0 || i >= expanded.value.length) return
  expanded.value[i] = true
}

/*****************************************************************************************
 * FUNCTION: hideSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Collapses a specific section by index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Colapsa una sección específica por índice.
 *****************************************************************************************/
function hideSection(i: number): void {
  if (i < 0 || i >= expanded.value.length) return
  expanded.value[i] = false
}

/*****************************************************************************************
 * FUNCTION: toggleSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Toggles a specific section by index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Alterna (abre/cierra) una sección por índice.
 *****************************************************************************************/
function toggleSection(i: number): void {
  if (i < 0 || i >= expanded.value.length) return
  expanded.value[i] = !expanded.value[i]
}

/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Promise that resolves once the component is mounted (DOM ready).
 *              - Useful to sync external logic (e.g., Three.js overlays) after mount.
 * ***************************************************************************************
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente se monta (DOM listo).
 *              - Útil para sincronizar lógica externa (p. ej., overlays de Three.js) tras el mount.
 *****************************************************************************************/
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(() => resolve())
})

/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes the accordion state right after the component is mounted.
 *              - Builds a boolean array with the same length as `titles`, all set to false.
 *              - Opens the first section by setting index 0 to true when available.
 * ***************************************************************************************
 * DESCRIPCIÓN: Inicializa el estado del acordeón justo después de montar el componente.
 *              - Crea un arreglo de booleanos con la longitud de `titles`, todos en false.
 *              - Abre la primera sección poniendo el índice 0 en true si existe.
 *****************************************************************************************/
onMounted(() => {
  expanded.value = Array(titles.value.length).fill(false)
  if (expanded.value.length > 0) expanded.value[0] = true
})

/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Exposes internal reactive references to the parent component.
 *              - `screen`: HTMLDivElement ref used as the tablet screen container.
 *              - `domReady`: Promise resolved when the component is mounted.
 * ***************************************************************************************
 * DESCRIPCIÓN: Expone referencias reactivas internas al componente padre.
 *              - `screen`: referencia a HTMLDivElement usada como contenedor de la pantalla.
 *              - `domReady`: Promesa que se resuelve al montar el componente.
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
.aboutApplication {
  position: relative;
  pointer-events: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  background-color: rgb(238, 235, 235);
  overflow: hidden;
}
.aboutApplication::before {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.9);
  z-index: 999;
  pointer-events: none;
}
.containerAbout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.aboutHero {
  width: 95%;
  height: 19rem;
  background-color: rgb(255, 255, 255);
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
}
.fondoAbout {
  width: 100%;
  height: 8rem;
  z-index: 2;
}
.murielImg {
  width: 10rem;
  height: 10rem;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  justify-self: start;

  position: relative;
  top: -6rem;
}
.decoratorPlus {
  position: relative;
  top: -12rem;
  left: 7.5rem;
  width: 2.2rem;
  height: 2.2rem;
  background-color: rgb(64, 122, 231);
  margin: 0;
  padding: 0;
  border-radius: 50%;
  border: 0.28rem solid white;
}
.plus {
  position: relative;
  margin: 0;
  padding: 0;
  top: -0.25rem;
  font-size: 1.5rem;
}
.name {
  position: relative;
  left: 11rem;
  top: -9.5rem;
  color: black;
  font-size: 1.4rem;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
}
.verificationImg {
  position: relative;
  top: -11.1rem;
  left: 22.5rem;
  width: 1.3rem;
  height: 1.3rem;
}
.initialData {
  position: relative;
  top: -13rem;
  left: 11rem;
}
.tags {
  position: relative;
  top: -12rem;
}
.font07rem {
  font-size: 0.7rem;
}
.pill {
  border: 0.1rem solid rgb(64, 122, 231);
  border-radius: 5rem;
  color: rgb(64, 122, 231);
  width: fit-content;
  height: fit-content;
  margin: 0;
  padding: 0.3rem 1.5rem;
  font-size: 0.8rem;
  position: relative;
  left: 17rem;
}
.pill:hover {
  background: rgba(64, 122, 231, 0.1);
  cursor: pointer;
}
.aboutCard {
  width: 95%;
  background-color: rgb(255, 255, 255);
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
}
.about-text {
  white-space: pre-line;
  font-size: 1rem;
  color: rgba(39, 39, 39, 0.86);
  font-family: Arial, sans-serif;
}
</style>
