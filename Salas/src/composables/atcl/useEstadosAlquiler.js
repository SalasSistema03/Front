import { ref } from 'vue'
import { getEstadoAlquiler } from '../../Services/api/Atcl/AtclApi'

export const useEstadosAlquiler = () => {
  const estadosAlquiler = ref([])
  const error = ref(null)

  async function cargarEstadosAlquiler() {
    try {
      const response = await getEstadoAlquiler()
      estadosAlquiler.value = response.data
    } catch (err) {
      error.value = err
    }
  }

  return {
    estadosAlquiler,
    error,
    cargarEstadosAlquiler
  }
}
