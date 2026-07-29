<template>
  <NavComponent />

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
        <tr >
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
              <button
                class="btn btn-secondary btn-sm p-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Acciones"
              >
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu lista-mas-opciones-impuestos">
                <li>
                  <button
                    type="button"
                    class="dropdown-item text-options-impuestos_lista"
                    @click="abrirModalContrato(item)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="dropdown-item text-options-impuestos_lista"
                    @click="abrirModalObservacionesContrato(item)"
                  >
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
</script>
