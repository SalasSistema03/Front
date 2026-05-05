<template>
    <BaseModal :show="modaleBase" size="md" @close="$emit('cerrarModalBase')">

        <template #title>Base y Porcentuale</template>

        <template #body>
            <div v-if="loadingDatos" class="d-flex justify-content-center align-items-center" style="height: 150px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>

            <form v-else action="" autocomplete="off" class="form-group">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <label class="form-label small mb-1" for="modal_base">Base</label>
                        <input type="number" class="form-control" id="modal_base" v-model="form.base_dato">
                        <div id="baseHelp" class="form-text">Es la base mínima para calcular la retención
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-label small mb-1"  for="modal_porcentual">Porcentual</label>
                        <input type="number" class="form-control" id="modal_porcentual" v-model="form.porcentual_dato">
                        <div id="porcentualHelp" class="form-text">Es el porcentual que aplica para la
                            retención
                        </div>
                    </div>

                </div>
            </form>
        </template>


        <template #footer>
            <button id="modal_boton_b_p_calculo" type="submit" class="btn btn-primary" @click="guardarBasePorcentual" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="fa-solid fa-paper-plane me-1"></i>
                {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
            
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue';
import { onMounted, reactive, ref } from 'vue';
import { getBasePorcentualService, modificarBasePorcentualService } from '@/Services/api/Contable/RetencionesApi.js';
import { alertas } from '@/utils/alertas';

defineProps({
    modaleBase: Boolean
});
const emit = defineEmits(['cerrarModalBase']);

const loadingDatos = ref(true); //Este loading se utiliza para cargar al OBTENER los datos de la base y el porcentual al abrir el modal
const loading = ref(false); //Este loading se utiliza para cargar al GUARDAR la modificacion

const form = reactive({
    base_dato: 0,
    porcentual_dato: 0
})

const obtenerBasePorcentual = async () => {
    loadingDatos.value = true;
    try {
        const response = await getBasePorcentualService();
        console.log(response.data.data);
        form.base_dato = response.data.data[0].dato;
        form.porcentual_dato = response.data.data[1].dato;
    } catch (err) {
        alertas.error('Error', 'No se pudo obtener los datos de la base y el porcentual');
    } finally {
        loadingDatos.value = false;
    }
}
    
async function guardarBasePorcentual() {
    loading.value = true;
    try {
        console.log(form);
        const response = await modificarBasePorcentualService(form);
        console.log(response.data);
        alertas.success('Guardado', 'Se ha guardado correctamente');
        emit('cerrarModalBase');
    } catch (err) {
        alertas.error('Error', 'No se pudo guardar la configuración de base y porcentual');
    } finally {
        loading.value = false;
    }
}

//Al abrir se ejecuta esta función para obtener los datos de la base y el porcentual
onMounted(() => {
    obtenerBasePorcentual();
})
</script>