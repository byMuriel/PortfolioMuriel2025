<template>
  <div ref="screen" class="screen-content">
    <BackButton v-if="currentView != Init" @change-screen="handleChangeScreen"></BackButton>
    <component :is="currentView" @change-screen="handleChangeScreen" />
  </div>
</template>

<script setup>
/*****************************************************************************************
 * SCRIPT SETUP: TabletScreen.vue
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles the display logic for 3D tablet content.
 *              - Imports Vue components representing different views/screens.
 *              - Initializes the default view (`Init`) using `shallowRef` for dynamic rendering.
 *              - Creates a reactive DOM reference to the screen container.
 *              - Exposes a `domReady` Promise that resolves once the component is mounted.
 *              - Defines `handleChangeScreen` to dynamically switch between views.
 *              - Exposes `screen` and `domReady` for external access via `defineExpose`.
 * ***************************************************************************************
 * DESCRIPCIÓN: Gestiona la lógica de visualización del contenido dentro de la tablet 3D.
 *              - Importa los componentes Vue que representan las distintas pantallas o vistas.
 *              - Inicializa la vista por defecto (`Init`) usando `shallowRef` para renderizado dinámico.
 *              - Crea una referencia reactiva al contenedor DOM de la pantalla.
 *              - Expone una promesa `domReady` que se resuelve cuando el componente está montado.
 *              - Define `handleChangeScreen` para cambiar dinámicamente entre vistas.
 *              - Expone `screen` y `domReady` para que puedan ser accedidos desde el componente padre.
 *****************************************************************************************/
import { ref, onMounted, shallowRef } from 'vue'

import BackButton from '@/components/CommonComponents/BackButton.vue'
import Init from './TabletScreens/Init.vue'
import About from './TabletScreens/About.vue'
import Skills from './TabletScreens/Skills.vue'
import Experience from './TabletScreens/Experience.vue'
import Projects from './TabletScreens/Projects.vue'
import Contact from './TabletScreens/Contact.vue'
import Blog from './Blog.vue'

const screen = ref(null)
const views = { Init, About, Skills, Experience, Projects, Contact, Blog }

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
const domReady = new Promise((resolve) => {
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
const currentView = shallowRef(Init)

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
const handleChangeScreen = (newView) => {
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
</style>
