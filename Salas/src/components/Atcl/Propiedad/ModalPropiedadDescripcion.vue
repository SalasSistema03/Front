<template>
    <!-- Modal -->
    <div class="modal fade" id="modalDescripcion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" 
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Descripción</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Si hay propiedad, mostrar en modo lectura -->
                    <textarea v-if="propiedad && propiedad.descipcion_propiedad"
                              style="width: 100%;" rows="8" 
                              :value="propiedad.descipcion_propiedad" 
                              readonly
                              class="form-control"></textarea>
                    
                    <!-- Si no hay propiedad o no tiene descripción, mostrar editable -->
                    <textarea v-else
                              style="width: 100%;" rows="5" 
                              v-model="descripcion.texto" 
                              placeholder="Ingrese la descripción de la propiedad..." 
                              class="form-control"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, defineEmits, defineProps } from 'vue'

// Definir props para recibir la propiedad (opcional)
const props = defineProps({
    propiedad: {
        type: Object,
        default: null
    }
})

// Definir los emits (para modo edición)
const emit = defineEmits(['update:descripcion'])

// Datos reactivos del modal (para modo edición)
const descripcion = reactive({
    texto: ''
})

// Observar cambios y emitir automáticamente (solo para modo edición)
watch(descripcion, (newValue) => {
    if (!props.propiedad || !props.propiedad.descipcion_propiedad) {
        emit('update:descripcion', { ...newValue })
    }
}, { deep: true })
</script>