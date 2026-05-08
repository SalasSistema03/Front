<template>
  <BaseModal :show="show" size="fullscreen" @close="emit('close')">
    <template #title>
      {{ propiedad?.calle.name }}
      {{ propiedad?.numero_calle }}
      <span v-if="propiedad?.piso"> - Piso {{ propiedad?.piso }}</span>
      <span v-if="propiedad?.departamento"> - Depto {{ propiedad?.departamento }}</span>
    </template>

    <template #body>
      <div v-if="imagenes.length" class="d-flex align-items-center justify-content-center gap-2">
        <button type="button" class="btn btn-outline-secondary" @click="prev" :disabled="imagenes.length <= 1">
          <i class="bi bi-chevron-left"></i>
        </button>


        <div class="flex-grow-1 d-flex align-items-center justify-content-center" style="min-height: 60vh;">
          <img
            :src="srcImagenActual"
            :alt="`Imagen ${currentIndex + 1}`"
            style="max-width: 100%; max-height: 72vh; object-fit: contain;"
          />
        </div>

        <button type="button" class="btn btn-outline-secondary" @click="next" :disabled="imagenes.length <= 1">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <div v-else class="text-center small">
        Sin imágenes
      </div>
    </template>

    <template #footer>
      <div class="d-flex justify-content-between w-100">
        <div class="small text-muted">
          {{ imagenes.length ? (currentIndex + 1) + ' / ' + imagenes.length : '' }}
        </div>
        <button type="button" class="btn btn-secondary btn-sm" @click="emit('close')">Cerrar</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'

const emit = defineEmits(['close'])

const props = defineProps({
  fotos: { type: Array, default: () => [] },
  index: { type: Number, default: 0 },
  show: { type: Boolean, default: false },
  propiedad: {type:Object, default: null}
})

const currentIndex = ref(0)

watch(
  () => [props.show, props.index, props.fotos],
  () => {
    if (!props.show) return
    const max = Array.isArray(props.fotos) ? props.fotos.length - 1 : -1
    const nextIndex = Math.max(0, Math.min(props.index ?? 0, max < 0 ? 0 : max))
    currentIndex.value = nextIndex
  },
  { immediate: true }
)

const imagenes = computed(() => (Array.isArray(props.fotos) ? props.fotos : []))

const srcImagenActual = computed(() => {
  const foto = imagenes.value[currentIndex.value]
  if (!foto?.url) return ''
  return `http://10.10.10.191${foto.url}`
})

function prev() {
  if (imagenes.value.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + imagenes.value.length) % imagenes.value.length
}

function next() {
  if (imagenes.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % imagenes.value.length
}
</script>
