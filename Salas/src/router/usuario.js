import ResgisterView from '../views/Usuarios/ResgisterView.vue'
import UpDateUserView from '../views/Usuarios/UpDateUserView.vue'


const routesUsuario = [
    {
        path: '/home/register',
        name: 'register',
        component: ResgisterView,
        meta: {
            requiresAuth: true,
            requiresAdmin: true, // opcional
        },
    },
    {
        path: '/home/update-user',
        name: 'update-user',
        component: UpDateUserView,
        meta: {
            requiresAuth: true,
            requiresAdmin: true, // opcional
        },
    },
]

export default routesUsuario