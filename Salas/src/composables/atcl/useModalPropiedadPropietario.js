import { ref, watch } from 'vue'
/* import { Modal } from 'bootstrap' */
import { buscaPersona, muestraPropiedad } from '@/Services/api/Atcl/AtclApi'

export function useModalPropiedadPropietario(props, emit, modalCargaPersonaRef) {
  const busqueda = ref('')
  const sugerencias = ref([])
  const personaSeleccionada = ref(null)
  const propietarios = ref([])
  const personaParaVer = ref(null)
  const mostrarModalVer = ref(false)
  const propietarioEnEdicion = ref(null)

  let searchTimeout = null

  watch(
    () => props.propiedad,
    (newVal) => {
      if (newVal && Array.isArray(newVal.propietarios)) {
        propietarios.value = newVal.propietarios.map((p) => ({
          persona: p,
          baja: p.pivot ? p.pivot.baja === 'si' : false,
          observaciones: p.pivot ? p.pivot.observaciones : ''
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

  const switchModals = () => {
    const modalPadre = window.bootstrap.Modal.getInstance(document.getElementById('modalPropietarios'))
    if (modalPadre) modalPadre.hide()
    setTimeout(() => {
      const modalHijo = new window.bootstrap.Modal(document.getElementById('modalCargaPersona'))
      modalHijo.show()
    }, 400)
  }

  const abrirModalCargaPersona = () => {
    personaParaVer.value = null
    mostrarModalVer.value = false
    modalCargaPersonaRef.value?.resetForm()
    switchModals()
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
        sugerencias.value = response.data.slice(0, 10)
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
      alert('Ya est� asignado')
      return
    }

    lista.push({
      ...personaSeleccionada.value,
      pivot: { observaciones: '', baja: 'no' }
    })

    emitirPropietarios()
    resetBusqueda()
  }

  const aseguranPivot = (persona) => {
    if (!persona.pivot) {
      persona.pivot = { baja: 'no', observaciones: '' }
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
      switchModals()
      return
    }

    try {
      const response = await muestraPropiedad({ id: props.propiedad.id })
      const personaActualizada = response.data.propietarios.find((p) => p.id === persona.id)
      personaParaVer.value = personaActualizada || persona
    } catch (error) {
      console.error('Error al obtener datos actualizados:', error)
      personaParaVer.value = persona
    } finally {
      mostrarModalVer.value = true
      switchModals()
    }
  }

  const editarPropietario = async (persona) => {
    if (!props.propiedad?.id) {
      personaParaVer.value = { ...persona }
      mostrarModalVer.value = false
      switchModals()
      return
    }

    try {
      const response = await muestraPropiedad({ id: props.propiedad.id })
      const personaActualizada = response.data.propietarios.find((p) => p.id === persona.id)
      personaParaVer.value = personaActualizada ? { ...personaActualizada } : { ...persona }
    } catch (error) {
      console.error('Error al obtener datos actualizados:', error)
      personaParaVer.value = { ...persona }
    } finally {
      mostrarModalVer.value = false
      switchModals()
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
    propietarioEnEdicion,
    switchModals,
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
