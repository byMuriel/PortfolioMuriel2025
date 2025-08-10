<!-- src/components/Projects.vue -->
<template>
  <div class="container-fluid ProjectsApplication m-0 p-0">
    <!-- CurrentProject -->
    <transition name="fade" mode="out-in">
      <img
        :key="currentImage"
        :src="currentImage"
        alt="Project image"
        class="img-fluid principalImg"
      />
    </transition>
    <div class="containerPrinc p-1">
      <div class="m-0 text-color">
        <h5 class="m-0 p-0 mb-1 fw-bold">{{ currentProject.name }}</h5>
        <p class="whiteSpace-text fs-7 m-0 p-0">{{ currentProject.description }}</p>
        <a
          class="text-anchor m-0 p-0"
          target="_blank"
          rel="noopener noreferrer"
          :href="currentProject.link"
          ><span class="fw-bold text-light">Visit</span> {{ currentProject.link }}</a
        >
        <br />
        <a
          class="text-anchor m-0 p-0 fw-bold"
          target="_blank"
          rel="noopener noreferrer"
          :href="currentProject.githubRep"
          ><span class="fw-bold text-light">GitHub</span> Repository</a
        >
      </div>
    </div>

    <!-- OtherProjects -->
    <div
      v-for="(rawProjects, index) in otherProjects"
      :key="index"
      class="containerSec d-flex mb-2"
    >
      <div class="container-fluid d-flex justify-content-between m-0 p-0">
        <img
          v-if="firstImageOf(rawProjects)"
          :src="firstImageOf(rawProjects)"
          alt="Project image"
          class="secondImg selectHover m-0 p-0"
          @click="replacePrincipal(rawProjects.originalIndex)"
        />
        <div class="secondText p-2">
          <h6
            class="m-0 p-0 fw-bold selectHover"
            @click="replacePrincipal(rawProjects.originalIndex)"
          >
            {{ rawProjects.name }}
          </h6>
          <br />
          <a
            class="text-anchor m-0 p-0"
            target="_blank"
            rel="noopener noreferrer"
            :href="rawProjects.link"
            ><span class="fw-bold text-light">Visit </span> {{ rawProjects.link }}</a
          >
          <br />
          <a
            class="text-anchor m-0 p-0 fw-bold"
            target="_blank"
            rel="noopener noreferrer"
            :href="rawProjects.githubRep"
            ><span class="fw-bold text-light">GitHub</span> Repository</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*****************************************************************************************
 * MODULE: Projects Screen Logic
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: State, computed properties, and controls for the Projects screen.
 *              - Handles current project and image carousel.
 *              - Exposes DOM readiness for Three.js projection.
 * ***************************************************************************************
 * MÓDULO: Lógica de la pantalla de Proyectos
 * AUTORA: Muriel Vitale.
 * DESCRIPCIÓN: Estado, computados y controles para la pantalla de Proyectos.
 *              - Maneja proyecto actual y carrusel de imágenes.
 *              - Expone "DOM readiness" para proyección en Three.js.
 *****************************************************************************************/

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import rawProjects from '@/data/projects.json'

interface Project {
  image: string[] | Record<string, string>
  logo?: string
  name?: string
  description?: string
  link?: string
  githubRep?: string
  [key: string]: unknown
}
const AUTO_SLIDE_MS = 4000
let intervalId: ReturnType<typeof setInterval> | null = null
const projects: Project[] = Object.values(rawProjects as Record<string, Project>)

const currentProjectIndex = ref<number>(0)
const currentImageIndex = ref<number>(0)
const currentProject = computed<Project>(() => {
  return projects[currentProjectIndex.value] ?? (projects[0] as Project)
})

const images = computed<string[]>(() => {
  const imgs = currentProject.value?.image
  if (Array.isArray(imgs)) return imgs
  return imgs ? Object.values(imgs) : []
})

const currentImage = computed<string | undefined>(() => images.value[currentImageIndex.value])
const otherProjects = computed<(Project & { originalIndex: number })[]>(() =>
  projects
    .map((project, originalIndex) => ({ ...(project as Project), originalIndex }))
    .filter((_, i) => i !== currentProjectIndex.value),
)

type ProjectBase = Omit<Project, 'logo'>
type ProjectWithLogo = ProjectBase & { logo: string | null }

const projectLogos = computed<ProjectWithLogo[]>(() => {
  return projects.map((p) => {
    const { logo: rawLogo, ...rest } = p
    const resolved: string | null = rawLogo ? new URL(rawLogo, import.meta.url).href : null
    return { ...rest, logo: resolved }
  })
})

const emit = defineEmits<{
  (e: 'change-screen', to: 'Init' | string): void
}>()

/*****************************************************************************************
 * FUNCTION: firstImageOf
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the first image URL of a project, handling array or object shapes.
 * ***************************************************************************************
 * DESCRIPCIÓN: Devuelve la primera URL de imagen de un proyecto, sea array u objeto.
 *****************************************************************************************/
function firstImageOf(p: Project): string | undefined {
  const img = p.image
  if (!img) return undefined
  return Array.isArray(img) ? img[0] : Object.values(img)[0]
}

/*****************************************************************************************
 * FUNCTION: replacePrincipal
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Switches the main project being displayed and resets the image index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Cambia el proyecto principal mostrado y reinicia el índice de imagen.
 *****************************************************************************************/
function replacePrincipal(index: number): void {
  if (index < 0 || index >= projects.length) return
  currentImageIndex.value = 0
  currentProjectIndex.value = index
}

/*****************************************************************************************
 * FUNCTION: nextImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Advances the carousel to the next image, looping at the end.
 * ***************************************************************************************
 * DESCRIPCIÓN: Avanza el carrusel a la siguiente imagen con loop al final.
 *****************************************************************************************/
function nextImage(): void {
  const total = images.value.length
  if (!total) return
  currentImageIndex.value = (currentImageIndex.value + 1) % total
}

/*****************************************************************************************
 * FUNCTION: goBack
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Emits a screen change event to return to the Init screen.
 * ***************************************************************************************
 * DESCRIPCIÓN: Emite el evento de cambio de pantalla para volver a Init.
 *****************************************************************************************/
function goBack(): void {
  emit('change-screen', 'Init')
}

/*****************************************************************************************
 * FUNCTION: startAutoSlide
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Starts the image auto-slide interval if not already running.
 * ***************************************************************************************
 * DESCRIPCIÓN: Inicia el intervalo de auto-desplazamiento de imágenes si no está activo.
 *****************************************************************************************/
function startAutoSlide(): void {
  if (intervalId) return
  intervalId = setInterval(nextImage, AUTO_SLIDE_MS)
}

/*****************************************************************************************
 * FUNCTION: stopAutoSlide
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Stops and clears the image auto-slide interval.
 * ***************************************************************************************
 * DESCRIPCIÓN: Detiene y limpia el intervalo de auto-desplazamiento de imágenes.
 *****************************************************************************************/
function stopAutoSlide(): void {
  if (!intervalId) return
  clearInterval(intervalId)
  intervalId = null
}

const screen = ref<HTMLElement | null>(null)

const domReady: Promise<void> = new Promise((resolve) => {
  onMounted(() => {
    resolve()
  })
})

defineExpose({ screen, domReady })

onMounted(() => {
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.whiteSpace-text {
  white-space: pre-line;
}
.ProjectsApplication {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  background-color: rgb(71, 70, 70);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow: auto;
}
.containerPrinc {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
  background-color: rgb(51, 50, 50);
}
.principalImg {
  height: 12rem;
  width: 100%;
  object-fit: cover;
}
.containerSec {
  width: 100%;
  height: 19%;
  margin: 0;
  padding: 0;
  background: rgb(43, 42, 42);
  position: relative;
}
.containerSec:hover {
  border: 1px solid rgb(48, 47, 47);
}
.selectHover {
  cursor: pointer;
}
.secondImg {
  height: 100%;
  width: 13rem;
  object-fit: cover;
  border-radius: 0.5rem;
}
.secondText {
  width: 100%;
}
.text-color {
  color: rgba(255, 255, 255, 0.856);
  font-family:
    'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; /*'Trebuchet MS', sans-serif;*/
}
.text-anchor {
  font-size: 0.8rem;
  color: rgb(131, 130, 130);
  text-decoration: none;
}
.fs-7 {
  font-size: 0.8rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0.2;
}
</style>
