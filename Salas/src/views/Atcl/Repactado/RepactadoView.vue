<template>
  <NavComponent />
  <!-- Aseguramos que el contenido empiece debajo del Nav -->

  <div class="row mx-1">
    <div class="col-lg-6 p-0">
      <div class="card">
        <div class="card-header d-flex card-header-tasaciones">
          <i class="bi bi-cloud-upload me-2"></i>
          <p>Cargar Repactado</p>
        </div>
        <div class="card-body">
          <div class="row g-2 align-items-end">
            <div class="col-3 form-group">
              <label>Mes</label>
              <select class="form-select form-select-sm" v-model="mesSeleccionado">
                <option v-for="(mes, index) in meses" :key="index" :value="index + 1">{{ mes }}</option>
              </select>
            </div>
            <div class="col-2 form-group">
              <label>Año</label>
              <input type="number" class="form-control form-control-sm" v-model.number="anioSeleccionado"
                :min="ANIO_MINIMO" :max="ANIO_MAXIMO">
            </div>
            <div class="col-3 form-group">
              <label>Empresa</label>
              <select class="form-select form-select-sm" v-model="empresaSeleccionada">
                <option value="1">Atilio Salas SRL</option>
                <option value="2">Dolly J. Pianesi</option>
                <option value="3">Giusiano Maria Florencia</option>
              </select>
            </div>
            <div class="col-4">
              <button class="btn btn-primary w-100 btn-sm"
                @click="cargarRepactado(mesSeleccionado, anioSeleccionado, empresaSeleccionada)">Cargar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-6 pl-1">
      <div class="card">
        <div class="card-header d-flex card-header-tasaciones">
          <i class="bi bi-funnel me-2"></i>
          <p>Filtrar Repactado</p>
        </div>
        <div class="card-body">
          <div class="row g-2 align-items-end">
            <div class="col-2 form-group">
              <label>Folio</label>
              <input type="number" class="form-control form-control-sm" v-model.number="folioSeleccionado"
                :min="FOLIO_MINIMO" :max="FOLIO_MAXIMO">
            </div>
            <div class="col-3 form-group">
              <label>Mes</label>
              <select class="form-select form-select-sm" v-model="mesSeleccionado">
                <option v-for="(mes, index) in meses" :key="index" :value="index + 1">{{ mes }}</option>
              </select>
            </div>
            <div class="col-2 form-group">
              <label>Año</label>
              <input type="number" class="form-control form-control-sm" v-model.number="anioSeleccionado"
                :min="ANIO_MINIMO" :max="ANIO_MAXIMO">
            </div>
            <div class="col-3 form-group">
              <label>Empresa</label>
              <select class="form-select form-select-sm" v-model="empresaSeleccionada">
                <option value="1">Atilio Salas SRL</option>
                <option value="2">Dolly J. Pianesi</option>
                <option value="3">Giusiano Maria Florencia</option>
              </select>
            </div>

            <div class="col-2">
              <button class="btn btn-primary w-100 btn-sm"
                @click="filtrarRepactado(folioSeleccionado, mesSeleccionado, anioSeleccionado, empresaSeleccionada)">Buscar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="card mt-1 mx-1">
    <div class="card-header d-flex card-header-tasaciones">
      <i class="bi bi-table me-2"></i>
      <p>Listado de Repactado</p>
    </div>
    <div class="card-body">
      <table id="tablaRepactado" class="table table-striped table-hover proceso_reserva_table text-center align-middle">
        <thead>
          <tr>
            <th>Folio</th>
            <!-- <th>Cuenta Corriente</th> -->
            <!--  <th>Nombre</th> -->
            <th>Estado</th>
            <!-- <th>Observaciones</th> -->
            <th>Cierre</th>
            <!-- <th>Plazo y Actualizacion Contrato</th> -->
            <th>Condicion</th>
            <!-- <th>Inicio Contrato</th>
            <th>Vencimiento Contrato</th> -->
            <th>Situacion</th>
            <th>Apellido y Nombre</th>
            <th>Telefono Inq</th>
            <th>Direccion</th>
            <!-- <th>Localidad</th> -->
            <th>Tipo</th>
            <!-- <th>Comodidades</th> -->
            <th>Propietario</th>
            <th>Telefono</th>
            <!--   <th>Viejo</th> -->
            <!--  <th>C/ DOC</th> -->
            <!-- <th>TOTAL</th> -->
            <!-- <th>Nuevo</th> -->
            <!--  <th>% 2º Año</th> -->
            <!--  <th>Total 2º Año</th> -->
            <!-- <th>Comentario Inquilino</th>
            <th>Comentario Propietario</th> -->
            <!--  <th>Aviso Prop</th> -->
            <!-- <th>Gestor repactado</th> -->
            <th class="acciones-tasaciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in repactados" :key="item.id">
            <td>{{ item.folio || '-' }}</td>
            <!-- <td>{{ item.cuentaCorriente || '-' }}</td> -->
            <td>{{ item.estado || '-' }}</td>
            <td>{{ item.cierre || '-' }}</td>
            <!-- <td>{{ item.plazoActualizacion || '-' }}</td> -->
            <td>{{ item.condicion || '-' }}</td>
            <!-- <td>{{ item.inicioContrato || '-' }}</td>
            <td>{{ item.vencimientoContrato || '-' }}</td> -->
            <td>{{ item.situacion || '-' }}</td>
            <td>{{ item.apellidoNombre || '-' }}</td>
            <td>{{ item.telefono || '-' }}</td>
            <td>{{ item.direccion || '-' }}</td>
            <!-- <td>{{ item.localidad || '-' }}</td> -->
            <td>{{ item.tipo || '-' }}</td>
            <!-- <td>{{ item.comodidades || '-' }}</td> -->
            <td>{{ item.propietario || '-' }}</td>
            <td>{{ item.telefonoPropietario || '-' }}</td>
            <!-- <td>{{ item.viejo || '-' }}</td>
            <td>{{ item.nuevo || '-' }}</td> -->
            <td>
              <button type="button" class="btn btn-outline-primary btn-sm px-2 py-1 shadow-sm me-1"
                title="Editar repactado" aria-label="Editar repactado" @click="editarRepactado(item)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <!--  <button type="button" class="btn btn-outline-secondary btn-sm px-2 py-1 shadow-sm" title="Ver repactado"
                aria-label="Ver repactado" @click="verRepactado(item)">
                <i class="bi bi-eye"></i>
              </button> -->
            </td>
          </tr>
          <tr v-if="repactados.length === 0">
            <td colspan="13" class="text-muted py-3">
              No se encontraron registros de repactado.
            </td>
          </tr>
        </tbody>
      </table>

    </div>

  </div>

  <ModalRepactado :show="mostrarModal" :repactado-data="repactadoAEditar" :solo-lectura="modoSoloLectura"
    @close="cerrarModal" @repactadoGuardado="recargarRepactados" />

</template>

<script setup>
import { ref } from 'vue'
import NavComponent from '../../../components/NavComponent.vue'
import ModalRepactado from '../../../components/Atcl/Repactado/ModalRepactado.vue'
import { useToast } from '@/composables/useToast'
import { getRepactadoMes, getRepactadoFiltrado } from '@/Services/api/Contrato/Repactado.js'

const { showError, showSuccess, showWarning, handleApiError } = useToast()

const mostrarModal = ref(false)
const repactadoAEditar = ref(null)
const modoSoloLectura = ref(false)
const meses = ref(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])

const hoy = new Date()
const ANIO_MINIMO = 2026
const ANIO_MAXIMO = hoy.getFullYear() + 50
const FOLIO_MINIMO = 0
const FOLIO_MAXIMO = 100000

const mesSeleccionado = ref(hoy.getMonth() + 1)
const anioSeleccionado = ref(Math.min(Math.max(hoy.getFullYear(), ANIO_MINIMO), ANIO_MAXIMO))
const empresaSeleccionada = ref('1')
const folioSeleccionado = ref(null)

const validarEmpresa = (empresa) => {
  const empresaNum = Number(empresa)

  if (!Number.isInteger(empresaNum) || empresaNum < 1 || empresaNum > 3) {
    showError('Debe seleccionar una empresa válida.')
    return false
  }

  return true
}

const validarPeriodo = (mes, anio) => {
  const anioNum = Number(anio)

  if (!Number.isInteger(anioNum) || anioNum < ANIO_MINIMO) {
    showError(`El año no puede ser menor a ${ANIO_MINIMO}.`)
    return false
  }

  if (anioNum > ANIO_MAXIMO) {
    showError(`El año no puede ser mayor a ${ANIO_MAXIMO}.`)
    return false
  }

  if (!Number.isInteger(Number(mes)) || Number(mes) < 1 || Number(mes) > 12) {
    showError('Debe seleccionar un mes válido.')
    return false
  }

  return true
}

const validarFolio = (folio) => {
  // Sin folio se filtra el período completo; si se informa, debe estar en el rango.
  if (folio === null || folio === undefined || folio === '') return true

  const folioNum = Number(folio)

  if (!Number.isInteger(folioNum) || folioNum < FOLIO_MINIMO || folioNum > FOLIO_MAXIMO) {
    showError(`El folio debe estar entre ${FOLIO_MINIMO} y ${FOLIO_MAXIMO}.`)
    return false
  }

  return true
}

const nombresEmpresas = {
  1: 'Atilio Salas SRL',
  2: 'Dolly J. Pianesi',
  3: 'Giusiano Maria Florencia',
}

// Repactados que actualmente se muestran en el listado.
const repactados = ref([])

const cargarRepactado = async (mes, anio, empresa) => {
  if (!validarEmpresa(empresa)) return
  if (!validarPeriodo(mes, anio)) return
  try {
    const { data } = await getRepactadoMes(mes, anio, empresa)
    const resultados = data?.data ?? []

    if (resultados.length === 0) {
      showWarning(
        `No se encontraron repactados para ${meses.value[Number(mes) - 1]} ${anio} en ${nombresEmpresas[Number(empresa)]}.`
      )
      return
    }

    showSuccess('Repactados cargados correctamente.')
  } catch (error) {
    handleApiError(error)
  }
}

// Repactados ya cargados que se muestran en el listado.
const filtrarRepactado = async (folio, mes, anio, empresa) => {
  if (!validarEmpresa(empresa)) return
  if (!validarPeriodo(mes, anio)) return
  if (!validarFolio(folio)) return

  try {
    const { data } = await getRepactadoFiltrado(folio, mes, anio, empresa)
    const resultados = data?.data ?? []

    if (resultados.length === 0) {
      repactados.value = []
      showWarning(
        `No se encontraron repactados para ${meses.value[Number(mes) - 1]} ${anio} en ${nombresEmpresas[Number(empresa)]}.`
      )
      return
    }

    repactados.value = resultados
    showSuccess('Repactados encontrados correctamente.')
  } catch (error) {
    handleApiError(error)
  }
}


const editarRepactado = (item) => {
  repactadoAEditar.value = item
  modoSoloLectura.value = false
  mostrarModal.value = true
}

const verRepactado = (item) => {
  repactadoAEditar.value = item
  modoSoloLectura.value = true
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  repactadoAEditar.value = null
  modoSoloLectura.value = false
}

const recargarRepactados = () => {
  // Vuelve a traer el listado para reflejar lo que se guardó en el modal.
  filtrarRepactado(folioSeleccionado.value, mesSeleccionado.value, anioSeleccionado.value, empresaSeleccionada.value)
}
</script>
