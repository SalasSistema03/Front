import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CargarSellado from '@/components/Contable/Sellado/CargarSellado.vue'
import ResultadoSellado from '@/components/Contable/Sellado/ResultadoSellado.vue'
import * as SelladoApi from '@/Services/api/Contable/selladoApi'

vi.mock('@/Services/api/Contable/selladoApi.js', () => ({
  calcularSelladoService: vi.fn(),
  guardarResultadoService: vi.fn(),
  getRegistrosService: vi.fn(),
  getSelladoPrecarcadoService: vi.fn(),
}))

vi.mock('@/composables/useToast.js', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}))

describe('CargarSellado', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    SelladoApi.calcularSelladoService.mockResolvedValue({
      data: { data: { gasto_administrativo: 10000 } },
    })
    SelladoApi.getRegistrosService.mockResolvedValue({
      data: { data: { registros: [] }, permisos: {} },
    })
    SelladoApi.guardarResultadoService.mockResolvedValue({})
  })

  it('guarda el gasto administrativo editado en los resultados', async () => {
    const wrapper = mount(CargarSellado)
    await flushPromises()
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const resultadoEditado = {
      gasto_administrativo: 12500,
      iva_gasto_adm: 2625,
    }

    wrapper.findComponent(ResultadoSellado).vm.$emit('registroGuardado', resultadoEditado)
    await flushPromises()

    expect(SelladoApi.guardarResultadoService).toHaveBeenCalledWith(
      expect.objectContaining({ resultado: resultadoEditado }),
    )
  })
})
