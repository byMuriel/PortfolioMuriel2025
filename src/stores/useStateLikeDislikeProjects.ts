// stores\useStateLikeDislikeProjects.ts
import { defineStore } from 'pinia'

export const useStateLikeDislikeProjects = defineStore('likes', {
  state: () => ({
    projectVotes: {} as Record<string, number>,
    //   string === project index
    //   if (number === 0) console.log('Nada seleccionado')
    //   if (number === 1) console.log('👍 Like')
    //   if (number === 2) console.log('👎 Dislike')
  }),
  actions: {
    initVotes(initial: Record<string, number>) {
      this.projectVotes = { ...initial }
    },
    setVote(projectIndex: string | number, value: number) {
      this.projectVotes[String(projectIndex)] = value
    },
  },
})
