import { ref, watch } from 'vue'
import { buscaPersona, muestraPropiedad } from '@/Services/api/Atcl/AtclApi'
import { useToast } from '@/composables/useToast'

export function useModalPropiedadPropietario(props, emit, modalCargaPersonaRef) {
  const busqueda = ref('')
  const sugerencias = ref([])
  const personaSeleccionada = ref(null)
  const propietarios = ref([])
  const personaParaVer = ref(null)
  
  const mostrarModalVer = ref(false) 
  const modalCargaAbierto = ref(false) 
  
  const propietarioEnEdicion = ref(null)
  const { showError } = useToast()

  let searchTimeout = null

  watch(
    () => props.propiedad,
    (newVal) => {
      if (newVal && Array.isArray(newVal.propietarios)) {
        propietarios.value = newVal.propietarios.map((p) => ({
          persona: p,
          baja: p.pivot ? p.pivot.baja === 'si' : false,
          // CORRECCIÓN 1: Leemos observaciones_baja
          observaciones_baja: p.pivot ? p.pivot.observaciones_baja : '' 
        }))
      }
    }
  )

  const getPropietariosList = () => {
    if (props.propiedad) {
      if (!Array.isArray(props.propiedad.propietarios)) {
        props.propiedad.propietarios = []
      }
      return props.propiedad.propietarios
    }
    return propietarios.value
  }

  const emitirPropietarios = () => emit('propietarios-cambiados', getPropietariosList())

  const abrirModalCargaPersona = () => {
    personaParaVer.value = null
    mostrarModalVer.value = false 
    modalCargaPersonaRef.value?.resetForm()
    
    modalCargaAbierto.value = true 
  }

  const buscar = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    if (busqueda.value.trim() === '') {
      sugerencias.value = []
      return
    }

    searchTimeout = setTimeout(async () => {
      try {
        const texto = busqueda.value.trim()
        const esDNI = /^\d+$/.test(texto)
        const params = esDNI ? { dni: texto } : { apellido: texto }
        const response = await buscaPersona(params)
        sugerencias.value = response.data.slice(0, 100)
      } catch (error) {
        console.error('Error buscando persona:', error)
        sugerencias.value = []
      }
    }, 300)
  }

  const seleccionarPersona = (persona) => {
    personaSeleccionada.value = persona
    busqueda.value = `${persona.apellido}, ${persona.nombre}`
    sugerencias.value = []
  }

  const resetBusqueda = () => {
    personaSeleccionada.value = null
    busqueda.value = ''
    sugerencias.value = []
  }

  const asignarPropietario = () => {
    if (!personaSeleccionada.value) return

    const lista = getPropietariosList()
    const existe = lista.some((p) => p.id === personaSeleccionada.value.id)
    if (existe) {
      showError('Este propietario ya se encuentra asignado')
      return
    }

    lista.push({
      ...personaSeleccionada.value,
      // CORRECCIÓN 2: Creamos el pivot con observaciones_baja
      pivot: { observaciones_baja: '', baja: 'no' } 
    })

    emitirPropietarios()
    resetBusqueda()
  }

  const aseguranPivot = (persona) => {
    if (!persona.pivot) {
      // CORRECCIÓN 3: Protegemos el pivot con observaciones_baja
      persona.pivot = { baja: 'no', observaciones_baja: '' } 
    }
  }

  const toggleBajaPropietario = (persona) => {
    aseguranPivot(persona)
    persona.pivot.baja = persona.pivot.baja === 'si' ? 'no' : 'si'
    emitirPropietarios()
  }

  const verPropietario = async (persona) => {
    if (!props.propiedad?.id) {
      personaParaVer.value = persona
      mostrarModalVer.value = true 
      modalCargaAbierto.value = true 
      return
    }

    try {
      const response = await muestraPropiedad({ id: props.propiedad.id })
      const listaPropsFetch = response.data?.data?.propietarios || response.data?.propietarios || []
      const personaActualizada = listaPropsFetch.find((p) => p.id === persona.id)
      
      personaParaVer.value = personaActualizada || persona
    } catch (error) {
      console.error('Error al obtener datos actualizados:', error)
      personaParaVer.value = persona
    } finally {
      mostrarModalVer.value = true 
      modalCargaAbierto.value = true 
    }
  }

  const editarPropietario = async (persona) => {
    if (!props.propiedad?.id) {
      personaParaVer.value = { ...persona }
      mostrarModalVer.value = false 
      modalCargaAbierto.value = true 
      return
    }

    try {
      const response = await muestraPropiedad({ id: props.propiedad.id })
      const listaPropsFetch = response.data?.data?.propietarios || response.data?.propietarios || []
      const personaActualizada = listaPropsFetch.find((p) => p.id === persona.id)
      
      personaParaVer.value = personaActualizada ? { ...personaActualizada } : { ...persona }
    } catch (error) {
      console.error('Error al obtener datos actualizados:', error)
      personaParaVer.value = { ...persona }
    } finally {
      mostrarModalVer.value = false 
      modalCargaAbierto.value = true 
    }
  }

  const eliminarPropietario = (index) => {
    const lista = getPropietariosList()
    lista.splice(index, 1)
    emitirPropietarios()
  }

  const formatFecha = (fecha) => {
    if (!fecha) return '-'
    const d = new Date(fecha)
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('es-AR')
  }

  const emitirCambiosPropietario = () => {
    emitirPropietarios()
  }

  return {
    busqueda,
    sugerencias,
    personaSeleccionada,
    propietarios,
    personaParaVer,
    mostrarModalVer,
    modalCargaAbierto, 
    propietarioEnEdicion,
    abrirModalCargaPersona,
    buscar,
    seleccionarPersona,
    asignarPropietario,
    toggleBajaPropietario,
    verPropietario,
    editarPropietario,
    eliminarPropietario,
    formatFecha,
    emitirCambiosPropietario
  }
}