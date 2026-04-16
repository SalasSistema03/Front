
import { getProvincias } from '@/Services/api/Atcl/AtclApi'
import { ref } from 'vue'

export function useProvincias() {
  const provincias = ref([])

  const error = ref(null)

  async function cargarProvincias() {
    error.value = null
    try {
      const response = await getProvincias()
      provincias.value = response.data

    } catch (error) {
      error.value = error
      console.error('Error cargando provincias:', error)
    }
  }

  return {
    cargarProvincias,
    provincias,
    error
  }
}
