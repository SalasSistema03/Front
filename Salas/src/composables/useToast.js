import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export const useToast = () => {
  const addToast = (message, type = 'info', duration = 5000, options = {}) => {
    const id = ++toastId
    
    const toast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
      progress: 100,
      showProgress: options.showProgress !== false,
      paused: false,
      remainingTime: duration,
      startTime: Date.now()
    }
    
    toasts.value.push(toast)
    
    // Iniciar la barra de progreso
    if (toast.showProgress && duration > 0) {
      startProgress(toast)
    }
    
    // Auto remover después del duration
    if (duration > 0) {
      const timer = setInterval(() => {
        if (!toast.paused) {
          const elapsed = Date.now() - toast.startTime
          const remaining = duration - elapsed
          
          if (remaining <= 0) {
            clearInterval(timer)
            removeToast(id)
          } else {
            toast.progress = Math.max(0, (remaining / duration) * 100)
            toast.remainingTime = remaining
          }
        }
      }, 50)
      
      toast.timer = timer
    }
    
    return id
  }
  
  const startProgress = (toast) => {
    if (toast.showProgress) {
      toast.progress = 100
    }
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      const toast = toasts.value[index]
      if (toast.timer) {
        clearInterval(toast.timer)
      }
      toasts.value.splice(index, 1)
    }
  }
  
  const pauseTimer = (id) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast && !toast.paused) {
      toast.paused = true
      toast.pausedAt = Date.now()
    }
  }
  
  const resumeTimer = (id) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast && toast.paused) {
      toast.paused = false
      const pausedDuration = Date.now() - toast.pausedAt
      toast.startTime += pausedDuration
      toast.pausedAt = null
    }
  }
  
  const clearAllToasts = () => {
    toasts.value.forEach(toast => {
      if (toast.timer) {
        clearInterval(toast.timer)
      }
    })
    toasts.value = []
  }
  
  // Métodos específicos para diferentes tipos
  const showError = (message, duration = 5000) => {
    return addToast(message, 'error', duration)
  }
  
  const showSuccess = (message, duration = 3000) => {
    return addToast(message, 'success', duration)
  }
  
  const showWarning = (message, duration = 4000) => {
    return addToast(message, 'warning', duration)
  }
  
  const showInfo = (message, duration = 3000) => {
    return addToast(message, 'info', duration)
  }
  
  // Manejar errores de API específicamente
  const handleApiError = (error) => {
    // Manejar específicamente errores de autenticación
    if (error.response && error.response.status === 401) {
      // Limpiar token y redirigir al login
      localStorage.removeItem('token')
      showError('Sesión expirada. Por favor, inicie sesión nuevamente.')
      
      // Redirigir al login después de un breve tiempo
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
      return
    }
    
    if (error.response && error.response.data) {
      const errorData = error.response.data
      
      // Si el error tiene el formato { error: { field: [messages] } }
      if (errorData.error) {
        // Si errorData.error es un string, mostrarlo directamente
        if (typeof errorData.error === 'string') {
          return showError(errorData.error)
        }
        // Si es un objeto, convertirlo a string
        if (typeof errorData.error === 'object') {
          return showError(JSON.stringify(errorData.error))
        }
      }
      
      // Si el error es un objeto con campos de validación
      if (typeof errorData === 'object' && errorData !== null) {
        // Buscar mensajes comunes de error
        if (errorData.message) {
          return showError(errorData.message)
        }
        if (errorData.error) {
          return showError(errorData.error)
        }
        // Si no hay mensajes claros, convertir el objeto a string
        return showError(JSON.stringify(errorData))
      }
      
      // Si es un mensaje de error simple
      if (typeof errorData === 'string') {
        return showError(errorData)
      }
    }
    
    // Error genérico
    return showError('Ocurrió un error inesperado')
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    pauseTimer,
    resumeTimer,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    handleApiError
  }
}
