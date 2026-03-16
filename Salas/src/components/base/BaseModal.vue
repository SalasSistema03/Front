<template>
  <Teleport to="body">
    <div class="modal fade" ref="modalElement" tabindex="-1" aria-hidden="true">
      <div :class="['modal-dialog', sizeClass]">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="title">Título</slot>
            </h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  size: { type: String } // sm, md, lg, xl
});

const emit = defineEmits(['close']);
const modalElement = ref(null);
let modalInstance = null;

const sizeClass = props.size ? `modal-${props.size}` : '';

onMounted(() => {
  // Inicializar el objeto de Bootstrap
  modalInstance = new window.bootstrap.Modal(modalElement.value);

  // Si el usuario cierra con ESC o clic afuera, avisamos a Vue
  modalElement.value.addEventListener('hidden.bs.modal', () => {
    emit('close');
  });

  if (props.show) modalInstance.show();
});

// Sincronizar la prop 'show' con la visibilidad real
watch(() => props.show, (val) => {
  if (val) modalInstance?.show();
  else modalInstance?.hide();
});

onUnmounted(() => {
  modalInstance?.dispose(); // Limpia la memoria
});
</script>
