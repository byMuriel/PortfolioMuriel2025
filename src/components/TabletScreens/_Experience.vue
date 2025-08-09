<!-- src/components/Experience.vue -->
<template>
  <div class="container-fluid ExperienceApplication m-0 p-0">
    <div class="containerExperience">
      <div class="m-1">
        <p class="text-dark tittle">Experience</p>
      </div>

      <div
        v-for="(experience, index) in ExperienceLogo"
        :key="index"
        class="m-0 p-2 mb-3 skillCard"
      >
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <div class="me-2"><img :src="experience.logo" class="tamanioLogo" /></div>

          <div class="text-end">
            <p class="text-dark m-0 titleSpecificSkill">{{ experience.name }}</p>
            <p class="text-dark m-0">{{ experience.position }}</p>
          </div>
        </div>
        <p class="text-dark">{{ experience.initDate }} - {{ experience.finalDate }}</p>
        <p class="text-dark whiteSpace-text">{{ experience.functions }}</p>
        <a class="text-anchor" target="_blank" rel="noopener noreferrer" :href="experience.link">{{
          experience.link
        }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import ExperienceContent from '@/data/experience.json'

const ExperienceLogo = ref([])
ExperienceLogo.value = Object.values(ExperienceContent).map((item) => ({
  ...item,
  logo: new URL(item.logo, import.meta.url).href,
}))
const ExperienceLink = ref([])
ExperienceLink.value = Object.values(ExperienceContent).map((item) => ({
  ...item,
  logo: new URL(item.link, import.meta.url).href,
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
.whiteSpace-text {
  white-space: pre-line;
}
.ExperienceApplication {
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
  background-color: rgb(25, 219, 245);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
}
.containerExperience {
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
  background: rgba(250, 249, 249, 0.6);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.titleSpecificSkill {
  font-size: 1.3rem;
  font-weight: bold;
}
.tamanioLogo {
  width: 5.5rem;
}
</style>
