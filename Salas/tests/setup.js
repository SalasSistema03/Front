import { vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

vi.stubGlobal('IntersectionObserver', class IntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
})

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  localStorage.setItem('token', 'mock-token')
})

global.ResizeObserver = class ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'bootstrap', {
  value: {
    Modal: class Modal {
      constructor() {}
      show = vi.fn()
      hide = vi.fn()
      dispose = vi.fn()
    }
  },
  writable: true
})