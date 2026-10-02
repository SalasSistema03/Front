<template>
  <!-- Modal -->
  <div class="modal fade" id="modalVentas" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header atcl_modal_header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Ventas</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="formulario" value="">
          <div class="row g-3">
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center readonly form-label" id="basic-addon1">Codigo <span
                  class="text-danger">*</span></label>
              <input v-if="propiedad" type="number" class="form-control text-center readonly"
                :value="propiedad.cod_venta" readonly>
              <input v-else type="number" class="form-control text-center readonly " id="" min="0"
                v-model="venta.cod_venta">
            </div>
            <div class="form-group  px-1 col-md-3">
              <label class="text-center readonly form-label" for="">Estado de Venta</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly"
                :value="propiedad.estado_venta?.name || ''" readonly>
              <select v-else class="form-select " aria-label="Default select example" v-model="venta.estado_venta">
                <option value="">Seleccione una estado</option>

                <option v-for="estado in (props.estadosVenta || [])" :key="estado?.id" :value="estado?.id">
                  {{ estado?.name }}
                </option>

              </select>
            </div>
            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center readonly form-label" id="basic-addon1">Zona Prop</label>
              <input v-if="propiedad" type="date" class="form-control text-center readonly" :value="propiedad.zona_prop"
                readonly>
              <input v-else type="date" class="form-control text-center readonly" v-model="venta.zona_prop">
            </div>

            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center readonly form-label" id="basic-addon1">Flyer IG</label>
              <input v-if="propiedad" type="date" class="form-control text-center readonly" :value="propiedad.flyer_v"
                readonly>
              <input v-else type="date" class="form-control text-center readonly" v-model="venta.flyer_v">
            </div>


            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center readonly form-label" id="basic-addon1">Reel IG</label>
              <input v-if="propiedad" type="date" class="form-control text-center readonly" :value="propiedad.reel_v"
                readonly>
              <input v-else type="date" class="form-control text-center readonly" v-model="venta.reel_v">
            </div>

            <div class="form-group  px-1 col-md-1 ">
              <label class="text-center readonly form-label" id="basic-addon1">Web</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly" :value="propiedad.web_v"
                readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.web_v">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>





            <div class="col-md-1 form-group" style="padding-top: 6px;">
              <label class="text-center readonly form-label" id="basic-addon1">
              </label>
              <!-- Si hay propiedad, mostrar moneda según prioridad -->
              <input v-if="propiedad" type="text" class="form-control text-center readonly" :value="monedaVentaDisplay"
                readonly>
              <!-- Si no hay propiedad, mostrar select editable -->
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.moneda_venta">
                <option value="2" selected>u$s</option>
                <option value="1">$</option>
              </select>
            </div>
            <div class=" form-group  px-1 col-md-2 ">
              <label class="text-center readonly form-label" id="basic-addon1">Precio</label>
              <!-- Si hay propiedad, mostrar precio según prioridad -->
              <input v-if="propiedad" type="number" class="form-control text-center readonly"
                :value="precioVentaDisplay" readonly>
              <!-- Si no hay propiedad, mostrar input editable -->
              <input v-else type="number" class="form-control text-center readonly " id="" min="0"
                v-model="venta.monto_venta">
            </div>

            <div class="form-group  px-1 col-md-2">
              <label class="text-center readonly form-label" id="basic-addon1">Tasacion</label>
              <!-- Si hay propiedad, mostrar fecha de tasación más reciente -->
              <input v-if="propiedad" type="date" class="form-control text-center readonly"
                :value="fechaTasacionDisplay" readonly>
              <!-- Si no hay propiedad, mostrar input editable -->
              <input v-else type="date" class="form-control text-center readonly" v-model="venta.fecha_tasacion_venta">
            </div>

            <div class="col-md-1 form-group" style="padding-top: 6px;" v-if="propiedad">
              <label class="text-center readonly form-label" id="basic-addon1">
              </label>
              <!-- Si hay propiedad, mostrar moneda según prioridad -->
              <input v-if="propiedad.tasaciones?.[0]?.tasacion_dolar_venta" type="text"
                class="form-control text-center readonly" value="U$D" readonly>
              <input v-else type="text" class="form-control text-center readonly" value="$" readonly>
            </div>

            <div class="form-group  px-1 col-md-2">
              <label class="text-center readonly form-label" id="basic-addon1">Valor Tasacion</label>
              <input v-if="propiedad" type="number" class="form-control text-center readonly" :value="montoTasacion"
                readonly>
              <input v-else type="number" class="form-control text-center readonly " id="" placeholder="Ej: 50000"
                v-model="venta.tasacion_venta">
            </div>

            <div class="form-group  px-1 col-md-1">
              <label class="text-center readonly form-label" id="basic-addon1">Exclusividad</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly"
                :value="propiedad.exclusividad_venta" readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.exclusividad_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-1">
              <label class="text-center readonly form-label" id="basic-addon1">Comparte</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly"
                :value="propiedad.comparte_venta" readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.comparte_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-1">
              <label class="text-center readonly form-label" id="basic-addon1">Condicionado</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly"
                :value="propiedad.condicionado_venta" readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.condicionado_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group px-1 col-md-1" v-if="propiedad">
              <label class="text-center readonly form-label">C. Venta</label>
              <input type="text" class="form-control text-center readonly" :value="propiedad.clausula_de_venta">
            </div>
            <div class="form-group px-1 col-md-2" v-if="propiedad">
              <label class="text-center readonly form-label">Tiempo Clausula</label>
              <input type="text" class="form-control text-center readonly" :value="propiedad.tiempo_clausula">
            </div>


            <div class="form-group px-1 col-md-1" v-if="propiedad">
              <label class="text-center readonly form-label">Folio</label>
              <input type="text" class="form-control text-center readonly"
                :value="propiedad.buscarContratoMasReciente?.carpeta">
            </div>
            <div class="form-group px-1 col-md-2" v-if="propiedad">
              <label class="text-center readonly form-label">Inicio Contrato</label>
              <input type="date" class="form-control text-center readonly"
                :value="propiedad.buscarContratoMasReciente?.comienza">
            </div>
            <div class="form-group px-1 col-md-2" v-if="propiedad">
              <label class="text-center readonly form-label">Venc. Contrato</label>
              <input type="date" class="form-control text-center readonly"
                :value="propiedad.buscarContratoMasReciente?.rescicion">
            </div>
            <div class="form-group px-1 col-md-2" v-if="propiedad">
              <label class="text-center readonly form-label">Alquiler</label>
              <input type="number" class="form-control text-center readonly"
                :value="propiedad.detalleContrato?.monto_alquiler">
            </div>



            <div class="form-group px-1 col-md-1" v-if="propiedad || propiedadUpdate">
              <label class="text-center readonly form-label">Autorizacion</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly"
                :value="propiedad.autorizacion_venta">
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.autorizacion_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>

            <div class="form-group  px-1 col-md-2">
              <label class="text-center readonly form-label" id="basic-addon1">Fecha
                Aut.</label>
              <input v-if="propiedad" type="date" class="form-control text-center readonly"
                :value="propiedad.fecha_autorizacion_venta" readonly>
              <input v-else type="date" class="form-control text-center readonly"
                v-model="venta.fecha_autorizacion_venta">
            </div>
            <div class="form-group  px-1 col-md-3 ">
              <label class="text-center readonly form-label" id="basic-addon1">Comentario
                Autorizacion</label>
              <textarea v-if="propiedad" name="comentario_autorizacion" id="comentario_autorizacion" cols="3" rows="1"
                class="form-control" :value="propiedad.comentario_autorizacion" readonly></textarea>
              <textarea v-else name="comentario_autorizacion" id="comentario_autorizacion" cols="3" rows="1"
                class="form-control" v-model="venta.comentario_autorizacion"></textarea>
            </div>
            <div class="form-group  px-1 col-md-2">
              <label class="text-center readonly form-label" id="basic-addon1">Fecha
                Alta</label>
              <input v-if="propiedad" type="date" class="form-control text-center readonly"
                :value="propiedad.venta_fecha_alta" readonly>
              <input v-else type="date" class="form-control text-center readonly" v-model="venta.venta_fecha_alta">
            </div>
            <div class="form-group px-1 col-md-2" v-if="propiedad">
              <label class="text-center readonly form-label" id="basic-addon1">
                Fecha Baja
              </label>
              <input type="date" class="form-control text-center readonly" :value="propiedad.venta_fecha_baja">
            </div>



            <div class="form-group  px-1 col-md-1">
              <label class="text-center readonly form-label" id="basic-addon1">Cap. Interno</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly"
                :value="propiedad.usuario_captador_int_v?.username" readonly>
              <select v-else class="form-select" aria-label="Default select example"
                v-model.number="venta.captador_interno_v">

                <option v-for="captador in (props.captadoresInternos?.original || [])" :key="captador?.id || captador"
                  :value="captador?.id">
                  {{ captador?.username }}
                </option>
              </select>
            </div>


            <div class="form-group  px-1 col-md-1 ">
              <label class="text-center readonly form-label" id="basic-addon1">Asesor</label>
              <input v-if="propiedad" type="text" class="form-control text-center readonly"
                :value="propiedad.usuario_asesor?.username" readonly>
              <select v-else class="form-select" v-model.number="venta.asesor_resultado">


                <option v-for="asesor in (props.asesores || [])" :key="asesor?.id_usuario || asesor"
                  :value="asesor?.id_usuario">
                  {{ asesor?.username }}
                </option>


              </select>
            </div>
            <div class="col-md-6 form-group"
              v-show="mostrarDescripcion || propiedad?.historial_estados_venta?.comentario">
              <label for="descripcion_venta" class="text-center readonly form-label">Descripción</label>
              <input v-if="propiedad?.historial_estados_venta?.comentario" type="text" class="form-control"
                name="descripcion_estado_venta" id="descripcion_venta"
                :value="propiedad.historial_estados_venta.comentario" readonly>
              <input v-else type="text" class="form-control" name="descripcion_estado_venta" id="descripcion_venta"
                v-model="venta.descripcion_estado_venta">
            </div>

            <div class="col-md-2 form-group"
              v-show="mostrarBajaTemporal || propiedad?.historial_estados_venta?.reactiva_fecha">
              <label class="text-center readonly form-label">Baja Temporal</label>
              <input v-if="propiedad?.historial_estados_venta?.reactiva_fecha" type="date"
                class="form-control text-center readonly" name="fecha_baja_temporal_venta"
                :value="propiedad.historial_estados_venta.reactiva_fecha" readonly>
              <input v-else type="date" class="form-control text-center readonly" name="fecha_baja_temporal_venta"
                v-model="venta.fecha_baja_temporal_venta">
            </div>
            <div class="col-md-3 row pt-3">
              <div v-if="propiedad" class="form-group  col-md-12 pt-1">
                <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                  data-bs-target="#novedadesVentaPropiedad">
                  Novedades Venta
                </button>
              </div>
              <div v-if="propiedad" class="form-group  col-md-12 pt-1">
                <button type="button" class="btn btn-primary btn-sm w-100" @click="fichaPdfRef.generarPdf()">
                  Ficha PDF
                </button>
              </div>

            </div>

            <!-- Componente oculto con la plantilla -->
            <FichaPropiedad ref="fichaPdfRef" :propiedad="propiedad" :ubicacion="'V'" />
          </div>

          <div class="modal-footer mt-2">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalNovedades :propiedad="propiedad" ubicacion="V" modalId="novedadesVentaPropiedad"
    @update:novedad="emit('update:novedadVenta', $event)"
    @update:observacionesModificadas="emit('update:observacionesModificadasVenta', $event)"
    :propiedad-update="propiedadUpdate" />
</template>

<script setup>
import ModalNovedades from './ModalNovedades.vue'
import FichaPropiedad from './Pdf/FichaDePropiedad.vue'
import { reactive, watch, defineEmits, computed, ref, nextTick } from 'vue'
import { propertyUpdateFormState } from '../../../utils/propertyUpdateChanges.js'

// Recibir las props del componente padre
const props = defineProps({
  estadosVenta: {
    type: Array,
    default: () => []
  },
  captadoresInternos: {
    type: Array,
    default: () => []
  },
  asesores: {
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

// Definir los emits
const emit = defineEmits(['update:venta', 'update:novedadVenta', 'update:observacionesModificadasVenta'])
const fichaPdfRef = ref(null)
const hidratando = ref(false)

// Watch para precargar datos cuando llega propiedadUpdate (como en comodidades)
watch(() => props.propiedadUpdate, (newValue) => {
  if (newValue) {
    hidratando.value = true
    Object.assign(venta, propertyUpdateFormState(newValue).venta)
    nextTick(() => {
      hidratando.value = false
    })
  }
}, { immediate: true })

// Computed property para determinar la moneda a mostrar
const monedaVentaDisplay = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  if (!propiedadActiva?.precio_actual) return 'u$s'

  const precio = propiedadActiva.precio_actual

  // Prioridad 1: Precio de venta en dólares
  if (precio.moneda_venta_dolar) {
    return 'u$s'
  }

  // Prioridad 2: Precio de venta en pesos
  if (precio.moneda_venta_pesos) {
    return '$'
  }

  // Prioridad 3: Precio de alquiler en dólares
  if (precio.moneda_alquiler_dolar) {
    return 'u$s'
  }

  // Prioridad 4: Precio de alquiler en pesos
  if (precio.moneda_alquiler_pesos) {
    return '$'
  }

  // Default
  return 'u$s'
})

// Computed property para determinar el precio a mostrar
const precioVentaDisplay = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  if (!propiedadActiva?.precio_actual) return ''

  const precio = propiedadActiva.precio_actual

  // Prioridad 1: Precio de venta en dólares
  if (precio.moneda_venta_dolar) {
    return precio.moneda_venta_dolar
  }

  // Prioridad 2: Precio de venta en pesos
  if (precio.moneda_venta_pesos) {
    return precio.moneda_venta_pesos
  }

  // Prioridad 3: Precio de alquiler en dólares
  if (precio.moneda_alquiler_dolar) {
    return precio.moneda_alquiler_dolar
  }

  // Prioridad 4: Precio de alquiler en pesos
  if (precio.moneda_alquiler_pesos) {
    return precio.moneda_alquiler_pesos
  }

  // Default
  return ''
})

// Computed property para obtener la fecha de tasación más reciente
const fechaTasacionDisplay = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  if (!propiedadActiva?.tasaciones || propiedadActiva.tasaciones.length === 0) {
    return ''
  }

  // Encontrar la tasación con el ID más grande
  const tasacionMasReciente = propiedadActiva.tasaciones.reduce((max, tasacion) => {
    return tasacion.id > max.id ? tasacion : max
  }, propiedadActiva.tasaciones[0])

  return tasacionMasReciente.fecha_tasacion || ''
})

const montoTasacion = computed(() => {
  const propiedadActiva = props.propiedad || props.propiedadUpdate
  if (!propiedadActiva?.tasaciones || propiedadActiva.tasaciones.length === 0) {
    return ''
  }

  // Encontrar la tasación con el ID más grande
  const tasacionMasReciente = propiedadActiva.tasaciones.reduce((max, tasacion) => {
    return tasacion.id > max.id ? tasacion : max
  }, propiedadActiva.tasaciones[0])

  return tasacionMasReciente.tasacion_dolar_venta ? tasacionMasReciente.tasacion_dolar_venta : tasacionMasReciente.tasacion_pesos_venta
})


// Datos reactivos del modal
const venta = reactive(
  {
    asesor_resultado: '',
    captador_interno_v: '',
    cod_venta: '',
    estado_venta: '',
    moneda_venta: '2',
    monto_venta: '',
    fecha_tasacion_venta: '',
    tasacion_venta: '',
    exclusividad_venta: '',
    comparte_venta: '',
    condicionado_venta: '',
    venta_fecha_alta: '',
    fecha_autorizacion_venta: '',
    comentario_autorizacion: '',
    zona_prop: '',
    flyer_v: '',
    reel_v: '',
    web_v: '',
    descripcion_estado_venta: '',
    fecha_baja_temporal_venta: '',
    autorizacion_venta: '',
  }
)
// Lógica toggleDescripcion para venta
const ESTADOS_CON_DESCRIPCION_VENTA = ['BAJA', 'RESET', 'BAJA TEMPORAL']

const estadoVentaTexto = computed(() => {
  if (!venta.estado_venta) return ''
  const estado = props.estadosVenta.find(e => e.id == venta.estado_venta)
  return estado?.name?.trim().toUpperCase() || ''
})

const mostrarDescripcion = computed(() =>
  ESTADOS_CON_DESCRIPCION_VENTA.includes(estadoVentaTexto.value)
)

const mostrarBajaTemporal = computed(() =>
  estadoVentaTexto.value === 'BAJA TEMPORAL'
)

watch(mostrarDescripcion, (val) => {
  if (!val && !hidratando.value) venta.descripcion_estado_venta = ''
})

watch(mostrarBajaTemporal, (val) => {
  if (!val && !hidratando.value) venta.fecha_baja_temporal_venta = ''
})

watch(venta, (newValue) => {
  emit('update:venta', { ...newValue })
}, { deep: true })


</script>
