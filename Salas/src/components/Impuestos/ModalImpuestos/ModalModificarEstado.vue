<template>
  <baseModal :show="show" size="md" @close="emit('close')">
    <template #title>Modificar Estado</template>
    <template #body>
      <div class="row form-group m-0 p-0">
        <div class="form-group">
          <label for="estado">Estado</label>
          <select class="form-select" v-model="estado">
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
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
import { defineEmits, ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { ModificarEstado } from '@/Services/api/Impuestos/tgiApi'


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

const estado = ref("ACTIVO")

const guardarCambios = async () => {

  const form = {
    estado: estado.value,
    padron: props.padron.id,
    impuesto: props.impuesto
  }
try{
  await ModificarEstado(form)
  emit('success')
  emit('close')
}catch(error){
  alert(error.message)
}
}


const emit = defineEmits(['close', 'success'])
</script>
