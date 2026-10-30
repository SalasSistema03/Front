<template>
  <div class="chat-conversacion">
    <div v-if="!repactadoId" class="alert alert-info mb-0" role="alert">
      <i class="bi bi-info-circle me-1"></i>
      Seleccione un repactado para ver su conversación.
    </div>

    <template v-else>
      <div class="chat-cabecera">
        <i class="bi bi-chat-dots"></i>
        <!--  <span>Conversación del repactado</span> -->
        <span class="ms-auto fw-normal text-muted small">{{ mensajes.length }} mensajes</span>
      </div>

      <div v-if="cargando" class="chat-area chat-estado">
        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
        <span class="ms-2">Cargando conversación...</span>
      </div>
      <div v-else-if="errorCarga" class="chat-area chat-estado">
        <div class="alert alert-danger mb-0 w-100" role="alert">{{ errorCarga }}</div>
      </div>
      <div v-else-if="!mensajes.length" class="chat-area chat-estado text-muted">
        No hay mensajes cargados.
      </div>
      <div v-else ref="areaChat" class="chat-area">
        <div v-for="mensaje in mensajes" :key="mensaje.id"
          :class="['chat-fila', mensaje.tipo_persona === 'propietario' ? 'chat-fila-izquierda' : 'chat-fila-derecha']">
          <div
            :class="['chat-burbuja', mensaje.tipo_persona === 'propietario' ? 'chat-propietario' : 'chat-inquilino']">
            <div class="chat-autor">{{ etiqueta(mensaje.tipo_persona) }}</div>
            <div class="chat-texto">{{ mensaje.mensaje }}</div>
            <div class="chat-hora">{{ formatearFechaHora(mensaje.fecha_hora) }}</div>
          </div>
        </div>
      </div>

      <div v-if="!soloLectura" class="chat-form  border-0 shadow-sm p-2 mt-2">
        <div class="row g-2 align-items-center">
          <div class="col-2">
            <select id="rep-chat-quien" class="form-select form-select-sm" v-model="form.tipoPersona"
              :disabled="guardando" aria-label="Quién lo dijo">
              <option value="propietario">Propietario</option>
              <option value="inquilino">Inquilino</option>
            </select>
          </div>
          <div class="col-7">
            <textarea id="rep-chat-mensaje" rows="1" class="form-control form-control-sm" v-model="form.mensaje"
              :disabled="guardando" placeholder="Escriba el mensaje" aria-label="Mensaje"></textarea>
          </div>
          <div class="col-1 d-grid">
            <button type="button" class="btn btn-primary btn-sm" @click="agregarMensaje"
              :disabled="!puedeEnviar || guardando" title="Agregar mensaje">
              <i class="bi bi-send"></i>
              <!--  <span class="d-block small">{{ guardando ? '...' : 'Enviar' }}</span> -->
            </button>
          </div>
        </div>
        <div v-if="errorForm" class="alert alert-danger py-1 px-2 mt-2 mb-0 small" role="alert">{{ errorForm }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import {
  obtenerConversacionRepactado,
  guardarMensajeConversacionRepactado,
} from '@/Services/api/Contrato/Repactado.js'

const props = defineProps({
  repactadoId: { type: [Number, String], default: null },
  activa: { type: Boolean, default: false },
  soloLectura: { type: Boolean, default: false },
})

const mensajes = ref([])
const areaChat = ref(null)
const cargando = ref(false)
const guardando = ref(false)
const errorCarga = ref('')
const errorForm = ref('')

const form = reactive({
  tipoPersona: 'propietario',
  mensaje: '',
})

const puedeEnviar = computed(() => form.mensaje.trim() !== '')

const etiqueta = (tipo) => (tipo === 'propietario' ? 'Propietario' : 'Inquilino')

// fecha_hora llega como "YYYY-MM-DD HH:mm:ss"; se formatea sin pasar por Date para evitar desfasajes de zona horaria
const formatearFechaHora = (valor) => {
  if (!valor) return ''
  const [fecha, hora = ''] = String(valor).split(/[ T]/)
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio} ${hora.slice(0, 5)}`
}

// Como en WhatsApp, el chat siempre muestra el último mensaje
const irAlUltimo = () => {
  if (areaChat.value) areaChat.value.scrollTop = areaChat.value.scrollHeight
}

const cargarMensajes = async () => {
  if (!props.repactadoId) return
  cargando.value = true
  errorCarga.value = ''
  try {
    const response = await obtenerConversacionRepactado(props.repactadoId)
    mensajes.value = response.data.data || []
    await nextTick()
    irAlUltimo()
  } catch (err) {
    console.error('Error al cargar la conversación del repactado:', err)
    mensajes.value = []
    errorCarga.value = err.response?.data?.message || 'No se pudo cargar la conversación.'
  } finally {
    cargando.value = false
  }
}

const agregarMensaje = async () => {
  if (!puedeEnviar.value || guardando.value) return
  errorForm.value = ''
  guardando.value = true
  try {
    await guardarMensajeConversacionRepactado(props.repactadoId, {
      tipo_persona: form.tipoPersona,
      mensaje: form.mensaje.trim(),
    })
    form.mensaje = ''
    await cargarMensajes()
  } catch (err) {
    console.error('Error al guardar el mensaje del repactado:', err)
    const errores = err.response?.data?.errors
    errorForm.value = errores
      ? Object.values(errores).flat().join(' ')
      : err.response?.data?.message || 'No se pudo guardar el mensaje.'
  } finally {
    guardando.value = false
  }
}

watch(
  () => [props.repactadoId, props.activa],
  ([id, activa]) => {
    if (id && activa) cargarMensajes()
  },
  { immediate: true }
)

// Cuando el elemento del chat aparece en el DOM (v-else monta el ref), bajar al último mensaje
watch(areaChat, (el) => {
  if (el) irAlUltimo()
})
</script>
