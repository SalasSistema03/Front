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
  {
    path: '/padrongas',
    alias: '/impuestos/padrongas',
    name: 'padrongas',
    component: () => import('../views/Impuestos/GAS/PadronGASView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/carga_gas',
    alias: '/impuestos/cargagas',
    name: 'cargagas',
    component: () => import('../views/Impuestos/GAS/CargarGASView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/padronapi',
    alias: '/impuestos/padronapi',
    name: 'padronapi',
    component: () => import('../views/Impuestos/API/PadronAPIView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/cargar_api',
    alias: '/impuestos/cargaapi',
    name: 'cargaapi',
    component: () => import('../views/Impuestos/API/CargarAPIView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/exp_unidades',
    name: '/expensas/unidades',
    component: () => import('../views/Impuestos/EXP/UnidadesView.vue'), // Se importa solo cuando se necesita
    meta: {
      requiresAuth: true,
      vistaId: 49
    }
  },
  {
    path: '/exp_edificios',
    name: '/expensas/consorcios',
    component: () => import('../views/Impuestos/EXP/ConsorcioView.vue'), // Se importa solo cuando se necesita
    meta: {
      requiresAuth: true,
      vistaId: 50
    }
  },
  {
    path: '/exp_administrador_consorcio',
    name: '/expensas/administradores',
    component: () => import('../views/Impuestos/EXP/AdministradoresView.vue'), // Se importa solo cuando se necesita
    meta: {
      requiresAuth: true,
      vistaId: 51
    }
  }

]

export default routesImpuestos
