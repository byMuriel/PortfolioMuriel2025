// src/stores/useProjects.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchProjects, preloadImage, type ProjectDTO } from '@/services/projects'

const TTL_MS = 10 * 60 * 1000

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<ProjectDTO[]>([])
  const fetchedAt = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isFresh = computed(
    () => fetchedAt.value !== null && Date.now() - (fetchedAt.value ?? 0) < TTL_MS,
  )

  const byId = computed<Record<string, ProjectDTO>>(() =>
    Object.fromEntries(projects.value.map((p, i) => [String(i), p])),
  )

  async function load(opts?: { force?: boolean; signal?: AbortSignal }) {
    if (!opts?.force && isFresh.value && projects.value.length) return
    loading.value = true
    error.value = null
    try {
      projects.value = await fetchProjects(opts?.signal)
      fetchedAt.value = Date.now()
    } catch (e: any) {
      error.value = e?.message ?? 'Error loading Projects'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function preloadAssets() {
    await load()
    const urls = projects.value
      .flatMap((p) => (Array.isArray(p.image) ? p.image : Object.values(p.image || {})))
      .filter(Boolean)
    await Promise.all(urls.map(preloadImage))
  }

  return { projects, byId, loading, error, isFresh, load, preloadAssets }
})
