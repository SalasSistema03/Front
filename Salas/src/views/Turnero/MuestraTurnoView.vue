<template>
  <NavComponentSin />
  <div class="px-3">
    <div class="row d-flex justify-content-center text-center">
      <div class="col-md-8 px-1 d-flex justify-content-center">
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
              <th class="turnosMostrar">{{ turno.tipo_identificador }} - {{ turno.numero_identificador }}</th>
            </tr>



          </tbody>
        </table>
      </div>
      <div class="col-md-4 px-1 d-flex justify-content-center">
        <div class="mostrarTurnosPublicidad">
          <!-- QUIERO MOSTRAR UN VIDEO SIN QUE SE MUESTREN EL START NI LOS COMANDOS DE REPRODUCCION -->
          <video :src="videoUrl" autoplay muted loop playsinline class="w-100 h-auto"></video>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import NavComponentSin from '../../components/NavComponent-sin.vue'
import { useTurnos } from '@/composables/turnero/useTurnos'
import { onMounted, onUnmounted } from 'vue'
import { ref } from 'vue';

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


// 1. Para un video local en la carpeta assets (usando Vite)
const videoLocal = new URL('../../assets/video.mp4', import.meta.url).href;

// 2. Para un video remoto (opcional)
const videoRemoto = ref('https://tu-servidor.com/video-publicitario.mp4');
// Elegimos cuál usar
const videoUrl = ref(videoLocal);
</script>
