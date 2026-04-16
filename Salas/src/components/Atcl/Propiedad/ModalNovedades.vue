<template>
  <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="modalId + 'Label'" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" :id="modalId + 'Label'">Novedades</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleGuardarNovedad">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Fecha</label>
                  <input name="fecha_actual" type="date" class="form-control text-center"
                    :value="new Date().toISOString().split('T')[0]" disabled>
                </div>
                <div class="mb-3">
                  <label class="form-label">Novedad</label>
                  <textarea v-model="novedad" class="form-control text-center" rows="5"></textarea>
                </div>
              </div>
              <div class="col-md-6">
                <label for="inputPassword" class="form-label">Novedades</label>
                <div class="tabla-scroll-container">
                  <table class="table">
                    <tbody v-if="observacionesLocales.length > 0">
                      <tr v-for="observacion in observacionesLocales" :key="observacion.id">
                        <td>
                          {{ formatDate(observacion.created_at) }}<br>
                          {{ observacion.notes }}
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td colspan="1" class="text-center">Sin resultados</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="guardarNovedad">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { defineProps, ref, watch } from 'vue'
import { guardarNovedad as guardarNovedadApi } from '../../../Services/api/Atcl/AtclApi'
import { useToast } from '../../../composables/useToast' // ajustá el path
import { getUser } from '../../../Services/api/Usuario/userApi'

const { showSuccess, showError } = useToast()

const props = defineProps({
  propiedad: { type: Object, default: null },
  ubicacion: { type: String },
  modalId: { type: String, default: 'novedadesModal' }
})

const novedad = ref('')
const emit = defineEmits(['update:novedad'])

// Lista local para poder agregar sin recargar la página
const observacionesLocales = ref([])

// Inicializar ordenado por fecha asc (más viejo arriba, más nuevo abajo)
watch(() => props.propiedad?.observaciones_propiedades, (nuevas) => {
  observacionesLocales.value = (nuevas || [])
    .filter(obs => obs.tipo_ofera === props.ubicacion)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // ← asc
}, { immediate: true })

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return isNaN(date) ? '-' : date.toLocaleDateString('es-AR')
}

const guardarNovedad = async () => {
  if (!novedad.value.trim()) return
  try {

    //Obtenemos el id del usuario a travez del localStorage
    const id_usuario = await getUser(localStorage.getItem('token'))



    const response = await guardarNovedadApi({
      propiedad_id: props.propiedad?.id,
      notes: novedad.value,
      tipo_ofera: props.ubicacion,
      user_id: id_usuario.data.id
    })

    observacionesLocales.value.push({
      id: response.data.data.id,
      notes: novedad.value,
      tipo_ofera: props.ubicacion,
      created_at: new Date().toISOString()
    })

    novedad.value = ''
    showSuccess('Novedad guardada correctamente')

    // Cerrar el modal
    const modalEl = document.getElementById(props.modalId)
    window.bootstrap.Modal.getInstance(modalEl)?.hide()

  } catch (error) {
    showError('Error al guardar la novedad')
    console.error(error)
  }
}

watch(novedad, (val) => {
  emit('update:novedad', { notes: val, tipo_ofera: props.ubicacion })
})
</script>

<style scoped>
.tabla-scroll-container {
  max-height: 37vh;
  overflow-y: auto;
}
</style>
