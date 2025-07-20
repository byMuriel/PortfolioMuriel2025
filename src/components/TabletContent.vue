<template>
  <div
    class="tablet-screen"
    :style="{
      top: y + 'px',
      left: x + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <h2>Bienvenido</h2>
    <p>Esto es el contenido de la tablet</p>
  </div>
</template>

<script setup>
defineProps({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
})
</script>

<style scoped>
.tablet-screen {
  position: absolute;
  transform: translate(-50%, -50%);
  background-color: white;
  pointer-events: none;
  color: black;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 0.5rem;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}
</style>
