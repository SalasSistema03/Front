import { ref } from 'vue'
import { getEstadoVenta } from '@/Services/api/Atcl/AtclApi'

export function useEstadosVenta() {
  const error = ref(null)
  const estadosVenta = ref([])

  async function cargarEstadosVenta() {
    error.value = null
    try {
      const response = await getEstadoVenta()
      estadosVenta.value = response.data
    } catch (error) {
      error.value = error
      console.error('Error cargando estados venta:', error)
    }
  }

  return {
    error,
    estadosVenta,
    cargarEstadosVenta,
  }
}
