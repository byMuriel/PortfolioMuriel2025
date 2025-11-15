import { ref, computed, onMounted, watch } from 'vue';
import { useAppLogosStore } from '@/stores/useAppLogos';
import { useRedirectStore } from '@/stores/useRedirect';
import { useAboutStore } from '@/stores/useAbout';
import { useContactChannelsStore } from '@/stores/useContactChannels';
import PillButton from '@/components/CommonComponents/PillButton.vue';
import { useAssetsPreload } from '@/stores/useAssetsPreload';
const assets = useAssetsPreload();
const appLogos = useAppLogosStore();
const redirectStore = useRedirectStore();
const store = useAboutStore();
const contactChannels = useContactChannelsStore();
const logoAbout = computed(() => appLogos.getLogo('about'));
const screen = ref(null);
const more = ref(false);
const expanded = ref([]);
const AboutContent = computed(() => store.about ?? {
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
});
const imgs = computed(() => ({
    logoPrinc: store.about?.logo ?? '',
    fondo: store.about?.fondo ?? '',
    avatar: store.about?.img ?? '',
}));
const titles = computed(() => store.about?.AboutMeTitles ?? []);
const paragraphs = computed(() => store.about?.AboutMe ?? []);
const linkedInUrl = computed(() => {
    const raw = (contactChannels.getLinkByCode('linkedin') ||
        contactChannels.getLinkByCode('linkedn') || // ← fallback a la clave que ya te funciona
        '').trim();
    if (!raw)
        return null;
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
        new URL(url); // valida
        return url;
    }
    catch {
        return null;
    }
});
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
watch(titles, (arr) => {
    const safe = Array.isArray(arr) ? arr : [];
    expanded.value = safe.map((_, i) => i === 0);
}, { immediate: true });
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
    if (!store.isFresh)
        await store.load();
    if (!contactChannels.isFresh)
        await contactChannels.load(); // ← antes era sin await
});
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
function onImgError(e) {
    const el = e.target;
    el.onerror = null;
    el.src = '/fallbacks/app-default.png';
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
function go(to) {
    redirectStore.redirect(to);
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
function showSection(i) {
    if (i >= 0 && i < expanded.value.length)
        expanded.value[i] = true;
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
function hideSection(i) {
    if (i >= 0 && i < expanded.value.length)
        expanded.value[i] = false;
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
const domReady = new Promise((resolve) => {
    onMounted(resolve);
});
let __VLS_exposed;
defineExpose({ screen, domReady });
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['aboutApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['skill']} */ ;
/** @type {__VLS_StyleScopedClasses['skill']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container-fluid aboutApplication aboutShadow m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tools" },
});
if (__VLS_ctx.logoAbout) {
    // @ts-ignore
    [logoAbout,];
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ onError: (__VLS_ctx.onImgError) },
        src: (__VLS_ctx.logoAbout),
        alt: "About logo",
        width: "96",
        height: "96",
        decoding: "async",
        loading: "eager",
        ...{ class: "logoPrinc" },
    });
    // @ts-ignore
    [logoAbout, onImgError,];
}
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Init');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "toolButton iconContainer d-flex justify-content-center align-items-center" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-house-door-fill" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "textIcon m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Experience');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "toolButton iconContainer d-flex justify-content-center align-items-center" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-briefcase-fill" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "textIcon" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Projects');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "toolButton iconContainer d-flex justify-content-center align-items-center" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-folder-fill" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "textIcon" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Contact');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "toolButton iconContainer d-flex justify-content-center align-items-center" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-chat-quote-fill" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "textIcon" },
});
if (__VLS_ctx.linkedInUrl) {
    // @ts-ignore
    [linkedInUrl,];
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        ...{ class: "m-0 p-0 text-decoration-none" },
        href: (__VLS_ctx.linkedInUrl),
        target: "_blank",
        rel: "noopener noreferrer",
    });
    // @ts-ignore
    [linkedInUrl,];
    /** @type {[typeof PillButton, typeof PillButton, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(PillButton, new PillButton({
        ...{ class: "toolButton" },
        replaceClass: "bluePill",
        text: "View LinkedIn Profile",
    }));
    const __VLS_1 = __VLS_0({
        ...{ class: "toolButton" },
        replaceClass: "bluePill",
        text: "View LinkedIn Profile",
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "containerAbout pb-3" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "aboutHead" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ class: "fondoAbout" },
    src: (__VLS_ctx.imgs.fondo),
    alt: "",
});
// @ts-ignore
[imgs,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ class: "murielImg" },
    src: (__VLS_ctx.imgs.avatar),
    alt: "",
});
// @ts-ignore
[imgs,];
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "name m-0 p-0" },
});
(__VLS_ctx.AboutContent.intro);
// @ts-ignore
[AboutContent,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ class: "verificationImg m-0 p-0" },
    src: (__VLS_ctx.assets.icons.verify),
    alt: "Verification",
});
// @ts-ignore
[assets,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "decoratorPlus text-center align-content-center m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "plus" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "initialData" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "text-dark m-0 p-0 font07rem" },
});
(__VLS_ctx.AboutContent.Experience);
// @ts-ignore
[AboutContent,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "m-0 p-0 font07rem" },
    ...{ style: ({ color: '#969393' }) },
});
(__VLS_ctx.AboutContent.Ubication);
// @ts-ignore
[AboutContent,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tags m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "position ps-3 me-1 text-dark" },
});
(__VLS_ctx.AboutContent.Position);
// @ts-ignore
[AboutContent,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "skills-inline d-flex justify-content-start flex-wrap ps-3 pe-3" },
});
for (const [skill, i] of __VLS_getVForSourceType((__VLS_ctx.AboutContent.Skills))) {
    // @ts-ignore
    [AboutContent,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        key: (i),
        ...{ class: "skill" },
    });
    (skill);
}
for (const [title, index] of __VLS_getVForSourceType((__VLS_ctx.titles))) {
    // @ts-ignore
    [titles,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "aboutCard m-0 p-2" },
        key: (index),
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({
        ...{ class: "text-dark m-0 p-0 pb-1" },
    });
    (title);
    if (__VLS_ctx.expanded[index]) {
        // @ts-ignore
        [expanded,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "about-text" },
        });
        (__VLS_ctx.paragraphs[index]);
        // @ts-ignore
        [paragraphs,];
    }
    if (!__VLS_ctx.expanded[index]) {
        // @ts-ignore
        [expanded,];
        /** @type {[typeof PillButton, typeof PillButton, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(PillButton, new PillButton({
            ...{ 'onClick': {} },
            text: "See More",
        }));
        const __VLS_5 = __VLS_4({
            ...{ 'onClick': {} },
            text: "See More",
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
        let __VLS_7;
        let __VLS_8;
        const __VLS_9 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.expanded[index]))
                        return;
                    __VLS_ctx.showSection(index);
                    // @ts-ignore
                    [showSection,];
                } });
        var __VLS_6;
    }
    if (__VLS_ctx.expanded[index]) {
        // @ts-ignore
        [expanded,];
        /** @type {[typeof PillButton, typeof PillButton, ]} */ ;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent(PillButton, new PillButton({
            ...{ 'onClick': {} },
            text: "See Less",
            ...{ class: "less" },
        }));
        const __VLS_12 = __VLS_11({
            ...{ 'onClick': {} },
            text: "See Less",
            ...{ class: "less" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        let __VLS_14;
        let __VLS_15;
        const __VLS_16 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!(__VLS_ctx.expanded[index]))
                        return;
                    __VLS_ctx.hideSection(index);
                    // @ts-ignore
                    [hideSection,];
                } });
        var __VLS_13;
    }
}
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['aboutApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['aboutShadow']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['logoPrinc']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-house-door-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['textIcon']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-briefcase-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['textIcon']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-folder-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['textIcon']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-chat-quote-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['textIcon']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-decoration-none']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['containerAbout']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['aboutHead']} */ ;
/** @type {__VLS_StyleScopedClasses['fondoAbout']} */ ;
/** @type {__VLS_StyleScopedClasses['murielImg']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['verificationImg']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['decoratorPlus']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['plus']} */ ;
/** @type {__VLS_StyleScopedClasses['initialData']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font07rem']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['font07rem']} */ ;
/** @type {__VLS_StyleScopedClasses['tags']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['position']} */ ;
/** @type {__VLS_StyleScopedClasses['ps-3']} */ ;
/** @type {__VLS_StyleScopedClasses['me-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['skills-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-start']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['ps-3']} */ ;
/** @type {__VLS_StyleScopedClasses['pe-3']} */ ;
/** @type {__VLS_StyleScopedClasses['skill']} */ ;
/** @type {__VLS_StyleScopedClasses['aboutCard']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['about-text']} */ ;
/** @type {__VLS_StyleScopedClasses['less']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        PillButton: PillButton,
        assets: assets,
        logoAbout: logoAbout,
        expanded: expanded,
        AboutContent: AboutContent,
        imgs: imgs,
        titles: titles,
        paragraphs: paragraphs,
        linkedInUrl: linkedInUrl,
        onImgError: onImgError,
        go: go,
        showSection: showSection,
        hideSection: hideSection,
    }),
});
export default (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
});
; /* PartiallyEnd: #4569/main.vue */
