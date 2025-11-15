import { computed } from 'vue';
const props = withDefaults(defineProps(), {
    text: '',
    replaceClass: '',
});
const klass = computed(() => {
    const r = props.replaceClass?.trim();
    return r ? r : 'pill';
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    text: '',
    replaceClass: '',
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['pill']} */ ;
/** @type {__VLS_StyleScopedClasses['less']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: (__VLS_ctx.klass) },
});
// @ts-ignore
[klass,];
(__VLS_ctx.text);
// @ts-ignore
[text,];
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        klass: klass,
    }),
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
