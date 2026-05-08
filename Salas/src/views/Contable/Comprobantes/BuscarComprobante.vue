<template>
  <NavComponent />
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h4>Buscar PDF</h4>
          </div>
          <div class="card-body">
            <div class="form-group row">

              <input type="hidden" name="admin" value="0">
              <div class="col-md-4">
                <label for="empresa" class="form-label">Empresa</label>
                <select v-model="empresa" class="form-control">
                  <option value="Salas">Central</option>
                  <option value="Dolly">Candioti</option>
                  <option value="Florencia">Sur</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="comprobante" class="form-label">Comprobante</label>
                <select v-model="comprobante" class="form-control" required>
                  <option value="Facturas">Facturas</option>
                  <option value="Notas de Credito">Notas de Credito</option>
                  <option value="Notas de Debito">Notas de Debito</option>
                  <option value="Opp Concatenadas">Opp Concatenadas</option>
                  <option value="Ordenes de Pago">Ordenes de Pago</option>
                  <option value="Ordenes de Cobro">Ordenes de Cobro</option>
                  <option value="Recibos">Recibos</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="quien" class="form-label">Quien</label>
                <select v-model="quien" class="form-control" required>
                  <option value="Inquilinos">Inquilinos</option>
                  <option value="Propietarios">Propietarios</option>
                  <option value="Proveedores">Proveedores</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="tipo" class="form-label">Tipo</label>
                <select v-model="tipo" class="form-control" required>
                  <option value="Originales">Originales</option>
                  <option value="Duplicados">Duplicados</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="letra" class="form-label">Letra </label>
                <select v-model="letra" class="form-control" required>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="X">X</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="numero" class="form-label ">Número <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="numero" placeholder="Número" required
                  autocomplete="off">
              </div>

              <div class="col-md-12">
                <hr>
              </div>
              <div class="col-md-12 d-flex justify-content-center">
                <button type="button" @click="buscarPDF" class="btn btn-primary w-75">Buscar PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>

<script setup>
import NavComponent from '@/components/NavComponent.vue';
import { ref } from 'vue';
import { buscarPdf } from '@/Services/api/Contable/bucaPdfApi';
import { useToast } from '@/composables/useToast'

const {showError} = useToast()

const empresa = ref('Salas');
const comprobante = ref('Facturas');
const quien = ref('Inquilinos');
const tipo = ref('Originales');
const letra = ref('A');
const numero = ref(null);

const buscarPDF = async () => {
  try {
    if (!numero.value) {
      showError('El número es obligatorio');
      return;
    }

    const formData = new FormData();
    formData.append('empresa', empresa.value);
    formData.append('comprobante', comprobante.value);
    formData.append('quien', quien.value);
    formData.append('tipo', tipo.value);
    formData.append('letra', letra.value);
    formData.append('numero', numero.value);

    const response = await buscarPdf(formData);
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');

    if (newWindow) {
      // ✅ Revocar recién cuando el usuario cierre la ventana
      const intervalo = setInterval(() => {
        if (newWindow.closed) {
          window.URL.revokeObjectURL(url);
          clearInterval(intervalo);
        }
      }, 1000);
    } else {
      // Si el navegador bloqueó el popup, liberar después de 5 min
      setTimeout(() => window.URL.revokeObjectURL(url), 5 * 60 * 1000);
    }

  } catch (error) {
    showError('No se encontró el PDF');
  }
};
</script>
