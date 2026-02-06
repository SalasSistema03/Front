import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import Turnero from '../router/turnero'
import Usuario from '../router/usuario'
import Atcl from '../router/atcl'
import { useAuthStore } from '@/stores/auth'
import { alertas } from '../utils/alertas'

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
    ...Atcl,
  ],
})

/**
 * Guard global
 */
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // Si la ruta no requiere auth, pasa directo
  if (!to.meta.requiresAuth) return;

  // Si no hay token, al login
  /* alert('aca') */
  if (!localStorage.getItem('token')) return { name: 'login' };

  // Si no hemos cargado permisos, cargarlos (F5 o entrada directa)
  if (!authStore.isLoaded) {
    await authStore.fetchPermissions();
  }


  // --- NUEVO: CANDADO DE ADMINISTRADOR ---
  if (to.meta.requiresAdmin) {
    // Agregamos un log extra para ver qué llegó ahora
   

    // Usa el nombre exacto que veas en la consola (admin o is_admin)
    if (Number(authStore.user?.admin) !== 1) {
      alertas.error("Acceso Restringido", "Solo administradores.");
      return { name: 'home' };
    }
  }

  // EL CANDADO:
  if (to.meta.vistaId) {
    if (!authStore.canView(to.meta.vistaId)) {
      alertas.error("No tienes permiso para acceder a esta sección");
      return { name: 'home' };
    }
  }
});

export default router
