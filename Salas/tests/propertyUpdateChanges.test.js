import assert from 'node:assert/strict'
import test from 'node:test'
import {
  changedPropertyUpdateFields,
  propertyUpdateFormState,
  propertyUpdateValuesEqual
} from '../src/utils/propertyUpdateChanges.js'

test('only returns fields whose values differ from the original', () => {
  assert.deepEqual(
    changedPropertyUpdateFields(
      { cartel: 'SI', piso: '3', departamento: 'A', dormitorios: 3 },
      { cartel: 'NO', piso: null, departamento: 'A', dormitorios: 3 }
    ),
    { cartel: 'NO', piso: null }
  )
})

test('preserves false and zero while treating empty input as an existing null', () => {
  assert.deepEqual(
    changedPropertyUpdateFields(
      { piso: null, habilitada: false, ambientes: 0 },
      { piso: '', habilitada: false, ambientes: 0 }
    ),
    {}
  )
  assert.deepEqual(
    changedPropertyUpdateFields(
      { habilitada: true, ambientes: 1 },
      { habilitada: false, ambientes: 0 }
    ),
    { habilitada: false, ambientes: 0 }
  )
})

test('does not turn undefined into an explicit patch value', () => {
  assert.deepEqual(
    changedPropertyUpdateFields(
      { comentario: 'Original' },
      { comentario: undefined, cartel: 'NO' }
    ),
    { cartel: 'NO' }
  )
})

test('initial modal forms preserve valid zero values and nullish defaults', () => {
  const forms = propertyUpdateFormState({
    cantidad_dormitorios: 0,
    banios: 0,
    precio_actual: { moneda_venta_pesos: 0 },
    folios: [{ empresa_id: '1', folio: 0 }]
  })

  assert.equal(forms.comodidades.dormitorios, 0)
  assert.equal(forms.comodidades.banios, 0)
  assert.equal(forms.venta.monto_venta, 0)
  assert.equal(forms.alquiler.FCentral, 0)
  assert.equal(propertyUpdateValuesEqual('3', 3), true)
})
