<!-- src/components/Skills.vue -->
<template>
  <div class="container-fluid skillsApplication">
    <!-- Tools Buttons -->
    <div class="tools">
      <div class="m-0 p-0 logo">
        <img
          v-if="logoSkills"
          :src="logoSkills"
          alt="Skills logo"
          class="logoPrinc"
          @error="onImgError"
        />
        <span class="m-o p-0 title">Skills</span>
      </div>

      <div class="d-flex justify.content-between">
        <i @click="go('Init')" class="bi bi-house-door"></i>

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
    <!-- Skills Content -->
    <div v-for="cat in displayCategories" :key="cat" class="categoryBlock">
      <p class="categoryTitle">{{ cat }}</p>
      <!-- Button left displacement -->
      <Transition name="fade-left">
        <button
          class="arrowBtn left"
          v-show="arrows[cat] && arrows[cat].left && atRight[cat]"
          @click="nudge(cat, -1)"
          aria-label="Desplazar a la izquierda"
        >
          ‹
        </button>
      </Transition>
      <!-- Skills categories -->
      <div
        class="containerSkills"
        :class="{
          'is-short': byCategory(cat).length <= 2,
          'no-arrows': arrows[cat] && !arrows[cat].left && !arrows[cat].right,
        }"
        :ref="(el) => registerScroller(cat, el as HTMLDivElement)"
      >
        <div v-for="skill in byCategory(cat)" :key="skill.name" class="m-0 p-0 skillCard">
          <img :src="skill.logo ?? FALLBACK_LOGO" :alt="skill.name" class="imgLogo" />
        </div>
      </div>
      <!-- Boton right displacement -->
      <button
        class="arrowBtn right"
        v-show="arrows[cat] && arrows[cat].right"
        @click="nudge(cat, 1)"
        aria-label="Desplazar a la derecha"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Skills' })
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useSkillsStore } from '@/stores/useSkills'
import { useRedirectStore } from '@/stores/useRedirect'

type Side = { left: boolean; right: boolean }
const FALLBACK_LOGO = '/assets/SkillsLogos/LogoM.png'
const appLogos = useAppLogosStore()
const store = useSkillsStore()
const logoSkills = computed(() => appLogos.getLogo('skills'))
const displayCategories = computed(() => store.displayCategories)
const byCategory = (cat: string) => store.byCategory(cat)
let scrollers: Record<string, HTMLDivElement | null> = {}
const arrows = ref<Record<string, Side>>({})
const scheduled = new Map<string, number>()
const atRight = ref<Record<string, boolean>>({})

/*****************************************************************************************
 * WATCH: displayCategories
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Watches for changes in the list of visible skill categories.
 *              - Waits for the DOM to update (`nextTick`).
 *              - Recalculates and updates the state of navigation arrows for each category.
 *
 * DESCRIPCIÓN: Observa los cambios en la lista de categorías visibles de habilidades.
 *              - Espera que el DOM se actualice (`nextTick`).
 *              - Recalcula y actualiza el estado de las flechas de navegación para cada
 *                categoría.
 *****************************************************************************************/
watch(displayCategories, async () => {
  await nextTick()
  Object.keys(scrollers).forEach(scheduleArrows)
})
/*****************************************************************************************
 * FUNCTION: onImgError
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles image loading errors by replacing the failed source with a default fallback image.
 *              - Removes the error handler to prevent infinite loops.
 *              - Sets a generic placeholder image when the original fails to load.
 *
 * DESCRIPCIÓN: Maneja los errores de carga de imágenes reemplazando la fuente fallida con una imagen por defecto.
 *              - Elimina el manejador de error para evitar bucles infinitos.
 *              - Asigna una imagen genérica de respaldo cuando la original falla.
 *****************************************************************************************/
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Redirects to another tablet view using the global redirect store.
 *              - Calls the `redirect` method with the given route key.
 *
 * DESCRIPCIÓN: Redirige a otra vista de la tablet usando el store global de redirección.
 *              - Llama al método `redirect` pasando la clave de ruta indicada.
 *****************************************************************************************/
function go(to: string) {
  useRedirectStore().redirect(to)
}
/*****************************************************************************************
 * FUNCTION: registerScroller
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Registers a scrollable container for a given skill category.
 *              - Adds a scroll event listener to track arrow visibility.
 *              - Stores a cleanup callback to remove the listener later.
 *              - Immediately schedules arrow visibility recalculation.
 *
 * DESCRIPCIÓN: Registra un contenedor desplazable para una categoría de habilidades.
 *              - Añade un listener de desplazamiento para controlar la visibilidad de las flechas.
 *              - Guarda una función de limpieza para eliminar el listener posteriormente.
 *              - Programa de inmediato el recálculo de la visibilidad de las flechas.
 *****************************************************************************************/
function registerScroller(cat: string, el: HTMLDivElement | null) {
  scrollers[cat] = el
  if (el) {
    const onScroll = () => scheduleArrows(cat)
    el.addEventListener('scroll', onScroll, { passive: true })
    ;(el as any)._cleanup = () => el.removeEventListener('scroll', onScroll)

    scheduleArrows(cat)
  }
}
/*****************************************************************************************
 * FUNCTION: nudge
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Scrolls the content of a category horizontally in the given direction.
 *              - Moves approximately 80% of the container’s visible width.
 *              - Updates arrow visibility after the scroll completes.
 *
 * DESCRIPCIÓN: Desplaza el contenido de una categoría horizontalmente en la dirección indicada.
 *              - Mueve aproximadamente el 80% del ancho visible del contenedor.
 *              - Actualiza la visibilidad de las flechas después del desplazamiento.
 *****************************************************************************************/
function nudge(cat: string, dir: 1 | -1) {
  const el = scrollers[cat]
  if (!el) return
  const step = el.clientWidth * 0.8 // desplaza ~80% del ancho visible
  el.scrollBy({ left: dir * step, behavior: 'smooth' })

  setTimeout(() => scheduleArrows(cat), 250)
}
/*****************************************************************************************
 * FUNCTION: scheduleArrows
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Calculates and updates arrow visibility for a specific category.
 *              - Uses requestAnimationFrame to optimize updates.
 *              - Determines if the scroll is at the start or end.
 *              - Updates reactive state for both arrow visibility and “at right edge” tracking.
 *
 * DESCRIPCIÓN: Calcula y actualiza la visibilidad de las flechas para una categoría específica.
 *              - Usa requestAnimationFrame para optimizar las actualizaciones.
 *              - Determina si el desplazamiento está al inicio o al final.
 *              - Actualiza el estado reactivo tanto de las flechas como del borde derecho alcanzado.
 *****************************************************************************************/
function scheduleArrows(cat: string) {
  if (scheduled.has(cat)) return

  const el = scrollers[cat]
  if (!el) return

  const id = requestAnimationFrame(() => {
    scheduled.delete(cat)

    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    const EPS = 1
    const atStart = el.scrollLeft <= EPS
    const atEnd = el.scrollLeft >= max - EPS

    // ↳ actualiza flechas
    const next = { left: max > 0 && !atStart, right: max > 0 && !atEnd }
    const prev = arrows.value[cat]
    if (!prev || prev.left !== next.left || prev.right !== next.right) {
      arrows.value[cat] = next
    }

    // ↳ guarda “estoy al borde derecho” por categoría
    if (atRight.value[cat] !== atEnd) atRight.value[cat] = atEnd
  })

  scheduled.set(cat, id)
}
/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes the store data and ensures DOM readiness before rendering arrows.
 *              - Loads store data only if not already loaded.
 *              - Waits for the next DOM update cycle.
 *
 * DESCRIPCIÓN: Inicializa los datos del store y asegura que el DOM esté listo antes de renderizar las flechas.
 *              - Carga los datos del store solo si aún no se han cargado.
 *              - Espera el siguiente ciclo de actualización del DOM.
 *****************************************************************************************/
onMounted(async () => {
  if (!store.isFresh) {
    void store.load()
  }
  await nextTick()
})
/*****************************************************************************************
 * LIFECYCLE: onBeforeUnmount
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Cleans up event listeners and scroll observers before component destruction.
 *              - Iterates over all registered scrollers.
 *              - Invokes each stored cleanup function to remove event listeners.
 *
 * DESCRIPCIÓN: Limpia los listeners de eventos y observadores de scroll antes de destruir el componente.
 *              - Itera sobre todos los scrollers registrados.
 *              - Ejecuta cada función de limpieza almacenada para eliminar los listeners.
 *****************************************************************************************/
onBeforeUnmount(() => {
  Object.values(scrollers).forEach((el) => {
    if (el && (el as any)._cleanup) (el as any)._cleanup()
  })
})

defineExpose({ nudge, registerScroller })
</script>

<style scoped>
.skillsApplication {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  font-family: sans-serif;
  background-color: rgb(43, 42, 42);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding-bottom: 3rem;
}
.categoryBlock {
  position: relative;
  width: 100%;
  margin-top: 2rem;
  padding-block-end: 0.05rem;
}
.categoryTitle {
  margin: 0;
  padding: 0 0 0.5rem 1rem;
  color: rgb(255, 255, 255);
  font-weight: bolder;
}
.containerSkills {
  --gap: 0.6rem;
  --cols-peek: 3.1;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 8rem;
  gap: var(--gap);
  padding-inline: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-left: 2.75rem;
  padding-right: 2.75rem;
  justify-content: flex-start;
  justify-items: start;
}
.containerSkills.is-short {
  padding-left: 1rem;
  padding-right: 1rem;
  scroll-snap-type: none;
}
.containerSkills::-webkit-scrollbar {
  display: none;
}
.skillCard {
  scroll-snap-align: start;
  width: 8rem;
  height: 12rem;
  background: rgb(255, 255, 255);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 1rem;
}
.imgLogo {
  display: block;
  border-radius: 9%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  backface-visibility: hidden;
  margin: 0;
  padding: 0;
}
.title {
  font-size: 1.3rem;
  font-weight: bold;
  font-family: Tahoma, Verdana, sans-serif;
}
.titleSpecificSkill {
  font-size: 1.3rem;
  font-weight: bold;
}
.logo {
  flex: 0 0 auto;
  height: 3.5rem;
  z-index: 10;
  width: 85%;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 10%;
  margin-right: 0.5rem;
}
.tools {
  flex: 0 0 auto;
  height: 3.5rem;
  z-index: 10;
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 10%;
  margin-right: 0.5rem;
}
.toolButton {
  cursor: pointer;
}
.bi {
  height: 10%;
}
.tools span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0rem;
}
.tools .iconContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
}
.tools .iconContainer i {
  display: block;
  line-height: 1;
}
.logoPrinc {
  width: 18%;
}
.dropdown-menu {
  background-color: rgba(58, 58, 58, 0.911);
}
.dropdown-item {
  color: rgb(212, 212, 212);
}
.bi-three-dots-vertical,
.bi-house-door {
  font-size: 1.5rem;
  color: rgb(212, 212, 212);
}
/* Boton displacement */
.arrowBtn {
  position: absolute;
  top: 45%;
  /* top: calc(2rem + 0.25rem); */
  bottom: 4rem;
  width: 1.7rem;
  display: grid;
  place-items: center;
  border: none;
  background: rgba(75, 74, 74, 0.644);
  color: white;
  font-size: 2rem;
  line-height: 1;
  border-radius: 0.75rem;
  cursor: pointer;
  z-index: 5;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  transition:
    opacity 160ms ease,
    background 160ms ease;
  opacity: 0.8;
  z-index: 20;
}
.arrowBtn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.25);
}
.arrowBtn:active {
  transform: scale(0.98);
}
.arrowBtn.left {
  left: 0.25rem;
}
.arrowBtn.right {
  right: 0.25rem;
}
.fade-left-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}
.fade-left-enter-active {
  transition:
    opacity 700ms ease,
    transform 700ms ease;
}
.fade-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-left-leave-active {
  transition:
    opacity 900ms ease,
    transform 900ms ease;
}
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .fade-left-enter-active,
  .fade-left-leave-active {
    transition: none;
  }
}
@media (hover: none) and (pointer: coarse), (max-width: 768px) {
  .arrowBtn {
    display: none !important;
  }
  .containerSkills {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
  }
}
</style>
