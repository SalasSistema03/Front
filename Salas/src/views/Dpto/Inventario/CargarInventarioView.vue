<template>
  <NavComponent />

  <div class="px-2">

    <div class="row">
      <div class="col-md-1 form-group">
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

      <div class="col-md-1 form-group">
        <label>Año</label>
        <select v-model="anio" class="form-control form-control-sm">
          <option v-for="año in obtenerAñoMenos3()" :key="año" :value="año">{{ año }}</option>
        </select>
      </div>

      <div class="col-md-2 form-group">
        <label for="">Estado</label>
        <select v-model="filtroEstado" class="form-control form-control-sm">
          <option value="">Todos</option>
          <option v-for="estado in estadoDpto" :key="estado.id" :value="estado.id">
            {{ estado.estado }}
          </option>
        </select>
      </div>

      <div class="col-md-1 form-group">
        <label for="">Usuario</label>
        <select v-model="filtroAsesor" class="form-control form-control-sm">
          <option value="">Todos</option>
          <option v-for="asesor in usuariosDpto" :key="asesor.id" :value="asesor.id">
            {{ asesor.username }}
          </option>
        </select>
      </div>

      <div class="col-md-1 form-group">
        <label for="">Folio</label>
        <input type="text" v-model="folio" class="form-control form-control-sm" />
      </div>
    </div>

    <div class="row">
      <div class="col-md-2 form-group">
        <label for="">T. Inventarios</label>
        <input type="number" class="form-control form-control-sm" v-model="totalInventarios" />
      </div>

      <div class="col-md-2 form-group">
        <label for="">Inv. Realizados</label>
        <input type="number" class="form-control form-control-sm" v-model="inventariosRealizados" />
      </div>

      <div class="col-md-2 form-group">
        <label for="">Inv. Restantes</label>
        <input type="number" class="form-control form-control-sm" v-model="inventariosRestantes" />
      </div>
    </div>

    <div class="row mt-2">
      <div v-for="asesor in usuariosDpto" :key="asesor.id" class="col-md-2 form-group">
        <label :for="`restantes-${asesor.id}`">{{ asesor.username }}</label>
        <div :id="`restantes-${asesor.id}`" class="form-control form-control-sm">
          {{ inventariosPorAsesor[asesor.id] ?? 0 }}
        </div>
      </div>
    </div>



    <div class="proceso_reserva_tabla_contenedor mt-2">
      <table class="table table-striped table-hover proceso_reserva_table">
        <thead>
          <tr class="text-center">
            <th>Folio</th>
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
            <td>
              {{ item.propiedad?.calle?.name }} {{ item.propiedad?.numero_calle }}
              <span v-if="item.propiedad?.piso">Piso {{ item.propiedad.piso }}</span>
              <span v-if="item.propiedad?.departamento">Dpto {{ item.propiedad.departamento }}</span>
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
            <td>
              <div class=" ">
                <button class="btn btn-secondary btn-sm p-0" type="button" data-bs-toggle="dropdown"
                  aria-expanded="false" title="Acciones">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu lista-mas-opciones-impuestos">
                  <li>
                    <button type="button" class="dropdown-item text-options-impuestos_lista"
                      @click="abrirModalInventario(item)">
                      Editar
                    </button>
                    <button type="button" class="dropdown-item text-options-impuestos_lista"
                      @click="abrirModalObservacionesContrato(item)">
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
  <ModalInventario v-if="showModalInventario" :show="showModalInventario" :inventario="inventarioSeleccionado"
    @close="cerrarModalInventario" @guardar="guardarModalInventario" />
  <ModalObservacionesInventario v-if="showModalObservaciones" :show="showModalObservaciones" :inventario="inventarioSeleccionado"
    @close="cerrarModalObservaciones" />
</template>
<script setup>
import NavComponent from '../../../components/NavComponent.vue'
import { useFiltroMesAnio } from '@/composables/useFiltroMesAnio'
import {
  getHistorialInventario,
  ActualizarInventario,
  getEstadoDpto,
  getUsuariosDpto,
} from '@/Services/api/Dpto/Inventario'
import { ref, onMounted, watch, computed } from 'vue'
import ModalInventario from '@/components/Dpto/Inventario/ModalInventario.vue'
import ModalObservacionesInventario from '@/components/Dpto/Inventario/ModalObservacionesInventario.vue'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useToast } from '@/composables/useToast'
const { mes, anio, obtenerAñoMenos3 } = useFiltroMesAnio()

const historial = ref([])
const { formatDate } = useDateFormatter()
const inventarioSeleccionado = ref(null)
const showModalInventario = ref(false)
const showModalObservaciones = ref(false)
const { showError, showSuccess } = useToast()
const filtroEstado = ref('')
const estadoDpto = ref([])
const usuariosDpto = ref([])
const filtroAsesor = ref('')
const folio = ref('')
const totalInventarios = ref(0)
const inventariosRealizados = ref(0)
const inventariosRestantes = ref(0)


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

const abrirModalObservacionesContrato = (item) => {
  inventarioSeleccionado.value = item
  showModalObservaciones.value = true
}

const cerrarModalObservaciones = () => {
  showModalObservaciones.value = false
}

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
onMounted(() => {
  traerEstadoDpto()
  traerAsesoresDpto()
  buscar()
})

watch([mes, anio, folio, filtroAsesor, filtroEstado], () => {
  buscar()
})
</script>
