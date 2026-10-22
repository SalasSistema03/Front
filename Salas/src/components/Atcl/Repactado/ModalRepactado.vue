<template>
  <BaseModal :show="show" size="xl" @close="emit('close')">
    <template #title>
      <i
        :class="soloLectura ? 'bi bi-eye me-2' : repactadoData ? 'bi bi-pencil-square me-2' : 'bi bi-cloud-upload me-2'"></i>
      {{ soloLectura ? 'Ver Repactado' : repactadoData ? 'Editar Repactado' : 'Nuevo Repactado' }}
    </template>

    <template #body>
      <div class="row tasaciones-body-scroll">
        <div class="contrato-seccion-header">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DEL CONTRATO</span>
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-folio">Folio</label>
          <input id="rep-folio" type="text" class="form-control form-control-sm" v-model="form.folio"
            :disabled="soloLectura" autocomplete="off" />
        </div>


        <div class="col-md-2 form-group">
          <label for="rep-estado">Estado</label>
          <select id="rep-estado" class="form-control form-control-sm" v-model="form.estado" :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option v-for="opc in opcionesEstado" :key="opc" :value="opc">{{ opc }}</option>
          </select>
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-cierre">Cierre</label>
          <input id="rep-cierre" type="date" class="form-control form-control-sm" v-model="form.cierre"
            :disabled="soloLectura" />
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
          <input id="rep-inicio-contrato" type="date" class="form-control form-control-sm" v-model="form.inicioContrato"
            :disabled="soloLectura" />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-vencimiento-contrato">Vencimiento Contrato</label>
          <input id="rep-vencimiento-contrato" type="date" class="form-control form-control-sm"
            v-model="form.vencimientoContrato" :disabled="soloLectura" />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-situacion">Situación</label>
          <input id="rep-situacion" type="text" class="form-control form-control-sm" v-model="form.situacion"
            :disabled="soloLectura" autocomplete="off" />
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
          <input id="rep-inquilino" type="text" class="form-control form-control-sm" v-model="form.apellidoNombre"
            :disabled="soloLectura" autocomplete="off" />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-telefono">Teléfono</label>
          <input id="rep-telefono" type="text" class="form-control form-control-sm" v-model="form.telefono"
            :disabled="soloLectura" autocomplete="off" />
        </div>

        <div class="col-md-2 form-group">
          <label for="rep-cuentaCorriente">Cuenta Corriente</label>
          <input id="rep-cuentaCorriente" type="text" class="form-control form-control-sm"
            v-model="form.cuentaCorriente" :disabled="soloLectura" autocomplete="off" />
        </div>

        <div class="contrato-seccion-header pt-3 d-flex align-items-center justify-content-between">
          <div>
            <i class="bi bi-diagram-3"></i>
            <span>DATOS DE LA PROPIEDAD</span>
          </div>
          <button type="button" class="btn btn-outline-info btn-sm px-2 py-0 border-0 opacity-75"
            title="Ver comodidades de la propiedad" @click="mostrarModalComodidades = true">
            <i class="bi bi-house-gear me-1"></i>
            <small>Comodidades</small>
          </button>
        </div>
        <div class="col-md-4 form-group">
          <label for="rep-direccion">Dirección</label>
          <input id="rep-direccion" type="text" class="form-control form-control-sm" v-model="form.direccion"
            :disabled="soloLectura" autocomplete="off" />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-localidad">Localidad</label>
          <input id="rep-localidad" type="text" class="form-control form-control-sm" v-model="form.localidad"
            :disabled="soloLectura" autocomplete="off" />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-tipo">Tipo</label>
          <input id="rep-tipo" type="text" class="form-control form-control-sm" v-model="form.tipo"
            :disabled="soloLectura" autocomplete="off" />
        </div>


        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>DATOS DEL PROPIETARIO</span>
        </div>
        <div class="col-md-4 form-group">
          <label for="rep-propietario">Propietario</label>
          <input id="rep-propietario" type="text" class="form-control form-control-sm" v-model="form.propietario"
            :disabled="soloLectura" autocomplete="off" />
        </div>
        <div class="col-md-3 form-group">
          <label for="rep-telefono-prop">Teléfono Propietario</label>
          <input id="rep-telefono-prop" type="text" class="form-control form-control-sm"
            v-model="form.telefonoPropietario" :disabled="soloLectura" autocomplete="off" />
        </div>

        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>VALORES</span>
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-viejo">Viejo</label>
          <input id="rep-viejo" type="text" class="form-control form-control-sm" v-model="form.viejo"
            :disabled="soloLectura" autocomplete="off" />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-c/doc"> C/ Doc</label>
          <input id="rep-c/doc" type="text" class="form-control form-control-sm" v-model="form.cdoc"
            :disabled="soloLectura" autocomplete="off" />
        </div>
        <div class="col-md-2 form-group">
          <label for="rep-total">Total</label>
          <input id="rep-total" type="text" class="form-control form-control-sm" v-model="form.total"
            :disabled="soloLectura" autocomplete="off" />

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

  <!-- Modal anidado: Comodidades de la propiedad -->
  <BaseModal :show="mostrarModalComodidades" size="lg" @close="mostrarModalComodidades = false">
    <template #title>
      <i class="bi bi-house-gear me-2"></i>Comodidades de la Propiedad
    </template>
    <template #body>
      <div class="row g-3">
        <div class="col-md-4 form-group">
          <label for="com-estado-general">Estado General</label>
          <select id="com-estado-general" class="form-control form-control-sm" v-model="comodidades.estadoGeneral"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option v-for="opc in opcionesEstadoGeneral" :key="opc" :value="opc">{{ opc }}</option>
          </select>
        </div>
        <div class="col-md-4 form-group">
          <label for="com-dormitorios">Dormitorios</label>
          <input id="com-dormitorios" type="number" min="0" class="form-control form-control-sm"
            v-model.number="comodidades.dormitorios" :disabled="soloLectura" placeholder="Ej: 2" />
        </div>
        <div class="col-md-4 form-group">
          <label for="com-banos">Baños</label>
          <input id="com-banos" type="number" min="0" class="form-control form-control-sm"
            v-model.number="comodidades.banos" :disabled="soloLectura" placeholder="Ej: 1" />
        </div>
        <div class="col-md-3 form-group">
          <label for="com-m2-lote">m² Lote</label>
          <input id="com-m2-lote" type="number" min="0" class="form-control form-control-sm"
            v-model.number="comodidades.m2Lote" :disabled="soloLectura" placeholder="Ej: 500" />
        </div>
        <div class="col-md-3 form-group">
          <label for="com-m2-cubiertos">m² Cubiertos</label>
          <input id="com-m2-cubiertos" type="number" min="0" class="form-control form-control-sm"
            v-model.number="comodidades.m2Cubiertos" :disabled="soloLectura" placeholder="Ej: 56" />
        </div>
        <div class="col-md-3 form-group">
          <label for="com-cochera">Cochera</label>
          <select id="com-cochera" class="form-control form-control-sm" v-model="comodidades.cochera"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="com-nro-cochera">N° Cochera</label>
          <input id="com-nro-cochera" type="text" class="form-control form-control-sm" v-model="comodidades.nroCochera"
            :disabled="soloLectura || comodidades.cochera !== 'SI'" placeholder="Ej: 2" autocomplete="off" />
        </div>
        <div class="col-md-3 form-group">
          <label for="com-asfalto">Asfalto</label>
          <select id="com-asfalto" class="form-control form-control-sm" v-model="comodidades.asfalto"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="com-gas">Gas</label>
          <select id="com-gas" class="form-control form-control-sm" v-model="comodidades.gas" :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="com-cloaca">Cloaca</label>
          <select id="com-cloaca" class="form-control form-control-sm" v-model="comodidades.cloaca"
            :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="com-agua">Agua</label>
          <select id="com-agua" class="form-control form-control-sm" v-model="comodidades.agua" :disabled="soloLectura">
            <option value="">Seleccione</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="mostrarModalComodidades = false">
        Cerrar
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { reactive, ref, watch } from 'vue'

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

const opcionesEstado = ['Abierto', 'Cerrado', 'Pendiente']
const opcionesCondicion = ['Renueva', 'No Renueva', 'Pendiente']
const opcionesEstadoGeneral = ['EXCELENTE', 'MUY BUENO', 'BUENO', 'REGULAR', 'MALO']

const mostrarModalComodidades = ref(false)

const form = reactive({
  folio: '',
  cuentaCorriente: '',
  estado: '',
  cierre: '',
  plazoActualizacion: '',
  condicion: '',
  inicioContrato: '',
  vencimientoContrato: '',
  situacion: '',
  apellidoNombre: '',
  telefono: '',
  direccion: '',
  localidad: '',
  tipo: '',
  comodidades: '',
  propietario: '',
  telefonoPropietario: '',
  viejo: '',
  nuevo: '',
})

const comodidades = reactive({
  estadoGeneral: '',
  dormitorios: null,
  banos: null,
  m2Lote: null,
  m2Cubiertos: null,
  cochera: '',
  nroCochera: '',
  asfalto: '',
  gas: '',
  cloaca: '',
  agua: '',
})

const guardando = ref(false)

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
}

const cargarDatosEdicion = (datos) => {
  form.folio = datos.folio || ''
  form.cuentaCorriente = datos.cuentaCorriente || ''
  form.estado = datos.estado || ''
  form.cierre = datos.cierre || ''
  form.plazoActualizacion = datos.plazoActualizacion || ''
  form.condicion = datos.condicion || ''
  form.inicioContrato = datos.inicioContrato || ''
  form.vencimientoContrato = datos.vencimientoContrato || ''
  form.situacion = datos.situacion || ''
  form.apellidoNombre = datos.apellidoNombre || ''
  form.telefono = datos.telefono || ''
  form.direccion = datos.direccion || ''
  form.localidad = datos.localidad || ''
  form.tipo = datos.tipo || ''
  form.comodidades = datos.comodidades || ''
  form.propietario = datos.propietario || ''
  form.telefonoPropietario = datos.telefonoPropietario || ''
  form.viejo = datos.viejo || ''
  form.nuevo = datos.nuevo || ''
}

watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      if (props.repactadoData) {
        cargarDatosEdicion(props.repactadoData)
      } else {
        resetForm()
      }
    }
  },
  { immediate: true }
)

const guardarRepactado = async () => {
  guardando.value = true
  try {
    // TODO: conectar con API cuando esté disponible
    console.log('Datos a guardar:', { ...form })
    emit('repactadoGuardado')
    emit('close')
  } catch (error) {
    console.error('Error al guardar repactado:', error)
  } finally {
    guardando.value = false
  }
}
</script>
