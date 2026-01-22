import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ResgisterView from '../views/ResgisterView.vue'

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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: ResgisterView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/',
      name: 'logout',
      component: LoginView,
    },
  ],
})

// Función para verificar si el usuario es admin
const isAdmin = () => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.admin === 1
  } catch {
    return false
  }
}

// Middleware para proteger rutas que requieren admin
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Si la ruta requiere auth y no hay token → login
  if (to.meta.requiresAuth && !token) {
    next('/')
  }
  // Si ya está logueado y quiere ir al login → home
  else if (to.meta.guest && token) {
    next('/home')
  }
  // Si la ruta requiere admin y el usuario no es admin → home
  else if (to.meta.requiresAdmin && !isAdmin()) {
    next('/home')
  } else {
    next()
  }
})

export default router
