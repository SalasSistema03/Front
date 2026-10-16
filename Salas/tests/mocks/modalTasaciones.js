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
}

export const createMockAtclApi = () => ({
  getInmueble: vi.fn().mockResolvedValue({ data: mockInmuebles }),
  buscaPersona: vi.fn().mockResolvedValue({ data: mockPersonaSearchResults }),
  guardarNuevaTasacion: vi.fn().mockResolvedValue({ data: { success: true } }),
  actualizarTasacion: vi.fn().mockResolvedValue({ data: { success: true } }),
  eliminarTasacion: vi.fn().mockResolvedValue({ data: { success: true } }),
})

export const createMockLocalidades = () => ({
  localidades: mockLocalidades,
  cargarLocalidades: vi.fn().mockResolvedValue(undefined),
  error: null,
})

import { ref } from 'vue'
export const createMockCalleAutocomplete = () => ({
  callesFiltradas: ref([]),
  mostrarSugerencias: ref(false),
  calleSeleccionada: ref(''),
  calleId: ref(null),
  cargarCalles: vi.fn().mockResolvedValue(undefined),
  filtrarCalles: vi.fn(),
  seleccionarCalle: vi.fn(),
  ocultarSugerencias: vi.fn(),
  mostrarLista: vi.fn(),
  limpiarSeleccion: vi.fn(),
})

export const createMockAlquilerApi = () => ({
  asesoresTasacion: vi.fn().mockResolvedValue({ data: mockTasadores }),
})