<template>
    <NavComponent />
    <PadronUnidades :impuesto="impuesto" />
</template>
<script setup>  
import NavComponent from '@/components/NavComponent.vue'
import PadronUnidades from '@/components/Impuestos/Expensas/Unidades/PadronUnidades.vue'
</script>