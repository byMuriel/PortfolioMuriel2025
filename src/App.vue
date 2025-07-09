<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<!-- <template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Index</RouterLink>
        <RouterLink to="/main">Main</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template> -->

<template>
  <div id="app" class="min-vh-100 bg-dark text-white">
    <router-view />
  </div>
</template>

<style scoped></style>
