

const routesContable = [
    {
        path : '/sellado',
        name : 'sellado',
        component : () => import('../views/Contable/SelladoView.vue'), // Se importa solo cuando se necesita
        meta: { requiresAuth: true,
            vistaId:24
         },
    },
    {
        path: '/retenciones',
        name: 'retenciones',
        component: () => import('../views/Contable/RetencionesView.vue'), // Se importa solo cuando se necesita
        meta: { requiresAuth: true,
            vistaId:38
         },
    },
    {
        path: '/buscaComprobante',
        name: 'buscaComprobante',
        component: () => import('../views/Contable/Comprobantes/BuscarComprobante.vue'), // Se importa solo cuando se necesita
        meta: { requiresAuth: true },
    }
]

export default routesContable
