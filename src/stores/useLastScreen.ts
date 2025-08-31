// src/stores/useLastSreen.ts
import { defineStore } from 'pinia'

export type ScreenName =
  | 'Init'
  | 'About'
  | 'Skills'
  | 'Experience'
  | 'Projects'
  | 'Contact'
  | 'Blog'

export const useLastScreen = defineStore('lastScreen', {
  state: () => ({
    lastScreen: 'Init' as ScreenName,
  }),
  actions: {
    changeLastScreen(screen: ScreenName) {
      this.lastScreen = screen
    },
  },
})
