// src/stores/useContactChannels.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchContactChannels } from '@/services/contactChannels';
import { fetchAppLogos } from '@/services/appLogos';
const TTL_MS = 10 * 60 * 1000;
export const useContactChannelsStore = defineStore('contactChannels', () => {
    const channels = ref([]);
    const appLogoUrl = ref('');
    const fetchedAt = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const isFresh = computed(() => fetchedAt.value !== null && Date.now() - (fetchedAt.value ?? 0) < TTL_MS);
    async function load(opts) {
        if (!opts?.force && isFresh.value && channels.value.length && appLogoUrl.value)
            return;
        loading.value = true;
        error.value = null;
        try {
            // 1) canales
            channels.value = await fetchContactChannels(opts?.signal);
            // 2) logo de la app desde app_logos
            const appKey = opts?.appKey ?? 'contact';
            const logos = await fetchAppLogos(opts?.signal);
            const found = logos.find((l) => l.app_key === appKey);
            appLogoUrl.value = found?.logo_url ?? '';
            fetchedAt.value = Date.now();
        }
        catch (e) {
            error.value = e?.message ?? 'Error loading contact channels';
        }
        finally {
            loading.value = false;
        }
    }
    const byCode = computed(() => {
        const map = {};
        for (const c of channels.value)
            map[c.code] = c;
        return map;
    });
    function getLinkByCode(code) {
        return byCode.value[code]?.link ?? '';
    }
    return { channels, appLogoUrl, byCode, loading, error, isFresh, load, getLinkByCode };
});
