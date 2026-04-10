<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Devolucion</template>
    <template #body>
      <div class="row form-group">
        <!-- <div class="col-md-12">
          <label for="nombre" class="form-label">Devolucion</label>
        </div> -->
        <div class="col-md-12">
          <textarea v-model="mensajeDevolucion" class="form-control" rows="5"></textarea>
        </div>
      </div>
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
