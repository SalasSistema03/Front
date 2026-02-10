
const routesAgenda = [
    {
        path : '/agenda',
        alias : '/agenda/agenda',
        name : '/agenda',
        component : () => import('../views/Agenda/AgendaView.vue'), // Se importa solo cuando se necesita
        /* meta: { requiresAuth: true,
            vistaId:25
         }, */
    },
]

export default routesAgenda