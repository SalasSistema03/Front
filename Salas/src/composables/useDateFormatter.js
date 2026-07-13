export const useDateFormatter = () => {
  const formatDate = (fechaCompleta) => {
    if (!fechaCompleta) return ''
    const [fecha] = fechaCompleta.split(' ') // Toma solo la parte de la fecha
    const [anio, mes, dia] = fecha.split('-') // Divide año-mes-día
    return `${dia}/${mes}/${anio}` // Devuelve día/mes/año
  }

  const formatDateForInput = (fechaCompleta) => {
    if (!fechaCompleta) return ''

    const texto = String(fechaCompleta).trim()
    if (!texto) return ''

    const [fecha] = texto.split(' ')
    if (!fecha) return ''

    const partes = fecha.split(/[-/]/)
    if (partes.length !== 3) return ''

    const [primero, segundo, tercero] = partes

    if (primero.length === 4) {
      return `${primero}-${segundo.padStart(2, '0')}-${tercero.padStart(2, '0')}`
    }

    if (tercero.length === 4) {
      return `${tercero}-${segundo.padStart(2, '0')}-${primero.padStart(2, '0')}`
    }

    return ''
  }

  return {
    formatDate,
    formatDateForInput,
  }
}
