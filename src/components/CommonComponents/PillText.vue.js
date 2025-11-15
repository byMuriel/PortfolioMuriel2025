import { computed, onMounted, ref } from 'vue';
import { useRedirectStore } from '@/stores/useRedirect';
import { useStateLikeDislikeProjects } from '@/stores/useStateLikeDislikeProjects';
// Store Instances
const redirectStore = useRedirectStore();
const stateLikeDislikeStore = useStateLikeDislikeProjects();
const props = defineProps();
// StateFlags
const likeDislike = ref(false);
const seeTech = ref(false);
const skills = ref(false);
const emit = defineEmits();
/*****************************************************************************************
 * COMPUTED: vote
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive numeric state of the vote for the current project.
 *              0 = none, 1 = like, 2 = dislike.
 * ***************************************************************************************
 * COMPUTADO: vote
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Estado numérico reactivo del voto para el proyecto actual.
 *              0 = ninguno, 1 = like, 2 = dislike.
 *****************************************************************************************/
const vote = computed(() => {
    const i = props.indexProject;
    if (i == null)
        return 0;
    return stateLikeDislikeStore.projectVotes[String(i)] ?? 0;
});
/*****************************************************************************************
 * COMPUTED: thumbsUpFill
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed binding for the "like" state.
 *              - Getter returns true if vote is 1.
 *              - Setter updates the store and emits event.
 * ***************************************************************************************
 * COMPUTADO: thumbsUpFill
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Enlace computado para el estado "like".
 *              - Getter devuelve true si el voto es 1.
 *              - Setter actualiza el store y emite evento.
 *****************************************************************************************/
const thumbsUpFill = computed({
    get: () => vote.value === 1,
    set: (val) => {
        const i = props.indexProject;
        if (i == null)
            return;
        const next = val ? 1 : 0;
        stateLikeDislikeStore.setVote(i, next);
        emit('thumbsChange', next);
    },
});
/*****************************************************************************************
 * COMPUTED: thumbsDownFill
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed binding for the "dislike" state.
 *              - Getter returns true if vote is 2.
 *              - Setter updates the store and emits event.
 * ***************************************************************************************
 * COMPUTADO: thumbsDownFill
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Enlace computado para el estado "dislike".
 *              - Getter devuelve true si el voto es 2.
 *              - Setter actualiza el store y emite evento.
 *****************************************************************************************/
const thumbsDownFill = computed({
    get: () => vote.value === 2,
    set: (val) => {
        const i = props.indexProject;
        if (i == null)
            return;
        const next = val ? 2 : 0;
        stateLikeDislikeStore.setVote(i, next);
        emit('thumbsChange', next);
    },
});
/*****************************************************************************************
 * FUNCTION: receivedType
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Sets local flags (likeDislike, seeTech, skills) depending on the
 *              prop type received. Ensures only one mode is active at a time.
 * ***************************************************************************************
 * FUNCIÓN: receivedType
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Configura las banderas locales (likeDislike, seeTech, skills)
 *              según la prop type recibida. Garantiza que solo un modo esté activo.
 *****************************************************************************************/
function receivedType() {
    if (props.type == 'likeDislike') {
        likeDislike.value = true;
        seeTech.value = false;
    }
    else if (props.type == 'seeTech') {
        seeTech.value = true;
        likeDislike.value = false;
    }
    else if (props.type == 'skills') {
        skills.value = true;
        seeTech.value = false;
        likeDislike.value = false;
    }
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation from the About component to another screen.
 * ***************************************************************************************
 * FUNCIÓN: go
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Gestiona la navegación desde el componente About hacia otra pantalla.
 *****************************************************************************************/
function go(to) {
    redirectStore.redirect(to);
}
/*****************************************************************************************
 * FUNCTION: clickOn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles user interactions with the pill buttons.
 *              - Toggles thumbsUpFill or thumbsDownFill when clicked.
 *              - Emits 'thumbsChange' with 0 when "techUsed" is selected.
 * ***************************************************************************************
 * FUNCIÓN: clickOn
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Gestiona las interacciones del usuario con los botones pill.
 *              - Alterna thumbsUpFill o thumbsDownFill al hacer clic.
 *              - Emite 'thumbsChange' con 0 cuando se selecciona "techUsed".
 *****************************************************************************************/
function clickOn(id) {
    if (id === 'thumbsUp') {
        thumbsUpFill.value = !thumbsUpFill.value;
    }
    else if (id === 'thumbsDown') {
        thumbsDownFill.value = !thumbsDownFill.value;
    }
    else if (id === 'techUsed') {
        emit('thumbsChange', 0);
    }
}
/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Lifecycle hook triggered after component is mounted.
 *              Calls receivedType() to initialize local state flags based on props.type.
 * ***************************************************************************************
 * CICLO DE VIDA: onMounted
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Hook de ciclo de vida que se dispara tras montar el componente.
 *              Llama a receivedType() para inicializar las banderas locales según props.type.
 *****************************************************************************************/
onMounted(() => {
    receivedType();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.likeDislike) {
    // @ts-ignore
    [likeDislike,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "pill" },
    });
    if (!__VLS_ctx.thumbsUpFill) {
        // @ts-ignore
        [thumbsUpFill,];
        __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.likeDislike))
                        return;
                    if (!(!__VLS_ctx.thumbsUpFill))
                        return;
                    __VLS_ctx.clickOn('thumbsUp');
                    // @ts-ignore
                    [clickOn,];
                } },
            ...{ class: "bi-hand-thumbs-up boton" },
            ...{ style: {} },
        });
        (__VLS_ctx.text);
        // @ts-ignore
        [text,];
    }
    if (__VLS_ctx.thumbsUpFill) {
        // @ts-ignore
        [thumbsUpFill,];
        __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.likeDislike))
                        return;
                    if (!(__VLS_ctx.thumbsUpFill))
                        return;
                    __VLS_ctx.clickOn('thumbsUp');
                    // @ts-ignore
                    [clickOn,];
                } },
            ...{ class: "bi-hand-thumbs-up-fill boton" },
            ...{ style: {} },
        });
        (__VLS_ctx.text);
        // @ts-ignore
        [text,];
    }
    if (!__VLS_ctx.thumbsDownFill) {
        // @ts-ignore
        [thumbsDownFill,];
        __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.likeDislike))
                        return;
                    if (!(!__VLS_ctx.thumbsDownFill))
                        return;
                    __VLS_ctx.clickOn('thumbsDown');
                    // @ts-ignore
                    [clickOn,];
                } },
            ...{ class: "bi-hand-thumbs-down boton" },
            ...{ style: {} },
        });
    }
    if (__VLS_ctx.thumbsDownFill) {
        // @ts-ignore
        [thumbsDownFill,];
        __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.likeDislike))
                        return;
                    if (!(__VLS_ctx.thumbsDownFill))
                        return;
                    __VLS_ctx.clickOn('thumbsDown');
                    // @ts-ignore
                    [clickOn,];
                } },
            ...{ class: "bi-hand-thumbs-down-fill boton" },
            ...{ style: {} },
        });
    }
}
if (__VLS_ctx.seeTech) {
    // @ts-ignore
    [seeTech,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "pill" },
    });
    __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.seeTech))
                    return;
                __VLS_ctx.clickOn('techUsed');
                // @ts-ignore
                [clickOn,];
            } },
        ...{ class: "bi bi-keyboard boton" },
        ...{ style: {} },
    });
    (__VLS_ctx.text);
    // @ts-ignore
    [text,];
}
if (__VLS_ctx.skills) {
    // @ts-ignore
    [skills,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.skills))
                    return;
                __VLS_ctx.go('Skills');
                // @ts-ignore
                [go,];
            } },
        ...{ class: "pill" },
    });
    __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
        ...{ class: "bi bi-keyboard boton" },
        ...{ style: {} },
    });
    (__VLS_ctx.text);
    // @ts-ignore
    [text,];
}
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-hand-thumbs-up']} */ ;
/** @type {__VLS_StyleScopedClasses['boton']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-hand-thumbs-up-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['boton']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-hand-thumbs-down']} */ ;
/** @type {__VLS_StyleScopedClasses['boton']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-hand-thumbs-down-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['boton']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-keyboard']} */ ;
/** @type {__VLS_StyleScopedClasses['boton']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-keyboard']} */ ;
/** @type {__VLS_StyleScopedClasses['boton']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        likeDislike: likeDislike,
        seeTech: seeTech,
        skills: skills,
        thumbsUpFill: thumbsUpFill,
        thumbsDownFill: thumbsDownFill,
        go: go,
        clickOn: clickOn,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
