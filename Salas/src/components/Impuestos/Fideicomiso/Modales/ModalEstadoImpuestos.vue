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

            <div v-if="loading" class="d-flex justify-content-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>

            <div v-else class="table-responsive border rounded">
                <table class="table table-sm table-striped table-hover mb-0 text-center" style="font-size: 0.8rem;">
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
                            <th>Honorarios</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in registros" :key="item.id">
                            <td class="fw-bold">{{ formatPeriodo(item.periodo) }}</td>
                            <td>$ {{ item.tgi }}</td>
                            <td>$ {{ item.agua }}</td>
                            <td>$ {{ item.api }}</td>
                            <td>$ {{ item.luz }}</td>
                            <td>$ {{ item.seguro }}</td>
                            <td>$ {{ item.limpieza }}</td>
                            <td>$ {{ item.ascensor }}</td>
                            <td>$ {{ item.honorario }}</td>
                            <td class="fw-bold text-dark">$ {{ calcularTotalFila(item) }}</td>
                            <td>
                                <div class="d-flex justify-content-center align-items-center gap-1">
                                    <!-- 1. Botón Editar (Lápiz) -->
                                    <button type="button" class="btn btn-sm shadow-sm"
                                        :class="item.pagado === 'S' ? 'btn-light text-muted' : 'btn-light text-primary'"
                                        :disabled="item.pagado === 'S'" @click="abrirModalModificar(item)"
                                        title="Modificar">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-primary shadow-sm"
                                        @click="generarComprobante(item)" title="Generar PDF">
                                        <i class="bi bi-file-earmark-pdf"></i>
                                    </button>
                                    <button type="button" class="btn btn-sm shadow-sm"
                                        :class="item.pagado === 'S' ? 'btn-success' : 'btn-outline-success'"
                                        :disabled="item.pagado === 'S'" @click="marcarComoPagado(item)">
                                        <i class="bi"
                                            :class="item.pagado === 'S' ? 'bi-check2-all' : 'bi-currency-dollar'"></i>
                                        {{ item.pagado === 'S' ? 'Pagado' : 'Pagar' }}
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="registros.length === 0">
                            <!-- Corregido el colspan a 11 -->
                            <td colspan="11" class="text-muted py-3">
                                No hay registros mensuales para esta unidad.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary btn-sm" @click="$emit('cerrarModalEstado')">
                Cerrar
            </button>
        </template>
    </BaseModal>
    <!-- FIN MODAL PRINCIPAL -->

    <!-- 2. COMPONENTES AUXILIARES (POR FUERA DEL BASEMODAL) -->
    <PdfComprobantes ref="pdfRef" :formData="pdfData" style="display:none" />

    <ModalModificarRegistro v-if="mostrarModalModificar" :modalModificar="mostrarModalModificar"
        :registro="registroAEditar" @cerrarModalModificar="mostrarModalModificar = false"
        @registroActualizado="obtenerRegistrosDeUnidad" />

</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas.js';
// Importamos el servicio que armamos en el archivo anterior
import { getRegistrosPorUnidadService, modificarRegistroMensualService, GenerarPdfComprobantesService } from '@/Services/api/Impuestos/FideicomisoApi.js';
import PdfComprobantes from '../pdfComprobantes.vue';
import ModalModificarRegistro from './ModalModificarRegistro.vue';


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
    // 1. Armamos el objeto de datos
    const payload = {
        unidad: props.datosUnidad,
        registro: registro
    };

    console.log('ModalEstadoImpuestos - generando PDF con:', JSON.parse(JSON.stringify(payload)));

    // 2. Hacemos la llamada directa a la API (Eliminamos toda la lógica del nextTick y del componente hijo)
    try {
        const resp = await GenerarPdfComprobantesService(payload);
        
        // Armamos el PDF y lo abrimos en una nueva pestaña
        const blob = new Blob([resp.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Limpiamos la URL después de un minuto
        setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
        
    } catch (err) {
        console.error('Error generando PDF desde el padre:', err);
        // Opcional: Acá podés meter un alertas.error('Error al generar el PDF')
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
    const conceptos = ['tgi', 'agua', 'api', 'luz', 'seguro', 'limpieza', 'ascensor', 'honorario'];
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