<template>
  <NavComponent />

  <div class="card mx-2 shadow-sm border-0">

    <!-- Encabezado -->
    <div class="card-header bg-light border-bottom py-2">
      <div class="d-flex align-items-center">
        <i class="bi bi-funnel me-2"></i>
        <span class="fw-semibold">FILTRO CLIENTES</span>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card-body py-3">
      <div class="row g-3 align-items-end">

        <!-- Numero de Cliente -->
        <div class="col-md-2 form-group">
          <label class="form-label mb-1 small fw-semibold">
            Numero de Cliente
          </label>

          <input type="number" class="form-control form-control-sm" v-model="numero_cliente_buscado"
            :disabled="desactivarNumeroCliente" @keyup.enter="buscar" />
        </div>

        <!-- Folio -->
        <div class="col-md-2 form-group">
          <label class="form-label mb-1 small fw-semibold">
            Folio
          </label>

          <input type="number" class="form-control form-control-sm" v-model="folio_buscado" :disabled="desactivarFolio"
            @keyup.enter="buscar" />
        </div>

        <!-- Empresa -->
        <div class="col-md-2 form-group">
          <label class="form-label mb-1 small fw-semibold">
            Empresa
          </label>

          <select class="form-control form-control-sm" v-model="empresa_seleccionada" :disabled="desactivarEmpresa">
            <option value="">Seleccionar</option>
            <option value="1">Central</option>
            <option value="2">Candioti</option>
            <option value="3">Tribunales</option>
          </select>
        </div>

        <!-- Buscar -->
        <div class="col-md-2">
          <button type="button" class="btn btn-primary btn-sm w-100" @click="buscar">
            <i class="bi bi-search me-1"></i>
            Buscar
          </button>
        </div>

        <!-- Cargar -->
        <div class="col-md-2">
          <button type="button" class="btn btn-outline-secondary btn-sm w-100" @click="abrirModalCargar">
            <i class="bi bi-upload me-1"></i>
            Cargar
          </button>
        </div>

      </div>
    </div>

  </div>





  <div class="card shadow-sm mt-1 mx-2">
    <div class="card-body p-0">
      <div class="table-responsive contenedor-tabla-epe px-1" style="height: 400px !important; ">
        <table class="table table-hover table-striped mb-0 align-middle tabla-impuestos">
          <thead class="table-light">
            <tr style="position: sticky; top: 0px; z-index: 1;">
              <th>Nº Cliente</th>
              <th>Plan</th>
              <th>Ruta</th>
              <th>Folio</th>
              <th>D.S</th>
              <th>Folio Salas</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in resultadoConsulta" :key="cliente.id">
              <td>{{ cliente.cliente }}</td>
              <td>{{ cliente.plan }}</td>
              <td>{{ cliente.ruta }}</td>
              <td>{{ cliente.folio }}</td>
              <td>{{ cliente.ds }}</td>
              <td>{{ cliente.propiedad?.empresas?.[0]?.pivot?.folio || '-' }}</td>
              <td><i class="bi bi-pencil-square" role="button" @click="editarEpe(cliente)"></i></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>

  <ModalCargarEpe :show="showModalCargar" :item-editar="epeSeleccionado" @close="cerrarModal" @guardado="buscar" />

</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import NavComponent from '../../../components/NavComponent.vue'
import ModalCargarEpe from '@/components/Impuestos/Epe/ModalCargarEpe.vue'
import { useToast } from '@/composables/useToast.js';
import { BuscarClienteEpe } from '@/Services/api/Impuestos/epeApi.js';

const showModalCargar = ref(false);
const epeSeleccionado = ref(null);

const abrirModalCargar = () => {
  epeSeleccionado.value = null;
  showModalCargar.value = true;
};

const editarEpe = (cliente) => {
  epeSeleccionado.value = cliente;
  showModalCargar.value = true;
};

const cerrarModal = () => {
  showModalCargar.value = false;
  epeSeleccionado.value = null;
};



const numero_cliente_buscado = ref(null);
const { showSuccess, showError, showWarning } = useToast()

const empresa_seleccionada = ref("");
const folio_buscado = ref(null);
const desactivarNumeroCliente = ref(false);
const desactivarFolio = ref(false);
const desactivarEmpresa = ref(false);
const resultadoConsulta = ref([]);

const buscar = async () => {
  const tieneCliente = numero_cliente_buscado.value !== null && numero_cliente_buscado.value !== '';
  const tieneFolio = folio_buscado.value !== null && folio_buscado.value !== '';
  const tieneEmpresa = empresa_seleccionada.value !== '';

  // 1. Si no hay nada ingresado
  /* if (!tieneCliente && !tieneFolio && !tieneEmpresa) {
    showWarning("Ingrese un número de cliente o un folio con su empresa");
    return;
  }
 */
  // 2. Si se está buscando por Número de Cliente
  if (tieneCliente) {
    if (Number(numero_cliente_buscado.value) < 0) {
      showWarning("El número de cliente no puede ser negativo");
      return;
    }
    if (String(numero_cliente_buscado.value).length > 10) {
      showWarning("El número de cliente no puede superar los 10 dígitos");
      return;
    }
  }

  // 3. Si se está buscando por Folio / Empresa
  if (tieneFolio || tieneEmpresa) {
    if (!tieneFolio) {
      showWarning("Debe ingresar el número de folio");
      return;
    }
    if (!tieneEmpresa) {
      showWarning("Debe seleccionar una empresa para el folio");
      return;
    }
    if (Number(folio_buscado.value) < 0) {
      showWarning("El folio no puede ser negativo");
      return;
    }
    if (String(folio_buscado.value).length > 5) {
      showWarning("El folio no puede superar los 5 dígitos");
      return;
    }
  }

  try {
    const payload = tieneCliente
      ? { numero_cliente: numero_cliente_buscado.value }
      : { folio: folio_buscado.value, empresa: empresa_seleccionada.value };

    //console.log(payload)

    const response = await BuscarClienteEpe(payload);
    resultadoConsulta.value = response.data
    //console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}


watch(numero_cliente_buscado, (nuevo) => {
  const tieneValor = nuevo !== null && nuevo !== '';
  desactivarFolio.value = tieneValor;
  desactivarEmpresa.value = tieneValor;
});

watch(folio_buscado, (nuevoFolio) => {
  if (nuevoFolio === null || nuevoFolio === '') {
    empresa_seleccionada.value = "";
  }
});

watch([folio_buscado, empresa_seleccionada], ([nuevoFolio, nuevaEmpresa]) => {
  const tieneFolio = nuevoFolio !== null && nuevoFolio !== '';
  const tieneEmpresa = nuevaEmpresa !== '';
  desactivarNumeroCliente.value = tieneFolio || tieneEmpresa;
});

onMounted(() => {
  buscar();
})


</script>
