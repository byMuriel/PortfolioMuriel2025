<!-- src/components/TabletScene.vue -->
<template>
  <!-- Preloader -->
  <transition name="preloader-fade" @after-leave="onPreloaderLeave">
    <div v-if="showPreloader" class="preloader">
      <div class="preloader-inner" :class="{ 'fade-out-dots': !isLoading }">
        <div class="dot-loader">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
          <span class="dot dot3"></span>
          <span class="dot dot4"></span>
          <span class="dot dot5"></span>
          <span class="dot dot6"></span>
          <span class="dot dot7"></span>
        </div>
        <p class="loading-text">CARGANDO...</p>
      </div>
    </div>
  </transition>

  <!-- Scene -->
  <div ref="container" class="containerPrincipal" style="width: 100%; height: 100vh">
    <div v-if="!showPreloader && startContainer" class="start-screen">
      <div @click="start" class="startButton">LET'S GO</div>
    </div>
  </div>

  <!-- Tablet Screen -->
  <div
    id="screen-overlay"
    class="overlay overlay-shadow"
    :class="{ 'fade-in-screen': showTabletContent }"
  >
    <TabletContent v-if="showTabletContent" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { provide, ref, onMounted, onBeforeUnmount, createApp } from 'vue'
import TabletContent from './TabletContent.vue'
import skyTexture from '@/assets/textures/sky.png'

const isLoading = ref<boolean>(true)
const showPreloader = ref<boolean>(true)
const startContainer = ref<boolean>(true)
const container = ref<HTMLDivElement | null>(null)
const showTabletContent = ref<boolean>(false)

let renderer!: THREE.WebGLRenderer
let scene!: THREE.Scene
let camera!: THREE.PerspectiveCamera

let animationId: number | undefined
let screenMaterial: THREE.MeshBasicMaterial | null = null
type ScreenMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>
let screen: THREE.Mesh<RoundedBoxGeometry, THREE.MeshBasicMaterial> | null = null
let overlayShown: boolean = false
const tabletGroup = new THREE.Group()

// Dimensions and properties of the tablet / Dimensiones y propiedades de la tablet
const outerWidth: number = 8
const outerHeight: number = 12
const depthMarco: number = 0.2
const depthBase: number = 0.6
const horizontalThickness: number = 1.5 // top/bottom
const verticalThickness: number = 0.3
const thickness: number = 0.3
const screenWidth: number = outerWidth - thickness * 2
const screenHeight: number = outerHeight - 2 - thickness * 2

// Light variables / Variables de luz
let leftLight: THREE.SpotLight | null = null
let centerLight: THREE.SpotLight | null = null
let rightLight: THREE.SpotLight | null = null
const colorWhite: THREE.ColorRepresentation = 0xfffcfe

// Variables para la animación
const startPos = new THREE.Vector3(-15, 30, 30) // Posición inicial
const endPos = new THREE.Vector3(0, 0, 20) // Posición final
const startFov: number = 75 // FOV inicial
const endFov: number = 35 // FOV final
let startTime: number | null = null
let rotationStartedAt: number | null = null

const data = ref({})

/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Vue lifecycle hook that runs when the component is mounted.
 *              Sets up a listener for the `load` event on the window object.
 *              Once the window is fully loaded, it hides the loading states by:
 *              - Setting `isLoading` to false.
 *              - Setting `showPreloader` to false.
 * **************************************************************************************
 * DESCRIPCIÓN: Hook de ciclo de vida de Vue que se ejecuta cuando el componente es montado.
 *              Establece un listener para el evento `load` de la ventana.
 *              Una vez que la ventana está completamente cargada, oculta los indicadores
 *              de carga al:
 *              - Establecer `isLoading` en falso.
 *              - Establecer `showPreloader` en falso.
 *****************************************************************************************/
/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale
 * DESCRIPTION: Vue lifecycle hook that runs when the component is mounted.
 *              Performs the following tasks:
 *              1. Logs "Cargando Data" to the console.
 *              2. Loads multiple JSON data files in parallel (about, contact, experience,
 *                 projects, skills) using dynamic imports.
 *              3. Populates the reactive `data` object with the loaded JSON content.
 *              4. Waits for the window `load` event to ensure all assets (images, etc.) are fully loaded.
 *              5. Hides the loading indicators by:
 *                 - Setting `isLoading` to false.
 *                 - Setting `showPreloader` to false.
 *
 * DESCRIPCIÓN: Hook del ciclo de vida de Vue que se ejecuta cuando el componente se monta.
 *              Realiza las siguientes tareas:
 *              1. Muestra "Cargando Data" en la consola.
 *              2. Carga múltiples archivos JSON en paralelo (about, contact, experience,
 *                 projects, skills) usando imports dinámicos.
 *              3. Llena el objeto reactivo `data` con el contenido de los JSON.
 *              4. Espera al evento `load` de la ventana para asegurar que todos los recursos
 *                 (incluyendo imágenes) estén completamente cargados.
 *              5. Oculta los indicadores de carga al:
 *                 - Establecer `isLoading` en falso.
 *                 - Establecer `showPreloader` en falso.
 *****************************************************************************************/
onMounted(async () => {
  // console.log('Cargando Data')

  const [about, contact, experience, projects, skills] = await Promise.all([
    import('@/data/about.json'),
    import('@/data/contact.json'),
    import('@/data/experience.json'),
    import('@/data/projects.json'),
    import('@/data/skills.json'),
  ])

  data.value = {
    about: about.default,
    contact: contact.default,
    experience: experience.default,
    projects: projects.default,
    skills: skills.default,
  }
  await new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', () => resolve(), { once: true })
    }
  })

  isLoading.value = false
  showPreloader.value = false
  // console.log('Carga completada')
})
/*****************************************************************************************
 * LIFECYCLE HOOK: onBeforeUnmount
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Vue lifecycle hook that runs just before the component is destroyed.
 *              Cleans up rendering-related resources to avoid memory leaks:
 *              - Cancels the animation loop with `cancelAnimationFrame`.
 *              - Disposes of the WebGL renderer with `renderer.dispose()`.
 *              - Removes the renderer's canvas from the DOM if it was appended.
 * ***************************************************************************************
 * DESCRIPCIÓN: Hook de ciclo de vida de Vue que se ejecuta justo antes de que el componente
 *              sea destruido. Libera los recursos relacionados con el renderizado para evitar
 *              fugas de memoria:
 *              - Cancela el bucle de animación con `cancelAnimationFrame`.
 *              - Libera los recursos del renderizador con `renderer.dispose()`.
 *              - Elimina el canvas WebGL del DOM si fue añadido.
 *****************************************************************************************/
onBeforeUnmount((): void => {
  if (animationId !== undefined) cancelAnimationFrame(animationId)
  renderer?.dispose()
  const el = container.value
  if (el && renderer?.domElement && renderer.domElement.parentElement === el) {
    el.removeChild(renderer.domElement)
  }
})
/*****************************************************************************************
 * FUNCTION: onPreloaderLeave
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles the final step of the preloader transition.
 *              - Sets `showPreloader` to false to hide the preloader completely after its exit.
 * ***************************************************************************************
 * DESCRIPCIÓN: Maneja el paso final de la transición del preloader.
 *              - Establece `showPreloader` en falso para ocultar completamente el preloader
 *                después de su salida.
 *****************************************************************************************/
function onPreloaderLeave(): void {
  showPreloader.value = false
}
/*****************************************************************************************
 * FUNCTION: start
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes the 3D experience after the initial screen is dismissed.
 *              - Hides the start container by setting `startContainer` to false.
 *              - Resets animation-related variables (`startTime` and `rotationStartedAt`).
 *              - Initializes and configures the 3D scene:
 *                  - Calls `initScene()` to set up scene, camera, and renderer.
 *                  - Creates the room environment with `createRoomEnvironment()`.
 *                  - Builds the tablet model with `createTablet()`.
 *                  - Adds lighting with `addTopSpotLights()`.
 *              - Renders the initial frame.
 *              - Starts the animation loop with `requestAnimationFrame(startAnimation)`.
 * ***************************************************************************************
 * DESCRIPCIÓN: Inicializa la experiencia 3D una vez que se oculta la pantalla de inicio.
 *              - Oculta el contenedor de inicio estableciendo `startContainer` en falso.
 *              - Reinicia las variables relacionadas con la animación (`startTime` y `rotationStartedAt`).
 *              - Inicializa y configura la escena 3D:
 *                  - Llama a `initScene()` para preparar la escena, cámara y renderizador.
 *                  - Crea el entorno de la habitación con `createRoomEnvironment()`.
 *                  - Construye el modelo de la tablet con `createTablet()`.
 *                  - Añade iluminación con `addTopSpotLights()`.
 *              - Renderiza el primer fotograma.
 *              - Inicia el bucle de animación con `requestAnimationFrame(startAnimation)`.
 *****************************************************************************************/
function start(): void {
  startContainer.value = false
  startTime = null
  rotationStartedAt = null

  initScene()
  createRoomEnvironment()
  createTablet()
  addTopSpotLights()
  /* addPrincipalLights() */
  renderer.render(scene, camera)
  requestAnimationFrame(startAnimation)
}
/*****************************************************************************************
 * FUNCTION: initScene
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes the base structure of the 3D scene.
 *              - Creates a new THREE.Scene instance.
 *              - Configures a PerspectiveCamera with a predefined FOV and aspect ratio.
 *              - Positions the camera in the scene.
 *              - Initializes the WebGLRenderer with anti-aliasing and buffer preservation.
 *              - Sets renderer settings such as size and background color.
 *              - Appends the renderer's canvas to the DOM container.
 * ***************************************************************************************
 * DESCRIPCIÓN: Inicializa la estructura base de la escena 3D.
 *              - Crea una nueva instancia de THREE.Scene.
 *              - Configura una cámara en perspectiva con FOV y aspecto definidos.
 *              - Posiciona la cámara en la escena.
 *              - Inicializa el WebGLRenderer con suavizado (antialias) y preservación de buffer.
 *              - Establece configuraciones del renderer como tamaño y color de fondo.
 *              - Añade el canvas del renderer al contenedor en el DOM.
 *****************************************************************************************/
function initScene(): void {
  // Create scene / Crear escena
  scene = new THREE.Scene()
  const width: number = window.innerWidth
  const height: number = window.innerHeight

  // Camera / Cámara
  camera = new THREE.PerspectiveCamera(startFov, width / height, 0.1, 100)
  // camera.position.set(0, 0, 20)
  camera.position.set(-15, 30, 30)

  if (!container.value) {
    throw new Error('initScene: container no está montado')
  }

  // Renderer / Renderizador
  const colorFondo: string = '#000000' // gris oscuro '#222222' // blanco 0xffffff
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true, // activa para mantener el buffer
  })

  renderer.setSize(width, height)
  renderer.setClearColor(colorFondo)
  container.value.appendChild(renderer.domElement)
}
/*****************************************************************************************
 * FUNCTION: createRoomEnvironment
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Builds a cubic room environment to contain the 3D scene.
 *              - Creates and adds a horizontal floor plane.
 *              - Creates and positions four vertical wall planes (back, front, left, right).
 *              - All elements share the same color and dimensions based on `roomSize` and `wallHeight`.
 *              - The room acts as the background/container for the rest of the 3D elements.
 * ***************************************************************************************
 * DESCRIPCIÓN: Construye un entorno cúbico tipo habitación para contener la escena 3D.
 *              - Crea y añade un plano horizontal como suelo.
 *              - Crea y posiciona cuatro planos verticales como paredes (trasera, frontal, izquierda y derecha).
 *              - Todos los elementos comparten el mismo color y dimensiones basadas en `roomSize` y `wallHeight`.
 *              - La habitación actúa como fondo o contenedor para el resto de los elementos 3D.
 *****************************************************************************************/
function createRoomEnvironment(): void {
  const roomSize: number = 100
  const wallHeight: number = 100
  const colorRoom: number = 0x126cfc //azul  0x6f25f7 // morado 0x25e2f7 // cian

  const floorGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(roomSize, roomSize)
  const floorMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: colorRoom,
  }) // 0x5043d9 }) // 0x6116c4 }) //
  const floor: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    floorGeometry,
    floorMaterial,
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -7
  scene.add(floor)

  const backWall: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    new THREE.PlaneGeometry(roomSize, wallHeight),
    new THREE.MeshStandardMaterial({ color: colorRoom }),
  )
  backWall.position.set(0, wallHeight / 2 - 7, -roomSize / 2)
  scene.add(backWall)

  const frontWall: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> = backWall.clone()
  frontWall.rotation.y = Math.PI
  frontWall.position.z = roomSize / 2
  scene.add(frontWall)

  const rightWall: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    new THREE.PlaneGeometry(roomSize, wallHeight),
    new THREE.MeshStandardMaterial({ color: colorRoom }),
  )
  rightWall.rotation.y = -Math.PI / 2
  rightWall.position.set(roomSize / 2, wallHeight / 2 - 7, 0)
  scene.add(rightWall)

  const leftWall: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> = rightWall.clone()
  leftWall.position.x = -roomSize / 2
  leftWall.rotation.y = Math.PI / 2
  scene.add(leftWall)
}
/*****************************************************************************************
 * FUNCTION: createTablet
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Constructs the 3D tablet model and adds it to the scene.
 *              - Builds the tablet frame using four rounded box geometries (top, bottom, left, right).
 *              - Adds a back cover plate slightly behind the frame for depth.
 *              - Creates a sunken black screen positioned slightly in front.
 *              - Sets a target object at screen position to help direct spotlight focus.
 *              - Groups all components in `tabletGroup` and adds it to the scene.
 *              - Adjusts the camera to look at the tablet’s position.
 * ***************************************************************************************
 * DESCRIPCIÓN: Construye el modelo 3D de la tablet y lo añade a la escena.
 *              - Crea el marco de la tablet usando cuatro geometrías de caja redondeada
 *                (superior, inferior, izquierda y derecha).
 *              - Añade una tapa trasera justo detrás del marco para dar profundidad.
 *              - Crea una pantalla negra ligeramente hundida en el frente.
 *              - Añade un objeto objetivo en la posición de la pantalla para dirigir
 *                la iluminación tipo spotlight.
 *              - Agrupa todos los componentes en `tabletGroup` y lo añade a la escena.
 *              - Ajusta la cámara para que apunte hacia la posición de la tablet.
 *****************************************************************************************/
function createTablet(): void {
  // Tablet frame / Marco de la Tablet
  const frameMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
  })
  const horizontal: RoundedBoxGeometry = new RoundedBoxGeometry(
    outerWidth - 0.2,
    horizontalThickness - 0.2,
    depthMarco,
    5,
    0.3,
  )
  const vertical: RoundedBoxGeometry = new RoundedBoxGeometry(
    verticalThickness - 0.2,
    outerHeight - 0.2,
    depthMarco,
    5,
    0.3,
  )
  const top: THREE.Mesh<RoundedBoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    horizontal,
    frameMaterial,
  )
  top.position.y = outerHeight / 2 - horizontalThickness / 2

  const bottom: THREE.Mesh<RoundedBoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    horizontal,
    frameMaterial,
  )
  bottom.position.y = -(outerHeight / 2) + horizontalThickness / 2

  const left: THREE.Mesh<RoundedBoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    vertical,
    frameMaterial,
  )
  left.position.x = -(outerWidth / 2) + verticalThickness / 2

  const right: THREE.Mesh<RoundedBoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    vertical,
    frameMaterial,
  )
  right.position.x = outerWidth / 2 - verticalThickness / 2

  tabletGroup.add(top, bottom, left, right)

  // Back Cover / Tapa trasera
  const backPlateGeometry: RoundedBoxGeometry = new RoundedBoxGeometry(
    outerWidth,
    outerHeight,
    depthBase,
    5,
    0.3,
  )
  const backPlateMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
  })
  const backPlate: THREE.Mesh<RoundedBoxGeometry, THREE.MeshStandardMaterial> = new THREE.Mesh(
    backPlateGeometry,
    backPlateMaterial,
  )
  backPlate.position.z = -0.11
  tabletGroup.add(backPlate)

  // Sunken screen / Pantalla hundida
  const screenGeometry: RoundedBoxGeometry = new RoundedBoxGeometry(
    screenWidth,
    screenHeight,
    depthMarco,
    5,
    0.3,
  )

  screenMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    reflectivity: 1,
    transparent: true,
    opacity: 0.7,
  })
  screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.z = 0.01
  tabletGroup.add(screen)

  // Target for spotlight so lights point to a specific place
  // Target del spotlight para que las luces apunten a un lugar especifico
  const screenTarget: THREE.Object3D = new THREE.Object3D()
  screenTarget.position.copy(screen.position)
  tabletGroup.add(screenTarget)

  scene.add(tabletGroup)
  camera.lookAt(tabletGroup.position)
}
/*****************************************************************************************
 * FUNCTION: addTopSpotLights
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Adds three directional spotlights positioned above the tablet to simulate
 *              focused top lighting.
 *              - Creates left, center, and right spotlights with configured intensity,
 *                distance, angle, penumbra, and decay.
 *              - Positions each light above the scene, targeting the tablet group.
 *              - Enables shadows for the left and right lights.
 *              - Activates shadow mapping on the renderer.
 *              - Allows the tablet group to cast and receive shadows.
 * ***************************************************************************************
 * DESCRIPCIÓN: Añade tres luces direccionales tipo spotlight posicionadas sobre la tablet
 *              para simular iluminación cenital.
 *              - Crea focos izquierdo, central y derecho con intensidad, distancia, ángulo,
 *                penumbra y decaimiento configurados.
 *              - Posiciona cada luz sobre la escena, apuntando al grupo de la tablet.
 *              - Activa las sombras para las luces izquierda y derecha.
 *              - Habilita el uso de mapas de sombras en el renderizador.
 *              - Permite que la tablet proyecte y reciba sombras.
 *****************************************************************************************/
function addTopSpotLights(): void {
  const xlight: number = 30 //50
  const ylight: number = 30 // 50
  const zlight: number = -20 // -40
  const lightIntensity: number = 500 // 300
  const lightDistance: number = 100
  const lightAngle: number = Math.PI / 12 // / 2 // 22.5 degrees
  const lightPenumbra: number = 0.2 // 1 // 0.2 // Suavizado de la luz
  const lightDecay: number = 2 // 1 // Decaimiento de la luz

  leftLight = new THREE.SpotLight(
    colorWhite,
    lightIntensity,
    lightDistance,
    lightAngle,
    lightPenumbra,
    lightDecay,
  )
  leftLight.position.set(-xlight, 45, zlight) // Posición de la luz (arriba a la izquierda)
  leftLight.target = tabletGroup // Apunta hacia el cubo
  leftLight.castShadow = true // Habilitar sombras
  scene.add(leftLight)

  centerLight = new THREE.SpotLight(
    colorWhite,
    lightIntensity,
    lightDistance,
    lightAngle,
    lightPenumbra,
    lightDecay,
  )
  centerLight.position.set(0, ylight, zlight + -zlight) // Posición de la luz (centro superior)
  centerLight.target = tabletGroup // Apunta hacia el cubo
  // centerLight.castShadow = true // Habilitar sombras
  scene.add(centerLight)

  rightLight = new THREE.SpotLight(
    colorWhite,
    lightIntensity,
    lightDistance,
    lightAngle,
    lightPenumbra,
    lightDecay,
  )
  rightLight.position.set(xlight, ylight, zlight) // Posición de la luz (arriba a la derecha)
  rightLight.target = tabletGroup // Apunta hacia el cubo
  rightLight.castShadow = true // Habilitar sombras
  scene.add(rightLight)

  // Configurar la sombra de las luces
  renderer.shadowMap.enabled = true // Habilitar mapas de sombras en el renderizador

  // Hacer que el cubo pueda recibir sombras
  tabletGroup.receiveShadow = true
  tabletGroup.castShadow = true
}
/*****************************************************************************************
 * FUNCTION: addPrincipalLights
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Adds the main lighting sources to the 3D scene to simulate natural and
 *              ambient illumination.
 *              - Adds an ambient light for uniform overall lighting.
 *              - Adds a directional light to simulate sunlight or daylight.
 *              - Adds a spotlight pointing to a specific fixed target in the scene.
 *              - Configures spotlight properties: intensity, angle, penumbra, distance, and decay.
 * ***************************************************************************************
 * DESCRIPCIÓN: Añade las fuentes de iluminación principales a la escena 3D para simular
 *              iluminación natural y ambiental.
 *              - Añade una luz ambiental para iluminar de forma uniforme toda la escena.
 *              - Añade una luz direccional que simula luz solar o luz diurna.
 *              - Añade un spotlight que apunta a un objetivo fijo en la escena.
 *              - Configura las propiedades del spotlight: intensidad, ángulo, penumbra, distancia y decaimiento.
 *****************************************************************************************/
/*function addPrincipalLights() {
  const colorLights = 0xffffff // White
  const lightIntensity = 600 // 800
  const lightDistance = 100
  const lightAngle = Math.PI / 3 // Degrees
  const lightPenumbra = 0.1 // Suavizado
  const lightDecay = 0.8 // Decaimiento

  // Illuminates the entire scene uniformly and without direction.
  // Ilumina toda la escena de manera uniforme y sin dirección.
  scene.add(new THREE.AmbientLight(colorLights, 0.4))

  // Simulates sunlight or daylight. / Simula luz solar o del día.
  // const light = new THREE.DirectionalLight(colorLights, 50)
  // light.position.set(5, 10, 7)

  // Simulates sunlight or daylight. / Simula luz solar o del día.
  const directionalLight = new THREE.DirectionalLight(colorLights, 1)
  directionalLight.position.set(10, 10, 10)

  // Illuminates a specific area / Ilumina un área específica
  const spotlight = new THREE.SpotLight(
    colorLights,
    lightIntensity,
    lightDistance,
    lightAngle,
    lightPenumbra,
    lightDecay,
  )
  spotlight.position.set(0, 20, 50)

  // Create an empty object as a fixed point / Crear un objeto vacío como punto fijo
  const fixedTarget = new THREE.Object3D()
  fixedTarget.position.set(2, 2, 0)
  scene.add(fixedTarget)

  spotlight.target = fixedTarget
  scene.add(spotlight)
  scene.add(spotlight.target)
  scene.add(directionalLight)
  // scene.add(light)
}*/
/*****************************************************************************************
 * FUNCTION: animateTabletRotation
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Animates the Y-axis rotation of the tablet over a specified duration.
 *              - Calculates a normalized time `t` based on elapsed time and total duration.
 *              - Applies a full 360° rotation (2π radians) progressively as `t` increases.
 *              - Ensures the rotation does not exceed one full turn by clamping `t` to a max of 1.
 * ***************************************************************************************
 * DESCRIPCIÓN: Anima la rotación de la tablet sobre el eje Y durante una duración definida.
 *              - Calcula un tiempo normalizado `t` en función del tiempo transcurrido y la duración total.
 *              - Aplica una rotación completa de 360° (2π radianes) de forma progresiva a medida que `t` aumenta.
 *              - Asegura que la rotación no exceda una vuelta completa limitando `t` a un máximo de 1.
 *****************************************************************************************/
function animateTabletRotation(elapsedTime: number, durationRotation: number): void {
  const t: number = Math.min(elapsedTime / durationRotation, 1)
  tabletGroup.rotation.y = Math.PI * 2 * t
}
/*****************************************************************************************
 * FUNCTION: animateCameraZoom
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Animates the camera transition from a distant starting position and wide
 *              field of view (FOV) to a closer position and narrower FOV, creating a smooth
 *              zoom-in effect centered on the tablet.
 *              - If the delay period hasn’t elapsed yet, the function exits early.
 *              - During the zoom duration, interpolates camera position and FOV.
 *              - Once finished, sets the camera exactly to the final position and FOV.
 *              - Updates the projection matrix and ensures the camera always looks at the tablet.
 *
 * PARAMETERS:
 *   - elapsedTime (Number): Time passed since the full animation started, in seconds.
 *   - delay (Number): Wait time before starting the zoom animation.
 *   - durationCameraZoom (Number): Total duration of the zoom-in animation phase, in seconds.
 * ***************************************************************************************
 * DESCRIPCIÓN: Anima la transición de la cámara desde una posición inicial alejada y un
 *              campo de visión amplio (FOV), hacia una posición más cercana y un FOV reducido,
 *              generando un efecto de zoom suave centrado en la tablet.
 *              - Si el tiempo de espera (delay) no ha transcurrido, la función termina sin ejecutar.
 *              - Durante la fase de zoom, interpola la posición y el FOV de la cámara.
 *              - Al finalizar, la cámara se ajusta exactamente a su posición y FOV finales.
 *              - Se actualiza la matriz de proyección y se orienta la cámara hacia la tablet.
 *
 * PARÁMETROS:
 *   - elapsedTime (Número): Tiempo transcurrido desde el inicio total de la animación, en segundos.
 *   - delay (Número): Tiempo de espera antes de iniciar la animación de zoom.
 *   - durationCameraZoom (Número): Duración total de la fase de acercamiento, en segundos.
 *****************************************************************************************/
function animateCameraZoom(elapsedTime: number, delay: number, durationCameraZoom: number): void {
  const cameraElapsedTime: number = elapsedTime - delay

  if (cameraElapsedTime < 0) return

  if (cameraElapsedTime < durationCameraZoom) {
    const t = cameraElapsedTime / durationCameraZoom
    camera.position.lerpVectors(startPos, endPos, t)
    camera.fov = startFov + (endFov - startFov) * t
  } else {
    camera.position.copy(endPos)
    camera.fov = endFov
  }
  camera.updateProjectionMatrix()
  camera.lookAt(tabletGroup.position)
}
/*****************************************************************************************
 * FUNCTION: updateOverlayPosition
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Projects the 3D screen mesh position and dimensions to 2D screen space and
 *              updates the position and size of the HTML overlay (`#screen-overlay`) accordingly.
 *              - Computes the 3D positions of the screen's center, top-left, and bottom-right corners.
 *              - Converts those positions to world coordinates and then projects them into 2D screen space.
 *              - Calculates the pixel coordinates and dimensions for the overlay.
 *              - Updates the overlay’s CSS to match the projected area of the 3D screen.
 * ***************************************************************************************
 * DESCRIPCIÓN: Proyecta la posición y dimensiones del mesh de la pantalla 3D al espacio
 *              de pantalla 2D, y actualiza en consecuencia la posición y tamaño del
 *              overlay HTML (`#screen-overlay`).
 *              - Calcula las posiciones 3D del centro, esquina superior izquierda y esquina inferior derecha de la pantalla.
 *              - Convierte esas posiciones a coordenadas del mundo y luego las proyecta al espacio de pantalla 2D.
 *              - Calcula las coordenadas en píxeles y dimensiones del área proyectada.
 *              - Actualiza los estilos CSS del overlay para que coincidan con la pantalla 3D.
 *****************************************************************************************/
function updateOverlayPosition(): void {
  if (!screen || !camera || !renderer) return

  const vector: THREE.Vector3 = new THREE.Vector3()
  vector.setFromMatrixPosition(screen.matrixWorld)
  vector.project(camera)

  const widthHalf: number = renderer.domElement.clientWidth / 2
  const heightHalf: number = renderer.domElement.clientHeight / 2

  // Puntos extremos en el espacio local del mesh
  const center: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  const topLeft: THREE.Vector3 = new THREE.Vector3(-screenWidth / 2, screenHeight / 2, 0)
  const bottomRight: THREE.Vector3 = new THREE.Vector3(screenWidth / 2, -screenHeight / 2, 0)

  // Convertir a coordenadas mundiales
  screen.updateMatrixWorld()
  center.applyMatrix4(screen.matrixWorld)
  topLeft.applyMatrix4(screen.matrixWorld)
  bottomRight.applyMatrix4(screen.matrixWorld)

  // Proyectar al espacio de pantalla
  center.project(camera)
  topLeft.project(camera)
  bottomRight.project(camera)

  const centerX: number = center.x * widthHalf + widthHalf
  const centerY: number = -center.y * heightHalf + heightHalf

  const x1: number = topLeft.x * widthHalf + widthHalf
  const y1: number = -topLeft.y * heightHalf + heightHalf

  const x2: number = bottomRight.x * widthHalf + widthHalf
  const y2: number = -bottomRight.y * heightHalf + heightHalf

  const margin: number = 5
  const pixelWidth: number = Math.abs(x2 - x1) - margin
  const pixelHeight: number = Math.abs(y2 - y1) - 3 * margin

  const overlay = document.getElementById('screen-overlay') as HTMLDivElement | null
  if (overlay) {
    overlay.style.left = `${centerX}px`
    overlay.style.top = `${centerY}px`
    overlay.style.width = `${pixelWidth}px`
    overlay.style.height = `${pixelHeight}px`
  }

  // if (screenWidth <= 480) {
  //   xValue = canvasRect.width / 2 - 3.5
  // } else if (screenWidth <= 768) {
  //   xValue = canvasRect.width / 2 - 5
  // } else if (screenWidth <= 1024) {
  //   xValue = canvasRect.width / 2 - 10
  // } else {
  //   xValue = canvasRect.width / 2 - 17
  // }
}
/*****************************************************************************************
 * FUNCTION: startAnimation
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Main animation loop that orchestrates the tablet’s entry animation sequence.
 *              - Records the initial start time on the first call.
 *              - Calculates elapsed time since the beginning.
 *              - Animates the tablet’s Y-axis rotation during the first `durationRotation` seconds.
 *              - Starts the camera zoom animation after the tablet rotation begins.
 *              - Renders the current frame of the scene.
 *              - Triggers the HTML overlay and tablet content visibility slightly before the end.
 *              - Continues requesting animation frames until the full sequence completes.
 *
 * NOTES:
 *   - `overlayShown` prevents multiple overlay updates.
 *   - `recorteTiempoParaMostrarLaPantalla` is a time offset to show content slightly earlier.
 * ***************************************************************************************
 * DESCRIPCIÓN: Bucle principal de animación que orquesta la secuencia de entrada de la tablet.
 *              - Registra el tiempo de inicio en la primera llamada.
 *              - Calcula el tiempo transcurrido desde el inicio.
 *              - Anima la rotación sobre el eje Y de la tablet durante los primeros `durationRotation` segundos.
 *              - Inicia la animación del zoom de cámara una vez que comienza la rotación.
 *              - Renderiza el fotograma actual de la escena.
 *              - Muestra el overlay HTML y el contenido de la tablet ligeramente antes del final.
 *              - Continúa solicitando nuevos frames hasta que finaliza toda la secuencia.
 *
 * NOTAS:
 *   - `overlayShown` evita múltiples actualizaciones del overlay.
 *   - `recorteTiempoParaMostrarLaPantalla` es un recorte de tiempo para adelantar el contenido ligeramente.
 *****************************************************************************************/
function startAnimation(time: DOMHighResTimeStamp): void {
  if (startTime === null) startTime = time

  const elapsedTime: number = (time - startTime) / 1000
  const durationRotation: number = 2.5
  const durationCameraZoom: number = 1.8
  const totalDuration: number = durationRotation + durationCameraZoom
  const recorteTiempoParaMostrarLaPantalla: number = 1.7

  animateTabletRotation(elapsedTime, durationRotation)

  if (rotationStartedAt === null) rotationStartedAt = elapsedTime
  animateCameraZoom(elapsedTime, rotationStartedAt, durationCameraZoom)

  if (!renderer || !scene || !camera) {
    animationId = requestAnimationFrame(startAnimation)
    return
  }
  renderer.render(scene, camera)

  if (!overlayShown && elapsedTime > totalDuration - recorteTiempoParaMostrarLaPantalla) {
    updateOverlayPosition()
    showTabletContent.value = true
    overlayShown = true
  }

  if (elapsedTime < totalDuration) {
    requestAnimationFrame(startAnimation)
  } else {
    // console.log('finalizo')
  }
}

provide('data', data)
</script>

<style scoped lang="scss">
@use '@/styles/colors' as *;

.preloader-fade-enter-active,
.preloader-fade-leave-active {
  transition:
    opacity 1.2s ease,
    transform 1.2s ease;
}

.preloader-fade-enter-from,
.preloader-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.containerPrincipal {
  width: 100%;
  height: 100vh;
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.start-screen {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.startButton {
  position: relative;
  color: $brilliantBlue;
  width: fit-content;
  height: fit-content;
  margin: auto;
  padding: auto;
  font-family:
    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 1.5rem;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease;
  animation: pulseStartButton 1.5s ease-in-out infinite;
}

.startButton:hover {
  transform: scale(1.05);
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
}

.preloader {
  position: absolute;
  inset: 0;
  background: $GreyBlue;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-family: sans-serif;
  transition: background-color 0.4s ease;
}

.loading-text {
  font-family:
    'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 1rem;
  color: $brilliantBlue;
  animation: pulseLoading 1.5s ease-in-out infinite;
}

.preloader-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dot-loader {
  display: flex;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.dot {
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  animation: bounce 1.2s infinite ease-in-out alternate;
  position: relative;
}

.dot1 {
  animation-delay: 0.2s;
}
.dot2 {
  animation-delay: 0.4s;
}
.dot3 {
  animation-delay: 0.6s;
}
.dot4 {
  animation-delay: 0.67s;
}
.dot5 {
  animation-delay: 0.6s;
}
.dot6 {
  animation-delay: 0.4s;
}
.dot7 {
  animation-delay: 0.2s;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
    background-color: $lightViolet;
  }
  50% {
    transform: translateY(-2.5rem);
    background-color: $brilliantMagenta;
  }
  100% {
    transform: translateY(0);
    background-color: $lightViolet;
  }
}

@keyframes pulseLoading {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes pulseStartButton {
  0%,
  100% {
    color: $lightViolet;
  }
  50% {
    color: $brilliantMagenta;
  }
}

.fade-out-dots .dot {
  animation: none !important;
  opacity: 0;
  transition: opacity 5s ease;
}
.fade-out-dots .dot1 {
  transition-delay: 0s;
}
.fade-out-dots .dot2 {
  transition-delay: 0.1s;
}
.fade-out-dots .dot3 {
  transition-delay: 0.2s;
}
.fade-out-dots .dot4 {
  transition-delay: 3s;
}
.fade-out-dots .dot5 {
  transition-delay: 0.2s;
}
.fade-out-dots .dot6 {
  transition-delay: 0.1s;
}
.fade-out-dots .dot7 {
  transition-delay: 0s;
}

#webgl-container {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  top: -9999px;
  left: -9999px;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  z-index: 10;
  width: 300px;
  height: 200px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
}
.overlay-shadow {
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
}

.screen-overlay {
  position: absolute;
  transform: translate(-50%, -50%);
}

.fade-in-screen {
  animation: screenOn 0.8s ease forwards;
}

@keyframes screenOn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.03);
    filter: brightness(0.3);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: brightness(1);
  }
}
</style>
