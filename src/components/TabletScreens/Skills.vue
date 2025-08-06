<!-- src/components/Skills.vue -->
<template>
  <div class="container-fluid skillsApplication m-0 p-0">
    <div class="containerSkills">
      <div class="m-1">
        <p class="text-light tittle">Technical Skills</p>
      </div>

      <div v-for="(skill, index) in SkillsLogo" :key="index" class="m-0 p-2 mb-3 skillCard">
        <div class="container-fluid d-flex justify-content-between">
          <img :src="skill.logo" alt="" class="circulo" />
          <div class="text-end">
            <p class="text-light m-0 titleSpecificSkill">{{ skill.name }}</p>
            <p class="text-light m-0">{{ skill.version }}</p>
          </div>
        </div>
        <p class="text-light">{{ skill.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import SkillsContent from '@/data/skills.json'

const SkillsLogo = ref([])
SkillsLogo.value = Object.values(SkillsContent).map((item) => ({
  ...item,
  logo: new URL(item.logo, import.meta.url).href,
}))

const emit = defineEmits(['change-screen'])
const goBack = (route) => {
  emit('change-screen', 'Init')
}

const screen = ref(null)
const domReady = new Promise((resolve) => {
  onMounted(() => resolve())
})

defineExpose({
  screen,
  domReady,
})

onMounted(() => {})
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
  align-items: center;
  font-family: sans-serif;
  background-color: rgb(4, 151, 83);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
}
.containerSkills {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  overflow: scroll;
}
.tittle {
  font-size: 1.5rem;
}
.circulo {
  border-radius: 30%;
  width: 4rem;
}
.skillCard {
  background: rgba(3, 3, 3, 0.281);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.titleSpecificSkill {
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
