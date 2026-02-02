import MuestraTurnoView from '../views/Turnero/MuestraTurnoView.vue'


const rotasTurnero = [
    {
        path : '/carga-turno',
        name : 'carga-turno',
        component : () => import('../views/Turnero/CargaTurnoView.vue'), // Se importa solo cuando se necesita
        meta: { requiresAuth: true,
            vistaId:28
         },
    },
    {
        path : '/toma-turno',
        name : 'toma-turno',
        component : () => import('../views/Turnero/TomaTurnoView.vue'), // Se importa solo cuando se necesita
        meta: { requiresAuth: true 
            ,vistaId:29
        },
    },
    {
        path : '/muestra-turno',
        name : 'muestra-turno',
        component : () => import('../views/Turnero/MuestraTurnoView.vue'), // Se importa solo cuando se necesita
        meta: { requiresAuth: true,
            vistaId:27
        },
    }
]

export default rotasTurnero