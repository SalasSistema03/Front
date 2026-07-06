<template>
  <BaseModal :show="show" size="md" @close="cerrarModal" :backdrop="'static'">
    <template #title>
      <i class="bi bi-file-earmark-pdf text-danger me-2"></i> Armar / Exportar Broches
    </template>

    <template #body>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label small text-muted fw-bold mb-1">Mes</label>
          <input type="number" class="form-control form-control-sm shadow-sm" v-model="form.mes" min="1" max="12" placeholder="Ej: 7">
        </div>
        
        <div class="col-md-4">
          <label class="form-label small text-muted fw-bold mb-1">Año</label>
          <input type="number" class="form-control form-control-sm shadow-sm" v-model="form.anio" placeholder="Ej: 2026">
        </div>

        <div class="col-md-12">
          <label class="form-label small text-muted fw-bold mb-1">Administrador</label>
          <select class="form-select form-select-sm shadow-sm" v-model="form.administrador">
            <option value="">Seleccione un administrador...</option>
            <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
              {{ emp.nombre }}
            </option>
          </select>
        </div>
      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm px-4 shadow-sm" @click="cerrarModal">Cerrar</button>
      <button type="button" class="btn btn-primary btn-sm px-4 shadow-sm" @click="generarDocumento">
        <i class="bi bi-download me-1"></i> Generar
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { alertas } from '@/utils/alertas';
import { descargarPdfBrocheService } from '@/Services/api/Impuestos/expensasApi.js';

const props = defineProps({
  show: { type: Boolean, required: true },
  empresas: { type: Array, required: true }
});

const emit = defineEmits(['close']);
const cargandoPdf = ref(false);

const form = ref({
  mes: '',
  anio: '',
  administrador: ''
});

onMounted(() => {
  const fecha = new Date();
  form.value.mes = fecha.getMonth() + 1;
  form.value.anio = fecha.getFullYear();
});

const generarDocumento = async () => {
  if (!form.value.mes || !form.value.anio) {
    alertas.error('Por favor, indique al menos el mes y el año.');
    return;
  }

  cargandoPdf.value = true;
  try {
    // 1. Pedimos el PDF binario al backend
    const response = await descargarPdfBrocheService({
      mes: form.value.mes,
      anio: form.value.anio,
      administrador: form.value.administrador || null
    });

    // 2. Creamos un Blob de tipo PDF con la respuesta
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // 3. Abrimos el PDF en una pestaña nueva
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Limpiamos la memoria del navegador pasado 1 minuto
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    
    emit('close');
  } catch (error) {
    console.error("Error completo:", error);

    // Truco para leer errores JSON cuando esperamos un Blob
    if (error.response && error.response.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const errorData = JSON.parse(reader.result);
          alertas.error(errorData.message || 'Error interno del servidor.');
          console.error('Error del backend:', errorData);
        } catch (e) {
          alertas.error('Error desconocido al generar el PDF.');
        }
      };
      reader.readAsText(error.response.data);
    } else {
      alertas.error('Error al conectar con el servidor.');
    }
  } finally {
    cargandoPdf.value = false;
  }
};
</script>