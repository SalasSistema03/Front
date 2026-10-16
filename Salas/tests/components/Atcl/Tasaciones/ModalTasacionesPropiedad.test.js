import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ModalTasacionesPropiedad from '@/components/Atcl/Tasaciones/ModalTasacionesPropiedad.vue'
import * as AtclApiModule from '@/Services/api/Atcl/AtclApi.js'
import * as AlquilerApiModule from '@/Services/api/Atcl/Alquiler/Alquiler.js'
const mockAtclApi = AtclApiModule
const mockAlquilerApi = AlquilerApiModule
import {
  mockInmuebles,
  mockLocalidades,
  mockCalles,
  mockTasadores,
  mockPersonaSearchResults,
  mockTasacionData,
  createMockAtclApi,
  createMockLocalidades,
  createMockCalleAutocomplete,
  createMockAlquilerApi,
} from '../../../mocks/modalTasaciones.js'

vi.mock('@/components/base/BaseModal.vue', () => ({
  default: {
    name: 'BaseModal',
    template: `
      <div class="modal" v-if="show">
        <div class="modal-header">
          <slot name="title" />
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    `,
    props: ['show', 'size'],
    emits: ['close'],
  },
}))

vi.mock('@/components/Atcl/Propiedad/ModalCargaPersona.vue', () => ({
  default: {
    name: 'ModalCargaPersona',
    template: '<div data-testid="modal-carga-persona" />',
    props: ['show', 'personaData'],
    emits: ['close'],
  },
}))

vi.mock('@/Services/api/Atcl/AtclApi.js', () => ({
  buscaPersona: vi.fn().mockResolvedValue({ data: [{ id: 1, nombre: 'Juan', apellido: 'Perez', documento: '12345678' }] }),
  getInmueble: vi.fn().mockResolvedValue({ data: [{ id: 1, inmueble: 'Departamento' }, { id: 2, inmueble: 'Casa' }, { id: 3, inmueble: 'PH' }, { id: 4, inmueble: 'Local' }] }),
  guardarNuevaTasacion: vi.fn().mockResolvedValue({ data: { success: true } }),
  actualizarTasacion: vi.fn().mockResolvedValue({ data: { success: true } }),
  eliminarTasacion: vi.fn().mockResolvedValue({ data: { success: true } }),
}))
vi.mock('@/Services/api/Atcl/Alquiler/Alquiler.js', () => ({
  asesoresTasacion: vi.fn().mockResolvedValue({ data: [{ id_usuario: 1, id_usuario_sector: 1, usuario_username: 'Tasador 1' }] }),
}))
vi.mock('@/composables/atcl/useLocalidades.js', () => {
  globalThis.__mockLocalidades = { localidades: [{ id: 1, name: 'Santa Fe' }, { id: 2, name: 'Rosario' }, { id: 3, name: 'Rafaela' }], cargarLocalidades: vi.fn().mockResolvedValue(undefined), error: null }
  return { useLocalidades: () => globalThis.__mockLocalidades }
})
vi.mock('@/composables/atcl/useCalleAutocomplete.js', () => {
  globalThis.__mockCalle = {
    callesFiltradas: { value: [] },
    mostrarSugerencias: { value: false },
    calleSeleccionada: { value: '' },
    calleId: { value: null },
    cargarCalles: vi.fn().mockResolvedValue(undefined),
    filtrarCalles: vi.fn(),
    seleccionarCalle: vi.fn(),
    ocultarSugerencias: vi.fn(),
    mostrarLista: vi.fn(),
    limpiarSeleccion: vi.fn(),
  }
  return { useCalleAutocomplete: () => globalThis.__mockCalle }
})

const mountModal = (props = {}) => {
  return mount(ModalTasacionesPropiedad, {
    props: {
      show: true,
      tasacionData: null,
      soloLectura: false,
      ...props,
    },
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: {
              token: 'mock-token',
              user: { username: 'testuser', admin: false },
              menuData: [],
              permisos: { vistas: [], botones: [], navs: [] },
              isLoaded: true,
            },
          },
        }),
      ],
      stubs: {
        ModalCargaPersona: true,
      },
    },
  })
}

const mockCalleAutocomplete = globalThis.__mockCalle
const mockLocalidadesApi = globalThis.__mockLocalidades

describe('ModalTasacionesPropiedad', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'mock-token')
  })

  afterEach(() => {
    vi.resetModules()
  })

  describe('Renderizado por modo', () => {
    it('muestra título "Carga de Tasaciones" en modo creación', () => {
      const wrapper = mountModal({ show: true, tasacionData: null, soloLectura: false })
      expect(wrapper.text()).toContain('Carga de Tasaciones')
    })

    it('muestra título "Editar Tasación" en modo edición', () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData, soloLectura: false })
      expect(wrapper.text()).toContain('Editar Tasación')
    })

    it('muestra título "Ver Tasación" en modo solo lectura', () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData, soloLectura: true })
      expect(wrapper.text()).toContain('Ver Tasación')
    })

    it('deshabilita todos los campos en modo solo lectura', () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData, soloLectura: true })

      expect(wrapper.find('#inmueble').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#input-calle').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#numero-calle').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#tipo-tasacion').attributes('disabled')).toBeDefined()
    })

    it('habilita campos en modo edición/creación', () => {
      const wrapper = mountModal({ show: true, tasacionData: null, soloLectura: false })

      expect(wrapper.find('#inmueble').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('#input-calle').attributes('disabled')).toBeUndefined()
    })
  })

  describe('Carga de datos inicial (onMounted)', () => {
    it('llama a las APIs de carga al montar', async () => {
      mountModal()
      await flushPromises()

      expect(mockAtclApi.getInmueble).toHaveBeenCalled()
      expect(mockLocalidadesApi.cargarLocalidades).toHaveBeenCalled()
      expect(mockCalleAutocomplete.cargarCalles).toHaveBeenCalled()
      expect(mockAlquilerApi.asesoresTasacion).toHaveBeenCalled()
    })

    it('puebla inmuebles, localidades y tasadores con respuestas de API', async () => {
      const wrapper = mountModal()
      await flushPromises()

      expect(wrapper.vm.inmuebles).toEqual(mockInmuebles)
      expect(wrapper.vm.localidades).toEqual(mockLocalidades)
      expect(wrapper.vm.tasadores).toEqual(mockTasadores)
    })
  })

  describe('Watch: props.show -> carga/resetea formulario', () => {
    it('carga datos de edición cuando show=true y hay tasacionData', async () => {
      const wrapper = mountModal({ show: false, tasacionData: mockTasacionData })
      await flushPromises()

      await wrapper.setProps({ show: true })
      await flushPromises()

      expect(wrapper.vm.form.inmuebleId).toBe(1)
      expect(wrapper.vm.form.calle).toBe('Av. Santa Fe')
      expect(wrapper.vm.form.numeroCalle).toBe('1234')
      expect(wrapper.vm.form.piso).toBe('5')
      expect(wrapper.vm.form.departamento).toBe('A')
      expect(wrapper.vm.form.localidadId).toBe('1')
      expect(wrapper.vm.form.folio).toBe(12345)
      expect(wrapper.vm.form.propietario).toBe('Perez, Juan')
      expect(wrapper.vm.form.propietarioId).toBe(1)
      expect(wrapper.vm.form.ingreso).toBe('Presencial')
      expect(wrapper.vm.form.tipoTasacion).toBe('Venta')
      expect(wrapper.vm.form.tasacionVenta).toBe(150000)
      expect(wrapper.vm.form.tasacionAlquiler).toBeNull()
      expect(wrapper.vm.form.costoTasacion).toBe(15000)
      expect(wrapper.vm.form.tasadorId).toBe('1')
      expect(wrapper.vm.form.tasacionInformada).toBe('Pasado, Ingreso')
      expect(wrapper.vm.form.observaciones).toBe('Test observation')
    })

    it('resetea formulario cuando show=true sin tasacionData', async () => {
      const wrapper = mountModal({ show: false })
      await flushPromises()

      wrapper.vm.form.inmuebleId = '1'
      wrapper.vm.form.calle = 'Test'

      await wrapper.setProps({ show: true, tasacionData: null })
      await flushPromises()

      expect(wrapper.vm.form.inmuebleId).toBe('')
      expect(wrapper.vm.form.calle).toBe('')
    })

    it('usa immediate: true para cargar al montar con show=true', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData })
      await flushPromises()

      expect(wrapper.vm.form.inmuebleId).toBe(1)
    })
  })

  describe('Selectores predictivos: Calle', () => {
    it('muestra sugerencias al escribir en input calle', async () => {
      const wrapper = mountModal()
      await flushPromises()

      mockCalleAutocomplete.callesFiltradas = [{ id: 1, name: 'Av. Santa Fe' }]
      mockCalleAutocomplete.mostrarSugerencias = true

      const input = wrapper.find('#input-calle')
      await input.trigger('focus')
      await input.setValue('Santa')

      expect(mockCalleAutocomplete.mostrarLista).toHaveBeenCalled()
      expect(mockCalleAutocomplete.filtrarCalles).toHaveBeenCalled()
    })

    it('seleccionar calle actualiza form.calle y form.id_calle', async () => {
      const wrapper = mountModal()
      await flushPromises()

      mockCalleAutocomplete.calleSeleccionada = 'Av. Santa Fe'
      mockCalleAutocomplete.calleId = 1

      await wrapper.find('#input-calle').trigger('focus')
      await wrapper.find('#input-calle').setValue('Santa')
      mockCalleAutocomplete.seleccionarCalle({ id: 1, name: 'Av. Santa Fe' })

      expect(wrapper.vm.form.calle).toBe('Av. Santa Fe')
      expect(wrapper.vm.form.id_calle).toBe(1)
    })
  })

  describe('Selectores predictivos: Propietario', () => {
    it('busca propietario por apellido con debounce', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const input = wrapper.find('#propietario')
      await input.setValue('Perez')
      await flushPromises()

      expect(mockAtclApi.buscaPersona).toHaveBeenCalledWith({ apellido: 'Perez' })
    })

    it('busca propietario por DNI si es numérico', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const input = wrapper.find('#propietario')
      await input.setValue('12345678')
      await flushPromises()

      expect(mockAtclApi.buscaPersona).toHaveBeenCalledWith({ dni: '12345678' })
    })

    it('seleccionar propietario formatea "Apellido, Nombre"', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.seleccionarPropietario({ id: 1, nombre: 'Juan', apellido: 'Perez', documento: '12345678' })

      expect(wrapper.vm.form.propietario).toBe('Perez, Juan')
      expect(wrapper.vm.form.propietarioId).toBe(1)
      expect(wrapper.vm.sugerenciasPropietario).toEqual([])
    })

    it('no busca si input está vacío', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const input = wrapper.find('#propietario')
      await input.setValue('')
      await flushPromises()

      expect(mockAtclApi.buscaPersona).not.toHaveBeenCalled()
    })
  })

  describe('Watch: tipoTasacion bloquea campos', () => {
    it('bloquea alquiler cuando tipo es Venta', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.form.tipoTasacion = 'Venta'

      expect(wrapper.vm.bloquearTasacionAlquiler).toBe(true)
      expect(wrapper.vm.bloquearTasacionVenta).toBe(false)
    })

    it('bloquea venta cuando tipo es Alquiler', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.form.tipoTasacion = 'Alquiler'

      expect(wrapper.vm.bloquearTasacionVenta).toBe(true)
      expect(wrapper.vm.bloquearTasacionAlquiler).toBe(false)
    })

    it('no bloquea ninguno cuando tipo es Alquiler y Venta', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.form.tipoTasacion = 'Alquiler y Venta'

      expect(wrapper.vm.bloquearTasacionVenta).toBe(false)
      expect(wrapper.vm.bloquearTasacionAlquiler).toBe(false)
    })
  })

  describe('Botón Guardar', () => {
    it('llama a guardarNuevaTasacion en modo creación', async () => {
      const wrapper = mountModal({ show: true })
      await flushPromises()

      wrapper.vm.form.inmuebleId = '1'
      wrapper.vm.form.numeroCalle = '1234'
      wrapper.vm.form.tipoTasacion = 'Venta'
      wrapper.vm.form.tasacionVenta = 100000

      await wrapper.findAll("button").find(b=>b.text().includes("Guardar")).trigger('click')
      await flushPromises()

      expect(mockAtclApi.guardarNuevaTasacion).toHaveBeenCalled()
      expect(wrapper.emitted('tasacionCreada')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('llama a actualizarTasacion en modo edición', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData })
      await flushPromises()

      await wrapper.findAll("button").find(b=>b.text().includes("Actualizar")).trigger('click')
      await flushPromises()

      expect(mockAtclApi.actualizarTasacion).toHaveBeenCalledWith(1, expect.any(Object))
      expect(wrapper.emitted('tasacionCreada')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('muestra estado guardando y deshabilita botón', async () => {
      const wrapper = mountModal({ show: true })
      await flushPromises()

      mockAtclApi.guardarNuevaTasacion.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const btn = wrapper.findAll("button").find(b=>b.text().includes("Guardar"))
      await btn.trigger('click')

      expect(wrapper.vm.guardando).toBe(true)
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('maneja error al guardar', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mountModal({ show: true })
      await flushPromises()

      mockAtclApi.guardarNuevaTasacion.mockRejectedValue(new Error('API Error'))

      await wrapper.findAll("button").find(b=>b.text().includes("Guardar")).trigger('click')
      await flushPromises()

      expect(consoleSpy).toHaveBeenCalledWith('Error al procesar tasación:', expect.any(Error))
      expect(wrapper.vm.guardando).toBe(false)
      consoleSpy.mockRestore()
    })
  })

  describe('Botón Eliminar', () => {
    it('solo se muestra en modo edición (no creación, no solo lectura)', async () => {
      const wrapperCreate = mountModal({ show: true, tasacionData: null })
      const wrapperEdit = mountModal({ show: true, tasacionData: mockTasacionData })
      const wrapperView = mountModal({ show: true, tasacionData: mockTasacionData, soloLectura: true })

      await flushPromises()

expect(wrapperCreate.findAll('button').filter(b => b.text().includes('Eliminar')).length > 0).toBe(false)
expect(wrapperEdit.findAll('button').filter(b => b.text().includes('Eliminar')).length > 0).toBe(true)
expect(wrapperView.findAll('button').filter(b => b.text().includes('Eliminar')).length > 0).toBe(false)
    })

    it('llama a eliminarTasacionApi y emite eventos', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData })
      await flushPromises()

      await wrapper.findAll("button").find(b=>b.text().includes("Eliminar")).trigger('click')
      await flushPromises()

      expect(mockAtclApi.eliminarTasacion).toHaveBeenCalledWith(1)
      expect(wrapper.emitted('tasacionCreada')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('muestra estado eliminando y deshabilita botones', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData })
      await flushPromises()

      mockAtclApi.eliminarTasacion.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      await wrapper.findAll("button").find(b=>b.text().includes("Eliminar")).trigger('click')

      expect(wrapper.vm.eliminando).toBe(true)
      expect(wrapper.findAll("button").find(b=>b.text().includes("Eliminando...")).exists()).toBe(true)
    })

    it('muestra alerta en caso de error', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData })
      await flushPromises()

      mockAtclApi.eliminarTasacion.mockRejectedValue({
        response: { data: { message: 'Error custom' } },
      })

      await wrapper.findAll("button").find(b=>b.text().includes("Eliminar")).trigger('click')
      await flushPromises()

      expect(alertSpy).toHaveBeenCalledWith('Error custom')
      expect(wrapper.vm.eliminando).toBe(false)
      alertSpy.mockRestore()
    })

    it('no elimina si ya está guardando o eliminando', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData })
      await flushPromises()

      wrapper.vm.guardando = true
      await wrapper.findAll("button").find(b=>b.text().includes("Eliminar")).trigger('click')
      expect(mockAtclApi.eliminarTasacion).not.toHaveBeenCalled()

      wrapper.vm.guardando = false
      wrapper.vm.eliminando = true
      await wrapper.findAll("button").find(b=>b.text().includes("Eliminar")).trigger('click')
      expect(mockAtclApi.eliminarTasacion).not.toHaveBeenCalled()
    })
  })

  describe('Botón Cerrar', () => {
    it('emite close en modo solo lectura', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      await wrapper.findAll("button").find(b=>b.text().includes("Cerrar")).trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Botón Crear Nueva Persona', () => {
    it('abre ModalCargaPersona en modo edición/creación', async () => {
      const wrapper = mountModal({ show: true })
      await flushPromises()

      await wrapper.findAll("button").find(b=>b.text().includes("Crear Nueva Persona")).trigger('click')

      expect(wrapper.vm.modalCargaAbierto).toBe(true)
      expect(wrapper.vm.personaParaVer).toBeNull()
    })

    it('no se muestra en modo solo lectura', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      expect(wrapper.findAll("button").find(b=>b.text().includes("Crear Nueva Persona")).exists()).toBe(false)
    })
  })

  describe('Select Ingreso', () => {
    it('puebla opciones de ingreso', async () => {
      const wrapper = mountModal({ show: true })
      await flushPromises()

      const options = wrapper.find('#ingreso').findAll('option')
      expect(options.length).toBeGreaterThan(15)
      expect(options[1].text()).toBe('Correo')
    })

    it('no se muestra en modo solo lectura', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      expect(wrapper.find('#ingreso').exists()).toBe(false)
    })
  })

  describe('Select Tasación Informada', () => {
    it('puebla opciones correctas', async () => {
      const wrapper = mountModal({ show: true })
      await flushPromises()

      const options = wrapper.find('#tasacion-informada').findAll('option')
      const values = options.map(o => o.text())
      expect(values).toContain('Cancelado')
      expect(values).toContain('No Pasado')
      expect(values).toContain('Pasado, Ingreso')
      expect(values).toContain('Pasado, No Ingreso')
      expect(values).toContain('Pendiente')
    })
  })
})