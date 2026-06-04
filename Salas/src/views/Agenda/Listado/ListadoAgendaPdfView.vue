<template>
  <div></div>
</template>

<script setup>
//import { GenerarPdfListadoPropiedad } from '@/Services/api/Atcl/AtclApi'
import { defineProps } from 'vue'
import { listarAgenda } from '../../../Services/api/Agenda/AgendaApi'

const props = defineProps({
  formAgenda: {
    type: Object,
    required: true
  }
})

const generarPdf = async () => {
  try {
    const response = await listarAgenda(props.formAgenda, { responseType: 'blob' })

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
