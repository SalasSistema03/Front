<template>
    <NavComponent />
    <div class="p-3 ">
        <div class="row">
            <form @submit.prevent="submitForm" class="col-md-6 mb-2">
                <div class="card text-center" action="">

                    <div class="card-header turnero_card_header_blue">
                        <h6>Toma Turno</h6>
                    </div>
                    <div class="card-body  turnero_table_turnos row m-0">
                        <div class="col-6">
                            <div class="form-group ">
                                <label class="form-label small fw-semibold" for="">Sector</label>
                                <select class="form-select form-select-sm turnero_select_option" id=""
                                    v-model="selectedSector" @change="setsectorSeleccionado">
                                    <option value="">Seleccione</option>
                                    <option v-for="sector in sectores" :key="sector.id" :value="sector.id">
                                        {{ sector.nombre }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group mt-3 w-100">
                                <button type="submit" class="btn btn-sm btn-primary w-100" >
                                    {{ turnoLlamado ? 'Finalizar' : 'Toma Turno' }}
                                </button>
                                
                            </div>
                            <div class="form-group mt-3 row ">
                                
                                <div class="col-12 d-flex align-items-center justify-content-center">
                                    
                                    <label class="form-label small fw-semibold turnero_resaltado" v-if="turnoLlamado">
                                        Turno Llamado: {{ turnoLlamado.tipo_identificador }} {{ turnoLlamado.numero_identificador }}
                                    </label>
                                    <label class="form-label small fw-semibold turnero_resaltado" v-else>
                                        
                                    </label>
                                </div>
                                
                                
                            </div>
                        </div>
                        <div class="col-6 p-0 m-0">
                            <div class="card">
                                <div class=" ">
                                    <label class="form-label small fw-semibold">Pendientes del Sector</label>
                                </div>
                                <div class="card-body turnero_table_turnos_sm turnero_table_scroll p-0 m-0">
                                    <!-- Indicador de carga -->
                                    <div v-if="loadingTurnos" class="text-center py-3">
                                        <div class="spinner-border text-primary spinner-border-sm" role="status">
                                            <span class="visually-hidden">Cargando...</span>
                                        </div>
                                        <p class="mb-0 mt-2 small text-muted">Cargando turnos...</p>
                                    </div>
                                    
                                    <!-- Tabla de turnos cuando no está cargando -->
                                    <table v-else class="table table-striped table-hover table-sm p-0 m-0">
                                        <thead class="turnero_head_table ">
                                            <tr >
                                                <th>Numero</th>
                                                <th>Tipo</th>
                                                <th>Ingreso</th>
                                            </tr>
                                        </thead>
                                       
                                        <tbody v-for="turno in turnosFiltrados" :key="turno.id" >
                                            <tr>
                                                <th>{{ turno.numero_identificador }}</th>
                                                <th>{{ turno.tipo_identificador }}</th>
                                                <th>{{ turno.fecha_carga.substring(11, 16) }}</th>
                                            </tr>
                                            

                                        </tbody>
                           
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="col-md-6 mb-2">
                <div class="card text-center">
                    <div class="card-header turnero_card_header_green">
                        <h6>Turnos Pendientes</h6>
                    </div>
                    <div class="card-body turnero_table_turnos turnero_table_scroll p-0 m-0">
                        <table class="table table-striped table-hover table-sm p-0 m-0">
                            <thead class=" turnero_head_table">
                                <tr>
                                    <th>Numero</th>
                                    <th>Tipo</th>
                                    <th>Sector</th>
                                    <th>Ingreso</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="turno in turnosPendientes" :key="turno.id">
                                    <td>{{ turno.numero_identificador }}</td>
                                    <td>{{ turno.tipo_identificador }}</td>
                                    <td>{{ turno.sector.nombre }}</td>
                                    <td>{{ turno.fecha_carga.substring(11, 16) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>



    </div>
</template>
<script setup>
import NavComponent from '../../components/NavComponent.vue'
import { getTurnosPendientes, putFinalizarTurno, putLlamarTurno } from '@/Services/api/Turnero/turneroApi'
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { getSector } from '@/Services/api/Turnero/turneroApi'
import { getUser } from '@/Services/api/Usuario/userApi'



let sectores = ref([])
let sectoresfiltrados = ref([])
let sectorestotales = ref([])
let selectedSector = ref('')
let sectorSeleccionado = ref('')
let turnosFiltrados = ref([])
let turnoLlamado = ref(null)
let loadingTurnos = ref(false)
let usuarioId = ref(null) // Para almacenar el ID del usuario

const { handleApiError, showError, showSuccess } = useToast()

// Función para mostrar el sector seleccionado
const setsectorSeleccionado = async () => {
    sectorSeleccionado.value = selectedSector.value
    if (sectorSeleccionado.value) {
        // Activar indicador de carga
        loadingTurnos.value = true
        
        try {
            //console.log('Sector seleccionado:', sectorSeleccionado.value)
            await loadSectores()
            sectoresfiltrados.value = sectorestotales.value.filter(sector => sector.id === sectorSeleccionado.value)
            
            await loadTurnosPendientes()
            turnosFiltrados.value = turnosPendientes.value.filter(turno => turno.sector.id === sectorSeleccionado.value)
            turnosFiltrados.value.sort((a, b) => new Date(a.fecha_carga) - new Date(b.fecha_carga))
            //console.log('Turnos filtrados:', turnosFiltrados.value)
        } catch (error) {
            handleApiError(error)
        } finally {
            // Desactivar indicador de carga
            loadingTurnos.value = false
        }
    } else {
        // Si no hay sector seleccionado, limpiar turnos filtrados
        turnosFiltrados.value = []
        loadingTurnos.value = false
    }
}


const loadSectores = async () => {
    try {
        const response = await getSector()
        sectores.value = response.data
        sectorestotales.value = response.data  // Cargar todos los sectores aquí
        //console.log('Sectores cargados:', sectores.value)
        //console.log('Sectores totales:', sectorestotales.value)
    } catch (error) {
        // Manejar el error - puedes mostrar un mensaje al usuario
    }
}


let turnosPendientes = ref([])
const loadTurnosPendientes = async () => {
    try {
        const response = await getTurnosPendientes()
        turnosPendientes.value = response.data
        //console.log('Turnos pendientes cargados:', turnosPendientes.value)
    } catch (error) {
        /* handleApiError(error) */
    }
}

const submitForm = async () => {
    // Si ya hay un turno llamado, lo finalizamos
    if (turnoLlamado.value) {
        try {
           
            await putFinalizarTurno(turnoLlamado.value.id)
            showSuccess(`Turno ${turnoLlamado.value.tipo_identificador}: ${turnoLlamado.value.numero_identificador} finalizado correctamente`)
            
            // Limpiar el turno llamado
            turnoLlamado.value = null
            
            //console.log('Turno finalizado')
        } catch (error) {
            handleApiError(error)
            //console.error('Error finalizando turno:', error)
        }
        return
    }
    
    // Si no hay turno llamado, tomamos uno nuevo
    loadingTurnos.value = true // Activar indicador de carga
    
    try {
        // Tomar el primer turno de los filtrados (ya están ordenados por fecha)
        if (!turnosFiltrados.value || turnosFiltrados.value.length === 0) {
            showError('No hay turnos pendientes para el sector seleccionado')
            return
        }
        
        const primerTurno = turnosFiltrados.value[0]
        
        // Obtener el ID del usuario usando getUser
        const idUsuario = (await getUser(localStorage.getItem('token'))).data.id
        
        if (!idUsuario) {
            showError('No se pudo obtener el ID del usuario')
            return
        }
        
        // Llamar a la API para llamar el turno
        await putLlamarTurno(primerTurno.id)
        
        // Asignar el turno llamado
        turnoLlamado.value = primerTurno
        
        // Mostrar mensaje de éxito
        showSuccess(`Turno ${primerTurno.tipo_identificador}: ${primerTurno.numero_identificador} llamado correctamente`)
        
        // Remover el turno de la lista de pendientes
        turnosFiltrados.value = turnosFiltrados.value.filter(turno => turno.id !== primerTurno.id)
        
    } catch (error) {
        handleApiError(error)
    } finally {
        loadingTurnos.value = false // Desactivar indicador de carga
    }
}

onMounted(() => {
    loadTurnosPendientes()
    loadSectores()
    setsectorSeleccionado()
    submitForm()
})
</script>