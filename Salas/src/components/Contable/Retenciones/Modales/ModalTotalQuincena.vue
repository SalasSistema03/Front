<template>
    <BaseModal :show="modalTotalQuincena" size="xl" @close="cerrarModal">
        <template #title>Total por Quincena</template>

        <template #body>
            <form class="container-fluid p-0 form-group">
                <div class="row g-2 align-items-end">

                    <div class="col-12 col-md-3">
                        <label class="form-label mb-1 small fw-bold text-secondary">Fecha a procesar</label>
                        <!-- Usamos @change para disparar la búsqueda automáticamente al elegir fecha -->
                        <input 
                            type="date" 
                            v-model="fechaProcesar" 
                            @change="obtenerTotales"
                            class="form-control form-control-sm border-secondary-subtle"
                        >
                        <div class="form-text mt-1" style="font-size: 0.7rem; line-height: 1;">Solo mes y año</div>
                    </div>

                    <div class="col-6 col-md-4">
                        <label class="form-label mb-1 small fw-bold text-secondary">1er Quincena</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-light text-muted fw-normal">$</span>
                            <input 
                                type="number" 
                                :value="totales.primera" 
                                class="form-control form-control-sm bg-light" 
                                disabled
                                placeholder="0.00"
                            >
                        </div>
                        <div class="form-text mt-1 invisible" style="font-size: 0.7rem;">.</div>
                    </div>

                    <div class="col-6 col-md-4">
                        <label class="form-label mb-1 small fw-bold text-secondary">2da Quincena</label>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-light text-muted fw-normal">$</span>
                            <input 
                                type="number" 
                                :value="totales.segunda" 
                                class="form-control form-control-sm bg-light" 
                                disabled
                                placeholder="0.00"
                            >
                        </div>
                        <div class="form-text mt-1 invisible" style="font-size: 0.7rem;">.</div>
                    </div>

                </div>
            </form>
        </template>

        <template #footer>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { obtenerSumaQuincenaService } from '@/Services/api/Contable/RetencionesApi.js';

const props = defineProps({
    modalTotalQuincena: Boolean
});

const emit = defineEmits(['cerrarModalTotalQuincena']);

// --- ESTADO REACTIVO ---
const fechaProcesar = ref('');
const cargando = ref(false);
const totales = reactive({
    primera: 0,
    segunda: 0
});

// --- MÉTODOS ---

const obtenerTotales = async () => {
    if (!fechaProcesar.value) return;

    // Extraemos año y mes del input date (YYYY-MM-DD)
    const [anio, mes] = fechaProcesar.value.split('-');
    
    cargando.value = true;
    
    try {
        console.log("fechaProcesar", fechaProcesar.value);
        const response = await obtenerSumaQuincenaService(anio, parseInt(mes));
        
        if (response.data.status === 'success') {
            totales.primera = response.data.data.suma_primera;
            totales.segunda = response.data.data.suma_segunda;
        }
    } catch (error) {
        console.error("Error al obtener totales:", error);
        // Aquí podrías usar una alerta (SweetAlert o similar)
    } finally {
        cargando.value = false;
    }
};

const cerrarModal = () => {
    // Limpiamos los datos al cerrar para la próxima vez
    fechaProcesar.value = '';
    totales.primera = 0;
    totales.segunda = 0;
    emit('cerrarModalTotalQuincena');
};
</script>