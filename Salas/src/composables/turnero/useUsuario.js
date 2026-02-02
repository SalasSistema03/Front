import { ref } from 'vue'
import { getUser } from '@/Services/api/Usuario/userApi'
import { useToast } from '@/composables/useToast'

export function useUsuario() {
    const usuarioId = ref(null)
    const loadingUsuario = ref(false)
    const { showError } = useToast()

    const obtenerUsuarioActual = async () => {
        loadingUsuario.value = true
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('No hay token de autenticación')
            }
            
            const response = await getUser(token)
            usuarioId.value = response.data.id
            return response.data
        } catch (error) {
            console.error('Error obteniendo usuario actual:', error)
            
            // Manejar específicamente errores de autenticación
            if (error.response && error.response.status === 401) {
                // Limpiar token y mostrar mensaje claro
                localStorage.removeItem('token')
                showError('Sesión expirada. Por favor, inicie sesión nuevamente.')
                
                // Redirigir al login
                setTimeout(() => {
                    window.location.href = '/login'
                }, 2000)
            } else {
                // Otro tipo de error
                const errorMessage = error.response?.data?.message || 
                                  error.response?.data?.error || 
                                  'Error al obtener información del usuario'
                showError(errorMessage)
            }
            
            throw error
        } finally {
            loadingUsuario.value = false
        }
    }

    return {
        usuarioId,
        loadingUsuario,
        obtenerUsuarioActual
    }
}
