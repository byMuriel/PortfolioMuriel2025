const props = defineProps();
/* ---------- Helpers locales (sin fetch) ---------- */
function displayEmail(address) {
    return (address ?? '').replace(/^mailto:/i, '');
}
function copyEmail(address) {
    if (!address)
        return;
    navigator.clipboard.writeText(address).catch(() => { });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['contactBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['contactBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['contactBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['cards']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['contactBlog']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
    ...{ class: "contactBlog" },
});
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "alert alert-warning" },
        role: "alert",
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "cards mt-5" },
    });
    for (const [n] of __VLS_getVForSourceType((3))) {
        __VLS_asFunctionalElement(__VLS_elements.article, __VLS_elements.article)({
            ...{ class: "card" },
            key: (n),
            'aria-hidden': "true",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "card__body" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "card__title skeleton-line" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "card__text skeleton-line" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "card__text skeleton-line" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "btn btn-outline skeleton-pill" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "hint skeleton-line" },
            ...{ style: {} },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "cards mt-5" },
    });
    __VLS_asFunctionalElement(__VLS_elements.article, __VLS_elements.article)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card__body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "card__title" },
    });
    (__VLS_ctx.contact.mail.name);
    // @ts-ignore
    [contact,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "card__text" },
    });
    (__VLS_ctx.contact.mail.message);
    // @ts-ignore
    [contact,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                __VLS_ctx.copyEmail(__VLS_ctx.displayEmail(__VLS_ctx.contact.mail.link));
                // @ts-ignore
                [contact, copyEmail, displayEmail,];
            } },
        ...{ class: "btn btn-outline" },
    });
    __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
        ...{ class: "hint" },
    });
    (__VLS_ctx.displayEmail(__VLS_ctx.contact.mail.link));
    // @ts-ignore
    [contact, displayEmail,];
    __VLS_asFunctionalElement(__VLS_elements.article, __VLS_elements.article)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card__body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "card__title" },
    });
    (__VLS_ctx.contact.linkedIn.name);
    // @ts-ignore
    [contact,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "card__text" },
    });
    (__VLS_ctx.contact.linkedIn.message);
    // @ts-ignore
    [contact,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        ...{ onClick: () => { } },
        ...{ class: "btn btn-outline" },
        href: (__VLS_ctx.contact.linkedIn.link),
        target: "_blank",
        rel: "noopener noreferrer",
    });
    // @ts-ignore
    [contact,];
    __VLS_asFunctionalElement(__VLS_elements.article, __VLS_elements.article)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card__body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "card__title" },
    });
    (__VLS_ctx.contact.gitHub.name);
    // @ts-ignore
    [contact,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "card__text" },
    });
    (__VLS_ctx.contact.gitHub.message);
    // @ts-ignore
    [contact,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        ...{ onClick: () => { } },
        ...{ class: "btn btn-outline" },
        href: (__VLS_ctx.contact.gitHub.link),
        target: "_blank",
        rel: "noopener noreferrer",
    });
    // @ts-ignore
    [contact,];
}
/** @type {__VLS_StyleScopedClasses['contactBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['cards']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card__body']} */ ;
/** @type {__VLS_StyleScopedClasses['card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-line']} */ ;
/** @type {__VLS_StyleScopedClasses['card__text']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-line']} */ ;
/** @type {__VLS_StyleScopedClasses['card__text']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-line']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['skeleton-line']} */ ;
/** @type {__VLS_StyleScopedClasses['cards']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card__body']} */ ;
/** @type {__VLS_StyleScopedClasses['card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['card__text']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card__body']} */ ;
/** @type {__VLS_StyleScopedClasses['card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['card__text']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['card__body']} */ ;
/** @type {__VLS_StyleScopedClasses['card__title']} */ ;
/** @type {__VLS_StyleScopedClasses['card__text']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-outline']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        displayEmail: displayEmail,
        copyEmail: copyEmail,
    }),
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
