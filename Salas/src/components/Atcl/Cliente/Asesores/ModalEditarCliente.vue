<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Modificar Cliente</template>
    <template #body>
      <div class="row form-group">

        <div class="col-md-4">
          <label for="nombre" class="form-label">Nombre</label>
          <input type="text" class="form-control form-control-sm" id="nombre" v-model="form.nombre">
        </div>

        <div class="col-md-5">
          <label for="telefono" class="form-label">Telefono</label>
          <input type="text" class="form-control form-control-sm" id="telefono" v-model="form.telefono">
        </div>

        <div class="col-md-3">
          <label for="observaciones" class="form-label">Observaciones</label>
          <input type="text" class="form-control form-control-sm" id="observaciones" v-model="form.observaciones">
        </div>

        <div class="col-md-5">
          <label for="nombre_inmobiliaria" class="form-label">Nombre de la Inmobiliaria</label>
          <input type="text" class="form-control form-control-sm" id="nombre_inmobiliaria" v-model="form.nombre_de_inmobiliaria">
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
import { defineProps, defineEmits, onMounted, reactive, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { modificarCliente } from '@/Services/api/Atcl/Cliente/ClienteApi'

const props = defineProps({
  show: { type: Boolean, default: false },
  cliente: { type: Object, default: null }
})

const emit = defineEmits(['close', 'seleccionar', 'criterio-actualizado'])



const form = reactive({
  id_cliente: null,
  nombre: null,
  telefono: null,
  observaciones: null,
  nombre_de_inmobiliaria: null
})

watch(
  () => props.cliente,
  (nuevoCliente) => {
    if (nuevoCliente) {
      form.id_cliente = nuevoCliente.id_cliente
      form.nombre = nuevoCliente.nombre
      form.telefono = nuevoCliente.telefono
      form.observaciones = nuevoCliente.observaciones
      form.nombre_de_inmobiliaria = nuevoCliente.nombre_de_inmobiliaria
    }
  },
  { immediate: true } // Se ejecuta de inmediato al montar
)

const actualizarCliente = async () => {
  try {
    console.log('📦 Cliente actualizado:', { ...form })

    await modificarCliente(form)
    emit('criterio-actualizado')
    emit('close')
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    // Aquí podrías mostrar un mensaje de error al usuario
  }
}

onMounted(async () => {

if (props.cliente) {
    form.id_cliente = props.cliente.id_cliente
    form.nombre = props.cliente.nombre
    form.telefono = props.cliente.telefono
    form.observaciones = props.cliente.observaciones
    form.nombre_de_inmobiliaria = props.cliente.nombre_de_inmobiliaria
  }
})
</script>
