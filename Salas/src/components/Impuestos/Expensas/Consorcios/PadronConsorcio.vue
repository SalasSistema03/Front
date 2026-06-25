<template>
  <div class="px-3 container-fluid mt-3">
    <h3 class="mb-4 text-uppercase  small text-muted"><i class="bi bi-buildings me-2"></i>Padrón Consorcios</h3>

    <div class="row align-items-center mb-3 g-2">
      <div class="col-md-10">
        <form @submit.prevent="obtenerConsorcios" class="row g-2" autocomplete="off">
          <div class="col-md-8">
            <input type="text" v-model="search" class="form-control shadow-sm"
              placeholder="Buscar por nombre, dirección, altura...">
          </div>
          <div class="col-md-4">
            <button type="submit" class="btn btn-primary w-100 shadow-sm" :disabled="cargando">
              <span v-if="cargando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-search me-1"></i> Filtrar
            </button>
          </div>
        </form>
      </div>

      <div class="col-md-2 text-md-end">
        <button type="button" class="btn btn-success w-100 shadow-sm" @click="abrirModalNuevo">
          <i class="bi bi-plus-circle me-1"></i> Cargar Consorcio
        </button>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive table-scroll-container">
          <table class="table table-hover table-striped mb-0 align-middle">
            <thead class="table-light">
              <tr style="position: sticky; top: 0; z-index: 1;">
                <th>Nombre Consorcio</th>
                <th>Dirección</th>
                <th>Administrador Consorcio</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cargando">
                <td colspan="4" class="text-center py-5 text-muted">
                  <div class="spinner-border text-primary mb-2" role="status"></div>
                  <br>Cargando consorcios...
                </td>
              </tr>
              
              <tr v-else-if="edificios.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">No se encontraron consorcios.</td>
              </tr>

              <tr v-else v-for="edificio in edificios" :key="edificio.id">
                <td class="fw-semibold">{{ edificio.nombre_consorcio }}</td>
                <td>{{ edificio.direccion }} {{ edificio.altura }}</td>
                <td>{{ edificio.administrador?.nombre || 'No Asignado' }}</td>
                <td class="text-center">
                  <button type="button" class="btn btn-sm btn-outline-primary py-0" @click="abrirModalEditar(edificio)">
                    Modificar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </div>

    <ModalConsorcio 
  v-if="mostrarModal" 
  :show="mostrarModal"
  :modoEdicion="esEdicion"
  :consorcio="consorcioSeleccionado"
  :listaCalles="calles"
  :listaAdministradores="administradores"
  @close="mostrarModal = false"
  @recargar="obtenerConsorcios"
/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { alertas } from '@/utils/alertas'; // Ajustá la ruta
import { getEdificiosService } from '@/Services/api/Impuestos/expensasApi.js';
import ModalConsorcio from '@/components/Impuestos/Expensas/Consorcios/Modales/ModalConsorcio.vue';

// --- ESTADOS ---
const cargando = ref(false);
const search = ref('');
const mostrarModal = ref(false);
const esEdicion = ref(false); // Para saber si creamos o editamos

// Listas de datos que vienen del backend
const edificios = ref([]);
const calles = ref([]);
const administradores = ref([]);

// Objeto para pasar al modal cuando editamos
const consorcioSeleccionado = ref(null);

// --- MÉTODOS ---

// 1. Obtener la lista y catálogos
const obtenerConsorcios = async () => {
  cargando.value = true;
  try {
    const response = await getEdificiosService({ search: search.value });
    
    // Asignamos las 3 colecciones que nos devuelve el backend
    const data = response.data.data;
    edificios.value = data.edificios;
    calles.value = data.calles;
    administradores.value = data.administradores;

  } catch (error) {
    alertas.error('Error al obtener los consorcios: ' + (error.response?.data?.message || error.message));
  } finally {
    cargando.value = false;
  }
};

// 2. Abrir Modal para CREAR
const abrirModalNuevo = () => {
  esEdicion.value = false;
  consorcioSeleccionado.value = null; // Vacío porque es nuevo
  mostrarModal.value = true;
};

// 3. Abrir Modal para EDITAR
const abrirModalEditar = (edificio) => {
  esEdicion.value = true;
  // Hacemos una copia superficial para no editar directamente la tabla hasta guardar
  consorcioSeleccionado.value = { ...edificio }; 
  mostrarModal.value = true;
};

// --- CICLO DE VIDA ---
onMounted(() => {
  obtenerConsorcios();
});
</script>

<style scoped>
.table-scroll-container {
  max-height: 65vh;
  overflow-y: auto;
}
</style>