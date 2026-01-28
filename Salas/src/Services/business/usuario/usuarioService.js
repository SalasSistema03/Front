// 🧠 TODA la lógica de negocio que está en tu <script>

// Funciones de manejo de sectores
export const handleSectorChange = (sector, vista, menu, isChecked, permisosArray) => {
  const menuId = menu.id
  const vistaId = vista.id
  const sectorId = sector.id

  if (isChecked) {
    const existingIndex = permisosArray.findIndex(p =>
      p[0] === menuId && p[1] === vistaId && p[3] === sectorId
    )
    if (existingIndex === -1) {
      permisosArray.push([menuId, vistaId, null, sectorId])
    }
  } else {
    const index = permisosArray.findIndex(p =>
      p[0] === menuId && p[1] === vistaId && p[3] === sectorId
    )
    if (index > -1) {
      permisosArray.splice(index, 1)
    }
  }
}

export const isSectorSelected = (sector, vista, menu, permisosArray) => {
  const menuId = menu.id
  const vistaId = vista.id
  const sectorId = sector.id

  return permisosArray.some(p =>
    p[0] === menuId && p[1] === vistaId && p[3] === sectorId
  )
}

// Funciones de manejo de vistas
export const handleVistaChange = (vista, menu, isChecked, permisosArray) => {
  const menuId = menu.id
  const vistaId = vista.id

  if (isChecked) {
    const existingIndex = permisosArray.findIndex(p =>
      p[0] === menuId && p[1] === vistaId && p[1] !== null
    )
    if (existingIndex === -1) {
      permisosArray.push([menuId, vistaId, null])
    }
  } else {
    // Remover vista y todos sus botones/sectores
    for (let i = permisosArray.length - 1; i >= 0; i--) {
      if (permisosArray[i][0] === menuId && permisosArray[i][1] === vistaId) {
        permisosArray.splice(i, 1)
      }
    }
  }
}

export const isVistaSelected = (vista, menu, permisosArray) => {
  const menuId = menu.id
  const vistaId = vista.id

  return permisosArray.some(p =>
    p[0] === menuId && p[1] === vistaId && p[1] !== null && (p[3] === null || p[3] === undefined)
  )
}

// Funciones de manejo de botones
export const handleBotonChange = (vista, menu, boton, isChecked, permisosArray) => {
  const menuId = menu.id
  const vistaId = vista.id
  const botonId = boton.id

  if (isChecked) {
    const vistaExists = permisosArray.some(p =>
      p[0] === menuId && p[1] === vistaId && p[1] !== null
    )

    if (!vistaExists) {
      permisosArray.push([menuId, vistaId, null])
    }

    const existingIndex = permisosArray.findIndex(p =>
      p[0] === menuId && p[1] === vistaId && p[2] === botonId && p[2] !== null
    )

    if (existingIndex === -1) {
      permisosArray.push([menuId, vistaId, botonId])
    }
  } else {
    const index = permisosArray.findIndex(p =>
      p[0] === menuId && p[1] === vistaId && p[2] === botonId
    )
    if (index > -1) {
      permisosArray.splice(index, 1)
    }
  }
}

export const isBotonSelected = (vista, menu, boton, permisosArray) => {
  const menuId = menu.id
  const vistaId = vista.id
  const botonId = boton.id

  return permisosArray.some(p =>
    p[0] === menuId && p[1] === vistaId && p[2] === botonId && p[2] !== null
  )
}

// Lógica de preparación de datos
export const prepareUserDataForSubmit = (formData) => {
  return {
    ...formData,
    permisos_agrupados: formData.permisos
  }
}

// Lógica de limpieza del formulario
export const resetFormData = (formObject) => {
  Object.keys(formObject).forEach(key => {
    if (Array.isArray(formObject[key])) {
      formObject[key] = []
    } else {
      formObject[key] = ''
    }
  })
}