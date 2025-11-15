// src/stores/useLastSreen.ts
import { defineStore } from 'pinia';
export const useLastScreen = defineStore('lastScreen', {
    state: () => ({
        lastScreen: 'Init',
    }),
    actions: {
        changeLastScreen(screen) {
            this.lastScreen = screen;
        },
    },
});
