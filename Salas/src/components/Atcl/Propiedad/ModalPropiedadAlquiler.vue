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
                                 id="" name="cod_alquiler"
                                min="0" placeholder="Ej: 3218" v-model="alquiler.cod_alquiler">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">F. Central</label>
                            <input type="number"
                                class="form-control text-center "
                                id="" name="FCentral" placeholder="Ej: 123" v-model="alquiler.FCentral">
                        </div>

                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">F. Candioti</label>
                            <input type="number"
                                class="form-control text-center "
                                id="" name="FCandioti" placeholder="Ej: 123" v-model="alquiler.FCandioti">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">F. Tribunales</label>
                            <input type="number"
                                class="form-control text-center "
                                id="" name="FTribunales" placeholder="Ej: 123" v-model="alquiler.FTribunales">
                        </div>

                        <div class="form-group  px-1 col-md-4">
                            <label class="text-center form-label" for="">Estado de
                                Alquiler</label>
                            <select class="form-select "
                                aria-label="Default select example" name="estado_alquiler" v-model="alquiler.estado_alquiler">
                                <option value="">Seleccione una estado</option>
                                <option v-for="estado in props.estadosAlquiler" :key="estado.id" :value="estado.id">
                                    {{ estado.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2 pt-2">
                            <label class="text-center form-label" id="basic-addon1"></label>
                            <select class="form-select" aria-label="Default select example" name="moneda_alquiler" v-model="alquiler.moneda_alquiler">
                                <option value="1">$</option>
                                <option value="2">u$s</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Precio
                            </label>
                            <input type="number"
                                class="form-control text-center "
                                id="" name="monto_alquiler" min="0" placeholder="Ej: 4000" v-model="alquiler.monto_alquiler">
                        </div>


                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Autorizacion</label>
                            <select class="form-select "
                                aria-label="Default select example" name="autorizacion_alquiler" v-model="alquiler.autorizacion_alquiler">
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
                                id="" name="fecha_autorizacion_alquiler" v-model="alquiler.fecha_autorizacion_alquiler">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Exclusividad</label>
                            <select class="form-select "
                                aria-label="Default select example" name="exclusividad_alquiler" v-model="alquiler.exclusividad_alquiler">
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
                                aria-label="Default select example" name="clausula_de_venta" v-model="alquiler.clausula_de_venta">
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
                                id=""
                                name="tiempo_clausula" placeholder="Ej: 3 meses" v-model="alquiler.tiempo_clausula">
                        </div>
                        <div class="form-group  px-1 col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Fecha
                                Alta</label>
                            <input type="date"
                                class="form-control text-center "
                                name="alquiler_fecha_alta"
                                v-model="alquiler.alquiler_fecha_alta">

                        </div>
                        <div class="form-group  px-1  col-md-2 ">
                            <label class="text-center form-label" id="basic-addon1">Mascota</label>
                            <select class="form-select "
                                aria-label="Default select example"  v-model="alquiler.mascota">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>

                        <div class="form-group  px-1 col-md-2 pt-2">
                            <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                                data-bs-target="#condicionAlquilesPropiedad">
                                Condición Alquiler
                            </button>
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

import { reactive, watch, defineEmits } from 'vue'

// Definir los emits
const emit = defineEmits(['update:alquiler'])

// Datos reactivos del modal
const alquiler = reactive({
   cod_alquiler:'',
   FCentral:'',
   FCandioti:'',
   FTribunales:'',
   estado_alquiler:'',
   moneda_alquiler:'1',
   monto_alquiler:'',
   autorizacion_alquiler:'',
   fecha_autorizacion_alquiler:'',
   exclusividad_alquiler:'',
   clausula_de_venta:'',
   tiempo_clausula:'',
   alquiler_fecha_alta:'',
   mascota:'',
})

// Observar cambios y emitir automáticamente
watch(alquiler, (newValue) => {
    emit('update:alquiler', { ...newValue })
}, { deep: true })
</script>