<!-- src/components/Skills.vue -->
<template>
  <div class="container-fluid skillsApplication">
    <!-- Tools Buttons -->
    <div class="tools">
      <div class="m-0 p-0 logo">
        <img
          v-if="logoSkills"
          :src="logoSkills"
          alt="Skills logo"
          class="logoPrinc"
          @error="onImgError"
        />
        <span class="m-o p-0 title">Skills</span>
      </div>

      <div class="d-flex justify.content-between">
        <i @click="go('Init')" class="bi bi-house-door"></i>

        <div class="dropdown">
          <span
            type="button"
            id="dropdownMenuButton1"
            class="d-flex justify-content-center align-items-center ms-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </span>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li @click="go('About')"><a class="dropdown-item" href="#">About</a></li>
            <li @click="go('Projects')"><a class="dropdown-item" href="#">Projects</a></li>
            <li @click="go('Experience')"><a class="dropdown-item" href="#">Experience</a></li>
            <li @click="go('Skills')"><a class="dropdown-item" href="#">Skills</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Skills Content -->
    <div v-for="cat in displayCategories" :key="cat" class="categoryBlock">
      <p class="categoryTitle">{{ cat }}</p>
      <!-- Button left displacement -->
      <Transition name="fade-left">
        <button
          class="arrowBtn left"
          :style="{ display: arrows[cat] && arrows[cat].left ? 'grid' : 'none' }"
          @click="nudge(cat, -1)"
          aria-label="Desplazar a la izquierda"
        >
          ‹
        </button>
      </Transition>

      <!-- Skills categories -->
      <div
        class="containerSkills"
        :class="{
          'is-short': byCategory(cat).length <= 2,
          'no-arrows': arrows[cat] && !arrows[cat].left && !arrows[cat].right,
        }"
        :ref="(el) => registerScroller(cat, el as HTMLDivElement | null)"
      >
        <div v-for="skill in byCategory(cat)" :key="skill.name" class="m-0 p-0 skillCard">
          <img :src="skill.logo ?? FALLBACK_LOGO" :alt="skill.name" class="imgLogo" />
        </div>
      </div>
      <!-- Boton right displacement -->
      <button
        class="arrowBtn right"
        v-show="arrows[cat] && arrows[cat].right"
        @click="nudge(cat, 1)"
        aria-label="Desplazar a la derecha"
      >
        ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Skills' })

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAppLogosStore } from '@/stores/useAppLogos'
import { useSkillsStore } from '@/stores/useSkills'
import { useRedirectStore } from '@/stores/useRedirect'

type Side = { left: boolean; right: boolean }
const FALLBACK_LOGO = '/assets/SkillsLogos/LogoM.png'
const appLogos = useAppLogosStore()
const store = useSkillsStore()
const logoSkills = computed(() => appLogos.getLogo('skills'))
const displayCategories = computed(() => store.displayCategories)
const byCategory = (cat: string) => store.byCategory(cat)
let scrollers: Record<string, HTMLDivElement | null> = {}
const arrows = ref<Record<string, Side>>({})
const scheduled = new Map<string, number>()
const atRight = ref<Record<string, boolean>>({})
const touchedRight = ref<Record<string, boolean>>({})

watch(displayCategories, async () => {
  await nextTick()
  Object.keys(scrollers).forEach(scheduleArrows)
})
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.onerror = null
  el.src = '/fallbacks/app-default.png'
}
function go(to: string) {
  useRedirectStore().redirect(to)
}
function registerScroller(cat: string, el: HTMLDivElement | null) {
  scrollers[cat] = el
  if (el) {
    const onScroll = () => scheduleArrows(cat)
    el.addEventListener('scroll', onScroll, { passive: true })
    ;(el as any)._cleanup = () => el.removeEventListener('scroll', onScroll)

    scheduleArrows(cat)
  }
}
// function nudge(cat: string, dir: 1 | -1) {
//   const el = scrollers[cat]
//   if (!el) {
//     console.log('[nudge] sin scroller para', cat)
//     return
//   }

//   const step = el.clientWidth * 0.8

//   console.log('[nudge] ANTES', {
//     cat,
//     dir,
//     scrollLeft: el.scrollLeft,
//     clientWidth: el.clientWidth,
//     step,
//   })

//   el.scrollBy({ left: dir * step, behavior: 'smooth' })

//   if (dir === 1) {
//     touchedRight.value[cat] = true
//   }

//   setTimeout(() => {
//     console.log('[nudge] DESPUÉS timeout, llamando scheduleArrows para', cat)
//     scheduleArrows(cat)
//   }, 300)
// }
// function scheduleArrows(cat: string) {
//   if (scheduled.has(cat)) {
//     return
//   }

//   const el = scrollers[cat]
//   if (!el) {
//     console.log('[scheduleArrows] sin scroller para', cat)
//     return
//   }

//   const id = requestAnimationFrame(() => {
//     scheduled.delete(cat)

//     const scrollWidth = el.scrollWidth
//     const clientWidth = el.clientWidth
//     const scrollLeft = el.scrollLeft

//     const EPS_START = 12
//     const EPS_END = 2

//     const hasOverflow = scrollWidth > clientWidth + EPS_END

//     const atStart = scrollLeft <= EPS_START
//     const atEnd = scrollLeft + clientWidth >= scrollWidth - EPS_END

//     const touchedBefore = !!touchedRight.value[cat]

//     if (atStart && touchedRight.value[cat]) {
//       touchedRight.value[cat] = false
//     }

//     const next = {
//       left: !atStart && !!touchedRight.value[cat],
//       right: hasOverflow && !atEnd,
//     }

//     const prev = arrows.value[cat]

//     console.log('[scheduleArrows]', {
//       cat,
//       scrollLeft,
//       clientWidth,
//       scrollWidth,
//       hasOverflow,
//       atStart,
//       atEnd,
//       touchedBefore,
//       touchedAfter: !!touchedRight.value[cat],
//       prev,
//       next,
//     })

//     if (!prev || prev.left !== next.left || prev.right !== next.right) {
//       arrows.value[cat] = next
//     }

//     atRight.value[cat] = atEnd
//   })

//   scheduled.set(cat, id)
// }
function nudge(cat: string, dir: 1 | -1) {
  const el = scrollers[cat]
  if (!el) return
  const step = el.clientWidth * 0.8 // desplaza ~80% del ancho visible
  el.scrollBy({ left: dir * step, behavior: 'smooth' })

  setTimeout(() => scheduleArrows(cat), 250)
}
function scheduleArrows(cat: string) {
  if (scheduled.has(cat)) return

  const el = scrollers[cat]
  if (!el) return

  const id = requestAnimationFrame(() => {
    scheduled.delete(cat)

    const scrollWidth = el.scrollWidth
    const clientWidth = el.clientWidth
    const scrollLeft = el.scrollLeft

    const EPS_START = 80
    const EPS_END = 2

    const max = Math.max(0, scrollWidth - clientWidth)
    const hasOverflow = max > EPS_END

    if (!hasOverflow) {
      arrows.value[cat] = { left: false, right: false }
      atRight.value[cat] = false
      return
    }

    const atStart = scrollLeft <= EPS_START
    const atEnd = scrollLeft >= max - EPS_END

    const next = {
      left: !atStart,
      right: !atEnd,
    }

    const prev = arrows.value[cat]
    if (!prev || prev.left !== next.left || prev.right !== next.right) {
      arrows.value[cat] = next
    }

    atRight.value[cat] = atEnd
  })

  scheduled.set(cat, id)
}
onMounted(async () => {
  if (!store.isFresh) {
    await store.load()
  }
  await nextTick()
})

onBeforeUnmount(() => {
  Object.values(scrollers).forEach((el) => {
    if (el && (el as any)._cleanup) (el as any)._cleanup()
  })
})

defineExpose({ nudge, registerScroller })
</script>

<style scoped>
.skillsApplication {
  pointer-events: auto;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  font-family: sans-serif;
  background-color: rgb(43, 42, 42);
  box-shadow: inset 0 0 1.5rem rgba(0, 0, 0, 0.8);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding-bottom: 3rem;
}
.categoryBlock {
  position: relative;
  width: 100%;
  margin-top: 2rem;
  padding-block-end: 0.05rem;
}
.categoryTitle {
  margin: 0;
  padding: 0 0 0.5rem 1rem;
  color: rgb(255, 255, 255);
  font-weight: bolder;
}
.containerSkills {
  --gap: 0.6rem;
  --cols-peek: 3.1;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 8rem;
  gap: var(--gap);
  padding-inline: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-left: 2.75rem;
  padding-right: 2.75rem;
  justify-content: flex-start;
  justify-items: start;
}
.containerSkills.is-short {
  padding-left: 1rem;
  padding-right: 1rem;
  scroll-snap-type: none;
}
.containerSkills::-webkit-scrollbar {
  display: none;
}
.skillCard {
  scroll-snap-align: start;
  width: 8rem;
  height: 12rem;
  background: rgb(255, 255, 255);
  border-radius: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 1rem;
}
.imgLogo {
  display: block;
  border-radius: 9%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  backface-visibility: hidden;
  margin: 0;
  padding: 0;
}
.title {
  font-size: 1.3rem;
  font-weight: bold;
  font-family: Tahoma, Verdana, sans-serif;
}
.titleSpecificSkill {
  font-size: 1.3rem;
  font-weight: bold;
}
.logo {
  flex: 0 0 auto;
  height: 3.5rem;
  z-index: 10;
  width: 85%;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 10%;
  margin-right: 0.5rem;
}
.tools {
  flex: 0 0 auto;
  height: 3.5rem;
  z-index: 10;
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  margin-left: 10%;
  margin-right: 0.5rem;
}
.toolButton {
  cursor: pointer;
}
.bi {
  height: 10%;
}
.tools span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0rem;
}
.tools .iconContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
}
.tools .iconContainer i {
  display: block;
  line-height: 1;
}
.logoPrinc {
  width: 18%;
}
.dropdown-menu {
  background-color: rgba(58, 58, 58, 0.911);
}
.dropdown-item {
  color: rgb(212, 212, 212);
}
.bi-three-dots-vertical,
.bi-house-door {
  font-size: 1.5rem;
  color: rgb(212, 212, 212);
}
/* Boton displacement */
.arrowBtn {
  position: absolute;
  top: 45%;
  /* top: calc(2rem + 0.25rem); */
  bottom: 4rem;
  width: 1.7rem;
  display: grid;
  place-items: center;
  border: none;
  background: rgba(75, 74, 74, 0.644);
  color: white;
  font-size: 2rem;
  line-height: 1;
  border-radius: 0.75rem;
  cursor: pointer;
  z-index: 5;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  transition:
    opacity 160ms ease,
    background 160ms ease;
  opacity: 0.8;
  z-index: 20;
}
.arrowBtn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.25);
}
.arrowBtn:active {
  transform: scale(0.98);
}
.arrowBtn.left {
  left: 0.25rem;
}
.arrowBtn.right {
  right: 0.25rem;
}
.fade-left-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}
.fade-left-enter-active {
  transition:
    opacity 700ms ease,
    transform 700ms ease;
}
.fade-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.fade-left-leave-active {
  transition:
    opacity 900ms ease,
    transform 900ms ease;
}
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .fade-left-enter-active,
  .fade-left-leave-active {
    transition: none;
  }
}
@media (hover: none) and (pointer: coarse), (max-width: 768px) {
  .containerSkills {
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
  }
}
</style>
/// <reference types="C:/Users/murie/Documents/ProgramacionMuriel/PortafolioMuriel2025/node_modules/.vue-global-types/vue_3.5_0.d.ts" />

defineOptions({ name: 'Skills' });
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useAppLogosStore } from '@/stores/useAppLogos';
import { useSkillsStore } from '@/stores/useSkills';
import { useRedirectStore } from '@/stores/useRedirect';
const FALLBACK_LOGO = '/assets/SkillsLogos/LogoM.png';
const appLogos = useAppLogosStore();
const store = useSkillsStore();
const logoSkills = computed(() => appLogos.getLogo('skills'));
const displayCategories = computed(() => store.displayCategories);
const byCategory = (cat) => store.byCategory(cat);
let scrollers = {};
const arrows = ref({});
const scheduled = new Map();
const atRight = ref({});
const touchedRight = ref({});
watch(displayCategories, async () => {
    await nextTick();
    Object.keys(scrollers).forEach(scheduleArrows);
});
function onImgError(e) {
    const el = e.target;
    el.onerror = null;
    el.src = '/fallbacks/app-default.png';
}
function go(to) {
    useRedirectStore().redirect(to);
}
function registerScroller(cat, el) {
    scrollers[cat] = el;
    if (el) {
        const onScroll = () => scheduleArrows(cat);
        el.addEventListener('scroll', onScroll, { passive: true });
        el._cleanup = () => el.removeEventListener('scroll', onScroll);
        scheduleArrows(cat);
    }
}
// function nudge(cat: string, dir: 1 | -1) {
//   const el = scrollers[cat]
//   if (!el) {
//     console.log('[nudge] sin scroller para', cat)
//     return
//   }
//   const step = el.clientWidth * 0.8
//   console.log('[nudge] ANTES', {
//     cat,
//     dir,
//     scrollLeft: el.scrollLeft,
//     clientWidth: el.clientWidth,
//     step,
//   })
//   el.scrollBy({ left: dir * step, behavior: 'smooth' })
//   if (dir === 1) {
//     touchedRight.value[cat] = true
//   }
//   setTimeout(() => {
//     console.log('[nudge] DESPUÉS timeout, llamando scheduleArrows para', cat)
//     scheduleArrows(cat)
//   }, 300)
// }
// function scheduleArrows(cat: string) {
//   if (scheduled.has(cat)) {
//     return
//   }
//   const el = scrollers[cat]
//   if (!el) {
//     console.log('[scheduleArrows] sin scroller para', cat)
//     return
//   }
//   const id = requestAnimationFrame(() => {
//     scheduled.delete(cat)
//     const scrollWidth = el.scrollWidth
//     const clientWidth = el.clientWidth
//     const scrollLeft = el.scrollLeft
//     const EPS_START = 12
//     const EPS_END = 2
//     const hasOverflow = scrollWidth > clientWidth + EPS_END
//     const atStart = scrollLeft <= EPS_START
//     const atEnd = scrollLeft + clientWidth >= scrollWidth - EPS_END
//     const touchedBefore = !!touchedRight.value[cat]
//     if (atStart && touchedRight.value[cat]) {
//       touchedRight.value[cat] = false
//     }
//     const next = {
//       left: !atStart && !!touchedRight.value[cat],
//       right: hasOverflow && !atEnd,
//     }
//     const prev = arrows.value[cat]
//     console.log('[scheduleArrows]', {
//       cat,
//       scrollLeft,
//       clientWidth,
//       scrollWidth,
//       hasOverflow,
//       atStart,
//       atEnd,
//       touchedBefore,
//       touchedAfter: !!touchedRight.value[cat],
//       prev,
//       next,
//     })
//     if (!prev || prev.left !== next.left || prev.right !== next.right) {
//       arrows.value[cat] = next
//     }
//     atRight.value[cat] = atEnd
//   })
//   scheduled.set(cat, id)
// }
function nudge(cat, dir) {
    const el = scrollers[cat];
    if (!el)
        return;
    const step = el.clientWidth * 0.8; // desplaza ~80% del ancho visible
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
    setTimeout(() => scheduleArrows(cat), 250);
}
function scheduleArrows(cat) {
    if (scheduled.has(cat))
        return;
    const el = scrollers[cat];
    if (!el)
        return;
    const id = requestAnimationFrame(() => {
        scheduled.delete(cat);
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;
        const scrollLeft = el.scrollLeft;
        const EPS_START = 80;
        const EPS_END = 2;
        const max = Math.max(0, scrollWidth - clientWidth);
        const hasOverflow = max > EPS_END;
        if (!hasOverflow) {
            arrows.value[cat] = { left: false, right: false };
            atRight.value[cat] = false;
            return;
        }
        const atStart = scrollLeft <= EPS_START;
        const atEnd = scrollLeft >= max - EPS_END;
        const next = {
            left: !atStart,
            right: !atEnd,
        };
        const prev = arrows.value[cat];
        if (!prev || prev.left !== next.left || prev.right !== next.right) {
            arrows.value[cat] = next;
        }
        atRight.value[cat] = atEnd;
    });
    scheduled.set(cat, id);
}
onMounted(async () => {
    if (!store.isFresh) {
        await store.load();
    }
    await nextTick();
});
onBeforeUnmount(() => {
    Object.values(scrollers).forEach((el) => {
        if (el && el._cleanup)
            el._cleanup();
    });
});
const __VLS_exposed = { nudge, registerScroller };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['containerSkills']} */ ;
/** @type {__VLS_StyleScopedClasses['containerSkills']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['iconContainer']} */ ;
/** @type {__VLS_StyleScopedClasses['arrowBtn']} */ ;
/** @type {__VLS_StyleScopedClasses['arrowBtn']} */ ;
/** @type {__VLS_StyleScopedClasses['arrowBtn']} */ ;
/** @type {__VLS_StyleScopedClasses['arrowBtn']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-left-enter-active']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-left-leave-active']} */ ;
/** @type {__VLS_StyleScopedClasses['containerSkills']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "container-fluid skillsApplication" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tools" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "m-0 p-0 logo" },
});
if (__VLS_ctx.logoSkills) {
    // @ts-ignore
    [logoSkills,];
    __VLS_asFunctionalElement(__VLS_elements.img)({
        ...{ onError: (__VLS_ctx.onImgError) },
        src: (__VLS_ctx.logoSkills),
        alt: "Skills logo",
        ...{ class: "logoPrinc" },
    });
    // @ts-ignore
    [logoSkills, onImgError,];
}
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "m-o p-0 title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "d-flex justify.content-between" },
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Init');
            // @ts-ignore
            [go,];
        } },
    ...{ class: "bi bi-house-door" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "dropdown" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    type: "button",
    id: "dropdownMenuButton1",
    ...{ class: "d-flex justify-content-center align-items-center ms-2" },
    'data-bs-toggle': "dropdown",
    'aria-expanded': "false",
});
__VLS_asFunctionalElement(__VLS_elements.i, __VLS_elements.i)({
    ...{ class: "bi bi-three-dots-vertical" },
});
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
    ...{ class: "dropdown-menu" },
    'aria-labelledby': "dropdownMenuButton1",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('About');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Projects');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Experience');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.go('Skills');
            // @ts-ignore
            [go,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    ...{ class: "dropdown-item" },
    href: "#",
});
for (const [cat] of __VLS_getVForSourceType((__VLS_ctx.displayCategories))) {
    // @ts-ignore
    [displayCategories,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (cat),
        ...{ class: "categoryBlock" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "categoryTitle" },
    });
    (cat);
    const __VLS_0 = {}.Transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
    // @ts-ignore
    Transition;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        name: "fade-left",
    }));
    const __VLS_2 = __VLS_1({
        name: "fade-left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_4 } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.nudge(cat, -1);
                // @ts-ignore
                [nudge,];
            } },
        ...{ class: "arrowBtn left" },
        ...{ style: ({ display: __VLS_ctx.arrows[cat] && __VLS_ctx.arrows[cat].left ? 'grid' : 'none' }) },
        'aria-label': "Desplazar a la izquierda",
    });
    // @ts-ignore
    [arrows, arrows,];
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "containerSkills" },
        ...{ class: ({
                'is-short': __VLS_ctx.byCategory(cat).length <= 2,
                'no-arrows': __VLS_ctx.arrows[cat] && !__VLS_ctx.arrows[cat].left && !__VLS_ctx.arrows[cat].right,
            }) },
        ref: ((el) => __VLS_ctx.registerScroller(cat, el)),
    });
    // @ts-ignore
    [arrows, arrows, arrows, byCategory, registerScroller,];
    for (const [skill] of __VLS_getVForSourceType((__VLS_ctx.byCategory(cat)))) {
        // @ts-ignore
        [byCategory,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (skill.name),
            ...{ class: "m-0 p-0 skillCard" },
        });
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (skill.logo ?? __VLS_ctx.FALLBACK_LOGO),
            alt: (skill.name),
            ...{ class: "imgLogo" },
        });
        // @ts-ignore
        [FALLBACK_LOGO,];
    }
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.nudge(cat, 1);
                // @ts-ignore
                [nudge,];
            } },
        ...{ class: "arrowBtn right" },
        'aria-label': "Desplazar a la derecha",
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.arrows[cat] && __VLS_ctx.arrows[cat].right) }, null, null);
    // @ts-ignore
    [arrows, arrows, vShow,];
}
/** @type {__VLS_StyleScopedClasses['container-fluid']} */ ;
/** @type {__VLS_StyleScopedClasses['skillsApplication']} */ ;
/** @type {__VLS_StyleScopedClasses['tools']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logoPrinc']} */ ;
/** @type {__VLS_StyleScopedClasses['m-o']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify.content-between']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-house-door']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['d-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-content-center']} */ ;
/** @type {__VLS_StyleScopedClasses['align-items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bi']} */ ;
/** @type {__VLS_StyleScopedClasses['bi-three-dots-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['categoryBlock']} */ ;
/** @type {__VLS_StyleScopedClasses['categoryTitle']} */ ;
/** @type {__VLS_StyleScopedClasses['arrowBtn']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['containerSkills']} */ ;
/** @type {__VLS_StyleScopedClasses['is-short']} */ ;
/** @type {__VLS_StyleScopedClasses['no-arrows']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['skillCard']} */ ;
/** @type {__VLS_StyleScopedClasses['imgLogo']} */ ;
/** @type {__VLS_StyleScopedClasses['arrowBtn']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        FALLBACK_LOGO: FALLBACK_LOGO,
        logoSkills: logoSkills,
        displayCategories: displayCategories,
        byCategory: byCategory,
        arrows: arrows,
        onImgError: onImgError,
        go: go,
        registerScroller: registerScroller,
        nudge: nudge,
    }),
});
export default (await import('vue')).defineComponent({
    setup: () => (__VLS_exposed),
});
; /* PartiallyEnd: #4569/main.vue */
