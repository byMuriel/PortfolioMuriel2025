<!-- src\components\BlogScreens\SinglePost.vue -->
<template>
  <div class="singlePost p-3">
    <button class="btn btn-secondary mb-3" @click="$emit('close')">← Back</button>

    <div class="card mb-3">
      <img :src="post.image" class="card-img-top" alt="Post image" />
      <div class="card-body">
        <h2 class="card-title">{{ post.name }}</h2>
        <small class="text-muted">{{ post.date }}</small>
        <p class="blog-text mt-3">{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Item {
  id: number
  image: string
  name: string
  content: string
  date: string
}

const props = defineProps<{
  post: Item
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.singlePost {
  max-width: 80%;
  overflow: auto;
}
.card-img-top {
  max-height: 25rem;
  height: auto;
  width: auto;
  margin: 0 auto;
}
.blog-text {
  white-space: pre-line;
}
@media (max-width: 576px) {
  .singlePost {
    width: 100%;
    max-width: 100%;
  }
  .card-img-top {
    width: 100%;
    max-width: 100%;
  }
}
</style>
