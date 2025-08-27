<!-- src\components\TabletContent.vue -->
<template>
  <div ref="screen" class="screen-content">
    <BackButton
      v-if="redirectStore.current !== 'Init'"
      @change-screen="toReturn"
      class="back-button"
    />
    <component :is="currentView" @change-screen="handleChangeScreen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, type Ref, type ShallowRef, watch } from 'vue'
import { useRedirectStore, type ScreenName } from '@/stores/useRedirect'
import { useLastScreen } from '@/stores/useLastScreen'
import type { Component } from 'vue'

import BackButton from '@/components/CommonComponents/BackButton.vue'
import Init from './TabletScreens/Init.vue'
import About from './TabletScreens/About.vue'
import Skills from './TabletScreens/Skills.vue'
import Experience from './TabletScreens/Experience.vue'
import Projects from './TabletScreens/Projects.vue'
import Contact from './TabletScreens/Contact.vue'
import Blog from './Blog.vue'

const screen: Ref<HTMLDivElement | null> = ref(null)
const redirectStore = useRedirectStore()
const lastScreen = useLastScreen()
const views: Record<ScreenName, Component> = {
  Init,
  About,
  Skills,
  Experience,
  Projects,
  Contact,
  Blog,
} as const satisfies Record<string, Component>

/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: A Promise that resolves when the component is mounted.
 *              - Useful for synchronizing external logic that depends on DOM readiness.
 *              - Commonly used in combination with 3D rendering or overlay alignment.
 * ***************************************************************************************
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente ha sido montado.
 *              - Útil para sincronizar lógica externa que depende del DOM ya renderizado.
 *              - Comúnmente utilizada junto con renderizado 3D o posicionamiento de overlays.
 *****************************************************************************************/
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(resolve)
})

/*****************************************************************************************
 * VARIABLE: currentView
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Holds the currently active screen/component displayed on the tablet.
 *              - Initialized to `Init` by default.
 *              - Updated dynamically via `handleChangeScreen()`.
 * ***************************************************************************************
 * DESCRIPCIÓN: Contiene la vista o componente actualmente activo en la pantalla de la tablet.
 *              - Inicialmente se asigna a `Init`.
 *              - Se actualiza dinámicamente mediante `handleChangeScreen()`.
 *****************************************************************************************/
const currentView: ShallowRef<Component> = shallowRef(Init as Component)

/*****************************************************************************************
 * WATCHER: redirectStore.current
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Observes changes in the active screen name stored in `redirectStore`.
 *              - When `current` changes, updates `currentView` with the corresponding
 *                Vue component from the `views` map.
 *              - Ensures that the displayed screen in the tablet always matches
 *                the current navigation state.
 * ***************************************************************************************
 * OBSERVADOR: redirectStore.current
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Observa los cambios en el nombre de pantalla activa almacenado en `redirectStore`.
 *              - Cuando `current` cambia, actualiza `currentView` con el componente Vue
 *                correspondiente desde el mapa `views`.
 *              - Garantiza que la pantalla mostrada en la tablet coincida siempre con
 *                el estado de navegación actual.
 *****************************************************************************************/
watch(
  () => redirectStore.current,
  (newView: ScreenName) => {
    currentView.value = views[newView] || Init
  },
  { immediate: true },
)

/*****************************************************************************************
 * FUNCTION: handleChangeScreen
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Switches the active screen by name.
 *              - Accepts the screen name (key of `views`), not a component.
 *              - Saves the previous screen in the store to support Back navigation.
 *              - Updates `redirectStore.current`; the watcher re-renders `currentView`.
 * ***************************************************************************************
 * DESCRIPCIÓN: Cambia la pantalla activa por nombre.
 *              - Recibe el nombre de la vista (key de `views`), no un componente.
 *              - Guarda la pantalla anterior en el store para permitir el botón Back.
 *              - Actualiza `redirectStore.current`; el watcher re-renderiza `currentView`.
 *****************************************************************************************/
const handleChangeScreen = (newView: keyof typeof views): void => {
  lastScreen.changeLastScreen(newView)
  currentView.value = views[newView] || Init
  redirectStore.current = newView
}

/*****************************************************************************************
 * FUNCTION: toReturn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles Back navigation logic.
 *              - If the last screen differs from the current one, navigates back to it.
 *              - If both are the same, resets the flow to 'Init'.
 *              - Ensures that the user can always return to a valid screen state.
 * ***************************************************************************************
 * DESCRIPCIÓN: Maneja la lógica de navegación al presionar Back.
 *              - Si la última pantalla difiere de la actual, navega hacia ella.
 *              - Si ambas coinciden, reinicia el flujo a 'Init'.
 *              - Garantiza que el usuario siempre regrese a un estado de pantalla válido.
 *****************************************************************************************/
const toReturn = (): void => {
  if (lastScreen.lastScreen !== redirectStore.current) {
    redirectStore.current = lastScreen.lastScreen
  } else {
    lastScreen.changeLastScreen('Init')
    redirectStore.current = 'Init'
  }
}

/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Exposes internal reactive references to the parent component.
 *              - Makes `screen` (DOM reference) and `domReady` (Promise) accessible externally.
 *              - Enables integration with Three.js overlay logic or positioning systems.
 * ***************************************************************************************
 * DESCRIPCIÓN: Expone referencias reactivas internas al componente padre.
 *              - Permite el acceso externo a `screen` (referencia al DOM) y `domReady` (Promesa).
 *              - Facilita la integración con lógica de Three.js o sistemas de posicionamiento.
 *****************************************************************************************/
defineExpose({
  screen,
  domReady,
})
</script>

<style scoped>
.screen-content {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.back-button {
  z-index: 9999; /* más alto que cualquier imagen */
}
</style>
