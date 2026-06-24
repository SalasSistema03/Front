<template>
  <baseModal :show="show" size="lg" @close="emit('close')">
    <template #title>Observación</template>
    <template #body>
      <div class="table-responsive table-scroll-container">
        <table class="table table-striped table-hover text-center">
          <thead>
            <tr>
              <th>Fecha de Carga</th>
              <th>Estado</th>
              <th>Observación</th>
              <th>Cargado Por</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="item in historial.resultado" :key="item.id">
              <td>{{ item.fecha_carga }}</td>
              <td>{{ item.estado.estado }}</td>
              <td>{{ item.observaciones }}</td>
              <td>{{ item.quien_cargo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
    </template>
  </baseModal>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { getHistorialReservaAlquiler } from '@/Services/api/Atcl/Alquiler/Alquiler'

const { showError, showSuccess } = useToast()
const historial = ref([])

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  observacion: {
    type: String,
    default: '',
  },

})


const getHistorialSeleccionado = async () => {

  try {
    const response = await getHistorialReservaAlquiler(props.observacion)
    historial.value = response.data
    console.log(historial.value)
    showSuccess('Historial obtenido correctamente')

  } catch (error) {
    showError('Error al obtener el historial')
    console.error('Error al obtener el historial', error)
  }
}

watch(() => props.show, (newVal) => {
  if (newVal && props.observacion) {
    getHistorialSeleccionado()
  }
})
const emit = defineEmits(['close', 'success'])
</script>
