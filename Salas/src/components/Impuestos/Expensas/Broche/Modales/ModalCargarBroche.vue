<template>
    <BaseModal :show="show" size="xl" @close="cerrarModal" :backdrop="'static'">
        <template #title>
            <i class="bi bi-file-earmark-spreadsheet text-primary me-2"></i> Carga de Broches de Expensas
        </template>

     <template #body>
            <div class="row g-2 mb-3 bg-light p-3 rounded shadow-sm border border-light align-items-end">
                <div class="col-md-2">
                    <label class="form-label x-small text-muted fw-bold mb-1">Folio</label>
                    <input type="text" class="form-control form-control-sm shadow-sm border-secondary-subtle"
                        v-model="filtros.folio" placeholder="Ej: 153">
                </div>

                <div class="col-md-2">
                    <label class="form-label x-small text-muted fw-bold mb-1">Empresa</label>
                    <select class="form-select form-select-sm shadow-sm border-secondary-subtle"
                        v-model="filtros.empresa">
                        <option value="">Todas</option>
                        <option value="1">Atilio Salas SRL</option>
                        <option value="2">Dolly J. Pianesi</option>
                        <option value="3">Giusiano Maria Florencia</option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label x-small text-muted fw-bold mb-1">Edificio</label>
                    <select class="form-select form-select-sm shadow-sm border-secondary-subtle"
                        v-model="filtros.edificio">
                        <option value="">Todos los edificios...</option>
                        <option v-for="edif in edificios" :key="edif.id" :value="edif.id">
                            {{ edif.nombre_consorcio }}
                        </option>
                    </select>
                </div>

                <div class="col-md-3">
                    <label class="form-label x-small text-muted fw-bold mb-1">Administrador</label>
                    <select class="form-select form-select-sm shadow-sm border-secondary-subtle"
                        v-model="filtros.administrador">
                        <option value="">Todos los administradores...</option>
                        <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
                            {{ emp.nombre }}
                        </option>
                    </select>
                </div>

                <div class="col-md-2">
                    <button type="button" class="btn btn-primary btn-sm w-100 shadow-sm fw-bold" @click="buscarUnidades"
                        :disabled="buscando">
                        <span v-if="buscando" class="spinner-border spinner-border-sm me-1"></span>
                        <i v-else class="bi bi-search me-1"></i> Buscar
                    </button>
                </div>
            </div>

            <hr class="text-muted my-2">

            <div class="table-responsive table-scroll-container">
                <table class="table table-sm table-hover table-striped mb-0 align-middle tabla-impuestos"
                    style="font-size: 0.82rem;">
                    <thead class="table-light text-secondary">
                        <tr style="position: sticky; top: 0; z-index: 1;">
                            <th class="text-center" style="width: 50px;">Folio</th>
                            <th class="text-start" style="min-width: 180px;">Dirección / Edificio</th>
                            <th class="text-center text-nowrap" style="width: 120px;">Vencimiento</th>
                            <th class="text-center" style="width: 70px;">Período</th>
                            <th class="text-center" style="width: 70px;">Año</th>
                            <th class="text-center text-nowrap" style="width: 105px;">Extraordinaria</th>
                            <th class="text-center text-nowrap" style="width: 105px;">Ordinaria</th>
                            <th class="text-center text-nowrap" style="width: 110px;">Total</th>
                            <th class="text-center" style="width: 50px;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="buscando">
                            <td colspan="9" class="py-4 text-center text-muted">Buscando unidades...</td>
                        </tr>
                        <tr v-else-if="unidadesEncontradas.length === 0">
                            <td colspan="9" class="py-4 text-center text-muted">Use los filtros de arriba para buscar unidades.</td>
                        </tr>

                        <tr v-else v-for="(unidad, index) in unidadesEncontradas" :key="unidad.id_unidad">
                            <td class="fw-bold text-center">{{ unidad.folio }}</td>
                            
                            <td class="text-start lh-sm">
                                <span class="d-block text-primary fw-semibold text-truncate" style="max-width: 200px;" :title="unidad.direccion_edificio + ' ' + unidad.altura_edificio">
                                    {{ unidad.direccion_edificio }} {{ unidad.altura_edificio }}
                                </span>
                                <span class="x-small text-muted">U: {{ unidad.unidad }} {{ unidad.piso }} {{ unidad.depto }}</span>
                            </td>

                            <td>
                                <input type="date" class="form-control form-control-sm shadow-none px-1 text-center text-secondary"
                                    v-model="unidad.input_vencimiento">
                            </td>
                            <td>
                                <input type="text" class="form-control form-control-sm shadow-none px-1 text-center"
                                    v-model="unidad.input_periodo" placeholder="Mes">
                            </td>
                            <td>
                                <input type="text" class="form-control form-control-sm shadow-none px-1 text-center"
                                    v-model="unidad.input_anio" placeholder="Año">
                            </td>
                            <td>
                                <input type="number" step="0.01"
                                    class="form-control form-control-sm shadow-none px-1 text-end"
                                    v-model="unidad.input_extraordinaria" @input="calcularTotal(unidad)">
                            </td>
                            <td>
                                <input type="number" step="0.01"
                                    class="form-control form-control-sm shadow-none px-1 text-end"
                                    v-model="unidad.input_ordinaria" @input="calcularTotal(unidad)">
                            </td>
                            <td>
                                <input type="number" step="0.01"
                                    class="form-control form-control-sm shadow-none px-1 text-end fw-bold text-success bg-light"
                                    v-model="unidad.input_total" readonly>
                            </td>

                            <td class="text-center">
                                <button type="button"
                                    class="btn btn-sm btn-success d-inline-flex align-items-center justify-content-center shadow-sm"
                                    style="width: 30px; height: 30px; padding: 0; border-radius: 4px;"
                                    @click="guardarFila(unidad)" :disabled="guardandoId === unidad.id_unidad"
                                    title="Guardar">
                                    <span v-if="guardandoId === unidad.id_unidad"
                                        class="spinner-border spinner-border-sm text-white"></span>
                                    <i v-else class="bi bi-check2-circle text-white"
                                        style="font-size: 1.1rem;"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary btn-sm px-4 shadow-sm" @click="cerrarModal">Cerrar</button>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas';
import { buscarBrochesService, guardarBrocheService } from '@/Services/api/Impuestos/expensasApi.js';

const props = defineProps({
    show: { type: Boolean, required: true },
    edificios: { type: Array, required: true },
    empresas: { type: Array, required: true }
});

const emit = defineEmits(['close', 'recargar']);

const buscando = ref(false);
const guardandoId = ref(null); // Para saber qué fila específica estamos guardando
const unidadesEncontradas = ref([]);

const filtros = ref({
    folio: '',
    empresa: '',
    edificio: '',
    administrador: ''
});

// Limpiamos los resultados cuando se cierra y abre el modal
watch(() => props.show, (isOpen) => {
    if (isOpen) {
        unidadesEncontradas.value = [];
        filtros.value = { folio: '', empresa: '', edificio: '', administrador: '' };
    }
});

// --- MÉTODOS ---

const buscarUnidades = async () => {
    buscando.value = true;
    try {
        const response = await buscarBrochesService(filtros.value);

        // Mapeamos los resultados para agregarles las propiedades reactivas del formulario
        // (Asignamos julio 2026 por defecto para ahorrarle tiempo al usuario)
        unidadesEncontradas.value = response.data.data.map(u => ({
            ...u,
            input_vencimiento: '2026-07-15',
            input_periodo: '07',
            input_anio: '2026',
            input_extraordinaria: 0,
            input_ordinaria: 0,
            input_total: 0
        }));

    } catch (error) {
        alertas.error('Error al realizar la búsqueda.');
    } finally {
        buscando.value = false;
    }
};

const calcularTotal = (unidad) => {
    const extra = parseFloat(unidad.input_extraordinaria) || 0;
    const ord = parseFloat(unidad.input_ordinaria) || 0;
    unidad.input_total = (extra + ord).toFixed(2); // Redondea a 2 decimales
};

const guardarFila = async (unidad) => {
    // 1. Validaciones
    if (!unidad.input_vencimiento || !unidad.input_periodo || !unidad.input_anio) {
        alertas.error('Por favor, complete las fechas y el período.');
        return;
    }
    if (unidad.input_total <= 0) {
        alertas.error('El importe total no puede ser cero.');
        return;
    }

    // 2. Preparamos el payload exacto que diseñamos en Postman
    const payload = {
        vencimiento: unidad.input_vencimiento,
        importe_extraordinaria: Number(unidad.input_extraordinaria),
        importe_ordinaria: Number(unidad.input_ordinaria),
        total: Number(unidad.input_total),
        periodo: unidad.input_periodo,
        anio: unidad.input_anio,
        id_unidad: unidad.id_unidad,
        id_administrador: unidad.id_administrador
    };

    guardandoId.value = unidad.id_unidad; // Activamos el spinner de esa fila

    try {
        const response = await guardarBrocheService(payload);
        alertas.success(response.data.message || 'Broche guardado.');

        // Cambiamos el color de la fila visualmente para indicar éxito
        unidad._guardadoConExito = true;

        // Le avisamos al componente padre que recargue la tabla principal de fondo
        emit('recargar');

    } catch (error) {
        // Si es el error 409 (Duplicado) que configuramos en Laravel, lo mostramos
        if (error.response && error.response.status === 409) {
            alertas.error(error.response.data.message);
        } else {
            alertas.error('Error al intentar guardar el broche.');
        }
    } finally {
        guardandoId.value = null;
    }
};

const cerrarModal = () => {
    emit('close');
};
</script>

<style scoped>
.x-small {
    font-size: 0.70rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.table-scroll-container {
    max-height: 55vh;
    overflow-y: auto;
}

/* Estilo para marcar filas que ya se guardaron */
tr:has(button:disabled) {
    opacity: 0.8;
}
</style>