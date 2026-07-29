<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Observaciones</template>
    <template #body>
      <div class="proceso_reserva_tabla_contenedor_obserbaciones">
        <table class="table table-striped table-hover proceso_reserva_table">
          <thead class="text-center">
            <tr>
              <th>Fecha de Carga</th>
              <th>Estado</th>
              <th>Observación</th>
              <th>Cargado Por</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in resultado" :key="index">
              <td>{{ item.fecha_carga }}</td>
              <td>{{ nombreEstado(item.id_estado) }}</td>
              <td>{{ item.observaciones }}</td>
              <td>{{ item.nombre_usuario }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template #footer></template>
  </BaseModal>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { observacionescontrato } from '@/Services/api/Contrato/Contrato'
import { useToast } from '@/composables/useToast'

const { showError } = useToast()



const props = defineProps({
  show: { type: Boolean, default: false },
  contrato: { type: Object, default: () => ({}) },
  estados: { type: Array, default: () => [] },
})
const resultado = ref([])

const nombreEstado = (idEstado) => {
  const estado = props.estados.find((e) => e.id === idEstado)
  return estado ? estado.estado : '-'
}

const traerObservacionesContrato = async () => {
  resultado.value = [] // Limpiar antes de cargar nuevos datos
  try {
    const idProceso = props.contrato?.historial_estado_contrato?.id_proceso_propiedad

    if (!idProceso) {
      console.warn('No hay id_proceso_propiedad')
      return
    }

    const response = await observacionescontrato(idProceso)
    const observaciones = response.data.resultado || []

    resultado.value = observaciones.filter((item) => {
      const observacion = item?.observaciones
      return observacion !== null && observacion !== undefined && String(observacion).trim() !== ''
    })
    //console.log('Observaciones del contrato:', resultado.value)
  } catch (error) {
    console.error('Error al traer las observaciones del contrato:', error)
    showError('Error al traer las observaciones del contrato')
  }
}

const emit = defineEmits(['close'])

watch(() => props.show, (nuevoValor) => {
  if (nuevoValor) {
    traerObservacionesContrato()
  }
})
</script>
