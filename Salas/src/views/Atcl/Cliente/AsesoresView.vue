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
          <div v-if="recargando" class="text-center p-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Actualizando lista...</p>
          </div>
          <ul v-else class="list-group list-group-flush scroll lista-contacto-asesores">
            <!-- Iteramos sobre los clientes -->
            <li v-for="cliente in clientesFiltrados" :key="cliente.id_cliente"
              :class="['list-group-item list-group-item-action pt-0 pb-1 px-2', { 'seleccionAsesores': cliente.id_cliente === clienteSeleccionado?.id_cliente }]"
              @click="seleccionarCliente(cliente)">
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
                    <button type=" button" class="btn p-0 border-0" @click="editarCliente(cliente)">
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

        <div class="titulo-columna-asesores d-flex justify-content-center align-items-center"
          v-if="!clienteSeleccionado">
          Criterios
        </div>
        <div v-else class="titulo-columna-asesores d-flex justify-content-center align-items-center">
          {{ clienteSeleccionado.nombre }}
        </div>

        <!-- Criterios container -->
        <div class="pt-2 px-2 lista-codigos-asesores"
          v-if="clienteSeleccionado && clienteSeleccionado.criterios_ordenados">
          <div v-for="criterio in clienteSeleccionado.criterios_ordenados" :key="criterio.id_criterio_venta"
            class="row creterio-asesores p-2 mb-2"
            :class="{ 'criterio-seleccionado seleccionAsesores': criterioSeleccionado?.id_criterio_venta === criterio.id_criterio_venta }"
            @click="seleccionarCriterio(criterio)" style="cursor: pointer;">
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
                <button type="button" class="btn p-0 border-0" @click="editarCriterio(criterio)">
                  <i class="bi bi-pencil-fill boton-editar-criterio-asesores"></i>
                </button>
              </div>
              <div class="col-6 d-flex justify-content-center align-items-center">

                <div class="col-1 tipo-potabiliadad-asesores"
                  v-if="getPotabilidadCriterio(criterio.id_categoria) === 'O'">
                  <i class="bi bi-pencil-square text-secondary"></i>
                </div>
                <div class="col-1 tipo-potabiliadad-asesores"
                  v-else-if="getPotabilidadCriterio(criterio.id_categoria) === 'P'">
                  <i class="bi bi-emoji-smile text-success"></i>
                </div>
                <div class="col-1 tipo-potabiliadad-asesores"
                  v-else-if="getPotabilidadCriterio(criterio.id_categoria) === 'M'">
                  <i class="bi bi-emoji-neutral text-warning"></i>
                </div>
                <div class="col-1 tipo-potabiliadad-asesores"
                  v-else-if="getPotabilidadCriterio(criterio.id_categoria) === 'NP'">
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
        <div class="titulo-columna-asesores d-flex justify-content-center align-content-center"
          v-if="!criterioSeleccionado">
          Conversación
        </div>
        <div class="titulo-columna-asesores d-flex justify-content-center align-content-center" v-else>
          {{ criterioSeleccionado.tipo_inmueble.inmueble }} | ZONA: {{ criterioSeleccionado.zona.name }} | DORM: {{
            criterioSeleccionado.cant_dormitorios }} | COCHERA: {{ criterioSeleccionado.cochera }}
        </div>

        <!-- Mensajes -->
        <div class="flex-grow-1 overflow-auto " ref="contenedorMensajes">
          <div v-if="!criterioSeleccionado" class="text-center p-3 text-muted">
            <p>Selecciona un criterio para ver la conversación</p>
          </div>
          <div v-else-if="recargando || recargandoMensaje" class="text-center p-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Actualizando Mensajes...</p>
          </div>
          <ul v-else class="list-group list-group-flush p-2 contenedor_conversacion_asesores">
            <li v-for="item in historialConversacion" :key="item.fecha_hora + item.mensaje">
              <div
                class="conversacion_asesores list-group-item-asesores"
                :data-mensaje-id="item.id || null"
                :class="{ 'mensaje-resaltado': mensajeIdSeleccionado && item.id === mensajeIdSeleccionado }"
              >
                <div>
                  <span>{{ item.fecha_hora }}</span>
                  <span>&nbsp;&nbsp;&nbsp;{{ item.mensaje }}</span>
                </div>
                <div v-if="item.devolucion !== null">
                  <strong v-if="item.fecha_devolucion">&nbsp;&nbsp;&nbsp;{{ item.fecha_devolucion }}</strong>
                  <strong v-if="item.devolucion">&nbsp;&nbsp;&nbsp;{{ item.devolucion }}</strong>
                </div>
                <div v-else>
                  <button class="btn btn-sm boton_debolucion_asesores"
                    @click="abrirDevolucionModal(item)">Devolver</button>
                </div>
              </div>

            </li>

          </ul>
        </div>
        <!-- Input form -->
        <div class="p-3">


          <div class="input-group form-group" v-if="criterioSeleccionado">
            <!-- botones de acciones, agenda,buscar -->
            <button type="button" class="btn btn-sm px-2 ms-2 btn-adds-conversacion-asesores"
              @click="abirBusquedaPropiedadVentaModal">
              <i class="bi bi-search"></i>
            </button>
            <button type="button" class="btn btn-sm px-2 ms-2 btn-adds-conversacion-asesores"><i
                class="bi bi-calendar-plus"></i></button>

            <input type="text" name="mensaje" class="form-control px-1 ms-1 input-texto ms-2"
              placeholder="Escribe un mensaje..." v-model="mensaje">

            <button type="submit" class="btn btn-sm px-3 ms-2 btn-adds-conversacion-asesores"
              @click="enviarMensaje(mensaje)">
              <i class="bi bi-send"></i>
            </button>
          </div>

        </div>

      </div>

      <!-- col-md-2: Códigos -->
      <div class="col-md-2 barra-asesores">
        <!-- Header -->
        <div class="titulo-columna-asesores d-flex justify-content-center align-content-center">
          Codigos
        </div>

         <div v-if="recargandoMensaje" class="text-center p-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Actualizando codigos...</p>
          </div>
        <div v-else class="lista-codigos-asesores">
          <ul class="list-group list-group-flush">
            <li v-for="codigo in codigos" :key="codigo.id" class="list-group-item p-1" @click="seleccionarCodigoPorId(codigo)">
              <!-- {{ codigo }} -->
              <div v-if="codigo.codigo_ofrecimiento" class="codigos-ofrecido-asesores">
                <div class="row p-1">
                  <div class="col-5">
                    Código {{ codigo.codigo_ofrecimiento }}
                  </div>
                  <div class="col-5 px-0">
                    {{ formatearFecha(codigo.fecha_devolucion) }}
                  </div>
                  <div class="col-2 px-0">
                    <i v-if="codigo.devolucion" class="bi bi-check-lg">
                    </i>
                    <!-- <i v-else class="bi bi-x-lg">
                    </i> -->
                  </div>

                  <div class="col-12 d-flex justify-content-center align-items-center">
                    {{ codigo.direccion }}
                  </div>
                </div>
              </div>
              <div v-if="codigo.codigo_consulta" class="codigos-consultado-asesores">
                <div class="row p-1">
                  <div class="col-5">
                    Código {{ codigo.codigo_consulta }}
                  </div>
                  <div class="col-5 px-0">
                    {{ formatearFecha(codigo.fecha_devolucion) }}
                  </div>
                  <div class="col-2 px-0">
                    <i v-if="codigo.devolucion" class="bi bi-check-lg">
                    </i>
                    <!-- <i v-else class="bi bi-x-lg">
                    </i> -->
                  </div>
                  <div class="col-12 d-flex justify-content-center align-items-center">
                    {{ codigo.direccion }}
                  </div>
                </div>
              </div>
              <div v-if="codigo.codigo_muestra" class="codigos-muestra-asesores">
                <div class="row p-1">
                  <div class="col-6">
                    Código {{ codigo.codigo_muestra }}
                  </div>
                  <div class="col-4 px-0">
                    {{ formatearFecha(codigo.fecha_devolucion) }}
                  </div>
                  <div class="col-2 px-0">
                    <i v-if="codigo.devolucion" class="bi bi-check-lg">
                    </i>
                    <!-- <i v-else class="bi bi-x-lg">
                    </i> -->
                  </div>
                  <div class="col-12 d-flex justify-content-center align-items-center">
                    {{ codigo.direccion }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>


  <ModalEditarCriterioCliente :show="showEditarCriterioModal" @close="showEditarCriterioModal = false"
    :criterio="criterioSeleccionado" @criterio-actualizado="recargarListaCompleta" />

  <ModalEditarCliente :show="showEditarClienteModal" @close="showEditarClienteModal = false"
    :cliente="clienteSeleccionado" @criterio-actualizado="recargarListaCompleta" />

  <ModalBusquedaPropiedadVenta :show="showBusquedaPropiedadVentaModal" @close="showBusquedaPropiedadVentaModal = false"
    @seleccionar="agregarPropiedad" :vistaAsesores="vistaAsesores" />

  <ModalDevolucion :show="showDevolucionModal" @close="showDevolucionModal = false" :item="itemActual"
    @mensajeDevolucion="recibirDevolucion" />


</template>

<script>
import NavComponent from "../../../components/NavComponent.vue";
import { getAsesores } from "../../../Services/api/Atcl/Cliente/ClienteApi";
import ModalEditarCriterioCliente from "../../../components/Atcl/Cliente/Asesores/ModalEditarCriterioCliente.vue";
import ModalEditarCliente from "../../../components/Atcl/Cliente/Asesores/ModalEditarCliente.vue";
import ModalBusquedaPropiedadVenta from '@/components/Atcl/Cliente/ModalBusquedaPropiedadVenta.vue';
import { propiedadOfrecida } from '../../../Services/api/Atcl/Cliente/ClienteApi';
import { enviarMensaje } from '../../../Services/api/Atcl/Cliente/ClienteApi';
import ModalDevolucion from '../../../components/Atcl/Cliente/Asesores/ModalDevolucion.vue';
import { devolucionMensaje } from '../../../Services/api/Atcl/Cliente/ClienteApi';
import { obtenerHistorialCod } from '../../../Services/api/Atcl/Cliente/ClienteApi';

export default {
  components: {
    NavComponent,
    ModalEditarCriterioCliente,
    ModalEditarCliente,
    ModalBusquedaPropiedadVenta,
    ModalDevolucion
  },
  data() {

    const clientes = [];
    const buscar = '';
    const clienteSeleccionado = ''
    const showEditarCriterioModal = false
    const showEditarClienteModal = false
    const criterioSeleccionado = ''
    const vistaAsesores = true
    const mensaje = ''
    const codigos = [];
    const mensajeIdSeleccionado = null;



    return {
      textoSeleccionado: 'Todos',
      iconoSeleccionado: 'bi bi-card-checklist',
      clientes,
      buscar,
      clienteSeleccionado,
      showEditarCriterioModal,
      showEditarClienteModal,
      criterioSeleccionado,
      recargando: false,
      recargandoMensaje: false,
      showBusquedaPropiedadVentaModal: false,
      showDevolucionModal: false,
      itemActual: null,
      vistaAsesores,
      mensaje,
      codigos,
      mensajeIdSeleccionado
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
    },
    historialConversacion() {
      if (!this.clienteSeleccionado || !this.criterioSeleccionado) {
        return [];
      }

      const historial = [];

      // Agregar conversaciones
      if (this.criterioSeleccionado.historial_conversaciones) {
        this.criterioSeleccionado.historial_conversaciones.forEach(conv => {
          historial.push({
            fecha_hora: conv.fecha_hora,
            mensaje: conv.mensaje,
            tipo: 'conversacion'
          });
        });
      }

      // Agregar consultas con sus devoluciones (juntas)
      if (this.criterioSeleccionado.historial_consultas) {
        this.criterioSeleccionado.historial_consultas.forEach(consulta => {
          historial.push({
            fecha_hora: consulta.fecha_hora,
            mensaje: consulta.mensaje,
            tipo: 'consulta',
            devolucion: consulta.devolucion ? consulta.devolucion : null,
            fecha_devolucion: consulta.fecha_devolucion,
            id: consulta.id
          });
        });
      }

      // Agregar ofrecimientos con sus devoluciones (juntas)
      if (this.criterioSeleccionado.historial_ofrecimientos) {
        this.criterioSeleccionado.historial_ofrecimientos.forEach(ofrecimiento => {
          historial.push({
            fecha_hora: ofrecimiento.fecha_hora,
            mensaje: ofrecimiento.mensaje,
            tipo: 'ofrecimiento',
            devolucion: ofrecimiento.devolucion ? ofrecimiento.devolucion : null,
            fecha_devolucion: ofrecimiento.fecha_devolucion,
            id: ofrecimiento.id
          });
        });
      }

      // Agregar muestras con sus devoluciones (juntas)
      if (this.criterioSeleccionado.historial_muestras) {
        this.criterioSeleccionado.historial_muestras.forEach(muestra => {
          historial.push({
            fecha_hora: muestra.fecha_hora,
            mensaje: muestra.mensaje,
            tipo: 'muestra',
            devolucion: muestra.devolucion ? muestra.devolucion : null,
            fecha_devolucion: muestra.fecha_devolucion,
            id: muestra.id
          });
        });
      }

      // Ordenar por fecha original para eventos, manteniendo las devoluciones con sus padres
      console.log('aaaaa',historial);
      return historial.sort((a, b) => {
        // Si es una devolución, usar la fecha de su evento original
        const fechaAOriginal = a.fechaOriginal || a.fecha_hora;
        const fechaBOriginal = b.fechaOriginal || b.fecha_hora;

        // Si tienen la misma fecha original, el evento va primero que la devolución
        if (fechaAOriginal === fechaBOriginal) {
          if (a.tipo === 'devolucion') return 1;
          if (b.tipo === 'devolucion') return -1;
        }

        // Orden por fecha original
        const fechaA = new Date(fechaAOriginal.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6'));
        const fechaB = new Date(fechaBOriginal.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6'));
        return fechaA - fechaB;
      });
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
      //console.log(asesoresInfo)
    },
    async recargarListaCompleta() {
      if (this.recargando) return // Evitar múltiples recargas simultáneas

      this.recargando = true
      this.clienteSeleccionado = ''
      try {
        await this.getAsesores()
        //console.log('✅ Lista de asesores actualizada completamente')
      } catch (error) {
        console.error('❌ Error al actualizar la lista:', error)
      } finally {
        this.recargando = false
      }
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
    seleccionarCodigoPorId(codigo) {
      if (!codigo || !codigo.id) return
      this.mensajeIdSeleccionado = codigo.id
      this.$nextTick(() => {
        const contenedor = this.$refs.contenedorMensajes
        if (!contenedor) return
        const el = contenedor.querySelector(`[data-mensaje-id="${this.mensajeIdSeleccionado}"]`)
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    },
    async seleccionarCliente(cliente) {
      //console.log(cliente);
      this.clienteSeleccionado = cliente;
      this.criterioSeleccionado = null; // Resetear criterio al cambiar de cliente
      this.mensajeIdSeleccionado = null
      this.codigos = []
    },
    getPotabilidadCriterio(id_categoria) {
      switch (id_categoria) {
        case 'Potable':
          return 'P';
        case 'Medio':
          return 'M';
        case 'No Potable':
          return 'NP';
        default:
          return 'O';
      }
    },
    editarCriterio(criterio) {
      this.showEditarCriterioModal = true
      this.criterioSeleccionado = criterio
      //console.log(criterio)
    },
    formatearFecha(fechaCompleta) {
      if (!fechaCompleta) return '';
      const [fecha] = fechaCompleta.split(' '); // Toma solo la parte de la fecha
      const [anio, mes, dia] = fecha.split('-'); // Divide año-mes-día
      return `${dia}-${mes}-${anio}`; // Devuelve día-mes-año
    },
    async seleccionarCriterio(criterio) {
      this.criterioSeleccionado = criterio;
      console.log('codigos',criterio);
      const response = await obtenerHistorialCod(criterio.id_criterio_venta);
      this.codigos = response.data; // Solo tomar los datos, no el objeto completo
      this.mensajeIdSeleccionado = null
    },
    editarCliente(cliente) {
      this.showEditarClienteModal = true
      this.clienteSeleccionado = cliente
      //console.log(cliente)
    },
    abirBusquedaPropiedadVentaModal() {
      this.showBusquedaPropiedadVentaModal = true
    },
    abrirDevolucionModal(item) {
      this.itemActual = item
      this.showDevolucionModal = true
    },
    async recibirDevolucion(mensaje, item) {
      this.recargandoMensaje = true
      try {
        //console.log('Devolución para:', item.tipo, item)

        let tipo = ''
        // Aquí puedes determinar qué API llamar según el tipo
        switch (item.tipo) {
          case 'consulta':
            tipo = 'consulta'
            // Llamar a API para devolución de consulta
            //console.log('Devolución de consulta:', mensaje)
            break
          case 'ofrecimiento':
            // Llamar a API para devolución de ofrecimiento
            //console.log('Devolución de ofrecimiento:', mensaje)
            tipo = 'ofrecimiento'
            break
          case 'muestra':
            // Llamar a API para devolución de muestra
            //console.log('Devolución de muestra:', mensaje)
            tipo = 'muestra'
            break
          default:
            console.log('Devolución general:', mensaje)
        }

        const data = {
          id_criterio_venta: this.criterioSeleccionado.id_criterio_venta,
          mensaje: mensaje,
          tipo: tipo,
          item: item.id
        }
        await devolucionMensaje(data)
        await this.recargarSeleccionActual()
      } catch (error) {
        console.log(error)
      } finally {
        this.recargandoMensaje = false
      }
    },
    async recargarSeleccionActual() {
      // Recargar los datos del cliente para actualizar el historial
      await this.getAsesores()

      // Volver a seleccionar el cliente y criterio para mantener la vista actual
      if (this.clienteSeleccionado) {
        const clienteActualizado = this.clientes.find(c => c.id_cliente === this.clienteSeleccionado.id_cliente)
        if (clienteActualizado) {
          this.clienteSeleccionado = clienteActualizado
          if (this.criterioSeleccionado) {
            const criterioActualizado = clienteActualizado.criterios_ordenados.find(
              cr => cr.id_criterio_venta === this.criterioSeleccionado.id_criterio_venta
            )
            this.criterioSeleccionado = criterioActualizado
          }
        }
      }

      if (this.mensajeIdSeleccionado) {
        this.$nextTick(() => {
          const contenedor = this.$refs.contenedorMensajes
          if (!contenedor) return
          const el = contenedor.querySelector(`[data-mensaje-id="${this.mensajeIdSeleccionado}"]`)
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
      }
    },
    async agregarPropiedad(prop) {
      //console.log('agregarPropiedad', prop)
      //quiero combinar prop con this.criterioSeleccionado
      const data = {
        ...prop,
        ...this.criterioSeleccionado
      }
      //console.log('data:', data)
      if (this.recargandoMensaje) return
      this.recargandoMensaje = true

      try {
        await propiedadOfrecida(data)
        await this.recargarSeleccionActual()
        // Recargar códigos después de agregar una propiedad
        if (this.criterioSeleccionado) {
          const response = await obtenerHistorialCod(this.criterioSeleccionado.id_criterio_venta);
          console.log('codigos 2', response.data)
          this.codigos = response.data;
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.recargandoMensaje = false
      }
    },
    async enviarMensaje(mensaje) {
      try {
        await enviarMensaje({
          id_criterio_venta: this.criterioSeleccionado.id_criterio_venta,
          mensaje: mensaje
        })
        console.log('Mensaje enviado')
        await this.recargarSeleccionActual()
        this.mensaje = ''
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.getAsesores()

  }
}
</script>

<style scoped></style>
