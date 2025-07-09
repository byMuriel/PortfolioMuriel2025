<script setup lang="ts">
// import WelcomeItem from './WelcomeItem.vue'
const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="bg-dark min-vh-100 d-flex justify-content-center align-items-center bg-light">
    <div class="container p-4" style="max-width: 600px">
      <!-- Título -->
      <div class="text-center mb-4">
        <h1>Index</h1>
      </div>

      <!-- Botón Volver -->
      <div class="col-3 mb-3 text-center">
        <RouterLink to="/main">
          <button class="btn btn-primary w-100">Main</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .titulo {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
