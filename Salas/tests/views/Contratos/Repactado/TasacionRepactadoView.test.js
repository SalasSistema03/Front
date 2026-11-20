import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TasacionRepactadoView from '@/views/Contratos/Repactado/TasacionRepactadoView.vue'
import { getEstadosRepactado, getRepactadoFiltrado } from '@/Services/api/Contrato/Repactado'

const toastMocks = vi.hoisted(() => ({
  showError: vi.fn(),
  handleApiError: vi.fn(),
}))

vi.mock('@/components/NavComponent.vue', () => ({
  default: { template: '<nav />' },
}))

vi.mock('@/components/Atcl/Repactado/ModalTasacionRepactado.vue', () => ({
  default: { template: '<div />' },
}))

vi.mock('@/Services/api/Contrato/Repactado', () => ({
  getEstadosRepactado: vi.fn(),
  getRepactadoFiltrado: vi.fn(),
}))

vi.mock('@/composables/useToast', () => ({
  useToast: () => toastMocks,
}))

describe('TasacionRepactadoView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getEstadosRepactado.mockResolvedValue({
      data: {
        data: [{ id: 1, estado: 'Pendiente' }],
      },
    })
    getRepactadoFiltrado.mockResolvedValue({
      data: {
        data: [{
          id: 25,
          folio: 12345,
          estado: 'Pendiente',
          vencimientoContrato: '2026-06-15',
          apellidoNombre: 'Inquilino de prueba',
          direccion: 'San Martín 123',
          propietario: 'Propietaria de prueba',
          tasacionDolarVenta: 250000,
          tasacionPesosVenta: null,
          tasacionAlquiler: 80000,
          fechaTasacion: '2026-06-15',
          usuarioTasacion: 'Sofía Torres',
        }],
      },
    })
  })

  it('permite buscar solo por folio sin seleccionar año ni empresa', async () => {
    const wrapper = mount(TasacionRepactadoView)
    await flushPromises()

    expect(getRepactadoFiltrado).not.toHaveBeenCalled()
    await wrapper.find('#folio').setValue('12345')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(getRepactadoFiltrado).toHaveBeenCalledWith(12345, null, null, null, {
      estado: null,
      direccion: null,
      usuario: null,
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('Tasación registrada')
    expect(wrapper.text()).toContain('Venta: U$S 250.000')
    expect(wrapper.text()).toContain('Alquiler: $ 80.000')
    expect(wrapper.text()).toContain('Fecha: 15/06/2026')
    expect(wrapper.text()).toContain('Sofía Torres')
  })

  it('impide buscar cuando no se ingresó ningún filtro', async () => {
    const wrapper = mount(TasacionRepactadoView)
    await flushPromises()

    await wrapper.find('form').trigger('submit')

    expect(getRepactadoFiltrado).not.toHaveBeenCalled()
    expect(toastMocks.showError).toHaveBeenCalledWith('Ingresá al menos un filtro para buscar.')
  })

  it('envía los filtros opcionales seleccionados', async () => {
    const wrapper = mount(TasacionRepactadoView)
    await flushPromises()

    await wrapper.find('#mes').setValue('6')
    await wrapper.find('#anio').setValue('2026')
    await wrapper.find('#empresa').setValue('2')
    await wrapper.find('#folio').setValue('12345')
    await wrapper.find('#estado').setValue('1')
    await wrapper.find('#direccion').setValue('San Martín 123')
    await wrapper.find('#usuario').setValue('Sofía')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(getRepactadoFiltrado).toHaveBeenCalledWith(12345, 6, 2026, '2', {
      estado: 1,
      direccion: 'San Martín 123',
      usuario: 'Sofía',
    })
  })
})
