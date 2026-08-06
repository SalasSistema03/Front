<template>
  <div></div>
</template>

<script setup>
import { GenerarPdfComprobantesService } from '@/Services/api/Impuestos/FideicomisoApi'
import { defineProps, watch } from 'vue'
import { onMounted } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const generarPdf = async (payload = null) => {
  console.log('pdfComprobantes.generarPdf invoked (before request). payload:', payload ? JSON.parse(JSON.stringify(payload)) : JSON.parse(JSON.stringify(props.formData)));
  try {
    const dataToSend = payload ?? props.formData;
    console.log('pdfComprobantes - calling GenerarPdfComprobantesService with', JSON.parse(JSON.stringify(dataToSend)));
    const response = await GenerarPdfComprobantesService(dataToSend);

    console.log('pdfComprobantes - service returned', response);

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000)

  } catch (error) {
    console.error("Error al generar PDF en servidor", error);
  }
}
defineExpose({ generarPdf })

onMounted(() => {
  console.log('pdfComprobantes mounted. initial formData:', JSON.parse(JSON.stringify(props.formData)));
});
// Si el padre actualiza `formData`, disparamos la generación automáticamente
watch(() => props.formData, (newVal) => {
  if (newVal && newVal.registro) {
    generarPdf(newVal).catch(err => console.error(err));
  }
}, { deep: true });
</script>
