<template>
    <NavComponent titulo="Propiedad Update"></NavComponent>
    <div class="px-3">
        <form class="row d-flex align-items-start px-3" autocomplete="off">
            <div class="col-md-6 row">
                <div class="form-group col-md-4 px-1">
                    <label for="input-calle" class="form-label">Calle</label>
                    <div class="position-relative">
                        <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
                            v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarSugerencias = true"
                            @blur="ocultarSugerencias">

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
                    <input type="number" class="form-control form-control-sm" id="input-altura" placeholder="Altura">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-piso" class="form-label">PH</label>
                    <select name="input-ph" id="input-ph" class="form-select form-select-sm">
                        <option value="0">No</option>
                        <option value="1">Si</option>
                    </select>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-piso" class="form-label">Piso</label>
                    <input type="number" class="form-control form-control-sm" id="input-piso" placeholder="Piso">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="select-tipo-propiedad" class="form-label">Dto</label>
                    <input type="text" class="form-control form-control-sm" id="select-tipo-propiedad"
                        placeholder="Dto">
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-piso" class="form-label">Inmueble</label>
                    <select class="form-select form-select-sm">
                        <option value="">Seleccione</option>
                        <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
                            {{ inmueble.inmueble }}
                        </option>
                    </select>
                </div>
                <div class="form-group col-md-4 px-1">
                    <label for="input-numero-propiedad" class="form-label">Zona</label>
                    <select class="form-select form-select-sm" id="input-zona" name="input-zona">
                        <option value="">Seleccione</option>
                        <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
                            {{ zona.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group col-md-5 px-1">
                    <label for="input-numero-propiedad" class="form-label">Provincia</label>
                    <select class="form-select form-select-sm" name="provincia" id="input-provincia">
                        <option value="">Seleccione</option>
                        <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
                            {{ provincia.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-llave" class="form-label">Llave</label>
                    <input type="number" class="form-control form-control-sm" id="input-llave" placeholder="Llave">
                </div>
                <div class="form-group col-md-9 px-1 pt-3">
                    <!-- <label for="input-observaciones" class="form-label"></label> -->
                    <textarea class="form-control form-control-sm" id="input-observaciones"
                        placeholder="Observaciones de Llaves"></textarea>
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-numero-propiedad" class="form-label">Cartel</label>
                    <select class="form-select form-select-sm" name="cartel" id="input-cartel">
                        <option value="0">Si</option>
                        <option value="1">No</option>

                    </select>
                </div>
                <div class="form-group col-md-9 px-1 pt-3">
                    <textarea class="form-control form-control-sm" id="input-observaciones-cartel"
                        placeholder="Observaciones de Cartel"></textarea>
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
                <button class="btn btn-primary w-50">Editar Propiedad</button>
            </div>
        </form>
    </div>








    <!-- Modal Fotos-->
    <div class="modal fade" id="modalFotos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalFotosLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
            <div class=" modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalFotosLabel">Editar Fotos</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex justify-content-center row">

                    <form autocomplete="off" class="col-md-12row rowd-flex justify-content-center align-items-center form-group">
                        <div class="col-md-12 ">
                            <!-- Formulario de carga de varias fotos con detalles y previsualización dentro de un carrusel -->
                            <label for="fotos" class="form-label ">Seleccionar Fotos</label>
                        </div>
                        <div class="col-md-12 mb-2">
                            <input type="file" class="form-control form-select " id="fotos" name="fotos[]"
                                accept="image/*,application/pdf" multiple>
                        </div>
                        <div class="col-md-12 mb-2">
                            <button type="submit" class="btn btn-primary btn-sm w-100">Subir Foto</button>
                        </div>
                    </form>
                    <hr>

                    <div class="col-md-12 row atcl_contenedorfoto_tamaño form-group">
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                      


                    </div>












                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Understood</button>
                </div> -->
            </div>
        </div>
    </div>
    <!-- Modal Documentacion-->
    <div class="modal fade" id="modalDocumentacion" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalDocumentacionLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
            <div class=" modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalDocumentacionLabel">Editar Documentación</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex justify-content-center row">

                    <form autocomplete="off" class="col-md-12row rowd-flex justify-content-center align-items-center form-group">
                        <div class="col-md-12 ">
                            <!-- Formulario de carga de varias fotos con detalles y previsualización dentro de un carrusel -->
                            <label for="fotos" class="form-label ">Seleccionar Documentacion</label>
                        </div>
                        <div class="col-md-12 mb-2">
                            <input type="file" class="form-control form-select " id="fotos" name="fotos[]"
                                accept="image/*,application/pdf" multiple>
                        </div>
                        <div class="col-md-12 mb-2">
                            <button type="submit" class="btn btn-primary btn-sm w-100">Subir Foto</button>
                        </div>
                    </form>
                    <hr>

                    <div class="col-md-12 row atcl_contenedorfoto_tamaño form-group">
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                      


                    </div>












                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Understood</button>
                </div> -->
            </div>
        </div>
    </div>
    <!-- Modal Videos-->
    <div class="modal fade" id="modalVideos" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalVideosLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
            <div class=" modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalVideosLabel">Editar Videos</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex justify-content-center row">

                    <form autocomplete="off" class="col-md-12row rowd-flex justify-content-center align-items-center form-group">
                        <div class="col-md-12 ">
                            <!-- Formulario de carga de varias fotos con detalles y previsualización dentro de un carrusel -->
                            <label for="fotos" class="form-label ">Seleccionar Videos</label>
                        </div>
                        <div class="col-md-12 mb-2">
                            <input type="file" class="form-control form-select " id="fotos" name="fotos[]"
                                accept="image/*,application/pdf" multiple>
                        </div>
                        <div class="col-md-12 mb-2">
                            <button type="submit" class="btn btn-primary btn-sm w-100">Subir Foto</button>
                        </div>
                    </form>
                    <hr>

                    <div class="col-md-12 row atcl_contenedorfoto_tamaño form-group">
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                        <form method="POST" class="col-md-6 row d-flex justify-content-between align-items-center">
                            <div
                                class="col-md-12 mb-2 d-flex justify-content-center align-items-center  atcl_cargar_foto_tamaño">
                                <img class="card-img-top img-thumbnail " alt="Imagen de propiedad">
                            </div>
                            <div class="col-md-12 mb-2">
                                <textarea name="notes" class="form-control text-center" rows="1"
                                    placeholder="Escribe una nota..."></textarea>
                            </div>
                            <div class="col-md-2 mb-2">
                                <label>Orden</label>
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="number" name="orden" value="{{ $foto->orden }}" class="form-control">
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label">Archivar</label>
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="checkbox" class="form-controL">
                            </div>
                            <div class="col-md-12 mb-2">
                                <input type="file" name="nueva_foto" class="form-control">
                            </div>
                            <div class="col-md-12 mb-2">
                                <button type="submit" class="btn btn-primary btn-sm w-100">Actualizar</button>
                            </div>
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-danger btn-sm w-100">Eliminar</button>
                            </div>
                        </form>
                      


                    </div>












                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Understood</button>
                </div> -->
            </div>
        </div>
    </div>
    <div class="modal fade" id="modalPropietarios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalVideosLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
            <div class=" modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalVideosLabel">Editar Videos</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex justify-content-center row">

                    Listado de propietarios a editar












                </div>
                <!-- <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Understood</button>
                </div> -->
            </div>
        </div>
    </div>



    <ModalPropiedadComodidades :estados-generales="estadosGenerales"></ModalPropiedadComodidades>
    <ModalPropiedadDescripcion></ModalPropiedadDescripcion>
    <ModalPropiedadVenta :estados-venta="estadosVenta" :captadores-internos="captadoresInternos" :asesores="asesores">
    </ModalPropiedadVenta>
    <ModalPropiedadAlquiler :estados-alquiler="estadosAlquiler"></ModalPropiedadAlquiler>
</template>

<script>
import NavComponent from '@/components/NavComponent.vue'
import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
import {
    getInmueble, getZonas, getProvincias, getEstadoGeneral, getEstadoVenta, getEstadoAlquiler,
    getCalles, getAsesor, getCaptadorInterno
} from '../../Services/api/Atcl/AtclApi'

export default {
    name: 'PropiedadUpdateView',
    components: {
        NavComponent,
        ModalPropiedadComodidades,
        ModalPropiedadDescripcion,
        ModalPropiedadVenta,
        ModalPropiedadAlquiler

    }
}
</script>