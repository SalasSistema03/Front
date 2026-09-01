
import { ref } from 'vue'
import { getLocalidades } from '@/Services/api/Atcl/AtclApi'

export function useLocalidades() {
  const localidades = ref([])

  const error = ref(null)

  async function cargarLocalidades() {

    error.value = null

    try {
      const response = await getLocalidades()
      localidades.value = response.data.data
      console.log('Localidades:', response.data.data)
    } catch (err) {
      error.value = err
      console.error('Error cargando localidades:', err)
    }
  }

  return {
    localidades,
    error,
    cargarLocalidades
  }
}
