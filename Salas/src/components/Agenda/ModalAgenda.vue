<template>
  <BaseModal :show="show && !showModalMotivoBorrar" size="lg" @close="emit('close')">

    <template #title>Agenda</template>

    <template #body>
      <form class="row form-group d-flex align-items-center justify-content-center">
        <div class="col-md-2">
          <label>Usuario</label>
          <input type="text" class="form-control" :value="username?.nombre" readonly />
        </div>
        <div class="col-md-2">
          <label>Fecha</label>
          <input type="date" class="form-control" :value="fecha" :readonly="nota" />
        </div>
        <div class="col-md-2">
          <label>Hora Inicio</label>
          <input v-if="props.hora" type="text" class="form-control" :value="hora" readonly />
          <input v-else type="time" class="form-control" v-model="horaInicio" :step="900" @blur="validarHoraInicio"
            :readonly="nota" />
        </div>
        <div class="col-md-2">
          <label>Hora Fin</label>
          <input type="time" class="form-control" v-model="horaFin" :step="900" @blur="validarHoraFin"
            :readonly="nota" />
        </div>

        <div class="row d-flex align-items-center justify-content-center">
          <div class="col-md-3" v-if="props.sector?.nombre === 'Alquiler'">
            <label>Nombre Cliente</label>
            <input type="text" class="form-control" v-model="nombreCliente" :readonly="nota" />
          </div>
          <div class="col-md-2 position-relative" v-if="props.sector?.nombre === 'Alquiler'">
            <label>Telefono</label>
            <input type="text" class="form-control" v-model="telefono"
              @focus="mostrandoResultadosClientes = resultadosClientes.length > 0" :readonly="nota" />

            <!-- Resultados predictivos de clientes -->
            <div v-if="mostrandoResultadosClientes && resultadosClientes.length > 0"
              class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm m-0 px-1 agenda_desplegable_busqueda">
              <div v-for="item in resultadosClientes" :key="item.cliente.id_cliente" class="px-2 py-1 hover:bg-light cursor-pointer agenda_desplegable_busqueda_propiedad d-flex
              align-items-center justify-content-between" @click="seleccionarCliente(item)">
                <div class="small">
                  {{ item.cliente.telefono }} - {{ item.cliente.nombre }}
                </div>
              </div>
            </div>
          </div>


          <div class="col-md-7 position-relative"
            v-if="props.sector?.nombre === 'Alquiler' || props.sector?.nombre === 'Ventas'">
            <label>Buscar propiedad</label>
            <input type="text" class="form-control" placeholder="Ingrese codigo o calle" v-model="busquedaPropiedad"
              @focus="mostrandoResultados = resultadosPropiedades.length > 0" :readonly="nota" />

            <!-- Resultados predictivos -->
            <div v-if="mostrandoResultados && resultadosPropiedades.length > 0"
              class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm m-0 px-1 agenda_desplegable_busqueda">
              <div v-for="propiedad in resultadosPropiedades" :key="propiedad.id" class="px-2 py-1 hover:bg-light cursor-pointer row m-0 agenda_desplegable_busqueda_propiedad d-flex
              align-items-center justify-content-between" @click="seleccionarPropiedad(propiedad)">
                <div class="small col-1" v-if="props.sector?.nombre === 'Ventas'">
                  {{ propiedad.cod_venta }}
                </div>
                <div v-if="props.sector?.nombre === 'Alquiler'" class="small col-1">
                  {{ propiedad.cod_alquiler }}
                </div>
                <div class="small col-5">
                  {{ propiedad.calle }} {{ propiedad.numero_calle }}
                </div>
                <div v-if="props.sector?.nombre === 'Ventas'" class="small col-6 row">
                  <div class="col-6 estado_activa">
                    {{ propiedad.estado_venta }}
                  </div>
                  <div class="col-6 estado_activa">
                    {{ propiedad.estado_alquiler }}
                  </div>

                </div>
                <div v-if="props.sector?.nombre === 'Alquiler'" class="small col-6 row">
                  <div class="col-6">
                    {{ propiedad.estado_alquiler }}
                  </div>
                  <div class="col-6">
                    {{ propiedad.estado_venta }}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="col-12">
          <label>Descripcion</label>
          <textarea name="descripcion" class="form-control" rows="2" placeholder="Escribe una nota..."
            v-model="descripcion" :readonly="nota"></textarea>
        </div>
      </form>

      <div v-if="props.sector?.nombre === 'Alquiler' && clienteSeleccionado && !nota" class="agenda_tabla_general mt-2">
        <table v-if="historialCliente.length" class="table table-striped">
          <thead>
            <tr class="agenda_titulo_tabla_modal text-center">
              <th>Codigo</th>
              <th>Fecha</th>
              <th>Inmueble</th>
              <th>Asesor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody class="agenda_cuerpo_tabla_modal text-center">
            <tr v-for="(h, idx) in historialCliente" :key="idx">
              <td>{{ h.cod_alquiler }}</td>
              <td>{{ h.fecha }} {{ h.hora_inicio }}Hs</td>
              <td>{{ h.inmueble }} {{ h.numero_calle }}</td>
              <td>{{ h.asesor }}</td>
              <td>{{ h.activo }}</td>
            </tr>
          </tbody>
        </table>

        <div v-else class="text-center small">Sin historial</div>
      </div>
      <div v-else-if="nota && props.sector?.nombre === 'Alquiler'" class="agenda_tabla_general mt-2">
        <table v-if="nota.notas_cliente" class="table table-striped">
          <thead>
            <tr class="agenda_titulo_tabla_modal text-center">
              <th>Codigo</th>
              <th>Fecha</th>
              <th>Inmueble</th>
              <th>Asesor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody class="agenda_cuerpo_tabla_modal text-center">
            <tr v-for="(h, idx) in nota.notas_cliente" :key="idx">
              <td>{{ h.cod_alquiler }}</td>
              <td>{{ h.fecha }} {{ h.hora_inicio }}Hs</td>
              <td>{{ h.inmueble }} {{ h.numero_calle }}</td>
              <td>{{ h.asesor }}</td>
              <td v-if="h.activo === 1">Activo</td>
              <td v-else>Inactivo</td>
            </tr>
          </tbody>
        </table>

        <div v-else class="text-center small">Sin historial</div>
      </div>

    </template>

    <template #footer>
      <!-- <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button> -->
      <button v-if="!nota" type="button" class="btn btn-primary btn-sm" @click="guardar">Guardar</button>
      <button v-if="nota" type="button" class="btn btn-danger btn-sm" @click="abrirModalMotivoBorrar">Borrar</button>
    </template>

  </BaseModal>

  <ModalMotivoBorrar :show="showModalMotivoBorrar" @close="cerrarModalMotivoBorrar" @confirm="confirmarBorrado" />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ModalMotivoBorrar from '@/components/Agenda/ModalMotivoBorrar.vue'
import { buscarPropiedadPorCodigoCalle } from '@/Services/api/Agenda/AgendaApi'
import { cargarNota } from '@/Services/api/Agenda/AgendaApi'
import { getClientesTelefono } from '@/Services/api/Agenda/AgendaApi'
import { borrarNota } from '@/Services/api/Agenda/AgendaApi'
import { useToast } from '@/composables/useToast'

const HORA_MIN = '07:00'
const HORA_MAX = '20:45'
const emit = defineEmits(['close', 'nota-guardada'])

// Variables para los datos del formulario
const descripcion = ref('')
const telefono = ref('')
const nombreCliente = ref('')
const propiedadSeleccionada = ref(null)
const clienteSeleccionado = ref(null)
const historialCliente = ref([])
const showModalMotivoBorrar = ref(false)
const { showSuccess, showError } = useToast()

const props = defineProps({
  show: { type: Boolean, default: false },
  username: { type: Object, default: null },
  hora: { type: String, default: '' },
  sector: { type: String, default: '' },
  fecha: { type: String, default: new Date().toISOString().split('T')[0] },
  nota: { type: Object, default: null },
  criterioSeleccionado: { type: String, default: null}

})

const horaInicio = ref('')
const horaFin = ref('')

const horaInicioEfectiva = computed(() => {
  return props.hora ? String(props.hora) : String(horaInicio.value || '')
})

function clampHora(hhmm) {
  if (!hhmm) return ''
  if (hhmm < HORA_MIN) return HORA_MIN
  if (hhmm > HORA_MAX) return HORA_MAX
  return hhmm
}

function normalizarHora(hora) {
  if (!hora) return ''
  return String(hora).slice(0, 5)
}

function textoPropiedadDesdeNota(nota) {
  if (!nota) return ''

  const codigo = nota.propiedad_cod_venta || nota.propiedad_cod_alquiler || ''
  const calle = nota.propiedad_calle || ''
  const numero = nota.propiedad_numero_calle ? String(nota.propiedad_numero_calle) : ''
  const estadoAlquiler = nota.propiedad_estado_alquiler || ''
  const estadoVenta = nota.propiedad_estado_venta || ''

  const calleCompleta = `${calle}${numero ? ` ${numero}` : ''}`.trim()

  if (!codigo && !calleCompleta && !estadoAlquiler && !estadoVenta) return ''

  const sectorNombre = props.sector?.nombre || ''
  const estados = sectorNombre === 'Ventas'
    ? [estadoVenta, estadoAlquiler]
    : [estadoAlquiler, estadoVenta]

  return [codigo, calleCompleta, ...estados]
    .map(v => String(v || '').trim())
    .filter(Boolean)
    .join(' - ')
}

function resetFormConDefaults() {
  descripcion.value = ''
  ignorarWatchTelefono.value = true   // ← evita búsqueda al limpiar el campo
  telefono.value = ''
  nombreCliente.value = ''
  propiedadSeleccionada.value = null
  busquedaPropiedad.value = ''
  resultadosClientes.value = []
  mostrandoResultadosClientes.value = false
  clienteSeleccionado.value = null
  historialCliente.value = []
}

function aplicarNotaSiExiste() {
  // Siempre setear defaults primero para que al cambiar de celda no queden residuos
  resetFormConDefaults()

  if (!props.nota) {
    return
  }

  // Prefill desde nota
  descripcion.value = props.nota.descripcion ?? ''
  ignorarWatchTelefono.value = true   // ← evita que el watcher relance la búsqueda al cargar nota
  telefono.value = props.nota.telfCliente ?? props.nota.telefono ?? ''
  nombreCliente.value = props.nota.nombreCliente ?? ''

  const textoPropiedad = textoPropiedadDesdeNota(props.nota)
  if (textoPropiedad) {
    busquedaPropiedad.value = textoPropiedad
  }

  // Hora fin: en backend viene como HH:mm:ss
  if (props.nota.hora_fin) {
    horaFin.value = normalizarHora(props.nota.hora_fin)
  }

}

// Variables para búsqueda predictiva
const busquedaPropiedad = ref('')
const resultadosPropiedades = ref([])
const mostrandoResultados = ref(false)
const resultadosClientes = ref([])
const mostrandoResultadosClientes = ref(false)
// Flag: evita que el watcher dispare búsqueda cuando el valor se asigna por código
const ignorarWatchTelefono = ref(false)

// Función para buscar propiedades
const buscarPropiedades = async () => {
  const query = String(busquedaPropiedad.value).trim();

  if (!query || !props.sector?.nombre) {
    resultadosPropiedades.value = [];
    mostrandoResultados.value = false;
    return;
  }

  try {
    const response = await buscarPropiedadPorCodigoCalle(
      query,
      props.sector.nombre
    );
    resultadosPropiedades.value = response.data;
    mostrandoResultados.value = true;
  } catch (error) {
    console.error('Error al buscar propiedades:', error);
    resultadosPropiedades.value = [];
    mostrandoResultados.value = false;
  }
}

// Función para buscar clientes por teléfono
const buscarClientesPorTelefono = async () => {
  const query = String(telefono.value).trim();

  if (!query || query.length < 3) {
    resultadosClientes.value = [];
    mostrandoResultadosClientes.value = false;
    return;
  }

  const busquedaId = ++ultimaBusquedaClientesId

  try {
    const response = await getClientesTelefono(query);

    if (busquedaId !== ultimaBusquedaClientesId) {
      return
    }

    if (String(telefono.value).trim() !== query) {
      return
    }

    resultadosClientes.value = Array.isArray(response.data) ? response.data : [];
    mostrandoResultadosClientes.value = true;
  } catch (error) {
    console.error('Error al buscar clientes por teléfono:', error);
    resultadosClientes.value = [];
    mostrandoResultadosClientes.value = false;
  }
}
// Variable para controlar el tiempo del debounce
let timeoutBusqueda = null;
let timeoutBusquedaClientes = null;
let ultimaBusquedaClientesId = 0;

watch(busquedaPropiedad, (nuevoValor) => {
  // Limpiamos el timeout anterior si el usuario sigue escribiendo
  clearTimeout(timeoutBusqueda);

  // Validamos que sea un string antes de hacer trim
  const valorLimpio = typeof nuevoValor === 'string' ? nuevoValor.trim() : '';

  if (valorLimpio) {
    // Aplicamos un debounce manual de 300ms
    timeoutBusqueda = setTimeout(() => {
      buscarPropiedades();
    }, 300);
  } else {
    resultadosPropiedades.value = [];
    mostrandoResultados.value = false;
  }
}); // Eliminamos el { debounce: 300 } que no es válido aquí

// Watcher para teléfono con debounce
watch(telefono, (nuevoValor) => {
  // Si el valor fue asignado por código (selección o carga de nota), ignorar y resetear flag
  if (ignorarWatchTelefono.value) {
    ignorarWatchTelefono.value = false
    clearTimeout(timeoutBusquedaClientes)
    return
  }

  // Limpiamos el timeout anterior si el usuario sigue escribiendo
  clearTimeout(timeoutBusquedaClientes);

  // Validamos que sea un string antes de hacer trim
  const valorLimpio = typeof nuevoValor === 'string' ? nuevoValor.trim() : '';

  if (valorLimpio) {
    // Aplicamos un debounce manual de 300ms
    timeoutBusquedaClientes = setTimeout(() => {
      buscarClientesPorTelefono();
    }, 300);
  } else {
    resultadosClientes.value = [];
    mostrandoResultadosClientes.value = false;
  }
});

// Seleccionar propiedad de los resultados
const seleccionarPropiedad = (propiedad) => {
  // Construimos el texto completo con código, calle y estados
  const codigo = propiedad.cod_venta || propiedad.cod_alquiler || ''
  const calle = propiedad.calle || ''
  const estadoVenta = propiedad.estado_venta || ''
  const estadoAlquiler = propiedad.estado_alquiler || ''
  const numero_calle = propiedad.numero_calle || ''

  // Formateamos el texto a mostrar
  let textoCompleto = codigo
  if (calle) {
    textoCompleto += ` - ${calle} ${numero_calle}`
  }
  if (estadoVenta && props.sector?.nombre === 'Venta') {
    textoCompleto += ` - ${estadoVenta}`
    if (estadoAlquiler) {
      textoCompleto += ` - ${estadoAlquiler}`
    }
  }
  if (estadoAlquiler && props.sector?.nombre === 'Alquiler') {
    textoCompleto += ` - ${estadoAlquiler}`
    if (estadoVenta) {
      textoCompleto += ` - ${estadoVenta}`
    }
  }

  busquedaPropiedad.value = textoCompleto
  propiedadSeleccionada.value = propiedad
  mostrandoResultados.value = false
}

// Seleccionar cliente de los resultados
const seleccionarCliente = (item) => {
  ignorarWatchTelefono.value = true   // ← evita que el watcher relance la búsqueda
  telefono.value = item.cliente.telefono
  nombreCliente.value = item.cliente.nombre
  clienteSeleccionado.value = item.cliente
  historialCliente.value = Array.isArray(item.historial) ? item.historial : []
  mostrandoResultadosClientes.value = false
  resultadosClientes.value = []
  //console.log(resultadosClientes.value)
}

// Función para guardar todos los datos
async function guardar() {
  const datosCompletos = {
    usuario: props.username.usuario_id || '',
    fecha: props.fecha,
    horaInicio: horaInicioEfectiva.value,
    horaFin: horaFin.value,
    descripcion: descripcion.value,
    telefono: telefono.value,
    propiedad: propiedadSeleccionada.value,
    sector: props.sector?.id || '',
    busquedaPropiedad: busquedaPropiedad.value,
    criterioSeleccionado: props.criterioSeleccionado?.id_criterio_venta || ''
  }

   /* console.log('=== DATOS COMPLETOS DEL FORMULARIO ===')
  console.log('Usuario:', datosCompletos.usuario)
  console.log('Fecha:', datosCompletos.fecha)
  console.log('Hora Inicio:', datosCompletos.horaInicio)
  console.log('Hora Fin:', datosCompletos.horaFin)
  console.log('Descripción:', datosCompletos.descripcion)
  console.log('Teléfono:', datosCompletos.telefono)
  console.log('Propiedad ID:', datosCompletos.propiedad?.id)
  console.log('Propiedad Código:', datosCompletos.propiedad?.cod_venta || datosCompletos.propiedad?.cod_alquiler)
  console.log('Propiedad Calle:', datosCompletos.propiedad?.calle)
  console.log('Sector:', datosCompletos.sector)
  console.log('Búsqueda:', datosCompletos.busquedaPropiedad)
  console.log('Criterio Seleccionado:', datosCompletos.criterioSeleccionado)
  console.log('=====================================') */

  try {
    // Llamar a la API para cargar la nota
    await cargarNota(datosCompletos)
    showSuccess('Nota guardada correctamente')
    emit('nota-guardada')
    emit('close')
  } catch (error) {
    //console.error('Error al guardar:', error.request)


    showError(error.response.data.message)
  }

}

// Función auxiliar para redondear al múltiplo de 15 más cercano
function redondearA15Minutos(horaString) {
  let [h, m] = horaString.split(':').map(Number)

  // Redondeo matemático: (minutos / 15) redondeado * 15
  let minutosRedondeados = Math.round(m / 15) * 15

  if (minutosRedondeados === 60) {
    h += 1
    minutosRedondeados = 0
  }

  return `${h.toString().padStart(2, '0')}:${minutosRedondeados.toString().padStart(2, '0')}`
}

function validarHoraInicio(event) {
  let valor = event?.target?.value
  if (!valor) {
    horaInicio.value = clampHora(HORA_MIN)
    return
  }

  valor = clampHora(redondearA15Minutos(valor))
  horaInicio.value = valor
}

// 1. Al abrir o cambiar hora de inicio, sumar 15 min por defecto
watch(horaInicioEfectiva, (nuevaHora) => {
  if (!nuevaHora) return

  const [h, m] = String(nuevaHora).split(':').map(Number)
  let nuevoM = m + 15
  let nuevoH = h

  if (nuevoM >= 60) {
    nuevoH += 1
    nuevoM -= 60
  }

  const calculada = `${nuevoH.toString().padStart(2, '0')}:${nuevoM.toString().padStart(2, '0')}`

  // Validar que no exceda el máximo permitido
  horaFin.value = calculada > HORA_MAX ? HORA_MAX : calculada
}, { immediate: true })

watch(
  () => props.show,
  () => {
    if (!props.show) return

    // Si el modal viene sin hora (caso Asesores), inicializar horaInicio con un default
    if (!props.hora) {
      const now = new Date()
      const hh = now.getHours().toString().padStart(2, '0')
      const mm = now.getMinutes().toString().padStart(2, '0')
      const aproximada = clampHora(redondearA15Minutos(`${hh}:${mm}`))
      horaInicio.value = aproximada || HORA_MIN
    }
  },
  { immediate: true }
)

watch(
  () => [props.show, props.nota, props.fecha, props.hora, props.username],
  () => {
    if (!props.show) return
    aplicarNotaSiExiste()
  },
  { immediate: true }
)

// 2. Validar cambios manuales en Hora Fin
function validarHoraFin(event) {
  let valor = event.target.value

  // Aplicar redondeo al múltiplo de 15 más cercano (ej: 07:58 -> 08:00)
  valor = redondearA15Minutos(valor)

  // Regla: No puede ser menor o igual a la hora de inicio
  if (valor <= horaInicioEfectiva.value) {
    // Si es menor, asignamos el siguiente bloque disponible (inicio + 15 min)
    const [h, m] = String(horaInicioEfectiva.value).split(':').map(Number)
    let nM = m + 15
    let nH = h
    if (nM >= 60) { nH++; nM = 0 }
    valor = `${nH.toString().padStart(2, '0')}:${nM.toString().padStart(2, '0')}`
  }

  // Regla: No puede superar el límite de las 20:45
  if (valor > HORA_MAX) {
    valor = HORA_MAX
  }

  horaFin.value = valor
}

async function borarr(id, motivo) {
  console.log('Borrar nota con ID:', id)
  await borrarNota(id, motivo)
}

function abrirModalMotivoBorrar() {
  if (!props.nota?.id) return
  showModalMotivoBorrar.value = true
}

function cerrarModalMotivoBorrar() {
  showModalMotivoBorrar.value = false
}

async function confirmarBorrado(motivo) {
  if (!props.nota?.id) return
  try {
    await borarr(props.nota.id, motivo)
    showModalMotivoBorrar.value = false
    emit('close')
  } catch (error) {
    console.error('Error al borrar nota:', error)
  }
}


</script>
