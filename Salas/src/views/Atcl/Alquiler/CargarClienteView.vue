<template>
  <NavComponent titulo="Cargar Cliente"></NavComponent>

  <div class="px-3 pb-2">
    <div class="row d-flex justify-content-center">
      <!-- DATOS DEL CLIENTE -->
      <div class="col-md-6 mb-1">
        <div class="card">
          <div class="card-header card-header-cliente">
            <h5>Datos del Cliente</h5>
          </div>
          <div class="card-body-cliente-datos form-group row px-3 py-0 mb-2">
            <div class="col-4">
              <label for="telefono">Telefono</label>
              <input type="number" class="form-control form-control-sm" id="telefono" v-model="telefono" />
            </div>
            <div class="col-4">
              <label for="nombre">Nombre</label>
              <input type="text" class="form-control form-control-sm" id="nombre" v-model="nombre" />
            </div>
            <!-- ASESOR -->
            <div class="col-4">
              <label for="asesor">Asesor</label>
              <select class="form-control form-control-sm" id="asesor" v-model="id_asesor">
                <option value="">Seleccione</option>
                <option v-for="asesor in asesoresToShow" :key="asesor.id_usuario" :value="asesor.id_usuario">
                  {{ asesor.usuario.username }}
                </option>
              </select>
              <!-- <input type="text" class="form-control form-control-sm" id="asesor" :value="username" readonly v-else /> -->
            </div>

            <!-- INGRESO POR -->
            <div class="col-4">
              <label for="ingreso">Ingreso por</label>
              <select class="form-control form-control-sm" id="ingreso" v-model="ingreso_seleccionado">
                <option value="">Seleccione</option>
                <option v-for="ingreso in ingreso" :key="ingreso" :value="ingreso">
                  {{ ingreso }}
                </option>
              </select>
            </div>

            <div class="col-8">
              <label for="observaciones">Observaciones</label>
              <textarea class="form-control form-control-sm" id="observaciones" rows="1"
                v-model="observaciones"></textarea>
            </div>
          </div>
        </div>
      </div>
      <!-- ------------------------CRITERIO DE BUSQUEDA--------------------------------------------- -->
      <div class="col-md-6 mb-1">
        <div class="card">
          <div class="row card-header card-header-cliente">
            <h5>Criterio de Busqueda</h5>
          </div>
          <div class="card-body-cliente-datos form-group row px-3 py-0 mb-2">
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
              <label for="cantidadDormitorios">Cant. de Dormitorios</label>
              <input type="number" class="form-control" id="cantidadDormitorios" v-model="cant_dormitorios" />
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
            <div class="col-4 mt-4">
              <button class="btn btn-secondary btn-sm w-100" @click="asignarCriterio">
                <i class="bi bi-plus-square"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PROPiedad Asignada -->
      <div class="col-md-6 mb-1">
        <div class="card">
          <div class="row card-header card-header-cliente">
            <div class="col-10">
              <h5>Propiedad Asignada</h5>
            </div>
            <div class="col-2">
              <button class="btn btn-secondary btn-sm w-100" @click="abirBusquedaPropiedadVentaModal">
                <i class="bi bi-house-add"></i>
              </button>
            </div>
          </div>
          <div class="form-group row card-body-cliente">
            <div class="col-12">
              <div class="tabla_clientes">
                <table class="table table-sm titulo_tabla">
                  <thead>
                    <tr>
                      <th>Cod - Alquiler</th>
                      <th>Direccion</th>
                      <th>Fecha Asignacion</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(prop, index) in propiedadesAsignadas" :key="prop.id">
                      <td>{{ prop.cod_alquiler }}</td>
                      <td>{{ prop.calle }}</td>
                      <td>{{ prop.fecha_asignacion }}</td>
                      <td>
                        <button class="btn btn-danger btn-sm mx-1" @click="eliminarPropiedad(index)"
                          v-if="!prop.id_con_prop_alquiler">
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

      <div class="col-md-6 mb-1">
        <div class="card">
          <div class="card-header card-header-cliente">
            <h5>Lista criterio de búsqueda</h5>
          </div>
          <div class="form-group row card-body-cliente">
            <div class="col-12">
              <div class="tabla_clientes">
                <table class="table table-sm titulo_tabla">
                  <thead>
                    <tr>
                      <th>Inmueble</th>
                      <th>Cant. Dorm.</th>
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
                        <button class="btn btn-danger btn-sm mx-1" @click="eliminarCriterio(index)"
                          v-if="!criterio.id_criterio_alquiler">
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

      <ModalBusquedaPropiedadVenta :show="showBusquedaPropiedadVentaModal" tipo="alquiler"
        @close="showBusquedaPropiedadVentaModal = false" @seleccionar="agregarPropiedad" />

      <div class="col-md-4 d-flex justify-content-center px-5 mt-2">
        <button type="submit" class="btn btn-primary btn-sm w-50" @click="handleGuardar">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import NavComponent from '@/components/NavComponent.vue'
import { ref, watch, onMounted, computed } from 'vue'
import { getClientePorTelefono, guardarCliente } from '@/Services/api/Atcl/Cliente/ClienteApi';
import { getUser } from '@/Services/api/Usuario/userApi';
import { asesoresAlquiler } from '@/Services/api/Atcl/Alquiler/Alquiler';
import { getInmueble, getZonas } from '@/Services/api/Atcl/AtclApi'
import ModalBusquedaPropiedadVenta from '@/components/Atcl/Cliente/ModalBusquedaPropiedadVenta.vue';
import { useToast } from '@/composables/useToast'

const ingreso = ['Correo', 'Difusion', 'Facebook', 'Instagram', 'Presencial', 'Presencial Candioti', 'Presencial Tribunales', 'Recomendacion', 'Sitio Web',
  'Telefonicamente', 'Telefonicamente Candioti', 'Telefonicamente Tribunales', 'Zona Prop', 'Whatsapp', 'Otro']
const telefono = ref('')
const nombre = ref('')
const ingreso_seleccionado = ref('')
const observaciones = ref('')
const asesores = ref([])
const inmuebles = ref([])
const zonas = ref([])
const id_asesor = ref('')
const id_tipo_inmueble = ref('')
const cant_dormitorios = ref('')
const cochera = ref('')
const id_zona = ref('')
const listaCriterios = ref([])
const propiedadesAsignadas = ref([])
const showBusquedaPropiedadVentaModal = ref(false)
const currentUserId = ref(null)
const isClienteNuevo = ref(true)

const { showWarning, showSuccess, showError } = useToast()

const asesoresToShow = computed(() => {
  // Si es admin (id 36) mostrar asesores con alquiler = 'S'
  if (Number(currentUserId.value) === 36 || Number(currentUserId.value) === 32) {
    return asesores.value.filter(asesor => asesor.alquiler === 'S')
  }

  // Si no es admin, mostrar únicamente el asesor correspondiente al usuario conectado
  return asesores.value.filter(asesor => Number(asesor.id_usuario) === Number(currentUserId.value))
})

const getAsesores = async () => {
  try {
    const response = await asesoresAlquiler()
    // Guardar TODOS los asesores, sin filtrar por alquiler
    asesores.value = response.data || []
    //console.log(asesores.value)
  } catch (error) {
    console.error('Error al obtener asesores:', error)
  }
}

const getInmuebles = async () => {
  try {
    const response = await getInmueble()
    inmuebles.value = response.data
    //console.log(response)
  } catch (error) {
    console.error('Error al obtener inmuebles:', error)
  }
}

const getZona = async () => {
  try {
    const response = await getZonas()
    zonas.value = response.data
    //console.log(response)
  } catch (error) {
    console.error('Error al obtener zonas:', error)
  }
}


const existeCriterioDuplicado = (criterio) => {
  return listaCriterios.value.some(c =>
    (c.estado_criterio_alquiler?.toLowerCase() === "activo" || !c.estado_criterio_venta) &&
    Number(c.id_tipo_inmueble) === Number(criterio.id_tipo_inmueble) &&
    Number(c.id_zona) === Number(criterio.id_zona) &&
    Number(c.cant_dormitorios || 0) === Number(criterio.cant_dormitorios || 0) &&
    (c.cochera || '').trim().toLowerCase() === (criterio.cochera || '').trim().toLowerCase()
  )
}

const asignarCriterio = () => {
  const inmueble = inmuebles.value.find(i => i.id === Number(id_tipo_inmueble.value))
  const zona = zonas.value.find(z => z.id === Number(id_zona.value))

  const criterio = {
    id_tipo_inmueble: Number(id_tipo_inmueble.value),
    tipo_inmueble_nombre: inmueble ? inmueble.inmueble : '',
    cant_dormitorios: Number(cant_dormitorios.value),
    cochera: cochera.value,
    id_zona: Number(id_zona.value),
    zona_nombre: zona ? zona.name : '',
    fecha_criterio: new Date().toISOString().split('T')[0],
    estado_criterio_venta: 'Activo',
    id_sector_asesor: 'Alquiler'
  }

  if (existeCriterioDuplicado(criterio)) {
    showWarning('Ya existe una propiedad con el mismo criterio')
    return
  }
  if (criterio.id_tipo_inmueble === '' || criterio.id_zona === '') {
    showWarning('Debe seleccionar un tipo de inmueble y una zona')
    return
  }

  listaCriterios.value.push(criterio)

  // Limpiar campos
  id_tipo_inmueble.value = ''
  cant_dormitorios.value = ''
  cochera.value = ''
  id_zona.value = ''
}

const eliminarCriterio = (index) => {
  listaCriterios.value.splice(index, 1)
}

const eliminarPropiedad = (index) => {
  propiedadesAsignadas.value.splice(index, 1)
}

const abirBusquedaPropiedadVentaModal = () => {
  showBusquedaPropiedadVentaModal.value = true
}

/* const agregarPropiedad = (prop, esCargaBackend = false) => {
  // agregar propiedad a la tabla con los campos específicos de alquiler
  propiedadesAsignadas.value.push({
    calle: prop.calle,
    cod_alquiler: prop.cod_alquiler,
    cochera: prop.cochera,
    tipo_consulta: 'Alquiler',
    id_propiedad: prop.id,
    id_tipo_inmueble: prop.id_inmueble,
    cant_dormitorios: prop.cantidad_dormitorios,
    id_con_prop_alquiler: prop.id_con_prop_alquiler,
    estado: prop.estado_consulta_alquiler || 'Activo',
    fecha_asignacion: prop.fecha_consulta_propiedad ? prop.fecha_consulta_propiedad.split(' ')[0] : ''
  })

  // Si es carga del backend, NO crear criterio automático
  if (esCargaBackend) {
    return
  }

  const zona = zonas.value.find(z => z.id === prop.id_zona)

  // crear criterio automáticamente a partir de la propiedad elegida
  const criterio = {
    id_tipo_inmueble: prop.id_inmueble,
    tipo_inmueble_nombre: prop.inmueble,
    cant_dormitorios: prop.cantidad_dormitorios,
    cochera: prop.cochera,
    id_zona: prop.id_zona,
    zona_nombre: zona ? zona.name : prop.zona,
    fecha_criterio: new Date().toISOString().split('T')[0],
    estado_criterio_venta: 'Activo',
    id_sector_asesor: 'Alquiler',
    id_propiedad: prop.id,
    id_con_prop_alquiler: prop.id_con_prop_alquiler ? prop.id_con_prop_alquiler : null
  }

  if (existeCriterioDuplicado(criterio)) {
    showWarning('Ya existe una propiedad con el mismo criterio, se guardará el mismo')
    return
  }

  listaCriterios.value.push(criterio)
} */

const agregarPropiedad = (prop, esCargaBackend = false) => {
  // 1. Verificar si la propiedad ya está asignada (por ID)
  const yaAsignada = propiedadesAsignadas.value.some(p => p.id_propiedad === prop.id)
  if (yaAsignada) {
    showWarning('Esta propiedad ya está asignada a este cliente.')
    return
  }

  // 2. Agregar la propiedad a la tabla
  propiedadesAsignadas.value.push({
    calle: prop.calle,
    cod_alquiler: prop.cod_alquiler,
    cochera: prop.cochera,
    tipo_consulta: 'Alquiler',
    id_propiedad: prop.id,
    id_tipo_inmueble: prop.id_inmueble,
    cant_dormitorios: prop.cantidad_dormitorios,
    id_con_prop_alquiler: prop.id_con_prop_alquiler,
    estado: prop.estado_consulta_alquiler || 'Activo',
    fecha_asignacion: prop.fecha_consulta_propiedad ? prop.fecha_consulta_propiedad.split(' ')[0] : ''
  })

  // Si es carga del backend, NO crear criterio automático
  if (esCargaBackend) {
    return
  }

  const zona = zonas.value.find(z => z.id === prop.id_zona)

  // 3. Crear criterio automáticamente a partir de la propiedad
  const criterio = {
    id_tipo_inmueble: prop.id_inmueble,
    tipo_inmueble_nombre: prop.inmueble,
    cant_dormitorios: prop.cantidad_dormitorios,
    cochera: prop.cochera,
    id_zona: prop.id_zona,
    zona_nombre: zona ? zona.name : prop.zona,
    fecha_criterio: new Date().toISOString().split('T')[0],
    estado_criterio_venta: 'Activo',
    id_sector_asesor: 'Alquiler',
    id_propiedad: prop.id,
    id_con_prop_alquiler: prop.id_con_prop_alquiler ? prop.id_con_prop_alquiler : null
  }

  // 4. Verificar si ya existe un criterio con los mismos atributos
  if (existeCriterioDuplicado(criterio)) {
    showWarning('Ya existe una propiedad con el mismo criterio, se guardará el mismo')
    return
  }

  listaCriterios.value.push(criterio)
}
const limpiarFormulario = () => {
  isClienteNuevo.value = true
  telefono.value = ''
  nombre.value = ''
  id_asesor.value = ''
  ingreso_seleccionado.value = ''
  observaciones.value = ''

  id_tipo_inmueble.value = ''
  cant_dormitorios.value = ''
  cochera.value = ''
  id_zona.value = ''

  listaCriterios.value = []
  propiedadesAsignadas.value = []
}

// Envía los datos ordenados al backend
// NOTA: se reutiliza el mismo endpoint/payload que la vista de Venta
// (criterios_venta / propiedades_venta) porque guardarCliente() es un único
// endpoint compartido; si el backend espera claves distintas para alquiler
// (p. ej. criterios_alquiler / propiedades_alquiler) hay que ajustarlas acá.
const handleGuardar = async () => {
  const cliente = {
    telefono: telefono.value,
    nombre: nombre.value,
    id_asesor_alquiler: id_asesor.value,
    ingreso: ingreso_seleccionado.value,
    observaciones: observaciones.value,
    sector_asesor: 'alquiler'
  }

  if (!cliente.ingreso) {
    showError('Debe seleccionar por donde ingreso la persona')
    return
  }

  const data = {
    cliente: cliente,
    criterios_alquiler: listaCriterios.value,
    propiedades_alquiler: propiedadesAsignadas.value
  }

  try {
    await guardarCliente(data)
    showSuccess('Cliente guardado correctamente')
    limpiarFormulario()
  } catch (error) {
    console.error('Error al guardar el cliente:', error)
    showError('Error al guardar el cliente')
  }
}

/* Telefono Cliente ya Cargado */
watch(() => telefono.value, async (nuevoValor) => {
  const digits = String(nuevoValor).replace(/\D/g, '')
  if (digits.length >= 10) {
    //console.log('Se ingresaron 10 dígitos:', digits)
    try {

      const response = await getClientePorTelefono(telefono.value)
      const cliente = response.data.cliente

      // Limpiar los datos previamente cargados
      nombre.value = ''
      ingreso_seleccionado.value = ''
      observaciones.value = ''
      id_asesor.value = ''
      listaCriterios.value = []
      propiedadesAsignadas.value = []

      if (cliente) {
        isClienteNuevo.value = false
        nombre.value = cliente.nombre
        ingreso_seleccionado.value = cliente.ingreso
        observaciones.value = cliente.observaciones
        id_asesor.value = cliente.id_asesor_alquiler

        // Cargar los criterios de alquiler ya existentes del cliente
        // (equivalente a cliente.criterio_busqueda_venta en la vista de Venta)
        cliente.criterio_busqueda_alquiler?.forEach(element => {
          const criterio = {
            id_criterio_alquiler: element.id_criterio,
            id_tipo_inmueble: element.id_tipo_inmueble,
            tipo_inmueble_nombre: element.tipo_inmueble?.inmueble ?? '',
            cant_dormitorios: element.cant_dormitorios,
            cochera: element.cochera || '',
            id_zona: element.id_zona,
            zona_nombre: element.zona?.name ?? '',
            fecha_criterio: element.fecha_criterio_alquiler,
            estado_criterio_venta: element.estado_criterio_alquiler,
            id_sector_asesor: 'Alquiler'
          }

          listaCriterios.value.push(criterio)
        })
      }
      console.log('Cliente:', cliente)
      if (!cliente) {
        isClienteNuevo.value = true
      }
    } catch (error) {
      console.error('Error al buscar cliente por teléfono:', error)
    }
    //buscarClientePorTelefono(digits)
  } else {
    // Si el número de teléfono se borra o es menor a 10 dígitos, se limpian los campos
    isClienteNuevo.value = true
    nombre.value = ''
    ingreso_seleccionado.value = ''
    observaciones.value = ''
    id_asesor.value = ''
    listaCriterios.value = []
    propiedadesAsignadas.value = []
  }
}
)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const userRes = await getUser(token)
      currentUserId.value = userRes.data.id || userRes.data.usuario_id || userRes.data.usuario?.id
    }
  } catch (error) {
    console.error('Error al obtener usuario actual:', error)
  }
  
  getAsesores()
  getInmuebles()
  getZona()
})
</script>
