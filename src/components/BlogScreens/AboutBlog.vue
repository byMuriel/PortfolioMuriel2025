<!-- src/components/BlogScreens/AboutBlog.vue -->
<template>
  <section class="aboutBlog">
    <!-- HERO -->
    <div class="hero card presentationCard">
      <div class="hero__imgWrap">
        <!-- Siempre montado: alterna con v-show para evitar salto -->
        <div class="hero__skeleton" v-if="!imgLoaded"></div>
        <img
          v-else-if="about?.img"
          class="hero__img"
          :class="{ 'is-visible': true }"
          :src="about.img"
          alt="About image"
          decoding="async"
          loading="eager"
        />
        <div class="hero__placeholder" v-else aria-label="No image available">
          <span class="hero__placeholderText">MV</span>
        </div>
      </div>

      <div class="hero__body">
        <h2 class="hero__name">{{ about?.intro }}</h2>

        <ul class="hero__meta list-unstyled m-0">
          <li class="hero__metaItem">
            <i class="bi bi-briefcase me-2"></i>
            <strong class="me-1">Position:</strong> {{ about?.Position }}
          </li>
          <li class="hero__metaItem">
            <i class="bi bi-geo-alt me-2"></i>
            <strong class="me-1">Location:</strong> {{ about?.Ubication }}
          </li>
          <li class="hero__metaItem">
            <i class="bi bi-building me-2"></i>
            <strong class="me-1">Experience:</strong> {{ about?.Experience }}
          </li>
        </ul>

        <div class="hero__skills" v-if="skills.length">
          <h3 class="sectionTitle">Skills</h3>
          <ul class="skills">
            <li v-for="(s, i) in skills" :key="i" class="skills__item">{{ s }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ABOUT ME -->
    <div class="about card">
      <h3 class="sectionTitle mb-3">About me</h3>
      <div class="about__grid">
        <article v-for="(block, idx) in aboutBlocks" :key="idx" class="about__item">
          <h4 class="about__title">{{ block.title }}</h4>
          <p class="about__text">{{ block.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AboutPayload } from '@/services/about'

type Block = { title: string; text: string }

const props = defineProps<{
  about: AboutPayload | null
  imgLoaded: boolean
}>()

const imgLoaded = computed(() => props.imgLoaded)
const about = computed(() => props.about)

const skills = computed(() => {
  const s = about.value?.Skills ?? []
  return s
    .map((x) =>
      String(x)
        .replace(/^\s*\/\s*/g, '')
        .replace(/\s*,\s*$/g, '')
        .trim(),
    )
    .filter(Boolean)
})

const aboutBlocks = computed<Block[]>(() => {
  const titles = about.value?.AboutMeTitles ?? []
  const texts = about.value?.AboutMe ?? []
  const out: Block[] = []
  for (let i = 0; i < Math.max(titles.length, texts.length); i++) {
    out.push({ title: titles[i] ?? '', text: texts[i] ?? '' })
  }
  return out
})
</script>

<style scoped>
.aboutBlog {
  --brand: #304ffe;
  --brand-2: #ea80fc;
  --brand: #304ffe;
  --card-bg: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.12);
  --text: #555757;
  --muted: #3e3f3f;
  --ring: rgba(48, 79, 254, 0.45);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  --shadow-hover: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.3);

  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 1.25rem;
  color: var(--text);
}
@media (prefers-color-scheme: light) {
  .aboutBlog {
    --card-bg: #ffffff;
    --card-border: rgba(12, 18, 28, 0.08);
    --text: #555757;
    --muted: #3e3f3f;
    --ring: rgba(48, 79, 254, 0.35);
    --shadow: 0 8px 26px rgba(14, 17, 22, 0.08);
    --shadow-hover: 0 0.2rem 0.2rem rgba(14, 17, 22, 0.05);
  }
}
.card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  border-radius: 16px;
  padding: 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-hover);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  overflow: clip;
}
.presentationCard {
  background: linear-gradient(120deg, rgba(48, 79, 254, 0.11), rgba(234, 128, 252, 0.11));
}

.hero {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1.25rem;
  margin-bottom: 1rem;
}
.hero__imgWrap {
  position: relative;
  width: 180px;
  height: 180px;
  display: grid;
  place-items: center;
}

.hero__placeholder {
  width: 180px;
  height: 180px;
  border-radius: 16px;
  border: 1px solid #ddd;
  background: linear-gradient(135deg, #e9ecf2 0%, #f7f9fc 100%);
  display: grid;
  place-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.hero__placeholderText {
  font-weight: 800;
  font-size: 2.25rem;
  color: #8a93a5;
  letter-spacing: 1px;
}

.hero__skeleton {
  width: 180px;
  height: 180px;
  border-radius: 16px;
  border: 1px solid #ddd;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shine 1.2s ease-in-out infinite;
}

@keyframes shine {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.hero__img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid #ddd;
  background: #fff;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.hero__img.is-visible {
  opacity: 1;
}
.hero__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.hero__name {
  font-weight: 800;
  margin: 0;
  color: var(--text);
}
.hero__meta {
  display: grid;
  gap: 0.35rem;
}
.hero__metaItem {
  font-size: 0.98rem;
  color: var(--muted);
}

.sectionTitle {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 0 0;
  padding: 0;
  list-style: none;
}
.skills__item {
  padding: 0.25rem 0.6rem;
  background: color-mix(in oklab, var(--card-bg), #ffffff 40%);
  border: 1px solid var(--card-border);
  color: var(--text);
  border-radius: 999px;
  font-size: 0.92rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}
.about {
  margin-top: 1rem;
}
.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.9rem;
}
.about__item {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--shadow);
}
.about__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.35rem 0;
  color: var(--text);
}
.about__text {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 140px 1fr;
  }
  .hero__img {
    width: 140px;
    height: 140px;
  }
  .about__grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 576px) {
  .aboutBlog {
    padding: 0.75rem;
  }
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero__imgWrap {
    order: -1;
  }
  .hero__body {
    align-items: center;
  }
  .hero__meta {
    text-align: left;
    width: 100%;
  }
  .about__grid {
    grid-template-columns: 1fr;
  }
}
</style>
