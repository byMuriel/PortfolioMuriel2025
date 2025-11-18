import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { provide, ref, onBeforeUnmount, onBeforeMount } from 'vue';
import { useAssetsPreload } from '@/stores/useAssetsPreload';
import TabletContent from './TabletContent.vue';
import { useAppLogosStore } from '@/stores/useAppLogos';
import { useAboutStore } from '@/stores/useAbout';
import { useSkillsStore } from '@/stores/useSkills';
import { useProjectsStore } from '@/stores/useProjects';
import { useExperiencesStore } from '@/stores/useExperiences';
import { useContactChannelsStore } from '@/stores/useContactChannels';
const assets = useAssetsPreload();
const appLogosStore = useAppLogosStore();
const aboutStore = useAboutStore();
const skillsStore = useSkillsStore();
const projectsStore = useProjectsStore();
const experiencesStore = useExperiencesStore();
const contactChannelsStore = useContactChannelsStore();
const isMobile = window.matchMedia('(max-width: 420px)').matches;
const isLoading = ref(true);
const showPreloader = ref(true);
const startContainer = ref(true);
const container = ref(null);
const showTabletContent = ref(false);
const overlayClass = ref('overlay overlay-shadow');
let renderer;
let scene;
let camera;
let screenMaterial = null;
let screen = null;
let animationId;
let overlayShown = false;
const tabletGroup = new THREE.Group();
// Dimensions and properties of the tablet / Dimensiones y propiedades de la tablet
const outerWidth = 8;
const outerHeight = 12;
const depthMarco = 0.2;
const depthBase = 0.6;
const horizontalThickness = 1.5; // top/bottom
const verticalThickness = 0.3;
const thickness = 0.3;
const screenWidth = outerWidth - thickness * 2;
const screenHeight = outerHeight - 2 - thickness * 2;
// Light variables / Variables de luz
let leftLight = null;
let centerLight = null;
let rightLight = null;
const colorWhite = 0xfffcfe;
// Variables para la animación
let startPos; // Posición inicial
let endPos; // Posición final  // Posición final
const startFov = 75; // FOV inicial
const endFov = 35; // FOV final
let startTime = null;
let rotationStartedAt = null;
// Animation
let durationRotation;
let durationCameraZoom;
let spin;
if (isMobile) {
    durationRotation = 1.8;
    durationCameraZoom = 1.6;
    spin = 0;
    startPos = new THREE.Vector3(-15, 30, 30);
    endPos = new THREE.Vector3(0, 0, 20);
}
else {
    durationRotation = 1.7;
    durationCameraZoom = 2.1;
    spin = 2;
    startPos = new THREE.Vector3(-15, 30, -30);
    endPos = new THREE.Vector3(0, 0, 20);
}
const totalDuration = durationRotation + durationCameraZoom;
const recorteTiempoParaMostrarLaPantalla = 1.7;
let endPos2 = null; // destino del segundo zoom (solo mobile)
let secondZoomTriggered = false;
let secondZoomStartedAt = null; // tiempo de inicio del segundo zoom
const mobileSecondZoomDuration = 0.3; // duración del segundo zoom
const mobileSecondZoomFov = 28; // FOV final en el segundo zoom
const mobileSecondZoomMargin = 0.6; // qué tan cerca de la pantalla
const data = ref({});
/*****************************************************************************************
 * FUNCTION: getScreenWorldPos
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Returns the world-space position of the center of the tablet's screen mesh.
 *              - Forces a matrix world update to ensure accurate transforms.
 *              - Applies the screen's world matrix to the local origin (0,0,0).
 * RETURNS: THREE.Vector3 → Center position of the screen in world coordinates.
 * ***************************************************************************************
 * DESCRIPCIÓN: Retorna la posición en coordenadas de mundo del centro del mesh de la pantalla.
 *              - Fuerza la actualización de la matriz de mundo para garantizar transformaciones correctas.
 *              - Aplica la matriz de mundo de la pantalla al origen local (0,0,0).
 * RETORNA: THREE.Vector3 → Posición central de la pantalla en coordenadas de mundo.
 *****************************************************************************************/
function getScreenWorldPos() {
    const p = new THREE.Vector3(0, 0, 0);
    screen.updateMatrixWorld(true);
    p.applyMatrix4(screen.matrixWorld);
    return p;
}
/*****************************************************************************************
 * FUNCTION: fitSceneForDevice
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Adjusts the final camera distance (endPos.z) to fit the tablet fully on screen,
 *              considering device aspect ratio and a configurable margin.
 *              - Computes the required distance using vertical FOV and tablet half-extents.
 *              - Chooses the max distance needed by width/height to avoid clipping.
 * PARAMETERS:
 *   - margin (Number, default: 1.15): Extra space multiplier to keep safe padding around the tablet.
 * ***************************************************************************************
 * DESCRIPCIÓN: Ajusta la distancia final de la cámara (endPos.z) para encuadrar la tablet
 *              completa en pantalla, considerando el aspect ratio del dispositivo y un margen.
 *              - Calcula la distancia requerida usando el FOV vertical y los semiejes de la tablet.
 *              - Toma la mayor distancia entre ancho/alto para evitar cortes.
 * PARÁMETROS:
 *   - margin (Número, por defecto: 1.15): Multiplicador de espacio extra como padding seguro.
 *****************************************************************************************/
function fitSceneForDevice(margin = 1.15) {
    if (!camera || !renderer)
        return;
    const aspect = window.innerWidth / window.innerHeight;
    const vFov = THREE.MathUtils.degToRad(endFov);
    const halfH = outerHeight / 2;
    const halfW = outerWidth / 2;
    const distHeight = halfH / Math.tan(vFov / 2);
    const distWidth = halfW / (Math.tan(vFov / 2) * aspect);
    const distance = Math.max(distHeight, distWidth) * margin;
    endPos.set(0, 0, distance);
}
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
function onPreloaderLeave() {
    showPreloader.value = false;
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
function start() {
    startContainer.value = false;
    startTime = null;
    rotationStartedAt = null;
    initScene();
    createRoomEnvironment();
    createTablet();
    fitSceneForDevice();
    addTopSpotLights();
    renderer.render(scene, camera);
    requestAnimationFrame(startAnimation);
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
function initScene() {
    // Create scene / Crear escena
    scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Camera / Cámara
    camera = new THREE.PerspectiveCamera(startFov, width / height, 0.1, 100);
    // camera.position.set(0, 0, 20)
    camera.position.set(-15, 30, 30);
    if (!container.value) {
        throw new Error('initScene: container no está montado');
    }
    // Renderer / Renderizador
    const colorFondo = '#000000'; // gris oscuro '#222222' // blanco 0xffffff
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: false, // activa para mantener el buffer
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(colorFondo);
    container.value.appendChild(renderer.domElement);
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
function createRoomEnvironment() {
    const roomSize = 100;
    const wallHeight = 100;
    const colorRoom = 0x126cfc; //azul  0x6f25f7 // morado 0x25e2f7 // cian
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: colorRoom,
    }); // 0x5043d9 }) // 0x6116c4 }) //
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -7;
    scene.add(floor);
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, wallHeight), new THREE.MeshStandardMaterial({ color: colorRoom }));
    backWall.position.set(0, wallHeight / 2 - 7, -roomSize / 2);
    scene.add(backWall);
    const frontWall = backWall.clone();
    frontWall.rotation.y = Math.PI;
    frontWall.position.z = roomSize / 2;
    scene.add(frontWall);
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, wallHeight), new THREE.MeshStandardMaterial({ color: colorRoom }));
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomSize / 2, wallHeight / 2 - 7, 0);
    scene.add(rightWall);
    const leftWall = rightWall.clone();
    leftWall.position.x = -roomSize / 2;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);
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
function createTablet() {
    // Tablet frame / Marco de la Tablet
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2,
    });
    const horizontal = new RoundedBoxGeometry(outerWidth - 0.2, horizontalThickness - 0.2, depthMarco, 5, 0.3);
    const vertical = new RoundedBoxGeometry(verticalThickness - 0.2, outerHeight - 0.2, depthMarco, 5, 0.3);
    const top = new THREE.Mesh(horizontal, frameMaterial);
    top.position.y = outerHeight / 2 - horizontalThickness / 2;
    const bottom = new THREE.Mesh(horizontal, frameMaterial);
    bottom.position.y = -(outerHeight / 2) + horizontalThickness / 2;
    const left = new THREE.Mesh(vertical, frameMaterial);
    left.position.x = -(outerWidth / 2) + verticalThickness / 2;
    const right = new THREE.Mesh(vertical, frameMaterial);
    right.position.x = outerWidth / 2 - verticalThickness / 2;
    tabletGroup.add(top, bottom, left, right);
    // Back Cover / Tapa trasera
    const backPlateGeometry = new RoundedBoxGeometry(outerWidth, outerHeight, depthBase, 5, 0.3);
    const backPlateMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2,
    });
    const backPlate = new THREE.Mesh(backPlateGeometry, backPlateMaterial);
    backPlate.position.z = -0.11;
    tabletGroup.add(backPlate);
    // Sunken screen / Pantalla hundida
    const screenGeometry = new RoundedBoxGeometry(screenWidth, screenHeight, depthMarco, 5, 0.3);
    screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        reflectivity: 1,
        transparent: true,
        opacity: 0.7,
    });
    screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.01;
    tabletGroup.add(screen);
    // Target for spotlight so lights point to a specific place
    // Target del spotlight para que las luces apunten a un lugar especifico
    const screenTarget = new THREE.Object3D();
    screenTarget.position.copy(screen.position);
    tabletGroup.add(screenTarget);
    scene.add(tabletGroup);
    if (isMobile) {
        tabletGroup.rotation.set(0, Math.PI, 0);
    }
    camera.lookAt(tabletGroup.position);
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
function addTopSpotLights() {
    const xlight = 30; //50
    const ylight = 30; // 50
    const zlight = -20; // -40
    const lightIntensity = 500; // 300
    const lightDistance = 100;
    const lightAngle = Math.PI / 12; // / 2 // 22.5 degrees
    const lightPenumbra = 0.2; // 1 // 0.2 // Suavizado de la luz
    const lightDecay = 2; // 1 // Decaimiento de la luz
    leftLight = new THREE.SpotLight(colorWhite, lightIntensity, lightDistance, lightAngle, lightPenumbra, lightDecay);
    leftLight.position.set(-xlight, 45, zlight); // Posición de la luz (arriba a la izquierda)
    leftLight.target = tabletGroup; // Apunta hacia el cubo
    leftLight.castShadow = true; // Habilitar sombras
    scene.add(leftLight);
    centerLight = new THREE.SpotLight(colorWhite, lightIntensity, lightDistance, lightAngle, lightPenumbra, lightDecay);
    centerLight.position.set(0, ylight, zlight + -zlight); // Posición de la luz (centro superior)
    centerLight.target = tabletGroup; // Apunta hacia el cubo
    // centerLight.castShadow = true // Habilitar sombras
    scene.add(centerLight);
    rightLight = new THREE.SpotLight(colorWhite, lightIntensity, lightDistance, lightAngle, lightPenumbra, lightDecay);
    rightLight.position.set(xlight, ylight, zlight); // Posición de la luz (arriba a la derecha)
    rightLight.target = tabletGroup; // Apunta hacia el cubo
    rightLight.castShadow = true; // Habilitar sombras
    scene.add(rightLight);
    // Configurar la sombra de las luces
    renderer.shadowMap.enabled = true; // Habilitar mapas de sombras en el renderizador
    // Hacer que el cubo pueda recibir sombras
    tabletGroup.receiveShadow = true;
    tabletGroup.castShadow = true;
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
function animateTabletRotation(elapsedTime, durationRotation) {
    const t = Math.min(elapsedTime / durationRotation, 1);
    tabletGroup.rotation.y = Math.PI * spin * t;
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
function animateCameraZoom(elapsedTime, delay, durationCameraZoom) {
    const cameraElapsedTime = elapsedTime - delay;
    if (cameraElapsedTime < 0)
        return;
    if (cameraElapsedTime < durationCameraZoom) {
        const t = cameraElapsedTime / durationCameraZoom;
        camera.position.lerpVectors(startPos, endPos, t);
        camera.fov = startFov + (endFov - startFov) * t;
    }
    else {
        camera.position.copy(endPos);
        camera.fov = endFov;
    }
    camera.updateProjectionMatrix();
    camera.lookAt(tabletGroup.position);
}
/*****************************************************************************************
 * FUNCTION: updateOverlayPosition
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Projects the tablet’s 3D screen mesh into 2D page coordinates and resizes
 *              the HTML overlay (#screen-overlay) accordingly.
 *              - Uses the renderer canvas bounding rect (`getBoundingClientRect`) to account
 *                for the canvas’ real position and size within the page.
 *              - Computes world coordinates for the center and two corners (top-left and
 *                bottom-right) of the 3D tablet screen mesh.
 *              - Projects those points with the active camera into normalized device space
 *                and converts them into pixel positions relative to the canvas.
 *              - Adjusts width/height with a margin to avoid clipping.
 *              - Updates the overlay element’s CSS (`left`, `top`, `width`, `height`) using
 *                page coordinates (rect.left/top + projected values).
 *              - Keeps the overlay centered with a `translate(-50%, -50%)` transform.
 *
 * NOTES:
 *   - This updated version fixes misalignments that occurred when switching tabs or when
 *     the canvas was not positioned at the top-left of the viewport.
 *   - Relies on up-to-date camera and screen world matrices; must be called after rendering
 *     or when the layout changes (resize/visibility).
 * ***************************************************************************************
 * DESCRIPCIÓN: Proyecta el mesh 3D de la pantalla de la tablet a coordenadas 2D de página
 *              y ajusta el overlay HTML (#screen-overlay) en consecuencia.
 *              - Usa el rectángulo del canvas (`getBoundingClientRect`) para tener en cuenta
 *                la posición y tamaño reales del canvas en la página.
 *              - Calcula coordenadas de mundo para el centro y dos esquinas (sup. izq. e
 *                inf. der.) de la pantalla 3D de la tablet.
 *              - Proyecta esos puntos con la cámara activa a espacio normalizado y los
 *                convierte a píxeles relativos al canvas.
 *              - Ajusta ancho/alto con un margen para evitar cortes.
 *              - Actualiza las propiedades CSS (`left`, `top`, `width`, `height`) del overlay
 *                usando coordenadas de página (rect.left/top + valores proyectados).
 *              - Mantiene el overlay centrado con `translate(-50%, -50%)`.
 *
 * NOTAS:
 *   - Esta versión corrige desalineaciones que ocurrían al cambiar de pestaña o cuando
 *     el canvas no estaba alineado al borde superior izquierdo del viewport.
 *   - Depende de que la cámara y la matriz de mundo de la pantalla estén actualizadas;
 *     debe llamarse después de renderizar o cuando cambie el layout (resize/visibility).
 *****************************************************************************************/
function updateOverlayPosition() {
    if (!screen || !camera || !renderer)
        return;
    // 1) Usa el rect real del canvas (posición y tamaño en la página)
    const rect = renderer.domElement.getBoundingClientRect();
    const widthHalf = rect.width / 2;
    const heightHalf = rect.height / 2;
    // 2) Proyecta centro y esquinas de la pantalla 3D
    const center = new THREE.Vector3(0, 0, 0);
    const topLeft = new THREE.Vector3(-screenWidth / 2, screenHeight / 2, 0);
    const bottomRight = new THREE.Vector3(screenWidth / 2, -screenHeight / 2, 0);
    screen.updateMatrixWorld();
    center.applyMatrix4(screen.matrixWorld).project(camera);
    topLeft.applyMatrix4(screen.matrixWorld).project(camera);
    bottomRight.applyMatrix4(screen.matrixWorld).project(camera);
    // 3) Convierte a píxeles relativos al canvas
    const cx = center.x * widthHalf + widthHalf;
    const cy = -center.y * heightHalf + heightHalf;
    const x1 = topLeft.x * widthHalf + widthHalf;
    const y1 = -topLeft.y * heightHalf + heightHalf;
    const x2 = bottomRight.x * widthHalf + widthHalf;
    const y2 = -bottomRight.y * heightHalf + heightHalf;
    const margin = 5;
    const pixelWidth = Math.max(0, Math.abs(x2 - x1) - margin);
    const pixelHeight = Math.max(0, Math.abs(y2 - y1) - 3 * margin);
    // 4) Posiciona el overlay en coordenadas de página sumando rect.left/top
    const overlay = document.getElementById('screen-overlay');
    if (overlay) {
        overlay.style.position = 'absolute';
        overlay.style.left = `${rect.left + cx}px`;
        overlay.style.top = `${rect.top + cy}px`;
        overlay.style.width = `${pixelWidth}px`;
        overlay.style.height = `${pixelHeight}px`;
        overlay.style.transform = 'translate(-50%, -50%)';
    }
}
/*****************************************************************************************
 * FUNCTION: updateOverlayMobilePosition
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Stretches the HTML overlay to cover the full viewport on mobile devices.
 *              - Positions overlay fixed at (0,0) and removes transforms.
 *              - Sets width/height to window dimensions.
 * ***************************************************************************************
 * DESCRIPCIÓN: Ajusta el overlay HTML para cubrir todo el viewport en dispositivos móviles.
 *              - Posiciona el overlay como fixed en (0,0) y elimina transforms.
 *              - Define ancho/alto iguales a las dimensiones de la ventana.
 *****************************************************************************************/
function updateOverlayMobilePosition() {
    const overlay = document.getElementById('screen-overlay');
    if (!overlay)
        return;
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    // Usamos la variable global que se actualiza con visualViewport
    overlay.style.height = 'var(--app-height)';
    overlay.style.transform = 'none';
}
/*****************************************************************************************
 * FUNCTION: animateSecondZoom
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Performs a short, secondary zoom-in (mobile only) from endPos to endPos2,
 *              while narrowing the camera FOV, then reveals the HTML overlay/content.
 *              - Interpolates camera position and FOV over a small duration.
 *              - Keeps camera looking at the tablet group.
 *              - When finished, triggers overlay sizing for mobile and shows content.
 * PARAMETERS:
 *   - elapsedTime (Number): Seconds since the intro animation started.
 * ***************************************************************************************
 * DESCRIPCIÓN: Ejecuta un segundo zoom corto (solo móvil) desde endPos a endPos2,
 *              ajustando el FOV, y luego muestra el overlay/contenido.
 *              - Interpola posición y FOV de la cámara en una duración breve.
 *              - Mantiene la cámara apuntando al grupo de la tablet.
 *              - Al finalizar, ajusta el overlay en móvil y muestra el contenido.
 * PARÁMETROS:
 *   - elapsedTime (Número): Segundos desde el inicio de la animación de introducción.
 *****************************************************************************************/
function animateSecondZoom(elapsedTime) {
    if (!endPos2)
        return;
    if (secondZoomStartedAt === null)
        return;
    const t = Math.min((elapsedTime - secondZoomStartedAt) / mobileSecondZoomDuration, 1);
    const from = endPos;
    const to = endPos2;
    camera.position.lerpVectors(from, to, t);
    camera.fov = endFov + (mobileSecondZoomFov - endFov) * t;
    camera.updateProjectionMatrix();
    camera.lookAt(tabletGroup.position);
    if (isMobile && t >= 1 && !overlayShown) {
        setTimeout(() => {
            updateOverlayMobilePosition();
            showTabletContent.value = true;
            overlayShown = true;
        }, 400);
    }
}
/*****************************************************************************************
 * FUNCTION: startAnimation
 * AUTHOR: Muriel Vitale.
 * DESCRIPTION: Main animation loop that orchestrates the tablet’s entry animation sequence.
 *              - Records the initial start time on the first call.
 *              - Calculates elapsed time since the beginning.
 *              - Animates the tablet’s Y-axis rotation during the first `durationRotation` seconds.
 *              - Animates the camera zoom-in towards the tablet.
 *              - On desktop: triggers the HTML overlay slightly before the end of the intro
 *                and continuously reprojects its position every frame to keep it aligned.
 *              - On mobile: launches a secondary short zoom (`animateSecondZoom`) before
 *                showing the overlay and content.
 *              - Renders the current frame of the scene on each iteration.
 *              - Performs a final overlay reposition at the end of the animation for safety.
 *              - Continues requesting animation frames until both the intro and (if mobile)
 *                the secondary zoom are fully completed.
 *
 * NOTES:
 *   - `overlayShown` prevents multiple overlay updates.
 *   - `recorteTiempoParaMostrarLaPantalla` is a time offset to reveal content slightly earlier.
 *   - On desktop, `updateOverlayPosition()` is now called every frame to avoid misalignment
 *     when switching tabs or during animation pauses.
 * ***************************************************************************************
 * DESCRIPCIÓN: Bucle principal de animación que orquesta la secuencia de entrada de la tablet.
 *              - Registra el tiempo de inicio en la primera llamada.
 *              - Calcula el tiempo transcurrido desde el inicio.
 *              - Anima la rotación sobre el eje Y de la tablet durante los primeros
 *                `durationRotation` segundos.
 *              - Anima el zoom de la cámara hacia la tablet.
 *              - En escritorio: dispara el overlay HTML antes de finalizar la intro
 *                y reproyecta su posición en cada frame para mantenerlo alineado.
 *              - En móvil: ejecuta un segundo zoom corto (`animateSecondZoom`) antes de mostrar
 *                el overlay y el contenido.
 *              - Renderiza la escena en cada iteración.
 *              - Realiza un ajuste final de la posición del overlay al finalizar la animación.
 *              - Solicita nuevos frames hasta completar la intro y, en caso de móvil,
 *                también el segundo zoom.
 *
 * NOTAS:
 *   - `overlayShown` evita múltiples actualizaciones del overlay.
 *   - `recorteTiempoParaMostrarLaPantalla` adelanta la aparición del contenido.
 *   - En escritorio, ahora `updateOverlayPosition()` se invoca en cada frame para prevenir
 *     desalineaciones al cambiar de pestaña o si se pausa la animación.
 *****************************************************************************************/
function startAnimation(time) {
    if (startTime === null)
        startTime = time;
    const elapsedTime = (time - startTime) / 1000;
    // 1) Rotación + primer zoom
    animateTabletRotation(elapsedTime, durationRotation);
    if (rotationStartedAt === null)
        rotationStartedAt = elapsedTime;
    animateCameraZoom(elapsedTime, rotationStartedAt, durationCameraZoom);
    // 2) Disparo de overlay y segundo zoom (solo mobile)
    if (!overlayShown && elapsedTime > totalDuration - recorteTiempoParaMostrarLaPantalla) {
        if (!isMobile) {
            // proyección inicial y muestra del contenido en desktop
            updateOverlayPosition();
            showTabletContent.value = true;
            overlayShown = true;
        }
        else if (!secondZoomTriggered) {
            const p = getScreenWorldPos();
            endPos2 = new THREE.Vector3(p.x, p.y, p.z + mobileSecondZoomMargin);
            secondZoomStartedAt = elapsedTime;
            secondZoomTriggered = true;
        }
    }
    // 3) Segundo zoom (si está activo - mobile)
    if (isMobile && secondZoomTriggered && endPos2) {
        animateSecondZoom(elapsedTime);
    }
    // 4) Render SIEMPRE al final
    if (!renderer || !scene || !camera) {
        animationId = requestAnimationFrame(startAnimation);
        return;
    }
    renderer.render(scene, camera);
    // ➜ Reproyecta el overlay en cada frame (desktop)
    if (!isMobile && overlayShown) {
        updateOverlayPosition();
    }
    // 5) Condición de loop
    const stillInIntro = elapsedTime < totalDuration;
    const inSecondZoom = isMobile &&
        secondZoomTriggered &&
        secondZoomStartedAt !== null &&
        elapsedTime - secondZoomStartedAt < mobileSecondZoomDuration;
    if (stillInIntro || inSecondZoom) {
        animationId = requestAnimationFrame(startAnimation);
    }
    else {
        // Animación terminó: última proyección de seguridad (desktop)
        if (!isMobile) {
            updateOverlayPosition();
            setTimeout(updateOverlayPosition, 0);
        }
    }
}
onBeforeMount(async () => {
    await Promise.all([
        assets.preloadInitIcons(),
        appLogosStore.preloadAssets(),
        aboutStore.preloadAssets(),
        skillsStore.preloadAssets(),
        projectsStore.preloadAssets(),
        experiencesStore.preloadAssets(),
        contactChannelsStore.load(),
        new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            }
            else {
                window.addEventListener('load', () => resolve(), { once: true });
            }
        }),
    ]);
    isLoading.value = false;
    showPreloader.value = false;
});
onBeforeUnmount(() => {
    if (animationId !== undefined)
        cancelAnimationFrame(animationId);
    renderer?.dispose();
    const el = container.value;
    if (el && renderer?.domElement && renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement);
    }
});
provide('data', data);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['startButton']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot1']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot2']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot3']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot4']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot5']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot6']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot7']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onAfterLeave': {} },
    name: "preloader-fade",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onAfterLeave': {} },
    name: "preloader-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
const __VLS_6 = ({ afterLeave: {} },
    { onAfterLeave: (__VLS_ctx.onPreloaderLeave) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[onPreloaderLeave,];
if (__VLS_ctx.showPreloader) {
    // @ts-ignore
    [showPreloader,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "preloader" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "preloader-inner" },
        ...{ class: ({ 'fade-out-dots': !__VLS_ctx.isLoading }) },
    });
    // @ts-ignore
    [isLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "dot-loader" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "dot dot1" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "dot dot2" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "dot dot3" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "dot dot4" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "dot dot5" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "dot dot6" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "dot dot7" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "loading-text" },
    });
}
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "container",
    ...{ class: "containerPrincipal" },
    ...{ style: {} },
});
/** @type {typeof __VLS_ctx.container} */ ;
// @ts-ignore
[container,];
if (!__VLS_ctx.showPreloader && __VLS_ctx.startContainer) {
    // @ts-ignore
    [showPreloader, startContainer,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "start-screen" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.start) },
        ...{ class: "startButton" },
    });
    // @ts-ignore
    [start,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    id: "screen-overlay",
    ...{ class: (__VLS_ctx.overlayClass) },
});
// @ts-ignore
[overlayClass,];
const __VLS_8 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    name: "fade",
    appear: true,
}));
const __VLS_10 = __VLS_9({
    name: "fade",
    appear: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_12 } = __VLS_11.slots;
if (__VLS_ctx.showTabletContent) {
    // @ts-ignore
    [showTabletContent,];
    /** @type {[typeof TabletContent, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(TabletContent, new TabletContent({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['preloader']} */ ;
/** @type {__VLS_StyleScopedClasses['preloader-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-out-dots']} */ ;
/** @type {__VLS_StyleScopedClasses['dot-loader']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot1']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot2']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot3']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot4']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot5']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot6']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot7']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
/** @type {__VLS_StyleScopedClasses['containerPrincipal']} */ ;
/** @type {__VLS_StyleScopedClasses['start-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['startButton']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        TabletContent: TabletContent,
        isLoading: isLoading,
        showPreloader: showPreloader,
        startContainer: startContainer,
        container: container,
        showTabletContent: showTabletContent,
        overlayClass: overlayClass,
        onPreloaderLeave: onPreloaderLeave,
        start: start,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */
