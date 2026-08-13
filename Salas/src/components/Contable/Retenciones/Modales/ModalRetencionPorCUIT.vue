<template>
  <BaseModal :show="modalRetencionPorCUIT" size="xl" @close="$emit('cerrarModalRetencionPorCUIT')">
    <template #title>Retención por CUIT</template>

    <template #body>
      <div class="form-group row mb-3">
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            v-model="form.cuit"
            placeholder="Ingrese CUIT (sin guiones)"
          />
        </div>

        <div class="col-md-4">
          <button class="btn btn-primary" @click="obtenerRetenciones">Buscar</button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-primary" @click="exportaRetencionesCuit()">Exportar</button>
        </div>
      </div>

      <div class="table-responsive table-scroll-container">
        <table class="table table-striped table-hover w-100" id="tablaDatos">
          <thead>
            <tr>
              <th>Razon Social</th>
              <th>CUIT</th>
              <th>Fecha</th>
              <th>Importe Comprobante</th>
              <th>Importe Retención</th>
            </tr>
          </thead>
          <tbody id="contenedor_retenciones_x_cuit">
            <!-- Aquí se cargarán las retenciones -->
            <tr v-for="registro in registros" :key="registro.id">
              <td>{{ registro.razon_social_retencion }}</td>
              <td>{{ registro.cuit_retencion }}</td>
              <td>{{ registro.fecha_comprobante }}</td>
              <td>{{ registro.importe_comprobante }}</td>
              <td>{{ registro.importe_retencion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template #footer> </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import {
  retencionPorCUITService,
  exportarRetencion,
} from '@/Services/api/Contable/RetencionesApi.js'
import { ref } from 'vue'

const props = defineProps({
  modalRetencionPorCUIT: Boolean,
})
const emit = defineEmits(['cerrarModalRetencionPorCUIT'])

const form = ref({ cuit: '' })
const registros = ref([])
const nombreArchivo = ref('retenciones_cuit.xlsx')

async function obtenerRetenciones() {
  try {
    //console.log("CUIT:", form.value.cuit);
    const response = await retencionPorCUITService(form.value.cuit)
    //console.log("response", response);

    if (response.data.status === 'success') {
      registros.value = response.data.data
    }
  } catch (error) {
    console.error('Error al obtener retenciones:', error)
    // Aquí podrías usar una alerta (SweetAlert o similar)
  }
}

/* async function exportaRetencionesCuit() {
  try {
    const response = await exportarRetencion({
      registros: registros.value,
    })
    // Descarga automática del archivo
    const blob = new Blob([response.data], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `retenciones_cuit.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    //console.log('Response:', response)
    //showSuccess('Exportación de faltantes exitosa')
  } catch (error) {
    console.log(error)
  }
} */

async function exportaRetencionesCuit() {
  try {
    const razonSocial = registros.value[0]?.razon_social_retencion || 'retenciones_cuit'
    const nombreBase = `${razonSocial.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'retenciones_cuit'}`
    const nombreArchivo = `${nombreBase}_retenciones.xlsx`

    const response = await exportarRetencion({
      registros: registros.value,
      nombreArchivo,
    })

    const disposition = response.headers['content-disposition']
    let fileName = nombreArchivo

    if (disposition) {
      const match = disposition.match(/filename="(.+)"/)
      if (match?.[1]) {
        fileName = match[1]
      }
    }

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style scoped>
/* Contenedor para el scroll vertical (opcional) */
.table-scroll-container {
  max-height: 35vh;
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
</style>
