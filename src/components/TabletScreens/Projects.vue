<!-- src/components/Projects.vue -->
<template>
  <div class="container-fluid ProjectsApplication m-0 p-0" ref="currentProjectContainer">
    <div class="tools-container">
      <img class="logoPrinc" src="@/assets/images/Projects/Logos/youMuriel.png" alt="" />
      <div class="tools">
        <span
          @click="go('Init')"
          class="toolButton iconContainer d-flex justify-content-center align-items-center"
        >
          <i class="bi bi-house-door-fill" style="font-size: 1.5rem; color: grey"></i>
        </span>
        <span
          class="toolButton iconContainer d-flex justify-content-center align-items-center"
          @click="go('About')"
          ><i class="bi bi-person" style="font-size: 1.5rem; color: grey"></i
        ></span>
        <span
          class="toolButton iconContainer d-flex justify-content-center align-items-center"
          @click="go('Contact')"
          ><i class="bi bi-messenger" style="font-size: 1.5rem; color: grey"></i
        ></span>
        <!-- <span class="toolButton iconContainer d-flex justify-content-center align-items-center"
          ><i class="bi bi-music-note-beamed" style="font-size: 1.5rem; color: grey"></i
        ></span> -->
      </div>
    </div>
    <!-- CurrentProject -->
    <transition name="fade" mode="out-in">
      <img
        :key="currentImage"
        :src="currentImage"
        alt="Project image"
        class="img-fluid principalImg"
      />
    </transition>
    <div class="containerPrinc mb-3">
      <div class="m-0 text-color">
        <!-- Description CurrentProject -->
        <div class="m-o p-0">
          <h5 class="m-0 p-0 mb-1 fw-bold">{{ currentProject.name }}</h5>
          <p class="whiteSpace-text fs-7 m-0 p-0">{{ currentProject.description }}</p>
          <a
            class="text-anchor m-0 p-0"
            target="_blank"
            rel="noopener noreferrer"
            :href="
              currentProject.link?.startsWith('http')
                ? currentProject.link
                : 'https://' + (currentProject.link ?? '')
            "
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

        <!-- Pill Action Buttons -->
        <div class="mt-2 mb-2 d-flex gap-1">
          <span>
            <PillText
              :text="likes + 'K &nbsp;&nbsp;|&nbsp;&nbsp;'"
              :indexProject="currentProjectIndex"
              type="likeDislike"
              @thumbsChange="handleThumbs"
          /></span>
          <span @click="toogleTech()"><PillText text="Tech Used" type="seeTech" /></span>
          <span> <PillText text="Skills" type="skills" /></span>
        </div>

        <!-- Tech Used Info -->
        <div class="techContainer" ref="techContainer">
          <p class="text-light m-0">
            Tech Used &nbsp <span :style="{ color: 'grey' }">({{ techList.length }})</span> &nbsp<i
              v-if="!showTechInfo"
              class="bi bi-caret-down-fill desplegable"
              @click="toogleTech()"
            ></i>
          </p>

          <div v-if="showTechInfo" class="mt-3">
            <div class="tech-item" v-for="([name, desc], index) in techList" :key="index">
              <span
                :style="{ backgroundColor: getColor(name), color: getColorText(name) }"
                class="iconoSkill"
              >
                {{ name[0] }}
              </span>
              <span>
                <strong>{{ name }}</strong
                >: {{ desc }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- OtherProjects -->
    <div
      v-for="(rawProjects, index) in otherProjects"
      :key="index"
      class="containerSec d-flex mb-3"
    >
      <div class="container-fluid d-flex justify-content-between m-0 p-0">
        <!-- ImagProject -->
        <img
          v-if="firstImageOf(rawProjects)"
          :src="firstImageOf(rawProjects)"
          alt="Project image"
          class="secondImg selectHover m-0 p-0"
          @click="replacePrincipal(rawProjects.originalIndex, true)"
        />
        <!-- TextProject -->
        <div class="secondText p-2">
          <h6
            class="m-0 p-0 fw-bold selectHover"
            @click="replacePrincipal(rawProjects.originalIndex, true)"
          >
            {{ rawProjects.name }}
          </h6>
          <div>
            <p class="m-0 p-0">
              <a
                class="text-anchor m-0 p-0"
                target="_blank"
                rel="noopener noreferrer"
                :href="
                  rawProjects.link?.startsWith('http')
                    ? rawProjects.link
                    : 'https://' + (rawProjects.link ?? '')
                "
              >
                <span class="fw-bold text-light">Visit </span> {{ rawProjects.link }}
              </a>
            </p>

            <p class="m-0 p-0">
              <a
                class="text-anchor m-0 p-0 fw-bold"
                target="_blank"
                rel="noopener noreferrer"
                :href="rawProjects.githubRep"
                ><span class="fw-bold text-light">GitHub</span> Repository</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'
import { nextTick } from 'vue'
import PillText from '@/components/CommonComponents/PillText.vue'
import colorSkill from '@/data/colorSkill.json'
import { useRedirectStore } from '@/stores/useRedirect'
import { useStateLikeDislikeProjects } from '@/stores/useStateLikeDislikeProjects'
const data = inject<Ref<{ projects: Record<string, Project> }>>('data')
if (!data) throw new Error('No se proporcionó "data" via provide().')

const rawProjects = computed<Record<string, Project>>(() => data.value.projects ?? {})
const redirectStore = useRedirectStore()
type ImageField = string[] | Record<string, string> | undefined
const currentProjectContainer = ref<HTMLDivElement | null>(null)
const techContainer = ref<HTMLDivElement | null>(null)
const stateLikeDislikeStore = useStateLikeDislikeProjects()

interface Project {
  image?: ImageField
  logo?: string | null
  name?: string
  description?: string
  link?: string
  githubRep?: string
  tech?: Record<string, string> | string[] | undefined
  likes?: number
  unlikes?: number
  [key: string]: unknown
}
const defaultProject: Project = {
  name: '',
  description: '',
  link: '#',
  githubRep: '#',
  image: [],
  logo: null,
  likes: 0,
  unlikes: 0,
}
const showTechInfo: Ref<boolean> = ref(false)
const like: Ref<boolean> = ref(false)
const likesObject: Ref<Record<string, number>> = ref({})
const techList = computed(() => {
  const tech = currentProject.value?.tech
  if (!tech) return []
  return Object.entries(tech)
})
function toogleTech() {
  showTechInfo.value = !showTechInfo.value
  if (showTechInfo.value === true && techContainer.value != null) {
    techContainer.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    techContainer.value.focus()
  }
}
function getColor(name: string): string {
  return (colorSkill as Record<string, string>)[name] || 'grey'
}
function getColorText(name: string): string {
  if (name === 'JavaScript') {
    return 'black'
  } else {
    return 'white'
  }
}
function scrollToTop(smooth: boolean = true) {
  const el = currentProjectContainer.value
  if (!el) return
  if (typeof el.scrollTo === 'function') {
    el.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
  } else {
    el.scrollTop = 0
  }
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation from the About component to another screen.
 * ***************************************************************************************
 * FUNCIÓN: go
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Gestiona la navegación desde el componente About hacia otra pantalla.
 *****************************************************************************************/
function go(to: string) {
  redirectStore.redirect(to)
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
const likes = computed(() => projects.value[currentProjectIndex.value].likes)
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
async function replacePrincipal(index: number, fromClick: boolean = true): Promise<void> {
  if (index < 0 || index >= projects.value.length) return
  currentImageIndex.value = 0
  currentProjectIndex.value = index
  await nextTick()
  if (fromClick) scrollToTop(true)
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
function handleThumbs(value: number) {
  // if (value === 0) console.log('Nada seleccionado')
  // if (value === 1) console.log('👍 Like')
  // if (value === 2) console.log('👎 Dislike')
  const i = currentProjectIndex.value
  stateLikeDislikeStore.setVote(i, value)
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
  likesObject.value = Object.keys(rawProjects.value ?? {}).reduce<Record<string, number>>(
    (acc, key) => {
      acc[key] = 0
      return acc
    },
    {},
  )
  // Inicializar store con ese objeto
  stateLikeDislikeStore.initVotes(likesObject.value)
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
.ProjectsApplication {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  justify-content: start;
  align-items: center;
  font-family:
    'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; /*sans-serif;*/
  background-color: rgb(20, 20, 20);

  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow-y: auto;
  position: relative;
}
/* .ProjectsApplication::before {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.9);
  z-index: 999;
  pointer-events: none;
} */
.tools-container {
  position: sticky;
  top: 0;
  z-index: 2000;
  width: 100%;
  height: 3.5rem;
  margin: 0;
  padding: 2rem 0.75rem;
  padding-left: 12%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: start;
  background-color: rgb(20, 20, 20);
  background-clip: padding-box;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
}
.tools {
  width: 100%;
  height: 3.5rem;
  margin: 0;
  padding-right: 0.54rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: end;
  background-clip: padding-box;
}
.toolButton {
  cursor: pointer;
}
.tools .iconContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
}

.tools .iconContainer i {
  display: block;
  line-height: 1;
}
.techContainer {
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 0.8rem;
  color: rgb(156, 165, 165);
  background: rgb(44, 44, 44);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: block;
  flex: row;
}
.logoPrinc {
  width: 35%;
}
.whiteSpace-text {
  white-space: pre-line;
  color: rgb(156, 165, 165);
}
.row {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}
.desplegable {
  font-size: 0.9rem;
  color: grey;
}
.containerPrinc {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 1rem;
  background-color: rgb(20, 20, 20);
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
  background-color: rgb(20, 20, 20);
  position: relative;
}
/* .containerSec:hover {
  border: 1px solid rgb(48, 47, 47);
} */
.selectHover {
  cursor: pointer;
}
.secondImg {
  height: 100%;
  width: 13rem;
  object-fit: cover;
  /* border-radius: 0.5rem; */
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
  font-size: 0.65rem;
  color: rgb(156, 165, 165); /*rgb(131, 130, 130);*/
  text-decoration: none;
}

.tech-item {
  display: flex; /* horizontal */
  align-items: center; /* centra verticalmente */
  gap: 0.5rem; /* espacio entre icono y texto */
  margin-bottom: 0.5rem; /* espacio entre filas */
}
.iconoSkill {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  font-weight: bold;
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
