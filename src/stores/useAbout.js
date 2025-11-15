// src\stores\useAbout.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchAbout, preloadImage } from '@/services/about';
export const useAboutStore = defineStore('about', () => {
    const about = ref(null);
    const fetchedAt = ref(null);
    const loading = ref(false);
    const TTL_MS = 10 * 60 * 1000;
    const isFresh = computed(() => fetchedAt.value !== null && Date.now() - fetchedAt.value < TTL_MS);
    async function load(opts) {
        if (!opts?.force && isFresh.value && about.value)
            return;
        loading.value = true;
        try {
            about.value = await fetchAbout();
            fetchedAt.value = Date.now();
        }
        finally {
            loading.value = false;
        }
    }
    async function preloadAssets() {
        await load();
        if (!about.value)
            return;
        const urls = [about.value.logo, about.value.img, about.value.fondo].filter(Boolean);
        await Promise.all(urls.map(preloadImage));
    }
    return { about, load, preloadAssets, isFresh };
});
