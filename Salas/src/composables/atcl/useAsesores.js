import { ref } from 'vue'
import { getAsesor } from '../../Services/api/Atcl/AtclApi'

export function useAsesores() {
  const asesores = ref([])
  const error = ref(null)

  async function cargarAsesores() {
    try {
      const response = await getAsesor()
      asesores.value = response.data.original || response.data
    } catch (err) {
      error.value = err
    }
  }

  return {
    asesores,
    error,
    cargarAsesores
  }
}
