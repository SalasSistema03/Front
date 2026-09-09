<template>
  <!-- CONTENEDOR PADRE AL 100% DE ALTO Y SIN SCROLL GLOBAL -->
  <div class="d-flex flex-column vh-100 overflow-hidden bg-white">
    <NavComponent titulo="Actualizar Propiedad"></NavComponent>

    <div class="container-fluid px-3 py-2 d-flex flex-column flex-grow-1 overflow-hidden">

      <!-- SPINNER DE CARGA -->
      <div v-if="loading" class="d-flex flex-column justify-content-center align-items-center flex-grow-1">
        <div class="spinner-border text-primary mb-2" style="width: 2.5rem; height: 2.5rem;" role="status"></div>
        <h6 class="text-muted fw-bold">Cargando datos para edición...</h6>
      </div>

      <!-- FORMULARIO PRINCIPAL QUE ABSORBE EL ESPACIO (flex-grow-1) -->
      <form v-else class="row flex-grow-1 overflow-hidden m-0" autocomplete="off" @submit.prevent="actualizarPropiedad">

        <!-- ========================================== -->
        <!-- COLUMNA IZQUIERDA: FORMULARIO (h-100 con scroll) -->
        <!-- ========================================== -->
        <div class="col-lg-7 h-100 overflow-auto pe-lg-3 pb-3 custom-scrollbar border-end">

          <!-- ENCABEZADO CON BOTÓN DE MAPA -->
          <div class="d-flex justify-content-between align-items-center border-bottom pb-1 mb-2 mt-1">
            <h6 class="fw-bold text-primary mb-0 small text-uppercase">
              <i class="bi bi-pencil-square"></i> Datos Principales
            </h6>
            <button type="button" class="btn btn-sm btn-outline-danger shadow-sm fw-bold py-0 compact-btn"
              @click="abrirModalMapa">
              <i class="bi bi-pin-map-fill"></i> Modificar Mapa
            </button>
          </div>

          <!-- FILA 1: GEOGRAFÍA E INMUEBLE -->
          <div class="row g-1 mb-2">
            <div class="form-group col-md-3">
              <label class="form-label compact-label text-muted">Provincia</label>
              <select class="form-select compact-input shadow-sm" v-model="id_provincia">
                <option value="">Seleccione</option>
                <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">{{ provincia.name }}
                </option>
              </select>
            </div>
            <div class="form-group col-md-3">
              <label class="form-label compact-label text-muted">Localidad</label>
              <select class="form-select compact-input shadow-sm" v-model="id_localidad">
                <option value="">Seleccione</option>
                <option v-for="loc in localidades" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div class="form-group col-md-3">
              <label class="form-label compact-label text-muted">Zona</label>
              <select class="form-select compact-input shadow-sm" v-model="id_zona">
                <option value="">Seleccione</option>
                <option v-for="zona in zonas" :key="zona.id" :value="zona.id">{{ zona.name }}</option>
              </select>
            </div>
            <div class="form-group col-md-3">
              <label class="form-label compact-label text-muted">Inmueble</label>
              <select class="form-select compact-input shadow-sm" v-model="tipo_inmueble">
                <option value="">Seleccione</option>
                <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">{{ inmueble.inmueble }}
                </option>
              </select>
            </div>
          </div>

          <!-- FILA 2: DIRECCIÓN EXACTA -->
          <div class="row g-1 mb-2">
            <div class="form-group col-md-5">
              <label class="form-label compact-label text-muted">Calle</label>
              <div class="position-relative">
                <input type="text" class="form-control compact-input shadow-sm" placeholder="Buscar calle..."
                  v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarLista" @blur="ocultarSugerencias">
                <ul v-if="mostrarSugerencias && callesFiltradas.length"
                  class="position-absolute w-100 list-unstyled bg-white border shadow-sm busqueda-select"
                  style="z-index: 1050; max-height: 150px; overflow-y: auto;">
                  <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalle(calle)"
                    class="px-2 py-1 cursor-pointer hover:bg-light small">{{ calle.name }}</li>
                </ul>
              </div>
            </div>
            <div class="form-group col-md-2">
              <label class="form-label compact-label text-muted">Altura</label>
              <input type="number" class="form-control compact-input shadow-sm text-center" v-model="numero_calle">
            </div>
            <div class="form-group col-md-2">
              <label class="form-label compact-label text-muted">Piso</label>
              <input type="number" class="form-control compact-input shadow-sm text-center" v-model="piso">
            </div>
            <div class="form-group col-md-1">
              <label class="form-label compact-label text-muted">Dto</label>
              <input type="text" class="form-control compact-input shadow-sm text-center" v-model="departamento">
            </div>
            <div class="form-group col-md-2">
              <label class="form-label compact-label text-muted">PH</label>
              <select class="form-select compact-input shadow-sm" v-model="ph">
                <option value="NO">No</option>
                <option value="SI">Si</option>
              </select>
            </div>
          </div>

          <!-- FILA 3: OPERATIVA (LLAVES Y CARTEL) -->
          <div class="row g-1 mb-3">
            <div class="form-group col-md-2">
              <label class="form-label compact-label text-muted">N° Llave</label>
              <input type="number" class="form-control compact-input shadow-sm" v-model="llave">
            </div>
            <div class="form-group col-md-4">
              <label class="form-label compact-label text-muted">Obs. Llaves</label>
              <input type="text" class="form-control compact-input shadow-sm" placeholder="Observaciones..."
                v-model="comentario_llave">
            </div>
            <div class="form-group col-md-2">
              <label class="form-label compact-label text-muted">Cartel</label>
              <select class="form-select compact-input shadow-sm" v-model="cartel">
                <option value="NO">NO</option>
                <option value="SI">SI</option>
                <option value="PENDIENTE">PEND.</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label class="form-label compact-label text-muted">Obs. Cartel</label>
              <input type="text" class="form-control compact-input shadow-sm" placeholder="Observaciones..."
                v-model="comentario_cartel">
            </div>
          </div>

          <!-- PANEL DE MODALES DE GESTIÓN -->
          <h6 class="fw-bold text-primary border-bottom pb-1 mb-2 small text-uppercase">
            <i class="bi bi-ui-checks-grid"></i> Datos Complementarios
          </h6>

          <div class="row g-1 mb-2">
            <div class="col-6">
              <button type="button" class="btn btn-primary w-100 compact-btn shadow-sm" data-bs-toggle="modal"
                data-bs-target="#modalComodidades">Comodidades</button>
            </div>
            <div class="col-6">
              <button type="button" class="btn btn-primary w-100 compact-btn shadow-sm" data-bs-toggle="modal"
                data-bs-target="#modalDescripcion">Descripción</button>
            </div>
          </div>
          <div class="row g-1 mb-3">
            <div class="col-6">
              <button type="button" class="btn btn-secondary w-100 compact-btn shadow-sm" data-bs-toggle="modal"
                data-bs-target="#modalVentas">Datos Venta</button>
            </div>
            <div class="col-6">
              <button type="button" class="btn btn-secondary w-100 compact-btn shadow-sm" data-bs-toggle="modal"
                data-bs-target="#modalAlquiler">Datos Alquiler</button>
            </div>
          </div>

          <!-- BOTÓN FINAL DE GUARDADO -->
          <div class="mt-4 pt-3 border-top">
            <button type="submit" class="btn btn-success w-100 fw-bold shadow-sm"
              :disabled="!canSubmitPropertyUpdate || submitting">
              <i class="bi" :class="submitting ? 'bi-hourglass-split' : 'bi-cloud-check-fill'"></i>
              {{ submitting ? ' Guardando Cambios...' : ' Confirmar Actualización' }}
            </button>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- COLUMNA DERECHA: ARCHIVOS Y PROPIETARIOS -->
        <!-- ========================================== -->
        <div class="col-lg-5 h-100 overflow-auto custom-scrollbar ps-lg-3 mt-3 mt-lg-0 pb-3">

          <div class="card shadow-sm border-0 mb-3">
            <div class="card-header bg-light border-bottom py-2">
              <h6 class="fw-bold text-dark mb-0 small text-uppercase"><i class="bi bi-images"></i> Edición Multimedia
              </h6>
            </div>
            <div class="card-body p-2 bg-white">
              <div class="row g-1">
                <div class="col-4">
                  <button type="button" class="btn btn-outline-primary w-100 compact-btn fw-bold" data-bs-toggle="modal"
                    data-bs-target="#modalFotos"><i class="bi bi-camera"></i> Fotos</button>
                </div>
                <div class="col-4">
                  <button type="button" class="btn btn-outline-primary w-100 compact-btn fw-bold" data-bs-toggle="modal"
                    data-bs-target="#modalDocumentacion"><i class="bi bi-file-pdf"></i> Docs</button>
                </div>
                <div class="col-4">
                  <button type="button" class="btn btn-outline-primary w-100 compact-btn fw-bold" data-bs-toggle="modal"
                    data-bs-target="#modalVideos"><i class="bi bi-camera-video"></i> Videos</button>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0">
            <div class="card-header bg-light border-bottom py-2">
              <h6 class="fw-bold text-dark mb-0 small text-uppercase"><i class="bi bi-person-lines-fill"></i> Edición
                Propietarios</h6>
            </div>
            <div class="card-body p-2 bg-white">
              <button type="button" class="btn btn-outline-dark w-100 compact-btn fw-bold"
                @click="showModalPropietarios = true">
                <i class="bi bi-person-gear"></i> Gestionar Propietarios
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- MODAL MAPA EDICIÓN (Nuevo) -->
  <!-- ========================================== -->
  <div class="modal fade" tabindex="-1" :class="{ 'show d-block': mostrarModalMapa }" v-if="mostrarModalMapa"
    style="background-color: rgba(0,0,0,0.6); z-index: 1060;">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-lg border-0">
        <div class="modal-header bg-danger text-white py-2">
          <h6 class="modal-title fw-bold mb-0"><i class="bi bi-pin-map-fill"></i> Modificar Ubicación</h6>
          <button type="button" class="btn-close btn-close-white" @click="cerrarModalMapa"></button>
        </div>
        <div class="modal-body p-0 position-relative">
          <div class="p-2 bg-light border-bottom">
            <p class="mb-0 text-dark fw-semibold small text-center" style="font-size: 0.8rem;">
              <i class="bi bi-info-circle text-primary"></i> Arrastrá el marcador rojo para actualizar las coordenadas.
            </p>
          </div>
          <div id="mapa-edicion" style="height: 350px; width: 100%;"></div>
        </div>
        <div class="modal-footer bg-light py-1">
          <!-- BOTÓN DE GOOGLE MAPS DINÁMICO -->
          <div>
            <a v-if="enlaceGoogleMaps" :href="enlaceGoogleMaps" target="_blank" class="btn btn-sm btn-outline-primary fw-bold shadow-sm">
              <i class="bi bi-google"></i> Ver Dir. en Google
            </a>
          </div>
          
          <button type="button" class="btn btn-sm btn-secondary fw-bold" @click="cerrarModalMapa">Cancelar</button>
          <button type="button" class="btn btn-sm btn-success fw-bold px-3" @click="guardarNuevasCoordenadas"
            :disabled="guardandoMapa">
            <i class="bi" :class="guardandoMapa ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
            {{ guardandoMapa ? 'Guardando...' : 'Confirmar Coordenadas' }}
          </button>
        </div>
      </div>
    </div>
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
          <div class="col-md-12 row align-items-star form-group mb-3">
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
                <img :src="'http://10.10.10.191' + foto.url" class="card-img-top img-thumbnail"
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
          <div class="col-md-12 row align-items-star form-group mb-3">
            <div class="col-md-2">
              <label for="documentos" class="form-label">Seleccionar Documentos</label>
            </div>
            <div class="col-md-6 mb-2">
              <input type="file" class="form-control" id="documentos" accept="image/*,application/pdf" multiple
                @change="agregarDocumentosPendientes">
            </div>
            <!-- <div class="col-md-3 mb-2">
              <button type="button" class="btn btn-primary btn-sm w-100" @click="confirmarDocumentosPendientes">
                Subir Documento
              </button>
            </div> -->
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
                  <embed v-if="documento.url.endsWith('.pdf')" :src="'http://10.10.10.191' + documento.url"
                    class="w-100 h-100 border-0" type="application/pdf">
                  <img v-else :src="'http://10.10.10.191' + documento.url" class="w-100 h-100 img-thumbnail"
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
          <div class="col-md-12 row align-items-star form-group mb-3">
            <div class="col-md-2">
              <label for="videos" class="form-label">Seleccionar Videos</label>
            </div>
            <div class="col-md-6 mb-2">
              <input type="file" class="form-control" id="videos" accept="video/*" multiple
                @change="agregarVideosPendientes">
            </div>
            <!-- <div class="col-md-3 mb-2">
              <button type="button" class="btn btn-primary btn-sm w-100" @click="confirmarVideosPendientes">
                Subir Video
              </button>
            </div> -->
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
                <video :src="'http://10.10.10.191' + video.url" class="card-img-top img-thumbnail"
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

  <ModalPropiedadAlquiler :estados-alquiler="estadosAlquiler" :captadores-internos="captadoresInternos"
    :propiedad-update="propiedad_update" @update:alquiler="actualizarAlquiler">
  </ModalPropiedadAlquiler>

  <ModalCondicionAlquiler :propiedad-update="propiedad_update" @update:condicion_alquiler="actualizarCondicion">
  </ModalCondicionAlquiler>

  <ModalPropiedadPropietario :propiedad="propiedad_update" :mostrar-buscador="true" :mostrar-quitar="true"
    :show="showModalPropietarios" @propietarios-cambiados="handlePropietariosCambiados"
    @close="showModalPropietarios = false">
  </ModalPropiedadPropietario>

</template>

<script>
// Tus importaciones habituales
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
import { getUser } from '../../Services/api/Usuario/userApi'
import { canSubmitPropertyUpdate } from '../../utils/propertyUpdateGuard'

// IMPORTAMOS LOCALIDADES Y LEAFLET
import { useLocalidades } from '../../composables/atcl/useLocalidades'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})
L.Marker.prototype.options.icon = DefaultIcon

export default {
  name: 'PropiedadUpdateView',
  components: {
    NavComponent, ModalPropiedadComodidades, ModalPropiedadDescripcion, ModalPropiedadVenta,
    ModalPropiedadAlquiler, ModalCondicionAlquiler, ModalPropiedadPropietario
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

    // AGREGAMOS LOCALIDADES AL SETUP
    const { localidades, error: localidadesError, cargarLocalidades } = useLocalidades()

    return {
      showWarning, showError, showSuccess,
      callesFiltradas, mostrarSugerencias, calleSeleccionada, calleId, cargarCalles, filtrarCalles, seleccionarCalle, ocultarSugerencias, mostrarLista,
      inmuebles, error, cargarInmuebles, zonas, zonasError, cargarZonas, provincias, provinciasError, cargarProvincias,
      estadosGenerales, estadosGeneralesError, cargarEstadosGenerales, estadosVenta, estadosVentaError, cargarEstadosVenta,
      estadosAlquiler, estadosAlquilerError, cargarEstadosAlquiler, captadoresInternos, captadoresInternosError, cargarCaptadoresInternos,
      asesores, asesoresError, cargarAsesores, localidades, localidadesError, cargarLocalidades
    }
  },
  data() {
    return {
      showModalPropietarios: false,
      propiedad_update: null,
      loading: true, loadFailed: false, submitting: false,
      numero_calle: '', piso: '', departamento: '', llave: '', comentario_llave: '', comentario_cartel: '',
      ph: '', tipo_inmueble: '', id_zona: '', id_provincia: '',
      id_localidad: '', // NUEVO CAMPO LOCALIDAD
      cartel: '',
      fotosPendientes: [], fotosEliminadas: [], fotosOriginales: [],
      documentosPendientes: [], documentosEliminados: [], documentosOriginales: [],
      videosPendientes: [], videosEliminados: [], videosOriginales: [],
      propietariosNuevos: [], propietariosEliminados: [], propietariosModificados: [], propietariosOriginales: [],
      id: null,

      // VARIABLES DEL MAPA
      mostrarModalMapa: false,
      mapaInstancia: null,
      marcadorInstancia: null,
      guardandoMapa: false,
      nuevasCoordenadas: { lat: null, lng: null }
    }
  },
  computed: {
    // 🟢 NUEVA FUNCIÓN: Genera el link de Google Maps en tiempo real
    enlaceGoogleMaps() {
      // Si no hay calle ni altura, no armamos el link
      if (!this.calleSeleccionada || !this.numero_calle) return '';
      
      // Rescatamos los nombres usando los IDs seleccionados en los combos
      const nombreProvincia = this.provincias.find(p => p.id == this.id_provincia)?.name || '';
      const nombreLocalidad = this.localidades.find(l => l.id == this.id_localidad)?.name || '';
      
      // Armamos la dirección de búsqueda
      const query = `${this.calleSeleccionada} ${this.numero_calle}, ${nombreLocalidad}, ${nombreProvincia}, Argentina`;
      
      // Retornamos la URL oficial de búsqueda de Google Maps
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    },
    canSubmitPropertyUpdate() {
      return canSubmitPropertyUpdate({ loading: this.loading, submitting: this.submitting, loadFailed: this.loadFailed, property: this.propiedad_update })
    },
    fotosOrdenadas() {
      // (Mantener tu lógica original de fotos)
      if (!this.propiedad_update || !this.propiedad_update.fotos) return [];
      return [...this.propiedad_update.fotos].sort((a, b) => {
        if (a.orden !== null && b.orden !== null) return a.orden - b.orden;
        if (a.orden !== null) return -1;
        if (b.orden !== null) return 1;
        return a.id - b.id;
      });
    }
  },
  methods: {
    actualizarComodidades(comodidades) {
      if (!this.propiedad_update) { this.propiedad_update = {} }
      this.propiedad_update.comodidades = comodidades
    },
    actualizarDescripcion(descripcion) {
      if (!this.propiedad_update) { this.propiedad_update = {} }
      this.propiedad_update.descripcion = descripcion
    },
    actualizarVenta(venta) {
      if (!this.propiedad_update) { this.propiedad_update = {} }
      this.propiedad_update.venta = venta
    },
    actualizarAlquiler(alquiler) {
      if (!this.propiedad_update) { this.propiedad_update = {} }
      this.propiedad_update.alquiler = alquiler
    },
    actualizarCondicion(condicion) {
      if (!this.propiedad_update) { this.propiedad_update = {} }
      this.propiedad_update.condicion = condicion
    },
    
    // 1. MÉTODO PARA ESCUCHAR AL MODAL DE PROPIETARIOS
    handlePropietariosCambiados(propietariosActuales) {
      // Reiniciamos los arrays
      this.propietariosNuevos = []
      this.propietariosEliminados = []
      this.propietariosModificados = []

      // Detectar eliminados
      this.propietariosOriginales.forEach(original => {
        const existe = propietariosActuales.find(actual => actual.id === original.id)
        if (!existe) {
          this.propietariosEliminados.push(original.id)
        }
      })

      // Detectar nuevos y modificados
      propietariosActuales.forEach(actual => {
        const original = this.propietariosOriginales.find(orig => orig.id === actual.id)

        if (!original) {
          // ES UN PROPIETARIO NUEVO
          this.propietariosNuevos.push(actual)
        } else {
          // ES UN PROPIETARIO EXISTENTE (Verificar si fue modificado)
          const obsActual = actual.pivot?.observaciones_baja || actual.pivot?.observaciones || ''
          const obsOriginal = original.pivot?.observaciones_baja || original.pivot?.observaciones || ''

          const bajaActual = actual.pivot?.baja || 'no'
          const bajaOriginal = original.pivot?.baja || 'no'

          // Si cambió el comentario o el estado de baja...
          if (obsActual !== obsOriginal || bajaActual !== bajaOriginal) {
            this.propietariosModificados.push({
              id: actual.id,
              observaciones_baja: obsActual,
              baja: bajaActual
            })
          }
        }
      })
    },
    // 1. Formatear fecha para mostrar
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    },

    // 2. Validar cuando cambia el orden de una foto
    validarCambioOrden(fotoActual) {
      const ordenesUsados = new Set()
      const todasLasFotos = [
        ...(this.propiedad_update?.fotos || []),
        ...(this.fotosPendientes || [])
      ]

      for (const foto of todasLasFotos) {
        if (foto !== fotoActual && foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
          ordenesUsados.add(foto.orden)
        }
      }

      if (fotoActual.orden !== null && fotoActual.orden !== undefined && fotoActual.orden !== '' && ordenesUsados.has(fotoActual.orden)) {
        this.showError(`El número de orden ${fotoActual.orden} ya está siendo usado por otra foto`)
        this.$nextTick(() => {
          const original = this.fotosOriginales?.find(f => f.id === fotoActual.id)
          fotoActual.orden = original?.orden || null
        })
      }
    },

    // 3. Validar que no haya números de orden duplicados
    validarOrdenFotos() {
      const ordenesUsados = new Set()

      if (this.propiedad_update && this.propiedad_update.fotos) {
        for (const foto of this.propiedad_update.fotos) {
          if (foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
            if (ordenesUsados.has(foto.orden)) {
              return { valido: false, mensaje: `El número de orden ${foto.orden} está duplicado en las fotos existentes` }
            }
            ordenesUsados.add(foto.orden)
          }
        }
      }

      for (const foto of this.fotosPendientes) {
        if (foto.orden !== null && foto.orden !== undefined && foto.orden !== '') {
          if (ordenesUsados.has(foto.orden)) {
            return { valido: false, mensaje: `El número de orden ${foto.orden} ya está siendo usado por otra foto` }
          }
          ordenesUsados.add(foto.orden)
        }
      }

      return { valido: true }
    },

    // ==========================================
    // MULTIMEDIA: FOTOS
    // ==========================================
    agregarFotosPendientes(event) {
      const archivos = Array.from(event.target.files)
      archivos.forEach(file => {
        this.fotosPendientes.push({
          file: file,
          preview: URL.createObjectURL(file),
          comentario: '',
          orden: null,
          archivado: 0 // Corrección agregada aquí
        })
      })
      event.target.value = '' // Limpiar input
    },
    quitarFotoPendiente(index) {
      URL.revokeObjectURL(this.fotosPendientes[index].preview) // liberar memoria
      this.fotosPendientes.splice(index, 1)
    },
    eliminarFotoExistente(fotoId) {
      if (!confirm('¿Eliminar esta foto?')) return
      this.propiedad_update.fotos = this.propiedad_update.fotos.filter(f => f.id !== fotoId)
      this.fotosEliminadas.push(fotoId)
    },

    // ==========================================
    // MULTIMEDIA: DOCUMENTOS
    // ==========================================
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
    quitarDocumentoPendiente(index) {
      URL.revokeObjectURL(this.documentosPendientes[index].preview)
      this.documentosPendientes.splice(index, 1)
    },
    eliminarDocumentoExistente(docId) {
      if (!confirm('¿Eliminar este documento?')) return
      this.propiedad_update.documentacion = this.propiedad_update.documentacion.filter(d => d.id !== docId)
      this.documentosEliminados.push(docId)
    },

    // ==========================================
    // MULTIMEDIA: VIDEOS
    // ==========================================
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
    quitarVideoPendiente(index) {
      URL.revokeObjectURL(this.videosPendientes[index].preview)
      this.videosPendientes.splice(index, 1)
    },
    eliminarVideoExistente(videoId) {
      if (!confirm('¿Eliminar este video?')) return
      this.propiedad_update.video = this.propiedad_update.video.filter(v => v.id !== videoId)
      this.videosEliminados.push(videoId)
    },
    // (Omito acá por brevedad, dejá tus métodos exactos como los pasaste)

    // LÓGICA DEL MAPA
async abrirModalMapa() {
      this.mostrarModalMapa = true;
      
      // 1. Coordenadas por defecto (Centro de Santa Fe)
      let lat = -31.637321;
      let lng = -60.694612;

      // 2. Si la base de datos ya tiene las coordenadas exactas, priorizamos esas
      if (this.propiedad_update?.latitud && this.propiedad_update?.longitud) {
        lat = this.propiedad_update.latitud;
        lng = this.propiedad_update.longitud;
      } 
      // 3. Si NO hay coordenadas, pero el usuario ya cargó la calle y altura, buscamos la dirección
      else if (this.calleSeleccionada && this.numero_calle) {
        try {
          // Rescatamos el nombre en texto de la provincia y localidad usando los IDs seleccionados
          const nombreProvincia = this.provincias.find(p => p.id == this.id_provincia)?.name || '';
          const nombreLocalidad = this.localidades.find(l => l.id == this.id_localidad)?.name || '';
          
          // Armamos el string de búsqueda (Ej: "San Martin 2500, Santa Fe, Santa Fe, Argentina")
          const query = `${this.calleSeleccionada} ${this.numero_calle}, ${nombreLocalidad}, ${nombreProvincia}, Argentina`;
          
          // Consultamos a la API de Nominatim
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
          const response = await fetch(url);
          const data = await response.json();
          
          // Si encuentra resultados, tomamos la lat y lng del primer resultado
          if (data && data.length > 0) {
            lat = parseFloat(data[0].lat);
            lng = parseFloat(data[0].lon);
          }
        } catch (error) {
          console.error("Error buscando la dirección en el mapa:", error);
          // Si falla la conexión o no encuentra la calle, simplemente caerá en el default de Santa Fe
        }
      }

      this.nuevasCoordenadas.lat = lat;
      this.nuevasCoordenadas.lng = lng;

      // 4. Renderizamos el mapa de Leaflet
      this.$nextTick(() => {
        if (this.mapaInstancia) {
          this.mapaInstancia.remove();
          this.mapaInstancia = null;
        }
        
        this.mapaInstancia = L.map('mapa-edicion').setView([lat, lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.mapaInstancia);

        this.marcadorInstancia = L.marker([lat, lng], { draggable: true }).addTo(this.mapaInstancia);
        
        const popupHTML = `
          <div style="min-width: 150px; text-align: center;">
            <h6 class="fw-bold mb-1 text-danger"><i class="bi bi-geo-alt"></i> Ubicación Estimada</h6>
            <p class="small text-muted mb-0">Arrastrá este pin para corregir la posición exacta.</p>
          </div>
        `;
        this.marcadorInstancia.bindPopup(popupHTML).openPopup();

        this.marcadorInstancia.on('dragend', (event) => {
          const posicion = event.target.getLatLng();
          this.nuevasCoordenadas.lat = posicion.lat;
          this.nuevasCoordenadas.lng = posicion.lng;
        });

        setTimeout(() => {
          if (this.mapaInstancia) {
            this.mapaInstancia.invalidateSize();
            this.mapaInstancia.setView([this.nuevasCoordenadas.lat, this.nuevasCoordenadas.lng], 16);
          }
        }, 300);
      });
    },
    cerrarModalMapa() {
      this.mostrarModalMapa = false;
    },
    guardarNuevasCoordenadas() {
      // Como esto es un form de update, lo ideal es guardarlo temporalmente y que se envíe 
      // al backend recién cuando el usuario toca "Editar Propiedad", o bien mandarlo por api directo.
      this.propiedad_update.latitud = this.nuevasCoordenadas.lat;
      this.propiedad_update.longitud = this.nuevasCoordenadas.lng;
      this.cerrarModalMapa();
      this.showSuccess('Coordenadas listas para ser guardadas.');
    },

    // 2. MÉTODO PARA CARGAR LOS DATOS (COMPLETO)
    async mostrarPropiedad() {
      this.loadFailed = false
      try {
        const id = this.$route.params.id
        const response = await muestraPropiedad({ id: id })

        if (!response.data.success) {
          this.error = response.data.message || 'No se pudo cargar la propiedad'
          return
        }

        this.propiedad_update = response.data.data
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
        this.id_localidad = this.propiedad_update.id_localidad || ''
        this.cartel = this.propiedad_update.cartel
        this.calleSeleccionada = this.propiedad_update.calle?.name || ''
        this.calleId = this.propiedad_update.calle?.id || ''

        // GUARDAMOS LOS ORIGINALES PARA COMPARAR DESPUÉS
        if (response.data.data.fotos && Array.isArray(response.data.data.fotos)) {
          this.fotosOriginales = response.data.data.fotos.map(f => ({ id: f.id, orden: f.orden, notes: f.notes, updated_at: f.updated_at, archivado: f.archivado }))
        } else { this.fotosOriginales = [] }

        if (response.data.data.documentacion && Array.isArray(response.data.data.documentacion)) {
          this.documentosOriginales = response.data.data.documentacion.map(d => ({ id: d.id, notes: d.notes }))
        } else { this.documentosOriginales = [] }

        if (response.data.data.video && Array.isArray(response.data.data.video)) {
          this.videosOriginales = response.data.data.video.map(v => ({ id: v.id, notes: v.notes }))
        } else { this.videosOriginales = [] }

        // PROPIETARIOS ORIGINALES SEGUROS
        this.propietariosOriginales = (response.data.data.propietarios || []).map(p => ({
          id: p.id,
          pivot: {
            observaciones_baja: p.pivot?.observaciones_baja || p.pivot?.observaciones || '',
            baja: p.pivot?.baja || 'no'
          }
        }))

      } catch (error) {
        this.loadFailed = true
        this.error = 'No se pudo cargar la propiedad'
      } finally {
        this.loading = false
      }
    },

    // 3. MÉTODO PARA ENVIAR LOS DATOS (COMPLETO)
    async actualizarPropiedad() {
      const id_usuario = await getUser(localStorage.getItem('token'))
      const formData = new FormData()

      // 🟢 LÍNEA CLAVE: Engañamos al backend para que acepte archivos en un update
      formData.append('_method', 'PUT')

      // DATOS PRINCIPALES
      formData.append('id', this.$route.params.id)
      formData.append('calle_id', this.calleId ?? '')
      formData.append('numero_calle', this.numero_calle ?? '')
      if (!this.canSubmitPropertyUpdate) {
        this.showWarning('Esperá a que termine de cargarse la propiedad antes de guardar.')
        return
      }

      this.submitting = true
      try {
        const validacion = this.validarOrdenFotos ? this.validarOrdenFotos() : { valido: true }
        if (!validacion.valido) {
          this.showError(validacion.mensaje)
          this.submitting = false
          return
        }

        const id_usuario = await getUser(localStorage.getItem('token'))
        const formData = new FormData()

        // DATOS PRINCIPALES
        formData.append('id', this.$route.params.id)
        formData.append('calle_id', this.calleId ?? '')
        formData.append('numero_calle', this.numero_calle ?? '')
        formData.append('piso', this.piso ?? '')
        formData.append('departamento', this.departamento ?? '')
        formData.append('ph', this.ph ?? '')
        formData.append('id_inmueble', this.tipo_inmueble ?? '')
        formData.append('id_zona', this.id_zona ?? '')
        formData.append('id_provincia', this.id_provincia ?? '')
        formData.append('id_localidad', this.id_localidad ?? '')

        if (this.propiedad_update?.latitud) formData.append('latitud', this.propiedad_update.latitud)
        if (this.propiedad_update?.longitud) formData.append('longitud', this.propiedad_update.longitud)

        formData.append('llave', this.llave ?? '')
        formData.append('comentario_llave', this.comentario_llave ?? '')
        formData.append('cartel', this.cartel ?? '')
        formData.append('comentario_cartel', this.comentario_cartel ?? '')
        formData.append('id_usuario', id_usuario.data.id)

        // DATOS DE LOS MODALES
        if (this.propiedad_update) {
          if (this.propiedad_update.comodidades) formData.append('comodidades', JSON.stringify(this.propiedad_update.comodidades))
          if (this.propiedad_update.descripcion) formData.append('descripcion', JSON.stringify(this.propiedad_update.descripcion))
          if (this.propiedad_update.venta) formData.append('venta', JSON.stringify(this.propiedad_update.venta))
          if (this.propiedad_update.alquiler) formData.append('alquiler', JSON.stringify(this.propiedad_update.alquiler))
          if (this.propiedad_update.condicion) formData.append('condicion_alquiler', JSON.stringify(this.propiedad_update.condicion))
        }

        // ENVIAR PROPIETARIOS A LARAVEL
        if (this.propietariosNuevos && this.propietariosNuevos.length > 0) {
          formData.append('propietarios_nuevos', JSON.stringify(this.propietariosNuevos))
        }
        if (this.propietariosEliminados && this.propietariosEliminados.length > 0) {
          formData.append('propietarios_eliminados', JSON.stringify(this.propietariosEliminados))
        }
        if (this.propietariosModificados && this.propietariosModificados.length > 0) {
          formData.append('propietarios_modificados', JSON.stringify(this.propietariosModificados))
        }

        // MULTIMEDIA FOTOS
        if (this.propiedad_update?.fotos) {
          const fotasModificadas = this.propiedad_update.fotos.filter(foto => {
            const original = this.fotosOriginales.find(o => o.id === foto.id)
            if (!original) return false
            return foto.orden != original.orden || foto.notes != original.notes || foto.archivado != original.archivado
          })
          if (fotasModificadas.length > 0) {
            const datos = fotasModificadas.map(f => ({ id: f.id, orden: f.orden ?? '', notes: f.notes ?? '', archivado: f.archivado ?? '' }))
            formData.append('fotos_modificadas', JSON.stringify(datos))
          }
        }

        if (this.fotosPendientes && this.fotosPendientes.length > 0) {
          this.fotosPendientes.forEach((foto, index) => {
            formData.append(`fotos_nuevas[${index}]`, foto.file)
          })
          const metaData = this.fotosPendientes.map((f, index) => ({
            index: index, nombre: f.file.name, orden: f.orden ?? '', comentario: f.comentario ?? '', archivado: f.archivado ?? 0
          }))
          formData.append('fotos_nuevas_data', JSON.stringify(metaData))
        }

        if (this.fotosEliminadas && this.fotosEliminadas.length > 0) {
          formData.append('fotos_eliminadas', JSON.stringify(this.fotosEliminadas))
        }

        // MULTIMEDIA DOCUMENTOS
        if (this.documentosPendientes && this.documentosPendientes.length > 0) {
          this.documentosPendientes.forEach((doc, index) => { formData.append(`documentos_nuevos[${index}]`, doc.file) })
          const metaData = this.documentosPendientes.map((d, index) => ({ index: index, nombre: d.file.name, comentario: d.comentario ?? '' }))
          formData.append('documentos_nuevos_data', JSON.stringify(metaData))
        }
        if (this.documentosEliminados && this.documentosEliminados.length > 0) {
          formData.append('documentos_eliminados', JSON.stringify(this.documentosEliminados))
        }
        if (this.propiedad_update?.documentacion) {
          const docsModificados = this.propiedad_update.documentacion.filter(doc => {
            const original = this.documentosOriginales.find(o => o.id === doc.id)
            if (!original) return false
            return doc.notes != original.notes
          })
          if (docsModificados.length > 0) {
            const datos = docsModificados.map(d => ({ id: d.id, notes: d.notes ?? '' }))
            formData.append('documentos_modificados', JSON.stringify(datos))
          }
        }

        // MULTIMEDIA VIDEOS
        if (this.videosPendientes && this.videosPendientes.length > 0) {
          this.videosPendientes.forEach((video, index) => { formData.append(`videos_nuevos[${index}]`, video.file) })
          const metaData = this.videosPendientes.map((v, index) => ({ index: index, nombre: v.file.name, orden: v.orden ?? '', comentario: v.comentario ?? '' }))
          formData.append('videos_nuevos_data', JSON.stringify(metaData))
        }
        if (this.videosEliminados && this.videosEliminados.length > 0) {
          formData.append('videos_eliminados', JSON.stringify(this.videosEliminados))
        }
        if (this.propiedad_update?.video) {
          const videosModificados = this.propiedad_update.video.filter(video => {
            const original = this.videosOriginales.find(o => o.id === video.id)
            if (!original) return false
            return video.notes != original.notes || video.archivado != original.archivado
          })
          if (videosModificados.length > 0) {
            const datos = videosModificados.map(v => ({ id: v.id, notes: v.notes ?? '', archivado: v.archivado }))
            formData.append('videos_modificados', JSON.stringify(datos))
          }
        }

        // PETICIÓN AL BACKEND
        const response = await actualizaPropiedad(formData)

        if (response.data.success) {
          this.showSuccess('Propiedad actualizada correctamente')
          this.$router.push(`/propiedad-detalle/${this.$route.params.id}`)
        }
      } catch (error) {
        this.showError((error.response?.data?.message || error.message))
      } finally {
        this.submitting = false
      }
    }


    

  },
  async mounted() {
    // 1. Nos aseguramos de que el spinner esté activo
    this.loading = true;

    try {
      // 2. Esperamos a que TODOS los catálogos principales se carguen PRIMERO
      await Promise.all([
        this.cargarInmuebles(),
        this.cargarZonas(),
        this.cargarProvincias(),
        this.cargarLocalidades(),
        this.cargarCalles()
      ]);

      // Estos catálogos son de los modales, pueden cargar de fondo sin trabar la vista
      this.cargarEstadosGenerales();
      this.cargarEstadosVenta();
      this.cargarEstadosAlquiler();
      this.cargarCaptadoresInternos();
      this.cargarAsesores();

      // 3. AHORA SÍ: con los selects llenos de opciones, traemos la propiedad
      await this.mostrarPropiedad();
      // (Recordá que mostrarPropiedad() ya tiene un finally { this.loading = false } internamente)

    } catch (error) {
      console.error('Error inicializando la vista:', error);
      this.loading = false;
    }
  }
}
</script>

<style scoped>
/* ESTILOS DE DENSIDAD DE PANTALLA Y SCROLLS */

.compact-label {
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.1rem;
  letter-spacing: 0.2px;
}

.compact-input {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  min-height: 28px;
  height: 28px;
}

.compact-btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  min-height: 28px;
}

/* ESTILIZACIÓN DEL SCROLLBAR */
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

/* ESTILOS DEL POPUP DEL MAPA (Tomados de PropiedadBusquedaMap) */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
:deep(.leaflet-popup-content) {
  margin: 15px;
}
</style>