import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAssetsPreload } from '@/stores/useAssetsPreload';
import { useRouter } from 'vue-router';
const assets = useAssetsPreload();
const router = useRouter();
const currentTime = ref('');
const currentDate = ref('');
const screen = ref(null);
const emit = defineEmits();
/*****************************************************************************************
 * FUNCTION: goTo
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation between different tablet screens based on a route keyword.
 *              - Emits a `change-screen` event with the appropriate view name.
 *              - Supports the following route values: "skills", "experience", "about",
 *                "projects", "contact", and "blog".
 *
 * DESCRIPCIÓN: Maneja la navegación entre diferentes pantallas de la tablet según una palabra clave.
 *              - Emite un evento `change-screen` con el nombre de la vista correspondiente.
 *              - Soporta los siguientes valores de ruta: "skills", "experience", "about",
 *                "projects", "contact" y "blog".
 *****************************************************************************************/
const goTo = (route) => {
    if (route === 'skills')
        emit('change-screen', 'Skills');
    else if (route === 'experience')
        emit('change-screen', 'Experience');
    else if (route === 'about')
        emit('change-screen', 'About');
    else if (route === 'projects')
        emit('change-screen', 'Projects');
    else if (route === 'contact')
        emit('change-screen', 'Contact');
    else if (route === 'contactEmail')
        emit('change-screen', 'ContactEmail');
    else if (route === 'blog')
        router.push({ name: 'BlogView' });
};
/*****************************************************************************************
 * VARIABLE: domReady
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: A Promise that resolves when the component has been mounted.
 *              - Useful for delaying operations until the DOM is ready.
 *              - Used in conjunction with `defineExpose()` to allow parent access.
 * ***************************************************************************************
 * DESCRIPCIÓN: Promesa que se resuelve cuando el componente ha sido montado.
 *              - Útil para retrasar operaciones hasta que el DOM esté listo.
 *              - Se utiliza junto con `defineExpose()` para permitir el acceso desde el padre.
 *****************************************************************************************/
const domReady = new Promise((resolve) => {
    onMounted(resolve);
});
/*****************************************************************************************
 * FUNCTION CALL: defineExpose
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Makes internal variables accessible to the parent component.
 *              - Exposes `screen` (DOM reference) and `domReady` (Promise).
 * ***************************************************************************************
 * DESCRIPCIÓN: Expone variables internas al componente padre.
 *              - Expone `screen` (referencia al DOM) y `domReady` (Promesa).
 *****************************************************************************************/
let __VLS_exposed;
defineExpose({
    screen,
    domReady,
});
/*****************************************************************************************
 * FUNCTION: updateTime
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Updates the reactive `currentTime` variable with the current time in HH:mm format.
 *              - Pads hours and minutes with leading zeros if needed.
 *              - Used to keep a live digital clock on the screen.
 * ***************************************************************************************
 * DESCRIPCIÓN: Actualiza la variable reactiva `currentTime` con la hora actual en formato HH:mm.
 *              - Rellena con ceros a la izquierda si es necesario.
 *              - Se utiliza para mantener un reloj digital en la pantalla.
 *****************************************************************************************/
const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    currentTime.value = `${hours}:${minutes}`;
};
/*****************************************************************************************
 * FUNCTION: updateDate
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Updates the reactive `currentDate` variable with the current date
 *              formatted as 'Day, DD Month' (e.g., 'Sun, 04 August').
 *              - Retrieves day and month names from predefined arrays.
 *              - Pads the day number with a leading zero.
 * ***************************************************************************************
 * DESCRIPCIÓN: Actualiza la variable reactiva `currentDate` con la fecha actual
 *              formateada como 'Day, DD Month' (ej: 'Sun, 04 August').
 *              - Obtiene los nombres del día y del mes desde arreglos predefinidos.
 *              - Rellena con cero a la izquierda el número del día.
 *****************************************************************************************/
const updateDate = () => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const dayName = days[now.getDay()];
    const dayNumber = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    currentDate.value = `${dayName}, ${dayNumber} ${monthName}`;
};
let timer = null;
/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Runs once the component is mounted to the DOM.
 *              - Initializes the clock by calling `updateTime()` and `updateDate()`.
 *              - Starts a timer to update the time every 60 seconds.
 * ***************************************************************************************
 * DESCRIPCIÓN: Se ejecuta una vez que el componente ha sido montado en el DOM.
 *              - Inicializa el reloj llamando a `updateTime()` y `updateDate()`.
 *              - Inicia un temporizador para actualizar la hora cada 60 segundos.
 *****************************************************************************************/
onMounted(() => {
    updateTime();
    updateDate();
    timer = window.setInterval(updateTime, 60_000);
});
/*****************************************************************************************
 * LIFECYCLE HOOK: onBeforeUnmount
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Runs just before the component is destroyed.
 *              - Clears the interval timer used to update the clock.
 *              - Prevents memory leaks from lingering timers.
 * ***************************************************************************************
 * DESCRIPCIÓN: Se ejecuta justo antes de que el componente sea destruido.
 *              - Limpia el temporizador usado para actualizar el reloj.
 *              - Previene fugas de memoria por temporizadores activos.
 *****************************************************************************************/
onBeforeUnmount(() => {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['initContent']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-container']} */ ;
/** @type {__VLS_StyleScopedClasses['initContent']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioIconoApp']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-time']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-date']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "screen",
    ...{ class: "initWrapper" },
});
/** @type {typeof __VLS_ctx.screen} */ ;
// @ts-ignore
[screen,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ class: "wallpaper" },
    src: (__VLS_ctx.assets.icons.wallpaper),
    alt: "Init Wallpaper",
});
// @ts-ignore
[assets,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container-fluid initContent m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "clock-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "clock-time" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.currentTime);
// @ts-ignore
[currentTime,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "clock-date" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
(__VLS_ctx.currentDate);
// @ts-ignore
[currentDate,];
if (__VLS_ctx.assets.initIconsReady) {
    // @ts-ignore
    [assets,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "icon-grid mt-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.assets.initIconsReady))
                    return;
                __VLS_ctx.goTo('about');
                // @ts-ignore
                [goTo,];
            } },
        ...{ class: "btn app-button" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ class: "tamanioIconoApp" },
        src: (__VLS_ctx.assets.icons.about),
        alt: "About",
    });
    // @ts-ignore
    [assets,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.assets.initIconsReady))
                    return;
                __VLS_ctx.goTo('projects');
                // @ts-ignore
                [goTo,];
            } },
        ...{ class: "btn app-button" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ class: "tamanioIconoApp" },
        src: (__VLS_ctx.assets.icons.projects),
        alt: "Projects",
    });
    // @ts-ignore
    [assets,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.assets.initIconsReady))
                    return;
                __VLS_ctx.goTo('experience');
                // @ts-ignore
                [goTo,];
            } },
        ...{ class: "btn app-button" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ class: "tamanioIconoApp" },
        src: (__VLS_ctx.assets.icons.experience),
        alt: "Experience",
    });
    // @ts-ignore
    [assets,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.assets.initIconsReady))
                    return;
                __VLS_ctx.goTo('skills');
                // @ts-ignore
                [goTo,];
            } },
        ...{ class: "btn app-button" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ class: "tamanioIconoApp" },
        src: (__VLS_ctx.assets.icons.skills),
        alt: "Skills",
    });
    // @ts-ignore
    [assets,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.assets.initIconsReady))
                    return;
                __VLS_ctx.goTo('contact');
                // @ts-ignore
                [goTo,];
            } },
        ...{ class: "btn app-button" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ class: "tamanioIconoApp" },
        src: (__VLS_ctx.assets.icons.contact),
        alt: "Contact",
    });
    // @ts-ignore
    [assets,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.assets.initIconsReady))
                    return;
                __VLS_ctx.goTo('blog');
                // @ts-ignore
                [goTo,];
            } },
        ...{ class: "btn app-button" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ class: "tamanioIconoApp" },
        src: (__VLS_ctx.assets.icons.blog),
        alt: "Blog",
    });
    // @ts-ignore
    [assets,];
}
/** @type {__VLS_StyleScopedClasses['initWrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['wallpaper']} */ ;
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['initContent']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-container']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-time']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-date']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioIconoApp']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioIconoApp']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioIconoApp']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioIconoApp']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioIconoApp']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['app-button']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioIconoApp']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        assets: assets,
        currentTime: currentTime,
        currentDate: currentDate,
        screen: screen,
        goTo: goTo,
    }),
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
    __typeEmits: {},
});
; /* PartiallyEnd: #4569/main.vue */
