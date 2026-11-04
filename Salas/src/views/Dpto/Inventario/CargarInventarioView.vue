<template>
  <NavComponent />

  <div class="px-3">

    <div class="row ">
      <!-- Filtro -->
      <div class="m-0 p-0 col-md-4 ">
        <div class="card ">
          <div class="card-header p-0"> <strong>Filtros de búsqueda</strong> </div>
          <div class="card-body card-body_dptoTec p-1 m-0">
            <div class="row">
              <div class="col-md-3 form-group busqueda_dptoTec ps-3 pe-1">
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

              <div class="col-md-2 form-group busqueda_dptoTec px-1">
                <label>Año</label>
                <select v-model="anio" class="form-control form-control-sm">
                  <option v-for="año in obtenerAñoMenos3()" :key="año" :value="año">{{ año }}</option>
                </select>
              </div>

              <div class="col-md-3 form-group busqueda_dptoTec px-1">
                <label for="">Estado</label>
                <select v-model="filtroEstado" class="form-control form-control-sm">
                  <option value="">Todos</option>
                  <option v-for="estado in estadoDpto" :key="estado.id" :value="estado.id">
                    {{ estado.estado }}
                  </option>
                </select>
              </div>

              <div class="col-md-2 form-group busqueda_dptoTec px-1">
                <label for="">Usuario</label>
                <select v-model="filtroAsesor" class="form-control form-control-sm">
                  <option value="">Todos</option>
                  <option v-for="asesor in usuariosDpto" :key="asesor.id" :value="asesor.id">
                    {{ asesor.username }}
                  </option>
                </select>
              </div>

              <div class="col-md-2 form-group busqueda_dptoTec ps-1 pe-3">
                <label for="">Folio</label>
                <input type="text" placeholder="Buscar" v-model="folio" class="form-control form-control-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-0 px-1 col-md-4 ">
        <div class="card">
          <div class="card-header p-0"> <strong>Realizados por usuario</strong> </div>
          <div class="card-body card-body_dptoTec p-1 m-0">
            <div v-if="usuariosDpto.length" class="d-flex flex-wrap g-1 pt-2">
              <div v-for="asesor in usuariosDpto" :key="asesor.id" class="flex-grow-1 px-1">
                <div class="border rounded p-1 dpto_recuadro_usuarios text-center h-100">
                  <div class="text-muted text-truncate dptoTec_fuente_realizados" :title="asesor.username"> {{
                    asesor.username }} </div>
                  <div class="fw-bold fs-6"> {{ inventariosPorAsesor[asesor.id] ?? 0 }} </div>
                </div>
              </div>
            </div>
            <div v-else class="text-muted small"> No hay usuarios disponibles. </div>


          </div>
        </div>
      </div>




      <div class="m-0 p-0 col-md-4">
        <div class="card">


          <div class="card-header p-0"><strong>Total Inventarios</strong></div>
          <div class="card-body card-body_dptoTec p-1 m-0">
            <!-- Resultados -->
            <div class="d-flex flex-wrap g-1 pt-2">
              <!-- Total -->
              <div class="col-4 flex-grow-1 px-1 text-center">
                <div class="border rounded p-1 dpto_recuadro_estados_total h-100 ">
                  <div class="text-muted dptoTec_fuente_realizados"> Total </div>
                  <div class="fw-bold fs-6"> {{ totalInventarios }} </div>
                </div>
              </div>
              <!-- Realizados -->
              <div class="col-4 flex-grow-1 px-1 text-center">
                <div class="border rounded p-1 dpto_recuadro_estados_realizados h-100">
                  <div class="text-muted dptoTec_fuente_realizados"> Realizados </div>
                  <div class="fw-bold fs-6"> {{ inventariosRealizados }} </div>
                </div>
              </div>
              <!-- Restantes -->
              <div class="col-4 flex-grow-1 px-1 text-center">
                <div class="border rounded p-1 dpto_recuadro_estados_restantes h-100">
                  <div class="text-muted dptoTec_fuente_realizados"> Restantes </div>
                  <div class="fw-bold fs-6"> {{ inventariosRestantes }} </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>


    <!-- Tabla -->
    <div class="proceso_dpto_tec_contenedor mt-2">
      <table class="table table-striped table-hover proceso_reserva_table">
        <thead>
          <tr class="text-center">
            <th>Folio</th>
            <th>Asesor</th>
            <th>Domicilio</th>
            <th>Estado</th>
            <th>Fecha Reserva</th>
            <th>Dias Transcurridos</th>
            <th>Verificado por</th>
            <th>Fecha Inventario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historial" :key="item.id">
            <!-- Folio -->
            <td>{{ item.propiedad?.folios?.[0]?.folio }}</td>
            <!-- Domicilio -->
            <td>{{ item.asesor_usuario?.username }}</td>
            <td>

              <div> {{ item.propiedad?.calle?.name }} {{ item.propiedad?.numero_calle }} </div> <small
                v-if="item.propiedad?.piso || item.propiedad?.departamento" class="text-muted"> <span
                  v-if="item.propiedad?.piso"> Piso {{ item.propiedad.piso }} </span> <span
                  v-if="item.propiedad?.piso && item.propiedad?.departamento"> - </span> <span
                  v-if="item.propiedad?.departamento"> Dpto {{ item.propiedad.departamento }} </span> </small>
              <!--  {{ item.propiedad?.calle?.name }} {{ item.propiedad?.numero_calle }}
              <span v-if="item.propiedad?.piso">Piso {{ item.propiedad.piso }}</span>
              <span v-if="item.propiedad?.departamento">Dpto {{ item.propiedad.departamento }}</span> -->
            </td>
            <td>{{ item.historial_estado_dpto?.estado.estado }}</td>

            <!-- Fecha Reserva -->
            <td>{{ formatearFechaHora(item.fecha_reserva) }}</td>

            <!-- Dias Transcurridos (No viene en el JSON, lo dejamos vacío o calculamos) -->
            <td>{{ calculardiferenciaDias(item.fecha_reserva, item) }}</td>

            <!-- Verificado por (Asesor) -->
            <td>{{ item.historial_estado_dpto?.verificado_por?.username }}</td>

            <!-- Fecha Inventario (No viene claramente en el JSON) -->
            <td>{{ formatDate(item.historial_estado_dpto?.fecha_inventario) }}</td>



            <!-- Acciones -->
            <td class="p-1 text-center text-nowrap" style="width: 1%">
              <div class="d-inline-flex align-items-center gap-1">

                <button class="btn btn-outline-primary btn-sm px-2 py-0 shadow-sm dpto_boton_opciones" type="button"
                  data-bs-toggle="dropdown" aria-expanded="false" title="Más opciones">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <button type="button" class="dropdown-item small" @click="abrirModalInventario(item)">
                      <i class="bi bi-pencil-square me-1"></i> Editar
                    </button>
                  </li>
                  <li>
                    <button type="button" class="dropdown-item small" @click="abrirModalObservacionesContrato(item)">
                      <i class="bi bi-chat-text me-1"></i> Observaciones
                    </button>
                  </li>
                </ul>


                <button type="button" class="btn btn-outline-primary btn-sm px-2 py-0 shadow-sm dpto_boton_opciones"
                  data-bs-toggle="modal" data-bs-target="#modalFotos" title="Fotos" @click="seleccionarFotos(item)">
                  <i class="bi bi-camera "></i>
                </button>

                <!-- Documento Word: sube directo (sin modal). Un documento por reserva. -->
                <button type="button" class="btn btn-outline-primary btn-sm px-2 py-0 shadow-sm dpto_boton_opciones"
                  :disabled="!tienePermisoCarga || subiendoDocId !== null" title="Cargar documento (.doc / .docx)"
                  @click="elegirDocumento(item)">
                  <i class="bi" :class="subiendoDocId === item.id ? 'bi-hourglass-split' : 'bi-upload'"></i>
                </button>

                <button type="button" class="btn btn-outline-primary btn-sm px-2 py-0 shadow-sm dpto_boton_opciones"
                  data-bs-toggle="modal" data-bs-target="#modalDocumentosInventario" title="Ver / descargar documento"
                  @click="seleccionarDocumentos(item)">
                  <i class="bi bi-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>
  <ModalInventario v-if="showModalInventario" :show="showModalInventario" :inventario="inventarioSeleccionado"
    @close="cerrarModalInventario" @guardar="guardarModalInventario" :tienePermisoCarga="tienePermisoCarga" />
  <ModalObservacionAlquiler :show="showModalObservacion" :observacion="observacionActual" :sector="sector"
    @close="showModalObservacion = false" />
  <ModalCargaFotos modo="inventario" :id-proceso-propiedad="procesoFotos" :puede-editar="tienePermisoCarga" />
  <ModalDocumentosInventario :id-proceso-propiedad="procesoDocumentos" :puede-editar="tienePermisoCarga" />
  <!-- Input oculto: el botón de documentos abre el selector del sistema -->
  <input ref="inputDocumento" type="file" accept=".doc,.docx" class="d-none" @change="onDocumentoSeleccionado">

</template>
<script setup>
import NavComponent from '../../../components/NavComponent.vue'
import { useFiltroMesAnio } from '@/composables/useFiltroMesAnio'
import {
  getHistorialInventario,
  ActualizarInventario,
  getEstadoDpto,
  getUsuariosDpto,
  subirDocumentoInventario,
} from '@/Services/api/Dpto/Inventario'
import { ref, onMounted, watch, computed } from 'vue'
import ModalObservacionAlquiler from '@/components/Atcl/Alquiler/ModalObservacionAlquiler.vue'
import ModalInventario from '@/components/Dpto/Inventario/ModalInventario.vue'
import { verificarPermiso } from '@/Services/api/Atcl/AtclApi'
/* import ModalObservacionesInventario from '@/components/Dpto/Inventario/ModalObservacionesInventario.vue' */
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useToast } from '@/composables/useToast'
import ModalCargaFotos from '@/components/Atcl/Propiedad/ModalCargaFotos.vue'
import ModalDocumentosInventario from '@/components/Dpto/Inventario/ModalDocumentosInventario.vue'
const { mes, anio, obtenerAñoMenos3 } = useFiltroMesAnio()
const resPermiso = ref(false)
const historial = ref([])
const { formatDate } = useDateFormatter()
const inventarioSeleccionado = ref(null)
const showModalInventario = ref(false)
const showModalObservacion = ref(false)
const { showError, showSuccess } = useToast()
const filtroEstado = ref('')
const estadoDpto = ref([])
const usuariosDpto = ref([])
const filtroAsesor = ref('')
const folio = ref('')
const totalInventarios = ref(0)
const inventariosRealizados = ref(0)
const inventariosRestantes = ref(0)
const sector = ref('inventario')
const observacionActual = ref(null)
const tienePermisoCarga = ref(false)

const inventariosPorAsesor = computed(() => {
  const conteo = {}
  usuariosDpto.value.forEach((asesor) => {
    conteo[asesor.id] = 0
  })

  historial.value.forEach((item) => {
    const verificadorId = item.historial_estado_dpto?.verificado_por?.id
    const fechaInventario = item.historial_estado_dpto?.fecha_inventario

    if (verificadorId != null && fechaInventario != null) {
      if (conteo[verificadorId] === undefined) {
        conteo[verificadorId] = 0
      }
      conteo[verificadorId]++
    }
  })

  return conteo
})
const buscar = async () => {
  const form = {
    mes: mes.value,
    anio: anio.value,
    folio: folio.value,
    filtroAsesor: filtroAsesor.value,
    filtroEstado: filtroEstado.value,
  }
  const res = await getHistorialInventario(form)
  historial.value = res.data.resultado
  //console.log('historial verificado_por:', historial.value.map(h => h.historial_estado_dpto?.verificado_por)) // 👈 agregar
  totalInventarios.value = historial.value.length
  inventariosRealizados.value = historial.value.filter(
    (item) => item.historial_estado_dpto?.fecha_inventario != null,
  ).length
  inventariosRestantes.value = totalInventarios.value - inventariosRealizados.value
  //console.log(historial.value)
}
//Calculador de diferencia de dias entre la fecha de reserva y la fecha de inventario
const calculardiferenciaDias = (fecha_reserva, item) => {
  if (!item.historial_estado_dpto?.fecha_inventario) {
    return '-'
  }
  //seteamos las horas a 0 para solo tener en cuenta las fechas
  const fechaReserva = new Date(fecha_reserva)
  //fechaReserva.setHours(0, 0, 0, 0)

  //seteamos las horas a 0 para solo tener en cuenta las fechas
  const fechaActual = new Date(item.historial_estado_dpto?.fecha_inventario)
  //fechaActual.setHours(0, 0, 0, 0)

  const diferencia = fechaActual - fechaReserva
  const dias = Math.round(diferencia / (1000 * 60 * 60 * 24))
  return dias
}
//Funciones para manejar las acciones del modal de inventario
const abrirModalInventario = (item) => {
  inventarioSeleccionado.value = item
  showModalInventario.value = true
}

const cerrarModalInventario = () => {
  showModalInventario.value = false
}

// Proceso de reserva cuyas fotos se muestran en el modal (fotos de inventario)
const procesoFotos = ref(null)
const seleccionarFotos = (item) => {
  procesoFotos.value = item.id
}

// ---- Documento Word de inventario (carga directa, un documento por reserva) ----
const EXTENSIONES_WORD = ['doc', 'docx']
const inputDocumento = ref(null)
const procesoDocumento = ref(null) // id del proceso al que se sube el archivo elegido
const procesoDocumentos = ref(null) // id del proceso cuya lista se muestra en el modal
const subiendoDocId = ref(null)

const seleccionarDocumentos = (item) => {
  procesoDocumentos.value = item.id
}

const elegirDocumento = (item) => {
  procesoDocumento.value = item.id
  inputDocumento.value?.click()
}

const onDocumentoSeleccionado = async (event) => {
  const archivo = event.target.files?.[0]
  event.target.value = '' // permite volver a elegir el mismo archivo
  if (!archivo || !procesoDocumento.value) return

  const extension = archivo.name.split('.').pop()?.toLowerCase()
  if (!EXTENSIONES_WORD.includes(extension)) {
    showError('Solo se permiten archivos .doc o .docx')
    return
  }

  const idProceso = procesoDocumento.value
  subiendoDocId.value = idProceso
  try {
    const formData = new FormData()
    formData.append('id_proceso_propiedad', idProceso)
    formData.append('documento', archivo)
    await subirDocumentoInventario(formData)
    showSuccess('Documento cargado correctamente')
  } catch (error) {
    showError(error.response?.data?.message || 'Error al cargar el documento')
  } finally {
    subiendoDocId.value = null
  }
}

const abrirModalObservacionesContrato = (item) => {
  //console.log(item)
  observacionActual.value = item.id
  /* inventarioSeleccionado.value = item */
  showModalObservacion.value = true
}

/* const cerrarModalObservaciones = () => {
  showModalObservacion.value = false
} */

const guardarModalInventario = async (formData) => {
  //console.log('aca llega la informacion', formData)
  try {
    await ActualizarInventario(formData)
    showSuccess('Inventario actualizado correctamente')
    showModalInventario.value = false
    buscar()
    //listado(form)
  } catch (error) {
    console.log(error)
    showError('Error al guardar las observaciones')
  }
}

const traerEstadoDpto = async () => {
  try {
    const response = await getEstadoDpto()
    //console.log('estado contrato', response.data.resultado)
    estadoDpto.value = response.data.resultado
  } catch (error) {
    console.log(error)
    showError('Error al obtener los estados de dpto Tecnico')
  }
}

const traerAsesoresDpto = async () => {
  try {
    const response = await getUsuariosDpto()
    const data = response.data.resultado || response.data || []
    //console.log('RAW asesores:', data) // 👈 agregar

    usuariosDpto.value = data.map((asesor) => ({
      id: asesor.id_usuario ?? asesor.id ?? asesor.usuario_id ?? asesor.usuario?.id ?? '',
      username:
        asesor.usuario?.username ?? asesor.username ?? asesor.usuario_username ?? 'Sin usuario',
    }))
  } catch (error) {
    console.log(error)
    showError('Error al obtener los asesores de Dpto Tecnico')
  }
}

const formatearFechaHora = (fecha) => {
  if (!fecha) return ''

  const [fechaParte, horaParte] = fecha.split(' ')
  const [anio, mes, dia] = fechaParte.split('-')

  return `${dia}/${mes}/${anio} ${horaParte.substring(0, 5)}`
}
onMounted(async () => {
  traerEstadoDpto()
  traerAsesoresDpto()
  buscar()
  resPermiso.value = await verificarPermiso('GuardarInventario')
  tienePermisoCarga.value = resPermiso.value?.data ?? false
  console.log('resPermiso.value', tienePermisoCarga.value)
})

watch([mes, anio, folio, filtroAsesor, filtroEstado], () => {
  buscar()
})
</script>
