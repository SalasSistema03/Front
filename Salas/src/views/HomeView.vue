<template>
  <NavComponent />
  <div class="px-5">
    <div class="row d-flex justify-content-between p-2">
      <div class="col-md-6 card p-0 home-card-all">
        <div class="card-header card-header-home ">
          Agenda
        </div>
        <div class="card-body-home m-0 p-0">
          <table class="table table-sm table-home table-hover table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Descripcion</th>
                <th>Direccion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="data.length === 0">
                <td colspan="4" class="text-center alerta-agenda-home">"No hay eventos ni tareas registradas para esta semana."</td>
              </tr>
              <tr v-else v-for="item in data" :key="item.id">
                <td>{{ item.fecha }}</td>
                <td>{{ item.hora_inicio }} hs.</td>
                <td>{{ item.descripcion ?? '-' }}</td>
                <td>{{ item.propiedad?.calle?.name ?? '-' }} {{ item.propiedad?.numero_calle ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-md-6 card p-0 home-card-all">
        <div class="card-header card-header-home ">
          Agenda Semanal
        </div>
        <div class="card-body-home m-0 p-0">
          <table class="table table-sm table-home table-hover table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Descripcion</th>
                <th>Direccion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="semanales.length === 0">
                <td colspan="4" class="text-center">"No hay eventos ni tareas registradas para esta semana."</td>
              </tr>
              <tr v-else v-for="item in semanales" :key="item.id">
                <td>{{ item.fecha }}</td>
                <td>{{ item.hora_inicio }} hs.</td>
                <td>{{ item.descripcion ?? '-' }}</td>
                <td>{{ item.propiedad?.calle?.name ?? '-' }} {{ item.propiedad?.numero_calle ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import NavComponent from '../components/NavComponent.vue'
import { traerAgendaDiaria } from '../Services/api/Agenda/AgendaApi'
import { ref, onMounted } from 'vue'
const data = ref([])
const semanales = ref([])
const listadoDiario = async () => {
  try {
    const response = await traerAgendaDiaria()

    data.value = response.data.diarias
    semanales.value = response.data.semanales
    console.log(data.value)
  } catch (error) {
    console.error('Error al listar agenda', error)
  }
}
onMounted(() => {
  listadoDiario()
})
</script>
