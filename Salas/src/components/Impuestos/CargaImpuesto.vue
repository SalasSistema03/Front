<template>
  <div class="px-3">
    <h1 class="titulo-impuestos">Carga de Impuestos TGI</h1>
    <div class="row form-group mb-3">

      <!-- Mes (2 dígitos) -->
      <div class="col-md-1 px-1">
        <label for="mes" class="form-label mb-1">Mes</label>
        <input type="number" v-model="mes" class="form-control form-control-sm" placeholder="Mes" min="1" max="12"
          id="mes" oninput="this.value = this.value.slice(0, 2)">
      </div>

      <!-- Año (4 dígitos) -->
      <div class="col-md-1 px-1">
        <label for="anio" class="form-label mb-1">Año</label>
        <input type="number" v-model="anio" class="form-control form-control-sm" placeholder="Año" id="anio"
          oninput="this.value = this.value.slice(0, 4)">
      </div>

      <!-- Folio (hasta 8 números) -->
      <div class="col-md-2 px-1">
        <label for="folio" class="form-label mb-1">Folio</label>
        <input type="number" v-model="folio" class="form-control form-control-sm" placeholder="Folio" maxlength="8"
          pattern="\d{1,8}" title="Máximo 8 números">
      </div>


      <!-- Partida / Clave (hasta 15 números) -->
      <div class="col-md-3 px-1">
        <label for="busqueda" class="form-label mb-1">Partida / Clave</label>
        <input type="number" v-model="busqueda" class="form-control form-control-sm" placeholder="Partida / Clave"
          maxlength="15" pattern="\d{1,15}" title="Máximo 15 números">
      </div>

      <!-- Estado (select) -->
      <div class="col-md-2 px-1">
        <label for="estado" class="form-label mb-1">Estado</label>
        <select v-model="estado" id="estado" class="form-select form-select-sm" placeholder="">
          <option value="">Todos</option>
          <option value="INACTIVO">Inactivo</option>
          <option value="ACTIVO">Activo</option>
        </select>
      </div>

      <!-- Bajado (select) -->
      <div class="col-md-2 px-1">
        <label for="bajado" class="form-label mb-1">Bajado</label>
        <select v-model="bajado" id="bajado" class="form-select form-select-sm" placeholder="">
          <option value="S">SI</option>
          <option value="N">NO</option>
        </select>
      </div>

      <!-- Botón -->
      <div class="col-md-1 px-1 d-flex align-items-end justify-content-end">
        <button type="button" class="btn btn-sm btn-primary w-100" @click.prevent="filtrar()">Filtrar</button>
      </div>

      <div class="col-md-6 px-1">
        <label for="codigo_barras" class="form-label">Código de Barras</label>
        <input type="text" name="codigo_barras" id="codigo_barras" class="form-control form-control-sm"
          placeholder="Código de Barras" v-model="codigo_barras" @keyup.enter="cargarCodigoBarra()">
      </div>

      <div class="col-md-3 px-1 d-flex align-items-end justify-content-end">
        <button type="button" class="btn btn-primary btn-sm" @click="openModalCargaManual()">
          Carga manual
        </button>
      </div>

      <div v-if="mes !== null && anio !== null" class="col-md-3 px-1 d-flex align-items-end justify-content-end">
        <div class="dropdown">
          <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuOpciones"
            data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-gear-fill"></i> Más opciones
          </button>
          <ul class="dropdown-menu dropdown-menu-end listado-mas-opciones-impuestos"
            aria-labelledby="dropdownMenuOpciones">
            <li>
              <a class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos">
                <i class="bi bi-file-earmark-text"></i> Exportar faltantes
              </a>
            </li>
            <li>
              <a class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos" href="#"
                data-bs-toggle="modal" data-bs-target="#modalArmarBroches">
                <i class="bi bi-diagram-3-fill"></i> Armar broches
              </a>
            </li>
            <li>
              <a class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos" target="_blank">
                <i class="bi bi-file-earmark-pdf"></i> Exportar broches
              </a>
            </li>
            <li>
              <a class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos" target="_blank">
                <i class="bi bi-file-earmark-pdf"></i> Exportar broches SALAS
              </a>
            </li>

            <!-- Ejecuta la ruta modificar_bajado para modificar el bajado de los registros de tgi_carga que tengan num_broche por el mes y año indicados -->

            <li>
              <a class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos">
                <i class="bi bi-clipboard2-check-fill"></i> Modificar bajado
              </a>
            </li>



          </ul>
        </div>




        <!-- Modal para armar broches -->
        <!-- Modal para armar broches -->
        <div class="modal fade" id="modalArmarBroches" tabindex="-1" aria-labelledby="modalArmarBrochesLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content shadow-sm">
              <div class="modal-header bg-success text-white">
                <h5 class="modal-title" id="modalArmarBrochesLabel">
                  <i class="bi bi-diagram-3-fill me-2"></i> Armar Broches
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                  aria-label="Cerrar"></button>
              </div>
              <form method="POST">

                <div class="modal-body">
                  <div class="row g-4">
                    <!-- Columna TGI -->
                    <div class="col-md-6">
                      <h6 class="text-primary">TGI - Administra L</h6>
                      <p class="fw-bold text-muted" id="monto_total">Monto Total: —</p>

                      <label for="cant_broches" class="form-label">Cantidad de broches</label>
                      <div class="input-group mb-2">
                        <input type="number" name="num_broches" id="cant_broches" class="form-control form-control-sm"
                          placeholder="Ej: 3">
                        <button type="button" class="btn btn-outline-primary btn-sm" id="btn_calculaBroches">
                          <i class="bi bi-calculator"></i> Calcular
                        </button>
                      </div>

                      <label class="form-label mt-3">Resultado</label>
                      <ul class="list-group" id="contenedor_resultado_broche">
                        <!-- JS genera aquí los broches -->
                      </ul>
                    </div>

                    <!-- Columna Salas -->
                    <div class="col-md-6">
                      <h6 class="text-success">TGI - Salas</h6>
                      <p class="fw-bold text-muted" id="monto_total_salas">Monto Total Salas: —</p>

                      <label for="cant_broches_salas" class="form-label">Cantidad de broches</label>
                      <input type="text" id="cant_broches_salas" class="form-control form-control-sm mb-3" value="1"
                        readonly>
                    </div>
                  </div>
                </div>

                <!-- Footer con botones alineados -->
                <div class="modal-footer justify-content-between">
                  <button type="submit" class="btn btn-primary btn-sm" id="btn_guardar_broches_tgi">
                    <i class="bi bi-save"></i> Guardar Broches TGI
                  </button>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success btn-sm" id="btn_guardar_broches_salas">
                      <i class="bi bi-save"></i> Guardar Broches Salas
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>


      </div>

    </div>
    <div class="table-responsive contenedor-tabla-impuestos">
      <table class="table table-striped table-hover tabla-impuestos">
        <thead>
          <tr>
            <th>Código de Barras</th>
            <th>Folio</th>
            <th>Partida</th>
            <th>Clave</th>
            <th>Adm</th>
            <th>Monto</th>
            <th>Vencimiento</th>
            <th>Bajado</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in PadronCompleto?.data" :key="item.id">
            <td>{{ item.codigo_barra }}</td>
            <td>{{ item.padron.folio }}</td>
            <td>{{ item.padron.partida }}</td>
            <td>{{ item.padron.clave }}</td>
            <td>{{ item.padron.administra }}</td>
            <td>{{ item.importe }}</td>
            <td>{{ formatDate(item.fecha_vencimiento) }}</td>
            <td>{{ item.bajado }}</td>




            <!-- Acciones -->
            <td>
              <div class=" ">
                <button class="btn btn-secondary btn-sm p-0" type="button" data-bs-toggle="dropdown"
                  aria-expanded="false" title="Acciones">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu lista-mas-opciones-impuestos">
                  <li>
                    <button type="button" class="dropdown-item text-options-impuestos" data-bs-toggle="modal"
                      data-bs-target="#modalEstado{{ $registro->id }}">
                      Modificar estado
                    </button>
                  </li>
                  <li>
                    <form class="text-options-impuestos" autocomplete="off">

                      <input type="hidden" name="anio" value="">
                      <input type="hidden" name="mes" value="">
                      <input type="hidden" name="busqueda" value="">
                      <button type="submit" class="dropdown-item text-options-impuestos" title="Eliminar">
                        Eliminar
                      </button>
                    </form>
                  </li>
                </ul>
              </div>

              <!-- Modal único por registro -->
              <div class="modal fade" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-sm">
                  <div class="modal-content">
                    <form autocomplete="off">

                      <div class="modal-header">
                        <h5 class="modal-title">Modificar estado</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>


                      <div class="modal-body">
                        <div class="form-group">
                          <label>Estado</label>
                          <select name="estado" class="form-select">
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                          </select>
                        </div>
                      </div>

                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary">Guardar cambios</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  </div>


  <ModalCargaManual :show="showModificarModal" @close="showModificarModal = false" :impuesto="impuesto"
    @success="filtrar"></ModalCargaManual>

</template>
<script setup>
import { padronCarga } from '@/Services/api/Impuestos/tgiApi'
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useDateFormatter } from '@/composables/useDateFormatter';
import ModalCargaManual from '@/components/Impuestos/Tgi/ModalCargaManual.vue';

const props = defineProps({
  impuesto: {
    type: String,
    required: true
  }
})

const { showError, showSuccess, } = useToast();
const { formatDate } = useDateFormatter();
const mes = ref(null)
const anio = ref(null)
const folio = ref(null)
const busqueda = ref(null)
const estado = ref(null)
const bajado = ref(null)
const codigo_barras = ref('')
const PadronCompleto = ref([])
const showModificarModal = ref(false);


const filtrar = async () => {
  // TODO: Implementar lógica de filtrado
  //console.log('Filtrando con:', { mes: mes.value, anio: anio.value, folio: folio.value, busqueda: busqueda.value, estado: estado.value, bajado: bajado.value })
  const form = {
    mes: mes.value || null,
    anio: anio.value || null,
    folio: folio.value || null,
    busqueda: busqueda.value || null,
    estado: estado.value || null,
    bajado: bajado.value || null,
    impuesto: props.impuesto,
  }
  try {
    //alert('Folio antes de enviar:' + folio.value)
    const response = await padronCarga(form)
    console.log('Response:', response)
    PadronCompleto.value = response
    showSuccess('Padrón cargado correctamente')
    return response
  } catch (error) {
    console.error(error)
    showError('Error al cargar el padrón')
  }
}

const openModalCargaManual = () => {
  props.impuesto;
  showModificarModal.value = true;
}

const cargarCodigoBarra = () => {
  console.log('Código de barras:', codigo_barras.value)
  // TODO: Implementar lógica para cargar código de barras
}

onMounted(async () => {
  await filtrar();
})

</script>
