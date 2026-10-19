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


]

export default routesImpuestos
