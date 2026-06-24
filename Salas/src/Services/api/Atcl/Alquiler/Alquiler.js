import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const verificarPermisos = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/permisos/verificarAccesoBotones_Elementos`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const asesoresAlquiler = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/asesoresAlquiler`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


export const buscarPropiedadPorCodigoAlquiler = (cod_alquiler) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/propiedad/buscar-por-codigo/${cod_alquiler}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const subirReservas = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/subir-reservas`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const obtenerReservas = (estado = '') => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/obtener-reservas`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      estado: estado
    }
  })
}

export const guardarEstado = (data) => {

  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/guardar-estado`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getHistorialReservaAlquiler = (id) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getHistorialReservaAlquiler`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      id: id
    }
  })
}

export const getIdentificadas = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getReservaIdentificada`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      data: data
    }
  })
}

export const guardarReservaIdentificada = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/guardarReservaIdentificada`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


export const buscarComprobanteReserva = (data) => {
  const token = localStorage.getItem('token')
  // Cambiamos a POST para que acepte el Body (data)
  return axios.post(`${API_URL}/v1/alquiler/obtener-comprobante`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob' // Importante: especificar que esperamos un blob
  })
}

