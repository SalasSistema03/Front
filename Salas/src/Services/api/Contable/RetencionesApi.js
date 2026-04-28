import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const personaPorCuitService = (cuil) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/padronRetencion/${cuil}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const getBasePorcentualService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/basePorcentual`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const verificaComprobanteService = (cuit, fecha) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/verificar-comprobante/`, {
    params: {
      cuit: cuit,
      fecha: fecha,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const guardarRetencionService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/retenciones/guardarComprobante`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}