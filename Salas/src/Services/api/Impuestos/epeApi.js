import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const BuscarClienteEpe = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/epe/buscar`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const CargarEpeView = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/epe/cargar`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const EditarEpeView = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/epe/editar`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

