<!-- src/components/Contact.vue -->
<template>
  <div class="container-fluid contactApplication m-0 p-0">
    <div class="m-0 p-0 mt-5 mb-3 text-start tittle">
      <p class="text-dark ms-3">Contact me</p>
    </div>
    <div class="containerContact">
      <div v-for="(contact, index) in ContactImage" :key="index" class="m-0 p-1 mb-3 contactCard">
        <div
          class="container-fluid d-flex justify-content-between align-items-center"
          @click="getIn(index)"
        >
          <img :src="contact.logo" alt="" class="circulo circulo_border" />
          <div class="text-start texto_contacto">
            <p class="text-dark m-0">{{ contact.name }}</p>
            <div class="text-end">
              <a
                class="text-anchor"
                target="_blank"
                rel="noopener noreferrer"
                :href="contact.link"
                >{{ contact.link }}</a
              >
            </div>
          </div>
          <div class="icono_leido text-dark p-3">
            <span class="tick single"></span>
            <span v-if="clicked[index]" class="tick double"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref, ref, computed, type ComputedRef, watchEffect, onMounted } from 'vue'

const data = inject<Ref<ProvidedData>>('data')
if (!data) throw new Error('No se inyectó "data".')
const screen: Ref<HTMLDivElement | null> = ref(null)

type ContactJSON = {
  logo: string
  link: string
} & Record<string, unknown>
type ProvidedData = {
  contact: Record<string, ContactJSON>
}
type ContactVM = ContactJSON & {
  logo: string
  link: string
}

/*****************************************************************************************
 * CONSTANT: ContactContent
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed reference that exposes the raw contact data from the injected `data`.
 *              - Returns the `contact` record as defined in the provided JSON structure.
 *              - Serves as the base source for building other derived states such as
 *                `contactKeys`, `ContactImage`, and `ContactLink`.
 * ***************************************************************************************
 * CONSTANTE: ContactContent
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Referencia computada que expone los datos crudos de contactos desde `data` inyectado.
 *              - Retorna el registro `contact` según lo definido en la estructura JSON provista.
 *              - Sirve como base para construir otros estados derivados como
 *                `contactKeys`, `ContactImage` y `ContactLink`.
 *****************************************************************************************/
const ContactContent: ComputedRef<Record<string, ContactJSON>> = computed(() => data.value.contact)
/*****************************************************************************************
 * CONSTANT: contactKeys
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed reference that extracts all keys from `ContactContent`.
 *              - Produces an array of strings representing the contact identifiers.
 *              - Useful for iteration, indexing, or building parallel reactive arrays.
 * ***************************************************************************************
 * CONSTANTE: contactKeys
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Referencia computada que extrae todas las claves de `ContactContent`.
 *              - Genera un arreglo de strings que representan los identificadores de contactos.
 *              - Útil para iteración, indexación o construcción de arreglos reactivos paralelos.
 *****************************************************************************************/
const contactKeys = computed(() => Object.keys(ContactContent.value))
/*****************************************************************************************
 * VARIABLE: ContactImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive array of contact items where `logo` is resolved to an absolute URL.
 *              - Builds the list from `data.value.contact` (typed as a record).
 *              - Preserves `link` exactly as provided in the JSON (no transformation).
 *              - Returns a strongly-typed ContactVM[] for safe template iteration.
 * ***************************************************************************************
 * DESCRIPCIÓN: Arreglo reactivo de contactos donde `logo` se resuelve a una URL absoluta.
 *              - Construye la lista desde `data.value.contact` (tipado como record).
 *              - Mantiene `link` tal como viene en el JSON (sin transformación).
 *              - Retorna un ContactVM[] tipado para iteración segura en el template.
 *****************************************************************************************/
const ContactImage = computed<ContactVM[]>(() => {
  if (!data?.value?.contact) return []
  const raw = data.value.contact as Record<string, ContactJSON>
  return Object.values(raw).map((item) => ({
    ...item,
    logo: new URL(item.logo, import.meta.url).href,
    link: item.link,
  }))
})
/*****************************************************************************************
 * VARIABLE: ContactLink
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive array of contact items with both `logo` and `link` resolved
 *              to absolute URLs using `import.meta.url` as base when paths are relative.
 *              - If the JSON already provides an absolute URL, it is preserved as-is.
 *              - Useful when JSON paths are stored relative to the project structure.
 * ***************************************************************************************
 * DESCRIPCIÓN: Arreglo reactivo de contactos con `logo` y `link` resueltos a URLs absolutas
 *              usando `import.meta.url` como base cuando las rutas son relativas.
 *              - Si el JSON ya provee una URL absoluta, se conserva tal cual.
 *              - Útil cuando las rutas del JSON se guardan relativas a la estructura del proyecto.
 *****************************************************************************************/
const ContactLink = computed<ContactVM[]>(() => {
  if (!data?.value?.contact) return []
  const raw = data.value.contact as Record<string, ContactJSON>
  return Object.values(raw).map((item) => ({
    ...item,
    logo: new URL(item.logo, import.meta.url).href,
    link: new URL(item.link, import.meta.url).href,
  }))
})

const clicked = ref<boolean[]>([])

/*****************************************************************************************
 * WATCHER: clicked initialization
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive effect that synchronizes the `clicked` array length with the
 *              number of available contacts.
 *              - Rebuilds `clicked` whenever `contactKeys` changes.
 *              - Ensures that each contact has a corresponding boolean state initialized to `false`.
 * ***************************************************************************************
 * DESCRIPCIÓN: Efecto reactivo que sincroniza la longitud del arreglo `clicked` con la
 *              cantidad de contactos disponibles.
 *              - Reconstruye `clicked` cada vez que cambia `contactKeys`.
 *              - Garantiza que cada contacto tenga un estado booleano correspondiente inicializado en `false`.
 *****************************************************************************************/
watchEffect(() => {
  clicked.value = Array(contactKeys.value.length).fill(false)
})

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
 * FUNCTION: getIn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Marks the contact at the given index as "clicked" by setting its state
 *              to true in the `clicked` array. Also logs the contact's name to the console.
 * ***************************************************************************************
 * DESCRIPCIÓN: Marca el contacto en el índice dado como "clicado" estableciendo su estado
 *              en true dentro del arreglo `clicked`. Además, muestra en consola el nombre
 *              del contacto.
 *****************************************************************************************/
function getIn(index: number): void {
  clicked.value[index] = true
}

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

<style scoped lang="scss">
@use '@/styles/colors' as *;

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
  background-color: rgb(245, 243, 240);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
}
.tittle {
  width: 100%;
}
.containerContact {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  overflow: scroll;
}
.texto_contacto {
  width: 65%;
  padding-left: 0.5rem;
}
.icono_leido {
  width: 10%;
}
.tittle {
  font-size: 1.5rem;
}
.circulo {
  border-radius: 50%;
  width: 3.5rem;
}
.circulo_border {
  border: 0.25rem solid $WhatsAppGreen;
}
.contactCard {
  width: 97%;
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
.tick {
  display: inline-block;
  width: 2rem;
  height: 1rem;
  position: relative;
}
.tick::before,
.tick::after {
  content: '';
  position: absolute;
  background: $WhatsAppBlue;
  border-radius: 0.1rem;
}
.tick::before {
  width: 0.15rem;
  height: 0.35rem;
  transform: rotate(-45deg);
  top: 0.35rem;
  left: 0.09rem;
}
.tick::after {
  width: 0.15rem;
  height: 0.6rem;
  transform: rotate(45deg);
  top: 0.08rem;
  left: 0.35rem;
}
.tick.double::before {
  display: none;
}
.tick.double::after {
  top: -1.3rem;
  left: 0.55rem;
}
</style>
