<!-- src/components/BlogScreens/AdminBlog.vue -->
<template>
  <section class="adminBlog container py-4">
    <h2 class="mb-3">Nuevo Post del Blog</h2>
    <div
      v-if="serverOk && showAlert"
      class="alert alert-success alert-dismissible fade show"
      role="alert"
    >
      {{ serverMsg || '¡Post creado con éxito!' }}
      <button
        type="button"
        class="btn-close"
        @click="showAlert = false"
        aria-label="Close"
      ></button>
    </div>

    <!-- Form -->
    <form class="card p-3" @submit.prevent="onSubmit">
      <div class="row g-3">
        <!-- Título -->
        <div class="col-12">
          <label class="form-label">Título *</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Ej: Cómo migré mi blog a MySQL"
            :class="{ 'is-invalid': tried && !rules.name }"
          />
          <div class="invalid-feedback">El título es obligatorio (mín. 3 caracteres).</div>
        </div>

        <!-- URL de imagen -->
        <div class="col-12">
          <label class="form-label">URL de la imagen (opcional)</label>
          <input
            v-model="form.image"
            type="url"
            class="form-control"
            placeholder="https://.../imagen.jpg"
          />
          <small class="text-muted">Si la dejas vacía, el post se creará sin imagen.</small>
        </div>

        <!-- Fecha -->
        <div class="col-12 col-md-4">
          <label class="form-label">Fecha *</label>
          <input
            v-model="form.date"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': tried && !rules.date }"
          />
          <div class="invalid-feedback">Fecha requerida (YYYY-MM-DD).</div>
        </div>

        <!-- Contenido -->
        <div class="col-12">
          <label class="form-label">Contenido *</label>
          <textarea
            v-model.trim="form.content"
            rows="8"
            class="form-control"
            placeholder="Escribe el contenido del post…"
            :class="{ 'is-invalid': tried && !rules.content }"
          />
          <div class="invalid-feedback">Contenido mínimo de 10 caracteres.</div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="d-flex align-items-center gap-2 mt-3">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
          Publicar
        </button>
        <button class="btn btn-outline-secondary" type="button" @click="reset" :disabled="loading">
          Limpiar
        </button>
        <small class="ms-auto text-muted">* Campos obligatorios</small>
      </div>

      <!-- Mensajes -->
      <p v-if="serverMsg" class="mt-3" :class="serverOk ? 'text-success' : 'text-danger'">
        {{ serverMsg }}
      </p>
      <p v-if="!serverOk && serverMsg" class="mt-3 text-danger">{{ serverMsg }}</p>
    </form>

    <!-- Preview -->
    <div class="preview mt-4" v-if="form.name || form.image || form.content">
      <h5 class="mb-2">Vista previa</h5>
      <div class="card">
        <img v-if="form.image" :src="form.image" class="card-img-top" alt="Preview" />
        <div class="card-body">
          <h3 class="card-title m-0">{{ form.name || 'Sin título' }}</h3>
          <small class="text-muted">{{ form.date || 'Sin fecha' }}</small>
          <p class="mt-3" preline>{{ form.content || 'Sin contenido' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { createBlogPost, type CreateBlogPostInput } from '@/services/adminBlog'

const form = ref<CreateBlogPostInput>({
  name: '',
  image: '',
  content: '',
  date: new Date().toISOString().slice(0, 10),
})
const showAlert = ref(false)
const loading = ref(false)
const tried = ref(false)
const serverMsg = ref('')
const serverOk = ref(false)
const rules = computed(() => ({
  name: form.value.name.trim().length >= 3,
  content: form.value.content.trim().length >= 10,
  date: /^\d{4}-\d{2}-\d{2}$/.test(form.value.date),
}))
const valid = computed(() => rules.value.name && rules.value.content && rules.value.date)

function reset() {
  form.value = { name: '', image: '', content: '', date: new Date().toISOString().slice(0, 10) }
  tried.value = false
}
async function onSubmit() {
  tried.value = true
  if (!valid.value || loading.value) return

  loading.value = true
  try {
    const payload: CreateBlogPostInput = {
      name: form.value.name.trim(),
      image: (form.value.image ?? '').trim(),
      //content: form.value.content.trim(),
      content: form.value.content.replace(/\r\n?/g, '\n'),
      date: form.value.date, // ya es YYYY-MM-DD
    }

    const res = await createBlogPost(payload)
    serverOk.value = true
    serverMsg.value = res.message || `Post creado con éxito (ID: ${res.id}).`
    showAlert.value = true
    reset()
  } catch (err: any) {
    serverOk.value = false
    serverMsg.value = err?.message ?? 'No se pudo crear el post.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.adminBlog .card-img-top {
  object-fit: cover;
  max-height: 280px;
}
.preview .card {
  border: 1px solid var(--bs-border-color, #ddd);
}
.preline {
  white-space: pre-line;
}
</style>
