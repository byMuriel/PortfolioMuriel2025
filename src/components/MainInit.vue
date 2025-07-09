<script setup lang="ts">
// const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="bg-dark min-vh-100 d-flex justify-content-center align-items-center bg-light">
    <div class="container p-4" style="max-width: 600px">
      <!-- Título -->
      <div class="text-center mb-4">
        <h1>Main</h1>
      </div>

      <!-- Botón Volver -->
      <div class="col-2 mb-3 text-center">
        <RouterLink to="/">
          <button class="btn btn-primary w-100">Index</button>
        </RouterLink>
      </div>
      <div class="col-2 mb-3 text-center">
        <RouterLink to="/blog">
          <button class="btn btn-primary w-100">Blog</button>
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
