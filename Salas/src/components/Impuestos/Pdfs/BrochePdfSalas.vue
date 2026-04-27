<template>
  <div><!-- Componente invisible para generar PDF de broches SALAS --></div>
</template>

<script setup>
import { GenerarPdfBroches } from '@/Services/api/Impuestos/tgiApi'

const props = defineProps({
  broches: {
    type: Array,
    required: true
  },
  anio: {
    type: Number,
    required: true
  },
  mes: {
    type: Number,
    required: true
  },
  impuesto:{
    type: String,
    required: true
  }
})

const generarPdf = async () => {

  try {
    const response = await GenerarPdfBroches({
      broches: props.broches,
      anio: props.anio,
      mes: props.mes,
      impuesto: props.impuesto
    });

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
