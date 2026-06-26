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
    path: '/contrato',
    alias: '/atcl/Alquiler/contrato',
    name: 'contrato',
    component: () => import('../views/Atcl/Alquiler/ContratoAlquilerView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]

export default routesAlquiler
