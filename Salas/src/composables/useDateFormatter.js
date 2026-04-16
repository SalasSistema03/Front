export const useDateFormatter = () => {
  const formatDate = (fechaCompleta) => {
    if (!fechaCompleta) return '';
    const [fecha] = fechaCompleta.split(' '); // Toma solo la parte de la fecha
    const [anio, mes, dia] = fecha.split('-'); // Divide año-mes-día
    return `${dia}/${mes}/${anio}`; // Devuelve día/mes/año
  }

  return {
    formatDate
  }
}
