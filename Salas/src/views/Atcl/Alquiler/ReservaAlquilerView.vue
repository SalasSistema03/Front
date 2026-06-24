<template>
  <NavComponent />
  <div class="px-3">
    <div class="row">
      <div class="form-group col-md-8">
        <div class=" card px-3">
          <div class="row  d-flex justify-content-center align-items-center">
            <div class="col-md-2">
              <label for="asesor" class="form-label">Asesor</label>
              <select name="" id="asesor" class="form-select form-select-sm" v-if="resPermiso" v-model="idAsesor"
                :disabled="!selectoresActivos">
                <option value="">Seleccionar</option>
                <option v-for="item in listaAsesoresAlquiler" :key="item.id" :value="item.id">
                  {{ item.username }}
                </option>
              </select>
              <input v-else type="input" class="form-control form-control-sm text-center" disabled :value="username" />
            </div>

            <div class="col-md-3">
              <label for="fecha_reserva" class="form-label">Fecha de Reserva</label>
              <input type="datetime-local" class="form-control form-control-sm text-center" v-model="fecha_reserva"
                :max="fecha_fin_reserva" readonly disabled />
            </div>

            <div class="col-md-4 fechaYhora">
              <label for="fecha_reserva" class="form-label">Fin de Reserva</label>
              <input type="datetime-local" class="form-control form-control-sm text-center" v-model="fecha_fin_reserva"
                :min="fecha_reserva" readonly disabled />
            </div>

          </div>
          <div class="row  d-flex justify-content-center align-items-center">
            <div class="col-md-10">
              <label for="comprobante" class="form-label">Comprobante</label>
              <input type="file" class="form-control form-control-sm"
                accept=".jpg,.jpeg,.pdf,application/pdf,image/jpeg" @change="manejarArchivo"
                :disabled="!selectoresActivos" />
            </div>
            <div v-if="verComprobante" class="col-md-2 pt-4">
              <button class="btn btn-sm btn-secondary w-100" @click="verComprobanteFoto">comprobante</button>
            </div>

          </div>

          <div class=" row d-flex justify-content-center align-items-center">
            <div class="col-md-3 position-relative">
              <label for="telefono" class="form-label">Numero de Telefono</label>
              <input type="text" class="form-control form-control-sm" id="telefono" autocomplete="off"
                v-model="telefono" @focus="mostrandoResultadosClientes = resultadosClientes.length > 0"
                :disabled="!selectoresActivos" />
              <div v-if="mostrandoResultadosClientes && resultadosClientes.length > 0"
                class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm m-0 px-1"
                style="z-index: 1000; max-height: 240px; overflow-y: auto">
                <div v-for="item in resultadosClientes" :key="item.cliente.id_cliente" class="px-2 py-1 cursor-pointer"
                  @click="seleccionarCliente(item)">
                  <div class="small">{{ item.cliente.telefono }} - {{ item.cliente.nombre }}</div>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <label for="nombre_cliente" class="form-label">Nombre Cliente</label>
              <input type="text" class="form-control form-control-sm" disabled v-model="nombreCliente" />
            </div>

            <div class="col-md-5">
              <label for="nombre_reservante" class="form-label">Nombre del Reservante</label>
              <input type="text" class="form-control form-control-sm" v-model="nombreReservante"
                :disabled="!selectoresActivos" />
            </div>
          </div>

          <div class=" row d-flex justify-content-center align-items-center">
            <div class="col-md-2 position-relative">
              <label for="codigo" class="form-label">Codigo</label>
              <input type="text" id="codigo" class="form-control form-control-sm" autocomplete="off" v-model="codigo"
                @focus="mostrandoResultadosPropiedad = resultadosPropiedades.length > 0"
                :disabled="!selectoresActivos" />
              <div v-if="mostrandoResultadosPropiedad && resultadosPropiedades.length > 0"
                class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm m-0 px-1"
                style="z-index: 1000; max-height: 240px; overflow-y: auto">
                <div v-for="propiedad in resultadosPropiedades" :key="propiedad.id" class="px-2 py-1 cursor-pointer"
                  @click="seleccionarPropiedad(propiedad)">
                  <div class="small">
                    {{ propiedad.cod_alquiler }} - {{ propiedad.calle }} {{ propiedad.numero }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-7">
              <label for="direccion" class="form-label">Direccion</label>
              <input type="text" class="form-control form-control-sm" id="direccion" v-model="direccion" disabled
                readonly />
            </div>
            <div class="col-md-3">
              <label for="folio" class="form-label">Folio</label>
              <input type="text" class="form-control form-control-sm" id="folio" v-model="folio" disabled />
            </div>
          </div>

          <div class="row d-flex justify-content-center align-items-center pb-3">
            <div class="col-md-3">
              <label for="monto_reserva" class="form-label">Tipo</label>
              <select class="form-select form-select-sm" v-model="tipo" :disabled="!selectoresActivos">
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>
            <div class="col-md-6">
              <label for="monto_reserva" class="form-label">Monto de Reserva</label>
              <div class="row">
                <div class="col-md-4">
                  <select v-model="moneda" class="form-select form-select-sm" :disabled="!selectoresActivos">
                    <option value="$">$</option>
                    <option value="U$D">U$D</option>
                  </select>
                </div>
                <div class="col-md-8">
                  <input type="number" class="form-control form-control-sm" v-model="montoReserva"
                    :disabled="!selectoresActivos" />
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <button class="btn btn-primary w-100 btn-sm mt-4" @click="reservar" :disabled="!selectoresActivos">
                Realizar Reserva
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group col-md-4 ">
        <div v-if="!resPermiso2">
          <div class="card">
            <div class="row  d-flex justify-content-center align-items-center m-2">
              <div class="row col-12">

                <div class="col-md-8">
                  <label for="fecha_reserva" class="form-label">Estado</label>
                  <select class="form-select form-select-sm" v-model="estado">
                    <option value="1">Pendiente Firma de Reserva</option>
                    <option value="2">Pendiente de Documentacion</option>
                    <option value="3">Reserva Finalizada</option>
                    <option value="4">Caida</option>
                  </select>
                </div>


              </div>
              <div class="row col-12 ">
                <div class="col-md-12">
                  <label for="monto_reserva" class="form-label">Motivo de Baja</label>
                  <div class="row">
                    <div class="col-md-12">
                      <select v-model="motivoBaja" class="form-select form-select-sm" :disabled="!mostrarMotivoBaja">
                        <option value="Sin Motivo">Sin Motivo</option>
                        <option value="Falta de Firma">Falta de Firma</option>
                        <option value="Cambio de Precio">Cambio de Precio</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 row">
                <div>
                  <label for="detalle" class="form-label">Observación</label>
                  <textarea v-model="detalle" class="form-control form-control-sm" rows="1"></textarea>
                </div>
              </div>
              <div class="row col-md-12 pb-3">
                <div class="col-md-12">
                  <button class="btn btn-secondary btn-sm mt-4 w-100" @click="guardarEstadoNuevo">Guardar
                    Cambios</button>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="row col-12 ">
              <div class="col-md-4  mt-3">
                <label for="fecha_reserva" class="form-label">Filtro</label>
              </div>
              <div class="col-md-8  mt-3">
                <select v-model="filtroPorEstado" class="form-select form-select-sm">
                  <option value="">Todos</option>
                  <option value="1">Pendiente Firma de Reserva</option>
                  <option value="2">Pendiente de Documentacion</option>
                  <option value="3">Reserva Finalizada</option>
                  <option value="4">Caida</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div v-if="resPermiso2">
          <div class="card pb-3">
            <div class="row d-flex justify-content-center align-items-center mt-4 px-3">
              <div class="col-md-6">
                <label for="fecha_reserva" class="form-label">Filtro Reserva Identificada</label>
              </div>
              <div class="col-md-4">
                <select class="form-select form-select-sm" v-model="reservaIdentificada">
                  <option value="0">NO</option>
                  <option value="1">SI</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row d-flex justify-content-center align-items-center m-2">

            <div class="col-md-4 form-group">
              <label>Folio</label>
              <input type="text" v-model="folio" disabled class="form-control form-control-sm">
            </div>
            <div class="col-md-4 form-group">
              <label>Monto</label>
              <input type="text" v-model="montoReserva" disabled class="form-control form-control-sm">
            </div>
            <div class="col-md-4 form-group">
              <!-- <button class="btn btn-primary btn-sm mt-4">Aceptar Monto</button> -->
              <button class="btn btn-primary btn-sm mt-4" @click="handleAceptarMonto"
                :disabled="reservaIdentificada == 1">Aceptar Monto</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="">
      <table class="table table-striped table-hover table-sm proceso_reserva_table">
        <thead>
          <tr class="text-center">
            <th>Codigo</th>
            <th>Direccion</th>
            <th>Folio</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Cliente</th>
            <th>Numero</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Observacion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center" v-for="item in responseListado" :key="item.proceso_propiedad?.id">
            <td>{{ item.proceso_propiedad?.propiedad?.cod_alquiler }}</td>
            <td>{{ item.proceso_propiedad?.propiedad?.calle?.name }}
              {{ item.proceso_propiedad?.propiedad?.numero_calle }}
              {{ item.proceso_propiedad?.propiedad?.piso ? ' P' + item.proceso_propiedad?.propiedad?.piso : '' }}
              {{ item.proceso_propiedad?.propiedad?.departamento ? ' Dpto' +
                item.proceso_propiedad?.propiedad?.departamento : '' }}
            </td>
            <td>{{ formatearFolio(item.proceso_propiedad?.propiedad?.folios) }}</td>
            <td>{{ item.proceso_propiedad?.fecha_reserva }}</td>
            <td>{{ item.proceso_propiedad?.fecha_fin_reserva }}</td>
            <td>{{ item.proceso_propiedad?.cliente?.nombre }}</td>
            <td>{{ item.proceso_propiedad?.cliente?.telefono }}</td>
            <td>{{ item.proceso_propiedad?.tipo_reserva }}</td>
            <td>{{ item.proceso_propiedad?.moneda }} {{ item.proceso_propiedad?.monto_reserva }}</td>
            <td>{{ item.estado.estado }}</td>
            <td><button class="btn btn-primary btn-sm" @click="abrirModalObservacion(item)">Observación</button></td>
            <td>
              <button class="btn btn-primary btn-sm" @click="seleccionarReserva(item)">Seleccionar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalObservacionAlquiler :show="showModalObservacion" :observacion="observacionActual"
      @close="showModalObservacion = false" />
  </div>
</template>

<script setup>
import NavComponent from '@/components/NavComponent.vue'
import ModalObservacionAlquiler from '@/components/Atcl/Alquiler/ModalObservacionAlquiler.vue'
import { onMounted, ref, watch } from 'vue'
import { verificarPermiso } from '@/Services/api/Atcl/AtclApi'
import {
  asesoresAlquiler, buscarPropiedadPorCodigoAlquiler, subirReservas, obtenerReservas,
  guardarEstado, getIdentificadas, guardarReservaIdentificada, buscarComprobanteReserva
} from '@/Services/api/Atcl/Alquiler/Alquiler'
import { getUser } from '@/Services/api/Usuario/userApi'
import { getClientesTelefono } from '@/Services/api/Agenda/AgendaApi'
import { useToast } from '@/composables/useToast'

const btnNombre = 'listarAsesoresReserva'
const btnNombrePagada = 'listarReservasIdentificadas'
const resPermiso = ref(false)
const resPermiso2 = ref(false)
const listaAsesoresAlquiler = ref([])
const username = ref('')
const { showSuccess, showError } = useToast()
const fecha_reserva = ref('')
const comprobante = ref(null)
const tipo = ref('EFECTIVO')
const moneda = ref('$')
const montoReserva = ref('')
const nombreReservante = ref('')
const asesor = ref('')
const idAsesor = ref('')
const codigo = ref('')
const idPropiedad = ref('')
const direccion = ref('')
const folio = ref('')
const resultadosPropiedades = ref([])
const mostrandoResultadosPropiedad = ref(false)
const ignorarWatchCodigo = ref(false)
let timeoutBusquedaPropiedad = null
let ultimaBusquedaPropiedadId = 0
const telefono = ref('')
const nombreCliente = ref('')
const idCliente = ref('')
const resultadosClientes = ref([])
const mostrandoResultadosClientes = ref(false)
const ignorarWatchTelefono = ref(false)
let timeoutBusquedaClientes = null
let ultimaBusquedaClientesId = 0
const responseListado = ref([])
const selectoresActivos = ref(true)
const estado = ref('1')
const mostrarMotivoBaja = ref(false)
const motivoBaja = ref('Sin Motivo')
const detalle = ref('')
const idProcesoPropiedad = ref('')
const filtroPorEstado = ref('')
const showModalObservacion = ref(false)
const observacionActual = ref('')
const verComprobante = ref(false)
const rutaComprobante = ref('')
const reservaIdentificada = ref('0')
const rutaComprobanteFoto = ref('')
//const aceptarMonto = ref(false)

const abrirModalObservacion = (item) => {
  observacionActual.value = item.proceso_propiedad.id
  showModalObservacion.value = true
}

const verComprobanteFoto = async () => {
  const data = {
    documentacion: rutaComprobanteFoto.value
  }
  const response = await buscarComprobanteReserva(data)
  const blob = response.data;
  const url = window.URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
}

const buscarClientesPorTelefono = async () => {
  const query = String(telefono.value).trim()

  if (!query || query.length < 3) {
    resultadosClientes.value = []
    mostrandoResultadosClientes.value = false
    return
  }

  const busquedaId = ++ultimaBusquedaClientesId

  try {
    const response = await getClientesTelefono(query)

    if (busquedaId !== ultimaBusquedaClientesId) return
    if (String(telefono.value).trim() !== query) return

    resultadosClientes.value = Array.isArray(response.data) ? response.data : []
    mostrandoResultadosClientes.value = resultadosClientes.value.length > 0
  } catch (error) {
    console.log(error)
    resultadosClientes.value = []
    mostrandoResultadosClientes.value = false
  }
}

const seleccionarCliente = (item) => {
  ignorarWatchTelefono.value = true
  idCliente.value = item.cliente.id_cliente || ''
  telefono.value = item.cliente.telefono || ''
  nombreCliente.value =
    item.cliente.nombre && item.cliente.apellido
      ? `${item.cliente.nombre} ${item.cliente.apellido}`.trim()
      : item.cliente.nombre || ''
  resultadosClientes.value = []
  mostrandoResultadosClientes.value = false
}

const buscarPropiedadPorCodigo = async () => {
  const query = String(codigo.value).trim()

  if (!query || query.length < 1) {
    resultadosPropiedades.value = []
    mostrandoResultadosPropiedad.value = false
    return
  }

  const busquedaId = ++ultimaBusquedaPropiedadId

  try {
    const response = await buscarPropiedadPorCodigoAlquiler(query)

    if (busquedaId !== ultimaBusquedaPropiedadId) return
    if (String(codigo.value).trim() !== query) return

    resultadosPropiedades.value = Array.isArray(response.data) ? response.data : []
    mostrandoResultadosPropiedad.value = resultadosPropiedades.value.length > 0
  } catch (error) {
    console.log(error)
    resultadosPropiedades.value = []
    mostrandoResultadosPropiedad.value = false
  }
}

const seleccionarPropiedad = (propiedad) => {

  ignorarWatchCodigo.value = true
  idPropiedad.value = propiedad.id || ''
  codigo.value = propiedad.cod_alquiler || ''
  direccion.value = `${propiedad.calle || ''} ${propiedad.numero || ''} ${propiedad.piso ? 'P' + propiedad.piso : ''} ${propiedad.departamento ? 'Dpto' + propiedad.departamento : ''}`.trim()
  folio.value = propiedad.folio || ''
  resultadosPropiedades.value = []
  mostrandoResultadosPropiedad.value = false
}

watch(telefono, (nuevoValor) => {
  if (ignorarWatchTelefono.value) {
    ignorarWatchTelefono.value = false
    clearTimeout(timeoutBusquedaClientes)
    return
  }

  clearTimeout(timeoutBusquedaClientes)
  const valorLimpio = typeof nuevoValor === 'string' ? nuevoValor.trim() : ''

  if (valorLimpio.length >= 3) {
    timeoutBusquedaClientes = setTimeout(() => {
      buscarClientesPorTelefono()
    }, 300)
  } else {
    resultadosClientes.value = []
    mostrandoResultadosClientes.value = false
  }
})

watch(codigo, (nuevoValor) => {
  if (ignorarWatchCodigo.value) {
    ignorarWatchCodigo.value = false
    clearTimeout(timeoutBusquedaPropiedad)
    return
  }

  clearTimeout(timeoutBusquedaPropiedad)
  const valorLimpio = typeof nuevoValor === 'string' ? nuevoValor.trim() : ''

  if (valorLimpio.length >= 1) {
    timeoutBusquedaPropiedad = setTimeout(() => {
      buscarPropiedadPorCodigo()
    }, 300)
  } else {
    resultadosPropiedades.value = []
    mostrandoResultadosPropiedad.value = false
    if (selectoresActivos.value) {
      direccion.value = ''
      folio.value = ''
    }
  }
})

watch(estado, (nuevoValor) => {

  if (nuevoValor == 'Caida') {
    mostrarMotivoBaja.value = true
  } else {
    mostrarMotivoBaja.value = false
  }
})

watch(filtroPorEstado, (nuevoValor) => {
  listado(nuevoValor)
})

watch(reservaIdentificada, async (nuevoValor) => {

  try {
    const response = await getIdentificadas(nuevoValor)
    responseListado.value = response.data.resultado
    //console.log(response)

  }
  catch (error) {
    console.log(error)
    showError('Error al obtener las identificadas')
  }

})

/* watch(aceptarMonto, async (nuevoValor) => {
  if (nuevoValor) {
    const data = {
      id: idProcesoPropiedad.value
    }
    try {
      guardarReservaIdentificada(data)
      showSuccess('Reserva confirmada exitosamente')
      // Recargamos el listado de identificadas con el valor actual del select
      const response = await getIdentificadas(reservaIdentificada.value)
      responseListado.value = response.data.resultado

      aceptarMonto.value = false // reseteamos el checkbox
      folio.value = ' ' //limpiamos el folio
      codigo.value = ' ' //limpiamos el codigo
      telefono.value = ' ' //limpiamos el telefono
      nombreCliente.value = ' ' //limpiamos el nombre
      nombreReservante.value = ' ' //limpiamos el nombre
      idCliente.value = ' ' //limpiamos el id
      idAsesor.value = ' ' //limpiamos el id
      asesor.value = ' ' //limpiamos el nombre
      fecha_reserva.value = obtenerHoy() //limpiamos la fecha
      fecha_fin_reserva.value = calcularDiasHabiles() //limpiamos la fecha
      tipo.value = 'EFECTIVO' //limpiamos el tipo
      moneda.value = '$' //limpiamos la moneda
      montoReserva.value = '' //limpiamos el monto
      selectoresActivos.value = true
      getIdentificadas(reservaIdentificada.value)

    }
    catch (error) {
      console.log(error)
      showError('Error al guardar la reserva')
    }
  }
}) */

const handleAceptarMonto = async () => {
  const data = {
    id: idProcesoPropiedad.value
  }
  try {
    await guardarReservaIdentificada(data)
    showSuccess('Reserva confirmada exitosamente')

    // Recargamos el listado de identificadas
    const response = await getIdentificadas(reservaIdentificada.value)
    responseListado.value = response.data.resultado

  } catch (error) {
    console.log(error)
    showError('Error al guardar la reserva')
  }
}
//aca termina lo de telefono
//================================================//

//aca empieza lo relacionado con fechafin
//================================================//
const fecha_fin_reserva = ref('')

// Devuelve la fecha y hora actual en formato compatible con `datetime-local`: YYYY-MM-DDTHH:MM
const obtenerHoy = () => {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  const hora = String(hoy.getHours()).padStart(2, '0')
  const minuto = String(hoy.getMinutes()).padStart(2, '0')
  return `${anio}-${mes}-${dia}T${hora}:${minuto}`
}

// Función para calcular 5 días hábiles desde hoy y devolver datetime-local (YYYY-MM-DDTHH:MM)
const calcularDiasHabiles = () => {
  const ahora = new Date() // fecha y hora actual
  let fecha = new Date(ahora) // copia para iterar
  const hora = String(ahora.getHours()).padStart(2, '0')
  const minuto = String(ahora.getMinutes()).padStart(2, '0')
  let diasSumados = 0

  // Iteramos hasta haber sumado 5 días hábiles
  while (diasSumados < 5) {
    fecha.setDate(fecha.getDate() + 1)
    const diaSemana = fecha.getDay()
    if (diaSemana !== 0 && diaSemana !== 6) {
      diasSumados++
    }
  }

  // Aseguramos que la hora esté establecida igual a la actual
  fecha.setHours(parseInt(hora, 10), parseInt(minuto, 10), 0, 0)

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}T${hora}:${minuto}`
}

//aca termina los relacionado con fechafin
//===============================================//
//Obtenemos el username del usuario actual
const obtenerUsername = async () => {
  try {
    const res = await getUser()
    username.value = res.data.username
    asesor.value = res.data.username
    idAsesor.value = res.data.id

  } catch (error) {
    console.log(error)
  }
}

//Trae a los asesores de alquiler
const traerAsesoresAlquiler = async () => {
  try {
    const res = await asesoresAlquiler()

    // Filtramos los que tienen alquiler 'S' y mapeamos solo el username
    const asesores = res.data
      .filter((asesor) => asesor.alquiler === 'S')
      .map((asesor) => ({
        id: asesor.usuario_id ?? asesor.usuario?.id, // para el :value del option
        username: asesor.usuario_username, // para mostrar
        nombre: asesor.usuario?.name ?? asesor.usuario_username, // para mostrar
      }))

    listaAsesoresAlquiler.value = asesores // ← corregido, antes decía asesoresAlquiler.value

  } catch (error) {
    console.log(error)
  }
}
//Verifica si el usuario tiene permiso para ver los asesores de alquiler
const verificarPermisosAlquileres = async () => {
  try {
    const resp = await verificarPermiso(btnNombre)
    resPermiso.value = resp.data === true

    const resp2 = await verificarPermiso(btnNombrePagada)
    resPermiso2.value = resp2.data
    // Traemos siempre los asesores para poder mapear sus IDs a nombres
    await traerAsesoresAlquiler()

    if (!resPermiso.value) {
      await obtenerUsername()
    }
  } catch (error) {
    console.log(error)
    resPermiso.value = false
  }
}

//Logica de la documentacion
const manejarArchivo = (event) => {
  const archivo = event.target.files[0] // Tomamos el primer archivo seleccionado
  if (archivo) {
    comprobante.value = archivo
  } else {
    comprobante.value = null
  }
}

//enviar los datos al backend
const reservar = async () => {

  // 1. Creamos la instancia de FormData
  const formData = new FormData()

  // 2. Adjuntamos todos los campos de texto uno por uno
  formData.append('asesor', idAsesor.value)
  formData.append('fechaReserva', fecha_reserva.value)
  formData.append('fechaFinReserva', fecha_fin_reserva.value)
  formData.append('idCliente', idCliente.value)
  formData.append('telefono', telefono.value)
  formData.append('nombreCliente', nombreCliente.value)
  formData.append('nombreReservante', nombreReservante.value)
  formData.append('idPropiedad', idPropiedad.value)
  formData.append('codigo', codigo.value)
  formData.append('direccion', direccion.value)
  formData.append('folio', folio.value)
  formData.append('tipo', tipo.value)
  formData.append('moneda', moneda.value)
  formData.append('montoReserva', montoReserva.value)

  // 3. Adjuntamos el archivo físico (si existe)
  if (comprobante.value) {
    formData.append('comprobante', comprobante.value)
  }


  // Si querés debuguear el FormData antes de enviarlo,
  // no podés hacerle un console.log directo. Tenés que usar esto:
  //console.log('Datos a enviar:', Object.fromEntries(formData.entries()))

  //3.5 validamos los campos obligatorios
  if (formData.get('telefono') === '') {
    showError('El telefono es obligatorio')
    return
  }
  if (formData.get('codigo') === '') {
    showError('El codigo es obligatorio')
    return
  }
  if (formData.get('montoReserva') === '') {
    showError('El monto es obligatorio')
    return
  }
  if (formData.get('comprobante') === null) {
    showError('El comprobante es obligatorio')
    return
  }
  // 4. Enviamos el formData completo a la API
  try {
    await subirReservas(formData)
    //limpiamos todos los inputs
    asesor.value = ''
    idAsesor.value = ''
    fecha_reserva.value = obtenerHoy()
    fecha_fin_reserva.value = calcularDiasHabiles()
    idCliente.value = ''
    telefono.value = ''
    nombreCliente.value = ''
    nombreReservante.value = ''
    idPropiedad.value = ''
    codigo.value = ''
    direccion.value = ''
    folio.value = ''
    tipo.value = ''
    moneda.value = ''
    montoReserva.value = ''
    comprobante.value = null

    showSuccess('Reserva realizada exitosamente')
    listado()
  } catch (error) {
    console.log(error)
    showError('Error al realizar la reserva')
  }
}


//obtenemos el listado
const listado = async (estadoFiltrado = '') => {
  try {
    const res = await obtenerReservas(estadoFiltrado)
    responseListado.value = res.data.resultado
  }
  catch (error) {
    console.log(error)
    showError('Error al obtener el listado')
  }
}


// Formatea el folio según la empresa:
// empresa 1 → solo el número | empresa 2 → "CAN X" | empresa 3 → "TRIB X"
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

const seleccionarReserva = (item) => {
  // Evitar que los watchers se disparen y pisen o limpien la data
  ignorarWatchTelefono.value = true
  ignorarWatchCodigo.value = true
  verComprobante.value = true

  const asesorId = item.proceso_propiedad?.asesor
  selectoresActivos.value = false
  if (asesorId) {
    idAsesor.value = asesorId
    // Si no tiene permiso, el input deshabilitado muestra `username.value`.
    // Buscamos el username de este asesor en la lista para mostrarlo.
    const encontrado = listaAsesoresAlquiler.value.find(a => a.id == asesorId)
    if (encontrado) {
      username.value = encontrado.username
    }
  }

  // Asignamos la información del cliente
  telefono.value = item.proceso_propiedad?.cliente?.telefono || ''
  nombreCliente.value = item.proceso_propiedad?.cliente?.nombre || ''
  nombreReservante.value = item.proceso_propiedad?.reservante || ''

  // Asignamos la información de la propiedad
  codigo.value = item.proceso_propiedad?.propiedad?.cod_alquiler || ''
  direccion.value = `${item.proceso_propiedad?.propiedad?.calle?.name || ''}
                     ${item.proceso_propiedad?.propiedad?.numero_calle || ''}
                     ${item.proceso_propiedad?.propiedad?.piso ? 'P' + item.proceso_propiedad?.propiedad?.piso : ''}
                     ${item.proceso_propiedad?.propiedad?.departamento ? 'Dpto' + item.proceso_propiedad?.propiedad?.departamento : ''}`.trim()
  folio.value = formatearFolio(item.proceso_propiedad?.propiedad?.folios)

  // Asignamos la información de la reserva
  fecha_reserva.value = item.proceso_propiedad?.fecha_reserva
  fecha_fin_reserva.value = item.proceso_propiedad?.fecha_fin_reserva
  tipo.value = item.proceso_propiedad?.tipo_reserva
  moneda.value = item.proceso_propiedad?.moneda
  montoReserva.value = item.proceso_propiedad?.monto_reserva

  estado.value = item.estado.id
  idProcesoPropiedad.value = item.proceso_propiedad?.id
  rutaComprobante.value = item.proceso_propiedad?.documentacion
  rutaComprobanteFoto.value = item.proceso_propiedad?.documentacion



  console.log(item)
}

const guardarEstadoNuevo = async () => {
  const data = {
    estado: estado.value,
    motivo_baja: motivoBaja.value,
    detalle: detalle.value,
    idProcesoPropiedad: idProcesoPropiedad.value,

  }

  if (data.detalle === '') {
    showError('La observacion es obligatoria')
    return
  }
  //console.log(data)
  try {
    await guardarEstado(data)
    listado()
    showSuccess('Estado guardado exitosamente')
    estado.value = 1
    detalle.value = ''
    filtroPorEstado.value = ''
    asesor.value = ''
    idAsesor.value = ''
    fecha_reserva.value = obtenerHoy()
    fecha_fin_reserva.value = calcularDiasHabiles()
    idCliente.value = ''
    telefono.value = ''
    nombreCliente.value = ''
    nombreReservante.value = ''
    idPropiedad.value = ''
    codigo.value = ''
    direccion.value = ''
    folio.value = ''
    tipo.value = 'EFECTIVO'
    moneda.value = '$'
    montoReserva.value = ''
    comprobante.value = null
    selectoresActivos.value = true





  } catch (error) {
    console.log(error)
    showError('Error al guardar el estado')
  }
}



onMounted(async () => {
  await verificarPermisosAlquileres()

  fecha_reserva.value = obtenerHoy()
  fecha_fin_reserva.value = calcularDiasHabiles()

  if (resPermiso2.value) {
    // Tiene permiso de identificadas → carga getIdentificadas con valor por defecto
    try {
      const response = await getIdentificadas(reservaIdentificada.value)
      responseListado.value = response.data.resultado
    } catch (error) {
      console.log(error)
      showError('Error al obtener las identificadas')
    }
  } else {
    // No tiene ese permiso → carga el listado normal
    listado()
  }
})
</script>
