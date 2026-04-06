<template>
  <BaseModal :show="show" @close="emit('close')">
    <template #title>Modificar criterio</template>
    <template #body>
      <div class="row form-group">

        <div class="col-md-4">
          <label for="categoria" class="form-label">Potabilidad</label>
          <select class="form-select form-select-sm" id="categoria" v-model="form.id_categoria">
            <option value="Potable">Potable</option>
            <option value="Medio">Medio</option>
            <option value="No Potable">No Potable</option>
          </select>
        </div>

        <div class="col-md-5">
          <label for="tipo_inmueble" class="form-label">Tipo de Inmueble</label>
          <select class="form-select form-select-sm" id="tipo_inmueble" v-model="form.id_tipo_inmueble">
            <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
              {{ inmueble.inmueble }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="dormitorios" class="form-label">Cant. Dorm.</label>
          <input type="number" class="form-control form-control-sm" id="dormitorios" min="0"
            v-model="form.cant_dormitorios">
        </div>

        <div class="col-md-5">
          <label for="zona" class="form-label">Zona</label>
          <select class="form-select form-select-sm" id="zona" v-model="form.id_zona">
            <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
              {{ zona.name }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="cochera" class="form-label">Cochera</label>
          <select class="form-select form-select-sm" id="cochera" v-model="form.cochera">
            <option value="NO">NO</option>
            <option value="SI">SI</option>
          </select>
        </div>

        <div class="col-md-4">
          <label for="precio_hasta" class="form-label">Precio Hasta</label>
          <input type="number" class="form-control form-control-sm" id="precio_hasta" min="0"
            v-model="form.precio_hasta">
        </div>

        <div class="col-md-4">
          <label for="estado_criterio_venta" class="form-label">Estado Criterio</label>
          <select class="form-select form-select-sm" id="estado_criterio_venta" v-model="form.estado_criterio_venta">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        <div class="col-12">
          <label for="observaciones_criterio_venta" class="form-label">Observaciones</label>
          <textarea class="form-control" id="observaciones_criterio_venta" rows="2"
            v-model="form.observaciones"></textarea>
        </div>

      </div>
      <br>
    </template>
    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="actualizarCriterio">Guardar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, reactive, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useInmuebles } from '@/composables/atcl/useInmuebles'
import { useZona } from '@/composables/atcl/useZona'
import { modificarCriterio } from '@/Services/api/Atcl/Cliente/ClienteApi'


const props = defineProps({
  show: { type: Boolean, default: false },
  criterio: { type: Object, default: null }
})

const emit = defineEmits(['close', 'seleccionar', 'criterio-actualizado'])

const { inmuebles, cargarInmuebles } = useInmuebles()
const { zonas, cargarZonas } = useZona()

// ✅ Objeto reactivo central que copia los datos del criterio
const form = reactive({
  id_criterio_venta: null,
  id_categoria: null,
  id_tipo_inmueble: null,
  cant_dormitorios: null,
  id_zona: null,
  cochera: null,
  precio_hasta: null,
  estado_criterio_venta: null,
  observaciones: null,
})

// ✅ Watch para poblar el form cuando llegue el criterio (o cambie)
watch(
  () => props.criterio,
  (nuevoCriterio) => {
    if (nuevoCriterio) {
      form.id_criterio_venta = nuevoCriterio.id_criterio_venta
      form.id_categoria = nuevoCriterio.id_categoria
      form.id_tipo_inmueble = nuevoCriterio.id_tipo_inmueble
      form.cant_dormitorios = nuevoCriterio.cant_dormitorios
      form.id_zona = nuevoCriterio.id_zona
      form.cochera = nuevoCriterio.cochera
      form.precio_hasta = nuevoCriterio.precio_hasta
      form.estado_criterio_venta = nuevoCriterio.estado_criterio_venta
      form.observaciones = nuevoCriterio.observaciones
    }
  },
  { immediate: true } // Se ejecuta de inmediato al montar
)

// ✅ Ahora sí captura todos los campos modificados
const actualizarCriterio = async () => {
  try {
    console.log('📦 Criterio actualizado:', { ...form })
    await modificarCriterio(form)

    // 👈 Emitimos el evento con el criterio actualizado
    emit('criterio-actualizado')
    emit('close')
  } catch (error) {
    console.error('Error al actualizar criterio:', error)
    // Aquí podrías mostrar un mensaje de error al usuario
  }
}


onMounted(async () => {
  await cargarInmuebles()
  await cargarZonas()

  if (props.criterio) {
    form.id_criterio_venta = props.criterio.id_criterio_venta
    form.id_categoria = props.criterio.id_categoria
    form.id_tipo_inmueble = props.criterio.id_tipo_inmueble
    form.cant_dormitorios = props.criterio.cant_dormitorios
    form.id_zona = props.criterio.id_zona
    form.cochera = props.criterio.cochera
    form.precio_hasta = props.criterio.precio_hasta
    form.estado_criterio_venta = props.criterio.estado_criterio_venta
    form.observaciones = props.criterio.observaciones_criterio_venta
  }
})
</script>
