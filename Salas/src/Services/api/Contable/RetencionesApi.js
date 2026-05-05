import axios from 'axios'

const API_URL = import.meta.env.VITE_API_AUTH_URL

export const personaPorCuitService = (cuil) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/padronRetencion/${cuil}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const retencionPorCUITService = (cuit) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/retencionPorCUIT/${cuit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const getBasePorcentualService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/basePorcentual`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const obtenerTablaRetencionesService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/tablaRetenciones`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const obtenerProvinciasService = () => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/provincias`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const verificaComprobanteService = (cuit, fecha) => {
  const token = localStorage.getItem('token')
  return axios.get(`${API_URL}/v1/retenciones/verificar-comprobante/`, {
    params: {
      cuit: cuit,
      fecha: fecha,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const guardarRetencionService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/retenciones/guardarComprobante`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const modificarBasePorcentualService = (data) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_URL}/v1/retenciones/modificarBasePorcentual`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}


export const guardarPersonaService = (data) => {
  const token = localStorage.getItem('token')
  return axios.post(`${API_URL}/v1/retenciones/guardarPersonaRetencion`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const modificarRetencionService = (id, data) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/v1/retenciones/modificarRegistro/${id}`, data, {
    headers: {  
      Authorization: `Bearer ${token}`,
      Accept: 'application/json' // Recomendado para que Laravel responda errores en JSON
    },
  });
};



export const obtenerSumaQuincenaService = (anio, mes) => {
    const token = localStorage.getItem('token');
    
    // Agregué un console.log para que veas en la consola si sigue siendo undefined
    console.log("URL de la API:", API_URL); 

    return axios.get(`${API_URL}/v1/retenciones/suma-quincena`, {
        params: { anio, mes },
        headers: { 
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        }
    });
};


export const exportarRetencionesTxt = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/v1/retenciones/exportar-retenciones`, {
        headers: { 
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        },
        responseType: 'blob' // Obligatorio para que Axios no corrompa el archivo
    });
};