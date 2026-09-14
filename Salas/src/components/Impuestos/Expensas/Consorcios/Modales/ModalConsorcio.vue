<template>
  <BaseModal :show="show" size="md" @close="cerrarModal" :backdrop="'static'">
    <template #title>
      <i class="bi" :class="modoEdicion ? 'bi-pencil-square text-primary' : 'bi-plus-circle text-success'"></i>
      <span class="ms-2">{{ modoEdicion ? 'Editar Consorcio' : 'Cargar Nuevo Consorcio' }}</span>
    </template>

    <template #body>
      <form @submit.prevent="guardarConsorcio" autocomplete="off" class="form-group">
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label small text-muted fw-bold mb-1">Nombre Consorcio</label>
            <input type="text" class="form-control form-control-sm shadow-sm border-secondary-subtle"
              v-model="form.nombre" required />
          </div>

          <div class="col-md-8 position-relative">
            <label class="form-label small text-muted fw-bold mb-1">Calle</label>
            <input type="text" class="form-control form-control-sm shadow-sm border-secondary-subtle"
              v-model="textoBuscadorCalle" @focus="mostrarResultados = true" @blur="ocultarBuscadorConRetraso"
              placeholder="Escribí para buscar..." />

            <div v-if="mostrarResultados && callesFiltradas.length > 0"
              class="list-group position-absolute w-100 shadow mt-1"
              style="z-index: 1050; max-height: 200px; overflow-y: auto">
              <button type="button" class="list-group-item list-group-item-action py-1 small"
                v-for="calle in callesFiltradas" :key="calle.id" @click="seleccionarCalle(calle)">
                {{ calle.name }}
              </button>
            </div>

            <div v-if="
              mostrarResultados && textoBuscadorCalle.length >= 2 && callesFiltradas.length === 0
            " class="list-group position-absolute w-100 shadow mt-1" style="z-index: 1050">
              <div class="list-group-item py-1 small text-muted">No se encontraron calles.</div>
            </div>
          </div>

          <div class="col-md-4">
            <label class="form-label small text-muted fw-bold mb-1">Altura</label>
            <input type="number" class="form-control form-control-sm shadow-sm border-secondary-subtle"
              v-model="form.altura" required />
          </div>

          <div class="col-md-12">
            <label class="form-label small text-muted fw-bold mb-1">Administrador</label>
            <select class="form-select form-select-sm shadow-sm border-secondary-subtle" v-model="form.administrador"
              required>
              <option value="" disabled>Seleccione un administrador...</option>
              <option v-for="admin in listaAdministradores" :key="admin.id" :value="String(admin.id)">
                {{ admin.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small text-muted fw-bold mb-1"> Facturacion</label>
            <select class="form-select form-select-sm shadow-sm border-secondary-subtle" v-model="form.facturacion"
              required>
              <option value="">SELECCIONE</option>
              <option value="EFECTIVO">EFECTIVO</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              <option value="CHEQUE">CHEQUE</option>
            </select>
          </div>
          <div class="col-md-8" v-if="form.facturacion === 'TRANSFERENCIA'">
            <label class="form-label small text-muted fw-bold mb-1"> CBU</label>
            <input type="text" class="form-control form-control-sm shadow-sm border-secondary-subtle"
              v-model="form.numero_cbu" @input="buscarBancoPorCbu" placeholder="Ingrese CBU (ej: 007...)" required />
          </div>
          <div class="col-md-12" v-if="form.facturacion === 'TRANSFERENCIA'">
            <label class="form-label small text-muted fw-bold mb-1"> BANCO</label>
            <input type="text" class="form-control form-control-sm shadow-sm border-secondary-subtle bg-light"
              v-model="form.banco" readonly placeholder="Se autocompleta con los primeros dígitos del CBU" disabled />
          </div>

        </div>
      </form>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary btn-sm px-4 shadow-sm" @click="cerrarModal" :disabled="guardando">
        Cancelar
      </button>
      <button type="button" class="btn btn-primary btn-sm px-4 shadow-sm" @click="guardarConsorcio"
        :disabled="guardando">
        <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-cloud-check me-2"></i>
        {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { alertas } from '@/utils/alertas'
import {
  crearEdificioService,
  actualizarEdificioService,
} from '@/Services/api/Impuestos/expensasApi.js'

const props = defineProps({
  show: { type: Boolean, required: true },
  modoEdicion: { type: Boolean, required: true },
  consorcio: { type: Object, default: null }, // Trae los datos si es edición, o null si es nuevo
  listaCalles: { type: Array, required: true },
  listaAdministradores: { type: Array, required: true },
  listaBancos: { type: Array, required: true },
})

const emit = defineEmits(['close', 'recargar'])

const guardando = ref(false)

// Objeto del formulario
const form = ref({
  id: null,
  nombre: '',
  calle: '', // Guarda el ID de la calle para mandar al backend
  altura: '',
  administrador: '', // Guarda el ID del administrador
  facturacion: '', // Valor por defecto
  numero_cbu: '',
  banco: '',
  id_banco: null,
})

// Variables para el buscador interactivo de calles
const textoBuscadorCalle = ref('')
const mostrarResultados = ref(false)

// Autocompletado del banco por CBU
const buscarBancoPorCbu = () => {
  if (!form.value.numero_cbu) {
    form.value.banco = ''
    form.value.id_banco = null
    return
  }

  const cbuLimpio = String(form.value.numero_cbu).trim()
  if (cbuLimpio.length >= 3) {
    const prefijo = cbuLimpio.substring(0, 3)
    const bancoEncontrado = props.listaBancos.find((b) => String(b.cbu).padStart(3, '0') === prefijo || String(b.cbu) === prefijo)
    if (bancoEncontrado) {
      form.value.banco = bancoEncontrado.nombre
      form.value.id_banco = bancoEncontrado.id
    }
  }
}

// --- INICIALIZACIÓN (onMounted) ---
onMounted(() => {
  if (props.modoEdicion && props.consorcio) {
    //console.log('Modo Edición: Precargando datos del consorcio:', props.consorcio)
    form.value.banco = props.consorcio.bancos?.nombre || props.consorcio.banco || ''
    form.value.id_banco = props.consorcio.bancos?.id || props.consorcio.id_banco || null
    form.value.facturacion = props.consorcio.metodo_pago || ''
    form.value.numero_cbu = props.consorcio.numero_cbu || ''
    // Modo Edición: Precargamos los datos
    form.value.id = props.consorcio.id
    form.value.nombre = props.consorcio.nombre_consorcio
    form.value.altura = props.consorcio.altura

    // Convertimos a String para asegurar que el <select> lo tome (como hicimos con Unidades)
    form.value.administrador = String(props.consorcio.id_administrador_consorcio)

    // Para la calle, seteamos el input visual
    textoBuscadorCalle.value = props.consorcio.direccion || ''

    // Buscamos el ID de la calle: primero si viene directo en el objeto (id_calle / calle_id / calle),
    // o buscándolo por nombre en props.listaCalles de forma flexible
    const idDirecto = props.consorcio.id_calle || props.consorcio.calle_id || (typeof props.consorcio.calle === 'number' ? props.consorcio.calle : null)

    if (idDirecto) {
      form.value.calle = idDirecto
      const callePorId = props.listaCalles.find((c) => c.id === idDirecto)
      if (callePorId && !textoBuscadorCalle.value) {
        textoBuscadorCalle.value = callePorId.name
      }
    } else if (props.consorcio.direccion) {
      const dirNormalizada = props.consorcio.direccion.trim().toLowerCase()
      const calleEncontrada = props.listaCalles.find((c) => c.name && c.name.trim().toLowerCase() === dirNormalizada)
      if (calleEncontrada) {
        form.value.calle = calleEncontrada.id
      } else {
        // Si no coincide exacto, intentamos encontrar si alguna contiene el nombre
        const calleParcial = props.listaCalles.find((c) => c.name && (c.name.trim().toLowerCase().includes(dirNormalizada) || dirNormalizada.includes(c.name.trim().toLowerCase())))
        if (calleParcial) {
          form.value.calle = calleParcial.id
        }
      }
    }
  } else {
    // Modo Nuevo: Limpiamos el formulario por seguridad
    form.value = { id: null, nombre: '', calle: '', altura: '', administrador: '', facturacion: '', numero_cbu: '', banco: '', id_banco: null }
    textoBuscadorCalle.value = ''
  }

  //console.log('Formulario al abrir el modal:', form.value)
  //console.log('Consorcio recibido:', props.consorcio)
})

// --- LÓGICA DEL BUSCADOR DE CALLES (La magia de Vue) ---

// Computed property: Filtra la lista de calles automáticamente mientras escribís
const callesFiltradas = computed(() => {
  if (textoBuscadorCalle.value.length < 2) return [] // Solo busca si hay más de 2 letras

  const textoBuscado = textoBuscadorCalle.value.toLowerCase()
  // Filtra y devuelve solo los primeros 10 resultados para no saturar la pantalla
  return props.listaCalles
    .filter((calle) => calle.name.toLowerCase().includes(textoBuscado))
    .slice(0, 10)
})

const seleccionarCalle = (calle) => {
  form.value.calle = calle.id // Guardamos el ID internamente
  textoBuscadorCalle.value = calle.name // Mostramos el nombre en el input
  mostrarResultados.value = false // Ocultamos el menú
}

const ocultarBuscadorConRetraso = () => {
  // Le damos un pequeño retraso de 200ms para que le dé tiempo a Vue
  // de registrar el "click" en la lista antes de ocultarla.
  setTimeout(() => {
    mostrarResultados.value = false
  }, 200)
}

// --- GUARDAR CAMBIOS (POST o PUT) ---
const guardarConsorcio = async () => {
  // 1. Validaciones básicas
  /* console.log(form.value) */
  if (!form.value.nombre || !form.value.calle || !form.value.altura || !form.value.administrador) {
    alertas.error('Por favor, complete todos los campos y seleccione una calle válida de la lista.')
    return
  }
  if (form.value.facturacion === 'TRANSFERENCIA' && !form.value.banco) {
    alertas.error('Por favor, verifique el CBU')
    return
  }
  if (form.value.facturacion === 'TRANSFERENCIA' && form.value.numero_cbu.length !== 22) {
    alertas.error('Por favor, el CBU debe tener 22 números')
    return
  }

  // 2. Preparamos el payload exacto que pide tu backend (Postman)
  const payload = {
    nombre: form.value.nombre,
    calle: form.value.calle,
    altura: form.value.altura,
    administra: form.value.administrador, // Tu backend lo espera como 'administra', y en el post de carga como 'administrador'. Usamos administra para unificar si ya ajustaste tu backend, o le pasas ambos para estar seguro.
    metodo_pago: form.value.facturacion,
    facturacion: form.value.facturacion,
    numero_cbu: form.value.facturacion === 'TRANSFERENCIA' ? form.value.numero_cbu : null,
    banco: form.value.facturacion === 'TRANSFERENCIA' ? form.value.banco : null,
    id_banco: form.value.facturacion === 'TRANSFERENCIA' ? form.value.id_banco : null,
  }

  // (Parche temporal por si tu backend crear usa 'administrador' y actualizar usa 'administra')
  payload.administrador = form.value.administrador

  guardando.value = true
  try {
    if (props.modoEdicion) {
      // Usamos PUT
      const response = await actualizarEdificioService(form.value.id, payload)
      alertas.success(response.data.message || 'Consorcio actualizado correctamente.')
    } else {
      // Usamos POST
      const response = await crearEdificioService(payload)
      alertas.success(response.data.message || 'Consorcio creado correctamente.')
    }

    emit('close')
    emit('recargar')
  } catch (error) {
    //console.error('Error al guardar el consorcio:', error)
    const mensajeError = error.response?.data?.message || 'Ocurrió un error al intentar guardar el consorcio.'
    alertas.error(mensajeError)
  } finally {
    guardando.value = false
  }
}

const cerrarModal = () => {
  if (guardando.value) return
  emit('close')
}
</script>
