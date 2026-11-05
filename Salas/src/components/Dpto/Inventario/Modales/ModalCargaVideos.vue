<template>
    <BaseModal :show="show" size="lg" @close="cerrarModal" title="Carga de Videos de Inventario">
        <template #body>
            <div class="mb-3">
                <label class="form-label">Seleccionar Videos (.mp4, .mov)</label>
                <input type="file" class="form-control" multiple accept="video/*" @change="onFileChange">
            </div>
            <div v-if="subiendo" class="text-center">
                <div class="spinner-border text-primary" role="status"></div>
                <p>Subiendo videos...</p>
            </div>
        </template>
        <template #footer>
            <button class="btn btn-secondary" @click="cerrarModal" :disabled="subiendo">Cerrar</button>
            <button class="btn btn-primary" @click="subirVideos" :disabled="!archivos.length || subiendo">Subir Videos</button>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { useToast } from '@/composables/useToast';
import { subirVideoInventario } from '@/Services/api/Dpto/Inventario';

const props = defineProps({
    show: { type: Boolean, required: true },
    idProcesoPropiedad: { type: Number, default: null }
});

const emit = defineEmits(['close', 'uploaded']);
const archivos = ref([]);
const subiendo = ref(false);
const { showSuccess, showError, handleApiError } = useToast();

const onFileChange = (e) => {
    archivos.value = Array.from(e.target.files);
};

const subirVideos = async () => {
    if (!props.idProcesoPropiedad) return;
    subiendo.value = true;

    try {
        // El backend procesa un video por petición, así que subimos de a uno
        for (const file of archivos.value) {
            const formData = new FormData();
            formData.append('id_proceso_propiedad', props.idProcesoPropiedad);
            formData.append('video', file);
            await subirVideoInventario(formData);
        }

        showSuccess('Videos subidos correctamente.');
        emit('uploaded');
        cerrarModal();
    } catch (error) {
        console.error(error);
        handleApiError(error);
    } finally {
        subiendo.value = false;
    }
};

const cerrarModal = () => emit('close');
</script>
