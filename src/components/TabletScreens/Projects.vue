<!-- src/components/Projects.vue -->
<template>
  <div class="container-fluid ProjectsApplication m-0 p-0">
    <div class="containerProject">
      <div class="m-1">
        <p class="text-light tittle">Projects</p>
      </div>

      <div v-for="(project, index) in ProjectImg" :key="index" class="m-0 p-2 mb-3 skillCard">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <div class="me-2"><img :src="project.image" class="tamanioLogo" /></div>

          <div class="text-end">
            <p class="text-title-project m-0 titleSpecificSkill">{{ project.name }}</p>
          </div>
        </div>
        <p class="text-light whiteSpace-text">{{ project.description }}</p>
        <a class="text-anchor" target="_blank" rel="noopener noreferrer" :href="project.link">{{
          project.link
        }}</a>
        <br />
        <a class="text-anchor" target="_blank" rel="noopener noreferrer" :href="project.githubRep"
          >GitHub Repository</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import ProjectContent from '@/data/projects.json'

const ProjectImg = ref([])
ProjectImg.value = Object.values(ProjectContent).map((item) => ({
  ...item,
  logo: new URL(item.image, import.meta.url).href,
}))
const ExperienceLink = ref([])
ExperienceLink.value = Object.values(ProjectContent).map((item) => ({
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
.ProjectsApplication {
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
  background-color: rgb(51, 50, 50); /*rgb(236, 85, 224);*/
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
}
.containerProject {
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
  background: rgba(233, 230, 232, 0.4);
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
.text-anchor {
  color: rgb(189, 247, 28);
  text-decoration: none;
}
.text-title-project {
  color: rgb(238, 253, 26);
}
</style>
