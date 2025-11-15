import { createRouter, createWebHistory } from 'vue-router'
import TabletView from '../views/TabletView.vue'
import { authMe } from '@/services/auth'

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
      path: '/login',
      name: 'AdminLogin',
      component: () => import('@/components/Admin/AdminLogin.vue'),
    },
    {
      path: '/admin',
      name: 'AdminBlogView',
      component: () => import('@/views/AdminBlogView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})
router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true
  try {
    const me = await authMe()
    if (me.ok && me.is_admin) return true
  } catch {}
  return { name: 'AdminLogin', query: { r: to.fullPath } }
})

export default router
