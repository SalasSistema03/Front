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
                            <select class="form-select " aria-label="Default select example" 
                            name="estado_general" v-model="comodidades.estado_general">
                                <option value="">Seleccione una estado</option>
                                <option v-for="estado in estadosGenerales" :key="estado.id" :value="estado.id">
                                    {{ estado.estado_general }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">Dorm.</label>
                            <input name="dormitorios" type="number" class="form-control "  id="" min="0"
                                max="100" placeholder="Ej: 2" v-model="comodidades.dormitorios">
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">Baños</label>
                            <input name="banios" type="number" class="form-control "  id="" min="0" max="100"
                                placeholder="Ej: 1" v-model="comodidades.banios">
                        </div>

                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">m² Lote</label>
                            <input name="m_Lote" type="number" class="form-control " id="" min="0"
                                placeholder="Ej: 500" v-model="comodidades.lotes">
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">m² Cub.</label>
                            <input name="m_Cubiertos" type="number" class="form-control " id=""
                                placeholder="Ej: 300" v-model="comodidades.lote_cubierto">
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Cochera</label>
                            <select class=" form-select " aria-label="Default select example" name="cochera" v-model="comodidades.cochera">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">N° Cochera</label>
                            <input name="numero_cochera" type="number" class="form-control " id=""
                                placeholder="Ej: 2" v-model="comodidades.numero_cochera">
                        </div>

                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Asfalto</label>
                            <select class="form-select " aria-label="Default select example" name="asfalto" v-model="comodidades.asfalto">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Gas</label>
                            <select class="form-select " aria-label="Default select example" name="gas" v-model="comodidades.gas">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3 ">
                            <label class="text-center" id="basic-addon1">Cloaca</label>
                            <select class="form-select " aria-label="Default select example" name="cloaca" v-model="comodidades.cloaca">
                                <option value="">-</option>
                                <option value="SI">
                                    SI</option>
                                <option value="NO">
                                    NO</option>
                            </select>
                        </div>
                        <div class="form-group  px-1 col-md-3">
                            <label class="text-center" id="basic-addon1">Agua</label>
                            <select class="form-select " aria-label="Default select example" name="agua" v-model="comodidades.agua">
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

import { reactive, watch, defineEmits } from 'vue'

// Definir los emits
const emit = defineEmits(['update:comodidades'])

// Datos reactivos del modal
const comodidades = reactive({
    estado_general: '',
    dormitorios: '',
    banios: '',
    lotes: '',
    lote_cubierto: '',
    cochera: '',
    numero_cochera: '',
    asfalto: '',
    gas: '',
    cloaca: '',
    agua: ''
})

// Observar cambios y emitir automáticamente
watch(comodidades, (newValue) => {
    emit('update:comodidades', { ...newValue })
}, { deep: true })
</script>

