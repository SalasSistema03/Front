<template>
    <BaseModal :show="estaAbiertoDatosCalculos" size="xl" @close="$emit('cerrar')">
        <template #title>
            <div class="d-flex align-items-center justify-content-between w-100">
                <span class="fs-6 fw-bold text-dark"><i class="bi bi-gear-fill me-2 text-primary"></i>Configuración de
                    Cálculos</span>
            </div>
        </template>

        <template #body>
            <div v-if="cargando" class="text-center p-4">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <p class="small mt-2 text-muted">Cargando datos...</p>
            </div>

            <div v-else class="container-fluid px-1">
                <ul class="nav nav-pills nav-fill mb-2 bg-white p-1 rounded-3 shadow-sm border" id="configTabs"
                    role="tablist" style="font-size: 0.85rem;">
                    <li class="nav-item">
                        <button class="nav-link active py-1" id="reg-tab" data-bs-toggle="tab" data-bs-target="#reg"
                            type="button">
                            <i class="bi bi-list-columns-reverse me-1"></i>Registrales
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link py-1" id="adm-tab" data-bs-toggle="tab" data-bs-target="#adm"
                            type="button">
                            <i class="bi bi-calculator me-1"></i>Valor Admin/Hoja
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link py-1" id="sel-tab" data-bs-toggle="tab" data-bs-target="#sel"
                            type="button">
                            <i class="bi bi-stamp me-1"></i>Sellado
                        </button>
                    </li>
                </ul>

                <div class="tab-content pt-1">

                    <div class="tab-pane fade show active" id="reg">
                        <div class="card border-0 shadow-sm rounded-3">
                            <div class="card-body p-2 bg-light-subtle">
                                <div class="row g-2 align-items-end" v-if="configuracion.valores_datos_registrales">
                                    <div class="col-md-4">
                                        <label class="form-label mb-0 small fw-semibold text-muted">Límites</label>
                                        <input v-for="item in configuracion.valores_datos_registrales"
                                            :key="'l-' + item.id" type="number"
                                            class="form-control form-control-sm mb-1 border-primary-subtle shadow-none"
                                            v-model="item.valor_limite">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label mb-0 small fw-semibold text-muted">Precios</label>
                                        <input v-for="item in configuracion.valores_datos_registrales"
                                            :key="'p-' + item.id" type="number"
                                            class="form-control form-control-sm mb-1 border-primary-subtle shadow-none"
                                            v-model="item.precio">
                                    </div>
                                    <div class="col-md-4">
                                        <div class="bg-white p-2 rounded border mb-1">
                                            <label class="form-label mb-0 small fw-semibold text-muted">Registro Extra</label>
                                            <input type="number"
                                                class="form-control form-control-sm mb-2 border-primary-subtle shadow-none"
                                                v-model="configuracion.valor_registro_extra">
                                            <button class="btn btn-primary btn-sm w-100 shadow-sm"
                                                @click="guardarRegistrales">Actualizar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="adm">
                        <div class="row g-2">
                            <div class="col-md-8">
                                <div class="card border-0 shadow-sm h-100 p-2">
                                    <span class="small fw-bold text-primary mb-2 d-block">Valor Administrativo</span>
                                    <div class="row g-1">
                                        <div class="col-4" v-for="(label, i) in ['Coch. 6', 'Coch. 12', 'Base']"
                                            :key="i">
                                            <label class="x-small text-muted d-block">{{ label }}</label>
                                            <input type="number"
                                                class="form-control form-control-sm border-primary-subtle"
                                                v-model="configuracion.valores_gasto_administrativo[i].valor">
                                        </div>
                                        <div class="col-12 mt-2">
                                            <button class="btn btn-primary btn-sm w-100 py-0"
                                                @click="guardarValorAdministrativo">Guardar Cambios</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 text-center">
                                <div class="card border-1 shadow-sm h-100 p-2 ">
                                    <label class="small fw-bold text-primary">Precio Hoja</label>
                                    <div class="input-group input-group-sm my-1">
                                        <input type="number" class="form-control border-1"
                                            v-model="configuracion.valores_hoja[0].precio">
                                    </div>
                                    <button class="btn btn-primary btn-sm w-100 mt-auto shadow-sm py-0"
                                        @click="guardarPrecioHoja">Guardar Hoja</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="sel">
                        <div class="row">
                            <div class="card border-0 shadow-sm p-3 bg-light">
                                <div class="d-flex flex-column flex-md-column flex-lg-row align-items-lg-end gap-3">

                                    <div class="w-100">
                                        <label class="x-small text-muted d-block">Vivienda</label>
                                        <input type="number"
                                            class="form-control form-control-sm border-1 border-primary-subtle shadow-sm"
                                            v-model="configuracion.valores_sellado[0].valor">
                                    </div>

                                    <div class="w-100">
                                        <label class="x-small text-muted d-block">Comercio</label>
                                        <input type="number"
                                            class="form-control form-control-sm border-1 border-primary-subtle shadow-sm"
                                            v-model="configuracion.valores_sellado[1].valor">
                                    </div>

                                    <div class="ms-auto ms-lg-0">
                                        <button class="btn btn-primary btn-sm px-3 shadow-sm w-100"
                                            @click="guardarSellado">Guardar</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
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
/* Micro-ajustes para evitar el scroll */
.form-control-sm {
    font-size: 0.75rem !important;
    padding: 0.2rem 0.4rem;
}

.form-label {
    font-size: 0.7rem;
}

.x-small {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.nav-pills .nav-link {
    color: #6c757d;
    transition: all 0.2s;
}

.nav-pills .nav-link.active {
    background-color: #0d6efd;
    color: white;
    box-shadow: 0 2px 4px rgba(13, 110, 253, 0.3);
}

.card {
    transition: transform 0.2s;
}

/* Asegura que el contenedor no crezca */
.tab-content {
    min-height: 120px;
}
</style>