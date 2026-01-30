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
                                                        :checked="checkVistaSelected(vista, permiso)"
                                                        @change="onVistaChange(vista, permiso, $event.target.checked)" />

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
                                                            :checked="checkBotonSelected(vista, permiso, boton)"
                                                            @change="onBotonChange(vista, permiso, boton, $event.target.checked)" />
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
                                                            :checked="checkSectorSelected(sector, vista, permiso)"
                                                            @change="onSectorChange(sector, vista, permiso, $event.target.checked)" />
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
import { useUsuarioUpdate } from '@/composables/usuario/useUsuarioUpdate'

const {
  menuActivo,
  activeTab,
  nombreUsuario,
  permisos,
  nombresDeUsuarios,
  loading,
  datosUsuario,
  handleNombreUsuarioChange,
  handleSubmit,
  onSectorChange,
  checkSectorSelected,
  onVistaChange,
  checkVistaSelected,
  onBotonChange,
  checkBotonSelected
} = useUsuarioUpdate()
</script>