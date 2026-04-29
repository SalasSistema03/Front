<template>
  <baseModal :show="show" size="lg" @close="emit('close')">
    <template #title>Modificar Impuesto</template>
    <template #body>
      <div class="row form-group m-0 p-0">
        <div class="col-md-2 mb-2">
          <label class="form-label">Folio</label>
          <input type="text" class="form-control form-control-sm" v-model="folio">
        </div>
        <div class="col-md-4 mb-2">
          <label class="form-label">Empresa</label>
          <select class="form-select form-select-sm" v-model="empresa">
            <option value="1">Atilio Salas SRL</option>
            <option value="2">Dolly J. Pianesi</option>
            <option value="3">Giusiano Maria Florencia</option>
          </select>

        </div>
        <div class="col-md-6 d-flex align-items-end justify-content-center mb-2">
          <button type="button" class="btn btn-primary btn-sm w-50" @click="buscarFolio(folio, empresa)">
            buscar</button>
        </div>



        <div v-if="showTabla" class="table-responsive  tabla-modifica-carga-impuestos">
          <table class="table table-striped table-hover tabla-impuestos">
            <thead>
              <tr>
                <th>
                  Folio
                </th>
                <th v-if="props.impuesto === 'tgi' || props.impuesto === 'agua'">
                  Partida
                </th>
                <th v-if="props.impuesto === 'gas'">Persona</th>
                <th v-if="props.impuesto === 'tgi'">
                  Clave
                </th>
                <th v-if="props.impuesto === 'agua'">
                  Punto
                </th>
                <th v-if="props.impuesto === 'gas'">
                  Cliente
                </th>

                <th>
                  Administra
                </th>
                <th>
                  Accion
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resultado in resultadoCarga.data" :key="resultado.folio">
                <td>{{ resultado.folio }}</td>
                <td>{{ resultado.partida }}</td>
                <td>{{ resultado.clave }}</td>
                <td>{{ resultado.administra }}</td>
                <td><button class="btn btn-primary btn-sm" @click="seleccionarImpuesto(resultado)">Seleccionar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


      </div>
      <div class="row form-group m-0 p-0" v-if="impuestoSeleccionado">
        <div class="col-md-4">
          <label for="edit-folio" class="form-label">Partida</label>
          <input type="text" class="form-control form-control-sm" disabled :value="impuestoSeleccionado.partida">
        </div>
        <div class="col-md-2">
          <label for="edit-calle" class="form-label">Clave</label>
          <input type="text" class="form-control form-control-sm" disabled :value="impuestoSeleccionado.clave">
        </div>
        <div class="col-md-2">
          <label for="edit-partida" class="form-label">Administra</label>
          <input type="text" class="form-control form-control-sm" disabled :value="impuestoSeleccionado.administra">
        </div>
        <div class="col-md-2">
          <label for="edit-clave" class="form-label">Fecha</label>
          <input type="date" class="form-control form-control-sm" v-model="fecha">
        </div>
        <div class="col-md-2">
          <label for="edit-estado" class="form-label">Importe</label>
          <input type="number" class="form-control form-control-sm" v-model="importe"
            @input="importe = $event.target.value.replace(',', '.')">
        </div>

        <div class="col-md-2" v-if="props.impuesto === 'agua'">
          <label for="edit-fecha" class="form-label">Fecha</label>
          <input type="date" class="form-control form-control-sm" v-model="fecha2">
        </div>
        <div class="col-md-2" v-if="props.impuesto === 'agua'">
          <label for="edit-importe" class="form-label">Importe</label>
          <input type="number" class="form-control form-control-sm" v-model="importe2"
            @input="importe2 = $event.target.value.replace(',', '.')">
        </div>

      </div>




    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
      <button type="button" class="btn btn-primary btn-sm" @click="guardarCambios()">Cargar</button>
    </template>
  </baseModal>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useToast } from '@/composables/useToast'
import { cargaManual, cargaNuevoManual } from '@/Services/api/Impuestos/tgiApi'

const { showError, showSuccess, } = useToast();
const empresa = ref('');
const folio = ref('');
const resultadoCarga = ref([]);
const showTabla = ref(false);
const impuestoSeleccionado = ref(null);
const fecha = ref('');
const importe = ref('');
const fecha2 = ref('');
const importe2 = ref('');

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  impuesto: {
    type: String,
    default: ''
  }
})

const seleccionarImpuesto = (impuesto) => {
  impuestoSeleccionado.value = impuesto
}
const buscarFolio = async () => {
  const form = {
    impuesto: props.impuesto,
    folio: folio.value,
    empresa: empresa.value
  }
  try {
    const response = await cargaManual(form)
    resultadoCarga.value = response
    console.log(response)
    showSuccess('Carga manual exitosa')
    showTabla.value = true
  } catch (error) {
    console.error('Error al cargar manualmente', error)
    showError('Error al cargar manualmente')
  }
}

const guardarCambios = async () => {

  const form = {
    impuesto: props.impuesto,
    partida: impuestoSeleccionado.value.partida,
    fecha_vencimiento: fecha.value,
    importe: importe.value,
    fecha_vencimiento2: fecha2.value,
    importe2: importe2.value
  }

  try {
    await cargaNuevoManual(form)
    showSuccess('Carga manual exitosa')
    resultadoCarga.value = []
    folio.value = ''
    empresa.value = ''
    impuestoSeleccionado.value = null
    fecha.value = ''
    importe.value = ''
    fecha2.value = ''
    importe2.value = ''
    emit('success')

  } catch (error) {
    console.error('Error al cargar manualmente', error)
    showError('Error al cargar manualmente')
  }
  emit('close')
}

const emit = defineEmits(['close', 'success'])
</script>
