<template>
<div class="modal fade" id="condicionAlquilesPropiedad" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Condición de Alquiler
                </h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="formulario" id="formulario" value="">
                <div class="row g-3">
                    <div class="col-md-12">
                        <div class="mb-6">
                            <textarea name="condicion" id="condicion" class="form-control form-control-atcl" rows="8" 
                                v-model="condicionData.condicion" placeholder="Ingrese las condiciones de alquiler..."></textarea>
                        </div>
                    </div>
                </div>
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
const emit = defineEmits(['update:condicion_alquiler'])

// Datos reactivos del modal
const condicionData = reactive({
    condicion: ''
})

// Observar cambios y emitir automáticamente
watch(condicionData, (newValue) => {
    emit('update:condicion_alquiler', { ...newValue })
}, { deep: true })
</script>
