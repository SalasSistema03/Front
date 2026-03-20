

const routesCliente = [
  {
    path: '/cargarcliente',
    alias: '/atcl/cargarcliente',
    name: 'cargarcliente',
    component: () => import('../views/Atcl/Cliente/CargarClienteView.vue'),
    meta: {
      requiresAuth: true,
    },
  },


]

export default routesCliente
