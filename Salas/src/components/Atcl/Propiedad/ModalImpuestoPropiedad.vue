<template>
  <BaseModal v-if="usaBaseModal" :show="show" size="lg" @close="emit('close')">
    <template #title>Impuesto a la Propiedad</template>
    <template #body>
      <table class="table table-striped table-hover proceso_reserva_table">
        <thead class="text-center">
          <tr>
            <th>Impuesto</th>
            <th>Partida</th>
            <th>Clave</th>
            <th>Administra</th>
            <th>Fecha</th>
            <th>Monto</th>
            <!-- <th>Folio</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in listaImpuestos" :key="index">
            <td class="text-uppercase fw-semibold">{{ item.tipo || '-' }}</td>
            <td>{{ item.partida || '-' }}</td>
            <td>{{ item.clave || '-' }}</td>
            <td>{{ item.administra || '-' }}</td>
            <td>{{ formatDate(item.ultima_carga?.fecha_vencimiento) }}</td>
            <td>{{ item.ultima_carga?.importe ? `$ ${item.ultima_carga.importe}` : '-' }}</td>
            <!-- <td>{{ item.folio || '-' }}</td> -->
          </tr>
          <tr v-if="listaImpuestos.length === 0">
            <td colspan="6" class="text-center text-muted py-3">No hay impuestos registrados</td>
          </tr>
        </tbody>
      </table>
      <table class="table table-striped table-hover proceso_reserva_table">
        <thead class="text-center">
          <tr>
            <th>Impuesto</th>
            <th>Administrador</th>
            <th>Vencimiento</th>
            <th>Extraordinaria</th>
            <th>Ordinaria</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(exp, index) in listaExpensas" :key="index">
            <td class="text-uppercase fw-semibold">{{ exp.tipo || 'EXPENSAS' }}</td>
            <td>{{ exp.nombre_administrador || exp.exp_administrador_consorcio?.nombre || '-' }}</td>
            <td>{{ formatDate(exp.vencimiento) }}</td>
            <td>{{ exp.extraordinaria ? `$ ${exp.extraordinaria}` : '-' }}</td>
            <td>{{ exp.ordinaria ? `$ ${exp.ordinaria}` : '-' }}</td>
            <td>{{ exp.total ? `$ ${exp.total}` : '-' }}</td>
          </tr>
          <tr v-if="listaExpensas.length === 0">
            <td colspan="6" class="text-center text-muted py-3">No hay expensas registradas</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary" @click="emit('close')">Cerrar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { defineEmits, defineProps, computed, ref, watch } from 'vue'
import BaseModal from '../../base/BaseModal.vue'
import { useDateFormatter } from '@/composables/useDateFormatter'


const { formatDate } = useDateFormatter()
// Definir props para recibir la propiedad
const props = defineProps({
  propiedad: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: null
  }
})

// Definir los emits
const emit = defineEmits(['update:descripcion', 'close'])
const DatosPropiedad = ref(null)

const usaBaseModal = computed(() => props.show !== null)

// Extraer y aplanar los impuestos con su folio respectivo
const listaImpuestos = computed(() => {
  const grupos = props.propiedad?.impuestos
  if (!Array.isArray(grupos) || grupos.length === 0) return []

  const resultado = []
  grupos.forEach((grupo) => {
    const folio = grupo.folio || '-'
    if (Array.isArray(grupo.impuestos)) {
      grupo.impuestos.forEach((imp) => {
        resultado.push({
          ...imp,
          folio: folio
        })
      })
    }
  })
  return resultado
})

// Extraer expensas de los folios de la propiedad
const listaExpensas = computed(() => {
  const folios = props.propiedad?.folios
  if (!Array.isArray(folios) || folios.length === 0) return []

  const resultado = []
  folios.forEach((f) => {
    if (f.montoExpensa) {
      resultado.push(f.montoExpensa)
    }
  })
  return resultado
})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      DatosPropiedad.value = props.propiedad
      console.log('Datos de la propiedad al abrir modal impuesto:', props.propiedad)
    }
  },
  { immediate: true }
)
</script>
