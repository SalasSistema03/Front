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
                    <SelectPredictivo v-model="filtros.edificio" :items="edificios"
                        label-key="nombre_consorcio" placeholder="Todos los edificios..."
                        class="textoPredictivoEdificioBrochExpensas" />
                </div>

                <div class="col-md-3">
                    <label class="form-label x-small text-muted fw-bold mb-1">Administrador</label>
                    <SelectPredictivo v-model="filtros.administrador" :items="empresas"
                        label-key="nombre" placeholder="Todos los administradores..."  class="textoPredictivoBrochExpensas"/>
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

            <div class="table-responsive tabla-broches-carga-scroll">
                <table class="table table-sm table-hover table-striped mb-0 align-middle tabla-broches-carga">
                    <thead class="table-light text-secondary">
                        <tr style="position: sticky; top: 0; z-index: 1;">
                            <th class="text-center">Folio</th>
                            <th class="text-start">Dirección / Edificio</th>
                            <th class="text-start">Administrador</th>
                            <th class="text-start">Consorcio</th>
                            <th class="text-center text-nowrap">Vencimiento</th>
                            <th class="text-center">Período</th>
                            <th class="text-center">Año</th>
                            <th class="text-center text-nowrap">Extraordinaria</th>
                            <th class="text-center text-nowrap">Ordinaria</th>
                            <th class="text-center text-nowrap">Total</th>
                            <th class="text-center text-nowrap">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="buscando">
                            <td colspan="11" class="py-4 text-center text-muted">Buscando unidades...</td>
                        </tr>
                        <tr v-else-if="unidadesEncontradas.length === 0">
                            <td colspan="11" class="py-4 text-center text-muted">Use los filtros de arriba para buscar unidades.</td>
                        </tr>

                        <tr v-else v-for="(unidad, index) in unidadesEncontradas" :key="unidad.id_unidad">
                            <td class="fw-bold text-center">{{ unidad.folio }}</td>
                            
                            <td class="text-start lh-sm expensa_dato-secundario expensa_col-direccion">
                                <span class="d-block text-primary fw-semibold text-truncate" :title="unidad.direccion_edificio + ' ' + unidad.altura_edificio">
                                    {{ unidad.direccion_edificio }} {{ unidad.altura_edificio }}
                                </span>
                                <span class="x-small text-muted">U: {{ unidad.unidad }} P: {{ unidad.piso }} D: {{ unidad.depto }}</span>
                            </td>

                            <td class="text-start text-truncate expensa_dato-secundario expensa_col-admin" :title="unidad.nombre">
                                {{ unidad.nombre || '-' }}
                            </td>
                            <td class="text-start text-truncate expensa_dato-secundario expensa_col-consorcio" :title="unidad.nombre_consorcio">
                                {{ unidad.nombre_consorcio || '-' }}
                            </td>

                            <td class="expensa_col-fecha">
                                <input type="date" class="form-control form-control-sm shadow-none px-1 text-center text-secondary"
                                    v-model="unidad.input_vencimiento">
                            </td>
                            <td class="expensa_col-periodo">
                                <input type="text" class="form-control form-control-sm shadow-none px-1 text-center"
                                    v-model="unidad.input_periodo" placeholder="Mes">
                            </td>
                            <td class="expensa_col-anio">
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
                                    class="btn btn-sm d-inline-flex align-items-center justify-content-center shadow-sm"
                                    :class="unidad._guardadoConExito ? 'btn-success text-white' : 'btn-outline-primary'"
                                    style="width: 30px; height: 30px; padding: 0; border-radius: 4px;"
                                    @click="guardarFila(unidad)"
                                    :disabled="guardandoId === unidad.id_unidad || unidad._guardadoConExito"
                                    :title="unidad._guardadoConExito ? 'Broche cargado' : 'Guardar broche'"
                                    :aria-label="unidad._guardadoConExito ? 'Broche cargado' : 'Guardar broche'">
                                    <span v-if="guardandoId === unidad.id_unidad"
                                        class="spinner-border spinner-border-sm text-primary"></span>
                                    <i v-else :class="unidad._guardadoConExito ? 'bi bi-check2-circle text-white' : 'bi bi-save2'"
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
import SelectPredictivo from '@/components/base/SelectPredictivo.vue';
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
