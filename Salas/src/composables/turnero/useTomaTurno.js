import { ref } from 'vue'
import { putFinalizarTurno, putLlamarTurno } from '@/Services/api/Turnero/turneroApi'
import { useToast } from '@/composables/useToast'
import { useUsuario } from './useUsuario'
import { useTurnos } from './useTurnos'

export function useTomaTurno() {
    const turnoLlamado = ref(null)
    const loadingTurnos = ref(false)
    const selectedSector = ref('')
    const sectorSeleccionado = ref('')
    const turnosFiltrados = ref([])
    
    const { handleApiError, showError, showSuccess } = useToast()
    const { obtenerUsuarioActual } = useUsuario()
    const { turnosPendientes, loadTurnosPendientes, filtrarTurnosPorSector } = useTurnos()

    const setsectorSeleccionado = async () => {
        sectorSeleccionado.value = selectedSector.value
        if (sectorSeleccionado.value) {
            loadingTurnos.value = true
            
            try {
                await loadTurnosPendientes()
                turnosFiltrados.value = filtrarTurnosPorSector(sectorSeleccionado.value)
            } catch (error) {
                handleApiError(error)
            } finally {
                loadingTurnos.value = false
            }
        } else {
            turnosFiltrados.value = []
            loadingTurnos.value = false
        }
    }

    const submitForm = async () => {
        // Si ya hay un turno llamado, lo finalizamos
        if (turnoLlamado.value) {
            try {
                const usuario = await obtenerUsuarioActual()
                
                if (!usuario.id) {
                    showError('No se pudo obtener el ID del usuario')
                    return
                }
                
                await putFinalizarTurno(turnoLlamado.value.id, usuario.id)
                showSuccess(`Turno ${turnoLlamado.value.tipo_identificador}: ${turnoLlamado.value.numero_identificador} finalizado correctamente`)
                
                // Limpiar el turno llamado
                turnoLlamado.value = null
                
                // Actualizar lista de turnos pendientes
                await loadTurnosPendientes()
                
            } catch (error) {
                handleApiError(error)
            }
            return
        }
        
        // Si no hay turno llamado, tomamos uno nuevo
        loadingTurnos.value = true
        
        try {
            // Tomar el primer turno de los filtrados (ya están ordenados por fecha)
            if (!turnosFiltrados.value || turnosFiltrados.value.length === 0) {
                showError('No hay turnos pendientes para el sector seleccionado')
                return
            }
            
            const primerTurno = turnosFiltrados.value[0]
            
            // Obtener el ID del usuario
            const usuario = await obtenerUsuarioActual()
            
            if (!usuario.id) {
                showError('No se pudo obtener el ID del usuario')
                return
            }
            
            // Llamar a la API para llamar el turno pasando el ID del usuario
            await putLlamarTurno(primerTurno.id, usuario.id)
            
            // Asignar el turno llamado
            turnoLlamado.value = primerTurno
            
            // Mostrar mensaje de éxito
            showSuccess(`Turno ${primerTurno.tipo_identificador}: ${primerTurno.numero_identificador} llamado correctamente`)
            
            // Actualizar lista de turnos pendientes y filtrados
            await loadTurnosPendientes()
            turnosFiltrados.value = filtrarTurnosPorSector(sectorSeleccionado.value)
            
        } catch (error) {
            handleApiError(error)
        } finally {
            loadingTurnos.value = false
        }
    }

    const actualizarTurnosPendientes = async () => {
        try {
            await loadTurnosPendientes()
            // Si hay un sector seleccionado, actualizar también los filtrados
            if (sectorSeleccionado.value) {
                turnosFiltrados.value = filtrarTurnosPorSector(sectorSeleccionado.value)
            }
        } catch (error) {
            handleApiError(error)
        }
    }

    return {
        turnoLlamado,
        loadingTurnos,
        selectedSector,
        sectorSeleccionado,
        turnosFiltrados,
        turnosPendientes,
        setsectorSeleccionado,
        submitForm,
        actualizarTurnosPendientes
    }
}
