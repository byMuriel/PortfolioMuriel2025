<!-- src/components/Skills.vue -->
<template>
  <div class="container-fluid skillsApplication">
    <div v-for="cat in uniqueCategories" :key="cat" class="categoryBlock">
      <p class="categoryTitle">{{ cat }}</p>
      <div class="containerSkills">
        <div v-for="skill in byCategory(cat)" :key="skill.name" class="m-0 p-0 skillCard">
          <img :src="skill.logo" :alt="skill.name" class="imgLogo" />
        </div>
      </div>
    </div>
  </div>

  <!-- <div v-for="(skill, index) in SkillsLogo" :key="index" class="m-0 p-2 mb-3 skillCard">
        <div class="container-fluid d-flex justify-content-between">
          <img :src="skill.logo" alt="" class="imgLogo" />
          <div class="text-end">
            <p class="text-light m-0 titleSpecificSkill">{{ skill.name }}</p>
            <p class="text-light m-0">{{ skill.version }}</p>
          </div>
        </div>
        <p class="text-light">{{ skill.description }}</p>
      </div> -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SkillsContent from '@/data/skills.json'

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

const skillsRaw = SkillsContent as Record<string, SkillJSON>

const skills = computed<SkillVM[]>(() =>
  Object.values(skillsRaw).map((item) => ({
    ...item,
    logo: new URL(item.logo, import.meta.url).href,
    categories: (item.category ?? []).map((c) => c.trim()).filter(Boolean),
  })),
)

const uniqueCategories = computed<string[]>(() => {
  const count = new Map<string, number>() // categoría -> veces que aparece
  const firstIdx = new Map<string, number>() // categoría -> primer índice donde apareció

  skills.value.forEach((s, i) => {
    // Evita contar dos veces la misma categoría dentro de una misma skill
    const perSkill = new Set(s.categories)
    perSkill.forEach((c) => {
      if (!firstIdx.has(c)) firstIdx.set(c, i)
      count.set(c, (count.get(c) ?? 0) + 1)
    })
  })

  const cats = Array.from(count.keys())
  cats.sort((a, b) => {
    const diff = (count.get(b) ?? 0) - (count.get(a) ?? 0) // más frecuentes primero
    if (diff !== 0) return diff
    // empate: la que apareció antes en el JSON primero
    return (firstIdx.get(a) ?? 0) - (firstIdx.get(b) ?? 0)
  })
  return cats
})

const groupedByCategory = computed<Record<string, SkillVM[]>>(() => {
  const groups: Record<string, SkillVM[]> = {}
  for (const s of skills.value) {
    for (const c of s.categories) {
      ;(groups[c] ??= []).push(s)
    }
  }
  return groups
})

const byCategory = (cat: string) => groupedByCategory.value[cat] ?? []

onMounted(() => {
  console.table(uniqueCategories.value)
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
  padding: 2rem 0rem 3rem 0rem;
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
.titleSpecificSkill {
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
