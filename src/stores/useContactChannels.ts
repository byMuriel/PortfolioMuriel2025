// src/stores/useContactChannels.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchContactChannels, type ContactChannelDTO } from '@/services/contactChannels'
import { fetchAppLogos } from '@/services/appLogos'

const TTL_MS = 10 * 60 * 1000

export const useContactChannelsStore = defineStore('contactChannels', () => {
  const channels = ref<ContactChannelDTO[]>([])
  const appLogoUrl = ref<string>('')
  const fetchedAt = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isFresh = computed(
    () => fetchedAt.value !== null && Date.now() - (fetchedAt.value ?? 0) < TTL_MS,
  )

  async function load(opts?: { appKey?: string; force?: boolean; signal?: AbortSignal }) {
    if (!opts?.force && isFresh.value && channels.value.length && appLogoUrl.value) return
    loading.value = true
    error.value = null
    try {
      // 1) canales
      channels.value = await fetchContactChannels(opts?.signal)

      // 2) logo de la app desde app_logos
      const appKey = opts?.appKey ?? 'contact'
      const logos = await fetchAppLogos(opts?.signal)
      const found = logos.find((l) => l.app_key === appKey)
      appLogoUrl.value = found?.logo_url ?? ''

      fetchedAt.value = Date.now()
    } catch (e: any) {
      error.value = e?.message ?? 'Error loading contact channels'
    } finally {
      loading.value = false
    }
  }

  const byCode = computed(() => {
    const map: Record<string, ContactChannelDTO> = {}
    for (const c of channels.value) map[c.code] = c
    return map
  })

  function getLinkByCode(code: string): string {
    return byCode.value[code]?.link ?? ''
  }

  return { channels, appLogoUrl, byCode, loading, error, isFresh, load, getLinkByCode }
})
