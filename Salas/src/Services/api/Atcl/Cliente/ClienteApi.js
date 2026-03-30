import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getPropiedadesVenta = (codigo = '', calle = '') => {
  const token = localStorage.getItem('token')

  return axios.get(`${API_URL}/v1/propiedades/buscar-venta`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      ...(codigo && { codigo }),
      ...(calle && { calle })
    }
  })
}

export const guardarCliente = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/clientes/guardar`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getClientePorTelefono = (telefono) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/cliente/${telefono}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const verificarPermisoSeleccionarAsesor = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/verificaPermisoAsesor/seleccionarAsesor`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getAsesores = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/asesores`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
