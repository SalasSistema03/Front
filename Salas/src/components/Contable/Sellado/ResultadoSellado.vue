<template>
  <div v-if="datos?.data">
    <h6 class="text-center mb-3">Resultados</h6>
    <form class="row g-3" >

      <!-- Total Contrato / Prop. Alquiler / Prop. Doc -->
      <div class="col-md-4">
        <label class="form-label small fw-semibold">Total Contrato</label>
        <input type="text" class="form-control form-control-sm" :value="formatearMoneda(datos.data.total_contrato)"
          disabled />
      </div>
      <div class="col-md-4">
        <label class="form-label small fw-semibold">Prop. Alquiler</label>
        <input type="text" class="form-control form-control-sm text-center" :value="datos.data.prop_alquiler"
          disabled />
      </div>
      <div class="col-md-4">
        <label class="form-label small fw-semibold">Prop. Doc.</label>
        <input type="text" class="form-control form-control-sm text-center" :value="datos.data.prop_doc" disabled />
      </div>

      <!-- Gasto Adm / IVA Gasto / Sellado -->
      <div class="col-md-4">
        <label class="form-label small fw-semibold">Gasto Adm.</label>
        <input type="text" class="form-control form-control-sm"
          :value="formatearMoneda(datos.data.gasto_administrativo)" disabled />
      </div>
      <div class="col-md-4">
        <label class="form-label small fw-semibold">IVA Gasto</label>
        <input type="text" class="form-control form-control-sm text-center"
          :value="formatearMoneda(datos.data.iva_gasto_adm)" disabled />
      </div>
      <div class="col-md-4">
        <label class="form-label small fw-semibold">Sellado</label>
        <input type="text" class="form-control form-control-sm text-center" :value="formatearMoneda(datos.data.sellado)"
          disabled />
      </div>

      <!-- Valor Informe -->
      <div class="d-flex justify-content-between">
        <div class="col-4 col-md-4">
          <label class="form-label small fw-semibold">Valor Informe</label>
          <input type="text" class="form-control form-control-sm text-center fw-semibold"
            :value="formatearMoneda(datos.data.valor_informe)" disabled />
        </div>

        <div class="col-4 col-md-4 align-self-end">
          <!-- Boton para guardar -->
          <button type="button" class="btn btn-primary btn-sm w-100 h-100" @click="guardarRegistro"
            :disabled="cargando">
            <span v-if="cargando" class="spinner-border spinner-border-sm me-1"></span>
            {{ cargando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>


    </form>
  </div>

  <div v-else class="d-flex flex-column align-items-center justify-content-center py-5">
    <div class="spinner-border spinner-border-sm text-light-emphasis mb-3" role="status"></div>
    <span class="small">Esperando cálculos...</span>
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
