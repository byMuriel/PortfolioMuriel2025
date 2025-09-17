<template>
  <div class="blogContainer d-flex justify-content-center align-items-center bg-light">
    <!-- Título -->
    <div class="navBar">
      <div class="titleContainer">
        <h1 class="title m-0 p-0">&lt;WRONG BUT WORKED&gt;</h1>
        <p class="subtitle m-0 p-0">That’s Not How It’s Done, but It Worked for Me.</p>
      </div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary m-0 p-0">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
              <a class="nav-link" href="#">Features</a>
              <a class="nav-link" href="#">Pricing</a>
              <a class="nav-link disabled" aria-disabled="true">Disabled</a>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Botón Volver -->
    <!-- <div class="col-3 mb-3 text-center">
        <RouterLink to="/main">
          <button class="btn btn-primary w-100">Go back</button>
        </RouterLink>
      </div> -->

    <!-- Lista de Registros -->
    <!-- <div class="text-center text-dark mt-4">
        <h2>Items:</h2>
        <ul class="list-unstyled mt-3">
          <li
            v-for="item in datos"
            :key="item.id"
            class="border rounded p-2 mb-2 d-flex flex-column text-start"
          >
            <span class="fw-bold text-dark">{{ item.id }} - {{ item.name }}</span>
            <p class="mb-1">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span>{{ item.date }}</span>
            </div>
          </li>
        </ul>
      </div> -->
  </div>
</template>

<script setup lang="ts">
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
.blogContainer {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.navBar {
  position: absolute;
  top: 0%;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgb(20, 16, 16);
  color: rgb(100, 100, 100);
  padding: 1rem;
}
.title {
  font-weight: 800;
}
.subtitle {
  position: relative;
  top: -0.5rem;
  font-weight: 600;
}
@media (max-width: 576px) {
  /* Pegamos el contenido arriba, no centrado */
  .blogContainer {
    display: flex !important;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }

  /* Header en una fila: (título+subtítulo) a la izq, botón a la der */
  .navBar {
    position: absolute; /* referencia para el botón y el overlay */
    top: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }

  .titleContainer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding-right: 3rem; /* espacio para el botón */
  }

  .title {
    font-size: 1.4rem;
    margin: 0;
  }
  .subtitle {
    font-size: 0.8rem;
    margin: 0;
    top: 0; /* anula offset de desktop */
  }

  /* Botón fijo en la esquina del header */
  .navBar .navbar {
    position: static;
    background: transparent;
    box-shadow: none;
  }
  .navBar .navbar-toggler {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    z-index: 1050;
    margin: 0;
    border: none;
  }

  /* Overlay del menú: una sola posición + transición suave */
  .navBar .navbar-collapse,
  .navBar .collapsing {
    position: absolute;
    top: 100%; /* justo debajo del header */
    right: 0;
    width: 60%; /* ajusta 60–80% a gusto */
    background: #f8f9fa;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 1rem;
    z-index: 1040;
  }

  /* Evita el “salto” de Bootstrap (altura animada) */
  .navBar .collapsing {
    height: auto !important;
    transition: none !important;
    overflow: visible !important;
  }

  /* Nuestra transición (sin cambiar posición) */
  .navBar .navbar-collapse {
    transform-origin: top right;
    transition:
      transform 200ms ease,
      opacity 200ms ease;
  }
  .navBar .navbar-collapse:not(.show) {
    transform: scaleY(0);
    opacity: 0;
    pointer-events: none;
  }
  .navBar .navbar-collapse.show {
    transform: scaleY(1);
    opacity: 1;
  }

  .navBar .navbar-collapse .navbar-nav {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .navBar .navbar-collapse .nav-link {
    padding: 0.5rem 0;
  }
}
</style>
