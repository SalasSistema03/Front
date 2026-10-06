<template>
  <NavComponent />
  <div class="row mx-2">
    <div class="col-4">
      <div class="card">
        <div class="card-header d-flex align-items-center" style="max-height: 39px">
          <i class="bi bi-funnel me-3"></i>
          <p class="card-title pt-2">Filtro Tasaciones</p>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- <div class="col-md-12"> -->
            <div class="col-md-12 form-group">
              <label for="fecha_desde">CALLE</label>
              <input
                type="text"
                id="fecha_desde"
                v-model="calle"
                class="form-control form-control-sm"
              />
            </div>
            <div class="col-md-7 form-group">
              <label for="fecha_hasta">PROPIETARIO</label>
              <input
                type="text"
                id="fecha_hasta"
                v-model="propietario"
                class="form-control form-control-sm"
              />
            </div>
            <div class="col-md-5 form-group">
              <label for="fecha_hasta">Tasacion Informada</label>
              <select
                id="fecha_hasta"
                v-model="tasacion_informada"
                class="form-control form-control-sm"
              >
                <option value="">Seleccione</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </select>
            </div>
            <div class="col-md-6 form-group">
              <label for="fecha_hasta">Inicio Tasacion</label>
              <input
                type="date"
                id="fecha_hasta"
                v-model="fecha_tasacion"
                class="form-control form-control-sm"
              />
            </div>
            <div class="col-md-6 form-group">
              <label for="fecha_hasta">Fin Tasacion</label>
              <input
                type="date"
                id="fecha_hasta"
                v-model="fecha_tasacion"
                class="form-control form-control-sm"
              />
            </div>
            <div class="row">
              <div class="col-6 mt-3">
                <button
                  type="button"
                  class="btn btn-success btn-sm w-100"
                  @click="mostrarModalCarga = true"
                >
                  <i class="bi bi-plus-circle me-1"></i>
                  Nueva tasación
                </button>
              </div>
              <div class="col-md-4 mt-3">
                <button class="btn btn-primary w-100 btn-sm" @click="filtrarTasaciones">
                  Filtrar
                </button>
              </div>
              <div class="col-2 mt-3">
                <i class="bi bi-arrow-counterclockwise ms-2" role="button"></i>

              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-8">
      <div class="card">
        <div class="card-header d-flex align-items-center" style="max-height: 39px">
          <i class="bi bi-info-circle me-3"></i>
          <p class="card-title pt-2">Informacion General</p>
        </div>
        <div class="card-body">
          <div class="row g-2">
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">
                  Tasaciones Totales
                </div>
                <div class="fw-bold fs-6">387</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">Ingresos</div>
                <div class="fw-bold fs-6">220</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">No Ingresados</div>
                <div class="fw-bold fs-6">65</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">Venta</div>
                <div class="fw-bold fs-6">207</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">Alquiler</div>
                <div class="fw-bold fs-6">138</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">
                  Porcentaje no Ingresados
                </div>
                <div class="fw-bold fs-6">16.8%</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">Porcentaje</div>
                <div class="fw-bold fs-6">56.8%</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">
                  Tasaciones 2024
                </div>
                <div class="fw-bold fs-6">103</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">
                  Tasaciones 2025
                </div>
                <div class="fw-bold fs-6">220</div>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-lg-2">
              <div class="border rounded p-1 bg-light text-center h-100">
                <div class="text-muted text-truncate" style="font-size: 0.75rem">Cancelados</div>
                <div class="fw-bold fs-6">13</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 mt-1">
      <div class="card">
        <div class="card-header d-flex align-items-center" style="max-height: 39px">
          <i class="bi bi-table me-3"></i>
          <p class="card-title pt-2">Listado de Tasaciones</p>
        </div>
        <div class="card-body">
          <table class="table table-striped table-hover proceso_reserva_table">
            <thead>
              <tr>
                <th>INMUEBLE</th>
                <th>CALLE</th>
                <th>FOLIO</th>
                <th>PROPIETARIO</th>
                <th>Nº TELEFONO</th>
                <th>INGRESO</th>
                <th>TIPO TASACION</th>
                <th>TASACION VENTA</th>
                <th>TASACION ALQUILER</th>
                <th>COSTO TASACION</th>
                <th>TASADOR</th>
                <th>OBSERVACIONES</th>
                <th>TASACION INFORMADA PROP</th>
                <th>FECHA</th>
              </tr>
            </thead>
            <tbody>
              <td>Departamento</td>
              <td>
                <div>GRAL LOPEZ 2960</div>
                <small class="text-muted">P3 DTO B C/COCH N°8</small>
              </td>
              <td>2254</td>
              <td>Pilchischen, Carlos Daniel</td>
              <td>3425164014</td>
              <td>Telefónicamente</td>
              <td>Alquiler</td>
              <td>U$S 400.000</td>
              <td>$1.000.000</td>
              <td>$105.000</td>
              <td>Roberto Giusiano</td>
              <td>
                Nos comunicamos cerca del finde 03/02 - Quedamos en comunicarnos cerca del viernes
                14/02 - no responde 19/02- 28/05/25 pide nuevamente la tasacion
              </td>
              <td>???</td>
              <td>???</td>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <ModalTasacionesPropiedad :show="mostrarModalCarga" @close="mostrarModalCarga = false" />
 
</template>

<script setup>
import { ref } from 'vue'
import NavComponent from '../../../components/NavComponent.vue'
import ModalTasacionesPropiedad from '../../../components/Atcl/Tasaciones/ModalTasacionesPropiedad.vue'

const mostrarModalCarga = ref(false)


</script>
