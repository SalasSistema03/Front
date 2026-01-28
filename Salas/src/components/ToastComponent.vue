<template>
  <Teleport to="body">
    <div class="toast-container position-fixed" style="bottom: 30px; right: 30px; z-index: 9999">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-notification"
          :class="[toast.type, 'show']"
          @mouseenter="pauseTimer(toast.id)"
          @mouseleave="resumeTimer(toast.id)"
        >
          <div class="toast-icon">
            <component :is="getIcon(toast.type)" />
          </div>
          <div class="toast-content">
            <div v-if="typeof toast.message === 'object'" class="toast-message">
              <div v-for="(messages, field) in toast.message" :key="field" class="mb-2">
                <div class="toast-title">
                  {{ formatFieldName(field) }}
                </div>
                <ul class="mb-0 mt-1 ps-3">
                  <li v-for="message in messages" :key="message" class="mb-1">{{ message }}</li>
                </ul>
              </div>
            </div>
            <div v-else>
              <div class="toast-message">{{ toast.message }}</div>
            </div>
          </div>
          <button
            type="button"
            class="toast-close"
            @click="removeToast(toast.id)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, h } from 'vue'

const props = defineProps({
  toasts: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['remove-toast', 'pause-timer', 'resume-timer'])

const getIcon = (type) => {
  const icons = {
    success: () => h('svg', {
      width: '22',
      height: '22',
      viewBox: '0 0 20 20',
      fill: '#28a745'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
        'clip-rule': 'evenodd'
      })
    ]),
    error: () => h('svg', {
      width: '22',
      height: '22',
      viewBox: '0 0 20 20',
      fill: '#dc3545'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
        'clip-rule': 'evenodd'
      })
    ]),
    warning: () => h('svg', {
      width: '22',
      height: '22',
      viewBox: '0 0 20 20',
      fill: '#ffc107'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
        'clip-rule': 'evenodd'
      })
    ]),
    info: () => h('svg', {
      width: '22',
      height: '22',
      viewBox: '0 0 20 20',
      fill: '#17a2b8'
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
        'clip-rule': 'evenodd'
      })
    ])
  }
  return icons[type] || icons.info
}

const formatFieldName = (field) => {
  const fieldNames = {
    name: 'Nombre',
    username: 'Usuario',
    password: 'Contraseña',
    email: 'Email',
    fecha_nac: 'Fecha de Nacimiento',
    telf_interno: 'Teléfono Interno',
    telf_laboral: 'Teléfono Laboral',
    email_interno: 'Email Interno',
    email_externo: 'Email Externo'
  }
  return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1)
}

const removeToast = (id) => {
  emit('remove-toast', id)
}

const pauseTimer = (id) => {
  emit('pause-timer', id)
}

const resumeTimer = (id) => {
  emit('resume-timer', id)
}
</script>

<style scoped>
.toast-container {
  pointer-events: none;
}

.toast-notification {
  position: relative;
  min-width: 320px;
  max-width: 380px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  padding: 16px;
  z-index: 9999;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  overflow: hidden;
  margin-bottom: 12px;
  pointer-events: all;
}

.toast-notification::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.toast-notification.success {
  border-left: 4px solid #28a745;
}

.toast-notification.error {
  border-left: 4px solid #dc3545;
}

.toast-notification.warning {
  border-left: 4px solid #ffc107;
}

.toast-notification.info {
  border-left: 4px solid #17a2b8;
}

.toast-notification.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-icon {
  font-size: 22px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
  color: #2d3748;
}

.toast-message {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  color: #4a5568;
}

/* Animaciones */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive */
@media (max-width: 576px) {
  .toast-notification {
    min-width: 280px;
    max-width: calc(100vw - 60px);
    right: 15px;
    left: 15px;
  }
  
  .toast-container {
    bottom: 15px;
    right: 15px;
    left: 15px;
  }
}
</style>
