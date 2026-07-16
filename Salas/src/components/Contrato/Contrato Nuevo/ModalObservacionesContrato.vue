<template>
    <BaseModal :show="show" @close="emit('close')">
        <template #title></template>
        <template #body></template>
        <template #footer></template>
    </BaseModal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'

defineProps({
    show: { type: Boolean, default: false }
})

defineEmits(['close'])
</script>
