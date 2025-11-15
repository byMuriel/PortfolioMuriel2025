// src/stores/useRedirect.ts
import { defineStore } from 'pinia';
export const useRedirectStore = defineStore('redirect', {
    state: () => ({
        current: 'Init',
    }),
    actions: {
        set(view) {
            this.current = view;
        },
        redirect(to) {
            switch (to) {
                case 'Init':
                    this.current = 'Init';
                    break;
                case 'About':
                    this.current = 'About';
                    break;
                case 'Skills':
                    this.current = 'Skills';
                    break;
                case 'Experience':
                    this.current = 'Experience';
                    break;
                case 'Projects':
                    this.current = 'Projects';
                    break;
                case 'Contact':
                    this.current = 'Contact';
                    break;
                case 'ContactEmail':
                    this.current = 'ContactEmail';
                    break;
                default:
                    this.current = 'Init';
            }
        },
        goInit() {
            this.current = 'Init';
        },
    },
});
