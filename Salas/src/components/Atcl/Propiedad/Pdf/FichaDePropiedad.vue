<template>
  <!-- Plantilla oculta para capturar con html2canvas -->
  <div ref="plantillaPdf" style="position: absolute; left: -9999px; top: 0; width: 794px; background: #fff;">
    <div style="font-family: Arial, sans-serif; font-size: 12px; padding: 20px; box-sizing: border-box;">

      <!-- ===== BLOQUE DE IMÁGENES (replica layout de referencia) ===== -->
      <div v-if="cargando"
        style="height: 300px; display: flex; align-items: center; justify-content: center; color: #666; background: #f5f5f5; margin-bottom: 8px;">
        Cargando imágenes...
      </div>

      <div v-else-if="imagenesCargadas.length > 0">

        <!-- IMAGEN 1: Hero full width -->
        <div style="width: 100%; height: 280px; overflow: hidden; margin-bottom: 6px;">
          <img :src="imagenesCargadas[0]" alt="Foto principal"
            style="width: 100%; height: 100%; object-fit: cover; display: block;" />
        </div>

        <!-- IMÁGENES 2 y 3: lado a lado -->
        <div style="display: flex; gap: 6px; margin-bottom: 12px;">
          <div v-if="imagenesCargadas[1]" style="flex: 1; height: 200px; overflow: hidden;">
            <img :src="imagenesCargadas[1]" alt="Foto 2"
              style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <div v-if="imagenesCargadas[2]" style="flex: 1; height: 200px; overflow: hidden;">
            <img :src="imagenesCargadas[2]" alt="Foto 3"
              style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          </div>
          <!-- Si solo hay 2 imágenes, completar con placeholder -->
          <div v-if="imagenesCargadas.length === 1" style="flex: 1; height: 200px; background: #f0f0f0;"></div>
        </div>

      </div>

      <!-- ===== FILA: PRECIO + UBICACIÓN ===== -->
      <div style="display: flex; align-items: flex-start; margin-bottom: 14px;">

        <!-- PRECIO (≈ 35%) -->
        <div style="flex: 0 0 35%; padding-right: 12px; box-sizing: border-box;">
          <div style="color: #00589f; text-transform: uppercase; font-size: 22px; font-weight: 700; line-height: 1;">
            {{ ubicacion === 'A' ? 'ALQUILER' : 'VENTA' }}
          </div>
          <div style="font-size: 16px; font-weight: 600; margin-top: 4px; color: #333;">
            <!-- Precio alquiler -->
            <template v-if="ubicacion === 'A'">
              <span v-if="propiedad?.precio_actual?.moneda_alquiler_pesos">
                ${{ propiedad.precio_actual.moneda_alquiler_pesos }}
              </span>
              <span v-else-if="propiedad?.precio_actual?.moneda_alquiler_dolar">
                U$D {{ propiedad.precio_actual.moneda_alquiler_dolar }}
              </span>
              <span v-else>$ Consultar</span>
            </template>
            <!-- Precio venta -->
            <template v-else>
              <span v-if="propiedad?.precio_actual?.moneda_venta_dolar">
                U$D {{ propiedad.precio_actual.moneda_venta_dolar }}
              </span>
              <span v-else-if="propiedad?.precio_actual?.moneda_venta_pesos">
                ${{ propiedad.precio_actual.moneda_venta_pesos }}
              </span>
              <span v-else>$ Consultar</span>
            </template>
          </div>
        </div>

        <!-- UBICACIÓN (≈ 65%) -->
        <div style="flex: 1; display: flex; align-items: flex-start; gap: 8px;">
          <!-- Ícono marcador -->
          <div style="font-size: 22px; color: #00589f; margin-top: -2px; flex-shrink: 0;">📍</div>
          <div>
            <div style="font-size: 18px; font-weight: 700; line-height: 1.3; color: #222;">
              {{ propiedad?.tipo_inmueble?.inmueble }}<br>
              {{ propiedad?.calle?.name }} {{ propiedad?.numero_calle }}
              <span v-if="propiedad?.piso"> - Piso {{ propiedad?.piso }}</span>
              <span v-if="propiedad?.departamento"> Dpto {{ propiedad?.departamento }}</span>
            </div>
            <div style="font-size: 15px; color: #555; margin-top: 2px;">{{ propiedad?.zona?.name }}</div>
            <div style="font-size: 12px; color: #888; margin-top: 3px;">
              COD: {{ ubicacion === 'A' ? propiedad?.cod_alquiler : propiedad?.cod_venta }}
            </div>
          </div>
        </div>

      </div>

      <!-- SEPARADOR -->
      <hr style="border: none; border-top: 1px solid #d9d4d4; margin: 6px 0 12px 0;">

      <!-- ===== FILA: CARACTERÍSTICAS + QR ===== -->
      <div style="display: flex; align-items: flex-start; gap: 10px;">

        <!-- CARACTERÍSTICAS (≈ 78%) -->
        <div style="flex: 0 0 78%; box-sizing: border-box;">
          <div
            style="font-size: 15px; font-weight: 700; color: #333; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
            Características
          </div>

          <!-- Grilla de características -->
          <div style="display: flex; flex-wrap: wrap; gap: 0;">

            <!-- Sup. Exclusiva -->
            <div v-if="propiedad?.mCubiertos"
              style="width: 50%; box-sizing: border-box; border-top: 1px solid #d9d4d4; padding: 5px 4px;">
              <span style="color: #00589f; font-weight: 600; text-transform: uppercase; font-size: 12px;">
                📐 Sup. Cubierta: {{ propiedad.mCubiertos }} m²
              </span>
            </div>

            <!-- M Lote -->
            <div v-if="propiedad?.mLote"
              style="width: 50%; box-sizing: border-box; border-top: 1px solid #d9d4d4; padding: 5px 4px;">
              <span style="color: #00589f; font-weight: 600; text-transform: uppercase; font-size: 12px;">
                📏 Sup. Lote: {{ propiedad.mLote }} m²
              </span>
            </div>

            <!-- Servicios -->
            <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #d9d4d4; padding: 5px 4px;">
              <span style="color: #00589f; font-weight: 600; text-transform: uppercase; font-size: 12px;">
                🔧 Servicios:
                <span v-if="propiedad?.gas === 'SI'"> GAS</span>
                <span v-if="propiedad?.agua === 'SI'"> · AGUA</span>
                <span v-if="propiedad?.cloaca === 'SI'"> · CLOACA</span>
                <span v-if="propiedad?.asfalto === 'SI'"> · ASFALTO</span>
              </span>
            </div>

            <!-- Descripcion -->
            <div v-if="propiedad?.descipcion_propiedad"
              style="width: 100%; box-sizing: border-box; border-top: 1px solid #d9d4d4; padding: 5px 4px;">
              <span style="color: #444; font-size: 12px; line-height: 1.5;">
                {{ propiedad.descipcion_propiedad }}
              </span>
            </div>

          </div>
        </div>

        <!-- QR + LOGO (≈ 22%) -->
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; padding-top: 22px;">
          <p style="font-size: 11px; color: #555; text-align: center; margin: 0;">
            ¿Qué te pareció tu visita?<br>Contanos 👇
          </p>
          <!-- Placeholder QR -->
          <div
            style="width: 80px; height: 80px; background: #f0f0f0; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999; text-align: center;">
            QR<br>aquí
          </div>
          <!-- Logo inmobiliaria -->
          <div
            style="margin-top: 6px; font-size: 10px; color: #888; text-align: center; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            SALAS<br>INMOBILIARIA
          </div>
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

// Computed del precio (mantenido por compatibilidad)
const precioDisplay = computed(() => {
  const precio = props.propiedad?.precio_actual
  if (!precio) return ''
  if (precio.moneda_alquiler_pesos) return `$ ${precio.moneda_alquiler_pesos}`
  if (precio.moneda_alquiler_dolar) return `u$s ${precio.moneda_alquiler_dolar}`
  return ''
})

// Función expuesta para que el padre la pueda llamar
const generarPdf = async () => {
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

<!-- Sin estilos scoped: todo inline para máxima compatibilidad con html2canvas -->
