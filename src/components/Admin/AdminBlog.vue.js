import { ref, computed } from 'vue';
import { createBlogPost } from '@/services/adminBlog';
const form = ref({
    name: '',
    image: '',
    content: '',
    date: new Date().toISOString().slice(0, 10),
});
const showAlert = ref(false);
const loading = ref(false);
const tried = ref(false);
const serverMsg = ref('');
const serverOk = ref(false);
const rules = computed(() => ({
    name: form.value.name.trim().length >= 3,
    content: form.value.content.trim().length >= 10,
    date: /^\d{4}-\d{2}-\d{2}$/.test(form.value.date),
}));
const valid = computed(() => rules.value.name && rules.value.content && rules.value.date);
function reset() {
    form.value = { name: '', image: '', content: '', date: new Date().toISOString().slice(0, 10) };
    tried.value = false;
}
async function onSubmit() {
    tried.value = true;
    if (!valid.value || loading.value)
        return;
    loading.value = true;
    try {
        const payload = {
            name: form.value.name.trim(),
            image: (form.value.image ?? '').trim(),
            //content: form.value.content.trim(),
            content: form.value.content.replace(/\r\n?/g, '\n'),
            date: form.value.date, // ya es YYYY-MM-DD
        };
        const res = await createBlogPost(payload);
        serverOk.value = true;
        serverMsg.value = res.message || `Post creado con éxito (ID: ${res.id}).`;
        showAlert.value = true;
        reset();
    }
    catch (err) {
        serverOk.value = false;
        serverMsg.value = err?.message ?? 'No se pudo crear el post.';
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
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
    ...{ class: "adminBlog container py-4" },
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
    (__VLS_ctx.serverMsg || '¡Post creado con éxito!');
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
    ...{ class: "col-12" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.form.name),
    type: "text",
    ...{ class: "form-control" },
    placeholder: "Ej: Cómo migré mi blog a MySQL",
    ...{ class: ({ 'is-invalid': __VLS_ctx.tried && !__VLS_ctx.rules.name }) },
});
// @ts-ignore
[form, tried, rules,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "invalid-feedback" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "url",
    ...{ class: "form-control" },
    placeholder: "https://.../imagen.jpg",
});
(__VLS_ctx.form.image);
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
    ...{ class: "text-muted" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12 col-md-4" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "date",
    ...{ class: "form-control" },
    ...{ class: ({ 'is-invalid': __VLS_ctx.tried && !__VLS_ctx.rules.date }) },
});
(__VLS_ctx.form.date);
// @ts-ignore
[form, tried, rules,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "invalid-feedback" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "col-12" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "form-label" },
});
__VLS_asFunctionalElement(__VLS_elements.textarea)({
    value: (__VLS_ctx.form.content),
    rows: "8",
    ...{ class: "form-control" },
    placeholder: "Escribe el contenido del post…",
    ...{ class: ({ 'is-invalid': __VLS_ctx.tried && !__VLS_ctx.rules.content }) },
});
// @ts-ignore
[form, tried, rules,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "invalid-feedback" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "d-flex align-items-center gap-2 mt-3" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "btn btn-primary" },
    type: "submit",
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
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
if (__VLS_ctx.serverMsg) {
    // @ts-ignore
    [serverMsg,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "mt-3" },
        ...{ class: (__VLS_ctx.serverOk ? 'text-success' : 'text-danger') },
    });
    // @ts-ignore
    [serverOk,];
    (__VLS_ctx.serverMsg);
    // @ts-ignore
    [serverMsg,];
}
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
if (__VLS_ctx.form.name || __VLS_ctx.form.image || __VLS_ctx.form.content) {
    // @ts-ignore
    [form, form, form,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "preview mt-4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({
        ...{ class: "mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card" },
    });
    if (__VLS_ctx.form.image) {
        // @ts-ignore
        [form,];
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.form.image),
            ...{ class: "card-img-top" },
            alt: "Preview",
        });
        // @ts-ignore
        [form,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "card-title m-0" },
    });
    (__VLS_ctx.form.name || 'Sin título');
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
        ...{ class: "text-muted" },
    });
    (__VLS_ctx.form.date || 'Sin fecha');
    // @ts-ignore
    [form,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "mt-3" },
        preline: true,
    });
    (__VLS_ctx.form.content || 'Sin contenido');
    // @ts-ignore
    [form,];
}
/** @type {__VLS_StyleScopedClasses['adminBlog']} */ ;
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
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['is-invalid']} */ ;
/** @type {__VLS_StyleScopedClasses['invalid-feedback']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['col-md-4']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['is-invalid']} */ ;
/** @type {__VLS_StyleScopedClasses['invalid-feedback']} */ ;
/** @type {__VLS_StyleScopedClasses['col-12']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['is-invalid']} */ ;
/** @type {__VLS_StyleScopedClasses['invalid-feedback']} */ ;
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
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['preview']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-img-top']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        form: form,
        showAlert: showAlert,
        loading: loading,
        tried: tried,
        serverMsg: serverMsg,
        serverOk: serverOk,
        rules: rules,
        reset: reset,
        onSubmit: onSubmit,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
