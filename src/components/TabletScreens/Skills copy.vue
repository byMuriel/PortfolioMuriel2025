<!-- src/components/Skills.vue -->
<template>
  <div class="container-fluid skillsApplication">
    <!-- Tools Buttons -->
    <div class="tools">
      <div class="m-0 p-0 logo">
        <img class="logoPrinc" src="@/assets/images/SkillsLogos/LogoM.png" alt="" />
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
    <div v-for="cat in uniqueCategories" :key="cat" class="categoryBlock">
      <p class="categoryTitle">{{ cat }}</p>
      <div class="containerSkills">
        <div v-for="skill in byCategory(cat)" :key="skill.name" class="m-0 p-0 skillCard">
          <img :src="skill.logo" :alt="skill.name" class="imgLogo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted } from 'vue'
import { useRedirectStore } from '@/stores/useRedirect'

type SkillJSON = {
  logo: string
  name: string
  version?: string
  description?: string
  category?: string[]
}
type SkillVM = SkillJSON & {
  logo: string
  categories: string[]
}
type SkillsMap = Record<string, SkillJSON>
type AppData = { skills?: SkillsMap }

const data = inject<import('vue').Ref<AppData>>('data', ref<AppData>({}))

const redirectStore = useRedirectStore()

/*****************************************************************************************
 * CONSTANT: SkillsContent
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive map of raw skills loaded from injected app data.
 *              - Ensures a safe default {} if data.skills is undefined.
 * ***************************************************************************************
 * CONSTANTE: SkillsContent
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Mapa reactivo de skills crudos cargados desde los datos inyectados.
 *              - Garantiza {} por defecto si data.skills no existe.
 *****************************************************************************************/
const SkillsContent = computed<SkillsMap>(() => data.value.skills ?? {})
/*****************************************************************************************
 * CONSTANT: skills
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalized, UI-ready list of skills (VM).
 *              - Resolves logo to an absolute URL when needed.
 *              - Trims and filters category strings.
 * ***************************************************************************************
 * CONSTANTE: skills
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Lista normalizada de skills lista para UI (VM).
 *              - Resuelve el logo a URL absoluta cuando aplica.
 *              - Limpia y filtra las categorías.
 *****************************************************************************************/
const skills = computed<SkillVM[]>(() => {
  const raw = SkillsContent.value
  return Object.values(raw)
    .filter((item): item is SkillJSON => !!item)
    .map((item) => ({
      ...item,
      logo: isAbsolute(item.logo) ? item.logo : new URL(item.logo, import.meta.url).href,
      categories: (item.category ?? []).map((c) => c.trim()).filter(Boolean),
    }))
})
/*****************************************************************************************
 * CONSTANT: uniqueCategories
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Sorted category names by:
 *              1) Descending frequency of appearance.
 *              2) First occurrence index (stable tiebreaker).
 * ***************************************************************************************
 * CONSTANTE: uniqueCategories
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Nombres de categorías ordenados por:
 *              1) Frecuencia descendente de aparición.
 *              2) Índice de primera ocurrencia (desempate estable).
 *****************************************************************************************/
const uniqueCategories = computed<string[]>(() => {
  const count = new Map<string, number>()
  const firstIdx = new Map<string, number>()

  skills.value.forEach((s, i) => {
    const perSkill = new Set(s.categories)
    perSkill.forEach((c) => {
      if (!firstIdx.has(c)) firstIdx.set(c, i)
      count.set(c, (count.get(c) ?? 0) + 1)
    })
  })

  const cats = Array.from(count.keys())
  cats.sort((a, b) => {
    const diff = (count.get(b) ?? 0) - (count.get(a) ?? 0)
    if (diff !== 0) return diff
    return (firstIdx.get(a) ?? 0) - (firstIdx.get(b) ?? 0)
  })
  return cats
})
/*****************************************************************************************
 * CONSTANT: groupedByCategory
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Dictionary { category -> SkillVM[] } for fast lookups.
 *              - Populated from the normalized skills list.
 * ***************************************************************************************
 * CONSTANTE: groupedByCategory
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Diccionario { categoría -> SkillVM[] } para consultas rápidas.
 *              - Se construye a partir de la lista de skills normalizada.
 *****************************************************************************************/
const groupedByCategory = computed<Record<string, SkillVM[]>>(() => {
  const groups: Record<string, SkillVM[]> = {}
  for (const s of skills.value) {
    for (const c of s.categories) {
      ;(groups[c] ??= []).push(s)
    }
  }
  return groups
})
/*****************************************************************************************
 * FUNCTION: byCategory
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the SkillVM list for a given category; falls back to [].
 * ***************************************************************************************
 * FUNCIÓN: byCategory
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Retorna la lista de SkillVM para una categoría dada; por defecto [].
 *****************************************************************************************/
const byCategory = (cat: string) => groupedByCategory.value[cat] ?? []
/*****************************************************************************************
 * FUNCTION: isAbsolute
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Checks if a path is absolute (http/https or root-based).
 * ***************************************************************************************
 * FUNCIÓN: isAbsolute
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Verifica si una ruta es absoluta (http/https o basada en raíz).
 *****************************************************************************************/
function isAbsolute(path: string) {
  return /^(https?:)?\/\//.test(path) || path.startsWith('/')
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation from the Skills component to another screen.
 * ***************************************************************************************
 * FUNCIÓN: go
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Gestiona la navegación desde el componente Skills hacia otra pantalla.
 *****************************************************************************************/
function go(to: string) {
  redirectStore.redirect(to)
}
onMounted(() => {
  // console.table(uniqueCategories.value)
})
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
  border-radius: 9%;
  width: 100%;
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
