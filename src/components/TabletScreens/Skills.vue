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
      <Transition name="fade-out">
        <button
          class="arrowBtn left"
          v-show="!selectedSkill && arrows[cat] && arrows[cat].left"
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
        :ref="(el) => registerScroller(cat, el as HTMLDivElement | null)"
      >
        <div
          v-for="skill in byCategory(cat)"
          :key="skill.name"
          class="m-0 p-0 skillCard"
          @click="openSkill(skill)"
        >
          <img :src="skill.logo ?? FALLBACK_LOGO" :alt="skill.name" class="imgLogo" />
        </div>
      </div>

      <!-- Boton right displacement -->
      <Transition name="fade-out">
        <button
          class="arrowBtn right"
          v-show="!selectedSkill && arrows[cat] && arrows[cat].right"
          @click="nudge(cat, 1)"
          aria-label="Desplazar a la derecha"
        >
          ›
        </button>
      </Transition>
    </div>

    <!-- Fullscreen Skill Viewer -->
    <Transition name="fade-skill">
      <div v-if="selectedSkill" class="skillOverlay" @click.self="closeSkill">
        <div class="skillOverlayContent">
          <img
            :src="selectedSkill.logo ?? FALLBACK_LOGO"
            :alt="selectedSkill.name"
            class="skillOverlayImg"
            @error="onImgError"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Skills' })

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useSkillsStore } from '@/stores/useSkills'
import { useRedirectStore } from '@/stores/useRedirect'

type Side = { left: boolean; right: boolean }
type SkillItem = ReturnType<typeof store.byCategory>[number]
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
const touchedRight = ref<Record<string, boolean>>({})
const selectedSkill = ref<SkillItem | null>(null)

/*****************************************************************************************
 * WATCHER: displayCategories
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reacts to changes in the visible skill categories and refreshes arrow state.
 *              - Waits for the DOM update with nextTick().
 *              - Iterates all registered scrollers and calls scheduleArrows for each one.
 *
 * DESCRIPCIÓN: Reacciona a cambios en las categorías visibles de skills y actualiza el
 *              estado de las flechas.
 *              - Espera a que el DOM se actualice con nextTick().
 *              - Recorre todos los scrollers registrados y ejecuta scheduleArrows en cada uno.
 *****************************************************************************************/
watch(displayCategories, async () => {
  await nextTick()
  Object.keys(scrollers).forEach(scheduleArrows)
})
/*****************************************************************************************
 * FUNCTION: onImgError
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles image load failures by swapping the source for a fallback image.
 *              - Removes the error handler to avoid infinite loops.
 *              - Uses '/fallbacks/app-default.png' as the placeholder.
 *
 * DESCRIPCIÓN: Maneja fallos de carga de imágenes reemplazando la fuente por una imagen
 *              de respaldo.
 *              - Elimina el handler de error para evitar bucles infinitos.
 *              - Usa '/fallbacks/app-default.png' como placeholder.
 *****************************************************************************************/
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Redirects the user to a different app/route inside the tablet.
 *              - Delegates navigation logic to the redirect store.
 *
 * DESCRIPCIÓN: Redirige al usuario a otra app/ruta dentro de la tablet.
 *              - Delega la lógica de navegación al store de redirecciones.
 *****************************************************************************************/
function go(to: string) {
  useRedirectStore().redirect(to)
}
/*****************************************************************************************
 * FUNCTION: registerScroller
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Registers a horizontal scroller element for a skill category.
 *              - Stores the element in the scrollers map by category.
 *              - Attaches a passive 'scroll' listener to recalculate arrow visibility.
 *              - Saves a _cleanup function on the element to remove the listener later.
 *              - Immediately calls scheduleArrows to set initial arrow state.
 *
 * DESCRIPCIÓN: Registra un contenedor desplazable horizontal para una categoría de skills.
 *              - Guarda el elemento en el mapa scrollers bajo su categoría.
 *              - Añade un listener 'scroll' en modo passive para recalcular las flechas.
 *              - Guarda una función _cleanup en el elemento para quitar el listener luego.
 *              - Llama a scheduleArrows de inmediato para definir el estado inicial.
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
 * DESCRIPTION: Scrolls the skills list horizontally in the given direction.
 *              - Uses ~80% of the visible width as the scroll step.
 *              - Applies smooth scrolling behavior.
 *              - After a short delay, re-evaluates arrow visibility with scheduleArrows.
 *
 * DESCRIPCIÓN: Desplaza horizontalmente la lista de skills en la dirección indicada.
 *              - Usa ~80% del ancho visible como paso de desplazamiento.
 *              - Aplica un scroll suave (smooth).
 *              - Tras un breve retraso, vuelve a evaluar las flechas con scheduleArrows.
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
 * DESCRIPTION: Schedules a recalculation of arrow visibility for a category scroller.
 *              - Uses requestAnimationFrame to batch DOM reads/writes efficiently.
 *              - Detects if there is horizontal overflow; if not, hides both arrows.
 *              - Determines if the user is at the start or end of the scroll range.
 *              - Updates the arrows reactive map and the atRight flag accordingly.
 *
 * DESCRIPCIÓN: Programa el recálculo de la visibilidad de flechas para un scroller.
 *              - Usa requestAnimationFrame para agrupar lecturas/escrituras de DOM.
 *              - Detecta si hay overflow horizontal; si no, oculta ambas flechas.
 *              - Determina si el usuario está al inicio o al final del rango de scroll.
 *              - Actualiza el mapa reactivo arrows y la bandera atRight según corresponda.
 *****************************************************************************************/
function scheduleArrows(cat: string) {
  if (scheduled.has(cat)) return

  const el = scrollers[cat]
  if (!el) return

  const id = requestAnimationFrame(() => {
    scheduled.delete(cat)

    const scrollWidth = el.scrollWidth
    const clientWidth = el.clientWidth
    const scrollLeft = el.scrollLeft

    const EPS_START = 80
    const EPS_END = 2

    const max = Math.max(0, scrollWidth - clientWidth)
    const hasOverflow = max > EPS_END

    if (!hasOverflow) {
      arrows.value[cat] = { left: false, right: false }
      atRight.value[cat] = false
      return
    }

    const atStart = scrollLeft <= EPS_START
    const atEnd = scrollLeft >= max - EPS_END

    const next = {
      left: !atStart,
      right: !atEnd,
    }

    const prev = arrows.value[cat]
    if (!prev || prev.left !== next.left || prev.right !== next.right) {
      arrows.value[cat] = next
    }

    atRight.value[cat] = atEnd
  })

  scheduled.set(cat, id)
}

/*****************************************************************************************
 * FUNCTION: openSkill
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Opens the fullscreen viewer for a selected skill card.
 *              - Stores the clicked skill in the selectedSkill ref.
 *
 * DESCRIPCIÓN: Abre el visor a pantalla completa para una skill seleccionada.
 *              - Guarda la skill clicada en la ref selectedSkill.
 *****************************************************************************************/
function openSkill(skill: SkillItem) {
  selectedSkill.value = skill
}
/*****************************************************************************************
 * FUNCTION: closeSkill
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Closes the fullscreen skill viewer.
 *              - Resets selectedSkill to null.
 *
 * DESCRIPCIÓN: Cierra el visor a pantalla completa de la skill.
 *              - Resetea selectedSkill a null.
 *****************************************************************************************/
function closeSkill() {
  selectedSkill.value = null
}
/*****************************************************************************************
 * FUNCTION: handleBack
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles the back action coming from the parent tablet container.
 *              - If a skill is open in the fullscreen overlay, it closes it and
 *                returns true (meaning the back was consumed locally).
 *              - If no overlay is open, returns false so the parent can navigate.
 *
 * DESCRIPCIÓN: Maneja la acción de "volver" que llega desde el contenedor padre.
 *              - Si hay una skill abierta en el overlay, la cierra y devuelve true
 *                (indicando que el back se gestionó localmente).
 *              - Si no hay overlay abierta, devuelve false para que el padre navegue.
 *****************************************************************************************/
function handleBack(): boolean {
  if (selectedSkill.value) {
    closeSkill()
    return true
  }
  return false
}

/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes the skills module when the component is mounted.
 *              - Loads the skills store only if the data is not fresh.
 *              - Waits for the next DOM tick before allowing scroll/arrow logic to run.
 *
 * DESCRIPCIÓN: Inicializa el módulo de skills cuando el componente se monta.
 *              - Carga el store de skills solo si los datos no están frescos.
 *              - Espera al siguiente tick del DOM antes de permitir la lógica de scroll/flechas.
 *****************************************************************************************/
onMounted(async () => {
  if (!store.isFresh) {
    await store.load()
  }
  await nextTick()
})
/*****************************************************************************************
 * LIFECYCLE: onBeforeUnmount
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Cleans up resources before the component is destroyed.
 *              - Iterates all registered scrollers and calls their _cleanup function
 *                (if present) to remove scroll listeners and avoid memory leaks.
 *
 * DESCRIPCIÓN: Libera recursos antes de que el componente sea destruido.
 *              - Recorre todos los scrollers registrados y ejecuta su función _cleanup
 *                (si existe) para quitar los listeners de scroll y evitar fugas de memoria.
 *****************************************************************************************/
onBeforeUnmount(() => {
  Object.values(scrollers).forEach((el) => {
    if (el && (el as any)._cleanup) (el as any)._cleanup()
  })
})

defineExpose({ nudge, registerScroller, handleBack })
</script>

<style scoped>
.skillsApplication {
  position: relative;
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
.fade--enter-from {
  opacity: 0;
  transform: translateX(-6px);
}
.fade--enter-active {
  transition:
    opacity 700ms ease,
    transform 700ms ease;
}
.fade--enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade--leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade--leave-active {
  transition:
    opacity 900ms ease,
    transform 900ms ease;
}
.fade--leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

/* Overlay pantalla completa para la skill */
.skillOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  z-index: 15; /* menor que el BackButton global, para que siga viéndose */
}
.skillOverlayContent {
  width: 100%;
  height: 100%;
  max-width: 26rem;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 1.2rem;
}
.skillOverlayImg {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
}
.fade-skill-enter-from,
.fade-skill-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.fade-skill-enter-active,
.fade-skill-leave-active {
  transition:
    opacity 200ms ease-out,
    transform 200ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .fade-o-enter-active,
  .fade-o-leave-active {
    transition: none;
  }
}
@media (hover: none) and (pointer: coarse), (max-width: 768px) {
  .containerSkills {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
  }
}
</style>
