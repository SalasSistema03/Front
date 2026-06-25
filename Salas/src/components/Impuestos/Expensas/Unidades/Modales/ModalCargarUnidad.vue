<template>
  <BaseModal :show="show" size="lg" @close="cerrarModal" :backdrop="'static'">
    
    <template #title>
      <span v-if="!modoComentario">
        <i class="bi bi-building-gear me-2 text-primary"></i> Editar Unidad y Padrones
      </span>
      <span v-else>
        <i class="bi bi-chat-left-dots text-info me-2"></i> Observaciones del Padrón
      </span>
    </template>

    <template #body>
      
      <div v-show="!modoComentario">
        <div class="row g-2 mb-3 bg-light p-2 rounded shadow-sm border border-light">
          <div class="col-md-2">
            <label class="form-label x-small text-muted fw-bold mb-0">Folio</label>
            <input type="text" class="form-control form-control-sm bg-white border-0 shadow-none" :value="unidad.folio" readonly>
          </div>
          <div class="col-md-7">
            <label class="form-label x-small text-muted fw-bold mb-0">Ubicación</label>
            <input type="text" class="form-control form-control-sm bg-white border-0 shadow-none" :value="unidad.ubicacion" readonly>
          </div>
          <div class="col-md-3">
            <label class="form-label x-small text-muted fw-bold mb-0">Estado General</label>
            <select class="form-select form-select-sm border-primary-subtle shadow-sm" v-model="estadoSys">
              <option value="Activo">ACTIVO</option>
              <option value="Inactivo">INACTIVO</option>
            </select>
          </div>
          <div class="col-md-2 mt-2">
            <label class="form-label x-small text-muted fw-bold mb-0">Comisión</label>
            <input type="text" class="form-control form-control-sm bg-white border-0 shadow-none" :value="unidad.comision" readonly>
          </div>
          <div class="col-md-2 mt-2">
            <label class="form-label x-small text-muted fw-bold mb-0">Adm</label>
            <input type="text" class="form-control form-control-sm bg-white border-0 shadow-none" :value="unidad.administra" readonly>
          </div>
          <div class="col-md-8 mt-2">
            <label class="form-label x-small text-muted fw-bold mb-0">Consorcio/Edificio Asignado</label>
            <select class="form-select form-select-sm border-primary-subtle shadow-sm" v-model="edificioSeleccionado">
              <option value="" disabled>Seleccione un edificio...</option>
              <option v-for="edificio in edificiosLista" :key="edificio.id" :value="String(edificio.id)">
                {{ edificio.nombre_consorcio.toUpperCase() }} - {{ edificio.direccion }} {{ edificio.altura }}
              </option>
            </select>
          </div>
        </div>

        <hr class="text-muted my-2">

        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0 text-secondary fw-bold" style="font-size: 0.9rem;">Desglose de Unidades (Padrones)</h6>
          <button type="button" @click="agregarPadronVacio" class="btn btn-sm py-0 btn-outline-primary shadow-sm" style="font-size: 0.8rem;">
            <i class="bi bi-plus-circle me-1"></i> Añadir Padrón
          </button>
        </div>

        <div class="lista-padrones table-scroll-container px-1">
          <div v-for="(padron, index) in padronesLocales" :key="index" class="card mb-2 border-0 shadow-sm border-start border-3 border-primary">
            <div class="card-body p-2 bg-white">
              <div class="row g-2 align-items-end mb-1">
                <div class="col-md-4">
                  <label class="form-label x-small text-muted mb-0">Tipo de Unidad</label>
                  <select class="form-select form-select-sm shadow-none border-secondary-subtle" v-model="padron.tipo">
                    <option value="" disabled>Seleccione tipo...</option>
                    <option value="DEPARTAMENTO">DEPARTAMENTO</option>
                    <option value="COCHERA">COCHERA</option>
                    <option value="BAULERA">BAULERA</option>
                    <option value="LOCAL_COMERCIAL">LOCAL COMERCIAL</option>
                    <option value="OFICINA">OFICINA</option>
                    <option value="CASA">CASA</option>
                    <option value="TERRENO">TERRENO</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label x-small text-muted mb-0">Estado</label>
                  <select class="form-select form-select-sm shadow-none border-secondary-subtle" v-model="padron.estado">
                    <option value="Activo">ACTIVO</option>
                    <option value="Inactivo">INACTIVO</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <button type="button" 
                          class="btn btn-sm w-100 position-relative py-1 shadow-none" 
                          :class="padron.observaciones ? 'btn-info text-white' : 'btn-outline-secondary'"
                          style="font-size: 0.8rem;"
                          @click="abrirModoComentario(index)">
                    <i class="bi bi-chat-text me-1"></i> 
                    {{ padron.observaciones ? 'Ver Comentario' : 'Comentario' }}
                    <span v-if="padron.observaciones" class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                      <span class="visually-hidden">Comentario activo</span>
                    </span>
                  </button>
                </div>
                <div class="col-md-1 text-end">
                  <button type="button" class="btn btn-sm btn-outline-danger w-100 py-1 shadow-none" @click="eliminarPadron(index)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
              <div class="row g-2">
                <div class="col-md-3">
                  <label class="form-label x-small text-muted mb-0">Nº Unidad</label>
                  <input type="text" class="form-control form-control-sm shadow-none border-secondary-subtle" v-model="padron.unidad">
                </div>
                <div class="col-md-3">
                  <label class="form-label x-small text-muted mb-0">Piso</label>
                  <input type="text" class="form-control form-control-sm shadow-none border-secondary-subtle" v-model="padron.piso">
                </div>
                <div class="col-md-3">
                  <label class="form-label x-small text-muted mb-0">Depto</label>
                  <input type="text" class="form-control form-control-sm text-uppercase shadow-none border-secondary-subtle" v-model="padron.depto">
                </div>
              </div>
            </div>
          </div>
          <div v-if="padronesLocales.length === 0" class="alert alert-light text-center border text-muted py-2 small">
            No hay padrones cargados. Haga clic en "Añadir Padrón".
          </div>
        </div>
      </div>

      <div v-if="modoComentario" class="p-3 bg-white rounded">
        <label class="form-label small text-muted fw-bold">Escriba un comentario o detalle interno para este padrón:</label>
        <textarea class="form-control shadow-sm border-secondary-subtle mb-4" rows="6" v-model="comentarioTemporal" placeholder="Ej: Unidad en refacción, consultar con el propietario..."></textarea>
        
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary px-3 shadow-sm" @click="modoComentario = false">Cancelar</button>
          <button class="btn btn-info text-white px-3 shadow-sm" @click="guardarComentarioEnMemoria">Aplicar y Volver</button>
        </div>
      </div>

    </template>

    <template #footer v-if="!modoComentario">
      <button type="button" class="btn btn-secondary btn-sm px-4 shadow-sm" @click="cerrarModal" :disabled="guardando">
        Cerrar
      </button>
      <button type="button" class="btn btn-primary btn-sm px-4 shadow-sm" @click="confirmarGuardado" :disabled="guardando">
        <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-cloud-check me-2"></i> {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </template>
    
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas';
import { completarCargaUnidadesService } from '@/Services/api/Impuestos/expensasApi.js';

const props = defineProps({
  show: { type: Boolean, required: true },
  unidad: { type: Object, required: true }, 
  padrones: { type: Array, required: true },
  edificiosLista: { type: Array, required: true } 
});

const emit = defineEmits(['close', 'recargar']);

const guardando = ref(false);
const estadoSys = ref('');
const edificioSeleccionado = ref('');
const padronesLocales = ref([]);

// NUEVO: Variable para controlar la vista interna
const modoComentario = ref(false); 
const indexPadronActivo = ref(null); 
const comentarioTemporal = ref('');

onMounted(() => {
  const estadoRaw = props.unidad.estado || 'Activo';
  estadoSys.value = estadoRaw.charAt(0).toUpperCase() + estadoRaw.slice(1).toLowerCase();
  
  edificioSeleccionado.value = '';
  if (props.padrones && props.padrones.length > 0 && props.padrones[0].id_edificio != null) {
    edificioSeleccionado.value = String(props.padrones[0].id_edificio);
  }

  if (props.padrones && props.padrones.length > 0) {
    padronesLocales.value = JSON.parse(JSON.stringify(props.padrones));
  } else {
    padronesLocales.value = [];
    agregarPadronVacio();
  }
});

const agregarPadronVacio = () => {
  padronesLocales.value.push({
    id: null,
    tipo: '',
    estado: 'Activo',
    unidad: '',
    piso: '',
    depto: '',
    observaciones: '' 
  });
};

const eliminarPadron = (index) => {
  if (padronesLocales.value[index].id) {
    alertas.confirmar('¿Eliminar esta fila?', 'Si guardas los cambios, este padrón se borrará del sistema.').then((result) => {
      if (result.isConfirmed) {
        padronesLocales.value.splice(index, 1);
      }
    });
  } else {
    padronesLocales.value.splice(index, 1);
  }
};

// Modificado para activar la Vista 2
const abrirModoComentario = (index) => {
  indexPadronActivo.value = index;
  comentarioTemporal.value = padronesLocales.value[index].observaciones || '';
  modoComentario.value = true; // Oculta formulario, muestra textarea
};

// Modificado para volver a la Vista 1
const guardarComentarioEnMemoria = () => {
  if (indexPadronActivo.value !== null) {
    padronesLocales.value[indexPadronActivo.value].observaciones = comentarioTemporal.value;
  }
  modoComentario.value = false; // Vuelve al formulario principal
};

const confirmarGuardado = async () => {
  if (!edificioSeleccionado.value) {
    alertas.error('Debes asignar un Edificio/Consorcio a la unidad.');
    return;
  }

  const payload = {
    id: props.unidad.casa, 
    edificio: edificioSeleccionado.value,
    estado: estadoSys.value,
    repetir: padronesLocales.value.map(p => ({
      id: p.id,
      piso: p.piso,
      depto: p.depto,
      unidad: p.unidad,
      tipo: p.tipo,
      comentario: p.observaciones, 
      estado: p.estado
    }))
  };

  guardando.value = true;
  try {
    const response = await completarCargaUnidadesService(payload);
    alertas.success(response.data.message || 'Datos guardados exitosamente.');
    emit('recargar');
    cerrarModal();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alertas.error(error.response.data.message);
    } else {
      alertas.error('Error crítico al intentar guardar los cambios.');
    }
  } finally {
    guardando.value = false;
  }
};

const cerrarModal = () => {
  if (guardando.value) return;
  emit('close');
};
</script>

<style scoped>
.x-small {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-scroll-container {
  /* Bajamos de 45vh a 30vh para asegurar que el botón Guardar siempre quede a la vista */
  max-height: 30vh; 
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Un pequeño padding extra abajo para que el último botón de eliminar no quede pegado al borde */
  padding-bottom: 10px; 
}

/* Opcional: Para que la barra de scroll se vea más fina y elegante (estilo moderno) */
.table-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.table-scroll-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
</style>