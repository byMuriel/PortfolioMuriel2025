<!-- src/components/Projects.vue -->
<template>
  <div class="container-fluid ProjectsApplication m-0 p-0 mt-5 pt-3">
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
import { inject, ref, computed, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'
const data = inject('data')
const rawProjects = computed(() => data.value.projects)

type ImageField = string[] | Record<string, string> | undefined

interface Project {
  image?: ImageField
  logo?: string | null
  name?: string
  description?: string
  link?: string
  githubRep?: string
  [key: string]: unknown
}
const defaultProject: Project = {
  name: '',
  description: '',
  link: '#',
  githubRep: '#',
  image: [],
  logo: null,
}

/*****************************************************************************************
 * CONSTANT: AUTO_SLIDE_MS
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Interval (ms) for the auto-slide of project images.
 * ***************************************************************************************
 * DESCRIPCIÓN: Intervalo (ms) para el auto-desplazamiento de imágenes del proyecto.
 *****************************************************************************************/
const AUTO_SLIDE_MS: number = 4000

/*****************************************************************************************
 * VARIABLE: intervalId
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Holds the setInterval id for the auto-slide; null when stopped.
 * ***************************************************************************************
 * DESCRIPCIÓN: Guarda el id de setInterval del auto-slide; null cuando está detenido.
 *****************************************************************************************/
let intervalId: ReturnType<typeof setInterval> | null = null

/*****************************************************************************************
 * VARIABLE: projects
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalized list of projects loaded from JSON (object → array).
 * ***************************************************************************************
 * DESCRIPCIÓN: Lista normalizada de proyectos cargada desde el JSON (objeto → arreglo).
 *****************************************************************************************/
const projects: ComputedRef<Project[]> = computed(() => {
  const raw = rawProjects.value ?? {}
  return Object.values(raw).filter((p): p is Project => !!p) // filtra undefined
})

/*****************************************************************************************
 * STATE: currentProjectIndex / currentImageIndex
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive indices for the selected project and its current image.
 * ***************************************************************************************
 * DESCRIPCIÓN: Índices reactivos del proyecto seleccionado y su imagen actual.
 *****************************************************************************************/
const currentProjectIndex: Ref<number> = ref(0)
const currentImageIndex: Ref<number> = ref(0)

/*****************************************************************************************
 * COMPUTED: currentProject
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the active project (with a safe default if list is empty).
 * ***************************************************************************************
 * DESCRIPCIÓN: Retorna el proyecto activo (con un fallback seguro si la lista está vacía).
 *****************************************************************************************/
const currentProject = computed(() => projects.value[currentProjectIndex.value] ?? defaultProject)

/*****************************************************************************************
 * COMPUTED: images
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalizes the project's `image` field into a string array (array or dict).
 * ***************************************************************************************
 * DESCRIPCIÓN: Normaliza el campo `image` del proyecto a un arreglo de strings (array o objeto).
 *****************************************************************************************/
const images = computed(() => {
  const imgs = currentProject.value?.image
  return Array.isArray(imgs) ? imgs : imgs ? Object.values(imgs) : []
})

/*****************************************************************************************
 * COMPUTED: currentImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Current image URL for the active project, based on `currentImageIndex`.
 * ***************************************************************************************
 * DESCRIPCIÓN: URL de la imagen actual del proyecto activo, según `currentImageIndex`.
 *****************************************************************************************/
const currentImage = computed(() => images.value[currentImageIndex.value])

/*****************************************************************************************
 * COMPUTED: otherProjects
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: List of projects excluding the active one, preserving original index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Lista de proyectos excluyendo el activo, preservando el índice original.
 *****************************************************************************************/
const otherProjects: ComputedRef<(Project & { originalIndex: number })[]> = computed(() =>
  projects.value
    .map((project, originalIndex) => ({ ...(project as Project), originalIndex }))
    .filter((_, i) => i !== currentProjectIndex.value),
)

/*****************************************************************************************
 * TYPES: ProjectBase / ProjectWithLogo
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Helper types to represent projects with a resolved `logo` URL (or null).
 * ***************************************************************************************
 * DESCRIPCIÓN: Tipos de ayuda para representar proyectos con `logo` resuelto (o null).
 *****************************************************************************************/
type ProjectBase = Omit<Project, 'logo'>
type ProjectWithLogo = ProjectBase & { logo: string | null }

/*****************************************************************************************
 * COMPUTED: projectLogos
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Projects with `logo` converted to an absolute asset URL (or null if missing).
 * ***************************************************************************************
 * DESCRIPCIÓN: Proyectos con `logo` convertido a URL absoluta de asset (o null si no existe).
 *****************************************************************************************/
const projectLogos: ComputedRef<ProjectWithLogo[]> = computed(() =>
  projects.value.map((p) => {
    // ❌ Aquí necesitas .value
    const { logo: rawLogo, ...rest } = p
    const resolved: string | null = rawLogo ? new URL(rawLogo, import.meta.url).href : null
    return { ...(rest as ProjectBase), logo: resolved }
  }),
)

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

/*****************************************************************************************
 * VARIABLE: screen
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive DOM reference for the projects screen container.
 * ***************************************************************************************
 * DESCRIPCIÓN: Referencia reactiva al contenedor DOM de la pantalla de proyectos.
 *****************************************************************************************/
const screen = ref<HTMLElement | null>(null)

/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Resolves after mount to coordinate with parent (e.g., overlays).
 * ***************************************************************************************
 * DESCRIPCIÓN: Se resuelve tras el montaje para coordinar con el padre (p. ej., overlays).
 *****************************************************************************************/
const domReady: Promise<void> = new Promise((resolve) => {
  onMounted(() => {
    resolve()
  })
})

/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Exposes `screen` and `domReady` to the parent component.
 * ***************************************************************************************
 * DESCRIPCIÓN: Expone `screen` y `domReady` al componente padre.
 *****************************************************************************************/
defineExpose({ screen, domReady })

/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Starts the auto-slide timer when the component mounts.
 * ***************************************************************************************
 * DESCRIPCIÓN: Inicia el temporizador de auto-desplazamiento al montar el componente.
 *****************************************************************************************/
onMounted(() => {
  startAutoSlide()
  // console.log('rawProjects', rawProjects.value)
  // console.log('projects', projects.value)
  // console.log('currentProject', currentProject.value)
  // console.log('currentImage', currentImage.value)
})

/*****************************************************************************************
 * LIFECYCLE HOOK: onBeforeUnmount
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Stops and clears the auto-slide timer before component teardown.
 * ***************************************************************************************
 * DESCRIPCIÓN: Detiene y limpia el temporizador de auto-desplazamiento antes de destruir.
 *****************************************************************************************/
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
