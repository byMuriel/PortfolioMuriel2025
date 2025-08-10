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

      <!-- Párrafos -->
      <!-- <div
        class="aboutCard m-0 p-2"
        v-for="(title, index) in AboutContent.AboutMeTittles"
        :key="index"
      >
        <div class="">
          <h5 class="text-dark m-0 p-0 pb-1">
            {{ title }}
          </h5>
          <p class="about-text" v-if="more">{{ AboutContent.AboutMe[index] }}</p>
          <span class="pill" v-if="!more" @click="ShowHide('show')">See More</span>
        </div>
        <span class="pill" v-if="more" @click="ShowHide('hide')">See Less</span>
      </div> -->
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
/*****************************************************************************************
 * MODULE: About Screen Logic
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: State and actions for the About screen:
 *              - Manages expandable sections (accordion-like).
 *              - Exposes DOM readiness for Three.js projection.
 * ***************************************************************************************
 * MÓDULO: Lógica de la pantalla About
 * AUTORA: Muriel Vitale.
 * DESCRIPCIÓN: Estado y acciones de About:
 *              - Maneja secciones expandibles (tipo acordeón).
 *              - Expone "DOM readiness" para proyección con Three.js.
 *****************************************************************************************/

import { ref, computed, onMounted } from 'vue'
import AboutContent from '@/data/about.json'

const emit = defineEmits(['change-screen'])
const screen = ref(null)
const more = ref(false)
const expanded = ref<boolean[]>([])
const titles = computed(() => Object.values(AboutContent.AboutMeTittles || {}))
const paragraphs = computed(() => Object.values(AboutContent.AboutMe || {}))

/*****************************************************************************************
 * FUNCTION: goBack
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Emits a screen change event to return to the Init screen.
 * ***************************************************************************************
 * DESCRIPCIÓN: Emite el evento para volver a la pantalla Init.
 *****************************************************************************************/
function goBack() {
  emit('change-screen', 'Init')
}

/*****************************************************************************************
 * FUNCTION: setMore
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Sets the "more" flag to show or hide extra content.
 *              - Accepts a boolean value.
 * ***************************************************************************************
 * DESCRIPCIÓN: Ajusta la bandera "more" para mostrar u ocultar contenido extra.
 *              - Recibe un booleano.
 *****************************************************************************************/
function setMore(value: boolean) {
  more.value = !!value
}

/*****************************************************************************************
 * FUNCTION: showSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Expands a specific section by index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Expande una sección específica por índice.
 *****************************************************************************************/
function showSection(i: number) {
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
function hideSection(i: number) {
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
function toggleSection(i: number) {
  if (i < 0 || i >= expanded.value.length) return
  expanded.value[i] = !expanded.value[i]
}

/** DOM readiness expuesto al padre (Three.js) */
const domReady = new Promise<void>((resolve) => {
  onMounted(() => resolve())
})

onMounted(() => {
  // Inicializa el acordeón con todas cerradas excepto la primera
  expanded.value = Array(titles.value.length).fill(false)
  if (expanded.value.length > 0) expanded.value[0] = true
})

defineExpose({
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
