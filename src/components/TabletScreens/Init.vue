<!-- src/components/TabletScreens/Init.vue -->
<template>
  <div ref="screen" class="initWrapper">
    <img class="wallpaper" :src="assets.icons.wallpaper" alt="Init Wallpaper" />
    <div class="container-fluid initContent m-0 p-0">
      <div class="clock-container">
        <div class="clock-time">
          <p>{{ currentTime }}</p>
        </div>
        <div class="clock-date">
          <p>{{ currentDate }}</p>
        </div>
      </div>
      <div class="icon-grid mt-3" v-if="assets.initIconsReady">
        <button class="btn app-button" @click="goTo('about')">
          <img class="tamanioIconoApp" :src="assets.icons.about" alt="About" />
        </button>
        <button class="btn app-button" @click="goTo('projects')">
          <img class="tamanioIconoApp" :src="assets.icons.projects" alt="Projects" />
        </button>
        <button class="btn app-button" @click="goTo('experience')">
          <img class="tamanioIconoApp" :src="assets.icons.experience" alt="Experience" />
        </button>
        <button class="btn app-button" @click="goTo('skills')">
          <img class="tamanioIconoApp" :src="assets.icons.skills" alt="Skills" />
        </button>
        <button class="btn app-button" @click="goTo('contact')">
          <img class="tamanioIconoApp" :src="assets.icons.contact" alt="Contact" />
        </button>
        <button class="btn app-button" @click="goTo('blog')">
          <img class="tamanioIconoApp" :src="assets.icons.blog" alt="Blog" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'
import { useAssetsPreload } from '@/stores/useAssetsPreload'
import { useRouter } from 'vue-router'

type RouteKey = 'skills' | 'experience' | 'about' | 'projects' | 'contact' | 'blog' | 'contactEmail'
type ViewKey = 'Skills' | 'Experience' | 'About' | 'Projects' | 'Contact' | 'Blog' | 'ContactEmail'
const assets = useAssetsPreload()
const router = useRouter()

const currentTime: Ref<string> = ref('')
const currentDate: Ref<string> = ref('')
const screen: Ref<HTMLDivElement | null> = ref(null)

/*****************************************************************************************
 * EMITTER: defineEmits (change-screen)
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Strongly-typed event emitter for screen navigation.
 *              - Event: 'change-screen'
 *              - Payload: view (ViewKey) → 'Skills' | 'Experience' | 'About' | 'Projects' | 'Contact' | 'Blog'
 * ***************************************************************************************
 * DESCRIPCIÓN: Emisor de eventos tipado para la navegación entre pantallas.
 *              - Evento: 'change-screen'
 *              - Carga útil: view (ViewKey) → 'Skills' | 'Experience' | 'About' | 'Projects' | 'Contact' | 'Blog'
 *****************************************************************************************/
const emit = defineEmits<{
  (e: 'change-screen', view: ViewKey): void
}>()
/*****************************************************************************************
 * FUNCTION: goTo
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation between different tablet screens based on a route keyword.
 *              - Emits a `change-screen` event with the appropriate view name.
 *              - Supports the following route values: "skills", "experience", "about",
 *                "projects", "contact", and "blog".
 *
 * DESCRIPCIÓN: Maneja la navegación entre diferentes pantallas de la tablet según una palabra clave.
 *              - Emite un evento `change-screen` con el nombre de la vista correspondiente.
 *              - Soporta los siguientes valores de ruta: "skills", "experience", "about",
 *                "projects", "contact" y "blog".
 *****************************************************************************************/
const goTo = (route: RouteKey): void => {
  if (route === 'skills') emit('change-screen', 'Skills')
  else if (route === 'experience') emit('change-screen', 'Experience')
  else if (route === 'about') emit('change-screen', 'About')
  else if (route === 'projects') emit('change-screen', 'Projects')
  else if (route === 'contact') emit('change-screen', 'Contact')
  else if (route === 'contactEmail') emit('change-screen', 'ContactEmail')
  else if (route === 'blog') router.push({ name: 'BlogView' })
}
/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: A Promise that resolves when the component has been mounted.
 *              - Useful for delaying operations until the DOM is ready.
 *              - Used in conjunction with `defineExpose()` to allow parent access.
 * ***************************************************************************************
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente ha sido montado.
 *              - Útil para retrasar operaciones hasta que el DOM esté listo.
 *              - Se utiliza junto con `defineExpose()` para permitir el acceso desde el padre.
 *****************************************************************************************/
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(resolve)
})
/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Makes internal variables accessible to the parent component.
 *              - Exposes `screen` (DOM reference) and `domReady` (Promise).
 * ***************************************************************************************
 * DESCRIPCIÓN: Expone variables internas al componente padre.
 *              - Expone `screen` (referencia al DOM) y `domReady` (Promesa).
 *****************************************************************************************/
defineExpose<{
  screen: Ref<HTMLDivElement | null>
  domReady: Promise<void>
}>({
  screen,
  domReady,
})
/*****************************************************************************************
 * FUNCTION: updateTime
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Updates the reactive `currentTime` variable with the current time in HH:mm format.
 *              - Pads hours and minutes with leading zeros if needed.
 *              - Used to keep a live digital clock on the screen.
 * ***************************************************************************************
 * DESCRIPCIÓN: Actualiza la variable reactiva `currentTime` con la hora actual en formato HH:mm.
 *              - Rellena con ceros a la izquierda si es necesario.
 *              - Se utiliza para mantener un reloj digital en la pantalla.
 *****************************************************************************************/
const updateTime = (): void => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}
/*****************************************************************************************
 * FUNCTION: updateDate
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Updates the reactive `currentDate` variable with the current date
 *              formatted as 'Day, DD Month' (e.g., 'Sun, 04 August').
 *              - Retrieves day and month names from predefined arrays.
 *              - Pads the day number with a leading zero.
 * ***************************************************************************************
 * DESCRIPCIÓN: Actualiza la variable reactiva `currentDate` con la fecha actual
 *              formateada como 'Day, DD Month' (ej: 'Sun, 04 August').
 *              - Obtiene los nombres del día y del mes desde arreglos predefinidos.
 *              - Rellena con cero a la izquierda el número del día.
 *****************************************************************************************/
const updateDate = (): void => {
  const now = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ] as const

  const dayName = days[now.getDay()]
  const dayNumber = String(now.getDate()).padStart(2, '0')
  const monthName = months[now.getMonth()]
  currentDate.value = `${dayName}, ${dayNumber} ${monthName}`
}
let timer: ReturnType<typeof setInterval> | null = null
/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Runs once the component is mounted to the DOM.
 *              - Initializes the clock by calling `updateTime()` and `updateDate()`.
 *              - Starts a timer to update the time every 60 seconds.
 * ***************************************************************************************
 * DESCRIPCIÓN: Se ejecuta una vez que el componente ha sido montado en el DOM.
 *              - Inicializa el reloj llamando a `updateTime()` y `updateDate()`.
 *              - Inicia un temporizador para actualizar la hora cada 60 segundos.
 *****************************************************************************************/
onMounted((): void => {
  updateTime()
  updateDate()
  timer = window.setInterval(updateTime, 60_000)
})
/*****************************************************************************************
 * LIFECYCLE HOOK: onBeforeUnmount
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Runs just before the component is destroyed.
 *              - Clears the interval timer used to update the clock.
 *              - Prevents memory leaks from lingering timers.
 * ***************************************************************************************
 * DESCRIPCIÓN: Se ejecuta justo antes de que el componente sea destruido.
 *              - Limpia el temporizador usado para actualizar el reloj.
 *              - Previene fugas de memoria por temporizadores activos.
 *****************************************************************************************/
onBeforeUnmount((): void => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
.initWrapper {
  position: relative;
  width: 100%;
  height: var(--app-height);
  max-height: var(--app-height);
  overflow: hidden;
  isolation: isolate;
}
.wallpaper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  display: block;
}
.initContent {
  position: relative;
  z-index: 1;
}
.clock-container {
  width: 90%;
  height: 20%;
  background-color: rgba(3, 3, 3, 0.3);
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  margin: 2rem auto 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.clock-time {
  width: 100%;
  height: 70%;
  font-family:
    'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
    sans-serif;
  font-weight: bolder;
  font-size: 3.5rem;
  margin: 0rem;
}
.clock-date {
  width: 100%;
  height: 30%;
  font-family:
    'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
    sans-serif;
  font-weight: bolder;
  font-size: 1rem;
  margin: 0;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  justify-items: center;
  padding: 1rem;
}
.tamanioIconoApp {
  width: 6rem;
}
.icon {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
.app-button {
  background: none;
  border: none;
  padding: 0;
  border-radius: 20px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.app-button:hover {
  transform: scale(1.07);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  cursor: pointer;
}
.app-button:active {
  transform: scale(0.95);
  transition: transform 0.05s ease;
}
@keyframes popIn {
  0% {
    opacity: 0.5;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.app-button {
  animation: popIn 0.4s ease forwards;
}
.initContent {
  min-height: 100dvh;
  justify-content: start;
}

@media (max-width: 640px) {
  .clock-container {
    height: 25%;
  }
  .initContent {
    min-height: var(--app-height);
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .icon-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
    justify-items: center;
    align-content: center;
    margin: 0 auto;
    width: 100%;
    max-width: 450px;
  }
  .tamanioIconoApp {
    width: 7.5rem;
  }
  .app-button {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    border-radius: 25px;
  }
  .clock-time {
    font-size: 5rem;
  }
  .clock-date {
    font-size: 1.5rem;
  }
}
</style>
