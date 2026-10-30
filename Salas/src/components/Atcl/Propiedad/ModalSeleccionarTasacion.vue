<template>
  <BaseModal :show="show" size="xl" @close="emit('close')">
    <template #title>
      <i class="bi bi-clipboard-data me-2"></i> Seleccionar tasación
    </template>

    <template #body>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
        <input v-model="busqueda" type="search" class="form-control"
          placeholder="Buscar por calle, propietario o folio">
      </div>

      <div v-if="cargando" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
        <span class="ms-2">Cargando tasaciones...</span>
      </div>
      <div v-else-if="error" class="alert alert-danger mb-0" role="alert">{{ error }}</div>
      <div v-else-if="tasacionesFiltradas.length" class="table-responsive border rounded">
        <table class="table table-striped table-hover proceso_reserva_table align-middle mb-0 text-center">
          <thead class="table-light">
            <tr>
              <th>Ubicación</th>
              <th>Propietario</th>
              <th>Fecha</th>
              <th>Venta</th>
              <th>Alquiler</th>
              <th>Folio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tasacion in tasacionesFiltradas" :key="tasacion.id">
              <td>
                {{ tasacion.calle_relacion?.name || 'Calle sin nombre' }} {{ tasacion.numero_calle || '' }}
                <span v-if="tasacion.piso || tasacion.departamento" class="text-muted">
                  {{ [tasacion.piso, tasacion.departamento].filter(Boolean).join(' ') }}
                </span>
                <small class="d-block text-muted">{{ tasacion.localidad?.name || '' }}</small>
              </td>
              <td>{{ nombrePropietario(tasacion) }}</td>
              <td>{{ formatDate(tasacion.fecha) || '-' }}</td>
              <td>{{ formatearNumero(tasacion.tasacion_venta) }}</td>
              <td>{{ formatearNumero(tasacion.tasacion_alquiler) }}</td>
              <td>{{ tasacion.folio || '-' }}</td>
              <td>
                <button type="button" class="btn btn-primary btn-sm" @click="seleccionar(tasacion)"
                  title="Usar tasación">
                  <i class="bi bi-check-lg"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-center text-muted py-4 mb-0">No hay tasaciones asignadas que coincidan con la búsqueda.</p>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { TasacionesActivas } from '@/Services/api/Atcl/Tasaciones/TasacionesApi.js'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { useCurrencyInput } from '@/composables/useCurrencyInput'


const { formatDate } = useDateFormatter()
const { formatearMonto } = useCurrencyInput()
const formatearNumero = (valor) => formatearMonto(valor) || '-'

const props = defineProps({
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'tasacion-seleccionada'])
const tasaciones = ref([])
const busqueda = ref('')
const cargando = ref(false)
const error = ref('')

const tasacionesFiltradas = computed(() => {
  const termino = busqueda.value.trim().toLocaleLowerCase()
  if (!termino) return tasaciones.value

  return tasaciones.value.filter((tasacion) => {
    const texto = [
      tasacion.calle_relacion?.name,
      tasacion.numero_calle,
      tasacion.piso,
      tasacion.departamento,
      tasacion.localidad?.name,
      tasacion.propietario_relacion?.apellido,
      tasacion.propietario_relacion?.nombre,
      tasacion.folio
    ].filter(Boolean).join(' ').toLocaleLowerCase()
    return texto.includes(termino)
  })
})

const nombrePropietario = (tasacion) => {
  const propietario = tasacion.propietario_relacion
  return propietario ? `${propietario.apellido || ''}, ${propietario.nombre || ''}`.trim() : '-'
}

const cargarTasaciones = async () => {
  cargando.value = true
  error.value = ''
  try {
    const response = await TasacionesActivas()
    tasaciones.value = response.data.data || []
  } catch (err) {
    console.error('Error al cargar tasaciones:', err)
    error.value = err.response?.data?.message || 'No se pudieron cargar las tasaciones.'
  } finally {
    cargando.value = false
  }
}

const seleccionar = (tasacion) => {
  emit('tasacion-seleccionada', tasacion)
  emit('close')
}

watch(() => props.show, (show) => {
  if (show) cargarTasaciones()
})
</script>
