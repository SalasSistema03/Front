<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Modificar Cliente</template>
    <template #body>
      <div class="row form-group">

        <div class="col-md-5">
          <label for="nombre" class="form-label">Nombre</label>
          <input type="text" class="form-control form-control-sm" id="nombre" v-model="form.nombre">
        </div>

        <div class="col-md-3">
          <label for="telefono" class="form-label">Telefono</label>
          <input type="text" class="form-control form-control-sm" id="telefono" v-model="form.telefono">
        </div>



        <div v-if="!modoHome" class="col-md-4">
          <label for="nombre_inmobiliaria" class="form-label">Inmobiliaria</label>
          <input type="text" class="form-control form-control-sm" id="nombre_inmobiliaria"
            v-model="form.nombre_de_inmobiliaria">
        </div>

        <div v-else class="col-md-4">
          <label for="estado_cliente" class="form-label">Estado</label>
          <select class="form-select form-select-sm" id="estado_cliente" v-model="form.estado_cliente">
            <option value="Pendiente">Pendiente</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <div class="col-md-12">
          <label for="observaciones" class="form-label">Observaciones</label>
          <input type="text" class="form-control form-control-sm" id="observaciones" v-model="observacionVisible">
        </div>
      </div>
      <br>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="actualizarCliente">Guardar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, reactive, watch, computed } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { modificarCliente } from '@/Services/api/Atcl/Cliente/ClienteApi'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  show: { type: Boolean, default: false },
  cliente: { type: Object, default: null },
  modoHome: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'seleccionar', 'criterio-actualizado'])

const { showSuccess, handleApiError } = useToast()

const form = reactive({
  id_cliente: null,
  nombre: null,
  telefono: null,
  observaciones: null,
  observaciones_alq: null,
  nombre_de_inmobiliaria: null,
  estado_cliente: 'Pendiente',
  estado: 'Pendiente'
})

const observacionVisible = computed({
  get: () => (props.modoHome ? form.observaciones_alq : form.observaciones),
  set: (value) => {
    if (props.modoHome) {
      form.observaciones_alq = value
    } else {
      form.observaciones = value
    }
  }
})

watch(
  () => props.cliente,
  (nuevoCliente) => {
    if (nuevoCliente) {
      form.id_cliente = nuevoCliente.id_cliente
      form.nombre = nuevoCliente.nombre
      form.telefono = nuevoCliente.telefono
      form.observaciones = nuevoCliente.observaciones ?? ''
      // En modo Home mostramos exclusivamente observaciones_alq (si es null mostramos '')
      if (props.modoHome) {
        form.observaciones_alq = nuevoCliente.observaciones_alq ?? ''
      } else {
        form.observaciones_alq = nuevoCliente.observaciones_alq ?? nuevoCliente.observaciones ?? ''
      }
      form.nombre_de_inmobiliaria = nuevoCliente.nombre_de_inmobiliaria
      form.estado_cliente = props.modoHome ? (nuevoCliente.estado_alq || 'Pendiente') : (nuevoCliente.estado_cliente || nuevoCliente.estado || 'Pendiente')
      form.estado = form.estado_cliente
    }
  },
  { immediate: true }
)

const actualizarCliente = async () => {
  try {
    const payload = { ...form }

    if (props.modoHome) {
      payload.estado = form.estado_cliente
      payload.observaciones = form.observaciones
      payload.observaciones_alq = form.observaciones_alq
      payload.nombre_de_inmobiliaria = null
    }

    await modificarCliente(payload)
    showSuccess('Cliente actualizado correctamente')
    emit('criterio-actualizado')
    emit('close')
  } catch (error) {
    handleApiError(error)
  }
}

onMounted(async () => {
  if (props.cliente) {
    form.id_cliente = props.cliente.id_cliente
    form.nombre = props.cliente.nombre
    form.telefono = props.cliente.telefono
    form.observaciones = props.cliente.observaciones ?? ''
    if (props.modoHome) {
      form.observaciones_alq = props.cliente.observaciones_alq ?? ''
    } else {
      form.observaciones_alq = props.cliente.observaciones_alq ?? props.cliente.observaciones ?? ''
    }
    form.nombre_de_inmobiliaria = props.cliente.nombre_de_inmobiliaria
    form.estado_cliente = props.modoHome ? (props.cliente.estado_alq || 'Pendiente') : (props.cliente.estado_cliente || props.cliente.estado || 'Pendiente')
    form.estado = form.estado_cliente
  }
})
</script>
