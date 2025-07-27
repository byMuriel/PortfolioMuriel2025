<!-- src/components/Skills.vue -->
<template>
  <div class="container-fluid initContent m-0 p-0">
    <div class="m-0 p-0"><p>Skills</p></div>
    <div class="m-0 p-9 bg-danger text-light">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, saepe unde! Aliquid quod,
        eligendi autem eum veritatis voluptas provident perspiciatis laudantium fugiat dolore
        suscipit reprehenderit accusantium vel a, corrupti inventore!
      </p>
      <button id="btnSkills" class="btn btn-primary w-100 me-5" @click="goBack()">GoBack</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'

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
.initContent {
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
