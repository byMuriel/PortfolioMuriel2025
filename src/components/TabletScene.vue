<!-- src/components/TabletScene.vue -->
<template>
  <div ref="container" class="containerPrincipal" style="width: 100%; height: 100vh"></div>
</template>

<script setup>
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, onMounted, onBeforeUnmount, createApp } from 'vue'
import html2canvas from 'html2canvas'
import TabletContent from './TabletContent.vue'

const container = ref(null)
const isScreenOn = ref(false)

let renderer, scene, camera, animationId, controls
let screenMaterial

// Dimensions and properties of the tablet / Dimensiones y propiedades de la tablet
const outerWidth = 8
const outerHeight = 12
const depthMarco = 0.2
const depthBase = 0.6
const horizontalThickness = 1.5 // top/bottom
const verticalThickness = 0.3
const thickness = 0.3
const screenWidth = outerWidth - thickness * 2
const screenHeight = outerHeight - 2 - thickness * 2

/*****************************************************************************************
 * LIFECYCLE HOOK: onMounted
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Vue lifecycle hook that runs when the component is mounted.
 *              Initializes the entire 3D scene and sets up the main behavior:
 *              - Calls `initScene()` to configure the scene, camera, renderer, and controls.
 *              - Creates the 3D tablet model using `createTablet()`.
 *              - Adds light sources to the scene with `addLights()`.
 *              - Starts the animated rendering loop with `startAnimation()`.
 *              - Adds a global listener to handle keyboard events, such as ENTER,
 *                using `handleKeyDown`.
 * **************************************************************************************
 * DESCRIPCIÓN: Hook de ciclo de vida de Vue que se ejecuta cuando el componente es montado.
 *              Inicializa toda la escena 3D y establece el comportamiento principal:
 *              - Llama a `initScene()` para configurar la escena, cámara, renderer y controles.
 *              - Crea el modelo 3D de la tablet mediante `createTablet()`.
 *              - Añade fuentes de luz a la escena con `addLights()`.
 *              - Inicia el bucle de renderizado animado con `startAnimation()`.
 *              - Agrega un listener global para manejar eventos de teclado, como ENTER,
 *                usando `handleKeyDown`.
 *****************************************************************************************/
onMounted(() => {
  initScene()
  createTablet()
  addLights()
  startAnimation()

  window.addEventListener('keydown', handleKeyDown)
})
/*****************************************************************************************
   * LIFECYCLE HOOK: onBeforeUnmount
   * AUTHOR: Muriel Vitale.
   * DESCRIPTION: Vue lifecycle hook that runs just before the component is destroyed.
   *              It properly cleans up all resources and event listeners related to the 3D scene:
   *              - Removes the global keyboard listener (`keydown`).
   *              - Cancels the animation loop using `cancelAnimationFrame`.
   *              - Frees renderer resources with `renderer.dispose()`.
   *              - Removes the WebGL canvas from the DOM if it exists.
   * ***************************************************************************************
   * DESCRIPCIÓN: Hook de ciclo de vida de Vue que se ejecuta justo antes de que el componente
   *              sea destruido. Se encarga de limpiar correctamente todos los recursos y 
   *              listeners asociados a la escena 3D:
   *              - Elimina el listener global del teclado (`keydown`).
   *              - Cancela el bucle de animación con `cancelAnimationFrame`.
   *              - Libera los recursos del renderizador con `renderer.dispose()`.
   *              - Elimina el canvas WebGL del DOM si existe.

   *****************************************************************************************/
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  cancelAnimationFrame(animationId)
  renderer.dispose()
  if (container.value) {
    container.value.removeChild(renderer.domElement)
  }
})
/*****************************************************************************************
 * FUNCTION: initScene
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Initializes and sets up the main 3D scene using Three.js.
 *              This function creates the basic elements required to render a scene:
 *              - Creates a `Scene` object.
 *              - Sets up a perspective camera positioned in front of the scene.
 *              - Creates a WebGL renderer with antialiasing and appends it to the DOM.
 *              - Sets the renderer size to match the window dimensions.
 *              - Configures a background color for the scene.
 *              - Adds orbital controls to navigate the scene (without zoom or pan).
 * ****************************************************************************************
 * DESCRIPCIÓN: Inicializa y configura la escena 3D principal usando Three.js.
 *              Esta función crea los elementos básicos necesarios para renderizar
 *              una escena:
 *              - Crea un objeto `Scene`.
 *              - Configura una cámara con perspectiva posicionada frente a la escena.
 *              - Crea un renderizador WebGL con antialiasing y lo añade al DOM.
 *              - Establece el tamaño del renderizador con las dimensiones de la ventana.
 *              - Configura un fondo de color para la escena.
 *              - Añade controles orbitales para navegar la escena (sin zoom ni paneo).
 *****************************************************************************************/
function initScene() {
  // Create scene / Crear escena
  const width = window.innerWidth
  const height = window.innerHeight
  scene = new THREE.Scene()

  // Background image / Imagen de fondo
  // const loader = new THREE.TextureLoader()
  // loader.load('ruta/a/tu/imagen.jpg', (texture) => {
  //   scene.background = texture
  // })

  // Camera / Cámara
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0, 20)

  // Renderer / Renderizador
  const colorFondo = '#000000' // gris oscuro '#222222' // blanco 0xffffff
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true, // activa para mantener el buffer
  })
  renderer.physicallyCorrectLights = true
  renderer.setSize(width, height)
  renderer.setClearColor(colorFondo)
  container.value.appendChild(renderer.domElement)

  // Orbit controls / Controles de órbita
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // Suaviza el movimiento
  controls.dampingFactor = 0.05
  controls.enableZoom = false // Si no quieres hacer zoom
  controls.enablePan = false
}
/*****************************************************************************************
   * FUNCTION: createTablet
   * AUTHOR: Muriel Vitale.
   * DESCRIPTION: Builds and adds a 3D tablet model to the scene using Three.js.
   *              This function groups the main components that make up the tablet:
   *              - Outer frame (top, bottom, left, and right edges).
   *              - Back cover with rounded geometry.
   *              - Recessed screen with a configurable material (`screenMaterial`).
   *              - Reference object (target) for spotlight-type lighting.
   *              
   *              The complete group (`tabletGroup`) is added to the main scene (`scene`).
   *              Uses rounded geometries (`RoundedBoxGeometry`) and PBR materials.
   * *****************************************************************************************
   * DESCRIPCIÓN: Construye y añade a la escena un modelo 3D de una tablet utilizando Three.js.
   *              Esta función agrupa los componentes principales que componen la tablet:
   *              - Marco exterior (bordes superior, inferior, izquierdo y derecho).
   *              - Tapa trasera con geometría redondeada.
   *              - Pantalla hundida con material configurable (screenMaterial).
   *              - Objeto de referencia (target) para iluminación tipo spotlight.
   *              
   *              El grupo completo (`tabletGroup`) se agrega a la escena principal (`scene`).
   *              Utiliza geometrías redondeadas (RoundedBoxGeometry) y materiales PBR.

   *****************************************************************************************/
function createTablet() {
  const tabletGroup = new THREE.Group()

  // Tablet frame / Marco de la Tablet
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
  })
  const horizontal = new RoundedBoxGeometry(
    outerWidth - 0.2,
    horizontalThickness - 0.2,
    depthMarco,
    5,
    0.3,
  )
  const vertical = new RoundedBoxGeometry(
    verticalThickness - 0.2,
    outerHeight - 0.2,
    depthMarco,
    5,
    0.3,
  )
  const top = new THREE.Mesh(horizontal, frameMaterial)
  top.position.y = outerHeight / 2 - horizontalThickness / 2
  const bottom = new THREE.Mesh(horizontal, frameMaterial)
  bottom.position.y = -(outerHeight / 2) + horizontalThickness / 2
  const left = new THREE.Mesh(vertical, frameMaterial)
  left.position.x = -(outerWidth / 2) + verticalThickness / 2
  const right = new THREE.Mesh(vertical, frameMaterial)
  right.position.x = outerWidth / 2 - verticalThickness / 2
  tabletGroup.add(top, bottom, left, right)

  // Back Cover / Tapa trasera
  const backPlateGeometry = new RoundedBoxGeometry(outerWidth, outerHeight, depthBase, 5, 0.3)
  const backPlateMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2,
  })
  const backPlate = new THREE.Mesh(backPlateGeometry, backPlateMaterial)
  backPlate.position.z = -0.11 // - depthBase + depthMarco
  tabletGroup.add(backPlate)

  // Sunken screen / Pantalla hundida
  const screenGeometry = new RoundedBoxGeometry(screenWidth, screenHeight, depthMarco, 5, 0.3)

  screenMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000, //0xff0000,
    // emissiveIntensity: 0.3,
    reflectivity: 1,
    transparent: true,
    opacity: 0.7,
  })
  const screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.z = 0.01 // slightly sunken / ligeramente hundida
  tabletGroup.add(screen)

  // Target for spotlight so lights point to a specific place
  // Target del spotlight para que las luces apunten a un lugar especifico
  const screenTarget = new THREE.Object3D()
  screenTarget.position.copy(screen.position)
  tabletGroup.add(screenTarget)

  scene.add(tabletGroup)
}
/*****************************************************************************************
 * FUNCTION: addLights
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Adds and configures various light sources to the 3D scene to enhance
 *              overall illumination and visual realism.
 *              The configured lights include:
 *              - An ambient light (`AmbientLight`) providing soft global lighting.
 *              - Two directional lights (`DirectionalLight`) simulating sunlight or focused light.
 *              - A spotlight (`SpotLight`) targeting a specific point in the scene.
 *              Additionally, an empty object (`fixedTarget`) is created as the spotlight's
 *              target, positioned at the center of the scene.
 * *****************************************************************************************
 * DESCRIPCIÓN: Añade y configura diversas fuentes de luz a la escena 3D para mejorar la
 *              iluminación general y el realismo visual del entorno.
 *              Las luces configuradas son:
 *              - Luz ambiental (`AmbientLight`) que proporciona iluminación global suave.
 *              - Dos luces direccionales (`DirectionalLight`) simulando luz solar o puntual.
 *              - Un spotlight (`SpotLight`) que enfoca un punto específico de la escena.
 *              También se crea un objeto vacío (`fixedTarget`) como objetivo (target)
 *              para la luz spotlight, situado en el centro de la escena.
 *****************************************************************************************/
function addLights() {
  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 0.4))
  const light = new THREE.DirectionalLight(0xffffff, 0.8)
  light.position.set(5, 10, 7)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 10, 10)
  const spotlight = new THREE.SpotLight(0xffffff, 1)
  spotlight.position.set(0, 10, 10)

  // Crear un objeto vacío en el centro de la escena como punto fijo
  const fixedTarget = new THREE.Object3D()
  fixedTarget.position.set(0, 0, 0)
  scene.add(fixedTarget)

  spotlight.target = fixedTarget
  scene.add(spotlight)
  scene.add(spotlight.target)
  scene.add(directionalLight)
  scene.add(light)
}
/*****************************************************************************************
 * FUNCTION: startAnimation
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Starts and continuously runs the animation loop for the 3D scene
 *              using `requestAnimationFrame`. This loop updates camera controls and
 *              renders the scene on every frame to achieve smooth real-time animation.
 *              On each frame:
 *              - Requests the next animation frame.
 *              - Updates the OrbitControls to reflect user interactions.
 *              - Renders the scene from the current camera perspective.
 * *****************************************************************************************
 * DESCRIPCIÓN: Inicia y mantiene el bucle de animación para la escena 3D
 *              utilizando `requestAnimationFrame`. Este ciclo actualiza los controles
 *              de cámara y renderiza la escena en cada frame para lograr animación fluida.
 *              En cada frame:
 *              - Solicita el siguiente frame de animación.
 *              - Actualiza los controles OrbitControls para reflejar interacciones.
 *              - Renderiza la escena desde la perspectiva actual de la cámara.
 *****************************************************************************************/
function startAnimation() {
  animationId = requestAnimationFrame(startAnimation)
  controls.update()
  // tabletGroup.rotation.y += 0.005
  renderer.render(scene, camera)
}
/*****************************************************************************************
 * FUNCTION: transitionTabletOn
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Creates a smooth transition effect to simulate the "screen turning on"
 *              by gradually increasing the material's opacity and emissive intensity
 *              over a given duration. Used for animating the tablet's screen activation.
 *              On each animation frame:
 *              - Increments the progress counter.
 *              - Updates the material’s opacity and emissive intensity proportionally.
 *              - When complete, ensures final values are set and calls `onComplete`.
 * PARAMETERS:
 *   - duration (Number): Number of frames the transition lasts.
 *   - screenMaterial (THREE.Material): The material applied to the tablet screen.
 *   - onComplete (Function): Callback executed once the transition finishes.
 * *****************************************************************************************
 * DESCRIPCIÓN: Crea un efecto de transición suave que simula el encendido de la pantalla
 *              aumentando gradualmente la opacidad y la intensidad emisiva del material
 *              durante una duración determinada. Se usa para animar la activación de la
 *              pantalla de la tablet.
 *              En cada frame de animación:
 *              - Se incrementa el contador de progreso.
 *              - Se actualizan la opacidad y la intensidad emisiva del material.
 *              - Al finalizar, se aseguran los valores finales y se llama a `onComplete`.
 * PARÁMETROS:
 *   - duration (Número): Duración del efecto en número de frames.
 *   - screenMaterial (THREE.Material): Material aplicado a la pantalla de la tablet.
 *   - onComplete (Función): Callback ejecutado al finalizar la transición.
 *****************************************************************************************/
function transitionTabletOn({ duration, screenMaterial, onComplete }) {
  let progress = 0

  function step() {
    progress++
    const t = progress / duration

    screenMaterial.opacity = Math.min(t, 1)
    screenMaterial.emissiveIntensity = Math.min(t, 1)
    screenMaterial.needsUpdate = true

    if (progress < duration) {
      requestAnimationFrame(step)
    } else {
      screenMaterial.opacity = 1
      screenMaterial.emissiveIntensity = 1
      screenMaterial.needsUpdate = true

      if (typeof onComplete === 'function') {
        onComplete()
      }
    }
  }
  requestAnimationFrame(step)
}
/*****************************************************************************************
 * FUNCTION: handleKeyDown (async)
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Handles the keyboard event when the user presses a key.
 *              Specifically, when the `Enter` key is pressed, it toggles the screen's
 *              on/off state (simulated using a Three.js material).
 *
 *              - If the screen is off and Enter is pressed:
 *                  - The `TabletContent` component is rendered as a texture using html2canvas.
 *                  - The texture is assigned to the screen material.
 *                  - Material properties such as color, opacity, and emissiveness are updated.
 *
 *              - If the screen is on and Enter is pressed again:
 *                  - The texture is cleared and material properties are adjusted
 *                    to simulate a turned-off screen.
 *
 * PARAMETERS:
 *   - event: KeyboardEvent object containing the pressed key.
 * *****************************************************************************************
 * DESCRIPCIÓN: Maneja el evento de teclado cuando el usuario presiona una tecla.
 *              En particular, al presionar `Enter`, alterna el estado de encendido/apagado
 *              de la pantalla (simulado por un material en Three.js).
 *
 *              - Si la pantalla está apagada y se presiona Enter:
 *                  - Se renderiza el componente `TabletContent` como textura usando html2canvas.
 *                  - Se asigna la textura al material de la pantalla.
 *                  - Se ajustan propiedades del material como color, opacidad y emisividad.
 *
 *              - Si la pantalla está encendida y se presiona Enter nuevamente:
 *                  - Se limpian las texturas y se aplican estilos que simulan una pantalla apagada.
 * PARÁMETROS:
 *   - event: objeto KeyboardEvent que contiene la tecla presionada.
 *****************************************************************************************/
async function handleKeyDown(event) {
  try {
    if (event.key === 'Enter') {
      isScreenOn.value = !isScreenOn.value

      if (isScreenOn.value) {
        // Screen ON

        const result = await renderScreenTexture()
        const texture = result?.texture
        const cleanup = result?.cleanup

        if (texture) {
          screenMaterial.map = texture
          screenMaterial.color.setHex(0xffffff)
          screenMaterial.transparent = true
          screenMaterial.opacity = 0
          screenMaterial.emissiveIntensity = 0
          screenMaterial.needsUpdate = true

          transitionTabletOn({
            duration: 20,
            screenMaterial,
            onComplete: cleanup,
          })
        } else {
          console.warn('Texture is null')
        }
        // Desactivar OrbitControls cuando el mouse interactúa con el HTML proyectado
        controls.enabled = false
      } else {
        // Screen OFF

        screenMaterial.map = null
        screenMaterial.color.setHex(0x000000)
        screenMaterial.emissiveIntensity = 0.3
        screenMaterial.opacity = 0.7
        screenMaterial.needsUpdate = true

        // Activar OrbitControls
        controls.enabled = true
      }
    }
  } catch (error) {
    console.error('Error in handleKeyDown:', error)
  }
}
/*****************************************************************************************
 * FUNCTION: renderScreenTexture (async)
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Renders a Vue component (`TabletContent`) as a Three.js texture.
 *              The process includes:
 *                - Dynamically creating a hidden HTML container off-screen.
 *                - Mounting the `TabletContent` component inside that container.
 *                - Waiting for the component to be ready (`domReady` promise).
 *                - Using `html2canvas` to capture the rendered content into a canvas.
 *                - Converting the canvas into a Three.js `CanvasTexture`.
 *                - Returning an object with the texture and a `cleanup` function to unmount
 *                  the component and remove the container from the DOM.
 *
 * PARAMETERS:
 *   - No explicit parameters, but uses `screenWidth` and `screenHeight` from the outer scope.
 *
 * RETURNS:
 *   - An object with the following properties:
 *       - `texture`: a Three.js texture generated from the canvas.
 *       - `cleanup`: a function to free resources (unmount component and remove container).
 *   - Returns `null` in case of an error.
 * ***************************************************************************************
 * DESCRIPCIÓN: Renderiza un componente Vue (`TabletContent`) como una textura de Three.js.
 *              Para ello:
 *                - Crea dinámicamente un contenedor HTML oculto fuera de la vista.
 *                - Monta el componente `TabletContent` en dicho contenedor.
 *                - Espera a que el componente esté listo (promesa `domReady`).
 *                - Usa `html2canvas` para capturar el contenido renderizado como un canvas.
 *                - Convierte el canvas en una textura de Three.js (`CanvasTexture`).
 *                - Retorna un objeto con la textura y una función `cleanup` para desmontar
 *                  el componente y eliminar el contenedor del DOM.
 * PARÁMETROS:
 *   - No recibe parámetros explícitos, pero utiliza `screenWidth` y `screenHeight` definidos
 *     en ámbito.
 * RETORNO:
 *   - Objeto con propiedades:
 *       - `texture`: textura Three.js generada a partir del canvas.
 *       - `cleanup`: función para limpiar recursos (desmontar componente y remover contenedor).
 *   - Retorna `null` en caso de error.
 *****************************************************************************************/
async function renderScreenTexture() {
  const dpi = 100
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '-9999px'
  container.style.width = `${screenWidth * dpi}px`
  container.style.height = `${screenHeight * dpi}px`
  document.body.appendChild(container)

  // Create the app
  const app = createApp(TabletContent)
  const vm = app.mount(container)

  try {
    await vm.domReady
    const screenEl = vm.screen

    const canvas = await html2canvas(screenEl, {
      backgroundColor: null,
      scale: 2,
      width: container.clientWidth,
      height: container.clientHeight,
    })

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return {
      texture,
      cleanup: () => {
        app.unmount()
        document.body.removeChild(container)
      },
    }
  } catch (error) {
    console.error('Error creating texture:', error)
    app.unmount()
    document.body.removeChild(container)
    return null
  }
}
</script>

<style scoped>
.containerPrincipal {
  width: 100%;
  height: 100vh;
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none; /* ya lo hicimos antes */
}
</style>
