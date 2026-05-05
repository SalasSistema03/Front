<template>
    <BaseModal :show="modalRetencionPorCUIT" size="xl" @close="$emit('cerrarModalRetencionPorCUIT')">
        <template #title>Retención por CUIT</template>

        <template #body>
            <div class="form-group row mb-3">
                <div class="col-md-8">
                    <input type="text" class="form-control" v-model="form.cuit" 
                        placeholder="Ingrese CUIT (sin guiones)">
                </div>
                <div class="col-md-4">
                    <button class="btn btn-primary" @click="obtenerRetenciones">Buscar</button>
                </div>
            </div>


            <!-- TABLA -->
            <div class="table-responsive table-scroll-container">
                <table class="table table-striped table-hover w-100" id="tablaDatos">
                    <thead>
                        <tr>
                            <th>Razon Social</th>
                            <th>CUIT</th>
                            <th>Fecha</th>
                            <th>Importe Comprobante</th>
                            <th>Importe Retención</th>
                        </tr>
                    </thead>
                    <tbody id="contenedor_retenciones_x_cuit">
                        <!-- Aquí se cargarán las retenciones -->
                        <tr v-for="registro in registros" :key="registro.id">
                            <td>{{ registro.razon_social_retencion }}</td>
                            <td>{{ registro.cuit_retencion }}</td>
                            <td>{{ registro.fecha_comprobante }}</td>
                            <td>{{ registro.importe_comprobante }}</td>
                            <td>{{ registro.importe_retencion }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- fIN TABLA -->
        </template>

        <template #footer>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue';
import { retencionPorCUITService } from '@/Services/api/Contable/RetencionesApi.js';
import { ref } from 'vue';

const props = defineProps({
    modalRetencionPorCUIT: Boolean
});
const emit = defineEmits(['cerrarModalRetencionPorCUIT']);

const form = ref({ cuit: '' });
const registros = ref([]);


async function obtenerRetenciones() {
    try {
        console.log("CUIT:", form.value.cuit);
        const response = await retencionPorCUITService(form.value.cuit);
        console.log("response", response);

        if (response.data.status === 'success') {
            registros.value = response.data.data;
        }
    } catch (error) {
        console.error("Error al obtener retenciones:", error);
        // Aquí podrías usar una alerta (SweetAlert o similar)
    }
}

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

</style>