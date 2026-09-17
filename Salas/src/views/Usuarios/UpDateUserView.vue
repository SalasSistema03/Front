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
                <div class="d-flex gap-2">
                  <!-- Agregamos v-model="selectedUserId" -->
                  <select class="form-control" v-model="selectedUserId" @change="handleNombreUsuarioChange($event.target.value)"
                    :disabled="loading">
                    <option value="">Seleccione</option>
                    <option v-for="nombre in nombresDeUsuarios" :key="nombre.id" :value="nombre.id">
                      {{ nombre.username }} ({{ nombre.name }})
                    </option>
                  </select>
                  
                  <!-- NUEVO BOTÓN DE EXPORTACIÓN PDF -->
                  <button type="button" class="btn btn-outline-danger d-flex align-items-center gap-1"
                    :disabled="!selectedUserId || generandoPdf" @click="exportarPermisos"
                    title="Exportar permisos a PDF">
                    <span v-if="generandoPdf" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-file-earmark-pdf-fill"></i>
                    PDF
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <label for="">Fecha de Nacimiento</label>
                <input type="date" class="form-control" v-model="datosUsuario.fechaNacimiento" :disabled="loading" />
              </div>
              <div class="col-md-6">
                <label for="">Nombre Completo</label>
                <input type="text" class="form-control" v-model="datosUsuario.nombreCompleto" :disabled="loading" />
              </div>
              <div class="col-md-6">
                <label for="">Contraseña</label>
                <div class="input-group">
                  <!-- Cambiamos dinámicamente el type entre 'password' y 'text' -->
                  <input 
                    :type="mostrarContrasena ? 'text' : 'password'" 
                    class="form-control" 
                    v-model="datosUsuario.contraseña" 
                    :disabled="loading" 
                  />
                  <!-- Botón para alternar la visibilidad -->
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="mostrarContrasena = !mostrarContrasena"
                    :disabled="loading"
                    title="Mostrar/Ocultar contraseña"
                  >
                    <!-- Cambiamos el ícono dependiendo del estado -->
                    <i class="bi" :class="mostrarContrasena ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 row px-3">
              <h6 class="fw-bold">Información de Contacto</h6>
              <div class="col-md-6">
                <label for="">Telefono Interno</label>
                <input type="number" class="form-control" v-model="datosUsuario.telefonoInterno" :disabled="loading" />
              </div>
              <div class="col-md-6">
                <label for="">Telefono Laboral</label>
                <input type="number" class="form-control" v-model="datosUsuario.telefonoLaboral" :disabled="loading" />
              </div>
              <div class="col-md-6">
                <label for="">Email Interno</label>
                <input type="text" class="form-control" v-model="datosUsuario.emailInterno" :disabled="loading" />
              </div>
              <div class="col-md-6">
                <label for="">Email Externo</label>
                <input type="text" class="form-control" v-model="datosUsuario.emailExterno" :disabled="loading" />
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
                  class="list-group-item list-group-item-action" :class="{ active: permiso.menu === menuActivo }"
                  @click="menuActivo = permiso.menu">
                  📁 {{ permiso.menu }}
                </button>
              </div>
            </div>

            <!-- Columna derecha: contenido del menú activo -->
            <div class="col-md-9">
              <div v-for="permiso in permisos" :key="permiso.menu" v-show="permiso.menu === menuActivo"
                class="border rounded p-3 bg-light ">
                <!-- Vistas -->
                <div v-if="permiso.vistas && permiso.vistas.length > 0" class="permisos_menu_scrolleable">
                  <div v-for="(vistasPorSeccion, seccion) in agruparVistasPorSeccion(permiso.vistas)" :key="seccion"
                    class="mb-4">
                    <h6 class="text-start fw-bold mb-3  pb-2">
                      {{ seccion }}
                    </h6>

                    <div class="row">
                      <div v-for="vista in vistasPorSeccion" :key="vista.id" class="col-md-4 mb-3 text-start">
                        <div class="border rounded p-2">
                          <div class="form-check mb-2">
                            <input type="checkbox" class="form-check-input" :id="`vista-${vista.id}`"
                              :checked="checkVistaSelected(vista, permiso)"
                              @change="onVistaChange(vista, permiso, $event.target.checked)" />

                            <label class="form-check-label fw-semibold" :for="`vista-${vista.id}`">
                              📄 {{ vista.nombre_visual }}
                            </label>
                          </div>

                          <!-- Botones de la vista (normales para todas las vistas excepto Agenda) -->
                          <div v-if="vista.botones && vista.botones.length > 0 && vista.nombre_visual !== 'Agenda'"
                            class="ms-4">
                            <div v-for="boton in vista.botones" :key="boton.id" class="form-check">
                              <input type="checkbox" class="form-check-input" :id="`boton-${boton.id}`"
                                :checked="checkBotonSelected(vista, permiso, boton)"
                                @change="onBotonChange(vista, permiso, boton, $event.target.checked)" />
                              <label class="form-check-label" :for="`boton-${boton.id}`">
                                🖋️{{ boton.nombre_visual }}
                              </label>
                            </div>
                          </div>

                          <!-- Para la vista "Agenda" específicamente, mostrar sectores en lugar de botones -->
                          <div
                            v-if="vista.nombre_visual === 'Agenda' && permiso.sectores && permiso.sectores.length > 0"
                            class="ms-4">
                            <div v-for="sector in permiso.sectores" :key="sector.id" class="form-check">
                              <input type="checkbox" class="form-check-input" :id="`sector-${sector.id}`"
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
import { ref } from 'vue' // <-- Asegúrate de importar ref
import NavComponent from '../../components/NavComponent.vue'
import { useUsuarioUpdate } from '@/composables/usuario/useUsuarioUpdate'
// Importa tu servicio y alertas (ajusta la ruta según la ubicación real de tu archivo)
import { DescargarPdfPermisosService } from '@/Services/api/Usuario/userApi.js'
import { alertas } from '@/utils/alertas.js'

const {
  menuActivo,
  activeTab,
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
  checkBotonSelected,
  agruparVistasPorSeccion
} = useUsuarioUpdate()

// --- NUEVA LÓGICA PARA EL PDF ---

// Variable vinculada al select para saber qué usuario está elegido
const selectedUserId = ref('')
// Variable para mostrar el spinner en el botón rojo mientras se descarga el PDF
const generandoPdf = ref(false)

// NUEVA VARIABLE: Controla la visibilidad de la contraseña
const mostrarContrasena = ref(false)

const exportarPermisos = async () => {
  // Doble validación de seguridad
  if (!selectedUserId.value) return;

  generandoPdf.value = true;
  try {
    const response = await DescargarPdfPermisosService(selectedUserId.value);

    // Convertimos la respuesta a Blob y abrimos en nueva pestaña
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    window.open(url, '_blank', 'noopener,noreferrer');

    // Limpiamos la URL después de un minuto
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000);

  } catch (error) {
    console.error("Error al generar PDF de permisos:", error);
    alertas.error('Error', 'No se pudo generar el reporte de permisos para este usuario.');
  } finally {
    generandoPdf.value = false;
  }
}
</script>