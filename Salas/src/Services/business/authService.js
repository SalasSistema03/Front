import { loginRequest } from '../api/authApi'

export const loginService = async (username, password) => {
    const response = await loginRequest({ username, password })

    const { access_token, token_type } = response.data

    // Persistencia de sesión
    localStorage.setItem('token', access_token)
    localStorage.setItem('token_type', token_type)

    return response.data
}

export const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('token_type')
}
