import { ref, computed, onMounted, onBeforeUnmount, nextTick, } from 'vue';
import { useAppLogosStore } from '@/stores/useAppLogos';
import { useRedirectStore } from '@/stores/useRedirect';
import { useStateLikeDislikeProjects } from '@/stores/useStateLikeDislikeProjects';
import { useProjectsStore } from '@/stores/useProjects';
import PillText from '@/components/CommonComponents/PillText.vue';
import colorSkill from '@/data/colorSkill.json';
const currentProjectContainer = ref(null);
const techContainer = ref(null);
const screen = ref(null);
const appLogos = useAppLogosStore();
const projectsStore = useProjectsStore();
const stateLikeDislikeStore = useStateLikeDislikeProjects();
const redirectStore = useRedirectStore();
let intervalId = null;
const showTechInfo = ref(false);
const currentProjectIndex = ref(0);
const currentImageIndex = ref(0);
const AUTO_SLIDE_MS = 4000;
const logoProjects = computed(() => appLogos.getLogo('projects'));
const rawProjects = computed(() => projectsStore.byId ?? {});
const currentProject = computed(() => projects.value[currentProjectIndex.value] ?? {
    name: '',
    description: '',
    link: '#',
    githubRep: '#',
    likes: 0,
    unlikes: 0,
    image: [],
    tech: {},
});
const images = computed(() => {
    const img = currentProject.value.image;
    if (!img)
        return [];
    return Array.isArray(img) ? img : Object.values(img);
});
const currentImage = computed(() => images.value[currentImageIndex.value]);
const likes = computed(() => currentProject.value.likes);
const otherProjects = computed(() => projects.value
    .map((project, originalIndex) => ({ ...project, originalIndex }))
    .filter((_, i) => i !== currentProjectIndex.value));
const techList = computed(() => {
    const tech = currentProject.value?.tech;
    if (!tech)
        return [];
    return Object.entries(tech);
});
const projects = computed(() => projectsStore.projects);
const defaultImg = "data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width='200' height='200'><rect width='100%' height='100%' fill='#222'/></svg>";
const safeUrl = (u) => {
    if (!u)
        return defaultImg;
    const s = String(u).trim(); // quita espacios/saltos de línea
    return s.replace(/\s/g, '%20'); // codifica espacios si los hay
};
/*****************************************************************************************
 * FUNCTION: onImgError
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles image load failures by swapping the source for a fallback image.
 *              - Removes the error handler to avoid infinite loops.
 *              - Uses '/fallbacks/app-default.png' as the placeholder.
 *
 * DESCRIPCIÓN: Maneja fallos de carga de imágenes reemplazando la fuente por una imagen de respaldo.
 *              - Elimina el handler de error para evitar bucles infinitos.
 *              - Usa '/fallbacks/app-default.png' como placeholder.
 *****************************************************************************************/
function onImgError(e) {
    const el = e.target;
    el.onerror = null;
    el.src = '/fallbacks/app-default.png';
}
/*****************************************************************************************
 * FUNCTION: toogleTech
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Toggles the technical details panel and moves focus to it when opened.
 *              - Scrolls the container into view centered and focuses it for accessibility.
 *
 * DESCRIPCIÓN: Alterna el panel de detalles técnicos y mueve el foco al abrirse.
 *              - Desplaza el contenedor al centro y le da foco para accesibilidad.
 *****************************************************************************************/
function toogleTech() {
    showTechInfo.value = !showTechInfo.value;
    if (showTechInfo.value === true && techContainer.value != null) {
        techContainer.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
        techContainer.value.focus();
    }
}
/*****************************************************************************************
 * FUNCTION: getColor
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the background color associated with a technology name.
 *              - Falls back to 'grey' if the tech is not mapped.
 *
 * DESCRIPCIÓN: Devuelve el color de fondo asociado a una tecnología.
 *              - Usa 'grey' si la tecnología no está mapeada.
 *****************************************************************************************/
function getColor(name) {
    return colorSkill[name] || 'grey';
}
/*****************************************************************************************
 * FUNCTION: getColorText
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the ideal text color for contrast over a tech badge.
 *              - Special case: 'JavaScript' → 'black'; otherwise 'white'.
 *
 * DESCRIPCIÓN: Devuelve el color de texto ideal para contraste en la insignia.
 *              - Caso especial: 'JavaScript' → 'black'; de lo contrario 'white'.
 *****************************************************************************************/
function getColorText(name) {
    if (name === 'JavaScript') {
        return 'black';
    }
    else {
        return 'white';
    }
}
/*****************************************************************************************
 * FUNCTION: scrollToTop
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Scrolls the current project container to the top.
 *              - Uses smooth behavior when supported and requested.
 *
 * DESCRIPCIÓN: Desplaza el contenedor del proyecto actual hasta arriba.
 *              - Usa desplazamiento suave cuando se soporta y se solicita.
 *****************************************************************************************/
function scrollToTop(smooth = true) {
    const el = currentProjectContainer.value;
    if (!el)
        return;
    if (typeof el.scrollTo === 'function') {
        el.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    }
    else {
        el.scrollTop = 0;
    }
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Delegates navigation to the global redirect store.
 *
 * DESCRIPCIÓN: Delegar la navegación al store global de redirección.
 *****************************************************************************************/
function go(to) {
    redirectStore.redirect(to);
}
/*****************************************************************************************
 * FUNCTION: firstImageOf
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Extracts the first available image URL from a project (array or map).
 *              - Returns `undefined` if no images are present.
 *
 * DESCRIPCIÓN: Extrae la primera URL de imagen disponible de un proyecto (arreglo o mapa).
 *              - Devuelve `undefined` si no hay imágenes.
 *****************************************************************************************/
function firstImageOf(p) {
    const img = p.image;
    if (!img)
        return undefined;
    return Array.isArray(img) ? img[0] : Object.values(img)[0];
}
/*****************************************************************************************
 * FUNCTION: replacePrincipal
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Replaces the principal (active) project by index and resets the image slider.
 *              - Optionally scrolls to top when the change comes from a click.
 *
 * DESCRIPCIÓN: Reemplaza el proyecto principal por índice y reinicia el carrusel de imágenes.
 *              - Opcionalmente hace scroll al inicio cuando viene de un clic.
 *****************************************************************************************/
async function replacePrincipal(index, fromClick = true) {
    if (index < 0 || index >= projects.value.length)
        return;
    currentImageIndex.value = 0;
    currentProjectIndex.value = index;
    await nextTick();
    if (fromClick)
        scrollToTop(true);
}
/*****************************************************************************************
 * FUNCTION: nextImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Advances the gallery to the next image (wrap-around).
 *
 * DESCRIPCIÓN: Avanza la galería a la siguiente imagen (con retorno al inicio).
 *****************************************************************************************/
function nextImage() {
    const total = images.value.length;
    if (!total)
        return;
    currentImageIndex.value = (currentImageIndex.value + 1) % total;
}
/*****************************************************************************************
 * FUNCTION: startAutoSlide
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Starts the automatic slideshow if not already running.
 *
 * DESCRIPCIÓN: Inicia el pase de diapositivas automático si no está en ejecución.
 *****************************************************************************************/
function startAutoSlide() {
    if (intervalId)
        return;
    intervalId = setInterval(nextImage, AUTO_SLIDE_MS);
}
/*****************************************************************************************
 * FUNCTION: stopAutoSlide
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Stops the automatic slideshow if running and clears the timer.
 *
 * DESCRIPCIÓN: Detiene el pase de diapositivas automático y limpia el temporizador.
 *****************************************************************************************/
function stopAutoSlide() {
    if (!intervalId)
        return;
    clearInterval(intervalId);
    intervalId = null;
}
/*****************************************************************************************
 * FUNCTION: handleThumbs
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Registers a like/dislike vote for the current project.
 *              - Persists the vote using `stateLikeDislikeStore`.
 *
 * DESCRIPCIÓN: Registra un voto de like/dislike para el proyecto actual.
 *              - Persiste el voto usando `stateLikeDislikeStore`.
 *****************************************************************************************/
function handleThumbs(value) {
    const i = currentProjectIndex.value;
    stateLikeDislikeStore.setVote(i, value);
}
/*****************************************************************************************
 * FUNCTION: dispatchWarm
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Dispatches a custom event to hint/preload a set of image URLs.
 *              - Event: 'warm-images' with `detail` as string or string[].
 *
 * DESCRIPCIÓN: Lanza un evento personalizado para sugerir/pre-cargar un conjunto de imágenes.
 *              - Evento: 'warm-images' con `detail` como string o string[].
 *****************************************************************************************/
function dispatchWarm(urls) {
    window.dispatchEvent(new CustomEvent('warm-images', { detail: urls }));
}
/*****************************************************************************************
 * FUNCTION: allImagesOf
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns all non-empty image URLs for a given project (array or map).
 *
 * DESCRIPCIÓN: Devuelve todas las URLs de imagen no vacías de un proyecto (arreglo o mapa).
 *****************************************************************************************/
function allImagesOf(p) {
    const img = p?.image;
    if (!img)
        return [];
    return Array.isArray(img) ? img.filter(Boolean) : Object.values(img).filter(Boolean);
}
/*****************************************************************************************
 * FUNCTION: currentAndNextImages
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the current and next image URLs of the active project.
 *              - Useful for warming up/preloading images.
 *
 * DESCRIPCIÓN: Devuelve las URLs de la imagen actual y la siguiente del proyecto activo.
 *              - Útil para warm-up/pre-carga de imágenes.
 *****************************************************************************************/
function currentAndNextImages() {
    const imgs = images.value;
    const i = currentImageIndex.value;
    if (!imgs?.length)
        return [];
    const next = imgs[(i + 1) % imgs.length];
    return [imgs[i], next].filter(Boolean);
}
/*****************************************************************************************
 * FUNCTION: intentWarmCurrentAndNext
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Emits a warm-up event for the current and next gallery images.
 *
 * DESCRIPCIÓN: Emite un evento de warm-up para la imagen actual y la siguiente de la galería.
 *****************************************************************************************/
function intentWarmCurrentAndNext() {
    dispatchWarm(currentAndNextImages());
}
/*****************************************************************************************
 * FUNCTION: intentWarmProject
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Emits a warm-up event for all images in the given project.
 *
 * DESCRIPCIÓN: Emite un evento de warm-up para todas las imágenes del proyecto dado.
 *****************************************************************************************/
function intentWarmProject(p) {
    dispatchWarm(allImagesOf(p));
}
/*****************************************************************************************
 * CONSTANT: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Promise that resolves when the component is mounted (DOM ready).
 *              - Useful for parent components that need to await readiness.
 *
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente está montado (DOM listo).
 *              - Útil para componentes padre que necesiten esperar disponibilidad.
 *****************************************************************************************/
const domReady = new Promise((resolve) => {
    onMounted(() => {
        resolve();
    });
});
const __VLS_exposed = { screen, domReady };
defineExpose(__VLS_exposed);
/*****************************************************************************************
 * LIFECYCLE: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes auto-slideshow and ensures like/dislike store is set for projects.
 *
 * DESCRIPCIÓN: Inicializa el auto-slideshow y asegura la preparación del store de likes/dislikes.
 *****************************************************************************************/
onMounted(() => {
    startAutoSlide();
    const keys = Object.keys(rawProjects.value ?? {});
    stateLikeDislikeStore.ensureInit(keys);
});
/*****************************************************************************************
 * LIFECYCLE: onBeforeUnmount
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Cleans up timers/listeners before component destruction.
 *              - Stops the auto slideshow interval.
 *
 * DESCRIPCIÓN: Limpia temporizadores/listeners antes de destruir el componente.
 *              - Detiene el intervalo del slideshow automático.
 *****************************************************************************************/
onBeforeUnmount(() => {
    stopAutoSlide();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container-fluid ProjectsApplication m-0 p-0" },
    ref: "currentProjectContainer",
});
/** @type {typeof __VLS_ctx.currentProjectContainer} */ ;
// @ts-ignore
[currentProjectContainer,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tools-container" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ onError: (__VLS_ctx.onImgError) },
    ...{ class: "logoPrinc" },
    src: (__VLS_ctx.safeUrl(__VLS_ctx.logoProjects)),
    alt: "Projects logo",
    decoding: "async",
    loading: "eager",
});
// @ts-ignore
[onImgError, safeUrl, logoProjects,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tools" },
});
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
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('About');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "toolButton iconContainer d-flex justify-content-center align-items-center" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-person" },
    ...{ style: {} },
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
    ...{ class: "bi bi-messenger" },
    ...{ style: {} },
});
const __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade",
    mode: "out-in",
}));
const __VLS_2 = __VLS_1({
    name: "fade",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ onMouseenter: (__VLS_ctx.intentWarmCurrentAndNext) },
    key: (__VLS_ctx.currentImage),
    src: (__VLS_ctx.currentImage),
    alt: "Project image",
    ...{ class: "img-fluid principalImg" },
});
// @ts-ignore
[intentWarmCurrentAndNext, currentImage, currentImage,];
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "containerPrinc mb-3" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "m-0 text-color" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "m-o p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({
    ...{ class: "m-0 p-0 mb-1 fw-bold" },
});
(__VLS_ctx.currentProject.name);
// @ts-ignore
[currentProject,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "whiteSpace-text fs-7 m-0 p-0" },
});
(__VLS_ctx.currentProject.description);
// @ts-ignore
[currentProject,];
__VLS_asFunctionalElement(__VLS_elements.br)({});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "text-anchor m-0 p-0 fw-bold" },
    target: "_blank",
    rel: "noopener noreferrer",
    href: (__VLS_ctx.currentProject.githubRep),
});
// @ts-ignore
[currentProject,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "fw-bold text-light" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "mt-2 mb-2 d-flex gap-1" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
/** @type {[typeof PillText, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(PillText, new PillText({
    ...{ 'onThumbsChange': {} },
    text: (__VLS_ctx.likes + 'K &nbsp;&nbsp;|&nbsp;&nbsp;'),
    indexProject: (__VLS_ctx.currentProjectIndex),
    type: "likeDislike",
}));
const __VLS_6 = __VLS_5({
    ...{ 'onThumbsChange': {} },
    text: (__VLS_ctx.likes + 'K &nbsp;&nbsp;|&nbsp;&nbsp;'),
    indexProject: (__VLS_ctx.currentProjectIndex),
    type: "likeDislike",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
const __VLS_10 = ({ thumbsChange: {} },
    { onThumbsChange: (__VLS_ctx.handleThumbs) });
// @ts-ignore
[likes, currentProjectIndex, handleThumbs,];
var __VLS_7;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toogleTech();
            // @ts-ignore
            [toogleTech,];
        } },
});
/** @type {[typeof PillText, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(PillText, new PillText({
    text: "Tech Used",
    type: "seeTech",
}));
const __VLS_13 = __VLS_12({
    text: "Tech Used",
    type: "seeTech",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
/** @type {[typeof PillText, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(PillText, new PillText({
    text: "Skills",
    type: "skills",
}));
const __VLS_17 = __VLS_16({
    text: "Skills",
    type: "skills",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "techContainer" },
    ref: "techContainer",
});
/** @type {typeof __VLS_ctx.techContainer} */ ;
// @ts-ignore
[techContainer,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "text-light m-0" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ style: ({ color: 'grey' }) },
});
(__VLS_ctx.techList.length);
// @ts-ignore
[techList,];
if (!__VLS_ctx.showTechInfo) {
    // @ts-ignore
    [showTechInfo,];
    __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
        ...{ onClick: (...[$event]) => {
                if (!(!__VLS_ctx.showTechInfo))
                    return;
                __VLS_ctx.toogleTech();
                // @ts-ignore
                [toogleTech,];
            } },
        ...{ class: "bi bi-caret-down-fill desplegable" },
    });
}
if (__VLS_ctx.showTechInfo) {
    // @ts-ignore
    [showTechInfo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mt-3" },
    });
    for (const [[name, desc], index] of __VLS_getVForSourceType((__VLS_ctx.techList))) {
        // @ts-ignore
        [techList,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "tech-item" },
            key: (index),
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ style: ({ backgroundColor: __VLS_ctx.getColor(name), color: __VLS_ctx.getColorText(name) }) },
            ...{ class: "iconoSkill" },
        });
        // @ts-ignore
        [getColor, getColorText,];
        (name[0]);
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
        (name);
        (desc);
    }
}
for (const [rawProjects, index] of __VLS_getVForSourceType((__VLS_ctx.otherProjects))) {
    // @ts-ignore
    [otherProjects,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (index),
        ...{ class: "containerSec d-flex mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "container-fluid d-flex justify-content-between m-0 p-0" },
    });
    if (__VLS_ctx.firstImageOf(rawProjects)) {
        // @ts-ignore
        [firstImageOf,];
        __VLS_asFunctionalElement(__VLS_elements.img)({
            ...{ onMouseenter: (...[$event]) => {
                    if (!(__VLS_ctx.firstImageOf(rawProjects)))
                        return;
                    __VLS_ctx.intentWarmProject(rawProjects);
                    // @ts-ignore
                    [intentWarmProject,];
                } },
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.firstImageOf(rawProjects)))
                        return;
                    __VLS_ctx.replacePrincipal(rawProjects.originalIndex, true);
                    // @ts-ignore
                    [replacePrincipal,];
                } },
            src: (__VLS_ctx.firstImageOf(rawProjects)),
            alt: "Project image",
            ...{ class: "secondImg selectHover m-0 p-0" },
        });
        // @ts-ignore
        [firstImageOf,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "secondText p-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h6, __VLS_elements.h6)({
        ...{ onMouseenter: (...[$event]) => {
                __VLS_ctx.intentWarmProject(rawProjects);
                // @ts-ignore
                [intentWarmProject,];
            } },
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.replacePrincipal(rawProjects.originalIndex, true);
                // @ts-ignore
                [replacePrincipal,];
            } },
        ...{ class: "m-0 p-0 fw-bold selectHover" },
    });
    (rawProjects.name);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "m-0 p-0" },
    });
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        ...{ class: "text-anchor m-0 p-0 fw-bold" },
        target: "_blank",
        rel: "noopener noreferrer",
        href: (rawProjects.githubRep),
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "fw-bold text-light" },
    });
}
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['ProjectsApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['tools-container']} */ ;
/** @type {__VLS_StyleScopedClasses['logoPrinc']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-house-door-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-person']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-messenger']} */ ;
/** @type {__VLS_StyleScopedClasses['img-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['principalImg']} */ ;
/** @type {__VLS_StyleScopedClasses['containerPrinc']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-color']} */ ;
/** @type {__VLS_StyleScopedClasses['m-o']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['whiteSpace-text']} */ ;
/** @type {__VLS_StyleScopedClasses['fs-7']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-anchor']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['techContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-caret-down-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['desplegable']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['tech-item']} */ ;
/** @type {__VLS_StyleScopedClasses['iconoSkill']} */ ;
/** @type {__VLS_StyleScopedClasses['containerSec']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['secondImg']} */ ;
/** @type {__VLS_StyleScopedClasses['selectHover']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['secondText']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['selectHover']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-anchor']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['fw-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        PillText: PillText,
        currentProjectContainer: currentProjectContainer,
        techContainer: techContainer,
        showTechInfo: showTechInfo,
        currentProjectIndex: currentProjectIndex,
        logoProjects: logoProjects,
        currentProject: currentProject,
        currentImage: currentImage,
        likes: likes,
        otherProjects: otherProjects,
        techList: techList,
        safeUrl: safeUrl,
        onImgError: onImgError,
        toogleTech: toogleTech,
        getColor: getColor,
        getColorText: getColorText,
        go: go,
        firstImageOf: firstImageOf,
        replacePrincipal: replacePrincipal,
        handleThumbs: handleThumbs,
        intentWarmCurrentAndNext: intentWarmCurrentAndNext,
        intentWarmProject: intentWarmProject,
    }),
});
export default (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
});
; /* PartiallyEnd: #4569/main.vue */
