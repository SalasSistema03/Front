<template>
  <div class="modal fade" id="modalPropietarios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="modalVideosLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalVideosLabel">Editar Propietarios</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="mostrarBuscador" class="form-group atcl_tabla_propietarios row">
            <div class="col-md-6 p-1 position-relative">
              <input type="text" class="form-control form-control-sm" id="input-propietarios"
                placeholder="Buscar por apellido o DNI..." v-model="busqueda" @input="buscar" autocomplete="off">
              <ul v-if="sugerencias.length > 0" class="list-group position-absolute w-100 shadow-sm sugerencias-lista"
                style="z-index: 1000; max-height: 200px; overflow-y: auto;">
                <li v-for="persona in sugerencias" :key="persona.id"
                  class="list-group-item list-group-item-action cursor-pointer py-1 small"
                  @click="seleccionarPersona(persona)">
                  {{ persona.apellido }}, {{ persona.nombre }} - {{ persona.documento || 'Sin DNI' }}
                </li>
              </ul>
            </div>
            <div class="col-md-3 pt-1">
              <button type="button" class="btn btn-primary btn-sm w-100" @click="asignarPropietario">
                Asignar Propietario
              </button>
            </div>
            <div class="col-md-3 pt-1">
              <button type="button" class="btn btn-secondary btn-sm w-100" @click="abrirModalCargaPersona">
                Cargar Persona
              </button>
            </div>
          </div>
          <hr v-if="!propiedad">

          <div class="table-responsive atcl_contenedor_tabla px-3 pt-3">
            <table class="table table-striped table-hover atcl_tabla_busqueda_propiedad">
              <thead>
                <tr>
                  <th>Nombre y Apellido</th>
                  <th>Motivo</th>
                  <th>Baja</th>
                  <th>Fecha Nacimiento</th>
                  <th v-if="propiedad && !ocultarBotones"></th>
                  <th></th>
                  <th v-if="propiedad && !ocultarBotones"></th>
                  <th v-if="!ocultarBotones"></th>
                </tr>
              </thead>
              <tbody v-if="propiedad">
                <tr v-for="(item, index) in propiedad.propietarios" :key="index">
                  <td>{{ item.apellido }}, {{ item.nombre }}</td>
                  <td><textarea v-model="item.pivot.observaciones" rows="1" :disabled="propietarioEnEdicion !== item.id"
                      @input="emitirCambiosPropietario"></textarea></td>
                  <td>{{ item.pivot?.baja === 'si' ? 'Sí' : 'No' }}</td>
                  <td>{{ formatFecha(item.fecha_nacimiento) }}</td>
                  <td v-if="propiedad && !ocultarBotones">
                    <button type="button" class="btn btn-primary btn-sm w-50" @click="toggleBajaPropietario(item)">
                      <i class="bi bi-pencil">{{ item.pivot?.baja === 'si' ? 'Alta' : 'Baja' }}</i>
                    </button>
                  </td>
                  <td>
                    <button type="button" class="btn btn-secondary btn-sm w-50" @click="verPropietario(item)">
                      <i class="bi bi-eye">Ver</i>
                    </button>
                  </td>
                  <td v-if="propiedad && !ocultarBotones">
                    <button type="button" class="btn btn-primary btn-sm w-50" @click="editarPropietario(item)">
                      <i class="bi bi-pencil">Editar</i>
                    </button>
                  </td>
                  <td v-if="mostrarQuitar">
                    <button type="button" class="btn btn-danger btn-sm w-50"
                      @click="eliminarPropietario(index)">Quitar</button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-for="(item, index) in propietarios" :key="index">
                  <td>{{ item.apellido }}, {{ item.nombre }}</td>
                  <td><textarea v-model="item.pivot.observaciones" rows="1" :disabled="propietarioEnEdicion !== item.id"
                      @input="emitirCambiosPropietario"></textarea></td>
                  <td>{{ item.pivot?.baja === 'si' ? 'Sí' : 'No' }}</td>
                  <td>{{ formatFecha(item.fecha_nacimiento) }}</td>
                  <!-- <td>
                    <button type="button" class="btn btn-primary btn-sm w-50" @click="toggleBajaPropietario(item)">
                      <i class="bi bi-pencil">{{ item.pivot?.baja === 'si' ? 'Alta' : 'Baja' }}</i>
                    </button>
                  </td> -->
                  <td>
                    <button type="button" class="btn btn-info btn-sm w-50" @click="verPropietario(item)">
                      <i class="bi bi-eye">Ver</i>
                    </button>
                  </td>
                  <!-- <td>
                    <button type="button" class="btn btn-primary btn-sm w-50" @click="editarPropietario(item)">
                      <i class="bi bi-pencil">Editar</i>
                    </button>
                  </td> -->
                  <td v-if="!propiedad">
                    <button type="button" class="btn btn-danger btn-sm w-50"
                      @click="eliminarPropietario(index)">Quitar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalCargaPersona ref="modalCargaPersona" :persona-data="personaParaVer"
    :ocultar-botones="ocultarBotones || mostrarModalVer">
  </ModalCargaPersona>
</template>

<script setup>
import { ref } from 'vue'
import ModalCargaPersona from './ModalCargaPersona.vue'
import { useModalPropiedadPropietario } from '@/composables/atcl/useModalPropiedadPropietario'

const props = defineProps({
  propiedad: { type: Object, default: null },
  mostrarBuscador: { type: Boolean, default: false },
  ocultarBotones: { type: Boolean, default: false },
  mostrarQuitar: { type: Boolean, default: false }
})

const emit = defineEmits(['propietarios-cambiados'])

const modalCargaPersona = ref(null)

const {
  busqueda,
  sugerencias,
  propietarios,
  personaParaVer,
  mostrarModalVer,
  propietarioEnEdicion,
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
