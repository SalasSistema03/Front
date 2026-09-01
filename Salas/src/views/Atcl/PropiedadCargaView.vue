<template>
  <NavComponent titulo="Propiedad Carga"></NavComponent>

  <!-- Reducimos el padding vertical general (py-1) -->
  <div class="container-fluid px-3 py-1">

    <!-- PANTALLA DE CARGA -->
    <div v-if="isLoadingData" class="d-flex flex-column justify-content-center align-items-center"
      style="min-height: 60vh;">
      <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
      <h5 class="text-muted fw-bold">Preparando entorno de carga...</h5>
    </div>

    <form v-else @submit.prevent="handleSubmit" autocomplete="off" novalidate>
      <div class="row">

        <!-- ========================================== -->
        <!-- COLUMNA IZQUIERDA: FORMULARIO (7 Columnas) -->
        <!-- ========================================== -->
        <div class="col-lg-7 border-end pe-lg-3">

          <!-- BLOQUE 1: UBICACIÓN -->
          <h6 class="fw-bold text-primary border-bottom pb-1 mb-2 small text-uppercase">
            <i class="bi bi-geo-alt-fill"></i> Ubicación
          </h6>

          <div class="row g-2 mb-2 form-group">
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-0">Provincia</label>
              <select class="form-select form-select-sm shadow-sm" v-model="formData.provincia_id"
                @change="validarUbicacion">
                <option value="">Seleccione</option>
                <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">{{ provincia.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-0">Localidad</label>
              <select class="form-select form-select-sm shadow-sm" v-model="formData.localidad_id"
                @change="validarUbicacion">
                <option value="">Seleccione</option>
                <option v-for="loc in localidades" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-0">Zona</label>
              <select class="form-select form-select-sm shadow-sm" v-model="formData.zona_id">
                <option value="">Seleccione</option>
                <option v-for="zona in zonas" :key="zona.id" :value="zona.id">{{ zona.name }}</option>
              </select>
            </div>
          </div>

          <div class="row g-2 mb-3 form-group">
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-0">Calle <span class="text-danger">*</span></label>
              <div class="position-relative">
                <input type="text" class="form-control form-control-sm shadow-sm" placeholder="Buscar calle..."
                  v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarLista" @blur="ocultarSugerencias">
                <ul v-if="mostrarSugerencias && callesFiltradas.length"
                  class="position-absolute w-100 list-unstyled bg-white border shadow-sm busqueda-select"
                  style="z-index: 1050; max-height: 150px; overflow-y: auto;">
                  <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalleYValidar(calle)"
                    class="px-2 py-1 cursor-pointer hover:bg-light small">{{ calle.name }}</li>
                </ul>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold mb-0">Altura</label>
              <input type="number" class="form-control form-control-sm shadow-sm" placeholder="Ej: 3108"
                v-model="formData.altura" @blur="validarUbicacion">
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold mb-0">Piso</label>
              <input type="number" class="form-control form-control-sm shadow-sm" placeholder="Piso"
                v-model="formData.piso">
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold mb-0">Dto</label>
              <input type="text" class="form-control form-control-sm shadow-sm" placeholder="Dto"
                v-model="formData.dto">
            </div>
          </div>

          <!-- BLOQUE 2: DETALLES OPERATIVOS -->
          <h6 class="fw-bold text-primary border-bottom pb-1 mb-2 small text-uppercase">
            <i class="bi bi-house-door-fill"></i> Características
          </h6>

          <div class="row g-2 mb-2 form-group">
            <div class="col-md-4">
              <label class="form-label small fw-bold mb-0">Inmueble</label>
              <select class="form-select form-select-sm shadow-sm" v-model="formData.inmueble_id">
                <option value="">Seleccione</option>
                <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">{{ inmueble.inmueble }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold mb-0">PH</label>
              <select class="form-select form-select-sm shadow-sm" v-model="formData.ph">
                <option value="NO">No</option>
                <option value="SI">Si</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold mb-0">Cod. Llave</label>
              <input type="number" class="form-control form-control-sm shadow-sm" placeholder="Nro"
                v-model="formData.llave">
            </div>
            <div class="col-md-3">
              <label class="form-label small fw-bold mb-0">Cartel</label>
              <select class="form-select form-select-sm shadow-sm" v-model="formData.cartel">
                <option value="NO">NO</option>
                <option value="SI">SI</option>
                <option value="PENDIENTE">PENDIENTE</option>
              </select>
            </div>
          </div>

          <!-- Convertimos los Textareas a Inputs para ahorrar altura vertical -->
          <div class="row g-2 mb-3 form-group">
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-0">Llaves</label>
              <input type="text" class="form-control form-control-sm shadow-sm" placeholder="Observaciones de Llaves..."
                v-model="formData.observaciones_llaves">
            </div>
            <div class="col-md-6">
              <label class="form-label small fw-bold mb-0">Cartel</label>
              <input type="text" class="form-control form-control-sm shadow-sm" placeholder="Observaciones de Cartel..."
                v-model="formData.observaciones_cartel">
            </div>
          </div>

          <!-- BLOQUE 3: MODALES -->
          <h6 class="fw-bold text-primary border-bottom pb-1 mb-2 small text-uppercase">
            <i class="bi bi-ui-checks-grid"></i> Datos Complementarios
          </h6>

          <!-- Botones compactados con Flexbox -->
          <div class="d-flex flex-wrap gap-2 mb-2 form-group">
            <button type="button" class="btn btn-primary btn-sm flex-grow-1  shadow-sm" data-bs-toggle="modal"
              data-bs-target="#modalComodidades">
              <i class="bi bi-rulers"></i> Comodidades
            </button>
            <button type="button" class="btn btn-primary btn-sm flex-grow-1  shadow-sm" data-bs-toggle="modal"
              data-bs-target="#modalDescripcion">
              <i class="bi bi-card-text"></i> Descripción
            </button>
            <button type="button" class="btn btn-primary btn-sm flex-grow-1 shadow-sm" data-bs-toggle="modal"
              data-bs-target="#modalPropietarios">
              <i class="bi bi-person-badge"></i> Propietario
            </button>
          </div>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <button type="button" class="btn btn-secondary btn-sm flex-grow-1  shadow-sm" data-bs-toggle="modal"
              data-bs-target="#modalVentas">
              <i class="bi bi-cash-coin"></i> Datos Venta
            </button>
            <button type="button" class="btn btn-secondary btn-sm flex-grow-1  shadow-sm" data-bs-toggle="modal"
              data-bs-target="#modalAlquiler">
              <i class="bi bi-house-add"></i> Datos Alquiler
            </button>
          </div>

          <!-- BOTÓN FINAL -->
          <div class="mt-2 pt-2 border-top">
            <button type="submit" class="btn btn-primary w-100 fw-bold shadow" :disabled="isSubmitting">
              <i class="bi" :class="isSubmitting ? 'bi-hourglass-split' : 'bi-cloud-arrow-up-fill'"></i>
              {{ isSubmitting ? ' Procesando...' : 'Guardar Propiedad' }}
            </button>
          </div>

        </div>

        <!-- ========================================== -->
        <!-- COLUMNA DERECHA: MULTIMEDIA (5 Columnas)   -->
        <!-- ========================================== -->
        <div class="col-lg-5 ps-lg-3 mt-3 mt-lg-0">
          <h6 class="fw-bold text-primary border-bottom pb-1 mb-2 small text-uppercase">
            <i class="bi bi-images"></i> Multimedia
          </h6>

          <div class="form-group mb-2">
            <input type="file" multiple class="form-control form-control-sm shadow-sm"
              accept="image/jpg,image/jpeg,video/mov,video/mp4,video/MOV,application/pdf" @change="handleFiles"
              ref="fileInput" />
            <small class="text-muted" style="font-size: 0.75rem;">JPG, JPEG, MP4, MOV, PDF.</small>
          </div>

          <!-- PREVISUALIZACIÓN CON TABS -->
          <div class="card shadow-sm border-0" v-if="hasFiles">
            <div class="card-header bg-white border-bottom p-0">
              <ul class="nav nav-tabs card-header-tabs m-0 small">
                <li class="nav-item" v-if="images.length">
                  <a class="nav-link fw-bold px-3 py-1" :class="{ active: activeTab === 'images' }"
                    @click.prevent="activeTab = 'images'" href="#">📷 ({{ images.length }})</a>
                </li>
                <li class="nav-item" v-if="videos.length">
                  <a class="nav-link fw-bold px-3 py-1" :class="{ active: activeTab === 'videos' }"
                    @click.prevent="activeTab = 'videos'" href="#">🎥 ({{ videos.length }})</a>
                </li>
                <li class="nav-item" v-if="pdfs.length">
                  <a class="nav-link fw-bold px-3 py-1" :class="{ active: activeTab === 'pdfs' }"
                    @click.prevent="activeTab = 'pdfs'" href="#">📄 ({{ pdfs.length }})</a>
                </li>
              </ul>
            </div>

            <!-- Reducimos el padding interno del card-body a p-2 -->
            <div class="card-body bg-light p-2">

              <!-- CARRUSEL IMÁGENES -->
              <div v-if="activeTab === 'images' && images.length">
                <div id="carouselImages" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner rounded">
                    <div v-for="(img, index) in images" :key="index" class="carousel-item"
                      :class="{ active: index === 0 }">
                      <!-- Reducimos la altura a 220px -->
                      <img :src="img.url" class="d-block w-100 shadow-sm" style="height: 220px; object-fit: cover;" />
                      <input class="form-control form-control-sm mt-2 shadow-sm" placeholder="Comentario..."
                        v-model="img.comment" />
                    </div>
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselImages"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselImages"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                </div>
              </div>

              <!-- CARRUSEL VIDEOS -->
              <div v-if="activeTab === 'videos' && videos.length">
                <div id="carouselVideos" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner rounded">
                    <div v-for="(vid, index) in videos" :key="index" class="carousel-item"
                      :class="{ active: index === 0 }">
                      <video controls class="d-block w-100 shadow-sm" style="height: 220px; object-fit: cover;">
                        <source :src="vid.url" />
                      </video>
                      <input class="form-control form-control-sm mt-2 shadow-sm" placeholder="Comentario..."
                        v-model="vid.comment" />
                    </div>
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselVideos"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselVideos"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                </div>
              </div>

              <!-- CARRUSEL PDF -->
              <div v-if="activeTab === 'pdfs' && pdfs.length">
                <div id="carouselPDF" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner rounded">
                    <div v-for="(pdf, index) in pdfs" :key="index" class="carousel-item"
                      :class="{ active: index === 0 }">
                      <iframe :src="pdf.url" class="w-100 shadow-sm" style="height: 220px;"></iframe>
                      <input class="form-control form-control-sm mt-2 shadow-sm" placeholder="Comentario..."
                        v-model="pdf.comment" />
                    </div>
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselPDF"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#carouselPDF"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon bg-dark rounded-circle p-1"
                      style="width: 1.5rem; height: 1.5rem;"></span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- INCLUSIÓN DE LOS MODALES EXTERNOS (Se mantienen igual) -->
      <ModalPropiedadComodidades :estados-generales="estadosGenerales"
        @update:comodidades="formData.comodidades = $event"></ModalPropiedadComodidades>
      <ModalPropiedadDescripcion @update:descripcion="formData.descripcion = $event"></ModalPropiedadDescripcion>
      <ModalPropiedadVenta :estados-venta="estadosVenta" :captadores-internos="captadoresInternos" :asesores="asesores"
        @update:venta="formData.venta = $event"></ModalPropiedadVenta>
      <ModalPropiedadAlquiler :estados-alquiler="estadosAlquiler" :captadores-internos="captadoresInternos"
        @update:alquiler="formData.alquiler = $event"></ModalPropiedadAlquiler>
      <ModalCondicionAlquiler @update:condicion_alquiler="formData.condicion_alquiler = $event">
      </ModalCondicionAlquiler>
      <ModalPropiedadPropietario @propietarios-cambiados="handlePropietariosUpdate" :mostrar-buscador="true">
      </ModalPropiedadPropietario>
    </form>
  </div>

  <!-- MODAL DE VALIDACIÓN DE DUPLICADOS (Se mantiene tu código exacto) -->
  <div class="modal fade" tabindex="-1" :class="{ 'show d-block': mostrarModalDuplicados }"
    v-if="mostrarModalDuplicados" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-lg border-0">
        <div
          :class="['modal-header text-white', duplicados.status === 'exact_match' ? 'bg-danger' : 'bg-warning text-dark']">
          <h5 class="modal-title fw-bold">
            <i
              :class="duplicados.status === 'exact_match' ? 'bi bi-x-circle-fill' : 'bi bi-exclamation-triangle-fill'"></i>
            {{ duplicados.status === 'exact_match' ? '¡Propiedad Exacta Encontrada!' : 'Atención: Propiedades Cercanas'
            }}
          </h5>
          <button type="button" class="btn-close" :class="{ 'btn-close-white': duplicados.status === 'exact_match' }"
            @click="cerrarModalDuplicados"></button>
        </div>
        <div class="modal-body bg-light">
          <p class="mb-3 fw-semibold text-muted">{{ duplicados.mensaje }}</p>
          <div class="list-group shadow-sm">
            <div v-for="prop in duplicados.propiedades" :key="prop.id"
              class="list-group-item list-group-item-action p-3">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="fw-bold mb-1 text-primary">
                    {{ prop.calle?.name }} {{ prop.numero_calle }} {{ prop.departamento ? '- Depto ' + prop.departamento
                      : '' }}
                  </h6>
                  <p class="mb-0 small text-muted">
                    <strong>{{ prop.tipo_inmueble ? prop.tipo_inmueble.inmueble : 'Propiedad' }}</strong> |
                    <span v-if="prop.cod_alquiler" class="text-success fw-bold me-2">Alq: {{ prop.cod_alquiler }}</span>
                    <span v-if="prop.cod_venta" class="text-primary fw-bold">Vta: {{ prop.cod_venta }}</span>
                  </p>
                </div>
                <div>
                  <a :href="'/propiedad-detalle/' + prop.id" target="_blank"
                    class="btn btn-sm btn-outline-primary fw-bold px-3">
                    <i class="bi bi-eye-fill"></i> Ver Ficha
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm fw-bold" @click="cerrarModalDuplicados">
            {{ duplicados.status === 'exact_match' ? 'Cerrar y corregir' : 'Ignorar y continuar carga' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL MAPA (Se mantiene tu código exacto) -->
  <div class="modal fade" tabindex="-1" :class="{ 'show d-block': mostrarModalMapa }" v-if="mostrarModalMapa"
    style="background-color: rgba(0,0,0,0.6); z-index: 1060;">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-lg border-0">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title fw-bold"><i class="bi bi-geo-alt-fill"></i> Confirmar Ubicación en el Mapa</h5>
          <button type="button" class="btn-close btn-close-white" @click="cerrarModalMapa"></button>
        </div>
        <div class="modal-body p-0 position-relative">
          <!-- Contenedor flex para alinear instrucción y botón -->
          <div
            class="p-3 bg-light border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
            <p class="mb-0 text-dark fw-semibold small">
              <i class="bi bi-info-circle text-primary"></i>
              Arrastrá el marcador rojo hasta la ubicación exacta.
            </p>
            <!-- El botón de Google Maps (Usa la variable computada) -->
            <a :href="enlaceGoogleMaps" target="_blank"
              class="btn btn-sm btn-outline-danger fw-bold shadow-sm px-3 text-nowrap">
              <i class="bi bi-geo-alt"></i> ¿Dudas sobre la ubicación? Ver en Google Maps
            </a>
          </div>
          <div id="mapa-selector" style="height: 400px; width: 100%;"></div>
        </div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-secondary fw-bold" @click="cerrarModalMapa">Cancelar</button>
          <button type="button" class="btn btn-success fw-bold px-4" @click="confirmarCoordenadasYGuardar">
            <i class="bi bi-check-circle"></i> Confirmar y Guardar Propiedad
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import NavComponent from '../../components/NavComponent.vue'
import { getUser } from '../../Services/api/Usuario/userApi'
import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
import ModalCondicionAlquiler from '../../components/Atcl/Propiedad/ModalCondicionAlquiler.vue'
import ModalPropiedadPropietario from '../../components/Atcl/Propiedad/ModalPropiedadPropietario.vue'
import { guardarPropiedad, validarUbicacionDuplicada, verificarCoordenadasService, getLocalidades } from '../../Services/api/Atcl/AtclApi'
import { useToast } from '../../composables/useToast'
import { useCalleAutocomplete } from '../../composables/atcl/useCalleAutocomplete'
import { useInmuebles } from '../../composables/atcl/useInmuebles'
import { useZona } from '../../composables/atcl/useZona'
import { useProvincias } from '../../composables/atcl/useProvincias'
import { useEstadosGenerales } from '../../composables/atcl/useEstadosGenerales'
import { useEstadosVenta } from '../../composables/atcl/useEstadosVenta'
import { useAsesores } from '../../composables/atcl/useAsesores'
import { useCaptadorInterno } from '../../composables/atcl/useCaptadorInterno'
import { useEstadosAlquiler } from '../../composables/atcl/useEstadosAlquiler'
import { useLocalidades } from '../../composables/atcl/useLocalidades'

// Leaflet (mapa de OpenStreetMap)
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix necesario: con bundlers (Vite/Webpack) Leaflet no resuelve solo
// las rutas de sus íconos por defecto, así que las seteamos a mano.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default {
  components: {
    NavComponent,
    ModalPropiedadComodidades,
    ModalPropiedadDescripcion,
    ModalPropiedadVenta,
    ModalPropiedadAlquiler,
    ModalCondicionAlquiler,
    ModalPropiedadPropietario
  },
  setup() {
    const { showWarning, showError, showSuccess } = useToast()
    const { callesFiltradas, mostrarSugerencias, calleSeleccionada, calleId, cargarCalles, filtrarCalles, seleccionarCalle, ocultarSugerencias, mostrarLista } = useCalleAutocomplete()
    const { inmuebles, error, cargarInmuebles } = useInmuebles()
    const { zonas, error: zonasError, cargarZonas } = useZona()
    const { provincias, error: provinciasError, cargarProvincias } = useProvincias()
    const { estadosGenerales, error: estadosGeneralesError, cargarEstadosGenerales } = useEstadosGenerales()
    const { estadosVenta, error: estadosVentaError, cargarEstadosVenta } = useEstadosVenta()
    const { asesores, error: asesoresError, cargarAsesores } = useAsesores()
    const { captadoresInternos, error: captadoresInternosError, cargarCaptadoresInternos } = useCaptadorInterno()
    const { estadosAlquiler, error: estadosAlquilerError, cargarEstadosAlquiler } = useEstadosAlquiler()
    const { localidades, error: localidadesError, cargarLocalidades } = useLocalidades()

    return {
      showWarning, showError, showSuccess,
      callesFiltradas, mostrarSugerencias, calleSeleccionada, calleId, cargarCalles, filtrarCalles, seleccionarCalle, ocultarSugerencias, mostrarLista,
      inmuebles, error, cargarInmuebles,
      zonas, zonasError, cargarZonas,
      provincias, provinciasError, cargarProvincias,
      estadosGenerales, estadosGeneralesError, cargarEstadosGenerales,
      estadosVenta, estadosVentaError, cargarEstadosVenta,
      asesores, asesoresError, cargarAsesores,
      captadoresInternos, captadoresInternosError, cargarCaptadoresInternos,
      estadosAlquiler, estadosAlquilerError, cargarEstadosAlquiler,
      localidades, localidadesError, cargarLocalidades
    }
  },
  data() {
    return {
      isLoadingData: true,
      mostrarModalDuplicados: false,
      duplicados: {
        status: 'clear',
        mensaje: '',
        propiedades: []
      },
      mostrarModalMapa: false,
      mapaInstancia: null,
      marcadorInstancia: null,
      // Datos del formulario principal
      formData: {
        altura: '',
        ph: '',
        piso: '',
        dto: '',
        inmueble_id: '',
        zona_id: '',
        provincia_id: '',
        localidad_id: '',
        llave: '',
        observaciones_llaves: '',
        cartel: '',
        observaciones_cartel: '',
        comodidades: {},
        descripcion: {},
        venta: {},
        alquiler: {},
        condicion_alquiler: {},
        propietario: [],
        latitud: null,
        longitud: null
      },

      images: [],
      videos: [],
      pdfs: [],
      activeTab: 'images',
      isSubmitting: false
    }
  },
  computed: {
    hasFiles() {
      return this.images.length || this.videos.length || this.pdfs.length
    },
    // NUEVO: Generador automático del link de Google Maps
    enlaceGoogleMaps() {
      // A propósito NO usamos formData.latitud/longitud acá. Esas coordenadas
      // vienen de Nominatim/OSM (el mini-mapa interno), y si estuvieran mal,
      // este botón perdería su sentido: la idea es que Google geocodifique la
      // MISMA dirección de forma independiente, con su propio motor (más
      // preciso), para poder comparar y corregir el pin si hace falta.
      const calleObjeto = this.callesFiltradas.find(c => c.id === this.calleId);
      const nombreCalle = calleObjeto ? calleObjeto.name : (this.calleSeleccionada || '');

      const localidadObjeto = this.localidades.find(l => l.id === this.formData.localidad_id);
      const nombreLocalidad = localidadObjeto ? localidadObjeto.name : '';

      const provinciaObjeto = this.provincias.find(p => p.id === this.formData.provincia_id);
      const nombreProvincia = provinciaObjeto ? provinciaObjeto.name : '';

      const altura = this.formData.altura || '';

      const calleYAltura = [nombreCalle, altura].filter(Boolean).join(' ');

      const direccionCompleta = [calleYAltura, nombreLocalidad, nombreProvincia, 'Argentina']
        .filter(part => part && part.trim() !== '')
        .join(', ');

      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;
    }
  },
  methods: {
    handlePropietariosUpdate(propietarios) {
      this.formData.propietario = propietarios
    },

    // En PropiedadCargaView.vue, methods:
    seleccionarCalleYValidar(calle) {
      this.seleccionarCalle(calle);   // lo que ya trae el composable
      this.validarUbicacion();        // 👈 dispara la verificación de duplicados
    },
    // Manejo de archivos
    handleFiles(event) {
      const files = Array.from(event.target.files)
      const allowedTypes = ["image/jpg", "image/jpeg", "application/pdf", "video/mp4", "video/mov"]
      const hasInvalidFiles = files.some(file => !allowedTypes.includes(file.type))

      //Si uno o mas archivos no son del formato correcto muestra un mensaje de error
      if (hasInvalidFiles) {
        this.showWarning('Uno o más archivos no tienen un formato permitido (Solo JPG, JPEG, PDF, MP4 o MOV).')
        event.target.value = ''
        return
      }

      // Limpiar previews anteriores
      this.images = []
      this.videos = []
      this.pdfs = []

      // Procesar cada archivo
      files.forEach((file) => {
        const url = URL.createObjectURL(file)

        const item = {
          file,
          url,
          comment: ""
        }

        // Clasificar el archivo según su tipo
        if (file.type.startsWith("image/")) {
          this.images.push(item)
        }
        else if (file.type.startsWith("video/")) {
          this.videos.push(item)
        }
        else if (file.type === "application/pdf") {
          this.pdfs.push(item)
        }
      })

      // Establecer el tab activo
      if (this.images.length > 0) {
        this.activeTab = 'images'
      } else if (this.videos.length > 0) {
        this.activeTab = 'videos'
      } else if (this.pdfs.length > 0) {
        this.activeTab = 'pdfs'
      }
    },

    // 1. EL INTERCEPTOR: Verifica si abre el mapa o si roba las coordenadas
    async handleSubmit() {
      // --- MINI VALIDACIONES OBLIGATORIAS ---
      if (
        !this.calleId ||
        !this.formData.altura ||
        !this.formData.inmueble_id ||
        !this.formData.provincia_id ||
        !this.formData.localidad_id
      ) {
        this.showWarning('Faltan datos obligatorios: Provincia, Localidad, Calle, Altura e Inmueble deben estar completos.');
        return; // Detenemos la ejecución aquí mismo, no hacemos nada más.
      }

      this.isSubmitting = true;

      // Si falta la calle o la altura, que intente guardar igual para que salten las validaciones de Laravel
      if (!this.calleId || !this.formData.altura) {
        this.ejecutarGuardadoReal();
        return;
      }

      try {
        // Le preguntamos al backend si esta dirección ya tiene coordenadas
        const payload = { calle_id: this.calleId, numero_calle: this.formData.altura };
        const response = await verificarCoordenadasService(payload); // Asegurate de importar este servicio

        if (response.data && response.data.coordenadas) {
          // ¡Ya existía! Nos robamos las coordenadas y guardamos directo
          this.formData.latitud = response.data.coordenadas.lat;
          this.formData.longitud = response.data.coordenadas.lng;
          this.ejecutarGuardadoReal();
        } else {
          // Es una dirección nueva. Abrimos el mapa.
          this.isSubmitting = false;
          this.abrirModalMapa();
        }
      } catch (error) {
        console.error("Error verificando coordenadas", error);
        // Si falla la red al verificar, intenta guardar igual sin coordenadas
        this.ejecutarGuardadoReal();
      }
    },

    // 2. EL GUARDADO REAL: Tu código original, adaptado para enviar lat/lng
    async ejecutarGuardadoReal() {
      this.isSubmitting = true;

      try {
        // Crear FormData para enviar archivos
        const formDataToSend = new FormData();
        formDataToSend.append('calle_id', this.calleId || '');

        // NUEVO: Agregamos latitud y longitud si están disponibles
        if (this.formData.latitud && this.formData.longitud) {
          formDataToSend.append('latitud', this.formData.latitud);
          formDataToSend.append('longitud', this.formData.longitud);
        }

        

        // Agregar campos del formulario
        Object.keys(this.formData).forEach(key => {
          // Evitamos mandar latitud/longitud de nuevo en el bucle
          if (key === 'latitud' || key === 'longitud') return;

          if (typeof this.formData[key] === 'object' && this.formData[key] !== null) {
            // Para objetos (comodidades, descripcion, venta, alquiler)
            formDataToSend.append(key, JSON.stringify(this.formData[key]));
          } else {
            formDataToSend.append(key, this.formData[key] || '');
          }
        });

        // Agregar imágenes
        this.images.forEach((img, index) => {
          formDataToSend.append(`images[${index}]`, img.file);
          formDataToSend.append(`images_comments[${index}]`, img.comment);
        });

        // Agregar videos
        this.videos.forEach((vid, index) => {
          formDataToSend.append(`videos[${index}]`, vid.file);
          formDataToSend.append(`videos_comments[${index}]`, vid.comment);
        });

        // Agregar PDFs
        this.pdfs.forEach((pdf, index) => {
          formDataToSend.append(`pdfs[${index}]`, pdf.file);
          formDataToSend.append(`pdfs_comments[${index}]`, pdf.comment);
        });

        // Obtenemos el id del usuario a travez del localStorage
        const id_usuario = await getUser(localStorage.getItem('token'));

        // Mandamos los datos al backend
        const response = await guardarPropiedad(id_usuario.data.id, formDataToSend);

        if (response.data.success) {
          this.showSuccess(response.data.message);
          // Redirigir a la vista de detalle de la propiedad
          if (response.data.data && response.data.data.id) {
            this.$router.push(`/propiedad-detalle/${response.data.data.id}`);
          } else {
            this.showError('No se pudo obtener el ID de la propiedad para redirigir');
          }
        }
      } catch (error) {
        this.showError(error.response?.data?.message || 'Ocurrió un error al guardar la propiedad');
      } finally {
        this.isSubmitting = false;
      }
    },

    // 3. FUNCIONES DEL MODAL DEL MAPA
    async abrirModalMapa() {
      this.mostrarModalMapa = true;

      // Centro de emergencia (Bulevar y Necochea, Santa Fe Capital) por si TODO falla
      let centroMapa = [-31.637321, -60.694612];
      let zoomMapa = 13;

      try {

        // =========================================================
        // 1. OBTENER CALLE
        // =========================================================
        const calleObjeto = this.callesFiltradas.find(
          c => c.id === this.calleId
        );
        const nombreCalle = calleObjeto
          ? calleObjeto.name
          : (this.calleSeleccionada || '');

        // =========================================================
        // 2. OBTENER LOCALIDAD (ej: "Santa Fe", "Recreo", "Rosario")
        // Ojo: "zona" es otro campo (subzona/barrio) y NO sirve para
        // geocodificar la ciudad — para eso usamos SIEMPRE "localidad".
        // =========================================================
        const localidadObjeto = this.localidades.find(
          l => l.id === this.formData.localidad_id
        );
        const nombreLocalidad = localidadObjeto
          ? localidadObjeto.name
          : '';

        // =========================================================
        // 3. OBTENER PROVINCIA
        // =========================================================
        const provinciaObjeto = this.provincias.find(
          p => p.id === this.formData.provincia_id
        );
        const nombreProvincia = provinciaObjeto
          ? provinciaObjeto.name
          : '';

        // =========================================================
        // 4. ALTURA
        // =========================================================
        const altura = this.formData.altura || '';

        // =========================================================
        // 5. PASO 1: geocodificar SOLO la localidad, para conseguir
        // su área real (bounding box). Esto es lo que después nos
        // permite "encerrar" la búsqueda de la calle ahí adentro y
        // que no se escape a Rosario, Rafaela, u otra ciudad con
        // una calle de nombre parecido.
        // =========================================================
        let viewboxLocalidad = null;

        if (nombreLocalidad) {

          const paramsLoc = new URLSearchParams({
            format: 'json',
            countrycodes: 'ar',
            limit: '1'
          });
          paramsLoc.set('city', nombreLocalidad);
          if (nombreProvincia) paramsLoc.set('state', nombreProvincia);

          console.log('🔎 Geocodificando localidad:', paramsLoc.toString());

          const resLoc = await fetch(
            `https://nominatim.openstreetmap.org/search?${paramsLoc.toString()}`,
            { headers: { 'Accept': 'application/json' } }
          );

          if (resLoc.ok) {
            const dataLoc = await resLoc.json();
            console.log('Resultado localidad:', dataLoc);

            if (dataLoc && dataLoc.length > 0) {
              const lat = parseFloat(dataLoc[0].lat);
              const lon = parseFloat(dataLoc[0].lon);

              if (!isNaN(lat) && !isNaN(lon)) {
                centroMapa = [lat, lon];
              }

              if (dataLoc[0].boundingbox) {
                // boundingbox de Nominatim viene como [south, north, west, east]
                const [south, north, west, east] =
                  dataLoc[0].boundingbox.map(parseFloat);
                viewboxLocalidad = `${west},${north},${east},${south}`;
              }
            }
          }
        }

        // =========================================================
        // 6. PASO 2: buscar calle + altura ACOTADO (bounded=1) a la
        // bounding box de la localidad. Con esto, aunque exista una
        // calle con el mismo nombre en otra ciudad, Nominatim la
        // descarta porque cae fuera del cuadro permitido.
        // =========================================================
        if (nombreCalle && viewboxLocalidad) {

          const calleYAltura = [nombreCalle, altura]
            .filter(Boolean)
            .join(' ');

          const paramsCalle = new URLSearchParams({
            format: 'json',
            countrycodes: 'ar',
            limit: '1',
            viewbox: viewboxLocalidad,
            bounded: '1'
          });
          paramsCalle.set('street', calleYAltura);
          paramsCalle.set('city', nombreLocalidad);
          if (nombreProvincia) paramsCalle.set('state', nombreProvincia);

          console.log('🔎 Geocodificando calle (acotado):', paramsCalle.toString());

          let resCalle = await fetch(
            `https://nominatim.openstreetmap.org/search?${paramsCalle.toString()}`,
            { headers: { 'Accept': 'application/json' } }
          );
          let dataCalle = resCalle.ok ? await resCalle.json() : [];

          // Si no encontró con altura, probamos solo la calle (sigue acotado)
          if ((!dataCalle || dataCalle.length === 0) && altura) {
            paramsCalle.set('street', nombreCalle);

            resCalle = await fetch(
              `https://nominatim.openstreetmap.org/search?${paramsCalle.toString()}`,
              { headers: { 'Accept': 'application/json' } }
            );
            dataCalle = resCalle.ok ? await resCalle.json() : [];
            zoomMapa = 15;
          } else {
            zoomMapa = 17;
          }

          console.log('Resultado calle:', dataCalle);

          if (dataCalle && dataCalle.length > 0) {
            const lat = parseFloat(dataCalle[0].lat);
            const lon = parseFloat(dataCalle[0].lon);

            if (!isNaN(lat) && !isNaN(lon)) {
              centroMapa = [lat, lon];
              console.log('✅ Dirección encontrada:', {
                lat, lon, display_name: dataCalle[0].display_name
              });
            }
          } else {
            console.warn('⚠️ No se encontró la calle dentro de la localidad, se usa el centro de la localidad.');
          }
        }

      } catch (error) {
        console.error('❌ Error al geocodificar:', error);
      }

      this.$nextTick(() => {

        // Eliminar mapa anterior
        if (this.mapaInstancia) {

          this.mapaInstancia.remove();

          this.mapaInstancia = null;
        }

        // ===========================================================
        // 11. CREAR MAPA
        // ===========================================================
        this.mapaInstancia = L.map(
          'mapa-selector'
        ).setView(
          centroMapa,
          zoomMapa
        );

        // ===========================================================
        // 12. OPENSTREETMAP
        // ===========================================================
        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          }
        ).addTo(
          this.mapaInstancia
        );

        // ===========================================================
        // 13. MARCADOR
        // ===========================================================
        this.marcadorInstancia = L.marker(
          centroMapa,
          {
            draggable: true
          }
        ).addTo(
          this.mapaInstancia
        );

        // ===========================================================
        // 14. GUARDAR COORDENADAS INICIALES
        // ===========================================================
        this.formData.latitud =
          centroMapa[0];

        this.formData.longitud =
          centroMapa[1];

        // ===========================================================
        // 15. MARCADOR ARRASTRABLE
        // ===========================================================
        this.marcadorInstancia.on(
          'dragend',
          (event) => {

            const posicion =
              event.target.getLatLng();

            this.formData.latitud =
              posicion.lat;

            this.formData.longitud =
              posicion.lng;

            console.log(
              '📍 Nueva posición:',
              {
                latitud: posicion.lat,
                longitud: posicion.lng
              }
            );

          }
        );

        // ===========================================================
        // 16. CORREGIR TAMAÑO DEL MAPA
        // ===========================================================
        setTimeout(() => {

          if (this.mapaInstancia) {

            this.mapaInstancia.invalidateSize();

            // Volver a centrar después de corregir tamaño
            this.mapaInstancia.setView(
              centroMapa,
              zoomMapa
            );

          }

        }, 300);

      });
    },





    cerrarModalMapa() {
      this.mostrarModalMapa = false;
      this.isSubmitting = false;
    },

    confirmarCoordenadasYGuardar() {
      const posicionFinal = this.marcadorInstancia.getLatLng();
      this.formData.latitud = posicionFinal.lat;
      this.formData.longitud = posicionFinal.lng;

      this.mostrarModalMapa = false;
      this.ejecutarGuardadoReal(); // Una vez confirmadas, guardamos en la base de datos
    },



    async validarUbicacion() {
      // 1. REGLA ESTRICTA: Solo disparamos la consulta si los 4 campos están completos
      console.log('🚀 validarUbicacion', this.calleId, this.formData.altura, this.formData.localidad_id, this.formData.provincia_id)
      if (
        !this.calleId ||
        !this.formData.altura ||
        !this.formData.localidad_id ||
        !this.formData.provincia_id
      ) {
        return; // Si falta alguno, detenemos la ejecución silenciosamente
      }

      try {
        const payload = {
          calle_id: this.calleId,
          numero_calle: this.formData.altura,
          id_provincia: this.formData.provincia_id,
          id_localidad: this.formData.localidad_id
        };

        const response = await validarUbicacionDuplicada(payload);
        const data = response.data;

        // Si el backend nos avisa que hay un exact_match o similar_match
        if (data.status === 'exact_match' || data.status === 'similar_match') {
          this.duplicados.status = data.status;
          this.duplicados.mensaje = data.mensaje;
          this.duplicados.propiedades = data.data;
          this.mostrarModalDuplicados = true;
        } else {
          this.duplicados.status = 'clear';
          this.mostrarModalDuplicados = false;
        }

      } catch (error) {
        console.error("Error al validar ubicación:", error);
      }
    },

    cerrarModalDuplicados() {
      this.mostrarModalDuplicados = false;
    }
  },

  async mounted() {
    this.isLoadingData = true; // Encendemos el spinner por seguridad

    try {
      // Solo esperamos lo IMPRESCINDIBLE para mostrar el formulario principal.
      // Los catálogos de los modales (comodidades, venta, alquiler, asesores,
      // captadores) NO bloquean esto: se cargan aparte, en segundo plano,
      // porque el usuario puede tardar en abrir esos modales (o no abrirlos).
      await Promise.all([
        this.cargarInmuebles(),
        this.cargarZonas(),
        this.cargarCalles(),

        // Función asíncrona interna para Provincias
        (async () => {
          await this.cargarProvincias();
          const provSantaFe = this.provincias.find(p => p.name.toUpperCase().includes('SANTA FE'));
          if (provSantaFe) this.formData.provincia_id = provSantaFe.id;
        })(),

        // Función asíncrona interna para Localidades
        (async () => {
          await this.cargarLocalidades();
          const locSantaFe = this.localidades.find(l => l.name.toUpperCase().includes('SANTA FE'));
          if (locSantaFe) this.formData.localidad_id = locSantaFe.id;
        })()
      ]);
    } catch (error) {
      console.error("Error cargando los catálogos iniciales:", error);
    } finally {
      // Apenas está lo esencial, mostramos el formulario. No esperamos a los modales.
      this.isLoadingData = false;
    }

    // Catálogos de los modales: se disparan en paralelo, pero SIN bloquear
    // la pantalla. Si el usuario abre un modal antes de que termine de llegar
    // su catálogo, ese modal en particular puede tardar un instante en mostrar
    // las opciones, pero el formulario principal ya está usable.
    Promise.all([
      this.cargarEstadosGenerales(),
      this.cargarEstadosVenta(),
      this.cargarEstadosAlquiler(),
      this.cargarAsesores(),
      this.cargarCaptadoresInternos()
    ]).catch(error => {
      console.error("Error cargando catálogos de modales:", error);
    });
  }
}
</script>

<style scoped>
.preview-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.preview-media {
  height: 350px;
  object-fit: contain;
  background: #f8f9fa;
  border-radius: 10px;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-light:hover {
  background-color: #f8f9fa !important;
}
</style>