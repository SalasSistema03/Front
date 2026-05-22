import { ref, computed, onMounted } from 'vue'
import { buscarPropiedad } from '../../Services/api/Atcl/AtclApi'
import { useCalleAutocomplete } from './useCalleAutocomplete'
import { useInmuebles } from './useInmuebles'
import { useZona } from './useZona'

export function usePropiedadBusqueda() {
  const {
    callesFiltradas,
    mostrarSugerencias,
    calleSeleccionada,
    calleId,
    cargarCalles,
    filtrarCalles,
    seleccionarCalle,
    ocultarSugerencias,
    mostrarLista
  } = useCalleAutocomplete()

  const { inmuebles, cargarInmuebles } = useInmuebles()
  const { zonas, cargarZonas } = useZona()

  const zonasSeleccionadas = ref([])
  const busquedaZonas = ref('')
  const inmueblesSeleccionados = ref([])
  const busquedaInmuebles = ref('')
  const mostrarInmuebles = ref(false)
  const mostrarZonas = ref(false)
  const cerrarInmueblesTimeoutId = ref(null)
  const cerrarZonasTimeoutId = ref(null)

  const busqueda = ref('')
  const codigo = ref('')
  const cochera = ref('')
  const mascotas = ref('')
  const habitaciones = ref('')
  const desde = ref('')
  const hasta = ref('')
  const orden = ref('')
  const ampliar = ref('')
  const propiedades = ref([])

  const zonasFiltradas = computed(() => {
    if (!busquedaZonas.value) return zonas.value
    return zonas.value.filter(zona =>
      zona.name.toLowerCase().includes(busquedaZonas.value.toLowerCase())
    )
  })

  const inmuebleFiltrados = computed(() => {
    if (!busquedaInmuebles.value) return inmuebles.value
    return inmuebles.value.filter(inmueble =>
      inmueble.inmueble.toLowerCase().includes(busquedaInmuebles.value.toLowerCase())
    )
  })

  const textoResumenZonas = computed(() => {
    const ids = zonasSeleccionadas.value
    const n = ids.length
    if (n === 0) return ''
    if (n === 1) {
      const id = ids[0]
      const z = zonas.value.find((x) => x.id == id)
      return z?.name ?? ''
    }
    return `${n} zonas seleccionadas`
  })

  const textoResumenInmuebles = computed(() => {
    const ids = inmueblesSeleccionados.value
    const n = ids.length
    if (n === 0) return ''
    if (n === 1) {
      const id = ids[0]
      const item = inmuebles.value.find((x) => x.id == id)
      return item?.inmueble ?? ''
    }
    return `${n} tipos de inmueble seleccionados`
  })

  const valorInputZonas = computed({
    get() {
      return mostrarZonas.value ? busquedaZonas.value : textoResumenZonas.value
    },
    set(val) {
      if (mostrarZonas.value) busquedaZonas.value = val
    }
  })

  const valorInputInmuebles = computed({
    get() {
      return mostrarInmuebles.value ? busquedaInmuebles.value : textoResumenInmuebles.value
    },
    set(val) {
      if (mostrarInmuebles.value) busquedaInmuebles.value = val
    }
  })

  const abrirInmuebles = () => {
    if (cerrarInmueblesTimeoutId.value) {
      clearTimeout(cerrarInmueblesTimeoutId.value)
      cerrarInmueblesTimeoutId.value = null
    }
    busquedaInmuebles.value = ''
    mostrarInmuebles.value = true
  }

  const cerrarInmuebles = () => {
    if (cerrarInmueblesTimeoutId.value) clearTimeout(cerrarInmueblesTimeoutId.value)
    cerrarInmueblesTimeoutId.value = setTimeout(() => {
      mostrarInmuebles.value = false
    }, 250)
  }

  const abrirZonas = () => {
    if (cerrarZonasTimeoutId.value) {
      clearTimeout(cerrarZonasTimeoutId.value)
      cerrarZonasTimeoutId.value = null
    }
    busquedaZonas.value = ''
    mostrarZonas.value = true
  }

  const cerrarZonas = () => {
    if (cerrarZonasTimeoutId.value) clearTimeout(cerrarZonasTimeoutId.value)
    cerrarZonasTimeoutId.value = setTimeout(() => {
      mostrarZonas.value = false
    }, 250)
  }

  const filtrar = async () => {
    const filtros = {
      busqueda: busqueda.value || null,
      codigo: codigo.value || null,
      calle_id: calleId.value || null,
      inmuebles: inmueblesSeleccionados.value.length ? inmueblesSeleccionados.value : null,
      zonas: zonasSeleccionadas.value.length ? zonasSeleccionadas.value : null,
      cochera: cochera.value || null,
      mascotas: mascotas.value || null,
      habitaciones: habitaciones.value !== null && habitaciones.value !== undefined ? habitaciones.value : null,
      desde: desde.value || null,
      hasta: hasta.value || null,
      orden: orden.value || null,
      ampliar: ampliar.value ? 1 : 0
    }

    const response = await buscarPropiedad(filtros)
    //console.log('Respuesta recibida:', response)
    propiedades.value = response.data
  }

  const limpiarCampos = () => {
    busqueda.value = ''
    codigo.value = ''
    calleId.value = null
    inmueblesSeleccionados.value = []
    zonasSeleccionadas.value = []
    cochera.value = null
    mascotas.value = null
    habitaciones.value = null
    desde.value = null
    hasta.value = null
    orden.value = null
    ampliar.value = false
  }

  const verPropiedad = (propiedad) => {
    window.open(`/propiedad-detalle/${propiedad.id}`, '_blank')
  }

  onMounted(async () => {
    await cargarCalles()
    await cargarInmuebles()
    await cargarZonas()
  })

  return {
    callesFiltradas,
    mostrarSugerencias,
    calleSeleccionada,
    calleId,
    cargarCalles,
    filtrarCalles,
    seleccionarCalle,
    ocultarSugerencias,
    mostrarLista,
    inmuebles,
    zonas,
    zonasSeleccionadas,
    busquedaZonas,
    inmueblesSeleccionados,
    busquedaInmuebles,
    mostrarInmuebles,
    mostrarZonas,
    cerrarInmueblesTimeoutId,
    cerrarZonasTimeoutId,
    busqueda,
    codigo,
    cochera,
    mascotas,
    habitaciones,
    desde,
    hasta,
    orden,
    ampliar,
    propiedades,
    zonasFiltradas,
    inmuebleFiltrados,
    valorInputZonas,
    valorInputInmuebles,
    abrirInmuebles,
    cerrarInmuebles,
    abrirZonas,
    cerrarZonas,
    filtrar,
    verPropiedad,
    limpiarCampos
  }
}
