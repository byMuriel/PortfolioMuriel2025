import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
/* -------------------------
   🔧 Ajuste de altura real
---------------------------- */
function setRealAppHeight() {
    // Usamos visualViewport si existe (mejor para barras que se esconden)
    const viewport = window.visualViewport;
    const height = viewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--app-height', `${height}px`);
}
// Escuchamos cambios reales del viewport
if (window.visualViewport) {
    ;
    window.visualViewport.addEventListener('resize', setRealAppHeight);
    window.visualViewport.addEventListener('scroll', setRealAppHeight);
}
window.addEventListener('orientationchange', setRealAppHeight);
setRealAppHeight();
/* ------------------------- */
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
