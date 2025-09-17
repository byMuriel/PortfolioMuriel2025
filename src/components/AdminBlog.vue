<template>
  <div class="bg-dark min-vh-100 d-flex justify-content-center align-items-center bg-light">
    <div class="container p-4" style="max-width: 600px">
      <!-- Título -->
      <div class="text-center mb-4">
        <h1>Blog</h1>
      </div>

      <!-- Botón Volver -->
      <div class="col-3 mb-3 text-center">
        <RouterLink to="/main">
          <button class="btn btn-primary w-100">Go back</button>
        </RouterLink>
      </div>

      <!-- Formulario Crear -->
      <div class="row justify-content-center align-items-center mb-3">
        <div class="col-12 col-md-7 mb-2 mb-md-0">
          <input class="form-control" v-model="nombre" placeholder="Project Name" />
        </div>
        <div class="col-12 col-md-5">
          <button class="btn btn-success w-100" @click="crear()">Save</button>
        </div>
      </div>

      <!-- Lista de Registros -->
      <div class="text-center mt-4">
        <h2>Items:</h2>
        <ul class="list-unstyled mt-3">
          <li
            v-for="item in datos"
            :key="item.id"
            class="border rounded p-2 mb-2 d-flex flex-column text-start"
          >
            <span class="fw-bold">{{ item.id }} - {{ item.name }}</span>
            <p class="mb-1">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ item.date }}</span>
              <button class="btn btn-sm btn-danger" @click="eliminar(item.id)">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminBlog from '@/components/AdminBlog.vue'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

// Tipo para un item de la lista
interface Item {
  id: number
  name: string
  content: string
  date: string
}

// Tipo de respuesta de API
interface MensajeResponse {
  mensaje: string
}

const nombre = ref<string>('')
const datos = ref<Item[]>([])

/**************************************************************
 * Method: listar().
 * Parameters: None.
 * Description: Function that makes a call to /api/read to read
 *              the stored data.
 * Date: 05.07.2025
 * Author: Muriel Vitale
 ***************************************************************/
async function listar(): Promise<void> {
  console.log('listar')

  // const res = await fetch('/api/read')
  const res = await fetch('http://localhost/Portafolio2025_Services/api.php/api/read')
  console.log('res:' + JSON.stringify(res))
  const json: Item[] = await res.json()
  datos.value = json
  // datos.value = await res.json()
}

/**************************************************************
 * Method: crear().
 * Parameters: None.
 * Description: Function that creates a new record and saves it.
 * Date: 05.07.2025
 * Author: Muriel Vitale
 ***************************************************************/
async function crear(): Promise<void> {
  if (!nombre.value) {
    alert('Ingrese un nombre')
    return
  }

  const res = await fetch('http://localhost/Portafolio2025_Services/api.php/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: nombre.value }),
  })
  const data: MensajeResponse = await res.json()
  alert(data.mensaje)
  nombre.value = ''
  listar()
}

/**************************************************************
 * Method: eliminar().
 * Parameters: None.
 * Description: Function that deletes an existing record.
 * Date: 05.07.2025
 * Author: Muriel Vitale
 ***************************************************************/
async function eliminar(id: number): Promise<void> {
  try {
    const res = await fetch(`http://localhost/Portafolio2025_Services/api.php/api/delete/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Error del servidor: ${res.status} - ${errorText}`)
    }

    const data: MensajeResponse = await res.json()
    alert(data.mensaje)
    listar()
  } catch (error) {
    console.error('Error eliminando:', error)
    alert('Ocurrió un error al eliminar.')
  }
}

onMounted(listar)
</script>

<style>
@media (min-width: 1024px) {
  .titulo {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
