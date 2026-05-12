

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
        path: '/propiedad-detalle/:id',
        alias: '/atcl/propiedad-detalle/:id',
        name: 'propiedad-detalle',
        component: () => import('../views/Atcl/PropiedadDetalleView.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/propiedad-update/:id',
        alias: '/atcl/propiedad-update/:id',
        name: 'propiedad-update',
        component: () => import('../views/Atcl/PropiedadUpdateView.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/listado-alquiler',
        alias: '/listado-alquiler',
        name: 'listado-alquiler',
        component: () => import('../views/Atcl/Listado/ListadoAlquilerView.vue'),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/listado-venta',
        alias: '/listado-venta',
        name: 'listado-venta',
        component: () => import('../views/Atcl/Listado/ListadoVentaView.vue'),
        meta: {
            requiresAuth: true,
        },
    }
]

export default routesAtcl
