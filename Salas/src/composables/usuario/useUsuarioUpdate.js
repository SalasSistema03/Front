import { ref, reactive, onMounted } from 'vue'
import { getPermisos, getNombresDeUsuarios, getDatosGenerales, updateUser } from '@/Services/api/Usuario/userApi'
import { useToast } from '@/composables/useToast'
import { 
  handleSectorChange, 
  isSectorSelected, 
  handleVistaChange, 
  isVistaSelected,
  handleBotonChange,
  isBotonSelected
} from '@/Services/business/usuario/usuarioService'

export const useUsuarioUpdate = () => {
  const menuActivo = ref(null)
  const activeTab = ref('tab1')
  const nombreUsuario = ref('')
  const permisos = ref([])
  const nombresDeUsuarios = ref([])
  const loading = ref(false)
  const { handleApiError, showSuccess } = useToast()

  // Datos del formulario
  const datosUsuario = reactive({
    fechaNacimiento: '',
    nombreCompleto: '',
    contraseña: '',
    telefonoInterno: '',
    telefonoLaboral: '',
    emailInterno: '',
    emailExterno: '',
    permisos: []
  })

  // Cargar datos iniciales
  const loadInitialData = async () => {
    try {
      const response = await getNombresDeUsuarios()
      nombresDeUsuarios.value = response.data
    } catch (error) {
      handleApiError(error)
    }

    // Cargar permisos disponibles
    try {
      const permisosResponse = await getPermisos()
      permisos.value = permisosResponse.data
    } catch (error) {
      console.error('Error cargando permisos:', error)
    }
  }

  // Manejar cambio de usuario
  const handleNombreUsuarioChange = async (nombre) => {
    nombreUsuario.value = nombre

    if (nombre) {
      loading.value = true
      try {
        const response = await getDatosGenerales(nombre)
        const datos = response.data

        // Mapear los datos del usuario al formulario
        datosUsuario.fechaNacimiento = datos.usuario.fecha_nac || ''
        datosUsuario.nombreCompleto = datos.usuario.name || ''
        datosUsuario.contraseña = datos.usuario.password || '' // No cargar contraseña por seguridad
        datosUsuario.telefonoInterno = datos.usuario.telf_interno || ''
        datosUsuario.telefonoLaboral = datos.usuario.telf_laboral || ''
        datosUsuario.emailInterno = datos.usuario.email_interno || ''
        datosUsuario.emailExterno = datos.usuario.email_externo || ''

        // Mapear permisos existentes al formato [menu_id, vista_id, boton_id]
        datosUsuario.permisos = datos.permisos.map(permiso => [
          permiso.nav_id,
          permiso.vista_id,
          permiso.boton_id
        ])

        // Mapear sectores de agenda al formato [menu_id, vista_id, null, sector_id]
        if (datos.agenda && datos.agenda.length > 0) {
        

          // CORRECCIÓN: Buscar la vista "Agenda" correctamente
          // 1. Primero buscar el menú "Agenda" en los permisos cargados
          const menuAgenda = permisos.value.find(p => p.menu === 'Agenda' || p.id === 3)
          const navIdAgenda = menuAgenda ? menuAgenda.id : 3 // menu_id de Agenda es 3

          // 2. Buscar la vista "Agenda" dentro del menú Agenda
          let vistaAgendaId = null
          if (menuAgenda && menuAgenda.vistas) {
            const vistaAgenda = menuAgenda.vistas.find(v => v.nombre_visual === 'Agenda')
            vistaAgendaId = vistaAgenda ? vistaAgenda.id : 33 // vista_id de Agenda es 33
          } else {
            vistaAgendaId = 33 // Default
          }

          

          // 3. Mapear los sectores
          const sectoresAgenda = datos.agenda.map(sector => [
            navIdAgenda,          // nav_id: 3 (Agenda)
            vistaAgendaId,        // vista_id: 33 (Agenda)
            null,                 // boton_id: null
            sector.sector_id      // sector_id: 1,2,3,etc
          ])

        
          // 4. Agregar los sectores a los permisos
          datosUsuario.permisos.push(...sectoresAgenda)

          // 5. Asegurar que la vista "Agenda" también esté seleccionada
          const vistaAgendaYaSeleccionada = datosUsuario.permisos.some(p =>
            p[0] === navIdAgenda && p[1] === vistaAgendaId && p[1] !== null
          )

          if (!vistaAgendaYaSeleccionada) {
            datosUsuario.permisos.push([navIdAgenda, vistaAgendaId, null])
          }

         

          // 6. DEBUG: Verificar si los sectores están en los permisos
        
          datos.agenda.forEach(sector => {
            const existe = datosUsuario.permisos.some(p =>
              p[0] === navIdAgenda && p[1] === vistaAgendaId && p[3] === sector.sector_id
            )
           
          })
        }

      } catch (error) {
        console.error('Error al obtener datos del usuario:', error)
        handleApiError(error)
      } finally {
        loading.value = false
      }
    } else {
      // Limpiar formulario si no hay usuario seleccionado
      datosUsuario.fechaNacimiento = ''
      datosUsuario.nombreCompleto = ''
      datosUsuario.contraseña = ''
      datosUsuario.telefonoInterno = ''
      datosUsuario.telefonoLaboral = ''
      datosUsuario.emailInterno = ''
      datosUsuario.emailExterno = ''
      datosUsuario.permisos = []
      loading.value = false
    }
  }

  // Manejar submit
  const handleSubmit = async () => {
    loading.value = true

    try {
      const response = await updateUser(datosUsuario, nombreUsuario.value)
      showSuccess(response.message || 'Usuario actualizado correctamente')
    } catch (err) {
      handleApiError(err)
      console.error('Error updating user:', err)
    } finally {
      loading.value = false
    }
  }

  // Wrappers para las funciones de permisos (pasan datosUsuario.permisos automáticamente)
  const onSectorChange = (sector, vista, menu, isChecked) => {
    handleSectorChange(sector, vista, menu, isChecked, datosUsuario.permisos)
  }

  const checkSectorSelected = (sector, vista, menu) => {
    return isSectorSelected(sector, vista, menu, datosUsuario.permisos)
  }

  const onVistaChange = (vista, menu, isChecked) => {
    handleVistaChange(vista, menu, isChecked, datosUsuario.permisos)
  }

  const checkVistaSelected = (vista, menu) => {
    return isVistaSelected(vista, menu, datosUsuario.permisos)
  }

  const onBotonChange = (vista, menu, boton, isChecked) => {
    handleBotonChange(vista, menu, boton, isChecked, datosUsuario.permisos)
  }

  const checkBotonSelected = (vista, menu, boton) => {
    return isBotonSelected(vista, menu, boton, datosUsuario.permisos)
  }

  onMounted(loadInitialData)

  return {
    // Estado
    menuActivo,
    activeTab,
    nombreUsuario,
    permisos,
    nombresDeUsuarios,
    loading,
    datosUsuario,
    // Métodos
    handleNombreUsuarioChange,
    handleSubmit,
    onSectorChange,
    checkSectorSelected,
    onVistaChange,
    checkVistaSelected,
    onBotonChange,
    checkBotonSelected
  }
}
