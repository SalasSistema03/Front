import { ref } from 'vue'
import { loginService } from '@/Services/business/authService'

export function useAuth() {
    const isLoading = ref(false)
    const errorMessage = ref('')

    const login = async (username, password) => {
        isLoading.value = true
        errorMessage.value = ''

        try {
            await loginService(username, password)
            return true
        } catch (error) {
            if (error.response) {
                const data = error.response.data

                if (error.response.status === 422 && data.errors) {
                    const firstField = Object.keys(data.errors)[0]
                    errorMessage.value = data.errors[firstField][0]
                } else if (data.message) {
                    errorMessage.value = data.message
                } else {
                    errorMessage.value = 'Error en el inicio de sesión'
                }
            } else {
                errorMessage.value = 'Error en la conexión con el servidor'
            }

            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        login,
        isLoading,
        errorMessage,
    }
}
