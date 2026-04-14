import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getNotificaciones = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/api/notificaciones/traer-notificaciones`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const notificacionLeida = (id) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/api/notificaciones/marcar-como-leida/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
