<template>
    <NavComponentSin />
    <div class="px-3">
        <div class="row d-flex justify-content-center text-center">
            <div class="col-md-5 px-1 d-flex justify-content-center">
                    <table class="table table-striped table-hover ">
                        <thead class="">
                            <tr class="">
                                <!-- <th class="turnosTitulosMostrar">Sector</th> -->
                                <th class="turnosTitulosMostrar">Tipo-Numero</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="turno in turnosLlamados" :key="turno.id">
                                <!-- <th>{{ turno.sector.nombre }}</th> -->
                                <th class = "turnosMostrar">{{ turno.tipo_identificador }} - {{ turno.numero_identificador }}</th>
                            </tr>



                        </tbody>
                    </table>
            </div>
            <div class="col-md-7 px-1 d-flex justify-content-center">
                <div class="mostrarTurnosPublicidad">
                    publicidad
                </div>
                
            </div>
        </div>
    </div>
</template>
<script setup>
import NavComponentSin from '../../components/NavComponent-sin.vue'
import { useTurnos } from '@/composables/turnero/useTurnos'
import { onMounted, onUnmounted } from 'vue'

let intervalId = null
const { turnosLlamados, loadAllTurnos } = useTurnos()
onMounted(async () => {
    await loadAllTurnos() // Espera a que cargue
    intervalId = setInterval(() => {
        loadAllTurnos()
    }, 500)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>