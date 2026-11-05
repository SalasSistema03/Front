import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getHistorialInventario = (form = {}) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getHistorialInventario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: form,
  })
}

export const getUsuariosDpto = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getUsuariosDpto`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const getEstadoDpto = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getEstadoDpto`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

export const ActualizarInventario = (form = {}) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/ActualizarInventario`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


// Fotos de inventario (una carpeta por proceso de reserva)
export const getFotosInventario = (id_proceso_propiedad) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/fotosInventario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { id_proceso_propiedad },
  })
}

// formData: id_proceso_propiedad, fotos[] y comentarios[] (mismo orden)
export const subirFotosInventario = (formData) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/fotosInventario`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const actualizarFotoInventario = (id, notes) => {
  const token = localStorage.getItem('token')
  return axios.patch(`${API_URL}/v1/fotosInventario/${id}`, { notes }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const eliminarFotoInventario = (id) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${API_URL}/v1/fotosInventario/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Documentos Word de inventario (uno por proceso; reemplaza al anterior al subir)
export const getDocumentosInventario = (id_proceso_propiedad) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/documentosInventario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { id_proceso_propiedad },
  })
}

// formData: id_proceso_propiedad y documento (un archivo .doc o .docx)
export const subirDocumentoInventario = (formData) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/documentosInventario`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const subirVideoInventario = (formData) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/dpto/inventario/videos`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const eliminarDocumentoInventario = (id) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${API_URL}/v1/documentosInventario/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getComentariosInventario = (form = {}) => {
   const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/getComentariosInventario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: form,
  })
}