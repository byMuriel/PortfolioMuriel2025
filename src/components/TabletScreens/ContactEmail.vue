<!-- src/components/ContactEmail.vue -->
<template>
  <div class="container-fluid contactApplication m-0 p-0">
    <!-- Tools -->
    <div class="tools">
      <img class="logoPrinc" :src="appLogoUrl" alt="" />
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
          <li @click="go('Init')"><a class="dropdown-item" href="#">Home</a></li>
          <li @click="go('About')"><a class="dropdown-item" href="#">About</a></li>
          <li @click="go('Projects')"><a class="dropdown-item" href="#">Projects</a></li>
          <li @click="go('Experience')"><a class="dropdown-item" href="#">Experience</a></li>
          <li @click="go('Skills')"><a class="dropdown-item" href="#">Skills</a></li>
        </ul>
      </div>
    </div>

    <div class="containerStateInitial" v-if="!messageSend1">
      <!-- Bubble 1 -->
      <div class="containerRecived mt-2">
        <p class="m-0 p-0 message">
          {{ bubble1 }}
        </p>
        <p class="messageTime">{{ introTime }}</p>
      </div>
      <!-- Write a Message -->
      <div class="Textarea">
        <textarea
          ref="draftInput"
          class="containerDrafting"
          placeholder=""
          v-model="draft"
          :disabled="sending"
          maxlength="1500"
          autofocus
        ></textarea>

        <span
          class="sendButton"
          :class="{ disabled: sending || !canSend }"
          @click="canSend && onSend()"
          :aria-disabled="sending || !canSend"
          title="Escribe un poco más para enviar"
        >
          <i v-if="!sending" class="bi bi-send"></i>
          <div
            v-else
            class="spinner-border spinner-border-sm"
            role="status"
            aria-label="Enviando"
          ></div>
        </span>
      </div>
    </div>

    <div class="contentContactEmail m-0 p-0" v-if="messageSend1" ref="chatContainer">
      <div class="containerRecived mt-2">
        <p class="m-0 p-0 message">
          {{ bubble1 }}
        </p>
        <p class="messageTime">{{ introTime }}</p>
      </div>

      <div class="containerSend">
        <p class="m-0 p-0 message">{{ bubble2 }}</p>
        <div class="messageTime">
          {{ sendTime }}
          <span class="icono_leido m-0 p-0">
            <span class="tick"></span>
            <span class="tick double"></span>
          </span>
        </div>
      </div>

      <div class="containerRecived" v-if="messageSend2">
        <p class="m-0 p-0 message">
          {{ bubble3 }}
          <br />
          <span
            @click="handleCopy(mailAddress, $event)"
            class="linkEmail"
            data-bs-custom-class="custom-popover"
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-placement="top"
            data-bs-content="Link copied"
            >{{ mailAddress }}</span
          >
        </p>
        <p class="messageTime">{{ thanksTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRedirectStore } from '@/stores/useRedirect'
import { useContactChannelsStore } from '@/stores/useContactChannels'
import { Popover } from 'bootstrap'

const MIN_LEN: number = 25 // Longitud minima del mensaje permitida
const MAX_LEN: number = 500 // Longitud maxima del mensaje permitida
const API_URL = import.meta.env.VITE_MAIL_ENDPOINT as string
const chatContainer = ref<HTMLDivElement | null>(null)
const draftInput = ref<HTMLTextAreaElement | null>(null)
const messageSend1 = ref<boolean>(false)
const messageSend2 = ref<boolean>(false)
const sending = ref<boolean>(false)
const draft = ref<string>('')
const introTime = ref<string>(formatTime())
const sendTime = ref<string>('')
const thanksTime = ref<string>('')
const redirectStore = useRedirectStore()
const store = useContactChannelsStore()
const mail = computed(() => store.byCode['mail'] ?? null)
const appLogoUrl = computed(() => store.appLogoUrl)
const mailAddress = computed(() => mail.value?.link ?? '')
const bubble1 = computed(() => mail.value?.bubble1 ?? '')
const bubble2 = ref<string>('Este es el mensaje enviado')
const bubble3 = computed(() => mail.value?.bubble3 ?? '')
const canSend = computed<boolean>(() => {
  const len = draft.value.trim().length
  return len >= MIN_LEN && len <= MAX_LEN && !sending.value
})

/*****************************************************************************************
 * WATCH: messageSend1
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Observes the first message send event to manage chat scrolling.
 *              - Waits for the DOM to update (`nextTick`).
 *              - Automatically scrolls the chat container to the bottom after the message appears.
 *
 * DESCRIPCIÓN: Observa el evento del primer mensaje enviado para manejar el desplazamiento del chat.
 *              - Espera a que el DOM se actualice (`nextTick`).
 *              - Desplaza automáticamente el contenedor del chat hasta el final después de mostrar el mensaje.
 *****************************************************************************************/
watch(messageSend1, async (v) => {
  if (v) {
    await nextTick()
    scrollToBottom()
  }
})
/*****************************************************************************************
 * WATCH: messageSend2
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Observes the second message send event to handle UI updates.
 *              - Waits for DOM update before scrolling.
 *              - Scrolls chat to bottom and initializes Bootstrap popovers.
 *
 * DESCRIPCIÓN: Observa el evento del segundo mensaje enviado para actualizar la interfaz.
 *              - Espera la actualización del DOM antes de desplazarse.
 *              - Desplaza el chat hasta el final e inicializa los popovers de Bootstrap.
 *****************************************************************************************/
watch(messageSend2, async (v) => {
  if (v) {
    await nextTick()
    scrollToBottom()
    initPopovers()
  }
})
/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes contact data and sets up UI elements after mounting.
 *              - Loads contact store data if not already available.
 *              - Focuses on the draft input field for immediate typing.
 *              - Initializes Bootstrap popovers for interactive UI.
 *
 * DESCRIPCIÓN: Inicializa los datos de contacto y los elementos de interfaz al montar el componente.
 *              - Carga los datos del store de contacto si aún no están disponibles.
 *              - Enfoca el campo de entrada para permitir escribir de inmediato.
 *              - Inicializa los popovers de Bootstrap para la interfaz interactiva.
 *****************************************************************************************/
onMounted(async () => {
  if (!store.isFresh) void store.load({ appKey: 'contact' })
  await nextTick()
  draftInput.value?.focus()
  initPopovers()
})
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Redirects to another section of the tablet interface.
 *              - Uses the global redirect store for navigation.
 *
 * DESCRIPCIÓN: Redirige a otra sección de la interfaz de la tablet.
 *              - Usa el store global de redirección para la navegación.
 *****************************************************************************************/
function go(to: string) {
  redirectStore.redirect(to)
}
/*****************************************************************************************
 * FUNCTION: formatTime
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Formats a JavaScript Date object into a human-readable 12-hour time string.
 *              - Example output: "4:07 p.m."
 *              - Pads minutes to always show two digits.
 *
 * DESCRIPCIÓN: Da formato a un objeto Date en una cadena legible en formato de 12 horas.
 *              - Ejemplo de salida: "4:07 p.m."
 *              - Asegura que los minutos siempre tengan dos dígitos.
 *****************************************************************************************/
function formatTime(date: Date = new Date()): string {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.'
  hours = hours % 12 || 12
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}
/*****************************************************************************************
 * FUNCTION: copyToClipboard
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Copies a given text string to the system clipboard.
 *              - Uses the modern Clipboard API.
 *              - Catches and logs errors silently if copying fails.
 *
 * DESCRIPCIÓN: Copia una cadena de texto al portapapeles del sistema.
 *              - Utiliza la API moderna del portapapeles.
 *              - Captura y registra los errores silenciosamente si la copia falla.
 *****************************************************************************************/
async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text).catch(console.error)
}
/*****************************************************************************************
 * FUNCTION: handleCopy
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles the copy-to-clipboard action with user feedback.
 *              - Copies text to clipboard.
 *              - Shows a temporary Bootstrap popover as visual confirmation.
 *              - Automatically hides the popover after 3 seconds.
 *
 * DESCRIPCIÓN: Gestiona la acción de copiar al portapapeles con retroalimentación visual.
 *              - Copia el texto al portapapeles.
 *              - Muestra un popover temporal de Bootstrap como confirmación.
 *              - Oculta automáticamente el popover después de 3 segundos.
 *****************************************************************************************/
function handleCopy(text: string, event: MouseEvent) {
  copyToClipboard(text)

  const target = event.currentTarget as HTMLElement

  Popover.getInstance(target)?.dispose()

  const pop = new Popover(target, {
    trigger: 'manual',
    container: 'body',
    customClass: 'custom-popover',
  })

  pop.show()
  setTimeout(() => pop.hide(), 3000)
}
/*****************************************************************************************
 * FUNCTION: initPopovers
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes all Bootstrap popovers in the document.
 *              - Disposes of any existing instances before creating new ones.
 *              - Ensures consistent behavior for all elements with `data-bs-toggle="popover"`.
 *
 * DESCRIPCIÓN: Inicializa todos los popovers de Bootstrap en el documento.
 *              - Elimina las instancias existentes antes de crear nuevas.
 *              - Garantiza un comportamiento consistente para todos los elementos con `data-bs-toggle="popover"`.
 *****************************************************************************************/
function initPopovers() {
  document.querySelectorAll<HTMLElement>('[data-bs-toggle="popover"]').forEach((el) => {
    Popover.getInstance(el)?.dispose()
    new Popover(el, { trigger: 'click', container: 'body' })
  })
}
/*****************************************************************************************
 * FUNCTION: onSend
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Sends the user’s message through an API endpoint and updates the chat UI.
 *              - Validates message length before sending.
 *              - Performs a POST request to the API.
 *              - Displays the sent message and response times in the chat interface.
 *              - Handles API and network errors gracefully.
 *
 * DESCRIPCIÓN: Envía el mensaje del usuario mediante un endpoint API y actualiza la interfaz del chat.
 *              - Valida la longitud del mensaje antes de enviarlo.
 *              - Realiza una solicitud POST al API.
 *              - Muestra el mensaje enviado y las horas de respuesta en la interfaz.
 *              - Maneja los errores de red o API de forma controlada.
 *****************************************************************************************/
async function onSend(): Promise<boolean> {
  if (sending.value) return false
  const text = draft.value.trim()
  if (text.length < MIN_LEN || text.length > MAX_LEN) return false

  sending.value = true
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
      }),
    })

    const data: { ok?: boolean; error?: string } = (await res.json().catch(() => ({}))) as {
      ok?: boolean
      error?: string
    }

    if (!res.ok || !data.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`)
    }

    // UI de chat
    bubble2.value = text
    messageSend1.value = true
    sendTime.value = formatTime()
    messageSend2.value = true
    thanksTime.value = formatTime()
    draft.value = ''

    await nextTick()
    scrollToBottom()
    return true
  } catch (err) {
    console.error(err)
    alert('No pude enviar el mensaje. Intenta de nuevo.\n' + (err as Error).message)
    return false
  } finally {
    sending.value = false
  }
}
/*****************************************************************************************
 * FUNCTION: scrollToBottom
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Scrolls the chat container to the bottom to keep the latest messages visible.
 *
 * DESCRIPCIÓN: Desplaza el contenedor del chat hasta el final para mantener visibles los mensajes más recientes.
 *****************************************************************************************/
function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/colors' as *;

.logoPrinc {
  width: 40%;
}
.contactApplication {
  background-image: url('@/assets/textures/wallpaperContact.png');
  pointer-events: auto;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-content: top;
  background-color: rgb(255, 255, 255);
  overflow-x: hidden;
  overflow-y: hidden;
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
  padding-left: 15%;
  padding-right: 1rem;
  gap: 1rem;
}
i {
  font-size: 1.5rem;
  color: #1a1919;
}
.containerStateInitial {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 3rem;
}
.containerDrafting {
  width: 95%;
  height: 12.8rem;
  background-color: #fafafa;
  border-radius: 0.8rem;
  border: 0.05rem solid rgb(185, 183, 183);
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
  color: #252525;
  line-height: normal;
  text-align: left;
  vertical-align: top;
}
.Textarea {
  display: flex;
  justify-content: center;
  align-items: top;
  width: 100%;
  height: 10rem;
  margin-bottom: 0.5rem;
}
textarea.containerDrafting:focus {
  outline: none;
  border: 0.05rem solid rgb(185, 183, 183);
}
.sendButton {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  width: 2.3rem;
  height: 2.3rem;
  background-color: #05c52f;
  border-radius: 40%;
  padding: 0.2rem;
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sendButton.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.bi-send {
  color: #ffffff;
}
.contentContactEmail {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
  overflow-y: auto;
}
.containerRecived {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: flex-start;
  display: inline-block;
  width: fit-content;
  max-width: 17rem;
  box-sizing: border-box;
  background-color: rgb(255, 255, 255);
  color: #3f3e3e;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  margin-left: 1rem;
}
.containerSend {
  align-self: flex-end;
  display: inline-block;
  width: fit-content;
  max-width: 17rem;
  box-sizing: border-box;
  background-color: #b2fcc2;
  color: #252525;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  margin-right: 1rem;
}
.containerStateInitial,
.contentContactEmail {
  flex: 1 1 auto;
  min-height: 0;
}
.containerRecived,
.containerSend {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 17rem;
  padding: 0.6rem 0.8rem 0.3rem 0.8rem;
  box-shadow: 0.1rem 0.1rem 0.1rem rgba(63, 62, 62, 0.4);
  border-radius: 1rem;
  word-break: break-word;
  overflow-wrap: anywhere;
  margin-bottom: 1rem;
}
.message {
  font-size: 0.9rem;
  align-self: flex-start;
  margin: 0;
  white-space: pre-line;
}
.messageTime {
  font-size: 0.7rem;
  align-self: flex-end;
  margin-top: 0.2rem;
}
.icono_leido {
  position: relative;
  width: 1rem;
  height: 1rem;
  display: inline-block;
}
.tick {
  position: absolute;
  top: 0;
  left: 0;
  width: 1rem;
  height: 1rem;
}
.tick::before,
.tick::after {
  content: '';
  position: absolute;
  background-color: $WhatsAppBlue;
  border-radius: 0.1rem;
}
.tick::before {
  width: 0.16rem;
  height: 0.35rem;
  transform: rotate(-45deg);
  top: 0.35rem;
  left: 0.09rem;
}
.tick::after {
  width: 0.16rem;
  height: 0.9rem;
  transform: rotate(45deg);
  top: -0.1rem;
  left: 0.38rem;
}
.tick.double::before {
  display: none;
}
.tick.double::after {
  top: 0rem;
  left: 0.6rem;
}
.linkEmail {
  color: #05c52f;
  font-size: 1.1rem;
  font-weight: 600;
}
:global(.custom-popover) {
  /* Bootstrap 5.2+ (por variables) */
  --bs-popover-bg: #b2fcc2;
  --bs-popover-color: #fff;
  --bs-popover-border-color: #b2fcc2;
  --bs-popover-arrow-color: #b2fcc2;
  --bs-popover-arrow-border-color: #b2fcc2;

  /* Fallback directo (si tu CSS no usa variables del popover) */
  background-color: #b2fcc2 !important;
  color: #252525 !important;
  border-color: #b2fcc2 !important;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
}
:global(.custom-popover .popover-arrow::before),
:global(.custom-popover .popover-arrow::after) {
  border-top-color: #b2fcc2 !important;
  border-right-color: #b2fcc2 !important;
  border-bottom-color: #b2fcc2 !important;
  border-left-color: #b2fcc2 !important;
}
:global(.custom-popover .popover-body) {
  color: #252525 !important;
}
</style>
