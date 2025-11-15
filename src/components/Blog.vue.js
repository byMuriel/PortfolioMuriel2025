import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import PostListBlog from '@/components/BlogScreens/PostListBlog.vue';
import AboutBlog from '@/components/BlogScreens/AboutBlog.vue';
import ContactBlog from '@/components/BlogScreens/ContactBlog.vue';
import { fetchAboutForBlog } from '@/services/about';
import { fetchContactChannels } from '@/services/contactChannels';
const navbarCollapse = ref(null);
const activeView = ref('PostListBlog');
const about = ref(null);
const imgLoaded = ref(false);
const loadingAbout = ref(false);
const errorAbout = ref(null);
let abortCtrl = null;
const contact = ref({
    mail: { name: '', link: '', logo: '', message: '', bubbles: [] },
    linkedIn: { name: '', link: '', logo: '', message: '', bubbles: [] },
    gitHub: { name: '', link: '', logo: '', message: '', bubbles: [] },
});
const loadingContact = ref(false);
const errorContact = ref(null);
let abortCtrlContact = null;
/*****************************************************************************************
 * FUNCTION: activate
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Switches the active blog view based on a menu option.
 *              - Maps 'Posts' → PostListBlog, 'About' → AboutBlog, 'Contact' → ContactBlog.
 *              - Defaults to PostListBlog for unknown options.
 *
 * DESCRIPCIÓN: Cambia la vista activa del blog según la opción del menú.
 *              - Mapea 'Posts' → PostListBlog, 'About' → AboutBlog, 'Contact' → ContactBlog.
 *              - Por defecto usa PostListBlog si la opción es desconocida.
 *****************************************************************************************/
function activate(option) {
    switch (option) {
        case 'Posts':
            activeView.value = 'PostListBlog';
            break;
        case 'About':
            activeView.value = 'AboutBlog';
            break;
        case 'Contact':
            activeView.value = 'ContactBlog';
            break;
        default:
            activeView.value = 'PostListBlog';
    }
}
/*****************************************************************************************
 * FUNCTION: closeNavbar
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Programmatically closes the Bootstrap navbar (mobile menu).
 *              - Removes 'show', resets inline height/visibility, and updates toggler state.
 *
 * DESCRIPCIÓN: Cierra programáticamente la navbar de Bootstrap (menú móvil).
 *              - Quita 'show', reinicia height/visibility en línea y actualiza el botón toggler.
 *****************************************************************************************/
function closeNavbar() {
    const el = navbarCollapse.value;
    if (!el)
        return;
    el.classList.remove('show');
    el.style.height = '';
    el.style.visibility = '';
    const btn = document.querySelector('[data-bs-target="#navbarNavAltMarkup"]');
    if (btn) {
        btn.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
    }
}
/*****************************************************************************************
 * FUNCTION: preloadImage
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Preloads an image and resolves regardless of success or failure.
 *              - Uses HTMLImageElement with async decoding and eager loading.
 *
 * DESCRIPCIÓN: Precarga una imagen y resuelve independientemente del éxito o fallo.
 *              - Usa HTMLImageElement con decodificación asíncrona y carga eager.
 *****************************************************************************************/
function preloadImage(src) {
    return new Promise((resolve) => {
        const i = new Image();
        i.decoding = 'async';
        i.loading = 'eager';
        i.src = src;
        i.onload = () => resolve();
        i.onerror = () => resolve();
    });
}
/*****************************************************************************************
 * FUNCTION: toAbsUrl
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalizes a relative or protocol-relative URL to an absolute one.
 *              - Supports //host, /path, and bare paths using 'https://murielvitale.com'.
 *
 * DESCRIPCIÓN: Normaliza una URL relativa o sin protocolo a una absoluta.
 *              - Soporta //host, /path y rutas simples usando 'https://murielvitale.com'.
 *****************************************************************************************/
function toAbsUrl(url) {
    const u = (url ?? '').trim();
    if (!u)
        return '';
    if (/^(https?:)?\/\//i.test(u))
        return u.startsWith('//') ? `https:${u}` : u;
    if (u.startsWith('/'))
        return 'https://murielvitale.com' + u;
    return 'https://murielvitale.com/' + u;
}
/*****************************************************************************************
 * FUNCTION: normalizeLink
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Normalizes a link based on its code (e.g., mail, linkedin).
 *              - Adds 'mailto:' for email-like codes if missing.
 *              - Ensures http(s) or mailto; otherwise prefixes with https://
 *
 * DESCRIPCIÓN: Normaliza un enlace según su código (p.ej., mail, linkedin).
 *              - Agrega 'mailto:' para códigos tipo correo si falta.
 *              - Asegura http(s) o mailto; de lo contrario antepone https://
 *****************************************************************************************/
function normalizeLink(link, code) {
    const l = (link || '').trim();
    const c = (code || '').toLowerCase();
    if (!l)
        return '';
    if (c.includes('mail') && !/^mailto:/i.test(l))
        return `mailto:${l}`;
    if (/^(https?:\/\/|mailto:)/i.test(l))
        return l;
    return `https://${l}`;
}
/*****************************************************************************************
 * FUNCTION: normCode
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Produces a normalized, lowercase, alphabet-only code string.
 *              - Useful for consistent keying and comparisons.
 *
 * DESCRIPCIÓN: Genera un código normalizado en minúsculas con solo letras.
 *              - Útil para claves y comparaciones consistentes.
 *****************************************************************************************/
function normCode(s) {
    return (s ?? '').toLowerCase().replace(/[^a-z]/g, '');
}
/*****************************************************************************************
 * FUNCTION: rowToChannel
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Maps a ContactChannelDTO row into a Channel view model.
 *              - Normalizes link, absolute logo URL, and filters non-empty bubbles.
 *
 * DESCRIPCIÓN: Mapea una fila ContactChannelDTO a un view model Channel.
 *              - Normaliza el enlace, URL absoluta del logo y filtra burbujas no vacías.
 *****************************************************************************************/
function rowToChannel(r) {
    return {
        name: r?.name || '',
        link: normalizeLink(r?.link || '', r?.code || ''),
        logo: toAbsUrl(r?.logo_url || ''),
        message: r?.message || '',
        bubbles: [r?.bubble1, r?.bubble2, r?.bubble3].filter((x) => !!x && x.trim().length > 0),
        go_to: r?.go_to ?? null,
    };
}
/*****************************************************************************************
 * FUNCTION: pickChannel
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Selects the best matching contact channel from candidates.
 *              - Tries by normalized code, then active name, then domain heuristic.
 *
 * DESCRIPCIÓN: Selecciona el canal de contacto que mejor coincide entre candidatos.
 *              - Prueba por código normalizado, luego nombre activo y finalmente dominio.
 *****************************************************************************************/
function pickChannel(rows, map, candidates) {
    for (const c of candidates) {
        const k = normCode(c);
        if (map[k])
            return map[k];
    }
    const nameHit = rows.find((r) => r.is_active === 1 && normCode(r.name) === candidates[0]);
    if (nameHit)
        return nameHit;
    const domain = candidates[0] === 'linkedin' ? 'linkedin.com' : candidates[0] === 'github' ? 'github.com' : '';
    if (domain) {
        const urlHit = rows.find((r) => r.is_active === 1 && (r.link || '').toLowerCase().includes(domain));
        if (urlHit)
            return urlHit;
    }
    return undefined;
}
/*****************************************************************************************
 * LIFECYCLE: onMounted (About data)
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Fetches About data for the blog and preloads the hero image.
 *              - Manages loading/error flags and abort controller for safety.
 *
 * DESCRIPCIÓN: Obtiene los datos de About del blog y precarga la imagen principal.
 *              - Gestiona flags de carga/errores y un abort controller por seguridad.
 *****************************************************************************************/
onMounted(async () => {
    loadingAbout.value = true;
    abortCtrl = new AbortController();
    abortCtrlContact?.abort();
    try {
        const data = await fetchAboutForBlog(abortCtrl.signal);
        about.value = data;
        const src = data?.img;
        if (src)
            await preloadImage(src);
        imgLoaded.value = true;
    }
    catch (e) {
        errorAbout.value = e?.message ?? 'Error cargando About';
        imgLoaded.value = true;
    }
    finally {
        loadingAbout.value = false;
    }
});
/*****************************************************************************************
 * LIFECYCLE: onMounted (Contact data)
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Fetches contact channels and builds the blog contact view model.
 *              - Creates a code→row map, picks mail/linkedin/github channels, and normalizes them.
 *
 * DESCRIPCIÓN: Obtiene los canales de contacto y construye el view model del blog.
 *              - Crea un mapa código→fila, elige mail/linkedin/github y los normaliza.
 *****************************************************************************************/
onMounted(async () => {
    loadingContact.value = true;
    abortCtrlContact = new AbortController();
    try {
        const rows = await fetchContactChannels(abortCtrlContact.signal);
        const map = {};
        for (const r of rows) {
            if (r.is_active !== 1)
                continue;
            map[normCode(r.code)] = r;
        }
        const mail = pickChannel(rows, map, ['mail', 'email', 'e-mail']);
        const linkedIn = pickChannel(rows, map, ['linkedin', 'linked-in']);
        const gitHub = pickChannel(rows, map, ['github', 'git-hub', 'gitub']);
        contact.value = {
            mail: rowToChannel(mail),
            linkedIn: rowToChannel(linkedIn),
            gitHub: rowToChannel(gitHub),
        };
    }
    catch (e) {
        errorContact.value = e?.message ?? 'Error cargando contactos';
    }
    finally {
        loadingContact.value = false;
    }
});
/*****************************************************************************************
 * LIFECYCLE: onUnmounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Aborts any pending fetch operations to prevent memory leaks.
 *
 * DESCRIPCIÓN: Cancela operaciones fetch pendientes para evitar fugas de memoria.
 *****************************************************************************************/
onUnmounted(() => {
    abortCtrl?.abort();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['blogContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['collapsing']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['show']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "blogContainer bg-light" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "navBar" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "titleContainer" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "title m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "subtitle m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({
    ...{ class: "navbar navbar-expand-lg bg-body-tertiary m-0 p-0" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container-fluid" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "navbar-toggler" },
    type: "button",
    'data-bs-toggle': "collapse",
    'data-bs-target': "#navbarNavAltMarkup",
    'aria-controls': "navbarNavAltMarkup",
    'aria-expanded': "false",
    'aria-label': "Toggle navigation",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "navbar-toggler-icon" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "collapse navbar-collapse" },
    id: "navbarNavAltMarkup",
    ref: "navbarCollapse",
});
/** @type {typeof __VLS_ctx.navbarCollapse} */ ;
// @ts-ignore
[navbarCollapse,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "navbar-nav ms-auto" },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ onClick: (...[$event]) => {
            (__VLS_ctx.activate('Posts'), __VLS_ctx.closeNavbar());
            // @ts-ignore
            [activate, closeNavbar,];
        } },
    ...{ class: "nav-link" },
    href: "",
    ...{ class: ({ active: __VLS_ctx.activeView === 'PostListBlog' }) },
});
// @ts-ignore
[activeView,];
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ onClick: (...[$event]) => {
            (__VLS_ctx.activate('About'), __VLS_ctx.closeNavbar());
            // @ts-ignore
            [activate, closeNavbar,];
        } },
    ...{ class: "nav-link" },
    href: "",
    ...{ class: ({ active: __VLS_ctx.activeView === 'AboutBlog' }) },
});
// @ts-ignore
[activeView,];
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ onClick: (...[$event]) => {
            (__VLS_ctx.activate('Contact'), __VLS_ctx.closeNavbar());
            // @ts-ignore
            [activate, closeNavbar,];
        } },
    ...{ class: "nav-link" },
    href: "",
    ...{ class: ({ active: __VLS_ctx.activeView === 'ContactBlog' }) },
});
// @ts-ignore
[activeView,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "portfolioLink" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    ...{ class: "nav-link buttonPortafolio" },
    to: "/",
    ...{ class: ({ active: __VLS_ctx.$route.path === '/' }) },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    ...{ class: "nav-link buttonPortafolio" },
    to: "/",
    ...{ class: ({ active: __VLS_ctx.$route.path === '/' }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
const __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.closeNavbar) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[closeNavbar, $route,];
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "blogContent" },
});
if (__VLS_ctx.activeView === 'PostListBlog') {
    // @ts-ignore
    [activeView,];
    /** @type {[typeof PostListBlog, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(PostListBlog, new PostListBlog({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
}
else if (__VLS_ctx.activeView === 'AboutBlog') {
    // @ts-ignore
    [activeView,];
    /** @type {[typeof AboutBlog, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(AboutBlog, new AboutBlog({
        about: (__VLS_ctx.about),
        imgLoaded: (__VLS_ctx.imgLoaded),
    }));
    const __VLS_13 = __VLS_12({
        about: (__VLS_ctx.about),
        imgLoaded: (__VLS_ctx.imgLoaded),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    // @ts-ignore
    [about, imgLoaded,];
}
else if (__VLS_ctx.activeView === 'ContactBlog') {
    // @ts-ignore
    [activeView,];
    /** @type {[typeof ContactBlog, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(ContactBlog, new ContactBlog({
        contact: (__VLS_ctx.contact),
        loading: (__VLS_ctx.loadingContact),
        error: (__VLS_ctx.errorContact),
    }));
    const __VLS_17 = __VLS_16({
        contact: (__VLS_ctx.contact),
        loading: (__VLS_ctx.loadingContact),
        error: (__VLS_ctx.errorContact),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    // @ts-ignore
    [contact, loadingContact, errorContact,];
}
/** @type {__VLS_StyleScopedClasses['blogContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-light']} */ ;
/** @type {__VLS_StyleScopedClasses['navBar']} */ ;
/** @type {__VLS_StyleScopedClasses['titleContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-expand-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-body-tertiary']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-toggler']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-toggler-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['portfolioLink']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['buttonPortafolio']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['blogContent']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        RouterLink: RouterLink,
        PostListBlog: PostListBlog,
        AboutBlog: AboutBlog,
        ContactBlog: ContactBlog,
        navbarCollapse: navbarCollapse,
        activeView: activeView,
        about: about,
        imgLoaded: imgLoaded,
        contact: contact,
        loadingContact: loadingContact,
        errorContact: errorContact,
        activate: activate,
        closeNavbar: closeNavbar,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
