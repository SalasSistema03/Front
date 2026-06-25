<template>
    <NavComponent />
    <PadronAdministrador :impuesto="impuesto" />
</template>
<script setup>  
import NavComponent from '@/components/NavComponent.vue'
import PadronAdministrador from '@/components/Impuestos/Expensas/Administradores/PadronAdministrador.vue'   
</script>