import { ref } from 'vue'
import { getInmueble } from '@/Services/api/Atcl/AtclApi'


export function useInmuebles() {
  const inmuebles = ref([])

  const error = ref(null)

  async function cargarInmuebles() {

    error.value = null

    try {
      const response = await getInmueble()
      inmuebles.value = response.data
    } catch (err) {
      error.value = err
      console.error('Error cargando inmuebles:', err)
    }
  }

  return {
    inmuebles,

    error,
    cargarInmuebles
  }
}
