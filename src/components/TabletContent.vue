<template>
  <div ref="screen" class="screen-content">
    <BackButton
      v-if="currentView != Init"
      @change-screen="handleChangeScreen"
      class="back-button"
    ></BackButton>
    <component :is="currentView" @change-screen="handleChangeScreen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, type Ref, type ShallowRef } from 'vue'
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
const views = {
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
 * FUNCTION: handleChangeScreen
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Updates the `currentView` variable to switch to a new screen component.
 *              - Accepts a Vue component as a parameter.
 *              - Triggers re-rendering of the displayed screen in the tablet.
 * ***************************************************************************************
 * DESCRIPCIÓN: Actualiza la variable `currentView` para cambiar a una nueva vista o componente.
 *              - Acepta un componente Vue como parámetro.
 *              - Provoca el re-renderizado de la pantalla mostrada en la tablet.
 *****************************************************************************************/
const handleChangeScreen = (newView: keyof typeof views): void => {
  currentView.value = views[newView] || Init
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
