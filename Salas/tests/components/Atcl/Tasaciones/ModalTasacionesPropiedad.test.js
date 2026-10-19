import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ModalTasacionesPropiedad from '@/components/Atcl/Tasaciones/ModalTasacionesPropiedad.vue'
import * as AtclApi from '@/Services/api/Atcl/AtclApi.js'
import * as AlquilerApi from '@/Services/api/Atcl/Alquiler/Alquiler.js'
import {
  mockInmuebles,
  mockLocalidades,
  mockTasadores,
  mockPersonaSearchResults,
  mockTasacionData,
  TASACION_PAYLOAD_KEYS,
  createMockLocalidades,
  createMockCalleAutocomplete,
} from '../../../mocks/modalTasaciones.js'

vi.mock('@/components/base/BaseModal.vue', () => ({
  default: {
    name: 'BaseModal',
    props: ['show', 'size'],
    emits: ['close'],
    template: `
      <div class="modal" v-if="show">
        <div class="modal-header"><slot name="title" /></div>
        <div class="modal-body"><slot name="body" /></div>
        <div class="modal-footer"><slot name="footer" /></div>
      </div>
    `,
  },
}))

vi.mock('@/components/Atcl/Propiedad/ModalCargaPersona.vue', () => ({
  default: {
    name: 'ModalCargaPersona',
    props: ['show', 'personaData'],
    emits: ['close'],
    template: '<div data-testid="modal-carga-persona" />',
  },
}))

vi.mock('@/Services/api/Atcl/AtclApi.js', () => ({
  getInmueble: vi.fn(),
  buscaPersona: vi.fn(),
  guardarNuevaTasacion: vi.fn(),
  actualizarTasacion: vi.fn(),
  eliminarTasacion: vi.fn(),
}))

vi.mock('@/Services/api/Atcl/Alquiler/Alquiler.js', () => ({
  asesoresTasacion: vi.fn(),
}))

vi.mock('@/composables/atcl/useLocalidades.js', () => ({
  useLocalidades: () => globalThis.__mockLocalidades,
}))

vi.mock('@/composables/atcl/useCalleAutocomplete.js', () => ({
  useCalleAutocomplete: () => globalThis.__mockCalle,
}))

const calle = () => globalThis.__mockCalle
const localidadesMock = () => globalThis.__mockLocalidades

const mountModal = (props = {}) =>
  mount(ModalTasacionesPropiedad, {
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
    },
  })

const findButton = (wrapper, text) =>
  wrapper.findAll('button').find((b) => b.text().includes(text))

describe('ModalTasacionesPropiedad', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    AtclApi.getInmueble.mockResolvedValue({ data: mockInmuebles })
    AtclApi.buscaPersona.mockResolvedValue({ data: mockPersonaSearchResults })
    AtclApi.guardarNuevaTasacion.mockResolvedValue({ data: { success: true } })
    AtclApi.actualizarTasacion.mockResolvedValue({ data: { success: true } })
    AtclApi.eliminarTasacion.mockResolvedValue({ data: { success: true } })
    AlquilerApi.asesoresTasacion.mockResolvedValue({ data: mockTasadores })

    globalThis.__mockLocalidades = createMockLocalidades()
    globalThis.__mockCalle = createMockCalleAutocomplete()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Renderizado por modo', () => {
    it('muestra título "Carga de Tasaciones" en modo creación', () => {
      const wrapper = mountModal({ tasacionData: null, soloLectura: false })
      expect(wrapper.text()).toContain('Carga de Tasaciones')
    })

    it('muestra título "Editar Tasación" en modo edición', () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: false })
      expect(wrapper.text()).toContain('Editar Tasación')
    })

    it('muestra título "Ver Tasación" en modo solo lectura', () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: true })
      expect(wrapper.text()).toContain('Ver Tasación')
    })

    it('deshabilita todos los campos en modo solo lectura', () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: true })

      expect(wrapper.find('#inmueble').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#input-calle').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#numero-calle').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#tipo-tasacion').attributes('disabled')).toBeDefined()
      expect(wrapper.find('#observaciones').attributes('disabled')).toBeDefined()
    })

    it('habilita campos en modo creación', () => {
      const wrapper = mountModal({ tasacionData: null, soloLectura: false })

      expect(wrapper.find('#inmueble').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('#input-calle').attributes('disabled')).toBeUndefined()
      expect(wrapper.find('#tipo-tasacion').attributes('disabled')).toBeUndefined()
    })

    it('en solo lectura sólo muestra el botón Cerrar', () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: true })

      expect(findButton(wrapper, 'Cerrar')).toBeTruthy()
      expect(findButton(wrapper, 'Guardar')).toBeUndefined()
      expect(findButton(wrapper, 'Actualizar')).toBeUndefined()
      expect(findButton(wrapper, 'Eliminar')).toBeUndefined()
    })
  })

  describe('Carga de datos inicial (onMounted)', () => {
    it('llama a las APIs de carga al montar', async () => {
      mountModal()
      await flushPromises()

      expect(AtclApi.getInmueble).toHaveBeenCalledTimes(1)
      expect(localidadesMock().cargarLocalidades).toHaveBeenCalledTimes(1)
      expect(calle().cargarCalles).toHaveBeenCalledTimes(1)
      expect(AlquilerApi.asesoresTasacion).toHaveBeenCalledTimes(1)
    })

    it('puebla inmuebles, localidades y tasadores con respuestas de API', async () => {
      const wrapper = mountModal()
      await flushPromises()

      expect(wrapper.vm.inmuebles).toEqual(mockInmuebles)
      expect(wrapper.vm.localidades).toEqual(mockLocalidades)
      expect(wrapper.vm.tasadores).toEqual(mockTasadores)
    })

    it('tolera el fallo de getInmueble sin romper el render', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      AtclApi.getInmueble.mockRejectedValue(new Error('boom'))

      const wrapper = mountModal()
      await flushPromises()

      expect(consoleSpy).toHaveBeenCalled()
      expect(wrapper.vm.inmuebles).toEqual([])
      consoleSpy.mockRestore()
    })
  })

  describe('Watch: props.show -> carga/resetea formulario', () => {
    it('carga datos de edición cuando show pasa a true', async () => {
      const wrapper = mountModal({ show: false, tasacionData: mockTasacionData })
      await flushPromises()

      await wrapper.setProps({ show: true })
      await flushPromises()

      expect(wrapper.vm.form.inmuebleId).toBe(1)
      expect(wrapper.vm.form.calle).toBe('Av. Santa Fe')
      expect(wrapper.vm.form.id_calle).toBe(1)
      expect(wrapper.vm.form.numeroCalle).toBe('1234')
      expect(wrapper.vm.form.piso).toBe('5')
      expect(wrapper.vm.form.departamento).toBe('A')
      expect(wrapper.vm.form.localidadId).toBe(1)
      expect(wrapper.vm.form.folio).toBe('12345')
      expect(wrapper.vm.form.propietario).toBe('Perez, Juan')
      expect(wrapper.vm.form.propietarioId).toBe(1)
      expect(wrapper.vm.form.ingreso).toBe('Presencial')
      expect(wrapper.vm.form.tipoTasacion).toBe('Venta')
      expect(wrapper.vm.form.tasacionVenta).toBe(150000)
      expect(wrapper.vm.form.tasacionAlquiler).toBeNull()
      expect(wrapper.vm.form.costoTasacion).toBe(15000)
      expect(wrapper.vm.form.tasadorId).toBe(1)
      expect(wrapper.vm.form.tasacionInformada).toBe('Pasado, Ingreso')
      expect(wrapper.vm.form.observaciones).toBe('Test observation')
      expect(wrapper.vm.form.fecha).toBe('2024-03-15')
    })

    it('resetea formulario cuando show=true sin tasacionData', async () => {
      const wrapper = mountModal({ show: false })
      await flushPromises()

      wrapper.vm.form.inmuebleId = '1'
      wrapper.vm.form.calle = 'Test'
      wrapper.vm.form.propietario = 'Alguien'

      await wrapper.setProps({ show: true, tasacionData: null })
      await flushPromises()

      expect(wrapper.vm.form.inmuebleId).toBe('')
      expect(wrapper.vm.form.calle).toBe('')
      expect(wrapper.vm.form.propietario).toBe('')
      expect(wrapper.vm.sugerenciasPropietario).toEqual([])
    })

    it('usa immediate: true para cargar al montar con show=true', async () => {
      const wrapper = mountModal({ show: true, tasacionData: mockTasacionData })
      await flushPromises()

      expect(wrapper.vm.form.inmuebleId).toBe(1)
      expect(wrapper.find('#fecha-tasacion').element.value).toBe('2024-03-15')
    })

    it('usa propietario "legacy" cuando no hay relación', async () => {
      const legacy = {
        ...mockTasacionData,
        propietario_relacion: null,
        propietario: 'Dueño Viejo',
      }
      const wrapper = mountModal({ tasacionData: legacy })
      await flushPromises()

      expect(wrapper.vm.form.propietario).toBe('Dueño Viejo')
      expect(wrapper.vm.form.propietarioId).toBe('Dueño Viejo')
    })
  })

  describe('Formato de montos', () => {
    it('formatea la tasación de venta en edición', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData })
      await flushPromises()

      expect(wrapper.find('#tasacion-venta').element.value).toBe('150.000')
    })

    it('deja los montos vacíos en creación', async () => {
      const wrapper = mountModal()
      await flushPromises()

      expect(wrapper.find('#tasacion-venta').element.value).toBe('')
      expect(wrapper.find('#costo-tasacion').element.value).toBe('')
    })

    it('actualizarMonto guarda sólo los dígitos y reformatea', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const input = wrapper.find('#tasacion-venta')
      await input.setValue('1.234.567')

      expect(wrapper.vm.form.tasacionVenta).toBe(1234567)
      expect(input.element.value).toBe('1.234.567')
    })

    it('actualizarMonto vacía el campo cuando no hay dígitos', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const input = wrapper.find('#costo-tasacion')
      await input.setValue('abc')

      expect(wrapper.vm.form.costoTasacion).toBeNull()
      expect(input.element.value).toBe('')
    })
  })

  describe('Selectores predictivos: Calle', () => {
    it('al escribir llama a filtrarCalles', async () => {
      const wrapper = mountModal()
      await flushPromises()

      await wrapper.find('#input-calle').setValue('Santa')

      expect(calle().filtrarCalles).toHaveBeenCalled()
    })

    it('al enfocar muestra la lista de sugerencias', async () => {
      const wrapper = mountModal()
      await flushPromises()

      await wrapper.find('#input-calle').trigger('focus')

      expect(calle().mostrarLista).toHaveBeenCalled()
      expect(wrapper.findAll('.busqueda-select li').length).toBe(3)
    })

    it('seleccionar una calle actualiza form.calle y form.id_calle', async () => {
      const wrapper = mountModal()
      await flushPromises()

      await wrapper.find('#input-calle').trigger('focus')
      await wrapper.find('#input-calle').setValue('Santa')

      await wrapper.findAll('.busqueda-select li')[0].trigger('mousedown')

      expect(wrapper.vm.form.calle).toBe('Av. Santa Fe')
      expect(wrapper.vm.form.id_calle).toBe(1)
    })

    it('no muestra sugerencias en solo lectura', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      expect(wrapper.find('.busqueda-select').exists()).toBe(false)
    })
  })

  describe('Selectores predictivos: Propietario', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('busca por apellido con debounce', async () => {
      const wrapper = mountModal()
      await vi.runAllTimersAsync()

      await wrapper.find('#propietario').setValue('Perez')
      expect(AtclApi.buscaPersona).not.toHaveBeenCalled()

      await vi.runAllTimersAsync()
      expect(AtclApi.buscaPersona).toHaveBeenCalledWith({ apellido: 'Perez' })
    })

    it('busca por DNI cuando el texto es numérico', async () => {
      const wrapper = mountModal()
      await vi.runAllTimersAsync()

      await wrapper.find('#propietario').setValue('12345678')
      await vi.runAllTimersAsync()

      expect(AtclApi.buscaPersona).toHaveBeenCalledWith({ dni: '12345678' })
    })

    it('no busca si el input está vacío', async () => {
      const wrapper = mountModal()
      await vi.runAllTimersAsync()

      await wrapper.find('#propietario').setValue('')
      await vi.runAllTimersAsync()

      expect(AtclApi.buscaPersona).not.toHaveBeenCalled()
    })

    it('lista las sugerencias y seleccionar propietario formatea "Apellido, Nombre"', async () => {
      const wrapper = mountModal()
      await vi.runAllTimersAsync()

      await wrapper.find('#propietario').setValue('Perez')
      await vi.runAllTimersAsync()

      const items = wrapper.findAll('.sugerencias-propietario li')
      expect(items.length).toBe(mockPersonaSearchResults.length)

      await items[0].trigger('click')

      expect(wrapper.vm.form.propietario).toBe('Perez, Juan')
      expect(wrapper.vm.form.propietarioId).toBe(1)
      expect(wrapper.vm.sugerenciasPropietario).toEqual([])
    })

    it('limpia las sugerencias si la búsqueda falla', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      AtclApi.buscaPersona.mockRejectedValue(new Error('boom'))

      const wrapper = mountModal()
      await vi.runAllTimersAsync()

      await wrapper.find('#propietario').setValue('Perez')
      await vi.runAllTimersAsync()

      expect(consoleSpy).toHaveBeenCalled()
      expect(wrapper.vm.sugerenciasPropietario).toEqual([])
      consoleSpy.mockRestore()
    })
  })

  describe('Watch: tipoTasacion bloquea campos', () => {
    it('bloquea alquiler cuando tipo es Venta', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.form.tipoTasacion = 'Venta'
      await flushPromises()

      expect(wrapper.vm.bloquearTasacionAlquiler).toBe(true)
      expect(wrapper.vm.bloquearTasacionVenta).toBe(false)
      expect(wrapper.find('#tasacion-alquiler').attributes('disabled')).toBeDefined()
    })

    it('bloquea venta cuando tipo es Alquiler', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.form.tipoTasacion = 'Alquiler'
      await flushPromises()

      expect(wrapper.vm.bloquearTasacionVenta).toBe(true)
      expect(wrapper.vm.bloquearTasacionAlquiler).toBe(false)
      expect(wrapper.find('#tasacion-venta').attributes('disabled')).toBeDefined()
    })

    it('no bloquea ninguno cuando tipo es "Alquiler y Venta"', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.form.tipoTasacion = 'Alquiler y Venta'
      await flushPromises()

      expect(wrapper.vm.bloquearTasacionVenta).toBe(false)
      expect(wrapper.vm.bloquearTasacionAlquiler).toBe(false)
    })
  })

  describe('Botón Guardar', () => {
    it('crea con el payload que espera el backend', async () => {
      const wrapper = mountModal()
      await flushPromises()

      wrapper.vm.form.inmuebleId = '1'
      calle().calleId.value = 3
      calle().calleSeleccionada.value = 'Av. Corrientes'
      wrapper.vm.form.numeroCalle = '1234'
      wrapper.vm.form.localidadId = '2'
      wrapper.vm.form.tipoTasacion = 'Venta'
      wrapper.vm.form.tasacionVenta = 100000

      await findButton(wrapper, 'Guardar').trigger('click')
      await flushPromises()

      expect(AtclApi.guardarNuevaTasacion).toHaveBeenCalledTimes(1)
      const payload = AtclApi.guardarNuevaTasacion.mock.calls[0][0]
      expect(Object.keys(payload).sort()).toEqual([...TASACION_PAYLOAD_KEYS].sort())
      expect(payload.inmuebleId).toBe('1')
      expect(payload.id_calle).toBe(3)
      expect(payload.localidadId).toBe('2')
      expect(payload.tipoTasacion).toBe('Venta')
      expect(payload.tasacionVenta).toBe(100000)

      expect(wrapper.emitted('tasacionCreada')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('actualiza en modo edición pasando el id', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData })
      await flushPromises()

      await findButton(wrapper, 'Actualizar').trigger('click')
      await flushPromises()

      expect(AtclApi.actualizarTasacion).toHaveBeenCalledWith(1, expect.any(Object))
      expect(AtclApi.guardarNuevaTasacion).not.toHaveBeenCalled()
      expect(wrapper.emitted('tasacionCreada')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('muestra estado guardando y deshabilita el botón', async () => {
      const wrapper = mountModal()
      await flushPromises()

      AtclApi.guardarNuevaTasacion.mockReturnValue(new Promise(() => {}))

      const btn = findButton(wrapper, 'Guardar')
      await btn.trigger('click')
      await flushPromises()

      expect(wrapper.vm.guardando).toBe(true)
      expect(findButton(wrapper, 'Guardando...').attributes('disabled')).toBeDefined()
    })

    it('maneja el error al guardar sin emitir eventos', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const wrapper = mountModal()
      await flushPromises()

      AtclApi.guardarNuevaTasacion.mockRejectedValue(new Error('API Error'))

      await findButton(wrapper, 'Guardar').trigger('click')
      await flushPromises()

      expect(consoleSpy).toHaveBeenCalledWith('Error al procesar tasación:', expect.any(Error))
      expect(wrapper.vm.guardando).toBe(false)
      expect(wrapper.emitted('tasacionCreada')).toBeFalsy()
      expect(wrapper.emitted('close')).toBeFalsy()
      consoleSpy.mockRestore()
    })
  })

  describe('Botón Eliminar', () => {
    it('sólo se muestra en modo edición', async () => {
      const create = mountModal({ tasacionData: null })
      const edit = mountModal({ tasacionData: mockTasacionData })
      const view = mountModal({ tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      expect(findButton(create, 'Eliminar')).toBeUndefined()
      expect(findButton(edit, 'Eliminar')).toBeTruthy()
      expect(findButton(view, 'Eliminar')).toBeUndefined()
    })

    it('llama a la API de borrado con el id y emite eventos', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData })
      await flushPromises()

      await findButton(wrapper, 'Eliminar').trigger('click')
      await flushPromises()

      expect(AtclApi.eliminarTasacion).toHaveBeenCalledWith(1)
      expect(wrapper.emitted('tasacionCreada')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('muestra estado eliminando', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData })
      await flushPromises()

      AtclApi.eliminarTasacion.mockReturnValue(new Promise(() => {}))
      await findButton(wrapper, 'Eliminar').trigger('click')
      await flushPromises()

      expect(wrapper.vm.eliminando).toBe(true)
      expect(findButton(wrapper, 'Eliminando...')).toBeTruthy()
    })

    it('muestra alerta con el mensaje de error del backend', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      const wrapper = mountModal({ tasacionData: mockTasacionData })
      await flushPromises()

      AtclApi.eliminarTasacion.mockRejectedValue({
        response: { data: { message: 'Error custom' } },
      })

      await findButton(wrapper, 'Eliminar').trigger('click')
      await flushPromises()

      expect(alertSpy).toHaveBeenCalledWith('Error custom')
      expect(wrapper.vm.eliminando).toBe(false)
      alertSpy.mockRestore()
    })

    it('usa un mensaje genérico si el backend no informa uno', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      const wrapper = mountModal({ tasacionData: mockTasacionData })
      await flushPromises()

      AtclApi.eliminarTasacion.mockRejectedValue(new Error('network'))

      await findButton(wrapper, 'Eliminar').trigger('click')
      await flushPromises()

      expect(alertSpy).toHaveBeenCalledWith('No se pudo eliminar la tasación.')
      alertSpy.mockRestore()
    })

    it('no elimina si ya está guardando o eliminando', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData })
      await flushPromises()

      wrapper.vm.guardando = true
      findButton(wrapper, 'Eliminar').element.click()
      expect(AtclApi.eliminarTasacion).not.toHaveBeenCalled()

      wrapper.vm.guardando = false
      wrapper.vm.eliminando = true
      findButton(wrapper, 'Eliminar').element.click()
      expect(AtclApi.eliminarTasacion).not.toHaveBeenCalled()
    })
  })

  describe('Botón Cerrar', () => {
    it('emite close en modo solo lectura', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      await findButton(wrapper, 'Cerrar').trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Botón Crear Nueva Persona', () => {
    it('abre ModalCargaPersona en modo creación', async () => {
      const wrapper = mountModal({ tasacionData: null })
      await flushPromises()

      await findButton(wrapper, 'Crear Nueva Persona').trigger('click')

      expect(wrapper.vm.modalCargaAbierto).toBe(true)
      expect(wrapper.vm.personaParaVer).toBeNull()
    })

    it('no se muestra en modo solo lectura', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      expect(findButton(wrapper, 'Crear Nueva Persona')).toBeUndefined()
    })
  })

  describe('Selects', () => {
    it('puebla las opciones de ingreso', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const options = wrapper.find('#ingreso').findAll('option')
      expect(options.length).toBeGreaterThan(15)
      expect(options[1].text()).toBe('Correo')
    })

    it('no muestra el select de ingreso en solo lectura', async () => {
      const wrapper = mountModal({ tasacionData: mockTasacionData, soloLectura: true })
      await flushPromises()

      expect(wrapper.find('#ingreso').exists()).toBe(false)
    })

    it('puebla las opciones de tasación informada', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const values = wrapper.find('#tasacion-informada').findAll('option').map((o) => o.text())
      expect(values).toEqual(
        expect.arrayContaining([
          'Cancelado',
          'No Pasado',
          'Pasado, Ingreso',
          'Pasado, No Ingreso',
          'Pendiente',
        ]),
      )
    })

    it('puebla los tipos de tasación', async () => {
      const wrapper = mountModal()
      await flushPromises()

      const values = wrapper.find('#tipo-tasacion').findAll('option').map((o) => o.text())
      expect(values).toEqual(
        expect.arrayContaining(['Alquiler', 'Venta', 'Alquiler y Venta']),
      )
    })
  })
})
