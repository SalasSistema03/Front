import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const TasacionesActivas = async () => {
  const token = localStorage.getItem('token')
  return await axios.get(`${API_URL}/v1/tasaciones/activas`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
