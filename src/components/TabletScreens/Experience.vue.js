import { computed } from 'vue';
import PillButton from '@/components/CommonComponents/PillButton.vue';
import { useRedirectStore } from '@/stores/useRedirect';
import { useAppLogosStore } from '@/stores/useAppLogos';
import { useExperiencesStore } from '@/stores/useExperiences';
import { useContactChannelsStore } from '@/stores/useContactChannels';
const redirectStore = useRedirectStore();
const appLogos = useAppLogosStore();
const experiencesStore = useExperiencesStore();
const contactChannels = useContactChannelsStore();
const logoExperience = computed(() => appLogos.getLogo('experience'));
const linkedinUrl = computed(() => contactChannels.getLinkByCode('linkedn'));
const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
const uiExperiences = computed(() => experiencesStore.experiences.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    description: e.description ?? '',
    logoUrl: e.logo_url ?? '',
    companyUrl: ensureUrl(e.company_url ?? ''),
    dateRange: formatRange(e.start_date, e.end_date),
})));
/*****************************************************************************************
 * FUNCTION: formatRange
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Formats a start and end date into a human-readable date range.
 *              - Converts ISO strings into formatted dates.
 *              - Displays "Present" when the end date is null.
 *              - Returns a string in the format "Month Year – Month Year".
 *
 * DESCRIPCIÓN: Da formato a una fecha de inicio y fin en un rango legible.
 *              - Convierte las cadenas ISO en fechas formateadas.
 *              - Muestra "Present" cuando no existe fecha de finalización.
 *              - Devuelve una cadena con el formato "Mes Año – Mes Año".
 *****************************************************************************************/
function formatRange(startISO, endISO) {
    const s = safeDate(startISO);
    const e = endISO ? safeDate(endISO) : null;
    const sTxt = s ? fmt.format(s) : startISO;
    const eTxt = e ? fmt.format(e) : 'Present';
    return `${sTxt} – ${eTxt}`;
}
/*****************************************************************************************
 * FUNCTION: safeDate
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Safely converts a string value into a valid JavaScript Date object.
 *              - Returns `null` if the input is not a valid date.
 *
 * DESCRIPCIÓN: Convierte de forma segura una cadena en un objeto Date válido.
 *              - Devuelve `null` si el valor de entrada no es una fecha válida.
 *****************************************************************************************/
function safeDate(v) {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}
/*****************************************************************************************
 * FUNCTION: ensureUrl
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Ensures that a given string is a valid URL with protocol.
 *              - Adds `https://` if the input lacks an HTTP or HTTPS prefix.
 *              - Returns an empty string for invalid or empty inputs.
 *
 * DESCRIPCIÓN: Garantiza que una cadena sea una URL válida con protocolo.
 *              - Agrega `https://` si la entrada no tiene prefijo HTTP o HTTPS.
 *              - Devuelve una cadena vacía si la entrada es inválida o está vacía.
 *****************************************************************************************/
function ensureUrl(u) {
    if (!u)
        return '';
    return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}
/*****************************************************************************************
 * FUNCTION: cleanHost
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Extracts and cleans the host name from a URL string.
 *              - Removes the `www.` prefix for cleaner display.
 *              - Returns the original string if the URL is invalid.
 *
 * DESCRIPCIÓN: Extrae y limpia el nombre del host de una cadena URL.
 *              - Elimina el prefijo `www.` para mostrarlo más limpio.
 *              - Devuelve la cadena original si la URL es inválida.
 *****************************************************************************************/
function cleanHost(u) {
    try {
        return new URL(ensureUrl(u)).host.replace(/^www\./, '');
    }
    catch {
        return u;
    }
}
/*****************************************************************************************
 * FUNCTION: onImgError
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles image load failures by replacing the source with a default fallback.
 *              - Removes the error handler to prevent infinite retry loops.
 *              - Uses a generic placeholder image from `/fallbacks/app-default.png`.
 *
 * DESCRIPCIÓN: Maneja errores de carga de imágenes reemplazando la fuente con una por defecto.
 *              - Elimina el manejador de error para evitar bucles infinitos.
 *              - Usa una imagen genérica ubicada en `/fallbacks/app-default.png`.
 *****************************************************************************************/
function onImgError(e) {
    const el = e.target;
    el.onerror = null;
    el.src = '/fallbacks/app-default.png';
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation to another tablet screen using the redirect store.
 *              - Redirects only if a valid route key (`to`) is provided.
 *
 * DESCRIPCIÓN: Gestiona la navegación hacia otra pantalla de la tablet usando el store de redirección.
 *              - Redirige solo si se proporciona una clave de ruta (`to`) válida.
 *****************************************************************************************/
function go(to) {
    if (to)
        redirectStore.redirect(to);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container-fluid ExperienceApplication m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "containerExperience" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tools" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    ...{ onError: (__VLS_ctx.onImgError) },
    ...{ class: "logoPrinc" },
    src: (__VLS_ctx.logoExperience),
    alt: "Experience App Logo",
    decoding: "async",
    loading: "eager",
});
// @ts-ignore
[onImgError, logoExperience,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "iconos" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Init');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "bi bi-house-door-fill" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Projects');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "bi bi-folder-fill" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Contact');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "bi bi-chat-quote-fill" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('About');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "bi bi-person-fill" },
});
if (__VLS_ctx.linkedinUrl) {
    // @ts-ignore
    [linkedinUrl,];
    __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
        ...{ class: "m-0 p-0 text-decoration-none" },
        href: (__VLS_ctx.linkedinUrl),
        target: "_blank",
        rel: "noopener noreferrer",
    });
    // @ts-ignore
    [linkedinUrl,];
    /** @type {[typeof PillButton, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(PillButton, new PillButton({
        ...{ class: "toolButton" },
        replaceClass: "grayPill",
        text: "LinkedIn",
    }));
    const __VLS_1 = __VLS_0({
        ...{ class: "toolButton" },
        replaceClass: "grayPill",
        text: "LinkedIn",
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
}
for (const [exp] of __VLS_getVForSourceType((__VLS_ctx.uiExperiences))) {
    // @ts-ignore
    [uiExperiences,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (exp.id),
        ...{ class: "skillCard" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "container-fluid d-flex justify-content-between align-items-center" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "m-0 p-0" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ onError: (__VLS_ctx.onImgError) },
        src: (exp.logoUrl),
        ...{ class: "tamanioLogo" },
        alt: "Company Logo",
    });
    // @ts-ignore
    [onImgError,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "text-end" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-light m-0 titleSpecificSkill" },
    });
    (exp.company);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-light m-0" },
    });
    (exp.role);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "m-0 p-0" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-light" },
    });
    (exp.dateRange);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "text-light whiteSpace-text" },
    });
    (exp.description);
    if (exp.companyUrl) {
        __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
            ...{ class: "text-anchor" },
            target: "_blank",
            rel: "noopener noreferrer",
            href: (exp.companyUrl),
        });
        (__VLS_ctx.cleanHost(exp.companyUrl));
        // @ts-ignore
        [cleanHost,];
    }
}
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['ExperienceApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['containerExperience']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['logoPrinc']} */ ;
/** @type {__VLS_StyleScopedClasses['iconos']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-house-door-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-folder-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-chat-quote-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-person-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-decoration-none']} */ ;
/** @type {__VLS_StyleScopedClasses['toolButton']} */ ;
/** @type {__VLS_StyleScopedClasses['skillCard']} */ ;
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['tamanioLogo']} */ ;
/** @type {__VLS_StyleScopedClasses['text-end']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['titleSpecificSkill']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['text-light']} */ ;
/** @type {__VLS_StyleScopedClasses['whiteSpace-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-anchor']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        PillButton: PillButton,
        logoExperience: logoExperience,
        linkedinUrl: linkedinUrl,
        uiExperiences: uiExperiences,
        cleanHost: cleanHost,
        onImgError: onImgError,
        go: go,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
