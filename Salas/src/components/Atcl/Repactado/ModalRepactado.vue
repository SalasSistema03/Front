<template>
  <BaseModal :show="show" size="xl" @close="emit('close')">
    <template #title>
      <i
        :class="soloLectura ? 'bi bi-eye me-2' : repactadoData ? 'bi bi-pencil-square me-2' : 'bi bi-cloud-upload me-2'"></i>
      {{ soloLectura ? 'Ver Repactado' : repactadoData ? 'Editar Repactado' : 'Nuevo Repactado' }}
    </template>

    <template #body>
      <div v-if="errorGuardado" class="alert alert-danger py-1 px-2 small mb-2" role="alert">
        <i class="bi bi-exclamation-triangle me-1"></i>{{ errorGuardado }}
      </div>

      <div class="row tasaciones-body-scroll">
        <div class="contrato-seccion-header">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DEL CONTRATO</span>
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-folio">Folio</label>
          <input id="rep-folio" type="text" class="form-control form-control-sm" :value="form.folio" disabled />
        </div>

        <div class="col-md-2 form-group">
          <label for="rep-estado">Estado</label>
          <select id="rep-estado" class="form-control form-control-sm" v-model="form.estadoId"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option v-for="opc in estados" :key="opc.id" :value="opc.id">{{ opc.estado }}</option>
          </select>
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-cierre">Cierre</label>
          <input id="rep-cierre" type="date" class="form-control form-control-sm" :value="form.cierre" disabled />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-plazo">Plazo y Actualización</label>
          <input id="rep-plazo" type="text" class="form-control form-control-sm" v-model="form.plazoActualizacion"
            :disabled="soloLectura" autocomplete="off" />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-condicion">Condición</label>
          <select id="rep-condicion" class="form-control form-control-sm" v-model="form.condicion"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option v-for="opc in opcionesCondicion" :key="opc" :value="opc">{{ opc }}</option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-inicio-contrato">Inicio Contrato</label>
          <input id="rep-inicio-contrato" type="date" class="form-control form-control-sm"
            :value="form.inicioContrato" disabled />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-vencimiento-contrato">Vencimiento Contrato</label>
          <input id="rep-vencimiento-contrato" type="date" class="form-control form-control-sm"
            :value="form.vencimientoContrato" disabled />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-situacion">Situación</label>
          <select id="rep-situacion" class="form-control form-control-sm" v-model="form.situacion"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option v-for="opc in opcionesSituacion" :key="opc" :value="opc">{{ opc }}</option>
          </select>
        </div>
        <div class="col-md-12 form-group">
          <label for="rep-observaciones">Observaciones</label>
          <textarea id="rep-observaciones" class="form-control form-control-sm" v-model="form.observaciones"
            :disabled="soloLectura" autocomplete="off"></textarea>
        </div>

        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DEL INQUILINO</span>
        </div>
        <div class="col-md-4 form-group">
          <label for="rep-inquilino">Apellido y Nombre</label>
          <input id="rep-inquilino" type="text" class="form-control form-control-sm" :value="form.apellidoNombre"
            disabled />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-telefono">Teléfono</label>
          <input id="rep-telefono" type="text" class="form-control form-control-sm" :value="form.telefono"
            disabled />
        </div>

        <div class="col-md-3 form-group">
          <label for="rep-cuentaCorriente">Cuenta Corriente</label>
          <select id="rep-cuentaCorriente" class="form-control form-control-sm" v-model="form.cuentaCorriente"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option v-for="opc in opcionesCuentaCorriente" :key="opc" :value="opc">{{ opc }}</option>
          </select>
        </div>

        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DE LA PROPIEDAD</span>
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-cod-alquiler">Cod. Alquiler</label>
          <input id="rep-cod-alquiler" type="text" class="form-control form-control-sm"
            :value="form.codAlquiler" disabled />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-cod-venta">Cod. Venta</label>
          <input id="rep-cod-venta" type="text" class="form-control form-control-sm" :value="form.codVenta"
            disabled />
        </div>
        <div class="col-md-4 form-group">
          <label for="rep-direccion">Dirección</label>
          <input id="rep-direccion" type="text" class="form-control form-control-sm" :value="form.direccion"
            disabled />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-localidad">Localidad</label>
          <input id="rep-localidad" type="text" class="form-control form-control-sm" :value="form.localidad"
            disabled />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-tipo">Tipo</label>
          <input id="rep-tipo" type="text" class="form-control form-control-sm" :value="form.tipo" disabled />
        </div>
        <div class="col-md-4 form-group">
          <label for="rep-comodidades">Comodidades</label>
          <input id="rep-comodidades" type="text" class="form-control form-control-sm" :value="form.comodidades"
            disabled />
        </div>

        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DEL PROPIETARIO</span>
        </div>
        <div class="col-md-4 form-group">
          <label for="rep-propietario">Propietario</label>
          <input id="rep-propietario" type="text" class="form-control form-control-sm" :value="form.propietario"
            disabled />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-telefono-prop">Teléfono Propietario</label>
          <input id="rep-telefono-prop" type="text" class="form-control form-control-sm"
            :value="form.telefonoPropietario" disabled />
        </div>

        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>VALORES</span>
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-viejo">Viejo</label>
          <input id="rep-viejo" type="text" class="form-control form-control-sm"
            :value="formatearMonto(form.viejo)" disabled />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-cdoc">C/ Doc</label>
          <input id="rep-cdoc" type="text" class="form-control form-control-sm"
            :value="formatearMonto(form.cdoc)" disabled />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-reconocimiento">Reconocimiento</label>
          <input id="rep-reconocimiento" type="text" class="form-control form-control-sm"
            :value="formatearMonto(form.reconocimiento)" disabled />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-total">Total</label>
          <input id="rep-total" type="text" class="form-control form-control-sm"
            :value="formatearMonto(totalCalculado)" disabled />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-nuevo">Nuevo</label>
          <input id="rep-nuevo" type="text" class="form-control form-control-sm" v-model="form.nuevo"
            :disabled="soloLectura" autocomplete="off" />
        </div>
      </div>
    </template>

    <template #footer>
      <button v-if="!soloLectura" class="btn btn-primary btn-sm" @click="guardarRepactado" :disabled="guardando">
        <i :class="repactadoData ? 'bi bi-check-circle me-1' : 'bi bi-save me-1'"></i>
        {{ guardando ? 'Guardando...' : (repactadoData ? 'Actualizar' : 'Guardar') }}
      </button>
      <button v-else type="button" class="btn btn-secondary btn-sm" @click="emit('close')">
        Cerrar
      </button>
    </template>
  </BaseModal>

</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { computed, reactive, ref, watch } from 'vue'
import { getEstadosRepactado, updateRepactado } from '@/Services/api/Contrato/Repactado.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  repactadoData: {
    type: Object,
    default: null,
  },
  soloLectura: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'repactadoGuardado'])

const opcionesCondicion = ['No Renueva', 'Renueva', 'Retiro']
const opcionesSituacion = ['Nuevo', 'Prop Retira', 'Prorroga', 'Reingresa']
const opcionesCuentaCorriente = ['Muy Buena', 'Buena', 'Mala', 'Deudor']

const estados = ref([])
const guardando = ref(false)
const errorGuardado = ref('')

const valoresIniciales = {
  id: null,
  folio: '',
  cuentaCorriente: '',
  estadoId: '',
  cierre: '',
  plazoActualizacion: '',
  condicion: '',
  inicioContrato: '',
  vencimientoContrato: '',
  situacion: '',
  observaciones: '',
  apellidoNombre: '',
  telefono: '',
  direccion: '',
  localidad: '',
  tipo: '',
  comodidades: '',
  codAlquiler: '',
  codVenta: '',
  propietario: '',
  telefonoPropietario: '',
  viejo: null,
  cdoc: null,
  reconocimiento: null,
  nuevo: '',
}

const form = reactive({ ...valoresIniciales })

const parseNumero = (valor) => {
  if (valor === null || valor === undefined || valor === '') return 0
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0

  let texto = String(valor).trim()

  if (texto.includes(',') && texto.includes('.')) {
    texto = texto.replace(/\./g, '').replace(',', '.')
  } else if (texto.includes(',')) {
    texto = texto.replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(texto)) {
    texto = texto.replace(/\./g, '')
  }

  const numero = Number(texto)
  return Number.isFinite(numero) ? numero : 0
}

const formatearMonto = (valor) => {
  if (valor === null || valor === undefined || valor === '') return ''

  return parseNumero(valor).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const totalCalculado = computed(
  () => parseNumero(form.viejo) + parseNumero(form.cdoc) - parseNumero(form.reconocimiento)
)

const fechaHoy = () => {
  const hoy = new Date()
  const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

watch(
  () => form.estadoId,
  (estadoId) => {
    if (estadoId && !form.cierre) {
      form.cierre = fechaHoy()
    }
  }
)

const resetForm = () => {
  Object.assign(form, valoresIniciales)
  errorGuardado.value = ''
}

const cargarEstados = async () => {
  try {
    const { data } = await getEstadosRepactado()
    estados.value = data.data || []
  } catch (error) {
    console.error('Error al cargar estados de repactado:', error)
    estados.value = []
  }
}

const cargarDatosEdicion = (datos) => {
  const estado = estados.value.find((opc) => opc.estado === datos.estado)

  form.id = datos.id ?? null
  form.folio = datos.folio ?? ''
  form.cuentaCorriente = datos.cuentaCorriente ?? ''
  form.estadoId = datos.estadoId ?? estado?.id ?? ''
  form.cierre = datos.cierre ?? ''
  form.plazoActualizacion = datos.plazoActualizacion ?? ''
  form.condicion = datos.condicion ?? ''
  form.inicioContrato = datos.inicioContrato ?? ''
  form.vencimientoContrato = datos.vencimientoContrato ?? ''
  form.situacion = datos.situacion ?? ''
  form.observaciones = datos.observaciones ?? ''
  form.apellidoNombre = datos.apellidoNombre ?? ''
  form.telefono = datos.telefono ?? ''
  form.direccion = datos.direccion ?? ''
  form.localidad = datos.localidad ?? ''
  form.tipo = datos.tipo ?? ''
  form.comodidades = datos.comodidades ?? ''
  form.codAlquiler = datos.codAlquiler ?? ''
  form.codVenta = datos.codVenta ?? ''
  form.propietario = datos.propietario ?? ''
  form.telefonoPropietario = datos.telefonoPropietario ?? ''
  form.viejo = datos.viejo ?? null
  form.cdoc = datos.montoDocumento ?? null
  form.reconocimiento = datos.reconocimiento ?? null
  form.nuevo = datos.nuevo ?? ''
}

watch(
  () => props.show,
  async (isShown) => {
    if (!isShown) return

    errorGuardado.value = ''
    await cargarEstados()

    if (props.repactadoData) {
      cargarDatosEdicion(props.repactadoData)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const guardarRepactado = async () => {
  if (!form.id) {
    errorGuardado.value = 'No hay un repactado cargado para actualizar.'
    return
  }

  if (!form.estadoId) {
    errorGuardado.value = 'Seleccione un estado.'
    return
  }

  guardando.value = true
  errorGuardado.value = ''

  try {
    const payload = {
      id: form.id,
      estado: form.estadoId,
      cuenta_corriente: form.cuentaCorriente || null,
      plazo_y_actualizacion_contrato: form.plazoActualizacion || null,
      condicion: form.condicion || null,
      situacion: form.situacion || null,
      observaciones_estado: form.observaciones || null,
      nuevo_valor_alquiler: form.nuevo === '' ? null : parseNumero(form.nuevo),
      monto_documento: parseNumero(form.cdoc),
      reconocimiento: parseNumero(form.reconocimiento),
    }

    const { data } = await updateRepactado(payload)
    emit('repactadoGuardado', data.data)
    emit('close')
  } catch (error) {
    errorGuardado.value =
      error?.response?.data?.message || 'Ocurrió un error al guardar el repactado.'
    console.error('Error al guardar repactado:', error)
  } finally {
    guardando.value = false
  }
}
</script>
