<template>
  <section class="contactBlog">
    <h2 class="sectionTitle">Contact</h2>

    <div class="cards">
      <!-- Mail -->
      <article class="card">
        <div class="card__left">
          <img :src="logos.mail" alt="mail" class="logo" />
        </div>
        <div class="card__body">
          <h3 class="card__title">{{ contact.mail.name }}</h3>
          <p class="card__text">{{ contact.mail.message }}</p>

          <div class="actions">
            <button class="btn btn-outline" @click="copyEmail(contact.mail.link)">Copy</button>
            <small class="hint">{{ contact.mail.link }}</small>
          </div>
        </div>
      </article>

      <!-- LinkedIn -->
      <article class="card">
        <div class="card__left">
          <img :src="logos.linkedIn" alt="LinkedIn" class="logo" />
        </div>
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
        <div class="card__left">
          <img :src="logos.gitHub" alt="GitHub" class="logo" />
        </div>
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
import { computed } from 'vue'
import contact from '@/data/contact.json'

function resolveImg(path: string): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  // Si viene desde /public => usar tal cual
  if (path.startsWith('/')) return path
  // Normaliza alias @/
  let p = path.startsWith('@/') ? path.replace('@/', 'src/') : path
  return new URL(`../../${p}`, import.meta.url).href
}

const logos = computed(() => ({
  mail: resolveImg(contact.mail.logo),
  linkedIn: resolveImg(contact.linkedIn.logo),
  gitHub: resolveImg(contact.gitHub.logo),
}))
function copyEmail(address: string) {
  navigator.clipboard
    .writeText(address)
    .then(() => {
      console.log(`📋 Copied: ${address}`)
    })
    .catch((err) => {
      console.error('Error copying to clipboard', err)
    })
}
</script>

<style scoped>
.contactBlog {
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 1.25rem;
  color: #111;
}

.sectionTitle {
  font-weight: 800;
  font-size: 1.35rem;
  margin: 0 0 0.75rem 0;
}

/* GRID */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* CARD */
.card {
  display: grid;
  grid-template-columns: 84px 1fr;
  align-items: center;
  gap: 1rem;
  background: #f5f6f7;
  border: 1px solid #e5e6e8;
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.04);
}

.card__left {
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #e1e1e1;
  background: #fff;
}

.card__title {
  margin: 0;
  font-weight: 800;
  font-size: 1.1rem;
}
.card__text {
  margin: 0.25rem 0 0.5rem 0;
  color: #333;
}

/* Bubbles */
.bubbles {
  display: grid;
  gap: 0.4rem;
  margin-top: 0.25rem;
}
.bubble {
  margin: 0;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
  padding: 0.6rem 0.7rem;
  line-height: 1.45;
  color: #222;
}
.bubble.alt {
  background: #fcfcfe;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.25rem;
}
.hint {
  color: #666;
}

.btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.btn-primary {
  color: #fff;
  background: #0d6efd;
  border-color: #0d6efd;
}
.btn-primary:hover {
  filter: brightness(0.95);
}
.btn-outline {
  color: #0d6efd;
  background: transparent;
  border-color: #b8d3ff;
}
.btn-outline:hover {
  background: #eaf2ff;
}

/* Responsive */
@media (max-width: 720px) {
  .card {
    grid-template-columns: 64px 1fr;
  }
  .logo {
    width: 56px;
    height: 56px;
  }
}
@media (max-width: 576px) {
  .contactBlog {
    padding: 0.75rem;
  }
  .cards {
    gap: 0.75rem;
  }
  .card {
    grid-template-columns: 48px 1fr;
    padding: 0.85rem;
  }
  .logo {
    width: 48px;
    height: 48px;
    border-radius: 10px;
  }
}
</style>
