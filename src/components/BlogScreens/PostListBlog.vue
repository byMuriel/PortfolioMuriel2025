<!-- src\components\BlogScreens\PostListBlog.vue -->
<template>
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
function truncate(text: string, max = MAX_CHARS) {
  if (!text) return ''
  return text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}
async function listar(): Promise<void> {
  try {
    datos.value = await fetchBlogPosts()
  } catch (e) {
    console.error('Error cargando posts:', e)
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
</style>
