<template>
  <div class="modal fade" id="modalCargaPersona" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="modalVideosLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalVideosLabel">{{ id ? 'Editar Persona' : 'Carga Persona' }}</h1>
          <button type="button" class="btn-close" @click="volverAModalPropietarios" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form class="form-group row d-flex justify-content-center align-items-top" autocomplete="off"
            @submit.prevent="handleSubmit">
            <div class="col-md-7 row d-flex justify-content-center">
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control form-control-sm" placeholder="Nombre" v-model="nombre">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-control form-control-sm" placeholder="Apellido" v-model="apellido">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">DNI</label>
                <input type="number" class="form-control form-control-sm" placeholder="N° Documento" v-model="dni">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">Fecha Nacimiento</label>
                <input type="date" class="form-control form-control-sm" v-model="fecha_nacimiento">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">Calle</label>
                <input type="text" class="form-control form-control-sm" placeholder="Calle" v-model="calle">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">N°</label>
                <input type="number" class="form-control form-control-sm" placeholder="N°" v-model="numero_calle">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">Piso</label>
                <input type="text" class="form-control form-control-sm" placeholder="Piso" v-model="piso">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">Ciudad</label>
                <input type="text" class="form-control form-control-sm" placeholder="Departamento" v-model="ciudad">
              </div>
              <div class="form-group col-md-4 px-1 text-start">
                <label class="form-label">Provincia</label>
                <input type="text" class="form-control form-control-sm" placeholder="Provincia" v-model="provincia">
              </div>
              <div class="form-group col-md-12 row px-1 text-start">
                <div class="col-md-12">
                  <label class="form-label">Comentarios</label>
                  <textarea class="form-control form-control-sm" placeholder="Observaciones"
                    v-model="comentarios"></textarea>
                </div>
              </div>
            </div>

            <div class="col-md-5">
              <div class="row">
                <div class="col-md-12">
                  <div v-for="(tel, idx) in telefonos" :key="idx" class="telefono d-flex px-1">
                    <div class="m-0 px-1 w-50">
                      <label class="form-label">{{ idx === 0 ? 'Teléfono' : '' }}</label>
                      <input class="form-control" type="text" placeholder="Teléfono" v-model="tel.phone_number" />
                    </div>
                    <div class="m-0 px-1 w-50">
                      <label class="form-label">{{ idx === 0 ? 'Notas' : '' }}</label>
                      <input class="form-control" type="text" placeholder="Notas" v-model="tel.notes" />
                    </div>
                  </div>
                  <div class="d-flex justify-content-end mt-2" v-if="!ocultarBotones">
                    <button class="btn btn-primary" type="button" @click="agregarTelefono">Agregar Teléfono</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-12 row mt-4 d-flex justify-content-center" v-if="!ocultarBotones">
              <button type="submit" class="btn btn-primary w-50" :disabled="isSubmitting">
                {{ isSubmitting ? 'Procesando...' : (id ? 'Guardar Cambios' : 'Cargar Propietario') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cargarPadron } from '../../../Services/api/Atcl/AtclApi.js'
import { getUser } from '../../../Services/api/Usuario/userApi.js'


export default {
  props: {
    personaData: { type: Object, default: null },
    ocultarBotones: { type: Boolean, default: false }
  },
  data() {
    return {
      id: null,
      nombre: '',
      apellido: '',
      dni: '',
      fecha_nacimiento: '',
      calle: '',
      numero_calle: '',
      piso: '',
      ciudad: '',
      provincia: '',
      comentarios: '',
      telefonos: [{ phone_number: '', notes: '' }],
      usuario_id: '',
      isSubmitting: false,
    }
  },
  watch: {
    personaData(newVal) {
      //console.log(newVal)
      if (newVal) {
        this.id = newVal.id || null
        this.nombre = newVal.nombre || ''
        this.apellido = newVal.apellido || ''
        this.dni = newVal.dni || newVal.documento || ''
        this.fecha_nacimiento = newVal.fecha_nacimiento || ''
        this.calle = newVal.calle || ''
        this.numero_calle = newVal.numero_calle || ''
        this.piso = newVal.piso || ''
        this.ciudad = newVal.ciudad || ''
        this.provincia = newVal.provincia || ''
        this.comentarios = newVal.notes || ''
        this.telefonos = (newVal.telefonos && newVal.telefonos.length > 0)
          ? JSON.parse(JSON.stringify(newVal.telefonos))
          : [{ phone_number: '', notes: '' }]
      }
    }
  },
  methods: {
    volverAModalPropietarios() {
      const modalActual = window.bootstrap.Modal.getInstance(document.getElementById('modalCargaPersona'))
      if (modalActual) modalActual.hide()
      setTimeout(() => {
        const modalPadre = new window.bootstrap.Modal(document.getElementById('modalPropietarios'))
        modalPadre.show()
      }, 400)
    },
    agregarTelefono() {
      this.telefonos.push({ phone_number: '', notes: '' })
    },
    resetForm() {
      this.id = null
      this.nombre = ''; this.apellido = ''; this.dni = ''; this.fecha_nacimiento = ''
      this.calle = ''; this.numero_calle = ''; this.piso = ''; this.ciudad = ''
      this.provincia = ''; this.comentarios = ''; this.telefonos = [{ phone_number: '', notes: '' }]
    },
    async handleSubmit() {
      this.isSubmitting = true
      const formDataToSend = new FormData()
      if (this.id) formDataToSend.append('id', this.id)
      formDataToSend.append('nombre', this.nombre)
      formDataToSend.append('apellido', this.apellido)
      formDataToSend.append('dni', this.dni)
      formDataToSend.append('fecha_nacimiento', this.fecha_nacimiento)
      formDataToSend.append('calle', this.calle)
      formDataToSend.append('numero_calle', this.numero_calle)
      formDataToSend.append('piso', this.piso)
      formDataToSend.append('ciudad', this.ciudad)
      formDataToSend.append('provincia', this.provincia)
      formDataToSend.append('comentarios', this.comentarios)
      formDataToSend.append('usuario_id', this.usuario_id)

      const telefonosFiltrados = this.telefonos
        .filter(t => t.phone_number.trim() !== '')
        .map(t => ({ phone_number: t.phone_number.trim(), notes: t.notes.trim() }))
      formDataToSend.append('telefonos', JSON.stringify(telefonosFiltrados))

      try {
        // Aquí se usa cargarPadron tanto para crear como para editar (según tu API)
        await cargarPadron(formDataToSend)
        //this.$emit('persona-guardada', { id: this.id, nombre: this.nombre, apellido: this.apellido })

        this.volverAModalPropietarios()
      } catch (error) {
        console.error('Error al procesar persona:', error)
      } finally {
        this.isSubmitting = false
      }
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    if (token) {
      const { data } = await getUser(token)
      this.usuario_id = data?.id ?? data?.user?.id ?? ''
    }
  }
}
</script>
