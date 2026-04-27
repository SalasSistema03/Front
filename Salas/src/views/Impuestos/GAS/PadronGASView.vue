<template>
  <NavComponent />
  <PadronImpuesto :impuesto="impuesto" />


</template>
<script setup>
import NavComponent from '../../../components/NavComponent.vue'
import PadronImpuesto from '@/components/Impuestos/PadronImpuesto.vue';

const impuesto = 'gas';


</script>
