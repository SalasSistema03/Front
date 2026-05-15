import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const PropietariosActivos = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/propietarios/activos`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
