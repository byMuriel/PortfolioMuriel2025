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

// Store Instances
const redirectStore = useRedirectStore()
const stateLikeDislikeStore = useStateLikeDislikeProjects()
// Props
const props = defineProps<{
  text?: string
  type?: 'likeDislike' | 'seeTech' | 'skills'
  indexProject?: number
}>()
// StateFlags
const likeDislike: Ref<boolean> = ref(false)
const seeTech: Ref<boolean> = ref(false)
const skills: Ref<boolean> = ref(false)

/*****************************************************************************************
 * EMIT: thumbsChange
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Defines the event emitter to notify the parent component when the
 *              thumbs state changes. Emits 0 (none), 1 (like), or 2 (dislike).
 * ***************************************************************************************
 * EMISOR: thumbsChange
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Define el emisor de eventos para notificar al componente padre cuando
 *              cambia el estado de los pulgares. Emite 0 (ninguno), 1 (like) o 2 (dislike).
 *****************************************************************************************/
const emit = defineEmits<{
  (e: 'thumbsChange', value: number): void
}>()
/*****************************************************************************************
 * COMPUTED: vote
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Reactive numeric state of the vote for the current project.
 *              0 = none, 1 = like, 2 = dislike.
 * ***************************************************************************************
 * COMPUTADO: vote
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Estado numérico reactivo del voto para el proyecto actual.
 *              0 = ninguno, 1 = like, 2 = dislike.
 *****************************************************************************************/
const vote = computed<number>(() => {
  const i = props.indexProject
  if (i == null) return 0
  return stateLikeDislikeStore.projectVotes[String(i)] ?? 0
})
/*****************************************************************************************
 * COMPUTED: thumbsUpFill
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed binding for the "like" state.
 *              - Getter returns true if vote is 1.
 *              - Setter updates the store and emits event.
 * ***************************************************************************************
 * COMPUTADO: thumbsUpFill
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Enlace computado para el estado "like".
 *              - Getter devuelve true si el voto es 1.
 *              - Setter actualiza el store y emite evento.
 *****************************************************************************************/
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
/*****************************************************************************************
 * COMPUTED: thumbsDownFill
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Computed binding for the "dislike" state.
 *              - Getter returns true if vote is 2.
 *              - Setter updates the store and emits event.
 * ***************************************************************************************
 * COMPUTADO: thumbsDownFill
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Enlace computado para el estado "dislike".
 *              - Getter devuelve true si el voto es 2.
 *              - Setter actualiza el store y emite evento.
 *****************************************************************************************/
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
/*****************************************************************************************
 * FUNCTION: receivedType
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Sets local flags (likeDislike, seeTech, skills) depending on the
 *              prop type received. Ensures only one mode is active at a time.
 * ***************************************************************************************
 * FUNCIÓN: receivedType
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Configura las banderas locales (likeDislike, seeTech, skills)
 *              según la prop type recibida. Garantiza que solo un modo esté activo.
 *****************************************************************************************/
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
/*****************************************************************************************
 * FUNCTION: clickOn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles user interactions with the pill buttons.
 *              - Toggles thumbsUpFill or thumbsDownFill when clicked.
 *              - Emits 'thumbsChange' with 0 when "techUsed" is selected.
 * ***************************************************************************************
 * FUNCIÓN: clickOn
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Gestiona las interacciones del usuario con los botones pill.
 *              - Alterna thumbsUpFill o thumbsDownFill al hacer clic.
 *              - Emite 'thumbsChange' con 0 cuando se selecciona "techUsed".
 *****************************************************************************************/
function clickOn(id: 'thumbsUp' | 'thumbsDown' | 'techUsed') {
  if (id === 'thumbsUp') {
    thumbsUpFill.value = !thumbsUpFill.value
  } else if (id === 'thumbsDown') {
    thumbsDownFill.value = !thumbsDownFill.value
  } else if (id === 'techUsed') {
    emit('thumbsChange', 0)
  }
}
/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Lifecycle hook triggered after component is mounted.
 *              Calls receivedType() to initialize local state flags based on props.type.
 * ***************************************************************************************
 * CICLO DE VIDA: onMounted
 * AUTOR: Muriel Vitale.
 * DESCRIPCIÓN: Hook de ciclo de vida que se dispara tras montar el componente.
 *              Llama a receivedType() para inicializar las banderas locales según props.type.
 *****************************************************************************************/
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
