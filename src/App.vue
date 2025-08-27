<!-- src\App.vue -->
<template>
  <div id="app" class="min-vh-100 bg-dark text-white">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
</script>

<style scoped></style>
