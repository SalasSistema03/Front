import CargaTurnoView from '../views/Turnero/CargaTurnoView.vue'
import MuestraTurnoView from '../views/Turnero/MuestraTurnoView.vue'
import TomaTurnoView from '../views/Turnero/TomaTurnoView.vue'
import { isAuthenticated } from '../Services/business/auth'

const rotasTurnero = [
    {
        path : '/carga-turno',
        name : 'carga-turno',
        component : CargaTurnoView,
        meta: { requiresAuth: true },
    },
    {
        path : '/toma-turno',
        name : 'toma-turno',
        component : TomaTurnoView,
        meta: { requiresAuth: true },
    },
    {
        path : '/muestra-turno',
        name : 'muestra-turno',
        component : MuestraTurnoView,
        meta: { requiresAuth: true },
    }
]

export default rotasTurnero