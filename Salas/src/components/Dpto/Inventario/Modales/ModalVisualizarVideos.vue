<template>
  <BaseModal :show="show" size="xl" @close="cerrar">
    <template #title>Videos del inventario</template>
    <template #body>
      <div v-if="cargando" class="text-center text-muted py-4">
        <div class="spinner-border spinner-border-sm me-1" role="status"></div>
        Cargando videos...
      </div>

      <div v-else-if="error" class="alert alert-danger mb-0" role="alert">
        {{ error }}
      </div>

      <div v-else-if="!videos.length" class="text-center text-muted py-4">
        No hay videos cargados para esta reserva.
      </div>

      <div v-else class="row g-3">
        <div v-for="video in videos" :key="video.id" class="col-12 col-md-6">
          <div class="card h-100">
            <video class="card-img-top bg-dark" controls preload="metadata" :src="urlImagen(video.url)">
              Tu navegador no permite reproducir este video.
            </video>
            <div class="card-body d-flex justify-content-between align-items-center gap-2">
              <small class="text-muted">{{ formatDate(video.created_at) }}</small>
              <button type="button" class="btn btn-outline-danger btn-sm" :disabled="!puedeEditar || eliminandoId === video.id"
                @click="eliminar(video)">
                <i class="bi" :class="eliminandoId === video.id ? 'bi-hourglass-split' : 'bi-trash'"></i>
                {{ eliminandoId === video.id ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="cerrar">Cerrar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useToast } from '@/composables/useToast'
import { urlImagen } from '@/utils/urlImagenes.js'
import { getVideosInventario, eliminarVideoInventario } from '@/Services/api/Dpto/Inventario.js'

const props = defineProps({
  show: { type: Boolean, required: true },
  idProcesoPropiedad: { type: Number, default: null },
  puedeEditar: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])
const { formatDate } = useDateFormatter()
const { showSuccess } = useToast()
const videos = ref([])
const cargando = ref(false)
const error = ref('')
const eliminandoId = ref(null)
let ultimaCarga = 0

async function cargar() {
  if (!props.idProcesoPropiedad) return
  const cargaId = ++ultimaCarga
  cargando.value = true
  error.value = ''
  videos.value = []
  try {
    const response = await getVideosInventario(props.idProcesoPropiedad)
    if (cargaId !== ultimaCarga) return
    videos.value = response.data?.data || []
  } catch (requestError) {
    if (cargaId !== ultimaCarga) return
    error.value = requestError.response?.data?.message || 'No se pudieron cargar los videos.'
  } finally {
    if (cargaId === ultimaCarga) cargando.value = false
  }
}

async function eliminar(video) {
  if (!props.puedeEditar || !confirm('¿Eliminar este video?')) return
  eliminandoId.value = video.id
  try {
    await eliminarVideoInventario(video.id)
    videos.value = videos.value.filter(item => item.id !== video.id)
    showSuccess('Video eliminado')
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'No se pudo eliminar el video.'
  } finally {
    eliminandoId.value = null
  }
}

function cerrar() {
  emit('close')
}

watch(() => props.show, value => {
  if (value) cargar()
})
watch(() => props.idProcesoPropiedad, () => {
  if (props.show) cargar()
})
onMounted(() => {
  if (props.show) cargar()
})
</script>
