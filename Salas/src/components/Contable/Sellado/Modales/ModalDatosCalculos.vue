<template>
    <BaseModal :show="estaAbiertoDatosCalculos" size="xl" @close="$emit('cerrar')">
        <template #title>Datos de cálculo</template>

        <template #body>
            <div v-if="cargando" class="text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Cargando configuración...</p>
            </div>

            <div v-else class="container-fluid d-flex justify-content-center">
                <form class="row d-flex justify-content-center w-100" @submit.prevent>

                    <div class="row modulosDatos contenedorSeccion" v-if="configuracion.valores_datos_registrales">
                        <div class="col-md-12">
                            <h2 class="form-label titulos_carga_datos text-center">Valores Registrales</h2>
                        </div>

                        <div class="col-4">
                            <label class="form-label lables_carga_datos">Límite</label>
                            <div v-for="item in configuracion.valores_datos_registrales"
                                :key="'limite-' + item.id_valor_datos_registrales">
                                <input type="number" class="form-control mb-2 inputDatos" v-model="item.valor_limite">
                            </div>
                        </div>

                        <div class="col-4">
                            <label class="form-label lables_carga_datos">Precio</label>
                            <div v-for="item in configuracion.valores_datos_registrales"
                                :key="'precio-' + item.id_valor_datos_registrales">
                                <input type="number" class="form-control mb-2 inputDatos" v-model="item.precio">
                            </div>
                        </div>

                        <div class="col-4 d-flex flex-column">
                            <label class="form-label lables_carga_datos">Registro Extra</label>
                            <input type="number" class="form-control inputDatos"
                                v-model="configuracion.valor_registro_extra">
                            <div class="mt-auto mb-2"> <button type="button" class="btn btn-primary btn-sm w-100"
                                    @click="guardarRegistrales">
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="row p-0 d-flex justify-content-between"
                        v-if="configuracion.valores_gasto_administrativo && configuracion.valores_gasto_administrativo.length > 0">

                        <div class="col-md-6 contenedorSeccion_medio">
                            <h2 class="form-label titulos_carga_datos text-center">Valor Administrativo</h2>
                            <div class="row g-2">
                                <div class="col-6">
                                    <label class="form-label lables_carga_datos">G. Adm. Coch. 6</label>
                                    <input type="number" class="form-control inputDatos"
                                        v-model="configuracion.valores_gasto_administrativo[0].valor">
                                </div>
                                <div class="col-6">
                                    <label class="form-label lables_carga_datos">G. Adm. Base</label>
                                    <input type="number" class="form-control inputDatos"
                                        v-model="configuracion.valores_gasto_administrativo[2].valor">
                                </div>
                                <div class="col-6">
                                    <label class="form-label lables_carga_datos">G. Adm. Coch. 12</label>
                                    <input type="number" class="form-control inputDatos"
                                        v-model="configuracion.valores_gasto_administrativo[1].valor">
                                </div>
                                <div class="col-6 d-flex align-items-end">
                                    <button type="button" class="btn btn-primary btn-sm w-100"
                                        @click="guardarValorAdministrativo">
                                        Guardar cambios
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-5 contenedorSeccion_medio" v-if="configuracion.valores_hoja">
                            <h2 class="form-label titulos_carga_datos text-center">Precio Hoja</h2>
                            <div class="row">
                                <div class="col-12 mb-3">
                                    <label class="form-label lables_carga_datos">Valor de Hoja</label>
                                    <input type="number" class="form-control inputDatos"
                                        v-model="configuracion.valores_hoja[0].precio">
                                </div>
                                <div class="col-12">
                                    <button type="button" class="btn btn-primary btn-sm w-100"
                                        @click="guardarPrecioHoja">
                                        Guardar cambios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row modulosDatos contenedorSeccion"
                        v-if="configuracion.valores_sellado && configuracion.valores_sellado.length > 0">
                        <div class="col-md-12 text-center">
                            <h2 class="form-label titulos_carga_datos">Valor Sellado</h2>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label lables_carga_datos">Vivienda</label>
                            <input type="number" class="form-control inputDatos"
                                v-model="configuracion.valores_sellado[0].valor">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label lables_carga_datos">Comercio</label>
                            <input type="number" class="form-control inputDatos"
                                v-model="configuracion.valores_sellado[1].valor">
                        </div>
                        <div class="col-md-4 d-flex align-items-end">
                            <button type="button" class="btn btn-primary btn-sm w-100" @click="guardarSellado">
                                Guardar cambios
                            </button>
                        </div>
                    </div>

                </form>
            </div>

        </template>
    </BaseModal>
</template>

<script setup>
import { ref, defineEmits, onMounted } from "vue";
import BaseModal from '../../../base/BaseModal.vue';
import { getDatosCalculosService, guardarValoresRegistrales, guardarValoresSellado, guardarValoresAdministrativo, guardarValoresHoja } from '../../../../Services/api/Contable/selladoApi.js'
import { alertas } from '../../../../utils/alertas.js'

defineProps({
    estaAbiertoDatosCalculos: Boolean
});
const emit = defineEmits(['cerrar']);

// Referencia al div del modal en el template
const modalRef = ref(null)
let modalInstance = null // Guardará la instancia de Bootstrap

const cargando = ref(true)
const guardando = ref(false)

const configuracion = ref({
    valores_datos_registrales: [],
    valores_gasto_administrativo: [],
    valores_sellado: [],
    valores_hoja: [],
    valor_registro_extra: 0
})
const getDatosRegistrales = async () => {
    cargando.value = true
    try {
        const response = await getDatosCalculosService()

        console.log('Datos de configuracion:', response.data.configuracion)
        // Asignamos todo el objeto "configuracion" de un solo golpe
        configuracion.value = response.data.configuracion
    } catch (err) {
        console.error('Error:', err)
    } finally {
        cargando.value = false
    }
}


const guardarRegistrales = async () => {
    guardando.value = true;
    try {
        // 1. Creamos el objeto con el formato que pide tu API
        const payload = {
            "valor_extra": configuracion.value.valor_registro_extra,
            // Accedemos a los índices del array para aplanar los datos
            "valor_registro_extra1": configuracion.value.valores_datos_registrales[0]?.precio || 0,
            "valor_limite1": configuracion.value.valores_datos_registrales[0]?.valor_limite || 0,

            "valor_registro_extra2": configuracion.value.valores_datos_registrales[1]?.precio || 0,
            "valor_limite2": configuracion.value.valores_datos_registrales[1]?.valor_limite || 0,

            "valor_registro_extra3": configuracion.value.valores_datos_registrales[2]?.precio || 0,
            "valor_limite3": configuracion.value.valores_datos_registrales[2]?.valor_limite || 0
        };

        //console.log('Enviando datos:', payload);

        // 2. Llamas a tu servicio de API (ajusta el nombre según tu archivo selladoApi.js)
        const response = await guardarValoresRegistrales(payload);

        if (response.status === 200) {
            alertas.success('Datos guardados correctamente');
        }

    } catch (err) {
        //console.error('Error al guardar:', err);
        alertas.error('Error al guardar los datos');
    } finally {
        guardando.value = false;
    }
}

const guardarValorAdministrativo = async () => {
    guardando.value = true;
    try {
        // 1. Creamos el objeto con el formato que pide tu API
        const payload = {
            "valor_gasto_administrativo1": configuracion.value.valores_gasto_administrativo[0]?.valor || 0,
            "valor_gasto_administrativo2": configuracion.value.valores_gasto_administrativo[1]?.valor || 0,
            "valor_gasto_administrativo3": configuracion.value.valores_gasto_administrativo[2]?.valor || 0,
        };

        console.log('Enviando datos:', payload);

        // 2. Llamas a tu servicio de API (ajusta el nombre según tu archivo selladoApi.js)
        const response = await guardarValoresAdministrativo(payload);

        if (response.status === 200) {
            alertas.success('Datos guardados correctamente');
        }

    } catch (err) {
        //console.error('Error al guardar:', err);
        alertas.error('Hubo un error al guardar los cambios');
    } finally {
        guardando.value = false;
    }
}


const guardarPrecioHoja = async () => {
    guardando.value = true;
    try {
        // 1. Creamos el objeto con el formato que pide tu API
        const payload = {
            "precio": configuracion.value.valores_hoja[0]?.precio || 0,
        };

        console.log('Enviando datos:', payload);

        // 2. Llamas a tu servicio de API (ajusta el nombre según tu archivo selladoApi.js)
        const response = await guardarValoresHoja(payload);

        if (response.status === 200) {
            alertas.success('Datos guardados correctamente');
        }

    } catch (err) {
        //console.error('Error al guardar:', err);
        alertas.error('Hubo un error al guardar los cambios');
    } finally {
        guardando.value = false;
    }
}


const guardarSellado = async () => {
    guardando.value = true;
    try {
        // Creamos el array con el formato que espera el foreach del backend
        const payload = [
            { "tipo": "vivienda", "valor": configuracion.value.valores_sellado[0]?.valor || 0 },
            { "tipo": "comercio", "valor": configuracion.value.valores_sellado[1]?.valor || 0 }
        ];

        const response = await guardarValoresSellado(payload);

        if (response.status === 200) {
            alertas.success('Datos guardados correctamente');
        }
    } catch (err) {
        // ... error
        alertas.error('Hubo un error al guardar los cambios');
    } finally {
        guardando.value = false;
    }
}


onMounted(() => {
    getDatosRegistrales();
})

</script>

<style scoped>
.titulos_carga_datos {
    color: rgba(0, 175, 154, 0.96);
    font-size: 80%;
}

.lables_carga_datos {
    color: rgb(0, 85, 185);
    font-size: 70%;
}

.inputDatos {
    color: rgba(0, 175, 154, 0.96);
    font-size: 70%;
}

/* Estilo contenedeor formularios de MODAL: calcuo de datos */
.contenedorSeccion {
    box-shadow: 0 2px 8px rgba(156, 182, 231, 0.838);
    padding: 5px;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-bottom: 5px;
    margin-top: 5px;
}

.contenedorSeccion_medio {
    box-shadow: 0 2px 8px rgba(156, 182, 231, 0.838);
    border-radius: 8px;
    background-color: #f9f9f9;
    width: 49.5%;
}

#nombre_inmobiliaria {
    display: none;
}
</style>