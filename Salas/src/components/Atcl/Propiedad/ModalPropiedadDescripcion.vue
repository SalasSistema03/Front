<template>
  <BaseModal v-if="usaBaseModal" :show="show" size="md" @close="emit('close')">
    <template #title>DescripciÃ³n</template>
    <template #body>
      <textarea v-if="propiedad && propiedad.descipcion_propiedad" style="width: 100%;" rows="8"
        :value="propiedad.descipcion_propiedad" readonly class="form-control"></textarea>
      <textarea v-else style="width: 100%;" rows="5" v-model="descripcion.texto"
        placeholder="Ingrese la descripciÃ³n de la propiedad..." class="form-control"></textarea>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="emit('close')">Cerrar</button>
    </template>
  </BaseModal>

  <!-- Modal -->
  <div v-else class="modal fade" id="modalDescripcion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Descripción</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- Si hay propiedad, mostrar en modo lectura -->
          <textarea v-if="propiedad && propiedad.descipcion_propiedad" style="width: 100%;" rows="8"
            :value="propiedad.descipcion_propiedad" readonly class="form-control"></textarea>

          <!-- Si no hay propiedad o no tiene descripción, mostrar editable -->
          <textarea v-else style="width: 100%;" rows="5" v-model="descripcion.texto"
            placeholder="Ingrese la descripción de la propiedad..." class="form-control"></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps, computed } from 'vue'
import BaseModal from '../../base/BaseModal.vue'
import * as bootstrap from 'bootstrap'

// Definir props para recibir la propiedad (opcional)
const props = defineProps({
  propiedad: {
    type: Object,
    default: null
  },
  propiedadUpdate: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: null
  }

})

// Definir los emits (para modo edición)
const emit = defineEmits(['update:descripcion', 'close'])

// Datos reactivos del modal (para modo edición)
const descripcion = reactive({
  texto: ''
})

watch(() => props.propiedadUpdate, (newValue) => {
  if (newValue) {
    //console.log('Cargando datos:', newValue)
    descripcion.texto = newValue.descipcion_propiedad || ''

  }
}, { immediate: true })
if (typeof window !== 'undefined') {
  window.bootstrap = window.bootstrap || bootstrap
}

const usaBaseModal = computed(() => props.show !== null)
// Observar cambios y emitir automáticamente (solo para modo edición)
watch(descripcion, (newValue) => {
  if (!props.propiedad || !props.propiedad.descipcion_propiedad) {
    emit('update:descripcion', { ...newValue })
  }
}, { deep: true })
</script>
