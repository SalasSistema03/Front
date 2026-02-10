<template>
  <div class="card border-0 shadow-sm h-100">
    <div class="card-body p-2">
      <table v-if="datos && datos.data" class="table table-bordered table-sm text-center align-middle mb-2">
        
        <thead class="table-info text-success small">
          <tr>
            <th>Total Contrato</th>
            <th>Prop. Alquiler</th>
            <th>Prop. Documento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ datos.data.total_contrato }}</td>
            <td>{{ datos.data.prop_alquiler }}</td>
            <td>{{ datos.data.prop_doc }}</td>
          </tr>
        </tbody>

        <thead class="table-info text-success small">
          <tr>
            <th>Gasto Adm.</th>
            <th>IVA Gasto Adm.</th>
            <th>Sellado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ datos.data.gasto_administrativo }}</td>
            <td>{{ datos.data.iva_gasto_adm }}</td>
            <td>$ {{ datos.data.sellado }}</td>
          </tr>
        </tbody>

        <thead class="table-info text-success small">
          <tr>
            <th colspan="3">Valor Informe</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="3">$ {{ datos.data.valor_informe }}</td>
          </tr>
        </tbody>

      </table>

      <div v-else class="text-center py-4 text-muted small">
        Esperando cálculos...
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  datos: {
    type: Object,
    required: true
  }
});
</script>