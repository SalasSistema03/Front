import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL


export const getRepactadoMes = (mes, anio, empresa) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getRepactadoDelMes`, {
    params: { mes, anio, empresa },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getRepactadoFiltrado = (folio, mes, anio, empresa) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getRepactadoFiltrado`, {
    params: { folio, mes, anio, empresa },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getEstadosRepactado = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getEstadosRepactado`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateRepactado = (payload) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/updateRepactado`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const obtenerConversacionRepactado = (id) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/repactado/${id}/conversacion`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const guardarMensajeConversacionRepactado = (id, data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/repactado/${id}/conversacion`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

