<template>
    <NavComponent />
    <div class="p-3">
        <div class="row ">
            <form @submit.prevent="submitForm" class="col-md-6 mb-2">
                <div class="card text-center">
                    <div class="card-header turnero_card_header_blue">
                        <h6>Turno</h6>
                    </div>
                    <div class="card-body turnero_table_turnos">
                        <div class="form-group row mt-3">
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold" for="">Identificador</label>
                                <select class="form-select form-select-sm turnero_select_option" v-model="tipoSeleccionado">
                                    <option value="">Seleccione</option>
                                    <option value="DNI">DNI</option>
                                    <option value="Folio">Folio</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold" for="">Numero</label>
                                <input type="number" class="form-control form-control-sm turnero_select_option" v-model="numeroSeleccionado">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-semibold" for="">Sector</label>
                                <select class="form-select form-select-sm turnero_select_option" v-model="selectedSector">
                                    <option value="">Seleccione</option>
                                    <option v-for="sector in sectores" :key="sector.id" :value="sector.id">
                                        {{ sector.nombre }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="pt-3">
                            <button type="submit" :disabled="isLoading" class="btn btn-primary btn-sm w-100">{{ isLoading ? 'Cargando...' : 'Cargar' }}  </button>
                            
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
            <div class="col-md-6 mb-2">
                <div class="card text-center">
                    <div class="card-header turnero_card_header_green">
                        <h6>Turnos Llamados</h6>
                    </div>
                    <div class="card-body turnero_table_turnos turnero_table_scroll p-0 m-0">
                        <table class="table table-striped table-hover table-sm p-0 m-0">   
                            <thead class=" turnero_head_table">
                                <tr>
                                    <th>Numero</th>
                                    <th>Tipo</th>
                                    <th>Sector</th>
                                    <th>Ingreso</th>
                                    <!--<th>Llamado</th>-->
                                    <th>Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="turno in turnosLlamados" :key="turno.id">
                                    
                                <th>{{ turno.numero_identificador }}</th>
                                <th>{{ turno.tipo_identificador }}</th>
                                <th>{{ turno.sector.nombre }}</th>
                                <th>{{ turno.fecha_carga.substring(11, 16) }}</th>
                                <th>{{ turno.usuario.username }}</th> 
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-2">
                <div class="card text-center">
                    <div class="card-header turnero_card_header_green">
                        <h6>Turnos Completados</h6>
                    </div>
                    <div class="card-body turnero_table_turnos turnero_table_scroll p-0 m-0">
                        <table class="table table-striped table-hover table-sm p-0 m-0">   
                            <thead class=" turnero_head_table">
                                <tr>
                                    <th>Numero</th>
                                    <th>Tipo</th>
                                    <th>Sector</th>
                                    <th>Ingreso</th>
                                
                                    <th>Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="turno in turnosCompletados" :key="turno.id">
                                    <th>{{ turno.numero_identificador }}</th>
                                    <th>{{ turno.tipo_identificador }}</th>
                                    <th>{{ turno.sector.nombre }}</th>
                                    <th>{{ turno.fecha_carga.substring(11, 16) }}</th>
                                    <th>{{ turno.usuario.username }}</th> 
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
import { useTurnos } from '@/composables/turnero/useTurnos'
import { useCargaTurno } from '@/composables/turnero/useCargaTurno'

const { sectores, loadSectores } = useSectores()
const { 
    turnosPendientes, 
    turnosLlamados, 
    turnosCompletados,
    loadAllTurnos 
} = useTurnos()

const {
    selectedSector,
    numeroSeleccionado,
    tipoSeleccionado,
    isLoading,
    submitForm
} = useCargaTurno()

let intervalId = null

onMounted(() => {
    loadSectores()
    loadAllTurnos()
    
    // Actualizar datos cada 5 segundos
    intervalId = setInterval(() => {
        loadAllTurnos()
    }, 5000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>