<template>
    <nav class="navbar navbar-expand-lg sticky-top mb-3 px-3">
        <!-- Logo -->
        <router-link class="navbar-brand" id="contenedor_logo" :to="{ name: 'home' }">
            <img src="../assets/logo.svg" alt="Logo" class="header-img" id="logo_nav" />
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <!-- Loading state -->
                <!-- <li v-if="loading" class="nav-item">
                    <span class="nav-link">Cargando...</span>
                </li> -->

                <!-- Error state -->
                <!--   <li v-else-if="error" class="nav-item">
                    <span class="nav-link text-danger">Error al cargar menú</span>
                </li> -->

                <!-- Menu items -->
                <li v-for="nav in menuData" :key="nav.id" class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle item_menu" href="#" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ nav.nombre }}
                    </a>

                    <ul class="dropdown-menu">
                        <li v-for="seccion in nav.secciones" :key="seccion.nombre" class="dropdown dropdown-submenu"
                            @mouseenter="toggleSubmenu($event, true)" @mouseleave="toggleSubmenu($event, false)">
                            <a class="dropdown-item dropdown-toggle d-flex justify-content-between align-items-center"
                                href="#">
                                {{ seccion.nombre }}
                                <span class="dropdown-arrow">›</span>
                            </a>

                            <ul class="dropdown-menu dropdown-submenu-content">
                                <li v-for="item in seccion.items" :key="item.id">
                                    <a :href="getItemUrl(item)" class="dropdown-item">
                                        {{ item.nombre }}
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link dropdown-toggle ms-3" href="#" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ username }}
                    </a>

                    <ul class="dropdown-menu dropdown-menu-end">
                        <li v-if="isAdmin">
                            <router-link class="dropdown-item" :to="{ name: 'register' }">Registro</router-link>
                        </li>
                        <li><a class="dropdown-item" href="#">Otra acción</a></li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="logout"> Logout </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- <div>
            <ul class="navbar-nav">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        {{ username }}
                    </button>
                    <ul class="dropdown-menu">
                        <li v-if="isAdmin">
                            <router-link class="dropdown-item" :to="{ name: 'register' }">Registro</router-link>
                        </li>
                        <li><a class="dropdown-item" href="#">Otra acción</a></li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="logout"> Logout </a>
                        </li>
                    </ul>
                </div>
            </ul>
        </div> -->
    </nav>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

const menuData = ref([])
const mes = ref(new Date().getMonth() + 1)
const permisos = ref({})
const loading = ref(true)
const error = ref(null)
const username = ref('')
const useradmin = ref('')
const user = ref(null)
const isAdmin = ref(false)

//funcion para verificar si es admin
const getUser = async () => {
    const url = import.meta.env.VITE_API_AUTH_URL + '/v1/auth/me'
    const token = localStorage.getItem('token')

    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    user.value = res.data
    username.value = res.data.username
    isAdmin.value = res.data.admin === 1
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

    //console.log(userResponse.data)

    username.value = userResponse.data.username
    //useradmin.value = userResponse.data.admin
}

// Función para alternar submenús
const toggleSubmenu = (event, show) => {
    const parent = event.currentTarget
    const submenu = parent.querySelector('.dropdown-submenu-content')

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
        const submenu = dropdown.querySelector('.dropdown-submenu-content')

        // Evitar que el clic en el toggle cierre el menú padre
        toggle.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            // Cerrar otros submenús abiertos
            document.querySelectorAll('.dropdown-submenu-content.show').forEach((openMenu) => {
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
        if (!e.target.closest('.dropdown-submenu')) {
            document.querySelectorAll('.dropdown-submenu-content.show').forEach((menu) => {
                menu.classList.remove('show')
            })
        }
    })
}

onMounted(() => {
    fetchMenuData()
    getUsername()
    getUser()
})
</script>

<style scoped>
/* Estilos base */
.navbar {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Submenús personalizados */
.dropdown-submenu {
    position: relative;
}

.dropdown-submenu-content {
    position: absolute;
    top: 0;
    left: 100%;
    margin-top: -1px;
    display: none;
    min-width: 200px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    z-index: 1000;
}

.dropdown-submenu-content.show {
    display: block;
}

/* Ajustes para dispositivos móviles */
@media (max-width: 991.98px) {
    .dropdown-submenu-content {
        position: static;
        left: auto;
        margin-top: 0;
        border: none;
        box-shadow: none;
        background-color: #f8f9fa;
    }

    .dropdown-submenu-content .dropdown-item {
        padding-left: 2rem;
    }
}

/* Flecha del dropdown */
.dropdown-arrow {
    margin-left: 0.5rem;
    transform: rotate(0deg);
    transition: transform 0.2s;
    color: red;
}

.dropdown-submenu:hover .dropdown-arrow,
.dropdown-toggle[aria-expanded='true']+.dropdown-arrow {
    transform: rotate(90deg);
}

/* Mejoras visuales */
.item_menu {
    font-weight: 500;
    padding: 0.5rem 1rem;
}

.titulo_submenu {
    font-weight: 600;
    color: #495057;
}

.contenedor_submenu .dropdown-item {
    padding: 0.375rem 1.5rem;
    color: #6c757d;
    transition: all 0.2s;
}

.contenedor_submenu .dropdown-item:hover {
    background-color: #faf8f8;
    color: #495057;
}

#contenedor_logo {
    padding: 0;
}

#logo_nav {
    height: 40px;
    width: auto;
}
</style>
