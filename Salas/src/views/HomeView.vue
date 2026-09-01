<template>
  <NavComponent />

  <div class="px-5">
    <div class="row d-flex justify-content-between p-2">

      <!-- Contenedor izquierdo para las Agendas -->
      <div class="col-md-10 row">

        <!-- AGENDA -->
        <div :class="usuarioTieneAlquiler
          ? 'col-md-12 card p-0 home-card-all'
          : 'col-md-6 card p-0 home-card-all'">
          <div class="card-header card-header-home">
            Agenda
          </div>

          <div class="card-body-home m-0 p-0">
            <table class="table table-sm table-home table-hover table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Descripcion</th>
                  <th>Direccion</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="data.length === 0">
                  <td colspan="4" class="text-center alerta-agenda-home">
                    "No hay eventos ni tareas registradas para esta semana."
                  </td>
                </tr>

                <tr v-else v-for="item in data" :key="item.id">
                  <td>{{ item.fecha }}</td>
                  <td>{{ item.hora_inicio }} hs.</td>
                  <td>{{ item.descripcion ?? '-' }}</td>
                  <td>
                    {{ item.propiedad?.calle?.name ?? '-' }}
                    {{ item.propiedad?.numero_calle ?? '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        <!-- AGENDA SEMANAL -->
        <!-- <div v-if="!usuarioTieneAlquiler" class="col-md-6 card p-0 home-card-all">
          <div class="card-header card-header-home">
            Agenda Semanal
          </div>

          <div class="card-body-home m-0 p-0">
            <table class="table table-sm table-home table-hover table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Descripcion</th>
                  <th>Direccion</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="semanales.length === 0">
                  <td colspan="4" class="text-center">
                    "No hay eventos ni tareas registradas para esta semana."
                  </td>
                </tr>

                <tr v-else v-for="item in semanales" :key="item.id">
                  <td>{{ item.fecha }}</td>
                  <td>{{ item.hora_inicio }} hs.</td>
                  <td>{{ item.descripcion ?? '-' }}</td>
                  <td>
                    {{ item.propiedad?.calle?.name ?? '-' }}
                    {{ item.propiedad?.numero_calle ?? '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> -->

      </div>


      <!-- BARRA DE CONTACTOS / LISTADO DE CLIENTES -->
      <!-- Solo se muestra si el usuario tiene alquiler = S -->
      <div v-if="usuarioTieneAlquiler" class="col-md-2 barras-asesores form-group">

        <!-- Filtros + buscador -->
        <div class="row pb-1">

          <!-- Filtro por potabilidad -->
          <div class="col-12 pb-1 px-2">

            <div>
              <label>Clientes Asignados</label>
            </div>
          </div>
          <!-- Buscador -->
          <div class="col-12 pb-1 px-2">
            <input type="text" id="buscarInput" class="form-control py-1" placeholder="Buscar" v-model="buscar"
              autocomplete="off">
          </div>
        </div>
        <!-- Lista contactos -->
        <div>
          <!-- Cargando -->
          <div v-if="recargando" class="text-center p-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">
                Cargando...
              </span>
            </div>

            <p class="mt-2">
              Actualizando lista...
            </p>
          </div>

          <!-- Clientes -->
          <ul v-else class="list-group list-group-flush scroll lista-contacto-asesores">

            <li v-for="cliente in clientesFiltrados" :key="cliente.id_cliente"
              class="list-group-item list-group-item-action pt-0 pb-1 px-2">

              <div class="row">
                <!-- Datos del cliente -->
                <div class="d-flex justify-content-between align-items-center col-12 nombre-contacto-asesores">
                  <!-- Nombre -->
                  <div class="col-9">
                    <strong :class="obtenerColorCliente(cliente)">
                      {{ cliente.nombre }}
                    </strong>
                  </div>

                  <div class="col-1">
                    <button type="button" class="btn p-0 border-0" @click="editarCliente(cliente)">
                      <i class="bi bi-pencil-fill boton-editar-clientes-asesores"></i>
                    </button>
                  </div>
                  <div class="col-1">
                    <button type="button" class="btn p-0 border-0" @click="MasInformacion(cliente)">
                     <i class="bi bi-info-circle-fill boton-editar-clientes-asesores"></i>
                    </button>
                  </div>

                </div>


                <!-- Telefono -->
                <div class="d-flex justify-content-between align-items-center col-12 telefono-contacto-asesores">

                  <div class="col-6">
                    {{ cliente.telefono }}
                    <a :href="`https://web.whatsapp.com/send?phone=${cliente.telefono}&text=Hola%20${cliente.nombre?.split(',')[0] || ''}`"
                      target="_blank" class="boton-whatsapp-clientes-asesores text-decoration-none" @click.stop>
                      <i class="bi bi-whatsapp"></i>
                    </a>
                  </div>


                  <!-- Fecha mas alta del array -->
                  <div class="col-4 fecha-contacto-asesores">
                    {{
                      cliente.criterios_ordenados?.some(
                        c => c.fecha_criterio_venta
                      )
                        ? formatDate(
                          cliente.criterios_ordenados?.reduce(
                            (max, c) =>
                              c.fecha_criterio_venta > max
                                ? c.fecha_criterio_venta
                                : max,
                            cliente.criterios_ordenados[0]
                              .fecha_criterio_venta
                          )
                        )
                        : ''
                    }}

                  </div>

                </div>
              </div>
            </li>
          </ul>

          <ModalEditarCliente :show="showEditarClienteModal" :cliente="clienteSeleccionado" :modo-home="true"
            @close="showEditarClienteModal = false" @criterio-actualizado="recargarListaCompleta" />

          <ModalInformacionCliente :show="showMasInformacionClienteModal" :cliente="clienteSeleccionado" 
            @close="showMasInformacionClienteModal = false" @criterio-actualizado="recargarListaCompleta" />

        </div>

      </div>



    </div>
  </div>
</template>


<script setup>

import NavComponent from '../components/NavComponent.vue'
import ModalEditarCliente from '../components/Atcl/Cliente/Asesores/ModalEditarCliente.vue'
import ModalInformacionCliente from '../components/ModalInformacionCliente.vue'

import { traerAgendaDiaria } from '../Services/api/Agenda/AgendaApi'

import {
  getAsesoresAlq
} from '../Services/api/Atcl/Cliente/ClienteApi'

import {
  getUser
} from '../Services/api/Usuario/userApi'

import {
  useDateFormatter
} from "@/composables/useDateFormatter"

import {
  ref,
  onMounted,
  computed
} from 'vue'

import {
  asesoresAlquiler
} from '../Services/api/Atcl/Alquiler/Alquiler'


const { formatDate } = useDateFormatter()


// =====================================================
// VARIABLES
// =====================================================
const data = ref([])
const semanales = ref([])
// Barra de contactos
const clientes = ref([])
const clienteSeleccionado = ref(null)
const showEditarClienteModal = ref(false)
const showMasInformacionClienteModal = ref(false)
const currentUserId = ref(null)
const buscar = ref('')
/* const iconoSeleccionado = ref('bi bi-card-checklist') */
const recargando = ref(false)
// Lista de asesores
const listaAsesoresAlquiler = ref([])
// NUEVO:
// Indica si el usuario actual tiene alquiler = S
const usuarioTieneAlquiler = ref(false)



// =====================================================
// AGENDA
// =====================================================

const listadoDiario = async () => {

  try {

    const response = await traerAgendaDiaria()

    data.value = response.data.diarias

    semanales.value = response.data.semanales

  } catch (error) {

    console.error(
      'Error al listar agenda',
      error
    )

  }

}


// =====================================================
// CARGAR USUARIO + ASESORES + CLIENTES
// =====================================================

const cargarAsesoresYUsuario = async () => {

  recargando.value = true

  try {

    const token = localStorage.getItem('token')

    if (!token) {
      console.warn('No existe token de sesión')
      return
    }
    // -------------------------------------------------
    // 1. OBTENER USUARIO ACTUAL
    // -------------------------------------------------

    const userRes = await getUser(token)
    currentUserId.value =
      userRes.data.id ||
      userRes.data.usuario_id ||
      userRes.data.usuario?.id


    /* console.log(
      'ID usuario actual:',
      currentUserId.value
    ) */



    // -------------------------------------------------
    // 2. OBTENER ASESORES DE ALQUILER
    // -------------------------------------------------

    const response = await asesoresAlquiler()

    /* console.log(
      'asesoresAlquiler:',
      response
    ) */


    listaAsesoresAlquiler.value =
      response.data || []


    // -------------------------------------------------
    // 3. BUSCAR AL USUARIO ACTUAL
    // -------------------------------------------------

    const asesorActual =
      listaAsesoresAlquiler.value.find(
        asesor =>
          Number(asesor.id_usuario) ===
          Number(currentUserId.value)
      )


    /*  console.log(
       'Asesor actual:',
       asesorActual
     ) */


    // -------------------------------------------------
    // 4. VERIFICAR ALQUILER
    // -------------------------------------------------

    usuarioTieneAlquiler.value =
      asesorActual?.alquiler === 'S'


    /* console.log(
      'Usuario tiene alquiler:',
      usuarioTieneAlquiler.value
    ) */


    // -------------------------------------------------
    // 5. CARGAR CLIENTES
    // -------------------------------------------------

    const asesoresInfo =
      await getAsesoresAlq(token)

    clientes.value =
      asesoresInfo.data.clientes || []


  } catch (error) {

    console.error(
      'Error al cargar clientes o usuario',
      error
    )

  } finally {

    recargando.value = false

  }

}




// =====================================================
// OBTENER POTABILIDAD DEL CLIENTE
// =====================================================

const editarCliente = (cliente) => {
  clienteSeleccionado.value = cliente
  showEditarClienteModal.value = true
}

const MasInformacion = (cliente) =>{
  clienteSeleccionado.value = cliente
  showMasInformacionClienteModal.value = true
}

const recargarListaCompleta = async () => {
  await cargarAsesoresYUsuario()
}

const obtenerColorCliente = (cliente) => {
  if (cliente.estado_alq && cliente.estado_alq !== 'Pendiente') {
    return 'text-danger'
  }
  return ''
}

const ordenarClientesPorEstado = (clientes) => {
  return [...clientes].sort((a, b) => {
    const estadoA = a.estado_alq || 'Pendiente'
    const estadoB = b.estado_alq || 'Pendiente'

    // Pendiente primero
    if (estadoA === 'Pendiente' && estadoB !== 'Pendiente') return -1
    if (estadoA !== 'Pendiente' && estadoB === 'Pendiente') return 1

    // Finalizado al final
    if (estadoA === 'Finalizado' && estadoB !== 'Finalizado') return 1
    if (estadoA !== 'Finalizado' && estadoB === 'Finalizado') return -1

    return 0
  })
}


// =====================================================
// CLIENTES FILTRADOS
// =====================================================

const clientesFiltrados = computed(() => {

  // Solo clientes del usuario actual
  let filtrados = clientes.value.filter(c => c.id_asesor_alquiler == currentUserId.value)

  // Buscador

  if (buscar.value.trim() !== '' ) {
    const busqueda = buscar.value.toLowerCase().trim()
    filtrados = filtrados.filter( cliente => (cliente.nombre ?? '').toLowerCase().includes(busqueda) || String( cliente.telefono ?? '' ).toLowerCase().includes(busqueda))
  }
  // Ordenar por estado: Pendiente primero, Finalizado al último
  filtrados = ordenarClientesPorEstado(filtrados)

  return filtrados

})


// =====================================================
// AL MONTAR COMPONENTE
// =====================================================

onMounted(() => {
  listadoDiario()
  cargarAsesoresYUsuario()

})

</script>
