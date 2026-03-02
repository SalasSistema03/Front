import { ref } from 'vue'
import { getEstadoGeneral } from '@/Services/api/Atcl/AtclApi'

export function useEstadosGenerales() {
  const error = ref(null)
  const estadosGenerales = ref([])

  async function cargarEstadosGenerales() {
    error.value = null
    try {
      const response = await getEstadoGeneral()
      estadosGenerales.value = response.data
    } catch (error) {
      error.value = error
      console.error('Error cargando estados generales:', error)
    }
  }

  return {
    error,
    estadosGenerales,
    cargarEstadosGenerales,
  }
}
