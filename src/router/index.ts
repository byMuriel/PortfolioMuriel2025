import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndexView,
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/MainView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
    },
  ],
})

export default router
