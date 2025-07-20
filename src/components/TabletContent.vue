<template>
  <div class="tablet-screen">
    <h2>Bienvenido</h2>
    <p>Esto es el contenido de la tablet</p>
  </div>
</template>

<style scoped>
.tablet-screen {
  position: absolute;
  top: 50.2%;
  left: 48.95%;
  width: 36rem; /* ajusta al tamaño de tu pantalla 3D */
  height: 48.7rem;
  background-color: white;
  transform: translate(-50%, -50%);
  pointer-events: none; /* evita interferir con clics */
  color: white;
  text-align: center;
}
</style>
