<!-- src\components\BlogScreens\PostListBlog.vue -->
<template>
  <!-- Preloader -->
  <div v-if="isLoading" class="local-preloader">
    <div class="local-preloader-inner">
      <div class="local-dot-loader">
        <span class="local-dot dot1"></span>
        <span class="local-dot dot2"></span>
        <span class="local-dot dot3"></span>
        <span class="local-dot dot4"></span>
        <span class="local-dot dot5"></span>
        <span class="local-dot dot6"></span>
        <span class="local-dot dot7"></span>
      </div>
      <p class="local-loading-text">LOADING...</p>
    </div>
  </div>

  <div class="postListBlog">
    <!-- Posts -->
    <div v-if="!selectedPost" class="postsContainers">
      <ul class="list-unstyled mt-3">
        <li v-for="item in datos" :key="item.id" @click="openPost(item)" class="itemCard card mb-2">
          <div class="postImage"><img class="imagen" :src="item.image" alt="" /></div>
          <div class="postText d-flex flex-column text-start ps-3">
            <span class="titlePost">{{ item.name }}</span>
            <p class="postContent mb-1">
              {{ truncate(item.content) }}
              <a class="read-inline" @click.stop="openPost(item)"> read more</a>
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ item.dateLabel }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <SinglePost v-else :post="selectedPost" @close="closePost" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchBlogPosts, type BlogPost } from '@/services/blog'
import SinglePost from './SinglePost.vue'

const isLoading = ref(true)
const MAX_CHARS: number = 250
const datos = ref<BlogPost[]>([])
type Item = BlogPost
const selectedPost = ref<Item | null>(null)
const openPost = (item: Item) => {
  selectedPost.value = item
}
const closePost = () => {
  selectedPost.value = null
}
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
function truncate(text: string, max = MAX_CHARS) {
  if (!text) return ''
  return text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, '') + '…'
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
async function listar(): Promise<void> {
  try {
    const posts = await fetchBlogPosts()

    await Promise.allSettled(
      posts.map((p) => {
        if (!p.image) return Promise.resolve()
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = p.image
        })
      }),
    )

    datos.value = posts
  } catch (e) {
    console.error('Error cargando posts:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(listar)
</script>

<style scoped>
.postListBlog {
  --brand: #304ffe;
  --card-bg: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.12);
  --text: #555757;
  --muted: #3e3f3f;
  --ring: rgba(48, 79, 254, 0.45);
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  --shadow-hover: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1rem;
  color: var(--text);
}
.postsContainers {
  width: min(70%, 1000px);
}
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: var(--shadow-hover);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  overflow: clip;
}
.itemCard {
  display: grid;
  grid-template-columns: 180px 1fr;
  cursor: pointer;
  padding: 1rem;
  border-radius: 16px;
}
.postImage {
  width: 180px;
  height: 130px;
  border-radius: 12px;
  overflow: hidden;
}
.imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}
.postText {
  min-width: 0;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.titlePost {
  font-weight: 800;
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
  color: var(--text);
}
.postContent {
  color: var(--muted);
  margin-bottom: 0.4rem;
  line-height: 1.4;
}
.read-inline {
  color: grey;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
@media (prefers-color-scheme: light) {
  .postListBlog {
    --card-bg: #ffffff;
    --card-border: rgba(12, 18, 28, 0.08);
    --text: #0e1116;
    --muted: #4b5563;
    --ring: rgba(48, 79, 254, 0.35);
    --shadow: 0 8px 26px rgba(14, 17, 22, 0.08);
    --shadow-hover: 0 0.2rem 0.2rem rgba(14, 17, 22, 0.05);
  }
}
@media (max-width: 576px) {
  .postsContainers {
    width: 90%;
  }
  .itemCard {
    grid-template-columns: 1fr;
  }
  .postImage {
    width: 100%;
    height: 180px;
    margin-bottom: 0.75rem;
  }

  .postText {
    text-align: left;
    width: 100%;
  }
}
/* ===== LOCAL PRELOADER (versión blanca) ===== */

.local-preloader {
  position: absolute;
  inset: 0;
  background: #ffffff; /* Fondo blanco aquí */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: sans-serif;
}

.local-preloader-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.local-dot-loader {
  display: flex;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.local-dot {
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  animation: local-bounce 1.2s infinite ease-in-out alternate;
}

/* Animación igual al preloader principal */
@keyframes local-bounce {
  0% {
    transform: translateY(0);
    background-color: #7e57ff; /* violet suave */
  }
  50% {
    transform: translateY(-1.2rem);
    background-color: #d931ff; /* magenta brillante */
  }
  100% {
    transform: translateY(0);
    background-color: #7e57ff;
  }
}

.dot1 {
  animation-delay: 0.2s;
}
.dot2 {
  animation-delay: 0.35s;
}
.dot3 {
  animation-delay: 0.5s;
}
.dot4 {
  animation-delay: 0.6s;
}
.dot5 {
  animation-delay: 0.5s;
}
.dot6 {
  animation-delay: 0.35s;
}
.dot7 {
  animation-delay: 0.2s;
}

.local-loading-text {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  animation: local-pulse 1.5s ease-in-out infinite;
}

@keyframes local-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
