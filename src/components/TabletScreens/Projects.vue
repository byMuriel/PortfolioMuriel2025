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

type ImageField = string[] | Record<string, string> | undefined

const currentProjectContainer = ref<HTMLDivElement | null>(null)
const techContainer = ref<HTMLDivElement | null>(null)
const screen = ref<HTMLElement | null>(null) //Reactive DOM reference for the projects screen container.

// Store Instances
const stateLikeDislikeStore = useStateLikeDislikeProjects()
const redirectStore = useRedirectStore()

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
  // Fallback Object
  name: '',
  description: '',
  link: '#',
  githubRep: '#',
  image: [],
  logo: null,
  likes: 0,
  unlikes: 0,
}
let intervalId: ReturnType<typeof setInterval> | null = null
type ProjectBase = Omit<Project, 'logo'>
type ProjectWithLogo = ProjectBase & { logo: string | null }

// StateFlags
const showTechInfo: Ref<boolean> = ref(false)
const like: Ref<boolean> = ref(false)
const likesObject: Ref<Record<string, number>> = ref({})
const currentProjectIndex: Ref<number> = ref(0)
const currentImageIndex: Ref<number> = ref(0)
const AUTO_SLIDE_MS: number = 4000 //Interval (ms) for the auto-slide of project images.

/*****************************************************************************************
 * COMPUTED: rawProjects
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive map of projects as received from provide/inject (object by id).
 * ***************************************************************************************
 * COMPUTADO: rawProjects
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Mapa reactivo de proyectos recibido por provide/inject (objeto por id).
 *****************************************************************************************/
const rawProjects = computed<Record<string, Project>>(() => data.value.projects ?? {})
/*****************************************************************************************
 * COMPUTED: likes
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the like counter of the current active project.
 * ***************************************************************************************
 * COMPUTADO: likes
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Retorna el contador de likes del proyecto activo.
 *****************************************************************************************/
const likes = computed(() => projects.value[currentProjectIndex.value].likes)
/*****************************************************************************************
 * COMPUTED: currentProject
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Safely resolves the currently selected project or a default fallback.
 * ***************************************************************************************
 * COMPUTADO: currentProject
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Resuelve de forma segura el proyecto seleccionado o un fallback por defecto.
 *****************************************************************************************/
const currentProject = computed(() => projects.value[currentProjectIndex.value] ?? defaultProject)
/*****************************************************************************************
 * COMPUTED: images
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalizes the project's image field (array or object) into an array.
 * ***************************************************************************************
 * COMPUTADO: images
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Normaliza el campo de imágenes (array u objeto) a un arreglo.
 *****************************************************************************************/
const images = computed(() => {
  const imgs = currentProject.value?.image
  return Array.isArray(imgs) ? imgs : imgs ? Object.values(imgs) : []
})
/*****************************************************************************************
 * COMPUTED: currentImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Current image URL based on the active image index.
 * ***************************************************************************************
 * COMPUTADO: currentImage
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: URL de la imagen actual según el índice activo.
 *****************************************************************************************/
const currentImage = computed(() => images.value[currentImageIndex.value])
/*****************************************************************************************
 * COMPUTED: otherProjects
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: All projects except the current one, preserving original index.
 * ***************************************************************************************
 * COMPUTADO: otherProjects
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Todos los proyectos excepto el actual, preservando el índice original.
 *****************************************************************************************/
const otherProjects: ComputedRef<(Project & { originalIndex: number })[]> = computed(() =>
  projects.value
    .map((project, originalIndex) => ({ ...(project as Project), originalIndex }))
    .filter((_, i) => i !== currentProjectIndex.value),
)
/*****************************************************************************************
 * COMPUTED: techList
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Key/value entries of the current project's tech dictionary.
 * ***************************************************************************************
 * COMPUTADO: techList
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Pares clave/valor del diccionario de tecnologías del proyecto actual.
 *****************************************************************************************/
const techList = computed(() => {
  const tech = currentProject.value?.tech
  if (!tech) return []
  return Object.entries(tech)
})
/*****************************************************************************************
 * COMPUTED: projects
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalized list of projects (object → array), filtering undefined.
 * ***************************************************************************************
 * COMPUTADO: projects
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Lista normalizada de proyectos (objeto → arreglo), filtrando undefined.
 *****************************************************************************************/
const projects: ComputedRef<Project[]> = computed(() => {
  const raw = rawProjects.value ?? {}
  return Object.values(raw).filter((p): p is Project => !!p)
})
/*****************************************************************************************
 * COMPUTED: projectLogos
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Maps projects resolving the logo path to an absolute asset URL (or null).
 * ***************************************************************************************
 * COMPUTADO: projectLogos
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Mapea proyectos resolviendo la ruta del logo a una URL absoluta (o null).
 *****************************************************************************************/
const projectLogos: ComputedRef<ProjectWithLogo[]> = computed(() =>
  projects.value.map((p) => {
    const { logo: rawLogo, ...rest } = p
    const resolved: string | null = rawLogo ? new URL(rawLogo, import.meta.url).href : null
    return { ...(rest as ProjectBase), logo: resolved }
  }),
)
/*****************************************************************************************
 * FUNCTION: toogleTech
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Toggles the "Tech Used" section and scrolls/focuses it into view.
 * ***************************************************************************************
 * FUNCIÓN: toogleTech
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Alterna la sección "Tech Used" y hace scroll/enfoque al contenedor.
 *****************************************************************************************/
function toogleTech() {
  showTechInfo.value = !showTechInfo.value
  if (showTechInfo.value === true && techContainer.value != null) {
    techContainer.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    techContainer.value.focus()
  }
}
/*****************************************************************************************
 * FUNCTION: getColor
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns a background color for a given tech name from the color dictionary.
 * ***************************************************************************************
 * FUNCIÓN: getColor
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Retorna un color de fondo para una tecnología dada desde el diccionario.
 *****************************************************************************************/
function getColor(name: string): string {
  return (colorSkill as Record<string, string>)[name] || 'grey'
}
/*****************************************************************************************
 * FUNCTION: getColorText
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns a contrasting text color for a given tech pill.
 * ***************************************************************************************
 * FUNCIÓN: getColorText
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Retorna un color de texto contrastante para la píldora de la tecnología.
 *****************************************************************************************/
function getColorText(name: string): string {
  if (name === 'JavaScript') {
    return 'black'
  } else {
    return 'white'
  }
}
/*****************************************************************************************
 * FUNCTION: scrollToTop
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Scrolls the current project container to top (smooth or instant).
 * ***************************************************************************************
 * FUNCIÓN: scrollToTop
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Hace scroll al inicio del contenedor del proyecto (suave o inmediato).
 *****************************************************************************************/
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
 * DESCRIPTION: Delegates navigation to the redirect store.
 * ***************************************************************************************
 * FUNCIÓN: go
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Delegar la navegación al store de redirección.
 *****************************************************************************************/
function go(to: string) {
  redirectStore.redirect(to)
}
/*****************************************************************************************
 * FUNCTION: firstImageOf
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the first image URL regardless of whether image is array or object.
 * ***************************************************************************************
 * FUNCIÓN: firstImageOf
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Retorna la primera URL de imagen sin importar si es array u objeto.
 *****************************************************************************************/
function firstImageOf(p: Project): string | undefined {
  const img = p.image
  if (!img) return undefined
  return Array.isArray(img) ? img[0] : Object.values(img)[0]
}
/*****************************************************************************************
 * FUNCTION: replacePrincipal
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Changes the active project, resets image index and optionally scrolls top.
 * ***************************************************************************************
 * FUNCIÓN: replacePrincipal
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Cambia el proyecto activo, reinicia el índice de imagen y opcionalmente
 *              hace scroll al inicio.
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
 * DESCRIPTION: Advances the image carousel with wrap-around logic.
 * ***************************************************************************************
 * FUNCIÓN: nextImage
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Avanza el carrusel de imágenes con lógica de vuelta al inicio.
 *****************************************************************************************/
function nextImage(): void {
  const total = images.value.length
  if (!total) return
  currentImageIndex.value = (currentImageIndex.value + 1) % total
}
/*****************************************************************************************
 * FUNCTION: startAutoSlide
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Starts the auto-slide interval if not already running.
 * ***************************************************************************************
 * FUNCIÓN: startAutoSlide
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Inicia el intervalo de auto-desplazamiento si no está activo.
 *****************************************************************************************/
function startAutoSlide(): void {
  if (intervalId) return
  intervalId = setInterval(nextImage, AUTO_SLIDE_MS)
}
/*****************************************************************************************
 * FUNCTION: stopAutoSlide
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Stops and clears the auto-slide interval if active.
 * ***************************************************************************************
 * FUNCIÓN: stopAutoSlide
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Detiene y limpia el intervalo de auto-desplazamiento si está activo.
 *****************************************************************************************/
function stopAutoSlide(): void {
  if (!intervalId) return
  clearInterval(intervalId)
  intervalId = null
}
/*****************************************************************************************
 * FUNCTION: handleThumbs
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Receives child emit with vote (0 none, 1 like, 2 dislike) and stores it.
 * ***************************************************************************************
 * FUNCIÓN: handleThumbs
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Recibe el emit del hijo con el voto (0 ninguno, 1 like, 2 dislike) y lo guarda.
 *****************************************************************************************/
function handleThumbs(value: number) {
  const i = currentProjectIndex.value
  stateLikeDislikeStore.setVote(i, value)
}
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
 * DESCRIPTION: Executes initialization logic when the component is mounted.
 *              - Starts the auto-slide timer for the project images.
 *              - Ensures the like/dislike store is initialized with the
 *                project indices from rawProjects (only if not already initialized).
 * ***************************************************************************************
 * CICLO DE VIDA: onMounted
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Ejecuta la lógica de inicialización al montar el componente.
 *              - Inicia el temporizador de auto-desplazamiento de las imágenes del proyecto.
 *              - Asegura que el store de like/dislike se inicialice con los índices
 *                de proyectos desde rawProjects (solo si aún no estaba inicializado).
 *****************************************************************************************/
onMounted(() => {
  startAutoSlide()
  const keys = Object.keys(rawProjects.value ?? {})
  stateLikeDislikeStore.ensureInit(keys)
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
