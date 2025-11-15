// stores\useStateLikeDislikeProjects.ts
import { defineStore } from 'pinia';
export const useStateLikeDislikeProjects = defineStore('likes', {
    state: () => ({
        projectVotes: {},
        //   string === project index
        //   if (number === 0) console.log('Nada seleccionado')
        //   if (number === 1) console.log('👍 Like')
        //   if (number === 2) console.log('👎 Dislike')
        initialized: false,
    }),
    actions: {
        ensureInit(keys) {
            if (this.initialized)
                return;
            const base = {};
            keys.forEach((k) => {
                base[String(k)] = 0;
            });
            this.projectVotes = base;
            this.initialized = true;
        },
        setVote(projectIndex, value) {
            this.projectVotes[String(projectIndex)] = value;
        },
    },
});
