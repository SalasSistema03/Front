<template>
  <div v-if="datos?.data">
    <h6 class=" mb-4 text-uppercase  small text-muted text-center">Resultados del Cálculo</h6>
    <form class="row g-3">

      <div class="col-12 col-md-4">
        <label class="form-label small  text-secondary">Total Contrato</label>
        <input type="text" class="form-control form-control-sm bg-light shadow-sm"
          :value="formatearMoneda(datos.data.total_contrato)" disabled />
      </div>

      <div class="col-12 col-md-4">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <label class="form-label small text-secondary mb-0">Prop. Alquiler</label>
          <!-- Badge pequeño y sutil -->

          <span v-if="datos.data.monto_alquiler > 1500 && datos.data.inq_prop == 'NO' && (datos.data.tipo_contrato == 2 || datos.data.tipo_contrato == 3)"
            class="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle"
            style="font-size: 0.65rem;">
            + IVA
          </span>
        </div>
        <input type="text" class="form-control form-control-sm bg-light shadow-sm" :value=" formatearMoneda(datos.data.prop_alquiler)"
          disabled />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small  text-secondary">Prop. Doc.</label>
        <input type="text" class="form-control form-control-sm  bg-light shadow-sm" :value="formatearMoneda(datos.data.prop_doc)"
          disabled />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small text-secondary">Gasto Adm.</label>
        <input type="number" step="0.01" class="form-control form-control-sm bg-white shadow-sm"
          v-model="gastoAdministrativoLocal" />
      </div>

      <!-- IVA Gasto. Se actualiza solo -->
      <div class="col-12 col-md-4">
        <label class="form-label small text-secondary">IVA Gasto</label>
        <input type="text" class="form-control form-control-sm bg-light shadow-sm"
          :value="formatearMoneda(ivaGastoCalculado)" disabled />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small text-secondary">Sellado</label>
        <input type="text" class="form-control form-control-sm  bg-light shadow-sm"
          :value="formatearMoneda(datos.data.sellado)" disabled />
      </div>

      <div class="col-12 col-md-6">
        <label class="form-label small  text-secondary">Valor Informe</label>
        <input type="text" class="form-control form-control-sm  shadow-sm"
          :value="formatearMoneda(datos.data.valor_informe)" disabled />
      </div>

      <div class="col-12 col-md-6 d-flex align-items-end">
        <button type="button" class="btn btn-success btn-sm w-100 shadow-sm " @click="guardarRegistro"
          :disabled="cargando">
          <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-cloud-arrow-up me-2"></i>
          {{ cargando ? 'Guardando...' : 'Confirmar y Guardar' }}
        </button>
      </div>

    </form>
  </div>

  <div v-else class="d-flex flex-column align-items-center justify-content-center py-5 border rounded bg-light-subtle">
    <div class="spinner-grow spinner-grow-sm text-primary mb-3" role="status"></div>
    <span class="text-muted small fw-semibold">Esperando resultados de cálculo...</span>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { alertas } from '@/utils/alertas';

const props = defineProps({
  datos: {
    type: Object,
    default: () => ({ data: {} })
  }
});

const emit = defineEmits(['registroGuardado']);
const cargando = ref(false);

// Creamos una referencia local para el gasto administrativo
// Se inicializa con el valor que llega de props
const gastoAdministrativoLocal = ref(props.datos?.data?.gasto_administrativo || 0);

// Sincronizar si los datos externos cambian (por ejemplo, al hacer un nuevo cálculo)
watch(() => props.datos?.data?.gasto_administrativo, (nuevoValor) => {
  gastoAdministrativoLocal.value = nuevoValor;
});

// Calculamos el IVA automáticamente basado en el gasto local
const ivaGastoCalculado = computed(() => {
  const valor = parseFloat(gastoAdministrativoLocal.value) || 0;
  return valor * 0.21;
});

const guardarRegistro = async () => {
  cargando.value = true;
  // IMPORTANTE: Enviamos los valores actualizados al padre
  if (!gastoAdministrativoLocal.value) {
    alertas.error('Por favor, ingresa un valor para el Gasto Administrativo.');
    cargando.value = false;
    return;
  }
  const datosFinales = {
    ...props.datos.data,
    gasto_administrativo: gastoAdministrativoLocal.value,
    iva_gasto_adm: ivaGastoCalculado.value
  };
  emit('registroGuardado', datosFinales);
  cargando.value = false;
}

const formatearMoneda = (valor) => {
  if (valor === undefined || valor === null) return '$ 0,00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(valor);
};
</script>
<style scoped>
input[disabled] {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}
</style>
