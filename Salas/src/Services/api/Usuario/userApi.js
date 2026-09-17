import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getUser = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const registerUser = (user) => {

  return axios.post(`${API_URL}/v1/auth/register`, user)

}

export const getPermisos = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/permisos-navegacion`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getNombresDeUsuarios = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/nombres-de-usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getDatosGenerales = (id) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/datos-generales/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const updateUser = (user, userId) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/auth/update-datos-generales/${userId}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


// Reemplaza tu función DescargarPdfPermisosService por esta:
export const DescargarPdfPermisosService = (usuario_id) => {
  const token = localStorage.getItem('token');
  
  // Igual que en ClienteApi.js, apuntamos a /v1/usuarios/...
  return axios.get(`${API_URL}/v1/usuarios/${usuario_id}/permisos/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob' // Mantenemos el blob para descargar el archivo
  });
}