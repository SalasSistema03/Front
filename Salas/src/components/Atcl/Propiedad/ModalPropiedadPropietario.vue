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
                  <th v-if="propiedad && !ocultarBotones">Baja Propietario</th>
                  <th>-</th>
                  <th v-if="propiedad && !ocultarBotones">Editar</th>
                  <th v-if="mostrarQuitar">Quitar</th>
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
                    <button type="button" class="btn btn-info btn-sm w-50" @click="verPropietario(item)">
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
                  <td v-if="mostrarQuitar">
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

<script>
import ModalCargaPersona from './ModalCargaPersona.vue'
import { watch } from 'vue'
import { buscaPersona, muestraPropiedad } from '../../../Services/api/Atcl/AtclApi'
import { Modal } from 'bootstrap'

export default {
  components: { ModalCargaPersona },
  props: {
    propiedad: { type: Object, default: null },
    mostrarBuscador: { type: Boolean, default: false },
    ocultarBotones: { type: Boolean, default: false },
    mostrarQuitar: { type: Boolean, default: false }
  },
  data() {
    return {
      busqueda: '',
      sugerencias: [],
      personaSeleccionada: null,
      timeout: null,
      propietarios: [],
      personaParaVer: null,
      mostrarModalVer: false,
      propietarioEnEdicion: null
    }
  },
  methods: {
    switchModals() {
      const modalPadre = Modal.getInstance(document.getElementById('modalPropietarios'))
      if (modalPadre) modalPadre.hide()
      setTimeout(() => {
        const modalHijo = new Modal(document.getElementById('modalCargaPersona'))
        modalHijo.show()
      }, 400)
    },
    abrirModalCargaPersona() {
      this.personaParaVer = null
      this.mostrarModalVer = false
      this.$refs.modalCargaPersona.resetForm()
      this.switchModals()
    },
    async buscar() {
      if (this.timeout) clearTimeout(this.timeout)
      if (this.busqueda.trim() === '') { this.sugerencias = []; return; }
      this.timeout = setTimeout(async () => {
        try {
          const esDNI = /^\d+$/.test(this.busqueda.trim())
          let params = esDNI ? { dni: this.busqueda.trim() } : { apellido: this.busqueda.trim() }
          const response = await buscaPersona(params)
          this.sugerencias = response.data.slice(0, 10)
        } catch (error) { console.error('Error buscando persona:', error); this.sugerencias = [] }
      }, 300)
    },
    seleccionarPersona(persona) {
      this.personaSeleccionada = persona
      this.busqueda = `${persona.apellido}, ${persona.nombre}`
      this.sugerencias = []
    },
    asignarPropietario() {
      if (!this.personaSeleccionada) return

      if (this.propiedad) {
        const existe = this.propiedad.propietarios.some(p => p.id === this.personaSeleccionada.id)
        if (existe) { alert('Ya está asignado'); return; }
        this.propiedad.propietarios.push({ ...this.personaSeleccionada, pivot: { observaciones: '', baja: 'no' } })
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        // Caso para nueva propiedad (sin propiedad existente)
        const existe = this.propietarios.some(p => p.id === this.personaSeleccionada.id)
        if (existe) { alert('Ya está asignado'); return; }
        this.propietarios.push({ ...this.personaSeleccionada, pivot: { observaciones: '', baja: 'no' } })
        this.$emit('propietarios-cambiados', this.propietarios)
      }
      this.personaSeleccionada = null; this.busqueda = ''; this.sugerencias = []
    },
    toggleBajaPropietario(persona) {
      if (this.propiedad) {
        persona.pivot.baja = (persona.pivot.baja === 'si') ? 'no' : 'si'
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        persona.pivot.baja = (persona.pivot.baja === 'si') ? 'no' : 'si'
        this.$emit('propietarios-cambiados', this.propietarios)
      }
    },
    async verPropietario(persona) {
      try {
        // Obtener datos actualizados de la propiedad
        const id = this.propiedad.id
        const response = await muestraPropiedad({ id: id })

        // Buscar la persona actualizada en la respuesta
        const personaActualizada = response.data.propietarios.find(p => p.id === persona.id)

        // Usar los datos actualizados si existen, si no usar los originales
        this.personaParaVer = personaActualizada || persona
        this.mostrarModalVer = true
        this.switchModals()
      } catch (error) {
        console.error('Error al obtener datos actualizados:', error)
        // Si hay error, usar los datos originales
        this.personaParaVer = persona
        this.mostrarModalVer = true
        this.switchModals()
      }
    },
    async editarPropietario(persona) {
      try {
        const id = this.propiedad.id
        const response = await muestraPropiedad({ id: id })

        const personaActualizada = response.data.propietarios.find(p => p.id === persona.id)

        this.personaParaVer = { ...personaActualizada }
      } catch (error) {
        console.error('Error al obtener datos actualizados:', error)
        this.personaParaVer = { ...persona }
      }
      this.mostrarModalVer = false
      this.switchModals()
    },
    eliminarPropietario(index) {
      if (this.propiedad) {
        this.propiedad.propietarios.splice(index, 1)
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        this.propietarios.splice(index, 1)
        this.$emit('propietarios-cambiados', this.propietarios)
      }
    },
    formatFecha(fecha) {
      if (!fecha) return '-'
      const d = new Date(fecha)
      return isNaN(d) ? '-' : d.toLocaleDateString('es-AR')
    },
    emitirCambiosPropietario() {
      if (this.propiedad) {
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        this.$emit('propietarios-cambiados', this.propietarios)
      }
    }
  },
  mounted() {
    watch(() => this.propiedad, (newVal) => {
      if (newVal && newVal.propietarios) {
        this.propietarios = newVal.propietarios.map(p => ({
          persona: p,
          baja: p.pivot ? p.pivot.baja === 'si' : false,
          observaciones: p.pivot ? p.pivot.observaciones : ''
        }))
      }
    })
  }
}
</script>
