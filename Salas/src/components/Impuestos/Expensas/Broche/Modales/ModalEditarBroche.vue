<template>
    <BaseModal :show="show" size="md" @close="cerrarModal" :backdrop="'static'">
        <template #title>
            <i class="bi bi-pencil-square text-primary me-2"></i> Editar Broche: {{ broche?.folio || '' }}
        </template>

        <template #body>
            <div class="row g-3">
                <div class="col-12 text-muted small mb-2 pb-2 border-bottom">
                    <strong>Edificio:</strong> {{ broche?.nombre }} <br>
                    <strong>Dirección:</strong> {{ broche?.direccion }} {{ broche?.altura }} <br>
                    <strong>Unidad:</strong> {{ broche?.unidad }}
                </div>

                <div class="col-md-6">
                    <label class="form-label small text-muted fw-bold mb-1">Vencimiento</label>
                    <input type="date" class="form-control form-control-sm shadow-sm" v-model="form.vencimiento">
                </div>

                <div class="col-md-3">
                    <label class="form-label small text-muted fw-bold mb-1">Período</label>
                    <input type="text" class="form-control form-control-sm shadow-sm text-center" v-model="form.periodo"
                        placeholder="Mes">
                </div>

                <div class="col-md-3">
                    <label class="form-label small text-muted fw-bold mb-1">Año</label>
                    <input type="text" class="form-control form-control-sm shadow-sm text-center" v-model="form.anio"
                        placeholder="Año">
                </div>

                <div class="col-md-6">
                    <label class="form-label small text-muted fw-bold mb-1">Extraordinaria</label>
                    <input type="number" step="0.01" class="form-control form-control-sm shadow-sm text-end"
                           v-model="form.extraordinaria" @input="calcularTotal">
                </div>

                <div class="col-md-6">
                    <label class="form-label small text-muted fw-bold mb-1">Ordinaria</label>
                    <input type="number" step="0.01" class="form-control form-control-sm shadow-sm text-end"
                        v-model="  form.ordinaria" @input="calcularTotal">
                </div>

                <div class="col-md-12 mt-3">
                    <div class="p-2 bg-light border rounded d-flex justify-content-between align-items-center">
                        <span class="text-muted fw-bold">TOTAL:</span>
                        <span class="fs-5 fw-bold text-primary">{{ formatearMoneda(form.total) }}</span>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary btn-sm px-4 shadow-sm" @click="cerrarModal"
                :disabled="guardando">Cancelar</button>
            <button type="button" class="btn btn-primary btn-sm px-4 shadow-sm" @click="guardarCambios"
                :disabled="guardando">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-save me-1"></i> Guardar
            </button>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps, watch } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas';
import { editarBrocheService } from '@/Services/api/Impuestos/expensasApi.js';

const props = defineProps({
    show: { type: Boolean, required: true },
    broche: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close', 'recargar']);

onMounted(() => {
    console.log("LO QUE LLEGA AL MODAL ADENTRO:", JSON.parse(JSON.stringify(props.broche)));
})

const guardando = ref(false);

// Extraemos la fecha de forma segura (cortando la hora si existe para que el input type="date" funcione)
const extraerFechaSegura = (fecha) => {
    if (!fecha) return '';
    // Si viene "2026-07-15 00:00:00", se queda solo con "2026-07-15"
    return fecha.toString().substring(0, 10); 
};

// INICIALIZACIÓN DIRECTA: Como el modal usa v-if, se crea de cero cada vez que se abre.
// Le asignamos los valores de los props directamente al nacer.
const form = ref({
    id_broche: props.broche?.id_broche || null,
    vencimiento: extraerFechaSegura(props.broche?.vencimientobroche || props.broche?.vencimiento),
    periodo: props.broche?.periodo || '',
    anio: props.broche?.anio || '',
    extraordinaria: Number(props.broche?.extraordinaria) || 0,
    ordinaria: Number(props.broche?.ordinaria) || 0,
    total: Number(props.broche?.total) || 0
});

const calcularTotal = () => {
    const extra = parseFloat(form.value.extraordinaria) || 0;
    const ord = parseFloat(form.value.ordinaria) || 0;
    form.value.total = (extra + ord).toFixed(2);
};

// Nueva función de formateo
const formatearMoneda = (valor) => {
    if (!valor) return '$ 0,00';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(valor);
};

const guardarCambios = async () => {
    if (!form.value.vencimiento || !form.value.periodo || !form.value.anio) {
        alertas.error('Por favor, complete las fechas y el período.');
        return;
    }

    guardando.value = true;
    try {
        const payload = {
            vencimiento: form.value.vencimiento,
            periodo: form.value.periodo,
            anio: form.value.anio,
            importe_extraordinaria: Number(form.value.extraordinaria),
            importe_ordinaria: Number(form.value.ordinaria),
            total: Number(form.value.total)
        };

        const response = await editarBrocheService(form.value.id_broche, payload);
        alertas.success(response.data.message || 'Broche actualizado correctamente.');
        
        emit('recargar'); // Recargamos la tabla principal en segundo plano
        cerrarModal();

    } catch (error) {
        alertas.error('Error al actualizar: ' + (error.response?.data?.message || 'Ocurrió un error.'));
    } finally {
        guardando.value = false;
    }
};



const cerrarModal = () => {
    emit('close');
};
</script>