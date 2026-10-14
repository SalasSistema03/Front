<template>
    <!-- 1. MODAL PRINCIPAL -->
    <BaseModal :show="modalEstado" size="xl" @close="$emit('cerrarModalEstado')">
        <template #title>
            Estado de Unidad: Piso {{ datosUnidad?.piso }} - Dto {{ datosUnidad?.unidad }}
        </template>

        <template #body>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-bold text-muted">
                    Propietario: <span class="text-primary">{{ datosUnidad?.propietario }}</span>
                </span>
                <span class="badge bg-secondary">Porcentual: {{ datosUnidad?.porcentual }}%</span>
            </div>

            <!-- SPINNER DE CARGA -->
            <div v-if="loading" class="d-flex justify-content-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>

            <!-- TABLA DE REGISTROS -->
            <div v-else class="table-responsive border rounded">
                <table class="table table-sm table-hover mb-0 text-center" style="font-size: 0.8rem;">
                    <thead class="table-light">
                        <tr>
                            <th>Período</th>
                            <th>TGI</th>
                            <th>Agua</th>
                            <th>API</th>
                            <th>Luz</th>
                            <th>Seguro</th>
                            <th>Limpieza</th>
                            <th>Ascensor</th>
                            <th>Internet</th>
                            <th>Honorarios</th>
                            <th>Extraordinaria</th>
                            <th>Fondo Reserva</th>
                            <th>Otro</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in registros" :key="item.id"
                            :class="{ 'table-success': item.pagado === 'S' }">
                            <td class="fw-bold">{{ formatPeriodo(item.periodo) }}</td>
                            <td>{{ formatearMoneda(item.tgi) }}</td>
                            <td>{{ formatearMoneda(item.agua) }}</td>
                            <td>{{ formatearMoneda(item.api) }}</td>
                            <td>{{ formatearMoneda(item.luz) }}</td>
                            <td>{{ formatearMoneda(item.seguro) }}</td>
                            <td>{{ formatearMoneda(item.limpieza) }}</td>
                            <td>{{ formatearMoneda(item.ascensor) }}</td>
                            <td>{{ formatearMoneda(item.internet) }}</td>
                            <td>{{ formatearMoneda(item.honorario) }}</td>
                            <td>{{ formatearMoneda(item.extraordinaria) }}</td>
                            <td>{{ formatearMoneda(item.fondo_reserva) }}</td>
                            <td>{{ formatearMoneda(item.otro) }}</td>
                            <td class="fw-bold text-dark">{{ formatearMoneda(calcularTotalFila(item)) }}</td>
                            <td>
                                <div class="dropdown position-static">
                                    <button type="button" class="btn btn-sm btn-light border-0 shadow-none"
                                        data-bs-toggle="dropdown" data-bs-boundary="window"
                                        aria-expanded="false" title="Opciones">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>

                                    <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                                        <!-- Modificar -->
                                        <li>
                                            <button type="button"
                                                class="dropdown-item d-flex align-items-center gap-2"
                                                :class="{ 'disabled text-muted': item.pagado === 'S' }"
                                                :disabled="item.pagado === 'S'"
                                                @click="abrirModalModificar(item)">
                                                <i class="bi bi-pencil text-primary"></i> Modificar
                                            </button>
                                        </li>

                                        <!-- Generar PDF -->
                                        <li>
                                            <button type="button"
                                                class="dropdown-item d-flex align-items-center gap-2"
                                                :disabled="generandoPdf === item.id"
                                                @click="generarComprobante(item)">
                                                <span v-if="generandoPdf === item.id"
                                                    class="spinner-border spinner-border-sm text-primary"
                                                    role="status"></span>
                                                <i v-else class="bi bi-file-earmark-pdf text-danger"></i>
                                                Generar PDF
                                            </button>
                                        </li>

                                        <!-- Pagar -->
                                        <li v-if="item.pagado !== 'S'">
                                            <hr class="dropdown-divider my-1">
                                            <button type="button"
                                                class="dropdown-item d-flex align-items-center gap-2 text-success"
                                                @click="marcarComoPagado(item)">
                                                <i class="bi bi-currency-dollar"></i> Pagar
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>

                        <!-- Sin registros -->
                        <tr v-if="registros.length === 0">
                            <td colspan="15" class="text-muted py-3">
                                No hay registros mensuales para esta unidad.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </BaseModal>

    <!-- Modal Secundario para modificar -->
    <ModalModificarRegistro 
        v-if="mostrarModalModificar" 
        :modalModificar="mostrarModalModificar"
        :registro="registroAEditar" 
        @cerrarModalModificar="mostrarModalModificar = false"
        @registroActualizado="obtenerRegistrosDeUnidad" 
    />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas.js';
// Importamos el servicio que armamos en el archivo anterior
import { getRegistrosPorUnidadService, modificarRegistroMensualService, GenerarPdfComprobantesService } from '@/Services/api/Impuestos/FideicomisoApi.js';
import PdfComprobantes from '../pdfComprobantes.vue';
import ModalModificarRegistro from './ModalModificarRegistro.vue';
import { formatearMoneda as formatearMonedaHelper } from '@/utils/formatters.js'

const formatearMoneda = (valor) => formatearMonedaHelper(valor, true);

const props = defineProps({
    modalEstado: Boolean,
    datosUnidad: {
        type: Object,
        required: true
    }
});

defineEmits(['cerrarModalEstado']);

// Estados reactivos
const registros = ref([]);
const loading = ref(true);
const pdfData = ref({});
const pdfRef = ref(null);
const mostrarModalModificar = ref(false);
const registroAEditar = ref(null);
const generandoPdf = ref(null);

// Función para abrir el modal
const abrirModalModificar = (item) => {
    // Clonamos la fila seleccionada por seguridad
    registroAEditar.value = { ...item };
    mostrarModalModificar.value = true;
};

// Llamada a la API
const obtenerRegistrosDeUnidad = async () => {
    loading.value = true;
    try {
        // Le pasamos el ID que viene como prop desde la tabla principal
        const response = await getRegistrosPorUnidadService(props.datosUnidad.id);
        registros.value = response.data.data;
    } catch (err) {
        console.error("Error al obtener los registros de la unidad:", err);
        alertas.error(err.response?.data?.message || 'Error al obtener los datos de la unidad');
    } finally {
        loading.value = false;
    }
};

// Pequeña utilidad para formatear "2026-08-01" a "2026-08" si querés que quede más limpio
const formatPeriodo = (fecha) => {
    if (!fecha) return '-';
    return fecha.substring(0, 7);
};

onMounted(() => {
    if (props.datosUnidad?.id) {
        obtenerRegistrosDeUnidad();
    }
});

const generarComprobante = async (registro) => {
    // 1. Preguntamos al usuario
    const res = await alertas.preguntarTipoPdf(
        'Tipo de Comprobante',
        '¿Desea generar el comprobante detallado con todos los conceptos o solo con el total?'
    );

    // Si hace click en Cancelar o cierra el cartel, no generamos nada
    if (res.isDismissed) return;

    // true si presionó 'Detallado', false si presionó 'Simple (Solo Total)'
    const esDetallado = res.isConfirmed;

    generandoPdf.value = registro.id;

    // 2. Enviamos el flag 'detallado' al backend
    const payload = {
        unidad: props.datosUnidad,
        registro: registro,
        detallado: esDetallado
    };

    try {
        const resp = await GenerarPdfComprobantesService(payload);

        const blob = new Blob([resp.data], {
            type: 'application/pdf'
        });

        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener,noreferrer');

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 60_000);

    } catch (err) {
        console.error('Error generando PDF desde el padre:', err);
        alertas.error(
            err.response?.data?.message || 'Hubo un error al generar el PDF.'
        );
    } finally {
        generandoPdf.value = null;
    }
};


// Función para marcar como pagado
const marcarComoPagado = async (item) => {
    // 1. Mostrar cartel de confirmación
    const confirmacion = await alertas.confirmar(
        '¿Registrar pago?',
        `Se marcará como pagado el período ${formatPeriodo(item.periodo)}.`,
        'Sí, pagar' // Acá usamos el 3er parámetro que agregamos en alertas.js
    );

    // Si el usuario cancela, frenamos acá
    if (!confirmacion.isConfirmed) return;

    try {
        // 2. Enviamos el PUT al backend solo con el campo que queremos actualizar
        await modificarRegistroMensualService(item.id, { pagado: 'S' });

        // 3. Mostramos éxito
        alertas.success('Pago registrado', 'El registro se actualizó correctamente.');

        // 4. Recargamos la tabla para que el botón cambie a verde ("Pagado")
        obtenerRegistrosDeUnidad();

    } catch (err) {
        console.error("Error al registrar el pago:", err);
        alertas.error(err.response?.data?.message || 'Hubo un error al intentar registrar el pago.');
    }
};


// Función para sumar todos los importes de una fila
const calcularTotalFila = (item) => {
    const conceptos = ['tgi', 'agua', 'api', 'luz', 'seguro', 'limpieza', 'ascensor', 'honorario', 'extraordinaria', 'fondo_reserva', 'otro'];
    let total = 0;

    conceptos.forEach(concepto => {
        // Verificamos que el valor exista y lo convertimos a número (float)
        if (item[concepto]) {
            total += parseFloat(item[concepto]);
        }
    });

    // Retornamos el total formateado con 2 decimales (opcional, podés sacar el toFixed si no usás centavos)
    return total.toFixed(2);
};



</script>
