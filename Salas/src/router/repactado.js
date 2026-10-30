const routesImpuestos = [
  {
    path: '/repactado',
    alias: '/repactado',
    name: 'repactado',
    component: () => import('../views/Atcl/Repactado/RepactadoView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/tasacion_repactado',
    alias: '/tasacion_repactado',
    name: 'tasacion_repactado',
    component: () => import('../views/Contratos/Repactado/TasacionRepactadoView.vue'),
    meta: {
      requiresAuth: true,
    },
  }


]

export default routesImpuestos
