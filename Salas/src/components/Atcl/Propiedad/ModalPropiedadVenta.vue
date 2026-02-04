<template>

    <!-- Modal -->
    <div class="modal fade" id="modalVentas" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Ventas</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="formularioComodidades" id="formulario" value="">
                    <div class="row g-3">
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Codigo</label>
                            <input type="number" class="form-control text-center "
                                value="{{ old('cod_venta', request('cod_venta')) }}" id="" name="cod_venta" min="0" placeholder="Ej: 3950">
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center form-label" for="">Estado de
                                Venta</label>
                            <select class="form-select " aria-label="Default select example" name="estado_venta">
                                <option value="">Seleccione una estado</option>

                                <option v-for="estado in props.estadosVenta" :key="estado.id" :value="estado.id">
                                    {{ estado.name }}
                                </option>

                            </select>
                        </div>
                        <div class="col-md-2 form-group" style="padding-top: 6px;">
                            <label class="text-center form-label" id="basic-addon1">
                            </label>
                            <select class="form-select" aria-label="Default select example" name="moneda_venta">
                                <option value="2">u$s</option>
                                <option value="1">$</option>
                            </select>
                        </div>
                        <div class=" form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Precio</label>
                            <input type="number"
                                class="form-control text-center "
                                value="{{ old('monto_venta', request('monto_venta')) }}" name="monto_venta" id=""
                                min="0" placeholder="Ej: 50000">
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Tasacion</label>
                            <input type="date" name="fecha_tasacion_venta"
                                class="form-control text-center "
                                value="{{ now()->format('Y-m-d') }}">
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Valor
                                Tasacion</label>
                            <input type="number"
                                class="form-control text-center "
                                value="{{ old('tasacion_venta', request('tasacion_venta')) }}" name="tasacion_venta"
                                id="" placeholder="Ej: 50000">
                        </div>

                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Exclusividad</label>
                            <select class="form-select"
                                aria-label="Default select example" name="exclusividad_venta">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Comparte</label>
                            <select class="form-select"
                                aria-label="Default select example" name="comparte_venta">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Condicionado</label>
                            <select class="form-select"
                                aria-label="Default select example" name="condicionado_venta">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Fecha
                                Alta</label>
                            <input type="date"
                                class="form-control text-center"
                                name="venta_fecha_alta"
                                value="{{ old('venta_fecha_alta', request('venta_fecha_alta')) }}">
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Fecha
                                Aut.</label>
                            <input type="date"
                                class="form-control text-center"
                                name="fecha_autorizacion_venta"
                                value="{{ old('fecha_autorizacion_venta', request('fecha_autorizacion_venta')) }}">



                        </div>
                        <div class="form-group  px-1 col-md-4 ">
                            <label class="text-center form-label" id="basic-addon1">Comentario
                                Autorizacion</label>
                            <textarea name="comentario_autorizacion" id="comentario_autorizacion" cols="3" rows="1"
                                class="form-control"></textarea>
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Zona Prop</label>
                            <input type="date" class="form-control text-center"
                                name="zona_prop">
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Flyer IG</label>
                            <input type="date" class="form-control text-center "
                                name="flyer">
                        </div>


                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Reel IG</label>
                            <input type="date" class="form-control text-center"
                                name="reel">
                        </div>


                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Web</label>
                            <select class="form-select"
                                aria-label="Default select example" name="web">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Captador Interno</label>
                            <select class="form-select"
                                aria-label="Default select example" name="captador_int">
                                <option value="">-</option>
                                <option v-for="captador in props.captadoresInternos" :key="captador.id" :value="captador.id">
                                    {{ captador.username }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Asesor</label>
                            <select class="form-select"
                                aria-label="Default select example" name="asesor">
                                <option value="">-</option>

                                 <option v-for="asesor in props.asesores" :key="asesor.id" :value="asesor.id">
                                    {{ asesor.username }}
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
    estadosVenta: {
        type: Array,
        default: () => []
    },
    captadoresInternos: {
        type: Array,
        default: () => []
    }
     ,
     asesores: {
         type: Array,
         default: () => []
     }
    
})
</script>
