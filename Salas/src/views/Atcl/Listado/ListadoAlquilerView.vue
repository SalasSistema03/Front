<template>
  <NavComponent />

  <div class="d-flex">
    <!-- Contenedor Izquierdo: Listado con Scroll -->
    <!-- quiero que se muestre el boton cuando lo apunto -->
    <div class="col-3 px-3">
      <h5 class="mb-4">Listados</h5>
      <div>
        <div class="btn w-100 btn-sm mb-2"
          :class="currentForm === 'propiedades_alquiler' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'propiedades_alquiler'">
          Listar Propiedades en Alquiler
        </div>
        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'propietarios_alquiler' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'propietarios_alquiler'">
          Listar Propietarios en Alquiler
        </div>
      </div>
    </div>

    <!-- Contenedor Derecho: Contenido Estático (Formularios Predefinidos) -->
    <div class="right-panel col-9">


      <!-- Formulario de Propiedades en Alquiler -->
      <div v-if="currentForm === 'propiedades_alquiler'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Propiedades en Alquiler</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row" @submit.prevent="submitPropiedadesAlquiler">

              <div class="form-group col-md-4 px-1">
                <label for="input-calle" class="form-label">Calle</label>
                <div class="position-relative">
                  <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
                    v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarLista" @blur="ocultarSugerencias"
                    autocomplete="off">

                  <ul v-if="mostrarSugerencias && callesFiltradas.length"
                    class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm busqueda-select">
                    <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalle(calle)"
                      class="px-3 py-2 cursor-pointer hover:bg-light ">
                      {{ calle.name }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="form-group col-md-4 px-1">
                <label for="input-zona" class="form-label">Zona</label>
                <div class="position-relative">
                  <input type="text" class="form-control form-control-sm" placeholder="Buscar zona..."
                    v-model="busquedaZonas" @focus="abrirZonas" @blur="cerrarZonas">

                  <div v-if="mostrarZonas"
                    class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                    style="max-height: 150px; overflow-y: auto; z-index: 1000;" @mousedown.prevent="abrirZonas">
                    <div v-for="zona in zonasFiltradas" :key="zona.id" class="form-check ">
                      <input class="form-check-input" type="checkbox" :value="zona.id" v-model="zonasSeleccionadas"
                        :id="`zona-${zona.id}`">
                      <label class="form-check-label" :for="`zona-${zona.id}`">
                        {{ zona.name }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group col-md-4 px-1">
                <label for="input-Inmueble" class="form-label">Tipo Inmueble</label>
                <div class="position-relative">
                  <input type="text" class="form-control form-control-sm" placeholder="Buscar tipo inmueble..."
                    v-model="busquedaInmuebles" @focus="abrirInmuebles" @blur="cerrarInmuebles">

                  <div v-if="mostrarInmuebles"
                    class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                    style="max-height: 150px; overflow-y: auto; z-index: 1000;" @mousedown.prevent="abrirInmuebles">
                    <div v-for="inmueble in inmuebleFiltrados" :key="inmueble.id" class="form-check ">
                      <input class="form-check-input" type="checkbox" :value="inmueble.id"
                        v-model="inmueblesSeleccionados" :id="`inmueble-${inmueble.id}`">
                      <label class="form-check-label" :for="`inmueble-${inmueble.id}`">
                        {{ inmueble.inmueble }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group col-md-4 px-1">
                <label class="form-label">Estado</label>
                <select v-model="formPropiedades.estado_id" class="form-control form-control-sm">
                  <option value="">Seleccione un estado</option>
                  <option v-for="estado in estados" :key="estado.id" :value="estado.id">{{ estado.name }}</option>
                </select>
              </div>


              <div class="from-group col-md-4 px-1">
                <label class="form-label">Importe desde</label>
                <input type="number" class="form-control form-control-sm" v-model="formPropiedades.importe_minimo" min="0"
                  placeholder="Importe mínimo">
              </div>
              <div class="from-group col-md-4 px-1">
                <label class="form-label">Importe hasta</label>
                <input type="number" class="form-control form-control-sm" v-model="formPropiedades.importe_maximo" min="0"
                  placeholder="Importe máximo">
              </div>
              <div class="col-md-12  mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitPropiedadesAlquiler">Listar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Componente para generar PDF -->
      <ListadoPropiedad ref="listadoPropiedadRef" :formPropiedades="formPropiedades" />

      <!-- Formulario de Propietarios en Alquiler -->
      <div v-if="currentForm === 'propietarios_alquiler'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Propietarios en Alquiler</label>
          </div>
          <div class="card-body text-primary">
            <form class="row" @submit.prevent="submitPropietariosAlquiler">
              <div class="col-md-12 form-group px-1">
                <label class="form-label">Propietario</label>
                <input type="text" v-model="formPropietarios.propietario" class="form-control form-control-sm"
                  placeholder="Buscar propietarios por nombre o dni">
              </div>
              <div class="col-md-12 bg-transparent border-primary mt-2 form-group">
                <button type="submit" class="btn btn-primary btn-sm w-100 mt-2">Listar</button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
  </div>
</template>

<script>
import NavComponent from '../../../components/NavComponent.vue'
import ListadoPropiedad from '../../../components/Atcl/Listado/ListadoPropiedad.vue'
import { usePropiedadBusqueda } from '../../../composables/atcl/usePropiedadBusqueda'
import { ref } from 'vue'
import { getEstadoAlquiler } from '@/Services/api/Atcl/AtclApi'

export default {
  components: {
    NavComponent,
    ListadoPropiedad
  },

  setup() {
    const currentForm = ref('propiedades_alquiler')
    const propiedadBusqueda = usePropiedadBusqueda()
    const estados = ref([])
    const listadoPropiedadRef = ref(null)

    const getEstados = async () => {
      const response = await getEstadoAlquiler()
      estados.value = response.data
    }

    getEstados()

    const formPropiedades = ref({
      calle: '',
      zona_id: '',
      tipo: '',
      estado_id: '',
      importe_minimo: '',
      importe_maximo: '',
      pertenece: 'listadoPropiedadesAlquiler'
    })

    const formPropietarios = ref({
      propietario: '',
      pertenece: 'estadoPropietarioA'
    })

    const submitPropiedadesAlquiler = () => {
      // Conectar datos del composable con el formulario
      formPropiedades.value.calle = propiedadBusqueda.calleId?.value ?? ''
      formPropiedades.value.zona_id = (propiedadBusqueda.zonasSeleccionadas?.value?.length) ? propiedadBusqueda.zonasSeleccionadas.value : []
      formPropiedades.value.tipo = (propiedadBusqueda.inmueblesSeleccionados?.value?.length) ? propiedadBusqueda.inmueblesSeleccionados.value : []

      console.log('Formulario propiedades alquiler:', formPropiedades.value)

      // Generar PDF
      if (listadoPropiedadRef.value) {
        listadoPropiedadRef.value.generarPdf()
      }
    }

    const submitPropietariosAlquiler = () => {
      console.log('Formulario propietarios alquiler:', formPropietarios.value)
    }

    return {
      currentForm,
      estados,
      formPropiedades,
      formPropietarios,
      submitPropiedadesAlquiler,
      submitPropietariosAlquiler,
      listadoPropiedadRef,
      ...propiedadBusqueda
    }
  }
}
</script>
