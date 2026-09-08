<template>
  <!-- Utilizamos BaseModal y enlazamos la prop "show" -->
  <BaseModal :show="show" size="xl" @close="$emit('close')">

    <template #title>
      <i class="bi bi-person-lines-fill text-primary me-2"></i> Gestión de Propietarios
    </template>

    <template #body>
      <!-- BARRA DE BÚSQUEDA Y ACCIONES -->
      <div v-if="mostrarBuscador" class="bg-light p-3 rounded border mb-3">
        <div class="row g-2 align-items-center">

          <div class="col-md-6 position-relative">
            <div class="input-group input-group-sm shadow-sm">
              <span class="input-group-text bg-white border-end-0 text-muted">
                <i class="bi bi-search"></i>
              </span>
              <input type="text" class="form-control border-start-0 ps-0" placeholder="Buscar por apellido o DNI..."
                v-model="busqueda" @input="buscar" autocomplete="off">
            </div>

            <!-- Lista desplegable de sugerencias -->
            <ul v-if="sugerencias.length > 0" class="list-group position-absolute w-100 shadow sugerencias-lista">
              <li v-for="persona in sugerencias" :key="persona.id"
                class="list-group-item list-group-item-action cursor-pointer py-2 small fw-semibold"
                @click="seleccionarPersona(persona)">
                <i class="bi bi-person-check text-primary me-2"></i>
                {{ persona.apellido }}, {{ persona.nombre }} <span class="text-muted fw-normal ms-1">({{
                  persona.documento || 'Sin DNI' }})</span>
              </li>
            </ul>
          </div>

          <div class="col-md-3">
            <button type="button" class="btn btn-primary btn-sm w-100 fw-bold shadow-sm" @click="asignarPropietario">
              <i class="bi bi-plus-circle"></i> Asignar Seleccionado
            </button>
          </div>
          <div class="col-md-3">
            <button type="button" class="btn btn-outline-dark btn-sm w-100 fw-bold shadow-sm bg-white"
              @click="abrirModalCargaPersona">
              <i class="bi bi-person-vcard"></i> Crear Nueva Persona
            </button>
          </div>

        </div>
      </div>

      <!-- SEPARADOR -->
      <hr v-if="!propiedad" class="text-muted opacity-25">

      <!-- TABLA DE PROPIETARIOS -->
      <div class="table-responsive border rounded shadow-sm">
        <table class="table table-sm table-hover align-middle mb-0">
          <thead class="table-light text-secondary">
            <tr>
              <th class="ps-3" style="width: 25%;">Nombre y Apellido</th>
              <th style="width: 30%;">Motivo de Baja</th>
              <th class="text-center" style="width: 10%;">De Baja</th>
              <th class="text-center" style="width: 15%;">Nacimiento</th>
              <th class="text-end pe-3" style="width: 20%;">Acciones</th>
            </tr>
          </thead>

          <!-- CUERPO PARA "UPDATE" (Con propiedad) -->
          <tbody v-if="propiedad">
            <tr v-for="(item, index) in propiedad.propietarios" :key="index">
              <td class="ps-3 fw-semibold text-dark">{{ item.apellido }}, {{ item.nombre }}</td>
              <td>
                <textarea class="form-control form-control-sm text-muted bg-light compact-textarea"
                  v-model="item.pivot.observaciones_baja" rows="1" placeholder="Observaciones..."
                  :disabled="item.pivot?.baja !== 'si' || props.ocultarBotones" @input="emitirCambiosPropietario">
</textarea>
              </td>
              <td class="text-center">
                <span class="badge" :class="item.pivot?.baja === 'si' ? 'bg-danger' : 'bg-success'">
                  {{ item.pivot?.baja === 'si' ? 'SÍ' : 'NO' }}
                </span>
              </td>
              <td class="text-center small">{{ formatFecha(item.fecha_nacimiento) }}</td>
              <td class="text-end pe-3">
                <div class="btn-group shadow-sm">
                  <button v-if="!ocultarBotones" type="button" class="btn btn-outline-secondary btn-sm"
                    title="Alternar Estado" @click="toggleBajaPropietario(item)">
                    <i class="bi"
                      :class="item.pivot?.baja === 'si' ? 'bi-arrow-repeat text-success' : 'bi-arrow-down-circle text-danger'"></i>
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm" title="Ver Datos"
                    @click="verPropietario(item)">
                    <i class="bi bi-eye-fill text-info"></i>
                  </button>
                  <button v-if="!ocultarBotones" type="button" class="btn btn-outline-secondary btn-sm" title="Editar"
                    @click="editarPropietario(item)">
                    <i class="bi bi-pencil-square text-primary"></i>
                  </button>
<!--                   <button v-if="mostrarQuitar" type="button" class="btn btn-outline-danger btn-sm" title="Quitar"
                    @click="eliminarPropietario(index)">
                    <i class="bi bi-trash-fill"></i>
                  </button> -->
                </div>
              </td>
            </tr>
            <tr v-if="propiedad.propietarios.length === 0">
              <td colspan="5" class="text-center text-muted py-4">No hay propietarios asignados.</td>
            </tr>
          </tbody>

          <!-- CUERPO PARA "CREATE" (Sin propiedad) -->
          <tbody v-else>
            <tr v-for="(item, index) in propietarios" :key="index">
              <td class="ps-3 fw-semibold text-dark">{{ item.apellido }}, {{ item.nombre }}</td>
              <td>
                <textarea class="form-control form-control-sm text-muted bg-light compact-textarea"
                  v-model="item.pivot.observaciones_baja" rows="1" placeholder="Observaciones..."
                  :disabled="item.pivot?.baja !== 'si'" @input="emitirCambiosPropietario">
                </textarea>
              </td>
              <td class="text-center">
                <span class="badge" :class="item.pivot?.baja === 'si' ? 'bg-danger' : 'bg-success'" >
                  {{ item.pivot?.baja === 'si' ? 'SÍ' : 'NO' }}
                </span>
              </td>
              <td class="text-center small">{{ formatFecha(item.fecha_nacimiento) }}</td>
              <td class="text-end pe-3">
                <div class="btn-group shadow-sm">
                  <button type="button" class="btn btn-outline-secondary btn-sm" title="Ver Datos"
                    @click="verPropietario(item)">
                    <i class="bi bi-eye-fill text-info"></i>
                  </button>
                  <button type="button" class="btn btn-outline-danger btn-sm" title="Quitar"
                    @click="eliminarPropietario(index)">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="propietarios.length === 0">
              <td colspan="5" class="text-center text-muted py-4">Agregá propietarios utilizando el buscador de arriba.
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </template>
  </BaseModal>

  <!-- Modal Anidado (Se mantiene igual) -->
  <ModalCargaPersona ref="modalCargaPersona" :persona-data="personaParaVer"
    :ocultar-botones="ocultarBotones || mostrarModalVer" :show="modalCargaAbierto" @close="modalCargaAbierto = false"
    @persona-guardada="buscar">
  </ModalCargaPersona>

</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue' // Ajustá esta ruta de importación a tu estructura
import ModalCargaPersona from './ModalCargaPersona.vue'
import { useModalPropiedadPropietario } from '@/composables/atcl/useModalPropiedadPropietario'

const props = defineProps({
  propiedad: { type: Object, default: null },
  mostrarBuscador: { type: Boolean, default: false },
  ocultarBotones: { type: Boolean, default: false },
  mostrarQuitar: { type: Boolean, default: false },
  show: { type: Boolean, default: false } // NUEVA PROP: Controla la apertura del modal base
})

const emit = defineEmits(['propietarios-cambiados', 'close']) // NUEVO EMIT: Avisa al padre que cierre

const modalCargaPersona = ref(null)

const {
  busqueda,
  sugerencias,
  propietarios,
  personaParaVer,
  mostrarModalVer,
  propietarioEnEdicion,
  modalCargaAbierto,
  abrirModalCargaPersona,
  buscar,
  seleccionarPersona,
  asignarPropietario,
  toggleBajaPropietario,
  verPropietario,
  editarPropietario,
  eliminarPropietario,
  formatFecha,
  emitirCambiosPropietario
} = useModalPropiedadPropietario(props, emit, modalCargaPersona)
</script>

<style scoped>
/* Estilos para el autocompletado para asegurar que flote encima de todo */
.sugerencias-lista {
  z-index: 1055;
  max-height: 200px;
  overflow-y: auto;
  top: 100%;
  left: 0;
  margin-top: 2px;
}

/* Evitar que el textarea arruine la altura de la grilla */
.compact-textarea {
  resize: none;
  border: 1px solid transparent;
}

.compact-textarea:focus {
  border: 1px solid #86b7fe;
  background-color: #fff !important;
}

.compact-textarea:disabled {
  opacity: 0.6;
}
</style>