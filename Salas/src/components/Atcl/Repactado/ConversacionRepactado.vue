<template>
  <div class="chat-conversacion">
    <div v-if="!repactadoId" class="alert alert-info mb-0" role="alert">
      <i class="bi bi-info-circle me-1"></i>
      Seleccione un repactado para ver su conversación.
    </div>

    <template v-else>
      <div class="chat-cabecera">
        <i class="bi bi-chat-dots"></i>
        <span class="ms-auto fw-normal small">{{ mensajes.length }} mensajes</span>
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
        <template v-for="item in itemsChat" :key="item.key">
          <div v-if="item.tipo === 'dia'" class="chat-dia">
            <span>{{ item.etiqueta }}</span>
          </div>
          <div v-else
            :class="['chat-fila', item.tipoPersona === 'propietario' ? 'chat-fila-izquierda' : 'chat-fila-derecha', { 'chat-fila-inicio': item.inicioGrupo }]">
            <div
              :class="['chat-burbuja', item.tipoPersona === 'propietario' ? 'chat-propietario' : 'chat-inquilino', { 'chat-cola': item.inicioGrupo }]">
              <div v-if="item.inicioGrupo" class="chat-autor">{{ etiqueta(item.tipoPersona) }}</div>
              <div class="chat-texto">{{ item.mensaje }}</div>
              <div class="chat-hora">{{ item.hora }}</div>
            </div>
          </div>
        </template>
      </div>

      <div v-if="!soloLectura" class="chat-form mt-2">
        <select id="rep-chat-quien" class="form-select form-select-sm chat-quien" v-model="form.tipoPersona"
          :disabled="guardando" aria-label="Quién lo dijo">
          <option value="propietario">Propietario</option>
          <option value="inquilino">Inquilino</option>
        </select>
        <textarea id="rep-chat-mensaje" rows="1" class="form-control form-control-sm chat-input" v-model="form.mensaje"
          :disabled="guardando" placeholder="Escriba un mensaje" aria-label="Mensaje"
          @keydown.enter.exact.prevent="agregarMensaje"></textarea>
        <button type="button" class="chat-enviar" @click="agregarMensaje" :disabled="!puedeEnviar || guardando"
          title="Enviar mensaje" aria-label="Enviar mensaje">
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
      <div v-if="errorForm" class="alert alert-danger py-1 px-2 mt-2 mb-0 small" role="alert">{{ errorForm }}</div>
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

// fecha_hora llega como "YYYY-MM-DD HH:mm:ss"; se separa por texto para evitar desfasajes de zona horaria
const partesFecha = (valor) => {
  if (!valor) return { fecha: '', hora: '' }
  const [fechaIso, hora = ''] = String(valor).split(/[ T]/)
  const [anio, mes, dia] = fechaIso.split('-')
  return { fecha: `${dia}/${mes}/${anio}`, hora: hora.slice(0, 5) }
}

const formatoFecha = (d) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

// Separador de día: "Hoy", "Ayer" o la fecha completa
const etiquetaDia = (fecha) => {
  const ahora = new Date()
  const ayer = new Date(ahora)
  ayer.setDate(ahora.getDate() - 1)
  if (fecha === formatoFecha(ahora)) return 'Hoy'
  if (fecha === formatoFecha(ayer)) return 'Ayer'
  return fecha
}

// Intercala separadores de día y marca el primer mensaje de cada tanda del mismo autor
const itemsChat = computed(() => {
  const items = []
  let diaAnterior = null
  let autorAnterior = null

  mensajes.value.forEach((m) => {
    const { fecha, hora } = partesFecha(m.fecha_hora)

    if (fecha !== diaAnterior) {
      items.push({ tipo: 'dia', key: `dia-${fecha}`, etiqueta: etiquetaDia(fecha) })
      diaAnterior = fecha
      autorAnterior = null
    }

    items.push({
      tipo: 'mensaje',
      key: m.id,
      tipoPersona: m.tipo_persona,
      mensaje: m.mensaje,
      hora,
      inicioGrupo: m.tipo_persona !== autorAnterior,
    })
    autorAnterior = m.tipo_persona
  })

  return items
})

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
