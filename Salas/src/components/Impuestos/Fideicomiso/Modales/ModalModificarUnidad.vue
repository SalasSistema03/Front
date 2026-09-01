<template>
    <BaseModal :show="modalModificar" size="md" @close="$emit('cerrarModalModificar')">
        <template #title>
            Modificar Unidad
        </template>

        <template #body>
            <form @submit.prevent="guardarModificacion" class="row g-3 form-group">
                
                <div class="col-6">
                    <label class="form-label small text-muted fw-bold mb-1">Piso</label>
                    <input 
                        v-model="form.piso" 
                        type="text" 
                        class="form-control form-control-sm shadow-sm"
                        required
                    >
                </div>

                <div class="col-6">
                    <label class="form-label small text-muted fw-bold mb-1">Unidad (Dto/Local)</label>
                    <input 
                        v-model="form.unidad" 
                        type="text" 
                        class="form-control form-control-sm shadow-sm"
                        required
                    >
                </div>

                <div class="col-12">
                    <label class="form-label small text-muted fw-bold mb-1">Propietario</label>
                    <input 
                        v-model="form.propietario" 
                        type="text" 
                        class="form-control form-control-sm shadow-sm"
                        placeholder="Dejar vacío si no se vendió"
                    >
                </div>

                <div class="col-12 col-md-6">
                    <label class="form-label small text-muted fw-bold mb-1">Porcentual (%)</label>
                    <input 
                        v-model="form.porcentual" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        max="100"
                        class="form-control form-control-sm shadow-sm"
                        required
                    >
                </div>

            </form>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary btn-sm" @click="$emit('cerrarModalModificar')" :disabled="loading">
                Cancelar
            </button>
            <button type="button" class="btn btn-primary btn-sm" @click="guardarModificacion" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-save me-1"></i>
                {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas.js';
// Asegurate de tener este servicio exportado en tu archivo de API
import { modificarUnidadService } from '@/Services/api/Impuestos/FideicomisoApi.js'; 

const props = defineProps({
    modalModificar: Boolean,
    datosUnidad: Object
});

const emit = defineEmits(['cerrarModalModificar', 'unidadActualizada']);

const loading = ref(false);
const form = reactive({
    piso: '',
    unidad: '',
    propietario: '',
    porcentual: 0
});

onMounted(() => {
    // Clonamos los datos actuales de la fila seleccionada
    if (props.datosUnidad) {
        form.piso = props.datosUnidad.piso || '';
        form.unidad = props.datosUnidad.unidad || '';
        form.propietario = props.datosUnidad.propietario || '';
        form.porcentual = props.datosUnidad.porcentual || 0;
    }
});

const guardarModificacion = async () => {
    // Validación rápida
    if (!form.piso || !form.unidad || form.porcentual <= 0) {
        alertas.error('Error', 'Completá los campos obligatorios y asegurate de que el porcentual sea mayor a 0.');
        return;
    }

    loading.value = true;
    try {
        await modificarUnidadService(props.datosUnidad.id, form);
        
        alertas.success('Modificado', 'Los datos de la unidad se actualizaron correctamente.');
        
        emit('unidadActualizada');
        emit('cerrarModalModificar');

    } catch (err) {
        console.error("Error al modificar la unidad:", err);
        alertas.error(err.response?.data?.message || 'Error al intentar guardar los cambios.');
    } finally {
        loading.value = false;
    }
};
</script>