<template>
  <div class="position-relative">
    <input type="text" class="form-control form-control-sm shadow-sm border-secondary-subtle" autocomplete="off"
      :placeholder="placeholder" v-model="texto" @input="onInput" @focus="onFocus" @blur="onBlur"
      @keydown.down.prevent="moverIndice(1)" @keydown.up.prevent="moverIndice(-1)"
      @keydown.enter.prevent="seleccionarActivo" @keydown.esc="abierto = false" />

    <div v-if="abierto && sugerencias.length > 0" class="list-group position-absolute w-100 shadow mt-1"
      style="z-index: 1050; max-height: 220px; overflow-y: auto">
      <button type="button" v-for="(item, i) in sugerencias" :key="item[valueKey]"
        class="list-group-item list-group-item-action py-1 small" :class="{ active: i === indice }"
        @mousedown.prevent="seleccionar(item)">
        {{ item[labelKey] }}
      </button>
    </div>

    <div v-else-if="abierto && texto.trim() !== '' && items.length > 0"
      class="list-group position-absolute w-100 shadow mt-1" style="z-index: 1050">
      <div class="list-group-item py-1 small text-muted">Sin coincidencias.</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

// Input de texto con sugerencias mientras se escribe. Emite el valor (valueKey) del ítem elegido.
// Texto vacío = sin filtro. Escribir sin elegir una opción deja el valor en vacío.
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  items: { type: Array, required: true },
  labelKey: { type: String, default: 'nombre' },
  valueKey: { type: String, default: 'id' },
  placeholder: { type: String, default: 'Escribí para buscar...' },
  maxSugerencias: { type: Number, default: 10 }
});

const emit = defineEmits(['update:modelValue']);

const texto = ref('');
const abierto = ref(false);
const enFoco = ref(false);
const indice = ref(-1);

const normalizar = (valor) => String(valor ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

const itemSeleccionado = computed(() =>
  props.items.find(item => String(item[props.valueKey]) === String(props.modelValue)) || null
);

const sugerencias = computed(() => {
  const buscado = normalizar(texto.value);
  const filtrados = buscado === ''
    ? props.items
    : props.items.filter(item => normalizar(item[props.labelKey]).includes(buscado));
  return filtrados.slice(0, props.maxSugerencias);
});

// Sincroniza el texto con el valor externo (ej: reset de filtros al abrir el modal)
watch(() => [props.modelValue, props.items], () => {
  if (itemSeleccionado.value) {
    texto.value = itemSeleccionado.value[props.labelKey];
  } else if (!enFoco.value) {
    texto.value = '';
  }
}, { immediate: true, deep: true });

const onFocus = () => {
  enFoco.value = true;
  abierto.value = true;
  indice.value = -1;
};

const onInput = () => {
  // Al escribir, invalidamos la selección anterior hasta que el usuario elija otra opción
  emit('update:modelValue', '');
  abierto.value = true;
  indice.value = -1;
};

const onBlur = () => {
  // Retraso para que el click en una sugerencia alcance a dispararse
  setTimeout(() => {
    enFoco.value = false;
    abierto.value = false;
    texto.value = itemSeleccionado.value ? itemSeleccionado.value[props.labelKey] : '';
  }, 150);
};

const seleccionar = (item) => {
  texto.value = item[props.labelKey];
  emit('update:modelValue', item[props.valueKey]);
  abierto.value = false;
  indice.value = -1;
};

const moverIndice = (paso) => {
  if (!abierto.value) abierto.value = true;
  const total = sugerencias.value.length;
  if (total === 0) return;
  indice.value = (indice.value + paso + total) % total;
};

const seleccionarActivo = () => {
  if (abierto.value && indice.value >= 0 && sugerencias.value[indice.value]) {
    seleccionar(sugerencias.value[indice.value]);
  }
};
</script>
