import { createRouter, createWebHistory } from 'vue-router'
import TabletView from '../views/TabletView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TabletView,
    },
    {
      path: '/blog',
      name: 'BlogView',
      component: () => import('@/views/BlogView.vue'),
    },
    {
      path: '/admin',
      name: 'AdminBlogView',
      component: () => import('@/views/AdminBlogView.vue'),
    },
  ],
})

export default router
