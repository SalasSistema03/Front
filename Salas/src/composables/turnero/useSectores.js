import { ref } from 'vue'
import { getSector } from '@/Services/api/Turnero/turneroApi'

export function useSectores() {
    const sectores = ref([])
    const loadingSectores = ref(false)

    const loadSectores = async () => {
        loadingSectores.value = true
        try {
            const response = await getSector()
            sectores.value = response.data
        } catch (error) {
            console.error('Error cargando sectores:', error)
            throw error
        } finally {
            loadingSectores.value = false
        }
    }

    return {
        sectores,
        loadingSectores,
        loadSectores
    }
}
