<template>
    <BaseModal :show="modalExportar" size="sm" @close="$emit('cerrarModalExportar')">
        <template #title>Exportar</template>

        <template #body>
            <div class="row">
                <div class="col-12 col-md-6 mb-3 ">
                    <div class="d-flex justify-content-center align-items-center">
                        <button class="btn btn-primary" @click="exportarTXT">Exportar TXT</button>
                    </div>

                </div>
            </div>

        </template>
        <template #footer></template>

    </BaseModal>
</template>

<script setup>
import { ref, reactive } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { exportarRetencionesTxt } from '@/Services/api/Contable/RetencionesApi.js';

const props = defineProps({
    modalExportar: Boolean
});
const emit = defineEmits(['cerrarModalExportar', 'registrosExportados']);


const exportarTXT = async () => {
    try {
        const response = await exportarRetencionesTxt();
        
        // Verificamos si es un blob de tipo aplicación/json (un error del servidor)
        if (response.data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                const mensajeError = JSON.parse(reader.result);
                console.error("Error del servidor:", mensajeError.message);
                alert(mensajeError.message); // O usa SweetAlert
            };
            reader.readAsText(response.data);
            return;
        }

        // Si todo está bien, descargar
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/plain' }));
        const link = document.createElement('a');
        link.href = url;
        
        // Nombre dinámico con fecha para evitar archivos duplicados
        const fecha = new Date().toISOString().slice(0, 10);
        link.setAttribute('download', `retenciones_${fecha}.txt`);
        
        document.body.appendChild(link);
        link.click();
        
        // Limpieza importante
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        emit('registrosExportados');

    } catch (error) {
        console.error("Error de red o comunicación:", error);
    }
};

</script>
