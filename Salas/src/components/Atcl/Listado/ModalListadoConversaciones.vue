<template>
  <BaseModal :show="show" size="xl" @close="emit('close')">
    <template #title>
      Conversaciones — {{ tituloCliente }}
    </template>

    <template #body>
      <!-- Cargando -->
      <div v-if="cargando" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        Cargando conversaciones...
      </div>

      <!-- Sin datos -->
      <div v-else-if="!datosTotales || Object.keys(datosTotales).length === 0" class="text-muted text-center py-3">
        No hay conversaciones registradas para este criterio.
      </div>

      <!-- Datos -->
      <div v-else>
        <div v-for="(items, idCliente) in datosTotales" :key="idCliente" class="mb-4">
          <!-- Nombre del cliente -->
          <div class="conv-cliente-header px-2 py-1 mb-2">
            <strong class="text-uppercase">{{ items[0]?.cliente?.nombre ?? '-' }}</strong>
          </div>

          <div v-for="(item, idx) in items" :key="idx" class="mb-3 ps-2">
            <!-- Datos del criterio -->
            <div class="d-flex flex-wrap gap-3 small mb-1">
              <span><strong>Fecha:</strong> {{ item.cliente?.fecha_criterio_venta ?? '-' }}</span>
              <span><strong>Tipo Inmueble:</strong> {{ item.cliente?.inmueble ?? '-' }}</span>
              <span><strong>Cant. Dormitorios:</strong> {{ item.cliente?.cant_dormitorios ?? '-' }}</span>
              <span><strong>Precio Hasta:</strong> {{ item.cliente?.precio_hasta ?? '-' }}</span>
            </div>

            <hr class="my-1">

            <!-- Historial -->
            <template v-if="item.historial_total?.length">
              <div class="conv-historial-titulo mb-1">Historial de Conversaciones:</div>
              <div class="conv-contenedor" style="height:320px; overflow-y: auto; overflow-x: hidden;">
                <div v-for="(h, hi) in item.historial_total" :key="hi" class="row conv-fila">
                  <div class="col-9 conv-mensaje">- {{ h.mensaje }}</div>
                  <div class="col-3 conv-fecha text-end text-muted small">{{ h.fecha_hora }}</div>
                  <template v-if="h.devolucion">
                    <div class="col-9 conv-devolucion ps-5">Devolución: {{ h.devolucion }}</div>
                    <div class="col-3 conv-devolucion text-end text-muted small">{{ h.fecha_devolucion }}</div>
                  </template>
                </div>
              </div>
            </template>
            <p v-else class="text-muted small">No hay conversaciones registradas.</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { ObtenerConversacionesCriterio } from '@/Services/api/Atcl/AtclApi'

const props = defineProps({
  show: { type: Boolean, default: false },
  fila: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const cargando = ref(false)
const datosTotales = ref(null)

const tituloCliente = computed(() => props.fila?.cliente ?? '')

const cargar = async () => {
  if (!props.fila) return
  cargando.value = true
  datosTotales.value = null
  try {
    const response = await ObtenerConversacionesCriterio({
      asesor_id: props.fila.asesor_id,
      id_criterio_venta: props.fila.id_criterio_venta,
      sector: props.fila.sector ?? 'Venta',
    })
    datosTotales.value = response.data
  } catch (e) {
    console.error('Error al cargar conversaciones:', e)
  } finally {
    cargando.value = false
  }
}

watch(() => props.show, (val) => {
  if (val) cargar()
  else datosTotales.value = null
})
</script>

<style scoped>
.conv-cliente-header {
  background-color: #e9ecef;
  border-left: 3px solid var(--bs-primary);
  border-radius: 3px;
}

.conv-historial-titulo {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--bs-secondary);
}

.conv-fila {
  margin-bottom: 2px;
}

.conv-mensaje {
  font-size: 0.85rem;
}

.conv-fecha {
  font-size: 0.78rem;
}

.conv-devolucion {
  font-size: 0.82rem;
  color: #6c757d;
}
</style>
