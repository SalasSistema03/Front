<template>
    <!-- Cambié el tamaño a lg (largo) para que entren más cómodos los nuevos campos -->
    <BaseModal :show="modalModificar" size="lg" @close="$emit('cerrarModalModificar')">
        <template #title>
            Modificar Período: <span class="text-primary">{{ formatPeriodo(registro?.periodo) }}</span>
        </template>

        <template #body>
            <form @submit.prevent="guardarModificacion" class="form-group">
                
                <!-- SECCIÓN 1: CONCEPTOS REGULARES -->
                <h6 class="text-primary border-bottom pb-1 mb-3" style="font-size: 0.9rem;">Conceptos Regulares</h6>
                <div class="row g-3 mb-4">
                    <!-- Mantenemos el bucle acá para no escribir 9 inputs iguales y hacer bulto -->
                    <div class="col-6 col-md-3" v-for="concepto in conceptos" :key="concepto">
                        <label class="form-label small text-uppercase mb-1 fw-bold text-muted">{{ concepto }}</label>
                        <input 
                            v-model="form[concepto]" 
                            type="number" 
                            step="0.01" 
                            min="0"
                            class="form-control form-control-sm shadow-sm"
                        >
                    </div>
                </div>

                <!-- SECCIÓN 2: extraordinaria Y OTROS (Explícitos y Entendibles) -->
                <h6 class="text-primary border-bottom pb-1 mb-3" style="font-size: 0.9rem;">extraordinaria y Otros</h6>
                <div class="row g-3">
                    <div class="col-6 col-md-3">
                        <label class="form-label small text-uppercase mb-1 fw-bold text-muted">extraordinaria</label>
                        <input 
                            v-model="form.extraordinaria" 
                            type="number" 
                            step="0.01" 
                            min="0"
                            class="form-control form-control-sm shadow-sm"
                        >
                    </div>

                    <div class="col-6 col-md-3">
                        <label class="form-label small text-uppercase mb-1 fw-bold text-muted">OTRO (Monto)</label>
                        <input 
                            v-model="form.otro" 
                            type="number" 
                            step="0.01" 
                            min="0"
                            class="form-control form-control-sm shadow-sm"
                        >
                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-label small text-uppercase mb-1 fw-bold text-muted">OBSERVACIÓN (OTRO)</label>
                        <input 
                            v-model="form.otro_observaciones" 
                            type="text" 
                            class="form-control form-control-sm shadow-sm"
                            placeholder="Detalle de qué es este otro gasto..."
                        >
                    </div>
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

// Dejamos los conceptos regulares en un array para armar los primeros inputs dinámicamente
const conceptos = ['tgi', 'agua', 'api', 'luz', 'seguro', 'limpieza', 'ascensor', 'internet', 'honorario'];

// AHORA: Definimos TODOS los campos explícitamente para que el código sea 100% claro
const form = reactive({
    tgi: 0,
    agua: 0,
    api: 0,
    luz: 0,
    seguro: 0,
    limpieza: 0,
    ascensor: 0,
    internet: 0,
    honorario: 0,
    extraordinaria: 0,
    otro: 0,
    otro_observaciones: ''
});

onMounted(() => {
    // Al abrir el modal, volcamos los datos de la Base de Datos a nuestro 'form'
    conceptos.forEach(c => {
        form[c] = props.registro[c] !== null ? props.registro[c] : 0;
    });
    
    // Asignamos manualmente los valores especiales
    form.extraordinaria = props.registro.extraordinaria !== null ? props.registro.extraordinaria : 0;
    form.otro = props.registro.otro !== null ? props.registro.otro : 0;
    form.otro_observaciones = props.registro.otro_observaciones || '';
});

const formatPeriodo = (fecha) => {
    if (!fecha) return '-';
    return fecha.substring(0, 7); 
};

const guardarModificacion = async () => {
    // Agrupamos todos los campos numéricos para poder validarlos
    const todosLosNumericos = [...conceptos, 'extraordinaria', 'otro'];

    // 1. Validación: Verificamos que ningún importe numérico quede "en blanco"
    for (const c of todosLosNumericos) {
        if (form[c] === '' || form[c] === null) {
            alertas.error('Error de validación', `El concepto ${c.toUpperCase()} no puede quedar vacío. Ingrese 0 si no corresponde.`);
            return; // Frena acá y no va al backend
        }
    }

    loading.value = true;
    try {
        // Al estar explícito, ahora mandamos el { ...form } enterito
        await modificarRegistroMensualService(props.registro.id, { ...form });
        
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