<!-- src/components/Contact.vue -->
<template>
  <div class="container-fluid contactApplication m-0 p-0">
    <div class="containerContact">
      <div class="m-1">
        <p class="text-light tittle">Contact me</p>
      </div>

      <div v-for="(contact, index) in ContactImage" :key="index" class="m-0 p-2 mb-3 contactCard">
        <div class="container-fluid d-flex justify-content-between">
          <img :src="contact.logo" alt="" class="circulo" />
          <div class="text-end">
            <p class="text-dark m-0">{{ contact.name }}</p>
            <a class="text-anchor" target="_blank" rel="noopener noreferrer" :href="contact.link">{{
              contact.link
            }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineEmits } from 'vue'
import ContactContent from '@/data/contact.json'

const ContactImage = ref([])
ContactImage.value = Object.values(ContactContent).map((item) => ({
  ...item,
  logo: new URL(item.logo, import.meta.url).href,
}))
const ContactLink = ref([])
ContactLink.value = Object.values(ContactContent).map((item) => ({
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
.contactApplication {
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
  background-color: #d80d8c; /* rgb(187, 72, 241);*/
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
}
.containerContact {
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
.contactCard {
  width: 25rem;
  background: rgba(255, 255, 255, 0.733);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.titleSpecificContact {
  font-size: 1.3rem;
  font-weight: bold;
}
.text-anchor {
  color: rgb(0, 82, 163);
  text-decoration: none;
}
</style>
