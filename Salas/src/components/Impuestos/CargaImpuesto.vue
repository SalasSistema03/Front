<template>
  <div class="px-3">
    <h1 class="titulo-impuestos">Carga de Impuestos {{ props.impuesto?.toUpperCase() }}</h1>
    <div class="row form-group mb-3">

      <!-- Mes (2 dígitos) -->
      <div class="col-md-1 px-1">
        <label for="mes" class="form-label mb-1">Mes</label>
        <input type="number" v-model="mes" class="form-control form-control-sm" placeholder="Mes" min="1" max="12"
          id="mes" oninput="this.value = this.value.slice(0, 2)">
      </div>

      <!-- Año (4 dígitos) -->
      <div class="col-md-1 px-1">
        <label for="anio" class="form-label mb-1">Año</label>
        <input type="number" v-model="anio" class="form-control form-control-sm" placeholder="Año" id="anio"
          oninput="this.value = this.value.slice(0, 4)">
      </div>

      <!-- Folio (hasta 8 números) -->
      <div class="col-md-2 px-1">
        <label for="folio" class="form-label mb-1">Folio</label>
        <input type="number" v-model="folio" class="form-control form-control-sm" placeholder="Folio" maxlength="8"
          pattern="\d{1,8}" title="Máximo 8 números">
      </div>


      <!-- Partida / Clave (hasta 15 números) -->
      <div class="col-md-3 px-1">
        <label for="busqueda" class="form-label mb-1" v-if="props.impuesto === 'tgi'">Partida / Clave</label>
        <label for="busqueda" class="form-label mb-1" v-if="props.impuesto === 'agua'">Partida / Punto</label>
        <input type="number" v-model="busqueda" class="form-control form-control-sm" placeholder="Partida / Clave"
          maxlength="15" pattern="\d{1,15}" title="Máximo 15 números" v-if="props.impuesto === 'tgi'">
        <input type="number" v-model="busqueda" class="form-control form-control-sm" placeholder="Partida / Punto"
          maxlength="15" pattern="\d{1,15}" title="Máximo 15 números" v-if="props.impuesto === 'agua'">
      </div>

      <!-- Estado (select) -->
      <div class="col-md-2 px-1">
        <label for="estado" class="form-label mb-1">Estado</label>
        <select v-model="estado" id="estado" class="form-select form-select-sm" placeholder="">
          <option value="">Todos</option>
          <option value="INACTIVO">Inactivo</option>
          <option value="ACTIVO">Activo</option>
        </select>
      </div>

      <!-- Bajado (select) -->
      <div class="col-md-2 px-1">
        <label for="bajado" class="form-label mb-1">Bajado</label>
        <select v-model="bajado" id="bajado" class="form-select form-select-sm" placeholder="">
          <option value="S">SI</option>
          <option value="N">NO</option>
        </select>
      </div>

      <!-- Botón -->
      <div class="col-md-1 px-1 d-flex align-items-end justify-content-end">
        <button type="button" class="btn btn-sm btn-primary w-100" @click.prevent="filtrar()">Filtrar</button>
      </div>

      <div class="col-md-6 px-1">
        <label for="codigo_barras" class="form-label">Código de Barras</label>
        <input type="text" name="codigo_barras" id="codigo_barras" class="form-control form-control-sm"
          placeholder="Código de Barras" v-model="codigo_barras" @keyup.enter="cargarCodigoBarra()">
      </div>

      <div class="col-md-3 px-1 d-flex align-items-end justify-content-end">
        <button type="button" class="btn btn-primary btn-sm" @click="openModalCargaManual()">
          Carga manual
        </button>
      </div>

      <div v-if="showMasOpciones" class="col-md-3 px-1 d-flex align-items-end justify-content-end">
        <div class="dropdown">
          <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuOpciones"
            data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-gear-fill"></i> Más opciones
          </button>
          <ul class="dropdown-menu dropdown-menu-end listado-mas-opciones-impuestos"
            aria-labelledby="dropdownMenuOpciones">
            <li>
              <button type="button" class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos"
                @click="exportarFaltantesImpuesto()">
                <i class="bi bi-file-earmark-text"></i> Exportar faltantes
              </button>
            </li>
            <li>
              <button class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos"
                @click="armarBroches()">
                <i class="bi bi-diagram-3-fill"></i> Armar broches
              </button>
            </li>
            <li>
              <button class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos" target="_blank"
                @click="exportarBrochesPdf()">
                <i class="bi bi-file-earmark-pdf"></i> Exportar broches
              </button>
            </li>
            <li>
              <button class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos" target="_blank"
                @click="exportarBrochesPdfSalas">
                <i class="bi bi-file-earmark-pdf"></i> Exportar broches SALAS
              </button>
            </li>
            <li>
              <button class="dropdown-item d-flex align-items-center gap-2 text-options-impuestos"
                @click="modificarBajados()">
                <i class="bi bi-clipboard2-check-fill"></i> Modificar bajado
              </button>
            </li>
          </ul>
        </div>
      </div>

    </div>
    <div class="table-responsive contenedor-tabla-impuestos">
      <table class="table table-striped table-hover tabla-impuestos">
        <thead>
          <tr>
            <th>Código de Barras</th>
            <th>Folio</th>
            <th v-if="props.impuesto === 'tgi'">Partida</th>
            <th v-if="props.impuesto === 'agua'">Punto</th>
            <th>Clave</th>
            <th>Adm</th>
            <th>Monto</th>
            <th>Vencimiento</th>
            <th>Bajado</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in PadronCompleto?.data" :key="item.id">
            <td>{{ item.codigo_barra }}</td>
            <td>
              <span v-for="(comp, index) in parseCompartidos(item.compartidos)" :key="index"
                :style="{ color: comp.estado === 'ACTIVO' ? 'green' : 'red' }">
                {{ comp.folio }}{{ index < parseCompartidos(item.compartidos).length - 1 ? ', ' : '' }} </span>
            </td>
            <td>{{ item.padron.partida }}</td>
            <td>{{ item.padron.clave }}</td>
            <td>{{ item.padron.administra }}</td>
            <td>{{ item.importe }}</td>
            <td>{{ formatDate(item.fecha_vencimiento) }}</td>
            <td>{{ item.bajado }}</td>
            <td>
              <div class=" ">
                <button class="btn btn-secondary btn-sm p-0" type="button" data-bs-toggle="dropdown"
                  aria-expanded="false" title="Acciones">
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu lista-mas-opciones-impuestos">
                  <li>
                    <button type="button" class="dropdown-item text-options-impuestos"
                      @click="modificarEstadoImpuesto(item)">
                      Modificar estado
                    </button>
                  </li>
                  <li>
                    <button type="button" class="dropdown-item text-options-impuestos" title="Eliminar"
                      @click="eliminarImpuesto(item)">
                      Eliminar
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  </div>


  <ModalCargaManual :show="showModificarModal" @close="showModificarModal = false" :impuesto="impuesto"
    @success="filtrar"></ModalCargaManual>

  <BrochePdf ref="brochePdfRef" :broches="brochesData" :anio="anio" :mes="mes" />

  <BrochePdfSalas ref="brochePdfSalasRef" :broches="brochesDataSalas" :anio="anio" :mes="mes" />

  <ModalModificarEstado :show="showModificarEstadoModal" @close="showModificarEstadoModal = false" :impuesto="impuesto"
    :padron="selectedEstadoItem" @success="filtrar"></ModalModificarEstado>

  <ModalArmarBroche :show="showArmarBroches" @close="showArmarBroches = false" :impuesto="props.impuesto" :mes="mes"
    :anio="anio"></ModalArmarBroche>

</template>
<script setup>
import { padronCarga } from '@/Services/api/Impuestos/tgiApi'
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from '@/composables/useToast'
import { useDateFormatter } from '@/composables/useDateFormatter';
import ModalCargaManual from '@/components/Impuestos/ModalImpuestos/ModalCargaManual.vue';
import ModalArmarBroche from '@/components/Impuestos/ModalImpuestos/ModalArmarBroche.vue';
import BrochePdf from '@/components/Impuestos/Pdfs/BrochePdf.vue';
import BrochePdfSalas from '@/components/Impuestos/Pdfs/BrochePdfSalas.vue';
import { cargaNuevoImpuesto } from '@/Services/api/Impuestos/tgiApi';
import { exportarFaltantes } from '@/Services/api/Impuestos/tgiApi';
import { exportarBroches } from '@/Services/api/Impuestos/tgiApi';
import { exportarBrochesSalas } from '@/Services/api/Impuestos/tgiApi';
import { ModificarBajado } from '@/Services/api/Impuestos/tgiApi';
import ModalModificarEstado from '@/components/Impuestos/ModalImpuestos/ModalModificarEstado.vue';
import { EliminarImpuesto } from '@/Services/api/Impuestos/tgiApi';


const props = defineProps({
  impuesto: {
    type: String,
    required: true
  }
})

const { showError, showSuccess, } = useToast();
const { formatDate } = useDateFormatter();
const mes = ref(null)
const anio = ref(null)
const folio = ref(null)
const busqueda = ref(null)
const estado = ref(null)
const bajado = ref(null)
const codigo_barras = ref('')
const PadronCompleto = ref([])
const showModificarModal = ref(false)
const showMasOpciones = ref(false)
const showArmarBroches = ref(false)
const brochePdfRef = ref(null)
const brochesData = ref([])
const brochePdfSalasRef = ref(null)
const brochesDataSalas = ref([])
const showModificarEstadoModal = ref(false)
const selectedEstadoItem = ref(null)


const filtrar = async () => {
  const form = {
    mes: mes.value || null,
    anio: anio.value || null,
    folio: folio.value || null,
    busqueda: busqueda.value || null,
    estado: estado.value || null,
    bajado: bajado.value || null,
    impuesto: props.impuesto,
  }

  try {
    const response = await padronCarga(form)
    PadronCompleto.value = response
    //console.log('este es el padron', PadronCompleto.value)
    if (mes.value !== null && anio.value !== null) {
      showMasOpciones.value = true
    }
    showSuccess('Padrón cargado correctamente')
    return response
  } catch (error) {
    console.error(error)
    showError('Error al cargar el padrón')
  }
}

const openModalCargaManual = () => {
  props.impuesto;
  showModificarModal.value = true;
}

const cargarCodigoBarra = async () => {
  const form = {
    codigo_barras: codigo_barras.value,
    impuesto: props.impuesto
  }
  try {
    await cargaNuevoImpuesto(form)
    showSuccess('Código de barras cargado correctamente')
    codigo_barras.value = ''
    await filtrar()
  } catch (error) {
    console.error(error)
    showError('Error al cargar el código de barras')
  }
}

const exportarFaltantesImpuesto = async () => {
  try {
    const response = await exportarFaltantes({
      mes: mes.value || null,
      anio: anio.value || null,
      impuesto: props.impuesto,
    })
    // Descarga automática del archivo
    const blob = new Blob([response.data], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `tgi_faltantes_${anio.value}_${mes.value}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    //console.log('Response:', response)
    showSuccess('Exportación de faltantes exitosa')
  } catch (error) {
    console.error(error)
    showError('Error al exportar faltantes')
  }
}

const exportarBrochesPdf = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: mes.value,
    anio: anio.value,
  }
  try {
    const response = await exportarBroches(form)
    brochesData.value = response.data.broches
    //console.log('Broches data:', brochesData.value)
    await nextTick()
    await brochePdfRef.value.generarPdf()
    showSuccess('Exportación de broches exitosa')
  } catch (error) {
    console.error(error)
    showError('Error al exportar broches')
  }
}

const exportarBrochesPdfSalas = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: mes.value,
    anio: anio.value
  }
  try {
    const response = await exportarBrochesSalas(form)
    //console.log('Response SALAS:', response)
    brochesDataSalas.value = response.data.broches

    await nextTick()
    await brochePdfSalasRef.value.generarPdf()
    showSuccess('Exportación de broches SALAS exitosa')
  } catch (error) {
    console.error(error)
    showError('Error al exportar broches SALAS')
  }
}

const parseCompartidos = (compartidos) => {
  try {
    if (compartidos && typeof compartidos === 'string') {
      const compartidosArray = JSON.parse(compartidos)
      return compartidosArray
    }
    return []
  } catch (e) {
    console.error('Error parsing compartidos:', e)
    return []
  }
}

const modificarBajados = async () => {
  const form = {
    impuesto: props.impuesto,
    mes: mes.value,
    anio: anio.value
  }
  try {
    const response = await ModificarBajado(form)
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

const modificarEstadoImpuesto = (item) => {
  selectedEstadoItem.value = item
  showModificarEstadoModal.value = true
}

const eliminarImpuesto = async (item) => {
  const form = {
    id: item.id,
    impuesto: props.impuesto,
    anio: anio.value,
    mes: mes.value,
    busqueda: busqueda.value
  }
  try {
    const response = await EliminarImpuesto(form)
    console.log(response)
  } catch (error) {
    console.error(error)
  }

}

const armarBroches = async () => {
  if (mes.value === null || anio.value === null) {
    showError('Seleccioná mes y año antes de armar broches')
    return
  }
  showArmarBroches.value = true
}
onMounted(async () => {
  await filtrar();
})

</script>
