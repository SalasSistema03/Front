<template>
  <NavComponent />

  <div class="d-flex">
    <div class="col-3 px-3">
      <h5 class="mb-4">Listados Propiedades</h5>
      <div>
        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'propiedades_alquiler' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'propiedades_alquiler'">
          Listar Propiedades en {{ sector }}
        </div>

        <div class="btn w-100 btn-sm mb-2"
          :class="currentForm === 'propietarios_alquiler' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'propietarios_alquiler'">
          Listar Propietarios en {{ sector }}
        </div>

        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'informe_novedades' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'informe_novedades'" v-if="sector === 'Alquiler'">
          Informe de Novedades
        </div>

        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'ofrecimiento_venta' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'ofrecimiento_venta'" v-if="sector === 'Venta'">
          Listar Ofrecimiento
        </div>
        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'devoluciones' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'devoluciones'" v-if="sector === 'Venta'">
          Listar Devoluciones
        </div>
      </div>
      <h5 class="mb-4" v-if="sector === 'Venta'">Listados Asesores</h5>
      <div>
        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'criterios_activos' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'criterios_activos'" v-if="sector === 'Venta'">
          Listar Criterios Activos
        </div>
      </div>
      <div>
        <div class="btn w-100 btn-sm mb-2"
          :class="currentForm === 'consultas_ingresadas_fechas' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'consultas_ingresadas_fechas'" v-if="sector === 'Venta'">
          Listar Consultas Ingresadas por Fechas
        </div>
      </div>
      <div>
        <div class="btn w-100 btn-sm mb-2" :class="currentForm === 'conversaciones' ? 'btn-primary' : 'btn-light'"
          @click="currentForm = 'conversaciones'" v-if="sector === 'Venta'">
          Listar Conversaciones
        </div>
      </div>
    </div>

    <div class="right-panel col-9">
      <div v-if="currentForm === 'propiedades_alquiler'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Propiedades en {{ sector }}</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row" @submit.prevent="submitPropiedadesAlquiler">
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

              <div class="form-group col-md-3 px-1" v-if="props.sector === 'Alquiler'">
                <label class="form-label">Estado</label>
                <select v-model="formPropiedades.estado_id" class="form-control form-control-sm">
                  <option value="">Seleccione un estado</option>
                  <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                    {{ estado.name }}
                  </option>
                </select>
              </div>
              <div class="form-group col-md-3 px-1" v-else>
                <label class="form-label">Estado</label>
                <select v-model="formPropiedades.estado_id" class="form-control form-control-sm">
                  <option value="">Seleccione un estado</option>
                  <option v-for="estado in estadosVenta" :key="estado.id" :value="estado.id">
                    {{ estado.name }}
                  </option>
                </select>
              </div>

              <div class="form-group col-md-3 px-1">
                <label class="form-label">Cartel</label>
                <select v-model="formPropiedades.cartel" class="form-control form-control-sm">
                  <option value="">Seleccione un cartel</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                </select>
              </div>

              <div class="from-group col-md-3 px-1">
                <label class="form-label">Importe desde</label>
                <input type="number" class="form-control form-control-sm" v-model="formPropiedades.importe_minimo"
                  min="0" placeholder="Importe mínimo" />
              </div>
              <div class="from-group col-md-3 px-1">
                <label class="form-label">Importe hasta</label>
                <input type="number" class="form-control form-control-sm" v-model="formPropiedades.importe_maximo"
                  min="0" placeholder="Importe máximo" />
              </div>

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

              <div class="col-md-6 mt-2">
                <label for="" class="form-label">Información a mostrar</label>
                <div class="dropdown w-100">
                  <button class="form-control form-control-sm text-start dropdown-toggle listar_boton_selector"
                    type="text" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false"
                    id="infoDropdownBtn">
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
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitPropiedadesAlquiler"
                  :disabled="!permiso">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentForm === 'propietarios_alquiler'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Propietarios en {{ sector }}</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row">
              <div class="col-md-12 p-1 position-relative">
                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                  placeholder="Buscar por apellido o DNI..." v-model="busqueda" @input="buscar" autocomplete="off" />
                <ul v-if="sugerencias.length > 0" class="list-group position-absolute w-100 shadow-sm sugerencias-lista"
                  style="z-index: 1000; max-height: 200px; overflow-y: auto">
                  <li v-for="persona in sugerencias" :key="persona.id"
                    class="list-group-item list-group-item-action cursor-pointer py-1 small"
                    @click="seleccionarPersona(persona)">
                    {{ persona.apellido }}, {{ persona.nombre }} -
                    {{ persona.documento || 'Sin DNI' }}
                  </li>
                </ul>
              </div>

              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitPropietariosAlquiler"
                  >
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentForm === 'informe_novedades'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Informe de Novedades en {{ sector }}</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row">
              <div class="col-md-6 p-1">
                <label class="form-label">Desde</label>
                <input type="date" class="form-control form-control-sm" v-model="formInformeNovedades.desde"
                  :max="formInformeNovedades.hasta" required />
              </div>
              <div class="col-md-6 p-1">
                <label class="form-label">Hasta</label>
                <input type="date" class="form-control form-control-sm" v-model="formInformeNovedades.hasta"
                  :min="formInformeNovedades.desde" required />
              </div>

              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitInformeNovedades()"
                  :disabled="!permisoInformeNovedades">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentForm === 'ofrecimiento_venta'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Propietarios en {{ sector }}</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row">
              <div class="col-md-6 p-1">
                <label class="form-label">Desde</label>
                <input type="date" class="form-control form-control-sm" v-model="formOfrecimiento.fecha_desde"
                  required />
              </div>
              <div class="col-md-6 p-1">
                <label class="form-label">Hasta</label>
                <input type="date" class="form-control form-control-sm" v-model="formOfrecimiento.fecha_hasta"
                  required />
              </div>

              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitOfrecimientoVenta()"
                  :disabled="!permisoOfrecimiento">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentForm === 'devoluciones'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Devoluciones</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row">
              <div class="col-md-4 p-1">
                <label class="form-label">Codigo</label>
                <input type="number" class="form-control form-control-sm" v-model="formDevoluciones.codigo" />
              </div>

              <div class="col-md-4 p-1">
                <label class="form-label">Desde</label>
                <input type="date" class="form-control form-control-sm" v-model="formDevoluciones.desde" />
              </div>
              <div class="col-md-4 p-1">
                <label class="form-label">Hasta</label>
                <input type="date" class="form-control form-control-sm" v-model="formDevoluciones.hasta" />
              </div>

              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitDevoluciones()"
                  :disabled="!devolucionesVenta">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentForm === 'criterios_activos'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Criterios Activos</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row">
              <div class="col-md-3">
                <label>Asesores</label>
                <select class="form-control form-control-sm" v-model="formCriterios.asesor_id">
                  <option value="">Todos</option>
                  <option v-for="asesor in asesores" :key="asesor.id_usuario" :value="asesor.id_usuario">
                    {{ asesor.username }}
                  </option>
                </select>
              </div>

              <div class="form-group col-md-3 px-1">
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
              <div class="form-group col-md-3 px-1">
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
              <div class="form-group col-md-3 px-1">
                <label class="form-label">Dormitorio</label>
                <input type="number" class="form-control form-control-sm"
                  v-model="formCriterios.cantidad_dormitorios" />
              </div>
              <div class="form-group col-md-3">
                <label class="form-group">Precio Minimo</label>
                <input type="number" class="form-control form-control-sm" placeholder="$"
                  v-model="formCriterios.precio_minimo" />
              </div>
              <div class="form-group col-md-3">
                <label class="form-group">Precio Maximo</label>
                <input type="number" class="form-control form-control-sm" placeholder="$"
                  v-model="formCriterios.precio_maximo" />
              </div>
              <div class="form-group col-md-3">
                <label class="form-group">Estado</label>
                <select class="form-select form-select-sm" v-model="formCriterios.estado">
                  <option value="">Seleccione un estado</option>
                  <option value="Potable">Potable</option>
                  <option value="Medio">Medio</option>
                  <option value="No Potable">No Potable</option>
                </select>
              </div>

              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitCriteriosActivos()">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentForm === 'consultas_ingresadas_fechas'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Consultas Ingresadas por Fechas</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row">
              <div class="col-md-4 p-1">
                <label class="form-label">Desde</label>
                <input type="date" class="form-control form-control-sm" :max="formConsultasIngresadas.desde"
                  v-model="formConsultasIngresadas.desde" />
              </div>
              <div class="col-md-4 p-1">
                <label class="form-label">Hasta</label>
                <input type="date" class="form-control form-control-sm" :min="formConsultasIngresadas.desde"
                  v-model="formConsultasIngresadas.hasta" />
              </div>

              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitConsultasIngresadas()"
                  :disabled="!permisoCriteriosPorFecha">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentForm === 'conversaciones'" class="form-section">
        <div class="card border-primary mx-2">
          <div class="card-header bg-transparent border-primary">
            <label>Listar Conversaciones</label>
          </div>
          <div class="card-body text-primary form-group">
            <div class="row">
              <div class="col-md-3">
                <label>Asesores</label>
                <select class="form-control form-control-sm" v-model="formConversaciones.asesor_id">
                  <option value="">Todos</option>
                  <option v-for="asesor in asesores" :key="asesor.id_usuario" :value="asesor.id_usuario">
                    {{ asesor.username }}
                  </option>
                </select>
              </div>

              <div class="col-md-12 mt-2">
                <button type="button" class="btn btn-sm btn-primary w-100 mt-2" @click="submitConversaciones()"
                  :disabled="!permisoConversacion">
                  Listar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ListadoPropiedadPdf ref="listadoPropiedadRef" :formData="formActual" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, defineProps } from 'vue'
import NavComponent from '../../../components/NavComponent.vue'
import ListadoPropiedadPdf from '../../../components/Atcl/Listado/ListadoPropiedadPdf.vue'
import { usePropiedadBusqueda } from '../../../composables/atcl/usePropiedadBusqueda'
import { getEstadoAlquiler, verificarPermiso, getEstadoVenta } from '@/Services/api/Atcl/AtclApi'
import { PropietariosActivos } from '@/Services/api/Atcl/Listados/ListadoApi'
import { useToast } from '@/composables/useToast'
import { getAsesor } from '@/Services/api/Atcl/AtclApi'
import { isAdmin } from '../../../Services/business/auth'

const props = defineProps({
  sector: {
    type: String,
    required: true,
  },
})
const { showError } = useToast()
// Desestructuración del composable
const {
  calleSeleccionada,
  filtrarCalles,
  mostrarLista,
  ocultarSugerencias,
  mostrarSugerencias,
  callesFiltradas,
  seleccionarCalle,
  calleId,
  valorInputZonas,
  abrirZonas,
  cerrarZonas,
  mostrarZonas,
  zonasFiltradas,
  zonasSeleccionadas,
  valorInputInmuebles,
  abrirInmuebles,
  cerrarInmuebles,
  mostrarInmuebles,
  inmuebleFiltrados,
  inmueblesSeleccionados,
} = usePropiedadBusqueda()

// Estados reactivos
const currentForm = ref('propiedades_alquiler')
const estados = ref([])

const listadoPropiedadRef = ref(null)
const camposSeleccionados = ref([])
const permiso = ref(false)
const formActual = ref({})
const propietario = ref([])
const busqueda = ref('')
const sugerencias = ref([])
const personaSeleccionada = ref(null)
const informacionMostrar = ref([])
const estadosVenta = ref([])
const asesores = ref([])
const permisoOfrecimiento = ref(false)
const propietariosVenta = ref(false)
const propietariosAlquiler = ref(false)
const devolucionesVenta = ref(false)
const permisoCriteriosPorFecha = ref(false)
const permisoConversacion = ref(false)
const permisoInformeNovedades = ref(false)
const isUserAdmin = ref(false)

// Si es alquiler muestra un conjunto de columnas
// Si es venta muestra otro más amplio
if (props.sector === 'Alquiler') {
  informacionMostrar.value = [
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
    { key: 'reel', label: 'Reel' },
    { key: 'flyer', label: 'Flyer' },
    { key: 'captador', label: 'Captador' },
    { key: 'web', label: 'Web' },
  ]
} else {
  informacionMostrar.value = [
    { key: 'cod_venta', label: 'C. Venta' },
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
    { key: 'propietario', label: 'Propietario' },
    { key: 'fecha alta', label: 'Fecha alta' },
    { key: 'clausula venta', label: 'Clausula Venta' },
    { key: 'descripcion', label: 'Descripcion' },
    { key: 'llave', label: 'LLave' },
    { key: 'autorizacion', label: 'Autorizacion' },
    { key: 'compartida', label: 'Compartida' },
    { key: 'reel', label: 'Reel' },
    { key: 'flyer', label: 'Flyer' },
    { key: 'captador', label: 'Captador' },
    { key: 'zonaprop', label: 'ZonaProp' },
    { key: 'web', label: 'Web' },
    { key: 'vendedor', label: 'Vendedor' },
  ]
}

// Inicializar campos seleccionados
// toma todas las keys y las deja tildadas por defecto
camposSeleccionados.value = informacionMostrar.value.map((campo) => campo.key)

//Variables para guardar los datos del formulario
const formPropiedades = ref({
  calle: '',
  zona_id: '',
  tipo: '',
  estado_id: '',
  importe_minimo: '',
  importe_maximo: '',
  pertenece: 'listadoPropiedades',
  orden: '',
  informacionMostrar: [],
  sector: props.sector,
  cartel: '',
})

const formPropietarios = ref({
  propietario: '',
  sector: props.sector,
  pertenece: 'estadoPropietario',
})

const formOfrecimiento = ref({
  fecha_desde: '',
  fecha_hasta: '',
  sector: props.sector,
  pertenece: 'ofrecimientoVenta',
})

const formDevoluciones = ref({
  codigo: '',
  desde: '',
  hasta: '',
  sector: props.sector,
  pertenece: 'devoluciones',
})

const formCriterios = ref({
  asesor_id: '',
  estado: '',
  zona_id: '',
  tipo: '',
  cantidad_dormitorios: '',
  precio_minimo: '',
  precio_maximo: '',
  sector: props.sector,
  pertenece: 'criteriosActivos',
})

const formConsultasIngresadas = ref({
  desde: '',
  hasta: '',
  sector: props.sector,
  pertenece: 'consultasIngresadas',
})

const formConversaciones = ref({
  asesor_id: '',
  sector: props.sector,
  pertenece: 'conversaciones',
})

const formInformeNovedades = ref({
  desde: '',
  hasta: '',
  sector: props.sector,
  pertenece: 'informeNovedades',
})

// Carga de datos inicial
// cuando carga el componente trae estados, propietarios, permisos y asesores
onMounted(async () => {
  // Cargamos los asesores para el selector del formulario de criterios activos

  isUserAdmin.value = await isAdmin()
  //console.log(isUserAdmin.value)

  const [resEstados, resPropietarios, resEstadoVenta, resAsesores] = await Promise.all([
    getEstadoAlquiler(),
    PropietariosActivos(),
    getEstadoVenta(),
    getAsesor(),
  ])

  let resPermiso = null
  let resPermisoOfrecimiento = null
  let resPropietariosVenta = null
  let resPropietariosAlquiler = null
  let resDevoluciones = null
  let resPermisoCriteriosPorFecha = null
  let resConversacionVenta = null
  let respermisoNovedades = null

  if (props.sector === 'Alquiler') {
    //console.log('holaaaaaaaa')
    resPermiso = await verificarPermiso('listarPropiedadesAlquiler')
    resPropietariosAlquiler = await verificarPermiso('listarPropietarioAlquiler')
    respermisoNovedades = await verificarPermiso('listarInformeNovedades')
  } else {
    resPermiso = await verificarPermiso('listarPropiedadesVenta')
    resPermisoOfrecimiento = await verificarPermiso('listarOfrecimientoVenta')
    resPropietariosVenta = await verificarPermiso('listarPropietarioVenta')
    resDevoluciones = await verificarPermiso('listarDevolucionesVenta')
    resPermisoCriteriosPorFecha = await verificarPermiso('listarCriteriosPorFecha')
    resConversacionVenta = await verificarPermiso('listarConversacionesVenta')
  }
  estados.value = resEstados.data
  estadosVenta.value = resEstadoVenta.data
  permiso.value = resPermiso?.data ?? false
  propietario.value = resPropietarios.data
  permisoOfrecimiento.value = resPermisoOfrecimiento?.data ?? false
  propietariosVenta.value = resPropietariosVenta?.data ?? false
  propietariosAlquiler.value = resPropietariosAlquiler?.data ?? false
  devolucionesVenta.value = resDevoluciones?.data ?? false
  asesores.value = resAsesores.data ?? false
  permisoConversacion.value = resConversacionVenta?.data ?? false
  permisoInformeNovedades.value = respermisoNovedades?.data ?? false
  //console.log(propietariosVenta.value)

  //console.log(asesores.value)

  //si el usuario es admin que saque el id_usuario:3 del  asesores.value
  if (isUserAdmin.value === false) {
    asesores.value = asesores.value.filter(
      (a) => a.id_usuario !== 3 && a.id_usuario !== 4 && a.id_usuario !== 5 && a.id_usuario !== 18,
    )
  }

  permisoCriteriosPorFecha.value = resPermisoCriteriosPorFecha?.data ?? false
  //console.log('asesires', asesores.value)
})

// Lógica de búsqueda de propietarios
const buscar = () => {
  const texto = busqueda.value.trim().toLowerCase()
  if (!texto) {
    sugerencias.value = []
    personaSeleccionada.value = null
    formPropietarios.value.propietario = null
    return
  }
  const vistos = new Set()
  sugerencias.value = propietario.value
    .filter((p) => {
      if (vistos.has(p.id)) return false
      vistos.add(p.id)
      return (
        p.apellido?.toLowerCase().includes(texto) ||
        p.nombre?.toLowerCase().includes(texto) ||
        p.documento?.includes(texto)
      )
    })
    .slice(0, 20)
}

const seleccionarPersona = (persona) => {
  personaSeleccionada.value = persona
  busqueda.value = `${persona.apellido}, ${persona.nombre}`
  sugerencias.value = []
  formPropietarios.value.propietario = persona.id
}

// Submits
const submitPropiedadesAlquiler = async () => {
  formPropiedades.value.calle = calleId?.value ?? ''
  formPropiedades.value.zona_id = zonasSeleccionadas?.value ?? []
  formPropiedades.value.tipo = inmueblesSeleccionados?.value ?? []
  formPropiedades.value.informacionMostrar = camposSeleccionados.value

  formActual.value = formPropiedades.value
  await nextTick()
  listadoPropiedadRef.value?.generarPdf()
}

const submitPropietariosAlquiler = async () => {
  formPropietarios.value.propietario = personaSeleccionada.value?.id ?? null
  formActual.value = formPropietarios.value
  await nextTick()
  listadoPropiedadRef.value?.generarPdf()
}

const submitOfrecimientoVenta = async () => {
  //datos del form
  //console.log(formOfrecimiento.value)
  formActual.value = formOfrecimiento.value
  await nextTick()
  listadoPropiedadRef.value?.generarPdf()
}

const submitDevoluciones = async () => {
  //console.log(formDevoluciones.value)
  if (
    !formDevoluciones.value.codigo ||
    !formDevoluciones.value.desde ||
    !formDevoluciones.value.hasta
  ) {
    showError('Debe ingresar un codigo o rango de fechas')
    return
  }
  try {
    formActual.value = formDevoluciones.value
    await nextTick()
    listadoPropiedadRef.value?.generarPdf()
  } catch (e) {
    showError('Error al generar PDF en servidor')
    console.log
  }
}

const submitCriteriosActivos = async () => {
  formCriterios.value.zona_id = zonasSeleccionadas?.value ?? []
  formCriterios.value.tipo = inmueblesSeleccionados?.value ?? []

  formActual.value = formCriterios.value
  //console.log(formActual.value)
  await nextTick()
  listadoPropiedadRef.value?.generarPdf()
}

const submitConsultasIngresadas = async () => {
  formActual.value = formConsultasIngresadas.value
  await nextTick()
  listadoPropiedadRef.value?.generarPdf()
}

const submitConversaciones = async () => {
  formActual.value = formConversaciones.value
  await nextTick()
  listadoPropiedadRef.value?.generarPdf()
}

const submitInformeNovedades = async () => {
  if (!formInformeNovedades.value.desde || !formInformeNovedades.value.hasta) {
    showError('Debe especificar un rango de fechas')
    return
  }
  formActual.value = formInformeNovedades.value
  await nextTick()
  listadoPropiedadRef.value?.generarPdf()
}
</script>
