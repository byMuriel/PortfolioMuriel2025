<!-- src/components/BlogScreens/AdminExperience.vue -->
<template>
  <section class="adminExperience container py-4">
    <h2 class="mb-3">Nueva Experiencia</h2>

    <!-- Alert éxito -->
    <div
      v-if="serverOk && showAlert"
      class="alert alert-success alert-dismissible fade show"
      role="alert"
    >
      {{ serverMsg || '¡Experiencia creada con éxito!' }}
      <button
        type="button"
        class="btn-close"
        @click="showAlert = false"
        aria-label="Close"
      ></button>
    </div>

    <form class="card p-3" @submit.prevent="onSubmit">
      <div class="row g-3">
        <!-- Company -->
        <div class="col-12 col-md-6">
          <label class="form-label">Empresa *</label>
          <input
            v-model.trim="form.company"
            type="text"
            class="form-control"
            placeholder="LOGÍSTICA Y TELECOMUNICACIÓN, S.L."
            :class="{ 'is-invalid': tried && !rules.company }"
          />
          <div class="invalid-feedback">Campo requerido (mín. 2 caracteres).</div>
        </div>

        <!-- Role -->
        <div class="col-12 col-md-6">
          <label class="form-label">Cargo / Rol *</label>
          <input
            v-model.trim="form.role"
            type="text"
            class="form-control"
            placeholder="Full Stack Developer"
            :class="{ 'is-invalid': tried && !rules.role }"
          />
          <div class="invalid-feedback">Campo requerido (mín. 2 caracteres).</div>
        </div>

        <!-- Location (opcional) -->
        <div class="col-12 col-md-6">
          <label class="form-label">Ubicación (opcional)</label>
          <input
            v-model.trim="form.location"
            type="text"
            class="form-control"
            placeholder="Madrid"
          />
        </div>

        <!-- Fechas -->
        <div class="col-12 col-md-3">
          <label class="form-label">Inicio *</label>
          <input
            v-model="form.start_date"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': tried && !rules.start_date }"
          />
          <div class="invalid-feedback">Formato YYYY-MM-DD.</div>
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label">Fin (opcional)</label>
          <input v-model="form.end_date" type="date" class="form-control" />
        </div>

        <!-- Descripción -->
        <div class="col-12">
          <label class="form-label">Descripción (opcional)</label>
          <textarea
            v-model.trim="form.description"
            rows="6"
            class="form-control"
            placeholder="- Desarrollé y mantuve aplicaciones web…"
          />
        </div>

        <!-- URLs -->
        <div class="col-12 col-md-6">
          <label class="form-label">Logo URL (opcional)</label>
          <input
            v-model.trim="form.logo_url"
            type="url"
            class="form-control"
            placeholder="https://..."
          />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Web de la empresa (opcional)</label>
          <input
            v-model.trim="form.company_url"
            type="url"
            class="form-control"
            placeholder="https://..."
          />
        </div>
      </div>

      <!-- Acciones -->
      <div class="d-flex align-items-center gap-2 mt-3">
        <button class="btn btn-primary" type="submit" :disabled="loading || !valid">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
          Guardar
        </button>
        <button class="btn btn-outline-secondary" type="button" @click="reset" :disabled="loading">
          Limpiar
        </button>
        <small class="ms-auto text-muted">* Campos obligatorios</small>
      </div>

      <!-- Mensaje de error -->
      <p v-if="!serverOk && serverMsg" class="mt-3 text-danger">{{ serverMsg }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { createExperience, type CreateExperienceInput } from '@/services/adminBlogExperience'

const form = ref<CreateExperienceInput>({
  company: '',
  role: '',
  start_date: new Date().toISOString().slice(0, 10),
  location: '',
  end_date: '',
  description: '',
  logo_url: '',
  company_url: '',
})
const loading = ref(false)
const tried = ref(false)
const serverMsg = ref('')
const serverOk = ref(false)
const showAlert = ref(false)
let alertTimer: number | undefined

const rules = computed(() => ({
  company: form.value.company.trim().length >= 2,
  role: form.value.role.trim().length >= 2,
  start_date: /^\d{4}-\d{2}-\d{2}$/.test(form.value.start_date),
}))
const valid = computed(() => rules.value.company && rules.value.role && rules.value.start_date)

function openSuccessAlert() {
  showAlert.value = true
  requestAnimationFrame(() => {
    document
      .querySelector('.adminExperience')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  if (alertTimer) clearTimeout(alertTimer)
  alertTimer = window.setTimeout(() => (showAlert.value = false), 4000)
}
function reset() {
  form.value = {
    company: '',
    role: '',
    start_date: new Date().toISOString().slice(0, 10),
    location: '',
    end_date: '',
    description: '',
    logo_url: '',
    company_url: '',
  }
  tried.value = false
}
async function onSubmit() {
  tried.value = true
  if (!valid.value || loading.value) return

  loading.value = true
  try {
    const payload: CreateExperienceInput = {
      company: form.value.company.trim(),
      role: form.value.role.trim(),
      start_date: form.value.start_date,
      location: form.value.location?.trim() || '',
      end_date: form.value.end_date || '',
      description: form.value.description?.trim() || '',
      logo_url: form.value.logo_url?.trim() || '',
      company_url: form.value.company_url?.trim() || '',
    }

    const res = await createExperience(payload)
    serverOk.value = true
    serverMsg.value = res.message || `Experiencia creada (ID: ${res.id}).`
    openSuccessAlert()
    reset()
  } catch (err: any) {
    serverOk.value = false
    serverMsg.value = err?.message ?? 'No se pudo crear la experiencia.'
  } finally {
    loading.value = false
  }
}
onBeforeUnmount(() => alertTimer && clearTimeout(alertTimer))
</script>

<style scoped>
.adminExperience .card {
  border: 1px solid var(--bs-border-color, #ddd);
}
</style>
