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
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useAboutStore } from '@/stores/useAbout'
import { useSkillsStore } from '@/stores/useSkills'
import { useProjectsStore } from '@/stores/useProjects'
import { useExperiencesStore } from '@/stores/useExperiences'
import { useContactChannelsStore } from '@/stores/useContactChannels'
import type { Component } from 'vue'
import BackButton from '@/components/CommonComponents/BackButton.vue'
import Init from './TabletScreens/Init.vue'
import About from './TabletScreens/About.vue'
import Skills from './TabletScreens/Skills.vue'
import Experience from './TabletScreens/Experience.vue'
import Projects from './TabletScreens/Projects.vue'
import Contact from './TabletScreens/Contact.vue'
import ContactEmail from './TabletScreens/ContactEmail.vue'
import Blog from './Blog.vue'

const appLogosStore = useAppLogosStore()
const redirectStore = useRedirectStore()
const lastScreen = useLastScreen()
const aboutStore = useAboutStore()
const skillsStore = useSkillsStore()
const projectsStore = useProjectsStore()
const experiencesStore = useExperiencesStore()
const contactChannelsStore = useContactChannelsStore()
const views: Record<ScreenName, Component> = {
  Init,
  About,
  Skills,
  Experience,
  Projects,
  Contact,
  ContactEmail,
  Blog,
} as const satisfies Record<string, Component>
const currentView: ShallowRef<Component> = shallowRef(Init as Component)
const handleChangeScreen = (newView: keyof typeof views): void => {
  lastScreen.changeLastScreen(newView)
  currentView.value = views[newView] || Init
  redirectStore.current = newView
}
const toReturn = (): void => {
  if (lastScreen.lastScreen !== redirectStore.current) {
    redirectStore.current = lastScreen.lastScreen
  } else {
    lastScreen.changeLastScreen('Init')
    redirectStore.current = 'Init'
  }
}
const screen: Ref<HTMLDivElement | null> = ref(null)
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(resolve)
})

/*****************************************************************************************
 * WATCH: redirectStore.current
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Observes changes in the global redirect store to update the active tablet screen.
 *              - Dynamically loads the corresponding view component from the `views` map.
 *              - Defaults to the `Init` screen when no match is found.
 *              - Runs immediately on component mount to display the correct initial view.
 *
 * DESCRIPCIÓN: Observa los cambios en el store global de redirección para actualizar la pantalla activa de la tablet.
 *              - Carga dinámicamente el componente de vista correspondiente desde el mapa `views`.
 *              - Usa la pantalla `Init` por defecto si no se encuentra coincidencia.
 *              - Se ejecuta inmediatamente al montar el componente para mostrar la vista inicial correcta.
 *****************************************************************************************/
watch(
  () => redirectStore.current,
  (newView: ScreenName) => {
    currentView.value = views[newView] || Init
  },
  { immediate: true },
)
/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Preloads all necessary assets and data stores when the tablet content mounts.
 *              - Ensures logos, about section, skills, projects, and experiences are loaded in advance.
 *              - Loads contact channels to make communication options immediately available.
 *              - Improves user experience by minimizing loading delays between app screens.
 *
 * DESCRIPCIÓN: Precarga todos los recursos y stores necesarios al montar el contenido de la tablet.
 *              - Asegura la carga previa de logos, sección "about", habilidades, proyectos y experiencias.
 *              - Carga los canales de contacto para disponer de ellos de forma inmediata.
 *              - Mejora la experiencia del usuario al reducir los tiempos de carga entre pantallas.
 *****************************************************************************************/
onMounted(async () => {
  await Promise.all([
    appLogosStore.preloadAssets(),
    aboutStore.preloadAssets(),
    skillsStore.preloadAssets(),
    projectsStore.preloadAssets(),
    experiencesStore.preloadAssets(),
    contactChannelsStore.load(),
  ])
})
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
  padding: 0;
  box-sizing: border-box;
  background-color: rgb(14, 13, 13);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.back-button {
  z-index: 9999;
}
</style>
