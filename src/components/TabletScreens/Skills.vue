<!-- src/components/Skills.vue -->
<template>
  <div class="container-fluid skillsApplication">
    <!-- Tools Buttons -->
    <div class="tools">
      <div class="m-0 p-0 logo">
        <img
          v-if="logoSkills"
          :src="logoSkills"
          alt="Skills logo"
          class="logoPrinc"
          @error="onImgError"
        />
        <span class="m-o p-0 title">Skills</span>
      </div>

      <div class="d-flex justify.content-between">
        <i @click="go('Init')" class="bi bi-house-door"></i>

        <div class="dropdown">
          <span
            type="button"
            id="dropdownMenuButton1"
            class="d-flex justify-content-center align-items-center ms-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </span>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li @click="go('About')"><a class="dropdown-item" href="#">About</a></li>
            <li @click="go('Projects')"><a class="dropdown-item" href="#">Projects</a></li>
            <li @click="go('Experience')"><a class="dropdown-item" href="#">Experience</a></li>
            <li @click="go('Skills')"><a class="dropdown-item" href="#">Skills</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Skills Content -->
    <div v-for="cat in displayCategories" :key="cat" class="categoryBlock">
      <p class="categoryTitle">{{ cat }}</p>
      <div class="containerSkills">
        <div v-for="skill in byCategory(cat)" :key="skill.name" class="m-0 p-0 skillCard">
          <img :src="skill.logo ?? FALLBACK_LOGO" :alt="skill.name" class="imgLogo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Skills' })
import { computed, onMounted } from 'vue'
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useSkillsStore } from '@/stores/useSkills'
import { useRedirectStore } from '@/stores/useRedirect'

const FALLBACK_LOGO = '/assets/SkillsLogos/LogoM.png'

const appLogos = useAppLogosStore()
const redirectStore = useRedirectStore()
const store = useSkillsStore()

onMounted(() => {
  // Solo carga si el store NO está fresco; no esperamos (no bloquea el primer paint)
  if (!store.isFresh) {
    // sin await: si ya precalentaste, las imágenes salen directo desde cache
    void store.load()
  }
})

const logoSkills = computed(() => appLogos.getLogo('skills'))
const displayCategories = computed(() => store.displayCategories)
const byCategory = (cat: string) => store.byCategory(cat)

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}
function go(to: string) {
  useRedirectStore().redirect(to)
}
</script>

<style scoped>
.skillsApplication {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  font-family: sans-serif;
  background-color: rgb(43, 42, 42);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding-bottom: 3rem;
}
.categoryBlock {
  width: 100%;
  margin-top: 2rem;
}
.categoryTitle {
  margin: 0;
  padding: 0 0 0.5rem 1rem;
  color: rgb(255, 255, 255);
  font-weight: bolder;
}
.containerSkills {
  --gap: 0.6rem;
  --cols-peek: 3.1;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 8rem;
  gap: var(--gap);
  padding-inline: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  overflow: hidden;
}
.skillCard {
  scroll-snap-align: start;
  width: 8rem;
  height: 12rem;
  background: rgb(255, 255, 255);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 1rem;
}
.imgLogo {
  display: block;
  border-radius: 9%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  backface-visibility: hidden;
  margin: 0;
  padding: 0;
}
.title {
  font-size: 1.3rem;
  font-weight: bold;
  font-family: Tahoma, Verdana, sans-serif;
}
.titleSpecificSkill {
  font-size: 1.3rem;
  font-weight: bold;
}
.logo {
  flex: 0 0 auto;
  height: 3.5rem;
  z-index: 10;
  width: 85%;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 10%;
  margin-right: 0.5rem;
}
.tools {
  flex: 0 0 auto;
  height: 3.5rem;
  z-index: 10;
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 10%;
  margin-right: 0.5rem;
}
.toolButton {
  cursor: pointer;
}
.bi {
  height: 10%;
}
.tools span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0rem;
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
.logoPrinc {
  width: 18%;
}
.dropdown-menu {
  background-color: rgba(58, 58, 58, 0.911);
}
.dropdown-item {
  color: rgb(212, 212, 212);
}
.bi-three-dots-vertical,
.bi-house-door {
  font-size: 1.5rem;
  color: rgb(212, 212, 212);
}
</style>
