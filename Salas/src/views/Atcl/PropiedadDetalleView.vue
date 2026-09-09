<template>
  <!-- 1. CONTENEDOR PADRE AL 100% DE ALTO (vh-100) Y SIN SCROLL GLOBAL (overflow-hidden) -->
  <div class="d-flex flex-column vh-100 overflow-hidden bg-white">

    <NavComponent titulo="Detalle de Propiedad"></NavComponent>

    <!-- 2. CONTENEDOR PRINCIPAL QUE ABSORBE EL ESPACIO RESTANTE (flex-grow-1) -->
    <div class="container-fluid px-3 py-2 d-flex flex-column flex-grow-1 overflow-hidden">

      <!-- SPINNER DE CARGA -->
      <div v-if="loading" class="d-flex flex-column justify-content-center align-items-center flex-grow-1">
        <div class="spinner-border text-primary mb-2" style="width: 2.5rem; height: 2.5rem;" role="status"></div>
        <h6 class="text-muted fw-bold">Cargando datos...</h6>
      </div>

      <!-- 3. FILA QUE SE EXPANDE (flex-grow-1) -->
      <div v-else class="row flex-grow-1 overflow-hidden m-0">

        <!-- ========================================== -->
        <!-- COLUMNA IZQUIERDA: DETALLES (h-100 con scroll interno) -->
        <!-- ========================================== -->
        <div class="col-lg-7 h-100 overflow-auto pe-lg-3 pb-3 custom-scrollbar border-end form-group">

          <!-- ENCABEZADO ÚNICO COMPACTO -->
          <div class="d-flex justify-content-between align-items-center border-bottom pb-1 mb-2 mt-1">
            <h6 class="fw-bold text-primary mb-0 small text-uppercase">
              <i class="bi bi-info-square-fill"></i> Ficha de la Propiedad
            </h6>
          </div>

          <!-- FILA 1: GEOGRAFÍA E INMUEBLE -->
          <div class="row g-1 mb-1">
            <div class="col-md-3">
              <label class="form-label compact-label text-muted">Provincia</label>
              <input type="text" class="form-control compact-input bg-light" readonly
                :value="propiedad?.provincia?.name">
            </div>
            <div class="col-md-3">
              <label class="form-label compact-label text-muted">Localidad</label>
              <input type="text" class="form-control compact-input bg-light" readonly
                :value="propiedad?.localidad?.name || '- - -'">
            </div>
            <div class="col-md-3">
              <label class="form-label compact-label text-muted">Zona</label>
              <input type="text" class="form-control compact-input bg-light" readonly :value="propiedad?.zona?.name">
            </div>
            <div class="col-md-3">
              <label class="form-label compact-label text-muted">Inmueble</label>
              <input type="text" class="form-control compact-input bg-light" readonly
                :value="propiedad?.tipo_inmueble?.inmueble">
            </div>
          </div>

          <!-- FILA 2: DIRECCIÓN EXACTA -->
          <div class="row g-1 mb-1">
            <div class="col-md-5">
              <label class="form-label compact-label text-muted">Calle</label>
              <input type="text" class="form-control compact-input bg-light" readonly :value="propiedad?.calle?.name">
            </div>
            <div class="col-md-2">
              <label class="form-label compact-label text-muted">N°</label>
              <input type="text" class="form-control compact-input bg-light text-center" readonly
                :value="propiedad?.numero_calle">
            </div>
            <div class="col-md-2">
              <label class="form-label compact-label text-muted">Piso</label>
              <input type="text" class="form-control compact-input bg-light text-center" readonly
                :value="propiedad?.piso">
            </div>
            <div class="col-md-1">
              <label class="form-label compact-label text-muted">Dto</label>
              <input type="text" class="form-control compact-input bg-light text-center" readonly
                :value="propiedad?.departamento">
            </div>
            <div class="col-md-2">
              <label class="form-label compact-label text-muted">PH</label>
              <input type="text" class="form-control compact-input bg-light text-center" readonly
                :value="propiedad?.ph">
            </div>
          </div>


          <!-- PANEL DE CONTROL (MODALES) -->
          <h6 class="fw-bold text-primary border-bottom pb-1 mb-2 mt-3 small text-uppercase">
            <i class="bi bi-ui-checks-grid"></i> Gestión
          </h6>

          <div class="row g-1 mb-2">
            <div class="col-3">
              <button class="btn btn-primary w-100 compact-btn shadow-sm" data-bs-toggle="modal"
                data-bs-target="#modalComodidades">Comodidades</button>
            </div>
            <div class="col-3">
              <button class="btn btn-primary w-100 compact-btn shadow-sm"
                @click="abrirDescripcionModal">Descripción</button>
            </div>
            <div class="col-3">
              <button class="btn btn-primary w-100 compact-btn shadow-sm" @click="showModalPropietarios = true"
                :disabled="!botones?.propietario">Propietarios</button>
            </div>
            <div class="col-3">
              <button class="btn btn-primary w-100 compact-btn shadow-sm" @click="descargarFotos">
                <i class="bi bi-download"></i> Descargar Multi.
              </button>
            </div>
          </div>

          <div class="row g-1 mb-3">
            <div class="col-3">
              <button type="button" class="btn w-100 compact-btn shadow-sm"
                :class="propiedad?.comentario_llave ? 'btn-danger text-white' : 'btn-outline-secondary bg-white'"
                data-bs-toggle="popover" data-bs-placement="top" :data-bs-content="comentarioLlave">
                <i class="bi bi-key"></i> Llave: <strong>{{ llaveDisplay }}</strong>
              </button>
          </div>
          <div class="col-3">
            <button type="button" class="btn w-100 compact-btn shadow-sm"
              :class="propiedad?.comentario_cartel ? 'btn-danger text-white' : 'btn-outline-secondary bg-white'"
              data-bs-toggle="popover" data-bs-placement="top" :data-bs-content="comentarioCartel">
              <i class="bi bi-signpost-2"></i> Cartel: <strong>{{ cartelDisplay }}</strong>
            </button>
          </div>
          <div class="col-3">
            <button class="btn btn-secondary w-100 compact-btn shadow-sm" @click="abrirImpuestoModal">Impuestos</button>
          </div>
          <div class="col-3">
            <button class="btn btn-secondary w-100 compact-btn shadow-sm" @click="modificarDatosPropiedad"
              :disabled="!botones?.modificar">
              <i class="bi bi-pencil-square"></i> Modificar Ficha
            </button>
          </div>
        </div>

        <!-- ACCIONES FINALES -->
        <div class="mt-4 pt-3 border-top">
          <!-- BOTONES DE VENTA Y ALQUILER -->

          <div class="row g-3 mb-4">

            <!-- Tarjeta Venta -->
            <div class="col-md-6">
              <div
                class="d-flex justify-content-between align-items-center p-3 rounded-3 border border-primary border-opacity-25 bg-primary bg-opacity-10 shadow-sm h-100 transition-hover">
                <div>
                  <span class="d-block fw-bold text-primary mb-1"
                    style="font-size: 0.7rem; letter-spacing: 0.5px;">CÓDIGO VENTA</span>
                  <span class="fs-5 fw-bolder text-dark" style="letter-spacing: 1px;">{{ propiedad?.cod_venta || 'S/C'
                  }}</span>
                </div>
                <button class="btn btn-primary btn-sm fw-bold shadow-sm px-3 rounded-pill" data-bs-toggle="modal"
                  data-bs-target="#modalVentas" :disabled="!botones?.informacion_venta">
                  <i class="bi bi-cash-coin me-1"></i> Info
                </button>
              </div>
            </div>

            <!-- Tarjeta Alquiler -->
            <div class="col-md-6">
              <div
                class="d-flex justify-content-between align-items-center p-3 rounded-3 border border-success border-opacity-25 bg-success bg-opacity-10 shadow-sm h-100 transition-hover">
                <div>
                  <span class="d-block fw-bold text-success mb-1"
                    style="font-size: 0.7rem; letter-spacing: 0.5px;">CÓDIGO ALQUILER</span>
                  <span class="fs-5 fw-bolder text-dark" style="letter-spacing: 1px;">{{ propiedad?.cod_alquiler ||
                    'S/C' }}</span>
                </div>
                <button class="btn btn-success btn-sm fw-bold shadow-sm px-3 rounded-pill text-white"
                  data-bs-toggle="modal" data-bs-target="#modalAlquiler" :disabled="!botones?.informacion_alquiler">
                  <i class="bi bi-house-door me-1"></i> Info
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- ========================================== -->
      <!-- COLUMNA DERECHA: MULTIMEDIA (Se adapta a h-100) -->
      <!-- ========================================== -->
      <div class="col-lg-5 h-100 d-flex flex-column ps-lg-3 mt-3 mt-lg-0 pb-3">

        <!-- 4. CARD QUE SE ESTIRA HASTA ABAJO -->
        <div class="card shadow-sm border-0 flex-grow-1 d-flex flex-column overflow-hidden">

          <div class="card-header bg-white border-bottom p-0 flex-shrink-0">
            <ul class="nav nav-tabs card-header-tabs m-0 compact-label" id="mediaTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <a class="nav-link active fw-bold px-3 py-2" id="fotos-tab" data-bs-toggle="tab" href="#fotos"
                  role="tab">📷 Fotos</a>
              </li>
              <li class="nav-item" role="presentation">
                <a class="nav-link fw-bold px-3 py-2" id="documentos-tab" data-bs-toggle="tab" href="#documentos"
                  role="tab">📄 Docs</a>
              </li>
              <li class="nav-item" role="presentation">
                <a class="nav-link fw-bold px-3 py-2" id="videos-tab" data-bs-toggle="tab" href="#videos" role="tab">🎥
                  Videos</a>
              </li>
            </ul>
          </div>

          <div class="card-body bg-light p-2 d-flex flex-column overflow-hidden">
            <div class="tab-content flex-grow-1 overflow-hidden" id="mediaTabContent">

              <!-- ===================================== -->
              <!-- TABS DE FOTOS -->
              <!-- ===================================== -->
              <div class="tab-pane fade show active" id="fotos" role="tabpanel">
                <div v-if="propiedad?.fotos?.length" id="carouselFotos" class="carousel slide h-100 w-100"
                  data-bs-ride="carousel">
                  <div class="carousel-inner h-100 w-100 rounded shadow-sm bg-dark">

                    <div v-for="(foto, index) in propiedad.fotos" :key="index" class="carousel-item h-100 w-100"
                      :class="{ 'active': index === 0 }">
                      <div class="d-flex flex-column h-100 w-100">
                        <div class="flex-grow-1 position-relative overflow-hidden" style="cursor: pointer;"
                          @click="openModal(index)">
                          <img :src="'http://10.10.10.191' + foto.url"
                            class="position-absolute top-0 start-0 w-100 h-100" style="object-fit: cover;" />
                        </div>
                        <div class="p-2 bg-white flex-shrink-0 border-top z-3">
                          <input type="text" class="form-control compact-input bg-light text-muted"
                            :value="foto.notes ? foto.notes : 'Sin comentarios en esta foto'" readonly disabled>
                        </div>
                      </div>
                    </div>

                  </div>

                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselFotos"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselFotos"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                </div>

                <div v-else class="h-100 d-flex align-items-center justify-content-center text-muted">
                  <i class="bi bi-camera-fill fs-3 me-2"></i> Sin Fotos
                </div>
              </div>

              <!-- ===================================== -->
              <!-- TABS DE DOCUMENTOS -->
              <!-- ===================================== -->
              <div class="tab-pane fade" id="documentos" role="tabpanel">
                <!-- Aquí está la magia: w-100, h-100 y overflow-auto para el scroll -->
                <div v-if="propiedad?.documentacion?.length"
                  class="list-group h-100 w-100 overflow-auto custom-scrollbar pe-2 pb-2">
                  <div v-for="(documento, index) in propiedad.documentacion" :key="index"
                    class="list-group-item p-0 mb-3 border-0 shadow-sm rounded flex-shrink-0">
                    <embed :src="'http://10.10.10.191' + documento.url" type="application/pdf" class="w-100 rounded-top"
                      height="300px">
                    <div class="p-1 bg-white rounded-bottom" v-if="documento.notes">
                      <input type="text" class="form-control compact-input text-muted border-0" :value="documento.notes"
                        readonly>
                    </div>
                  </div>
                </div>

                <div v-else class="h-100 d-flex align-items-center justify-content-center text-muted">
                  <i class="bi bi-file-earmark-x-fill fs-3 me-2"></i> Sin Documentos
                </div>
              </div>

              <!-- ===================================== -->
              <!-- TABS DE VIDEOS -->
              <!-- ===================================== -->
              <div class="tab-pane fade" id="videos" role="tabpanel">
                <div v-if="propiedad?.video?.length"
                  class="list-group h-100 w-100 overflow-auto custom-scrollbar pe-2 pb-2">
                  <div v-for="(video, index) in propiedad.video" :key="index"
                    class="list-group-item p-0 mb-3 border-0 shadow-sm rounded flex-shrink-0">
                    <video controls class="w-100 rounded-top bg-dark">
                      <source :src="'http://10.10.10.191' + video.url" type="video/mp4">
                    </video>
                    <div class="p-1 bg-white rounded-bottom" v-if="video.notes">
                      <input type="text" class="form-control compact-input text-muted border-0" :value="video.notes"
                        readonly>
                    </div>
                  </div>
                </div>

                <div v-else class="h-100 d-flex align-items-center justify-content-center text-muted">
                  <i class="bi bi-camera-video-off-fill fs-3 me-2"></i> Sin Videos
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- MODALES EXISTENTES -->
  <ModalPropiedadComodidades :propiedad="propiedad" />
  <ModalPropiedadDescripcion :propiedad="propiedad" :show="showDescripcionModal" @close="cerrarDescripcionModal" />
  <ModalImpuestoPropiedad :propiedad="propiedad" :show="showImpuestoModal" @close="cerrarImpuestoModal" />
  <ModalPropiedadVenta :propiedad="propiedad" />
  <ModalPropiedadAlquiler :propiedad="propiedad" />
  <ModalCondicionAlquiler :propiedad="propiedad" />
  <ModalPropiedadPropietario :propiedad="propiedad" :mostrar-buscador="false" :ocultar-botones="true"
    :show="showModalPropietarios" @close="showModalPropietarios = false" />
  <ModalImagenesPropiedad :propiedad="propiedad" :fotos="propiedad?.fotos" :index="modalIndex" :show="showModal"
    @close="showModal = false" />
</template>

<script>
import NavComponent from '../../components/NavComponent.vue'
import { muestraPropiedad, descargarFotos } from '../../Services/api/Atcl/AtclApi'

import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalImpuestoPropiedad from '../../components/Atcl/Propiedad/ModalImpuestoPropiedad.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
import ModalCondicionAlquiler from '../../components/Atcl/Propiedad/ModalCondicionAlquiler.vue'
import ModalPropiedadPropietario from '../../components/Atcl/Propiedad/ModalPropiedadPropietario.vue'
import ModalImagenesPropiedad from '../../components/Atcl/Propiedad/ModalImagenesPropiedad.vue'

export default {
  components: {
    NavComponent,
    ModalPropiedadComodidades,
    ModalPropiedadDescripcion,
    ModalPropiedadVenta,
    ModalPropiedadAlquiler,
    ModalCondicionAlquiler,
    ModalPropiedadPropietario,
    ModalImagenesPropiedad,
    ModalImpuestoPropiedad
  },
  data() {
    return {
      showModalPropietarios: false,
      propiedad: null,
      loading: true,
      error: null,
      botones: null,
      showDescripcionModal: false,
      showImpuestoModal: false,
      showModal: false,
      modalIndex: 0,
      popovers: []
    }
  },
  computed: {
    llaveDisplay() { return this.propiedad?.llave },
    cartelDisplay() { return this.propiedad?.cartel || 'NO' },
    comentarioLlave() { return this.propiedad?.comentario_llave || 'Sin comentario' },
    comentarioCartel() { return this.propiedad?.comentario_cartel || 'Sin comentario' }
  },
  async mounted() {
    await this.mostrarPropiedad()
    this.$nextTick(() => { this.initPopovers() })
  },
  beforeUnmount() {
    this.destroyPopovers()
  },
  methods: {
    initPopovers() {
      const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      this.popovers = popoverTriggerList.map((popoverTriggerEl) => {
        return new window.bootstrap.Popover(popoverTriggerEl, { trigger: 'focus', container: 'body' })
      })
    },
    destroyPopovers() {
      if (Array.isArray(this.popovers)) {
        this.popovers.forEach((p) => { if (p && typeof p.dispose === 'function') p.dispose() })
        this.popovers = []
      }
    },
    abrirDescripcionModal() { this.showDescripcionModal = true },
    cerrarDescripcionModal() { this.showDescripcionModal = false },
    abrirImpuestoModal() { this.showImpuestoModal = true },
    cerrarImpuestoModal() { this.showImpuestoModal = false },

    // AÑADE ESTA FUNCIÓN AQUÍ:
    openModal(index) {
      this.modalIndex = index;
      this.showModal = true;
    },

    async mostrarPropiedad() {
      try {
        const id = this.$route.params.id
        const response = await muestraPropiedad({ id: id })
        this.propiedad = response.data.data
        this.botones = response.data.botones
      } catch (error) {
        console.error(error)
        this.error = 'Error'
      } finally {
        this.loading = false
      }
    },

    modificarDatosPropiedad() {
      const id = this.$route.params.id
      this.$router.push(`/propiedad-update/${id}`)
    },

    async descargarFotos() {
      const id = this.$route.params.id
      try {
        const response = await descargarFotos(id)
        const blob = new Blob([response.data], { type: 'application/zip' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${this.propiedad.calle.name}-${this.propiedad.numero_calle}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
/* ESTILOS DE DENSIDAD DE PANTALLA Y SCROLLS */

input[readonly] {
  pointer-events: none;
}

/* Micro-tipografía y márgenes para los labels */
.compact-label {
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.1rem;
  letter-spacing: 0.2px;
}

/* Reducimos el alto, el padding y la fuente de los inputs */
.compact-input {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  min-height: 28px;
  height: 28px;
}

/* Reducimos el alto y padding de los botones */
.compact-btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  min-height: 28px;
}

/* ESTILIZACIÓN DEL SCROLLBAR (Para que no quede tosco en Windows) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* FORZAR FLEXBOX EN LOS TABS DE BOOTSTRAP */
#mediaTabContent {
  display: flex;
  flex-direction: column;
}

#mediaTabContent>.tab-pane {
  display: none !important;
  /* Oculta totalmente las inactivas */
  height: 100%;
}

#mediaTabContent>.tab-pane.active {
  display: flex !important;
  /* Expande la activa */
  flex-direction: column;
  flex-grow: 1;
}
</style>