import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getInmueble= () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/tipos-inmueble`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
export const getZonas= () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/zonas`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getProvincias= () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/provincias`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getEstadoGeneral= () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/estado-general`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getEstadoVenta= () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/estado-venta`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getEstadoAlquiler = () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/estado-alquiler`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getCalles = () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/calles`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getAsesor = () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/asesor`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getCaptadorInterno = () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/captador-interno`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
