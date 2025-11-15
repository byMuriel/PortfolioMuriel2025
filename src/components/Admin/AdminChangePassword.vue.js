import { ref, computed } from 'vue';
import { changePassword } from '@/services/auth';
const form = ref({
    current_password: '',
    new_password: '',
    confirm_password: '',
});
const loading = ref(false);
const errorMsg = ref('');
const okMsg = ref('');
// toggles “ojo”
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);
function toggle(which) {
    if (which === 'current')
        showCurrent.value = !showCurrent.value;
    if (which === 'new')
        showNew.value = !showNew.value;
    if (which === 'confirm')
        showConfirm.value = !showConfirm.value;
}
const strengthLabel = computed(() => {
    const v = form.value.new_password;
    let score = 0;
    if (v.length >= 8)
        score++;
    if (/[A-Z]/.test(v))
        score++;
    if (/[a-z]/.test(v))
        score++;
    if (/\d/.test(v))
        score++;
    if (/[^A-Za-z0-9]/.test(v))
        score++;
    return ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte', 'Excelente'][score] || 'Muy débil';
});
async function onSubmit() {
    errorMsg.value = '';
    okMsg.value = '';
    // validación mínima client-side
    if (form.value.new_password !== form.value.confirm_password) {
        errorMsg.value = 'La confirmación no coincide';
        return;
    }
    loading.value = true;
    try {
        const resp = await changePassword(form.value);
        okMsg.value = resp.message || 'Contraseña actualizada con éxito';
        // Reset seguro: limpia las nuevas, deja la actual vacía
        form.value.current_password = '';
        form.value.new_password = '';
        form.value.confirm_password = '';
        showCurrent.value = showNew.value = showConfirm.value = false;
    }
    catch (e) {
        errorMsg.value = e?.message || 'No se pudo actualizar la contraseña';
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
    ...{ class: "securityTab" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.onSubmit) },
    ...{ class: "card p-3" },
    novalidate: true,
});
// @ts-ignore
[onSubmit,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group mb-3" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: (__VLS_ctx.showCurrent ? 'text' : 'password'),
    ...{ class: "form-control" },
    autocomplete: "current-password",
    required: true,
});
(__VLS_ctx.form.current_password);
// @ts-ignore
[showCurrent, form,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggle('current');
            // @ts-ignore
            [toggle,];
        } },
    ...{ class: "btn btn-outline-secondary" },
    type: "button",
    'aria-pressed': (__VLS_ctx.showCurrent),
    title: (__VLS_ctx.showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'),
});
// @ts-ignore
[showCurrent, showCurrent,];
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: (__VLS_ctx.showCurrent ? 'bi bi-eye-slash' : 'bi bi-eye') },
});
// @ts-ignore
[showCurrent,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group mb-1" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: (__VLS_ctx.showNew ? 'text' : 'password'),
    ...{ class: "form-control" },
    autocomplete: "new-password",
    required: true,
    minlength: "8",
});
(__VLS_ctx.form.new_password);
// @ts-ignore
[form, showNew,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggle('new');
            // @ts-ignore
            [toggle,];
        } },
    ...{ class: "btn btn-outline-secondary" },
    type: "button",
    'aria-pressed': (__VLS_ctx.showNew),
    title: (__VLS_ctx.showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'),
});
// @ts-ignore
[showNew, showNew,];
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: (__VLS_ctx.showNew ? 'bi bi-eye-slash' : 'bi bi-eye') },
});
// @ts-ignore
[showNew,];
__VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
    ...{ class: "text-muted mb-3 d-block" },
});
(__VLS_ctx.strengthLabel);
// @ts-ignore
[strengthLabel,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group mb-3" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: (__VLS_ctx.showConfirm ? 'text' : 'password'),
    ...{ class: "form-control" },
    autocomplete: "new-password",
    required: true,
});
(__VLS_ctx.form.confirm_password);
// @ts-ignore
[form, showConfirm,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggle('confirm');
            // @ts-ignore
            [toggle,];
        } },
    ...{ class: "btn btn-outline-secondary" },
    type: "button",
    'aria-pressed': (__VLS_ctx.showConfirm),
    title: (__VLS_ctx.showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'),
});
// @ts-ignore
[showConfirm, showConfirm,];
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: (__VLS_ctx.showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye') },
});
// @ts-ignore
[showConfirm,];
if (__VLS_ctx.errorMsg) {
    // @ts-ignore
    [errorMsg,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-danger" },
        role: "alert",
        'aria-live': "assertive",
    });
    (__VLS_ctx.errorMsg);
    // @ts-ignore
    [errorMsg,];
}
if (__VLS_ctx.okMsg) {
    // @ts-ignore
    [okMsg,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-success" },
        role: "status",
        'aria-live': "polite",
    });
    (__VLS_ctx.okMsg);
    // @ts-ignore
    [okMsg,];
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    ...{ class: "btn btn-primary" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "spinner-border spinner-border-sm me-2" },
        'aria-hidden': "true",
    });
}
/** @type {__VLS_StyleScopedClasses['securityTab']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-block']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['text-success']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        form: form,
        loading: loading,
        errorMsg: errorMsg,
        okMsg: okMsg,
        showCurrent: showCurrent,
        showNew: showNew,
        showConfirm: showConfirm,
        toggle: toggle,
        strengthLabel: strengthLabel,
        onSubmit: onSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
