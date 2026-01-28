import { ref, reactive, onMounted } from 'vue'
import { registerUser, getPermisos } from '@/Services/api/Usuario/userApi'
import { useToast } from '@/composables/useToast'
import { 
  handleSectorChange, 
  isSectorSelected, 
  handleVistaChange, 
  isVistaSelected,
  handleBotonChange,
  isBotonSelected,
  prepareUserDataForSubmit,
  resetFormData
} from '@/Services/business/usuario/usuarioService'

export const useUserRegister = () => {
  const menuActivo = ref(null)
  const permisos = ref([])
  const loading = ref(false)
  const { handleApiError, showSuccess } = useToast()
  const error = ref(null)
  const success = ref(null)

  const form = reactive({
    name: '',
    fecha_nac: '',
    username: '',
    password: '',
    telf_interno: null,
    telf_laboral: null,
    email_interno: '',
    email_externo: '',
    permisos: []
  })

  // Cargar permisos
  const loadPermisos = async () => {
    try {
      const response = await getPermisos()
      permisos.value = response.data
    } catch (err) {
      handleApiError(err)
    }
  }

  // Manejar submit
  const handleSubmit = async () => {
    error.value = null
    success.value = null
    loading.value = true

    console.log('📤 Datos a enviar:', prepareUserDataForSubmit(form))

    try {
      const response = await registerUser(form)
      showSuccess('Usuario registrado correctamente')
      console.log('✅ Respuesta API:', response.data)
      
      resetFormData(form)
    } catch (e) {
      handleApiError(e)
    } finally {
      loading.value = false
    }
  }

  // Wrappers para las funciones de permisos (pasan form.permisos automáticamente)
  const onSectorChange = (sector, vista, menu, isChecked) => {
    handleSectorChange(sector, vista, menu, isChecked, form.permisos)
  }

  const checkSectorSelected = (sector, vista, menu) => {
    return isSectorSelected(sector, vista, menu, form.permisos)
  }

  const onVistaChange = (vista, menu, isChecked) => {
    handleVistaChange(vista, menu, isChecked, form.permisos)
  }

  const checkVistaSelected = (vista, menu) => {
    return isVistaSelected(vista, menu, form.permisos)
  }

  const onBotonChange = (vista, menu, boton, isChecked) => {
    handleBotonChange(vista, menu, boton, isChecked, form.permisos)
  }

  const checkBotonSelected = (vista, menu, boton) => {
    return isBotonSelected(vista, menu, boton, form.permisos)
  }

  const agruparVistasPorSeccion = (vistas) => {
  const agrupadas = {}
  
  vistas.forEach(vista => {
    const seccion = vista.Seccion || 'Sin Sección'
    if (!agrupadas[seccion]) {
      agrupadas[seccion] = []
    }
    agrupadas[seccion].push(vista)
  })
  
  return agrupadas
}
  onMounted(loadPermisos)

  return {
    // Estado
    menuActivo,
    permisos,
    form,
    loading,
    error,
    success,
    // Métodos
    handleSubmit,
    onSectorChange,
    checkSectorSelected,
    onVistaChange,
    checkVistaSelected,
    onBotonChange,
    checkBotonSelected,
    agruparVistasPorSeccion
  }
}