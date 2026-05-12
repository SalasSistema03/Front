<template>
  <NavComponent />

  <div class="d-flex">
    <!-- Contenedor Izquierdo: Listado con Scroll -->
    <!-- quiero que se muestre el boton cuando lo apunto -->
    <div class="col-3 px-3">
      <h5 class="mb-4">Listados</h5>
      <div>
        <div
          class="btn w-100 btn-sm mb-2"
          :class="currentForm === 'propiedades_venta' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'propiedades_venta'"
        >
          Listar Propiedades en Venta
        </div>
        <div
          class="btn w-100 btn-sm mb-2"
          :class="currentForm === 'propietarios_venta' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'propietarios_venta'"
        >
          Listar Propietarios en Venta
        </div>
      </div>
    </div>

    <!-- Contenedor Derecho: Contenido Estático (Formularios Predefinidos) -->
    <div class="right-panel col-9">
      <!-- Formulario de Propiedades en Venta -->
      <div v-if="currentForm === 'propiedades_venta'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Propiedades en Venta</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row" @submit.prevent="submitPropiedadesVenta">
              <div class="form-group col-md-4 px-1">
                <label for="input-calle" class="form-label">Calle</label>
                <div class="position-relative">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="input-calle"
                    placeholder="Calle"
                    v-model="calleSeleccionada"
                    @input="filtrarCalles"
                    @focus="mostrarLista"
                    @blur="ocultarSugerencias"
                    autocomplete="off"
                  />

                  <ul
                    v-if="mostrarSugerencias && callesFiltradas.length"
                    class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm busqueda-select"
                  >
                    <li
                      v-for="calle in callesFiltradas"
                      :key="calle.id"
                      @mousedown="seleccionarCalle(calle)"
                      class="px-3 py-2 cursor-pointer hover:bg-light"
                    >
                      {{ calle.name }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="form-group col-md-4 px-1">
                <label for="input-zona" class="form-label">Zona</label>
                <div class="position-relative">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Buscar zona..."
                    v-model="valorInputZonas"
                    @focus="abrirZonas"
                    @blur="cerrarZonas"
                  />

                  <div
                    v-if="mostrarZonas"
                    class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                    style="max-height: 150px; overflow-y: auto; z-index: 1000"
                    @mousedown.prevent="abrirZonas"
                  >
                    <div v-for="zona in zonasFiltradas" :key="zona.id" class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="zona.id"
                        v-model="zonasSeleccionadas"
                        :id="`zona-${zona.id}`"
                      />
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
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Buscar tipo inmueble..."
                    v-model="valorInputInmuebles"
                    @focus="abrirInmuebles"
                    @blur="cerrarInmuebles"
                  />

                  <div
                    v-if="mostrarInmuebles"
                    class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                    style="max-height: 150px; overflow-y: auto; z-index: 1000"
                    @mousedown.prevent="abrirInmuebles"
                  >
                    <div
                      v-for="inmueble in inmuebleFiltrados"
                      :key="inmueble.id"
                      class="form-check"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="inmueble.id"
                        v-model="inmueblesSeleccionados"
                        :id="`inmueble-${inmueble.id}`"
                      />
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
                  <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                    {{ estado.name }}
                  </option>
                </select>
              </div>

              <div class="from-group col-md-4 px-1">
                <label class="form-label">Importe desde</label>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  v-model="formPropiedades.importe_minimo"
                  min="0"
                  placeholder="Importe mínimo"
                />
              </div>
              <div class="from-group col-md-4 px-1">
                <label class="form-label">Importe hasta</label>
                <input
                  type="number"
                  class="form-control form-control-sm"
                  v-model="formPropiedades.importe_maximo"
                  min="0"
                  placeholder="Importe máximo"
                />
              </div>

              <div class="col-md-6 mt-2">
                <label class="form-label" for="orden">Ordenar por</label>
                <select
                  id="orden"
                  v-model="formPropiedades.orden"
                  class="form-control form-control-sm"
                >
                  <option value="">Sin orden</option>
                  <option value="precio_asc">Precio (menor a mayor)</option>
                  <option value="precio_desc">Precio (mayor a menor)</option>
                  <option value="estado">Estado</option>
                  <option value="tipo">Tipo de inmueble</option>
                  <option value="zona">Zona</option>
                  <option value="calle">Calle</option>
                  <option value="codigo">Codigo</option>
                </select>
              </div>

              <div class="col-md-6 mt-2">
                <label class="form-label" for="infoDropdownBtn">Información a mostrar</label>
                <div class="dropdown w-100">
                  <button
                    id="infoDropdownBtn"
                    class="form-control form-control-sm text-start dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                  >
                    {{ textoResumenCamposInformacion }}
                  </button>
                  <div
                    class="dropdown-menu p-3 w-100"
                    style="max-height: 280px; overflow: auto; min-width: 300px"
                  >
                    <div class="row" id="infoList">
                      <div
                        v-for="campo in camposInformacionListado"
                        :key="campo.key"
                        class="col-md-6 mb-2"
                      >
                        <div class="form-check">
                          <input
                            class="form-check-input campo-checkbox"
                            type="checkbox"
                            :value="campo.key"
                            v-model="formPropiedades.campos_seleccionados"
                            :id="`campo_${campo.key}`"
                          />
                          <label class="form-check-label" :for="`campo_${campo.key}`">
                            {{ campo.label }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-12 mt-2">
                <button
                  type="button"
                  class="btn btn-sm btn-primary w-100 mt-2"
                  @click="submitPropiedadesVenta"
                >
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Componente para generar PDF -->
      <ListadoPropiedad ref="listadoPropiedadRef" :formPropiedades="formPropiedades" />

      <!-- Formulario de Propietarios en Venta -->
      <div v-if="currentForm === 'propietarios_venta'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Propietarios en Venta</label>
          </div>
          <div class="card-body text-primary">
            <form class="row" @submit.prevent="submitPropietariosVenta">
              <div class="col-md-12 form-group px-1">
                <label class="form-label">Propietario</label>
                <input type="text" v-model="formPropietarios.propietario" 
                  class="form-control form-control-sm" placeholder="Buscar propietarios por nombre o dni"/>
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
import { ref, computed } from 'vue'
import { getEstadoVenta } from '@/Services/api/Atcl/AtclApi'

/** Columnas del listado (misma lógica que el Blade original). */
const CAMPOS_INFORMACION_LISTADO = [
  { key: 'c_venta', label: 'C. Venta' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'zona', label: 'Zona' },
  { key: 'p_d', label: 'P / D' },
  { key: 'inm', label: 'Inm.' },
  { key: 'ph', label: 'PH' },
  { key: 'e_venta', label: 'E. Venta' },
  { key: 'autorizacion', label: 'Autorización' },
  { key: 'exclusivo', label: 'Exclusivo' },
  { key: 'condicionada', label: 'Condicionada' },
  { key: 'comparte', label: 'Comparte' },
  { key: 'llave', label: 'Llave' },
  { key: 'cartel', label: 'Cartel' },
  { key: 'precio', label: 'Precio' },
  { key: 'propietario', label: 'Propietario' },
  { key: 'folio', label: 'Folio' },
  { key: 'dormitorio', label: 'Dormitorio' },
  { key: 'cochera', label: 'Cochera' },
  { key: 'foto', label: 'Foto' },
  { key: 'video', label: 'Video' },
  { key: 'documentacion', label: 'Documentación' },
]

const defaultCamposSeleccionados = () => CAMPOS_INFORMACION_LISTADO.map((c) => c.key)

export default {
  components: {
    NavComponent,
    ListadoPropiedad,
  },

  setup() {
    const currentForm = ref('propiedades_venta')
    const propiedadBusqueda = usePropiedadBusqueda()
    const estados = ref([])
    const listadoPropiedadRef = ref(null)

    const getEstados = async () => {
      const response = await getEstadoVenta()
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
      orden: '',
      campos_seleccionados: defaultCamposSeleccionados(),
      pertenece: 'listadoPropiedadesVenta',
    })

    const formPropietarios = ref({
      propietario: '',
      pertenece: 'estadoPropietarioA',
    })

    const textoResumenCamposInformacion = computed(() => {
      const total = CAMPOS_INFORMACION_LISTADO.length
      const n = formPropiedades.value.campos_seleccionados?.length ?? 0
      if (n === 0) return 'Ninguna columna seleccionada'
      if (n === total) return 'Todas las columnas'
      return `${n} de ${total} columnas`
    })

    const submitPropiedadesVenta = () => {
      formPropiedades.value.calle = propiedadBusqueda.calleId?.value ?? ''
      formPropiedades.value.zona_id = propiedadBusqueda.zonasSeleccionadas?.value?.length
        ? propiedadBusqueda.zonasSeleccionadas.value
        : []
      formPropiedades.value.tipo = propiedadBusqueda.inmueblesSeleccionados?.value?.length
        ? propiedadBusqueda.inmueblesSeleccionados.value
        : []

      console.log('Formulario propiedades venta:', formPropiedades.value)

      if (listadoPropiedadRef.value) {
        listadoPropiedadRef.value.generarPdf()
      }
    }

    const submitPropietariosVenta = () => {
      console.log('Formulario propietarios venta:', formPropietarios.value)
    }

    return {
      currentForm,
      estados,
      formPropiedades,
      formPropietarios,
      camposInformacionListado: CAMPOS_INFORMACION_LISTADO,
      textoResumenCamposInformacion,
      submitPropiedadesVenta,
      submitPropietariosVenta,
      listadoPropiedadRef,
      ...propiedadBusqueda,
    }
  },
}
</script>
