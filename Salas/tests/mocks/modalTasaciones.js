import { vi } from 'vitest'
import { ref } from 'vue'

export const mockInmuebles = [
  { id: 1, inmueble: 'Departamento' },
  { id: 2, inmueble: 'Casa' },
  { id: 3, inmueble: 'PH' },
  { id: 4, inmueble: 'Local' },
]

export const mockLocalidades = [
  { id: 1, name: 'Santa Fe' },
  { id: 2, name: 'Rosario' },
  { id: 3, name: 'Rafaela' },
]

export const mockCalles = [
  { id: 1, name: 'Av. Santa Fe' },
  { id: 2, name: 'Av. Cabildo' },
  { id: 3, name: 'Av. Corrientes' },
]

export const mockTasadores = [
  { id_usuario: 1, id_usuario_sector: 1, usuario_username: 'Tasador 1' },
  { id_usuario: 2, id_usuario_sector: 2, usuario_username: 'Tasador 2' },
]

export const mockPersonaSearchResults = [
  { id: 1, nombre: 'Juan', apellido: 'Perez', documento: '12345678' },
  { id: 2, nombre: 'Maria', apellido: 'Gonzalez', documento: '87654321' },
]

export const mockTasacionData = {
  id: 1,
  tipo_inmueble: { id: 1, inmueble: 'Departamento' },
  calle_relacion: { id: 1, name: 'Av. Santa Fe' },
  numero_calle: '1234',
  piso: '5',
  departamento: 'A',
  folio: '12345',
  id_localidad: 1,
  propietario_relacion: { id: 1, nombre: 'Juan', apellido: 'Perez' },
  origen: 'Presencial',
  tipo_tasacion: 'Venta',
  tasacion_venta: 150000,
  tasacion_alquiler: null,
  costo_tasacion: 15000,
  tasador: 1,
  tasacion_informada_prop: 'Pasado, Ingreso',
  observaciones: 'Test observation',
  fecha: '2024-03-15 10:30:00',
}

/**
 * Claves exactas que `guardarTasacion` (ModalTasacionesPropiedad.vue)
 * envía al backend. Sirven como contrato front <-> back.
 */
export const TASACION_PAYLOAD_KEYS = [
  'inmuebleId',
  'calle',
  'id_calle',
  'numeroCalle',
  'piso',
  'departamento',
  'localidadId',
  'folio',
  'propietarioId',
  'propietario',
  'ingreso',
  'tipoTasacion',
  'tasacionVenta',
  'tasacionAlquiler',
  'costoTasacion',
  'tasadorId',
  'tasacionInformada',
  'observaciones',
  'fecha',
]

export const createMockLocalidades = () => ({
  localidades: ref([...mockLocalidades]),
  cargarLocalidades: vi.fn().mockResolvedValue(undefined),
  error: null,
})

export const createMockCalleAutocomplete = () => {
  const api = {
    callesFiltradas: ref([...mockCalles]),
    mostrarSugerencias: ref(false),
    calleSeleccionada: ref(''),
    calleId: ref(null),
    cargarCalles: vi.fn().mockResolvedValue(undefined),
    filtrarCalles: vi.fn(),
    seleccionarCalle: vi.fn((calle) => {
      api.calleSeleccionada.value = calle?.name ?? ''
      api.calleId.value = calle?.id ?? null
    }),
    ocultarSugerencias: vi.fn(() => {
      api.mostrarSugerencias.value = false
    }),
    mostrarLista: vi.fn(() => {
      api.mostrarSugerencias.value = true
    }),
    limpiarSeleccion: vi.fn(() => {
      api.calleSeleccionada.value = ''
      api.calleId.value = null
    }),
  }
  return api
}
