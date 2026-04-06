<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Devolucion</template>
    <template #body>
      <div class="row form-group">
        <div class="col-md-4">
          <label for="nombre" class="form-label">Devolucion</label>
          <textarea v-model="mensajeDevolucion" name="" id=""></textarea>
        </div>
      </div>
      <br>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="actualizarCliente()">Enviar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  item: { type: Object, default: null }
})

const mensajeDevolucion = ref('')
const emit = defineEmits(['close', 'mensajeDevolucion'])

const actualizarCliente = () => {
  console.log('datos del modal', props.item)
  emit('mensajeDevolucion', mensajeDevolucion.value, props.item)
  emit('close')
}
</script>
