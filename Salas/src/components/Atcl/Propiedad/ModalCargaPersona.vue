<template>
    <div class="modal fade" id="modalCargaPersona" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalVideosLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
            <div class=" modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalVideosLabel">Carga Persona</h1>
                    <button type="button" class="btn-close" data-bs-toggle="modal" data-bs-target="#modalPropietarios"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body ">
                    <form class="form-group row d-flex justify-content-center align-items-top" autocomplete="off">
                        <div class="col-md-7 row d-flex justify-content-center">
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Nombre</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Nomvbres">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Apellido</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Apellidos">
                            </div>
                            <div class="form-group col-md-4  px-1 text-start">
                                <label for="" class="form-label">DNI</label>
                                <input type="Number" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="N° Documento">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Fecha Nacimiento</label>
                                <input type="date" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Fecha Nacimiento">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Calle</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Calle">
                                
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">N°</label>
                                <input type="number" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="N°">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Piso</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Piso">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Ciudad</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Departamento">
                            </div>
                            <div class="form-group col-md-4 px-1 text-start">
                                <label for="" class="form-label">Provincia</label>
                                <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Provincia">
                            </div>
                            <div class="form-group col-md-12 row px-1 text-start">
                                <div class="col-md-12">
                                    <label for="" class="form-label">Comentarios</label>
                                </div>
                                
                                <div class="col-md-12">
                                    <textarea class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Observaciones"></textarea>
                                </div>
                            </div>


                        </div>
                        <div class="col-md-5 row d-flex justify-content-center">
                            <div class="form-group col-md-6">
                                <label for="" class="form-label">Telefono</label>
                                <input type="number" class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Propietarios">
                            </div>
                            <div class="form-group col-md-6 ">
                                <label for="" class="form-label">Observacion</label>
                                <textarea class="form-control form-control-sm" id="input-propietarios"
                                    placeholder="Observaciones"></textarea>
                            </div>


                        </div>

                        <div class="col-md-12 row mt-4 d-flex justify-content-center">
                            <button type="submit" class="btn btn-primary w-50" :disabled="isSubmitting">
                                {{ isSubmitting ? 'Cargando...' : 'Cargar Propietario' }}
                            </button>                            
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>