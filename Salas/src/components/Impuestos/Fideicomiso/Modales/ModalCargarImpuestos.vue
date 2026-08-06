<template>
    <BaseModal :show="modalCarga" size="lg" @close="$emit('cerrarModalCarga')">
        <template #title>Carga Masiva de Impuestos y Servicios</template>

        <template #body>
            <form class="form-group" @submit.prevent="guardarMasivo">
                <div class="row g-3">
                    
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-bold small text-muted mb-1">Período</label>
                        <input v-model="form.periodo" type="month" class="form-control form-control-sm shadow-sm" required>
                    </div>

                    <div class="col-12 col-md-4">
                        <label class="form-label fw-bold small text-muted mb-1">Servicio / Impuesto</label>
                        <select v-model="form.servicio" class="form-select form-select-sm shadow-sm" required>
                            <option value="" disabled>Seleccione uno...</option>
                            <option value="tgi">TGI</option>
                            <option value="agua">Agua</option>
                            <option value="api">API</option>
                            <option value="luz">Luz</option>
                            <option value="seguro">Seguro</option>
                            <option value="limpieza">Limpieza</option>
                            <option value="ascensor">Ascensor</option>
                            <option value="honorario">Honorarios</option>
                        </select>
                    </div>

                    <div class="col-12 col-md-4">
                        <label class="form-label fw-bold small text-muted mb-1">Monto Total Edificio ($)</label>
                        <input v-model="form.monto_total" type="number" step="0.01" min="0" class="form-control form-control-sm shadow-sm" placeholder="Ej: 150000" required>
                    </div>
                </div>

                <!-- Vista Previa Matemática (solo UX) -->
                <div v-if="mostrarVistaPrevia" class="mt-4">
                    <div class="d-flex justify-content-between align-items-end border-bottom pb-1 mb-2">
                        <h6 class="text-primary mb-0" style="font-size: 0.85rem;">
                            Vista Previa de Distribución ({{ form.periodo }})
                        </h6>
                    </div>
                    
                    <div class="table-responsive border rounded" style="max-height: 35vh; overflow-y: auto;">
                        <table class="table table-sm table-striped table-hover text-center mb-0" style="font-size: 0.75rem;">
                            <thead class="table-light" style="position: sticky; top: 0; z-index: 1;">
                                <tr>
                                    <th>Unidad</th>
                                    <th>Propietario</th>
                                    <th>Porcentual</th>
                                    <th>Monto a Pagar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="unidad in unidades" :key="unidad.id">
                                    <td>{{ unidad.piso }} - {{ unidad.unidad }}</td>
                                    <td>
                                        <span v-if="unidad.propietario">{{ unidad.propietario }}</span>
                                        <span v-else class="text-danger fst-italic">Sin vender</span>
                                    </td>
                                    <td>{{ unidad.porcentual }}%</td>
                                    <td class="fw-bold text-success">
                                        $ {{ calcularProporcional(unidad.porcentual).toFixed(2) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary btn-sm" @click="$emit('cerrarModalCarga')" :disabled="loading">
                Cancelar
            </button>
            <button type="button" class="btn btn-primary btn-sm" @click="guardarMasivo" :disabled="loading || !mostrarVistaPrevia">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="fa-solid fa-paper-plane me-1"></i>
                {{ loading ? 'Procesando...' : 'Guardar Masivo' }}
            </button>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas.js';
import { getUnidadesService, cargaMasivaImpuestosService } from '@/Services/api/Impuestos/FideicomisoApi.js';

defineProps({ modalCarga: Boolean });
const emit = defineEmits(['cerrarModalCarga', 'registrosActualizados']);

const loading = ref(false);
const unidades = ref([]);

const form = reactive({
    periodo: '',
    servicio: '',
    monto_total: null
});

const mostrarVistaPrevia = computed(() => {
    return form.periodo !== '' && form.servicio !== '' && form.monto_total > 0;
});

const calcularProporcional = (porcentual) => {
    if (!form.monto_total) return 0;
    return form.monto_total * (porcentual / 100);
};

// Necesitamos las unidades solo para armar la vista previa visual en el modal
const cargarUnidades = async () => {
    try {
        const response = await getUnidadesService();
        unidades.value = response.data.data;
    } catch (error) {
        alertas.error('Error al obtener unidades para la vista previa.');
    }
};

const guardarMasivo = async () => {
    if (!mostrarVistaPrevia.value) return;
    loading.value = true;

    try {
        // Formateamos para que la fecha vaya como YYYY-MM-01
        const payload = {
            periodo: form.periodo + '-01',
            servicio: form.servicio,
            monto_total: form.monto_total
        };

        // Hacemos UNA sola petición al backend
        const response = await cargaMasivaImpuestosService(payload);

        alertas.success('Éxito', response.data.message);
        emit('registrosActualizados');
        emit('cerrarModalCarga');

    } catch (error) {
        console.error("Error en carga masiva:", error);
        alertas.error(error.response?.data?.message || 'Error al procesar la distribución masiva.');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    cargarUnidades();
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    form.periodo = `${hoy.getFullYear()}-${mes}`;
});
</script>