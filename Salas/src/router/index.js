import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

import Turnero from '../router/turnero'
import Usuario from '../router/usuario'
import { isAuthenticated, isAdmin } from '../Services/business/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },

    ...Turnero,
    ...Usuario,
  ],
})

/**
 * Guard global
 */
router.beforeEach(async (to) => {
  // Auth
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login' }
  }

  // Admin (si lo necesitás)
  if (to.meta.requiresAdmin) {
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return { name: 'home' }
    }
  }
})

export default router
