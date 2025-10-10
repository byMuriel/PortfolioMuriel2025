<!-- src/components/Contact.vue -->
<template>
  <div class="container-fluid contactApplication m-0 p-0">
    <!-- Tools -->
    <div class="tools">
      <img class="logoPrinc" :src="store.appLogoUrl" alt="Contact App Logo" />
      <div class="d-flex justify-content-center">
        <span @click="go('Init')" class="d-flex justify-content-center align-items-center">
          <i class="bi bi-house-door"></i>
        </span>
        <div class="dropdown">
          <span
            type="button"
            id="dropdownMenuButton1"
            class="d-flex justify-content-center align-items-center ms-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </span>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li @click="go('About')"><a class="dropdown-item" href="#">About</a></li>
            <li @click="go('Projects')"><a class="dropdown-item" href="#">Projects</a></li>
            <li @click="go('Experience')"><a class="dropdown-item" href="#">Experience</a></li>
            <li @click="go('Skills')"><a class="dropdown-item" href="#">Skills</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="containerContact">
      <div
        v-for="(contact, index) in ContactImage"
        :key="index"
        class="contactCard"
        @click="go(contact.goTo, contact)"
      >
        <div
          class="container-fluid d-flex justify-content-between align-items-center"
          @click="getIn(index)"
        >
          <div class="containerImg">
            <img :src="contact.logo" alt="" class="circulo" />
          </div>

          <div class="texto_contacto">
            <div class="d-flex justify-content-between align-items-center">
              <p class="m-0">
                <strong>{{ contact.name }}</strong>
              </p>
              <p style="font-size: 0.7rem" class="m-2">Today</p>
            </div>

            <div class="d-flex justify-content-start">
              <div>
                <span class="textMessage">
                  {{ contact.message }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref, ref, type ComputedRef, watch, watchEffect, onMounted } from 'vue'
import { useRedirectStore } from '@/stores/useRedirect'
import { useContactChannelsStore } from '@/stores/useContactChannels'

type ContactVM = {
  name: string
  logo: string
  link: string
  goTo: string
  message?: string
}
const screen: Ref<HTMLDivElement | null> = ref(null)
const clicked = ref<boolean[]>([])
const redirectStore = useRedirectStore()
const store = useContactChannelsStore()
const ContactImage = computed<ContactVM[]>(() =>
  store.channels.map((ch) => ({
    name: ch.name,
    logo: ch.logo_url,
    link: ch.link,
    goTo: ch.go_to || '',
    message: ch.message,
  })),
)

/*****************************************************************************************
 * WATCH: ContactImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Observes changes in the `ContactImage` list to reset click interaction states.
 *              - Initializes the `clicked` array with `false` values matching the number of images.
 *              - Ensures all contact images start unclicked when the list updates or mounts.
 *
 * DESCRIPCIÓN: Observa los cambios en la lista `ContactImage` para reiniciar los estados de interacción.
 *              - Inicializa el arreglo `clicked` con valores `false` según la cantidad de imágenes.
 *              - Garantiza que todas las imágenes de contacto comiencen sin estar presionadas al actualizar o montar.
 *****************************************************************************************/
watch(
  ContactImage,
  (list) => {
    clicked.value = Array(list.length).fill(false)
  },
  { immediate: true },
)
/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Loads contact data when the component is mounted.
 *              - Fetches data from the contact store using the key `'contact'`.
 *
 * DESCRIPCIÓN: Carga los datos de contacto al montar el componente.
 *              - Obtiene los datos desde el store de contactos usando la clave `'contact'`.
 *****************************************************************************************/
onMounted(() => {
  void store.load({ appKey: 'contact' })
})
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles redirection logic for contact actions.
 *              - If a route key (`to`) is provided, navigates using the redirect store.
 *              - Otherwise, opens LinkedIn or GitHub links in a new browser tab.
 *
 * DESCRIPCIÓN: Gestiona la lógica de redirección para las acciones de contacto.
 *              - Si se proporciona una clave de ruta (`to`), navega mediante el store de redirección.
 *              - De lo contrario, abre los enlaces de LinkedIn o GitHub en una nueva pestaña del navegador.
 *****************************************************************************************/
function go(to: string, contact?: ContactVM) {
  if (to && to !== '') {
    redirectStore.redirect(to)
    return
  }
  if (contact && (contact.name === 'LinkedIn' || contact.name === 'GitHub')) {
    const url = contact.link?.startsWith('http') ? contact.link : `https://${contact.link ?? ''}`
    window.open(url, '_blank')
  }
}
/*****************************************************************************************
 * FUNCTION: getIn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Marks a contact image as clicked (hovered or focused).
 *              - Updates the `clicked` array at the specified index to `true`.
 *
 * DESCRIPCIÓN: Marca una imagen de contacto como presionada (hover o enfoque).
 *              - Actualiza el arreglo `clicked` en el índice especificado a `true`.
 *****************************************************************************************/
function getIn(index: number): void {
  clicked.value[index] = true
}
/*****************************************************************************************
 * FUNCTION: getOut
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Unmarks a contact image when the pointer leaves or loses focus.
 *              - Updates the `clicked` array at the specified index to `false`.
 *
 * DESCRIPCIÓN: Desmarca una imagen de contacto cuando el puntero sale o pierde el foco.
 *              - Actualiza el arreglo `clicked` en el índice especificado a `false`.
 *****************************************************************************************/
function getOut(index: number): void {
  clicked.value[index] = false
}

const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(() => resolve())
})
defineExpose<{ screen: Ref<HTMLDivElement | null>; domReady: Promise<void> }>({
  screen,
  domReady,
})
</script>

<style scoped lang="scss">
@use '@/styles/colors' as *;

.logoPrinc {
  width: 40%;
}
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
  background-color: rgb(255, 255, 255);
}
.contactApplication::before {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.9);
  z-index: 999;
  pointer-events: none;
}
.tools {
  flex: 0 0 auto;
  height: 4rem;
  background-color: rgb(255, 255, 255);
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-left: 15%;
  padding-right: 1rem;
  gap: 0.5rem;
}
.tittle {
  width: 100%;
  height: fit-content;
  font-weight: bolder;
  font-family: sans-serif;
}
i {
  font-size: 1.5rem;
  color: #1a1919;
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
  width: 80%;
  padding-left: 0.5rem;
  color: #1a1919;
  font-family: 'Trebuchet MS', Calibri, Arial;
}
.textMessage {
  font-weight: lighter;
  font-family: Calibri, Arial;
}
.icono_leido {
  width: 10%;
}
.tittle {
  font-size: 1.5rem;
}
.containerImg {
  width: 3rem;
  height: 3rem;
}
.circulo {
  border-radius: 50%;
  width: 3.5rem;
}

.contactCard {
  width: 97%;
  background-color: rgba(255, 255, 255, 0.65);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  cursor: pointer;
  margin-bottom: 2rem;
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
  background-color: $WhatsAppBlue;
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
