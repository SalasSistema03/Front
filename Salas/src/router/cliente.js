

const routesCliente = [
  {
    path: '/cargarcliente',
    alias: '/atcl/cargarcliente',
    name: 'cargarcliente',
    component: () => import('../views/Atcl/Cliente/CargarClienteView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/asesores',
    alias: '/atcl/asesores',
    name: 'asesores',
    component: () => import('../views/Atcl/Cliente/AsesoresView.vue'),
    meta: {
      requiresAuth: true,
    }
  },


]

export default routesCliente
