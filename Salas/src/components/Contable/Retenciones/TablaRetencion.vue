<!-- TablaRetenciones.vue -->
<template>
    <div class="card shadow-sm mt-3 position-relative">

        <!-- Spinner de carga superpuesto -->
        <div v-if="loadingTabla" class="overlay-loader">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
        <div class="card-body p-2">
            <div class="table-responsive table-scroll-container">
                <table class="table table-striped table-hover w-100" id="tablaDatos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>CUIT</th>
                            <th>Base</th>
                            <th>F. Compr.</th>
                            <th>N° Compr.</th>
                            <th>Importe Compr.</th>
                            <th>Importe Ret.</th>
                            <th>F. Ret</th>
                            <th>- - - -</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in registros" :key="index">
                            <td>{{ item.razon_social_retencion }}</td>
                            <td>{{ item.cuit_retencion }}</td>
                            <td>{{ item.calcula_base }}</td>
                            <td>{{ item.fecha_comprobante }}</td>
                            <td>{{ item.numero_comprobante }}</td>
                            <td>{{ item.importe_comprobante }}</td>
                            <td>{{ item.importe_retencion }}</td>
                            <td>{{ item.fecha_retencion }}</td>
                            <td class="text-center">
                                <button type="button" @click="abrirModalModificar(item)"
                                    class="btn btn-sm btn-light text-primary shadow-sm">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <ModalModificarRetencion 
    v-if="mostrarModalModificar && registroSeleccionado" 
    :modalModificar="mostrarModalModificar"
    :datosRetencion="registroSeleccionado"
    @cerrarModalModificar="mostrarModalModificar = false"
    @registroActualizado="obtenerRetenciones" 
/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { obtenerTablaRetencionesService } from '@/Services/api/Contable/RetencionesApi.js';
import ModalModificarRetencion from './Modales/ModalModificarRetencion.vue';
import { alertas } from '@/utils/alertas.js';

const registros = ref([]);
const loadingTabla = ref(true);

const registroSeleccionado = ref(null);
const mostrarModalModificar = ref(false);

const abrirModalModificar = (item) => {
    console.log('Registro seleccionado para modificar:', item);
    registroSeleccionado.value = { ...item }; // Clonamos el objeto para no modificar la tabla antes de guardar
    mostrarModalModificar.value = true;
};

const obtenerRetenciones = async () => {
    loadingTabla.value = true;
    try {
        const response = await obtenerTablaRetencionesService();
        registros.value = response.data.comprobantes;
    } catch (err) {
        alertas.error('Error de conexión: ' + (err.response?.data?.message || err.message));
    } finally {
        loadingTabla.value = false;
    }
};

// Exponemos la función para que el padre pueda llamarla mediante una Ref
defineExpose({ obtenerRetenciones });
defineEmits(['editar', 'cerrarModalModificar']);

onMounted(obtenerRetenciones);
</script>

<style scoped>
/* Contenedor para el scroll vertical (opcional) */
.table-scroll-container {
    max-height: 35vh;
    /* Ajusta la altura máxima a tu gusto */
    overflow-y: auto;
}

#tablaDatos {
    /* Eliminé border: 10vh porque crearía un borde gigante.
     Si querías un borde fino, usa 1px o 2px */
    border: 1px solid rgba(0, 175, 154, 0.96);
}

#tablaDatos th {
    color: rgba(0, 175, 154, 0.96);
    font-size: 80%;
    background-color: white;
    position: sticky;
    /* Mantiene el encabezado fijo al hacer scroll vertical */
    top: 0;
    z-index: 1;
}

#tablaDatos td {
    color: blue;
    font-size: 60%;
    padding: 0.4%;
    /* Evita que el texto se rompa en varias líneas */
}


.overlay-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 10;
    border-radius: 0.375rem;
}

.opacity-50 {
    opacity: 0.5;
    transition: opacity 0.3s ease;
}
</style>