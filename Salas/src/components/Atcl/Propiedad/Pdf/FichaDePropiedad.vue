<template>
  <!-- Plantilla oculta para capturar con html2canvas -->
  <div ref="plantillaPdf" style="position: absolute; left: -9999px; top: 0; width: 794px;">
    <div style="font-family: Arial; font-size: 12px; padding: 30px;">
      <h1 style="text-align: center; margin-bottom: 10px; color: red;">Ficha de propiedad en <span
          v-if="ubicacion === 'A'">alquiler</span><span v-else>venta</span></h1>
      <hr>
      <h2>Datos de la propiedad</h2>
      <p><strong>Direccion:</strong> {{ propiedad?.calle?.name }} {{ propiedad?.numero_calle }}<span
          v-if="propiedad?.piso"> - Piso {{ propiedad?.piso }}</span><span v-if="propiedad?.departamento"> -
          Departamento {{ propiedad?.departamento }}</span>
      </p>
      <p><strong>Zona:</strong> {{ propiedad?.zona?.name }}</p>
      <p><strong>Tipo Inmueble:</strong> {{ propiedad?.tipo_inmueble?.inmueble }}</p>
      <p><strong>Servicios:</strong>
        <span v-if="propiedad?.gas === 'SI'"> GAS,</span>
        <span v-if="propiedad?.agua === 'SI'"> AGUA,</span>
        <span v-if="propiedad?.cloaca === 'SI'"> CLOACA,</span>
        <span v-if="propiedad?.asfalto === 'SI'"> ASFALTO</span>
      </p>
      <p><strong>Metros:</strong> {{ propiedad?.mLote }} m²</p>
      <p><strong>Metros Cubiertos:</strong> {{ propiedad?.mCubiertos }} m²</p>
      <p><strong>Codigo Web:</strong><span v-if="ubicacion === 'A'">{{ propiedad?.cod_alquiler }}</span><span v-else>{{
        propiedad?.cod_venta }}</span></p>
      <p><strong>Alquilado:</strong>
        <span v-if="new Date(propiedad?.buscarContratoMasReciente?.rescicion) > new Date()">Sí</span>
        <span v-else>No</span>
      </p>
      <p v-if="ubicacion === 'A'">
        <strong>Valor:
          <span v-if="ubicacion === 'A' && propiedad?.precio_actual.moneda_alquiler_pesos != null">
            ${{ propiedad?.precio_actual.moneda_alquiler_pesos }}
          </span>
          <span v-else-if="ubicacion === 'A' && propiedad?.precio_actual.moneda_alquiler_dolar != null">
            U$D{{ propiedad.precio_actual.moneda_alquiler_dolar }}
          </span>
          <span v-else>
            Sin Precio
          </span>
        </strong>
      </p>
      <p v-else>
        <strong>Valor:
          <span v-if="ubicacion === 'V' && propiedad?.precio_actual.moneda_venta_dolar != null">
            U$D{{ propiedad?.precio_actual.moneda_venta_dolar }}
          </span>
          <span v-else-if="ubicacion === 'V' && propiedad?.precio_actual.moneda_venta_pesos != null">
            ${{ propiedad?.precio_actual.moneda_venta_pesos }}
          </span>
          <span v-else>
            Sin Precio
          </span>
        </strong>
      </p>
      <p><strong>Descripcion:</strong> {{ propiedad?.descipcion_propiedad }}</p>

      <p>¿Que te parecio tu visita?</p>
      <p>Contanos</p>
      <p>QR ACA</p>

      <!-- Mostrar las 3 primeras fotos -->
      <div v-if="cargando" style="margin: 20px 0; color: #666;">Cargando imágenes...</div>
      <div class="fotos-container" v-else-if="imagenesCargadas.length > 0">
        <div v-for="(imagen, index) in imagenesCargadas" :key="index" class="foto-item">
          <img :src="imagen" alt="Foto propiedad" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const props = defineProps({
  propiedad: {
    type: Object,
    default: null
  },
  ubicacion: {
    type: String,

  }
})

const plantillaPdf = ref(null)
const imagenesCargadas = ref([])
const cargando = ref(false)

// Convierte una URL a base64 usando fetch (evita problemas de CORS con canvas)
const convertirImagenABase64 = async (url) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Error al obtener imagen: ${response.status}`)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Error al leer el blob'))
    reader.readAsDataURL(blob)
  })
}

watch(() => props.propiedad?.fotos, async (fotos) => {
  imagenesCargadas.value = []
  if (!fotos || fotos.length === 0) return

  cargando.value = true

  // Ordenar por "orden" si existe, los null van al final
  const fotosOrdenadas = [...fotos].sort((a, b) => {
    if (a.orden === null && b.orden === null) return 0
    if (a.orden === null) return 1
    if (b.orden === null) return -1
    return a.orden - b.orden
  })

  const primerasTres = fotosOrdenadas.slice(0, 3)
  const imagenesBase64 = []

  for (const fotoItem of primerasTres) {
    try {
      const base64 = await convertirImagenABase64(fotoItem.url)
      imagenesBase64.push(base64)
    } catch (error) {
      console.error('Error al cargar imagen:', fotoItem.url, error)
    }
  }

  imagenesCargadas.value = imagenesBase64
  cargando.value = false
}, { immediate: true })
// Computed del precio
const precioDisplay = computed(() => {
  const precio = props.propiedad?.precio_actual
  if (!precio) return ''
  if (precio.moneda_alquiler_pesos) return `$ ${precio.moneda_alquiler_pesos}`
  if (precio.moneda_alquiler_dolar) return `u$s ${precio.moneda_alquiler_dolar}`
  return ''
})

// Función expuesta para que el padre la pueda llamar
const generarPdf = async () => {
  // Esperar a que las imágenes terminen de cargar antes de capturar
  if (cargando.value) {
    await new Promise(resolve => {
      const stop = watch(cargando, (val) => { if (!val) { stop(); resolve() } })
    })
  }

  const canvas = await html2canvas(plantillaPdf.value, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  window.open(pdf.output('bloburl'), '_blank')
}

defineExpose({ generarPdf })
</script>

<style scoped>
.fotos-container {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.foto-item {
  width: 240px;
  height: 160px;
  border: 1px solid #ddd;
  overflow: hidden;
}
</style>
