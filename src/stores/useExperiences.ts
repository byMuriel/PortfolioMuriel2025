// src/stores/useExperiences.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchExperiences, type ExperienceDTO } from '@/services/experiences'

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Error precargando ${url}`))
    img.src = url
  })
}

const TTL_MS = 10 * 60 * 1000

export const useExperiencesStore = defineStore('experiences', () => {
  const experiences = ref<ExperienceDTO[]>([])
  const fetchedAt = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isFresh = computed(
    () => fetchedAt.value !== null && Date.now() - (fetchedAt.value ?? 0) < TTL_MS,
  )

  async function load(opts?: { force?: boolean; signal?: AbortSignal }) {
    if (!opts?.force && isFresh.value && experiences.value.length) return
    loading.value = true
    error.value = null
    try {
      experiences.value = await fetchExperiences(opts?.signal)
      fetchedAt.value = Date.now()
    } catch (e: any) {
      error.value = e?.message ?? 'Error loading Experiences'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function preloadAssets() {
    await load()
    const urls = experiences.value
      .map((e) => (e as any).logo_url as string | undefined)
      .filter((u): u is string => !!u)
    await Promise.allSettled(urls.map(preloadImage))
  }

  return { experiences, loading, error, isFresh, load, preloadAssets }
})
