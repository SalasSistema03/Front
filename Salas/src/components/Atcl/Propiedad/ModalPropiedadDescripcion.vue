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
                    <textarea style="width: 100%;" rows="5" v-model="descripcion.texto" placeholder="Ingrese la descripción de la propiedad..." class="form-control"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, defineEmits } from 'vue'

// Definir los emits
const emit = defineEmits(['update:descripcion'])

// Datos reactivos del modal
const descripcion = reactive({
    texto: ''
})

// Observar cambios y emitir automáticamente
watch(descripcion, (newValue) => {
    emit('update:descripcion', { ...newValue })
}, { deep: true })
</script>