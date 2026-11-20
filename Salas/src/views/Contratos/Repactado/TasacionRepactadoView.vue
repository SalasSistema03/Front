<template>
  <NavComponent />

  <main class="tasacion-repactado-page container-fluid px-2 ">
    <!-- <div class="d-flex align-items-center gap-2 mb-3">
      <div class="tasacion-repactado-heading-icon">
        <i class="bi bi-clipboard2-check"></i>
      </div>
      <div>
        <h1 class="h5 mb-1">Tasaciones de Repactados</h1>
        <p class="mb-0 text-muted small">Seleccioná una propiedad para registrar su nueva tasación.</p>
      </div>
    </div> -->

    <section class="card shadow-sm mb-3" aria-labelledby="filtro-tasaciones-heading">
      <div class="card-header d-flex align-items-center card-header-tasaciones">
        <!-- <i class="bi bi-funnel me-2"></i> -->
        <i class="bi bi-clipboard2-check"></i>
        <div>

        <p class="mb-1">Tasaciones de Repactados</p>
       <!--  <p class="mb-0 text-muted small">Seleccioná una propiedad para registrar su nueva tasación.</p> -->

        </div>

        <!-- <p id="filtro-tasaciones-heading" class="mb-0">Propiedades que requieren tasación</p> -->
      </div>
      <div class="card-body p-2">
        <form class="row g-2 align-items-end" @submit.prevent="filtrarRepactados">
          <div class="col-6 col-md-2 tasacion-repactado-field">
            <label for="mes" class="form-label">Mes</label>
            <select id="mes" v-model="mesSeleccionado" class="form-select form-select-sm">
              <option value="">Todos</option>
              <option v-for="(mes, index) in meses" :key="mes" :value="index + 1">{{ mes }}</option>
            </select>
          </div>
          <div class="col-6 col-md-1 tasacion-repactado-field">
            <label for="anio" class="form-label">Año</label>
            <input id="anio" v-model="anioSeleccionado" type="number" class="form-control form-control-sm"
              placeholder="Todos">
          </div>
          <div class="col-12 col-md-2 tasacion-repactado-field">
            <label for="empresa" class="form-label">Empresa</label>
            <select id="empresa" v-model="empresaSeleccionada" class="form-select form-select-sm">
              <option value="">Todas</option>
              <option value="1">Atilio Salas SRL</option>
              <option value="2">Dolly J. Pianesi</option>
              <option value="3">Giusiano Maria Florencia</option>
            </select>
          </div>
          <div class="col-6 col-md-1 tasacion-repactado-field">
            <label for="folio" class="form-label">Folio</label>
            <input id="folio" v-model="folioSeleccionado" type="number" min="0" max="100000"
              class="form-control form-control-sm" placeholder="Todos">
          </div>
          <div class="col-6 col-md-2 tasacion-repactado-field">
            <label for="estado" class="form-label">Estado</label>
            <select id="estado" v-model="estadoSeleccionado" class="form-select form-select-sm">
              <option value="">Todos</option>
              <option v-for="estado in estados" :key="estado.id" :value="estado.id">{{ estado.estado }}</option>
            </select>
          </div>
          <div class="col-12 col-md-2 tasacion-repactado-field">
            <label for="direccion" class="form-label">Dirección</label>
            <input id="direccion" v-model.trim="direccionSeleccionada" type="text" maxlength="255"
              class="form-control form-control-sm" placeholder="Buscar por dirección">
          </div>
          <div class="col-12 col-md-1 tasacion-repactado-field">
            <label for="usuario" class="form-label">Usuario</label>
            <input id="usuario" v-model.trim="usuarioSeleccionado" type="text" maxlength="100"
              class="form-control form-control-sm" placeholder="Nombre o usuario">
          </div>
          <div class="col-12 col-md-1">
            <button type="submit" class="btn btn-primary btn-sm w-100" :disabled="cargando">
              <span v-if="cargando" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
              <i v-else class="bi bi-search me-1"></i>
              {{ cargando ? '...' : 'Buscar' }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <section class="card shadow-sm" aria-labelledby="listado-tasaciones-heading">
      <div class="card-header d-flex align-items-center justify-content-between card-header-tasaciones">
        <div class="d-flex align-items-center">
          <i class="bi bi-table me-2"></i>
          <p id="listado-tasaciones-heading" class="mb-0">Listado de propiedades</p>
        </div>
        <span class="badge text-bg-light">{{ repactados.length }} propiedades</span>
      </div>
      <div class="card-body">
        <div v-if="cargando" class="tasacion-repactado-list-empty">
          <div class="spinner-border text-primary" role="status" aria-label="Cargando listado"></div>
          <span class="text-muted">Buscando propiedades...</span>
        </div>
        <div v-else-if="repactados.length" class="table-responsive repactado_tabla_contenedor">
          <table class="table table-striped table-hover proceso_reserva_table text-center align-middle mb-0">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Estado</th>
                <th>Vencimiento</th>
                <th>Inquilino</th>
                <th>Dirección</th>
                <th>Propietario</th>
                <th>Nuevo alquiler</th>
                <th>Tasación registrada</th>
                <th>Usuario</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="repactado in repactados" :key="repactado.id">
                <td class="fw-semibold">{{ repactado.folio || '—' }}</td>
                <td>{{ repactado.estado || 'Pendiente' }}</td>
                <td>{{ formatearFecha(repactado.vencimientoContrato || repactado.cierre) }}</td>
                <td>
                  <div>{{ repactado.apellidoNombre || '—' }}</div>
                  <small v-if="repactado.telefono" class="text-muted">{{ repactado.telefono }}</small>
                </td>
                <td class="text-start">{{ repactado.direccion || '—' }}</td>
                <td>
                  <div>{{ repactado.propietario || '—' }}</div>
                  <small v-if="repactado.telefonoPropietario" class="text-muted">{{ repactado.telefonoPropietario }}</small>
                </td>
                <td>{{ formatearMonto(repactado.nuevo) }}</td>
                <td class="text-start">
                  <div v-if="repactado.tasacionDolarVenta != null" class="text-nowrap">
                    Venta: {{ formatearPrecioTasacion(repactado.tasacionDolarVenta, 'U$S') }}
                  </div>
                  <div v-else-if="repactado.tasacionPesosVenta != null" class="text-nowrap">
                    Venta: {{ formatearPrecioTasacion(repactado.tasacionPesosVenta, '$') }}
                  </div>
                  <div v-if="repactado.tasacionAlquiler != null" class="text-nowrap">
                    Alquiler: {{ formatearPrecioTasacion(repactado.tasacionAlquiler, '$') }}
                  </div>
                  <small v-if="repactado.fechaTasacion" class="d-block text-muted">
                    Fecha: {{ formatearFecha(repactado.fechaTasacion) }}
                  </small>
                  <span
                    v-if="repactado.tasacionDolarVenta == null && repactado.tasacionPesosVenta == null && repactado.tasacionAlquiler == null"
                    class="text-muted">
                    Sin tasación
                  </span>
                </td>
                <td>{{ repactado.usuarioTasacion || '—' }}</td>
                <td>
                  <button type="button" class="btn btn-primary btn-sm text-nowrap"
                    :disabled="!repactado.propiedadId || !repactado.empresaPropiedadId"
                    @click="abrirTasacion(repactado)">
                    <i class="bi bi-pencil-square me-1"></i>Cargar tasación
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="!busquedaRealizada" class="tasacion-repactado-list-empty">
          <i class="bi bi-funnel"></i>
          <h2 class="h6 mb-1">Completá al menos un filtro</h2>
          <p class="small text-muted mb-0">Podés buscar solo por folio, estado, dirección o usuario.</p>
        </div>
        <div v-else class="tasacion-repactado-list-empty">
          <i class="bi bi-house-check"></i>
          <h2 class="h6 mb-1">No hay propiedades para tasar</h2>
          <p class="small text-muted mb-0">Probá con otros criterios de búsqueda.</p>
        </div>
      </div>
    </section>

    <ModalTasacionRepactado :show="mostrarModal" :repactado="repactadoSeleccionado"
      @close="cerrarModal" @saved="filtrarRepactados" />
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import NavComponent from '@/components/NavComponent.vue'
import ModalTasacionRepactado from '@/components/Atcl/Repactado/ModalTasacionRepactado.vue'
import { getEstadosRepactado, getRepactadoFiltrado } from '@/Services/api/Contrato/Repactado'
import { useToast } from '@/composables/useToast'

const { handleApiError, showError } = useToast()
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const mesSeleccionado = ref('')
const anioSeleccionado = ref('')
const empresaSeleccionada = ref('')
const folioSeleccionado = ref('')
const estadoSeleccionado = ref('')
const direccionSeleccionada = ref('')
const usuarioSeleccionado = ref('')
const estados = ref([])
const repactados = ref([])
const cargando = ref(false)
const busquedaRealizada = ref(false)
const mostrarModal = ref(false)
const repactadoSeleccionado = ref(null)

const cargarEstados = async () => {
  try {
    const { data } = await getEstadosRepactado()
    estados.value = data?.data ?? []
  } catch (error) {
    handleApiError(error)
  }
}

const validarFiltros = () => {
  const mes = String(mesSeleccionado.value ?? '').trim()
  const anio = String(anioSeleccionado.value ?? '').trim()
  const empresa = String(empresaSeleccionada.value ?? '').trim()
  const folio = String(folioSeleccionado.value ?? '').trim()
  const estado = String(estadoSeleccionado.value ?? '').trim()
  const direccion = direccionSeleccionada.value.trim()
  const usuario = usuarioSeleccionado.value.trim()

  if (mes && (!Number.isInteger(Number(mes)) || Number(mes) < 1 || Number(mes) > 12)) {
    showError('Seleccioná un mes válido.')
    return false
  }

  if (anio && !/^\d{4}$/.test(anio)) {
    showError('Ingresá un año válido de cuatro dígitos.')
    return false
  }

  if (empresa && !['1', '2', '3'].includes(empresa)) {
    showError('Seleccioná una empresa válida.')
    return false
  }

  if (folio && (!/^\d+$/.test(folio) || Number(folio) > 100000)) {
    showError('El folio debe ser un número entre 0 y 100000.')
    return false
  }

  if (estado && !estados.value.some((opcion) => String(opcion.id) === estado)) {
    showError('Seleccioná un estado válido.')
    return false
  }

  if (![mes, anio, empresa, folio, estado, direccion, usuario].some(Boolean)) {
    showError('Ingresá al menos un filtro para buscar.')
    return false
  }

  return true
}

const filtrarRepactados = async () => {
  if (!validarFiltros()) return

  const filtros = {
    folio: folioSeleccionado.value === '' ? null : Number(folioSeleccionado.value),
    mes: mesSeleccionado.value === '' ? null : Number(mesSeleccionado.value),
    anio: anioSeleccionado.value === '' ? null : Number(anioSeleccionado.value),
    empresa: empresaSeleccionada.value || null,
    estado: estadoSeleccionado.value || null,
    direccion: direccionSeleccionada.value.trim() || null,
    usuario: usuarioSeleccionado.value.trim() || null,
  }

  cargando.value = true
  busquedaRealizada.value = true
  try {
    const { data } = await getRepactadoFiltrado(
      filtros.folio,
      filtros.mes,
      filtros.anio,
      filtros.empresa,
      {
        estado: filtros.estado,
        direccion: filtros.direccion,
        usuario: filtros.usuario,
      }
    )
    repactados.value = data?.data ?? []
  } catch (error) {
    repactados.value = []
    handleApiError(error)
  } finally {
    cargando.value = false
  }
}

const formatearMonto = (monto) => {
  if (monto === null || monto === undefined || monto === '') return '—'
  return `$ ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(Number(monto))}`
}

const formatearPrecioTasacion = (monto, moneda) => {
  if (monto === null || monto === undefined || monto === '') return '—'
  return `${moneda} ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(Number(monto))}`
}

const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  const [anio, mes, dia] = String(fecha).slice(0, 10).split('-')
  if (!anio || !mes || !dia) return fecha
  return `${dia}/${mes}/${anio}`
}

const abrirTasacion = (repactado) => {
  repactadoSeleccionado.value = repactado
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  repactadoSeleccionado.value = null
}

onMounted(cargarEstados)
</script>
