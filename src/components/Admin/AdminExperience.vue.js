import { ref, computed, onBeforeUnmount } from 'vue';
import { createExperience } from '@/services/adminBlogExperience';
const form = ref({
    company: '',
    role: '',
    start_date: new Date().toISOString().slice(0, 10),
    location: '',
    end_date: '',
    description: '',
    logo_url: '',
    company_url: '',
});
const loading = ref(false);
const tried = ref(false);
const serverMsg = ref('');
const serverOk = ref(false);
const showAlert = ref(false);
let alertTimer;
const rules = computed(() => ({
    company: form.value.company.trim().length >= 2,
    role: form.value.role.trim().length >= 2,
    start_date: /^\d{4}-\d{2}-\d{2}$/.test(form.value.start_date),
}));
const valid = computed(() => rules.value.company && rules.value.role && rules.value.start_date);
function openSuccessAlert() {
    showAlert.value = true;
    requestAnimationFrame(() => {
        document
            .querySelector('.adminExperience')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    if (alertTimer)
        clearTimeout(alertTimer);
    alertTimer = window.setTimeout(() => (showAlert.value = false), 4000);
}
function reset() {
    form.value = {
        company: '',
        role: '',
        start_date: new Date().toISOString().slice(0, 10),
        location: '',
        end_date: '',
        description: '',
        logo_url: '',
        company_url: '',
    };
    tried.value = false;
}
async function onSubmit() {
    tried.value = true;
    if (!valid.value || loading.value)
        return;
    loading.value = true;
    try {
        const payload = {
            company: form.value.company.trim(),
            role: form.value.role.trim(),
            start_date: form.value.start_date,
            location: form.value.location?.trim() || '',
            end_date: form.value.end_date || '',
            description: form.value.description?.trim() || '',
            logo_url: form.value.logo_url?.trim() || '',
            company_url: form.value.company_url?.trim() || '',
        };
        const res = await createExperience(payload);
        serverOk.value = true;
        serverMsg.value = res.message || `Experiencia creada (ID: ${res.id}).`;
        openSuccessAlert();
        reset();
    }
    catch (err) {
        serverOk.value = false;
        serverMsg.value = err?.message ?? 'No se pudo crear la experiencia.';
    }
    finally {
        loading.value = false;
    }
}
onBeforeUnmount(() => alertTimer && clearTimeout(alertTimer));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
    ...{ class: "adminExperience container py-4" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "mb-3" },
});
if (__VLS_ctx.serverOk && __VLS_ctx.showAlert) {
    // @ts-ignore
    [serverOk, showAlert,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "alert alert-success alert-dismissible fade show" },
        role: "alert",
    });
    (__VLS_ctx.serverMsg || '¡Experiencia creada con éxito!');
    // @ts-ignore
    [serverMsg,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.serverOk && __VLS_ctx.showAlert))
                    return;
                __VLS_ctx.showAlert = false;
                // @ts-ignore
                [showAlert,];
            } },
        type: "button",
        ...{ class: "btn-close" },
        'aria-label': "Close",
    });
}
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.onSubmit) },
    ...{ class: "card p-3" },
});
// @ts-ignore
[onSubmit,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "row g-3" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-6" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.form.company),
    type: "text",
    ...{ class: "form-control" },
    placeholder: "LOGÍSTICA Y TELECOMUNICACIÓN, S.L.",
    ...{ class: ({ 'is-invalid': __VLS_ctx.tried && !__VLS_ctx.rules.company }) },
});
// @ts-ignore
[form, tried, rules,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "invalid-feedback" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-6" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.form.role),
    type: "text",
    ...{ class: "form-control" },
    placeholder: "Full Stack Developer",
    ...{ class: ({ 'is-invalid': __VLS_ctx.tried && !__VLS_ctx.rules.role }) },
});
// @ts-ignore
[form, tried, rules,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "invalid-feedback" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-6" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.form.location),
    type: "text",
    ...{ class: "form-control" },
    placeholder: "Madrid",
});
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-3" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "date",
    ...{ class: "form-control" },
    ...{ class: ({ 'is-invalid': __VLS_ctx.tried && !__VLS_ctx.rules.start_date }) },
});
(__VLS_ctx.form.start_date);
// @ts-ignore
[form, tried, rules,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "invalid-feedback" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-3" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "date",
    ...{ class: "form-control" },
});
(__VLS_ctx.form.end_date);
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.textarea)({
    value: (__VLS_ctx.form.description),
    rows: "6",
    ...{ class: "form-control" },
    placeholder: "- Desarrollé y mantuve aplicaciones web…",
});
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-6" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "url",
    ...{ class: "form-control" },
    placeholder: "https://...",
});
(__VLS_ctx.form.logo_url);
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-6" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "url",
    ...{ class: "form-control" },
    placeholder: "https://...",
});
(__VLS_ctx.form.company_url);
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "d-flex align-items-center gap-2 mt-3" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "btn btn-primary" },
    type: "submit",
    disabled: (__VLS_ctx.loading || !__VLS_ctx.valid),
});
// @ts-ignore
[loading, valid,];
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.span)({
        ...{ class: "spinner-border spinner-border-sm me-2" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.reset) },
    ...{ class: "btn btn-outline-secondary" },
    type: "button",
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading, reset,];
__VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
    ...{ class: "ms-auto text-muted" },
});
if (!__VLS_ctx.serverOk && __VLS_ctx.serverMsg) {
    // @ts-ignore
    [serverOk, serverMsg,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "mt-3 text-danger" },
    });
    (__VLS_ctx.serverMsg);
    // @ts-ignore
    [serverMsg,];
}
/** @type {__VLS_StyleScopedClasses['adminExperience']} */ ;
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-success']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-dismissible']} */ ;
/** @type {__VLS_StyleScopedClasses['fade']} */ ;
/** @type {__VLS_StyleScopedClasses['show']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-close']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['row']} */ ;
/** @type {__VLS_StyleScopedClasses['g-3']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['is-invalid']} */ ;
/** @type {__VLS_StyleScopedClasses['invalid-feedback']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['is-invalid']} */ ;
/** @type {__VLS_StyleScopedClasses['invalid-feedback']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['is-invalid']} */ ;
/** @type {__VLS_StyleScopedClasses['invalid-feedback']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-6']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        form: form,
        loading: loading,
        tried: tried,
        serverMsg: serverMsg,
        serverOk: serverOk,
        showAlert: showAlert,
        rules: rules,
        valid: valid,
        reset: reset,
        onSubmit: onSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
