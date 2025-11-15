import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRedirectStore } from '@/stores/useRedirect';
import { useContactChannelsStore } from '@/stores/useContactChannels';
import { Popover } from 'bootstrap';
import { useAssetsPreload } from '@/stores/useAssetsPreload';
const assets = useAssetsPreload();
const MIN_LEN = 25; // Longitud minima del mensaje permitida
const MAX_LEN = 500; // Longitud maxima del mensaje permitida
const API_URL = import.meta.env.VITE_MAIL_ENDPOINT;
const chatContainer = ref(null);
const draftInput = ref(null);
const messageSend1 = ref(false);
const messageSend2 = ref(false);
const sending = ref(false);
const draft = ref('');
const introTime = ref(formatTime());
const sendTime = ref('');
const thanksTime = ref('');
const redirectStore = useRedirectStore();
const store = useContactChannelsStore();
const mail = computed(() => store.byCode['mail'] ?? null);
const appLogoUrl = computed(() => store.appLogoUrl);
const mailAddress = computed(() => mail.value?.link ?? '');
const bubble1 = computed(() => mail.value?.bubble1 ?? '');
const bubble2 = ref('Este es el mensaje enviado');
const bubble3 = computed(() => mail.value?.bubble3 ?? '');
const canSend = computed(() => {
    const len = draft.value.trim().length;
    return len >= MIN_LEN && len <= MAX_LEN && !sending.value;
});
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
        await nextTick();
        scrollToBottom();
    }
});
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
        await nextTick();
        scrollToBottom();
        initPopovers();
    }
});
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
    if (!store.isFresh)
        void store.load({ appKey: 'contact' });
    await nextTick();
    draftInput.value?.focus();
    initPopovers();
});
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Redirects to another section of the tablet interface.
 *              - Uses the global redirect store for navigation.
 *
 * DESCRIPCIÓN: Redirige a otra sección de la interfaz de la tablet.
 *              - Usa el store global de redirección para la navegación.
 *****************************************************************************************/
function go(to) {
    redirectStore.redirect(to);
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
function formatTime(date = new Date()) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
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
async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text).catch(console.error);
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
function handleCopy(text, event) {
    copyToClipboard(text);
    const target = event.currentTarget;
    Popover.getInstance(target)?.dispose();
    const pop = new Popover(target, {
        trigger: 'manual',
        container: 'body',
        customClass: 'custom-popover',
    });
    pop.show();
    setTimeout(() => pop.hide(), 3000);
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
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
        Popover.getInstance(el)?.dispose();
        new Popover(el, { trigger: 'click', container: 'body' });
    });
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
async function onSend() {
    if (sending.value)
        return false;
    const text = draft.value.trim();
    if (text.length < MIN_LEN || text.length > MAX_LEN)
        return false;
    sending.value = true;
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
            }),
        });
        const data = (await res.json().catch(() => ({})));
        if (!res.ok || !data.ok) {
            throw new Error(data?.error || `HTTP ${res.status}`);
        }
        // UI de chat
        bubble2.value = text;
        messageSend1.value = true;
        sendTime.value = formatTime();
        messageSend2.value = true;
        thanksTime.value = formatTime();
        draft.value = '';
        await nextTick();
        scrollToBottom();
        return true;
    }
    catch (err) {
        console.error(err);
        alert('No pude enviar el mensaje. Intenta de nuevo.\n' + err.message);
        return false;
    }
    finally {
        sending.value = false;
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
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['contactApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['containerDrafting']} */ ;
/** @type {__VLS_StyleScopedClasses['sendButton']} */ ;
/** @type {__VLS_StyleScopedClasses['containerStateInitial']} */ ;
/** @type {__VLS_StyleScopedClasses['contentContactEmail']} */ ;
/** @type {__VLS_StyleScopedClasses['containerRecived']} */ ;
/** @type {__VLS_StyleScopedClasses['containerSend']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['double']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-popover']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-popover']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-popover']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container-fluid contactApplication m-0 p-0" },
    ...{ style: ({ backgroundImage: `url(${__VLS_ctx.assets.icons.contactwallpaper})` }) },
});
// @ts-ignore
[assets,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tools" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ class: "logoPrinc" },
    src: (__VLS_ctx.appLogoUrl),
    alt: "",
});
// @ts-ignore
[appLogoUrl,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "dropdown" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    type: "button",
    id: "dropdownMenuButton1",
    ...{ class: "d-flex justify-content-center align-items-center ms-2" },
    'data-bs-toggle': "dropdown",
    'aria-expanded': "false",
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-three-dots-vertical" },
});
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
    ...{ class: "dropdown-menu" },
    'aria-labelledby': "dropdownMenuButton1",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Init');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('About');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Projects');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Experience');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Skills');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
if (!__VLS_ctx.messageSend1) {
    // @ts-ignore
    [messageSend1,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "containerStateInitial" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "containerRecived mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "m-0 p-0 message" },
    });
    (__VLS_ctx.bubble1);
    // @ts-ignore
    [bubble1,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "messageTime" },
    });
    (__VLS_ctx.introTime);
    // @ts-ignore
    [introTime,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "Textarea" },
    });
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        ref: "draftInput",
        ...{ class: "containerDrafting" },
        placeholder: "",
        value: (__VLS_ctx.draft),
        disabled: (__VLS_ctx.sending),
        maxlength: "1500",
        autofocus: true,
    });
    /** @type {typeof __VLS_ctx.draftInput} */ ;
    // @ts-ignore
    [draft, sending, draftInput,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.messageSend1))
                    return;
                __VLS_ctx.canSend && __VLS_ctx.onSend();
                // @ts-ignore
                [canSend, onSend,];
            } },
        ...{ class: "sendButton" },
        ...{ class: ({ disabled: __VLS_ctx.sending || !__VLS_ctx.canSend }) },
        'aria-disabled': (__VLS_ctx.sending || !__VLS_ctx.canSend),
        title: "Escribe un poco más para enviar",
    });
    // @ts-ignore
    [sending, sending, canSend, canSend,];
    if (!__VLS_ctx.sending) {
        // @ts-ignore
        [sending,];
        __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
            ...{ class: "bi bi-send" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "spinner-border spinner-border-sm" },
            role: "status",
            'aria-label': "Enviando",
        });
    }
}
if (__VLS_ctx.messageSend1) {
    // @ts-ignore
    [messageSend1,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "contentContactEmail m-0 p-0" },
        ref: "chatContainer",
    });
    /** @type {typeof __VLS_ctx.chatContainer} */ ;
    // @ts-ignore
    [chatContainer,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "containerRecived mt-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "m-0 p-0 message" },
    });
    (__VLS_ctx.bubble1);
    // @ts-ignore
    [bubble1,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "messageTime" },
    });
    (__VLS_ctx.introTime);
    // @ts-ignore
    [introTime,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "containerSend" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "m-0 p-0 message" },
    });
    (__VLS_ctx.bubble2);
    // @ts-ignore
    [bubble2,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "messageTime" },
    });
    (__VLS_ctx.sendTime);
    // @ts-ignore
    [sendTime,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "icono_leido m-0 p-0" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "tick" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "tick double" },
    });
    if (__VLS_ctx.messageSend2) {
        // @ts-ignore
        [messageSend2,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "containerRecived" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "m-0 p-0 message" },
        });
        (__VLS_ctx.bubble3);
        // @ts-ignore
        [bubble3,];
        __VLS_asFunctionalElement(__VLS_elements.br)({});
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.messageSend1))
                        return;
                    if (!(__VLS_ctx.messageSend2))
                        return;
                    __VLS_ctx.handleCopy(__VLS_ctx.mailAddress, $event);
                    // @ts-ignore
                    [handleCopy, mailAddress,];
                } },
            ...{ class: "linkEmail" },
            'data-bs-custom-class': "custom-popover",
            'data-bs-container': "body",
            'data-bs-toggle': "popover",
            'data-bs-placement': "top",
            'data-bs-content': "Link copied",
        });
        (__VLS_ctx.mailAddress);
        // @ts-ignore
        [mailAddress,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "messageTime" },
        });
        (__VLS_ctx.thanksTime);
        // @ts-ignore
        [thanksTime,];
    }
}
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['contactApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['logoPrinc']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-three-dots-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['containerStateInitial']} */ ;
/** @type {__VLS_StyleScopedClasses['containerRecived']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['messageTime']} */ ;
/** @type {__VLS_StyleScopedClasses['Textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['containerDrafting']} */ ;
/** @type {__VLS_StyleScopedClasses['sendButton']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-send']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['contentContactEmail']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['containerRecived']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['messageTime']} */ ;
/** @type {__VLS_StyleScopedClasses['containerSend']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['messageTime']} */ ;
/** @type {__VLS_StyleScopedClasses['icono_leido']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['double']} */ ;
/** @type {__VLS_StyleScopedClasses['containerRecived']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['linkEmail']} */ ;
/** @type {__VLS_StyleScopedClasses['messageTime']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        assets: assets,
        chatContainer: chatContainer,
        draftInput: draftInput,
        messageSend1: messageSend1,
        messageSend2: messageSend2,
        sending: sending,
        draft: draft,
        introTime: introTime,
        sendTime: sendTime,
        thanksTime: thanksTime,
        appLogoUrl: appLogoUrl,
        mailAddress: mailAddress,
        bubble1: bubble1,
        bubble2: bubble2,
        bubble3: bubble3,
        canSend: canSend,
        go: go,
        handleCopy: handleCopy,
        onSend: onSend,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
