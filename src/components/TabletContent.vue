<template>
  <div
    class="tablet-screen"
    :style="{
      top: y + 'px',
      left: x + 'px',
      width: width + 'px',
      height: height + 'px',
      backgroundImage: `url(${wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="containerReloj">
      <div class="m-0 p-0 hora">17:58</div>
      <div class="m-0 p-9 fecha">Sun, 20 july</div>
    </div>
  </div>
</template>

<script setup>
import wallpaper from '@/assets/wallpaperTablet.png'

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
  /* background-color: rgb(187, 47, 194); */
  /* background-color: rgb(38, 217, 249); */
  /* background-color: rgb(249, 182, 38); */
  background-color: rgb(38, 87, 249);
  pointer-events: none;
  color: black;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 0.5rem;
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.5),
    0 0 8px rgba(0, 0, 0, 0.2);
}
.containerReloj {
  width: 25rem;
  height: 10rem;
  background-color: rgba(253, 251, 251, 0.5);
  border-radius: 1rem;
  margin: 5rem auto 0 auto;
  flex-direction: column;
  justify-content: center;
}
.hora {
  font-family:
    'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana,
    sans-serif;
  font-weight: bolder;
  font-size: 5rem;
}
</style>
