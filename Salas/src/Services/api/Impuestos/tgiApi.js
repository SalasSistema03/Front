import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL


export const actualizaPadron = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/actualizar_padron/${data.impuesto}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getPadron = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/padron_impuesto/${data.impuesto}`, {
    params: {
      impuesto: data.impuesto,
      filtros: data.filtros,
      search_all: data.search_all,
      search_folio: data.search_folio
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const actualizarRegistro = (data) =>{
   const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/actualizar_registro_impuesto`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const padronCarga = (data) =>{
   const token = localStorage.getItem('token')
   return axios.get(`${API_URL}/v1/padron_carga`, {
    params: {
        ...data // Esto esparce todas las propiedades del formulario
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const cargaManual = (data) =>{
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/carga_manual`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const cargaNuevoManual = (data) =>{
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/carga_nuevo_manual`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const cargaNuevoImpuesto = (data) =>{
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/nuevo_impuesto`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const exportarFaltantes = (data) =>{
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/exportar_faltantes`, {
    params: {
      ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  })
}

export const sumarMontos = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/sumar_montos`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const mostrarBroches = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/mostrar_broches`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const guardarBroches = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/guardar_num_broches`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const guardarBrochesSalas = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/guardar_num_broche_salas`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const exportarBroches = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/exportar_broches`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const exportarBrochesSalas = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/exportar_broches_salas`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const ModificarBajado = (data) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/modificar_bajado`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const ModificarEstado = (data) =>{
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/modificar_estado`, {data}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const EliminarImpuesto = (data) =>{
  const token = localStorage.getItem('token')
  return axios.delete(`${API_URL}/v1/eliminar_impuesto`, {
    params: {
        ...data
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const GenerarPdfBroches = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/broches/pdf`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob'
  })
}

/* export const GenerarPdfBrochesSalas = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/broches/salas/pdf`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob'
  })
} */

