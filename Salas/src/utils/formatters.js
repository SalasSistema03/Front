/**
 * Formatea un valor numérico al estándar de moneda/decimal argentino (es-AR).
 * 
 * @param {number|string} valor - El número a formatear.
 * @param {boolean} incluirSimbolo - Si es true, antepone '$ ' estilo moneda. Por defecto false.
 * @returns {string} Valor formateado (ej: "12.962.211,22" o "$ 12.962.211,22").
 */
export const formatearMoneda = (valor, incluirSimbolo = false) => {
  if (valor === undefined || valor === null || valor === '') {
    return incluirSimbolo ? '$ 0,00' : '0,00'
  }
  const numero = parseFloat(valor)
  if (isNaN(numero)) {
    return incluirSimbolo ? '$ 0,00' : '0,00'
  }

  return new Intl.NumberFormat('es-AR', {
    style: incluirSimbolo ? 'currency' : 'decimal',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero)
}
