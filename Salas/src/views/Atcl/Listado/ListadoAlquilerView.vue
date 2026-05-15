<template>
  <NavComponent />
  <ListadoPropiedad :sector="sector" />

</template>

<script setup>
import ListadoPropiedad from '../../../components/Atcl/Listado/ListadoPropiedad.vue'


const sector = 'Alquiler'
</script>
