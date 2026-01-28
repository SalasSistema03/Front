<template>
  <ToastComponent 
    :toasts="toasts" 
    @remove-toast="removeToast" 
    @pause-timer="pauseTimer"
    @resume-timer="resumeTimer"
  />
  <RouterView />
</template>

<script setup>
import { useToast } from '@/composables/useToast'
import ToastComponent from '@/components/ToastComponent.vue'

const { 
  toasts, 
  removeToast, 
  pauseTimer, 
  resumeTimer 
} = useToast()
</script>
