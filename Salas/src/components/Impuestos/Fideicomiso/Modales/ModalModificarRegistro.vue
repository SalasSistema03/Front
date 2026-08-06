<template>
    <BaseModal :show="modalModificar" size="md" @close="$emit('cerrarModalModificar')">
        <template #title>
            Modificar Período: <span class="text-primary">{{ formatPeriodo(registro?.periodo) }}</span>
        </template>

        <template #body>
            <form @submit.prevent="guardarModificacion" class="row g-2 form-group">
                
                <!-- Iteramos sobre los conceptos para generar los inputs rápido -->
                <div class="col-6 col-md-4" v-for="concepto in conceptos" :key="concepto">
                    <label class="form-label small text-uppercase mb-1 fw-bold text-muted">{{ concepto }}</label>
                    <input 
                        v-model="form[concepto]" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        class="form-control form-control-sm shadow-sm"
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
import { modificarRegistroMensualService } from '@/Services/api/Impuestos/FideicomisoApi.js';

const props = defineProps({
    modalModificar: Boolean,
    registro: Object
});

const emit = defineEmits(['cerrarModalModificar', 'registroActualizado']);

const loading = ref(false);
const conceptos = ['tgi', 'agua', 'api', 'luz', 'seguro', 'limpieza', 'ascensor', 'honorario'];

// Clonamos los datos que vienen por prop para no mutar la tabla original hasta que se guarde en DB
const form = reactive({});

onMounted(() => {
    // Inicializamos el form con los valores actuales del registro
    conceptos.forEach(c => {
        form[c] = props.registro[c] || 0;
    });
});

const formatPeriodo = (fecha) => {
    if (!fecha) return '-';
    return fecha.substring(0, 7); 
};

const guardarModificacion = async () => {
    // 1. Validación estricta: No aceptar vacíos, negativos ni valores en 0
    for (const c of conceptos) {
        const valor = Number(form[c]); // Convertimos a número por las dudas
        
        if (form[c] === '' || form[c] === null) {
            alertas.error('Error de validación', `El concepto ${c.toUpperCase()} no puede ser 0 ni estar vacío.`);
            return; // Cortamos la ejecución acá, no va al backend
        }
    }

    // Si pasa la validación, procedemos a guardar
    loading.value = true;
    try {
        const payload = {};
        conceptos.forEach(c => {
            payload[c] = form[c];
        });

        await modificarRegistroMensualService(props.registro.id, payload);
        
        alertas.success('Modificado', 'Los importes se actualizaron correctamente.');
        
        emit('registroActualizado');
        emit('cerrarModalModificar');

    } catch (err) {
        console.error("Error al modificar:", err);
        alertas.error(err.response?.data?.message || 'Error al intentar guardar los cambios.');
    } finally {
        loading.value = false;
    }
};

</script>