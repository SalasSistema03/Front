<template>
  <BaseModal :show="show" size="" @close="$emit('close')">
    <template #title>
      FOLIO {{ inventario?.propiedad?.folios?.[0]?.folio }}
      / DIRECCION:
      {{ inventario?.propiedad?.calle?.name }}
      {{ inventario?.propiedad?.numero_calle }}
      {{ inventario?.propiedad?.piso ? `Piso: ${inventario?.propiedad?.piso}` : '' }}
      {{ inventario?.propiedad?.departamento ? `Dpto: ${inventario?.propiedad?.departamento}` : '' }}
    </template>

    <template #body>

      <div class="row">

        <div class="col-md-4 form-group form-control-sm">
          <label>Verficiado Por</label>
          <select class="form-select" v-model="form.verificado_por">
            <option value="">Seleccionar</option>
            <option v-for="u in usuarios" :key="u.value" :value="u.value">
              {{ u.username || 'Usuario ' + u.value }}
            </option>
          </select>
        </div>

        <div class="col-md-4 form-group form-control-sm">
          <label>Fecha Inventario</label>
          <input type="date" class="form-control" v-model="form.fecha_inventario">
        </div>

        <div class="col-md-4 form-group form-control-sm">
          <label>Estado</label>
          <select class="form-select" v-model="form.estado_id">
            <option value="">Seleccionar</option>
            <option v-for="estado in estados" :key="estado.id" :value="estado.id">
              {{ estado.estado }}
            </option>
          </select>
        </div>
        <div class="col-md form-group form-control-sm">
          <label>Observaciones</label>
          <textarea class="form-control" v-model="form.observaciones"></textarea>
        </div>

      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="$emit('close')">
        Cancelar
      </button>
      <button type="button" class="btn btn-primary btn-sm" @click="guardarCambios">
        Guardar Cambios
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { getUsuariosDpto, getEstadoDpto } from '@/Services/api/Dpto/Inventario'



const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  inventario: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'guardar'])

const usuarios = ref([])
const estados = ref([])
const form = ref({
  verificado_por: '',
  fecha_inventario: '',
  inventario_id: '',
  estado_id: '',
  observaciones: '',
})

watch(() => props.inventario, (newVal) => {
  if (newVal) {
    // Si fecha_inventario tiene formato "YYYY-MM-DD HH:MM:SS", cortamos para que type="date" lo entienda ("YYYY-MM-DD")
    const fechaInv = newVal.historial_estado_dpto?.fecha_inventario
    form.value.fecha_inventario = fechaInv ? fechaInv.split(' ')[0] : ''

    // Asignar el resto de valores que necesites cargar
    form.value.estado_id = newVal.historial_estado_dpto?.id_estado || ''

    const verificadoPor = newVal.historial_estado_dpto?.verificado_por
    form.value.verificado_por = verificadoPor?.id ?? ''

    form.value.inventario_id = newVal.historial_estado_dpto?.id
  }
}, { immediate: true })


const cargarUsuarios = async () => {
  try {
    const res = await getUsuariosDpto()
    const data = res.data.resultado || res.data || []

    usuarios.value = data.map((u) => ({
      ...u,
      value: u.id_usuario ?? u.id ?? u.usuario_id ?? u.usuario?.id ?? '',
      username: u.usuario?.username ?? u.username ?? u.usuario_username ?? 'Sin usuario'
    }))
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  }
}

const cargarEstados = async () => {
  try {
    const res = await getEstadoDpto()
    estados.value = res.data.resultado || res.data || []
  } catch (error) {
    console.error('Error cargando estados:', error)
  }
}

onMounted(() => {
  cargarUsuarios()
  cargarEstados()
})


const guardarCambios = () => {
  emit('guardar', form.value)
}
</script>
