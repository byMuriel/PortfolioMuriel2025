<!-- src/components/Projects.vue -->
<template>
  <div class="container-fluid ProjectsApplication m-0 p-0" ref="currentProjectContainer">
    <!-- Tools -->
    <div class="tools-container">
      <img
        class="logoPrinc"
        :src="logoProjects"
        alt="Projects logo"
        decoding="async"
        loading="eager"
        @error="onImgError"
      />

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
      </div>
    </div>

    <!-- CurrentProject -->
    <transition name="fade" mode="out-in">
      <img
        :key="currentImage"
        :src="currentImage"
        alt="Project image"
        class="img-fluid principalImg"
        @mouseenter="intentWarmCurrentAndNext"
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
          @mouseenter="intentWarmProject(rawProjects)"
          @click="replacePrincipal(rawProjects.originalIndex, true)"
        />
        <!-- TextProject -->
        <div class="secondText p-2">
          <h6
            class="m-0 p-0 fw-bold selectHover"
            @mouseenter="intentWarmProject(rawProjects)"
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
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type Ref,
  type ComputedRef,
} from 'vue'
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useRedirectStore } from '@/stores/useRedirect'
import { useStateLikeDislikeProjects } from '@/stores/useStateLikeDislikeProjects'
import { useProjectsStore } from '@/stores/useProjects'
import PillText from '@/components/CommonComponents/PillText.vue'
import colorSkill from '@/data/colorSkill.json'

type ProjectDTO = import('@/services/projects').ProjectDTO
type ImageField = string[] | Record<string, string> | undefined
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

const currentProjectContainer = ref<HTMLDivElement | null>(null)
const techContainer = ref<HTMLDivElement | null>(null)
const screen = ref<HTMLElement | null>(null)

// Store Instances
const appLogos = useAppLogosStore()
const projectsStore = useProjectsStore()
const stateLikeDislikeStore = useStateLikeDislikeProjects()
const redirectStore = useRedirectStore()
let intervalId: ReturnType<typeof setInterval> | null = null

// StateFlags
const showTechInfo: Ref<boolean> = ref(false)
const currentProjectIndex: Ref<number> = ref(0)
const currentImageIndex: Ref<number> = ref(0)
const AUTO_SLIDE_MS: number = 4000

const logoProjects = computed(() => appLogos.getLogo('projects'))
const rawProjects = computed<Record<string, Project>>(
  () => (projectsStore.byId as unknown as Record<string, Project>) ?? {},
)
const currentProject = computed<ProjectDTO>(
  () =>
    projects.value[currentProjectIndex.value] ?? {
      name: '',
      description: '',
      link: '#',
      githubRep: '#',
      likes: 0,
      unlikes: 0,
      image: [],
      tech: {},
    },
)
const images = computed<string[]>(() => {
  const img = currentProject.value.image
  if (!img) return []
  return Array.isArray(img) ? img : Object.values(img)
})
const currentImage = computed<string | undefined>(() => images.value[currentImageIndex.value])
const likes = computed(() => currentProject.value.likes)
const otherProjects: ComputedRef<(Project & { originalIndex: number })[]> = computed(() =>
  projects.value
    .map((project, originalIndex) => ({ ...(project as Project), originalIndex }))
    .filter((_, i) => i !== currentProjectIndex.value),
)
const techList = computed(() => {
  const tech = currentProject.value?.tech
  if (!tech) return []
  return Object.entries(tech)
})
const projects: ComputedRef<ProjectDTO[]> = computed(() => projectsStore.projects)

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}
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
function go(to: string) {
  redirectStore.redirect(to)
}
function firstImageOf(p: Project): string | undefined {
  const img = p.image
  if (!img) return undefined
  return Array.isArray(img) ? img[0] : Object.values(img)[0]
}
async function replacePrincipal(index: number, fromClick: boolean = true): Promise<void> {
  if (index < 0 || index >= projects.value.length) return
  currentImageIndex.value = 0
  currentProjectIndex.value = index
  await nextTick()
  if (fromClick) scrollToTop(true)
}
function nextImage(): void {
  const total = images.value.length
  if (!total) return
  currentImageIndex.value = (currentImageIndex.value + 1) % total
}
function startAutoSlide(): void {
  if (intervalId) return
  intervalId = setInterval(nextImage, AUTO_SLIDE_MS)
}
function stopAutoSlide(): void {
  if (!intervalId) return
  clearInterval(intervalId)
  intervalId = null
}
function handleThumbs(value: number) {
  const i = currentProjectIndex.value
  stateLikeDislikeStore.setVote(i, value)
}
function dispatchWarm(urls: string[] | string) {
  window.dispatchEvent(new CustomEvent('warm-images', { detail: urls }))
}
function allImagesOf(p: Project): string[] {
  const img = p?.image
  if (!img) return []
  return Array.isArray(img) ? img.filter(Boolean) : Object.values(img).filter(Boolean)
}
function currentAndNextImages(): string[] {
  const imgs = images.value
  const i = currentImageIndex.value
  if (!imgs?.length) return []
  const next = imgs[(i + 1) % imgs.length]
  return [imgs[i], next].filter(Boolean)
}
function intentWarmCurrentAndNext() {
  dispatchWarm(currentAndNextImages())
}
function intentWarmProject(p: Project) {
  dispatchWarm(allImagesOf(p))
}
const domReady: Promise<void> = new Promise((resolve) => {
  onMounted(() => {
    resolve()
  })
})
defineExpose({ screen, domReady })
onMounted(() => {
  startAutoSlide()
  const keys = Object.keys(rawProjects.value ?? {})
  stateLikeDislikeStore.ensureInit(keys)
})
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
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  background-color: rgb(20, 20, 20);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow-y: auto;
  position: relative;
}
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
.selectHover {
  cursor: pointer;
}
.secondImg {
  height: 100%;
  width: 13rem;
  object-fit: cover;
}
.secondText {
  width: 100%;
}
.text-color {
  color: rgba(255, 255, 255, 0.856);
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.text-anchor {
  font-size: 0.65rem;
  color: rgb(156, 165, 165);
  text-decoration: none;
}
.tech-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
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
