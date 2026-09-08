<template>
  <BaseModal :show="show" size="lg" @close="emit('close')">

    <!-- ===================================================== -->
    <!-- HEADER -->
    <!-- ===================================================== -->

    <template #title>
      <div class="d-flex align-items-center gap-2">

        <i class="bi bi-file-earmark-text text-primary"></i>

        <div>
          <div class="fw-semibold">
            CONTRATO · FOLIO {{ formatearFolio(contrato?.propiedad?.folios) }}
          </div>

          <div class="small text-muted fw-normal">
            <i class="bi bi-geo-alt me-1"></i>
            {{ contrato?.propiedad?.calle?.name }}
            {{ contrato?.propiedad?.numero_calle }}

            <span v-if="contrato?.propiedad?.piso">
              · Piso {{ contrato.propiedad.piso }}
            </span>

            <span v-if="contrato?.propiedad?.departamento">
              · Dpto {{ contrato.propiedad.departamento }}
            </span>
          </div>
        </div>

      </div>
    </template>


    <!-- ===================================================== -->
    <!-- BODY -->
    <!-- ===================================================== -->

    <template #body>

      <form class="contrato-form contrato-form-scroll px-2">


        <!-- ================================================= -->
        <!-- 1. ESTADO Y PROCESO -->
        <!-- ================================================= -->

        <div class="contrato-seccion">

          <div class="contrato-seccion-header">
            <i class="bi bi-diagram-3"></i>
            <span>ESTADO Y PROCESO</span>
          </div>

          <div class="row g-3">

            <!-- Estado -->
            <div class="col-md-3 form-group">

              <label class="form-label">
                Estado de Contrato
              </label>

              <select v-model="form.id_estado" class="form-select form-select-sm">
                <option value="">Seleccionar Estado</option>

                <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                  {{ estado.estado }}
                </option>
              </select>

            </div>

            <!-- Inventario -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Inventario
              </label>

              <input type="date" v-model="form.fecha_inventario" class="form-control form-control-sm" disabled />

            </div>

            <!-- Carpeta -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Carpeta
              </label>

              <input type="date" v-model="form.fecha_comercial_presenta_carpeta" class="form-control form-control-sm" />

            </div>

            <!-- Preaprobado -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Preaprobado
              </label>

              <input type="date" v-model="form.fecha_preaprobada" class="form-control form-control-sm" />

            </div>

            <!-- Reserva -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Reserva
              </label>

              <input type="date" v-model="form.fecha_reserva" class="form-control form-control-sm" disabled />

            </div>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- 2. TIRILLA -->
        <!-- ================================================= -->

        <div class="contrato-seccion">

          <div class="contrato-seccion-header">
            <i class="bi bi-receipt"></i>
            <span>TIRILLA</span>
          </div>

          <div class="row g-3">

            <!-- Gastos -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Gasto Administrativo
              </label>

              <input type="number" v-model="form.gastos_administrativos" class="form-control form-control-sm" />

            </div>

            <!-- Entregada a -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Entregada a
              </label>

              <select v-model="form.tirilla_entregada_a" class="form-select form-select-sm">
                <option value="">Seleccionar</option>

                <option v-for="usuario in usuarioTirilla" :key="getUsuarioOptionValue(usuario)"
                  :value="getUsuarioOptionValue(usuario)">
                  {{ getUsuarioLabel(usuario) }}
                </option>
              </select>

            </div>

            <!-- Fecha entrega -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Fecha entrega
              </label>

              <input type="date" v-model="form.fecha_tirilla_entregada" class="form-control form-control-sm" />

            </div>

            <!-- Controlada por -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Controlada por
              </label>

              <select v-model="form.tirilla_controlada_por" class="form-select form-select-sm">
                <option value="">Seleccionar</option>

                <option v-for="usuario in usuarioControlaTirilla" :key="getUsuarioOptionValue(usuario)"
                  :value="getUsuarioOptionValue(usuario)">
                  {{ getUsuarioLabel(usuario) }}
                </option>

              </select>

            </div>

            <!-- Fecha controlada -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Fecha controlada
              </label>

              <input type="date" v-model="form.fecha_tirilla_controlada" class="form-control form-control-sm" />

            </div>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- 3. CIERRE DEL CONTRATO -->
        <!-- ================================================= -->

        <div class="contrato-seccion">

          <div class="contrato-seccion-header">
            <i class="bi bi-calendar-check"></i>
            <span>CIERRE DEL CONTRATO</span>
          </div>

          <div class="row g-3">

            <div class="col-md-2 form-group">

              <label class="form-label">
                Fecha Contrato
              </label>

              <input type="date" v-model="form.fecha_contrato" class="form-control form-control-sm" />

            </div>

            <div class="col-md-2 form-group">

              <label class="form-label">
                Fecha Autorización
              </label>

              <input type="date" v-model="form.fecha_autorizacion" class="form-control form-control-sm" />

            </div>

            <div class="col-md-2 form-group">

              <label class="form-label">
                Entrega de Llaves
              </label>

              <input type="date" v-model="form.fecha_finalizacion_firma_cobro" class="form-control form-control-sm" />

            </div>

            <div class="col-md-2 form-group">

              <label class="form-label">
                Cant. Meses
              </label>

              <input type="number" v-model="form.cant_meses" class="form-control form-control-sm"
                :disabled="form.bloqueado == 1" />

            </div>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- 4. DOCUMENTACIÓN Y DATOS -->
        <!-- ================================================= -->

        <div class="contrato-seccion">

          <div class="contrato-seccion-header">
            <i class="bi bi-folder2-open"></i>
            <span>DOCUMENTACIÓN Y DATOS</span>
          </div>

          <div class="row g-3">

            <!-- Monto -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Monto Documentación
              </label>

              <input type="number" v-model="form.monto" class="form-control form-control-sm"
                :disabled="form.bloqueado == 1" />

            </div>

            <!-- Hojas -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Hojas
              </label>

              <input type="number" v-model="form.chojas" class="form-control form-control-sm"
                :disabled="form.bloqueado == 1" />

            </div>

            <!-- Informe -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Informe
              </label>

              <select v-model="form.informe" class="form-select form-select-sm" :disabled="form.bloqueado == 1">
                <option value="">Seleccionar</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>

            </div>

            <!-- Cant Informe -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Cant. Inf.
              </label>

              <input type="number" v-model="form.CantInforme" class="form-control form-control-sm"
                :disabled="form.bloqueado == 1" />

            </div>

            <!-- Contrato -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Tipo de Contrato
              </label>

              <select v-model="form.tipo_contrato" class="form-select form-select-sm" :disabled="form.bloqueado == 1">
                <option value="">Seleccionar</option>
                <option value="Vivienda">Vivienda</option>
                <option value="Comercio">Comercio</option>
                <option value="Cochera">Cochera</option>
              </select>

            </div>

            <!-- Inq Prop -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Inquilino / Propietario
              </label>

              <select v-model="form.inquilino_propietario" class="form-select form-select-sm"
                :disabled="form.bloqueado == 1">
                <option value="">Seleccionar</option>
                <option value="NO">NO</option>
                <option value="SI">SI</option>
              </select>

            </div>

            <!-- Monto alquiler -->
            <div class="col-md-2 form-group">

              <label class="form-label">
                Monto Alquiler
              </label>

              <input type="number" v-model="form.precio_alquiler" class="form-control form-control-sm"
                :disabled="form.bloqueado == 1" />

            </div>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- 5. OBSERVACIONES -->
        <!-- ================================================= -->

        <div class="contrato-seccion">

          <div class="contrato-seccion-header">
            <i class="bi bi-chat-left-text"></i>
            <span>OBSERVACIONES</span>
          </div>

          <textarea v-model="form.observaciones" class="form-control form-control-sm" rows="4"
            placeholder="Ingrese observaciones..."></textarea>

        </div>

      </form>

    </template>


    <!-- ===================================================== -->
    <!-- FOOTER -->
    <!-- ===================================================== -->

    <template #footer>

      <button type="button" class="btn btn-outline-secondary btn-sm" @click="emit('close')">
        <i class="bi bi-x-lg me-1"></i>
        Cancelar
      </button>

      <button type="button" class="btn btn-primary btn-sm" @click="guardarCambios">
        <i class="bi bi-check-lg me-1"></i>
        Guardar Cambios
      </button>

    </template>

  </BaseModal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { verificarPermisoUsuario } from '@/Services/api/Contrato/Contrato'
import { useDateFormatter } from '@/composables/useDateFormatter'
const props = defineProps({
  show: { type: Boolean, default: false },
  contrato: { type: Object, default: null },
  estados: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'guardar'])
const usuarioTirilla = ref([])
const usuarioControlaTirilla = ref([])
const { formatDateForInput } = useDateFormatter()


const normalizarFecha = (valor) => {
  if (!valor) return ''
  return formatDateForInput(valor) || ''
}

const getUsuarioOptionValue = (usuario) => {
  if (!usuario) return ''
  if (typeof usuario === 'object') {
    return usuario.usuario_id ?? usuario.id ?? usuario.usuario?.id ?? ''
  }
  return usuario
}

const getUsuarioLabel = (usuario) => {
  if (!usuario) return ''
  if (typeof usuario === 'object') {
    return usuario.username ?? usuario.name ?? usuario.usuario?.username ?? ''
  }
  return usuario
}

const getFormFromContrato = (contrato) => {
  const hc = contrato?.historial_estado_contrato
  const meses = contrato?.meses_contrato
  const precio_alquiler = contrato?.precio_alquiler
  let folio = []
  folio = contrato?.propiedad?.folios ?? []
  let monto_documento = contrato?.registro_sellado?.monto_documento
  let monto_contrato = contrato?.registro_sellado?.monto_contrato
  let chojas = contrato?.registro_sellado?.hojas
  let informe = contrato?.registro_sellado?.informe
  let CantInforme = contrato?.registro_sellado?.cantidad_informes
  let tipo_contrato = contrato?.registro_sellado?.tipo_contrato
  let inquilino_propietario = contrato?.registro_sellado?.inq_prop
  let fecha_inventario = contrato?.historial_estado_dpto?.fecha_inventario

  //console.log(contrato)
  const bloqueado = contrato?.registro_sellado?.mostrar
  //console.log(bloqueado)
  //console.log('registroSellado', registro_sellado)
  //console.log('historial_estado_contrato', contrato)

  if (hc) {
    return {
      id_estado: hc.id_estado || '',
      fecha_inventario: normalizarFecha(fecha_inventario) ?? '',
      fecha_comercial_presenta_carpeta: normalizarFecha(hc.fecha_comercial_presenta_carpeta),
      fecha_preaprobada: normalizarFecha(hc.fecha_preaprobada),
      fecha_reserva: normalizarFecha(hc?.fecha_reserva ?? contrato?.fecha_reserva),
      gastos_administrativos: hc.gastos_administrativos || '',
      tirilla_entregada_a: getUsuarioOptionValue(hc.tirilla_entregada_a),
      fecha_tirilla_entregada: normalizarFecha(hc.fecha_tirilla_entregada),
      tirilla_controlada_por: getUsuarioOptionValue(hc.tirilla_controlada_por),
      fecha_tirilla_controlada: normalizarFecha(hc.fecha_tirilla_controlada),
      fecha_contrato: normalizarFecha(hc.fecha_contrato),
      fecha_autorizacion: normalizarFecha(hc.fecha_autorizacion),
      fecha_finalizacion_firma_cobro: normalizarFecha(hc.fecha_finalizacion_firma_cobro),
      cant_meses: meses || '',
      precio_alquiler: precio_alquiler || '',
      folio: folio || '',
      monto: monto_documento || '',
      monto_contrato: monto_contrato || '',
      chojas: chojas || '',
      informe: informe || '',
      CantInforme: CantInforme || '',
      tipo_contrato: tipo_contrato || '',
      inquilino_propietario: inquilino_propietario || '',
      bloqueado: bloqueado,
    }
  }
  return {
    id_estado: '',
    fecha_inventario: '',
    fecha_comercial_presenta_carpeta: '',
    fecha_preaprobada: '',
    fecha_reserva: '',
    gastos_administrativos: '',
    tirilla_entregada_a: '',
    fecha_tirilla_entregada: '',
    tirilla_controlada_por: '',
    fecha_tirilla_controlada: '',
    fecha_contrato: '',
    fecha_autorizacion: '',
    fecha_finalizacion_firma_cobro: '',
    observaciones: '',
    bloqueado: null
  }
}

const form = ref(getFormFromContrato(props.contrato))

watch(() => props.contrato, (newContrato) => {
  form.value = getFormFromContrato(newContrato)
}, { immediate: true })

const formatearFolio = (folios) => {
  if (!folios || folios.length === 0) return '-'
  return (
    folios
      .filter((f) => f.folio)
      .map((f) => {
        const num = f.folio
        if (f.empresa_id === 1) return `${num}`
        if (f.empresa_id === 2) return `CAN ${num}`
        if (f.empresa_id === 3) return `TRIB ${num}`
        return `${num}`
      })
      .join(' / ') || '-'
  )
}

const guardarCambios = () => {
  emit('guardar', {
    id_proceso: props.contrato?.id,
    id_historial: props.contrato?.id_historial_estado_contrato,
    ...form.value
  })
}


const permisotirilla = async () => {
  const response = await verificarPermisoUsuario('controlTirilla')

  usuarioTirilla.value = response.data
  usuarioControlaTirilla.value = response.data
  //console.log('aca')
  //console.log(usuarioTirilla.value)
}

onMounted(() => {
  permisotirilla()

});
</script>

<style>
.contrato-form {
  font-size: 12px;
}

.contrato-seccion {
  margin-bottom: 18px;
}

.contrato-seccion:last-child {
  margin-bottom: 0;
}

.contrato-seccion-header {
  display: flex;
  align-items: center;
  gap: 7px;

  color: var(--bs-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .4px;

  border-bottom: 1px solid #dee2e6;

  padding-bottom: 5px;
  margin-bottom: 12px;
}

.contrato-seccion-header i {
  font-size: 13px;
}

.contrato-form .form-label {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
}

.contrato-form .form-control-sm,
.contrato-form .form-select-sm {
  font-size: 12px;
  min-height: 31px;
}

.contrato-form textarea {
  resize: vertical;
  min-height: 85px;
}

.contrato-form .form-control:disabled,
.contrato-form .form-select:disabled {
  background-color: #f1f3f5;
  opacity: 1;
}

.contrato-form .row {
  margin-bottom: 0;
}

.contrato-form-scroll {
  max-height: 65vh;
  /* ajustá según el alto del header/footer */
  overflow-y: auto;
  padding-right: 8px;
  /* para que la scrollbar no tape contenido */
}
</style>
