<template>
    <div class="px-3 container-fluid mt-3">
        <h3 class="text-secondary text-uppercase  small text-muted"><i class="bi bi-receipt me-2"></i>Carga de Broches
            de Expensas</h3>

        <div class="row align-items-center mb-3 g-2">
            <div class="col-md-9">
                <form @submit.prevent="obtenerBroches" class="row gy-1 gx-2 align-items-center form-group"
                    autocomplete="off">

                    <div class="col-md-2 mb-3">
                        <label class="form-label x-small text-muted mb-0 ">Mes</label>
                        <input type="number" v-model="filtros.mes" class="form-control form-control-sm shadow-sm "
                            placeholder="Mes" min="1" max="12">
                    </div>

                    <div class="col-md-2 mb-3">
                        <label class="form-label x-small text-muted mb-0">Año</label>
                        <input type="number" v-model="filtros.anio" class="form-control form-control-sm shadow-sm"
                            placeholder="Año">
                    </div>

                    <div class="col-md-3 mb-3">
                        <label class="form-label x-small text-muted mb-0">Folio / Tipo</label>
                        <input type="text" v-model="filtros.busqueda" class="form-control form-control-sm shadow-sm"
                            placeholder="Buscar...">
                    </div>

                    <div class="col-md-5 d-flex gap-2
           align-items-end  ">
                        <button type="submit" class="btn btn-sm btn-primary  shadow-sm" :disabled="cargando">
                            <span v-if="cargando" class="spinner-border spinner-border-sm me-1"></span>
                            <i v-else class="bi bi-search me-1"></i> Filtrar
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary shadow-sm"
                            @click="abrirModalCarga">
                            <i class="bi bi-plus-circle me-1"></i> Abrir carga
                        </button>
                    </div>
                </form>
            </div>

            <div class="col-md-3 text-md-end mt-3 mt-md-0">
                <button type="button" class="btn btn-sm btn-success shadow-sm w-100" @click="abrirModalExportar">
                    <i class="bi bi-file-earmark-pdf me-1"></i> Generar Broches
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive table-scroll-container px-1">
                    <table class="table table-hover table-striped mb-0 align-middle tabla-impuestos"
                        style="font-size: 0.85rem;">
                        <thead class="table-light">
                            <tr style="position: sticky; top: 0; z-index: 1;">
                                <th>Folio</th>
                                <th>Adm</th>
                                <th>Administrador</th>
                                <th>Edificio</th>
                                <th>Tipo</th>
                                <th>Unidad</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th>Vto.</th>
                                <th>Extraord.</th>
                                <th>Ordinaria</th>
                                <th>Total</th>
                                <th>Período</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="cargando">
                                <td colspan="14" class="text-center py-5 text-muted">
                                    <div class="spinner-border text-primary mb-2" role="status"></div>
                                    <br>Cargando broches...
                                </td>
                            </tr>

                            <tr v-else-if="broches.length === 0">
                                <td colspan="14" class="text-center py-4 text-muted">No se encontraron broches cargados
                                    para este período.</td>
                            </tr>

                            <tr v-else v-for="broche in broches" :key="broche.id_broche">
                                <td class="fw-bold">{{ broche.folio || '-' }}</td>
                                <td>{{ broche.administra || '-' }}</td>
                                <td>{{ broche.nombre || '-' }}</td>
                                <td>{{ broche.nombre_consorcio || '-' }}</td>
                                <td>{{ broche.tipo || '-' }}</td>
                                <td>{{ broche.unidad || '-' }}</td>
                                <td class="text-start">{{ broche.direccion }} {{ broche.altura }}</td>
                                <td>
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <span class="badge bg-secondary">{{ broche.estado || '-' }}</span>

                                        <button v-if="broche.observaciones && broche.observaciones.trim() !== ''"
                                            type="button" class="btn btn-sm btn-link p-0 text-info shadow-none"
                                            @click="abrirModalObservaciones(broche.observaciones)"
                                            title="Ver observaciones">
                                            <i class="bi bi-chat-text-fill fs-5"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>{{ broche.vencimientobroche || '-' }}</td>
                                <td>{{ formatearMoneda(broche.extraordinaria) }}</td>
                                <td>{{ formatearMoneda(broche.ordinaria) }}</td>
                                <td class="fw-bold text-primary">{{ formatearMoneda(broche.total) }}</td>
                                <td>{{ broche.periodo || '-' }}</td>
                                <td>
                                    <div class="d-flex justify-content-center gap-1">
                                        <button type="button" class="btn btn-sm btn-outline-primary py-0 shadow-none"
                                            @click="abrirModalEditar(broche)" title="Editar importes">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button type="button" class="btn btn-sm btn-outline-danger py-0 shadow-none"
                                            @click="eliminarBroche(broche.id_broche)" title="Eliminar broche">
                                            <i class="bi bi-trash3"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>


    <ModalCargarBroche v-if="mostrarModalCarga" :show="mostrarModalCarga" :edificios="listaEdificios"
        :empresas="listaEmpresas" @close="mostrarModalCarga = false" @recargar="obtenerBroches" />

    <ModalExportarBroche v-if="mostrarModalExportar" :show="mostrarModalExportar" :empresas="listaEmpresas"
        @close="mostrarModalExportar = false" />

    <ModalEditarBroche v-if="mostrarModalEditar" :show="mostrarModalEditar" :broche="brocheSeleccionado"
        @close="mostrarModalEditar = false" @recargar="obtenerBroches" />

    <ModalObservacionesBroche 
        v-if="mostrarModalObservaciones" 
        :show="mostrarModalObservaciones" 
        :observaciones="textoObservacion"
        @close="mostrarModalObservaciones = false" 
    />

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { alertas } from '@/utils/alertas';
import { formatearMoneda as formatearMonedaHelper } from '@/utils/formatters';
import { getBrochesService, eliminarBrocheService } from '@/Services/api/Impuestos/expensasApi.js';
import ModalCargarBroche from './Modales/ModalCargarBroche.vue';
import ModalExportarBroche from './Modales/ModalExportarBroche.vue';
import ModalEditarBroche from './Modales/ModalEditarBroche.vue';
import ModalObservacionesBroche from './Modales/ModalObservacionesBroche.vue';

// --- ESTADOS ---
const cargando = ref(false);
const mostrarModalCarga = ref(false);
const mostrarModalExportar = ref(false);
const mostrarModalEditar = ref(false);
const brocheSeleccionado = ref(null);
const mostrarModalObservaciones = ref(false);
const textoObservacion = ref('');

const broches = ref([]);
const listaEdificios = ref([]);
const listaEmpresas = ref([]);

// Filtros para la búsqueda principal (Inicializamos vacíos, el backend pone los por defecto)
const filtros = ref({
    mes: '',
    anio: '',
    busqueda: ''
});

// --- MÉTODOS ---

// 1. Cargar la tabla 
const obtenerBroches = async () => {
    cargando.value = true;
    try {
        const response = await getBrochesService({
            mes: filtros.value.mes,
            anio: filtros.value.anio,
            busqueda: filtros.value.busqueda
        });

        const data = response.data.data;
        broches.value = data.broches;
        listaEdificios.value = data.edificios; // Los guardamos para pasárselos al Modal luego
        listaEmpresas.value = data.empresas;   // Los guardamos para pasárselos al Modal luego

        // Si el backend nos mandó el mes/año actual, actualizamos nuestros inputs
        if (data.periodo_actual && !filtros.value.mes && !filtros.value.anio) {
            filtros.value.mes = data.periodo_actual.mes;
            filtros.value.anio = data.periodo_actual.anio;
        }

    } catch (error) {
        alertas.error('Error al obtener los broches: ' + (error.response?.data?.message || error.message));
    } finally {
        cargando.value = false;
    }
};

// 2. Eliminar Broche
const eliminarBroche = async (idBroche) => {
    const confirmacion = await alertas.confirmar(
        '¿Eliminar este broche?',
        'Esta acción no se puede deshacer.'
    );

    if (confirmacion.isConfirmed) {
        try {
            const response = await eliminarBrocheService(idBroche);
            alertas.success(response.data.message || 'Broche eliminado correctamente.');
            obtenerBroches(); // Recargamos la tabla
        } catch (error) {
            alertas.error('Error al eliminar: ' + (error.response?.data?.message || 'Ocurrió un error.'));
        }
    }
};

// 3. Helpers
const formatearMoneda = (valor) => formatearMonedaHelper(valor, true);

// 4. Modales
const abrirModalCarga = () => mostrarModalCarga.value = true;
const abrirModalExportar = () => mostrarModalExportar.value = true;
const abrirModalEditar = (broche) => {
    console.log("DATOS DEL BROCHE A EDITAR:", JSON.parse(JSON.stringify(broche)));
    brocheSeleccionado.value = broche;
    mostrarModalEditar.value = true;
};
const abrirModalObservaciones = (observacion) => {
    textoObservacion.value = observacion;
    mostrarModalObservaciones.value = true;
};

// --- CICLO DE VIDA ---
onMounted(() => {
    obtenerBroches();
});
</script>

<style scoped>
.x-small {
    font-size: 0.70rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.table-scroll-container {
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.table-scroll-container::-webkit-scrollbar {
    width: 6px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}
</style>