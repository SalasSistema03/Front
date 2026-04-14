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

        <template v-else>
          <li v-for="nav in authStore.menuData" :key="nav.id" class="nav-item dropdown">

            <a class="nav-link dropdown-toggle navbar-item_menu" href="#" data-bs-toggle="dropdown">
              <i :class="['bi', iconMap[nav.id] || iconMap.default]"></i>
              <!-- {{ nav.id }} --> {{ nav.nombre }}
            </a>

            <ul class="dropdown-menu navbar-dropdown-menu">
              <li v-for="seccion in nav.secciones" :key="seccion.nombre" class="dropdown navbar-dropdown-submenu">

                <a class="dropdown-item dropdown-toggle d-flex justify-content-between align-items-center" href="#"
                  @click.prevent="toggleSubmenuClick($event)">
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

        <!-- Notificaciones -->
        <li class="nav-item">
          <a class="nav-link dropdown-toggle navbar-notificaciones position-relative" href="#"
            data-bs-toggle="dropdown">
            <i class="bi bi-bell"></i>
            <span v-if="notificacionCount !== '0'" class="navbar-notificaciones-contador">
              {{ notificacionCount }}
            </span>
          </a>
          <ul class="dropdown-menu navbar-notificaciones_dropdown dropdown-menu-end navbar-dropdown-menu">
            <li v-for="notificacion in notificaciones" :key="notificacion.id">
              <a href="#" @click.prevent="redirijirAsesores(notificacion)">
                <div class="navbar-notificacion-nombre">
                  <i class="bi bi-person-workspace"></i>
                  {{ notificacion.data.descripcion }}
                </div>
                <div class="navbar-notificacion-fecha">
                  {{ notificacion.data.fecha }} | {{ notificacion.data.hora }}hs
                </div>
              </a>
            </li>
            <li v-if="notificaciones.length === 0">
              <a class="dropdown-item text-muted" href="#">
                <i class="bi bi-bell"></i> No tienes notificaciones
              </a>
            </li>
          </ul>
        </li>

        <li class="nav-item">
          <a class="nav-link dropdown-toggle ms-3 navbar-admin" href="#" data-bs-toggle="dropdown">
            <i class="bi bi-person-bounding-box"></i> {{ username }}
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
            <li><a class="dropdown-item" href="#" @click.prevent="authStore.logout()"> <i class="bi bi-door-open"></i>Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Importamos el store
import { isAdmin } from '../Services/business/auth';
import axios from 'axios';
import { getNotificaciones } from '../Services/api/Nav/NavApi';
import { notificacionLeida } from '../Services/api/Nav/NavApi';
import { useToast } from '@/composables/useToast';

const authStore = useAuthStore();
const router = useRouter();
const { showSuccess, showError } = useToast();
const username = ref('');
const isUserAdmin = ref(false);
const logo = ref('');
const notificaciones = ref([]);

// Computed property for notification count
const notificacionCount = computed(() => {
  const count = notificaciones.value.length;
  return count > 99 ? '99+' : count.toString();
});

// Selección de logo
const selectLogo = () => {
  const month = new Date().getMonth() + 1;
  logo.value = new URL(`../assets/logo${month}.png`, import.meta.url).href;
};

// Función para alternar submenús con click
const toggleSubmenuClick = (event) => {
  event.stopPropagation();
  const parent = event.currentTarget.parentElement;
  const submenu = parent.querySelector('.navbar-dropdown-submenu-content');
  if (!submenu) return;

  // Cerrar otros submenús abiertos
  document.querySelectorAll('.navbar-dropdown-submenu-content.show').forEach(otherSubmenu => {
    if (otherSubmenu !== submenu) {
      otherSubmenu.classList.remove('show');
      otherSubmenu.style.left = '100%';
      otherSubmenu.style.right = 'auto';
    }
  });

  // Alternar el submenú actual
  const isOpen = submenu.classList.contains('show');
  if (isOpen) {
    submenu.classList.remove('show');
    submenu.style.left = '100%';
    submenu.style.right = 'auto';
  } else {
    submenu.classList.add('show');
    const rect = submenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      submenu.style.left = 'auto';
      submenu.style.right = '100%';
    }
  }
};


const getItemUrl = (item) => item.ruta ? `/${item.ruta}` : '#';


const redirijirAsesores = async (data) => {
  const id_notificacion = data.id;
  const cliente_id = data.data.cliente_id;
  const criterio_id = data.data.id_criterio_venta
  console.log(data);
  console.log(id_notificacion);
  try {
    await notificacionLeida(id_notificacion);
    showSuccess('Notificación marcada como leída');
    router.push({ name: 'asesores', query: { clienteId: cliente_id, criterioId: criterio_id } });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    showError('Error al marcar notificación como leída');
  }
}

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

  // 5. Cargar notificaciones
  const response = await getNotificaciones();
  notificaciones.value = response.data.data;
  console.log(notificaciones.value);

  // 6. Agregar listener para clics fuera
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // Limpiar listener
  document.removeEventListener('click', handleClickOutside);
});

const iconMap = {
  1: 'bi-house-door',   // Si el id es 1, muestra la casa
  2: 'bi-bank',       // Si el id es 2, muestra el usuario
  3: 'bi-calendar4',
  5: 'bi-display',
  6: 'bi-journal-text',
  10: 'bi-collection',
        // Ajustes
  'default': 'bi-app-indicator' // Icono por defecto si no coincide ninguno
};

</script>
