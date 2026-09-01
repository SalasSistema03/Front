
const routesAgenda = [
  {
    path: '/cargarInventario',
    alias: '/dpto/inventario',
    name: '/dpto/inventario',
    component: () => import('../views/Dpto/Inventario/CargarInventarioView.vue'), // Se importa solo cuando se necesita
    /* meta: { requiresAuth: true,
        vistaId:25
     }, */
  },
]

export default routesAgenda
