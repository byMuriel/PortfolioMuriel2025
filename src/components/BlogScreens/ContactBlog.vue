<!-- src/components/BlogScreens/ContactBlog.vue -->
<template>
  <section class="contactBlog">
    <!-- Estado: error -->
    <div v-if="error" class="alert alert-warning" role="alert">
      {{ error }}
    </div>

    <!-- Estado: cargando (skeleton simple) -->
    <div v-if="loading" class="cards mt-5">
      <article class="card" v-for="n in 3" :key="n" aria-hidden="true">
        <div class="card__body">
          <h3 class="card__title skeleton-line" style="width: 55%"></h3>
          <p class="card__text skeleton-line" style="width: 90%"></p>
          <p class="card__text skeleton-line" style="width: 70%"></p>
          <div class="actions">
            <span class="btn btn-outline skeleton-pill" style="width: 90px; height: 36px"></span>
            <span class="hint skeleton-line" style="width: 120px"></span>
          </div>
        </div>
      </article>
    </div>

    <!-- Contenido real -->
    <div v-else class="cards mt-5">
      <!-- Mail -->
      <article class="card">
        <div class="card__body">
          <h3 class="card__title">{{ contact.mail.name }}</h3>
          <p class="card__text">{{ contact.mail.message }}</p>

          <div class="actions">
            <button class="btn btn-outline" @click="copyEmail(displayEmail(contact.mail.link))">
              Copy
            </button>
            <small class="hint">{{ displayEmail(contact.mail.link) }}</small>
          </div>
        </div>
      </article>

      <!-- LinkedIn -->
      <article class="card">
        <div class="card__body">
          <h3 class="card__title">{{ contact.linkedIn.name }}</h3>
          <p class="card__text">{{ contact.linkedIn.message }}</p>

          <div class="actions">
            <a
              class="btn btn-outline"
              :href="contact.linkedIn.link"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              Open LinkedIn
            </a>
          </div>
        </div>
      </article>

      <!-- GitHub -->
      <article class="card">
        <div class="card__body">
          <h3 class="card__title">{{ contact.gitHub.name }}</h3>
          <p class="card__text">{{ contact.gitHub.message }}</p>

          <div class="actions">
            <a
              class="btn btn-outline"
              :href="contact.gitHub.link"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >
              Open GitHub
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
type Channel = {
  name: string
  link: string
  logo: string
  message: string
  bubbles: string[]
  go_to?: string | null
}

const props = defineProps<{
  contact: {
    mail: Channel
    linkedIn: Channel
    gitHub: Channel
  }
  loading?: boolean
  error?: string | null
}>()

/* ---------- Helpers locales (sin fetch) ---------- */
function displayEmail(address: string): string {
  return (address ?? '').replace(/^mailto:/i, '')
}

function copyEmail(address: string) {
  if (!address) return
  navigator.clipboard.writeText(address).catch(() => {})
}
</script>

<style scoped>
.contactBlog {
  --brand: #304ffe;
  --card-bg: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.12);
  --text: #555757;
  --muted: #3e3f3f;
  --ring: rgba(48, 79, 254, 0.45);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  --shadow-hover: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
}

@media (prefers-color-scheme: light) {
  .contactBlog {
    --text: #555757;
    --muted: #3e3f3f;
    --ring: rgba(48, 79, 254, 0.35);
    --shadow: 0 8px 26px rgba(14, 17, 22, 0.08);
    --shadow-hover: 0 0.2rem 0.2rem rgba(14, 17, 22, 0.05);
  }
}

.contactBlog {
  width: min(100%, 1000px);
  padding: 1.25rem;
  min-height: 70dvh;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
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

.card__title {
  margin: 0;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.2px;
}

.card__text {
  margin: 0.15rem 0 0.35rem 0;
  color: var(--muted);
  line-height: 1.5;
}

.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.1rem;
}

.hint {
  color: var(--muted);
  font-size: 0.85rem;
  user-select: all;
}

.btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.52rem 0.95rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
  will-change: transform;
  outline: none;
}

.btn-outline {
  color: rgb(105, 105, 105);
  border-color: color-mix(in oklab, var(--brand), transparent 70%);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--brand), transparent 70%);
}

.btn-outline:hover {
  border-color: color-mix(in oklab, var(--brand), transparent 30%);
  box-shadow: inset 0 0 0 0.2rem color-mix(in oklab, var(--brand), transparent 70%);
}

.btn:focus-visible,
a.btn:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 4px var(--ring);
}

@media (max-width: 720px) {
  .contactBlog {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .cards {
    gap: 0.75rem;
  }
  .card {
    padding: 0.9rem;
  }
  .contactBlog {
    min-height: auto;
  }
}

/* Skeleton mínimos */
.skeleton-line {
  display: inline-block;
  height: 0.9rem;
  border-radius: 6px;
  background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 37%, #e9ecef 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}
.skeleton-pill {
  display: inline-block;
  border-radius: 999px;
  background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 37%, #e9ecef 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}
@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
