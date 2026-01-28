<template>
    <NavComponent />
    <div class="container">
        <form class="container mt-4 d-flex flex-column gap-1" @submit.prevent="handleSubmit">
            <div class="card text-center">
                <div class="card-header">
                    <ul class="nav nav-pills card-header-pills">
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ active: activeTab === 'tab1' }"
                                @click.prevent="activeTab = 'tab1'">
                                Datos Personales
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link" :class="{ active: activeTab === 'tab2' }"
                                @click.prevent="activeTab = 'tab2'">
                                Permisos
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="card-body" v-show="activeTab === 'tab1'">
                    
                    <div class="row gap-2 d-flex justify-content-between">

                        <div class="col-md-6 row px-3">
                            <h6 class="fw-bold">Información Personal</h6>
                            <div class="col-md-6">
                                <label for="">Usuario</label>
                                <select class="form-control" @change="handleNombreUsuarioChange($event.target.value)"
                                    :disabled="loading">
                                    <option value="">Seleccione</option>
                                    <option v-for="nombre in nombresDeUsuarios" :key="nombre.id" :value="nombre.id">
                                        {{ nombre.username }}({{ nombre.name }})
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="">Fecha de Nacimiento</label>
                                <input type="date" class="form-control" v-model="datosUsuario.fechaNacimiento"
                                    :disabled="loading" />
                            </div>
                            <div class="col-md-6">
                                <label for="">Nombre Completo</label>
                                <input type="text" class="form-control" v-model="datosUsuario.nombreCompleto"
                                    :disabled="loading" />
                            </div>
                            <div class="col-md-6">
                                <label for="">Contraseña</label>
                                <input type="input" class="form-control" v-model="datosUsuario.contraseña"
                                    :disabled="loading" />
                            </div>
                        </div>
                        <div class="col-md-6 row px-3">
                            <h6 class="fw-bold">Información de Contacto</h6>
                            <div class="col-md-6">
                                <label for="">Telefono Interno</label>
                                <input type="number" class="form-control" v-model="datosUsuario.telefonoInterno"
                                    :disabled="loading" />
                            </div>
                            <div class="col-md-6">
                                <label for="">Telefono Laboral</label>
                                <input type="number" class="form-control" v-model="datosUsuario.telefonoLaboral"
                                    :disabled="loading" />
                            </div>
                            <div class="col-md-6">
                                <label for="">Email Interno</label>
                                <input type="text" class="form-control" v-model="datosUsuario.emailInterno"
                                    :disabled="loading" />
                            </div>
                            <div class="col-md-6">
                                <label for="">Email Externo</label>
                                <input type="text" class="form-control" v-model="datosUsuario.emailExterno"
                                    :disabled="loading" />
                            </div>
                        </div>

                    </div>



                </div>
                <div class="card-body" v-show="activeTab === 'tab2'">
                    <div class="row">
                        <!-- Columna izquierda: lista de menús -->
                        <div class="col-md-3">
                            <div class="list-group text-start register_permisos_menu">
                                <button v-for="permiso in permisos" :key="permiso.menu" type="button"
                                    class="list-group-item list-group-item-action"
                                    :class="{ active: permiso.menu === menuActivo }" @click="menuActivo = permiso.menu">
                                    📁 {{ permiso.menu }}
                                </button>
                            </div>
                        </div>

                        <!-- Columna derecha: contenido del menú activo -->
                        <div class="col-md-9">
                            <div v-for="permiso in permisos" :key="permiso.menu" v-show="permiso.menu === menuActivo"
                                class="border rounded p-3 bg-light ">
                                <!-- Vistas -->
                                <div v-if="permiso.vistas && permiso.vistas.length > 0"
                                    class="permisos_menu_scrolleable">
                                    <div class="row">
                                        <div v-for="vista in permiso.vistas" :key="vista.id"
                                            class="col-md-4 mb-3 text-start">
                                            <div class="border rounded p-2">
                                                <div class="form-check mb-2">
                                                    <input type="checkbox" class="form-check-input"
                                                        :id="`vista-${vista.id}`"
                                                        :checked="isVistaSelected(vista, permiso)"
                                                        @change="handleVistaChange(vista, permiso, $event.target.checked)" />

                                                    <label class="form-check-label fw-semibold"
                                                        :for="`vista-${vista.id}`">
                                                        📄 {{ vista.nombre_visual }}
                                                    </label>
                                                </div>

                                                <!-- Botones de la vista (normales para todas las vistas excepto Agenda) -->
                                                <div v-if="vista.botones && vista.botones.length > 0 && vista.nombre_visual !== 'Agenda'"
                                                    class="ms-4">
                                                    <div v-for="boton in vista.botones" :key="boton.id"
                                                        class="form-check">
                                                        <input type="checkbox" class="form-check-input"
                                                            :id="`boton-${boton.id}`"
                                                            :checked="isBotonSelected(vista, permiso, boton)"
                                                            @change="handleBotonChange(vista, permiso, boton, $event.target.checked)" />
                                                        <label class="form-check-label" :for="`boton-${boton.id}`">
                                                            🖋️{{ boton.nombre_visual }}
                                                        </label>
                                                    </div>
                                                </div>

                                                <!-- Para la vista "Agenda" específicamente, mostrar sectores en lugar de botones -->
                                                <div v-if="vista.nombre_visual === 'Agenda' && permiso.sectores && permiso.sectores.length > 0"
                                                    class="ms-4">
                                                    <div v-for="sector in permiso.sectores" :key="sector.id"
                                                        class="form-check">
                                                        <input type="checkbox" class="form-check-input"
                                                            :id="`sector-${sector.id}`"
                                                            :checked="isSectorSelected(sector, vista, permiso)"
                                                            @change="handleSectorChange(sector, vista, permiso, $event.target.checked)" />
                                                        <label class="form-check-label" :for="`sector-${sector.id}`">
                                                            {{ sector.nombre }}
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <button class="btn btn-primary" type="submit" :disabled="loading">
                    {{ loading ? 'Guardando...' : 'Guardar' }}
                </button>
                <div v-if="error" class="alert alert-danger">
                    {{ error }}
                </div>

                <div v-if="success" class="alert alert-success">
                    {{ success }}
                </div>
            <!-- Indicador de carga -->
            <div v-if="loading" class="text-center mt-3">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando datos del usuario...</p>
            </div>


        </form>


    </div>
</template>


<script setup>
import NavComponent from '../../components/NavComponent.vue'
import { getPermisos } from '../../Services/api/Usuario/userApi'
import { ref, reactive, onMounted } from 'vue'
import { getNombresDeUsuarios } from '../../Services/api/Usuario/userApi'
import { getDatosGenerales } from '../../Services/api/Usuario/userApi'
import { updateUser } from '../../Services/api/Usuario/userApi'

const menuActivo = ref(null)
const activeTab = ref('tab1')
const nombreUsuario = ref('')
const permisos = ref([])

const nombresDeUsuarios = ref([])
const loading = ref(false)
const error = ref(null)
const success = ref(null)

// Datos del formulario
const datosUsuario = reactive({
    fechaNacimiento: '',
    nombreCompleto: '',
    contraseña: '',
    telefonoInterno: '',
    telefonoLaboral: '',
    emailInterno: '',
    emailExterno: '',
    permisos: []
})
onMounted(async () => {
    const response = await getNombresDeUsuarios()
    nombresDeUsuarios.value = response.data

    // Cargar permisos disponibles
    try {
        const permisosResponse = await getPermisos()
        permisos.value = permisosResponse.data
    } catch (error) {
        console.error('Error cargando permisos:', error)
    }
})

const handleNombreUsuarioChange = async (nombre) => {
    nombreUsuario.value = nombre

    if (nombre) {
        loading.value = true
        try {
            const response = await getDatosGenerales(nombre)
            const datos = response.data

            // Mapear los datos del usuario al formulario
            datosUsuario.fechaNacimiento = datos.usuario.fecha_nac || ''
            datosUsuario.nombreCompleto = datos.usuario.name || ''
            datosUsuario.contraseña = datos.usuario.password || '' // No cargar contraseña por seguridad
            datosUsuario.telefonoInterno = datos.usuario.telf_interno || ''
            datosUsuario.telefonoLaboral = datos.usuario.telf_laboral || ''
            datosUsuario.emailInterno = datos.usuario.email_interno || ''
            datosUsuario.emailExterno = datos.usuario.email_externo || ''

            // Mapear permisos existentes al formato [menu_id, vista_id, boton_id]
            datosUsuario.permisos = datos.permisos.map(permiso => [
                permiso.nav_id,
                permiso.vista_id,
                permiso.boton_id
            ])

            // Mapear sectores de agenda al formato [menu_id, vista_id, null, sector_id]
            if (datos.agenda && datos.agenda.length > 0) {
                console.log('📋 Datos de agenda recibidos:', datos.agenda)

                // CORRECCIÓN: Buscar la vista "Agenda" correctamente
                // 1. Primero buscar el menú "Agenda" en los permisos cargados
                const menuAgenda = permisos.value.find(p => p.menu === 'Agenda' || p.id === 3)
                const navIdAgenda = menuAgenda ? menuAgenda.id : 3 // menu_id de Agenda es 3

                // 2. Buscar la vista "Agenda" dentro del menú Agenda
                let vistaAgendaId = null
                if (menuAgenda && menuAgenda.vistas) {
                    const vistaAgenda = menuAgenda.vistas.find(v => v.nombre_visual === 'Agenda')
                    vistaAgendaId = vistaAgenda ? vistaAgenda.id : 33 // vista_id de Agenda es 33
                } else {
                    vistaAgendaId = 33 // Default
                }

                console.log('🎯 IDs de Agenda encontrados:', {
                    nav_id: navIdAgenda,
                    vista_id: vistaAgendaId,
                    menu_agenda: menuAgenda,
                    vistas_menu: menuAgenda?.vistas
                })

                // 3. Mapear los sectores
                const sectoresAgenda = datos.agenda.map(sector => [
                    navIdAgenda,          // nav_id: 3 (Agenda)
                    vistaAgendaId,        // vista_id: 33 (Agenda)
                    null,                 // boton_id: null
                    sector.sector_id      // sector_id: 1,2,3,etc
                ])

                console.log('🔄 Sectores mapeados:', sectoresAgenda)

                // 4. Agregar los sectores a los permisos
                datosUsuario.permisos.push(...sectoresAgenda)

                // 5. Asegurar que la vista "Agenda" también esté seleccionada
                const vistaAgendaYaSeleccionada = datosUsuario.permisos.some(p =>
                    p[0] === navIdAgenda && p[1] === vistaAgendaId && p[1] !== null
                )

                if (!vistaAgendaYaSeleccionada) {
                    datosUsuario.permisos.push([navIdAgenda, vistaAgendaId, null])
                }

                console.log('✅ Todos los permisos después de agregar agenda:', datosUsuario.permisos)

                // 6. DEBUG: Verificar si los sectores están en los permisos
                console.log('🔍 Verificación de sectores en permisos:')
                datos.agenda.forEach(sector => {
                    const existe = datosUsuario.permisos.some(p =>
                        p[0] === navIdAgenda && p[1] === vistaAgendaId && p[3] === sector.sector_id
                    )
                    console.log(`Sector ${sector.sector_id} existe: ${existe}`)
                })
            }

        } catch (error) {
            console.error('Error al obtener datos del usuario:', error)
        } finally {
            loading.value = false
        }
    } else {
        // Limpiar formulario si no hay usuario seleccionado
        datosUsuario.fechaNacimiento = ''
        datosUsuario.nombreCompleto = ''
        datosUsuario.contraseña = ''
        datosUsuario.telefonoInterno = ''
        datosUsuario.telefonoLaboral = ''
        datosUsuario.emailInterno = ''
        datosUsuario.emailExterno = ''
        datosUsuario.permisos = []
        loading.value = false
    }
}

// Función para manejar selección de sectores (solo para la vista "Agenda")
const handleSectorChange = (sector, vista, menu, isChecked) => {
    const menuId = menu.id
    const vistaId = vista.id
    const sectorId = sector.id

    if (isChecked) {
        // Buscar si ya existe este menú-vista-sector
        const existingIndex = datosUsuario.permisos.findIndex(p =>
            p[0] === menuId && p[1] === vistaId && p[3] === sectorId
        )

        if (existingIndex === -1) {
            // Agregar nuevo permiso de sector [menu_id, vista_id, null, sector_id]
            datosUsuario.permisos.push([menuId, vistaId, null, sectorId])
        }
    } else {
        // Remover el permiso del sector
        datosUsuario.permisos = datosUsuario.permisos.filter(p =>
            !(p[0] === menuId && p[1] === vistaId && p[3] === sectorId)
        )
    }
}

// Función para verificar si un sector está seleccionado
const isSectorSelected = (sector, vista, menu) => {
    const menuId = menu.id
    const vistaId = vista.id
    const sectorId = sector.id

    return datosUsuario.permisos.some(p =>
        p[0] === menuId && p[1] === vistaId && p[3] === sectorId
    )
}

// Función para manejar selección de vistas
const handleVistaChange = (vista, menu, isChecked) => {
    const menuId = menu.id
    const vistaId = vista.id

    if (isChecked) {
        // Buscar si ya existe este menú-vista
        const existingIndex = datosUsuario.permisos.findIndex(p =>
            p[0] === menuId && p[1] === vistaId && p[1] !== null
        )

        if (existingIndex === -1) {
            // Agregar nuevo permiso [menu_id, vista_id, null]
            datosUsuario.permisos.push([menuId, vistaId, null])
        }
    } else {
        // Remover el permiso y todos sus botones/sectores
        datosUsuario.permisos = datosUsuario.permisos.filter(p => !(p[0] === menuId && p[1] === vistaId))
    }
}

// Función para manejar selección de botones
const handleBotonChange = (vista, menu, boton, isChecked) => {
    const menuId = menu.id
    const vistaId = vista.id
    const botonId = boton.id

    if (isChecked) {
        // Primero asegurarse que la vista está seleccionada
        const vistaExists = datosUsuario.permisos.some(p =>
            p[0] === menuId && p[1] === vistaId && p[1] !== null
        )

        if (!vistaExists) {
            // Agregar la vista primero
            datosUsuario.permisos.push([menuId, vistaId, null])
        }

        // Buscar si ya existe este menú-vista-botón
        const existingIndex = datosUsuario.permisos.findIndex(p =>
            p[0] === menuId && p[1] === vistaId && p[2] === botonId && p[2] !== null
        )

        if (existingIndex === -1) {
            // Agregar el botón
            datosUsuario.permisos.push([menuId, vistaId, botonId])
        }
    } else {
        // Remover solo el botón, mantener la vista
        datosUsuario.permisos = datosUsuario.permisos.filter(p =>
            !(p[0] === menuId && p[1] === vistaId && p[2] === botonId)
        )
    }
}

// Función para verificar si una vista está seleccionada
const isVistaSelected = (vista, menu) => {
    const menuId = menu.id
    const vistaId = vista.id

    // Buscar solo registros que tengan vista_id (p[1] no sea null) y no sean sectores (p[3] sea null o undefined)
    return datosUsuario.permisos.some(p =>
        p[0] === menuId && p[1] === vistaId && p[1] !== null && (p[3] === null || p[3] === undefined)
    )
}

// Función para verificar si un botón está seleccionado
const isBotonSelected = (vista, menu, boton) => {
    const menuId = menu.id
    const vistaId = vista.id
    const botonId = boton.id

    // Buscar solo registros que tengan boton_id (p[2] no sea null)
    return datosUsuario.permisos.some(p =>
        p[0] === menuId && p[1] === vistaId && p[2] === botonId && p[2] !== null
    )
}

const handleSubmit = async () => {
    error.value = null
    success.value = null
    loading.value = true

    try {
        const response = await updateUser(datosUsuario, nombreUsuario.value)
        success.value = response.message
    } catch (err) {
        error.value = err.response?.data?.message || 'Error al actualizar el usuario'
        console.error('Error updating user:', err)
    } finally {
        loading.value = false
    }
}
</script>