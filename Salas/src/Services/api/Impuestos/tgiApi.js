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
