<template>
  <!-- Lista de documentos Word del inventario (sin previsualización). Se abre desde la fila del proceso. -->
  <div ref="raiz" class="modal fade" id="modalDocumentosInventario" data-bs-backdrop="static" tabindex="-1"
    aria-labelledby="modalDocumentosInventarioLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header py-2">
          <h1 class="modal-title fs-6 fw-bold" id="modalDocumentosInventarioLabel">Documento del inventario</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <div v-if="cargando" class="text-center text-muted py-3">
            <div class="spinner-border spinner-border-sm me-1" role="status"></div> Cargando...
          </div>

          <div v-else-if="!documentos.length" class="text-muted small text-center py-3">
            No hay documentos cargados para esta reserva.
          </div>

          <table v-else class="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Cargado</th>
                <th>Por</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in documentos" :key="doc.id">
                <td class="text-break">{{ doc.nombre_original }}</td>
                <td class="text-nowrap small">{{ formatDate(doc.created_at) }}</td>
                <td class="small">{{ doc.quien_cargo?.username ?? '-' }}</td>
                <td class="text-end text-nowrap">
                  <a :href="urlImagen(doc.url)" :download="doc.nombre_original" target="_blank" rel="noopener"
                    class="btn btn-outline-primary btn-sm me-1" title="Descargar">
                    <i class="bi bi-download"></i> Descargar
                  </a>
                  <button type="button" class="btn btn-outline-danger btn-sm" :disabled="!puedeEditar || eliminandoId === doc.id"
                    @click="eliminar(doc)" title="Eliminar">
                    <i class="bi" :class="eliminandoId === doc.id ? 'bi-hourglass-split' : 'bi-trash'"></i> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer py-1">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from '@/composables/useToast'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { urlImagen } from '@/utils/urlImagenes.js'
import { getDocumentosInventario, eliminarDocumentoInventario } from '@/Services/api/Dpto/Inventario.js'

const props = defineProps({
  idProcesoPropiedad: { type: Number, default: null },
  puedeEditar: { type: Boolean, default: true },
})

const { showError, showSuccess } = useToast()
const { formatDate } = useDateFormatter()

const raiz = ref(null)
const documentos = ref([])
const cargando = ref(false)
const eliminandoId = ref(null)

// Si se cambia de proceso mientras carga, descarta la respuesta vieja.
let ultimaCarga = 0

async function cargar() {
  const idProceso = props.idProcesoPropiedad
  if (!idProceso) return
  const cargaId = ++ultimaCarga
  cargando.value = true
  documentos.value = []
  try {
    const res = await getDocumentosInventario(idProceso)
    if (cargaId !== ultimaCarga) return
    documentos.value = res.data.data || []
  } catch {
    if (cargaId === ultimaCarga) showError('No se pudieron cargar los documentos')
  } finally {
    if (cargaId === ultimaCarga) cargando.value = false
  }
}

async function eliminar(doc) {
  if (!confirm(`¿Eliminar el documento "${doc.nombre_original}"?`)) return
  eliminandoId.value = doc.id
  try {
    await eliminarDocumentoInventario(doc.id)
    documentos.value = documentos.value.filter(d => d.id !== doc.id)
    showSuccess('Documento eliminado')
  } catch (error) {
    showError(error.response?.data?.message || 'No se pudo eliminar el documento')
  } finally {
    eliminandoId.value = null
  }
}

// Bootstrap dispara show.bs.modal en el mismo clic que el botón, antes de que Vue actualice la prop.
function onShow() {
  cargar()
}

watch(() => props.idProcesoPropiedad, () => cargar())

onMounted(() => raiz.value?.addEventListener('show.bs.modal', onShow))
onBeforeUnmount(() => raiz.value?.removeEventListener('show.bs.modal', onShow))
</script>
