<template>
  <BaseModal :show="show" size="lg" @close="cerrarModal">
    <template #title>
      <i class="bi" :class="id ? 'bi-person-gear text-primary' : 'bi-person-plus-fill text-success'"></i> 
      {{ id ? 'Editar Persona' : 'Carga de Persona' }}
    </template>

    <template #body>
      <form autocomplete="off" @submit.prevent="handleSubmit">
        <div class="row gx-4">
          <!-- ========================================== -->
          <!-- COLUMNA IZQUIERDA: DATOS PERSONALES -->
          <!-- ========================================== -->
          <div class="col-md-7 border-end pe-3">
            <h6 class="fw-bold text-dark border-bottom pb-1 mb-2 small text-uppercase">
              <i class="bi bi-person-badge"></i> Datos Personales
            </h6>

            <div class="row g-1 mb-2">
              <div class="col-md-6">
                <label class="form-label compact-label">Nombre <span class="text-danger">*</span></label>
                <input type="text" class="form-control compact-input shadow-sm" placeholder="Nombre" v-model="nombre" required>
              </div>
              <div class="col-md-6">
                <label class="form-label compact-label">Apellido <span class="text-danger">*</span></label>
                <input type="text" class="form-control compact-input shadow-sm" placeholder="Apellido" v-model="apellido" required>
              </div>
            </div>

            <div class="row g-1 mb-3">
              <div class="col-md-6">
                <label class="form-label compact-label">DNI</label>
                <input type="number" class="form-control compact-input shadow-sm" placeholder="N° Documento" v-model="dni">
              </div>
              <div class="col-md-6">
                <label class="form-label compact-label">Fecha Nacimiento</label>
                <input type="date" class="form-control compact-input shadow-sm text-muted" v-model="fecha_nacimiento">
              </div>
            </div>

            <h6 class="fw-bold text-dark border-bottom pb-1 mb-2 small text-uppercase">
              <i class="bi bi-geo-alt"></i> Dirección
            </h6>

            <div class="row g-1 mb-2">
              <div class="col-md-6">
                <label class="form-label compact-label">Calle</label>
                <input type="text" class="form-control compact-input shadow-sm" placeholder="Calle" v-model="calle">
              </div>
              <div class="col-md-3">
                <label class="form-label compact-label">N°</label>
                <input type="number" class="form-control compact-input shadow-sm" placeholder="N°" v-model="numero_calle">
              </div>
              <div class="col-md-3">
                <label class="form-label compact-label">Piso</label>
                <input type="text" class="form-control compact-input shadow-sm" placeholder="Piso/Dto" v-model="piso">
              </div>
            </div>

            <div class="row g-1 mb-3">
              <div class="col-md-6">
                <label class="form-label compact-label">Ciudad</label>
                <input type="text" class="form-control compact-input shadow-sm" placeholder="Ciudad" v-model="ciudad">
              </div>
              <div class="col-md-6">
                <label class="form-label compact-label">Provincia</label>
                <input type="text" class="form-control compact-input shadow-sm" placeholder="Provincia" v-model="provincia">
              </div>
            </div>

            <div class="row g-1 mb-2">
              <div class="col-md-12">
                <label class="form-label compact-label">Comentarios / Observaciones</label>
                <textarea class="form-control compact-textarea shadow-sm" placeholder="Observaciones adicionales..." v-model="comentarios" rows="2"></textarea>
              </div>
            </div>
          </div>

          <!-- ========================================== -->
          <!-- COLUMNA DERECHA: TELÉFONOS -->
          <!-- ========================================== -->
          <div class="col-md-5 ps-3 d-flex flex-column">
            <h6 class="fw-bold text-dark border-bottom pb-1 mb-2 small text-uppercase d-flex justify-content-between align-items-center">
              <span><i class="bi bi-telephone"></i> Contacto</span>
              <button v-if="!ocultarBotones" class="btn btn-sm btn-outline-success py-0 px-2 fw-bold" type="button" @click="agregarTelefono" title="Agregar otro número">
                <i class="bi bi-plus-lg"></i>
              </button>
            </h6>

            <div class="flex-grow-1 custom-scrollbar pe-2" style="max-height: 280px; overflow-y: auto;">
              <div v-for="(tel, idx) in telefonos" :key="idx" class="card border-0 shadow-sm mb-2 bg-light">
                <div class="card-body p-2">
                  <div class="row g-1">
                    <div class="col-12 mb-1">
                      <label class="form-label compact-label text-muted mb-0">Teléfono {{ idx + 1 }}</label>
                      <input class="form-control compact-input" type="text" placeholder="Ej: 3425123456" v-model="tel.phone_number" />
                    </div>
                    <div class="col-12">
                      <label class="form-label compact-label text-muted mb-0">Notas / Etiqueta</label>
                      <div class="input-group input-group-sm">
                        <input class="form-control compact-input" type="text" placeholder="Ej: Personal, Fijo, Oficina" v-model="tel.notes" />
                        <button v-if="telefonos.length > 1 && !ocultarBotones" class="btn btn-outline-danger px-2 py-0" type="button" @click="quitarTelefono(idx)" title="Eliminar este teléfono">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-auto pt-3 border-top" v-if="!ocultarBotones">
              <button type="submit" class="btn btn-primary w-100 fw-bold shadow-sm" :disabled="isSubmitting">
                <i class="bi" :class="isSubmitting ? 'bi-hourglass-split' : 'bi-check-circle-fill'"></i>
                {{ isSubmitting ? 'Procesando...' : (id ? 'Guardar Cambios' : 'Cargar Persona') }}
              </button>
            </div>
          </div>

        </div>
      </form>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from '@/components/base/BaseModal.vue' // Ajustá esta ruta de importación
import { cargarPadron } from '../../../Services/api/Atcl/AtclApi.js'
import { getUser } from '../../../Services/api/Usuario/userApi.js'
import { useToast } from '@/composables/useToast.js';

export default {
  components: {
    BaseModal
  },
  props: {
    personaData: { type: Object, default: null },
    ocultarBotones: { type: Boolean, default: false },
    show: { type: Boolean, default: false } // NUEVA PROP de control
  },
  emits: ['close', 'persona-guardada'], // Declaramos los emits
  setup() {
    const { showError, showSuccess } = useToast()
    return { showError, showSuccess }
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
    // Escuchamos cuando se abre el modal para reinicializar o cargar datos
    show(newVal) {
      if (newVal) {
        if (this.personaData && Object.keys(this.personaData).length > 0) {
          this.id = this.personaData.id || null
          this.nombre = this.personaData.nombre || ''
          this.apellido = this.personaData.apellido || ''
          this.dni = this.personaData.dni || this.personaData.documento || ''
          this.fecha_nacimiento = this.personaData.fecha_nacimiento || ''
          this.calle = this.personaData.calle || ''
          this.numero_calle = this.personaData.numero_calle || ''
          this.piso = this.personaData.piso || ''
          this.ciudad = this.personaData.ciudad || ''
          this.provincia = this.personaData.provincia || ''
          this.comentarios = this.personaData.notes || ''
          this.telefonos = (this.personaData.telefonos && this.personaData.telefonos.length > 0)
            ? JSON.parse(JSON.stringify(this.personaData.telefonos))
            : [{ phone_number: '', notes: '' }]
        } else {
          this.resetForm()
        }
      }
    }
  },
  methods: {
    cerrarModal() {
      // Usamos el emit puro de Vue, el BaseModal se encargará del resto
      this.$emit('close');
    },
    agregarTelefono() {
      this.telefonos.push({ phone_number: '', notes: '' })
    },
    quitarTelefono(index) {
      this.telefonos.splice(index, 1);
    },
    resetForm() {
      this.id = null
      this.nombre = ''; this.apellido = ''; this.dni = ''; this.fecha_nacimiento = ''
      this.calle = ''; this.numero_calle = ''; this.piso = ''; this.ciudad = ''
      this.provincia = ''; this.comentarios = ''; this.telefonos = [{ phone_number: '', notes: '' }]
    },
    async handleSubmit() {
      // 1. Validar que los teléfonos contengan solamente números
      const telefonoInvalido = this.telefonos.find(t => {
        const telefono = t.phone_number.trim();
        if (telefono === '') return false;
        return !/^\d+$/.test(telefono);
      });

      if (telefonoInvalido) {
        this.showError(`El teléfono "${telefonoInvalido.phone_number}" no es válido. Solo se permiten números.`);
        return;
      }

      this.isSubmitting = true;
      const formDataToSend = new FormData();

      // 2. Si hay ID, es una edición. Agregamos el ID y el truco de Laravel para PUT
      if (this.id) {
        formDataToSend.append('id', this.id);
        // Descomentá esta línea de abajo si tu API de Laravel requiere método PUT estricto para actualizar:
        // formDataToSend.append('_method', 'PUT'); 
      }

      // 3. NOMBRES CORREGIDOS (Lo que espera la base de datos)
      formDataToSend.append('nombre', this.nombre);
      formDataToSend.append('apellido', this.apellido);
      formDataToSend.append('documento', this.dni); // <-- CAMBIADO: De 'dni' a 'documento'
      formDataToSend.append('fecha_nacimiento', this.fecha_nacimiento);
      formDataToSend.append('calle', this.calle);
      formDataToSend.append('numero_calle', this.numero_calle);
      formDataToSend.append('piso', this.piso);
      formDataToSend.append('ciudad', this.ciudad);
      formDataToSend.append('provincia', this.provincia);
      formDataToSend.append('notes', this.comentarios); // <-- CAMBIADO: De 'comentarios' a 'notes'
      formDataToSend.append('usuario_id', this.usuario_id);

      const telefonosFiltrados = this.telefonos
        .filter(t => t.phone_number.trim() !== '')
        .map(t => ({ phone_number: t.phone_number.trim(), notes: t.notes.trim() }));
      formDataToSend.append('telefonos', JSON.stringify(telefonosFiltrados));

      try {
        await cargarPadron(formDataToSend);
        this.showSuccess(this.id ? 'Persona actualizada correctamente' : 'Persona cargada correctamente');
        
        this.$emit('persona-guardada');
        this.cerrarModal();
      } catch (error) {
        this.showError('Error al procesar la persona');
        console.error('Error al procesar persona:', error);
      } finally {
        this.isSubmitting = false;
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

<style scoped>
.compact-label {
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.1rem;
  letter-spacing: 0.2px;
}
.compact-input {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  min-height: 28px;
  height: 28px;
}
.compact-textarea {
  font-size: 0.8rem;
  padding: 0.2rem 0.4rem;
  resize: none;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1; 
  border-radius: 4px;
}
</style>