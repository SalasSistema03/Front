<template>
  <baseModal :show="show" size="lg" @close="emit('close')">
    <template #title>Armar Broches</template>
    <template #body>
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="{ active: activeTab === 'general' }"
            @click="activeTab = 'general'"
          >
            Broches generales
          </button>
        </li>
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="{ active: activeTab === 'especial' }"
            @click="activeTab = 'especial'"
          >
            Broches especiales
          </button>
        </li>
      </ul>

      <div v-show="activeTab === 'general'">
        <div class="card">
          <div class="card-body">
            <div class="row g-2 text-center">
              <div class="col-4">
                <div class="border rounded p-1 bg-light h-100">
                  <div class="text-muted">
                    <h6 class="text-primary">{{ props.impuesto.toUpperCase() }} - Administra L</h6>
                    <p class="fw-bold text-muted">
                      Monto Total: ${{ formatearMoneda(montoTotal?.total ?? montoTotal) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="border rounded p-1 bg-light h-100">
                  <div class="text-muted">
                    <h6 class="text-success">{{ props.impuesto.toUpperCase() }} - Salas</h6>
                    <p class="fw-bold text-muted">
                      Monto Total: ${{ formatearMoneda(montoTotalSalas) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="border rounded p-1 bg-light h-100">
                  <div class="text-muted">
                    <h6 class="text-danger">{{ props.impuesto.toUpperCase() }} - Seguir Pagando</h6>
                    <p class="fw-bold text-muted">
                      Monto Total: ${{ formatearMoneda(seguir_pagando) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-2">
          <div class="card-header">
            <p class="text-start">Calcular Broche</p>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4 form-group border rounded bg-light h-100">
                <label for="cant_broches" class="form-label">Cantidad de broches</label>
                <div class="input-group mb-2">
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    placeholder="Ej: 3"
                    v-model="cant_broches"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="calcularBroches"
                  >
                    <i class="bi bi-calculator"></i> Calcular
                  </button>
                </div>
                <div v-if="resultado_broche" class="tabla_armar_broche">
                  <div
                    class="w-100 titulo-resultados d-flex align-items-center justify-content-center"
                  >
                    <label class="form-label">Resultado</label>
                  </div>
                  <ul class="list-group" style="max-height: 120px; overflow-y: auto">
                    <li
                      class="list-group-item fw-bold text-muted"
                      v-for="(broche, index) in resultado_broche"
                      :key="index"
                    >
                      Broche {{ index + 1 }}: ${{ formatearMoneda(broche.importe) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'especial'">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <p class="text-start mb-0">Broches especiales</p>
            <span class="text-muted small">Período {{ String(props.mes).padStart(2, '0') }}/{{ props.anio }}</span>
          </div>
          <div class="card-body">
            <div class="row g-2 align-items-end">
              <div class="col-md-6 form-group">
                <label class="form-label">Motivo</label>
                <select
                  class="form-select form-select-sm"
                  v-model="motivoEspecial"
                  @change="cargarPreviewEspecial"
                >
                  <option value="VENCIDA">Vencidas</option>
                  <option value="FUERA_BROCHE">Fuera de broche</option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label class="form-label">Broche</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  :value="etiquetaPreview"
                  disabled
                />
              </div>
            </div>

            <div class="row g-2 text-center mt-3">
              <div class="col-6">
                <div class="border rounded p-1 bg-light h-100">
                  <div class="text-muted">
                    <h6 class="text-primary">Cantidad de boletas</h6>
                    <p class="fw-bold text-muted">{{ cantidadEspecial }}</p>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="border rounded p-1 bg-light h-100">
                  <div class="text-muted">
                    <h6 class="text-success">Monto Total</h6>
                    <p class="fw-bold text-muted">${{ formatearMoneda(totalEspecial) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="cantidadEspecial === 0" class="text-center text-muted mt-3">
              No hay boletas {{ motivoEspecial === 'VENCIDA' ? 'vencidas' : 'fuera de broche' }} para el período
              indicado.
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div
        v-if="activeTab === 'general'"
        class="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2"
      >
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          id="btn_guardar_broches_tgi"
          @click="guardarNumeroBroches"
        >
          <i class="bi bi-save"></i>
          Guardar Broches {{ props.impuesto.toUpperCase() }}
        </button>

        <button
          v-if="props.impuesto !== 'gas'"
          type="submit"
          class="btn btn-success btn-sm"
          id="btn_guardar_broches_salas"
          @click="guardarNumeroBrochesSalas"
        >
          <i class="bi bi-save"></i>
          Guardar Broche {{ props.impuesto.toUpperCase() }} - SALAS
        </button>

        <button
          v-if="props.impuesto !== 'gas'"
          type="submit"
          class="btn btn-danger btn-sm"
          @click="guardarSeguirPagando"
        >
          <i class="bi bi-save"></i>
          Guardar Broche {{ props.impuesto.toUpperCase() }} - SP
        </button>
      </div>

      <div v-else class="d-flex justify-content-between align-items-center w-100">
        <button type="button" class="btn btn-secondary btn-sm" @click="activeTab = 'general'">
          Volver
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="armarEspecial"
          :disabled="armandoEspecial"
        >
          <i class="bi bi-save"></i> {{ textoGuardarEspecial }}
        </button>
      </div>
    </template>
  </baseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { formatearMoneda } from '@/utils/formatters'
import { sumarMontos } from '@/Services/api/Impuestos/tgiApi'
import { mostrarBroches } from '@/Services/api/Impuestos/tgiApi'
import { guardarBroches } from '@/Services/api/Impuestos/tgiApi'
import { guardarBrochesSalas } from '@/Services/api/Impuestos/tgiApi'
import { guardarBrochesSeguirPagando } from '@/Services/api/Impuestos/tgiApi'
import { armarBrocheEspecial } from '@/Services/api/Impuestos/tgiApi'
import { exportarBrocheEspecial } from '@/Services/api/Impuestos/tgiApi'

const { showError, showSuccess } = useToast()
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  impuesto: {
    type: String,
    default: '',
  },
  mes: {
    type: Number,
    default: null,
  },
  anio: {
    type: Number,
    default: null,
  },
  dia: {
    type: Number,
    default: null,
  },
})

const montoTotal = ref(0)
const montoTotalSalas = ref(0)
const cant_broches = ref(null)
const resultado_broche = ref(null)
const seguir_pagando = ref(0)

const activeTab = ref('general')
const motivoEspecial = ref('VENCIDA')
const brochesEspeciales = ref([])
const totalEspecial = ref(0)
const cargandoPreview = ref(false)
const armandoEspecial = ref(false)

const etiquetaPreview = computed(() => {
  return brochesEspeciales.value?.[0]?.num_broche ?? '-'
})

const textoGuardarEspecial = computed(() => {
  const impuesto = props.impuesto.toUpperCase()
  return motivoEspecial.value === 'VENCIDA'
    ? `Guardar Broche ${impuesto} - VENCIDAS`
    : `Guardar Broche ${impuesto} - POR FUERA`
})

const cantidadEspecial = computed(() => {
  return (brochesEspeciales.value ?? []).reduce((total, broche) => total + (broche.items?.length ?? 0), 0)
})

const totalMontoCargado = async () => {
  try {
    const response = await sumarMontos({
      impuesto: props.impuesto,
      mes: props.mes,
      anio: props.anio,
      dia: props.dia,
    })
    montoTotal.value = response.data.total
    montoTotalSalas.value = response.data.totalSalas
    seguir_pagando.value = response.data.totalSeguirPagando
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
    cant_broches: cant_broches.value,
    dia: props.dia,
  }
  try {
    await guardarBroches(form)
    showSuccess('Broches guardados correctamente')
    emit('success')
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
    anio: props.anio,
  }
  try {
    await guardarBrochesSalas(form)
    showSuccess('Broches guardados correctamente')
    emit('success')
    emit('close')
  } catch (error) {
    console.log(error)
    showError('Error al guardar los broches')
  }
}

const guardarSeguirPagando = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: props.mes,
    anio: props.anio,
  }
  try {
    await guardarBrochesSeguirPagando(form)
    showSuccess('Broche guardado correctamente')
    emit('success')
    emit('close')
  } catch (error) {
    showError('Error al guardar los broches')
    console.log(error)
  }
}

const calcularBroches = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: props.mes,
    anio: props.anio,
    dia: props.dia,
    cant_broches: cant_broches.value,
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

const cargarPreviewEspecial = async () => {
  if (!props.mes || !props.anio) {
    showError('Seleccioná mes y año para ver el broche especial')
    return
  }

  cargandoPreview.value = true
  try {
    const response = await exportarBrocheEspecial({
      impuesto: props.impuesto,
      mes: props.mes,
      anio: props.anio,
      motivo: motivoEspecial.value,
    })
    brochesEspeciales.value = response.data?.broches ?? []
    totalEspecial.value = response.data?.total_general ?? 0
  } catch (error) {
    console.error('Error al obtener el broche especial', error)
    brochesEspeciales.value = []
    totalEspecial.value = 0
    showError('Error al obtener el broche especial')
  } finally {
    cargandoPreview.value = false
  }
}

const armarEspecial = async () => {
  if (!props.mes || !props.anio) {
    showError('Seleccioná mes y año antes de armar el broche')
    return
  }

  armandoEspecial.value = true
  try {
    const response = await armarBrocheEspecial({
      impuesto: props.impuesto,
      mes: props.mes,
      anio: props.anio,
      motivo: motivoEspecial.value,
    })

    if (!response.data?.num_broche) {
      showError(response.data?.message ?? 'No hay boletas para armar')
      return
    }

    showSuccess(`Broche ${response.data.num_broche} armado correctamente`)
    emit('success')
    await cargarPreviewEspecial()
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al armar el broche especial'
    showError(mensaje)
  } finally {
    armandoEspecial.value = false
  }
}

const emit = defineEmits(['close', 'success'])

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      activeTab.value = 'general'
      totalMontoCargado()
    } else {
      cant_broches.value = null
      resultado_broche.value = null
      montoTotal.value = 0
      montoTotalSalas.value = 0
      seguir_pagando.value = 0
      brochesEspeciales.value = []
      totalEspecial.value = 0
    }
  },
)

watch(activeTab, (nuevo) => {
  if (nuevo === 'especial') {
    cargarPreviewEspecial()
  }
})
</script>
