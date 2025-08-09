<!-- src/components/Projects.vue -->
<template>
  <div class="container-fluid ProjectsApplication m-0 p-0">
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
          :src="rawProjects.image[0]"
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

<script setup>
import { ref, onMounted, computed } from 'vue'
import { defineEmits } from 'vue'
import rawProjects from '@/data/projects.json'

let intervalId

const ProjectContent = Object.values(rawProjects)
const currentProjectIndex = ref(0)
const currentImageIndex = ref(0)

const currentProject = computed(() => ProjectContent[currentProjectIndex.value])
const currentImage = computed(() => currentProject.value.image[currentImageIndex.value])

const otherProjects = computed(() =>
  ProjectContent.map((project, originalIndex) => ({ ...project, originalIndex })).filter(
    (_, i) => i !== currentProjectIndex.value,
  ),
)

const ExperienceLink = ref([])
ExperienceLink.value = Object.values(ProjectContent).map((item) => ({
  ...item,
  logo: new URL(item.link, import.meta.url).href,
}))

function replacePrincipal(index) {
  console.log(index)
  currentProjectIndex.value = index
  currentImageIndex.value = 0
}
function nextImage() {
  const totalImages = Object.keys(currentProject.value.image).length
  currentImageIndex.value = (currentImageIndex.value + 1) % totalImages
}

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

onMounted(() => {
  intervalId = setInterval(() => {
    nextImage()
  }, 3000) // 30 segundos
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
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0.2;
}
</style>
