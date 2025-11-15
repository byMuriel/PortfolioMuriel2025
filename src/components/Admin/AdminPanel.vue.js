import { ref } from 'vue';
import AdminBlog from './AdminBlog.vue';
import AdminExperience from './AdminExperience.vue';
import AdminChangePassword from './AdminChangePassword.vue';
import { useRouter } from 'vue-router';
import { logout } from '@/services/auth';
const tab = ref('blog');
const router = useRouter();
async function handleLogout() {
    if (!confirm('¿Seguro que deseas cerrar la sesión?'))
        return;
    try {
        await logout();
        // auth.$reset() // opcional si tienes stor
        await router.push({ name: 'AdminLogin' });
    }
    catch (e) {
        console.error('Error al cerrar sesión:', e);
        alert('No se pudo cerrar sesión. Intenta nuevamente.');
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
    ...{ class: "container py-4 adminPanel" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "d-flex justify-content-between align-items-center mb-3" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleLogout) },
    type: "button",
    ...{ class: "btn btn-outline-danger btn-sm" },
    'aria-label': "Cerrar sesión",
    title: "Cerrar sesión",
});
// @ts-ignore
[handleLogout,];
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-box-arrow-right me-1" },
});
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
    ...{ class: "nav nav-tabs" },
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ class: "nav-item" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.tab = 'blog';
            // @ts-ignore
            [tab,];
        } },
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.tab === 'blog' }) },
    type: "button",
});
// @ts-ignore
[tab,];
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ class: "nav-item" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.tab = 'experience';
            // @ts-ignore
            [tab,];
        } },
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.tab === 'experience' }) },
    type: "button",
});
// @ts-ignore
[tab,];
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ class: "nav-item" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.tab = 'security';
            // @ts-ignore
            [tab,];
        } },
    ...{ class: "nav-link" },
    ...{ class: ({ active: __VLS_ctx.tab === 'security' }) },
    type: "button",
});
// @ts-ignore
[tab,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tab-content pt-3" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tab-pane fade" },
    ...{ class: ({ 'show active': __VLS_ctx.tab === 'blog' }) },
});
// @ts-ignore
[tab,];
/** @type {[typeof AdminBlog, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(AdminBlog, new AdminBlog({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tab-pane fade" },
    ...{ class: ({ 'show active': __VLS_ctx.tab === 'experience' }) },
});
// @ts-ignore
[tab,];
/** @type {[typeof AdminExperience, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(AdminExperience, new AdminExperience({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
if (__VLS_ctx.tab === 'security') {
    // @ts-ignore
    [tab,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "tab-pane fade" },
        ...{ class: ({ 'show active': __VLS_ctx.tab === 'security' }) },
    });
    // @ts-ignore
    [tab,];
    /** @type {[typeof AdminChangePassword, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(AdminChangePassword, new AdminChangePassword({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
}
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['adminPanel']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-box-arrow-right']} */ ;
/** @type {__VLS_StyleScopedClasses['me-1']} */ ;
/** @type {__VLS_StyleScopedClasses['nav']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-content']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['fade']} */ ;
/** @type {__VLS_StyleScopedClasses['show']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['fade']} */ ;
/** @type {__VLS_StyleScopedClasses['show']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['fade']} */ ;
/** @type {__VLS_StyleScopedClasses['show']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        AdminBlog: AdminBlog,
        AdminExperience: AdminExperience,
        AdminChangePassword: AdminChangePassword,
        tab: tab,
        handleLogout: handleLogout,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
