import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const mocks = vi.hoisted(() => ({
  actualizaPadron: vi.fn(),
  getPadron: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
}))

vi.mock('@/Services/api/Impuestos/tgiApi', () => ({
  actualizaPadron: mocks.actualizaPadron,
  getPadron: mocks.getPadron,
}))

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    showError: mocks.showError,
    showSuccess: mocks.showSuccess,
  }),
}))

vi.mock('@/composables/useDateFormatter', () => ({
  useDateFormatter: () => ({
    formatDate: (date) => date,
    formatPeriod: (date) => date,
  }),
}))

import PadronImpuesto from '@/components/Impuestos/PadronImpuesto.vue'

describe('PadronImpuesto', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getPadron.mockResolvedValue({
      data: {
        resultado: { original: { data: [] } },
        botones: {
          actualizaPadron_tgi: true,
          actualizaPadron_api: true,
        },
      },
    })
    mocks.actualizaPadron.mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  const mountComponent = async (impuesto) => {
    wrapper = mount(PadronImpuesto, {
      props: { impuesto },
      global: {
        stubs: {
          ModalModificarPadron: true,
        },
      },
    })

    await flushPromises()
  }

  it.each(['tgi', 'api'])('permite ingresar el período para %s', async (impuesto) => {
    await mountComponent(impuesto)

    expect(wrapper.findAll('input[type="number"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Año')
    expect(wrapper.text()).toContain('Mes')
  })

  it('envía año y mes al actualizar el padrón TGI y vuelve a cargarlo', async () => {
    await mountComponent('tgi')
    mocks.getPadron.mockClear()

    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0].setValue('2025')
    await inputs[1].setValue('10')
    await wrapper.find('button.btn.btn-sm.btn-primary').trigger('click')
    await flushPromises()

    expect(mocks.actualizaPadron).toHaveBeenCalledWith({
      impuesto: 'tgi',
      anio: 2025,
      mes: 10,
    })
    expect(mocks.getPadron).toHaveBeenCalledTimes(1)
  })

  it('no muestra los inputs de período para otros impuestos', async () => {
    await mountComponent('agua')

    expect(wrapper.findAll('input[type="number"]')).toHaveLength(0)
  })
})
