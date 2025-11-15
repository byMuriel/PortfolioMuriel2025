const emit = defineEmits();
/*****************************************************************************************
 * FUNCTION: goBack
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Emits a signal to change the current screen back to the Init view.
 *              - Triggers the 'change-screen' event with the 'Init' value.
 *              - Intended to be used by the BackButton component to return to the home screen.
 * ***************************************************************************************
 * DESCRIPCIÓN: Emite una señal para cambiar la vista actual de nuevo a la pantalla Init.
 *              - Dispara el evento 'change-screen' con el valor 'Init'.
 *              - Pensado para ser usado por el componente BackButton para volver al inicio.
 *****************************************************************************************/
const goBack = () => {
    emit('change-screen', 'Init');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "containerBackButton m-1" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.goBack();
            // @ts-ignore
            [goBack,];
        } },
    ...{ class: "bi bi-arrow-left-short back-icon" },
});
/** @type {__VLS_StyleScopedClasses['containerBackButton']} */ ;
/** @type {__VLS_StyleScopedClasses['m-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-arrow-left-short']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        goBack: goBack,
    }),
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
});
; /* PartiallyEnd: #4569/main.vue */
