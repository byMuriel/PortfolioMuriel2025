<!-- src/components/About.vue -->
<template>
  <div class="container-fluid aboutApplication aboutShadow m-0 p-0">
    <!-- Tools Buttons -->
    <div class="tools">
      <img
        v-if="logoAbout"
        :src="logoAbout"
        alt="About logo"
        width="96"
        height="96"
        decoding="async"
        loading="eager"
        @error="onImgError"
        class="logoPrinc"
      />

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
      <a
        v-if="linkedInUrl"
        class="m-0 p-0 text-decoration-none"
        :href="linkedInUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
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
        <img class="fondoAbout" :src="imgs.fondo" alt="" />
        <img class="murielImg" :src="imgs.avatar" alt="" />
        <h1 class="name m-0 p-0">
          {{ AboutContent.intro }}
          <!-- <span class="font07rem">(She/Her)</span> -->
        </h1>
        <img class="verificationImg m-0 p-0" :src="assets.icons.verify" alt="Verification" />
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
          <div class="position ps-3 me-1 text-dark">{{ AboutContent.Position }}</div>
          <div class="skills-inline d-flex justify-content-start flex-wrap ps-3 pe-3">
            <span v-for="(skill, i) in AboutContent.Skills" :key="i" class="skill">{{
              skill
            }}</span>
          </div>
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
import { ref, computed, onMounted, watch, type Ref, type ComputedRef } from 'vue'
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useRedirectStore } from '@/stores/useRedirect'
import { useAboutStore } from '@/stores/useAbout'
import { useContactChannelsStore } from '@/stores/useContactChannels'
import PillButton from '@/components/CommonComponents/PillButton.vue'
import { useAssetsPreload } from '@/stores/useAssetsPreload'

const assets = useAssetsPreload()
const appLogos = useAppLogosStore()
const redirectStore = useRedirectStore()
const store = useAboutStore()
const contactChannels = useContactChannelsStore()
const logoAbout = computed(() => appLogos.getLogo('about'))
const screen = ref<HTMLDivElement | null>(null)
const more = ref(false)
const expanded = ref<boolean[]>([])
const AboutContent: ComputedRef<{
  logo: string
  img: string
  fondo: string
  intro: string
  Experience: string
  Ubication: string
  Position: string
  Skills: string[]
  AboutMeTitles: string[]
  AboutMe: string[]
}> = computed(
  () =>
    store.about ?? {
      logo: '',
      img: '',
      fondo: '',
      intro: '',
      Experience: '',
      Ubication: '',
      Position: '',
      Skills: [],
      AboutMeTitles: [],
      AboutMe: [],
    },
)
const imgs = computed(() => ({
  logoPrinc: store.about?.logo ?? '',
  fondo: store.about?.fondo ?? '',
  avatar: store.about?.img ?? '',
}))
const titles = computed<string[]>(() => store.about?.AboutMeTitles ?? [])
const paragraphs = computed<string[]>(() => store.about?.AboutMe ?? [])

const linkedInUrl = computed(() => {
  const raw = (
    contactChannels.getLinkByCode('linkedin') ||
    contactChannels.getLinkByCode('linkedn') || // ← fallback a la clave que ya te funciona
    ''
  ).trim()

  if (!raw) return null
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

  try {
    new URL(url) // valida
    return url
  } catch {
    return null
  }
})

/*****************************************************************************************
 * WATCH: titles
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Observes changes in the `titles` array to initialize the expanded sections.
 *              - Ensures `expanded` is a safe array of booleans.
 *              - Automatically expands only the first section when the component mounts.
 *
 * DESCRIPCIÓN: Observa los cambios en el arreglo `titles` para inicializar las secciones expandidas.
 *              - Asegura que `expanded` sea un arreglo seguro de valores booleanos.
 *              - Expande automáticamente solo la primera sección al montar el componente.
 *****************************************************************************************/
watch(
  titles,
  (arr) => {
    const safe = Array.isArray(arr) ? arr : []
    expanded.value = safe.map((_, i) => i === 0)
  },
  { immediate: true },
)
/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Loads initial data when the component is mounted.
 *              - Loads `about` store data if it’s not already loaded.
 *              - Loads `contactChannels` store data if needed.
 *
 * DESCRIPCIÓN: Carga los datos iniciales al montar el componente.
 *              - Carga los datos del store `about` si aún no están cargados.
 *              - Carga los datos del store `contactChannels` en caso necesario.
 *****************************************************************************************/
onMounted(async () => {
  if (!store.isFresh) await store.load()
  if (!contactChannels.isFresh) await contactChannels.load() // ← antes era sin await
})

/*****************************************************************************************
 * FUNCTION: onImgError
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles image loading errors by replacing them with a fallback image.
 *              - Prevents infinite error loops by removing the handler.
 *              - Uses a generic placeholder stored in `/fallbacks/app-default.png`.
 *
 * DESCRIPCIÓN: Maneja los errores de carga de imágenes reemplazándolas con una imagen por defecto.
 *              - Evita bucles infinitos eliminando el manejador de error.
 *              - Usa una imagen genérica ubicada en `/fallbacks/app-default.png`.
 *****************************************************************************************/
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles screen redirection within the tablet interface.
 *              - Delegates navigation to the global `redirectStore`.
 *
 * DESCRIPCIÓN: Gestiona la redirección entre pantallas dentro de la interfaz de la tablet.
 *              - Delegar la navegación al store global `redirectStore`.
 *****************************************************************************************/
function go(to: string) {
  redirectStore.redirect(to)
}
/*****************************************************************************************
 * FUNCTION: showSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Expands a specific “About Me” section by its index.
 *              - Validates the index to prevent out-of-range errors.
 *              - Marks the selected section as expanded.
 *
 * DESCRIPCIÓN: Expande una sección específica de “About Me” según su índice.
 *              - Valida el índice para evitar errores fuera de rango.
 *              - Marca la sección seleccionada como expandida.
 *****************************************************************************************/
function showSection(i: number) {
  if (i >= 0 && i < expanded.value.length) expanded.value[i] = true
}
/*****************************************************************************************
 * FUNCTION: hideSection
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Collapses a specific “About Me” section by its index.
 *              - Validates the index before modifying the array.
 *              - Marks the selected section as collapsed.
 *
 * DESCRIPCIÓN: Colapsa una sección específica de “About Me” según su índice.
 *              - Valida el índice antes de modificar el arreglo.
 *              - Marca la sección seleccionada como colapsada.
 *****************************************************************************************/
function hideSection(i: number) {
  if (i >= 0 && i < expanded.value.length) expanded.value[i] = false
}
/*****************************************************************************************
 * CONSTANT: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Promise that resolves once the component is fully mounted.
 *              - Useful for awaiting DOM readiness before executing layout logic.
 *
 * DESCRIPCIÓN: Promesa que se resuelve una vez que el componente está completamente montado.
 *              - Útil para esperar la disponibilidad del DOM antes de ejecutar lógica de diseño.
 *****************************************************************************************/
const domReady: Promise<void> = new Promise<void>((resolve) => {
  onMounted(resolve)
})
defineExpose<{ screen: Ref<HTMLDivElement | null>; domReady: Promise<void> }>({ screen, domReady })
</script>

<style scoped>
.aboutApplication {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  pointer-events: auto;
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
  height: auto;
  object-fit: contain;
  display: block;
}
.textIcon {
  margin: 0;
  padding: 0;
  font-size: 0.55rem;
  line-height: 0.01rem;
  color: grey;
}
.containerAbout {
  width: 100%;
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
.text-dark .skills-line {
  margin-left: 0.25rem;
  white-space: normal;
}
.skill {
  font-size: 0.8rem;
  color: rgb(133, 131, 131);
}

.skills-inline .skill + .skill::before {
  content: ' / ';
  margin: 0 0.25rem;
}
</style>
