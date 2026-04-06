import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getPropiedadesVenta = (codigo = '', calle = '', dorm = '', baños = '', cochera = '') => {
  const token = localStorage.getItem('token')

  return axios.get(`${API_URL}/v1/propiedades/buscar-venta`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      ...(codigo && { codigo }),
      ...(calle && { calle }),
      ...(dorm && { dorm }),
      ...(baños && { baños }),
      ...(cochera && { cochera })
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

export const modificarCriterio = (data) =>{
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/clientes/modificar-criterio`, data,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const modificarCliente = (data) =>{
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/clientes/modificar-datos-personales`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const propiedadOfrecida = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/historialCodOfrecimiento`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const enviarMensaje = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/asesores/enviar-mensaje`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const devolucionMensaje = (data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/clientes/devolver-mensaje`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const obtenerHistorialCod = (id) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/historialCodOfrecimiento/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
