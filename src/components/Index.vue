<script setup lang="ts">
import TabletScene from './TabletScene.vue'
const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <main>
    <TabletScene />
  </main>
  <!-- <div class="bg-dark min-vh-100 d-flex justify-content-center align-items-center bg-light">
    <div class="container p-4" style="max-width: 600px">

      <div class="text-center mb-4">
        <h1>Index</h1>
      </div>

      <div class="col-3 mb-3 text-center">
        <RouterLink to="/main">
          <button class="btn btn-primary w-100">Main</button>
        </RouterLink>
      </div>
    </div>
  </div> -->
</template>

<style>
main {
  width: 100%;
  height: 100vh;
}

/* @media (min-width: 1024px) {
  .titulo {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>
