<template>
  <NavComponent />
  <div class="card mx-2 shadow-sm border-0">
    <div class="card-header bg-light border-bottom">
      <div class="d-flex align-items-center">
        <i class="bi bi-funnel me-2"></i>
        <span class="fw-semibold"> FILTRO TIRILLA</span>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3 align-items-end">
        <div class="col-md-1 form-group">
          <label class="">Mes</label>
          <input type="number" class="form-control form-control-sm" v-model="filtros.mes" @keyup.enter="obtenerDatos">

        </div>
        <div class="col-md-1 form-group">
          <label class="">Año</label>
          <input type="number" class="form-control form-control-sm" v-model="filtros.anio" @keyup.enter="obtenerDatos">
        </div>
        <div class="col-md-1 form-group">
          <label>Folio</label>
          <input type="number" class="form-control form-control-sm" v-model="filtros.folio" @keyup.enter="obtenerDatos">
        </div>
        <div class="col-md-2 form-group">
          <label>Nombre</label>
          <input type="text" class="form-control form-control-sm" v-model="filtros.nombre" @keyup.enter="obtenerDatos">

        </div>
        <div class="col-md-2">
          <button type="button" class="btn btn-primary btn-sm w-100" @click="obtenerDatos">
            <i class="bi bi-search me-1"></i>
            Buscar</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card mx-2 shadow-sm border-0 mt-1">
    <div class="card-header bg-light border-bottom">
      <div class="d-flex align-items-center">
        <i class="bi bi-list me-2"></i>
        <span class="fw-semibold"> LISTADO SELLADO A CONFIRMAR</span>
      </div>
    </div>


    <table class="table table-striped table-hover proceso_reserva_table">
      <thead>
        <tr>
          <th>Folio</th>
          <th>Nombre</th>
          <th>Hojas</th>
          <th>Tipo Contrato</th>
          <th>Total Contrato</th>
          <th>Gasto Administrativo</th>
          <th>Confirmar</th>
        </tr>
      </thead>
      <tbody v-for="item in todosLosSellados" :key="item.id">
        <tr>
          <td>{{ item.folio }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.hojas }}</td>
          <td>{{ item.tipo_contrato }}</td>
          <td>{{ item.total_contrato }}</td>
          <td>{{ item.gasto_administrativo }}</td>
          <td>
            <button type="button" class="btn btn-outline-primary btn-sm" @click="mostrarSeleccionado(item)">
              <i class="bi bi-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-success btn-sm mx-1"
              @click="confirmarSellado(item.id_registro_sellado)">
              <i class="bi bi-check cursor-pointer"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ConfirmarSellado :estaAbierto="modalAbierto" :selladoSeleccionado="selladoSeleccionado"
    @cerrarModalSellado="cerrarModal" />
</template>

<script setup>
import NavComponent from '@/components/NavComponent.vue'
import ConfirmarSellado from '@/components/Contable/Sellado/Modales/ConfirmarSellado.vue'
import { onMounted, ref } from 'vue'
import { traerSelladoSinConfirmar, confirmarRegistroService } from '@/Services/api/Contable/selladoApi'
import { useToast } from '@/composables/useToast'
const { showSuccess, showError } = useToast()

const todosLosSellados = ref([])
const selladoSeleccionado = ref({})
const modalAbierto = ref(false)

const filtros = ref({
  mes: '',
  anio: '',
  folio: '',
  nombre: ''
})

const obtenerDatos = async () => {
  try {
    const params = {}
    if (filtros.value.mes) params.mes = filtros.value.mes
    if (filtros.value.anio) params.anio = filtros.value.anio
    if (filtros.value.folio) params.folio = filtros.value.folio
    if (filtros.value.nombre) params.nombre = filtros.value.nombre

    const response = await traerSelladoSinConfirmar(params)
    //console.log(response.data)
    todosLosSellados.value = response.data.data
    showSuccess('Datos obtenidos correctamente')

  } catch (error) {
    console.log(error)
    showError('Error al obtener los datos')
  }
}

const confirmarSellado = async (id) => {
  //console.log(id)

  try {
    await confirmarRegistroService({ id: id })
    await obtenerDatos()


  } catch (error) {
    console.log(error)
    showError('Error al confirmar el sellado')
  }

}

const mostrarSeleccionado = (item) => {
  console.log(item);
  selladoSeleccionado.value = item
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
}
onMounted(() => {
  obtenerDatos()
})
</script>
