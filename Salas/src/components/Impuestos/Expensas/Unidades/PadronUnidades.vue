<template>
  <div class="px-3 container-fluid mt-3">
    <h3 class="mb-4 text-uppercase  small text-muted"><i class="bi bi-building me-2"></i>Padrón Unidades</h3>
    
    <div class="row align-items-center mb-3 g-2">
      <div class="col-12 col-md-10">
        <form @submit.prevent="obtenerUnidades" class="row g-2" autocomplete="off">
          
          <div class="col-md-4">
            <input type="text" v-model="filtros.search" class="form-control shadow-sm"
              placeholder="Buscar por nombre, cuit, telefono...">
          </div>
          
          <div class="col-md-4">
            <div class="dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle w-100 shadow-sm text-start d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown"
                data-bs-auto-close="outside">
                Opciones de Filtro
              </button>
              <div class="dropdown-menu p-3 shadow" style="min-width: 250px;">
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" v-model="filtros.opciones" value="ACTIVO" id="activos">
                  <label class="form-check-label small" for="activos">Activos</label>
                </div>
                <div class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" v-model="filtros.opciones" value="INACTIVO" id="inactivos">
                  <label class="form-check-label small" for="inactivos">Inactivos</label>
                </div>
                <hr class="my-2">
                <div class="form-check mb-1">
                  <input class="form-check-input" type="checkbox" v-model="filtros.opciones" value="L" id="admInmobiliario">
                  <label class="form-check-label small" for="admInmobiliario">Adm Inmobiliario</label>
                </div>
                <div class="form-check mb-1">
                  <input class="form-check-input" type="checkbox" v-model="filtros.opciones" value="P" id="admPropietario">
                  <label class="form-check-label small" for="admPropietario">Adm Propietario</label>
                </div>
                <div class="form-check mb-1">
                  <input class="form-check-input" type="checkbox" v-model="filtros.opciones" value="I" id="admInquilino">
                  <label class="form-check-label small" for="admInquilino">Adm Inquilino</label>
                </div>
              </div>
            </div>
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
        <div class="table-responsive table-scroll-container">
          <table class="table table-hover table-striped mb-0 align-middle" id="tablaUnidades">
            <thead class="table-light">
              <tr class="text-center" style="position: sticky; top: 0; z-index: 1;">
                <th>Folio</th>
                <th class="text-start">Ubicación</th>
                <th>Com</th>
                <th>Adm</th>
                <th>Estado</th>
                <th>Consorcio</th>
                <th>Acciones</th>
                <th><i class="bi bi-chat-dots text-muted" title="Observaciones"></i></th>
                <th>Casa</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cargando">
                <td colspan="9" class="text-center py-5 text-muted">
                  <div class="spinner-border text-primary mb-2" role="status"></div>
                  <br>Cargando unidades...
                </td>
              </tr>
              
              <tr v-else-if="unidades.length === 0">
                <td colspan="9" class="text-center py-4 text-muted">No se encontraron unidades con los filtros aplicados.</td>
              </tr>

              <tr v-else v-for="unidad in unidades" :key="unidad.id" 
                  :class="{'table-danger border-danger': unidad.estado === 'Inactivo'}">
                <td class="text-center fw-bold">{{ unidad.folio }}</td>
                <td class="text-start small">{{ unidad.ubicacion }}</td>
                <td class="text-center">{{ unidad.comision }}</td>
                <td class="text-center">{{ unidad.administra }}</td>
                <td class="text-center">
                  <span class="badge" :class="unidad.estado === 'Activo' ? 'bg-success' : 'bg-danger'">
                    {{ unidad.estado }}
                  </span>
                </td>
                
                <td class="text-center small">{{ obtenerNombreConsorcio(unidad.casa) }}</td>
                
                <td class="text-center">
                  <button type="button" class="btn btn-sm btn-outline-primary py-0" @click="abrirModalEdicion(unidad)">
                    Modificar
                  </button>
                </td>
                
                <td class="text-center">
                  <i v-if="tieneObservaciones(unidad.casa)" class="bi bi-chat-text-fill text-info" title="Tiene observaciones"></i>
                </td>
                <td class="text-center text-muted small">{{ unidad.casa }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    </div>
    <ModalCargarUnidad 
  v-if="mostrarModal" 
  :show="mostrarModal"
  :unidad="unidadSeleccionada" 
  :padrones="padronesSeleccionados" 
  :edificiosLista="edificios"
  @close="mostrarModal = false" 
  @recargar="obtenerUnidades"
/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { alertas } from '@/utils/alertas';
import ModalCargarUnidad from '@/components/Impuestos/Expensas/Unidades/Modales/ModalCargarUnidad.vue';

// 1. IMPORTANTE: Importamos las funciones desde tu capa de servicios y eliminamos Axios
import { 
  filtroUnidadesCompletoService, 
  actualizarPadronUnidadesService 
} from '@/Services/api/Impuestos/expensasApi.js';

// --- ESTADOS ---
const cargando = ref(false);
const sincronizando = ref(false);
const mostrarModal = ref(false);

const unidades = ref([]);
const edificios = ref([]);
const unidadesPadronByCasa = ref({}); // Objeto/Diccionario
const unidadSeleccionada = ref(null);
const padronesSeleccionados = ref([]);

// Filtros reactivos (Reemplazan los inputs y checkbox de Blade)
const filtros = ref({
  search: '',
  opciones: [] // Ej: ['ACTIVO', 'L']
});

// --- MÉTODOS ---

// 1. Cargar la tabla 
const obtenerUnidades = async () => {
  cargando.value = true;
  try {
    // 2. CORRECCIÓN: Usamos tu servicio y le pasamos los filtros como un objeto
    const response = await filtroUnidadesCompletoService({
      search: filtros.value.search,
      filtros: filtros.value.opciones
    });
    
    // Asignamos la respuesta a nuestras variables reactivas
    const data = response.data.data;
    unidades.value = data.unidades;
    edificios.value = data.edificios;
    unidadesPadronByCasa.value = data.unidades_padron_by_casa;

  } catch (error) {
    alertas.error('Error al obtener las unidades: ' + (error.response?.data?.message || error.message));
  } finally {
    cargando.value = false;
  }
};

// 2. Botón "Actualizar Padrón" 
const sincronizarPadron = async () => {
  sincronizando.value = true;
  try {
    // 3. CORRECCIÓN: Usamos tu servicio directamente, que ya sabe la URL y el Token
    const response = await actualizarPadronUnidadesService();
    
    alertas.success(response.data.message || 'Padrón actualizado correctamente.');
    
    // Refrescamos la tabla para ver los cambios
    obtenerUnidades();
  } catch (error) {
    alertas.error('Hubo un problema al sincronizar el padrón.');
  } finally {
    sincronizando.value = false;
  }
};

// 3. Helpers para reemplazar la lógica @php de Blade en la Tabla
const obtenerNombreConsorcio = (idCasa) => {
  // Verificamos si la casa tiene padrones asociados
  const padronesDeCasa = unidadesPadronByCasa.value[idCasa];
  
  if (!padronesDeCasa || padronesDeCasa.length === 0) return 'No Asignado';
  
  // Tomamos el id_edificio del primer padron
  const primerPadron = padronesDeCasa[0];
  if (!primerPadron.id_edificio) return 'No Asignado';

  // Buscamos el nombre del edificio en nuestro array
  const edificioEncontrado = edificios.value.find(e => e.id === primerPadron.id_edificio);
  
  return edificioEncontrado ? edificioEncontrado.nombre_consorcio : 'No Asignado';
};

const tieneObservaciones = (idCasa) => {
  const padronesDeCasa = unidadesPadronByCasa.value[idCasa];
  if (!padronesDeCasa) return false;
  
  // Verifica si al menos un padrón tiene observaciones (no nulo y no vacío)
  return padronesDeCasa.some(p => p.observaciones !== null && p.observaciones.trim() !== '');
};

// 4. Abrir Modal de Edición
const abrirModalEdicion = (unidad) => {
  // A. Guarda qué unidad exacta clickeaste y sus padrones correspondientes
  unidadSeleccionada.value = unidad;
  padronesSeleccionados.value = unidadesPadronByCasa.value[unidad.casa] || [];
  
  // B. Enciende el "interruptor"
  mostrarModal.value = true; 
};

// --- CICLO DE VIDA ---
onMounted(() => {
  obtenerUnidades();
});
</script>

<style scoped>
.table-scroll-container {
  max-height: 65vh;
  overflow-y: auto;
}
#tablaUnidades th {
  font-size: 0.85rem;
  color: #495057;
}
#tablaUnidades td {
  font-size: 0.85rem;
}
</style>