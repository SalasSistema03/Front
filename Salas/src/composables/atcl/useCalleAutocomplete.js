import { ref } from 'vue'
import { getCalles } from '../../Services/api/Atcl/AtclApi'

export function useCalleAutocomplete() {
    const calles = ref([])
    const callesFiltradas = ref([])
    const mostrarSugerencias = ref(false)
    const calleSeleccionada = ref('')
    const calleId = ref(null)

    /**
     * Cargar todas las calles desde la API
     */
    const cargarCalles = async () => {
        try {
            const response = await getCalles()
            calles.value = response.data
        } catch (error) {
            console.error('Error cargando calles:', error)
            throw error
        }
    }

    /**
     * Filtrar calles según el texto ingresado
     */
    const filtrarCalles = () => {
        const texto = calleSeleccionada.value.toLowerCase()
        
        if (texto.length === 0) {
            callesFiltradas.value = []
            return
        }

        callesFiltradas.value = calles.value
            .filter(calle => calle.name.toLowerCase().includes(texto))
            .slice(0, 10)
    }

    /**
     * Seleccionar una calle de las sugerencias
     */
    const seleccionarCalle = (calle) => {
        calleSeleccionada.value = calle.name
        calleId.value = calle.id
        mostrarSugerencias.value = false
        callesFiltradas.value = []
    }

    /**
     * Ocultar sugerencias con delay
     */
    const ocultarSugerencias = () => {
        setTimeout(() => {
            mostrarSugerencias.value = false
        }, 200)
    }

    /**
     * Mostrar sugerencias
     */
    const mostrarLista = () => {
        mostrarSugerencias.value = true
    }

    /**
     * Limpiar selección
     */
    const limpiarSeleccion = () => {
        calleSeleccionada.value = ''
        calleId.value = null
        callesFiltradas.value = []
        mostrarSugerencias.value = false
    }

    return {
        // State
        calles,
        callesFiltradas,
        mostrarSugerencias,
        calleSeleccionada,
        calleId,
        
        // Methods
        cargarCalles,
        filtrarCalles,
        seleccionarCalle,
        ocultarSugerencias,
        mostrarLista,
        limpiarSeleccion
    }
}