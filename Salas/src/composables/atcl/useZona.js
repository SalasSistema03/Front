
import { ref } from 'vue'
import { getZonas } from '@/Services/api/Atcl/AtclApi'

export function useZona() {
  const zonas = ref([])

  const error = ref(null)

  async function cargarZonas() {

    error.value = null

    try {
      const response = await getZonas()
      zonas.value = response.data
    } catch (err) {
      error.value = err
      console.error('Error cargando zonas:', err)
    }
  }

  return {
    zonas,
    error,
    cargarZonas
  }
}
