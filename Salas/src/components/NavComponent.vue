<template>
    <nav class="navbar navbar-expand-lg sticky-top mb-3 px-3">
        <!-- Logo -->
        <router-link class="navbar-brand" id="navbar_contenedor_logo" :to="{ name: 'home' }">
            <img src="../assets/Escudo_Colon_Campeon.png" alt="Logo" class="img-fluid" style="max-width: 40px" />
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <!-- Menu items con loading state -->
                <template v-if="loading">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle navbar-item_menu" href="#" role="button">
                            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                            Cargando...
                        </a>
                    </li>
                 
                </template>
                
                <template v-else>
                    <li v-for="nav in menuData" :key="nav.id" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle navbar-item_menu" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            {{ nav.nombre }}
                        </a>

                        <ul class="dropdown-menu">
                            <li v-for="seccion in nav.secciones" :key="seccion.nombre" class="dropdown navbar-dropdown-submenu"
                                @mouseenter="toggleSubmenu($event, true)" @mouseleave="toggleSubmenu($event, false)">
                                <a class="dropdown-item dropdown-toggle d-flex justify-content-between align-items-center"
                                    href="#">
                                    {{ seccion.nombre }}
                                    <span class="navbar-dropdown-arrow">›</span>
                                </a>

                                <ul class="dropdown-menu navbar-dropdown-submenu-content">
                                    <li v-for="item in seccion.items" :key="item.id">
                                        <a :href="getItemUrl(item)" class="dropdown-item">
                                            {{ item.nombre }}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </template>
                
                <!-- User menu con loading state -->
                <li class="nav-item">
                    <a class="nav-link dropdown-toggle ms-3 navbar-admin" href="#" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                         {{ username }}
                        <!-- <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        <span v-if="loading">Cargando...</span>
                        <span v-else>{{ username || 'Usuario' }}</span> -->
                    </a>

                    <ul class="dropdown-menu navbar-admin_dropdown dropdown-menu-end">
                        <li v-if="isUserAdmin">
                            <router-link class="dropdown-item" :to="{ name: 'register' }">Registro Usuarios</router-link>
                        </li>
                        <li v-if="isUserAdmin">
                            <router-link class="dropdown-item" :to="{ name: 'update-user' }">Actualizar Usuario</router-link></li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="logout"> Logout </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { isAdmin } from '../Services/business/auth'



const menuData = ref([])

const permisos = ref({})
const loading = ref(true)
const error = ref(null)
const username = ref('')
const user = ref(null)
const isUserAdmin = ref(false)



const verifyAdmin = async () => {
    isUserAdmin.value = await isAdmin()
   
}

// Función para obtener el nombre de usuario
const getUsername = async () => {
    const usuarioUrl = import.meta.env.VITE_API_AUTH_URL + '/v1/auth/me'
    const token = localStorage.getItem('token')

    const userResponse = await axios.get(usuarioUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })



    username.value = userResponse.data.username

}

// Función para alternar submenús
const toggleSubmenu = (event, show) => {
    const parent = event.currentTarget
    const submenu = parent.querySelector('.navbar-dropdown-submenu-content')

    if (show) {
        submenu.classList.add('show')
        // Ajustar posición si está cerca del borde derecho
        const rect = submenu.getBoundingClientRect()
        if (rect.right > window.innerWidth) {
            submenu.style.left = 'auto'
            submenu.style.right = '100%'
        }
    } else {
        submenu.classList.remove('show')
    }
}

// Función para obtener URL del item
const getItemUrl = (item) => {
    if (item.ruta) {
        // Si tienes Vue Router
        // return { name: item.ruta }
        return `/${item.ruta}`
    }
    return '#'
}

const fetchMenuData = async () => {
    try {
        loading.value = true
        error.value = null
        const loginUrl = import.meta.env.VITE_API_AUTH_URL + '/v1/auth/nav'

        // Obtener el token del localStorage
        const token = localStorage.getItem('token')

        const response = await axios.get(loginUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })

        if (response.data.success) {
            menuData.value = response.data.data.menu
            permisos.value = response.data.data.permisos
        }
    } catch (err) {
        console.error('Error al cargar el menú:', err)
        error.value = 'No se pudo cargar el menú'

        if (err.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
    } finally {
        loading.value = false
        // Inicializar submenús después de cargar datos
        nextTick(() => {
            initSubmenus()
        })
    }
}

// Función de logout
const logout = async () => {
    const logoutUrl = import.meta.env.VITE_API_AUTH_URL + '/v1/auth/logout'
    const token = localStorage.getItem('token')

    try {
        await axios.post(
            logoutUrl,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            },
        )
    } catch (error) {
        // Aunque falle el backend, igual limpiamos sesión local
        console.error('Error al cerrar sesión:', error)
    } finally {
        // Limpieza obligatoria del frontend
        localStorage.removeItem('token')
        localStorage.removeItem('user') // si guarda usuario
        window.location.href = '/'
    }
}

// Inicializar submenús
const initSubmenus = () => {
    const dropdowns = document.querySelectorAll('.dropdown-submenu')

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector('.dropdown-toggle')
        const submenu = dropdown.querySelector('.navbar-dropdown-submenu-content')

        // Evitar que el clic en el toggle cierre el menú padre
        toggle.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            // Cerrar otros submenús abiertos
            document.querySelectorAll('.navbar-dropdown-submenu-content.show').forEach((openMenu) => {
                if (openMenu !== submenu) {
                    openMenu.classList.remove('show')
                }
            })

            // Alternar este submenú
            submenu.classList.toggle('show')
        })
    })

    // Cerrar submenús al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-dropdown-submenu')) {
            document.querySelectorAll('.navbar-dropdown-submenu-content.show').forEach((menu) => {
                menu.classList.remove('show')
            })
        }
    })
}

onMounted(async () => {
    // Ejecutar todas las llamadas en paralelo para mejor rendimiento
    await Promise.all([
        fetchMenuData(),
        getUsername(),
        verifyAdmin()
    ])
})
</script>


