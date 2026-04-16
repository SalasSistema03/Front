<template>
  <nav class="navbar navbar-expand-lg sticky-top mb-3 px-3">
    <router-link class="navbar-brand" id="navbar_contenedor_logo" :to="{ name: 'home' }">
      <img :src="logo" alt="Logo" class="img-fluid" />
    </router-link>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">

        <template v-if="!authStore.isLoaded">
          <li class="nav-item"><a class="nav-link">Cargando...</a></li>
        </template>


        <li class="nav-item">
          <a class="nav-link dropdown-toggle ms-3 navbar-admin navbar-admin_dropdown-toggle" href="#"
            data-bs-toggle="dropdown">
            {{ username }}
          </a>
          <ul class="dropdown-menu navbar-admin_dropdown dropdown-menu-end navbar-dropdown-menu">
            <li v-if="isUserAdmin">
              <router-link class="dropdown-item " :to="{ name: 'register' }">Registro Usuarios</router-link>
            </li>
            <li v-if="isUserAdmin">
              <router-link class="dropdown-item" :to="{ name: 'update-user' }">Actualizar Usuario</router-link>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#" @click.prevent="authStore.logout()">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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


// Cerrar submenús al hacer clic fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.navbar-dropdown-submenu')) {
    document.querySelectorAll('.navbar-dropdown-submenu-content.show').forEach(submenu => {
      submenu.classList.remove('show');
      submenu.style.left = '100%';
      submenu.style.right = 'auto';
    });
  }
};

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

  // 5. Agregar listener para clics fuera
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // Limpiar listener
  document.removeEventListener('click', handleClickOutside);
});
</script>
