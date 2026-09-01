<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Informacion Cliente</template>

    <template #body>
      <div class="card">
        <!-- Sección de Consulta Propiedad - solo se muestra si hay datos -->
        <template v-if="consultasPropiedades.length > 0">
          <div class="card-header">
            <strong>Consulta Propiedad</strong>
          </div>

          <div class="card-body">
            <div
              v-for="consulta in consultasPropiedades"
              :key="consulta.id_con_prop_alquiler"
              class="d-flex justify-content-between gap-2"
            >
              <div class="border rounded bg-light p-2 flex-fill">
                <div class="text-muted">CODIGO</div>
                <div>
                  <strong>
                    {{ consulta.propiedad?.cod_alquiler }}
                  </strong>
                </div>
              </div>
              <div class="border rounded bg-light p-2 flex-fill">
                <div class="text-muted">INMUEBLE</div>
                <div>
                  <strong>
                    {{ consulta.propiedad?.tipo_inmueble?.inmueble }}
                  </strong>
                </div>
              </div>
              <div class="border rounded bg-light p-2 flex-fill">
                <div class="text-muted">ZONA</div>
                <div>
                  <strong>
                    {{ consulta.propiedad?.zona?.name }}
                  </strong>
                </div>
              </div>
              <div v-if="consulta.propiedad?.cochera != null" class="border rounded bg-light p-2 flex-fill">
                <div class="text-muted">COCHERA</div>
                <div>
                  <strong>
                    {{ consulta.propiedad?.cochera }}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Sección de Criterios - solo se muestra si hay datos -->
        <template v-if="criteriosBusqueda.length > 0">
          <div class="card-header">
            <strong>Criterios</strong>
          </div>
          <div class="card-body">
            <table class="table table-striped table-hover proceso_reserva_table">
              <thead>
                <tr class="text-center">
                  <th>Inmueble</th>
                  <th>Dormitorios</th>
                  <th>Cochera</th>
                  <th>Zona</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="criterio in criteriosBusqueda" :key="criterio.id_criterio">
                  <td>{{ criterio.tipo_inmueble?.inmueble || '-' }}</td>
                  <td>{{ criterio.cant_dormitorios || '-' }}</td>
                  <td>{{ criterio.cochera ? 'Si' : 'No' }}</td>
                  <td>{{ criterio.zona?.name || '-' }}</td>
                  <td>{{ criterio.observaciones_criterio_alquiler || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- Mensaje cuando no hay datos -->
        <div v-if="consultasPropiedades.length === 0 && criteriosBusqueda.length === 0" class="card-body text-center text-muted">
          <p>Este cliente no tiene consultas de propiedades ni criterios de búsqueda registrados.</p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  cliente: { type: Object, default: null },
})

// Computed para obtener las consultas de propiedades
const consultasPropiedades = computed(() => {
  if (!props.cliente) return []
  return props.cliente.consulta_prop_alquiler || []
})

// Computed para obtener los criterios de búsqueda
const criteriosBusqueda = computed(() => {
  if (!props.cliente) return []
  return props.cliente.criterio_busqueda_alquiler || []
})

const emit = defineEmits(['close', 'criterio-actualizado'])

watch(
  () => props.show,
  /* (estaAbierto) => {
    if (estaAbierto) {
      console.log('Información completa del cliente:', props.cliente)
      console.log('Consultas de propiedades:', consultasPropiedades.value)
      console.log('Criterios de búsqueda:', criteriosBusqueda.value)
    }
  }, */
)
</script>