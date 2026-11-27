<template>
  <div class="px-3">
    <div class="row  d-flex align-items-center justify-content-between">

      <div
        v-if="ultimoPeriodo"
        class="periodo-padron col-2 d-flex align-items-center justify-content-center"
        :title="`Última actualización: ${formatDate(ultimoPeriodo)}`"
      >
        <i class="bi bi-calendar-check"></i>
        Período: <strong>{{ formatPeriod(ultimoPeriodo) }}</strong>
      </div> 
      <div class="col-10">
         <h1 class="titulo-impuestos">Padron {{ props.impuesto?.toUpperCase() }}</h1>
      </div>
    </div>
   
    <div class="row form-group mb-2 d-flex align-items-end justify-content-center">
      <div v-if="props.impuesto !== 'epe'" class="col-4 row p-0">
        <div v-if="requierePeriodo" class="col-6 row ">
          <div class="col-6 ">
            <label :for="`periodo-mes-${props.impuesto}`" class="form-label mb-0">Mes</label>
            <input
              :id="`periodo-mes-${props.impuesto}`"
              v-model.number="mesPadron"
              type="number"
              class="form-control form-control-sm w-auto"
              min="1"
              max="12"
              :disabled="!puedeActualizarPadron || actualizandoPadron"
            />
          </div>
          <div class="col-6">
            <label :for="`periodo-anio-${props.impuesto}`" class="form-label mb-0">Año</label>
            <input
              :id="`periodo-anio-${props.impuesto}`"
              v-model.number="anioPadron"
              type="number"
              class="form-control form-control-sm w-auto"
              min="1900"
              max="9999"
              :disabled="!puedeActualizarPadron || actualizandoPadron"
            />
          </div>
        </div>
        <div class="col-6 d-flex align-items-end justify-content-center">
          <button
            class="btn btn-sm btn-primary w-100"
            @click="actualizarPadron()"
            :disabled="!puedeActualizarPadron || actualizandoPadron || !periodoValido"
          >
            <span
              v-if="actualizandoPadron"
              class="spinner-border spinner-border-sm me-1"
              role="status"
              aria-hidden="true"
            ></span>
            {{
              actualizandoPadron ? 'Actualizando...' : `Actualizar ${props.impuesto?.toUpperCase()}`
            }}
          </button>
        </div>
      </div>

      <form class="col-8 row " autocomplete="off">
        <!-- Input que filtra solo por FOLIO -->
        <div class="col-md-2">
          <label class="form-label mb-0">Folio</label>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Buscar por folio..."
            v-model="search_folio"
          />
        </div>

        <!-- Input que filtra por todo menos por FOLIO -->
        <div class="col-md-4">
          <label class="form-label mb-0" v-if="props.impuesto === 'tgi'">Partida/Clave</label>
          <label class="form-label mb-0" v-if="props.impuesto === 'agua'">Partida/Punto</label>
          <label class="form-label mb-0" v-if="props.impuesto === 'gas'">Persona/Cliente</label>
          <label class="form-label mb-0" v-if="props.impuesto === 'api'">Partida</label>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Buscar por calle, partida, clave..."
            v-model="search_all"
            v-if="props.impuesto === 'tgi'"
          />
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Buscar por calle, partida, punto..."
            v-model="search_all"
            v-if="props.impuesto === 'agua'"
          />
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Buscar por calle, persona, cliente..."
            v-model="search_all"
            v-if="props.impuesto === 'gas'"
          />
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Buscar por calle, partida..."
            v-model="search_all"
            v-if="props.impuesto === 'api'"
          />
        </div>

        <div class="col-md-3 d-flex align-items-end justify-content-center">
          <button
            class="btn btn-secondary dropdown-toggle w-100 btn-sm"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            Filtrar opciones
          </button>
          <div class="dropdown-menu p-3" style="min-width: 25px">
            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="filtro-activo"
                value="ACTIVO"
                v-model="filtros"
              />
              <label class="form-check-label cursor-pointer user-select-none" for="filtro-activo"
                >Activos</label
              >
            </div>
            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="filtro-inactivo"
                value="INACTIVO"
                v-model="filtros"
              />
              <label class="form-check-label cursor-pointer user-select-none" for="filtro-inactivo"
                >Inactivos</label
              >
            </div>
            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="filtro-pendiente"
                value="PENDIENTE"
                v-model="filtros"
              />
              <label class="form-check-label cursor-pointer user-select-none" for="filtro-pendiente"
                >Pendientes</label
              >
            </div>
            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="filtro-modificado"
                value="MODIFICADO"
                v-model="filtros"
              />
              <label
                class="form-check-label cursor-pointer user-select-none"
                for="filtro-modificado"
                >Modificados</label
              >
            </div>
            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="filtro-l"
                value="L"
                v-model="filtros"
              />
              <label class="form-check-label cursor-pointer user-select-none" for="filtro-l"
                >Adm inmobiliario</label
              >
            </div>
            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="filtro-p"
                value="P"
                v-model="filtros"
              />
              <label class="form-check-label cursor-pointer user-select-none" for="filtro-p"
                >Adm propietario</label
              >
            </div>
            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="filtro-i"
                value="I"
                v-model="filtros"
              />
              <label class="form-check-label cursor-pointer user-select-none" for="filtro-i"
                >Adm inquilino</label
              >
            </div>

            <div class="form-check cursor-pointer">
              <input
                class="form-check-input cursor-pointer"
                type="checkbox"
                id="Seguir_pagando"
                value="SEGUIR-PAGANDO"
                v-model="filtros"
              />
              <label class="form-check-label cursor-pointer user-select-none" for="Seguir_pagando"
                >Seguir pagando</label
              >
            </div>
          </div>
        </div>

        <div class="col-md-3 d-flex align-items-end justify-content-center">
          <button type="button" class="btn btn-primary btn-sm w-100" @click="filtrar()">
            Filtrar
          </button>
        </div>
      </form>
    </div>

    <div class="table-responsive contenedor-tabla-impuestos">
      <table class="table table-striped table-hover tabla-impuestos">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Calle</th>
            <th
              v-if="
                props.impuesto === 'tgi' || props.impuesto === 'agua' || props.impuesto === 'api'
              "
            >
              Partida
            </th>

            <th v-if="props.impuesto === 'gas'">Persona</th>
            <th v-if="props.impuesto === 'tgi'">Clave</th>
            <th v-if="props.impuesto === 'agua'">Punto</th>
            <th v-if="props.impuesto === 'gas'">Cliente</th>
            <th>Administra</th>
            <th>Estado</th>
            <th>Comienza</th>
            <th>Rescicion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="padron in PadronCompleto?.original?.data"
            :key="padron.id"
            :class="{ 'table-danger': padron.estado === 'INACTIVO' }"
          >
            <td>{{ padron.folio }}</td>
            <td>{{ padron.calle }}</td>
            <td>{{ padron.partida }}</td>
            <td v-if="props.impuesto != 'api'">{{ padron.clave }}</td>
            <td>{{ padron.administra }}</td>
            <td>{{ padron.estado }}</td>
            <td>{{ formatDate(padron.comienza) }}</td>
            <td>{{ formatDate(padron.rescicion) }}</td>
            <td>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                @click="openModalModificar(padron)"
              >
                Modificar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalModificarPadron
    :show="showModificarModal"
    :padron="selectedPadron"
    :impuesto="props.impuesto"
    @close="closeModalModificar"
    @success="handleSuccess"
  />
</template>
<script setup>
import { useToast } from '@/composables/useToast'
import { useDateFormatter } from '@/composables/useDateFormatter'
import { ref, computed, onMounted } from 'vue'
import { actualizaPadron, getPadron } from '@/Services/api/Impuestos/tgiApi'
import ModalModificarPadron from './ModalImpuestos/ModalModificarPadron.vue'

const props = defineProps({
  impuesto: {
    type: String,
    required: true,
  },
})

const { showError, showSuccess } = useToast()
const { formatDate, formatPeriod } = useDateFormatter()
const filtros = ref([])
const search_all = ref(null)
const search_folio = ref(null)
const PadronCompleto = ref([])
const puedeActualizarPadron = ref(true)
const actualizandoPadron = ref(false)
const ultimoPeriodo = ref(null)
const selectedPadron = ref(null)
const showModificarModal = ref(false)
const requierePeriodo = computed(() => ['tgi', 'api'].includes(props.impuesto))
const hoy = new Date()
const anioPadron = ref(hoy.getFullYear())
const mesPadron = ref(hoy.getMonth() + 1)
const periodoValido = computed(() => {
  if (!requierePeriodo.value) return true

  return (
    Number.isInteger(anioPadron.value) &&
    anioPadron.value >= 1900 &&
    anioPadron.value <= 9999 &&
    Number.isInteger(mesPadron.value) &&
    mesPadron.value >= 1 &&
    mesPadron.value <= 12
  )
})

const actualizarPadron = async () => {
  if (actualizandoPadron.value) return

  if (!periodoValido.value) {
    showError('Ingresá un año válido y un mes entre 1 y 12')
    return
  }

  actualizandoPadron.value = true
  try {
    const periodo = requierePeriodo.value ? { anio: anioPadron.value, mes: mesPadron.value } : {}
    const response = await actualizaPadron({ impuesto: props.impuesto, ...periodo })
    if (response?.data?.ultimo_periodo) {
      ultimoPeriodo.value = response.data.ultimo_periodo
    }
    showSuccess('Padrón actualizado correctamente')
    await filtrar(false)
  } catch (error) {
    console.error(error)
    showError('Error al actualizar el padrón')
  } finally {
    actualizandoPadron.value = false
  }
}

const filtrar = async (mostrarConfirmacion = true) => {
  const form = {
    impuesto: props.impuesto,
    filtros: filtros.value,
    search_all: search_all.value,
    search_folio: search_folio.value,
  }
  try {
    console.log(filtros.value)
    const padron = await getPadron(form)
    PadronCompleto.value = padron?.data?.resultado
    puedeActualizarPadron.value = Boolean(
      padron?.data?.botones?.[`actualizaPadron_${props.impuesto}`],
    )
    ultimoPeriodo.value = padron?.data?.ultimo_periodo ?? null
    //console.log(padron)
    if (mostrarConfirmacion) {
      showSuccess('Padrón filtrado correctamente')
    }
    return padron
  } catch (error) {
    console.log(error)
    showError('Error al filtrar el padrón')
  }
}

const openModalModificar = (padron) => {
  selectedPadron.value = padron
  props.impuesto
  showModificarModal.value = true
}

const closeModalModificar = () => {
  showModificarModal.value = false
  selectedPadron.value = null
}

const handleSuccess = async () => {
  await filtrar()
  closeModalModificar()
}

onMounted(async () => {
  await filtrar()
})
</script>
