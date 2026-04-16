import { ref } from 'vue'
import { getCaptadorInterno } from '../../Services/api/Atcl/AtclApi'

export const useCaptadorInterno = () => {
  const captadoresInternos = ref([])
  const error = ref(null)

  const cargarCaptadoresInternos = async () => {
    try {
      const response = await getCaptadorInterno()
      captadoresInternos.value = response.data
    } catch (err) {
      error.value = err
      console.error('Error al cargar captadores internos:', err)
    }
  }

  return {
    captadoresInternos,
    error,
    cargarCaptadoresInternos
  }
}
