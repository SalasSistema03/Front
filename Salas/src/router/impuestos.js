

const routesImpuestos = [
  {
    path: '/padrontgi',
    alias: '/impuestos/padrontgi',
    name: 'padrontgi',
    component: () => import('../views/Impuestos/TGI/PadronTGIView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/carga_tgi',
    alias: '/impuestos/cargatgi',
    name: 'cargatgi',
    component: () => import('../views/Impuestos/TGI/CargarTGIView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/padronagua',
    alias: '/impuestos/padronagua',
    name: 'padronagua',
    component: () => import('../views/Impuestos/AGUA/PadronAguaView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/carga_agua',
    alias: '/impuestos/cargaagua',
    name: 'cargaagua',
    component: () => import('../views/Impuestos/AGUA/CargarAGUAView.vue'),
    meta: {
      requiresAuth: true,
    },
  },



]

export default routesImpuestos
