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
import { getSector, getTurnosPendientes, getTurnosLlamados, getTurnosCompletados } from '@/Services/api/Turnero/turneroApi'
import { ref, onMounted } from 'vue'
import { getUser } from '@/Services/api/Usuario/userApi'
import { postTurnoNuevo } from '@/Services/api/Turnero/turneroApi'
import { useToast } from '@/composables/useToast'

let sectores = ref([])
let selectedSector = ref('')
let numeroSeleccionado = ref('')
let tipoSeleccionado = ref('')
let usuario = ref('')
let isLoading = ref(false)
const { handleApiError, showSuccess } = useToast()
const submitForm = async (sector, numero, tipo) => {
    //poner cargando en el boton 
    isLoading.value = true

    
    const usuario = (await getUser(localStorage.getItem('token'))).data.id
    /* console.log('Sector:', selectedSector.value)
    console.log('Numero:', numeroSeleccionado.value)
    console.log('Tipo:', tipoSeleccionado.value)
    console.log('Usuario:', usuario) */
    const turnoData = {
        sector_id: selectedSector.value,
        numero_identificador: numeroSeleccionado.value,
        tipo_identificador: tipoSeleccionado.value,
        usuario: usuario
    }

    if (!selectedSector.value || !numeroSeleccionado.value || !tipoSeleccionado.value || !usuario) {
        handleApiError('Todos los campos son requeridos')
        setTimeout(() => {
        isLoading.value = false
    })
        return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
        /* handleApiError('No hay token de autenticación') */
        setTimeout(() => {
        isLoading.value = false
    })
        return
    }
    
    

    try{
        const response = await postTurnoNuevo(turnoData)
        showSuccess('Turno cargado correctamente')
        /* console.log('Turno cargado:', response.data) */
    }catch(error){
        handleApiError(error)
        setTimeout(() => {
        isLoading.value = false
    })
    }
    
    // boorar datos al cargar 
    selectedSector.value = ''
    numeroSeleccionado.value = ''
    tipoSeleccionado.value = ''

    setTimeout(() => {
        isLoading.value = false
    }, 500)

    
    
}


const loadSectores = async () => {
    try {
        const response = await getSector()
        sectores.value = response.data
        //console.log('Sectores cargados:', sectores.value)
    } catch (error) {
        /* handleApiError(error) */
        // Manejar el error - puedes mostrar un mensaje al usuario
    }
}

let turnosPendientes = ref([])
const loadTurnosPendientes = async() =>{
    try{
        const response = await getTurnosPendientes()
        turnosPendientes.value = response.data
        //console.log('Turnos pendientes cargados:', turnosPendientes.value)
    }catch(error){
        /* handleApiError(error) */
    }
}

let turnosLlamados = ref([])
const loadTurnosLlamados = async() =>{
    try{
        const response = await getTurnosLlamados()
        turnosLlamados.value = response.data
        //console.log('Turnos llamados cargados:', turnosLlamados.value)
    }catch(error){
        /* handleApiError(error) */
    }
}

let turnosCompletados = ref([])
const loadTurnosCompletados = async() =>{
    try {
        const response = await getTurnosCompletados()
        turnosCompletados.value = response.data
        //console.log('Turnos completados cargados:', turnosCompletados.value)
    }catch(error){
        /* handleApiError(error) */
    }
}

//obtener los valores del form



onMounted(() => {
    loadSectores()
    loadTurnosPendientes()
    loadTurnosLlamados()
    loadTurnosCompletados()

    setInterval(() => {
        loadTurnosPendientes()
        loadTurnosLlamados()
        loadTurnosCompletados()
    }, 5000)
})
</script>