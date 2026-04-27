<template>
  <baseModal :show="show" size="md" @close="emit('close')">
    <template #title>Modificar Impuesto</template>
    <template #body>
      <div class="row form-group m-0 p-0">
        <div class="col-md-4">
          <label for="edit-folio" class="form-label">Folio</label>
          <input type="text" class="form-control"  autocomplete="off" v-model="localPadron.folio">
        </div>
        <div class="col-md-8">
          <label for="edit-calle" class="form-label">Calle</label>
          <input type="text" class="form-control"  autocomplete="off" v-model="localPadron.calle">
        </div>
        <div class="col-md-8">
          <label for="edit-partida" class="form-label">Partida</label>
          <input type="text" class="form-control"  autocomplete="off" v-model="localPadron.partida">
        </div>
        <div class="col-md-4">
          <label for="edit-clave" class="form-label" v-if="props.impuesto === 'tgi'">Clave</label>
          <label for="edit-clave" class="form-label" v-if="props.impuesto === 'gas'">Cliente</label>
          <label for="edit-clave" class="form-label" v-if="props.impuesto === 'agua'">Punto</label>
          <input type="text" class="form-control"  autocomplete="off" v-model="localPadron.clave">
        </div>
        <div class="col-md-6">
          <label for="edit-estado" class="form-label">Estado</label>
          <select class="form-select"  autocomplete="off" v-model="localPadron.estado">
            <option value="ACTIVO">ACTIVO</option>
            <option value="PENDIENTE" v-if="props.impuesto === 'gas' || props.impuesto === 'agua'">PENDIENTE</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>
        <div class="col-md-6">
          <label for="edit-administra" class="form-label">Administra</label>
          <select class="form-select"  autocomplete="off" v-model="localPadron.administra">
            <option value="P">Propietario</option>
            <option value="L">Inmobiliario</option>
            <option value="I">Inquilino</option>
          </select>
        </div>
      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
      <button type="button" class="btn btn-primary btn-sm" @click="guardarCambios()">Guardar Cambio</button>
    </template>
  </baseModal>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { actualizarRegistro } from '@/Services/api/Impuestos/tgiApi'
import { useToast } from '@/composables/useToast'

const { showError, showSuccess, } = useToast();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  padron: {
    type: Object,
    default: null
  },
  impuesto: {
    type: String,
    default: ''
  }
})

const localPadron = ref({})

const guardarCambios = async () => {
  const form = {
    impuesto: props.impuesto,
    ...localPadron.value
  }
  try {
    await actualizarRegistro(form)
    showSuccess('Registro actualizado correctamente')
    emit('success')
  } catch (error) {
    console.error('Error al actualizar el registro', error)
    showError('Error al actualizar el registro')
  }
  emit('close')
}


watch(() => props.padron, (newPadron) => {
  if (newPadron) {
    localPadron.value = { ...newPadron }
  }
}, { immediate: true })

const emit = defineEmits(['close', 'success'])
</script>
