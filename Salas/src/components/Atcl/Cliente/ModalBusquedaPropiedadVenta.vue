<template>
  <baseModal :show="show" size="lg">
    <template #title>Busqueda de Propiedad</template>
    <template #body>
      <div class="row form-group d-flex align-items-center justify-content-center">
        <div class="col-md-2">
          <label>Codigo</label>
          <input v-model="filtroCodigo" type="number" class="form-control" @keyup.enter="buscar">
        </div>
        <div class="col-md-4">
          <label>Calle</label>
          <input v-model="filtroCalle" type="text" class="form-control" @keyup.enter="buscar">
        </div>
        <div class="col-md-2" v-if="vistaAsesores">
          <label>Dorm</label>
          <input v-model="filtroDorm" type="text" class="form-control" @keyup.enter="buscar">
        </div>
        <div class="col-md-2" v-if="vistaAsesores">
          <label>Baños</label>
          <input v-model="filtroBaños" type="text" class="form-control" @keyup.enter="buscar">
        </div>
        <div class="col-md-2" v-if="vistaAsesores">
          <label>Cochera</label>
          <select v-model="filtroCochera" class="form-control" @keyup.enter="buscar">
            <option value=""></option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div class="col-md-4 mt-4">
          <button class="btn btn-primary btn-sm w-50" @click="buscar" :disabled="cargando">
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
              <th v-if="vistaAsesores">Dorm.</th>
              <th v-if="vistaAsesores">Baños</th>
              <th v-if="vistaAsesores">Cochera</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- Sin resultados -->
            <tr v-if="!cargando && propiedades.length === 0">
              <td colspan="6" class="text-center text-muted">
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
              <td>{{ prop.calle ?? 'Sin DATOS' }}</td>
              <td>{{ prop.zona ?? 'Sin DATOS'}}</td>
              <td v-if="vistaAsesores">{{ prop.cantidad_dormitorios ?? 'Sin DATOS'}}</td>
              <td v-if="vistaAsesores">{{ prop.banios ?? 'Sin DATOS'}}</td>
              <td v-if="vistaAsesores">{{ prop.cochera ?? 'Sin DATOS'}}</td>
              <td>
                <button v-if="!vistaAsesores" class="btn btn-light btn-sm w-100" @click="seleccionar(prop)">
                  Consulto
                </button>
                <button v-else class="btn btn-light btn-sm w-100" @click="seleccionar(prop)">
                  Ofrecer
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
  },
  vistaAsesores: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'seleccionar'])

const filtroCodigo = ref('')
const filtroCalle = ref('')
const filtroDorm = ref('')
const filtroBaños = ref('')
const filtroCochera = ref('')
const propiedades = ref([])
const cargando = ref(false)
const error = ref('')
const buscado = ref(false)

const buscar = async () => {
  /* if (!filtroCodigo.value && !filtroCalle.value && !props.vistaAsesores) {
    error.value = 'Ingrese un código o una calle para buscar.'
    return
  } */

  try {
    cargando.value = true
    error.value = ''
    buscado.value = true

    const { data } = await getPropiedadesVenta(filtroCodigo.value, filtroCalle.value, filtroDorm.value, filtroBaños.value, filtroCochera.value)
    propiedades.value = data.data ?? []
    console.log('este es el filtrado', propiedades.value)

  } catch (error) {
    error.value = 'Error al buscar propiedades. Intente nuevamente.'
    propiedades.value = []
  } finally {
    cargando.value = false
  }
}

const seleccionar = (prop) => {
  //console.log('seleccionar', prop)
  emit('seleccionar', prop)
  emit('close')
}
</script>
