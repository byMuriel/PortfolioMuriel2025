// src/stores/useExperiences.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchExperiences } from '@/services/experiences';
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Error precargando ${url}`));
        img.src = url;
    });
}
const TTL_MS = 10 * 60 * 1000;
export const useExperiencesStore = defineStore('experiences', () => {
    const experiences = ref([]);
    const fetchedAt = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const isFresh = computed(() => fetchedAt.value !== null && Date.now() - (fetchedAt.value ?? 0) < TTL_MS);
    async function load(opts) {
        if (!opts?.force && isFresh.value && experiences.value.length)
            return;
        loading.value = true;
        error.value = null;
        try {
            experiences.value = await fetchExperiences(opts?.signal);
            fetchedAt.value = Date.now();
        }
        catch (e) {
            error.value = e?.message ?? 'Error loading Experiences';
            throw e;
        }
        finally {
            loading.value = false;
        }
    }
    async function preloadAssets() {
        await load();
        const urls = experiences.value
            .map((e) => e.logo_url)
            .filter((u) => !!u);
        await Promise.allSettled(urls.map(preloadImage));
    }
    return { experiences, loading, error, isFresh, load, preloadAssets };
});
