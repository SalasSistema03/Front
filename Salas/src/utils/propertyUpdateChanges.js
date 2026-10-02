const emptyValuesEqual = (left, right) =>
  (left === null || left === '') && (right === null || right === '')

const numericValuesEqual = (left, right) => {
  if (typeof left === typeof right || !['number', 'string'].includes(typeof left) ||
    !['number', 'string'].includes(typeof right) || left === '' || right === '') {
    return false
  }

  const leftNumber = Number(left)
  const rightNumber = Number(right)
  return Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber === rightNumber
}

export const propertyUpdateValuesEqual = (left, right) => {
  if (Object.is(left, right) || emptyValuesEqual(left, right) || numericValuesEqual(left, right)) {
    return true
  }

  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object') {
    return false
  }

  if (Array.isArray(left) !== Array.isArray(right)) return false

  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return leftKeys.length === rightKeys.length &&
    leftKeys.every(key => Object.hasOwn(right, key) && propertyUpdateValuesEqual(left[key], right[key]))
}

export const changedPropertyUpdateFields = (original, current) => {
  const changed = {}

  Object.keys(current || {}).forEach(key => {
    if (current[key] !== undefined && !propertyUpdateValuesEqual(original?.[key], current[key])) {
      changed[key] = current[key]
    }
  })

  return changed
}

const definedValue = value => value ?? ''

export const propertyUpdateFormState = property => {
  const precio = property?.precio_actual || {}
  const tasacion = (property?.tasaciones || []).reduce((latest, item) =>
    !latest || item.id > latest.id ? item : latest, null)
  const historialVenta = property?.historial_estados_venta
  const historialAlquiler = property?.historial_estados_alquiler
  const folio = empresaId => property?.folios?.find(item => Number(item.empresa_id) === empresaId)?.folio
  const montoVentaDolar = precio.moneda_venta_dolar
  const montoVentaPesos = precio.moneda_venta_pesos
  const montoAlquilerPesos = precio.moneda_alquiler_pesos
  const montoAlquilerDolar = precio.moneda_alquiler_dolar

  return {
    main: {
      calle_id: property?.calle?.id ?? property?.id_calle ?? '',
      numero_calle: definedValue(property?.numero_calle),
      piso: definedValue(property?.piso),
      departamento: definedValue(property?.departamento),
      ph: definedValue(property?.ph),
      id_inmueble: definedValue(property?.id_inmueble),
      id_zona: definedValue(property?.id_zona),
      id_provincia: definedValue(property?.id_provincia),
      id_localidad: definedValue(property?.id_localidad),
      latitud: property?.latitud ?? null,
      longitud: property?.longitud ?? null,
      llave: definedValue(property?.llave),
      comentario_llave: definedValue(property?.comentario_llave),
      cartel: definedValue(property?.cartel),
      comentario_cartel: definedValue(property?.comentario_cartel)
    },
    comodidades: {
      estado_general: definedValue(property?.id_estado_general),
      dormitorios: definedValue(property?.cantidad_dormitorios),
      banios: definedValue(property?.banios),
      lotes: definedValue(property?.mLote),
      lote_cubierto: definedValue(property?.mCubiertos),
      cochera: definedValue(property?.cochera),
      numero_cochera: definedValue(property?.numero_cochera),
      asfalto: definedValue(property?.asfalto),
      gas: definedValue(property?.gas),
      cloaca: definedValue(property?.cloaca),
      agua: definedValue(property?.agua)
    },
    descripcion: {
      texto: definedValue(property?.descipcion_propiedad)
    },
    venta: {
      asesor_resultado: definedValue(property?.usuario_asesor?.id),
      captador_interno_v: definedValue(property?.usuario_captador_int_v?.id),
      cod_venta: definedValue(property?.cod_venta),
      estado_venta: definedValue(property?.id_estado_venta),
      moneda_venta: montoVentaDolar !== null && montoVentaDolar !== undefined && montoVentaDolar !== ''
        ? '2'
        : '1',
      monto_venta: definedValue(
        montoVentaDolar !== null && montoVentaDolar !== undefined && montoVentaDolar !== ''
          ? montoVentaDolar
          : montoVentaPesos
      ),
      fecha_tasacion_venta: definedValue(tasacion?.fecha_tasacion),
      tasacion_venta: definedValue(tasacion?.tasacion_dolar_venta ?? tasacion?.tasacion_pesos_venta),
      exclusividad_venta: definedValue(property?.exclusividad_venta),
      comparte_venta: definedValue(property?.comparte_venta),
      condicionado_venta: definedValue(property?.condicionado_venta),
      venta_fecha_alta: definedValue(property?.venta_fecha_alta),
      fecha_autorizacion_venta: definedValue(property?.fecha_autorizacion_venta),
      comentario_autorizacion: definedValue(property?.comentario_autorizacion),
      zona_prop: definedValue(property?.zona_prop),
      flyer_v: definedValue(property?.flyer_v),
      reel_v: definedValue(property?.reel_v),
      web_v: definedValue(property?.web_v),
      descripcion_estado_venta: definedValue(historialVenta?.comentario),
      fecha_baja_temporal_venta: definedValue(historialVenta?.reactiva_fecha),
      autorizacion_venta: definedValue(property?.autorizacion_venta)
    },
    alquiler: {
      cod_alquiler: definedValue(property?.cod_alquiler),
      FCentral: definedValue(folio(1)),
      FCandioti: definedValue(folio(2)),
      FTribunales: definedValue(folio(3)),
      estado_alquiler: definedValue(property?.id_estado_alquiler),
      moneda_alquiler: montoAlquilerPesos !== null && montoAlquilerPesos !== undefined && montoAlquilerPesos !== ''
        ? '1'
        : '2',
      monto_alquiler: definedValue(
        montoAlquilerPesos !== null && montoAlquilerPesos !== undefined && montoAlquilerPesos !== ''
          ? montoAlquilerPesos
          : montoAlquilerDolar
      ),
      autorizacion_alquiler: definedValue(property?.autorizacion_alquiler),
      fecha_autorizacion_alquiler: definedValue(property?.fecha_autorizacion_alquiler),
      exclusividad_alquiler: definedValue(property?.exclusividad_alquiler),
      clausula_de_venta: definedValue(property?.clausula_de_venta),
      tiempo_clausula: definedValue(property?.tiempo_clausula),
      alquiler_fecha_alta: definedValue(property?.alquiler_fecha_alta),
      mascota: definedValue(property?.mascota),
      descripcion_estado_alquiler: definedValue(historialAlquiler?.comentario_alquiler),
      fecha_baja_temporal_alquiler: definedValue(historialAlquiler?.reactiva_fecha_alquiler?.split(' ')[0]),
      flyer_a: definedValue(property?.flyer_a),
      reel_a: definedValue(property?.reel_a),
      web_a: definedValue(property?.web_a),
      captador_interno_a: definedValue(property?.captador_int_a),
      fecha_ofrecimiento: definedValue(property?.fecha_ofrecimiento)
    },
    condicion: {
      condicion: definedValue(property?.condicion)
    }
  }
}
