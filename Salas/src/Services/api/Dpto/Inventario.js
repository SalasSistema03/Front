import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getHistorialInventario = (form = {}) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getHistorialInventario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: form,
  })
}

export const getUsuariosDpto = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getUsuariosDpto`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const getEstadoDpto = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getEstadoDpto`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

export const ActualizarInventario = (form = {}) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/ActualizarInventario`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


