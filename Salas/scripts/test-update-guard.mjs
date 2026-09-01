import assert from 'node:assert/strict'
import { canSubmitPropertyUpdate } from '../src/utils/propertyUpdateGuard.js'

const loadedProperty = { id: 1442 }

assert.equal(
  canSubmitPropertyUpdate({ loading: true, submitting: false, property: loadedProperty }),
  false,
  'No debe permitir guardar mientras la propiedad está cargando'
)

assert.equal(
  canSubmitPropertyUpdate({ loading: false, submitting: true, property: loadedProperty }),
  false,
  'No debe permitir un segundo envío mientras el primero sigue en curso'
)

assert.equal(
  canSubmitPropertyUpdate({ loading: false, submitting: false, property: null }),
  false,
  'No debe permitir guardar si no hay una propiedad cargada'
)

assert.equal(
  canSubmitPropertyUpdate({ loading: false, submitting: false, loadFailed: true, property: loadedProperty }),
  false,
  'No debe permitir guardar cuando la carga de la propiedad falló'
)

assert.equal(
  canSubmitPropertyUpdate({ loading: false, submitting: false, property: loadedProperty }),
  true,
  'Debe permitir guardar únicamente cuando la propiedad está lista y no hay envío en curso'
)

console.log('propertyUpdateGuard: OK')
