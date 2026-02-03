

const routesAtcl = [
    {
        path: '/propiedad-carga',
        alias: '/atcl/propiedad-carga',
        name: 'propiedad-carga',
        component: () => import('../views/Atcl/PropiedadCargaView.vue'),
        meta: {
            requiresAuth: true,
        },
    },

    /* {
        path: '/atcl/propiedad',
        name: 'propiedad',
        component: () => import('../views/Atcl/PropiedadView.vue'),
        meta: {
            requiresAuth: true,
            requiresAdmin: true, // opcional
        },
    }, */
]

export default routesAtcl