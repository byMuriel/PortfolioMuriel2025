<!-- src/components/TabletScreen.vue -->
<template>
  <div ref="screen" class="screen-content">
    <component :is="currentView" @change-screen="handleChangeScreen" />
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import Init from './TabletScreens/Init.vue'
import Skills from './TabletScreens/Skills.vue'
import Experience from './TabletScreens/Experience.vue'

const screen = ref(null)
const domReady = new Promise((resolve) => {
  onMounted(() => resolve())
})

// Vista por defecto
const currentView = shallowRef(Init)

// Manejador de cambio de pantalla
const handleChangeScreen = (newView) => {
  currentView.value = newView
}

defineExpose({
  screen,
  domReady,
})
</script>

<style scoped>
.screen-content {
  width: 100%;
  height: 100%;
  background-color: white;
  /* background-image: url(../assets/wallpaperTablet.png);
  background-size: cover;
  background-position: center; */
  /* display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif; */
}
</style>
