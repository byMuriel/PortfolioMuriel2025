<!-- src/components/About.vue -->
<template>
  <div class="container-fluid aboutApplication m-0 p-0">
    <!-- Encabezado como en Projects -->

    <div class="containerAbout mt-5">
      <!-- Hero de fotos -->
      <div class="aboutHero">
        <div class="aboutCard m-0 p-3">
          <p :v-if="index = !0" class="text-color about-text text-center">
            <span class="meeting1">HELLO! </span><br />
            <span class="meeting2">{{ AboutContent.intro }}</span>
          </p>
        </div>
        <img class="murielImg" src="/src/assets/images/muriel.png" alt="" />
      </div>

      <!-- Párrafos -->
      <div
        v-for="(parraph, index) in AboutContent.AboutMe"
        :key="index"
        class="aboutCard m-0 p-3 mb-3"
      >
        <p :v-if="index = !0" class="text-color about-text">{{ parraph }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import AboutContent from '@/data/about.json'

const aboutImg = new URL(AboutContent.img, import.meta.url).href

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
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  /* background-color: rgb(71, 70, 70); */
  background-color: rgb(228, 227, 227);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow: auto;
}
.meeting1 {
  color: rgb(165, 42, 165);
  font-size: 3.5rem;
  font-weight: bolder;
  text-shadow: 0.1rem 0.1rem 0.1rem rgba(245, 194, 220, 0.582);
}
.meeting2 {
  color: rgb(7, 166, 194);
  font-size: 1.39rem;
  font-weight: bolder;
  text-shadow: 0.1rem 0.1rem 0.1rem rgba(245, 194, 220, 0.582);
}
.containerPrinc {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
  background-color: rgb(51, 50, 50);
}
.containerAbout {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.text-color {
  color: rgba(77, 77, 77, 0.86);
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.aboutHero {
  width: 100%;
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 0.2rem;
  align-items: center;
}
@media (max-width: 768px) {
  .aboutHero {
    grid-template-columns: 1fr;
  }
}

.murielImg {
  width: 10rem;
  height: 10rem;
  object-fit: cover;
  border-radius: 1rem; /* más pro que círculo duro */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  justify-self: start;
  margin-right: 1rem;
}
@media (max-width: 768px) {
  .murielImg {
    justify-self: center;
  }
}

.aboutCard {
  width: 100%;
  /* background: rgb(252, 252, 252); */

  border-radius: 0.75rem;
}

.about-text {
  white-space: pre-line;
  font-size: 0.95rem;
}
</style>
