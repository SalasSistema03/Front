import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { buscarPropiedad } from '../../Services/api/Atcl/AtclApi'
import { useCalleAutocomplete } from './useCalleAutocomplete'
import { useInmuebles } from './useInmuebles'
import { useZona } from './useZona'

export function usePropiedadBusqueda() {
  const router = useRouter()

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

  const abrirInmuebles = () => {
    if (cerrarInmueblesTimeoutId.value) {
      clearTimeout(cerrarInmueblesTimeoutId.value)
      cerrarInmueblesTimeoutId.value = null
    }
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
    console.log('Respuesta recibida:', response)
    propiedades.value = response.data
  }

  const verPropiedad = (propiedad) => {
    router.push(`/propiedad-detalle/${propiedad.id}`)
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
    abrirInmuebles,
    cerrarInmuebles,
    abrirZonas,
    cerrarZonas,
    filtrar,
    verPropiedad
  }
}
