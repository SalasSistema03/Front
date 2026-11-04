<template>
  <!-- Modal Documentacion (id fijo: los botones usan data-bs-target="#modalDocumentacion") -->
  <div class="modal fade" id="modalDocumentacion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="modalDocumentacionLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen ">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalDocumentacionLabel">Editar Documentación</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex justify-content-center row">

          <!-- Subida local -->
          <div class="col-md-12 row align-items-star form-group mb-3">
            <div class="col-md-2">
              <label for="documentos" class="form-label">Seleccionar Documentos</label>
            </div>
            <div class="col-md-6 mb-2">
              <input type="file" class="form-control" id="documentos" accept="image/*,application/pdf" multiple
                @change="agregarDocumentosPendientes">
            </div>
          </div>

          <!-- Documentos pendientes -->
          <div v-if="documentosPendientes.length" class="col-md-12 mb-3">
            <h6 class="text-warning">⚠ Documentos nuevos</h6>
            <div class="row g-1">
              <div v-for="(doc, index) in documentosPendientes" :key="'pending-doc-' + index" class="col-md-4">
                <div class="card border-warning">

                  <!-- Preview: PDF o imagen -->
                  <div style="height: 200px; overflow: hidden;">
                    <embed v-if="doc.esPdf" :src="doc.preview" class="w-100 h-100 border-0" type="application/pdf">
                    <img v-else :src="doc.preview" class="w-100 h-100 img-thumbnail" style="object-fit: cover;">
                  </div>

                  <div class="card-body">
                    <div class="row g-1">
                      <div class="col-md-12">
                        <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                          v-model="doc.comentario"></textarea>
                      </div>
                      <div class="col-md-12 mt-1">
                        <button type="button" class="btn btn-danger btn-sm w-100" @click="quitarDocumentoPendiente(index)">
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

          <!-- Documentos ya guardados en BD -->
          <div class="row g-1 overflow-y-auto" style="max-height: 55vh;">
            <div v-for="documento in documentosExistentes" :key="documento.id" class="col-md-4">
              <div class="card">
                <div style="height: 200px; overflow: hidden;">
                  <embed v-if="documento.url.endsWith('.pdf')" :src="'http://10.10.10.191' + documento.url"
                    class="w-100 h-100 border-0" type="application/pdf">
                  <img v-else :src="'http://10.10.10.191' + documento.url" class="w-100 h-100 img-thumbnail"
                    style="object-fit: cover;">
                </div>
                <div class="card-body">
                  <div class="row g-1">
                    <div class="col-md-12">
                      <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                        v-model="documento.notes"></textarea>
                    </div>
                    <div class="col-md-12 mt-1">
                      <button type="button" class="btn btn-danger btn-sm w-100" @click="eliminarDocumentoExistente(documento.id)">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { changedPropertyUpdateFields, propertyUpdateValuesEqual } from '@/utils/propertyUpdateChanges.js'

// Recibe los documentos ya guardados de la propiedad. No los muta: trabaja sobre copias.
const props = defineProps({
  documentos: { type: Array, default: () => [] }
})

const documentosExistentes = ref([])
const documentosOriginales = ref([])
const documentosPendientes = ref([])
const documentosEliminados = ref([])

function inicializar(documentos) {
  const lista = documentos || []
  documentosExistentes.value = lista.map(d => ({ ...d }))
  documentosOriginales.value = lista.map(d => ({
    id: d.id,
    notes: d.notes ?? ''
  }))
  documentosPendientes.value = []
  documentosEliminados.value = []
}

watch(() => props.documentos, inicializar, { immediate: true })

function agregarDocumentosPendientes(event) {
  const archivos = Array.from(event.target.files)
  archivos.forEach(file => {
    const esPdf = file.type === 'application/pdf'
    documentosPendientes.value.push({
      file,
      preview: URL.createObjectURL(file),
      esPdf,
      nombre: file.name,
      comentario: ''
    })
  })
  event.target.value = ''
}

function quitarDocumentoPendiente(index) {
  URL.revokeObjectURL(documentosPendientes.value[index].preview)
  documentosPendientes.value.splice(index, 1)
}

function eliminarDocumentoExistente(docId) {
  if (!confirm('¿Eliminar este documento?')) return
  documentosExistentes.value = documentosExistentes.value.filter(d => d.id !== docId)
  documentosEliminados.value.push(docId)
}

// Devuelve los cambios de documentos listos para armar el FormData de la vista
function obtenerCambios() {
  const modificadas = []
  documentosExistentes.value.forEach(doc => {
    const original = documentosOriginales.value.find(o => o.id === doc.id)
    if (!original) return
    if (propertyUpdateValuesEqual(original.notes, doc.notes)) return
    const cambios = changedPropertyUpdateFields(original, { notes: doc.notes })
    modificadas.push({ id: doc.id, ...cambios })
  })

  return {
    modificadas,
    pendientes: documentosPendientes.value,
    eliminados: documentosEliminados.value
  }
}

defineExpose({ obtenerCambios })
</script>
