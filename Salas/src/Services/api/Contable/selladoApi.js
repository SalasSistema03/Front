import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const calcularSelladoService = (data) => {
    const token = localStorage.getItem('token')
    // Cambiamos a POST para que acepte el Body (data)
    return axios.post(`${API_URL}/v1/sellado/calcular`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const guardarResultadoService = (data) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/v1/sellado/guardar`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getRegistrosService = () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/sellado`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getDatosCalculosService = () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/sellado/datos-calculo`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
export const guardarValoresRegistrales = (data) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/v1/sellado/guardar-valor-registro-extra`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const guardarValoresAdministrativo = (data) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/v1/sellado/guardar-valor-gasto-administrativo`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const guardarValoresHoja = (data) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/v1/sellado/guardar-valor-hoja`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const guardarValoresSellado = (data) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/v1/sellado/guardar-valor-sellado`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const eliminarRegistroService = () => {
    const token = localStorage.getItem('token')
    return axios.delete(`${API_URL}/v1/sellado/eliminar`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}