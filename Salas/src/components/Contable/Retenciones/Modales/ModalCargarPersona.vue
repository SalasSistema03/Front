<template>
    <BaseModal :show="modalPersona" size="md" @close="$emit('cerrarModalPersona')">
        <template #title>Carga de Personas</template>


        <template #body>
            <form action="" class="form-group">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold small  text-muted">CUIT</label>
                        <input type="text" class="form-control form-control-sm shadow-sm" required v-model="form.cuit_retencion" />
                    </div>
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold small  text-muted">Razon Social</label>
                        <input type="text" class="form-control form-control-sm shadow-sm" required v-model="form.razon_social_retencion" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold small  text-muted">Domicilio Fizcal</label>
                        <input type="text" class="form-control form-control-sm shadow-sm" required v-model="form.domicilio_retencion" />
                    </div>
                    <div class="col-12 col-md-6">
                        <label class="form-label fw-bold small  text-muted">Provincia</label>
                        <select v-model="form.id_provincia_retencion"  class="form-select form-select-sm shadow-sm" required>
                            <option value="" disabled selected>Seleccione una provincia</option>
                            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
                                {{ provincia.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-4">
                        <label class="form-label fw-bold small  text-muted">Localidad</label>
                        <input type="text" class="form-control form-control-sm shadow-sm" required v-model="form.localidad_retencion" />
                    </div>
                    <div class="col-12 col-md-8">
                        <label class="form-label fw-bold small  text-muted">Codigo Postal</label>
                        <input type="number" class="form-control form-control-sm shadow-sm" required v-model="form.codigo_postal_retencion" />
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <button type="button" class="btn btn-primary btn-sm w-100" @click="guardarPersona" :disabled="loadingForm">
                {{ loadingForm ? 'Guardando...' : 'Guardar' }}
            </button>
        </template>
    
    </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue';
import { onMounted, reactive, ref } from 'vue';
import { obtenerProvinciasService, guardarPersonaService } from '@/Services/api/Contable/RetencionesApi';
import { alertas } from '@/utils/alertas';

defineProps({
    modalPersona: Boolean
});
const emit = defineEmits(['cerrarModalPersona']);

const loadingForm = ref(false);

const provincias = ref([]);
const form = reactive({
    cuit_retencion: '',
    razon_social_retencion: '',
    domicilio_retencion: '',
    localidad_retencion: '',
    id_provincia_retencion: '',
    codigo_postal_retencion: ''
});

async function guardarPersona() {
    loadingForm.value = true;
    console.log('Datos a guardar:', form);

    //creo una variable que convierte el CUIT a un numero sin guiones ni espacios para validar que tenga 11 digitos
    const cuitSinFormato = form.cuit_retencion.replace(/[-\s]/g, '');
    if (cuitSinFormato.length !== 11) {
        alertas.error('Error', 'El CUIT debe tener 11 digitos');
        loadingForm.value = false;
        return;
    }
    if (!form.razon_social_retencion || !form.domicilio_retencion || !form.id_provincia_retencion || !form.codigo_postal_retencion || !form.localidad_retencion) {
        alertas.error('Error', 'Completa todos los campos');
        loadingForm.value = false;
        return;
    }
    try {
        await guardarPersonaService(form);
        alertas.success('Guardado', 'Se ha guardado correctamente');
        emit('cerrarModalPersona');
    } catch (err) {
        alertas.error('Error', 'No se pudo guardar la persona');
        console.error('Error al guardar:', err);
    } finally {
        loadingForm.value = false;
    }
}

/* Obtener provincias */
const getProvincias = async () => {
    try {
        const response = await obtenerProvinciasService();
        provincias.value = response.data.data;
    } catch (err) {
        console.error('Error:', err);
    }
};
/* Fin obtener provincias */

onMounted(() => {
    getProvincias();
});

</script>