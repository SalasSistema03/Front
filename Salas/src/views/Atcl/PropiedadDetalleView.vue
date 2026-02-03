<template>
    <NavComponent titulo="Propiedad Carga"></NavComponent>
    <div class="px-3">
        <div class="row">
            <div class="col-md-6 row form-group d-flex align-items-end justify-content-center">
                <div class="col-md-5 mt-0">
                    <label class="form-label " for="input-calle">
                        Calle
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="Aristobulo del Valle" readonly>
                </div>
                <div class="col-md-3 mt-0">
                    <label class="form-label " for="input-altura">
                        N°
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="000000" readonly>
                </div>
                <div class="col-md-2 mt-0">
                    <label class="form-label " for="input-piso">
                        PH
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="SI" readonly>
                </div>
                <div class="col-md-2 mt-0">
                    <label class="form-label " for="input-piso">
                        Piso
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="0000" readonly>
                </div>

                <div class="col-md-3 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Dto
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="0000" readonly>
                </div>
                <div class="col-md-4 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Inmueble
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="Local Comercial" readonly>
                </div>
                <div class="col-md-5 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Zona
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="Fomento 9 de Julio" readonly>
                </div>

                <div class="col-md-4 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Provincia
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="Buenos Aires" readonly>
                </div>
                <div class="col-md-4 mt-2 text-center">
                    <button class="btn btn-primary btn-sm w-100 " data-bs-toggle="modal">
                        Llave
                    </button>
                </div>
                <div class="col-md-4 mt-2 text-center">
                    <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal">
                        Cartel
                    </button>
                </div>

                <div class="col-md-4 mt-3 text-center">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalPropietarios">
                        Propietarios
                    </button>
                </div>
                <div class="col-md-4 mt-3 text-center">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalComodidades">
                        Descripcion
                    </button>
                </div>
                <div class="col-md-4 mt-3 text-center">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalVentas">
                        Comodidades
                    </button>
                </div>

                <div class="col-md-12 row mt-3 d-flex justify-content-center align-items-center">
                    <div class="col-md-6  text-center">
                        <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="#modalAlquiler">
                            Descargar
                        </button>
                    </div>
                    <div class="col-md-6  text-center">
                        <button type="button" class="btn btn-light btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="#modalAlquiler">
                            Modificar
                        </button>
                    </div>
                </div>
                <div class="col-md-12 row mt-3 d-flex justify-content-center align-items-center">
                    <div class ="col-md-3  text-center">
                        <label for="">Codigo V. </label>
                    </div>
                    <div class="col-md-3  text-center">
                        <input type="text " class="form-control form-control-sm" 
                        placeholder="Sin Codigo" readonly>
                    </div>
                    <div class="col-md-6  text-center">

                        <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="#modalAlquiler">
                            Informacion Ventas
                        </button>
                    </div>
                </div>

                <div class="col-md-12 row mt-3 d-flex justify-content-center align-items-center">
                    <div class ="col-md-3  text-center">
                        <label for="">Codigo A. </label>
                    </div>
                    <div class="col-md-3  text-center">
                        <input type="text " class="form-control form-control-sm" 
                        placeholder="Sin Codigo" readonly>
                    </div>
                    <div class="col-md-6  text-center">

                        <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="#modalAlquiler">
                            Informacion Alquiler
                        </button>
                    </div>
                </div>





            </div>
            <div class="col-md-6">
                fotos
            </div>

        </div>
    </div>
</template>
<script>
import NavComponent from '../../components/NavComponent.vue'
export default {
    components: {
        NavComponent
    }
}
</script>
