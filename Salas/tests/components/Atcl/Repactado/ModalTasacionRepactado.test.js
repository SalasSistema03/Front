import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ModalTasacionRepactado from '@/components/Atcl/Repactado/ModalTasacionRepactado.vue'
import * as AtclApi from '@/Services/api/Atcl/AtclApi'
import * as RepactadoApi from '@/Services/api/Contrato/Repactado'

vi.mock('@/components/base/BaseModal.vue', () => ({
  default: {
    name: 'BaseModal',
    props: ['show', 'size'],
    template: `
      <div v-if="show">
        <slot name="title" />
        <slot name="body" />
        <slot name="footer" />
      </div>
    `,
  },
}))

vi.mock('@/Services/api/Atcl/AtclApi', () => ({
  muestraPropiedad: vi.fn(),
}))

vi.mock('@/Services/api/Contrato/Repactado', () => ({
  guardarTasacionRepactado: vi.fn(),
}))

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    showError: vi.fn(),
    showSuccess: vi.fn(),
    handleApiError: vi.fn(),
  }),
}))

const repactado = {
  id: 25,
  propiedadId: 7,
  empresaPropiedadId: 70,
}

const propiedad = {
  provincia: { name: 'Santa Fe' },
  localidad: { name: 'Rosario' },
  zona: { name: 'Centro' },
  tipo_inmueble: { inmueble: 'Departamento' },
  calle: { name: 'San Martín' },
  numero_calle: '123',
  piso: '2',
  departamento: 'A',
  ph: null,
  propietarios: [{ id: 1, nombre: 'Ana', apellido: 'Pérez' }],
  fotos: [{ id: 1, url: 'foto.jpg', notes: 'Frente' }],
  documentacion: [],
  video: [],
  notas: [],
  tasaciones: [{
    id: 5,
    tasacion_pesos_venta: 125000,
    tasacion_dolar_venta: null,
    tasacion_pesos_alquiler: 25000,
    fecha_tasacion: '2026-06-01',
    comentario_tasacion: 'Tasación anterior',
  }],
}

const mountModal = () => mount(ModalTasacionRepactado, {
  props: { show: true, repactado },
})

describe('ModalTasacionRepactado', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    AtclApi.muestraPropiedad.mockResolvedValue({ data: { data: propiedad } })
    RepactadoApi.guardarTasacionRepactado.mockResolvedValue({ data: { success: true } })
  })

  it('carga y muestra la ficha de propiedad al abrir el modal', async () => {
    const wrapper = mountModal()
    await flushPromises()

    expect(AtclApi.muestraPropiedad).toHaveBeenCalledWith({ id: 7 })
    expect(wrapper.find('input[readonly]').element.value).toBe('Santa Fe')
    expect(wrapper.text()).toContain('Ana Pérez')
    expect(wrapper.find('img[alt="Frente"]').exists()).toBe(true)
  })

  it('guarda los importes y vincula la tasación al historial del repactado', async () => {
    const wrapper = mountModal()
    await flushPromises()

    expect(wrapper.find('#tasacion-alquiler-repactado').element.value).toBe('25000')
    await wrapper.find('#tasacion-alquiler-repactado').setValue('30000')
    await wrapper.find('#fecha-tasacion-repactado').setValue('2026-06-15')
    await wrapper.find('#comentario-tasacion-repactado').setValue('Actualización anual')
    await wrapper.findAll('button').find((button) => button.text().includes('Guardar tasación')).trigger('click')
    await flushPromises()

    expect(RepactadoApi.guardarTasacionRepactado).toHaveBeenCalledWith({
      id_empresa_propiedad: 70,
      id_historial_estado_repactado: 25,
      tasacion_venta: 125000,
      moneda_venta: '1',
      tasacion_alquiler: 30000,
      fecha_tasacion: '2026-06-15',
      comentario_tasacion: 'Actualización anual',
    })
    expect(wrapper.emitted('saved')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
