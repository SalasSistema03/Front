import { ref } from 'vue'
import { postTurnoNuevo } from '@/Services/api/Turnero/turneroApi'
import { useToast } from '@/composables/useToast'
import { useUsuario } from './useUsuario'

export function useCargaTurno() {
    const selectedSector = ref('')
    const numeroSeleccionado = ref('')
    const tipoSeleccionado = ref('')
    const isLoading = ref(false)
    
    const { handleApiError, showSuccess } = useToast()
    const { obtenerUsuarioActual } = useUsuario()

    const submitForm = async () => {
        isLoading.value = true
        
        try {
            const usuario = await obtenerUsuarioActual()
            
            const turnoData = {
                sector_id: selectedSector.value,
                numero_identificador: numeroSeleccionado.value,
                tipo_identificador: tipoSeleccionado.value,
                usuario: usuario.id
            }
            

          
            
            const token = localStorage.getItem('token')
            if (!token) {
                handleApiError('No hay token de autenticación')
                return
            }
            
            await postTurnoNuevo(turnoData)
            showSuccess('Turno cargado correctamente')
            
            // Limpiar formulario
            selectedSector.value = ''
            numeroSeleccionado.value = ''
            tipoSeleccionado.value = ''
            
        } catch (error) {
            handleApiError(error)
        } finally {
            setTimeout(() => {
                isLoading.value = false
            }, 500)
        }
    }

    return {
        selectedSector,
        numeroSeleccionado,
        tipoSeleccionado,
        isLoading,
        submitForm
    }
}
