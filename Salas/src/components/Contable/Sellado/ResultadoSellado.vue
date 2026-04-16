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
        <label class="form-label small  text-secondary">Prop. Alquiler</label>
        <input type="text" class="form-control form-control-sm  bg-light shadow-sm" 
          :value="datos.data.prop_alquiler" disabled />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small  text-secondary">Prop. Doc.</label>
        <input type="text" class="form-control form-control-sm  bg-light shadow-sm" 
          :value="datos.data.prop_doc" disabled />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small  text-secondary">Gasto Adm.</label>
        <input type="text" class="form-control form-control-sm bg-light shadow-sm"
          :value="formatearMoneda(datos.data.gasto_administrativo)" disabled />
      </div>

      <div class="col-12 col-md-4">
        <label class="form-label small  text-secondary">IVA Gasto</label>
        <input type="text" class="form-control form-control-sm  bg-light shadow-sm"
          :value="formatearMoneda(datos.data.iva_gasto_adm)" disabled />
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
        <button type="button" class="btn btn-success btn-sm w-100 shadow-sm " 
          @click="guardarRegistro" :disabled="cargando">
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
import { ref } from 'vue';

const props = defineProps({
  datos: {
    type: Object,
    default: () => ({})
  }
});
// ESTA LÍNEA FALTA:
const emit = defineEmits(['registroGuardado']);
// Estado para manejar la carga o errores
const cargando = ref(false);

const guardarRegistro = async () => {
  cargando.value = true;
  emit('registroGuardado', props.datos.data); // avisamos al padre
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
