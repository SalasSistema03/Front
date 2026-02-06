import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const loginRequest = (credentials) => {
    //alert('aca')
    return axios.post(`${API_URL}/v1/auth/login`, credentials)
}

export const logoutRequest = (token) => {
    return axios.post(`${API_URL}/v1/auth/logout`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
