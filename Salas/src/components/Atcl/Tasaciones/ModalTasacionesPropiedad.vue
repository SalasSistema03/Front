<template>
  <BaseModal :show="show" size="xl" @close="emit('close')">
    <template #title>
      <i :class="soloLectura ? 'bi bi-eye me-2' : tasacionData ? 'bi bi-pencil-square me-2' : 'bi bi-cloud-upload me-2'"></i>
      {{ soloLectura ? 'Ver Tasación' : tasacionData ? 'Editar Tasación' : 'Carga de Tasaciones' }}
    </template>

    <template #body>
      <div class="row tasaciones-body-scroll">
        <div class="contrato-seccion-header">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DE LA PROPIEDAD</span>
        </div>
        <div class="col-md-3 form-group">
          <label for="inmueble">Inmueble</label>
          <select id="inmueble" class="form-control form-control-sm" v-model="form.inmuebleId" :disabled="soloLectura">
            <option value="">Seleccione un inmueble</option>
            <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
              {{ inmueble.inmueble }}
            </option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="input-calle" class="form-label">Calle</label>
          <div class="position-relative">
            <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
              v-model="calleSeleccionada" @input="filtrarCallesTasacion" @focus="mostrarLista"
              :disabled="soloLectura"
              @blur="ocultarSugerencias" autocomplete="off" />

            <ul v-if="!soloLectura && mostrarSugerencias && callesFiltradas.length"
              class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm busqueda-select"
              style="z-index: 1060; max-height: 200px; overflow-y: auto; top: 100%; left: 0;">
              <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalleTasacion(calle)"
                class="px-3 py-2 cursor-pointer hover:bg-light">
                {{ calle.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-2 form-group">
          <label for="numero-calle">Nº Calle</label>
          <input type="text" id="numero-calle" class="form-control form-control-sm" autocomplete="off"
            placeholder="9100" v-model="form.numeroCalle" :disabled="soloLectura" />
        </div>
        <div class="col-md-2 form-group">
          <label for="piso">Piso</label>
          <input type="text" id="piso" class="form-control form-control-sm" autocomplete="off" placeholder="1"
            v-model="form.piso" :disabled="soloLectura" />
        </div>
        <div class="col-md-2 form-group">
          <label for="departamento">Departamento</label>
          <input type="text" id="departamento" class="form-control form-control-sm" autocomplete="off" placeholder="A"
            v-model="form.departamento" :disabled="soloLectura" />
        </div>
        <div class="col-md-3 form-group">
          <label for="localidad">Localidad</label>
          <select id="localidad" class="form-control form-control-sm" v-model="form.localidadId" :disabled="soloLectura">
            <option value="">Seleccione una localidad</option>
            <option v-for="localidad in localidades" :key="localidad.id" :value="localidad.id">
              {{ localidad.name }}
            </option>
          </select>
        </div>
        <div class="col-md-2 form-group">
          <label for="folio">Folio</label>
          <input id="folio" type="number" class="form-control form-control-sm" autocomplete="off" placeholder="1234"
            v-model.number="form.folio" :disabled="soloLectura" />
        </div>
        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DEL PROPIETARIO</span>
        </div>
        <div class="col-md-3 form-group position-relative">
          <label for="propietario">Propietario</label>
          <input id="propietario" type="text" class="form-control form-control-sm"
            placeholder="Buscar por apellido o DNI..." v-model="form.propietario" @input="buscarPropietario"
            :disabled="soloLectura"
            autocomplete="off" />
          <ul v-if="!soloLectura && sugerenciasPropietario.length"
            class="list-group position-absolute w-100 shadow sugerencias-propietario">
            <li v-for="persona in sugerenciasPropietario" :key="persona.id"
              class="list-group-item list-group-item-action cursor-pointer py-2 small fw-semibold"
              @click="seleccionarPropietario(persona)">
              <i class="bi bi-person-check text-primary me-2"></i>
              {{ persona.apellido }}, {{ persona.nombre }}
              <span class="text-muted fw-normal ms-1">({{ persona.documento || 'Sin DNI' }})</span>
            </li>
          </ul>
        </div>
        <!-- <div class="col-md-3 form-group">
          <label for="telefono">Nº Telefono</label>
          <input
            id="telefono"
            type="text"
            class="form-control form-control-sm"
            autocomplete="off"
          />
        </div> -->
        <div v-if="!soloLectura" class="col-md-3 form-group">
          <label for="ingreso">Ingreso</label>
          <select id="ingreso" class="form-control form-control-sm" v-model="form.ingreso" :disabled="soloLectura">
            <option value="">Seleccione un ingreso</option>
            <option v-for="item in ingreso" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div v-if="!soloLectura" class="col-md-3 mt-4">
          <button type="button" class="btn btn-outline-dark btn-sm w-100 fw-bold shadow-sm"
            @click="abrirModalCargaPersona">
            <i class="bi bi-person-vcard"></i> Crear Nueva Persona
          </button>
        </div>
        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DE LA TASACION</span>
        </div>
        <div class="col-md-3 form-group">
          <label for="tipo-tasacion">Tipo Tasacion</label>
          <select id="tipo-tasacion" class="form-control form-control-sm" v-model="form.tipoTasacion" :disabled="soloLectura">
            <option value="">Seleccione un tipo de tasacion</option>
            <option v-for="tipo in TipoTasacion" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
        </div>
        <div class="col-md-2 form-group">
          <label for="tasacion-venta">Tasacion Venta</label>
          <input id="tasacion-venta" type="number" class="form-control form-control-sm" autocomplete="off"
            placeholder="U$S 40.000" :disabled="soloLectura || bloquearTasacionVenta" v-model.number="form.tasacionVenta" />
        </div>
        <div class="col-md-2 form-group">
          <label for="tasacion-alquiler">Tasacion Alquiler</label>
          <input id="tasacion-alquiler" type="number" class="form-control form-control-sm" autocomplete="off"
            placeholder="$ 100.000" :disabled="soloLectura || bloquearTasacionAlquiler" v-model.number="form.tasacionAlquiler" />
        </div>
        <div class="col-md-2 form-group">
          <label for="costo-tasacion">Costo Tasacion</label>
          <input id="costo-tasacion" type="number" class="form-control form-control-sm" autocomplete="off"
            placeholder="$ 15.000" v-model.number="form.costoTasacion" :disabled="soloLectura" />
        </div>
        <div class="col-md-2 form-group">
          <label for="tasador">Tasador</label>
          <select id="tasador" class="form-control form-control-sm" v-model="form.tasadorId" :disabled="soloLectura">
            <option value="">Seleccione un tasador</option>
            <option v-for="tasador in tasadores" :key="tasador.id_usuario_sector" :value="tasador.id_usuario">
              {{ tasador.usuario_username }}
            </option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="tasacion-informada">Tasacion Informada Prop</label>
          <select id="tasacion-informada" class="form-control form-control-sm" v-model="form.tasacionInformada" :disabled="soloLectura">
            <option value="">Seleccione una opción</option>
            <option v-for="item in tasacionInformada" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>OBSERVACIONES</span>
        </div>
        <div class="col-md-12 form-group">
          <label for="observaciones">Observaciones</label>
          <textarea id="observaciones" class="form-control form-control-sm" rows="2"
            v-model="form.observaciones" :disabled="soloLectura"></textarea>
        </div>
      </div>
    </template>
    <template #footer>
      <button
        v-if="tasacionData?.id && !soloLectura"
        class="btn btn-danger btn-sm"
        @click="eliminarTasacion"
        :disabled="eliminando || guardando"
      >
        {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
      </button>
      <button v-if="!soloLectura" class="btn btn-primary btn-sm" @click="guardarTasacion" :disabled="guardando || eliminando">
        <i :class="tasacionData ? 'bi bi-check-circle me-1' : 'bi bi-save me-1'"></i>
        {{ guardando ? 'Guardando...' : (tasacionData ? 'Actualizar' : 'Guardar') }}
      </button>
      <button v-else type="button" class="btn btn-secondary btn-sm" @click="emit('close')">
        Cerrar
      </button>

    </template>
  </BaseModal>

  <ModalCargaPersona :persona-data="personaParaVer" :show="modalCargaAbierto" @close="modalCargaAbierto = false">
  </ModalCargaPersona>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import ModalCargaPersona from '@/components/Atcl/Propiedad/ModalCargaPersona.vue'
import {
  buscaPersona,
  getInmueble,
  guardarNuevaTasacion,
  actualizarTasacion,
  eliminarTasacion as eliminarTasacionApi,
} from '@/Services/api/Atcl/AtclApi'
import { reactive, ref, onMounted, watch } from 'vue'
import { useLocalidades } from '../../../composables/atcl/useLocalidades'
import { useCalleAutocomplete } from '../../../composables/atcl/useCalleAutocomplete'
import { asesoresTasacion } from '@/Services/api/Atcl/Alquiler/Alquiler'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  tasacionData: {
    type: Object,
    default: null,
  },
  soloLectura: {
    type: Boolean,
    default: false,
  },
})
const inmuebles = ref([])
const { localidades, cargarLocalidades } = useLocalidades()
const {
  callesFiltradas,
  mostrarSugerencias,
  calleSeleccionada,
  calleId,
  cargarCalles,
  filtrarCalles,
  seleccionarCalle,
  ocultarSugerencias,
  mostrarLista,
} = useCalleAutocomplete()
const ingreso = [
  'Correo',
  'Difusion',
  'Facebook',
  'Instagram',
  'Presencial',
  'Presencial Candioti',
  'Presencial Tribunales',
  'Recomendacion',
  'Sitio Web',
  'Telefonicamente',
  'Telefonicamente Candioti',
  'Telefonicamente Tribunales',
  'Zona Prop',
  'Whatsapp',
  'Otro',
]
const modalCargaAbierto = ref(false)
const personaParaVer = ref(null)
const form = reactive({
  inmuebleId: '',
  calle: '',
  id_calle: null,
  numeroCalle: '',
  piso: '',
  departamento: '',
  localidadId: '',
  folio: null,
  propietarioId: null,
  propietario: '',
  ingreso: '',
  tipoTasacion: '',
  tasacionVenta: null,
  tasacionAlquiler: null,
  costoTasacion: null,
  tasadorId: '',
  tasacionInformada: '',
  observaciones: '',
})
const TipoTasacion = ref(['Alquiler', 'Venta', 'Alquiler y Venta'])
const bloquearTasacionVenta = ref(false)
const bloquearTasacionAlquiler = ref(false)
const tasacionInformada = ref([
  'Cancelado',
  'No Pasado',
  'Pasado, Ingreso',
  'Pasado, No Ingreso',
  'Pendiente',
])
const tasadores = ref([])
const sugerenciasPropietario = ref([])
let timeoutBusquedaPropietario = null

//funcion para traer todos los inmuebles
const getInmuebles = async () => {
  try {
    const response = await getInmueble()
    inmuebles.value = response.data
    //console.log(response)
  } catch (error) {
    console.error('Error al obtener inmuebles:', error)
  }
}

const abrirModalCargaPersona = () => {
  modalCargaAbierto.value = true
  personaParaVer.value = null // Reinicia los datos de la persona al abrir el modal
}

const buscarPropietario = () => {
  if (timeoutBusquedaPropietario) clearTimeout(timeoutBusquedaPropietario)

  form.propietarioId = null
  const texto = form.propietario.trim()
  if (!texto) {
    sugerenciasPropietario.value = []
    return
  }

  timeoutBusquedaPropietario = setTimeout(async () => {
    try {
      const esDni = /^\d+$/.test(texto)
      const params = esDni ? { dni: texto } : { apellido: texto }
      const response = await buscaPersona(params)
      sugerenciasPropietario.value = response.data.slice(0, 100)
    } catch (error) {
      console.error('Error buscando propietario:', error)
      sugerenciasPropietario.value = []
    }
  }, 300)
}

const seleccionarPropietario = (persona) => {
  form.propietario = `${persona.apellido}, ${persona.nombre}`
  form.propietarioId = persona.id
  sugerenciasPropietario.value = []
}

const filtrarCallesTasacion = () => {
  filtrarCalles()
  form.calle = calleSeleccionada.value
  form.id_calle = calleId.value
}

const seleccionarCalleTasacion = (calle) => {
  seleccionarCalle(calle)
  form.calle = calleSeleccionada.value
  form.id_calle = calleId.value
}

const cargarCallesTasacion = async () => {
  try {
    await cargarCalles()
  } catch (error) {
    console.error('Error al cargar calles para tasaciones:', error)
  }
}

const asesoresTasadores = async () => {
  try {
    //console.log('antes')
    const response = await asesoresTasacion()
    tasadores.value = response.data
    //console.log(response)
    console.log(tasadores.value)
  } catch ($e) {
    console.log($e)
  }
}

const guardando = ref(false)
const eliminando = ref(false)

const resetForm = () => {
  form.inmuebleId = ''
  form.calle = ''
  form.id_calle = null
  form.numeroCalle = ''
  form.piso = ''
  form.departamento = ''
  form.localidadId = ''
  form.folio = null
  form.propietarioId = null
  form.propietario = ''
  form.ingreso = ''
  form.tipoTasacion = ''
  form.tasacionVenta = null
  form.tasacionAlquiler = null
  form.costoTasacion = null
  form.tasadorId = ''
  form.tasacionInformada = ''
  form.observaciones = ''
  calleSeleccionada.value = ''
  calleId.value = null
  sugerenciasPropietario.value = []
}

const cargarDatosEdicion = (datos) => {
  form.inmuebleId = datos.tipo_inmueble?.id || datos.tipo_inmueble || ''
  form.calle = datos.calle_relacion?.name || ''
  form.id_calle = datos.calle || datos.calle_relacion?.id || null
  calleSeleccionada.value = datos.calle_relacion?.name || ''
  calleId.value = datos.calle || datos.calle_relacion?.id || null
  form.numeroCalle = datos.numero_calle || ''
  form.piso = datos.piso || ''
  form.departamento = datos.departamento || ''
  form.localidadId = datos.id_localidad || datos.localidad?.id || ''
  form.folio = datos.folio || null

  const propRel = datos.propietario_relacion
  if (propRel) {
    form.propietarioId = propRel.id
    form.propietario = `${propRel.apellido || ''}, ${propRel.nombre || ''}`.trim()
  } else {
    form.propietarioId = datos.propietario || null
    form.propietario = datos.propietario || ''
  }

  form.ingreso = datos.origen || ''
  form.tipoTasacion = datos.tipo_tasacion || ''
  form.tasacionVenta = datos.tasacion_venta || null
  form.tasacionAlquiler = datos.tasacion_alquiler || null
  form.costoTasacion = datos.costo_tasacion || null
  form.tasadorId = datos.tasador || datos.tasador_sector?.id_usuario || ''
  form.tasacionInformada = datos.tasacion_informada_prop || ''
  form.observaciones = datos.observaciones || ''
}

watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      if (props.tasacionData) {
        cargarDatosEdicion(props.tasacionData)
      } else {
        resetForm()
      }
    }
  },
  { immediate: true }
)

const guardarTasacion = async () => {
  const datosTasacion = { ...form, id_calle: calleId.value }
  guardando.value = true
  try {
    if (props.tasacionData?.id) {
      await actualizarTasacion(props.tasacionData.id, datosTasacion)
    } else {
      await guardarNuevaTasacion(datosTasacion)
    }
    emit('tasacionCreada')
    emit('close')
  } catch (error) {
    console.error('Error al procesar tasación:', error)
  } finally {
    guardando.value = false
  }
}

const eliminarTasacion = async () => {
  const tasacionId = props.tasacionData?.id
  if (!tasacionId || guardando.value || eliminando.value) return
 /*  if (!window.confirm('¿Está seguro de que desea eliminar esta tasación?')) return */

  eliminando.value = true
  try {
    await eliminarTasacionApi(tasacionId)
    emit('tasacionCreada')
    emit('close')
  } catch (error) {
    console.error('Error al eliminar tasación:', error)
    window.alert(error.response?.data?.message || 'No se pudo eliminar la tasación.')
  } finally {
    eliminando.value = false
  }
}

watch(
  () => form.tipoTasacion,
  (newVal) => {
    if (newVal === 'Venta') {
      bloquearTasacionAlquiler.value = true
      bloquearTasacionVenta.value = false
    } else if (newVal === 'Alquiler') {
      bloquearTasacionVenta.value = true
      bloquearTasacionAlquiler.value = false
    } else {
      bloquearTasacionVenta.value = false
      bloquearTasacionAlquiler.value = false
    }
  },
)

const emit = defineEmits(['close', 'tasacionCreada'])
onMounted(() => {
  cargarLocalidades()
  cargarCallesTasacion()
  getInmuebles()
  asesoresTasadores()
})
</script>


