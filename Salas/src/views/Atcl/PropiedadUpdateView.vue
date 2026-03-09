<template>
  <NavComponent titulo="Propiedad Update"></NavComponent>
  <div class="px-3">
    <form class="row d-flex align-items-start px-3" autocomplete="off">
      <div class="col-md-6 row">
        <div class="form-group col-md-4 px-1">
          <label for="input-calle" class="form-label">Calle</label>
          <div class="position-relative">
            <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
              v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarLista" @blur="ocultarSugerencias">

            <!-- Lista de sugerencias -->
            <ul v-if="mostrarSugerencias && callesFiltradas.length"
              class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm"
              style="z-index: 1000; max-height: 200px; overflow-y: auto;">
              <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalle(calle)"
                class="px-3 py-2 cursor-pointer hover:bg-light">
                {{ calle.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class=" form-group col-md-2 px-1">
          <label for="input-altura" class="form-label">Altura</label>
          <input type="number" class="form-control form-control-sm" id="input-altura" v-model="numero_calle">
        </div>
        <div class="form-group col-md-2 px-1">
          <label for="input-piso" class="form-label">PH</label>
          <select name="input-ph" id="input-ph" class="form-select form-select-sm" v-model="ph">
            <option value="NO">No</option>
            <option value="SI">Si</option>
          </select>
        </div>
        <div class="form-group col-md-2 px-1">
          <label for="input-piso" class="form-label">Piso</label>
          <input type="number" class="form-control form-control-sm" id="input-piso" v-model="piso">
        </div>
        <div class="form-group col-md-2 px-1">
          <label for="select-tipo-propiedad" class="form-label">Dto</label>
          <input type="text" class="form-control form-control-sm" id="select-tipo-propiedad" v-model="departamento">
        </div>

        <div class="form-group col-md-3 px-1">
          <label for="input-piso" class="form-label">Inmueble</label>
          <select class="form-select form-select-sm" v-model="tipo_inmueble">
            <option value="">Seleccione</option>
            <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
              {{ inmueble.inmueble }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4 px-1">
          <label for="input-numero-propiedad" class="form-label">Zona</label>
          <select class="form-select form-select-sm" id="input-zona" name="input-zona" v-model="id_zona">
            <option value="">Seleccione</option>
            <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
              {{ zona.name }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-5 px-1">
          <label for="input-numero-propiedad" class="form-label">Provincia</label>
          <select class="form-select form-select-sm" name="provincia" id="input-provincia" v-model="id_provincia">
            <option value="">Seleccione</option>
            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
              {{ provincia.name }}
            </option>
          </select>
        </div>

        <div class="form-group col-md-3 px-1">
          <label for="input-llave" class="form-label">Llave</label>
          <input type="number" class="form-control form-control-sm" id="input-llave" v-model="llave">
        </div>
        <div class="form-group col-md-9 px-1 pt-3">
          <textarea class="form-control form-control-sm" id="input-observaciones" placeholder="Observaciones de Llaves"
            v-model="comentario_llave"></textarea>
        </div>

        <div class="form-group col-md-3 px-1">
          <label for="input-numero-propiedad" class="form-label">Cartel</label>
          <select class="form-select form-select-sm" name="cartel" id="input-cartel" v-model="cartel">
            <option value="SI">SI</option>
            <option value="NO">NO</option>

          </select>
        </div>
        <div class="form-group col-md-9 px-1 pt-3">
          <textarea class="form-control form-control-sm" id="input-observaciones-cartel"
            placeholder="Observaciones de Cartel" v-model="comentario_cartel"></textarea>
        </div>

        <div class="form-group col-md-6 px-1 pt-2">
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalComodidades">
            Comodidades
          </button>
        </div>
        <div class="form-group col-md-6 px-1 pt-2">
          <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalDescripcion">
            Descripcion
          </button>
        </div>

        <div class="form-group col-md-6 px-1 pt-2">
          <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalVentas">
            Venta
          </button>
        </div>
        <div class="form-group col-md-6 px-1 pt-2">
          <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalAlquiler">
            Alquiler
          </button>
        </div>

      </div>

      <div class="col-md-6 row d-flex justify-content-center">
        <div class="form-group col-md-12 mt-2">
          <label class="form-label">Editar Archivos</label>
        </div>

        <div class="form-group col-md-6 mb-2">
          <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalFotos">Fotos</button>
        </div>
        <div class="form-group col-md-6 mb-2">
          <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalDocumentacion">Documentacion</button>
        </div>
        <div class="form-group col-md-6 mb-2">
          <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalVideos">Videos</button>
        </div>

        <div class="form-group col-md-12 mt-2">
          <label class="form-label">Editar Propietarios</label>
        </div>

        <div class="form-group col-md-6 col-lg-12 mb-2">
          <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
            data-bs-target="#modalPropietarios">Propietarios</button>
        </div>

      </div>
      <div class="col-md-12 row mt-4 d-flex justify-content-center">
        <button type="button" class="btn btn-primary w-50" @click="actualizarPropiedad">Editar Propiedad</button>
      </div>
    </form>
  </div>





  <!-- Modal Fotos -->
  <div class="modal fade" id="modalFotos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="modalFotosLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen ">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalFotosLabel">Editar Fotos</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex justify-content-center row">

          <!-- Subida local (sin impactar BD) -->
          <div class="col-md-12 row align-items-center form-group mb-3">
            <div class="col-md-2">
              <label for="fotos" class="form-label">Seleccionar Fotos</label>
            </div>
            <div class="col-md-6 mb-2">
              <input type="file" class="form-control" id="fotos" accept="image/jpeg, image/jpg" multiple
                @change="agregarFotosPendientes">
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
                      <div class="col-md-3">
                        <input type="number" class="form-control form-control-sm" placeholder="Orden"
                          v-model.number="foto.orden" @change="validarCambioOrden(foto)">
                      </div>
                      <div class="col-md-9">
                        <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                          v-model="foto.comentario">
                                            </textarea>
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

          <!-- Fotos ya guardadas en BD -->
          <div class="row g-1 overflow-y-auto" style="max-height: 55vh;">
            <div v-for="foto in fotosOrdenadas" :key="foto.id" class="col-md-4">
              <div class="card">
                <img :src="'http://localhost' + foto.url" class="card-img-top img-thumbnail"
                  style="height: 200px; object-fit: cover;" alt="Imagen de propiedad">
                <div class="card-body">
                  <div class="row g-1 align-items-center">
                    <div class="col-md-3">
                      <input type="number" class="form-control form-control-sm" placeholder="Orden"
                        v-model.number="foto.orden" @change="validarCambioOrden(foto)">
                    </div>
                    <div class="col-md-9">
                      <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                        v-model="foto.notes" @change="validarCambioOrden(foto)">
                                        </textarea>
                    </div>
                    <div class="col-md-12 d-flex justify-content-between">
                      <small class="text-muted">Fecha cargado: {{ formatDate(foto.updated_at) }}</small>
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" :id="'archivado-' + foto.id"
                          :checked="foto.archivado === 1" @change="foto.archivado = $event.target.checked ? 1 : 0">
                        <label class="form-check-label" :for="'archivado-' + foto.id">
                          Archivado
                        </label>
                      </div>
                    </div>
                    <div class="col-md-12 mt-1">
                      <button type="button" class="btn btn-danger btn-sm w-100" @click="eliminarFotoExistente(foto.id)">
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
  <!-- Modal Documentacion -->
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
          <div class="col-md-12 row align-items-center form-group mb-3">
            <div class="col-md-2">
              <label for="documentos" class="form-label">Seleccionar Documentos</label>
            </div>
            <div class="col-md-6 mb-2">
              <input type="file" class="form-control" id="documentos" accept="image/*,application/pdf" multiple
                @change="agregarDocumentosPendientes">
            </div>
            <div class="col-md-3 mb-2">
              <button type="button" class="btn btn-primary btn-sm w-100" @click="confirmarDocumentosPendientes">
                Subir Documento
              </button>
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
                          v-model="doc.comentario">
                                            </textarea>
                      </div>
                      <div class="col-md-12 mt-1">
                        <button type="button" class="btn btn-danger btn-sm w-100"
                          @click="quitarDocumentoPendiente(index)">
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
            <div v-for="documento in propiedad_update?.documentacion" :key="documento.id" class="col-md-4">
              <div class="card">
                <div style="height: 200px; overflow: hidden;">
                  <embed v-if="documento.url.endsWith('.pdf')" :src="'http://localhost' + documento.url"
                    class="w-100 h-100 border-0" type="application/pdf">
                  <img v-else :src="'http://localhost' + documento.url" class="w-100 h-100 img-thumbnail"
                    style="object-fit: cover;">
                </div>
                <div class="card-body">
                  <div class="row g-1">
                    <div class="col-md-12">
                      <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                        v-model="documento.notes">
                                        </textarea>
                    </div>
                    <div class="col-md-12 mt-1">
                      <button type="button" class="btn btn-danger btn-sm w-100"
                        @click="eliminarDocumentoExistente(documento.id)">
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
  <!-- Modal Videos -->
  <div class="modal fade" id="modalVideos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="modalVideosLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen ">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalVideosLabel">Editar Videos</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex justify-content-center row">

          <!-- Subida local -->
          <div class="col-md-12 row align-items-center form-group mb-3">
            <div class="col-md-2">
              <label for="videos" class="form-label">Seleccionar Videos</label>
            </div>
            <div class="col-md-6 mb-2">
              <input type="file" class="form-control" id="videos" accept="video/*" multiple
                @change="agregarVideosPendientes">
            </div>
            <div class="col-md-3 mb-2">
              <button type="button" class="btn btn-primary btn-sm w-100" @click="confirmarVideosPendientes">
                Subir Video
              </button>
            </div>
          </div>

          <!-- Videos pendientes -->
          <div v-if="videosPendientes.length" class="col-md-12 mb-3">
            <h6 class="text-warning">⚠ Videos nuevos </h6>
            <div class="row g-1">
              <div v-for="(video, index) in videosPendientes" :key="'pending-video-' + index" class="col-md-4">
                <div class="card border-warning">
                  <video :src="video.preview" class="card-img-top img-thumbnail"
                    style="height: 200px; object-fit: cover;" controls>
                  </video>
                  <div class="card-body">
                    <div class="row g-1">

                      <div class="col-md-12">
                        <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                          v-model="video.comentario">
                                            </textarea>
                      </div>
                      <div class="col-md-12 mt-1">
                        <button type="button" class="btn btn-danger btn-sm w-100" @click="quitarVideoPendiente(index)">
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

          <!-- Videos ya guardados en BD -->
          <div class="row g-1 overflow-y-auto" style="max-height: 55vh;">
            <div v-for="video in propiedad_update?.video" :key="video.id" class="col-md-4">
              <div class="card">
                <video :src="'http://localhost' + video.url" class="card-img-top img-thumbnail"
                  style="height: 200px; object-fit: cover;" controls>
                </video>
                <div class="card-body">
                  <div class="row g-1">
                    <div class="col-md-12">
                      <textarea class="form-control form-control-sm" rows="1" placeholder="Comentario..."
                        v-model="video.notes">
                                        </textarea>
                    </div>
                    <div class="col-md-12 d-flex justify-content-between">
                      <small class="text-muted">Fecha cargado: {{ formatDate(video.updated_at) }}</small>
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" :id="'archivado-' + video.id"
                          :checked="video.archivado === 1" @change="video.archivado = $event.target.checked ? 1 : 0">
                        <label class="form-check-label" :for="'archivado-' + video.id">
                          Archivado
                        </label>
                      </div>
                    </div>
                    <div class="col-md-12 mt-1">
                      <button type="button" class="btn btn-danger btn-sm w-100"
                        @click="eliminarVideoExistente(video.id)">
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
  <!-- ----------------------------------------------------- -->





  <ModalPropiedadComodidades :propiedad-update="propiedad_update" :estados-generales="estadosGenerales"
    @update:comodidades="actualizarComodidades">
  </ModalPropiedadComodidades>

  <ModalPropiedadDescripcion :propiedad-update="propiedad_update" @update:descripcion="actualizarDescripcion">
  </ModalPropiedadDescripcion>

  <ModalPropiedadVenta :estados-venta="estadosVenta" :captadores-internos="captadoresInternos" :asesores="asesores"
    :propiedad-update="propiedad_update" @update:venta="actualizarVenta">
  </ModalPropiedadVenta>

  <ModalPropiedadAlquiler :estados-alquiler="estadosAlquiler" :propiedad-update="propiedad_update"
    @update:alquiler="actualizarAlquiler">
  </ModalPropiedadAlquiler>

  <ModalCondicionAlquiler :propiedad-update="propiedad_update" @update:condicion_alquiler="actualizarCondicion">
  </ModalCondicionAlquiler>

  <ModalPropiedadPropietario :propiedad="propiedad_update" :mostrar-buscador="true"
    @propietarios-cambiados="handlePropietariosCambiados" :mostrar-quitar="true">
  </ModalPropiedadPropietario>

</template>

<script>
import NavComponent from '@/components/NavComponent.vue'
import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
import ModalCondicionAlquiler from '../../components/Atcl/Propiedad/ModalCondicionAlquiler.vue'
import ModalPropiedadPropietario from '../../components/Atcl/Propiedad/ModalPropiedadPropietario.vue'
import { muestraPropiedad, actualizaPropiedad } from '../../Services/api/Atcl/AtclApi'
import { useCalleAutocomplete } from '../../composables/atcl/useCalleAutocomplete'
import { useInmuebles } from '../../composables/atcl/useInmuebles'
import { useZona } from '../../composables/atcl/useZona'
import { useProvincias } from '../../composables/atcl/useProvincias'
import { useEstadosGenerales } from '../../composables/atcl/useEstadosGenerales'
import { useEstadosVenta } from '../../composables/atcl/useEstadosVenta'
import { useEstadosAlquiler } from '../../composables/atcl/useEstadosAlquiler'
import { useCaptadorInterno } from '../../composables/atcl/useCaptadorInterno'
import { useAsesores } from '../../composables/atcl/useAsesores'
import { useToast } from '../../composables/useToast'

export default {
  name: 'PropiedadUpdateView',
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
    const { callesFiltradas, mostrarSugerencias, calleSeleccionada, calleId, cargarCalles, filtrarCalles, seleccionarCalle, ocultarSugerencias, mostrarLista } = useCalleAutocomplete()
    const { inmuebles, error, cargarInmuebles } = useInmuebles()
    const { zonas, error: zonasError, cargarZonas } = useZona()
    const { provincias, error: provinciasError, cargarProvincias } = useProvincias()
    const { estadosGenerales, error: estadosGeneralesError, cargarEstadosGenerales } = useEstadosGenerales()
    const { estadosVenta, error: estadosVentaError, cargarEstadosVenta } = useEstadosVenta()
    const { estadosAlquiler, error: estadosAlquilerError, cargarEstadosAlquiler } = useEstadosAlquiler()
    const { captadoresInternos, error: captadoresInternosError, cargarCaptadoresInternos } = useCaptadorInterno()
    const { asesores, error: asesoresError, cargarAsesores } = useAsesores()
    const { showWarning, showError, showSuccess } = useToast()
    return {
      showWarning, showError, showSuccess,
      callesFiltradas, mostrarSugerencias, calleSeleccionada, calleId, cargarCalles, filtrarCalles, seleccionarCalle, ocultarSugerencias, mostrarLista,
      inmuebles, error, cargarInmuebles,
      zonas, zonasError, cargarZonas,
      provincias, provinciasError, cargarProvincias,
      estadosGenerales, estadosGeneralesError, cargarEstadosGenerales,
      estadosVenta, estadosVentaError, cargarEstadosVenta,
      estadosAlquiler, estadosAlquilerError, cargarEstadosAlquiler,
      captadoresInternos, captadoresInternosError, cargarCaptadoresInternos,
      asesores, asesoresError, cargarAsesores,
    }
  },
  data() {
    return {
      propiedad_update: null,
      loading: true,
      numero_calle: '',
      piso: '',
      departamento: '',
      llave: '',
      comentario_llave: '',
      comentario_cartel: '',
      ph: '',
      tipo_inmueble: '',
      id_zona: '',
      id_provincia: '',
      cartel: '',
      fotosPendientes: [],
      fotosEliminadas: [],
      fotosOriginales: [],
      documentosPendientes: [],
      documentosEliminados: [],
      documentosOriginales: [],
      videosPendientes: [],
      videosEliminados: [],
      videosOriginales: [],
      propietariosNuevos: [],
      propietariosEliminados: [],
      propietariosModificados: [],
      propietariosOriginales: [],
    }
  },
  computed: {
    fotosOrdenadas() {
      if (!this.propiedad_update || !this.propiedad_update.fotos) return [];

      return [...this.propiedad_update.fotos].sort((a, b) => {
        // Si ambas tienen orden, comparar por orden
        if (a.orden !== null && b.orden !== null) {
          return a.orden - b.orden;
        }
        // Si solo una tiene orden, la que tiene orden va primero
        if (a.orden !== null) return -1;
        if (b.orden !== null) return 1;
        // Si ninguna tiene orden, comparar por id
        return a.id - b.id;
      });
    }
  },
  methods: {
    // Formatear fecha para mostrar
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    // Validar cuando cambia el orden de una foto
    validarCambioOrden(fotoActual) {
      const ordenesUsados = new Set()

      // Revisar todas las fotos excepto la actual
      const todasLasFotos = [
        ...(this.propiedad_update?.fotos || []),
        ...(this.fotosPendientes || [])
      ]

      for (const foto of todasLasFotos) {
        if (foto !== fotoActual && foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
          ordenesUsados.add(foto.orden)
        }
      }

      // Si el orden actual está duplicado, mostrar error y restaurar
      if (fotoActual.orden !== null && fotoActual.orden !== undefined && fotoActual.orden !== '' && ordenesUsados.has(fotoActual.orden)) {
        this.showError(`El número de orden ${fotoActual.orden} ya está siendo usado por otra foto`)

        // Restaurar el orden anterior si existe
        this.$nextTick(() => {
          const original = this.fotosOriginales?.find(f => f.id === fotoActual.id)
          fotoActual.orden = original?.orden || null
        })
      }
    },
    // Validar que no haya números de orden duplicados
    validarOrdenFotos() {
      const ordenesUsados = new Set()

      // Revisar fotos existentes
      if (this.propiedad_update && this.propiedad_update.fotos) {
        for (const foto of this.propiedad_update.fotos) {
          if (foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
            if (ordenesUsados.has(foto.orden)) {
              return {
                valido: false,
                mensaje: `El número de orden ${foto.orden} está duplicado en las fotos existentes`
              }
            }
            ordenesUsados.add(foto.orden)
          }
        }
      }

      // Revisar fotos nuevas
      for (const foto of this.fotosPendientes) {
        if (foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
          if (ordenesUsados.has(foto.orden)) {
            return {
              valido: false,
              mensaje: `El número de orden ${foto.orden} ya está siendo usado por otra foto`
            }
          }
          ordenesUsados.add(foto.orden)
        }
      }

      return { valido: true }
    },
    async mostrarPropiedad() {
      try {
        // Obtiene el ID de la URL
        const id = this.$route.params.id
        //console.log('ID de la propiedad:', id)

        // Llama a la API pasando el ID como parámetro
        const response = await muestraPropiedad({ id: id })
        this.propiedad_update = response.data
        console.log('propiedad_update', this.propiedad_update);
        this.numero_calle = this.propiedad_update.numero_calle
        this.piso = this.propiedad_update.piso
        this.departamento = this.propiedad_update.departamento
        this.llave = this.propiedad_update.llave
        this.comentario_llave = this.propiedad_update.comentario_llave
        this.comentario_cartel = this.propiedad_update.comentario_cartel
        this.ph = this.propiedad_update.ph
        this.tipo_inmueble = this.propiedad_update.id_inmueble
        this.id_zona = this.propiedad_update.id_zona
        this.id_provincia = this.propiedad_update.id_provincia
        this.cartel = this.propiedad_update.cartel
        this.calleSeleccionada = this.propiedad_update.calle.name
        this.calleId = this.propiedad_update.calle.id
        this.fotosOriginales = response.data.fotos.map(f => ({
          id: f.id,
          orden: f.orden,
          notes: f.notes,
          updated_at: f.updated_at,
          archivado: f.archivado
        }))
        //console.log(this.foto)
        this.documentosOriginales = response.data.documentacion.map(d => ({
          id: d.id,
          notes: d.notes,
        }))

        this.videosOriginales = response.data.video.map(v => ({
          id: v.id,
          notes: v.notes,
        }))

        // Guardar propietarios originales
        this.propietariosOriginales = response.data.propietarios.map(p => ({
          id: p.id,
          pivot: {
            observaciones: p.pivot.observaciones,
            baja: p.pivot.baja
          }
        }))
        //console.log('Propiedad encontrada:', this.propiedad_update)
      } catch (error) {
        console.error('Error cargando propiedad:', error)
        this.error = 'No se pudo cargar la propiedad'
      } finally {
        this.loading = false
      }
    },

    agregarFotosPendientes(event) {
      const archivos = Array.from(event.target.files)
      archivos.forEach(file => {
        this.fotosPendientes.push({
          file: file,
          preview: URL.createObjectURL(file),
          comentario: '',
          orden: null,
        })
      })
      // Limpiar el input para poder volver a seleccionar los mismos archivos si se quiere
      event.target.value = ''
    },
    quitarFotoPendiente(index) {
      URL.revokeObjectURL(this.fotosPendientes[index].preview) // liberar memoria
      this.fotosPendientes.splice(index, 1)
    },

    eliminarFotoExistente(fotoId) {
      if (!confirm('¿Eliminar esta foto?')) return
      // Marcala para eliminar al hacer submit, o llamá la API directo aquí
      this.propiedad_update.fotos = this.propiedad_update.fotos.filter(f => f.id !== fotoId)
      // Guardá los ids eliminados para enviarlos al back:
      this.fotosEliminadas.push(fotoId)
    },
    agregarDocumentosPendientes(event) {
      const archivos = Array.from(event.target.files)
      archivos.forEach(file => {
        const esPdf = file.type === 'application/pdf'
        this.documentosPendientes.push({
          file,
          preview: URL.createObjectURL(file),
          esPdf,
          nombre: file.name,
          comentario: ''
        })
      })
      event.target.value = ''
    },
    confirmarDocumentosPendientes() {
      if (this.documentosPendientes.length === 0) {
        alert('Seleccioná al menos un documento primero.')
      }
    },
    quitarDocumentoPendiente(index) {
      URL.revokeObjectURL(this.documentosPendientes[index].preview)
      this.documentosPendientes.splice(index, 1)
    },
    eliminarDocumentoExistente(docId) {
      if (!confirm('¿Eliminar este documento?')) return
      this.propiedad_update.documentacion = this.propiedad_update.documentacion.filter(d => d.id !== docId)
      this.documentosEliminados.push(docId)
    },
    agregarVideosPendientes(event) {
      const archivos = Array.from(event.target.files)
      archivos.forEach(file => {
        this.videosPendientes.push({
          file,
          preview: URL.createObjectURL(file),
          comentario: '',
          orden: null
        })
      })
      event.target.value = ''
    },
    confirmarVideosPendientes() {
      if (this.videosPendientes.length === 0) {
        alert('Seleccioná al menos un video primero.')
      }
    },
    quitarVideoPendiente(index) {
      URL.revokeObjectURL(this.videosPendientes[index].preview)
      this.videosPendientes.splice(index, 1)
    },
    eliminarVideoExistente(videoId) {
      if (!confirm('¿Eliminar este video?')) return
      this.propiedad_update.video = this.propiedad_update.video.filter(v => v.id !== videoId)
      this.videosEliminados.push(videoId)
    },
    handlePropietariosCambiados(propietariosActuales) {
      // Reiniciar arrays
      this.propietariosNuevos = []
      this.propietariosEliminados = []
      this.propietariosModificados = []

      // Detectar propietarios eliminados
      this.propietariosOriginales.forEach(original => {
        const existe = propietariosActuales.find(actual => actual.id === original.id)
        if (!existe) {
          this.propietariosEliminados.push(original.id)
        }
      })

      // Detectar propietarios nuevos y modificados
      propietariosActuales.forEach(actual => {
        const original = this.propietariosOriginales.find(orig => orig.id === actual.id)

        if (!original) {
          // Es un propietario nuevo
          this.propietariosNuevos.push(actual)
        } else {
          // Verificar si fue modificado
          console.log('Comparando propietario ID:', actual.id)
          console.log('Original:', original.pivot)
          console.log('Actual:', actual.pivot)

          const obsModificada = original.pivot.observaciones !== actual.pivot.observaciones
          const bajaModificada = original.pivot.baja !== actual.pivot.baja

          console.log('Observaciones modificadas:', obsModificada)
          console.log('Baja modificada:', bajaModificada)

          if (obsModificada || bajaModificada) {
            console.log('¡Propietario MODIFICADO! Agregando a modificados...')
            this.propietariosModificados.push({
              id: actual.id,
              observaciones: actual.pivot.observaciones,
              baja: actual.pivot.baja
            })
          }
        }
      })

      console.log('Propietarios nuevos:', this.propietariosNuevos)
      console.log('Propietarios eliminados:', this.propietariosEliminados)
      console.log('Propietarios modificados:', this.propietariosModificados)
    },
    //metodo que recibe todos los datos del modal comodidades para mandarlo al backend
    actualizarComodidades(comodidades) {
      // Actualizar el objeto propiedad_update con las nuevas comodidades
      if (!this.propiedad_update) {
        this.propiedad_update = {}
      }
      this.propiedad_update.comodidades = comodidades
      //console.log('Comodidades actualizadas:', this.propiedad_update.comodidades)
    },
    //metodo que recibe todos los datos del modal descripcion para mandarlo al backend
    actualizarDescripcion(descripcion) {
      // Actualizar el objeto propiedad_update con la nueva descripcion
      if (!this.propiedad_update) {
        this.propiedad_update = {}
      }
      this.propiedad_update.descripcion = descripcion
      //console.log('Descripcion actualizada:', this.propiedad_update.descripcion)
    },
    //metodo que recibe todos los datos del modal venta para mandarlo al backend
    actualizarVenta(venta) {
      // Actualizar el objeto propiedad_update con la nueva venta
      if (!this.propiedad_update) {
        this.propiedad_update = {}
      }
      this.propiedad_update.venta = venta
      //console.log('Venta actualizada:', this.propiedad_update.venta)
    },
    //metodo que recibe todos los datos del modal alquiler para mandarlo al backend
    actualizarAlquiler(alquiler) {
      // Actualizar el objeto propiedad_update con el nuevo alquiler
      if (!this.propiedad_update) {
        this.propiedad_update = {}
      }
      this.propiedad_update.alquiler = alquiler
      //console.log('Alquiler actualizado:', this.propiedad_update.alquiler)
    },
    //metodo que recibe todos los datos del modal condicion alquiler para mandarlo al backend
    actualizarCondicion(condicion) {
      // Actualizar el objeto propiedad_update con la nueva condicion
      if (!this.propiedad_update) {
        this.propiedad_update = {}
      }
      this.propiedad_update.condicion = condicion
      //console.log('Condicion actualizada:', this.propiedad_update.condicion)
    },
    async actualizarPropiedad() {
      try {
        // Validar que no haya números de orden duplicados
        const validacion = this.validarOrdenFotos()
        if (!validacion.valido) {
          this.showError(validacion.mensaje)
          return
        }

        // Crear FormData para enviar archivos y datos juntos
        const formData = new FormData()
        // Datos básicos de la propiedad
        formData.append('id', this.$route.params.id)
        formData.append('calle_id', this.calleId ?? '')
        formData.append('numero_calle', this.numero_calle ?? '')
        formData.append('piso', this.piso ?? '')
        formData.append('departamento', this.departamento ?? '')
        formData.append('ph', this.ph ?? '')
        formData.append('id_inmueble', this.tipo_inmueble ?? '')
        formData.append('id_zona', this.id_zona ?? '')
        formData.append('id_provincia', this.id_provincia ?? '')
        formData.append('llave', this.llave ?? '')
        formData.append('comentario_llave', this.comentario_llave ?? '')
        formData.append('cartel', this.cartel ?? '')
        formData.append('comentario_cartel', this.comentario_cartel ?? '')

        // Datos de los modales - enviar como JSON string
        if (this.propiedad_update) {
          // Comodidades
          if (this.propiedad_update.comodidades) {
            formData.append('comodidades', JSON.stringify(this.propiedad_update.comodidades))
          }

          // Descripción
          if (this.propiedad_update.descripcion) {
            formData.append('descripcion', JSON.stringify(this.propiedad_update.descripcion))
          }

          // Venta
          if (this.propiedad_update.venta) {
            formData.append('venta', JSON.stringify(this.propiedad_update.venta))
          }

          // Alquiler
          if (this.propiedad_update.alquiler) {
            formData.append('alquiler', JSON.stringify(this.propiedad_update.alquiler))
          }

          // Condiciones de alquiler
          if (this.propiedad_update.condicion) {
            formData.append('condicion_alquiler', JSON.stringify(this.propiedad_update.condicion))
          }

          // Propietarios - enviar todos los cambios
          if (this.propietariosNuevos && this.propietariosNuevos.length > 0) {
            formData.append('propietarios_nuevos', JSON.stringify(this.propietariosNuevos))
          }

          if (this.propietariosEliminados && this.propietariosEliminados.length > 0) {
            formData.append('propietarios_eliminados', JSON.stringify(this.propietariosEliminados))
          }

          if (this.propietariosModificados && this.propietariosModificados.length > 0) {
            formData.append('propietarios_modificados', JSON.stringify(this.propietariosModificados))
          }
        }
        /* ----------------------------------------------------------------------------------------- */

        // Fotos existentes actualizadas
        if (this.propiedad_update?.fotos) {
          const fotasModificadas = this.propiedad_update.fotos.filter(foto => {
            const original = this.fotosOriginales.find(o => o.id === foto.id)
            if (!original) return false
            return foto.orden != original.orden || foto.notes != original.notes || foto.archivado != original.archivado
          })

          console.log('Fotos modificadas:', fotasModificadas.length > 0 ? fotasModificadas : 'Ninguna')

          if (fotasModificadas.length > 0) {
            const datos = fotasModificadas.map(f => ({ id: f.id, orden: f.orden ?? '', notes: f.notes ?? '', archivado: f.archivado ?? '' }))
            console.log('fotos_modificadas', datos)
            formData.append('fotos_modificadas', JSON.stringify(datos))
          }
        }
        // Fotos nuevas
        if (this.fotosPendientes.length > 0) {
          // Los archivos van separados (no se pueden JSONificar)
          this.fotosPendientes.forEach((foto, index) => {
            formData.append(`fotos_nuevas[${index}]`, foto.file)
          })
          // La metadata va como JSON
          const metaData = this.fotosPendientes.map((f, index) => ({
            index: index,
            nombre: f.file.name,
            orden: f.orden ?? '',
            comentario: f.comentario ?? '',
            archivado: f.archivado ?? 0
          }))
          console.log('fotos_nuevas archivos:', this.fotosPendientes.map(f => f.file.name))
          console.log('fotos_nuevas metadata:', metaData)
          formData.append('fotos_nuevas_data', JSON.stringify(metaData))
        }

        // Fotos eliminadas
        if (this.fotosEliminadas.length > 0) {
          console.log('Fotos eliminadas:', this.fotosEliminadas)
          formData.append('fotos_eliminadas', JSON.stringify(this.fotosEliminadas))
        }


        // Documentos nuevos
        if (this.documentosPendientes.length > 0) {
          this.documentosPendientes.forEach((doc, index) => {
            formData.append(`documentos_nuevos[${index}]`, doc.file)
          })
          const metaData = this.documentosPendientes.map((d, index) => ({
            index: index,
            nombre: d.file.name,
            comentario: d.comentario ?? ''
          }))
          console.log('documentos_nuevos metadata:', metaData)
          formData.append('documentos_nuevos_data', JSON.stringify(metaData))
        }

        // Documentos eliminados
        if (this.documentosEliminados.length > 0) {
          console.log('Documentos eliminados:', this.documentosEliminados)
          formData.append('documentos_eliminados', JSON.stringify(this.documentosEliminados))
        }

        // Documentos existentes modificados
        if (this.propiedad_update?.documentacion) {
          const docsModificados = this.propiedad_update.documentacion.filter(doc => {
            const original = this.documentosOriginales.find(o => o.id === doc.id)
            if (!original) return false
            return doc.notes != original.notes
          })
          if (docsModificados.length > 0) {
            const datos = docsModificados.map(d => ({ id: d.id, notes: d.notes ?? '' }))
            console.log('documentos_modificados:', datos)
            formData.append('documentos_modificados', JSON.stringify(datos))
          }
        }

        // Videos nuevos
        if (this.videosPendientes.length > 0) {
          this.videosPendientes.forEach((video, index) => {
            formData.append(`videos_nuevos[${index}]`, video.file)
          })
          const metaData = this.videosPendientes.map((v, index) => ({
            index: index,
            nombre: v.file.name,
            orden: v.orden ?? '',
            comentario: v.comentario ?? ''
          }))
          console.log('videos_nuevos metadata:', metaData)
          formData.append('videos_nuevos_data', JSON.stringify(metaData))
        }

        // Videos eliminados
        if (this.videosEliminados.length > 0) {
          console.log('Videos eliminados:', this.videosEliminados)
          formData.append('videos_eliminados', JSON.stringify(this.videosEliminados))
        }

        // Videos existentes modificados
        if (this.propiedad_update?.video) {
          const videosModificados = this.propiedad_update.video.filter(video => {
            const original = this.videosOriginales.find(o => o.id === video.id)
            if (!original) return false
            return video.notes != original.notes || video.archivado != original.archivado
          })
          if (videosModificados.length > 0) {
            const datos = videosModificados.map(v => ({ id: v.id, notes: v.notes ?? '', archivado: v.archivado }))
            console.log('videos_modificados:', datos)
            formData.append('videos_modificados', JSON.stringify(datos))
          }
        }


        // Enviar al backend
        const response = await actualizaPropiedad(formData)
        console.log('Respuesta:', response)

        this.showSuccess('Propiedad actualizada correctamente')
        // Mostrar mensaje de éxito
        // alert('Propiedad actualizada correctamente')

        // Opcional: recargar los datos
        await this.mostrarPropiedad()

      } catch (error) {
        console.error('Error actualizando propiedad:', error)
        alert('Error al actualizar la propiedad: ' + (error.response?.data?.message || error.message))
      }
    },
  },
  async mounted() {
    await this.mostrarPropiedad()
    this.cargarInmuebles()
    this.cargarZonas()
    this.cargarProvincias()
    this.cargarEstadosGenerales()
    this.cargarEstadosVenta()
    this.cargarEstadosAlquiler()
    this.cargarCaptadoresInternos()
    this.cargarAsesores()
    this.cargarCalles()

  },

}
</script>
