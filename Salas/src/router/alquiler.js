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
]

export default routesAlquiler
