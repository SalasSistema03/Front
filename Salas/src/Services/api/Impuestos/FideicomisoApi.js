import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

// ==========================================
// UNIDADES
// ==========================================

export const getUnidadesService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/fideicomiso/unidades`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const getUnidadPorIdService = (id) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/fideicomiso/unidades/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const guardarUnidadService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/fideicomiso/unidades`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const modificarUnidadService = (id, data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/fideicomiso/unidades/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const eliminarUnidadService = (id) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${API_URL}/v1/fideicomiso/unidades/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

// ==========================================
// REGISTROS GENERALES (Valores de impuestos por período)
// ==========================================

export const getRegistrosGeneralesService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/fideicomiso/datos-generales`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const guardarRegistroGeneralService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/fideicomiso/datos-generales`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const modificarRegistroGeneralService = (id, data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/fideicomiso/datos-generales/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const eliminarRegistroGeneralService = (id) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${API_URL}/v1/fideicomiso/datos-generales/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

// ==========================================
// REGISTROS MENSUALES (Pagos aplicados a cada unidad)
// ==========================================

export const getRegistrosMensualesService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/fideicomiso/registros-mensuales`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const getRegistrosPorUnidadService = (idUnidad) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/fideicomiso/registros-mensuales/unidad/${idUnidad}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const guardarRegistroMensualService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/fideicomiso/registros-mensuales`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const modificarRegistroMensualService = (id, data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/fideicomiso/registros-mensuales/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const eliminarRegistroMensualService = (id) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${API_URL}/v1/fideicomiso/registros-mensuales/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const cargaMasivaImpuestosService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/fideicomiso/carga-masiva`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const GenerarPdfComprobantesService = (data) => {
  const token = localStorage.getItem('token')
  console.log('GenerarPdfComprobantesService data:', data)
  return axios.post(`${API_URL}/v1/fideicomiso/comprobantes-pdf`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob'
  })
}