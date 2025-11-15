// src/stores/useSkills.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchSkills, preloadImage } from '@/services/skills';
function resolveLogo(raw) {
    if (!raw)
        return null;
    // if (raw.startsWith('/src/assets/images/SkillsLogos/')) {
    //   return raw.replace('/src/assets/images/SkillsLogos/', '/assets/SkillsLogos/')
    // }
    return raw;
}
const TTL_MS = 10 * 60 * 1000; // 10 min
export const useSkillsStore = defineStore('skills', () => {
    const apiSkills = ref(null);
    const fetchedAt = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const isFresh = computed(() => !!fetchedAt.value && Date.now() - (fetchedAt.value ?? 0) < TTL_MS);
    const skills = computed(() => (apiSkills.value ?? []).map((s) => ({
        name: s.name,
        logo: resolveLogo(s.logo_url),
        categories: s.categories ?? [],
    })));
    const groupedByCategory = computed(() => {
        const groups = {};
        for (const s of skills.value) {
            for (const c of s.categories)
                (groups[c] ??= []).push(s);
        }
        return groups;
    });
    const uniqueCategories = computed(() => Object.keys(groupedByCategory.value));
    const displayCategories = computed(() => uniqueCategories.value);
    function byCategory(cat) {
        return groupedByCategory.value[cat] ?? [];
    }
    async function load(opts) {
        if (!opts?.force && isFresh.value && apiSkills.value)
            return;
        loading.value = true;
        error.value = null;
        try {
            apiSkills.value = await fetchSkills();
            fetchedAt.value = Date.now();
        }
        catch (e) {
            error.value = e?.message ?? 'Error cargando skills';
            throw e;
        }
        finally {
            loading.value = false;
        }
    }
    async function preloadAssets() {
        await load();
        const urls = skills.value.map((s) => s.logo || '').filter(Boolean);
        await Promise.all(urls.map(preloadImage));
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
    };
});
