<template>
  <div class="scene-wrapper">
    <!-- Preloader -->
    <div v-if="showPreloader" :class="['preloader', { 'fade-out-bg': !isLoading }]">
      <div class="preloader-content" :class="{ 'fade-out-content': !isLoading }">
        <div class="spinner"></div>
        <p class="loading-text">Cargando...</p>
      </div>
    </div>

    <!-- Initial Scene -->
    <div ref="sceneContainer" class="scene-container">
      <!-- Tablet -->
      <Teleport to="body">
        <TabletContent
          v-if="showTabletContent"
          :x="screenPosition.x"
          :y="screenPosition.y"
          :width="screenSize.width"
          :height="screenSize.height"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import woodTextureURL from '@/assets/textures/wood-cartoon.jpg'
import TabletContent from './TabletContent.vue'
const showTabletContent = ref(false)

const sceneContainer = ref(null)
const isLoading = ref(true)
const showPreloader = ref(true)
const screenWidth = window.innerWidth

let scene, camera, renderer, animationId
let table
let tabletGroup = new THREE.Group()
let raycaster = new THREE.Raycaster()
let pointer = new THREE.Vector2()

const zoomDuration = 1.2
let zoomProgress = 0
let isZoomed = false
let initialFrustum = {}
let finalFrustum = {}

let transitionStep = 0
let targetTabletRotation = THREE.MathUtils.degToRad(-0.9)
let targetTabletPosition

let originalCameraPos, targetCameraPos
let originalLookAt = new THREE.Vector3(0, 0, 0)
let targetLookAt = new THREE.Vector3()

const screenPosition = ref({ x: 0, y: 0 })
const screenSize = ref({ width: 0, height: 0 })

function updateScreenPosition() {
  const screenCenter = tabletGroup.position.clone()
  screenCenter.y += 0.31

  const projected = screenCenter.project(camera)
  const canvasRect = renderer.domElement.getBoundingClientRect()
  let xValue

  if (screenWidth <= 480) {
    xValue = canvasRect.width / 2 - 3.5
  } else if (screenWidth <= 768) {
    xValue = canvasRect.width / 2 - 5
  } else if (screenWidth <= 1024) {
    xValue = canvasRect.width / 2 - 10
  } else {
    xValue = canvasRect.width / 2 - 17
  }

  screenPosition.value = {
    x: xValue,
    y: canvasRect.top + ((1 - projected.y) / 2) * canvasRect.height,
  }

  const scaleX = canvasRect.width / (camera.right - camera.left)
  const scaleY = canvasRect.height / (camera.top - camera.bottom)

  screenSize.value = {
    width: 8.5 * scaleX,
    height: 11.5 * scaleY,
  }
}

const init = async () => {
  const width = sceneContainer.value.clientWidth
  const height = sceneContainer.value.clientHeight
  const aspect = width / height

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9f9f9)

  // UBICACIÓN DE LA CÁMARA
  camera = new THREE.OrthographicCamera(-aspect * 10, aspect * 10, 10, -10, 0.1, 100)
  camera.position.set(0, 20, 0)
  camera.lookAt(0, -0.5, 0)
  originalCameraPos = camera.position.clone()
  targetCameraPos = new THREE.Vector3()
  initialFrustum = {
    top: 10,
    bottom: -10,
    left: -aspect * 10,
    right: aspect * 10,
  }

  if (screenWidth <= 480) {
    finalFrustum = {
      top: 11,
      bottom: -11,
      left: -aspect * 11,
      right: aspect * 11,
    }
  } else {
    finalFrustum = {
      top: 7,
      bottom: -7,
      left: -aspect * 7,
      right: aspect * 7,
    }
  }

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  sceneContainer.value.appendChild(renderer.domElement)

  // Luces
  renderer.toneMappingExposure = 1.6
  scene.add(new THREE.AmbientLight(0xffffff, 1))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(0, 10, 10)
  dirLight.target.position.set(0, 0, 0)
  dirLight.castShadow = true

  //dirLight.shadow.mapSize.set(1024, 1024)
  dirLight.shadow.bias = -0.001
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048

  scene.add(dirLight)

  // Mesa (fondo fijo)
  const textureLoader = new THREE.TextureLoader()
  const woodTexture = textureLoader.load(woodTextureURL)
  woodTexture.wrapS = THREE.RepeatWrapping
  woodTexture.wrapT = THREE.RepeatWrapping
  woodTexture.repeat.set(4, 4)
  woodTexture.rotation = Math.PI / 2
  woodTexture.center.set(0.5, 0.5)
  const visibleWidth = initialFrustum.right - initialFrustum.left * 2
  const visibleHeight = initialFrustum.top - initialFrustum.bottom * 2
  const tableGeometry = new THREE.PlaneGeometry(visibleWidth, visibleHeight)
  const tableMaterial = new THREE.MeshBasicMaterial({ map: woodTexture })
  table = new THREE.Mesh(tableGeometry, tableMaterial)
  table.rotation.x = -Math.PI / 2
  table.position.y = -0.05
  table.receiveShadow = true
  scene.add(table)

  // Tablet negra (pantalla base)
  scene.add(tabletGroup)
  const screenGeometry = new RoundedBoxGeometry(9, 0.3, 13.5, 8, 0.4)
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.35,
    metalness: 0.3,
  })
  const screen = new THREE.Mesh(screenGeometry, screenMaterial)
  screen.position.set(-10, 0.15, 0)
  ///////
  screen.castShadow = true
  screen.receiveShadow = true
  ///////

  // Marco blanco hueco
  const outerWidth = 9
  const outerHeight = 13.5
  const innerWidth = 8.5
  const innerHeight = 11.5

  const shape = new THREE.Shape()
  shape.moveTo(-outerWidth / 2, -outerHeight / 2)
  shape.lineTo(-outerWidth / 2, outerHeight / 2)
  shape.lineTo(outerWidth / 2, outerHeight / 2)
  shape.lineTo(outerWidth / 2, -outerHeight / 2)
  shape.lineTo(-outerWidth / 2, -outerHeight / 2)

  const hole = new THREE.Path()
  hole.moveTo(-innerWidth / 2, -innerHeight / 2)
  hole.lineTo(-innerWidth / 2, innerHeight / 2)
  hole.lineTo(innerWidth / 2, innerHeight / 2)
  hole.lineTo(innerWidth / 2, -innerHeight / 2)
  hole.lineTo(-innerWidth / 2, -innerHeight / 2)
  shape.holes.push(hole)

  const frameGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 10,
    bevelEnabled: false,
  })
  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.99,
    reflectivity: 1,
    clearcoat: 1,
  })

  const frame = new THREE.Mesh(frameGeometry, frameMaterial)
  frame.rotation.x = -Math.PI / 2
  frame.position.set(-10, 0.31, 0)
  ////////////////
  frame.castShadow = true
  frame.receiveShadow = true
  ////////////////

  tabletGroup.add(screen)
  tabletGroup.add(frame)

  let initialTabletX
  let initialTabletRotation

  if (screenWidth <= 480) {
    console.log('480')
    // teléfonos pequeños probado
    initialTabletX = 6
    initialTabletRotation = 25
  } else if (screenWidth <= 768) {
    console.log('768')
    // teléfonos grandes probado
    initialTabletX = 6
    initialTabletRotation = 35
  } else if (screenWidth <= 1024) {
    console.log('1024')
    // tablets probado
    initialTabletX = 5
    initialTabletRotation = 35
  } else {
    console.log('else')
    // pantallas grandes probado
    initialTabletX = -1
    initialTabletRotation = 35
  }

  tabletGroup.position.set(initialTabletX, 0.15, 0)
  // initialTabletRotation = -35 // o el ángulo que estés usando, pero en negativo

  tabletGroup.rotation.y = THREE.MathUtils.degToRad(initialTabletRotation)
  renderer.domElement.addEventListener('click', onClick)
  animate()
}

const onClick = (event) => {
  console.log('entraste onClick')
  const rect = renderer.domElement.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 0 && !isZoomed) {
    console.log('entraste if (intersects.length > 0 && !isZoomed) ')
    transitionStep = 1
    zoomProgress = 0
    isZoomed = true

    targetCameraPos.set(0, 14, 0)
    targetLookAt.set(0, 0, 0)
  }
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const animate = () => {
  updateScreenPosition()
  animationId = requestAnimationFrame(animate)

  if (transitionStep === 1) {
    // ROTAR
    tabletGroup.rotation.y = THREE.MathUtils.lerp(
      tabletGroup.rotation.y,
      targetTabletRotation,
      0.05,
    )
    if (Math.abs(tabletGroup.rotation.y - targetTabletRotation) < 0.01) {
      tabletGroup.rotation.y = targetTabletRotation
      transitionStep = 2
    }

    // MOVER AL CENTRO
    const centerX = 10
    const centerZ = (camera.top + camera.bottom) / 2

    targetTabletPosition = new THREE.Vector3(centerX, 0.15, centerZ)

    tabletGroup.position.lerp(targetTabletPosition, 0.05)
    if (tabletGroup.position.distanceTo(targetTabletPosition) < 0.01) {
      tabletGroup.position.copy(targetTabletPosition)
      transitionStep = 3
    }

    // ZOOM
    zoomProgress += 1 / 60
    const t = Math.min(zoomProgress / zoomDuration, 1)
    const eased = easeOutCubic(t)
    const currentCamPos = new THREE.Vector3().lerpVectors(originalCameraPos, targetCameraPos, eased)
    camera.position.copy(currentCamPos)
    const currentLook = new THREE.Vector3().lerpVectors(originalLookAt, targetLookAt, eased)
    camera.lookAt(currentLook)
    camera.top = THREE.MathUtils.lerp(initialFrustum.top, finalFrustum.top, eased)
    camera.bottom = THREE.MathUtils.lerp(initialFrustum.bottom, finalFrustum.bottom, eased)
    camera.left = THREE.MathUtils.lerp(initialFrustum.left, finalFrustum.left, eased)
    camera.right = THREE.MathUtils.lerp(initialFrustum.right, finalFrustum.right, eased)
    camera.updateProjectionMatrix()

    if (t === 1) {
      transitionStep = 0
      showTabletContent.value = true
    }
  }

  table.position.x = camera.position.x
  table.position.z = camera.position.z

  renderer.render(scene, camera)
}

onMounted(async () => {
  await init()
  setTimeout(() => {
    isLoading.value = false
    setTimeout(() => {
      showPreloader.value = false
    }, 800)
  }, 500)
})

onBeforeUnmount(() => {
  cancelAnimationId(animationId)
  window.removeEventListener('resize', onWindowResize)
  renderer.dispose()
  renderer.domElement.removeEventListener('click', onClick)
})

const onWindowResize = () => {
  const width = sceneContainer.value.clientWidth
  const height = sceneContainer.value.clientHeight
  const aspect = width / height

  camera.left = -aspect * 10
  camera.right = aspect * 10
  camera.top = 10
  camera.bottom = -10
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
}
</script>

<style scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

.scene-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: pointer;
}

.preloader {
  position: absolute;
  inset: 0;
  background: #263238;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-family: sans-serif;
  transition: background-color 0.4s ease;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #afb42b;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  font-size: 1.2rem;
  color: #c0ca33;
}

.fade-out-content {
  animation: fadeOutContent 0.4s ease forwards;
}

@keyframes fadeOutContent {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
}

.fade-out-bg {
  animation: fadeOutBG 0.5s ease 0.3s forwards;
}

@keyframes fadeOutBG {
  0% {
    opacity: 1;
    background-color: #263238;
  }
  100% {
    opacity: 0;
    background-color: #263238;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
