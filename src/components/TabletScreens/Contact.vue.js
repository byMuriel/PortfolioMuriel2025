import { computed, ref, watch, onMounted } from 'vue';
import { useRedirectStore } from '@/stores/useRedirect';
import { useContactChannelsStore } from '@/stores/useContactChannels';
import { useAssetsPreload } from '@/stores/useAssetsPreload';
const assets = useAssetsPreload();
const screen = ref(null);
const clicked = ref([]);
const redirectStore = useRedirectStore();
const store = useContactChannelsStore();
const ContactImage = computed(() => store.channels.map((ch) => ({
    name: ch.name,
    logo: ch.logo_url,
    link: ch.link,
    goTo: ch.go_to || '',
    message: ch.message,
})));
/*****************************************************************************************
 * WATCH: ContactImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Observes changes in the `ContactImage` list to reset click interaction states.
 *              - Initializes the `clicked` array with `false` values matching the number of images.
 *              - Ensures all contact images start unclicked when the list updates or mounts.
 *
 * DESCRIPCIÓN: Observa los cambios en la lista `ContactImage` para reiniciar los estados de interacción.
 *              - Inicializa el arreglo `clicked` con valores `false` según la cantidad de imágenes.
 *              - Garantiza que todas las imágenes de contacto comiencen sin estar presionadas al actualizar o montar.
 *****************************************************************************************/
watch(ContactImage, (list) => {
    clicked.value = Array(list.length).fill(false);
}, { immediate: true });
/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Loads contact data when the component is mounted.
 *              - Fetches data from the contact store using the key `'contact'`.
 *
 * DESCRIPCIÓN: Carga los datos de contacto al montar el componente.
 *              - Obtiene los datos desde el store de contactos usando la clave `'contact'`.
 *****************************************************************************************/
onMounted(() => {
    void store.load({ appKey: 'contact' });
});
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles redirection logic for contact actions.
 *              - If a route key (`to`) is provided, navigates using the redirect store.
 *              - Otherwise, opens LinkedIn or GitHub links in a new browser tab.
 *
 * DESCRIPCIÓN: Gestiona la lógica de redirección para las acciones de contacto.
 *              - Si se proporciona una clave de ruta (`to`), navega mediante el store de redirección.
 *              - De lo contrario, abre los enlaces de LinkedIn o GitHub en una nueva pestaña del navegador.
 *****************************************************************************************/
function go(to, contact) {
    if (to && to !== '') {
        redirectStore.redirect(to);
        return;
    }
    if (contact && (contact.name === 'LinkedIn' || contact.name === 'GitHub')) {
        const url = contact.link?.startsWith('http') ? contact.link : `https://${contact.link ?? ''}`;
        window.open(url, '_blank');
    }
}
/*****************************************************************************************
 * FUNCTION: getIn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Marks a contact image as clicked (hovered or focused).
 *              - Updates the `clicked` array at the specified index to `true`.
 *
 * DESCRIPCIÓN: Marca una imagen de contacto como presionada (hover o enfoque).
 *              - Actualiza el arreglo `clicked` en el índice especificado a `true`.
 *****************************************************************************************/
function getIn(index) {
    clicked.value[index] = true;
}
/*****************************************************************************************
 * FUNCTION: getOut
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Unmarks a contact image when the pointer leaves or loses focus.
 *              - Updates the `clicked` array at the specified index to `false`.
 *
 * DESCRIPCIÓN: Desmarca una imagen de contacto cuando el puntero sale o pierde el foco.
 *              - Actualiza el arreglo `clicked` en el índice especificado a `false`.
 *****************************************************************************************/
function getOut(index) {
    clicked.value[index] = false;
}
const domReady = new Promise((resolve) => {
    onMounted(() => resolve());
});
let __VLS_exposed;
defineExpose({
    screen,
    domReady,
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['contactApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['tittle']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['double']} */ ;
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
    src: (__VLS_ctx.store.appLogoUrl),
    alt: "Contact App Logo",
});
// @ts-ignore
[store,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "d-flex justify-content-center" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Init');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "d-flex justify-content-center align-items-center" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-house-door" },
});
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "containerContact" },
});
for (const [contact, index] of __VLS_getVForSourceType((__VLS_ctx.ContactImage))) {
    // @ts-ignore
    [ContactImage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.go(contact.goTo, contact);
                // @ts-ignore
                [go,];
            } },
        key: (index),
        ...{ class: "contactCard" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.getIn(index);
                // @ts-ignore
                [getIn,];
            } },
        ...{ class: "container-fluid d-flex justify-content-between align-items-center" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "containerImg" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (contact.logo),
        alt: "",
        ...{ class: "circulo" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "texto_contacto" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "d-flex justify-content-between align-items-center" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "m-0" },
    });
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (contact.name);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ style: {} },
        ...{ class: "m-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "d-flex justify-content-start" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "textMessage" },
    });
    (contact.message);
}
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['contactApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['logoPrinc']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-house-door']} */ ;
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
/** @type {__VLS_StyleScopedClasses['containerContact']} */ ;
/** @type {__VLS_StyleScopedClasses['contactCard']} */ ;
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['containerImg']} */ ;
/** @type {__VLS_StyleScopedClasses['circulo']} */ ;
/** @type {__VLS_StyleScopedClasses['texto_contacto']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['m-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-start']} */ ;
/** @type {__VLS_StyleScopedClasses['textMessage']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        assets: assets,
        store: store,
        ContactImage: ContactImage,
        go: go,
        getIn: getIn,
    }),
});
export default (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
});
; /* PartiallyEnd: #4569/main.vue */
