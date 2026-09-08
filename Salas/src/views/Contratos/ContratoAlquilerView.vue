<template>
  <NavComponent />
  <div class="px-2">
    <div class="card mx-2 shadow-sm border-0">

      <!-- Encabezado -->
      <div class="card-header bg-light border-bottom py-2">
        <div class="d-flex align-items-center">
          <i class="bi bi-funnel me-2"></i>
          <span class="fw-semibold">FILTRO CONTRATOS</span>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card-body py-3">
        <div class="row g-3 align-items-end">

          <!-- Mes -->
          <div class="col-md-2 form-group">
            <label class="form-label mb-1 small fw-semibold">
              Mes
            </label>

            <select v-model="mes" class="form-control form-control-sm">
              <option value="">Todos</option>
              <option :value="1">Enero</option>
              <option :value="2">Febrero</option>
              <option :value="3">Marzo</option>
              <option :value="4">Abril</option>
              <option :value="5">Mayo</option>
              <option :value="6">Junio</option>
              <option :value="7">Julio</option>
              <option :value="8">Agosto</option>
              <option :value="9">Septiembre</option>
              <option :value="10">Octubre</option>
              <option :value="11">Noviembre</option>
              <option :value="12">Diciembre</option>
            </select>
          </div>

          <!-- Año -->
          <div class="col-md-2 form-group">
            <label class="form-label mb-1 small fw-semibold">
              Año
            </label>

            <select v-model="anio" class="form-control form-control-sm">
              <option v-for="año in obtenerAñoMenos3()" :key="año" :value="año">
                {{ año }}
              </option>
            </select>
          </div>

          <!-- Estado -->
          <div class="col-md-2 form-group">
            <label class="form-label mb-1 small fw-semibold">
              Estado
            </label>

            <select v-model="filtroEstado" class="form-control form-control-sm">
              <option value="">Todos</option>

              <option v-for="estado in estadoContrato" :key="estado.id" :value="estado.id">
                {{ estado.estado }}
              </option>
            </select>
          </div>

          <!-- Asesor -->
          <div class="col-md-2 form-group">
            <label class="form-label mb-1 small fw-semibold">
              Asesor
            </label>

            <select v-model="filtroAsesor" class="form-control form-control-sm">
              <option value="">Todos</option>

              <option v-for="asesor in asesores" :key="asesor.id" :value="asesor.id">
                {{ asesor.usuario_username }}
              </option>
            </select>
          </div>

          <!-- Folio -->
          <div class="col-md-2 form-group">
            <label class="form-label mb-1 small fw-semibold">
              Folio
            </label>

            <input type="text" v-model="folio" class="form-control form-control-sm" placeholder="Ingrese folio">
          </div>

          <!-- Limpiar -->
          <div class="col-md-2">
            <button type="button" class="btn btn-outline-secondary btn-sm w-100" @click="limpiarFiltros">
              <i class="bi bi-x-circle me-1"></i>
              Limpiar
            </button>
          </div>

        </div>
      </div>

    </div>




    <div class="proceso_reserva_tabla_contenedor_contrato mt-3">

      <div class="card shadow-sm border-0" style="max-">

        <div class="card-header bg-light py-2">
          <div class="d-flex align-items-center justify-content-between">

            <div class="d-flex align-items-center">
              <i class="bi bi-file-earmark-text me-2 text-primary"></i>
              <span class="fw-semibold small">
                CONTRATOS
              </span>
            </div>

            <span class="text-muted small">
              {{ historial.length }} registros
            </span>

          </div>
        </div>

        <div class="table-responsive" style="min-height: 350px;">

          <table class="table table-hover align-middle mb-0 proceso_reserva_table">

            <thead>
              <tr class="text-center">

                <th>Folio</th>
                <th>Comercial</th>
                <th>Estado</th>

                <th>Inventario</th>
                <th>Carpeta</th>
                <th>Preaprobado</th>
                <th>Reserva</th>
                <th>Gastos Adm.</th>

                <th>Tirilla entregada</th>
                <th>Fecha entrega</th>

                <th>Tirilla controlada</th>
                <th>Fecha controlada</th>

                <th>Contrato</th>
                <th>Autorización</th>

                <th>Acciones</th>

              </tr>
            </thead>

            <tbody>

              <tr v-for="item in historial" :key="item.id">

                <!-- Folio -->
                <td class="text-center fw-semibold">
                  {{ formatearFolio(item.propiedad?.folios) }}
                </td>

                <!-- Comercial -->
                <td>
                  <span class="text-nowrap">
                    {{ item.asesor_usuario?.username || '—' }}
                  </span>
                </td>

                <!-- Estado -->
                <td class="text-center">

                  <span class="badge rounded-pill px-2 py-1"
                    :class="obtenerClaseEstado(item.historial_estado_contrato?.estado?.estado)">
                    {{ item.historial_estado_contrato?.estado?.estado || '—' }}
                  </span>

                </td>

                <!-- Inventario -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.historial_estado_contrato?.fecha_inventario) }}
                </td>

                <!-- Carpeta -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.historial_estado_contrato?.fecha_comercial_presenta_carpeta) }}
                </td>

                <!-- Preaprobado -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.historial_estado_contrato?.fecha_preaprobada) }}
                </td>

                <!-- Reserva -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.fecha_reserva) }}
                </td>

                <!-- Gastos administrativos -->
                <td class="text-center">
                  {{ item.historial_estado_contrato?.gastos_administrativos || '—' }}
                </td>

                <!-- Tirilla entregada por -->
                <td>
                  <span class="text-nowrap">
                    {{ item.historial_estado_contrato?.tirilla_entregada_por?.username || '—' }}
                  </span>
                </td>

                <!-- Fecha entrega -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.historial_estado_contrato?.fecha_tirilla_entregada) }}
                </td>

                <!-- Tirilla controlada por -->
                <td>
                  <span class="text-nowrap">
                    {{ item.historial_estado_contrato?.tirilla_controlada_por?.username || '—' }}
                  </span>
                </td>

                <!-- Fecha controlada -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.historial_estado_contrato?.fecha_tirilla_controlada) }}
                </td>

                <!-- Contrato -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.historial_estado_contrato?.fecha_contrato) }}
                </td>

                <!-- Autorización -->
                <td class="text-center fecha-contrato">
                  {{ formatDate(item.historial_estado_contrato?.fecha_autorizacion) }}
                </td>

                <!-- Acciones -->
                <td>
                  <div class=" ">
                    <button class="btn btn-secondary btn-sm p-0" type="button" data-bs-toggle="dropdown"
                      aria-expanded="false" title="Acciones">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu lista-mas-opciones-impuestos">
                      <li>
                        <button type="button" class="dropdown-item text-options-impuestos_lista"
                          @click="abrirModalContrato(item)">
                          <i class="bi bi-pencil me-2"></i>
                          Editar
                        </button>
                      </li>
                      <li>
                        <button type="button" class="dropdown-item text-options-impuestos_lista"
                          @click="abrirModalObservacionesContrato(item)">
                          <i class="bi bi-chat-left-text me-2"></i>
                          Observaciones
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>

              </tr>

            </tbody>

          </table>

        </div>
      </div>

    </div>
  </div>

  <ModalContrato :show="showModalContrato" :contrato="contratoSeleccionado" :estados="estadoContrato"
    @close="cerrarModalContrato" @guardar="guardarModalContrato" />

  <ModalObservacionesContrato :show="showModalObservacionesContrato" :contrato="contratoSeleccionado"
    :estados="estadoContrato" @close="cerrarModalObservacionesContrato" @guardar="guardarObservacionesContrato" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavComponent from '@/components/NavComponent.vue'
import ModalContrato from '@/components/Contrato/Contrato Nuevo/ModalContrato.vue'
import ModalObservacionesContrato from '@/components/Contrato/Contrato Nuevo/ModalObservacionesContrato.vue'
import { getEstadosContrato, getHistorialContrato, ActualizarEstadoContrato } from '@/Services/api/Contrato/Contrato'
import { asesoresAlquiler } from '@/Services/api/Atcl/Alquiler/Alquiler'
import { useToast } from '@/composables/useToast'
import { useDateFormatter } from '@/composables/useDateFormatter'

const route = useRoute()
const { formatDate } = useDateFormatter()

const historial = ref([])
const mes = ref(new Date().getMonth() + 1)
const anio = ref(new Date().getFullYear())
const estadoContrato = ref([])
const asesores = ref([])
const filtroEstado = ref('')
const filtroAsesor = ref('')
const folio = ref('')
//const inventario = ref('')
const { showError, showSuccess } = useToast()
const showModalContrato = ref(false)
const showModalObservacionesContrato = ref(false)
const contratoSeleccionado = ref(null)
const getForm = () => ({
  mes: mes.value,
  anio: anio.value,
  filtroEstado: filtroEstado.value,
  filtroAsesor: filtroAsesor.value,
  folio: folio.value,
})

//Obtenemos los 3 ultimos años
const obtenerAñoMenos3 = () => {
  let años = []
  for (let i = 0; i < 3; i++) {
    años.push(new Date().getFullYear() - i)
  }
  return años
}
//Obtenemos los estados de los contratos para mostrarlos en el filtro
const asignarEstadoContrato = async () => {
  const response = await getEstadosContrato()
  estadoContrato.value = response.data.resultado
  //console.log(estadoContrato.value)
}
//Obtenemos todos los asesores de alquiler
const obtenerAsesores = async () => {
  const response = await asesoresAlquiler()
  asesores.value = response.data
    .filter((asesor) => asesor.alquiler === 'S')
    .map((asesor) => ({
      id: asesor.usuario_id ?? asesor.usuario?.id,
      usuario_username: asesor.usuario_username
    }))
}

//observador para verificar si cambia el mes, año, estado, asesor o folio
watch([mes, anio, filtroEstado, filtroAsesor, folio], () => {
  const form = {
    mes: mes.value,
    anio: anio.value,
    filtroEstado: filtroEstado.value,
    filtroAsesor: filtroAsesor.value,
    folio: folio.value,
  }
  //si cambia llamamos a listado
  listado(form)
})

const listado = async (form) => {
  try {
    const res = await getHistorialContrato(form)
    historial.value = res.data.resultado
    //console.log('Respuesta del servidor:', res.data)
  }
  catch (error) {
    console.log(error)
    showError('Error al obtener el listado')
  }
}

const abrirModalContrato = (item) => {
  //console.log('Contrato seleccionado:', item)
  contratoSeleccionado.value = item
  showModalContrato.value = true
}

const abrirModalObservacionesContrato = (item) => {
  console.log('Contrato seleccionado para observaciones:', item)
  contratoSeleccionado.value = item
  showModalObservacionesContrato.value = true
}

const cerrarModalContrato = () => {
  showModalContrato.value = false
  contratoSeleccionado.value = null
}

const cerrarModalObservacionesContrato = () => {
  showModalObservacionesContrato.value = false
  contratoSeleccionado.value = null
}

const limpiarFiltros = () => {
  mes.value = new Date().getMonth() + 1
  anio.value = new Date().getFullYear()
  filtroEstado.value = ''
  filtroAsesor.value = ''
  folio.value = ''
}

const obtenerClaseEstado = (estado) => {
  if (!estado) return 'bg-secondary text-white'
  const s = estado.toLowerCase()
  if (s.includes('activo') || s.includes('vigente')) return 'bg-success text-white'
  if (s.includes('rescindi') || s.includes('cancel') || s.includes('rechaz')) return 'bg-danger text-white'
  if (s.includes('pendiente') || s.includes('proceso')) return 'bg-warning text-dark'
  return 'bg-secondary text-white'
}

const guardarObservacionesContrato = async (formData) => {
  try {
    await ActualizarEstadoContrato(formData)
    showSuccess('Observaciones guardadas correctamente')
    showModalObservacionesContrato.value = false
    listado(getForm())
  }
  catch (error) {
    console.log(error)
    showError('Error al guardar las observaciones')
  }
}

const guardarModalContrato = async (formData) => {
  try {
    await ActualizarEstadoContrato(formData)
    showSuccess('Datos de contrato listos para guardar ')
    showModalContrato.value = false
    listado(getForm())
  }
  catch (error) {
    showError(error.response.data.error)
  }
}

const formatearFolio = (folios) => {
  if (!folios || folios.length === 0) return '-'
  return (
    folios
      .filter((f) => f.folio)
      .map((f) => {
        const num = f.folio
        if (f.empresa_id === 1) return `${num}`
        if (f.empresa_id === 2) return `CAN ${num}`
        if (f.empresa_id === 3) return `TRIB ${num}`
        return `${num}`
      })
      .join(' / ') || '-'
  )
}

onMounted(() => {
  asignarEstadoContrato()
  obtenerAsesores()

  // Leer query params desde la notificación
  if (route.query.folio) {
    folio.value = route.query.folio
    mes.value = ''
  }

  listado(getForm())

})
</script>
