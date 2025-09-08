// src/stores/useRedirect.ts
import { defineStore } from 'pinia'

export type ScreenName =
  | 'Init'
  | 'About'
  | 'Experience'
  | 'Projects'
  | 'Contact'
  | 'ContactEmail'
  | 'Skills'
  | 'Blog'

export const useRedirectStore = defineStore('redirect', {
  state: () => ({
    current: 'Init' as ScreenName,
  }),

  actions: {
    set(view: ScreenName) {
      this.current = view
    },
    redirect(to: string) {
      switch (to) {
        case 'Init':
          this.current = 'Init'
          break
        case 'About':
          this.current = 'About'
          break
        case 'Skills':
          this.current = 'Skills'
          break
        case 'Experience':
          this.current = 'Experience'
          break
        case 'Projects':
          this.current = 'Projects'
          break
        case 'Contact':
          this.current = 'Contact'
          break
        case 'ContactEmail':
          console.log('ContactEmail2')
          this.current = 'ContactEmail'
          break
        default:
          this.current = 'Init'
      }
    },
  },
})
