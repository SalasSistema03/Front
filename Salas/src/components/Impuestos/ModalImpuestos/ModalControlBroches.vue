<template>
  <baseModal :show="show" size="" @close="emit('close')">
    <template #title>Control</template>

    <template #body>
      <div
        v-for="(item, index) in listaBroches"
        :key="index"
        class="input-group mb-3 form-group form-control"
      >
        <input
          type="text"
          class="form-control"
          :value="item.nombre + ' Cantidad de Broches (' + item.cantidad + ')'"
          readonly
        />

        <div class="input-group-append px-2">
          <button class="btn btn-sm btn-primary mx-1" @click="onBajado(item)">Bajado</button>
          <button class="btn btn-sm btn-outline-danger mx-1" @click="onRechazar(item)">
            Rechazar
          </button>
        </div>
      </div>

      <div v-if="listaBroches.length === 0" class="text-center">No hay broches para mostrar.</div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
    </template>
  </baseModal>
</template>

<script setup>
import { defineEmits, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { ObtenerBrochesSinControlar, GasBajado, GasRechazar } from '@/Services/api/Impuestos/tgiApi'
import { useToast } from '@/composables/useToast'
const { showSuccess, showError } = useToast()
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  impuesto: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'success'])

// Variable reactiva para almacenar los broches
const listaBroches = ref([])

const cargarBroches = async () => {
  try {
    const form = {
      impuesto: props.impuesto,
    }
    const response = await ObtenerBrochesSinControlar(form)
    //console.log(response)
    const itemsValidos = (response.data ?? []).filter((x) => x?.num_broche)

    const agrupado = itemsValidos.reduce((acc, item) => {
      const nombre = item.num_broche.split(' - ')[0]
      if (!acc[nombre]) {
        acc[nombre] = {
          nombre,
          cantidad: 0,
          fecha_vencimiento: item.fecha_vencimiento,
          numero_broche: item.num_broche,
        }
      }
      acc[nombre].cantidad += 1
      return acc
    }, {})

    listaBroches.value = Object.values(agrupado)

    //console.log('Días agrupados:', listaBroches.value)
  } catch (error) {
    console.error('Error al obtener broches:', error)
    listaBroches.value = []
  }
}

const onBajado = async (item) => {
  //console.log("Bajado:", item)
  try {
    await GasBajado({
      fecha_vencimiento: item.fecha_vencimiento,
      impuesto: props.impuesto,
      numero_broche: item.numero_broche,
    })
    showSuccess('Broche bajado correctamente')
    emit('success')
    emit('close')
  } catch (error) {
    console.error('Error al bajado:', error)
    showError('Error al bajado el broche')
  }
}

const onRechazar = async (item) => {
  console.log('Rechazar:', item)
  try {
    await GasRechazar({
      fecha_vencimiento: item.fecha_vencimiento,
      impuesto: props.impuesto,
      numero_broche: item.numero_broche,
    })
    showSuccess('Broche rechazado correctamente')
    emit('success')
    emit('close')
  } catch (error) {
    console.error('Error al rechazar:', error)
    showError('Error al rechazar el broche')
  }
}

// Vigilamos la propiedad 'show' para disparar la carga
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      cargarBroches()
    } else {
      listaBroches.value = [] // Limpiamos al cerrar si es necesario
    }
  },
)
</script>
