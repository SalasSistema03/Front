<template>
  <baseModal :show="show">
    <template #title>Busqueda de Propiedad</template>
    <template #body>
      <div class="row form-group">
        <div class="col-md-3">
          <label>Codigo</label>
          <input v-model="filtroCodigo" type="text" class="form-control" @keyup.enter="buscar">
        </div>
        <div class="col-md-7">
          <label>Calle</label>
          <input v-model="filtroCalle" type="text" class="form-control" @keyup.enter="buscar">
        </div>
        <div class="col-md-2 mt-4">
          <button class="btn btn-primary btn-sm w-100" @click="buscar" :disabled="cargando">
            <span v-if="cargando">
              <i class="fa fa-spinner fa-spin"></i>
            </span>
            <span v-else>Buscar</span>
          </button>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="alert alert-danger mt-2 py-1">
        {{ error }}
      </div>

      <br>

      <div class="table-responsive tabla_clientes">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Direccion</th>
              <th>Zona</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- Sin resultados -->
            <tr v-if="!cargando && propiedades.length === 0">
              <td colspan="4" class="text-center text-muted">
                {{ buscado ? 'No se encontraron resultados.' : 'Ingrese un código o calle para buscar.' }}
              </td>
            </tr>

            <!-- Loading -->
            <tr v-if="cargando">
              <td colspan="4" class="text-center">
                <i class="fa fa-spinner fa-spin"></i> Buscando...
              </td>
            </tr>

            <!-- Resultados -->
            <tr v-for="prop in propiedades" :key="prop.id">
              <td>{{ prop.cod_venta }}</td>
              <td>{{ prop.calle }}</td>
              <td>{{ prop.zona }}</td>
              <td>
                <button class="btn btn-light btn-sm" @click="seleccionar(prop)">
                  Agregar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="emit('close')">Cerrar</button>
    </template>
  </baseModal>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { getPropiedadesVenta } from '@/Services/api/Atcl/Cliente/ClienteApi'
import BaseModal from '@/components/base/BaseModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'seleccionar'])

const filtroCodigo = ref('')
const filtroCalle = ref('')
const propiedades = ref([])
const cargando = ref(false)
const error = ref('')
const buscado = ref(false)

const buscar = async () => {
  if (!filtroCodigo.value && !filtroCalle.value) {
    error.value = 'Ingrese un código o una calle para buscar.'
    return
  }

  try {
    cargando.value = true
    error.value = ''
    buscado.value = true

    const { data } = await getPropiedadesVenta(filtroCodigo.value, filtroCalle.value)
    propiedades.value = data.data ?? []

  } catch (e) {
    error.value = 'Error al buscar propiedades. Intente nuevamente.'
    propiedades.value = []
  } finally {
    cargando.value = false
  }
}

const seleccionar = (prop) => {
  emit('seleccionar', prop)
  emit('close')
}
</script>
