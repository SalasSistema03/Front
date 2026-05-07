<template>
    <div class="container-fluid">

        <div class=" shadow-sm border-0 bg-light">

            <h6 class="fw-bold text-secondary text-uppercase" style="font-size: 0.85rem;">
                Nueva Retención
            </h6>

            <form @submit.prevent="guardarComprobante" class="row g-2 needs-validation form-group" novalidate
                autocomplete="off">

                <div class="col-6 col-md-2">
                    <label class="form-label small mb-1">CUIT</label>
                    <input v-model="form.cuit_retencion" type="number" class="form-control form-control-sm"
                        placeholder="CUIT" @keydown.enter.prevent="enfocarFecha">
                </div>

                <div class="col-6 col-md-10">
                    <label class="form-label small mb-1">
                        Razon Social
                        <div v-if="loading" class="spinner-border spinner-border-sm text-primary ms-2" role="status"
                            style="width: 0.8rem; height: 0.8rem;">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </label>
                    <input :value="razonSocialMensaje" type="text" class="form-control form-control-sm" readonly
                        disabled>
                </div>

                <div class="col-6 col-md-2">
                    <label class="form-label small mb-1">Fecha Quincena</label>
                    <input v-model="form.fecha_comprobante" ref="inputFecha" type="date"
                        class="form-control form-control-sm">
                </div>

                <div class="col-6 col-md-8">
                    <label class="form-label small mb-1">Importe / Suma</label>
                    <input v-model="form.suma_comprobante" type="string" class="form-control form-control-sm"
                        placeholder="0.00">
                </div>

                <div class="col-6 col-md-2">
                    <label class="form-label small mb-1">Nº Comprobante</label>
                    <input v-model="form.numero_comprobante" type="number" class="form-control form-control-sm"
                        placeholder="0000">
                </div>

                <div class="col-12 col-md-3 d-flex align-items-end gap-1">
                    <button type="button" class="btn btn-primary btn-sm w-100" @click="mostratModalPersona = true">
                        Persona
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm w-100" @click="mostratModalBase = true">
                        Base %

                    </button>
                </div>

                <div class="col-6 col-md-3">
                    <label class="form-label small mb-1">Importe Calc.</label>
                    <input :value="form.importe_comprobante" type="number" class="form-control form-control-sm bg-white"
                        readonly disabled>
                </div>

                <div class="col-6 col-md-3">
                    <label class="form-label small mb-1">Retención</label>
                    <input :value="form.importe_retencion" type="number"
                        class="form-control form-control-sm bg-white text-danger fw-bold" readonly disabled>
                </div>

                <div class="col-12 col-md-3 d-flex align-items-end gap-1">
                    <button type="submit" class="btn btn-success btn-sm flex-grow-1" :disabled="enviarLoading">
                        <span v-if="enviarLoading" class="spinner-border spinner-border-sm me-1"></span>
                        <i v-else class="fa-solid fa-paper-plane me-1"></i>
                        {{ enviarLoading ? 'Enviando...' : 'Enviar' }}
                    </button>

                    <div class="dropdown">
                        <button class="btn btn-secondary btn-sm" type="button" data-bs-toggle="dropdown">
                            <!-- Cambié fa-gear por bi-gear-fill y agregué la clase nueva -->
                            <i class="bi bi-gear-fill icono-giratorio"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0"
                            aria-labelledby="dropdownMenuButton">
                            <li>
                                <button type="button" class="dropdown-item small"
                                    @click="mostratModalTotalQuincena = true">
                                    Total quincenas
                                </button>
                            </li>
                            <li><button type="button" class="dropdown-item small" data-bs-toggle="modal"
                                    data-bs-target="#exportacion_registros"
                                    @click="mostrarModalExportar = true"
                                    >Exportación</button></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <button type="button" class="dropdown-item small" data-bs-toggle="modal"
                                    data-bs-target="#ret_x_cuit"
                                    @click="mostrarModalRetencionPorCUIT = true" >Ret. X CUIT
                                </button>
                            </li>

                        </ul>
                    </div>
                </div>

            </form>
        </div>


        <div class="row mt-3">

            <div class="card-body p-2">
                <div class="table-responsive table-scroll-container">
                    <TablaRetencion ref="referenciaTabla" />
                </div>
            </div>



        </div>
    </div>

    <!-- MODALES -->
    <ModalBase v-if="mostratModalBase" :modaleBase="mostratModalBase" @cerrarModalBase="mostratModalBase = false" />
    <ModalPersona v-if="mostratModalPersona" :modalPersona="mostratModalPersona"
        @cerrarModalPersona="mostratModalPersona = false" />
    <ModalTotalQuincena v-if="mostratModalTotalQuincena" :modalTotalQuincena="mostratModalTotalQuincena"
        @cerrarModalTotalQuincena="mostratModalTotalQuincena = false" />
    <ModalRetencionPorCUIT v-if="mostrarModalRetencionPorCUIT" :modalRetencionPorCUIT="mostrarModalRetencionPorCUIT"
        @cerrarModalRetencionPorCUIT="mostrarModalRetencionPorCUIT = false" />
    <ModalExportar v-if="mostrarModalExportar" :modalExportar="mostrarModalExportar" @cerrarModalExportar="mostrarModalExportar  = false" />
    <!-- FIN MODALES -->
</template>

<script setup>
import { onMounted, reactive, watch, ref, computed } from 'vue';
import { alertas } from '@/utils/alertas.js';
import ModalBase from './Modales/ModalBase.vue';
import ModalPersona from './Modales/ModalCargarPersona.vue';
import ModalTotalQuincena from './Modales/ModalTotalQuincena.vue';
import ModalRetencionPorCUIT from './Modales/ModalRetencionPorCUIT.vue';
import ModalExportar from './Modales/ModalExportar.vue';
import TablaRetencion from './TablaRetencion.vue';
import {
    personaPorCuitService,
    getBasePorcentualService,
    verificaComprobanteService,
    guardarRetencionService
} from '@/Services/api/Contable/RetencionesApi.js';

// --- 1. ESTADO REACTIVO (Variables y Referencias) ---
const form = reactive({
    fecha_comprobante: '',
    numero_comprobante: '',
    suma_comprobante: '',
    importe_comprobante: 0,
    cuit_retencion: '',
    importe_retencion: 0,
    calcula_base: 'S',
    fecha_retencion: null,
    razon_social: '' // Aseguro que esté aquí para la reactividad
});

const configRetencion = ref({ base: 0, porcentual: 0, yaVerificado: false });
const loading = ref(false);          // Buscando persona
const calculandoRetencion = ref(false); // Buscando reglas/base
const enviarLoading = ref(false);    // Guardando en DB
const referenciaTabla = ref(null); // Esto conectará con el ref="referenciaTabla" del HTML
const mostratModalBase = ref(false);
const mostratModalPersona = ref(false);
const inputFecha = ref(null);        // Para el foco automático
const mostratModalTotalQuincena = ref(false);
const mostrarModalRetencionPorCUIT = ref(false);
const mostrarModalExportar = ref(false);


// --- 2. PROPIEDADES COMPUTADAS ---
// Manejo qué mensaje mostrar en el input de Razón Social según el CUIT
const razonSocialMensaje = computed(() => {
    const cuit = String(form.cuit_retencion || '');
    if (loading.value) return 'Buscando...';
    if (cuit.length === 0) return 'Ingrese CUIT';
    if (cuit.length > 11) return `CUIT excedido (${cuit.length} dígitos)`;
    if (cuit.length < 11) return `Faltan ${11 - cuit.length} dígitos...`;
    return form.razon_social || 'Realizando búsqueda...';
});

// --- 3. LÓGICA DE NEGOCIO Y API (Consultas al Servidor) ---

// Busco los datos de la persona por su CUIT
const personaPorCuit = async () => {
    if (String(form.cuit_retencion).length !== 11) return;
    loading.value = true;
    try {
        const response = await personaPorCuitService(form.cuit_retencion);
        const data = response.data.data.original;
        form.razon_social = data.razon_social_retencion;
    } catch (err) {
        console.error(err);
        form.razon_social = 'No se encontró la persona';
    } finally {
        loading.value = false;
    }
};

// Busco las reglas de retención (Base y %) y verifico si ya tiene comprobantes
const buscarReglas = async () => {
    if (form.cuit_retencion.toString().length === 11 && form.fecha_comprobante) {
        calculandoRetencion.value = true;
        try {
            const resConfig = await getBasePorcentualService();
            const existen = await verificaComprobanteService(form.cuit_retencion, form.fecha_comprobante);

            // Si ya existen, la base es 0, si no, tomo la de la config
            configRetencion.value.base = existen.data.data != null ? 0 : resConfig.data.data[0].dato;
            configRetencion.value.porcentual = resConfig.data.data[1].dato;
            configRetencion.value.yaVerificado = true;

            ejecutarCalculoMatematico();
        } catch (err) {
            console.error("Error buscando reglas:", err);
        } finally {
            calculandoRetencion.value = false;
        }
    }
};

// --- 4. LÓGICA DE CÁLCULO (Procesamiento Local) ---

// Realizo el cálculo matemático puro sin ir al servidor
const ejecutarCalculoMatematico = () => {
    form.importe_comprobante = parseExpression(form.suma_comprobante).toFixed(2);

    let total = (form.importe_comprobante - configRetencion.value.base) * configRetencion.value.porcentual;
    form.importe_retencion = total > 0 ? total.toFixed(2) : 0;
};

// Convierto el texto de "suma_comprobante" (ej: 100+200) en un número
const parseExpression = (expression) => {
    if (!expression) return 0;
    try {
        const cleanExpr = expression.toString().replace(/,/g, '.');
        return Function(`"use strict"; return (${cleanExpr})`)() || 0;
    } catch (e) {
        return 0;
    }
};

// --- 5. ACCIONES DEL FORMULARIO (Guardado y Reset) ---

// Envío todos los datos al backend para persistirlos
const guardarComprobante = async () => {
    if (!form.cuit_retencion || !form.fecha_comprobante || !form.suma_comprobante) {
        alertas.error("Error: Completa CUIT, Fecha e Importe");
        return;
    }

    enviarLoading.value = true;
    try {
        const response = await guardarRetencionService(form);
        if (response.data.status === 'success') {
            alertas.success(response.data.message);
            // Llamamos a la función que está DENTRO del componente hijo
            if (referenciaTabla.value) {
                referenciaTabla.value.obtenerRetenciones();
            }
            resetForm();
        } else {
            alertas.error(response.data.message || "Error inesperado");
        }
    } catch (err) {
        const mensajeBack = err.response?.data?.message || "Error al conectar con el servidor";
        alertas.error(mensajeBack);
    } finally {
        enviarLoading.value = false;
    }
};

// Limpio el formulario después de un éxito
const resetForm = () => {
    form.suma_comprobante = '';
    form.importe_comprobante = 0;
    form.importe_retencion = 0;
    form.numero_comprobante = '';
    form.cuit_retencion = '';
    form.fecha_comprobante = '';
    form.razon_social = '';
    configRetencion.value.yaVerificado = false;
};

// --- 6. UTILIDADES DE INTERFAZ (UX) ---

// Muevo el cursor al campo de fecha al presionar Enter en CUIT
const enfocarFecha = () => {
    if (inputFecha.value) inputFecha.value.focus();
};

// --- 7. OBSERVADORES (Watchers) ---

// Si cambia el CUIT, busco la persona
watch(() => form.cuit_retencion, (newValue) => {
    if (String(newValue).length === 11) {
        personaPorCuit();
    } else {
        form.razon_social = '';
    }
});

// Si cambia CUIT o Fecha, actualizo las reglas de negocio desde la DB
watch(() => [form.cuit_retencion, form.fecha_comprobante], () => {
    configRetencion.value.yaVerificado = false;
    buscarReglas();
});

// Si solo cambia la suma escrita, recalculamos localmente para mayor velocidad
watch(() => form.suma_comprobante, () => {
    ejecutarCalculoMatematico();
});


onMounted(() => {
    const hoy = new Date().toISOString().split('T')[0];
    form.fecha_comprobante = hoy;
});
</script>

<style scoped>
/* Estilo personalizado si no usas los de Bootstrap por defecto */
.btn-primary {
    background-color: #0d6efd;
    /* Ajustar al azul "SalasAzul" si es necesario */
}

.btn-outline-primary {
    border-color: #0d6efd;
}

label {
    font-size: 0.75rem;
}

input {
    font-size: 0.80rem;
    min-height: 0px !important;
    height: 1.5rem !important;

}

/* Definimos la animación */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Creamos la clase para aplicar al icono */
.icono-giratorio {
    display: inline-block;
    /* Importante para que pueda rotar */
    animation: spin 2s linear infinite;
}
</style>