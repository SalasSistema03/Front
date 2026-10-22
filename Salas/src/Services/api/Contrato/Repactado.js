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

