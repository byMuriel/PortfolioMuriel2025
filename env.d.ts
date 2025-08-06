/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  // Agrega aquí otras variables que uses, por ejemplo:
  // readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
