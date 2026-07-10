<template>
    <BaseModal :show="show" size="md" @close="cerrarModal">
        <template #title>
            <i class="bi bi-chat-text-fill text-info me-2"></i> Observaciones de la Unidad
        </template>

        <template #body>
            <div class="p-3 bg-light border rounded shadow-sm text-secondary" style="white-space: pre-wrap; font-size: 0.9rem;">
                {{ observaciones || 'No hay observaciones para mostrar.' }}
            </div>
        </template>

        <template #footer>
            <button type="button" class="btn btn-secondary btn-sm px-4 shadow-sm" @click="cerrarModal">Cerrar</button>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue';

const props = defineProps({
    show: { type: Boolean, required: true },
    observaciones: { type: String, default: '' }
});

const emit = defineEmits(['close']);

const cerrarModal = () => {
    emit('close');
};
</script>