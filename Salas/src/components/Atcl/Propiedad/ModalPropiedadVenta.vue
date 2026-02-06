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
                    <input type="hidden" id="formulario" value="">
                    <div class="row g-3">
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Codigo</label>
                            <input type="number" class="form-control text-center " id="" min="0" v-model="venta.cod_venta" placeholder="Ej: 3950">
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center form-label" for="">Estado de
                                Venta</label>
                            <select class="form-select " aria-label="Default select example" v-model="venta.estado_venta">
                                <option value="">Seleccione una estado</option>

                                <option v-for="estado in props.estadosVenta" :key="estado.id" :value="estado.id">
                                    {{ estado.name }}
                                </option>

                            </select>
                        </div>
                        <div class="col-md-2 form-group" style="padding-top: 6px;">
                            <label class="text-center form-label" id="basic-addon1">
                            </label>
                            <select class="form-select" aria-label="Default select example" v-model="venta.moneda_venta">
                                <option value="2" selected>u$s</option>
                                <option value="1">$</option>
                            </select>
                        </div>
                        <div class=" form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Precio</label>
                            <input type="number" class="form-control text-center " id="" min="0" v-model="venta.monto_venta"
                                placeholder="Ej: 50000">
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Tasacion</label>
                            <input type="date" class="form-control text-center " v-model="venta.fecha_tasacion_venta">
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Valor
                                Tasacion</label>
                            <input type="number" class="form-control text-center " id="" placeholder="Ej: 50000" v-model="venta.tasacion_venta">
                        </div>

                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Exclusividad</label>
                            <select class="form-select" aria-label="Default select example" v-model="venta.exclusividad_venta">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Comparte</label>
                            <select class="form-select" aria-label="Default select example" v-model="venta.comparte_venta">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Condicionado</label>
                            <select class="form-select" aria-label="Default select example" v-model="venta.condicionado_venta">
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
                            <input type="date" class="form-control text-center" v-model="venta.venta_fecha_alta">
                        </div>
                        <div class="form-group  px-1 col-md-2">
                            <label class="text-center form-label" id="basic-addon1">Fecha
                                Aut.</label>
                            <input type="date" class="form-control text-center" v-model="venta.fecha_autorizacion_venta">
                        </div>
                        <div class="form-group  px-1 col-md-4 ">
                            <label class="text-center form-label" id="basic-addon1">Comentario
                                Autorizacion</label>
                            <textarea name="comentario_autorizacion" id="comentario_autorizacion" cols="3" rows="1"
                                class="form-control" v-model="venta.comentario_autorizacion"></textarea>
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Zona Prop</label>
                            <input type="date" class="form-control text-center" v-model="venta.zona_prop">
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Flyer IG</label>
                            <input type="date" class="form-control text-center " v-model="venta.flyer">
                        </div>


                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Reel IG</label>
                            <input type="date" class="form-control text-center" v-model="venta.reel">
                        </div>


                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Web</label>
                            <select class="form-select" aria-label="Default select example" v-model="venta.web">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Captador Interno</label>
                            <select class="form-select" aria-label="Default select example"
                                v-model.number="venta.captador_inerno">

                                <option v-for="captador in props.captadoresInternos" :key="captador.id"
                                    :value="captador.id">
                                    {{ captador.username }}
                                </option>
                            </select>
                        </div>


                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Asesor</label>
                            <select class="form-select" v-model.number="venta.asesor_resultado">


                                <option v-for="asesor in props.asesores" :key="asesor.id_usuario"
                                    :value="asesor.id_usuario">
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
    },
    asesores: {
        type: Array,
        default: () => []
    }
})


import { reactive, watch, defineEmits} from 'vue'

// Definir los emits
const emit = defineEmits(['update:venta'])

const venta = reactive(
    {
        asesor_resultado: '',
        captador_inerno: '',
        cod_venta: '',
        estado_venta: '',
        moneda_venta: '2',
        monto_venta: '',
        fecha_tasacion_venta: '',
        tasacion_venta: '',
        exclusividad_venta: '',
        comparte_venta: '',
        condicionado_venta: '',
        venta_fecha_alta: '',
        fecha_autorizacion_venta: '',
        comentario_autorizacion: '',
        zona_prop: '',
        flyer: '',
        reel: '',
        web: '',
    }
)




watch(venta, (newValue) => {
    emit('update:venta', { ...newValue })
}, { deep: true }) 


</script>
