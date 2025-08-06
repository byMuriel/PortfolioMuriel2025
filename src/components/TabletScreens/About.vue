<!-- src/components/About.vue -->
<template>
  <div class="container-fluid aboutApplication m-0 p-0">
    <div class="containerAbout">
      <p class="text-light tittle m-0 p-0 mb-2">{{ Object.keys(AboutContent)[0] }}</p>

      <div class="aboutCard m-0 p-2">
        <p class="text-light about-text">{{ AboutContent['About me'] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import AboutContent from '@/data/about.json'

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
</script>

<style scoped>
.aboutApplication {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  background-color: rgb(123, 72, 241);

  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow: scroll;
}
.containerAbout {
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
}
.aboutCard {
  background: rgba(3, 3, 3, 0.281);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.about-text {
  white-space: pre-line;
  font-size: 1.2rem;
}
.tittle {
  font-size: 1.5rem;
}
</style>
