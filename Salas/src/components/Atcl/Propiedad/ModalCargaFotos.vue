<template>
  <!-- Modal Fotos (id fijo: los botones usan data-bs-target="#modalFotos") -->
  <div ref="raiz" class="modal fade" id="modalFotos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="modalFotosLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen ">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalFotosLabel">{{ esInventario ? 'Fotos del inventario' : 'Editar Fotos' }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex justify-content-center row">

          <!-- Subida local (sin impactar BD) -->
          <div class="col-md-12 row align-items-star form-group mb-3">
            <div class="col-md-2">
              <label for="fotos" class="form-label">Seleccionar Fotos</label>
            </div>
            <div class="col-md-6 mb-2">
              <input type="file" class="form-control" id="fotos" accept="image/jpeg, image/jpg" multiple
                :disabled="esInventario && !puedeEditar" @change="agregarFotosPendientes">
            </div>
          </div>

          <!-- Fotos pendientes (nuevas, no guardadas aún) -->
          <div v-if="fotosPendientes.length" class="col-md-12 mb-3">
            <h6 class="text-warning">⚠ Fotos nuevas</h6>
            <div class="row g-1">
              <div v-for="(foto, index) in fotosPendientes" :key="'pending-' + index" class="col-md-4">
                <div class="card border-warning">
                  <img :src="foto.preview" class="card-img-top img-thumbnail" style="height: 200px; object-fit: cover;"
                    alt="Preview">
                  <div class="card-body">
                    <div class="row g-1">
                      <div v-if="!esInventario" class="col-md-3">
                        <input type="number" class="form-control form-control-sm" placeholder="Orden"
                          v-model.number="foto.orden" @change="validarCambioOrden(foto)">
                      </div>
                      <div :class="esInventario ? 'col-md-12' : 'col-md-9'">
                        <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                          v-model="foto.comentario"></textarea>
                      </div>

                      <div class="col-md-12 mt-1">
                        <button type="button" class="btn btn-danger btn-sm w-100" @click="quitarFotoPendiente(index)">
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr>
          </div>

          <!-- Fotos ya guardadas (propiedad: BD de propiedades; inventario: API de inventario) -->
          <div class="row g-1 overflow-y-auto" style="max-height: 55vh;">
            <div v-for="foto in listaExistentes" :key="foto.id" class="col-md-4">
              <div class="card">
                <img :src="urlImagen(foto.url)" class="card-img-top img-thumbnail"
                  style="height: 200px; object-fit: cover;" alt="Imagen de propiedad">
                <div class="card-body">
                  <div class="row g-1 align-items-center">
                    <div v-if="!esInventario" class="col-md-3">
                      <input type="number" class="form-control form-control-sm" placeholder="Orden"
                        v-model.number="foto.orden" @change="validarCambioOrden(foto)">
                    </div>
                    <div :class="esInventario ? 'col-md-12' : 'col-md-9'">
                      <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                        v-model="foto.notes" @change="onCambioComentarioExistente(foto)"></textarea>
                    </div>
                    <div class="col-md-12 d-flex justify-content-between">
                      <small class="text-muted">Fecha cargado: {{ formatDate(foto.updated_at ?? foto.created_at) }}</small>
                      <div v-if="!esInventario" class="form-check">
                        <input class="form-check-input" type="checkbox" :id="'archivado-' + foto.id"
                          :checked="foto.archivado === 1" @change="foto.archivado = $event.target.checked ? 1 : 0">
                        <label class="form-check-label" :for="'archivado-' + foto.id">
                          Archivado
                        </label>
                      </div>
                    </div>
                    <div class="col-md-12 mt-1">
                      <button type="button" class="btn btn-danger btn-sm w-100" :disabled="esInventario && !puedeEditar"
                        @click="esInventario ? eliminarFotoInventario(foto.id) : eliminarFotoExistente(foto.id)">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Solo en inventario: guarda las fotos nuevas y los comentarios editados -->
        <div v-if="esInventario" class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-success fw-bold" :disabled="!puedeEditar || guardandoInv || cargandoInv"
            @click="guardarInventario">
            <i class="bi" :class="guardandoInv ? 'bi-hourglass-split' : 'bi-cloud-check-fill'"></i>
            {{ guardandoInv ? ' Guardando...' : ' Guardar fotos' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from '@/composables/useToast'
import { changedPropertyUpdateFields } from '@/utils/propertyUpdateChanges.js'
import { urlImagen } from '@/utils/urlImagenes.js'
import {
  getFotosInventario,
  subirFotosInventario,
  actualizarFotoInventario,
  eliminarFotoInventario as eliminarFotoInventarioApi,
} from '@/Services/api/Dpto/Inventario.js'

// Modo "propiedad" (por defecto): fotos de la propiedad, orden y archivado; los cambios se
// envían con la actualización de la propiedad (ver obtenerCambios).
// Modo "inventario": fotos del proceso de inventario; solo comentario. Se carga y guarda con la API.
const props = defineProps({
  fotos: { type: Array, default: () => [] },
  modo: { type: String, default: 'propiedad' },
  idProcesoPropiedad: { type: Number, default: null },
  puedeEditar: { type: Boolean, default: true },
})

const { showError, showSuccess } = useToast()

const esInventario = computed(() => props.modo === 'inventario')

const raiz = ref(null)
const fotosExistentes = ref([])
const fotosOriginales = ref([])
const fotosPendientes = ref([])
const fotosEliminadas = ref([])

// Estado del modo inventario
const fotosInventario = ref([])
const notesOriginalesInv = ref({})
const cargandoInv = ref(false)
const guardandoInv = ref(false)

const fotosOrdenadas = computed(() => {
  return [...fotosExistentes.value].sort((a, b) => {
    if (a.orden !== null && b.orden !== null) return a.orden - b.orden
    if (a.orden !== null) return -1
    if (b.orden !== null) return 1
    return a.id - b.id
  })
})

const listaExistentes = computed(() => (esInventario.value ? fotosInventario.value : fotosOrdenadas.value))

function inicializar(fotos) {
  const lista = fotos || []
  fotosExistentes.value = lista.map(f => ({ ...f }))
  fotosOriginales.value = lista.map(f => ({
    id: f.id,
    orden: f.orden ?? '',
    notes: f.notes ?? '',
    archivado: f.archivado
  }))
  fotosPendientes.value = []
  fotosEliminadas.value = []
}

// Solo aplica al modo propiedad: en inventario la prop fotos no se usa
watch(() => props.fotos, inicializar, { immediate: true })

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Valida al cambiar el orden de una foto: si está repetido, lo revierte al original
function validarCambioOrden(fotoActual) {
  const ordenesUsados = new Set()
  const todasLasFotos = [...fotosExistentes.value, ...fotosPendientes.value]

  for (const foto of todasLasFotos) {
    if (foto !== fotoActual && foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
      ordenesUsados.add(foto.orden)
    }
  }

  if (fotoActual.orden !== null && fotoActual.orden !== undefined && fotoActual.orden !== '' && ordenesUsados.has(fotoActual.orden)) {
    showError(`El número de orden ${fotoActual.orden} ya está siendo usado por otra foto`)
    nextTick(() => {
      const original = fotosOriginales.value.find(f => f.id === fotoActual.id)
      fotoActual.orden = original?.orden ?? null
    })
  }
}

function onCambioComentarioExistente(foto) {
  if (!esInventario.value) validarCambioOrden(foto)
}

// Valida que no haya números de orden duplicados (la vista la llama antes de guardar)
function validarOrden() {
  const ordenesUsados = new Set()

  for (const foto of fotosExistentes.value) {
    if (foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
      if (ordenesUsados.has(foto.orden)) {
        return { valido: false, mensaje: `El número de orden ${foto.orden} está duplicado en las fotos existentes` }
      }
      ordenesUsados.add(foto.orden)
    }
  }

  for (const foto of fotosPendientes.value) {
    if (foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
      if (ordenesUsados.has(foto.orden)) {
        return { valido: false, mensaje: `El número de orden ${foto.orden} ya está siendo usado por otra foto` }
      }
      ordenesUsados.add(foto.orden)
    }
  }

  return { valido: true }
}

function agregarFotosPendientes(event) {
  const archivos = Array.from(event.target.files)
  archivos.forEach(file => {
    fotosPendientes.value.push({
      file: file,
      preview: URL.createObjectURL(file),
      comentario: '',
      orden: null,
      archivado: 0
    })
  })
  event.target.value = ''
}

function quitarFotoPendiente(index) {
  URL.revokeObjectURL(fotosPendientes.value[index].preview)
  fotosPendientes.value.splice(index, 1)
}

function limpiarPendientes() {
  fotosPendientes.value.forEach(f => URL.revokeObjectURL(f.preview))
  fotosPendientes.value = []
}

function eliminarFotoExistente(fotoId) {
  if (!confirm('¿Eliminar esta foto?')) return
  fotosExistentes.value = fotosExistentes.value.filter(f => f.id !== fotoId)
  fotosEliminadas.value.push(fotoId)
}

// ---------- Modo inventario ----------

// Cada carga toma un número; si llega una respuesta vieja (otro proceso), se descarta.
let ultimaCarga = 0

async function cargarFotosInventario() {
  const idProceso = props.idProcesoPropiedad
  if (!idProceso) return
  const cargaId = ++ultimaCarga
  cargandoInv.value = true
  limpiarPendientes()
  fotosInventario.value = []
  try {
    const res = await getFotosInventario(idProceso)
    if (cargaId !== ultimaCarga) return
    const lista = res.data.data || []
    fotosInventario.value = lista.map(f => ({ ...f }))
    notesOriginalesInv.value = Object.fromEntries(lista.map(f => [f.id, f.notes ?? '']))
  } catch {
    if (cargaId === ultimaCarga) showError('No se pudieron cargar las fotos del inventario')
  } finally {
    if (cargaId === ultimaCarga) cargandoInv.value = false
  }
}

async function eliminarFotoInventario(fotoId) {
  if (!confirm('¿Eliminar esta foto?')) return
  try {
    await eliminarFotoInventarioApi(fotoId)
    fotosInventario.value = fotosInventario.value.filter(f => f.id !== fotoId)
    delete notesOriginalesInv.value[fotoId]
    showSuccess('Foto eliminada')
  } catch (error) {
    showError(error.response?.data?.message || 'No se pudo eliminar la foto')
  }
}

async function guardarInventario() {
  guardandoInv.value = true
  try {
    if (fotosPendientes.value.length) {
      const formData = new FormData()
      formData.append('id_proceso_propiedad', props.idProcesoPropiedad)
      // fotos[] y comentarios[] van en el mismo orden: el backend los empareja por índice
      fotosPendientes.value.forEach(f => {
        formData.append('fotos[]', f.file)
        formData.append('comentarios[]', f.comentario ?? '')
      })
      await subirFotosInventario(formData)
    }

    const editadas = fotosInventario.value.filter(
      f => (f.notes ?? '') !== (notesOriginalesInv.value[f.id] ?? '')
    )
    for (const foto of editadas) {
      await actualizarFotoInventario(foto.id, foto.notes)
    }

    showSuccess('Fotos del inventario guardadas')
    await cargarFotosInventario()
  } catch (error) {
    showError(error.response?.data?.message || 'Error al guardar las fotos del inventario')
  } finally {
    guardandoInv.value = false
  }
}

// Bootstrap dispara show.bs.modal en el mismo clic que el botón, antes de que Vue actualice
// idProcesoPropiedad. Por eso también se carga al cambiar la prop (watch).
function onShowModal() {
  if (esInventario.value) cargarFotosInventario()
}

watch(() => props.idProcesoPropiedad, () => {
  if (esInventario.value) cargarFotosInventario()
})

onMounted(() => {
  raiz.value?.addEventListener('show.bs.modal', onShowModal)
})

onBeforeUnmount(() => {
  raiz.value?.removeEventListener('show.bs.modal', onShowModal)
  limpiarPendientes()
})

// ---------- Modo propiedad ----------

// Devuelve los cambios de fotos listos para armar el FormData de la vista
function obtenerCambios() {
  const modificadas = []
  fotosExistentes.value.forEach(foto => {
    const original = fotosOriginales.value.find(o => o.id === foto.id)
    if (!original) return
    const cambios = changedPropertyUpdateFields(original, {
      orden: foto.orden,
      notes: foto.notes,
      archivado: foto.archivado
    })
    if (Object.keys(cambios).length > 0) {
      modificadas.push({ id: foto.id, ...cambios })
    }
  })

  return {
    modificadas,
    pendientes: fotosPendientes.value,
    eliminadas: fotosEliminadas.value
  }
}

defineExpose({ obtenerCambios, validarOrden })
</script>
