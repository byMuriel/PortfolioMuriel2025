<!-- src/components/CommonComponents/PillText.vue -->
<template>
  <span v-if="likeDislike" class="pill"
    ><i @click="clickOn('thumbsUp')" class="bi-hand-thumbs-up boton" style="color: white"
      >&nbsp;&nbsp;{{ text }}
    </i>
    <i @click="clickOn('thumbsDown')" class="bi-hand-thumbs-down boton" style="color: white"></i
  ></span>
  <span v-if="seeTech" class="pill"
    ><i @click="clickOn('techUsed')" class="bi bi-keyboard boton" style="color: white"
      >&nbsp;&nbsp;{{ text }}
    </i>
  </span>
  <span @click="go('Skills')" v-if="skills" class="pill"
    ><i class="bi bi-keyboard boton" style="color: white">&nbsp;&nbsp;{{ text }} </i>
  </span>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRedirectStore } from '@/stores/useRedirect'

const redirectStore = useRedirectStore()
const props = defineProps<{
  text?: string
  type?: string
}>()
const likeDislike: Ref<boolean> = ref(false)
const seeTech: Ref<boolean> = ref(false)
const skills: Ref<boolean> = ref(false)

if (props.type == 'likeDislike') {
  likeDislike.value = true
  seeTech.value = false
} else if (props.type == 'seeTech') {
  seeTech.value = true
  likeDislike.value = false
} else if (props.type == 'skills') {
  skills.value = true
  seeTech.value = false
  likeDislike.value = false
}
/*****************************************************************************************
 * FUNCTION: go
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles navigation from the About component to another screen.
 * ***************************************************************************************
 * FUNCIÓN: go
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Gestiona la navegación desde el componente About hacia otra pantalla.
 *****************************************************************************************/
function go(to: string) {
  redirectStore.redirect(to)
}

function clickOn(id: string) {
  if (id === 'thumbsUp') {
    console.log('thumbsUp')
  } else if (id === 'thumbsDown') {
    console.log('thumbsDown')
  } else if (id === 'techUsed') {
    console.log('techUsed')
  }
}
</script>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  padding: 0.3rem 1.5rem;
  color: rgb(236, 232, 232);
  background: rgb(44, 44, 44);
  transition:
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease;
  font-size: 0.8rem;
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  width: auto;
  height: auto;
}
.pill i {
  font-style: normal;
  font-size: 0.7rem;
}

.boton:hover {
  cursor: pointer;
}
</style>
