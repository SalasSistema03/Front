<template>
  <NavComponent />
  <CargaImpuesto :impuesto="impuesto" />


</template>
<script setup>
import NavComponent from '../../../components/NavComponent.vue'
import CargaImpuesto from '../../../components/Impuestos/CargaImpuesto.vue'



const impuesto = 'agua'





</script>
