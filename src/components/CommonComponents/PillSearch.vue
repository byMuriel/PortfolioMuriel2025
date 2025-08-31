<!-- src/components/CommonComponents/PillSearch.vue -->
<template>
  <span class="pill">Search</span>
</template>

<script setup lang="ts"></script>

<style scoped>
.pill {
  display: block;
  border: 0;
  border-radius: 9999px;
  padding: 0.3rem 1.5rem;
  color: rgb(236, 232, 232);
  background: rgb(105, 105, 105);
  transition:
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease;
  width: 15rem;
  height: fit-content;
  margin-left: auto;
  margin-right: 0;
  padding: 0.3rem 1.5rem;
  font-size: 0.8rem;
  position: relative;
  right: auto;
}
.pill:hover {
  cursor: text;
}
</style>
