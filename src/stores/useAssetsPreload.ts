// src/stores/useAssetsPreload.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { preloadImages } from '@/services/imagePreloader'

// Centraliza aquí las URLs (mismas que se precargan)
const ICONS = {
  about: 'https://murielvitale.com/assets/images/IconsApp/aboutIcon.png',
  projects: 'https://murielvitale.com/assets/images/IconsApp/projectsIcon.png',
  experience: 'https://murielvitale.com/assets/images/IconsApp/experienceIcon.png',
  skills: 'https://murielvitale.com/assets/images/IconsApp/skillsIcon.png',
  contact: 'https://murielvitale.com/assets/images/IconsApp/contactIcon.png',
  blog: 'https://murielvitale.com/assets/images/IconsApp/blogIcon.png',
  wallpaper: 'https://murielvitale.com/assets/images/IconsApp/init.png',
  contactwallpaper: 'https://murielvitale.com/assets/images/Wallpapers/contact.png',
  verify: 'https://murielvitale.com/assets/images/IconsApp/verification.png',
} as const

export const useAssetsPreload = defineStore('assetsPreload', () => {
  const initIconsReady = ref(false)
  const loading = ref(false)

  async function preloadInitIcons(): Promise<void> {
    if (initIconsReady.value || loading.value) return
    loading.value = true
    try {
      await preloadImages(Object.values(ICONS))
      initIconsReady.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    initIconsReady,
    loading,
    preloadInitIcons,
    icons: ICONS,
  }
})
