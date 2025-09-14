<!-- src/components/CommonComponents/PillText.vue -->
<template>
  <span v-if="likeDislike" class="pill"
    ><i
      v-if="!thumbsUpFill"
      @click="clickOn('thumbsUp')"
      class="bi-hand-thumbs-up boton"
      style="color: white"
      >&nbsp;&nbsp;{{ text }}
    </i>
    <i
      v-if="thumbsUpFill"
      @click="clickOn('thumbsUp')"
      class="bi-hand-thumbs-up-fill boton"
      style="color: white"
      >&nbsp;&nbsp;{{ text }}
    </i>
    <i
      v-if="!thumbsDownFill"
      @click="clickOn('thumbsDown')"
      class="bi-hand-thumbs-down boton"
      style="color: white"
    ></i>
    <i
      v-if="thumbsDownFill"
      @click="clickOn('thumbsDown')"
      class="bi-hand-thumbs-down-fill boton"
      style="color: white"
    ></i>
  </span>
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
import { computed, onMounted, ref, type Ref } from 'vue'
import { useRedirectStore } from '@/stores/useRedirect'
import { useStateLikeDislikeProjects } from '@/stores/useStateLikeDislikeProjects'

const redirectStore = useRedirectStore()
const stateLikeDislikeStore = useStateLikeDislikeProjects()

const props = defineProps<{
  text?: string
  type?: 'likeDislike' | 'seeTech' | 'skills'
  indexProject?: number
}>()
const likeDislike: Ref<boolean> = ref(false)
const seeTech: Ref<boolean> = ref(false)
const skills: Ref<boolean> = ref(false)

const emit = defineEmits<{
  (e: 'thumbsChange', value: number): void
}>()

// vote: 0 = none, 1 = like, 2 = dislike
const vote = computed<number>(() => {
  const i = props.indexProject
  if (i == null) return 0
  return stateLikeDislikeStore.projectVotes[String(i)] ?? 0
})

const thumbsUpFill = computed<boolean>({
  get: () => vote.value === 1,
  set: (val) => {
    const i = props.indexProject
    if (i == null) return
    const next = val ? 1 : 0
    stateLikeDislikeStore.setVote(i, next)
    emit('thumbsChange', next)
  },
})

const thumbsDownFill = computed<boolean>({
  get: () => vote.value === 2,
  set: (val) => {
    const i = props.indexProject
    if (i == null) return
    const next = val ? 2 : 0
    stateLikeDislikeStore.setVote(i, next)
    emit('thumbsChange', next)
  },
})
function receivedType() {
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

function clickOn(id: 'thumbsUp' | 'thumbsDown' | 'techUsed') {
  if (id === 'thumbsUp') {
    thumbsUpFill.value = !thumbsUpFill.value
  } else if (id === 'thumbsDown') {
    thumbsDownFill.value = !thumbsDownFill.value
  } else if (id === 'techUsed') {
    emit('thumbsChange', 0)
  }
}
onMounted(() => {
  receivedType()
})
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
