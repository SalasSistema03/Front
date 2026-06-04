<template>
  <NavComponent />

  <div class="card m-5">
    <div class="card-header agenda_listado_card_header p-0">
      Listado de Agenda
    </div>
    <div class="card-body agenda_listado_card_body row p-3 m-0 d-flex justify-content-between">
      <div class="form-group col-2">
        <label class="form-label" for="">Sector</label>
        <select class="form-control" v-model="sectorSeleccionado">
          <option value="">Seleccione</option>
          <option v-for="sector in sectores" :key="sector.id" :value="sector.id">
            {{ sector.nombre }}
          </option>

        </select>
      </div>
      <div class="form-group col-2">
        <label class="form-label" for="">Fecha Inicio</label>
        <input class="form-control" type="date" v-model="fecha_inicio"  :max="fecha_fin">
      </div>
      <div class="form-group col-2">
        <label class="form-label" for="">Fecha Fin</label>
        <input class="form-control" type="date" v-model="fecha_fin"  :min="fecha_inicio">
      </div>
      <div class="form-group col-2">
        <label class="form-label" for="">Usuario</label>
        <select class="form-control" v-model="usuarioSeleccionado">
          <option value="">Seleccione</option>
          <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
            {{ usuario.username }}
          </option>

        </select>
      </div>
      <div class="form-group col-2">
        <label class="form-label" for="">Estado</label>
        <select class="form-control" v-model="estado">
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>

    </div>
    <div class="form-group col-12 p-3 m-0">
      <button class="btn btn-sm btn-primary w-50" type="button" @click="listar">Listar</button>
    </div>
  </div>

  <ListadoAgendaPdfView ref="listadoAgendaRef" :formAgenda="formAgenda"/>

</template>
<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'

import NavComponent from '../../../components/NavComponent.vue'
import { useToast } from '@/composables/useToast'
import {getSectores, UsuariosEnAgenda } from '../../../Services/api/Agenda/AgendaApi'
import ListadoAgendaPdfView from './ListadoAgendaPdfView.vue'

// VARIABLES IMPORTADAS
const { showError } = useToast()

// VARIABLES REACTIVAS
const sectores = ref([])
const usuarios = ref([])
const listadoAgendaRef = ref(null)
const formAgenda = ref({})


// FILTROS
const usuarioSeleccionado = ref("")
const estado = ref(1)
const fecha_fin = ref(null)
const fecha_inicio = ref(null)
const sectorSeleccionado = ref("")


// ON MOUNTED
onMounted(async () => {

  try {
    // Traer sectores
    const response = await getSectores()
    sectores.value = response.data
  } catch (error) {
    console.error('Error al traer sectores', error)
  }

})


// WATCH SECTOR
watch(sectorSeleccionado, async (nuevoSector) => {

  // Si no seleccionó sector
  if (!nuevoSector) {
    usuarios.value = []
    usuarioSeleccionado.value = ""
    return
  }

  try {
    const response = await UsuariosEnAgenda(nuevoSector)
    usuarios.value = response.data
  } catch (error) {
    console.error('Error al traer usuarios', error)
  }
})


// LISTAR
const listar = async () => {
  try {
    const form = {
      usuario: usuarioSeleccionado.value,
      estado: estado.value,
      fecha_fin: fecha_fin.value,
      fecha_inicio: fecha_inicio.value,
      sector: sectorSeleccionado.value
    }


    if(form.usuario === null || form.usuario === ""){
      showError('Debe seleccionar un usuario para listar la agenda')
      return
    }
    if(form.sector === ""){
      showError('Debe seleccionar un sector para listar la agenda')
      return
    }
    if(form.fecha_inicio === null || form.fecha_fin === null){
      showError('Debe seleccionar un rango de fechas para listar la agenda')
      return
    }

    formAgenda.value = form
    await nextTick()
    listadoAgendaRef.value?.generarPdf()

    //console.log(form)
    //const response = await listarAgenda(form)
    //console.log(response.data)

  } catch (error) {
    console.error('Error al listar agenda', error)
  }
}
</script>
