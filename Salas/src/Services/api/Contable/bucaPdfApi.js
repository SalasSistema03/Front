import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const buscarPdf = (data) => {
  const token = localStorage.getItem('token')
  // Cambiamos a POST para que acepte el Body (data)
  return axios.post(`${API_URL}/v1/contable/comprobantes/verPDF`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob' // Importante: especificar que esperamos un blob
  })
}

