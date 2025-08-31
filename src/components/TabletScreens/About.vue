<!-- src/components/About.vue -->
<template>
  <div class="container-fluid aboutApplication aboutShadow m-0 p-0">
    <!-- Tools Buttons -->
    <div class="tools">
      <img class="logoPrinc" src="@/assets/images/AboutMe/logos/logoPrinc.png" alt="" />
      <span
        @click="go('Init')"
        class="toolButton iconContainer d-flex justify-content-center align-items-center"
      >
        <i class="bi bi-house-door-fill" style="font-size: 1.5rem; color: grey"></i>
        <p class="textIcon m-0 p-0">Home</p>
      </span>
      <span
        @click="go('Experience')"
        class="toolButton iconContainer d-flex justify-content-center align-items-center"
      >
        <i class="bi bi-briefcase-fill" style="font-size: 1.5rem; color: grey"></i>
        <p class="textIcon">Jobs</p>
      </span>
      <span
        @click="go('Projects')"
        class="toolButton iconContainer d-flex justify-content-center align-items-center"
      >
        <i class="bi bi-folder-fill" style="font-size: 1.5rem; color: grey"></i>
        <p class="textIcon">Projects</p>
      </span>
      <span
        @click="go('Contact')"
        class="toolButton iconContainer d-flex justify-content-center align-items-center"
      >
        <i class="bi bi-chat-quote-fill" style="font-size: 1.5rem; color: grey"></i>
        <p class="textIcon">Contact</p>
      </span>
      <a class="m-0 p-0" :href="linkLinkedIn" target="_blank" rel="noopener noreferrer">
        <PillButton
          class="toolButton"
          replaceClass="bluePill"
          text="View LinkedIn Profile"
        ></PillButton>
      </a>
    </div>
    <!-- Content -->
    <div class="containerAbout pb-3">
      <!-- Head (Presentation) -->
      <div class="aboutHead">
        <img class="fondoAbout" src="/src/assets/images/AboutMe/fondo.jpg" alt="" />
        <img class="murielImg" src="/src/assets/images/AboutMe/muriel.png" alt="" />
        <h1 class="name m-0 p-0">
          {{ AboutContent.intro }}
          <!-- <span class="font07rem">(She/Her)</span> -->
        </h1>
        <img
          class="verificationImg m-0 p-0"
          src="/src/assets/images/AboutMe/verification.png"
          alt=""
        />
        <div class="decoratorPlus text-center align-content-center m-0 p-0">
          <p class="plus">+</p>
        </div>
        <div class="initialData">
          <p class="text-dark m-0 p-0 font07rem">{{ AboutContent.Experience }}</p>
          <p class="m-0 p-0 font07rem" :style="{ color: '#969393' }">
            {{ AboutContent.Ubication }}
          </p>
        </div>
        <div class="tags m-0 p-0">
          <p class="text-dark m-0 ps-3 pe-3">
            {{ AboutContent.Position }}
            <span v-for="(skill, index) in AboutContent.Skills">{{ skill }}</span>
          </p>
        </div>
      </div>
      <!-- Content Cards (About me) -->
      <div class="aboutCard m-0 p-2" v-for="(title, index) in titles" :key="index">
        <div>
          <h5 class="text-dark m-0 p-0 pb-1">{{ title }}</h5>

          <p class="about-text" v-if="expanded[index]">
            {{ paragraphs[index] }}
          </p>
          <PillButton
            text="See More"
            v-if="!expanded[index]"
            @click="showSection(index)"
          ></PillButton>
        </div>
        <PillButton
          text="See Less"
          class="less"
          v-if="expanded[index]"
          @click="hideSection(index)"
        ></PillButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, onMounted, type Ref, type ComputedRef } from 'vue'
import { useRedirectStore } from '@/stores/useRedirect'
import PillButton from '@/components/CommonComponents/PillButton.vue'
import LinkLinkedIn from '@/data/contact.json'

type StringDict = Record<string, string>
type MaybeList = string[] | StringDict | undefined
type ViewKey = 'Skills' | 'Experience' | 'Projects' | 'Contact' | 'Blog'

interface AboutContentShape {
  intro: string
  Experience: string
  Ubication: string
  Position: string
  Skills: string[]
  AboutMeTitles?: MaybeList
  AboutMe?: MaybeList
}
const screen = ref<HTMLDivElement | null>(null)
const more = ref<boolean>(false)
const expanded = ref<boolean[]>([])
const redirectStore = useRedirectStore()

const data = inject<Ref<{ about: AboutContentShape }>>('data')
if (!data) {
  throw new Error('No se proporcionó "data" via provide().')
}
const aboutData = computed(() => data.value.about)
/*****************************************************************************************
 * CONSTANT: AboutContent
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed reference that provides typed access to the About component's data.
 *              - Casts the raw `aboutData` to the `AboutContentShape` interface.
 *              - Ensures strong typing for template binding and code completion.
 * ***************************************************************************************
 * CONSTANTE: AboutContent
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Referencia computada que provee acceso tipado a los datos del componente About.
 *              - Convierte el `aboutData` crudo a la interfaz `AboutContentShape`.
 *              - Garantiza tipado estricto para el uso en el template y autocompletado.
 *****************************************************************************************/
const AboutContent: ComputedRef<AboutContentShape> = computed(
  () => aboutData.value as AboutContentShape,
)
/*****************************************************************************************
 * CONSTANT: linkLinkedIn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed reference that resolves the LinkedIn profile URL.
 *              - Extracts the `link` field from `LinkLinkedIn.linkedIn`.
 *              - Provides a strongly typed string for safe use in the template.
 * ***************************************************************************************
 * CONSTANTE: linkLinkedIn
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Referencia computada que resuelve la URL del perfil de LinkedIn.
 *              - Extrae el campo `link` de `LinkLinkedIn.linkedIn`.
 *              - Provee un string tipado para uso seguro en el template.
 *****************************************************************************************/
const linkLinkedIn: ComputedRef<string> = computed(() => LinkLinkedIn.linkedIn.link)
const toArray = (v: MaybeList): string[] => {
  if (!v) return []
  return Array.isArray(v) ? v : Object.values(v)
}
/*****************************************************************************************
 * CONSTANT: titles
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed reference that exposes the "AboutMeTitles" field as a string array.
 *              - Converts the raw data into an array using the `toArray` utility.
 *              - Provides a clean and typed structure for iteration in the template.
 * ***************************************************************************************
 * CONSTANTE: titles
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Referencia computada que expone el campo "AboutMeTitles" como un arreglo de strings.
 *              - Convierte los datos crudos en un arreglo utilizando el helper `toArray`.
 *              - Entrega una estructura tipada y lista para iterar en el template.
 *****************************************************************************************/
const titles: ComputedRef<string[]> = computed(() => toArray(AboutContent.value.AboutMeTitles))
/*****************************************************************************************
 * CONSTANT: paragraphs
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed reference that exposes the "AboutMe" field as a string array.
 *              - Normalizes the raw content into an array with the `toArray` utility.
 *              - Ensures predictable structure for rendering descriptive text in the template.
 * ***************************************************************************************
 * CONSTANTE: paragraphs
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Referencia computada que expone el campo "AboutMe" como un arreglo de strings.
 *              - Normaliza el contenido crudo en un arreglo con el helper `toArray`.
 *              - Garantiza una estructura predecible para renderizar texto descriptivo en el template.
 *****************************************************************************************/
const paragraphs: ComputedRef<string[]> = computed(() => toArray(AboutContent.value.AboutMe))

/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation from the About component to another screen.
 * ***************************************************************************************
 * FUNCIÓN: go
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Gestiona la navegación desde el componente About hacia otra pantalla.
 *****************************************************************************************/
function go(to: string) {
  redirectStore.redirect(to)
}
/*****************************************************************************************
 * FUNCTION: setMore
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Sets the "more" flag to show or hide extra content.
 *              - Accepts a boolean value.
 * ***************************************************************************************
 * DESCRIPCIÓN: Ajusta la bandera "more" para mostrar u ocultar contenido extra.
 *              - Recibe un booleano.
 *****************************************************************************************/
function setMore(value: boolean): void {
  more.value = !!value
}
/*****************************************************************************************
 * FUNCTION: showSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Expands a specific section by index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Expande una sección específica por índice.
 *****************************************************************************************/
function showSection(i: number): void {
  if (i < 0 || i >= expanded.value.length) return
  expanded.value[i] = true
}
/*****************************************************************************************
 * FUNCTION: hideSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Collapses a specific section by index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Colapsa una sección específica por índice.
 *****************************************************************************************/
function hideSection(i: number): void {
  if (i < 0 || i >= expanded.value.length) return
  expanded.value[i] = false
}
/*****************************************************************************************
 * FUNCTION: toggleSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Toggles a specific section by index.
 * ***************************************************************************************
 * DESCRIPCIÓN: Alterna (abre/cierra) una sección por índice.
 *****************************************************************************************/
function toggleSection(i: number): void {
  if (i < 0 || i >= expanded.value.length) return
  expanded.value[i] = !expanded.value[i]
}
/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Promise that resolves once the component is mounted (DOM ready).
 *              - Useful to sync external logic (e.g., Three.js overlays) after mount.
 * ***************************************************************************************
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente se monta (DOM listo).
 *              - Útil para sincronizar lógica externa (p. ej., overlays de Three.js) tras el mount.
 *****************************************************************************************/
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(() => resolve())
})
/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes the accordion state right after the component is mounted.
 *              - Builds a boolean array with the same length as `titles`, all set to false.
 *              - Opens the first section by setting index 0 to true when available.
 * ***************************************************************************************
 * DESCRIPCIÓN: Inicializa el estado del acordeón justo después de montar el componente.
 *              - Crea un arreglo de booleanos con la longitud de `titles`, todos en false.
 *              - Abre la primera sección poniendo el índice 0 en true si existe.
 *****************************************************************************************/
onMounted(() => {
  //Primer elemento abierto y el resto cerrado
  expanded.value = titles.value.map((_, i) => i === 0)
})
/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Exposes internal reactive references to the parent component.
 *              - `screen`: HTMLDivElement ref used as the tablet screen container.
 *              - `domReady`: Promise resolved when the component is mounted.
 * ***************************************************************************************
 * DESCRIPCIÓN: Expone referencias reactivas internas al componente padre.
 *              - `screen`: referencia a HTMLDivElement usada como contenedor de la pantalla.
 *              - `domReady`: Promesa que se resuelve al montar el componente.
 *****************************************************************************************/
defineExpose<{
  screen: Ref<HTMLDivElement | null>
  domReady: Promise<void>
}>({
  screen,
  domReady,
})
</script>

<style scoped>
.aboutApplication {
  display: flex;
  flex-direction: column;
  height: 100%;
  pointer-events: auto;
  width: 100%;
  justify-content: start;
  align-items: center;
  font-family: sans-serif;
  background-color: rgb(238, 235, 235);
  overflow: hidden;
}
.aboutApplication::before {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.9);
  z-index: 999;
  pointer-events: none;
}
.tools {
  flex: 0 0 auto;
  height: 3.5rem;
  background-color: rgb(238, 235, 235);
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
  width: 15%;
}
.textIcon {
  margin: 0;
  padding: 0;
  font-size: 0.55rem;
  line-height: 0.01rem;
  color: grey;
}
.containerAbout {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}
.aboutHead {
  width: 95%;
  height: 19rem;
  background-color: rgb(255, 255, 255);
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
}
.fondoAbout {
  width: 100%;
  height: 8rem;
  z-index: 2;
}
.murielImg {
  width: 10rem;
  height: 10rem;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  justify-self: start;

  position: relative;
  top: -6rem;
}
.decoratorPlus {
  position: relative;
  top: -12rem;
  left: 7.5rem;
  width: 2.2rem;
  height: 2.2rem;
  background-color: rgb(64, 122, 231);
  margin: 0;
  padding: 0;
  border-radius: 50%;
  border: 0.28rem solid white;
}
.plus {
  position: relative;
  margin: 0;
  padding: 0;
  top: -0.25rem;
  font-size: 1.5rem;
  cursor: default;
}
.name {
  position: relative;
  left: 11rem;
  top: -9.5rem;
  color: black;
  font-size: 1.4rem;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
}
.verificationImg {
  position: relative;
  top: -11.1rem;
  left: 19rem;
  width: 1.3rem;
  height: 1.3rem;
}
.initialData {
  position: relative;
  top: -13rem;
  left: 11rem;
}
.tags {
  position: relative;
  top: -12rem;
}
.font07rem {
  font-size: 0.7rem;
}
.aboutCard {
  width: 95%;
  background-color: rgb(255, 255, 255);
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
}
.about-text {
  white-space: pre-line;
  font-size: 1rem;
  color: rgba(39, 39, 39, 0.86);
  font-family: Arial, sans-serif;
}
</style>
