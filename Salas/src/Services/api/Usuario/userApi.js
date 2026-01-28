import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getUser = (token) => {
    return axios.get(`${API_URL}/v1/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const registerUser = (user) =>{
    console.log(user)
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

