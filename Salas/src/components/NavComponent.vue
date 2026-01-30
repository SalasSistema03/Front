<template>
    <nav class="navbar navbar-expand-lg sticky-top mb-3 px-3">
        <router-link class="navbar-brand" id="navbar_contenedor_logo" :to="{ name: 'home' }">
            <img :src="logo" alt="Logo" class="img-fluid" style="max-width: 11vh" />
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                
                <template v-if="!authStore.isLoaded">
                    <li class="nav-item"><a class="nav-link">Cargando...</a></li>
                </template>

                <template v-else>
                    <li v-for="nav in authStore.menuData" :key="nav.id" class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle navbar-item_menu" href="#" data-bs-toggle="dropdown">
                            {{ nav.nombre }}
                        </a>

                        <ul class="dropdown-menu">
                            <li v-for="seccion in nav.secciones" :key="seccion.nombre" 
                                class="dropdown navbar-dropdown-submenu"
                                @mouseenter="toggleSubmenu($event, true)" 
                                @mouseleave="toggleSubmenu($event, false)">
                                
                                <a class="dropdown-item dropdown-toggle d-flex justify-content-between align-items-center" href="#">
                                    {{ seccion.nombre }}
                                    <span class="navbar-dropdown-arrow">›</span>
                                </a>

                                <ul class="dropdown-menu navbar-dropdown-submenu-content">
                                    <li v-for="item in seccion.items" :key="item.id">
                                        <router-link :to="getItemUrl(item)" class="dropdown-item">
                                            {{ item.nombre }}
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </template>

                <li class="nav-item">
                    <a class="nav-link dropdown-toggle ms-3 navbar-admin" href="#" data-bs-toggle="dropdown">
                         {{ username }}
                    </a>
                    <ul class="dropdown-menu navbar-admin_dropdown dropdown-menu-end">
                        <li v-if="isUserAdmin">
                            <router-link class="dropdown-item" :to="{ name: 'register' }">Registro Usuarios</router-link>
                        </li>
                        <li v-if="isUserAdmin">
                            <router-link class="dropdown-item" :to="{ name: 'update-user' }">Actualizar Usuario</router-link>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" @click.prevent="authStore.logout()">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth'; // Importamos el store
import { isAdmin } from '../Services/business/auth';
import axios from 'axios';

const authStore = useAuthStore();
const username = ref('');
const isUserAdmin = ref(false);
const logo = ref('');

// Selección de logo
const selectLogo = () => {
    const month = new Date().getMonth() + 1;
    logo.value = new URL(`../assets/logo${month}.png`, import.meta.url).href;
};

// Función para alternar submenús (La que ya te funcionaba bien)
const toggleSubmenu = (event, show) => {
    const parent = event.currentTarget;
    const submenu = parent.querySelector('.navbar-dropdown-submenu-content');
    if (!submenu) return;

    if (show) {
        submenu.classList.add('show');
        const rect = submenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            submenu.style.left = 'auto';
            submenu.style.right = '100%';
        }
    } else {
        submenu.classList.remove('show');
        submenu.style.left = '100%';
        submenu.style.right = 'auto';
    }
};

const getItemUrl = (item) => item.ruta ? `/${item.ruta}` : '#';

onMounted(async () => {
    // 1. Cargar permisos y menús
    await authStore.fetchPermissions();
    
    // 2. Cargar el nombre de usuario (Si no está en el store, lo pedimos)
    if (!authStore.user) {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(import.meta.env.VITE_API_AUTH_URL + '/v1/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Guardamos en el store para que no se pierda
            authStore.user = { username: res.data.username }; 
        } catch (e) {
            console.error("Error cargando nombre de usuario", e);
        }
    }
    
    // 3. Asignar el valor a la variable que usa el template
    username.value = authStore.user?.username || 'Usuario';

    // 4. Otros datos
    selectLogo();
    isUserAdmin.value = await isAdmin();
});
</script>