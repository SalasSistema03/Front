<template>
  <NavComponent />
  <div class="px-2">
    <div class="col-md-12 form-group row">
      <div class=" col-md-2">
        <label>Mes</label>
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
      <div class="col-md-1">
        <label>Año</label>
        <select v-model="anio" class="form-control form-control-sm">
          <option v-for="año in obtenerAñoMenos3()" :key="año" :value="año">{{ año }}</option>


        </select>
      </div>
      <div class="col-md-2">
        <label for="">Estado</label>
        <select v-model="filtroEstado" class="form-control form-control-sm">
          <option value="">Todos</option>
          <option v-for="estado in estadoContrato" :key="estado.id" :value="estado.id">{{ estado.estado }}</option>

        </select>
      </div>
      <div class="col-md-1">
        <label for="">Asesor</label>
        <select v-model="filtroAsesor" class="form-control form-control-sm">
          <option value="">Todos</option>
          <option v-for="asesor in asesores" :key="asesor.id" :value="asesor.id">{{ asesor.usuario_username }}</option>

        </select>
      </div>
      <div class="col-md-1">
        <label for="">Folio</label>
        <input type="text" v-model="folio" class="form-control form-control-sm">
      </div>


    </div>


    <div class="proceso_reserva_tabla_contenedor mt-2">
      <table class="table table-striped table-hover proceso_reserva_table">
        <thead>
          <tr class="text-center">
            <th>Folio</th>
            <th>Estado</th>
            <th>Inventario</th>
            <th>Comercial presento carpeta</th>
            <th>Preaprobado</th>
            <th>Reserva</th>
            <th>Gastos Adm.</th>
            <th>Tirilla entragada</th>
            <th>Fecha entrega</th>
            <th>Tirilla controlada</th>
            <th>Fecha controlada</th>
            <th>Fecha Contrato</th>
            <th>Fecha Autorizacion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historial" :key="item.id">
            <td>{{ formatearFolio(item.propiedad?.folios) }}</td>
            <td>{{ item.historial_estado_contrato?.estado?.estado }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_inventario) }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_comercial_presenta_carpeta) }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_preaprobada) }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_reserva) }}</td>
            <td>{{ item.historial_estado_contrato?.gastos_administrativos || '-' }}</td>
            <td>{{ item.historial_estado_contrato.tirilla_entregada_por?.username }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_tirilla_entregada) }}</td>
            <td>{{ item.historial_estado_contrato.tirilla_controlada_por?.username || '-' }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_tirilla_controlada) }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_contrato) }}</td>
            <td>{{ formatDate(item.historial_estado_contrato?.fecha_autorizacion) }}</td>
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
                      Editar Folio
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

  <ModalContrato :show="showModalContrato" :contrato="contratoSeleccionado" :estados="estadoContrato"
    @close="cerrarModalContrato" @guardar="guardarModalContrato" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavComponent from '@/components/NavComponent.vue'
import ModalContrato from '@/components/Contrato/Contrato Nuevo/ModalContrato.vue'
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
const inventario = ref('')
const { showError, showSuccess } = useToast()
const showModalContrato = ref(false)
const contratoSeleccionado = ref(null)
const form = {
  mes: mes.value,
  anio: anio.value,
  filtroEstado: filtroEstado.value,
  filtroAsesor: filtroAsesor.value,
  folio: folio.value,
}


const obtenerAñoMenos3 = () => {
  let años = []
  for (let i = 0; i < 3; i++) {
    años.push(new Date().getFullYear() - i)
  }
  return años
}
const asignarEstadoContrato = async () => {
  const response = await getEstadosContrato()
  estadoContrato.value = response.data.resultado
  //console.log(estadoContrato.value)
}

const obtenerAsesores = async () => {
  const response = await asesoresAlquiler()
  asesores.value = response.data
    .filter((asesor) => asesor.alquiler === 'S')
    .map((asesor) => ({
      id: asesor.usuario_id ?? asesor.usuario?.id,
      usuario_username: asesor.usuario_username
    }))
}

watch([mes, anio, filtroEstado, filtroAsesor, folio], () => {
  const form = {
    mes: mes.value,
    anio: anio.value,
    filtroEstado: filtroEstado.value,
    filtroAsesor: filtroAsesor.value,
    folio: folio.value,
  }
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

const cerrarModalContrato = () => {
  showModalContrato.value = false
  contratoSeleccionado.value = null
}

const guardarModalContrato = async (formData) => {
  //console.log('Guardando cambios del contrato:', formData)
  try {
    await ActualizarEstadoContrato(formData)
    showSuccess('Datos de contrato listos para guardar ')
    showModalContrato.value = false
    listado(form)
  }
  catch (error) {
    console.log(error)
    showError('Error al guardar los datos del contrato')
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

  listado(form)

})
</script>
