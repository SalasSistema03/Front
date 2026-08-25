<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Observaciones</template>
    <template #body>
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
            <!-- <tr v-if="!observaciones.length">
              <td colspan="4" class="text-center">No hay observaciones</td>
            </tr>
            <td>{{ inventario }}</td> -->
            
           <!-- <tr v-for="(observacion, index) in observaciones" :key="`${index}-${observacion.fecha_carga ?? 'sin-fecha'}-${observacion.estado ?? 'sin-estado'}`">
            <td class="text-center">{{ observacion.fecha_carga }}</td>
              <td class="text-center">{{ observacion.estado }}</td>
              <td class="text-center">{{ observacion.observacion }}</td>
              <td class="text-center">{{ observacion.cargado_por }}</td> 
            </tr>  -->
          </tbody>
        </table>
      </div>
    </template>
    <template #footer></template>
  </BaseModal>
</template>

<script setup>
import { computed, defineProps, defineEmits, onMounted } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import {getComentariosInventario} from '@/Services/api/Dpto/Inventario'

const props = defineProps({
  show: { type: Boolean, default: false },
  inventario: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close'])
const traerComentariosInventarios = async ()=> {
  try {
    const response = await getComentariosInventario(props.inventario)

    console.log(response)
    //showSuccess('Inventario actualizado correctamente')
    //showModalInventario.value = false
    //buscar()
    //listado(form)
  } catch (error) {
    console.log(error)
    //showError('Error al guardar las observaciones')
  }
}
//const observaciones = computed(() => props.inventario?.observaciones ?? [])
onMounted(() => {
  traerComentariosInventarios()
})
</script>
