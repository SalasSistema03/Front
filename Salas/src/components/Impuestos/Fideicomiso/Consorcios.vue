<template>
    <div class="container-fluid mt-3">
        
        <!-- Cabecera con Título y Botón Principal -->
        <div class="shadow-sm border-0 bg-light p-3 mb-3 rounded d-flex justify-content-between align-items-center">
            <h6 class="fw-bold text-secondary text-uppercase mb-0" style="font-size: 0.85rem;">
                Gestión de Registros Mensuales
            </h6>
            <button type="button" class="btn btn-primary btn-sm shadow-sm" @click="mostrarModalCarga = true">
                <i class="bi bi-plus-circle me-1"></i> Cargar Impuestos
            </button>
        </div>

        <!-- Contenedor de la Tabla -->
        <div class="card shadow-sm position-relative">
            
            <div v-if="loadingTabla" class="overlay-loader">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>

            <div class="card-body p-2">
                <div class="table-responsive table-scroll-container ">
                    <table class="table table-striped table-hover w-100" id="tablaDatos">
                        <thead>
                            <tr>
                                <th>Piso</th>
                                <th>Unidad</th>
                                <th>Propietario</th>
                                <th>Porcentual</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Renderizamos la información REAL de la base de datos -->
                            <tr v-for="item in unidades" :key="item.id">
                                <td>{{ item.piso }}</td>
                                <td>{{ item.unidad }}</td>
                                <td :class="{'text-muted fst-italic': !item.propietario}">
                                    {{ item.propietario || 'Sin vender' }}
                                </td>
                                <td>{{ item.porcentual }} %</td>
                                <td class="text-center">
                                    <div class="d-flex justify-content-center gap-1">
                                        <!-- NUEVO BOTÓN: Modificar Unidad -->
                                        <button type="button" @click="abrirModalModificarUnidad(item)"
                                            class="btn btn-sm btn-light shadow-sm text-primary" title="Editar Unidad">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        
                                        <!-- BOTÓN EXISTENTE: Ver Estado -->
                                        <button type="button" @click="abrirModalEstado(item)"
                                            class="btn btn-sm btn-light shadow-sm">
                                            <i class="bi bi-table me-1"></i> Ver Estado
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Mensaje por si la tabla viene vacía -->
                            <tr v-if="unidades.length === 0 && !loadingTabla">
                                <td colspan="5" class="text-center text-muted small py-3">
                                    No hay unidades registradas.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- MODAL 1: Carga de Impuestos Generales -->
        <ModalCargarImpuestos 
            v-if="mostrarModalCarga" 
            :modalCarga="mostrarModalCarga"
            @cerrarModalCarga="mostrarModalCarga = false" 
        />

        <!-- MODAL 2: Tabla de Estado por Unidad -->
        <ModalEstadoImpuestos 
            v-if="mostrarModalEstado" 
            :modalEstado="mostrarModalEstado"
            :datosUnidad="unidadSeleccionada"
            @cerrarModalEstado="mostrarModalEstado = false" 
        />

        <!-- NUEVO MODAL 3: Modificar datos de la Unidad -->
        <ModalModificarUnidad
            v-if="mostrarModalModificarUnidad"
            :modalModificar="mostrarModalModificarUnidad"
            :datosUnidad="unidadSeleccionada"
            @cerrarModalModificar="mostrarModalModificarUnidad = false"
            @unidadActualizada="obtenerUnidades"
        />
        
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { alertas } from '@/utils/alertas.js';
import { getUnidadesService } from '@/Services/api/Impuestos/FideicomisoApi.js';

import ModalCargarImpuestos from './Modales/ModalCargarImpuestos.vue'; 
import ModalEstadoImpuestos from './Modales/ModalEstadoImpuestos.vue';
import ModalModificarUnidad from './Modales/ModalModificarUnidad.vue'; // <--- Importamos el nuevo modal

const unidades = ref([]);
const loadingTabla = ref(false);

const mostrarModalCarga = ref(false);
const mostrarModalEstado = ref(false);
const mostrarModalModificarUnidad = ref(false); // <--- Control del nuevo modal
const unidadSeleccionada = ref(null);

const abrirModalEstado = (item) => {
    unidadSeleccionada.value = { ...item }; 
    mostrarModalEstado.value = true;
};

// <--- Nueva función para abrir el modal de edición
const abrirModalModificarUnidad = (item) => {
    unidadSeleccionada.value = { ...item };
    mostrarModalModificarUnidad.value = true;
};

const obtenerUnidades = async () => {
    loadingTabla.value = true;
    try {
        const response = await getUnidadesService();
        unidades.value = response.data.data; 
    } catch (err) {
        console.error("Error al cargar unidades:", err);
        const mensajeBack = err.response?.data?.message || "Error al conectar con el servidor";
        alertas.error(mensajeBack);
    } finally {
        loadingTabla.value = false;
    }
};

onMounted(() => {
    obtenerUnidades();
});
</script>

<style scoped>
/* Los mismos estilos que ya tenías */
.table-scroll-container {height:65vh; overflow-y: auto; }
#tablaDatos { border: 1px solid rgba(13, 110, 253, 0.2); }
#tablaDatos th { color: #495057; font-size: 70%; background-color: #f8f9fa; position: sticky; top: 0; z-index: 1; }
#tablaDatos td { font-size: 70%; padding: 0.5rem; vertical-align: middle; }
.btn-light {
    font-size: 0.7rem;
}
.overlay-loader {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; justify-content: center; align-items: center;
    background-color: rgba(255, 255, 255, 0.7); z-index: 10; border-radius: 0.375rem;
}
</style>