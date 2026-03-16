<template>
  <div class="modal fade" id="modalAlquiler" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header atcl_modal_header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Alquiler</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" name="formularioComodidades" id="formulario" value="">
          <div class="row g-3">
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Codigo</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="propiedad.cod_alquiler"
                readonly>
              <input v-else type="number" class="form-control text-center small " id="" name="cod_alquiler" min="0"
                placeholder="Ej: 3218" v-model="alquiler.cod_alquiler">
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">F. Central</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="folioCentral" readonly>
              <input v-else type="number" class="form-control text-center small " id="" name="FCentral"
                placeholder="Ej: 123" v-model="alquiler.FCentral">
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">F. Candioti</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="folioCandioti" readonly>
              <input v-else type="number" class="form-control text-center small " id="" name="FCandioti"
                placeholder="Ej: 123" v-model="alquiler.FCandioti">
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">F. Tribunales</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="folioTribunales" readonly>
              <input v-else type="number" class="form-control text-center small " id="" name="FTribunales"
                placeholder="Ej: 123" v-model="alquiler.FTribunales">
            </div>

            <div class="form-group  px-1 col-md-4">
              <label class="text-center form-label" for="">Estado de
                Alquiler</label>
              <input v-if="propiedad" type="text" class="form-control text-center"
                :value="propiedad.estado_alquiler?.name" readonly>
              <select v-else class="form-select " aria-label="Default select example" name="estado_alquiler"
                id="estado_alquiler" v-model="alquiler.estado_alquiler">
                <option value="">Seleccione una estado</option>
                <option v-for="estado in props.estadosAlquiler" :key="estado.id" :value="estado.id">
                  {{ estado.name }}
                </option>
              </select>
            </div>

            <div class="form-group  px-1 col-md-2 pt-2">
              <label class="text-center form-label" id="basic-addon1"></label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="monedaAlquilerDisplay"
                readonly>
              <select v-else class="form-select" aria-label="Default select example" name="moneda_alquiler"
                v-model="alquiler.moneda_alquiler">
                <option value="1">$</option>
                <option value="2">u$s</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Precio
              </label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="precioAlquilerDisplay"
                readonly>
              <input v-else type="number" class="form-control text-center " id="" name="monto_alquiler" min="0"
                placeholder="Ej: 4000" v-model="alquiler.monto_alquiler">
            </div>


            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Autorizacion</label>
              <input v-if="propiedad" type="text" class="form-control text-center"
                :value="propiedad.autorizacion_alquiler" readonly>
              <select v-else class="form-select " aria-label="Default select example" name="autorizacion_alquiler"
                v-model="alquiler.autorizacion_alquiler">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1"> Fecha
                Aut.</label>
              <input v-if="propiedad" type="date" class="form-control text-center"
                :value="propiedad.fecha_autorizacion_alquiler" readonly>
              <input v-else type="date" class="form-control text-center " id="" name="fecha_autorizacion_alquiler"
                v-model="alquiler.fecha_autorizacion_alquiler">
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Exclusividad</label>
              <input v-if="propiedad" type="text" class="form-control text-center"
                :value="propiedad.exclusividad_alquiler" readonly>
              <select v-else class="form-select " aria-label="Default select example" name="exclusividad_alquiler"
                v-model="alquiler.exclusividad_alquiler">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1  col-md-2 " v-if="!propiedad">
              <label class="text-center form-label" id="basic-addon1">C.
                Venta</label>
              <select class="form-select " aria-label="Default select example" name="clausula_de_venta"
                v-model="alquiler.clausula_de_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-4 " v-if="!propiedad">
              <label class="text-center form-label" id="basic-addon1">T.
                Clausula</label>
              <input type="text" class="form-control text-center " id="" name="tiempo_clausula"
                placeholder="Ej: 3 meses" v-model="alquiler.tiempo_clausula">
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Fecha
                Alta</label>
              <input v-if="propiedad" type="date" class="form-control text-center"
                :value="propiedad.alquiler_fecha_alta" readonly>
              <input v-else type="date" class="form-control text-center " v-model="alquiler.alquiler_fecha_alta">
            </div>

            <div class=" form-group px-1 col-md-2 ">
              <label class=" text-center form-label" id="basic-addon1">Mascota</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="propiedad.mascota" readonly>
              <select v-else class="form-select " aria-label="Default select example" v-model="alquiler.mascota">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>

            <div class="form-group px-1 col-md-4 "
              v-show="mostrarDescripcion || propiedad?.historial_estados_alquiler?.comentario_alquiler"
              id="descripcion_container_alquiler">
              <label for="descripcion_alquiler" class="text-center form-label" id="basic-addon1">Descripción</label>
              <input v-if="propiedad?.historial_estados_alquiler?.comentario_alquiler" type="text"
                class="form-control text-center" name="descripcion_estado_alquiler" id="descripcion_alquiler"
                :value="propiedad.historial_estados_alquiler.comentario_alquiler" readonly>
              <input v-else type="text" class="form-control" name="descripcion_estado_alquiler"
                id="descripcion_alquiler" v-model="alquiler.descripcion_estado_alquiler">
            </div>

            <div class="col-md-3 form-group"
              v-show="mostrarBajaTemporal || propiedad?.historial_estados_alquiler?.reactiva_fecha_alquiler"
              id="baja_temporal_alquiler">
              <label class="text-center" id="basic-addon1">Baja Temporal</label>
              <input v-if="propiedad?.historial_estados_alquiler?.reactiva_fecha_alquiler" type="date"
                class="form-control text-center" name="fecha_baja_temporal_alquiler" id="fecha_baja_temporal_alquiler"
                :value="propiedad.historial_estados_alquiler.reactiva_fecha_alquiler?.split(' ')[0]" readonly>
              <input v-else type="date" class="form-control text-center" name="fecha_baja_temporal_alquiler"
                id="fecha_baja_temporal_alquiler" v-model="alquiler.fecha_baja_temporal_alquiler">
            </div>

            <div class="form-group  px-1 col-md-3 pt-4">
              <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                data-bs-target="#condicionAlquilesPropiedad">
                Condición Alquiler
              </button>
            </div>

            <div v-if="propiedad" class="form-group  px-1 col-md-3 pt-4">
              <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                data-bs-target="#novedadesAlquilerPropiedad">
                Novedades Alquiler
              </button>
            </div>

            <div v-if="propiedad" class="form-group px-1 col-md-3 pt-4">
              <button type="button" class="btn btn-primary btn-sm w-100" @click="fichaPdfRef.generarPdf()">
                Ficha PDF
              </button>
            </div>
            <!-- Componente oculto con la plantilla -->
            <FichaPropiedad ref="fichaPdfRef" :propiedad="propiedad" ubicacion="'A'" />

          </div>

          <div class="modal-footer mt-2">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>

        </div>
      </div>
    </div>
  </div>
  <ModalNovedades :propiedad="propiedad" ubicacion="A" modalId="novedadesAlquilerPropiedad"
    @update:novedad="emit('update:novedadAlquiler', $event)"
    @update:observacionesModificadas="emit('update:observacionesModificadasAlquiler', $event)"
    :propiedad-update="propiedadUpdate" />
</template>
<script setup>
// Recibir las props del componente padre
import ModalNovedades from './ModalNovedades.vue'
import { reactive, watch, defineEmits, computed } from 'vue'
import { ref } from 'vue'
import FichaPropiedad from './Pdf/FichaDePropiedad.vue'



const props = defineProps({
  estadosAlquiler: {
    type: Array,
    default: () => []
  },
  propiedad: {
    type: Object,
    default: null
  },
  propiedadUpdate: {
    type: Object,
    default: null
  }
})
const fichaPdfRef = ref(null)


// Definir los emits
const emit = defineEmits(['update:alquiler', 'update:novedadAlquiler', 'update:observacionesModificadasAlquiler'])

// Watch para precargar datos cuando llega propiedadUpdate (como en venta)
watch(() => props.propiedadUpdate, (newValue) => {
  if (newValue) {
    //console.log('Cargando datos de alquiler:', newValue)
    // Precargar los datos en el formulario
    alquiler.cod_alquiler = newValue.cod_alquiler || ''
    alquiler.estado_alquiler = newValue.id_estado_alquiler || ''
    alquiler.moneda_alquiler = newValue.precio_actual?.moneda_alquiler_pesos ? '1' : '2'
    alquiler.monto_alquiler = newValue.precio_actual?.moneda_alquiler_pesos || newValue.precio_actual?.moneda_alquiler_dolar || ''
    alquiler.autorizacion_alquiler = newValue.autorizacion_alquiler || ''
    alquiler.fecha_autorizacion_alquiler = newValue.fecha_autorizacion_alquiler || ''
    alquiler.exclusividad_alquiler = newValue.exclusividad_alquiler || ''
    alquiler.clausula_de_venta = newValue.clausula_de_venta || ''
    alquiler.tiempo_clausula = newValue.tiempo_clausula || ''
    alquiler.alquiler_fecha_alta = newValue.alquiler_fecha_alta || ''
    alquiler.mascota = newValue.mascota || ''
    alquiler.descripcion_estado_alquiler = newValue.historial_estados_alquiler?.comentario_alquiler || ''
    alquiler.fecha_baja_temporal_alquiler = newValue.historial_estados_alquiler?.reactiva_fecha_alquiler?.split(' ')[0] || ''

    // Precargar folios si existen
    if (newValue.folios && newValue.folios.length > 0) {
      const folioCentral = newValue.folios.find(f => f.empresa_id === 1)
      const folioCandioti = newValue.folios.find(f => f.empresa_id === 2)
      const folioTribunales = newValue.folios.find(f => f.empresa_id === 3)

      alquiler.FCentral = folioCentral?.folio || ''
      alquiler.FCandioti = folioCandioti?.folio || ''
      alquiler.FTribunales = folioTribunales?.folio || ''
    }
  }
}, { immediate: true })


// Computed properties separadas para cada tipo de folio
const folioCentral = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  const folio = propiedadActiva?.folios?.find(f => f.empresa_id === 1)
  return folio?.folio || ''
})

const folioCandioti = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  const folio = propiedadActiva?.folios?.find(f => f.empresa_id === 2)
  return folio?.folio || ''
})

const folioTribunales = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  const folio = propiedadActiva?.folios?.find(f => f.empresa_id === 3)
  return folio?.folio || ''
})

// Computed properties para moneda y precio de alquiler
const monedaAlquilerDisplay = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  if (!propiedadActiva?.precio_actual) return '$'

  const precio = propiedadActiva.precio_actual

  // Prioridad 1: Precio de alquiler en pesos
  if (precio.moneda_alquiler_pesos) {
    return '$'
  }

  // Prioridad 2: Precio de alquiler en dólares
  if (precio.moneda_alquiler_dolar) {
    return 'u$s'
  }

  // Prioridad 3: Precio de venta en pesos
  if (precio.moneda_venta_pesos) {
    return '$'
  }

  // Prioridad 4: Precio de venta en dólares
  if (precio.moneda_venta_dolar) {
    return 'u$s'
  }

  // Default
  return '$'
})

const precioAlquilerDisplay = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  if (!propiedadActiva?.precio_actual) return ''

  const precio = propiedadActiva.precio_actual

  // Prioridad 1: Precio de alquiler en pesos
  if (precio.moneda_alquiler_pesos) {
    return precio.moneda_alquiler_pesos
  }

  // Prioridad 2: Precio de alquiler en dólares
  if (precio.moneda_alquiler_dolar) {
    return precio.moneda_alquiler_dolar
  }

  // Prioridad 3: Precio de venta en pesos
  if (precio.moneda_venta_pesos) {
    return precio.moneda_venta_pesos
  }

  // Prioridad 4: Precio de venta en dólares
  if (precio.moneda_venta_dolar) {
    return precio.moneda_venta_dolar
  }

  // Default
  return ''
})

// Datos reactivos del modal
const alquiler = reactive({
  cod_alquiler: '',
  FCentral: '',
  FCandioti: '',
  FTribunales: '',
  estado_alquiler: '',
  moneda_alquiler: '1',
  monto_alquiler: '',
  autorizacion_alquiler: '',
  fecha_autorizacion_alquiler: '',
  exclusividad_alquiler: '',
  clausula_de_venta: '',
  tiempo_clausula: '',
  alquiler_fecha_alta: '',
  mascota: '',
  descripcion_estado_alquiler: '',
  fecha_baja_temporal_alquiler: '',
})

// Lógica equivalente al toggleDescripcion del blade
const ESTADOS_CON_DESCRIPCION = ['BAJA', 'RESET', 'BAJA TEMPORAL']

const estadoSeleccionadoTexto = computed(() => {
  if (!alquiler.estado_alquiler) return ''
  const estado = props.estadosAlquiler.find(e => e.id == alquiler.estado_alquiler)
  return estado?.name?.trim().toUpperCase() || ''
})

const mostrarDescripcion = computed(() =>
  ESTADOS_CON_DESCRIPCION.includes(estadoSeleccionadoTexto.value)
)

const mostrarBajaTemporal = computed(() =>
  estadoSeleccionadoTexto.value === 'BAJA TEMPORAL'
)

// Limpiar campos al ocultarse (igual que el JS original)
watch(mostrarDescripcion, (val) => {
  if (!val) alquiler.descripcion_estado_alquiler = ''
})

watch(mostrarBajaTemporal, (val) => {
  if (!val) alquiler.fecha_baja_temporal_alquiler = ''
})

// Observar cambios y emitir automáticamente
watch(alquiler, (newValue) => {
  emit('update:alquiler', { ...newValue })
}, { deep: true })

</script>
