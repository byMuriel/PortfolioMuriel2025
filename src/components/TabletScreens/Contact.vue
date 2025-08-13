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

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import ContactContent from '@/data/contact.json'

const contactRaw = ContactContent as Record<string, ContactJSON>
const screen: Ref<HTMLDivElement | null> = ref(null)

type ContactJSON = {
  logo: string
  link: string
} & Record<string, unknown>

type ContactVM = ContactJSON & {
  logo: string
  link: string
}

/*****************************************************************************************
 * VARIABLE: ContactImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive array of contact items with the logo asset resolved to an absolute URL.
 *              - Builds the list from `contactRaw`.
 *              - Keeps `link` as provided in the JSON (no transformation here).
 * ***************************************************************************************
 * DESCRIPCIÓN: Arreglo reactivo de contactos con el logo resuelto a URL absoluta.
 *              - Construye la lista desde `contactRaw`.
 *              - Mantiene `link` tal como viene en el JSON (sin transformación aquí).
 *****************************************************************************************/
const ContactImage = ref<ContactVM[]>([])
ContactImage.value = Object.values(contactRaw).map((item) => ({
  ...item,
  logo: new URL(item.logo, import.meta.url).href,
  link: item.link,
}))

/*****************************************************************************************
 * VARIABLE: ContactLink
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive array of contact items with both `logo` and `link` resolved
 *              to absolute URLs using `import.meta.url` as base.
 *              - Useful when JSON paths are relative to the project.
 * ***************************************************************************************
 * DESCRIPCIÓN: Arreglo reactivo de contactos con `logo` y `link` resueltos a URLs absolutas
 *              usando `import.meta.url` como base.
 *              - Útil cuando las rutas del JSON son relativas al proyecto.
 *****************************************************************************************/
const ContactLink = ref<ContactVM[]>([])
ContactLink.value = Object.values(contactRaw).map((item) => ({
  ...item,
  logo: new URL(item.logo, import.meta.url).href,
  link: new URL(item.link, import.meta.url).href,
}))

/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Promise that resolves once the component is mounted (DOM ready).
 *              - Helpful to synchronize external logic (e.g., Three.js overlay alignment).
 * ***************************************************************************************
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente está montado (DOM listo).
 *              - Útil para sincronizar lógica externa (p. ej., alineación de overlays Three.js).
 *****************************************************************************************/
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(() => resolve())
})

/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Exposes internal references to the parent.
 * ***************************************************************************************/
defineExpose<{
  screen: Ref<HTMLDivElement | null>
  domReady: Promise<void>
}>({
  screen,
  domReady,
})
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
