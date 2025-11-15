import { ref, onMounted } from 'vue';
import { fetchBlogPosts } from '@/services/blog';
import SinglePost from './SinglePost.vue';
const MAX_CHARS = 250;
const datos = ref([]);
const selectedPost = ref(null);
const openPost = (item) => {
    selectedPost.value = item;
};
const closePost = () => {
    selectedPost.value = null;
};
function truncate(text, max = MAX_CHARS) {
    if (!text)
        return '';
    return text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}
async function listar() {
    try {
        datos.value = await fetchBlogPosts();
    }
    catch (e) {
        console.error('Error cargando posts:', e);
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
        datos: datos,
        selectedPost: selectedPost,
        openPost: openPost,
        closePost: closePost,
        truncate: truncate,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
