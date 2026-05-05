<template>
    <BaseModal :show="modalModificar" size="xl" @close="$emit('cerrarModalModificar')">
        <template #body>
            <!-- Usamos v-if para asegurarnos de que no renderice nada si datosRetencion es null -->
            <form v-if="datosRetencion" @submit.prevent="guardarCambios" class="row g-3 form-group">
                
                <div class="col-md-3">
                    <label class="form-label">CUIT</label>
                    <input type="text" class="form-control" :value="datosRetencion.cuit_retencion" disabled>
                </div>

                <div class="col-md-3">
                    <label class="form-label">Fecha Quincena</label>
                    <input type="date" class="form-control" v-model="form.fecha_comprobante">
                </div>

                <div class="col-md-3">
                    <label class="form-label">Base</label>
                    <select class="form-select" v-model="form.calcula_base">
                        <option value="S">Si</option>
                        <option value="N">No</option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label">N° Compr.</label>
                    <input type="number" class="form-control" v-model="form.numero_comprobante">
                </div>

                <div class="col-md-4">
                    <label class="form-label">Importe Compr.</label>
                    <input type="number" step="0.01" class="form-control" v-model="form.importe_comprobante">
                </div>

                <div class="col-md-4">
                    <label class="form-label">Importe Ret.</label>
                    <input type="number" step="0.01" class="form-control" v-model="form.importe_retencion" disabled>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('cerrarModalModificar')">Cerrar</button>
                    <button type="submit" class="btn btn-primary" :disabled="enviando">
                        {{ enviando ? 'Guardando...' : 'Modificar' }}
                    </button>
                </div>
            </form>
            <div v-else class="text-center">Cargando datos...</div>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'; // Importa watch para detectar cambios
import BaseModal from '@/components/base/BaseModal.vue';
import { modificarRetencionService } from '@/Services/api/Contable/RetencionesApi.js';

import { alertas } from '@/utils/alertas.js';

// 1. ASIGNAR A CONST PROPS (Esto era lo que faltaba)
const props = defineProps({
    modalModificar: Boolean,
    datosRetencion: Object 
});

const emit = defineEmits(['cerrarModalModificar', 'registroActualizado']);

// 2. Inicializar el formulario
const form = ref({
    id_comprobante: null,
    fecha_comprobante: '',
    calcula_base: '',
    numero_comprobante: '',
    importe_comprobante: '',
    importe_retencion: 0,
    last_modified_by: 7 
});

// 3. REACCIONAR A LOS CAMBIOS: Si abres otro registro, el form debe actualizarse
watch(() => props.datosRetencion, (newVal) => {
    if (newVal) {
        form.value.id_comprobante = newVal.id_comprobante;
        form.value.fecha_comprobante = newVal.fecha_comprobante;
        form.value.calcula_base = newVal.calcula_base;
        form.value.numero_comprobante = newVal.numero_comprobante;
        form.value.importe_comprobante = newVal.importe_comprobante;
        form.value.importe_retencion = newVal.importe_retencion;
    }
}, { immediate: true });

const enviando = ref(false);

const guardarCambios = async () => {
    enviando.value = true;
    try {
        console.log("id_comprobante", form.value.id_comprobante);
        console.log("data", form.value);
        await modificarRetencionService(form.value.id_comprobante, form.value);
        alertas.success('Registro actualizado');
        emit('registroActualizado'); 
        emit('cerrarModalModificar');
    } catch (err) {
        alertas.error('Error al actualizar');
        console.error(err);
    } finally {
        enviando.value = false;
    }
};
</script>