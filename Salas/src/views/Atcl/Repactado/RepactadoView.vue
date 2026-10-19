<template>
  <NavComponent />
  <!-- Aseguramos que el contenido empiece debajo del Nav -->
  <div class="card">
    <div class="card-header d-flex card-header-tasaciones">
      <i class="bi bi-table me-2"></i>
      <p>Listado de Repactado</p>
    </div>
    <div class="card-body">
      <table id="tablaRepactado" class="table table-hover table-bordered table-responsive">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Cuenta Corriente</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Fecha Cierre</th>
            <th>Plazo y Actualizacion Contrato</th>
            <th>Condicion</th>
            <th>Inicio Contrato</th>
            <th>Vencimiento Contrato</th>
            <th>Situacion</th>
            <th>Apellido y Nombre</th>
            <th>Telefono</th>
            <th>Direccion</th>
            <th>Localidad</th>
            <th>Tipo</th>
            <th>Comodidades</th>
            <th>Propietario</th>
            <th>Telefono</th>
            <th>Viejo</th>
            <th>C/ DOC</th>
            <th>TOTAL</th>
            <th>Nuevo</th>
            <th>% 2º Año</th>
            <th>Total 2º Año</th>
            <th>Comentario Inquilino</th>
            <th>Comentario Propietario</th>
            <th>Aviso Prop</th>
            <th>Gestor repactado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
            </td>
          </tr>

        </tbody>
      </table>

    </div>

  </div>


</template>

<script setup>
import NavComponent from '../../../components/NavComponent.vue'
</script>
