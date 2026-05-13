<template>
  <div></div>
</template>

<script setup>
import { GenerarPdfListadoPropiedad } from '@/Services/api/Atcl/AtclApi'
import { defineProps } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const generarPdf = async () => {
  try {
    const response = await GenerarPdfListadoPropiedad(props.formData);

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000)
  } catch (error) {
    console.error("Error al generar PDF en servidor", error);
  }
}
defineExpose({ generarPdf })
</script>
