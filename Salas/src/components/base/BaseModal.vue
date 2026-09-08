<template>
  <Teleport to="body">
    <div class="modal fade" ref="modalElement" tabindex="-1" aria-hidden="true">
      <div :class="['modal-dialog', sizeClass]">
        <div class="modal-content shadow-lg border-0">

          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <slot name="title">Título</slot>
            </h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>

          <div class="modal-body bg-light">
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
  size: { type: String } 
});

const emit = defineEmits(['close']);
const modalElement = ref(null);
let modalInstance = null;

const sizeClass = props.size ? `modal-${props.size}` : '';

onMounted(() => {
  modalInstance = new window.bootstrap.Modal(modalElement.value);

  // =================================================================
  // FIX PROFESIONAL: LÓGICA DE APILAMIENTO PARA MODALES ANIDADOS
  // =================================================================
  modalElement.value.addEventListener('show.bs.modal', () => {
    // 1. Contamos cuántos modales ya están visibles en la pantalla
    const modalesAbiertos = document.querySelectorAll('.modal.show').length;
    
    if (modalesAbiertos > 0) {
      // 2. Si ya hay modales abiertos, aumentamos el Z-Index (Base 1055)
      const nuevoZIndexModal = 1055 + (modalesAbiertos * 10);
      modalElement.value.style.zIndex = nuevoZIndexModal;

      // 3. Ajustamos el Z-Index del fondo oscuro (backdrop) para que quede justo por debajo de este modal
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        if (backdrops.length > 0) {
          const ultimoBackdrop = backdrops[backdrops.length - 1];
          ultimoBackdrop.style.zIndex = nuevoZIndexModal - 1;
        }
      }, 20); // Pequeño delay para que Bootstrap termine de inyectar el div del backdrop
    }
  });

  // Al cerrar, nos aseguramos de que el scroll del fondo siga bloqueado si quedó otro modal abierto
  modalElement.value.addEventListener('hidden.bs.modal', () => {
    emit('close');
    setTimeout(() => {
      if (document.querySelectorAll('.modal.show').length > 0) {
        document.body.classList.add('modal-open');
      }
    }, 10);
  });
  // =================================================================

  if (props.show) modalInstance.show();
});

watch(() => props.show, (val) => {
  if (val) modalInstance?.show();
  else modalInstance?.hide();
});

onUnmounted(() => {
  modalInstance?.dispose();
});
</script>