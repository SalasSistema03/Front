const routesContratos = [
  {
    path: '/contratos_nuevos',
    name: 'contratos_nuevos',
    component: () => import('../views/Contratos/ContratoAlquilerView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]

export default routesContratos
