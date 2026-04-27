<template>
  <baseModal :show="show" size="lg" @close="emit('close')">
    <template #title>Armar Broches</template>
    <template #body>

      <div class="row g-4">
        <div class="col-md-6">
          <h6 class="text-primary">TGI - Administra L</h6>
          <p class="fw-bold text-muted">Monto Total: {{ montoTotal.total }}</p>

          <label for="cant_broches" class="form-label">Cantidad de broches</label>
          <div class="input-group mb-2">
            <input type="number" class="form-control form-control-sm" placeholder="Ej: 3" v-model="cant_broches">
            <button type="button" class="btn btn-outline-primary btn-sm" @click="calcularBroches">
              <i class="bi bi-calculator"></i> Calcular
            </button>
          </div>

          <div v-if="resultado_broche">
            <label class="form-label mt-3">Resultado</label>
            <ul class="list-group">
              <li class="list-group-item" v-for="(broche, index) in resultado_broche" :key="index">
                Broche {{ index + 1 }}: ${{ parseFloat(broche.importe).toFixed(2) }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Columna Salas -->
        <div class="col-md-6" v-if="props.impuesto !== 'gas'">
          <h6 class="text-success">TGI - Salas</h6>
          <p class="fw-bold text-muted" id="monto_total_salas">Monto Total Salas: {{ montoTotalSalas }}</p>

          <label for="cant_broches_salas" class="form-label">Cantidad de broches</label>
          <input type="text" id="cant_broches_salas" class="form-control form-control-sm mb-3" value="1" readonly>
        </div>
      </div>


    </template>

    <template #footer>
      <div class="modal-footer justify-content-between">
        <button type="submit" class="btn btn-primary btn-sm" id="btn_guardar_broches_tgi" @click="guardarNumeroBroches">
          <i class="bi bi-save"></i> Guardar Broches TGI
        </button>
        <div class="d-flex gap-2" v-if="props.impuesto !== 'gas'">
          <button type="submit" class="btn btn-success btn-sm" id="btn_guardar_broches_salas"
            @click="guardarNumeroBrochesSalas">
            <i class="bi bi-save"></i> Guardar Broches Salas
          </button>
        </div>
      </div>
    </template>
  </baseModal>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { sumarMontos } from '@/Services/api/Impuestos/tgiApi'
import { mostrarBroches } from '@/Services/api/Impuestos/tgiApi'
import { guardarBroches } from '@/Services/api/Impuestos/tgiApi'
import { guardarBrochesSalas } from '@/Services/api/Impuestos/tgiApi'



const { showError, showSuccess, } = useToast();
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  impuesto: {
    type: String,
    default: ''
  },
  mes: {
    type: Number,
    default: null
  },
  anio: {
    type: Number,
    default: null
  }
})

const montoTotal = ref(0)
const montoTotalSalas = ref(0)
const cant_broches = ref(null)
const resultado_broche = ref(null)

const totalMontoCargado = async () => {
  try {
    const response = await sumarMontos({
      impuesto: props.impuesto,
      mes: props.mes,
      anio: props.anio
    })
    montoTotal.value = response.data.total
    montoTotalSalas.value = response.data.totalSalas
  } catch (error) {
    console.log(error)
    showError('Error al traer los montos')
  }
}

const guardarNumeroBroches = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: props.mes,
    anio: props.anio,
    cant_broches: cant_broches.value
  }
  try {
    await guardarBroches(form)
    showSuccess('Broches guardados correctamente')
    emit('close')
  } catch (error) {
    console.log(error)
    showError('Error al guardar los broches')
  }
}

const guardarNumeroBrochesSalas = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: props.mes,
    anio: props.anio
  }
  try {
    await guardarBrochesSalas(form)
    showSuccess('Broches guardados correctamente')
    emit('close')
  } catch (error) {
    console.log(error)
    showError('Error al guardar los broches')
  }
}

const calcularBroches = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: props.mes,
    anio: props.anio,
    cant_broches: cant_broches.value
  }
  try {
    const response = await mostrarBroches(form)
    resultado_broche.value = response.data.broches
    showSuccess('Broches calculados correctamente')
  } catch (error) {
    console.log(error)
    showError('Error al calcular los broches')
  }
}


const emit = defineEmits(['close'])

watch(() => props.show, (newVal) => {
  if (newVal) {
    totalMontoCargado()
  }
})
</script>
