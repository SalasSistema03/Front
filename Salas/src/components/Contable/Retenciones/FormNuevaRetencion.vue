<template>
    <div class="container-fluid">

        <div class=" shadow-sm border-0 bg-light">

            <h6 class="fw-bold text-secondary text-uppercase" style="font-size: 0.85rem;">
                Nueva Retención
            </h6>

            <form @submit.prevent="enviar" class="row g-2 needs-validation" novalidate autocomplete="off">

                <div class="col-6 col-md-2">
                    <label class="form-label small mb-1">CUIT</label>
                    <input v-model="form.cuit_retencion" type="number" class="form-control form-control-sm"
                        placeholder="CUIT">
                </div>

                <div class="col-6 col-md-10">
                    <label class="form-label small mb-1">
                        Razon Social
                        <div v-if="loading" class="spinner-border spinner-border-sm text-primary ms-2" role="status"
                            style="width: 0.8rem; height: 0.8rem;">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </label>
                    <input v-model="form.razon_social" type="text" class="form-control form-control-sm" readonly
                        disabled placeholder="Razón Social">
                </div>

                <div class="col-6 col-md-2">
                    <label class="form-label small mb-1">Fecha Quincena</label>
                    <input v-model="form.fecha_comprobante" type="date" class="form-control form-control-sm">
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
                    <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#carga_persona_modal">
                        Persona
                    </button>
                    <button type="button" class="btn btn-outline-primary btn-sm w-100" 
                         @click="mostratModalBase = true">
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
                        <button class="btn btn-secondary btn-sm" type="button" id="dropdownMenuButton"
                            data-bs-toggle="dropdown">
                            <i class="fa-solid fa-gear"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0"
                            aria-labelledby="dropdownMenuButton">
                            <li><button type="button" class="dropdown-item small" data-bs-toggle="modal"
                                    data-bs-target="#total_q">Total quincenas</button></li>
                            <li><button type="button" class="dropdown-item small" data-bs-toggle="modal"
                                    data-bs-target="#exportacion_registros">Exportación</button></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><button type="button" class="dropdown-item small" data-bs-target="#ret_x_cuit">Ret. X
                                    CUIT</button></li>
                        </ul>
                    </div>
                </div>

            </form>
        </div>

    </div>

    <!-- MODALES -->
    <ModalBase v-if="mostratModalBase" :modaleBase="mostratModalBase" @cerrarModalBase="mostratModalBase = false" />
    <!-- FIN MODALES -->
</template>

<script setup>
import { onMounted, reactive, watch, ref } from 'vue';
import { alertas } from '@/utils/alertas.js'
import ModalBase from './Modales/ModalBase.vue';
import { personaPorCuitService, getBasePorcentualService, verificaComprobanteService, guardarRetencionService } from '@/Services/api/Contable/RetencionesApi.js'

/* Codigo para los modales */
const mostratModalBase = ref(false);
/* Fin codigo para los modales */

const loading = ref(false);
const enviarLoading = ref(false);
const config = ref({ base: 0, porcentual: 0 }); // Para guardar los datos de la API de configuración

// Estado reactivo del formulario
const form = reactive({
    fecha_comprobante: '',
    numero_comprobante: '',
    suma_comprobante: '',
    importe_comprobante: 0, // Estos usualmente se calculan automáticamente
    cuit_retencion: '',
    importe_retencion: 0,
    calcula_base: 'S',
    fecha_retencion: null
});

// Función para procesar el envío
const personaPorCuit = async () => {

    if (String(form.cuit_retencion).length !== 11) return;

    loading.value = true; // Iniciamos loading
    try {
        const response = await personaPorCuitService(form.cuit_retencion);
        const data = response.data.data.original;
        form.razon_social = data.razon_social_retencion;
    } catch (err) {
        console.log(err);
        form.razon_social = 'No se encontró la persona';
    }
    finally {
        loading.value = false; // Detenemos loading
    }
};
// OBSERVADOR: Se ejecuta cada vez que form.cuit_retencion cambia
watch(() => form.cuit_retencion, (newValue) => {
    // Si el usuario ingresa 11 caracteres (longitud estándar CUIT)
    if (String(newValue).length === 11) {
        personaPorCuit();
    } else {
        // Opcional: limpiar la razón social si borra el CUIT
        form.razon_social = '';
    }
});

// --- 1. Función para parsear expresiones (Tu lógica de antes) ---
const parseExpression = (expression) => {
    if (!expression) return 0;
    try {
        // Sustituimos comas por puntos y evaluamos de forma segura
        // Nota: En Vue es más limpio usar una pequeña función de suma o eval simple
        const cleanExpr = expression.toString().replace(/,/g, '.');
        // Usamos Function para evaluar la suma de forma segura sin eval()
        return Function(`"use strict"; return (${cleanExpr})`)() || 0;
    } catch (e) {
        return 0;
    }
};

// --- 2. Lógica de cálculo integral ---
const calcularTodo = async () => {
    // A. Parseamos la suma/expresión
    form.importe_comprobante = parseExpression(form.suma_comprobante).toFixed(2);

    // B. Si tenemos CUIT y Fecha, verificamos si corresponde base
    if (form.cuit_retencion.toString().length === 11 && form.fecha_comprobante) {
        loading.value = true;
        try {
            // Traemos configuración (base y %)
            const resConfig = await getBasePorcentualService();
            console.log("Respuesta:", resConfig);
            let base = resConfig.data.data[0].dato;
            let porcentual = resConfig.data.data[1].dato;

            console.log("Config Base:", base, "Config %:", porcentual);

            // Verificamos si ya existen comprobantes (Tu verificaBaseRetencion)
            const existen = await verificaComprobanteService(form.cuit_retencion, form.fecha_comprobante);

            console.log("¿Existen comprobantes previos?", existen);

            if (existen.data.data != null) {
                console.log("Comprobantes previos encontrados, no se calcula base.");
                base = 0;
                form.calcula_base = 'N';
            } else {
                form.calcula_base = 'S';
            }

            // C. Cálculo final
            let total = (form.importe_comprobante - base) * porcentual;
            form.importe_retencion = total > 0 ? total.toFixed(2) : 0;

        } catch (err) {
            console.error("Error en cálculos:", err);
        } finally {
            loading.value = false;
        }
    }
};

//Funcion boton "enviar" que guarda el comprobante
const enviar = async () => {
    guardarComprobante();
};


//Guardar comprobante
const guardarComprobante = async () => {
    // 1. Validaciones previas
    if (!form.cuit_retencion || !form.fecha_comprobante || !form.suma_comprobante) {
        alertas.error("Error: Completa CUIT, Fecha e Importe");
        return;
    }

    enviarLoading.value = true;
    try {
        const response = await guardarRetencionService(form);

        // Laravel devuelve 200 y el objeto con 'status' y 'message'
        // Axios guarda esto en response.data
        if (response.data.status === 'success') {
            alertas.success(response.data.message);
            resetForm(); // Opcional: limpiar el formulario tras el éxito
        } else {
            // Por si Laravel devuelve 200 pero con un status interno de error
            alertas.error(response.data.message || "Error inesperado");
        }
    }catch (err) {
        // Manejo de errores 500 o de red
        console.error("Error completo:", err);
        
        // Intentamos capturar el mensaje que viene del catch del Back-end
        const mensajeBack = err.response?.data?.message || "Error al conectar con el servidor";
        alertas.error(mensajeBack);
        
    } finally {
        enviarLoading.value = false;
    }

}
// Función para resetear (opcional, te la dejo para que la tengas)
const resetForm = () => {
    form.suma_comprobante = '';
    form.importe_comprobante = 0;
    form.importe_retencion = 0;
    form.numero_comprobante = '';
    form.cuit_retencion = '';
    form.fecha_comprobante = '';
    // No reseteo CUIT por si vas a cargar varias del mismo
};





watch(() => [form.suma_comprobante, form.cuit_retencion, form.fecha_comprobante], () => {
    calcularTodo();
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
</style>