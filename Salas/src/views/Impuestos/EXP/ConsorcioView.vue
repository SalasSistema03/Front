<template>
    <NavComponent />
    <PadronConsorcio :impuesto="impuesto" />
</template>
<script setup>  
import NavComponent from '@/components/NavComponent.vue'
import PadronConsorcio from '@/components/Impuestos/Expensas/Consorcios/PadronConsorcio.vue'
</script>