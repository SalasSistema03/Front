<template>
  <NavComponent titulo="Asesores"></NavComponent>
  <div class="cont px-3">
    <div class="row">

      <!-- col-md-2: Barra contactos -->
      <div class="col-md-2 barra-asesores form-group">
        <!-- Filtros + buscador -->
        <div class="row pb-1  ">
          <!-- Filtro por potabilidad con menú desplegable -->
          <div class="col-6 pb-1 px-2 ">

            <div class="dropdown selector_potabilidad-asesores">
              <button
                class="btn btn-outline-secondary dropdown-toggle w-100 d-flex align-items-center justify-content-between"
                type="button" id="potabilidadDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="d-flex align-items-center icons">
                  <i :class="iconoSeleccionado" class="me-2"></i>
                  <div class="small">{{ textoSeleccionado }}</div>
                </span>
              </button>
              <ul class="dropdown-menu w-100" aria-labelledby="potabilidadDropdown">
                <li>
                  <a class="dropdown-item d-flex align-items-center" href="#"
                    @click="seleccionarPotabilidad('Todos', 'bi bi-card-checklist text-primary')">
                    <i class=" me-2 bi bi-card-checklist"></i>
                    <div class="texto-seleccionado">Todos</div>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item d-flex align-items-center" href="#"
                    @click="seleccionarPotabilidad('Potable', 'bi bi-emoji-smile text-success')">
                    <i class="bi bi-emoji-smile me-2 text-success"></i>
                    <div class="texto-seleccionado">Potable</div>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item d-flex align-items-center" href="#"
                    @click="seleccionarPotabilidad('Medio', 'bi bi-emoji-expressionless text-warning')">
                    <i class="bi bi-emoji-expressionless me-2 text-warning"></i>
                    <div class="texto-seleccionado">Medio</div>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item d-flex align-items-center" href="#"
                    @click="seleccionarPotabilidad('No Potable', 'bi bi-emoji-frown text-danger')">
                    <i class="bi bi-emoji-frown me-2 text-danger"></i>
                    <div class="texto-seleccionado">No Potable</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- Filtro por devolución con checkbox -->
          <div class="col-6 pb-1 px-2 d-flex ">
            <label for="devolucionInput" class="form-label devolucionT  p-1">Devolucion</label>
            <input class="form-check-input mt-2 p-1" type="checkbox" value=""
              aria-label="Checkbox for following text input" id="devolucionescheck">
          </div>
          <!-- Buscador -->
          <div class="col-12 pb-1 px-2">
            <input type="text" id="buscarInput" class="form-control py-1" placeholder="Buscar " v-model="buscar"
              autocomplete="off">
          </div>
        </div>
        <!-- Lista contactos -->
        <div class="">
          <ul class="list-group list-group-flush scroll lista-contacto-asesores">
            <!-- Iteramos sobre los clientes -->
            <li v-for="cliente in clientesFiltrados" :key="cliente.id_cliente"
              class="list-group-item list-group-item-action pt-0 pb-1 px-2" @click="seleccionarCliente(cliente)">
              <div class="row">
                <!-- Datos del cliente -->
                <div class="d-flex justify-content-between align-items-center col-12 nombre-contacto-asesores">
                  <!-- Nombre del cliente -->
                  <div class="col-10">
                    <strong>{{ cliente.nombre }}</strong>
                  </div>
                  <div class="col-1 tipo-potabiliadad-asesores"
                    v-if="cliente.criterios_ordenados?.some(c => c.estado_criterio_venta === 'Activo')">

                    <!-- En lugar de tu condición anterior -->
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
                  <div class="col-1 tipo-potabiliadad-asesores"
                    v-else-if="cliente.criterios_ordenados?.some(c => c.estado_criterio_venta === 'Inactivo')">
                    <i class="bi bi-folder2-open text-dark"></i>
                  </div>

                  <div class="col-1 tipo-potabiliadad-asesores"
                    v-else-if="cliente.criterios_ordenados?.some(c => c.estado_criterio_venta === 'Finalizado')">

                    <i class="bi bi-clipboard-check text-primary"></i>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center col-12 telefono-contacto-asesores">
                  <!-- Telefono y boton whatsapp -->
                  <div class="col-6">
                    {{ cliente.telefono }}

                    <a :href="`https://web.whatsapp.com/send?phone=${cliente.telefono}&text=Hola%20${cliente.nombre.split(',')[0]}`"
                      target="_blank" class="boton-whatsapp-clientes-asesores text-decoration-none">
                      <i class="bi bi-whatsapp"></i>
                    </a>
                  </div>

                  <!-- Fecha  mas alta del array -->
                  <div class=" col-4 fecha-contacto-asesores ">
                    {{cliente.criterios_ordenados?.some(c => c.fecha_criterio_venta) ?
                      cliente.criterios_ordenados?.reduce((max, c) => c.fecha_criterio_venta > max ?
                        c.fecha_criterio_venta : max, cliente.criterios_ordenados[0].fecha_criterio_venta) : ''}}
                  </div>
                  <!-- Boton editar cliente -->
                  <div class=" col-1 ">
                    <button type=" button" class="btn p-0 border-0">
                      <i class="bi bi-pencil-fill boton-editar-clientes-asesores"></i>
                    </button>
                  </div>
                </div>
                <!-- Nombre de la inmobiliaria -->
                <div class="d-flex justify-content-start align-items-center col-12"
                  v-if="cliente.pertenece_a_inmobiliaria === 'S' && cliente.nombre_de_inmobiliaria">

                  <span class="badge  pertenece-inmobiliaria-asesores">
                    <div class="bi bi-houses ">
                      <span class="ms-1">{{ cliente.nombre_de_inmobiliaria }}</span>
                    </div>
                  </span>

                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- col-md-2: Lista criterios -->
      <div class="col-md-2 barra-asesores px-2">
        <!-- Header -->

        <div class="titulo-columna-asesores d-flex justify-content-center align-items-center" v-if="!clienteSeleccionado">
          Criterios
        </div>
        <div class="titulo-columna-asesores d-flex justify-content-center align-items-center" v-else>
          {{ clienteSeleccionado.nombre }}
        </div>

        <!-- Criterios container -->
        <div class="pt-2 px-2 lista-codigos-asesores" v-if="clienteSeleccionado && clienteSeleccionado.criterios_ordenados">
          <div v-for="criterio in clienteSeleccionado.criterios_ordenados" :key="criterio.id_criterio_venta"
          class="row creterio-asesores p-2 mb-2">
            <div class="col-2 criterio-titulos-asesores p-0 d-flex justify-content-star align-items-center">
              Tipo:
            </div>
            <div class="col-10 criterio-texto-asesores pl-0 d-flex justify-content-star align-items-center">
              {{ criterio.tipo_inmueble.inmueble }}
            </div>
            <div class="col-2 criterio-titulos-asesores p-0 d-flex justify-content-star align-items-center">
              Dorm:
            </div>
            <div class="col-10 criterio-texto-asesores pl-0 d-flex justify-content-star align-items-center">
              {{ criterio.cant_dormitorios }}
            </div>
            <div class="col-2 criterio-titulos-asesores p-0 d-flex justify-content-star align-items-center">
              Estado:
            </div>
            <div class="col-10 criterio-texto-asesores pl-0 d-flex justify-content-star align-items-center">
              {{ criterio.estado_criterio_venta }}
            </div>
            <div class="col-2 criterio-titulos-asesores p-0 d-flex justify-content-star align-items-center">
              Fecha:
            </div>
            <div class="col-10 criterio-texto-asesores pl-0 d-flex justify-content-star align-items-center">
              {{ criterio.fecha_criterio_venta }}
            </div>
            <div class="col-2 criterio-titulos-asesores p-0 d-flex justify-content-star align-items-center">
              Precio:
            </div>
            <div class="col-10 criterio-texto-asesores pl-0 d-flex justify-content-star align-items-center">
              {{ criterio.precio_hasta || 'No especificado' }}
            </div>
            <div class="col-12 row criterio-titulos-asesores px-1">
              <div class="col-6 d-flex justify-content-center align-items-center">
                <button type="button" class="btn p-0 border-0">
                  <i class="bi bi-pencil-fill boton-editar-criterio-asesores"></i>
                </button>
              </div>
              <div class="col-6 d-flex justify-content-center align-items-center">

                <div class="col-1 tipo-potabiliadad-asesores" v-if="getPotabilidadCriterio(criterio.id_categoria) === 'O'">
                      <i class="bi bi-pencil-square text-secondary"></i>
                    </div>
                    <div class="col-1 tipo-potabiliadad-asesores" v-else-if="getPotabilidadCriterio(criterio.id_categoria) === 'P'">
                      <i class="bi bi-emoji-smile text-success"></i>
                    </div>
                    <div class="col-1 tipo-potabiliadad-asesores" v-else-if="getPotabilidadCriterio(criterio.id_categoria) === 'M'">
                      <i class="bi bi-emoji-neutral text-warning"></i>
                    </div>
                    <div class="col-1 tipo-potabiliadad-asesores" v-else-if="getPotabilidadCriterio(criterio.id_categoria) === 'NP'">
                      <i class="bi bi-emoji-frown text-danger"></i>
                    </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- col-md-6: Conversación -->
      <div class="col-md-6 barra-asesores">

        <!-- Header -->
        <div class="titulo-columna-asesores d-flex justify-content-center align-content-center">
          Conversación
        </div>

        <!-- Mensajes -->

        <div class="flex-grow-1 overflow-auto ">
          <ul class="list-group list-group-flush p-2 contenedor_conversacion_asesores">
            <li class="list-group-item conversacion_asesores">
              2025-10-08 08:42:08&nbsp;&nbsp;&nbsp;Esta conversando con pablo&nbsp;&nbsp;&nbsp;</li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 09:27:22&nbsp;&nbsp;&nbsp;Propiedad ofrecida Codigo: 9008 - Direccion: HIPOLITO IRIGOYEN
              3231&nbsp;&nbsp;&nbsp;
            <li class=" list-group-item conversacion_asesores_devolcucion">2026-01-29 15:01:16 -
              - - Quiere verla, le interesa mucho - </li>
            </li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 15:01:47&nbsp;&nbsp;&nbsp;Se muestra la propiedad: 9008 - Direccion: HIPOLITO IRIGOYEN 3231 a
              las 15:30 en el dia 29/01/2026&nbsp;&nbsp;&nbsp;
              <button class="ms-2 btn btn-sm btn-light-conversacion-asesores">Devolucion</button>
            </li>
            <li class="list-group-item conversacion_asesores">
              2025-10-08 08:42:08&nbsp;&nbsp;&nbsp;Esta conversando con pablo&nbsp;&nbsp;&nbsp;</li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 09:27:22&nbsp;&nbsp;&nbsp;Propiedad ofrecida Codigo: 9008 - Direccion: HIPOLITO IRIGOYEN
              3231&nbsp;&nbsp;&nbsp;
            <li class=" list-group-item conversacion_asesores_devolcucion">2026-01-29 15:01:16 -
              - - Quiere verla, le interesa mucho - </li>
            </li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 15:01:47&nbsp;&nbsp;&nbsp;Se muestra la propiedad: 9008 - Direccion: HIPOLITO IRIGOYEN 3231 a
              las 15:30 en el dia 29/01/2026&nbsp;&nbsp;&nbsp;
              <button class="ms-2 btn btn-sm btn-light-conversacion-asesores">Devolucion</button>
            </li>
            <li class="list-group-item conversacion_asesores">
              2025-10-08 08:42:08&nbsp;&nbsp;&nbsp;Esta conversando con pablo&nbsp;&nbsp;&nbsp;</li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 09:27:22&nbsp;&nbsp;&nbsp;Propiedad ofrecida Codigo: 9008 - Direccion: HIPOLITO IRIGOYEN
              3231&nbsp;&nbsp;&nbsp;
            <li class=" list-group-item conversacion_asesores_devolcucion">2026-01-29 15:01:16 -
              - - Quiere verla, le interesa mucho - </li>
            </li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 15:01:47&nbsp;&nbsp;&nbsp;Se muestra la propiedad: 9008 - Direccion: HIPOLITO IRIGOYEN 3231 a
              las 15:30 en el dia 29/01/2026&nbsp;&nbsp;&nbsp;
              <button class="ms-2 btn btn-sm btn-light-conversacion-asesores">Devolucion</button>
            </li>
            <li class="list-group-item conversacion_asesores">
              2025-10-08 08:42:08&nbsp;&nbsp;&nbsp;Esta conversando con pablo&nbsp;&nbsp;&nbsp;</li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 09:27:22&nbsp;&nbsp;&nbsp;Propiedad ofrecida Codigo: 9008 - Direccion: HIPOLITO IRIGOYEN
              3231&nbsp;&nbsp;&nbsp;
            <li class=" list-group-item conversacion_asesores_devolcucion">2026-01-29 15:01:16 -
              - - Quiere verla, le interesa mucho - </li>
            </li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 15:01:47&nbsp;&nbsp;&nbsp;Se muestra la propiedad: 9008 - Direccion: HIPOLITO IRIGOYEN 3231 a
              las 15:30 en el dia 29/01/2026&nbsp;&nbsp;&nbsp;
              <button class="ms-2 btn btn-sm btn-light-conversacion-asesores">Devolucion</button>
            </li>
            <li class="list-group-item conversacion_asesores">
              2025-10-08 08:42:08&nbsp;&nbsp;&nbsp;Esta conversando con pablo&nbsp;&nbsp;&nbsp;</li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 09:27:22&nbsp;&nbsp;&nbsp;Propiedad ofrecida Codigo: 9008 - Direccion: HIPOLITO IRIGOYEN
              3231&nbsp;&nbsp;&nbsp;
            <li class=" list-group-item conversacion_asesores_devolcucion">2026-01-29 15:01:16 -
              - - Quiere verla, le interesa mucho - </li>
            </li>
            <li class="list-group-item conversacion_asesores">
              2026-01-29 15:01:47&nbsp;&nbsp;&nbsp;Se muestra la propiedad: 9008 - Direccion: HIPOLITO IRIGOYEN 3231 a
              las 15:30 en el dia 29/01/2026&nbsp;&nbsp;&nbsp;
              <button class="ms-2 btn btn-sm btn-light-conversacion-asesores">Devolucion</button>
            </li>

          </ul>
        </div>
        <!-- Input form -->
        <div class="p-3">
          <form id="form-mensaje" method="POST">
            <div class="input-group form-group">
              <!-- botones de acciones, agenda,buscar -->
              <button type="button" class="btn btn-sm px-2 ms-2 btn-adds-conversacion-asesores"
                title="Buscar Propiedad">
                <i class="bi bi-search"></i>
              </button>
              <button type="button" class="btn btn-sm px-2 ms-2 btn-adds-conversacion-asesores" title="Agendar"><i
                  class="bi bi-calendar-plus"></i></button>

              <input type="text" name="mensaje" class="form-control px-1 ms-1 input-texto ms-2"
                placeholder="Escribe un mensaje...">
              <input type="hidden" name="fecha_hora" value="{{ now() }}">
              <input type="hidden" name="id_criterio_venta" id="input-id-criterio">
              <input type="hidden" name="last_modified_by" id="input-last-modified-by"
                value="{{ session()->get('usuario_id') }}">

              <button type="submit" class="btn btn-sm px-3 ms-2 btn-adds-conversacion-asesores">
                <i class="bi bi-send"></i>
              </button>
            </div>
          </form>
        </div>

      </div>

      <!-- col-md-2: Códigos -->
      <div class="col-md-2 barra-asesores">
        <!-- Header -->
        <div class="titulo-columna-asesores d-flex justify-content-center align-content-center">
          Codigos
        </div>

        <div class="lista-codigos-asesores">
          <ul class="list-group list-group-flush">
            <li class="list-group-item  p-1">
              <div class="codigos-ofrecido-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 1</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-agendado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 2</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-consultado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 3</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item  p-1">
              <div class="codigos-ofrecido-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 1</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-agendado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 2</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-consultado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 3</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item  p-1">
              <div class="codigos-ofrecido-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 1</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-agendado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 2</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-consultado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 3</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item  p-1">
              <div class="codigos-ofrecido-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 1</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-agendado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 2</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-consultado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 3</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item  p-1">
              <div class="codigos-ofrecido-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 1</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-agendado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 2</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
            <li class="list-group-item p-1">
              <div class="codigos-consultado-asesores">
                <div class="row p-1">
                  <div class="col-7">Código 3</div>
                  <div class="col-5"><i class="bi bi-check-lg"></i>
                  </div>
                  <div class="col-12"> direccion tentativa del inmueble</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import NavComponent from "../../../components/NavComponent.vue";
import { getAsesores } from "../../../Services/api/Atcl/Cliente/ClienteApi";
export default {
  components: {
    NavComponent
  },
  data() {

    const clientes = [];
    const buscar = '';
    const clienteSeleccionado = ''

    return {
      textoSeleccionado: 'Todos',
      iconoSeleccionado: 'bi bi-card-checklist',
      clientes,
      buscar,
      clienteSeleccionado
    }
  },
  computed: {
    clientesFiltrados() {
      let clientesFiltrados = this.clientes;

      // Filtrar por potabilidad si no es "Todos"
      if (this.textoSeleccionado !== 'Todos') {
        clientesFiltrados = clientesFiltrados.filter(cliente => {
          const potabilidad = this.getPotabilidadCliente(cliente);

          switch (this.textoSeleccionado) {
            case 'Potable':
              return potabilidad === 'p';
            case 'Medio':
              return potabilidad === 'm';
            case 'No Potable':
              return potabilidad === 'np';
            default:
              return true;
          }
        });
      }

      // Filtrar por nombre si hay texto de búsqueda
      if (this.buscar.trim() !== '') {
        clientesFiltrados = clientesFiltrados.filter(cliente =>
          cliente.nombre.toLowerCase().includes(this.buscar.toLowerCase())
        );
      }

      return clientesFiltrados;
    }
  },
  methods: {
    seleccionarPotabilidad(texto, icono) {
      this.textoSeleccionado = texto;
      this.iconoSeleccionado = icono;
    },
    async getAsesores() {
      const token = localStorage.getItem('token')
      const asesoresInfo = await getAsesores(token)
      this.clientes = asesoresInfo.data.clientes
      console.log(asesoresInfo)
    },
    getPotabilidadCliente(cliente) {
      if (!cliente.criterios_ordenados || cliente.criterios_ordenados.length === 0) {
        return 'nul'; // No tiene criterios
      }

      // Filtrar solo criterios Activos
      const criteriosActivos = cliente.criterios_ordenados.filter(c => c.estado_criterio_venta === 'Activo');

      if (criteriosActivos.length === 0) {
        return 'nul'; // No tiene criterios activos
      }

      const categorias = criteriosActivos.map(c => c.id_categoria);

      // Prioridad 1: Si hay algún null, muestra 'o'
      if (categorias.includes(null)) {
        return 'o';
      }
      // Prioridad 2: Si no hay null pero hay Potable
      else if (categorias.includes('Potable')) {
        return 'p';
      }
      // Prioridad 3: Si no hay null ni Potable pero hay Medio
      else if (categorias.includes('Medio')) {
        return 'm';
      }
      // Prioridad 4: Si solo hay No Potable
      else if (categorias.includes('No Potable')) {
        return 'np';
      }
      // Default para otras categorías
      else {
        return 'o';
      }
    },
    async seleccionarCliente(cliente) {
      console.log(cliente);
      this.clienteSeleccionado = cliente;
    },
    getPotabilidadCriterio(id_categoria) {
      switch(id_categoria) {
        case 'Potable':
          return 'P';
        case 'Medio':
          return 'M';
        case 'No Potable':
          return 'NP';
        default:
          return 'O';
      }
    }
  },
  mounted() {
    this.getAsesores()

  }
}
</script>

<style scoped></style>
