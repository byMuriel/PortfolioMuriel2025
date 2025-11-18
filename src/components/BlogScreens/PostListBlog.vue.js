import { ref, onMounted } from 'vue';
import { fetchBlogPosts } from '@/services/blog';
import SinglePost from './SinglePost.vue';
const isLoading = ref(true);
const MAX_CHARS = 250;
const datos = ref([]);
const selectedPost = ref(null);
const openPost = (item) => {
    selectedPost.value = item;
};
const closePost = () => {
    selectedPost.value = null;
};
/*****************************************************************************************
 * FUNCTION: truncate
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION:
 *   Shortens a text string to a maximum number of characters without cutting the last word
 *   abruptly. If the text exceeds the limit, it trims the string at the last complete word
 *   that fits and appends an ellipsis ("…").
 *
 * RETURNS: string → The truncated, well-formatted text.
 *
 * ---------------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 *   Acorta un texto hasta un número máximo de caracteres sin cortar la última palabra de
 *   forma brusca. Si el texto supera el límite, elimina cualquier palabra incompleta al
 *   final y añade un punto suspensivo ("…").
 *
 * RETORNA: string → Texto truncado y bien formateado.
 *****************************************************************************************/
function truncate(text, max = MAX_CHARS) {
    if (!text)
        return '';
    return text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}
/*****************************************************************************************
 * FUNCTION: listar
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION:
 *   Fetches all blog posts from the server and preloads their associated images before
 *   displaying them. This prevents visual “pop-in” or loading flickers when posts appear.
 *
 *   PROCESS:
 *     1. Fetch blog posts from the API (`fetchBlogPosts()`).
 *     2. For each post with an image:
 *          - Create a temporary Image() instance.
 *          - Resolve whether the image loads successfully or fails (no blocking).
 *     3. After all preload attempts settle, assign the posts to the reactive state.
 *     4. If an error occurs during fetch, log it to the console.
 *     5. Regardless of success or failure, hide the local preloader (`isLoading = false`).
 *
 * RETURNS: Promise<void>
 *
 * ---------------------------------------------------------------------------------------
 * DESCRIPCIÓN:
 *   Obtiene todos los posts del blog desde el servidor y precarga sus imágenes asociadas
 *   antes de mostrarlos en pantalla. Esto evita parpadeos visuales o cargas “a destiempo”
 *   cuando los posts aparecen.
 *
 *   PROCESO:
 *     1. Solicita los posts al API (`fetchBlogPosts()`).
 *     2. Para cada post con imagen:
 *          - Crea una instancia temporal de Image().
 *          - Resuelve tanto si la imagen carga como si falla (sin bloquear).
 *     3. Una vez que todas las precargas finalizan, asigna los posts al estado reactivo.
 *     4. Si ocurre un error en la carga, lo muestra en consola.
 *     5. Independientemente del resultado, oculta el preloader local (`isLoading = false`).
 *
 * RETORNA: Promise<void>
 *****************************************************************************************/
async function listar() {
    try {
        const posts = await fetchBlogPosts();
        await Promise.allSettled(posts.map((p) => {
            if (!p.image)
                return Promise.resolve();
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = p.image;
            });
        }));
        datos.value = posts;
    }
    catch (e) {
        console.error('Error cargando posts:', e);
    }
    finally {
        isLoading.value = false;
    }
}
onMounted(listar);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['postListBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['postsContainers']} */ ;
/** @type {__VLS_StyleScopedClasses['itemCard']} */ ;
/** @type {__VLS_StyleScopedClasses['postImage']} */ ;
/** @type {__VLS_StyleScopedClasses['postText']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.isLoading) {
    // @ts-ignore
    [isLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "local-preloader" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "local-preloader-inner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "local-dot-loader" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "local-dot dot1" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "local-dot dot2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "local-dot dot3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "local-dot dot4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "local-dot dot5" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "local-dot dot6" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "local-dot dot7" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "local-loading-text" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "postListBlog" },
});
if (!__VLS_ctx.selectedPost) {
    // @ts-ignore
    [selectedPost,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "postsContainers" },
    });
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
        ...{ class: "list-unstyled mt-3" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.datos))) {
        // @ts-ignore
        [datos,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.selectedPost))
                        return;
                    __VLS_ctx.openPost(item);
                    // @ts-ignore
                    [openPost,];
                } },
            key: (item.id),
            ...{ class: "itemCard card mb-2" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "postImage" },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            ...{ class: "imagen" },
            src: (item.image),
            alt: "",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "postText d-flex flex-column text-start ps-3" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "titlePost" },
        });
        (item.name);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "postContent mb-1" },
        });
        (__VLS_ctx.truncate(item.content));
        // @ts-ignore
        [truncate,];
        __VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.selectedPost))
                        return;
                    __VLS_ctx.openPost(item);
                    // @ts-ignore
                    [openPost,];
                } },
            ...{ class: "read-inline" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "d-flex justify-content-between align-items-center" },
        });
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (item.dateLabel);
    }
}
else {
    /** @type {[typeof SinglePost, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(SinglePost, new SinglePost({
        ...{ 'onClose': {} },
        post: (__VLS_ctx.selectedPost),
    }));
    const __VLS_1 = __VLS_0({
        ...{ 'onClose': {} },
        post: (__VLS_ctx.selectedPost),
    }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    let __VLS_3;
    let __VLS_4;
    const __VLS_5 = ({ close: {} },
        { onClose: (__VLS_ctx.closePost) });
    // @ts-ignore
    [selectedPost, closePost,];
    var __VLS_2;
}
/** @type {__VLS_StyleScopedClasses['local-preloader']} */ ;
/** @type {__VLS_StyleScopedClasses['local-preloader-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot-loader']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot1']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot2']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot3']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot4']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot5']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot6']} */ ;
/** @type {__VLS_StyleScopedClasses['local-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot7']} */ ;
/** @type {__VLS_StyleScopedClasses['local-loading-text']} */ ;
/** @type {__VLS_StyleScopedClasses['postListBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['postsContainers']} */ ;
/** @type {__VLS_StyleScopedClasses['list-unstyled']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['itemCard']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['postImage']} */ ;
/** @type {__VLS_StyleScopedClasses['imagen']} */ ;
/** @type {__VLS_StyleScopedClasses['postText']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-column']} */ ;
/** @type {__VLS_StyleScopedClasses['text-start']} */ ;
/** @type {__VLS_StyleScopedClasses['ps-3']} */ ;
/** @type {__VLS_StyleScopedClasses['titlePost']} */ ;
/** @type {__VLS_StyleScopedClasses['postContent']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['read-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        SinglePost: SinglePost,
        isLoading: isLoading,
        datos: datos,
        selectedPost: selectedPost,
        openPost: openPost,
        closePost: closePost,
        truncate: truncate,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
