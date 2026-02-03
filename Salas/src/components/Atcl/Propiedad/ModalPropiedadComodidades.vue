<template>

    <!-- Modal -->
    <div class="modal fade" id="modalComodidades" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Comodidades</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="formularioComodidades" id="formulario" value="">
                    <div class="row g-3">
                        <div class=" form-group  px-1 col-md-6">
                            <label for="">Estado general</label>
                            <select class="form-select " aria-label="Default select example" name="estado_general">
                                <option value="">Seleccione una estado</option>
                                <option v-for="estado in estadosGenerales" :key="estado.id" :value="estado.id">
                                    {{ estado.estado_general }}
                                </option>



                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">Dorm.</label>
                            <input name="dormitorios" type="number" class="form-control "
                                value="{{ old('dormitorios', request('dormitorios')) }}" id="" min="0" max="100">
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">Baños</label>
                            <input name="banios" type="number" class="form-control "
                                value="{{ old('banios', request('banios')) }}" id="" min="0" max="100">
                        </div>

                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">m² Lote</label>
                            <input name="m_Lote" type="number" class="form-control "
                                value="{{ old('m_Lote', request('m_Lote')) }}" id="" min="0">
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">m² Cub.</label>
                            <input name="m_Cubiertos" type="number" class="form-control "
                                value="{{ old('m_Cubiertos', request('m_Cubiertos')) }}" id="">
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Cochera</label>
                            <select class=" form-select " aria-label="Default select example" name="cochera">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">N° Cochera</label>
                            <input name="numero_cochera" type="number" class="form-control "
                                value="{{ old('numero_cochera', request('numero_cochera')) }}" id="">
                        </div>

                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Asfalto</label>
                            <select class="form-select " aria-label="Default select example" name="asfalto">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Gas</label>
                            <select class="form-select " aria-label="Default select example" name="gas">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Cloaca</label>
                            <select class="form-select " aria-label="Default select example" name="cloaca">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">Agua</label>
                            <select class="form-select " aria-label="Default select example" name="agua">
                                <option value="">-</option>
                                <option value="SI">
                                    SI
                                </option>
                                <option value="NO">
                                    NO
                                </option>
                            </select>
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
    estadosGenerales: {
        type: Array,
        default: () => []
    }
})
</script>