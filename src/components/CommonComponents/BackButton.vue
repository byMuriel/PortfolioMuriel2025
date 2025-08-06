<!-- src/components/CommonComponents/BackButton.vue -->
<template>
  <div class="containerBackButton m-1">
    <i class="bi bi-arrow-left-short back-icon" @click="goBack()"></i>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['change-screen'])
/*****************************************************************************************
 * FUNCTION: goBack
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Emits a signal to change the current screen back to the Init view.
 *              - Triggers the 'change-screen' event with the 'Init' value.
 *              - Intended to be used by the BackButton component to return to the home screen.
 * ***************************************************************************************
 * DESCRIPCIÓN: Emite una señal para cambiar la vista actual de nuevo a la pantalla Init.
 *              - Dispara el evento 'change-screen' con el valor 'Init'.
 *              - Pensado para ser usado por el componente BackButton para volver al inicio.
 *****************************************************************************************/
const goBack = (route) => {
  emit('change-screen', 'Init')
}
</script>

<style scoped>
.containerBackButton {
  position: absolute;
  top: 0rem;
  left: 0.3rem;
}
.back-icon {
  font-size: 2.2rem;
  text-shadow: 0.1rem 0.1rem 0.8rem rgba(0, 0, 0, 0.9);
  color: white;
  pointer-events: all;
  cursor: pointer;
}
.back-icon:hover {
  font-size: 2.3rem;
}
</style>
