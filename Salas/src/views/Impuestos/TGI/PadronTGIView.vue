<template>
  <NavComponent />
  <PadronImpuesto :impuesto="impuesto" />

  <!-- modal para modificar registro -->
  <!-- <ModalModificarTgi :show="showModificarModal" @close="showModificarModal = false" :padron="selectedPadron"
    :impuesto="impuesto" @success="filtrar"></ModalModificarTgi> -->

</template>
<script setup>
import NavComponent from '../../../components/NavComponent.vue'
/* import ModalModificarTgi from '@/components/Impuestos/Tgi/ModalModificarPadron.vue'; */
import PadronImpuesto from '@/components/Impuestos/PadronImpuesto.vue';

const impuesto = 'tgi';


</script>
