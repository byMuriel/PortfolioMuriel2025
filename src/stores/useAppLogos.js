// src/stores/useAppLogos.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchAppLogos, preloadImage } from '@/services/appLogos';
const TTL_MS = 10 * 60 * 1000; // igual que el resto
export const useAppLogosStore = defineStore('appLogos', () => {
    const logos = ref({});
    const fetchedAt = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const isFresh = computed(() => fetchedAt.value !== null && Date.now() - (fetchedAt.value ?? 0) < TTL_MS);
    async function load(opts) {
        if (!opts?.force && isFresh.value && Object.keys(logos.value).length)
            return;
        loading.value = true;
        error.value = null;
        try {
            const data = await fetchAppLogos(opts?.signal);
            const map = {};
            for (const item of data) {
                if (item.logo_url)
                    map[item.app_key] = item.logo_url;
            }
            logos.value = map;
            fetchedAt.value = Date.now();
        }
        catch (e) {
            error.value = e?.message ?? 'Error loading app logos';
            throw e;
        }
        finally {
            loading.value = false;
        }
    }
    async function preloadAssets() {
        await load();
        const urls = Object.values(logos.value).filter(Boolean);
        await Promise.allSettled(urls.map(preloadImage));
    }
    function getLogo(key) {
        return logos.value[key] || '';
    }
    return { logos, loading, error, load, preloadAssets, getLogo };
});
