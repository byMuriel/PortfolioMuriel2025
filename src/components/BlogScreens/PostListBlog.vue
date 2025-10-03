<!-- src\components\BlogScreens\PostListBlog.vue -->
<template>
  <div class="blogChildContainer">
    <p></p>
    <!-- Posts -->
    <div v-if="!selectedPost" class="postsContainers">
      <ul class="list-unstyled mt-3">
        <li
          v-for="item in datos"
          :key="item.id"
          @click="openPost(item)"
          class="itemCard border rounded p-2 mb-2"
        >
          <div class="postImage"><img class="imagen" :src="item.image" alt="" /></div>
          <div class="postText d-flex flex-column text-start">
            <span class="titlePost">{{ item.name }}</span>
            <p class="postContent mb-1">
              {{ truncate(item.content) }}
              <a class="read-inline" @click.stop="openPost(item)"> read more</a>
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ item.date }}</span>
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
import { fetchBlogPosts, type BlogPostDTO } from '@/services/blog'
import SinglePost from './SinglePost.vue'

interface Item {
  id: number
  image: string
  name: string
  content: string
  date: string
}
const MAX_CHARS: number = 250
const datos = ref<BlogPostDTO[]>([])
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

<style>
.blogChildContainer {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1rem;
}
.postsContainers {
  color: black;
  width: 70%;
}
.itemCard {
  display: flex;
  align-items: top;
  background-color: rgb(236, 236, 236);
  cursor: pointer;
}
.postImage {
  width: 15rem;
  height: auto;
  display: block;
  margin: 0.5rem;
}
.imagen {
  width: 100%;
}
.postText {
  flex: 1;
  min-width: 0;
}
.titlePost {
  color: black;
  font-weight: 800;
  font-size: 1.5rem;
  font-family: Calibri, 'Trebuchet MS', sans-serif;
}
.postContent {
  display: -webkit-box !important;
  -webkit-box-orient: vertical !important;
  -webkit-line-clamp: 4 !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  margin: 0;
}
.read-inline {
  color: #444444;
  text-decoration: none;
  cursor: pointer;
  font-weight: 300;
}
.read-inline:hover {
  text-decoration: none;
}
@media (max-width: 576px) {
  .postsContainers {
    width: 100%;
  }
  .itemCard {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .postImage {
    width: 100%;
    max-width: none;
    margin: 0 0 1rem 0;
  }
  .postText {
    text-align: left;
    width: 100%;
  }
}
</style>
