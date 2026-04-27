<template>
  <div class="px-3">
    <h1 class="titulo-impuestos">Padron {{ props.impuesto?.toUpperCase() }}</h1>
    <div class="row form-group">
      <div class="col-auto">
        <button class="btn btn-sm btn-primary" @click="actualizarPadron()">
          Actualizar Padrón {{ props.impuesto?.toUpperCase() }}
        </button>
      </div>

      <form class="row mb-3" autocomplete="off">

        <!-- Input que filtra solo por FOLIO -->
        <div class="col-md-2 px-1">
          <label class="form-label">Folio</label>
          <input type="text" class="form-control form-control-sm" placeholder="Buscar por folio..."
            v-model="search_folio">
        </div>


        <!-- Input que filtra por todo menos por FOLIO -->
        <div class="col-md-4">
          <label class="form-label" v-if="props.impuesto === 'tgi'">Partida/Clave</label>
          <label class="form-label" v-if="props.impuesto === 'agua'">Partida/Punto</label>
          <label class="form-label" v-if="props.impuesto === 'gas'">Persona/Cliente</label>
          <input type="text" class="form-control form-control-sm" placeholder="Buscar por calle, partida, clave..."
            v-model="search_all" v-if="props.impuesto === 'tgi'">
          <input type="text" class="form-control form-control-sm" placeholder="Buscar por calle, partida, punto..."
            v-model="search_all" v-if="props.impuesto === 'agua'">
          <input type="text" class="form-control form-control-sm" placeholder="Buscar por calle, persona, cliente..."
            v-model="search_all" v-if="props.impuesto === 'gas'">
        </div>


        <div class="col-md-3 d-flex align-items-end justify-content-center">

          <button class="btn btn-secondary dropdown-toggle w-100 btn-sm" type="button" data-bs-toggle="dropdown"
            data-bs-auto-close="outside" aria-expanded="false">
            Filtrar opciones
          </button>
          <div class="dropdown-menu p-3" style="min-width: 25px;">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="ACTIVO" v-model="filtros">
              <label class="form-check-label">Activos</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="INACTIVO" v-model="filtros">
              <label class="form-check-label">Inactivos</label>
            </div>
            <div class="form-check" v-if="props.impuesto === 'agua' || props.impuesto === 'gas'">
              <input class="form-check-input" type="checkbox" value="PENDIENTE" v-model="filtros">
              <label class="form-check-label">Pendientes</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="L" v-model="filtros">
              <label class="form-check-label">Adm inmobiliario</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="P" v-model="filtros">
              <label class="form-check-label">Adm propietario</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="I" v-model="filtros">
              <label class="form-check-label">Adm inquilino</label>
            </div>
          </div>

        </div>

        <div class="col-md-3 d-flex align-items-end justify-content-center">
          <button type="button" class="btn btn-primary btn-sm w-100" @click="filtrar()">Filtrar</button>
        </div>
      </form>


    </div>

    <div class="table-responsive contenedor-tabla-impuestos">
      <table class="table table-striped table-hover tabla-impuestos">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Calle</th>
            <th v-if="props.impuesto === 'tgi' || props.impuesto === 'agua'">Partida</th>
            <th v-if="props.impuesto === 'gas'">Persona</th>
            <th v-if="props.impuesto === 'tgi'">Clave</th>
            <th v-if="props.impuesto === 'agua'">Punto</th>
            <th v-if="props.impuesto === 'gas'">Cliente</th>
            <th>Administra</th>
            <th>Estado</th>
            <th>Comienza</th>
            <th>Rescicion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="padron in PadronCompleto?.data?.data" :key="padron.id"
            :class="{ 'table-danger': padron.estado === 'INACTIVO' }">
            <td>{{ padron.folio }}</td>
            <td>{{ padron.calle }}</td>
            <td>{{ padron.partida }}</td>
            <td>{{ padron.clave }}</td>
            <td>{{ padron.administra }}</td>
            <td>{{ padron.estado }}</td>
            <td>{{ formatDate(padron.comienza) }}</td>
            <td>{{ formatDate(padron.rescicion) }}</td>
            <td>
              <button type="button" class="btn btn-sm btn-primary" @click="openModalModificar(padron)">
                Modificar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

  <ModalModificarPadron :show="showModificarModal" :padron="selectedPadron" :impuesto="props.impuesto"
    @close="closeModalModificar" @success="handleSuccess" />
</template>
<script setup>

import { useToast } from '@/composables/useToast';
import { useDateFormatter } from '@/composables/useDateFormatter';
import { ref, onMounted } from 'vue';
import { actualizaPadron, getPadron } from '@/Services/api/Impuestos/tgiApi';
import ModalModificarPadron from './ModalImpuestos/ModalModificarPadron.vue';

const props = defineProps({
  impuesto: {
    type: String,
    required: true
  }
});

const { showError, showSuccess, } = useToast();
const { formatDate } = useDateFormatter();
const filtros = ref([]);
const search_all = ref(null);
const search_folio = ref(null);
const PadronCompleto = ref([]);
const selectedPadron = ref(null);
const showModificarModal = ref(false);


const actualizarPadron = async () => {
  try {
    await actualizaPadron({ impuesto: props.impuesto });
    showSuccess('Padrón actualizado correctamente');
  } catch (error) {
    console.error(error);
    showError('Error al actualizar el padrón');
  }
}

const filtrar = async () => {
  const form = {
    impuesto: props.impuesto,
    filtros: filtros.value,
    search_all: search_all.value,
    search_folio: search_folio.value
  }
  try {
    const padron = await getPadron(form);
    PadronCompleto.value = padron;
    showSuccess('Padrón filtrado correctamente');
    return padron;
  } catch (error) {
    console.log(error);
    showError('Error al filtrar el padrón');
  }
}

const openModalModificar = (padron) => {
  selectedPadron.value = padron;
  props.impuesto;
  showModificarModal.value = true;
}

const closeModalModificar = () => {
  showModificarModal.value = false;
  selectedPadron.value = null;
}

const handleSuccess = async () => {
  await filtrar();
  closeModalModificar();
}

onMounted(async () => {
  await filtrar();
})
</script>
