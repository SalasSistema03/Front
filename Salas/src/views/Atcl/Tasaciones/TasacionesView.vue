<template>
  <NavComponent />
  <div class="row mx-2">
    <div class="col-4">
      <div class="card">
        <div class="card-header d-flex align-items-center card-header-tasaciones" >
          <i class="bi bi-funnel me-3"></i>
          <p class="card-title pt-2">Filtro Tasaciones</p>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-12 form-group position-relative">
              <label for="filtro_calle">CALLE</label>
              <input type="text" id="filtro_calle" v-model="filtroCalle" @focus="mostrarSugerenciasCalle = true"
                @blur="ocultarSugerenciasCalleConRetraso" autocomplete="off" placeholder="Buscar por calle o número..."
                class="form-control form-control-sm" />
              <ul v-if="mostrarSugerenciasCalle && sugerenciasCalles.length"
                class="list-group position-absolute w-100 shadow sugerencias-predictivo">
                <li v-for="(opc, idx) in sugerenciasCalles" :key="idx"
                  class="list-group-item list-group-item-action cursor-pointer py-1 px-2 small"
                  @mousedown="seleccionarSugerenciaCalle(opc)">
                  <span class="fw-bold">{{ opc.calle }} {{ opc.numero }}</span>
                  <small v-if="opc.detalle" class="text-muted ms-1">({{ opc.detalle }})</small>
                </li>
              </ul>
            </div>

            <div class="col-md-7 form-group position-relative">
              <label for="filtro_propietario">PROPIETARIO</label>
              <input type="text" id="filtro_propietario" v-model="filtroPropietario"
                @focus="mostrarSugerenciasProp = true" @blur="ocultarSugerenciasPropConRetraso" autocomplete="off"
                placeholder="Nombre o apellido..." class="form-control form-control-sm" />
              <ul v-if="mostrarSugerenciasProp && sugerenciasPropietarios.length"
                class="list-group position-absolute w-100 shadow sugerencias-predictivo">
                <li v-for="(prop, idx) in sugerenciasPropietarios" :key="idx"
                  class="list-group-item list-group-item-action cursor-pointer py-1 px-2 small"
                  @mousedown="seleccionarSugerenciaProp(prop)">
                  <i class="bi bi-person me-1 text-primary"></i>
                  {{ prop.texto }}
                </li>
              </ul>
            </div>

            <div class="col-md-5 form-group">
              <label for="filtro_tasacion_informada">Tasacion Informada</label>
              <select id="filtro_tasacion_informada" v-model="filtroTasacionInformada"
                class="form-control form-control-sm">
                <option value="">Todas</option>
                <option v-for="opc in opcionesTasacionInformada" :key="opc" :value="opc">
                  {{ opc }}
                </option>
              </select>
            </div>

            <div class="col-md-6 form-group">
              <label for="fecha_inicio">Fecha desde</label>
              <input type="date" id="fecha_inicio" v-model="filtroFechaInicio" :max="filtroFechaFin || undefined"
                class="form-control form-control-sm" />
            </div>

            <div class="col-md-6 form-group">
              <label for="fecha_fin">Fecha hasta</label>
              <input type="date" id="fecha_fin" v-model="filtroFechaFin" :min="filtroFechaInicio || undefined"
                class="form-control form-control-sm" />
            </div>
            <div class="row">
              <div class="col-7 mt-3">
                <button type="button" class="btn btn-success btn-sm w-100" @click="abrirNuevaTasacion">
                  <i class="bi bi-plus-circle me-1"></i>
                  Nueva tasación
                </button>
              </div>
              <!--  <div class="col-md-4 mt-3">
                <button class="btn btn-primary w-100 btn-sm" @click="aplicarFiltros">
                  Filtrar
                </button>
              </div> -->
              <div class="col-md-4 mt-3">
                <!-- <i class="bi bi-arrow-counterclockwise fs-5 text-secondary" role="button" title="Limpiar filtros"
                  @click="limpiarFiltros"></i> -->
                <button class="btn btn-outline-secondary btn-sm w-100 shadow-sm" @click="limpiarFiltros">
                  <i class="bi bi-eraser"></i> Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-8">
      <div class="card card-alto-tasaciones">
        <div class="card-header d-flex align-items-center card-header-tasaciones">
          <i class="bi bi-info-circle me-3"></i>
          <p class="card-title pt-2">Informacion General</p>
        </div>
        <div class="card-body">
          <div class="row g-2">
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >
                  Tasaciones Totales
                </div>
                <div class="fw-bold fs-6">{{ metricas.totales }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >Ingresos</div>
                <div class="fw-bold fs-6">{{ metricas.ingresos }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >No Ingresados</div>
                <div class="fw-bold fs-6">{{ metricas.noIngresados }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >Venta</div>
                <div class="fw-bold fs-6">{{ metricas.venta }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >Alquiler</div>
                <div class="fw-bold fs-6">{{ metricas.alquiler }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >
                  No Ingresados
                </div>
                <div class="fw-bold fs-6">{{ metricas.porcentajeNoIngresados }}%</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >Porcentaje</div>
                <div class="fw-bold fs-6">{{ metricas.porcentajeIngresados }}%</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >
                  Tasaciones 2024
                </div>
                <div class="fw-bold fs-6">{{ metricas.anio2024 }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >
                  Tasaciones 2025
                </div>
                <div class="fw-bold fs-6">{{ metricas.anio2025 }}</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate box-texto-tasaciones" >Cancelados</div>
                <div class="fw-bold fs-6">{{ metricas.cancelados }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 mt-1">
      <div class="card">
        <div class="card-header d-flex align-items-center card-header-tasaciones">
          <i class="bi bi-table me-2"></i>
          <p class="card-title pt-2 mb-0">Listado de Tasaciones</p>
        </div>
        <div class="card-body ">
          <div class="tabla-tasaciones" >
            <table class="table table-striped table-hover proceso_reserva_table text-center align-middle">
              <thead>
                <tr>
                  <th>Inmueble</th>
                  <th>Calle</th>
                  <th>Folio</th>
                  <th>Propietario</th>
                  <th>Ingreso</th>
                  <th>Tipo Tasacion</th>
                  <th>Tasacion Venta</th>
                  <th>Tasacion Alquiler</th>
                  <th>Costo Tasacion</th>
                  <th>Tasacion Informada</th>
                  <th>Fecha</th>
                  <th class="acciones-tasaciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tasacion in tasacionesFiltradas" :key="tasacion.id">
                  <td>{{ tasacion.tipo_inmueble?.inmueble || '-' }}</td>
                  <td>
                    <div>{{ tasacion.calle_relacion?.name }} {{ tasacion.numero_calle }}</div>
                    <small class="text-muted" v-if="tasacion.piso || tasacion.departamento">
                      <span v-if="tasacion.piso">Piso {{ tasacion.piso }}</span>
                      <span v-if="tasacion.piso && tasacion.departamento"> </span>
                      <span v-if="tasacion.departamento">Depto {{ tasacion.departamento }}</span>
                    </small>
                  </td>
                  <td>{{ tasacion.folio || '-' }}</td>
                  <td>
                    {{ tasacion.propietario_relacion ? `${tasacion.propietario_relacion.nombre || ''}
                    ${tasacion.propietario_relacion.apellido || ''}`.trim() : (tasacion.propietario || '-') }}
                  </td>
                  <td>{{ tasacion.origen || '-' }}</td>
                  <td>{{ tasacion.tipo_tasacion || '-' }}</td>
                  <td>{{ tasacion.tasacion_venta ? `U$D ${formatearNumero(tasacion.tasacion_venta)}` : '-' }}</td>
                  <td>{{ tasacion.tasacion_alquiler ? `$ ${formatearNumero(tasacion.tasacion_alquiler)}` : '-' }}</td>
                  <td>{{ tasacion.costo_tasacion ? `$ ${formatearNumero(tasacion.costo_tasacion)}` : '-' }}</td>
                  <td>{{ formatearTasacionInformada(tasacion.tasacion_informada_prop) }}</td>
                  <td>{{ tasacion.fecha ? formatearFecha(tasacion.fecha) : '-' }}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm px-2 py-1 shadow-sm me-1"
                      title="Editar tasación"
                      aria-label="Editar tasación"
                      @click="editarTasacion(tasacion)"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm px-2 py-1 shadow-sm"
                      title="Ver tasación"
                      aria-label="Ver tasación"
                      @click="verTasacion(tasacion)"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="tasacionesFiltradas.length === 0">
                  <td colspan="12" class="text-muted py-3">
                    No se encontraron tasaciones con los filtros aplicados.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalTasacionesPropiedad :show="mostrarModalCarga" :tasacion-data="tasacionAEditar"
    :solo-lectura="modoSoloLectura" @close="cerrarModal" @tasacionCreada="traerTasaciones" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavComponent from '../../../components/NavComponent.vue'
import ModalTasacionesPropiedad from '../../../components/Atcl/Tasaciones/ModalTasacionesPropiedad.vue'
import { TasacionesActivas } from '../../../Services/api/Atcl/Tasaciones/TasacionesApi.js'
import { useDateFormatter } from '../../../composables/useDateFormatter'

const { formatDate } = useDateFormatter()

const formatearFecha = (fecha) => formatDate(fecha).replace(/\//g, '-')

const formatearNumero = (valor) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(Number(valor))

const formatearTasacionInformada = (valor) => {
  if (valor === null || valor === undefined || valor === '') return '-'
  const numero = Number(valor)
  return Number.isFinite(numero) && String(valor).trim() !== '' ? formatearNumero(valor) : valor
}

const mostrarModalCarga = ref(false)
const tasacionAEditar = ref(null)
const tasaciones = ref([])
const modoSoloLectura = ref(false)

const editarTasacion = (tasacion) => {
  tasacionAEditar.value = tasacion
  modoSoloLectura.value = false
  mostrarModalCarga.value = true
}

const verTasacion = (tasacion) => {
  tasacionAEditar.value = tasacion
  modoSoloLectura.value = true
  mostrarModalCarga.value = true
}

const abrirNuevaTasacion = () => {
  tasacionAEditar.value = null
  modoSoloLectura.value = false
  mostrarModalCarga.value = true
}

const cerrarModal = () => {
  mostrarModalCarga.value = false
  tasacionAEditar.value = null
  modoSoloLectura.value = false
}

// Estados de los filtros
const filtroCalle = ref('')
const filtroPropietario = ref('')
const filtroTasacionInformada = ref('')
const filtroFechaInicio = ref('')
const filtroFechaFin = ref('')

// Visibilidad de dropdowns predictivos
const mostrarSugerenciasCalle = ref(false)
const mostrarSugerenciasProp = ref(false)

const opcionesTasacionInformada = [
  'Cancelado',
  'No Pasado',
  'Pasado, Ingreso',
  'Pasado, No Ingreso',
  'Pendiente'
]

// Opciones predictivas únicas para Calle (sobre calle y número, mostrando piso y depto)
const sugerenciasCalles = computed(() => {
  const query = filtroCalle.value.trim().toLowerCase()
  if (!query) return []

  const mapa = new Map()

  for (const t of tasaciones.value) {
    const calleNombre = t.calle_relacion?.name || ''
    const numero = t.numero_calle ? String(t.numero_calle) : ''
    const combinada = `${calleNombre} ${numero}`.trim().toLowerCase()

    // El predictivo busca sobre la calle y número calle
    if (combinada.includes(query) || calleNombre.toLowerCase().includes(query) || numero.includes(query)) {
      const detallePartes = []
      if (t.piso) detallePartes.push(`Piso ${t.piso}`)
      if (t.departamento) detallePartes.push(`Depto ${t.departamento}`)
      const detalle = detallePartes.join(' ')

      const claveUnica = `${calleNombre}-${numero}-${detalle}`
      if (!mapa.has(claveUnica)) {
        mapa.set(claveUnica, {
          calle: calleNombre,
          numero: numero,
          detalle: detalle,
          textoBusqueda: `${calleNombre} ${numero}`.trim()
        })
      }
    }
  }

  return Array.from(mapa.values()).slice(0, 10)
})

const seleccionarSugerenciaCalle = (opc) => {
  filtroCalle.value = opc.textoBusqueda
  mostrarSugerenciasCalle.value = false
}

const ocultarSugerenciasCalleConRetraso = () => {
  setTimeout(() => {
    mostrarSugerenciasCalle.value = false
  }, 200)
}

// Opciones predictivas únicas para Propietarios (de las tasaciones cargadas)
const sugerenciasPropietarios = computed(() => {
  const query = filtroPropietario.value.trim().toLowerCase()
  if (!query) return []

  const mapa = new Map()

  for (const t of tasaciones.value) {
    let nombre = t.propietario_relacion?.nombre || ''
    let apellido = t.propietario_relacion?.apellido || ''
    let textoCompleto = `${nombre} ${apellido}`.trim()

    if (!textoCompleto && t.propietario) {
      textoCompleto = String(t.propietario)
    }

    if (!textoCompleto) continue

    const invertido = `${apellido} ${nombre}`.trim()

    if (
      textoCompleto.toLowerCase().includes(query) ||
      invertido.toLowerCase().includes(query)
    ) {
      if (!mapa.has(textoCompleto.toLowerCase())) {
        mapa.set(textoCompleto.toLowerCase(), {
          texto: textoCompleto
        })
      }
    }
  }

  return Array.from(mapa.values()).slice(0, 10)
})

const seleccionarSugerenciaProp = (prop) => {
  filtroPropietario.value = prop.texto
  mostrarSugerenciasProp.value = false
}

const ocultarSugerenciasPropConRetraso = () => {
  setTimeout(() => {
    mostrarSugerenciasProp.value = false
  }, 200)
}

// Filtrado de las tasaciones
const tasacionesFiltradas = computed(() => {
  return tasaciones.value.filter((t) => {
    // 1. Filtro Calle y Número
    if (filtroCalle.value.trim()) {
      const qCalle = filtroCalle.value.trim().toLowerCase()
      const calleNombre = (t.calle_relacion?.name || '').toLowerCase()
      const numero = t.numero_calle ? String(t.numero_calle).toLowerCase() : ''
      const calleNumero = `${calleNombre} ${numero}`.trim()

      const coincide =
        calleNumero.includes(qCalle) ||
        calleNombre.includes(qCalle) ||
        numero.includes(qCalle)

      if (!coincide) return false
    }

    // 2. Filtro Propietario
    if (filtroPropietario.value.trim()) {
      const qProp = filtroPropietario.value.trim().toLowerCase()
      const nombre = (t.propietario_relacion?.nombre || '').toLowerCase()
      const apellido = (t.propietario_relacion?.apellido || '').toLowerCase()
      const propCompleto = `${nombre} ${apellido}`.trim()
      const propInvertido = `${apellido} ${nombre}`.trim()
      const propRaw = t.propietario ? String(t.propietario).toLowerCase() : ''

      const coincide =
        propCompleto.includes(qProp) ||
        propInvertido.includes(qProp) ||
        propRaw.includes(qProp)

      if (!coincide) return false
    }

    // 3. Filtro Tasación Informada
    if (filtroTasacionInformada.value) {
      if (t.tasacion_informada_prop !== filtroTasacionInformada.value) {
        return false
      }
    }

    // 4. Filtro Rango de Fechas (incluye ambos extremos)
    if (filtroFechaInicio.value || filtroFechaFin.value) {
      const fechaTasacion = t.fecha ? String(t.fecha).slice(0, 10) : ''
      if (!fechaTasacion) return false
      if (filtroFechaInicio.value && fechaTasacion < filtroFechaInicio.value) return false
      if (filtroFechaFin.value && fechaTasacion > filtroFechaFin.value) return false
    }

    return true
  })
})

// Métricas de información general calculadas sobre las tasaciones mostradas (con o sin filtros)
const metricas = computed(() => {
  const lista = tasacionesFiltradas.value
  const totales = lista.length
  let ingresos = 0
  let noIngresados = 0
  let venta = 0
  let alquiler = 0
  let anio2024 = 0
  let anio2025 = 0
  let cancelados = 0

  for (const t of lista) {
    const estado = (t.tasacion_informada_prop || '').toLowerCase()
    if (estado.includes('ingreso') && !estado.includes('no ingreso')) {
      ingresos++
    }
    if (estado.includes('no ingreso') || estado === 'no pasado') {
      noIngresados++
    }
    if (estado === 'cancelado') {
      cancelados++
    }

    const tipo = (t.tipo_tasacion || '').toLowerCase()
    if (tipo.includes('venta')) venta++
    if (tipo.includes('alquiler')) alquiler++

    if (t.fecha) {
      if (t.fecha.startsWith('2024')) anio2024++
      if (t.fecha.startsWith('2025')) anio2025++
    }
  }

  const porcentajeNoIngresados = totales ? ((noIngresados / totales) * 100).toFixed(1) : 0
  const porcentajeIngresados = totales ? ((ingresos / totales) * 100).toFixed(1) : 0

  return {
    totales,
    ingresos,
    noIngresados,
    venta,
    alquiler,
    porcentajeNoIngresados,
    porcentajeIngresados,
    anio2024,
    anio2025,
    cancelados
  }
})

const limpiarFiltros = () => {
  filtroCalle.value = ''
  filtroPropietario.value = ''
  filtroTasacionInformada.value = ''
  filtroFechaInicio.value = ''
  filtroFechaFin.value = ''
}
const traerTasaciones = async () => {
  try {
    const response = await TasacionesActivas()
    tasaciones.value = response.data.data || []
  } catch (error) {
    console.error('Error al cargar tasaciones:', error)
  }
}

onMounted(() => {
  traerTasaciones()
})
</script>


