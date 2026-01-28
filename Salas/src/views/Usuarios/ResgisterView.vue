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
              <div class="col-md-6 pt-2">
                <!--  <label for="">Nombre Completo</label> -->
                <input type="text" class="form-control" v-model="form.name" placeholder="Nombre Completo" />
              </div>
              <div class="col-md-6 pt-2">
                <input type="date" class="form-control" v-model="form.fecha_nac" placeholder="Fecha de Nacimiento" />
              </div>

              <div class="col-md-6 pt-3">

                <input type="text" class="form-control" v-model="form.username" placeholder="Usuario" />
              </div>
              <div class="col-md-6 pt-3">

                <input type="password" class="form-control" v-model="form.password" placeholder="Contraseña" />
              </div>
            </div>
            <div class="col-md-6 row px-3">
              <h6 class="fw-bold">Información de Contacto</h6>
              <div class="col-md-6 pt-2">

                <input type="number" class="form-control" v-model="form.telf_interno" placeholder="Telefono Interno" />
              </div>
              <div class="col-md-6 pt-2">

                <input type="number" class="form-control" v-model="form.telf_laboral" placeholder="Telefono Laboral" />
              </div>
              <div class="col-md-6 pt-3">

                <input type="text" class="form-control" v-model="form.email_interno" placeholder="Email Interno" />
              </div>
              <div class="col-md-6 pt-3">

                <input type="text" class="form-control" v-model="form.email_externo" placeholder="Email Externo" />
              </div>
            </div>
          </div>
        </div>

        <div class="card-body" v-show="activeTab === 'tab2'">
          <div class="row">
            <div class="col-md-3">
              <div class="list-group text-start register_permisos_menu">
                <button v-for="permiso in permisos" :key="permiso.menu" type="button"
                  class="list-group-item list-group-item-action" :class="{ active: permiso.menu === menuActivo }"
                  @click="menuActivo = permiso.menu">
                  📁 {{ permiso.menu }}
                </button>
              </div>
            </div>

            <div class="col-md-9">
              <div v-for="permiso in permisos" :key="permiso.menu" v-show="permiso.menu === menuActivo"
                class="border rounded p-3 bg-light ">
                <div v-if="permiso.vistas && permiso.vistas.length > 0" class="permisos_menu_scrolleable">
                  <div v-for="(vistasPorSeccion, seccion) in agruparVistasPorSeccion(permiso.vistas)" :key="seccion" class="mb-4">
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

                          <div v-if="vista.nombre_visual === 'Agenda' && permiso.sectores && permiso.sectores.length > 0"
                            class="ms-4">
                            <div v-for="sector in permiso.sectores" :key="sector.id" class="form-check">
                              <input type="checkbox" class="form-check-input" :id="`sector-${sector.id}`"
                                :checked="checkSectorSelected(sector, vista, permiso)"
                                @change="onSectorChange(sector, vista, permiso, $event.target.checked)" />
                              <label class="form-check-label" :for="`sector-${sector.id}`">
                                🖋️ {{ sector.nombre }}
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
    </form>
  </div>
</template>

<script setup>
import NavComponent from '../../components/NavComponent.vue'
import { ref } from 'vue'
import { useUserRegister } from '@/composables/usuario/useUsuarioRegister'

const activeTab = ref('tab1')

// Función para agrupar vistas por sección


const {
  menuActivo,
  permisos,
  form,
  loading,
  error,
  success,
  handleSubmit,
  onSectorChange,
  checkSectorSelected,
  onVistaChange,
  checkVistaSelected,
  onBotonChange,
  checkBotonSelected,
  agruparVistasPorSeccion

} = useUserRegister()
</script>