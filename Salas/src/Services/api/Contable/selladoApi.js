import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const calcularSelladoService = (data) => {
    const token = localStorage.getItem('token')
    // Cambiamos a POST para que acepte el Body (data)
    return axios.post(`${API_URL}/v1/auth/sellado/calcular`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}