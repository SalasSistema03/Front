import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getSector = () => {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/sectores`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getTurnosPendientes = () =>{
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/turnos/pendientes`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getTurnosLlamados = () =>{
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/turnos/llamados`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const getTurnosCompletados = () =>{
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/v1/auth/turnos/completados`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const postTurnoNuevo = (turnoData) => {
    const token = localStorage.getItem('token')
    return axios.post(`${API_URL}/v1/auth/turnos/cargar`, turnoData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const putFinalizarTurno = (id, idUsuario) => {
    
    const token = localStorage.getItem('token')
    return axios.put(`${API_URL}/v1/auth/turnos/finalizar/${id}`, {
        id_usuario: idUsuario
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export const putLlamarTurno = (id, idUsuario) => {
    const token = localStorage.getItem('token')
   
    return axios.put(`${API_URL}/v1/auth/turnos/llamar/${id}`, {
        id_usuario: idUsuario
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

