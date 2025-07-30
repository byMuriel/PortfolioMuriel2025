<!-- src/components/TabletScene.vue -->
<template>
  <div ref="container" class="containerPrincipal" style="width: 100%; height: 100vh"></div>
</template>

<script setup>
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { ref, onMounted, onBeforeUnmount, createApp } from 'vue'
import TabletContent from './TabletContent.vue'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import html2canvas from 'html2canvas'

const container = ref(null)
const isScreenOn = ref(false)

let renderer, scene, camera, animationId
let screenMaterial
const tabletGroup = new THREE.Group()

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

// Light variables / Variables de luz
let leftLight, centerLight, rightLight
const colorYellow = new THREE.Color(0xffc003) // Color amarillo
const colorWhite = new THREE.Color(0xfffcfe)
const colorCian = new THREE.Color(0x03eeff) // Color cian
const colorPink = new THREE.Color(0xff03b8) // Color rosa

// Variables para la animación
const startPos = new THREE.Vector3(-15, 30, 30) // Posición inicial
const endPos = new THREE.Vector3(0, 0, 20) // Posición final
const startFov = 75 // FOV inicial
const endFov = 35 // FOV final
let startTime = null
let rotationStartedAt = null

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
  addTopSpotLights()
  addPrincipalLights()
  renderer.render(scene, camera)
  startAnimation()
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
  // window.removeEventListener('keydown', handleKeyDown)
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

  // Camera / Cámara
  camera = new THREE.PerspectiveCamera(startFov, width / height, 0.1, 100)
  // camera.position.set(0, 0, 20)
  camera.position.set(-15, 30, 30)

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
  camera.lookAt(tabletGroup.position)
}
/*****************************************************************************************
 * FUNCTION: addTopSpotLights
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Adds three directional SpotLights to the top area of the scene to simulate
 *              dramatic lighting from different angles.
 *              Each light is positioned at a different horizontal point:
 *              - Left (white)
 *              - Center (white)
 *              - Right (white)
 *
 *              All lights are targeted at the tablet group and configured to cast shadows.
 *              Shadow rendering is enabled globally, and the tablet group is marked
 *              as both a shadow caster and receiver.
 *
 *              Lighting details include intensity, angle, penumbra, and decay to control
 *              realism and softness of shadows.
 *****************************************************************************************
 * DESCRIPCIÓN: Añade tres luces tipo SpotLight en la parte superior de la escena para
 *              simular una iluminación dramática desde distintos ángulos.
 *              Cada luz está ubicada en un punto horizontal distinto:
 *              - Izquierda (blanca)
 *              - Centro (blanca)
 *              - Derecha (blanca)
 *
 *              Todas las luces están dirigidas hacia el grupo de la tablet y configuradas
 *              para proyectar sombras. El renderizador habilita el uso de sombras y
 *              la tablet se marca como emisora y receptora de sombras.
 *
 *              Se ajustan propiedades como intensidad, ángulo, penumbra y decaimiento
 *              para lograr sombras suaves y realistas.
 *****************************************************************************************/
function addTopSpotLights() {
  const xlight = 50
  const ylight = 50
  const zlight = -40
  const lightIntensity = 300
  const lightDistance = 100
  const lightAngle = Math.PI // / 2 // 22.5 degrees
  const lightPenumbra = 1 // 0.2 // Suavizado de la luz
  const lightDecay = 1 // Decaimiento de la luz

  // Luz amarilla desde la parte superior izquierda
  // const leftLight = new THREE.SpotLight(0xffc003, lightIntensity, lightDistance, lightAngle, lightPenumbra, lightDecay); // Color amarillo
  leftLight = new THREE.SpotLight(
    colorWhite,
    lightIntensity,
    lightDistance,
    lightAngle,
    lightPenumbra,
    lightDecay,
  ) // Color amarillo
  leftLight.position.set(-xlight, 45, zlight) // Posición de la luz (arriba a la izquierda)
  leftLight.target = tabletGroup // Apunta hacia el cubo
  leftLight.castShadow = true // Habilitar sombras
  scene.add(leftLight)

  // Luz azul desde el centro superior
  // const centerLight = new THREE.SpotLight(0x1accd9, lightIntensity, lightDistance, lightAngle, lightPenumbra, lightDecay); // Color azul
  centerLight = new THREE.SpotLight(
    colorWhite,
    lightIntensity,
    lightDistance,
    lightAngle,
    lightPenumbra,
    lightDecay,
  ) // Color azul
  centerLight.position.set(0, ylight, zlight + -zlight) // Posición de la luz (centro superior)
  centerLight.target = tabletGroup // Apunta hacia el cubo
  centerLight.castShadow = true // Habilitar sombras
  scene.add(centerLight)

  // Luz rosa desde la parte superior derecha
  // const rightLight = new THREE.SpotLight(0xed0ca6, lightIntensity, lightDistance, lightAngle, lightPenumbra, lightDecay); // Ángulo estrecho y suavizado
  rightLight = new THREE.SpotLight(
    colorWhite,
    lightIntensity,
    lightDistance,
    lightAngle,
    lightPenumbra,
    lightDecay,
  ) // Ángulo estrecho y suavizado
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
 * DESCRIPTION: Adds general lighting to the 3D scene, including:
 *              - AmbientLight for uniform base illumination.
 *              - Two DirectionalLights simulating sunlight or daylight.
 *              - A focused SpotLight directed at a specific point (fixed target).
 *
 *              These lights are intended to provide consistent and realistic lighting
 *              across the entire scene and complement the SpotLights added elsewhere.
 *
 *              The fixed target helps direct the spotlight precisely onto the subject.
 *****************************************************************************************
 * DESCRIPCIÓN: Añade iluminación general a la escena 3D, incluyendo:
 *              - Luz ambiental (AmbientLight) para una iluminación base uniforme.
 *              - Dos luces direccionales (DirectionalLight) que simulan luz solar o natural.
 *              - Una luz puntual (SpotLight) dirigida a un punto específico (target fijo).
 *
 *              Estas luces están diseñadas para proporcionar una iluminación constante
 *              y realista a lo largo de toda la escena, complementando las luces superiores.
 *
 *              El objeto vacío como objetivo (fixed target) permite dirigir la luz
 *              puntual con mayor precisión hacia el elemento deseado.
 *****************************************************************************************/
function addPrincipalLights() {
  const colorLights = 0xffffff // White
  const lightIntensity = 800
  const lightDistance = 100
  const lightAngle = Math.PI / 4 // Degrees
  const lightPenumbra = 0.1 // Suavizado
  const lightDecay = 0.8 // Decaimiento

  // Illuminates the entire scene uniformly and without direction.
  // Ilumina toda la escena de manera uniforme y sin dirección.
  scene.add(new THREE.AmbientLight(colorLights, 0.4))

  // Simulates sunlight or daylight. / Simula luz solar o del día.
  const light = new THREE.DirectionalLight(colorLights, 50)
  light.position.set(5, 10, 7)

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
  scene.add(light)
}
/*****************************************************************************************
 * FUNCTION: animateTabletRotation
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Animates the rotation of the tablet around its Y-axis based on elapsed time.
 *              The rotation spans a full 360° turn (`2π` radians) over a given duration.
 *              The interpolation is linear and clamps at the end of the duration.
 *
 * PARAMETERS:
 *   - elapsedTime (Number): Total time passed since the animation started, in seconds.
 *   - durationRotation (Number): Duration of the rotation phase, in seconds.
 *****************************************************************************************
 * DESCRIPCIÓN: Anima la rotación de la tablet alrededor de su eje Y en función
 *              del tiempo transcurrido. La rotación abarca un giro completo de 360°
 *              (`2π` radianes) durante la duración establecida.
 *              La interpolación es lineal y se detiene al completar el tiempo.
 *
 * PARÁMETROS:
 *   - elapsedTime (Número): Tiempo total transcurrido desde el inicio de la animación, en segundos.
 *   - durationRotation (Número): Duración de la fase de rotación, en segundos.
 *****************************************************************************************/
function animateTabletRotation(elapsedTime, durationRotation) {
  const t = Math.min(elapsedTime / durationRotation, 1)
  // Medio giro (180°) en Y, interpolado
  tabletGroup.rotation.y = Math.PI * 2 * t
}
/*****************************************************************************************
 * FUNCTION: animateCameraZoom
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Animates the transition of the camera from a distant starting position and
 *              field of view (FOV) to a closer final position and FOV.
 *              This creates a zoom-in effect centered on the tablet over a fixed duration.
 *
 *              If the zoom delay has not yet elapsed, the function exits early.
 *              Otherwise, it interpolates both camera position and FOV based on progress.
 *              At the end of the animation, the camera is set exactly at the final state.
 *              The camera is updated and set to look at the tablet at each frame.
 *
 * PARAMETERS:
 *   - elapsedTime (Number): Time passed since the overall animation began, in seconds.
 *   - delay (Number): Time offset that delays the start of the zoom animation.
 *   - durationCameraZoom (Number): Duration of the zoom phase, in seconds.
 *****************************************************************************************
 * DESCRIPCIÓN: Anima la transición de la cámara desde una posición inicial lejana y un
 *              campo de visión amplio (FOV), hacia una posición más cercana y un FOV reducido.
 *              Esto genera un efecto de acercamiento centrado en la tablet durante un tiempo fijo.
 *
 *              Si aún no ha transcurrido el tiempo de espera (delay), la función no ejecuta nada.
 *              En caso contrario, interpola la posición de la cámara y el FOV según el progreso.
 *              Al finalizar, la cámara se ajusta exactamente al estado final.
 *              En cada frame, se actualiza la matriz de proyección y se orienta la cámara
 *              hacia la tablet.
 *
 * PARÁMETROS:
 *   - elapsedTime (Número): Tiempo transcurrido desde el inicio general de la animación, en segundos.
 *   - delay (Número): Tiempo de espera antes de comenzar la animación de zoom.
 *   - durationCameraZoom (Número): Duración de la fase de acercamiento, en segundos.
 *****************************************************************************************/
function animateCameraZoom(elapsedTime, delay, durationCameraZoom) {
  const cameraElapsedTime = elapsedTime - delay

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
 * FUNCTION: startAnimation
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Starts and manages a two-phase animation sequence for the 3D scene using
 *              `requestAnimationFrame`. The animation consists of:
 *              - Phase 1: A smooth rotation of the tablet (180° on Y-axis) over a defined duration.
 *              - Phase 2: A zoom-in camera animation that moves and adjusts the field of view
 *                         to focus on the tablet.
 *
 *              The loop updates both the rotation and camera animation based on elapsed time,
 *              rendering the scene at each frame to ensure smooth transitions.
 *
 *              On each frame:
 *              - Calculates elapsed time since animation started.
 *              - Performs tablet rotation if within the rotation phase.
 *              - Starts and executes camera zoom once rotation is complete.
 *              - Renders the updated scene from the camera’s perspective.
 *              - Requests the next frame if total animation duration has not been exceeded.
 *****************************************************************************************
 * DESCRIPCIÓN: Inicia y gestiona una secuencia de animación en dos fases para la escena 3D
 *              utilizando `requestAnimationFrame`. La animación consiste en:
 *              - Fase 1: Una rotación suave de la tablet (180° en el eje Y) durante una duración definida.
 *              - Fase 2: Una animación de zoom que mueve la cámara y ajusta el campo de visión
 *                        para enfocar la tablet.
 *
 *              El bucle actualiza tanto la rotación como la animación de cámara en función del
 *              tiempo transcurrido, renderizando la escena en cada fotograma para garantizar
 *              transiciones suaves.
 *
 *              En cada frame:
 *              - Calcula el tiempo transcurrido desde el inicio de la animación.
 *              - Ejecuta la rotación de la tablet si aún está dentro de la fase de rotación.
 *              - Inicia y ejecuta el zoom de cámara una vez finalizada la rotación.
 *              - Renderiza la escena actualizada desde la perspectiva de la cámara.
 *              - Solicita el siguiente frame si la duración total de la animación no se ha cumplido.
 *****************************************************************************************/
function startAnimation(time = 0) {
  if (startTime === null) startTime = time

  const durationRotation = 2.5 // segundos
  const durationCameraZoom = 1.8 // segundos
  const totalDuration = durationRotation + durationCameraZoom

  const elapsedTime = (time - startTime) / 1000

  animateTabletRotation(elapsedTime, durationRotation)
  if (rotationStartedAt === null) rotationStartedAt = elapsedTime
  animateCameraZoom(elapsedTime, rotationStartedAt, durationCameraZoom)

  renderer.render(scene, camera)

  if (elapsedTime < totalDuration) {
    requestAnimationFrame(startAnimation)
  }
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
// async function handleKeyDown(event) {
//   // try {
//   //   if (event.key === 'Enter') {
//   //     isScreenOn.value = !isScreenOn.value
//   //     if (isScreenOn.value) {
//   //       // Screen ON
//   //       const result = await renderScreenTexture()
//   //       const texture = result?.texture
//   //       const cleanup = result?.cleanup
//   //       if (texture) {
//   //         screenMaterial.map = texture
//   //         screenMaterial.color.setHex(0xffffff)
//   //         screenMaterial.transparent = true
//   //         screenMaterial.opacity = 0
//   //         screenMaterial.emissiveIntensity = 0
//   //         screenMaterial.needsUpdate = true
//   //         transitionTabletOn({
//   //           duration: 20,
//   //           screenMaterial,
//   //           onComplete: cleanup,
//   //         })
//   //       } else {
//   //         console.warn('Texture is null')
//   //       }
//   //     } else {
//   //       // Screen OFF
//   //       screenMaterial.map = null
//   //       screenMaterial.color.setHex(0x000000)
//   //       screenMaterial.emissiveIntensity = 0.3
//   //       screenMaterial.opacity = 0.7
//   //       screenMaterial.needsUpdate = true
//   //     }
//   //   }
//   // } catch (error) {
//   //   console.error('Error in handleKeyDown:', error)
//   // }
// }
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
// async function renderScreenTexture() {
//   const dpi = 100
//   const container = document.createElement('div')
//   container.style.position = 'absolute'
//   container.style.left = '-9999px'
//   container.style.top = '-9999px'
//   container.style.width = `${screenWidth * dpi}px`
//   container.style.height = `${screenHeight * dpi}px`
//   document.body.appendChild(container)

//   // Create the app
//   const app = createApp(TabletContent)
//   const vm = app.mount(container)

//   try {
//     await vm.domReady
//     const screenEl = vm.screen

//     const canvas = await html2canvas(screenEl, {
//       backgroundColor: null,
//       scale: 2,
//       width: container.clientWidth,
//       height: container.clientHeight,
//     })

//     const texture = new THREE.CanvasTexture(canvas)
//     texture.needsUpdate = true

//     return {
//       texture,
//       cleanup: () => {
//         app.unmount()
//         document.body.removeChild(container)
//       },
//     }
//   } catch (error) {
//     console.error('Error creating texture:', error)
//     app.unmount()
//     document.body.removeChild(container)
//     return null
//   }
// }
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
