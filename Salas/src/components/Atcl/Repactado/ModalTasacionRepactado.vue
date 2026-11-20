<template>
  <BaseModal :show="show" size="xl" @close="emit('close')">
    <template #title>
      <i class="bi bi-house-check me-2"></i>
      Tasar propiedad{{ direccion ? ` · ${direccion}` : '' }}
    </template>

    <template #body>
      <div class="tasacion-repactado-modal-body px-2">
        <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5">
          <div class="spinner-border text-primary mb-2" role="status" aria-label="Cargando propiedad"></div>
          <span class="text-muted">Cargando ficha de la propiedad...</span>
        </div>

        <div v-else-if="propiedad" class="row g-3">
          <div class="col-12 col-xl-7">
            <section class="card h-100">
              <div class="card-header d-flex align-items-center card-header-tasaciones">
                <i class="bi bi-info-square me-2"></i>
                <p class="mb-0">Ficha de la propiedad</p>
              </div>
              <div class="card-body">
                <div class="row g-2">
                  <div class="col-6 col-md-3 tasacion-repactado-field">
                    <label class="form-label">Provincia</label>
                    <input class="form-control form-control-sm" :value="propiedad.provincia?.name || '—'" readonly>
                  </div>
                  <div class="col-6 col-md-3 tasacion-repactado-field">
                    <label class="form-label">Localidad</label>
                    <input class="form-control form-control-sm" :value="propiedad.localidad?.name || '—'" readonly>
                  </div>
                  <div class="col-6 col-md-3 tasacion-repactado-field">
                    <label class="form-label">Zona</label>
                    <input class="form-control form-control-sm" :value="propiedad.zona?.name || '—'" readonly>
                  </div>
                  <div class="col-6 col-md-3 tasacion-repactado-field">
                    <label class="form-label">Inmueble</label>
                    <input class="form-control form-control-sm" :value="propiedad.tipo_inmueble?.inmueble || '—'"
                      readonly>
                  </div>
                  <div class="col-12 col-md-6 tasacion-repactado-field">
                    <label class="form-label">Calle</label>
                    <input class="form-control form-control-sm" :value="propiedad.calle?.name || '—'" readonly>
                  </div>
                  <div class="col-4 col-md-2 tasacion-repactado-field">
                    <label class="form-label">N.º</label>
                    <input class="form-control form-control-sm" :value="propiedad.numero_calle || '—'" readonly>
                  </div>
                  <div class="col-4 col-md-2 tasacion-repactado-field">
                    <label class="form-label">Piso</label>
                    <input class="form-control form-control-sm" :value="propiedad.piso || '—'" readonly>
                  </div>
                  <div class="col-4 col-md-2 tasacion-repactado-field">
                    <label class="form-label">Dto. / PH</label>
                    <input class="form-control form-control-sm"
                      :value="[propiedad.departamento, propiedad.ph].filter(Boolean).join(' / ') || '—'" readonly>
                  </div>
                </div>

                <div class="row g-2 mt-2">
                  <div class="col-12 col-md-6">
                    <h3 class="tasacion-repactado-subtitle">
                      <i class="bi bi-ui-checks-grid me-1"></i>Comodidades
                    </h3>
                    <div class="d-flex flex-wrap gap-2">
                      <span class="badge text-bg-light border">Dormitorios: {{ propiedad.cantidad_dormitorios ?? '—' }}</span>
                      <span class="badge text-bg-light border">Baños: {{ propiedad.banios ?? '—' }}</span>
                      <span class="badge text-bg-light border">m² lote: {{ propiedad.mLote ?? '—' }}</span>
                      <span class="badge text-bg-light border">m² cubiertos: {{ propiedad.mCubiertos ?? '—' }}</span>
                      <span class="badge text-bg-light border">Cochera: {{ propiedad.cochera || '—' }}</span>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <h3 class="tasacion-repactado-subtitle">
                      <i class="bi bi-people me-1"></i>Propietarios
                    </h3>
                    <p v-if="propiedad.propietarios?.length" class="small mb-0">
                      <span v-for="(persona, index) in propiedad.propietarios" :key="persona.id">
                        {{ nombrePersona(persona) }}<span v-if="index < propiedad.propietarios.length - 1">, </span>
                      </span>
                    </p>
                    <p v-else class="small text-muted mb-0">Sin propietarios asociados</p>
                  </div>
                </div>

                <div class="mt-3">
                  <h3 class="tasacion-repactado-subtitle">
                    <i class="bi bi-card-text me-1"></i>Descripción
                  </h3>
                  <p class="small mb-0 text-break tasacion_obserbaciones_modal">
                    {{ propiedad.descipcion_propiedad || 'La propiedad no tiene una descripción cargada.' }}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div class="col-12 col-xl-5">
            <section class="card tasacion-repactado-media-card">
              <!-- <div class="card-header d-flex align-items-center card-header-tasaciones">
                <i class="bi bi-images me-2"></i>
                <p class="mb-0">Material de la propiedad</p>
              </div> -->
              <div class="card-body p-2">
                <div class="nav nav-tabs tasacion-repactado-media-tabs" role="tablist">
                  <button v-for="tab in mediaTabs" :key="tab.id" type="button" class="nav-link"
                    :class="{ active: pestañaMedia === tab.id }" role="tab" :aria-selected="pestañaMedia === tab.id"
                    @click="pestañaMedia = tab.id">
                    <i :class="tab.icon" class="me-1"></i>{{ tab.label }}
                    <span class="badge text-bg-light ms-1">{{ cantidadMedia(tab.id) }}</span>
                  </button>
                </div>

                <div class="tasacion-repactado-media-content">
                  <div v-if="pestañaMedia === 'fotos'">
                    <div v-if="propiedad.fotos?.length" class="tasacion-repactado-photo">
                      <img :src="urlImagen(propiedad.fotos[indiceFoto]?.url)"
                        :alt="propiedad.fotos[indiceFoto]?.notes || `Foto ${indiceFoto + 1}`">
                      <div class="d-flex align-items-center justify-content-between p-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary" aria-label="Foto anterior"
                          :disabled="propiedad.fotos.length < 2" @click="cambiarFoto(-1)">
                          <i class="bi bi-chevron-left"></i>
                        </button>
                        <span class="small text-muted">{{ indiceFoto + 1 }} / {{ propiedad.fotos.length }}</span>
                        <button type="button" class="btn btn-sm btn-outline-secondary" aria-label="Foto siguiente"
                          :disabled="propiedad.fotos.length < 2" @click="cambiarFoto(1)">
                          <i class="bi bi-chevron-right"></i>
                        </button>
                      </div>
                      <p v-if="propiedad.fotos[indiceFoto]?.notes" class="small text-muted px-2 mb-2">
                        {{ propiedad.fotos[indiceFoto].notes }}
                      </p>
                    </div>
                    <div v-else class="tasacion-repactado-media-empty">
                      <i class="bi bi-camera"></i>Sin fotos cargadas
                    </div>
                  </div>

                  <div v-else-if="pestañaMedia === 'documentos'" class="tasacion-repactado-media-list">
                    <div v-for="documento in propiedad.documentacion || []" :key="documento.id"
                      class="border rounded p-2 mb-2">
                      <embed v-if="esPdf(documento.url)" :src="urlImagen(documento.url)"
                        type="application/pdf" class="w-100" height="250">
                      <a v-else :href="urlImagen(documento.url)" target="_blank" rel="noopener noreferrer"
                        class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-file-earmark-arrow-down me-1"></i>Ver documento
                      </a>
                      <p v-if="documento.notes" class="small text-muted mb-0 mt-1">{{ documento.notes }}</p>
                    </div>
                    <div v-if="!propiedad.documentacion?.length" class="tasacion-repactado-media-empty">
                      <i class="bi bi-file-earmark"></i>Sin documentación cargada
                    </div>
                  </div>

                  <div v-else-if="pestañaMedia === 'videos'" class="tasacion-repactado-media-list">
                    <div v-for="video in propiedad.video || []" :key="video.id" class="border rounded p-2 mb-2">
                      <video :src="urlImagen(video.url)" controls preload="metadata" class="w-100 bg-dark"></video>
                      <p v-if="video.notes" class="small text-muted mb-0 mt-1">{{ video.notes }}</p>
                    </div>
                    <div v-if="!propiedad.video?.length" class="tasacion-repactado-media-empty">
                      <i class="bi bi-camera-video"></i>Sin videos cargados
                    </div>
                  </div>

                  <div v-else class="tasacion-repactado-media-list">
                    <article v-for="nota in propiedad.notas || []" :key="nota.id"
                      class="border rounded p-2 mb-2">
                      <p class="small mb-1">{{ nota.descripcion || 'Sin descripción' }}</p>
                      <span class="small text-muted">{{ nota.fecha }} {{ nota.hora_inicio }}</span>
                    </article>
                    <div v-if="!propiedad.notas?.length" class="tasacion-repactado-media-empty">
                      <i class="bi bi-calendar2-check"></i>Sin muestras programadas
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="col-12">
            <section class="card">
              <div class="card-header d-flex align-items-center card-header-tasaciones">
                <i class="bi bi-cash-coin me-2"></i>
                <p class="mb-0">Nueva tasación</p>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <!-- <div class="col-12 col-md-4 tasacion-repactado-field">
                    <label for="tasacion-venta-repactado" class="form-label">Tasación de venta</label>
                    <div class="input-group">
                      <select v-model="form.monedaVenta" class="form-select flex-grow-0 tasacion-repactado-currency"
                        aria-label="Moneda de tasación de venta">
                        <option value="2">U$S</option>
                        <option value="1">$</option>
                      </select>
                      <input id="tasacion-venta-repactado" v-model="form.tasacionVenta" type="number" min="1" step="1"
                        class="form-control" placeholder="Ingresar valor">
                    </div>
                  </div> -->
                  <div class="col-12 col-md-2 tasacion-repactado-field">
                    <label for="tasacion-alquiler-repactado" class="form-label">Tasación de alquiler</label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text">$</span>
                      <input id="tasacion-alquiler-repactado" v-model="form.tasacionAlquiler" type="number" min="1"
                        step="1" class="form-control form-control-sm" placeholder="Ingresar valor">
                    </div>
                  </div>
                  <div class="col-12 col-md-2 tasacion-repactado-field">
                    <label for="fecha-tasacion-repactado" class="form-label">Fecha de tasación</label>
                    <input id="fecha-tasacion-repactado" v-model="form.fecha" type="date"
                      class="form-control form-control-sm">
                  </div>
                  <div class="col-8 tasacion-repactado-field">
                    <label for="comentario-tasacion-repactado" class="form-label">Observaciones</label>
                    <textarea id="comentario-tasacion-repactado" v-model="form.comentario" rows="2"
                      class="form-control form-control-sm" placeholder="Observaciones opcionales"></textarea>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div v-else class="alert alert-danger mb-0" role="alert">
          No se pudo cargar la ficha de esta propiedad.
        </div>
      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="emit('close')">Cerrar</button>
      <button type="button" class="btn btn-primary btn-sm" :disabled="loading || guardando || !propiedad"
        @click="guardarTasacion">
        <span v-if="guardando" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
        <i v-else class="bi bi-save me-1"></i>
        {{ guardando ? 'Guardando...' : 'Guardar tasación' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { muestraPropiedad } from '@/Services/api/Atcl/AtclApi'
import { guardarTasacionRepactado as guardarTasacionApi } from '@/Services/api/Contrato/Repactado'
import { urlImagen } from '@/utils/urlImagenes'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  show: { type: Boolean, default: false },
  repactado: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])
const { showError, showSuccess, handleApiError } = useToast()

const propiedad = ref(null)
const loading = ref(false)
const guardando = ref(false)
const pestañaMedia = ref('fotos')
const indiceFoto = ref(0)
const hoy = new Date().toISOString().slice(0, 10)
const form = reactive({
  tasacionVenta: '',
  monedaVenta: '2',
  tasacionAlquiler: '',
  fecha: hoy,
  comentario: '',
})

const direccion = computed(() => {
  const partes = [
    propiedad.value?.calle?.name,
    propiedad.value?.numero_calle,
    propiedad.value?.piso ? `Piso ${propiedad.value.piso}` : null,
    propiedad.value?.departamento ? `Dto. ${propiedad.value.departamento}` : null,
  ].filter(Boolean)

  return partes.join(' ')
})

const mediaTabs = [
  { id: 'fotos', label: 'Fotos', icon: 'bi bi-image' },
  { id: 'documentos', label: 'Docs', icon: 'bi bi-file-earmark-text' },
  { id: 'videos', label: 'Videos', icon: 'bi bi-camera-video' },
  { id: 'muestras', label: 'Muestras', icon: 'bi bi-calendar2' },
]

const cantidadMedia = (tipo) => {
  if (tipo === 'fotos') return propiedad.value?.fotos?.length || 0
  if (tipo === 'documentos') return propiedad.value?.documentacion?.length || 0
  if (tipo === 'videos') return propiedad.value?.video?.length || 0
  return propiedad.value?.notas?.length || 0
}

const nombrePersona = (persona) => [persona.nombre, persona.apellido].filter(Boolean).join(' ') || 'Propietario'

const esPdf = (ruta) => String(ruta || '').toLowerCase().split('?')[0].endsWith('.pdf')

const cargarPropiedad = async () => {
  if (!props.show || !props.repactado) return

  if (!props.repactado.propiedadId) {
    showError('El repactado no contiene el identificador de la propiedad.')
    propiedad.value = null
    return
  }

  loading.value = true
  propiedad.value = null
  pestañaMedia.value = 'fotos'
  indiceFoto.value = 0

  try {
    const { data } = await muestraPropiedad({ id: props.repactado.propiedadId })
    propiedad.value = data.data

    const tasaciones = propiedad.value?.tasaciones || []
    const ultimaTasacion = tasaciones.reduce(
      (ultima, actual) => (!ultima || Number(actual.id) > Number(ultima.id) ? actual : ultima),
      null
    )

    form.tasacionVenta = ultimaTasacion?.tasacion_dolar_venta
      ?? ultimaTasacion?.tasacion_pesos_venta
      ?? ''
    form.monedaVenta = ultimaTasacion?.tasacion_dolar_venta !== null
      && ultimaTasacion?.tasacion_dolar_venta !== undefined
      ? '2'
      : '1'
    form.tasacionAlquiler = ultimaTasacion?.tasacion_pesos_alquiler ?? ''
    form.fecha = ultimaTasacion?.fecha_tasacion || hoy
    form.comentario = ultimaTasacion?.comentario_tasacion || ''
  } catch (error) {
    handleApiError(error)
  } finally {
    loading.value = false
  }
}

const cambiarFoto = (desplazamiento) => {
  const cantidad = propiedad.value?.fotos?.length || 0
  if (!cantidad) return
  indiceFoto.value = (indiceFoto.value + desplazamiento + cantidad) % cantidad
}

const guardarTasacion = async () => {
  if (!form.tasacionVenta && !form.tasacionAlquiler) {
    showError('Ingresá un valor de venta o de alquiler para guardar la tasación.')
    return
  }

  if (!form.fecha) {
    showError('Ingresá la fecha de tasación.')
    return
  }

  guardando.value = true

  try {
    await guardarTasacionApi({
      id_empresa_propiedad: props.repactado.empresaPropiedadId,
      id_historial_estado_repactado: props.repactado.id,
      tasacion_venta: form.tasacionVenta || null,
      moneda_venta: form.tasacionVenta ? form.monedaVenta : null,
      tasacion_alquiler: form.tasacionAlquiler || null,
      fecha_tasacion: form.fecha,
      comentario_tasacion: form.comentario || null,
    })
    showSuccess('Tasación guardada correctamente.')
    emit('saved')
    emit('close')
  } catch (error) {
    handleApiError(error)
  } finally {
    guardando.value = false
  }
}

watch(
  () => [props.show, props.repactado?.id],
  ([show]) => {
    if (show) cargarPropiedad()
  },
  { immediate: true }
)
</script>
