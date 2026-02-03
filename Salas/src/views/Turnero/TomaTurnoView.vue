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
import { onMounted, onUnmounted } from 'vue'
import { useSectores } from '@/composables/turnero/useSectores'
import { useTomaTurno } from '@/composables/turnero/useTomaTurno'

const { sectores, loadSectores } = useSectores()
const {
    turnoLlamado,
    loadingTurnos,
    selectedSector,
    sectorSeleccionado,
    turnosFiltrados,
    turnosPendientes,
    setsectorSeleccionado,
    submitForm,
    actualizarTurnosPendientes
} = useTomaTurno()

let intervalId = null

onMounted(() => {
    loadSectores()
    setsectorSeleccionado()
    submitForm()
    
    // Actualizar turnos pendientes cada 5 segundos
    intervalId = setInterval(() => {
        actualizarTurnosPendientes()
    }, 5000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>