<template>
  <div class="container-fluid">
    <div class="row vh-50">

      <!-- IZQUIERDA: FORMULARIO -->
      <div class="col-12 col-md-6 h-100 overflow-auto border-end">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-2">

            <form @submit.prevent="handleSubmit">

              <!-- FILA 1 -->
              <div class="row g-2 mb-2">
                <div class="col-6 col-md-2">
                  <label class="form-label fw-semibold small">Folio</label>
                  <input
                    type="number"
                    v-model="form.folio"
                    class="form-control form-control-sm text-center"
                    required
                  />
                </div>

                <div class="col-12 col-md-8">
                  <label class="form-label fw-semibold small">Nombre del Inquilino</label>
                  <input
                    type="text"
                    v-model="form.nombre"
                    class="form-control form-control-sm"
                    required
                  />
                </div>

                <div class="col-6 col-md-2">
                  <label class="form-label fw-semibold small">C/Meses</label>
                  <input
                    type="number"
                    v-model="form.cantidad_meses"
                    class="form-control form-control-sm"
                    required
                  />
                </div>
              </div>

              <!-- FILA 2 -->
              <div class="row g-2 mb-2">
                <div class="col-md-4">
                  <label class="form-label fw-semibold small">Monto Alquiler</label>
                  <div class="input-group input-group-sm">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      v-model="form.monto_alquiler"
                      class="form-control"
                      required
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold small">Monto Documento</label>
                  <div class="input-group input-group-sm">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      v-model="form.monto_documento"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold small">Monto Contrato</label>
                  <div class="input-group input-group-sm">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      v-model="form.monto_contrato"
                      class="form-control"
                    />
                  </div>
                </div>
              </div>

              <!-- FILA 3 -->
              <div class="row g-2 mb-2 align-items-end border-bottom pb-2">
                <div class="col-6 col-md-2">
                  <label class="form-label fw-semibold small">C/Hojas</label>
                  <input
                    type="number"
                    v-model="form.hojas"
                    class="form-control form-control-sm"
                    required
                  />
                </div>

                <div class="col-6 col-md-2">
                  <label class="form-label fw-semibold small">Informe</label>
                  <select
                    v-model="form.informe"
                    class="form-select form-select-sm"
                  >
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                </div>

                <div class="col-md-2">
                  <label class="form-label fw-semibold small">C/ Informes</label>
                  <input
                    type="number"
                    v-model="form.cantidad_informes"
                    class="form-control form-control-sm"
                  />
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold small">Tipo Contrato</label>
                  <select
                    v-model="form.tipo_contrato"
                    class="form-select form-select-sm"
                    required
                  >
                    <option disabled value="">Seleccione</option>
                    <option value="Vivienda">Vivienda</option>
                    <option value="Comercio">Comercio</option>
                    <option value="Vivienda Comercial">Viv. Comercial</option>
                    <option value="Cochera">Cochera</option>
                  </select>
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold small">Inicio Contrato</label>
                  <input
                    type="date"
                    v-model="form.fecha_inicio"
                    class="form-control form-control-sm"
                    required
                  />
                </div>
              </div>

              <!-- BOTONES -->
              <div class="row g-2 justify-content-end mt-2">
                <div class="col-auto">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    @click="resetForm"
                  >
                    Limpiar
                  </button>
                </div>

                <div class="col-auto">
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm"
                  >
                    Calcular
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      </div>

      <!-- DERECHA: ESPACIO PARA TABLA (DESPUÉS) -->
      <div class="col-12 col-md-6 h-100 overflow-auto">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-2 text-muted d-flex align-items-center justify-content-center">
            <ResultadoSellado />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ResultadoSellado from './ResultadoSellado.vue';

const form = ref({
  folio: '',
  nombre: '',
  cantidad_meses: '',
  monto_alquiler: '',
  monto_documento: '',
  monto_contrato: '',
  hojas: '',
  informe: 'NO',
  cantidad_informes: 0,
  tipo_contrato: '',
  fecha_inicio: ''
});

const handleSubmit = () => {
  console.log('Datos enviados:', form.value);
};

const resetForm = () => {
  Object.keys(form.value).forEach(k => {
    form.value[k] = k === 'informe' ? 'NO' : '';
  });
};
</script>
