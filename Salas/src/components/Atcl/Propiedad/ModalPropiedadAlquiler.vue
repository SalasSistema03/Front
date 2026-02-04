<template>

    <!-- Modal -->
    <div class="modal fade" id="modalAlquiler" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Alquiler</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="formularioComodidades" id="formulario" value="">
                    <div class="row g-3">

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Codigo</label>
                            <input type="number"
                                class="form-control text-center small "
                                value="{{ old('cod_alquiler', request('cod_alquiler')) }}" id="" name="cod_alquiler"
                                min="0" placeholder="Ej: 3218">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">F. Central</label>
                            <input type="number"
                                class="form-control text-center "
                                value="{{ old('FCentral', request('FCentral')) }}" id="" name="FCentral" placeholder="Ej: 123">
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">F. Candioti</label>
                            <input type="number"
                                class="form-control text-center "
                                value="{{ old('FCandioti', request('FCandioti')) }}" id="" name="FCandioti" placeholder="Ej: 123">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">F. Tribunales</label>
                            <input type="number"
                                class="form-control text-center "
                                value="{{ old('FTribunales', request('FTribunales')) }}" id="" name="FTribunales" placeholder="Ej: 123">
                        </div>

                        <div class="form-group  px-1 col-md-4">
                            <label class="text-center form-label" for="">Estado de
                                Alquiler</label>
                            <select class="form-select "
                                aria-label="Default select example" name="estado_alquiler">
                                <option value="">Seleccione una estado</option>
                                <option v-for="estado in props.estadosAlquiler" :key="estado.id" :value="estado.id">
                                    {{ estado.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2 pt-2">
                            <label class="text-center form-label" id="basic-addon1"></label>
                            <select class="form-select" aria-label="Default select example" name="moneda_alquiler">
                                <option value="1">$</option>
                                <option value="2">u$s</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Precio
                            </label>
                            <input type="number"
                                class="form-control text-center "
                                value="{{ old('monto_alquiler', request('monto_alquiler')) }}" id=""
                                name="monto_alquiler" min="0" placeholder="Ej: 4000">
                        </div>


                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Autorizacion</label>
                            <select class="form-select "
                                aria-label="Default select example" name="autorizacion_alquiler">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1"> Fecha
                                Aut.</label>
                            <input type="date"
                                class="form-control text-center "
                                value="{{ old('fecha_autorizacion_alquiler', request('fecha_autorizacion_alquiler')) }}"
                                id="" name="fecha_autorizacion_alquiler">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Exclusividad</label>
                            <select class="form-select "
                                aria-label="Default select example" name="exclusividad_alquiler">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1  col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">C.
                                Venta</label>
                            <select class="form-select "
                                aria-label="Default select example" name="clausula_de_venta">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-4 ">
                            <label class="text-center form-label" id="basic-addon1">T.
                                Clausula</label>
                            <input type="text"
                                class="form-control text-center "
                                value="" id=""
                                name="tiempo_clausula" placeholder="Ej: 3 meses">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Fecha
                                Alta</label>
                            <input type="date"
                                class="form-control text-center "
                                name="alquiler_fecha_alta"
                                value="">

                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Fecha
                                Pub.</label>
                            <input type="date"
                                class="form-control text-center "
                                name="fecha_publicacion_ig"
                                value="">
                        </div>


                        <div class="form-group  px-1 col-md-6 pt-4">
                            <button type="button" class="btn btn-secondary w-100" data-bs-toggle="modal"
                                data-bs-target="#condicionAlquilesPropiedad">Condicion de
                                Alquiler</button>
                        </div>

                    </div>

                    <div class="modal-footer mt-2">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// Recibir las props del componente padre
const props = defineProps({
    estadosAlquiler: {
        type: Array,
        default: () => []
    }
})
</script>