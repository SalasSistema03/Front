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
            <!--
            <div class="dropdown selector_potabilidad-asesores">
              <button
                class="btn btn-outline-secondary dropdown-toggle w-100 d-flex align-items-center justify-content-between"
                type="button"
                id="potabilidadDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="d-flex align-items-center icons">
                  <i :class="iconoSeleccionado" class="me-2"></i>
                  <div class="small">{{ textoSeleccionado }}</div>
                </span>
              </button>

              <ul
                class="dropdown-menu w-100"
                aria-labelledby="potabilidadDropdown"
              >
                <li>
                  <a
                    class="dropdown-item d-flex align-items-center"
                    href="#"
                    @click.prevent="seleccionarPotabilidad(
                      'Todos',
                      'bi bi-card-checklist text-primary'
                    )"
                  >
                    <i class="me-2 bi bi-card-checklist"></i>
                    <div class="texto-seleccionado">Todos</div>
                  </a>
                </li>

                <li>
                  <a
                    class="dropdown-item d-flex align-items-center"
                    href="#"
                    @click.prevent="seleccionarPotabilidad(
                      'Potable',
                      'bi bi-emoji-smile text-success'
                    )"
                  >
                    <i class="bi bi-emoji-smile me-2 text-success"></i>
                    <div class="texto-seleccionado">Potable</div>
                  </a>
                </li>

                <li>
                  <a
                    class="dropdown-item d-flex align-items-center"
                    href="#"
                    @click.prevent="seleccionarPotabilidad(
                      'Medio',
                      'bi bi-emoji-expressionless text-warning'
                    )"
                  >
                    <i class="bi bi-emoji-expressionless me-2 text-warning"></i>
                    <div class="texto-seleccionado">Medio</div>
                  </a>
                </li>

                <li>
                  <a
                    class="dropdown-item d-flex align-items-center"
                    href="#"
                    @click.prevent="seleccionarPotabilidad(
                      'No Potable',
                      'bi bi-emoji-frown text-danger'
                    )"
                  >
                    <i class="bi bi-emoji-frown me-2 text-danger"></i>
                    <div class="texto-seleccionado">No Potable</div>
                  </a>
                </li>
              </ul>
            </div>
            -->

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
                  <div class="col-10">
                    <strong :class="obtenerColorCliente(cliente)">
                      {{ cliente.nombre }}
                    </strong>
                  </div>

                  <div class="col-1">
                    <button type="button" class="btn p-0 border-0" @click="editarCliente(cliente)">
                      <i class="bi bi-pencil-fill boton-editar-clientes-asesores"></i>
                    </button>
                  </div>


                  <!--
                  <div class="col-1 tipo-potabiliadad-asesores" v-if="
                    cliente.criterios_ordenados?.some(
                      c => c.estado_criterio_venta === 'Activo'
                    )
                  ">

                    <div class="col-1 tipo-potabiliadad-asesores" v-if="getPotabilidadCliente(cliente) === 'o'">
                      <i class="bi bi-pencil-square text-secondary"></i>
                    </div>

                    <div class="col-1 tipo-potabiliadad-asesores" v-else-if="getPotabilidadCliente(cliente) === 'p'">
                      <i class="bi bi-emoji-smile text-success"></i>
                    </div>

                    <div class="col-1 tipo-potabiliadad-asesores" v-else-if="getPotabilidadCliente(cliente) === 'm'">
                      <i class="bi bi-emoji-neutral text-warning"></i>
                    </div>

                    <div class="col-1 tipo-potabiliadad-asesores" v-else-if="getPotabilidadCliente(cliente) === 'np'">
                      <i class="bi bi-emoji-frown text-danger"></i>
                    </div>

                  </div>



                  <div class="col-1 tipo-potabiliadad-asesores" v-else-if="
                    cliente.criterios_ordenados?.some(
                      c => c.estado_criterio_venta === 'Inactivo'
                    )
                  ">
                    <i class="bi bi-folder2-open text-dark"></i>
                  </div>



                  <div class="col-1 tipo-potabiliadad-asesores" v-else-if="
                    cliente.criterios_ordenados?.some(
                      c => c.estado_criterio_venta === 'Finalizado'
                    )
                  ">
                    <i class="bi bi-clipboard-check text-primary"></i>
                  </div> -->

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


                <!-- Nombre de la inmobiliaria -->
                <!-- <div class="d-flex justify-content-start align-items-center col-12"
                  v-if="cliente.nombre_de_inmobiliaria">

                  <span class="badge pertenece-inmobiliaria-asesores">

                    <div class="bi bi-houses">

                      <span class="ms-1">
                        {{ cliente.nombre_de_inmobiliaria }}
                      </span>

                    </div>

                  </span>

                </div> -->

              </div>

            </li>

          </ul>

          <ModalEditarCliente :show="showEditarClienteModal" :cliente="clienteSeleccionado" :modo-home="true"
            @close="showEditarClienteModal = false" @criterio-actualizado="recargarListaCompleta" />

        </div>

      </div>



    </div>
  </div>
</template>


<script setup>

import NavComponent from '../components/NavComponent.vue'
import ModalEditarCliente from '../components/Atcl/Cliente/Asesores/ModalEditarCliente.vue'

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
const currentUserId = ref(null)
const buscar = ref('')
const textoSeleccionado = ref('Todos')
/* const iconoSeleccionado = ref('bi bi-card-checklist') */
const filtroSinDevolucion = ref(false)
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
// POTABILIDAD
// =====================================================
/*
const seleccionarPotabilidad = (
  texto,
  icono
) => {

  textoSeleccionado.value = texto

  iconoSeleccionado.value = icono

} */


// =====================================================
// OBTENER POTABILIDAD DEL CLIENTE
// =====================================================

const editarCliente = (cliente) => {
  clienteSeleccionado.value = cliente
  showEditarClienteModal.value = true
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

/* const getPotabilidadCliente = (cliente) => {

  if (
    !cliente.criterios_ordenados ||
    cliente.criterios_ordenados.length === 0
  ) {
    return 'nul'
  }


  const criteriosActivos =
    cliente.criterios_ordenados.filter(
      c =>
        c.estado_criterio_venta === 'Activo'
    )


  if (criteriosActivos.length === 0) {
    return 'nul'
  }


  const categorias =
    criteriosActivos.map(
      c => c.id_categoria
    )


  if (categorias.includes(null)) {
    return 'o'
  }

  else if (categorias.includes('Potable')) {
    return 'p'
  }

  else if (categorias.includes('Medio')) {
    return 'm'
  }

  else if (categorias.includes('No Potable')) {
    return 'np'
  }

  else {
    return 'o'
  }

} */


// =====================================================
// DEVOLUCIONES PENDIENTES
// =====================================================

const clienteTieneDevolucionesPendientes = (
  cliente
) => {

  const criterios =
    Array.isArray(
      cliente?.criterios_ordenados
    )
      ? cliente.criterios_ordenados
      : []


  const criteriosActivos =
    criterios.filter(
      c =>
        c?.estado_criterio_venta === 'Activo'
    )


  const criteriosARevisar =
    criteriosActivos.length
      ? criteriosActivos
      : criterios


  return criteriosARevisar.some(
    criterio => {

      const consultas =
        Array.isArray(
          criterio?.historial_consultas
        )
          ? criterio.historial_consultas
          : []


      const ofrecimientos =
        Array.isArray(
          criterio?.historial_ofrecimientos
        )
          ? criterio.historial_ofrecimientos
          : []


      const muestras =
        Array.isArray(
          criterio?.historial_muestras
        )
          ? criterio.historial_muestras
          : []


      const hayPendiente = (arr) =>
        arr.some(
          x =>
            x &&
            (
              x.devolucion === null ||
              x.devolucion === undefined ||
              String(x.devolucion).trim() === ''
            )
        )


      return (
        hayPendiente(consultas) ||
        hayPendiente(ofrecimientos) ||
        hayPendiente(muestras)
      )

    }
  )

}


// =====================================================
// CLIENTES FILTRADOS
// =====================================================

const clientesFiltrados = computed(() => {

  // Solo clientes del usuario actual

  let filtrados =
    clientes.value.filter(
      c =>
        c.id_asesor_alquiler ==
        currentUserId.value
    )


  // Filtro potabilidad

  if (
    textoSeleccionado.value !== 'Todos'
  ) {

    filtrados =
      filtrados.filter(
        cliente => {

          const potabilidad =
            getPotabilidadCliente(
              cliente
            )


          switch (
          textoSeleccionado.value
          ) {

            case 'Potable':
              return potabilidad === 'p'

            case 'Medio':
              return potabilidad === 'm'

            case 'No Potable':
              return potabilidad === 'np'

            default:
              return true

          }

        }
      )

  }


  // Buscador

  if (
    buscar.value.trim() !== ''
  ) {

    const busqueda =
      buscar.value
        .toLowerCase()
        .trim()


    filtrados =
      filtrados.filter(
        cliente =>

          (cliente.nombre ?? '')
            .toLowerCase()
            .includes(busqueda)

          ||

          String(
            cliente.telefono ?? ''
          )
            .toLowerCase()
            .includes(busqueda)

      )

  }


  // Devoluciones pendientes

  if (
    filtroSinDevolucion.value
  ) {

    filtrados =
      filtrados.filter(
        cliente =>
          clienteTieneDevolucionesPendientes(
            cliente
          )
      )

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
