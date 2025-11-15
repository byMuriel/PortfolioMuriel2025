import { computed } from 'vue';
const props = defineProps();
const imgLoaded = computed(() => props.imgLoaded);
const about = computed(() => props.about);
const skills = computed(() => {
    const s = about.value?.Skills ?? [];
    return s
        .map((x) => String(x)
        .replace(/^\s*\/\s*/g, '')
        .replace(/\s*,\s*$/g, '')
        .trim())
        .filter(Boolean);
});
const aboutBlocks = computed(() => {
    const titles = about.value?.AboutMeTitles ?? [];
    const texts = about.value?.AboutMe ?? [];
    const out = [];
    for (let i = 0; i < Math.max(titles.length, texts.length); i++) {
        out.push({ title: titles[i] ?? '', text: texts[i] ?? '' });
    }
    return out;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['aboutBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__img']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__img']} */ ;
/** @type {__VLS_StyleScopedClasses['about__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['aboutBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__imgWrap']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__body']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['about__grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
    ...{ class: "aboutBlog" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "hero card presentationCard" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "hero__imgWrap" },
});
if (!__VLS_ctx.imgLoaded) {
    // @ts-ignore
    [imgLoaded,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "hero__skeleton" },
    });
}
else if (__VLS_ctx.about?.img) {
    // @ts-ignore
    [about,];
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ class: "hero__img" },
        ...{ class: ({ 'is-visible': true }) },
        src: (__VLS_ctx.about.img),
        alt: "About image",
        decoding: "async",
        loading: "eager",
    });
    // @ts-ignore
    [about,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "hero__placeholder" },
        'aria-label': "No image available",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "hero__placeholderText" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "hero__body" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "hero__name" },
});
(__VLS_ctx.about?.intro);
// @ts-ignore
[about,];
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
    ...{ class: "hero__meta list-unstyled m-0" },
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ class: "hero__metaItem" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-briefcase me-2" },
});
__VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({
    ...{ class: "me-1" },
});
(__VLS_ctx.about?.Position);
// @ts-ignore
[about,];
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ class: "hero__metaItem" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-geo-alt me-2" },
});
__VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({
    ...{ class: "me-1" },
});
(__VLS_ctx.about?.Ubication);
// @ts-ignore
[about,];
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ class: "hero__metaItem" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-building me-2" },
});
__VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({
    ...{ class: "me-1" },
});
(__VLS_ctx.about?.Experience);
// @ts-ignore
[about,];
if (__VLS_ctx.skills.length) {
    // @ts-ignore
    [skills,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "hero__skills" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "sectionTitle" },
    });
    __VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
        ...{ class: "skills" },
    });
    for (const [s, i] of __VLS_getVForSourceType((__VLS_ctx.skills))) {
        // @ts-ignore
        [skills,];
        __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
            key: (i),
            ...{ class: "skills__item" },
        });
        (s);
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "about card" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "sectionTitle mb-3" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "about__grid" },
});
for (const [block, idx] of __VLS_getVForSourceType((__VLS_ctx.aboutBlocks))) {
    // @ts-ignore
    [aboutBlocks,];
    __VLS_asFunctionalElement(__VLS_elements.article, __VLS_elements.article)({
        key: (idx),
        ...{ class: "about__item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h4, __VLS_elements.h4)({
        ...{ class: "about__title" },
    });
    (block.title);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "about__text" },
    });
    (block.text);
}
/** @type {__VLS_StyleScopedClasses['aboutBlog']} */ ;
/** @type {__VLS_StyleScopedClasses['hero']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['presentationCard']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__imgWrap']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__skeleton']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__img']} */ ;
/** @type {__VLS_StyleScopedClasses['is-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__placeholderText']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__body']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__name']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__meta']} */ ;
/** @type {__VLS_StyleScopedClasses['list-unstyled']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__metaItem']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-briefcase']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
/** @type {__VLS_StyleScopedClasses['me-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__metaItem']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-geo-alt']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
/** @type {__VLS_StyleScopedClasses['me-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__metaItem']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-building']} */ ;
/** @type {__VLS_StyleScopedClasses['me-2']} */ ;
/** @type {__VLS_StyleScopedClasses['me-1']} */ ;
/** @type {__VLS_StyleScopedClasses['hero__skills']} */ ;
/** @type {__VLS_StyleScopedClasses['sectionTitle']} */ ;
/** @type {__VLS_StyleScopedClasses['skills']} */ ;
/** @type {__VLS_StyleScopedClasses['skills__item']} */ ;
/** @type {__VLS_StyleScopedClasses['about']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['sectionTitle']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
/** @type {__VLS_StyleScopedClasses['about__grid']} */ ;
/** @type {__VLS_StyleScopedClasses['about__item']} */ ;
/** @type {__VLS_StyleScopedClasses['about__title']} */ ;
/** @type {__VLS_StyleScopedClasses['about__text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        imgLoaded: imgLoaded,
        about: about,
        skills: skills,
        aboutBlocks: aboutBlocks,
    }),
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
