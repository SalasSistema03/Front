

const routesContable = [
    {
        path : '/sellado',
        name : 'sellado',
        component : () => import('../views/Contable/SelladoView.vue'), // Se importa solo cuando se necesita
        meta: { requiresAuth: true,
            vistaId:24
         },
    },
]

export default routesContable