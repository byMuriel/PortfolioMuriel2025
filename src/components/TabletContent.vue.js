import { ref, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { useRedirectStore } from '@/stores/useRedirect';
import { useLastScreen } from '@/stores/useLastScreen';
import { useAppLogosStore } from '@/stores/useAppLogos';
import { useAboutStore } from '@/stores/useAbout';
import { useSkillsStore } from '@/stores/useSkills';
import { useProjectsStore } from '@/stores/useProjects';
import { useExperiencesStore } from '@/stores/useExperiences';
import { useContactChannelsStore } from '@/stores/useContactChannels';
import BackButton from '@/components/CommonComponents/BackButton.vue';
import Init from './TabletScreens/Init.vue';
import About from './TabletScreens/About.vue';
import Skills from './TabletScreens/Skills.vue';
import Experience from './TabletScreens/Experience.vue';
import Projects from './TabletScreens/Projects.vue';
import Contact from './TabletScreens/Contact.vue';
import ContactEmail from './TabletScreens/ContactEmail.vue';
import Blog from './Blog.vue';
const appLogosStore = useAppLogosStore();
const redirectStore = useRedirectStore();
const lastScreen = useLastScreen();
const aboutStore = useAboutStore();
const skillsStore = useSkillsStore();
const projectsStore = useProjectsStore();
const experiencesStore = useExperiencesStore();
const contactChannelsStore = useContactChannelsStore();
let popHandler = null;
let lastBackTs = 0;
const views = {
    Init,
    About,
    Skills,
    Experience,
    Projects,
    Contact,
    ContactEmail,
    Blog,
};
const currentView = shallowRef(Init);
const handleChangeScreen = (newView) => {
    lastScreen.changeLastScreen(newView);
    currentView.value = views[newView] || Init;
    redirectStore.current = newView;
};
const toReturn = () => {
    if (lastScreen.lastScreen !== redirectStore.current) {
        redirectStore.current = lastScreen.lastScreen;
    }
    else {
        lastScreen.changeLastScreen('Init');
        redirectStore.current = 'Init';
    }
};
const screen = ref(null);
const domReady = new Promise((resolve) => {
    onMounted(resolve);
});
const showExitHint = ref(false);
let hideHintTimer = null;
function hintExitOnce(ms = 1500) {
    showExitHint.value = true;
    if (hideHintTimer)
        window.clearTimeout(hideHintTimer);
    hideHintTimer = window.setTimeout(() => (showExitHint.value = false), ms);
}
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
watch(() => redirectStore.current, (newView) => {
    currentView.value = views[newView] || Init;
}, { immediate: true });
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
    ]);
    // Empuja un estado "ancla" para consumir el primer back sin salir
    history.pushState({ spa: true }, '', location.href);
    popHandler = () => {
        const now = Date.now();
        // Si NO estamos en Init → forzar Init y reponer estado
        if (redirectStore.current !== 'Init') {
            redirectStore.goInit();
            history.pushState({ spa: true }, '', location.href);
            return;
        }
        // Ya estamos en Init:
        //  - Primer atrás → mostrar aviso y reponer estado (no salimos)
        //  - Segundo atrás (rápido) → permitir salir (no reponemos el estado)
        if (now - lastBackTs < 1500) {
            // 2do toque: permitir salida
            // Importante: quitar el listener para no interferir con el cierre
            if (popHandler)
                window.removeEventListener('popstate', popHandler);
            // No hacemos pushState aquí: dejamos que el SO/navegador salga
            return;
        }
        // 1er toque: avisar y bloquear salida reponiendo el estado
        lastBackTs = now;
        console.log('[BACK] Hint exit once');
        hintExitOnce(1500);
        history.pushState({ spa: true }, '', location.href);
    };
    window.addEventListener('popstate', popHandler);
});
onBeforeUnmount(() => {
    if (popHandler)
        window.removeEventListener('popstate', popHandler);
    if (hideHintTimer)
        window.clearTimeout(hideHintTimer);
});
const __VLS_exposed = {
    screen,
    domReady,
};
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "screen",
    ...{ class: "screen-content" },
});
/** @type {typeof __VLS_ctx.screen} */ ;
// @ts-ignore
[screen,];
if (__VLS_ctx.redirectStore.current !== 'Init') {
    // @ts-ignore
    [redirectStore,];
    /** @type {[typeof BackButton, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(BackButton, new BackButton({
        ...{ 'onChangeScreen': {} },
        ...{ class: "back-button" },
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onChangeScreen': {} },
        ...{ class: "back-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ changeScreen: {} },
        { onChangeScreen: (__VLS_ctx.toReturn) });
    // @ts-ignore
    [toReturn,];
    var __VLS_2;
}
const __VLS_7 = ((__VLS_ctx.currentView));
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({
    ...{ 'onChangeScreen': {} },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onChangeScreen': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
const __VLS_13 = ({ changeScreen: {} },
    { onChangeScreen: (__VLS_ctx.handleChangeScreen) });
// @ts-ignore
[currentView, handleChangeScreen,];
var __VLS_10;
if (__VLS_ctx.showExitHint) {
    // @ts-ignore
    [showExitHint,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "position-fixed bottom-0 start-50 translate-middle-x mb-3" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "bg-dark text-white px-3 py-2 rounded-3 shadow" },
    });
}
/** @type {__VLS_StyleScopedClasses['screen-content']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['position-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
/** @type {__VLS_StyleScopedClasses['start-50']} */ ;
/** @type {__VLS_StyleScopedClasses['translate-middle-x']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dark']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        BackButton: BackButton,
        redirectStore: redirectStore,
        currentView: currentView,
        handleChangeScreen: handleChangeScreen,
        toReturn: toReturn,
        screen: screen,
        showExitHint: showExitHint,
    }),
});
export default (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
});
; /* PartiallyEnd: #4569/main.vue */
