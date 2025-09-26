import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchSkills, type SkillDTO } from '@/services/skills'
import { fetchCategoryOrder } from '@/services/categories'

type SkillVM = { name: string; logo: string | null; categories: string[] }

function resolveLogo(raw: string | null) {
  if (!raw) return null
  if (raw.startsWith('/src/assets/images/SkillsLogos/')) {
    return raw.replace('/src/assets/images/SkillsLogos/', '/assets/SkillsLogos/')
  }
  return raw
}

const TTL_MS = 10 * 60 * 1000 // 10 minutos

export const useSkillsStore = defineStore('skills', () => {
  const apiSkills = ref<SkillDTO[] | null>(null)
  const orderedCategories = ref<string[] | null>(null)
  const fetchedAt = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isFresh = computed(() => {
    if (!fetchedAt.value) return false
    return Date.now() - fetchedAt.value < TTL_MS
  })

  const skills = computed<SkillVM[]>(() =>
    (apiSkills.value ?? []).map((s) => ({
      name: s.name,
      logo: resolveLogo(s.logo_url),
      categories: s.categories ?? [],
    })),
  )

  const uniqueCategories = computed<string[]>(() => {
    const count = new Map<string, number>()
    const firstIdx = new Map<string, number>()
    skills.value.forEach((s, i) => {
      new Set(s.categories).forEach((c) => {
        if (!firstIdx.has(c)) firstIdx.set(c, i)
        count.set(c, (count.get(c) ?? 0) + 1)
      })
    })
    const cats = Array.from(count.keys())
    cats.sort((a, b) => {
      const diff = (count.get(b) ?? 0) - (count.get(a) ?? 0)
      if (diff !== 0) return diff
      return (firstIdx.get(a) ?? 0) - (firstIdx.get(b) ?? 0)
    })
    return cats
  })

  const displayCategories = computed<string[]>(() =>
    orderedCategories.value && orderedCategories.value.length
      ? orderedCategories.value
      : uniqueCategories.value,
  )

  const groupedByCategory = computed<Record<string, SkillVM[]>>(() => {
    const groups: Record<string, SkillVM[]> = {}
    for (const s of skills.value) for (const c of s.categories) (groups[c] ??= []).push(s)
    return groups
  })

  function byCategory(cat: string) {
    return groupedByCategory.value[cat] ?? []
  }

  async function load(options?: { force?: boolean }) {
    if (!options?.force && isFresh.value && apiSkills.value && orderedCategories.value) return
    loading.value = true
    error.value = null
    try {
      // Haz ambas peticiones en paralelo
      const [skillsRes, catsRes] = await Promise.all([fetchSkills(), fetchCategoryOrder()])
      apiSkills.value = skillsRes
      orderedCategories.value = catsRes
      fetchedAt.value = Date.now()
    } catch (e: any) {
      error.value = e?.message ?? 'Error cargando skills'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    apiSkills,
    orderedCategories,
    fetchedAt,
    loading,
    error,
    // getters
    skills,
    uniqueCategories,
    displayCategories,
    groupedByCategory,
    byCategory,
    isFresh,
    // actions
    load,
  }
})
