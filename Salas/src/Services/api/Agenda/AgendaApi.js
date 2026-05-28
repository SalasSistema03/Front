import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const getSectores = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/sectores`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getUsuarioSector = (id_sector, fecha) => {
  const token = localStorage.getItem('token')

  return axios.get(`${API_URL}/v1/usuarios-sector/${id_sector}/${fecha}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getClientesTelefono = (telefono) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/buscarCliente/${telefono}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const buscarPropiedadPorCodigoCalle = (codigo_calle, sector) => {
  const token = localStorage.getItem('token')

  return axios.get(`${API_URL}/v1/propiedad/buscar-por-codigo-calle/${codigo_calle}/${sector}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const cargarNota = (datosCompletos) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/cargar-nota`, datosCompletos, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const borrarNota = (id, motivo) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/borrar-nota/${id}/${motivo}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const UsuariosEnAgenda = (sector_id) => {
  const token = localStorage.getItem('token')

  return axios.get(`${API_URL}/v1/usuariosConAgenda/${sector_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export const listarAgenda = (datos) =>{
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/listado-agenda`, datos, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
