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
            <label class="form-label">Fecha Inventario ----</label>
            <input type="date" v-model="form.fecha_inventario" class="form-control form-control-sm" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Carpeta Presentada</label>
            <input type="date" v-model="form.fecha_comercial_presenta_carpeta" class="form-control form-control-sm" />
          </div>


          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Preaprobado ------</label>
            <input type="date" v-model="form.fecha_preaprobada" class="form-control form-control-sm" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Fecha Reserva</label>
            <input type="date" v-model="form.fecha_reserva" class="form-control form-control-sm" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Gastos Administrativos</label>
            <input type="number" v-model="form.gastos_administrativos" class="form-control form-control-sm" />
          </div>
        </div>

        <div class="row d-flex justify-content-around">
          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Tirilla entregada a</label>
            <select v-model="form.tirilla_entregada_a" class="form-control form-control-sm">
              <option value="">Seleccionar</option>
              <option v-for="usuario in usuarioTirilla" :key="usuario.id" :value="usuario.id">
                {{ usuario.username }}
              </option>
            </select>
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Fecha tirilla entregada</label>
            <input type="date" v-model="form.fecha_tirilla_entregada" class="form-control form-control-sm" />
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Tirilla controlada por</label>
            <select v-model="form.tirilla_controlada_por" class="form-control form-control-sm">
              <option value="">Seleccionar</option>
              <option v-for="usuario in usuarioControlaTirilla" :key="usuario.id" :value="usuario.id">
                {{ usuario.username }}
              </option>
            </select>
          </div>

          <div class="col-md-2 form-group mt-0">
            <label class="form-label">Fecha tirilla controlada</label>
            <input type="date" v-model="form.fecha_tirilla_controlada" class="form-control form-control-sm" />
          </div>
        </div>

        <div class="row d-flex justify-content-around">
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
        </div>

        <div class="row d-flex justify-content-around">
          <div class="col-md-12 form-group mt-0">
            <label class="form-label">Observaciones</label>
            <textarea v-model="form.observaciones" class="form-control form-control-sm" rows="3"></textarea>
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
const props = defineProps({
  show: { type: Boolean, default: false },
  contrato: { type: Object, default: null },
  estados: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'guardar'])
const usuarioTirilla = ref([])
const usuarioControlaTirilla = ref([])
const form = ref({
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
  observaciones: ''
})

watch(() => props.contrato, (newContrato) => {
  if (newContrato && newContrato.historial_estado_contrato) {
    const hc = newContrato.historial_estado_contrato
    form.value = {
      id_estado: hc.id_estado || '',
      fecha_inventario: hc.fecha_inventario || '',
      fecha_comercial_presenta_carpeta: hc.fecha_comercial_presenta_carpeta || '',
      fecha_preaprobada: hc.fecha_preaprobada || '',
      fecha_reserva: hc.fecha_reserva || '',
      gastos_administrativos: hc.gastos_administrativos || '',
      tirilla_entregada_a: hc.tirilla_entregada_a || '',
      fecha_tirilla_entregada: hc.fecha_tirilla_entregada || '',
      tirilla_controlada_por: hc.tirilla_controlada_por || '',
      fecha_tirilla_controlada: hc.fecha_tirilla_controlada || '',
      fecha_contrato: hc.fecha_contrato || '',
      fecha_autorizacion: hc.fecha_autorizacion || '',
      fecha_finalizacion_firma_cobro: hc.fecha_finalizacion_firma_cobro || '',
      observaciones: hc.observaciones || ''
    }
  } else {
    form.value = {
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
      observaciones: ''
    }
  }
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
