<template>
  <NavComponent />

  <div class="d-flex">
    <!-- Contenedor Izquierdo: Listado con Scroll -->
    <!-- quiero que se muestre el boton cuando lo apunto -->
    <div class="col-3 px-3">
      <h5 class="mb-4">Listados</h5>
      <div>
        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'propiedades_alquiler' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'propiedades_alquiler'">
          Listar Propiedades en Alquiler
        </div>
        <div class="btn w-100 btn-sm mb-2"
          :class="currentForm === 'propietarios_alquiler' ? 'btn-primary' : 'btn-light'"
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
              <!-- Campo para la calle -->
              <div class="form-group col-md-4 px-1">
                <label for="input-calle" class="form-label">Calle</label>
                <div class="position-relative">
                  <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
                    v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarLista" @blur="ocultarSugerencias"
                    autocomplete="off" />

                  <ul v-if="mostrarSugerencias && callesFiltradas.length"
                    class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm busqueda-select">
                    <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalle(calle)"
                      class="px-3 py-2 cursor-pointer hover:bg-light">
                      {{ calle.name }}
                    </li>
                  </ul>
                </div>
              </div>
              <!-- Campo para la zona -->
              <div class="form-group col-md-4 px-1">
                <label for="input-zona" class="form-label">Zona</label>
                <div class="position-relative">
                  <input type="text" class="form-control form-control-sm" placeholder="Buscar zona..."
                    v-model="valorInputZonas" @focus="abrirZonas" @blur="cerrarZonas" />

                  <div v-if="mostrarZonas"
                    class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                    style="max-height: 150px; overflow-y: auto; z-index: 1000" @mousedown.prevent="abrirZonas">
                    <div v-for="zona in zonasFiltradas" :key="zona.id" class="form-check">
                      <input class="form-check-input" type="checkbox" :value="zona.id" v-model="zonasSeleccionadas"
                        :id="`zona-${zona.id}`" />
                      <label class="form-check-label" :for="`zona-${zona.id}`">
                        {{ zona.name }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Campo para el tipo de inmueble -->
              <div class="form-group col-md-4 px-1">
                <label for="input-Inmueble" class="form-label">Tipo Inmueble</label>
                <div class="position-relative">
                  <input type="text" class="form-control form-control-sm" placeholder="Buscar tipo inmueble..."
                    v-model="valorInputInmuebles" @focus="abrirInmuebles" @blur="cerrarInmuebles" />

                  <div v-if="mostrarInmuebles"
                    class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                    style="max-height: 150px; overflow-y: auto; z-index: 1000" @mousedown.prevent="abrirInmuebles">
                    <div v-for="inmueble in inmuebleFiltrados" :key="inmueble.id" class="form-check">
                      <input class="form-check-input" type="checkbox" :value="inmueble.id"
                        v-model="inmueblesSeleccionados" :id="`inmueble-${inmueble.id}`" />
                      <label class="form-check-label" :for="`inmueble-${inmueble.id}`">
                        {{ inmueble.inmueble }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Campo para el estado -->
              <div class="form-group col-md-4 px-1">
                <label class="form-label">Estado</label>
                <select v-model="formPropiedades.estado_id" class="form-control form-control-sm">
                  <option value="">Seleccione un estado</option>
                  <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                    {{ estado.name }}
                  </option>
                </select>
              </div>
              <!-- Campo para el importe desde -->
              <div class="from-group col-md-4 px-1">
                <label class="form-label">Importe desde</label>
                <input type="number" class="form-control form-control-sm" v-model="formPropiedades.importe_minimo"
                  min="0" placeholder="Importe mínimo" />
              </div>
              <!-- Campo para el importe hasta -->
              <div class="from-group col-md-4 px-1">
                <label class="form-label">Importe hasta</label>
                <input type="number" class="form-control form-control-sm" v-model="formPropiedades.importe_maximo"
                  min="0" placeholder="Importe máximo" />
              </div>

              <!-- Campo para el orden -->
              <div class="col-md-6 mt-2">
                <label class="form-label" for="orden">Ordenar por</label>
                <select id="orden" class="form-control form-control-sm" v-model="formPropiedades.orden">
                  <option value="">Sin orden</option>
                  <option value="precio_asc">Precio (menor a mayor)</option>
                  <option value="precio_desc">Precio (mayor a menor)</option>
                  <option value="estado">Estado</option>
                  <option value="tipo">Tipo de inmueble</option>
                  <option value="zona">Zona</option>
                  <option value="calle">Calle</option>
                  <option value="codigo">Código</option>
                </select>
              </div>

              <!-- Campo informacion a mostrar -->
              <div class="col-md-6 mt-2 ">
                <label for="" class="form-label">Información a mostrar</label>
                <div class="dropdown w-100 ">
                  <button class="form-control text-start dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" aria-expanded="false" id="infoDropdownBtn">
                    Selecciona la información a mostrar
                  </button>
                  <div class="dropdown-menu p-3 w-100" style="max-height: 280px; overflow: auto; min-width: 300px">
                    <div class="row" id="infoList">
                      <div v-for="campo in informacionMostrar" :key="campo.key" class="col-md-6 mb-2">
                        <div class="form-check">
                          <input class="form-check-input campo-checkbox" type="checkbox" :value="campo.key"
                            v-model="camposSeleccionados" :id="`campo-${campo.key}`" />
                          <label class="form-check-label" :for="`campo-${campo.key}`">
                            {{ campo.label }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-12 mt-2">

              </div>

              <!-- Botón para listar las propiedades -->
              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitPropiedadesAlquiler">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- Componente para generar PDF -->
      <ListadoPropiedad ref="listadoPropiedadRef" :formPropiedades="formPropiedades" />
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
    ListadoPropiedad,
  },

  setup() {
    const currentForm = ref('propiedades_alquiler')
    const propiedadBusqueda = usePropiedadBusqueda()
    const estados = ref([])
    const listadoPropiedadRef = ref(null)
    const camposSeleccionados = ref([])
    /** Columnas del listado (misma lógica que el Blade original). */
    const informacionMostrar = [
      { key: 'cod_alquiler', label: 'C. Alquiler' },
      { key: 'folio', label: 'Folio / Empresa' },
      { key: 'direccion', label: 'Dirección' },
      { key: 'zona', label: 'Zona' },
      { key: 'p_d', label: 'P / D' },
      { key: 'dormitorio', label: 'Dorm.' },
      { key: 'cochera', label: 'Cochera' },
      { key: 'inmueble', label: 'Inmueble' },
      { key: 'estado', label: 'Estado' },
      { key: 'precio', label: 'Precio' },
      { key: 'cartel', label: 'Cartel' },
      { key: 'foto', label: 'Foto' },
      { key: 'video', label: 'Videos' },
      { key: 'documentacion', label: 'Documentacion' },
      { key: 'usuario', label: 'Usuario' },
    ]

    // Inicializar todos los campos como seleccionados por defecto
    camposSeleccionados.value = informacionMostrar.map(campo => campo.key)

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
      pertenece: 'listadoPropiedadesAlquiler',
      orden: '',
      informacionMostrar
    })

    const formPropietarios = ref({
      propietario: '',
      pertenece: 'estadoPropietarioA',
    })

    const submitPropiedadesAlquiler = () => {
      // Conectar datos del composable con el formulario
      formPropiedades.value.calle = propiedadBusqueda.calleId?.value ?? ''
      formPropiedades.value.zona_id = propiedadBusqueda.zonasSeleccionadas?.value?.length
        ? propiedadBusqueda.zonasSeleccionadas.value
        : []
      formPropiedades.value.tipo = propiedadBusqueda.inmueblesSeleccionados?.value?.length
        ? propiedadBusqueda.inmueblesSeleccionados.value
        : []
      formPropiedades.value.informacionMostrar = camposSeleccionados.value

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
      camposSeleccionados,
      informacionMostrar,
      ...propiedadBusqueda,
    }
  },
}
</script>
