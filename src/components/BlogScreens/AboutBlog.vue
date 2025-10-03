<!-- src/components/BlogScreens/AboutBlog.vue -->
<template>
  <section class="aboutBlog">
    <!-- HERO -->
    <div class="hero card">
      <div class="hero__imgWrap">
        <!-- Imagen dinámica desde la BD -->
        <img class="hero__img" :src="about?.img" alt="About image" />
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

        <!-- SKILLS -->
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
import { ref, computed, onMounted } from 'vue'
import { fetchAboutForBlog, type AboutPayload } from '@/services/about'

type Block = { title: string; text: string }

const about = ref<AboutPayload | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    about.value = await fetchAboutForBlog()
  } catch (e: any) {
    error.value = e?.message ?? 'Error cargando About'
  } finally {
    loading.value = false
  }
})

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
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 1.25rem;
  color: #111;
}

/* Card base */
.card {
  background: #f5f6f7;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.04);
}

/* HERO */
.hero {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.hero__imgWrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  border: 1px solid #ddd;
  background: #fff;
}

.hero__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero__name {
  font-weight: 800;
  margin: 0;
}

.hero__meta {
  display: grid;
  gap: 0.35rem;
}
.hero__metaItem {
  font-size: 0.98rem;
  color: #333;
}

.sectionTitle {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

/* Skills chips */
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
  background: #ffffff;
  border: 1px solid #e0e0e0;
  color: #222;
  border-radius: 999px;
  font-size: 0.92rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

/* About blocks */
.about {
  margin-top: 1rem;
}
.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.9rem;
}
.about__item {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1rem;
}
.about__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.35rem 0;
}
.about__text {
  margin: 0;
  color: #333;
  line-height: 1.5;
}

/* Responsive */
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
