<template>
  <BaseModal :show="estaAbierto" size="" @close="$emit('cerrarModalSellado')">

    <template #title>
      <div class="fw-semibold">
        SELLADO · FOLIO {{ selladoSeleccionado.folio }}
      </div>
      <div v-if="selladoSeleccionado.propiedad" class="small text-muted fw-normal">
        <i class="bi bi-geo-alt me-1"></i>{{ selladoSeleccionado.propiedad.calle.name }} {{
          selladoSeleccionado.propiedad.numero_calle }}
      </div>
    </template>

    <template #body>
      <div v-if="selladoSeleccionado" class="row">
        <!-- quiero que tome color azul -->
         <div class="contrato-seccion-header">
          <i class="bi bi-diagram-3"></i>
          <span>Detalles Adicionales</span>
         </div>
         <div class="col-md-2 form-group">
          <label>Folio</label>
           <input type="text" class="form-control form-control-sm" :value="selladoSeleccionado.folio" readonly>
         </div>
         <div class="col-md-10 form-group">
          <label>Dirección</label>
          <input type="text" class="form-control form-control-sm" :value="[selladoSeleccionado.propiedad?.calle?.name, selladoSeleccionado.propiedad?.numero_calle].filter(Boolean).join(' ')">
         </div>

         <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
          <span>Montos</span>
         </div>

        <div class="col-md-3 form-group">
          <label class="form-label">Monto Contrato</label>
          <input type="text" class="form-control form-control-sm" :value="selladoSeleccionado.monto_contrato" readonly>
        </div>
        <div class="col-md-4 form-group">
          <label class="form-label">Gasto Administrativo</label>
          <input type="text" class="form-control form-control-sm" :value="selladoSeleccionado.gasto_administrativo"
            readonly>
        </div>

        <div class="col-md-4 form-group">
          <label class="form-label">Sellado Provincial</label>
          <input type="text" class="form-control form-control-sm" :value="selladoSeleccionado.sellado" readonly>
        </div>

        <div class="col-md-3 form-group">
          <label class="form-label">Dias Interes</label>
          <input type="number" class="form-control form-control-sm" :value="diasInteres" readonly>
        </div>
        <div class="col-md-3 form-group">
          <label class="form-label"> Intereses</label>
          <input type="text" class="form-control form-control-sm" value="No se" readonly>

        </div>
        <div class="col-md-4 form-group">
          <label class="form-label"> Gastos Registrales</label>
          <input type="text" class="form-control form-control-sm" value="No se" readonly>
        </div>
        <div class="col-md-4 form-group">
          <label class="form-label">Fecha Contrato</label>
          <input type="date" class="form-control form-control-sm" :value="selladoSeleccionado.fecha_inicio" readonly>
        </div>
        <div class="col-md-4 form-group">
          <label class="form-label">Meses</label>
          <input type="number" class="form-control form-control-sm" :value="selladoSeleccionado.cantidad_meses"
            readonly>

        </div>
        <div class="col-md-4 form-group">
          <label class="form-label">Fecha de Pago</label>
          <input type="date" class="form-control form-control-sm" :value="fechaPago">

        </div>
        <div class="col-md-4 form-group">
          <label class="form-label">Cant. cuotas</label>
          <select v-model.number="cantidadCuotas" class="form-select form-select-sm">
            <option v-for="cantidad in 5" :key="cantidad" :value="cantidad">{{ cantidad }}</option>
          </select>
        </div>
        <div class="col-md-4 form-group">
          <label class="form-label">Monto de cada cuota</label>
          <input type="number" class="form-control form-control-sm" :value="montoCuota" readonly>
        </div>

      </div>
      <div v-else>
        <p>No hay información disponible.</p>
      </div>
    </template>

    <template #footer>
      <button class="btn btn-secondary btn-sm" @click="$emit('cerrarModalSellado')">Cerrar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import BaseModal from '../../../base/BaseModal.vue';


const props = defineProps({
  estaAbierto: Boolean,
  selladoSeleccionado: {
    type: Object,
    default: () => ({})
  }
});
defineEmits(['cerrarModalSellado', 'recargarTablaDatos']);

watch(() => props.estaAbierto, (estaAbierto) => {
  if (estaAbierto) {
    console.log('selladoSeleccionado al abrir el modal:', props.selladoSeleccionado);
  }
});

// Día del mes desde el cual empiezan a correr los intereses
const DIA_INICIO_INTERES = 14;
const hoy = new Date();
const fechaPago = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
const cantidadCuotas = ref(1);
const montoCuota = computed(() => {
  const gastoAdministrativo = Number(props.selladoSeleccionado.gasto_administrativo) || 0;
  return (gastoAdministrativo / cantidadCuotas.value).toFixed(2);
});

// Días transcurridos desde el día 14 hasta hoy (ej: hoy 24/09 -> 10)
const diasInteres = computed(() => {
  const hoy = new Date();
  return Math.max(0, hoy.getDate() - DIA_INICIO_INTERES);
});





</script>
