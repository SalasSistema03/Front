import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

import axios from 'axios'
import { actualizaPadron } from '@/Services/api/Impuestos/tgiApi'

describe('actualizaPadron', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('envía el período seleccionado al endpoint de actualización', () => {
    actualizaPadron({ impuesto: 'tgi', anio: 2026, mes: 11 })

    expect(axios.get).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_AUTH_URL}/v1/actualizar_padron/tgi`,
      expect.objectContaining({
        params: { anio: 2026, mes: 11 },
        headers: { Authorization: 'Bearer mock-token' },
      }),
    )
  })
})
