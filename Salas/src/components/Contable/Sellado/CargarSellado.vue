<template>
  <div class="container-fluid">
    <div class="row vh-50">

      <!-- IZQUIERDA: FORMULARIO -->
      <div class="col-12 col-md-6 h-100 overflow-auto  ">
        <div class="card  shadow-sm h-100 ">
          <div class="card-body p-2">

           <form @submit.prevent="handleSubmit" class="container-fluid px-0">

  <div class="row g-2 mb-2">
    <div class="col-6 col-sm-4 col-md-2 form-group">
      <label class="form-label fw-semibold small">Folio</label>
      <input type="number" v-model="form.folio" class="form-control form-control-sm text-center" required />
    </div>

    <div class="col-12 col-sm-8 col-md-8 form-group">
      <label class="form-label fw-semibold small">Nombre del Inquilino</label>
      <input type="text" v-model="form.nombre" class="form-control form-control-sm" required />
    </div>

    <div class="col-6 col-sm-12 col-md-2 form-group">
      <label class="form-label fw-semibold small">C/Meses</label>
      <input type="number" v-model="form.cantidad_meses" class="form-control form-control-sm" required />
    </div>
  </div>

  <div class="row g-2 mb-2">
    <div class="col-6 col-md-3 form-group">
      <label class="form-label fw-semibold small">Monto Alquiler</label>
      <div class="input-group input-group-sm">
        <input type="number" v-model="form.monto_alquiler" class="form-control" required />
      </div>
    </div>

    <div class="col-6 col-md-3 form-group">
      <label class="form-label fw-semibold small">Monto Doc.</label>
      <div class="input-group input-group-sm">
        <input type="number" v-model="form.monto_documento" class="form-control" />
      </div>
    </div>

    <div class="col-6 col-md-3 form-group">
      <label class="form-label fw-semibold small">Monto Contrato</label>
      <div class="input-group input-group-sm">
        <input type="number" v-model="form.monto_contrato" class="form-control" />
      </div>
    </div>

    <div class="col-6 col-md-3 form-group">
      <label class="form-label fw-semibold small">C/Hojas</label>
      <input type="number" v-model="form.hojas" class="form-control form-control-sm" required />
    </div>
  </div>

  <div class="row g-2 mb-3 align-items-end border-bottom pb-3">
    <div class="col-6 col-md-2 form-group">
      <label class="form-label fw-semibold small">Informe</label>
      <select v-model="form.informe" class="form-select form-select-sm">
        <option value="SI">SI</option>
        <option value="NO">NO</option>
      </select>
    </div>

    <div class="col-6 col-md-2 form-group">
      <label class="form-label fw-semibold small">C/ Informes</label>
      <input type="number" v-model="form.cantidad_informes" class="form-control form-control-sm" />
    </div>

    <div class="col-12 col-sm-6 col-md-3 form-group">
      <label class="form-label fw-semibold small">Tipo Contrato</label>
      <select v-model="form.tipo_contrato" class="form-select form-select-sm" required>
        <option disabled value="">Seleccione</option>
        <option value="Vivienda">Vivienda</option>
        <option value="Comercio">Comercio</option>
        <option value="Vivienda Comercial">Viv. Comercial</option>
        <option value="Cochera">Cochera</option>
      </select>
    </div>

    <div class="col-6 col-sm-6 col-md-2 form-group">
      <label class="form-label fw-semibold small">Inq - Prop</label>
      <select v-model="form.inq_prop" class="form-select form-select-sm" required>
        <option value="SI">SI</option>
        <option value="NO">NO</option>
      </select>
    </div>

    <div class="col-6 col-sm-12 col-md-3 form-group">
      <label class="form-label fw-semibold small">Inicio Contrato</label>
      <input type="date" v-model="form.fecha_inicio" class="form-control form-control-sm" required />
    </div>
  </div>

  <div class="row g-2 justify-content-md-end align-items-center">
    <div class="col-4 col-md-auto">
      <button type="button" class="btn btn-outline-secondary btn-sm w-100" @click="resetForm">
        Limpiar
      </button>
    </div>

    <div class="col-6 col-md-auto">
      <button type="submit" class="btn btn-primary btn-sm w-100">
        {{ loading ? 'Calculando...' : 'Calcular' }}
      </button>
    </div>

    <div class="col-2 col-md-auto text-end">
      <div class="dropdown">
        <button class="btn engrtanaje" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-gear"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li><a class="dropdown-item" href="#" @click.prevent="mostrarModal = true">Datos de Cálculo</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="mostrarModalAcciones = true">Acciones</a></li>
        </ul>
      </div>
    </div>
  </div>

</form>

            <div v-if="error" class="alert alert-danger mt-3 small">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- DERECHA: RESULTADOS -->
      <div class="col-12 col-md-6 h-100 overflow-auto">
        <div class="card shadow-sm h-100">
          <div class="card-body p-2">
            <div v-if="resultado">
              <ResultadoSellado :datos="resultado" @registroGuardado="guardarRegistro" />
            </div>
            <div v-else class="alert alert-light text-center">
              Complete el formulario para ver los cálculos.
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="cargando" class="text-center p-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Cargando configuración...</p>
    </div>



    <div class="row mt-3" v-if="registros.length > 0 && !cargando">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body p-2">
            <div class="table-responsive table-scroll-container">
              <table class="table table-striped table-hover w-100" id="tablaDatos">
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Nombre</th>
                    <th>Meses</th>
                    <th>Monto Contrato</th>
                    <th>Hojas</th>
                    <th>Informe</th>
                    <th>Tipo Contrato</th>
                    <th>Inq-Prop</th>
                    <th>Sellado</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in registros" :key="index">
                    <td>{{ item.folio }}</td>
                    <td class="td_nombre">{{ item.nombre }}</td>
                    <td>{{ item.cantidad_meses }}</td>
                    <td>{{ item.monto_contrato }}</td>
                    <td>{{ item.hojas }}</td>
                    <td>{{ item.informe }}</td>
                    <td>{{ item.tipo_contrato }}</td>
                    <td>{{ item.inq_prop }}</td>
                    <td>{{ item.sellado }}</td>
                    <td>{{ item.usuario.username || "-" }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Importar Modales -->
  <ModalDatosCalculos v-if="mostrarModal" :estaAbiertoDatosCalculos="mostrarModal" @cerrar="mostrarModal = false" />
  <ModalAcciones v-if="mostrarModalAcciones" :estaAbierto="mostrarModalAcciones"
    @cerrarModalAcciones="mostrarModalAcciones = false" @recargarTablaDatos="obtenerRegistros" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ResultadoSellado from './ResultadoSellado.vue';
import ModalDatosCalculos from './Modales/ModalDatosCalculos.vue';
import ModalAcciones from './Modales/ModalAcciones.vue';
import { alertas } from '../../../utils/alertas.js'
import { calcularSelladoService, guardarResultadoService, getRegistrosService } from '../../../Services/api/Contable/selladoApi.js'


const mostrarModal = ref(false);
const mostrarModalAcciones = ref(false);
const cargando = ref(false);

const form = ref({
  folio: '',
  nombre: '',
  cantidad_meses: '',
  monto_alquiler: '',
  monto_documento: '',
  monto_contrato: '',
  hojas: '',
  informe: 'NO',
  cantidad_informes: 0,
  inq_prop: 'NO',
  tipo_contrato: '',
  fecha_inicio: ''
});

const registros = ref([]);
const resultado = ref(null);
const loading = ref(false);
const error = ref(null);

/* const showModal = ref(false);
 */
const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  resultado.value = null;

  // Mapeamos los datos para que coincidan EXACTAMENTE con lo que probaste en Postman
  const payload = {
    ...form.value,
    // Convertimos "SI"/"NO" a 1 o 0 si tu API lo requiere así
    informe: form.value.informe === 'SI' ? 1 : 0,
    // Aseguramos que los montos sean números y no strings
    monto_alquiler: Number(form.value.monto_alquiler),
    monto_documento: Number(form.value.monto_documento),
    monto_contrato: Number(form.value.monto_contrato),
    cantidad_meses: Number(form.value.cantidad_meses),
    hojas: Number(form.value.hojas),
    cantidad_informes: Number(form.value.cantidad_informes),
    // Agregamos campos que faltaban pero que Postman pide
    inq_prop: 1,
    // Mapeo de tipo_contrato si es necesario (ejemplo: Vivienda = 1)
    tipo_contrato: form.value.tipo_contrato === 'Vivienda' ? 1 : 2
  };

  try {
    const response = await calcularSelladoService(payload);
    resultado.value = response.data;
  } catch (err) {
    // Si el error es 500, ahora podremos ver el mensaje del servidor
    error.value = err.response?.data?.message || "Error en el servidor";
  } finally {
    loading.value = false;
  }

};

const guardarRegistro = async () => {
  try {
    const payload = {
      ...form.value,
      resultado: resultado.value?.data // aquí combinamos form + resultado
    };
    await guardarResultadoService(payload);

    alertas.success('Registro guardado correctamente');
    // 3. Ejecutar al guardar el registro
    obtenerRegistros();
  } catch (err) {
    alert("Error al guardar: " + (err.response?.data?.message || err.message));
  }
};

const obtenerRegistros = async () => {
  cargando.value = true;
  try {
    const response = await getRegistrosService();
    console.log(response.data.data.registros);
    // Verifica si tu API devuelve los datos en .data o .data.data
    registros.value = response.data.data.registros || response.data;
  } catch (err) {
    alertas.error('Error De conexion ' + (err.response?.data?.message || err.message));
    //alert("Error al obtener registros: " + (err.response?.data?.message || err.message));
  } finally {
    cargando.value = false;
  }
};

const resetForm = () => {
  Object.keys(form.value).forEach(k => {
    form.value[k] = k === 'informe' ? 'NO' : '';
  });
  resultado.value = null;
  error.value = null;
};

// 3. EJECUTAR AL CARGAR EL COMPONENTE
onMounted(() => {
  obtenerRegistros();
});



</script>

<style scoped>
/* Contenedor para el scroll vertical (opcional) */
.table-scroll-container {
  max-height: 25vh;
  /* Ajusta la altura máxima a tu gusto */
  overflow-y: auto;
}

#tablaDatos {
  /* Eliminé border: 10vh porque crearía un borde gigante. 
     Si querías un borde fino, usa 1px o 2px */
  border: 1px solid rgba(0, 175, 154, 0.96);
}

#tablaDatos th {
  color: rgba(0, 175, 154, 0.96);
  font-size: 80%;
  background-color: white;
  position: sticky;
  /* Mantiene el encabezado fijo al hacer scroll vertical */
  top: 0;
  z-index: 1;
}

#tablaDatos td {
  color: blue;
  font-size: 60%;
  padding: 0.4%;
  /* Evita que el texto se rompa en varias líneas */
}

#tablaDatos .td_nombre {
  color: black;
  font-size: 80%;
}

/* --- Tus estilos de engranaje se mantienen igual --- */
.engrtanaje {
  color: rgba(0, 175, 154, 0.96);
  background: transparent;
  border: none;
  font-size: 1.0rem;
  transition: color 0.3s ease, transform 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.engrtanaje:hover {
  color: rgb(0, 85, 185);
  transform: scale(1.1);
}

.engrtanaje .bi-gear {
  display: inline-block;
  animation: girar 4s linear infinite;
}

@keyframes girar {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>