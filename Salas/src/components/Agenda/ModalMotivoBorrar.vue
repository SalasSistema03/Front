<template>
  <BaseModal :show="show" size="md" @close="emit('close')">
    <template #title>Motivo de borrado</template>

    <template #body>
      <div class="row">
        <div class="col-12">
          <label>Motivo</label>
          <textarea class="form-control" rows="3" v-model="motivo"></textarea>
          <div v-if="mostrarError" class="text-danger small mt-1">El motivo es obligatorio</div>
        </div>
      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cancelar</button>
      <button type="button" class="btn btn-danger btn-sm" @click="confirmar">Aceptar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'

const props = defineProps({
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'confirm', 'nota-borrada'])

const motivo = ref('')
const mostrarError = ref(false)

watch(
  () => props.show,
  (nuevo) => {
    if (nuevo) {
      motivo.value = ''
      mostrarError.value = false
    }
  }
)

function confirmar() {
  const valor = String(motivo.value || '').trim()
  if (!valor) {
    mostrarError.value = true
    return
  }

  emit('confirm', valor)
  emit('nota-borrada')
  emit('close')
}
</script>
