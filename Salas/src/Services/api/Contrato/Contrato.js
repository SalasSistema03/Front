import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getHistorialContrato = (form = {}) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getHistorialContrato`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: form,
  })
}

export const getEstadosContrato = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getEstadoProcesoContrato`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const verificarPermisoUsuario = (botonNombre) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/verificaPermisoUsuario/${botonNombre}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const ActualizarEstadoContrato = (form = {}) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/ActualizarEstadoContrato`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const observacionescontrato = (id_proceso) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getObservacionesContratoNuevo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      id_proceso,
    },
  })
}
