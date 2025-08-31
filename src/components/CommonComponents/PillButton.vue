<!-- src/components/CommonComponents/PillButton.vue -->
<template>
  <span :class="klass">{{ text }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    replaceClass?: string
  }>(),
  {
    text: '',
    replaceClass: '',
  },
)

const klass = computed(() => {
  const r = props.replaceClass?.trim()
  return r ? r : 'pill'
})
</script>

<style scoped>
.pill {
  display: block;
  border: 0;
  border-radius: 9999px;
  padding: 0.3rem 1.5rem;
  color: rgb(64, 122, 231);
  box-shadow: inset 0 0 0 1.6px rgb(64, 122, 231);
  background: transparent;
  transition:
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease;
  width: fit-content;
  height: fit-content;
  margin-left: auto;
  margin-right: 0;
  padding: 0.3rem 1.5rem;
  font-size: 0.8rem;
  position: relative;
  right: auto;
  cursor: pointer;
}
.pill:hover {
  box-shadow: inset 0 0 0 2.4px rgb(64, 122, 231);
  background: rgba(64, 122, 231, 0.08);
  cursor: pointer;
}
.pill.less {
  border: 0;
  box-shadow: inset 0 0 0 1.6px rgb(83, 83, 83);
  color: rgb(83, 83, 83);
}
.less:hover {
  box-shadow: inset 0 0 0 2.4px rgb(58, 57, 57);
  background: rgba(110, 110, 110, 0.08);
  cursor: pointer;
}
.bluePill {
  background-color: rgb(64, 122, 231);
  border-radius: 5rem;
  color: white;
  width: 100%;
  height: 20%;
  margin: 0;
  padding: 0.3rem 0.8rem;
  font-size: 63%;
  left: 17rem;
}
</style>
