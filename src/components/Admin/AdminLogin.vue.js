import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authLogin, authTotpSetup, authVerifyTotp } from '@/services/auth';
const router = useRouter();
const step = ref('userpass');
const username = ref('');
const password = ref('');
const showPwd = ref(false);
const code = ref('');
const loading = ref(false);
const ok = ref(false);
const msg = ref('');
const qr = ref('');
const secret = ref('');
async function doLogin() {
    loading.value = true;
    msg.value = '';
    ok.value = false;
    try {
        const data = await authLogin(username.value, password.value);
        if (data.needs_totp) {
            // Ya tenía 2FA -> solo verificar
            step.value = 'verify';
            msg.value = 'Ingrese su código 2FA.';
            ok.value = true;
        }
        else {
            // No tenía 2FA -> configurar
            const s = await authTotpSetup();
            qr.value = s.qr;
            secret.value = s.secret;
            step.value = 'setup';
            msg.value = 'Escanee el QR y verifique el código.';
            ok.value = true;
        }
    }
    catch (e) {
        msg.value = e?.message ?? 'Error en login';
        ok.value = false;
    }
    finally {
        loading.value = false;
    }
}
async function verify() {
    loading.value = true;
    ok.value = false;
    msg.value = '';
    try {
        await authVerifyTotp(code.value);
        ok.value = true;
        msg.value = 'Autenticación completada';
        // Ir al panel
        const redirect = router.currentRoute.value.query.r || '/admin';
        router.push(redirect);
    }
    catch (e) {
        msg.value = e?.message ?? 'Código inválido';
        ok.value = false;
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
    ...{ class: "container py-4" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "mb-3" },
});
if (__VLS_ctx.msg) {
    // @ts-ignore
    [msg,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "alert" },
        ...{ class: (__VLS_ctx.ok ? 'alert-success' : 'alert-danger') },
        role: "alert",
    });
    // @ts-ignore
    [ok,];
    (__VLS_ctx.msg);
    // @ts-ignore
    [msg,];
}
if (__VLS_ctx.step === 'userpass') {
    // @ts-ignore
    [step,];
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.doLogin) },
        ...{ class: "card p-3 mb-3" },
    });
    // @ts-ignore
    [doLogin,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "form-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ class: "form-control" },
        autocomplete: "username",
    });
    (__VLS_ctx.username);
    // @ts-ignore
    [username,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "input-group mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: (__VLS_ctx.showPwd ? 'text' : 'password'),
        ...{ class: "form-control" },
        autocomplete: "current-password",
        required: true,
    });
    (__VLS_ctx.password);
    // @ts-ignore
    [showPwd, password,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.step === 'userpass'))
                    return;
                __VLS_ctx.showPwd = !__VLS_ctx.showPwd;
                // @ts-ignore
                [showPwd, showPwd,];
            } },
        ...{ class: "btn btn-outline-secondary" },
        type: "button",
        'aria-pressed': (__VLS_ctx.showPwd),
        title: (__VLS_ctx.showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'),
    });
    // @ts-ignore
    [showPwd, showPwd,];
    __VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
        ...{ class: (__VLS_ctx.showPwd ? 'bi bi-eye-slash' : 'bi bi-eye') },
    });
    // @ts-ignore
    [showPwd,];
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
}
if (__VLS_ctx.step === 'setup') {
    // @ts-ignore
    [step,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card p-3 mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({
        ...{ class: "mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-muted" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.qr),
        alt: "QR 2FA",
        ...{ class: "mb-3" },
        ...{ style: {} },
    });
    // @ts-ignore
    [qr,];
    __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
        ...{ class: "text-muted d-block mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({});
    (__VLS_ctx.secret);
    // @ts-ignore
    [secret,];
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.verify) },
    });
    // @ts-ignore
    [verify,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "form-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ class: "form-control" },
        inputmode: "numeric",
        maxlength: "6",
    });
    (__VLS_ctx.code);
    // @ts-ignore
    [code,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ class: "btn btn-success" },
        type: "submit",
        disabled: (__VLS_ctx.loading || __VLS_ctx.code.length < 6),
    });
    // @ts-ignore
    [loading, code,];
    if (__VLS_ctx.loading) {
        // @ts-ignore
        [loading,];
        __VLS_asFunctionalElement(__VLS_elements.span)({
            ...{ class: "spinner-border spinner-border-sm me-2" },
        });
    }
}
if (__VLS_ctx.step === 'verify') {
    // @ts-ignore
    [step,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card p-3 mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h5, __VLS_elements.h5)({
        ...{ class: "mb-2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
        ...{ onSubmit: (__VLS_ctx.verify) },
    });
    // @ts-ignore
    [verify,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "mb-3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ class: "form-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        ...{ class: "form-control" },
        inputmode: "numeric",
        maxlength: "6",
    });
    (__VLS_ctx.code);
    // @ts-ignore
    [code,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ class: "btn btn-success" },
        type: "submit",
        disabled: (__VLS_ctx.loading || __VLS_ctx.code.length < 6),
    });
    // @ts-ignore
    [loading, code,];
    if (__VLS_ctx.loading) {
        // @ts-ignore
        [loading,];
        __VLS_asFunctionalElement(__VLS_elements.span)({
            ...{ class: "spinner-border spinner-border-sm me-2" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
/** @type {__VLS_StyleScopedClasses['d-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-control']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-border-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        step: step,
        username: username,
        password: password,
        showPwd: showPwd,
        code: code,
        loading: loading,
        ok: ok,
        msg: msg,
        qr: qr,
        secret: secret,
        doLogin: doLogin,
        verify: verify,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
