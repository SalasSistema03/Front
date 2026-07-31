<template>
  <NavComponent />


  <div class="row">
    <div class="col-md-1 form-group">
      <label>Mes</label>
      <select v-model="mes" class="form-control">
        <option value="">Todos</option>
        <option :value="1">Enero</option>
        <option :value="2">Febrero</option>
        <option :value="3">Marzo</option>
        <option :value="4">Abril</option>
        <option :value="5">Mayo</option>
        <option :value="6">Junio</option>
        <option :value="7">Julio</option>
        <option :value="8">Agosto</option>
        <option :value="9">Septiembre</option>
        <option :value="10">Octubre</option>
        <option :value="11">Noviembre</option>
        <option :value="12">Diciembre</option>
      </select>
    </div>

    <div class="col-md-1 form-group">
      <label>Año</label>
      <select v-model="anio" class="form-control">
        <option v-for="año in obtenerAñoMenos3()" :key="año" :value="año">{{ año }}</option>
      </select>
    </div>

  </div>


  <div class="row">
    <div class="col-md-2 form-group">
      <label for="">T. Inventarios</label>
      <input type="number" class="form-control" />
    </div>


    <div class="col-md-2 form-group">
      <label for="">Inv. Realizados</label>
      <input type="number" class="form-control" />
    </div>

    <div class="col-md-2 form-group">
      <label for="">Inv. Restantes</label>
      <input type="number" class="form-control" />
    </div>
  </div>



  <div class="proceso_reserva_tabla_contenedor mt-2">
    <table class="table table-striped table-hover proceso_reserva_table">
      <thead>
        <tr class="text-center">
          <th>Domicilio</th>
          <th>Fecha Reserva</th>
          <th>Dias Transcurridos</th>
          <th>Verificado por</th>
          <th>Fecha Inventario</th>
          <th>Folio</th>
          <th>Tipo Ingreso</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>

          </td>
          <td></td>
          <td></td>
          <td>
            <div class=" ">
              <button class="btn btn-secondary btn-sm p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                title="Acciones">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu lista-mas-opciones-impuestos">
                <li>
                  <button type="button" class="dropdown-item text-options-impuestos_lista"
                    @click="abrirModalContrato(item)">
                    Editar
                  </button>
                  <button type="button" class="dropdown-item text-options-impuestos_lista"
                    @click="abrirModalObservacionesContrato(item)">
                    Observaciones
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>
<script setup>
import NavComponent from '../../../components/NavComponent.vue'
import { useFiltroMesAnio } from '@/composables/useFiltroMesAnio'

const { mes, anio, obtenerAñoMenos3 } = useFiltroMesAnio()
</script>
