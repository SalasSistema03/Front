<template>
  <div class="px-3 container-fluid mt-3">
    <h3 class="mb-4 text-uppercase  small text-muted"><i class="bi bi-person-vcard me-2"></i>Padrón Administradores de Consorcio</h3>

    <div class="row align-items-center mb-3 g-2">
      <div class="col-md-10">
        <form @submit.prevent="obtenerAdministradores" class="row g-2" autocomplete="off">
          <div class="col-md-4">
            <input type="text" v-model="search" class="form-control shadow-sm"
              placeholder="Buscar por nombre, cuit, teléfono...">
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary w-100 shadow-sm" :disabled="cargando">
              <span v-if="cargando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-search me-1"></i> Filtrar
            </button>
          </div>
        </form>
      </div>

      <div class="col-12 col-md-2 text-md-end">
        <button @click="sincronizarPadron" class="btn btn-success w-100 shadow-sm" :disabled="sincronizando">
          <span v-if="sincronizando" class="spinner-border spinner-border-sm me-1"></span>
          <i v-else class="bi bi-cloud-arrow-down me-1"></i> 
          {{ sincronizando ? 'Actualizando...' : 'Actualizar Padrón' }}
        </button>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive table-scroll-container px-1">
          <table class="table table-hover table-striped mb-0 align-middle">
            <thead class="table-light">
              <tr style="position: sticky; top: 0; z-index: 1;">
                <th>Nombre</th>
                <th>CUIT</th>
                <th>Contacto</th>
                <th>Página Web</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cargando">
                <td colspan="5" class="text-center py-5 text-muted">
                  <div class="spinner-border text-primary mb-2" role="status"></div>
                  <br>Cargando administradores...
                </td>
              </tr>
              
              <tr v-else-if="administradores.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">No se encontraron administradores con los filtros aplicados.</td>
              </tr>

              <tr v-else v-for="admin in administradores" :key="admin.id">
                <td class="fw-semibold">{{ admin.nombre || '-' }}</td>
                <td>{{ admin.cuit || '-' }}</td>
                <td>{{ admin.contacto || '-' }}</td>
                <td>
                  <a v-if="admin.pagina_web" :href="admin.pagina_web" target="_blank" class="text-decoration-none text-info">
                    Ver sitio <i class="bi bi-box-arrow-up-right ms-1 small"></i>
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>{{ admin.direccion }} {{ admin.altura }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { alertas } from '@/utils/alertas'; 
import { 
  getAdministradoresService, 
  actualizarPadronAdministradoresService 
} from '@/Services/api/Impuestos/expensasApi.js';

// --- ESTADOS ---
const cargando = ref(false);
const sincronizando = ref(false);
const search = ref('');
const administradores = ref([]);

// --- MÉTODOS ---

// 1. Cargar la tabla 
const obtenerAdministradores = async () => {
  cargando.value = true;
  try {
    const response = await getAdministradoresService({ search: search.value });
    
    // Asumimos que tu backend devuelve { status: 'success', data: { proveedores: [...] } }
    // Ajustá esto si tu Laravel devuelve la colección directamente bajo response.data.data
    administradores.value = response.data.data.proveedores || response.data.data;

  } catch (error) {
    alertas.error('Error al obtener los administradores: ' + (error.response?.data?.message || error.message));
  } finally {
    cargando.value = false;
  }
};

// 2. Botón "Actualizar Padrón" 
const sincronizarPadron = async () => {
  sincronizando.value = true;
  try {
    const response = await actualizarPadronAdministradoresService();
    alertas.success(response.data.message || 'Padrón actualizado correctamente.');
    
    // Refrescamos la tabla para ver los cambios
    obtenerAdministradores();
  } catch (error) {
    alertas.error('Hubo un problema al sincronizar el padrón de administradores.');
  } finally {
    sincronizando.value = false;
  }
};

// --- CICLO DE VIDA ---
onMounted(() => {
  obtenerAdministradores();
});

</script>

<style scoped>
.table-scroll-container {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scrollbar opcional para que se vea más limpio */
.table-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.table-scroll-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
</style>