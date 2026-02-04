

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

    {
        path: '/propiedad-busqueda',
        alias: '/atcl/propiedad-busqueda',
        name: 'propiedad-busqueda',
        component: () => import('../views/Atcl/PropiedadBusquedaView.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/propiedad-detalle',
        alias: '/atcl/propiedad-detalle',
        name: 'propiedad-detalle',
        component: () => import('../views/Atcl/PropiedadDetalleView.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/propiedad-update',
        alias: '/atcl/propiedad-update',
        name: 'propiedad-update',
        component: () => import('../views/Atcl/PropiedadUpdateView.vue'),
        meta: {
            requiresAuth: true,
        },
    }
]

export default routesAtcl