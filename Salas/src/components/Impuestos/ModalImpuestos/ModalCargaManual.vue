<template>
  <baseModal :show="show" size="lg" @close="emit('close')">
    <template #title>Carga manual de {{ props.impuesto?.toUpperCase() }}</template>
    <template #body>
      <div class="row form-group m-0 p-0">
        <div class="col-md-2 mb-2">
          <label class="form-label">Folio</label>
          <input type="text" class="form-control form-control-sm" v-model="folio">
        </div>
        <div class="col-md-4 mb-2">
          <label class="form-label">Empresa</label>
          <select class="form-select form-select-sm" v-model="empresa">
            <option value="1">Atilio Salas SRL</option>
            <option value="2">Dolly J. Pianesi</option>
            <option value="3">Giusiano Maria Florencia</option>
          </select>
        </div>
        <div class="col-md-6 d-flex align-items-end justify-content-center mb-2">
          <button type="button" class="btn btn-primary btn-sm w-50" @click="buscarFolio(folio, empresa)">
            buscar</button>
        </div>

        <div v-if="showTabla" class="table-responsive tabla-modifica-carga-impuestos">
          <table class="table table-striped table-hover tabla-impuestos">
            <thead>
              <tr>
                <th>Folio</th>
                <th v-if="['tgi', 'agua', 'api'].includes(props.impuesto)">Partida</th>
                <th v-if="props.impuesto === 'tgi'">Clave</th>
                <th v-if="props.impuesto === 'agua'">Punto</th>
                <th v-if="props.impuesto === 'gas'">Persona</th>
                <th v-if="props.impuesto === 'gas'">Cliente</th>
                <th>Administra</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resultado in resultadoCarga.data" :key="resultado.folio">
                <td>{{ resultado.folio }}</td>
                <td v-if="['tgi', 'agua', 'api'].includes(props.impuesto)">{{ resultado.partida }}</td>
                <td v-if="props.impuesto === 'tgi'">{{ resultado.clave }}</td>
                <td v-if="props.impuesto === 'agua'">{{ resultado.clave }}</td>
                <td v-if="props.impuesto === 'gas'">{{ resultado.partida }}</td>
                <td v-if="props.impuesto === 'gas'">{{ resultado.clave }}</td>
                <td>{{ resultado.administra }}</td>
                <td><button class="btn btn-primary btn-sm" @click="seleccionarImpuesto(resultado)">Seleccionar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="row form-group m-0 p-0" v-if="impuestoSeleccionado">
        <div class="col-md-4">
          <label class="form-label">Partida</label>
          <input type="text" class="form-control form-control-sm" disabled :value="impuestoSeleccionado.partida">
        </div>
        <div class="col-md-2" v-if="props.impuesto !== 'api'">
          <label class="form-label">{{ props.impuesto === 'agua' ? 'Punto' : 'Clave' }}</label>
          <input type="text" class="form-control form-control-sm" disabled :value="impuestoSeleccionado.clave">
        </div>
        <div class="col-md-2">
          <label class="form-label">Administra</label>
          <input type="text" class="form-control form-control-sm" disabled :value="impuestoSeleccionado.administra">
        </div>
        <div class="col-md-2">
          <label class="form-label">Fecha</label>
          <input type="date" class="form-control form-control-sm" v-model="fecha">
        </div>
        <div class="col-md-2">
          <label class="form-label">Importe</label>
          <input type="text" inputmode="numeric" class="form-control form-control-sm"
            :value="formatearMonto(importe)" @input="actualizarImporte">
        </div>
        <div class="col-md-3 mt-2">
          <label class="form-label">Motivo de carga</label>
          <select class="form-select form-select-sm" v-model="motivoCarga">
            <option value="">Seleccionar motivo</option>
            <option value="NORMAL">Normal</option>
            <option value="VENCIDA">Vencida</option>
            <option value="FUERA_BROCHE">Fuera de broche</option>
          </select>
        </div>

        <div class="col-md-2 mt-2" v-if="props.impuesto === 'agua'">
          <label class="form-label">Fecha</label>
          <input type="date" class="form-control form-control-sm" v-model="fecha2">
        </div>
        <div class="col-md-2 mt-2" v-if="props.impuesto === 'agua'">
          <label class="form-label">Importe</label>
          <input type="text" inputmode="numeric" class="form-control form-control-sm"
            :value="formatearMonto(importe2)" @input="actualizarImporte2">
        </div>
      </div>
    </template>

    <template #footer>
      <div class="d-flex justify-content-between align-items-center w-100">
        <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
        <button type="button" class="btn btn-primary btn-sm" @click="guardarCambios()">Cargar</button>
      </div>
    </template>
  </baseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { useCurrencyInput } from '@/composables/useCurrencyInput'
import { cargaManual, cargaNuevoManual } from '@/Services/api/Impuestos/tgiApi'

const { showError, showSuccess } = useToast()
const { formatearMonto, actualizarMonto: actualizarMontoInput } = useCurrencyInput()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  impuesto: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'success'])

const empresa = ref('')
const folio = ref('')
const resultadoCarga = ref([])
const showTabla = ref(false)
const impuestoSeleccionado = ref(null)
const fecha = ref('')
const importe = ref('')
const fecha2 = ref('')
const importe2 = ref('')
const motivoCarga = ref('')

const seleccionarImpuesto = (impuesto) => {
  impuestoSeleccionado.value = impuesto
}

const actualizarImporte = (event) => {
  actualizarMontoInput(event, (valor) => {
    importe.value = valor
  })
}

const actualizarImporte2 = (event) => {
  actualizarMontoInput(event, (valor) => {
    importe2.value = valor
  })
}

const buscarFolio = async () => {
  const form = {
    impuesto: props.impuesto,
    folio: folio.value,
    empresa: empresa.value
  }
  try {
    const response = await cargaManual(form)
    resultadoCarga.value = response
    showSuccess('Carga manual exitosa')
    showTabla.value = true
  } catch (error) {
    console.error('Error al cargar manualmente', error)
    showError('Error al cargar manualmente')
  }
}

const guardarCambios = async () => {
  if (!impuestoSeleccionado.value) {
    showError('Seleccioná un registro del padrón antes de cargar')
    return
  }
  if (!motivoCarga.value) {
    showError('Seleccioná el motivo de carga')
    return
  }

  const form = {
    impuesto: props.impuesto,
    partida: impuestoSeleccionado.value.partida,
    fecha_vencimiento: fecha.value,
    importe: importe.value,
    fecha_vencimiento2: fecha2.value,
    importe2: importe2.value,
    origen_carga: motivoCarga.value
  }

  if (props.impuesto === 'agua') {
    if (form.importe === '' || form.importe === null || form.importe2 === '' || form.importe2 === null) {
      showError('Debe ingresar el importe para ambos vencimientos')
      return
    }
    if (form.fecha_vencimiento === '' || form.fecha_vencimiento2 === '') {
      showError('Debe ingresar la fecha para ambos vencimientos')
      return
    }
  }

  try {
    await cargaNuevoManual(form)
    showSuccess('Carga manual exitosa')
    resultadoCarga.value = []
    folio.value = ''
    empresa.value = ''
    impuestoSeleccionado.value = null
    fecha.value = ''
    importe.value = ''
    fecha2.value = ''
    importe2.value = ''
    motivoCarga.value = ''
    emit('success')
    emit('close')
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al cargar manualmente'
    showError(mensaje)
  }
}
</script>
