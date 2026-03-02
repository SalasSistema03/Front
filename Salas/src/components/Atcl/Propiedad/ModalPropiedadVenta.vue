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
              <label class="text-center form-label" id="basic-addon1">Codigo</label>
              <input v-if="propiedad" type="number" class="form-control text-center" :value="propiedad.cod_venta"
                placeholder="Ej: 3950" readonly>
              <input v-else type="number" class="form-control text-center " id="" min="0" v-model="venta.cod_venta"
                placeholder="Ej: 3950">
            </div>
            <div class="form-group  px-1 col-md-3">
              <label class="text-center form-label" for="">Estado de Venta</label>
              <input v-if="propiedad" type="text" class="form-control text-center"
                :value="propiedad.estado_venta?.name || ''" readonly>
              <select v-else class="form-select " aria-label="Default select example" v-model="venta.estado_venta">
                <option value="">Seleccione una estado</option>

                <option v-for="estado in (props.estadosVenta || [])" :key="estado?.id" :value="estado?.id">
                  {{ estado?.name }}
                </option>

              </select>
            </div>
            <div class="col-md-2 form-group" style="padding-top: 6px;">
              <label class="text-center form-label" id="basic-addon1">
              </label>
              <!-- Si hay propiedad, mostrar moneda según prioridad -->
              <input v-if="propiedad" type="text" class="form-control text-center" :value="monedaVentaDisplay" readonly>
              <!-- Si no hay propiedad, mostrar select editable -->
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.moneda_venta">
                <option value="2" selected>u$s</option>
                <option value="1">$</option>
              </select>
            </div>
            <div class=" form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Precio</label>
              <!-- Si hay propiedad, mostrar precio según prioridad -->
              <input v-if="propiedad" type="number" class="form-control text-center" :value="precioVentaDisplay"
                readonly>
              <!-- Si no hay propiedad, mostrar input editable -->
              <input v-else type="number" class="form-control text-center " id="" min="0" v-model="venta.monto_venta"
                placeholder="Ej: 50000">
            </div>
            <div class="form-group  px-1 col-md-2">
              <label class="text-center form-label" id="basic-addon1">Tasacion</label>
              <!-- Si hay propiedad, mostrar fecha de tasación más reciente -->
              <input v-if="propiedad" type="date" class="form-control text-center" :value="fechaTasacionDisplay"
                readonly>
              <!-- Si no hay propiedad, mostrar input editable -->
              <input v-else type="date" class="form-control text-center" v-model="venta.fecha_tasacion_venta">
            </div>
            <div class="form-group  px-1 col-md-2">
              <label class="text-center form-label" id="basic-addon1">Valor
                Tasacion</label>
              <input v-if="propiedad" type="number" class="form-control text-center" :value="montoTasacion" readonly>
              <input v-else type="number" class="form-control text-center " id="" placeholder="Ej: 50000"
                v-model="venta.tasacion_venta">
            </div>

            <div class="form-group  px-1 col-md-2">
              <label class="text-center form-label" id="basic-addon1">Exclusividad</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="propiedad.exclusividad_venta"
                readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.exclusividad_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-2">
              <label class="text-center form-label" id="basic-addon1">Comparte</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="propiedad.comparte_venta"
                readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.comparte_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-2">
              <label class="text-center form-label" id="basic-addon1">Condicionado</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="propiedad.condicionado_venta"
                readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.condicionado_venta">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>
            <div class="form-group  px-1 col-md-2">
              <label class="text-center form-label" id="basic-addon1">Fecha
                Alta</label>
              <input v-if="propiedad" type="date" class="form-control text-center" :value="propiedad.venta_fecha_alta"
                readonly>
              <input v-else type="date" class="form-control text-center" v-model="venta.venta_fecha_alta">
            </div>
            <div class="form-group  px-1 col-md-2">
              <label class="text-center form-label" id="basic-addon1">Fecha
                Aut.</label>
              <input v-if="propiedad" type="date" class="form-control text-center"
                :value="propiedad.fecha_autorizacion_venta" readonly>
              <input v-else type="date" class="form-control text-center" v-model="venta.fecha_autorizacion_venta">
            </div>
            <div class="form-group  px-1 col-md-4 ">
              <label class="text-center form-label" id="basic-addon1">Comentario
                Autorizacion</label>
              <textarea v-if="propiedad" name="comentario_autorizacion" id="comentario_autorizacion" cols="3" rows="1"
                class="form-control" :value="propiedad.comentario_autorizacion" readonly></textarea>
              <textarea v-else name="comentario_autorizacion" id="comentario_autorizacion" cols="3" rows="1"
                class="form-control" v-model="venta.comentario_autorizacion"></textarea>
            </div>

            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Zona Prop</label>
              <input v-if="propiedad" type="date" class="form-control text-center" :value="propiedad.zona_prop"
                readonly>
              <input v-else type="date" class="form-control text-center" v-model="venta.zona_prop">
            </div>

            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Flyer IG</label>
              <input v-if="propiedad" type="date" class="form-control text-center" :value="propiedad.flyer" readonly>
              <input v-else type="date" class="form-control text-center" v-model="venta.flyer">
            </div>


            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Reel IG</label>
              <input v-if="propiedad" type="date" class="form-control text-center" :value="propiedad.reel" readonly>
              <input v-else type="date" class="form-control text-center" v-model="venta.reel">
            </div>


            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Web</label>
              <input v-if="propiedad" type="text" class="form-control text-center" :value="propiedad.web" readonly>
              <select v-else class="form-select" aria-label="Default select example" v-model="venta.web">
                <option value="">-</option>
                <option value="SI">
                  SI</option>
                <option value="NO">
                  NO</option>
              </select>
            </div>

            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Captador Interno</label>
              <input v-if="propiedad" type="text" class="form-control text-center"
                :value="propiedad.usuario_captador_int?.username" readonly>
              <select v-else class="form-select" aria-label="Default select example"
                v-model.number="venta.captador_interno">

                <option v-for="captador in (props.captadoresInternos?.original || [])" :key="captador?.id || captador"
                  :value="captador?.id">
                  {{ captador?.username }}
                </option>
              </select>
            </div>


            <div class="form-group  px-1 col-md-2 ">
              <label class="text-center form-label" id="basic-addon1">Asesor</label>
              <input v-if="propiedad" type="text" class="form-control text-center"
                :value="propiedad.usuario_asesor?.username" readonly>
              <select v-else class="form-select" v-model.number="venta.asesor_resultado">


                <option v-for="asesor in (props.asesores || [])" :key="asesor?.id_usuario || asesor"
                  :value="asesor?.id_usuario">
                  {{ asesor?.username }}
                </option>


              </select>
            </div>
          </div>

          <div class="modal-footer mt-2">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

console.log('props', props.captadoresInternos)

import { reactive, watch, defineEmits, computed } from 'vue'

// Definir los emits
const emit = defineEmits(['update:venta'])

// Watch para precargar datos cuando llega propiedadUpdate (como en comodidades)
watch(() => props.propiedadUpdate, (newValue) => {
  if (newValue) {
    /*  console.log('Cargando datos de venta:', newValue) */
    // Precargar los datos en el formulario
    venta.cod_venta = newValue.cod_venta || ''
    venta.estado_venta = newValue.id_estado_venta || ''
    venta.moneda_venta = newValue.precio_actual?.moneda_venta_dolar ? '2' : '1'
    venta.monto_venta = newValue.precio_actual?.moneda_venta_dolar || newValue.precio_actual?.moneda_venta_pesos || ''

    // Precargar fecha y monto de tasación más reciente
    if (newValue.tasaciones && newValue.tasaciones.length > 0) {
      const tasacionMasReciente = newValue.tasaciones.reduce((max, tasacion) => {
        return tasacion.id > max.id ? tasacion : max
      }, newValue.tasaciones[0])

      venta.fecha_tasacion_venta = tasacionMasReciente.fecha_tasacion || ''
      venta.tasacion_venta = tasacionMasReciente.tasacion_dolar_venta || tasacionMasReciente.tasacion_pesos_venta || ''
    } else {
      venta.fecha_tasacion_venta = ''
      venta.tasacion_venta = ''
    }

    venta.exclusividad_venta = newValue.exclusividad_venta || ''
    venta.comparte_venta = newValue.comparte_venta || ''
    venta.condicionado_venta = newValue.condicionado_venta || ''
    venta.venta_fecha_alta = newValue.venta_fecha_alta || ''
    venta.fecha_autorizacion_venta = newValue.fecha_autorizacion_venta || ''
    venta.comentario_autorizacion = newValue.comentario_autorizacion || ''
    venta.zona_prop = newValue.zona_prop || ''
    venta.flyer = newValue.flyer || ''
    venta.reel = newValue.reel || ''
    venta.web = newValue.web || ''
    venta.captador_interno = newValue.usuario_captador_int?.id || ''
    venta.asesor_resultado = newValue.usuario_asesor?.id || ''
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
    captador_interno: '',
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
    flyer: '',
    reel: '',
    web: '',
  }
)




watch(venta, (newValue) => {
  emit('update:venta', { ...newValue })
}, { deep: true })


</script>
