<template>
  <BaseModal :show="show" size="xl" @close="emit('close')">
    <template #title>
      <i class="bi bi-cloud-upload me-2"></i>
      Carga de Tasaciones
    </template>

    <template #body>
      <div class="row tasaciones-body-scroll">
        <div class="contrato-seccion-header">
          <i class="bi bi-diagram-3"></i>
           <span>DATOS DE LA PROPIEDAD</span>
        </div>
        <div class="col-md-3 form-group">
          <label for="inmueble">Inmueble</label>
          <select id="inmueble" class="form-control form-control-sm">
            <option value="">Seleccione un inmueble</option>
            <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
              {{ inmueble.inmueble }}
            </option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="calle">Calle</label>
          <input type="text" id="calle" class="form-control form-control-sm" autocomplete="off" placeholder="Rivadavia"/>
        </div>
        <div class="col-md-2 form-group">
          <label for="numero-calle">Nº Calle</label>
          <input type="text" id="numero-calle" class="form-control form-control-sm" autocomplete="off" placeholder="9100"/>
        </div>
        <div class="col-md-2 form-group">
          <label for="piso">Piso</label>
          <input type="text" id="piso" class="form-control form-control-sm" autocomplete="off" placeholder="1"/>
        </div>
        <div class="col-md-2 form-group">
          <label for="departamento">Departamento</label>
          <input type="text" id="departamento" class="form-control form-control-sm"  autocomplete="off" placeholder="A"/>
        </div>
        <div class="col-md-3 form-group">
          <label for="localidad">Localidad</label>
          <select id="localidad" class="form-control form-control-sm">
            <option value="">Seleccione una localidad</option>
            <option v-for="localidad in localidades" :key="localidad.id" :value="localidad.id">
              {{ localidad.name }}
            </option> 
          </select>
        </div>
        <div class="col-md-2 form-group">
          <label for="folio">Folio</label>
          <input id="folio" type="number" class="form-control form-control-sm"  autocomplete="off" placeholder="1234"/>
        </div>
        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
           <span>DATOS DEL PROPIETARIO</span>
        </div>
        <div class="col-md-3 form-group">
          <label for="propietario">Propietario</label>
          <input id="propietario" type="text" class="form-control form-control-sm" autocomplete="off" />
        </div>
        <div class="col-md-3 form-group">
          <label for="telefono">Nº Telefono</label>
          <input id="telefono" type="text" class="form-control form-control-sm" autocomplete="off" />
        </div>
        <div class="col-md-3 form-group">
          <label for="ingreso">Ingreso</label>
          <select id="ingreso" class="form-control form-control-sm">
            <option value="">Seleccione un ingreso</option>
            <option v-for="item in ingreso" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
         <div class="col-md-3 mt-4">
            <button type="button" class="btn btn-outline-dark btn-sm w-100 fw-bold shadow-sm "
              @click="abrirModalCargaPersona">
              <i class="bi bi-person-vcard"></i> Crear Nueva Persona
            </button>
          </div>
        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
           <span>DATOS DE LA TASACION</span>
        </div>
        <div class="col-md-3 form-group">
          <label for="tipo-tasacion">Tipo Tasacion</label>
          <select id="tipo-tasacion" class="form-control form-control-sm" v-model="tipoTasacion">
            <option value="">Seleccione un tipo de tasacion</option>
            <option v-for="tipo in TipoTasacion" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
        </div>
        <div class="col-md-2 form-group">
          <label for="tasacion-venta">Tasacion Venta</label>
          <input id="tasacion-venta" type="number" class="form-control form-control-sm" autocomplete="off"  placeholder="U$S 40.000" :disabled="bloquearTasacionVenta"/>
        </div>
        <div class="col-md-2 form-group">
          <label for="tasacion-alquiler">Tasacion Alquiler</label>
          <input id="tasacion-alquiler" type="number" class="form-control form-control-sm" autocomplete="off" placeholder="$ 100.000" :disabled="bloquearTasacionAlquiler"/>
        </div>
        <div class="col-md-2 form-group">
          <label for="costo-tasacion">Costo Tasacion</label>
          <input id="costo-tasacion" type="number" class="form-control form-control-sm" autocomplete="off" placeholder="$ 15.000" />
        </div>
        <div class="col-md-2 form-group">
          <label for="tasador">Tasador</label>
          <select id="tasador" class="form-control form-control-sm">
            <option value="">Seleccione un tasador</option>
            <option value="1">Tasador 1</option>
          </select>
        </div>
        <div class="col-md-3 form-group">
          <label for="tasacion-informada">Tasacion Informada Prop</label>
          <select id="tasacion-informada" class="form-control form-control-sm">
            <option value="">Seleccione una opción</option>
            <option v-for="item in tasacionInformada" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
        <div class="contrato-seccion-header pt-3">
          <i class="bi bi-diagram-3"></i>
           <span>OBSERVACIONES</span>
        </div>
         <div class="col-md-12 form-group">
          <label for="observaciones">Observaciones</label>
          <textarea id="observaciones" class="form-control form-control-sm" rows="2"></textarea>
        </div>
      </div>
    </template>
    <template #footer>
      <button class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
      <button class="btn btn-primary btn-sm">Guardar</button>
      </template> 
  </BaseModal>

   <ModalCargaPersona
    :persona-data="personaParaVer"
    :show="modalCargaAbierto"
    @close="modalCargaAbierto = false"
  >
  </ModalCargaPersona>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import ModalCargaPersona from '@/components/Atcl/Propiedad/ModalCargaPersona.vue'
import { getInmueble } from '@/Services/api/Atcl/AtclApi'
import { ref, onMounted, watch} from 'vue'
import { useLocalidades } from '../../../composables/atcl/useLocalidades'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
const inmuebles = ref([])
const { localidades, cargarLocalidades } = useLocalidades()
const ingreso = ['Correo', 'Difusion', 'Facebook', 'Instagram', 'Presencial', 'Presencial Candioti', 'Presencial Tribunales', 'Recomendacion', 'Sitio Web',
  'Telefonicamente', 'Telefonicamente Candioti', 'Telefonicamente Tribunales', 'Zona Prop', 'Whatsapp', 'Otro']
const modalCargaAbierto = ref(false)
const personaParaVer = ref(null)
const tipoTasacion = ref('')
const TipoTasacion = ref(['Alquiler', 'Venta', 'Alquiler y Venta'])
const bloquearTasacionVenta = ref(false)
const bloquearTasacionAlquiler = ref(false)
const tasacionInformada = ref(['Cancelado','No Pasado', 'Pasado, Ingreso', 'Pasado, No Ingreso','Pendiente'])

//funcion para traer todos los inmuebles
const getInmuebles = async () => {
  try {
    const response = await getInmueble()
    inmuebles.value = response.data
    //console.log(response)
  } catch (error) {
    console.error('Error al obtener inmuebles:', error)
  }
}

const abrirModalCargaPersona = () =>{  
  modalCargaAbierto.value = true
  personaParaVer.value = null // Reinicia los datos de la persona al abrir el modal
}



watch(tipoTasacion, (newVal) => {
  //console.log(newVal)
  if(newVal === 'Venta'){
    bloquearTasacionAlquiler.value = true
    bloquearTasacionVenta.value = false
  }else if(newVal === 'Alquiler'){
    bloquearTasacionVenta.value = true
    bloquearTasacionAlquiler.value = false
  }else{
    bloquearTasacionVenta.value = false
    bloquearTasacionAlquiler.value = false
  }
})
const emit = defineEmits(['close'])
onMounted(() => {
  cargarLocalidades()
  getInmuebles()
})
</script>
