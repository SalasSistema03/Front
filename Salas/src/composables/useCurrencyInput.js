export const useCurrencyInput = ({ locale = 'es-AR', maximumFractionDigits = 0 } = {}) => {
  const formatearMonto = (valor) => {
    if (valor === null || valor === undefined || valor === '') return ''
    const numero = Number(valor)
    return Number.isFinite(numero)
      ? new Intl.NumberFormat(locale, { maximumFractionDigits }).format(numero)
      : ''
  }

  const actualizarMonto = (event, setValor) => {
    const input = event.target
    const posicionCursor = input.selectionStart ?? input.value.length
    const digitosAntesCursor = input.value.slice(0, posicionCursor).replace(/\D/g, '').length
    const digitos = input.value.replace(/\D/g, '')
    const numero = digitos ? Number(digitos) : null

    setValor(numero)

    const valorFormateado = formatearMonto(numero)
    input.value = valorFormateado

    let nuevaPosicionCursor = 0
    let digitosContados = 0
    while (nuevaPosicionCursor < valorFormateado.length && digitosContados < digitosAntesCursor) {
      if (/\d/.test(valorFormateado[nuevaPosicionCursor])) digitosContados++
      nuevaPosicionCursor++
    }
    input.setSelectionRange(nuevaPosicionCursor, nuevaPosicionCursor)

    return numero
  }

  return { formatearMonto, actualizarMonto }
}
