import { describe, it, expect } from 'vitest'
import {
  changedPropertyUpdateFields,
  propertyUpdateFormState,
  propertyUpdateValuesEqual
} from '@/utils/propertyUpdateChanges.js'

describe('propertyUpdateChanges', () => {
  describe('changedPropertyUpdateFields', () => {
    it('only returns fields whose values differ from the original', () => {
      expect(
        changedPropertyUpdateFields(
          { cartel: 'SI', piso: '3', departamento: 'A', dormitorios: 3 },
          { cartel: 'NO', piso: null, departamento: 'A', dormitorios: 3 }
        )
      ).toEqual({ cartel: 'NO', piso: null })
    })

    it('preserves false and zero while treating empty input as an existing null', () => {
      expect(
        changedPropertyUpdateFields(
          { piso: null, habilitada: false, ambientes: 0 },
          { piso: '', habilitada: false, ambientes: 0 }
        )
      ).toEqual({})

      expect(
        changedPropertyUpdateFields(
          { habilitada: true, ambientes: 1 },
          { habilitada: false, ambientes: 0 }
        )
      ).toEqual({ habilitada: false, ambientes: 0 })
    })

    it('does not turn undefined into an explicit patch value', () => {
      expect(
        changedPropertyUpdateFields(
          { comentario: 'Original' },
          { comentario: undefined, cartel: 'NO' }
        )
      ).toEqual({ cartel: 'NO' })
    })
  })

  describe('propertyUpdateFormState', () => {
    it('initial modal forms preserve valid zero values and nullish defaults', () => {
      const forms = propertyUpdateFormState({
        cantidad_dormitorios: 0,
        banios: 0,
        precio_actual: { moneda_venta_pesos: 0 },
        folios: [{ empresa_id: '1', folio: 0 }]
      })

      expect(forms.comodidades.dormitorios).toBe(0)
      expect(forms.comodidades.banios).toBe(0)
      expect(forms.venta.monto_venta).toBe(0)
      expect(forms.alquiler.FCentral).toBe(0)
    })
  })

  describe('propertyUpdateValuesEqual', () => {
    it('compares string and number values correctly', () => {
      expect(propertyUpdateValuesEqual('3', 3)).toBe(true)
    })
  })
})