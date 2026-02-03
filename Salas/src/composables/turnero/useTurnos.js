import { ref } from 'vue'
import { getTurnosPendientes, getTurnosLlamados, getTurnosCompletados } from '@/Services/api/Turnero/turneroApi'

export function useTurnos() {
    const turnosPendientes = ref([])
    const turnosLlamados = ref([])
    const turnosCompletados = ref([])
    const loadingTurnos = ref(false)

    const loadTurnosPendientes = async () => {
        try {
            const response = await getTurnosPendientes()
            turnosPendientes.value = response.data
        } catch (error) {
            console.error('Error cargando turnos pendientes:', error)
            throw error
        }
    }

    const loadTurnosLlamados = async () => {
        try {
            const response = await getTurnosLlamados()
            turnosLlamados.value = response.data
        } catch (error) {
            console.error('Error cargando turnos llamados:', error)
            throw error
        }
    }

    const loadTurnosCompletados = async () => {
        try {
            const response = await getTurnosCompletados()
            turnosCompletados.value = response.data
        } catch (error) {
            console.error('Error cargando turnos completados:', error)
            throw error
        }
    }

    const loadAllTurnos = async () => {
        loadingTurnos.value = true
        try {
            await Promise.all([
                loadTurnosPendientes(),
                loadTurnosLlamados(),
                loadTurnosCompletados()
            ])
        } catch (error) {
            console.error('Error cargando todos los turnos:', error)
            throw error
        } finally {
            loadingTurnos.value = false
        }
    }

    const filtrarTurnosPorSector = (sectorId) => {
        return turnosPendientes.value
            .filter(turno => turno.sector.id === sectorId)
            .sort((a, b) => new Date(a.fecha_carga) - new Date(b.fecha_carga))
    }

    return {
        turnosPendientes,
        turnosLlamados,
        turnosCompletados,
        loadingTurnos,
        loadTurnosPendientes,
        loadTurnosLlamados,
        loadTurnosCompletados,
        loadAllTurnos,
        filtrarTurnosPorSector
    }
}
