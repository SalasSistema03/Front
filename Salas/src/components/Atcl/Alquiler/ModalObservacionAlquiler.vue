<template>
  <baseModal :show="show" size="lg" @close="emit('close')">
    <template #title>Observación</template>
    <template #body>
      <div class="card shadow-sm border-0">

        <!-- NAV -->
        <div class="card-header bg-white border-bottom p-0">
          <ul class="nav nav-tabs card-header-tabs m-0" id="procesoReservaTabs" role="tablist">

            <!-- RESERVA -->
            <li class="nav-item" role="presentation">
              <button class="nav-link fw-bold px-4 py-3"
                :class="{ 'active': activeTab === 'reserva' }" id="reserva-tab"
                @click="activeTab = 'reserva'" type="button" role="tab" aria-controls="reserva"
                :aria-selected="activeTab === 'reserva'">
                <i class="bi bi-file-earmark-text me-2"></i>
                Reserva
              </button>
            </li>

            <!-- CONTRATOS NUEVOS -->
            <li class="nav-item" role="presentation">
              <button class="nav-link fw-bold px-4 py-3" :class="{ 'active': activeTab === 'contrato' }"
                id="contratos-nuevos-tab" @click="activeTab = 'contrato'" type="button"
                role="tab" aria-controls="contratos-nuevos" :aria-selected="activeTab === 'contrato'">
                <i class="bi bi-file-earmark-plus me-2"></i>
                Contratos Nuevos
              </button>
            </li>

            <!-- SERVICIOS TECNICO -->
            <li class="nav-item" role="presentation">
              <button class="nav-link fw-bold px-4 py-3" :class="{ 'active': activeTab === 'inventario' }"
                id="servicios-tecnico-tab" @click="activeTab = 'inventario'" type="button"
                role="tab" aria-controls="servicios-tecnico" :aria-selected="activeTab === 'inventario'">
                <i class="bi bi-tools me-2"></i>
                Servicios Técnico
              </button>
            </li>

          </ul>
        </div>

        <!-- CONTENIDO DE LAS TABS -->
        <div class="card-body">

          <div class="tab-content" id="procesoReservaTabsContent">

            <!-- ================================= -->
            <!-- TAB RESERVA -->
            <!-- ================================= -->
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'reserva' }"
              id="reserva" role="tabpanel" aria-labelledby="reserva-tab">
              <div class="proceso_reserva_tabla_contenedor_obserbaciones">

                <table class="table table-striped table-hover proceso_reserva_table">
                  <thead class="text-center">
                    <tr>
                      <th>Fecha de Carga</th>
                      <th>Estado</th>
                      <th>Observación</th>
                      <th>Cargado Por</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item in historial" :key="item.id">
                      <td>{{ item.fecha_carga }}</td>

                      <td>
                        {{ item.estado.estado }}
                      </td>

                      <td class="w-50">
                        {{ item.observaciones }}
                      </td>

                      <td>
                        {{ item.quien_cargo }}
                      </td>
                    </tr>
                  </tbody>

                </table>

              </div>

            </div>


            <!-- ================================= -->
            <!-- TAB CONTRATOS NUEVOS -->
            <!-- ================================= -->
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'contrato' }" id="contratos-nuevos"
              role="tabpanel" aria-labelledby="contratos-nuevos-tab">

              <div v-if="historialContratoNuevos.length == 0" class="text-center text-muted py-5">

                <i class="bi bi-file-earmark-plus fs-1 d-block mb-3"></i>

                <div class="fw-semibold">
                  Contratos Nuevos
                </div>

                <small>
                  Aquí se mostrará la información de los contratos nuevos.
                </small>

              </div>
              <div v-else class="proceso_reserva_tabla_contenedor_obserbaciones">
                <table class="table table-striped table-hover proceso_reserva_table">
                  <thead class="text-center">
                    <tr>
                      <th>Fecha de Carga</th>
                      <th>Estado</th>
                      <th>Observación</th>
                      <th>Cargado Por</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item in historialContratoNuevos" :key="item.id">
                      <!--    {{ item }} -->
                      <td>{{ item.fecha_carga }}</td>
                      <td>{{ item.nombre_estado }}</td>
                      <td>{{ item.observaciones }}</td>
                      <td>{{ item.nombre_usuario }}</td>
                    </tr>
                  </tbody>

                </table>


              </div>

            </div>

            <!-- ================================= -->
            <!-- TAB SERVICIOS TECNICO -->
            <!-- ================================= -->
            <div class="tab-pane fade" :class="{ 'show active': activeTab === 'inventario' }" id="servicios-tecnico"
              role="tabpanel" aria-labelledby="servicios-tecnico-tab">

              <div v-if="historialDptoNuevos.length == 0" class="text-center text-muted py-5">

                <i class="bi bi-file-earmark-plus fs-1 d-block mb-3"></i>

                <div class="fw-semibold">
                  Servicios Tecnicos
                </div>

                <small>
                  Aquí se mostrará la información de los servicios tecnicos.
                </small>

              </div>

              <div v-else class="proceso_reserva_tabla_contenedor_obserbaciones">
                <table class="table table-striped table-hover proceso_reserva_table">
                  <thead class="text-center">
                    <tr>
                      <th>Fecha de Carga</th>
                      <th>Estado</th>
                      <th>Observación</th>
                      <th>Cargado Por</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item in historialDptoNuevos" :key="item.id">
                      <td>{{ item.fecha_carga }}</td>
                      <td>{{ item.estado.estado }}</td>
                      <td>{{ item.observaciones }}</td>
                      <td>{{ item.quien_cargo.username }}</td>
                    </tr>
                  </tbody>

                </table>


              </div>


            </div>

          </div>

        </div>

      </div>
    </template>



    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
    </template>
  </baseModal>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { getHistorialReservaAlquiler } from '@/Services/api/Atcl/Alquiler/Alquiler'

const { showError } = useToast()
const historial = ref([])
const historialContratoNuevos = ref([])
const historialDptoNuevos = ref([])
const activeTab = ref('reserva')

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  observacion: {
    type: String,
    default: '',
  },
  sector: {
    type: String,
    default: '',
  },

})


const getHistorialSeleccionado = async () => {

  try {
    const response = await getHistorialReservaAlquiler(props.observacion)
    historial.value = response.data.resultado
    historialContratoNuevos.value = response.data.historialContratoNuevos
    historialDptoNuevos.value = response.data.historialDptoNuevos
    //console.log('aaaaaaa', response.data)
    //showSuccess('Historial obtenido correctamente')

  } catch (error) {
    showError('Error al obtener el historial')
    console.error('Error al obtener el historial', error)
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    activeTab.value = props.sector || 'reserva'
    if (props.observacion) {
      getHistorialSeleccionado()
    }
  }
})
const emit = defineEmits(['close', 'success'])
</script>
