import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getInmueble = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/tipos-inmueble`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export const getZonas = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/zonas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getProvincias = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/provincias`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getEstadoGeneral = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/estado-general`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getEstadoVenta = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/estado-venta`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getEstadoAlquiler = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/estado-alquiler`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getCalles = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/calles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getAsesor = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/asesor`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getCaptadorInterno = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/captador-interno`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const guardarPropiedad = (id, data) => {

  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/propiedad/guardar/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data' // Para enviar archivos
    },
  })
}

export const buscaPersona = (params) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/padron/buscar`, {
    params: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const cargarPadron = (data) => {
  console.log(data)
  const token = localStorage.getItem('token')

  return axios.post(`${API_URL}/v1/padron/cargar`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  })
}

export const buscarPropiedad = (params) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/propiedad/buscar`, {
    params: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

}



export const muestraPropiedad = (params) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/propiedad/muestra`, {
    params: params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const actualizaPropiedad = (data) => {

  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/auth/propiedad/actualizar`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  })
}

export const updatePropiedad = (id, data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/auth/propiedad/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


// En tu servicio
export const descargarFotos = (id) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/propiedad/descargar-fotos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob' // ¡Esto es lo que falta!
  })
}

export const guardarNovedad = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/auth/propiedad/guardar-novedad`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const generarPdfPlantillaPropiedad = (id, tipoBTN) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/auth/propiedades/pdf/pdfPlantillaPropiedad/${id}/${tipoBTN}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob' // Necesario para recibir el PDF como archivo binario
  })
}
