import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

// 1. Obtener padrón base
export const getPadronUnidadesService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/expensas/unidades`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// 2. Obtener unidades con filtros de búsqueda y opciones
export const filtroUnidadesCompletoService = (params) => {
  const token = localStorage.getItem('token')
  // Usamos el objeto "params" para que Axios arme el Query String automáticamente (?search=...&filtros[]=...)
  return axios.get(`${API_URL}/v1/expensas/filtro-unidades-completo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: params 
  })
}

// 3. Completar carga / Guardar o editar unidades desde el modal (Body: data)
export const completarCargaUnidadesService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/expensas/completar-carga`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// 4. Actualizar Padrón / Sincronizar desde base externa
export const actualizarPadronUnidadesService = () => {
  const token = localStorage.getItem('token')
  // Aunque sea un POST, enviamos un objeto vacío {} como body si no requiere datos extra
  return axios.post(`${API_URL}/v1/expensas/actualizar-padron`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// 5. Eliminar unidad (Pasando el ID dinámico en la URL)
export const eliminarUnidadService = (id) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${API_URL}/v1/expensas/eliminar-unidad/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


// 1. Obtener lista de edificios (con buscador) y catálogos (calles, admins)
export const getEdificiosService = (params) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/expensas/obtener-edificio`, {
    headers: { Authorization: `Bearer ${token}` },
    params: params
  })
}

// 2. Crear un nuevo edificio
export const crearEdificioService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/expensas/crear-edificio`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// 3. Actualizar un edificio existente
export const actualizarEdificioService = (id, data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/expensas/modificar-edificio/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}


// 1. Obtener lista de administradores (con buscador)
export const getAdministradoresService = (params) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/expensas/administradores`, {
    headers: { Authorization: `Bearer ${token}` },
    params: params
  })
}

// 2. Sincronizar/Actualizar el padrón masivo
export const actualizarPadronAdministradoresService = () => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/expensas/sincronizar-administradores`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  })
}