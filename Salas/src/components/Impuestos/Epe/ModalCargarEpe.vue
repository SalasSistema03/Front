<template>
  <BaseModal :show="show" size="" @close="emit('close')">
    <template #title>
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-receipt"></i> <span>{{ esEdicion ? 'Editar EPE' : 'Cargar EPE' }}</span>
      </div>
    </template>
    <template #body>
      <div class="epe-form">
        <!-- Datos del EPE -->
        <div class="form-section">
          <div class="form-section-title">
            <i class="bi bi-file-earmark-text"></i> <span>Datos del EPE</span>
          </div>
          <div class="row g-2">
            <div class="col-7 form-group">
              <label class="form-label"> Nº Cliente <span class="text-danger">*</span> </label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="numero_cliente"
                placeholder="Ingrese Nº de cliente"
              />
            </div>
            <div class="col-5 form-group">
              <label class="form-label"> Plan <span class="text-danger">*</span> </label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="plan"
                placeholder="Plan"
              />
            </div>
            <div class="col-6 form-group">
              <label class="form-label"> Ruta <span class="text-danger">*</span> </label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="ruta"
                placeholder="Ruta"
              />
            </div>
            <div class="col-6 form-group">
              <label class="form-label"> Folio EPE <span class="text-danger">*</span> </label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="folio"
                placeholder="Nº de folio"
              />
            </div>
            <div class="col-12 form-group">
              <label class="form-label"> D.S <span class="text-danger">*</span> </label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model="ds"
                placeholder="Ingrese D.S"
              />
            </div>
          </div>
        </div>
        <!-- Vinculación con Salas -->
        <div class="form-section mt-3">
          <div class="form-section-title">
            <i class="bi bi-building"></i> <span>Vinculación con Salas</span>
          </div>
          <div class="row g-2">
            <div class="col-5 form-group">
              <label class="form-label"> Folio Salas <span class="text-danger">*</span> </label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="folio_salas"
                placeholder="Nº de folio"
              />
            </div>
            <div class="col-7 form-group">
              <label class="form-label"> Empresa <span class="text-danger">*</span> </label>
              <select
                class="form-select form-select-sm"
                v-model="empresa"
                :disabled="folio_salas === null || folio_salas === ''"
              >
                <option value="">Seleccionar empresa</option>
                <option value="1">Central</option>
                <option value="2">Candioti</option>
                <option value="3">Tribunales</option>
              </select>
            </div>
          </div>
          <!-- <div class="form-hint mt-2">
            <i class="bi bi-info-circle"></i>
            <span>El folio Salas determina la empresa asociada.</span>
          </div> -->
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">
        <i class="bi bi-x-lg me-1"></i> Cerrar
      </button>
      <button type="button" class="btn btn-primary btn-sm" @click="guardar">
        <i :class="esEdicion ? 'bi bi-pencil-square' : 'bi bi-upload'" class="me-1"></i>
        {{ esEdicion ? 'Actualizar' : 'Guardar' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useToast } from '@/composables/useToast.js'
import { CargarEpeView, EditarEpeView } from '@/Services/api/Impuestos/epeApi.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  itemEditar: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'guardado'])
const { showWarning, showError, showSuccess } = useToast()

const numero_cliente = ref(null)
const plan = ref('')
const ruta = ref('')
const folio = ref(null)
const ds = ref('')
const folio_salas = ref(null)
const empresa = ref('')

const esEdicion = computed(() => !!props.itemEditar)

// Si se limpia Folio Salas, limpia la empresa seleccionada
watch(folio_salas, (nuevoFolio) => {
  if (nuevoFolio === null || nuevoFolio === '') {
    empresa.value = ''
  }
})

// Cargar datos cuando se abre en modo edición o resetear al cerrar/abrir en modo nuevo
watch(
  () => props.show,
  (abierto) => {
    if (abierto) {
      if (props.itemEditar) {
        numero_cliente.value = props.itemEditar.cliente ?? null
        plan.value = props.itemEditar.plan != null ? String(props.itemEditar.plan) : ''
        ruta.value = props.itemEditar.ruta != null ? String(props.itemEditar.ruta) : ''
        folio.value = props.itemEditar.folio ?? null
        ds.value = props.itemEditar.ds != null ? String(props.itemEditar.ds) : ''
        folio_salas.value = props.itemEditar.propiedad?.empresas?.[0]?.pivot?.folio ?? null
        empresa.value =
          props.itemEditar.propiedad?.empresas?.[0]?.pivot?.empresa_id ??
          props.itemEditar.propiedad?.empresas?.[0]?.id ??
          ''
      } else {
        numero_cliente.value = null
        plan.value = ''
        ruta.value = ''
        folio.value = null
        ds.value = ''
        folio_salas.value = null
        empresa.value = ''
      }
    } else {
      numero_cliente.value = null
      plan.value = ''
      ruta.value = ''
      folio.value = null
      ds.value = ''
      folio_salas.value = null
      empresa.value = ''
    }
  },
)

const validar = () => {
  // Validar Nº Cliente
  if (numero_cliente.value === null || numero_cliente.value === '') {
    showWarning('Debe ingresar el número de cliente')
    return false
  }
  if (Number(numero_cliente.value) < 0) {
    showWarning('El número de cliente no puede ser negativo')
    return false
  }
  if (String(numero_cliente.value).length > 10) {
    showWarning('El número de cliente no puede superar los 10 dígitos')
    return false
  }

  // Validar Plan
  if (plan.value === null || plan.value === '' || String(plan.value).trim() === '') {
    showWarning('Debe ingresar el plan')
    return false
  }

  // Validar Ruta
  if (ruta.value === null || ruta.value === '' || String(ruta.value).trim() === '') {
    showWarning('Debe ingresar la ruta')
    return false
  }

  // Validar Folio (EPE)
  if (folio.value === null || folio.value === '') {
    showWarning('Debe ingresar el folio')
    return false
  }
  if (Number(folio.value) < 0) {
    showWarning('El folio no puede ser negativo')
    return false
  }

  // Validar D.S
  if (ds.value === null || ds.value === '' || String(ds.value).trim() === '') {
    showWarning('Debe ingresar el D.S')
    return false
  }

  // Validar Folio Salas y Empresa
  const tieneFolioSalas = folio_salas.value !== null && folio_salas.value !== ''
  const tieneEmpresa = empresa.value !== ''

  if (!tieneFolioSalas) {
    showWarning('Debe ingresar el número de folio salas')
    return false
  }
  if (!tieneEmpresa) {
    showWarning('Debe seleccionar una empresa para el folio')
    return false
  }
  if (Number(folio_salas.value) < 0) {
    showWarning('El folio salas no puede ser negativo')
    return false
  }
  if (String(folio_salas.value).length > 5) {
    showWarning('El folio salas no puede superar los 5 dígitos')
    return false
  }

  return true
}

const guardar = async () => {
  if (!validar()) return
  try {
    const form = {
      data: {
        id: props.itemEditar?.id,
        numero_cliente: numero_cliente.value,
        plan: plan.value,
        ruta: ruta.value,
        folio: folio.value,
        ds: ds.value,
        folio_salas: folio_salas.value,
        empresa: empresa.value,
      },
    }

    if (esEdicion.value) {
      await EditarEpeView(form)
      showSuccess('EPE actualizado exitosamente')
    } else {
      await CargarEpeView(form)
      showSuccess('EPE cargado exitosamente')
    }

    emit('guardado')
    emit('close')
  } catch (e) {
    const mensajeError = e.response?.data?.resultado || 'Ocurrió un error inesperado'
    console.log('Error:', mensajeError)
    showError(mensajeError)
  }
}
</script>
<style scoped>
.epe-form {
  padding: 2px 2px 4px;
} /* ============================== SECCIONES ============================== */
.form-section {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
}
.form-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #dee2e6;
}
.form-section-title i {
  font-size: 0.9rem;
  color: #0d6efd;
} /* ============================== LABELS ============================== */
.form-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #495057;
}
.form-control,
.form-select {
  border-color: #dee2e6;
  border-radius: 5px;
}
.form-control:focus,
.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.12);
} /* ============================== AYUDA ============================== */
.form-hint {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  color: #6c757d;
}
.form-hint i {
  font-size: 0.75rem;
} /* ============================== FOOTER ============================== */
:deep(.modal-footer) {
  gap: 6px;
}
</style>
