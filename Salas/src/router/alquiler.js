const routesAlquiler = [
  {
    path: '/reserva',
    alias: '/atcl/Alquiler/reserva',
    name: 'reserva',
    component: () => import('../views/Atcl/Alquiler/ReservaAlquilerView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
 {
    path: '/cargarClienteAlquiler',
    alias: '/atcl/Alquiler/cargarCliente',
    name: 'cargar_cliente_alquiler',
    component: () => import('../views/Atcl/Alquiler/CargarClienteView.vue'),
    meta: {
      requiresAuth: true,
    },
  } 
]

export default routesAlquiler
