<!-- src\components\AdminChangePassword.vue -->
<template>
  <section class="securityTab">
    <h2>Cambiar contraseña</h2>

    <form @submit.prevent="onSubmit" class="card p-3" novalidate>
      <!-- Actual -->
      <label class="form-label">Contraseña actual</label>
      <div class="input-group mb-3">
        <input
          :type="showCurrent ? 'text' : 'password'"
          class="form-control"
          v-model.trim="form.current_password"
          autocomplete="current-password"
          required
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="toggle('current')"
          :aria-pressed="showCurrent"
          :title="showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        >
          <i :class="showCurrent ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </div>

      <!-- Nueva -->
      <label class="form-label">Nueva contraseña</label>
      <div class="input-group mb-1">
        <input
          :type="showNew ? 'text' : 'password'"
          class="form-control"
          v-model.trim="form.new_password"
          autocomplete="new-password"
          required
          minlength="8"
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="toggle('new')"
          :aria-pressed="showNew"
          :title="showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        >
          <i :class="showNew ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </div>
      <small class="text-muted mb-3 d-block">{{ strengthLabel }}</small>

      <!-- Confirmar -->
      <label class="form-label">Confirmar nueva contraseña</label>
      <div class="input-group mb-3">
        <input
          :type="showConfirm ? 'text' : 'password'"
          class="form-control"
          v-model.trim="form.confirm_password"
          autocomplete="new-password"
          required
        />
        <button
          class="btn btn-outline-secondary"
          type="button"
          @click="toggle('confirm')"
          :aria-pressed="showConfirm"
          :title="showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        >
          <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </button>
      </div>

      <!-- Mensajes -->
      <p v-if="errorMsg" class="text-danger" role="alert" aria-live="assertive">{{ errorMsg }}</p>
      <p v-if="okMsg" class="text-success" role="status" aria-live="polite">{{ okMsg }}</p>

      <!-- Botón -->
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
          aria-hidden="true"
        ></span>
        Guardar
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { changePassword, type ChangePasswordInput } from '@/services/auth'

const form = ref<ChangePasswordInput>({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

const loading = ref(false)
const errorMsg = ref('')
const okMsg = ref('')

// toggles “ojo”
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
function toggle(which: 'current' | 'new' | 'confirm') {
  if (which === 'current') showCurrent.value = !showCurrent.value
  if (which === 'new') showNew.value = !showNew.value
  if (which === 'confirm') showConfirm.value = !showConfirm.value
}

const strengthLabel = computed(() => {
  const v = form.value.new_password
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[a-z]/.test(v)) score++
  if (/\d/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte', 'Excelente'][score] || 'Muy débil'
})

async function onSubmit() {
  errorMsg.value = ''
  okMsg.value = ''

  // validación mínima client-side
  if (form.value.new_password !== form.value.confirm_password) {
    errorMsg.value = 'La confirmación no coincide'
    return
  }

  loading.value = true
  try {
    const resp = await changePassword(form.value)
    okMsg.value = resp.message || 'Contraseña actualizada con éxito'
    // Reset seguro: limpia las nuevas, deja la actual vacía
    form.value.current_password = ''
    form.value.new_password = ''
    form.value.confirm_password = ''
    showCurrent.value = showNew.value = showConfirm.value = false
  } catch (e: any) {
    errorMsg.value = e?.message || 'No se pudo actualizar la contraseña'
  } finally {
    loading.value = false
  }
}
</script>
