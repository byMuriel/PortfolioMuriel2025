<!-- src/components/TabletScreens/Init.vue -->
<template>
  <div class="container-fluid initContent m-0 p-0">
    <div class="clock-container">
      <div class="m-0 p-0 clock-time"><p>17:58</p></div>
      <div class="m-0 p-9 clock-date"><p>Sun, 20 july</p></div>
    </div>
    <div class="col-6 d-flex justify-content-center align-items-center mt-5">
      <button id="btnSkills" class="btn btn-primary w-100 me-5" @click="goTo('skills')">
        Skills
      </button>
      <button id="btnExperience" class="btn btn-primary w-100" @click="goTo('experience')">
        Experience
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['change-screen'])
const goTo = (route) => {
  console.log('Hiciste click en el boton')
  if (route == 'skills') {
    emit('change-screen', 'Skills')
  }
  if (route == 'experience') {
    emit('change-screen', 'Experience')
  }
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
.initContent {
  pointer-events: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/wallpaperTablet.png');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
}

.clock-container {
  width: 25rem;
  height: 10rem;
  background-color: rgba(253, 251, 251, 0.3);
  border-radius: 1rem;
  margin: 5rem auto 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.clock-time {
  width: 100%;
  font-family:
    'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
    sans-serif;
  font-weight: bolder;
  font-size: 5rem;
  text-align: center;
}

.btn:hover {
  cursor: pointer;
}
</style>
