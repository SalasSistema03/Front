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
              <button type="button" class="btn btn-secondary btn-sm w-100" @click="abrirModalCargaPersona"
                data-bs-toggle="modal" data-bs-target="#modalCargaPersona">
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
                  <th>Baja Propietario</th>
                  <th>-</th>
                  <th>Editar</th>
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
                  <td>
                    <button type="button" class="btn btn-primary btn-sm w-50" @click="toggleBajaPropietario(item)">
                      <i class="bi bi-pencil">{{ item.pivot?.baja === 'si' ? 'Alta' : 'Baja' }}</i>
                    </button>
                  </td>
                  <td>
                    <button type="button" class="btn btn-info btn-sm w-50" @click="verPropietario(item)">
                      <i class="bi bi-eye">Ver</i>
                    </button>
                  </td>
                  <td>
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
                  <td>{{ item.persona.apellido }}, {{ item.persona.nombre }}</td>
                  <td>
                    <textarea class="form-control text-center" rows="1" placeholder="Escribe una nota..."
                      v-model="item.persona.notes" @input="emitirCambios" disabled></textarea>
                  </td>
                  <td>{{ item.baja ? 'Si' : 'No' }}</td>
                  <td>{{ item.persona.fecha_nacimiento }}</td>
                  <td>
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
import { buscaPersona } from '../../../Services/api/Atcl/AtclApi'
import { Modal } from 'bootstrap'


export default {
  components: {
    ModalCargaPersona
  },

  props: {
    propiedad: {
      type: Object,
      default: null
    },
    mostrarBuscador: {
      type: Boolean,
      default: false
    },
    ocultarBotones: {
      type: Boolean,
      default: false
    },
    mostrarQuitar: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      busqueda: '',
      sugerencias: [],
      personaSeleccionada: null,
      timeout: null,
      propietarios: [],
      personaParaVer: null,
      mostrarModalPersona: false,
      mostrarModalVer: false,
      propietarioEnEdicion: null
    }
  },

  methods: {
    // Resetea el form del hijo antes de abrir el modal
    abrirModalCargaPersona() {
      this.personaParaVer = null
      this.$refs.modalCargaPersona.resetForm()
    },

    async buscar() {
      if (this.timeout) clearTimeout(this.timeout)

      if (this.busqueda.trim() === '') {
        this.sugerencias = []
        return
      }

      this.timeout = setTimeout(async () => {
        try {
          const esDNI = /^\d+$/.test(this.busqueda.trim())
          let params = {}
          if (esDNI) {
            params.dni = this.busqueda.trim()
          } else {
            params.apellido = this.busqueda.trim()
          }
          const response = await buscaPersona(params)
          this.sugerencias = response.data.slice(0, 10)
        } catch (error) {
          console.error('Error buscando persona:', error)
          this.sugerencias = []
        }
      }, 300)
    },

    seleccionarPersona(persona) {
      this.personaSeleccionada = persona
      this.busqueda = `${persona.apellido}, ${persona.nombre}`
      this.sugerencias = []
    },

    asignarPropietario() {
      if (!this.personaSeleccionada) return

      const nuevoPropietario = {
        persona: this.personaSeleccionada,
        baja: false
      }

      //console.log('Persona seleccionada:', this.personaSeleccionada)

      if (this.propiedad) {
        const existe = this.propiedad.propietarios.some(p => p.id === this.personaSeleccionada.id)
        if (existe) { alert('Ya está asignado'); return; }
        // Add the person with the expected pivot structure
        this.propiedad.propietarios.push({
          ...this.personaSeleccionada,
          pivot: { observaciones: '', baja: 'no' }
        })
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        const existe = this.propietarios.some(p => p.persona.id === this.personaSeleccionada.id)
        if (existe) { alert('Ya está asignado'); return; }
        this.propietarios.push(nuevoPropietario)
        this.emitirCambios()
      }

      this.personaSeleccionada = null
      this.busqueda = ''
      this.sugerencias = []
    },
    toggleBajaPropietario(persona) {
      if (persona.pivot?.baja === 'si') {
        // Si está en baja, dar de alta
        persona.pivot.baja = 'no'
        this.propietarioEnEdicion = null
      } else {
        // Si está en alta, dar de baja
        this.propietarioEnEdicion = persona.id
        persona.pivot.baja = 'si'
      }

      // Emitir los cambios al componente padre
      if (this.propiedad) {
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        this.$emit('propietarios-cambiados', this.propietarios)
      }

      console.log('Toggle baja/alta propietario:', persona)
    },

    emitirCambiosPropietario() {
      // Emitir los cambios al componente padre
      if (this.propiedad) {
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        this.$emit('propietarios-cambiados', this.propietarios)
      }
    },

    verPropietario(persona) {
      this.personaParaVer = persona
      this.mostrarModalVer = true

      this.$nextTick(() => {
        const modalElement = document.getElementById('modalCargaPersona')
        const modal = new Modal(modalElement)
        modal.show()

        // Resetear mostrarModalVer cuando se cierra el modal
        modalElement.addEventListener('hidden.bs.modal', () => {
          this.mostrarModalVer = false
        }, { once: true })
      })
    },

    editarPropietario(persona) {
      this.personaParaVer = persona

      this.$nextTick(() => {
        const modalElement = document.getElementById('modalCargaPersona')
        const modal = new Modal(modalElement)
        modal.show()
      })
    },

    eliminarPropietario(index) {
      if (this.propiedad) {
        // Remove from existing property's owners
        this.propiedad.propietarios.splice(index, 1)
        this.$emit('propietarios-cambiados', this.propiedad.propietarios)
      } else {
        // Remove from new property's owners
        this.propietarios.splice(index, 1)
        this.emitirCambios()
      }
    },

    emitirCambios() {
      this.$emit('propietarios-cambiados', this.propietarios)
    },

    formatFecha(fecha) {
      if (!fecha) return '-'
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) return fecha
      const d = new Date(fecha)
      return isNaN(d) ? '-' : d.toLocaleDateString('es-AR')
    },
  },

  mounted() {
    watch(() => this.propiedad, (newVal) => {
      console.log('Propiedad propietarios:', newVal)
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

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.sugerencias-lista {
  top: 100%;
  left: 0;
}
</style>
