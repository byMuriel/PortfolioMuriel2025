<!-- src/components/AdminPanel.vue -->
<template>
  <section class="container py-4 adminPanel">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Panel de Administración</h1>
      <button
        type="button"
        class="btn btn-outline-danger btn-sm"
        @click.prevent="handleLogout"
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
      >
        <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
      </button>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: tab === 'blog' }"
          @click="tab = 'blog'"
          type="button"
        >
          Blog
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: tab === 'experience' }"
          @click="tab = 'experience'"
          type="button"
        >
          Experiences
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: tab === 'security' }"
          @click="tab = 'security'"
          type="button"
        >
          Seguridad
        </button>
      </li>
    </ul>

    <!-- Contenido -->
    <div class="tab-content pt-3">
      <div class="tab-pane fade" :class="{ 'show active': tab === 'blog' }">
        <AdminBlog />
      </div>
      <div class="tab-pane fade" :class="{ 'show active': tab === 'experience' }">
        <AdminExperience />
      </div>
      <div
        class="tab-pane fade"
        :class="{ 'show active': tab === 'security' }"
        v-if="tab === 'security'"
      >
        <AdminChangePassword />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import AdminBlog from './AdminBlog.vue'
import AdminExperience from './AdminExperience.vue'
import AdminChangePassword from './AdminChangePassword.vue'
import { useRouter } from 'vue-router'
import { logout } from '@/services/auth'

type Tab = 'blog' | 'experience' | 'security'
const tab: Ref<'blog' | 'experience' | 'security'> = ref('blog')
const router = useRouter()

async function handleLogout() {
  if (!confirm('¿Seguro que deseas cerrar la sesión?')) return
  try {
    await logout()
    // auth.$reset() // opcional si tienes stor
    await router.push({ name: 'AdminLogin' })
  } catch (e) {
    console.error('Error al cerrar sesión:', e)
    alert('No se pudo cerrar sesión. Intenta nuevamente.')
  }
}
</script>

<style scoped>
.adminPanel .nav-link {
  cursor: pointer;
}
</style>
