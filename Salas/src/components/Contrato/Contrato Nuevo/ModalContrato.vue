<template>
  <BaseModal :show="show" size="lg" @close="emit('close')">
    <template #title>
      FOLIO {{ formatearFolio(contrato?.propiedad?.folios) }}
      / DIRECCION
      {{ contrato?.propiedad?.calle?.name }}
      {{ contrato?.propiedad?.numero_calle }}
      {{ contrato?.propiedad?.piso ? `Piso: ${contrato.propiedad.piso}` : '' }}
      {{ contrato?.propiedad?.departamento ? `Dpto: ${contrato.propiedad.departamento}` : '' }}
    </template>

    <template #body>
      <form class="row g-3">
        <div class="row d-flex justify-content-around">
          <div class="col-md-3 form-group mt-0">
            <label class="form-label">Estado de Contrato</label>
            <select v-model="form.id_estado" class="form-control form-control-sm">
              <option value="">Seleccionar Estado</option>
              <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                {{ estado.estado }}
              </option>
            </select>
          </div>
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Inventario</label>
            <input type="date" v-model="form.fecha_inventario" class="form-control form-control-sm" />
          </div>
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Carpeta Presentada</label>
            <input type="date" v-model="form.fecha_comercial_presenta_carpeta" class="form-control form-control-sm" />
          </div>
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Preaprobado</label>
            <input type="date" v-model="form.fecha_preaprobada" class="form-control form-control-sm" />
          </div>
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Reserva</label>
            <input type="date" v-model="form.fecha_reserva" class="form-control form-control-sm" />
          </div>
        </div>

        <div class="row d-flex justify-content-center">

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Gasto Administrativo</label>
            <input type="number" v-model="form.gastos_administrativos" class="form-control form-control-sm" />
          </div>
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Tirilla entregada a:</label>
            <select v-model="form.tirilla_entregada_a" class="form-control form-control-sm">
              <option value="">Seleccionar</option>
              <option v-for="usuario in usuarioTirilla" :key="getUsuarioOptionValue(usuario)"
                :value="getUsuarioOptionValue(usuario)">
                {{ getUsuarioLabel(usuario) }}
              </option>
            </select>
          </div>
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Tirilla entregada</label>
            <input type="date" v-model="form.fecha_tirilla_entregada" class="form-control form-control-sm" />
          </div>
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Tirilla controlada por:</label>
            <select v-model="form.tirilla_controlada_por" class="form-control form-control-sm">
              <option value="">Seleccionar</option>
              <option v-for="usuario in usuarioControlaTirilla" :key="getUsuarioOptionValue(usuario)"
                :value="getUsuarioOptionValue(usuario)">
                {{ getUsuarioLabel(usuario) }}
              </option>
            </select>
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Tirilla controlada</label>
            <input type="date" v-model="form.fecha_tirilla_controlada" class="form-control form-control-sm" />
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Fecha Contrato</label>
            <input type="date" v-model="form.fecha_contrato" class="form-control form-control-sm" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Fecha Autorización</label>
            <input type="date" v-model="form.fecha_autorizacion" class="form-control form-control-sm" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Entrega de Llaves</label>
            <input type="date" v-model="form.fecha_finalizacion_firma_cobro" class="form-control form-control-sm" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Cant Meses</label>
            <input type="number" v-model="form.cant_meses" class="form-control form-control-sm"
              :disabled="form.bloqueado == 1" />
          </div>
        </div>

        <div class="row d-flex justify-content-center">
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Monto Documentacion</label>
            <input type="number" v-model="form.monto" class="form-control form-control-sm"
              :disabled="form.bloqueado == 1" />
          </div>

          <!-- <div class="col-md-2 form-group mt-0">
            <label class="form-label">Monto Contrato</label>
            <input type="number" v-model="form.monto_contrato" class="form-control form-control-sm"
              :disabled="form.bloqueado == 1" />
          </div> -->

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Hojas</label>
            <input type="number" v-model="form.chojas" class="form-control form-control-sm"
              :disabled="form.bloqueado == 1" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Informe</label>
            <select v-model="form.informe" class="form-control form-control-sm" :disabled="form.bloqueado == 1">
              <option value="">Seleccionar</option>
              <option value="SI">SI</option>
              <option value="NO">NO</option>
            </select>
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Cant. Inf</label>
            <input type="number" v-model="form.CantInforme" class="form-control form-control-sm"
              :disabled="form.bloqueado == 1" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Contrato</label>
            <select v-model="form.tipo_contrato" class="form-control form-control-sm" :disabled="form.bloqueado == 1">
              <option value="">Seleccionar</option>
              <option value="Vivienda">Vivienda</option>
              <option value="Comercio">Comercio</option>
              <option value="Cochera">Cochera</option>
            </select>
          </div>


          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Inq-Prop</label>
            <select v-model="form.inquilino_propietario" class="form-control form-control-sm"
              :disabled="form.bloqueado == 1">
              <option value="">Seleccionar</option>
              <option value="NO">NO</option>
              <option value="SI">SI</option>

            </select>
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Monto Alquiler</label>
            <input type="number" v-model="form.precio_alquiler" class="form-control form-control-sm"
              :disabled="form.bloqueado == 1" />
          </div>

        </div>

        <div class="row d-flex justify-content-around">
          <div class="col-md-12 form-group mt-0">
            <label class="form-label">Observaciones</label>
            <textarea v-model="form.observaciones" class="form-control form-control-sm" rows="3">¨¨</textarea>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">
        Cancelar
      </button>
      <button type="button" class="btn btn-primary btn-sm" @click="guardarCambios">
        Guardar Cambios
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { verificarPermisoUsuario } from '@/Services/api/Contrato/Contrato'
import { useDateFormatter } from '@/composables/useDateFormatter'
const props = defineProps({
  show: { type: Boolean, default: false },
  contrato: { type: Object, default: null },
  estados: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'guardar'])
const usuarioTirilla = ref([])
const usuarioControlaTirilla = ref([])
const { formatDateForInput } = useDateFormatter()


const normalizarFecha = (valor) => {
  if (!valor) return ''
  return formatDateForInput(valor) || ''
}

const getUsuarioOptionValue = (usuario) => {
  if (!usuario) return ''
  if (typeof usuario === 'object') {
    return usuario.usuario_id ?? usuario.id ?? usuario.usuario?.id ?? ''
  }
  return usuario
}

const getUsuarioLabel = (usuario) => {
  if (!usuario) return ''
  if (typeof usuario === 'object') {
    return usuario.username ?? usuario.name ?? usuario.usuario?.username ?? ''
  }
  return usuario
}

const getFormFromContrato = (contrato) => {
  const hc = contrato?.historial_estado_contrato
  const meses = contrato?.meses_contrato
  const precio_alquiler = contrato?.precio_alquiler
  let folio = []
  folio = contrato?.propiedad?.folios ?? []
  let monto_documento = contrato?.registro_sellado?.monto_documento
  let monto_contrato = contrato?.registro_sellado?.monto_contrato
  let chojas = contrato?.registro_sellado?.hojas
  let informe = contrato?.registro_sellado?.informe
  let CantInforme = contrato?.registro_sellado?.cantidad_informes
  let tipo_contrato = contrato?.registro_sellado?.tipo_contrato
  let inquilino_propietario = contrato?.registro_sellado?.inq_prop

  //console.log(contrato)
  const bloqueado = contrato?.registro_sellado?.mostrar
  console.log(bloqueado)
  //console.log('registroSellado', registro_sellado)
  //console.log('historial_estado_contrato', contrato)

  if (hc) {
    return {
      id_estado: hc.id_estado || '',
      fecha_inventario: normalizarFecha(hc.fecha_inventario),
      fecha_comercial_presenta_carpeta: normalizarFecha(hc.fecha_comercial_presenta_carpeta),
      fecha_preaprobada: normalizarFecha(hc.fecha_preaprobada),
      fecha_reserva: normalizarFecha(hc.fecha_reserva),
      gastos_administrativos: hc.gastos_administrativos || '',
      tirilla_entregada_a: getUsuarioOptionValue(hc.tirilla_entregada_a),
      fecha_tirilla_entregada: normalizarFecha(hc.fecha_tirilla_entregada),
      tirilla_controlada_por: getUsuarioOptionValue(hc.tirilla_controlada_por),
      fecha_tirilla_controlada: normalizarFecha(hc.fecha_tirilla_controlada),
      fecha_contrato: normalizarFecha(hc.fecha_contrato),
      fecha_autorizacion: normalizarFecha(hc.fecha_autorizacion),
      fecha_finalizacion_firma_cobro: normalizarFecha(hc.fecha_finalizacion_firma_cobro),
      cant_meses: meses || '',
      precio_alquiler: precio_alquiler || '',
      folio: folio || '',
      monto: monto_documento || '',
      monto_contrato: monto_contrato || '',
      chojas: chojas || '',
      informe: informe || '',
      CantInforme: CantInforme || '',
      tipo_contrato: tipo_contrato || '',
      inquilino_propietario: inquilino_propietario || '',
      bloqueado: bloqueado,
    }
  }

  return {
    id_estado: '',
    fecha_inventario: '',
    fecha_comercial_presenta_carpeta: '',
    fecha_preaprobada: '',
    fecha_reserva: '',
    gastos_administrativos: '',
    tirilla_entregada_a: '',
    fecha_tirilla_entregada: '',
    tirilla_controlada_por: '',
    fecha_tirilla_controlada: '',
    fecha_contrato: '',
    fecha_autorizacion: '',
    fecha_finalizacion_firma_cobro: '',
    observaciones: '',
    bloqueado: null
  }
}

const form = ref(getFormFromContrato(props.contrato))

watch(() => props.contrato, (newContrato) => {
  form.value = getFormFromContrato(newContrato)
}, { immediate: true })

const formatearFolio = (folios) => {
  if (!folios || folios.length === 0) return '-'
  return (
    folios
      .filter((f) => f.folio)
      .map((f) => {
        const num = f.folio
        if (f.empresa_id === 1) return `${num}`
        if (f.empresa_id === 2) return `CAN ${num}`
        if (f.empresa_id === 3) return `TRIB ${num}`
        return `${num}`
      })
      .join(' / ') || '-'
  )
}

const guardarCambios = () => {
  emit('guardar', {
    id_proceso: props.contrato?.id,
    id_historial: props.contrato?.id_historial_estado_contrato,
    ...form.value
  })
}


const permisotirilla = async () => {
  const response = await verificarPermisoUsuario('controlTirilla')

  usuarioTirilla.value = response.data
  usuarioControlaTirilla.value = response.data
  //console.log('aca')
  //console.log(usuarioTirilla.value)
}

onMounted(() => {
  permisotirilla()

});
</script>
