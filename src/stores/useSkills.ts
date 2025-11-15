// src/stores/useSkills.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchSkills, preloadImage, type SkillDTO } from '@/services/skills'

type SkillVM = { name: string; logo: string | null; categories: string[] }

function resolveLogo(raw: string | null) {
  if (!raw) return null
  // if (raw.startsWith('/src/assets/images/SkillsLogos/')) {
  //   return raw.replace('/src/assets/images/SkillsLogos/', '/assets/SkillsLogos/')
  // }
  return raw
}

const TTL_MS = 10 * 60 * 1000 // 10 min

export const useSkillsStore = defineStore('skills', () => {
  const apiSkills = ref<SkillDTO[] | null>(null)
  const fetchedAt = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isFresh = computed(() => !!fetchedAt.value && Date.now() - (fetchedAt.value ?? 0) < TTL_MS)

  const skills = computed<SkillVM[]>(() =>
    (apiSkills.value ?? []).map((s) => ({
      name: s.name,
      logo: resolveLogo(s.logo_url),
      categories: s.categories ?? [],
    })),
  )

  const groupedByCategory = computed<Record<string, SkillVM[]>>(() => {
    const groups: Record<string, SkillVM[]> = {}
    for (const s of skills.value) {
      for (const c of s.categories) (groups[c] ??= []).push(s)
    }
    return groups
  })

  const uniqueCategories = computed<string[]>(() => Object.keys(groupedByCategory.value))
  const displayCategories = computed<string[]>(() => uniqueCategories.value)

  function byCategory(cat: string) {
    return groupedByCategory.value[cat] ?? []
  }

  async function load(opts?: { force?: boolean }) {
    if (!opts?.force && isFresh.value && apiSkills.value) return
    loading.value = true
    error.value = null
    try {
      apiSkills.value = await fetchSkills()
      fetchedAt.value = Date.now()
    } catch (e: any) {
      error.value = e?.message ?? 'Error cargando skills'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function preloadAssets() {
    await load()
    const urls = skills.value.map((s) => s.logo || '').filter(Boolean) as string[]
    await Promise.all(urls.map(preloadImage))
  }

  return {
    // state
    apiSkills,
    fetchedAt,
    loading,
    error,

    // getters
    skills,
    groupedByCategory,
    uniqueCategories,
    displayCategories,
    byCategory,
    isFresh,

    // actions
    load,
    preloadAssets,
  }
})
