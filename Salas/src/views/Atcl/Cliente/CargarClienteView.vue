  <template>
    <NavComponent titulo="Cargar Cliente"></NavComponent>

    <div class="px-3 pb-3">
      <div class="row d-flex justify-content-center">
        <div class="col-md-6 row p-0">
          <div class="col-md-12">
            <div class="card m-1">
              <div class="card-header">
                <h5>Datos del Cliente</h5>
              </div>
              <div class="card-body form-group row">
                <div class="col-4">
                  <label for="telefono">Telefono</label>
                  <input type="number" class="form-control form-control-sm" id="telefono" v-model="telefono">
                </div>
                <div class="col-4">
                  <label for="nombre">Nombre</label>
                  <input type="text" class="form-control form-control-sm" id="nombre" v-model="nombre">
                </div>
                <div class="col-4">
                  <label for="asesor">Asesor</label>
                  <select class="form-control form-control-sm" id="asesor" v-model="id_asesor">
                    <option value="">Seleccione</option>
                    <option v-for="asesor in asesores" :key="asesor.id_usuario" :value="asesor.id_usuario">
                      {{ asesor.username }}
                    </option>
                  </select>
                </div>
                <div class="col-4">
                  <label for="ingreso">Ingreso por</label>
                  <select class="form-control form-control-sm" id="ingreso" v-model="ingreso_seleccionado">
                    <option value="">Seleccione</option>
                    <option v-for="ingreso in ingreso" :key="ingreso" :value="ingreso">
                      {{ ingreso }}
                    </option>
                  </select>
                </div>
                <div class="col-4">
                  <label for="perteneceInmobiliaria">¿Pert. Inmobiliaria?</label>
                  <select class="form-control form-control-sm" id="perteneceInmobiliaria"
                    v-model="pertenece_a_inmobiliaria" @change="PerteneceInmobiliaria">
                    <option value="">Seleccione</option>
                    <option value="N">NO</option>
                    <option value="S">SI</option>
                  </select>
                </div>
                <div class="col-4" v-show="showNombreInmobiliaria != false">
                  <label for="nombreInmobiliaria">Nombre de Inmob.</label>
                  <input type="text" class="form-control form-control-sm" id="nombreInmobiliaria"
                    v-model="nombre_de_inmobiliaria">

                </div>
                <div class="col-12">
                  <label for="observaciones">Observaciones</label>
                  <textarea class="form-control form-control-sm" id="observaciones" rows="1"
                    v-model="observaciones"></textarea>
                </div>
              </div>
            </div>
          </div>
          <!-- ------------------------CRITERIO DE BUSQUEDA--------------------------------------------- -->
          <div class="col-md-12">
            <div class="card card_clientes_criterio_busqueda m-1">
              <div class="row card-header">
                <div class="col-10">
                  <h5>Criterio de Busqueda</h5>
                </div>
                <div class="col-2">
                  <button class="btn btn-secondary btn-sm w-100" @click="asignarCriterio"><i
                      class="bi bi-search"></i></button>
                </div>
              </div>
              <div class="form-group row mx-2">
                <div class="col-6">
                  <label for="tipoInmueble">Tipo de Inmueble</label>
                  <select class="form-control" id="tipoInmueble" v-model="id_tipo_inmueble">
                    <option value="">Seleccione</option>
                    <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
                      {{ inmueble.inmueble }}
                    </option>
                  </select>
                </div>
                <div class="col-6">
                  <label for="cantidadDormitorios">Cantidad de Dormitorios</label>
                  <input type="number" class="form-control" id="cantidadDormitorios" v-model="cant_dormitorios">
                </div>
                <div class="col-4">
                  <label for="cantidadBanios">Cochera</label>
                  <select class="form-control" id="" v-model="cochera">
                    <option value="">Seleccione</option>
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
                <div class="col-4">
                  <label for="zonaInmueble">Zona</label>
                  <select class="form-control" v-model="id_zona">
                    <option value="">Seleccione</option>
                    <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
                      {{ zona.name }}
                    </option>
                  </select>
                </div>

              </div>
            </div>
          </div>

          <div class="col-md-12 d-flex justify-content-center">
            <button type="submit" class="btn btn-primary btn-sm w-50" @click="handleGuardar">Guardar</button>
          </div>

        </div>
        <div class="col-md-6 row p-0">
          <div class="col-md-12">
            <div class="card m-1">
              <div class="row card-header">
                <div class="col-10">
                  <h5>Propiedad Asignada</h5>
                </div>
                <div class="col-2">
                  <button class=" btn btn-secondary btn-sm w-100" @click="abirBusquedaPropiedadVentaModal"><i
                      class="bi bi-search"></i></button>
                </div>

              </div>
              <div class="form-group row">

                <div class="col-12 mt-2">
                  <div class="tabla_clientes">
                    <table class="table table-sm titulo_tabla">
                      <thead>
                        <tr>
                          <th>Cod - Venta</th>
                          <th>Direccion</th>
                          <th>Fecha Asignacion</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(prop, index) in propiedadesAsignadas" :key="prop.id">
                          <td>{{ prop.cod_venta }}</td>
                          <td>{{ prop.calle }}</td>
                          <td>{{ prop.fecha_asignacion }}</td>
                          <td>
                            <button class="btn btn-danger btn-sm" @click="eliminarPropiedad(index)"
                              v-if="!prop.id_con_prop_venta">
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </div>

                </div>

              </div>
            </div>
          </div>

          <div class="col-md-12">
            <div class="card m-1">
              <div class="card-header">
                <h5>Lista criterio de búsqueda</h5>
              </div>
              <div class="form-group row">

                <div class="col-12 mt-2">
                  <div class="tabla_clientes">
                    <table class="table table-sm titulo_tabla">
                      <thead>
                        <tr>
                          <th>Tipo Inmueble</th>
                          <th>Cant. Dormitorios</th>
                          <th>Cochera</th>
                          <th>Zona</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(criterio, index) in listaCriterios" :key="index">
                          <td>{{ criterio.tipo_inmueble_nombre }}</td>
                          <td>{{ criterio.cant_dormitorios }}</td>
                          <td>{{ criterio.cochera }}</td>
                          <td>{{ criterio.zona_nombre }}</td>
                          <td>{{ criterio.fecha_criterio }}</td>
                          <td>{{ criterio.estado_criterio_venta }}</td>
                          <td>
                            <button class="btn btn-danger btn-sm" @click="eliminarCriterio(index)"
                              v-if="!criterio.id_criterio_venta">
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <ModalBusquedaPropiedadVenta :show="showBusquedaPropiedadVentaModal"
      @close="showBusquedaPropiedadVentaModal = false" @seleccionar="agregarPropiedad" />



  </template>
<script>
import NavComponent from '@/components/NavComponent.vue'
import { useAsesores } from '@/composables/atcl/useAsesores'
import { getUser } from '@/Services/api/Usuario/userApi'
import { useInmuebles } from '@/composables/atcl/useInmuebles';
import { useZona } from '@/composables/atcl/useZona';
import ModalBusquedaPropiedadVenta from '@/components/Atcl/Cliente/ModalBusquedaPropiedadVenta.vue';
import { useToast } from '@/composables/useToast'
import { guardarCliente } from '@/Services/api/Atcl/Cliente/ClienteApi'
import { getClientePorTelefono } from '@/Services/api/Atcl/Cliente/ClienteApi';
import { watch } from 'vue';

export default {

  name: 'CargarClienteView',
  components: {
    NavComponent,
    ModalBusquedaPropiedadVenta
  },

  setup() {
    const { asesores, error, cargarAsesores } = useAsesores()
    const { inmuebles, error: inmueblesError, cargarInmuebles } = useInmuebles()
    const { zonas, error: zonasError, cargarZonas } = useZona()
    const { showWarning, showSuccess, showError } = useToast()
    return {
      asesores, error, cargarAsesores,
      inmuebles, inmueblesError, cargarInmuebles,
      zonas, zonasError, cargarZonas,
      showWarning, showSuccess, showError
    }
  },

  data() {
    return {
      showBusquedaPropiedadVentaModal: false,
      /* DATOS DEL CLIENTE */
      telefono: '',
      nombre: '',
      ingreso: ['Correo', 'Difusion', 'Facebook', 'Instagram', 'Presencial', 'Presencial Candioti', 'Presencial Tribunales', 'Recomendacion', 'Sitio Web',
        'Telefonicamente', 'Telefonicamente Candioti', 'Telefonicamente Tribunales', 'Zona Prop', 'Whatsapp', 'Otro'],
      id_asesor: '',
      ingreso_seleccionado: '',
      pertenece_a_inmobiliaria: '',
      showNombreInmobiliaria: false,
      nombre_de_inmobiliaria: '',
      observaciones: '',
      sector_asesor: 'venta',
      usuario_id: '',

      /* CRITERIO DE BUSQUEDA */
      id_sector_asesor: 'Venta',
      id_tipo_inmueble: '',
      cant_dormitorios: '',
      cochera: '',
      id_zona: '',
      fecha_criterio: new Date().toISOString().split('T')[0],
      estado_criterio_venta: "Activo",

      /* LISTA DE CRITERIOS */
      listaCriterios: [],

      /* LISTA DE PROPIEDADES ASIGNADAS */
      propiedadesAsignadas: [],
      propiedades_venta: [],

      /* Cliente ya cargado */
      clienteYaExiste: false,
    }
  },
  watch: {
    telefono(nuevoValor) {
      const digits = String(nuevoValor).replace(/\D/g, '') // solo números
      //console.log('Telefono actual:', digits, '| Largo:', digits.length)
      if (digits.length >= 10) {
        //console.log('✅ 10 dígitos alcanzados:', digits)
        this.buscarClientePorTelefono(digits)
      }
    }
  },
  methods: {
    async getUserData() {
      const token = localStorage.getItem('token')
      const user = await getUser(token)
      this.usuario_id = user.data.id
    },
    PerteneceInmobiliaria() {
      if (this.pertenece_a_inmobiliaria === 'S') {
        this.showNombreInmobiliaria = true
      } else {
        this.showNombreInmobiliaria = false
      }
    },
    asignarCriterio() {
      const inmueble = this.inmuebles.find(i => i.id === this.id_tipo_inmueble)
      const zona = this.zonas.find(z => z.id === this.id_zona)

      const criterio = {
        id_tipo_inmueble: this.id_tipo_inmueble,
        tipo_inmueble_nombre: inmueble ? inmueble.inmueble : '',
        cant_dormitorios: this.cant_dormitorios,
        cochera: this.cochera,
        id_zona: this.id_zona,
        zona_nombre: zona ? zona.name : '',
        fecha_criterio: this.fecha_criterio,
        estado_criterio_venta: this.estado_criterio_venta,
        id_sector_asesor: 'Venta'
      }
      if (this.existeCriterioDuplicado(criterio)) {

        this.showWarning("Ya existe una propiedad con el mismo criterio")

        return
      }
      if (criterio.id_tipo_inmueble === '' || criterio.id_zona === '') {
        this.showWarning("Debe seleccionar un tipo de inmueble y una zona")
        return
      }

      this.listaCriterios.push(criterio)

      // Limpiar campos
      this.id_tipo_inmueble = ''
      this.cant_dormitorios = ''
      this.cochera = ''
      this.id_zona = ''
    },
    /* eliminarCriterio(index) {
      this.listaCriterios.splice(index, 1)
    }, */

    eliminarCriterio(index) {
      const criterio = this.listaCriterios[index]

      // Eliminar todas las propiedades que comparten ese criterio
      this.propiedadesAsignadas = this.propiedadesAsignadas.filter(prop => {
        const mismoTipo = prop.id_tipo_inmueble == criterio.id_tipo_inmueble
        const mismosDorm = prop.cant_dormitorios == criterio.cant_dormitorios
        return !(mismoTipo && mismosDorm)
      })

      // Eliminar el criterio
      this.listaCriterios.splice(index, 1)
    },
    abirBusquedaPropiedadVentaModal() {
      this.showBusquedaPropiedadVentaModal = true
    },
    agregarPropiedad(prop, esCargaBackend = false) {

      // agregar propiedad a la tabla con los campos específicos
      this.propiedadesAsignadas.push({
        calle: prop.calle,
        cod_venta: prop.cod_venta,
        cochera: prop.cochera,
        tipo_consulta: "Venta",
        id_propiedad: prop.id,
        id_tipo_inmueble: prop.id_inmueble,
        cant_dormitorios: prop.cantidad_dormitorios,
        id_con_prop_venta: prop.id_con_prop_venta,
        estado: prop.estado_consulta_venta || 'Activo',
        fecha_asignacion: prop.fecha_consulta_propiedad ? prop.fecha_consulta_propiedad.split(' ')[0] : ''
      })

      // Si es carga del backend, NO crear criterio automático
      if (esCargaBackend) {
        return
      }

      // buscar zona
      const zona = this.zonas.find(z => z.id === prop.id_zona)

      // crear criterio automaticamente
      const criterio = {
        id_tipo_inmueble: prop.id_inmueble,
        tipo_inmueble_nombre: prop.inmueble,
        cant_dormitorios: prop.cantidad_dormitorios,
        cochera: prop.cochera,
        id_zona: prop.id_zona,
        zona_nombre: zona ? zona.name : prop.zona,
        fecha_criterio: this.fecha_criterio,
        estado_criterio_venta: "Activo",
        id_sector_asesor: "Venta",
        id_propiedad: prop.id,
        id_con_prop_venta: prop.id_con_prop_venta ? prop.id_con_prop_venta : null
      }
      const duplicado = this.existeCriterioDuplicado(criterio)
      if (duplicado) {

        this.showWarning(
          "Ya existe una propiedad con el mismo criterio, se guardará el mismo"
        )

        // NO agregar criterio
        return
      }

      this.listaCriterios.push(criterio)

    },
    eliminarPropiedad(index) {
      this.propiedadesAsignadas.splice(index, 1)
    },//Comprueba que no existan criterios duplicados
    existeCriterioDuplicado(nuevoCriterio) {
      return this.listaCriterios.some(c =>
        c.estado_criterio_venta === "Activo" &&
        Number(c.id_tipo_inmueble) === Number(nuevoCriterio.id_tipo_inmueble) &&
        Number(c.cant_dormitorios) === Number(nuevoCriterio.cant_dormitorios)
      )
    },
    async buscarClientePorTelefono(telefono) {
      try {
        const response = await getClientePorTelefono(telefono)
        console.log('Response:', response)
        const cliente = response.data.cliente
        //console.log('Cliente:', cliente)

        this.nombre = cliente.nombre ?? ''
        this.id_asesor = cliente.asesor?.id_usuario ?? ''
        this.ingreso_seleccionado = this.ingreso.find(op => op.toLowerCase() === cliente.ingreso?.toLowerCase()) ?? ''
        this.pertenece_a_inmobiliaria = cliente.pertenece_a_inmobiliaria ?? ''
        this.nombre_de_inmobiliaria = cliente.nombre_de_inmobiliaria ?? ''
        // Ejecutar la función para mostrar/ocultar el campo nombre de inmobiliaria
        this.PerteneceInmobiliaria()
        this.observaciones = cliente.observaciones ?? ''

        cliente.consulta_prop_venta.forEach(element => {
          const propiedad = element.propiedad
          // Agregar el id_con_prop_venta a la propiedad
          propiedad.id_con_prop_venta = element.id_con_prop_venta

          // Buscar el tipo de inmueble para agregar el campo 'inmueble'
          const tipoInmueble = this.inmuebles.find(i => i.id === propiedad.id_inmueble)
          propiedad.inmueble = tipoInmueble ? tipoInmueble.inmueble : ''
          const calle = propiedad.calle.name + ' ' + propiedad.numero_calle
          propiedad.calle = calle

          // Pasar también los datos de consulta para la tabla
          propiedad.estado_consulta_venta = element.estado_consulta_venta
          propiedad.fecha_consulta_propiedad = element.fecha_consulta_propiedad

          this.agregarPropiedad(propiedad, true)
        });

        cliente.criterio_busqueda_venta.forEach(element => {
          // Crear criterio con los datos del backend
          const criterio = {
            id_criterio_venta: element.id_criterio_venta,
            id_tipo_inmueble: element.id_tipo_inmueble,
            tipo_inmueble_nombre: element.tipo_inmueble.inmueble,
            cant_dormitorios: element.cant_dormitorios,
            cochera: element.cochera || '',
            id_zona: element.id_zona,
            zona_nombre: element.zona.name,
            fecha_criterio: element.fecha_criterio_venta,
            estado_criterio_venta: element.estado_criterio_venta,
            id_sector_asesor: 'Venta'
          }

          this.listaCriterios.push(criterio)
        });


        this.clienteYaExiste = true
        this.showWarning('Este teléfono ya pertenece a un cliente existente')

      } catch (error) {
        this.clienteYaExiste = false
        if (error.response?.status !== 404) {
          console.error(error)
        }
      }
    },
    limpiarFormulario() {
      // DATOS DEL CLIENTE
      this.telefono = ''
      this.nombre = ''
      this.id_asesor = ''
      this.ingreso_seleccionado = ''
      this.pertenece_a_inmobiliaria = ''
      this.showNombreInmobiliaria = false
      this.nombre_de_inmobiliaria = ''
      this.observaciones = ''

      // CRITERIO DE BÚSQUEDA (campos del formulario)
      this.id_tipo_inmueble = ''
      this.cant_dormitorios = ''
      this.cochera = ''
      this.id_zona = ''

      // LISTAS
      this.listaCriterios = []
      this.propiedadesAsignadas = []
    },

    // Metodo que envia los datos ordenados al backend
    async handleGuardar() {
      const cliente = {
        usuario_id: this.usuario_id,
        telefono: this.telefono,
        nombre: this.nombre,
        id_asesor: this.id_asesor,
        ingreso: this.ingreso_seleccionado,
        pertenece_a_inmobiliaria: this.pertenece_a_inmobiliaria,
        nombre_de_inmobiliaria: this.nombre_de_inmobiliaria,
        observaciones: this.observaciones,
        sector_asesor: this.sector_asesor
      }

      const data = {
        cliente: cliente,
        criterios_venta: this.listaCriterios,
        propiedades_venta: this.propiedadesAsignadas,
        clienteYaExiste: this.clienteYaExiste
      }

      try {

        await guardarCliente(data)

        this.showSuccess("Cliente guardado correctamente")
        this.limpiarFormulario()
        //console.log(response.data)

      } catch (error) {

        //console.error(error)
        this.showError("Error al guardar el cliente")

      }
    }
  },

  mounted() {
    this.cargarAsesores()
    this.cargarInmuebles()
    this.cargarZonas()
    this.getUserData()
  }
}
</script>
