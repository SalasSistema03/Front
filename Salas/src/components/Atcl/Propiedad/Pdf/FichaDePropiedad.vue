<template>
  <div ref="plantillaPdf" class="pdf-container">
    <div class="pdf-page">

      <table class="header-table">
        <tbody>
          <tr>
            <td class="logo-cell">
              <img :src="logoUrl" alt="Logo" class="logo-img" />
            </td>
            <td class="title-cell">
              <h1 class="main-title">
                Ficha de propiedad en {{ ubicacion === 'A' ? 'Alquiler' : 'Venta' }} -
                {{ ubicacion === 'A' ? propiedad?.cod_alquiler : propiedad?.cod_venta }}
              </h1>
            </td>
          </tr>
        </tbody>
      </table>

      <table class="main-layout">
        <tbody>
          <tr>
            <td class="column-data">
              <div class="data-card">
                <div class="card-header">🗒️ Datos de la Propiedad</div>
                <div class="card-body">

                  <div class="data-group">
                    <div class="label">📍 Dirección</div>
                    <div class="value">
                      {{ propiedad?.calle?.name }} {{ propiedad?.numero_calle }}
                      <span v-if="propiedad?.piso"> - Piso {{ propiedad?.piso }}</span>
                      <span v-if="propiedad?.departamento"> - Depto {{ propiedad?.departamento }}</span>
                      <br>
                      <span class="value">{{ propiedad?.zona?.name?.toUpperCase() }}</span>
                    </div>
                  </div>

                  <!-- <div class="data-group">
                    <div class="label">Zona</div>
                    <div class="value">{{ propiedad?.zona?.name?.toUpperCase() }}</div>
                  </div> -->

                  <div class="data-group">
                    <div class="label">🏠 Tipo Inmueble</div>
                    <div class="value">{{ propiedad?.tipo_inmueble?.inmueble }}</div>
                  </div>

                  <div class="data-group">
                    <div class="label">🔧 Servicios</div>
                    <div class="value">
                      {{
                        [
                          propiedad?.gas === 'SI' ? 'GAS' : null,
                          propiedad?.agua === 'SI' ? 'AGUA' : null,
                          propiedad?.cloaca === 'SI' ? 'CLOACA' : null,
                          propiedad?.asfalto === 'SI' ? 'ASFALTO' : null
                        ].filter(Boolean).join(', ') || '-'
                      }}
                    </div>
                  </div>

                  <div class="data-group">
                    <div class="label">🚗 Cochera</div>
                    <div class="value">
                      {{ propiedad?.cochera ? propiedad.cochera : '-' }}
                    </div>
                  </div>

                  <div class="row-flex">
                    <div class="data-group half">
                      <div class="label">🛏️ Dormitorios</div>
                      <div class="value">{{ propiedad?.cantidad_dormitorios ? propiedad.cantidad_dormitorios : '-' }}
                      </div>
                    </div>
                    <div class="data-group half">
                      <div class="label">🛁 Baños</div>
                      <div class="value">{{ propiedad?.banios ? propiedad.banios : '-' }}</div>
                    </div>
                  </div>

                  <div class="row-flex">
                    <div class="data-group half">
                      <div class="label">📐 Metros Lote</div>
                      <div class="value">{{ propiedad?.mLote ? propiedad.mLote + ' m²' : '-' }}</div>
                    </div>
                    <div class="data-group half">
                      <div class="label">📏 Metros Cubiertos</div>
                      <div class="value">{{ propiedad?.mCubiertos ? propiedad.mCubiertos + ' m²' : '-' }}</div>
                    </div>
                  </div>

                  <div class="data-group">
                    <div class="label">💲 Valor</div>
                    <div class="value price">
                      <template v-if="ubicacion === 'A'">
                        {{ propiedad?.precio_actual?.moneda_alquiler_pesos ? '$ ' +
                          propiedad.precio_actual.moneda_alquiler_pesos :
                          propiedad?.precio_actual?.moneda_alquiler_dolar ? 'USD ' +
                            propiedad.precio_actual.moneda_alquiler_dolar : 'Consultar' }}
                      </template>
                      <template v-else>
                        {{ propiedad?.precio_actual?.moneda_venta_dolar ? 'USD ' +
                          propiedad.precio_actual.moneda_venta_dolar :
                          propiedad?.precio_actual?.moneda_venta_pesos ? '$ ' +
                            propiedad.precio_actual.moneda_venta_pesos :
                            'Consultar' }}
                      </template>
                    </div>
                  </div>

                  <div class="data-group no-border">
                    <div class="label">📰 Descripción</div>
                    <div class="value description-text">{{ propiedad?.descipcion_propiedad || '-' }}</div>
                  </div>
                </div>
              </div>

              <div class="qr-section">
                <div class="qr-title">¿Qué te pareció tu visita? ¡Contanos!</div>
                <img src="/qrVentas.jpeg" alt="QR" class="qr-img" />
              </div>
            </td>

            <td class="column-photos">
              <div v-if="cargando" class="loader">Cargando imágenes...</div>
              <div v-else class="photos-stack">
                <div v-for="(foto, index) in imagenesCargadas.slice(0, 3)" :key="index" class="photo-frame">
                  <img :src="foto" class="property-img" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pdf-footer">
        <span class="footer-user">{{ username }}</span>
        <span class="footer-brand">SALAS INMOBILIARIA</span>
        <span class="footer-date">{{ new Date().toLocaleDateString('es-AR') }}</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.pdf-container {
  position: absolute;
  left: -9999px;
  top: 0;
  width: 794px;
  background: #fff;
}

.pdf-page {
  font-family: Arial, sans-serif;
  padding: 30px;
  min-height: 1120px;
  position: relative;
  color: #333;
}

.header-table {
  width: 100%;
  margin-bottom: 25px;
  border-bottom: 2px solid rgba(0, 175, 154, 0.2);
  padding-bottom: 10px;
}

.logo-img {
  height: 65px;
  object-fit: contain;
}

.main-title {
  margin: 0;
  color: rgba(0, 175, 154, 0.96);
  font-size: 22px;
  text-align: right;
}

.main-layout {
  width: 100%;
  border-collapse: collapse;
}

.column-data {
  width: 45%;
  vertical-align: top;
  padding-right: 15px;
}

.column-photos {
  width: 55%;
  vertical-align: top;
}

.data-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 86, 179, 0.15);
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.card-header {
  background: rgb(0, 85, 185);
  color: white;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.card-body {
  padding: 10px;
}

.data-group {
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.row-flex {
  display: flex;
  gap: 10px;
}

.half {
  width: 50%;
}

.label {
  font-size: 12px;
  font-weight: bold;
  color: rgb(0, 85, 185);
  text-transform: uppercase;
}

.value {
  font-size: 13px;
  margin-top: 2px;
}

.price {
  font-size: 18px;
  font-weight: 800;
  color: #2c3e50;
}

.description-text {
  font-size: 11px;
  text-align: justify;
  line-height: 1.4;
  white-space: pre-line;
}

.photos-stack {
  height: 800px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.photo-frame {
  width: auto;
  height: 280px;
  border-radius: 12px;
  overflow: hidden;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.property-img {
  width: auto;
  height: 100%;
  display: block;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.qr-section {
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
}

.qr-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
}

.qr-img {
  width: 150px;
  height: 150px;
}

.pdf-footer {
  position: absolute;
  bottom: 20px;
  left: 30px;
  right: 30px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.footer-brand {
  color: rgb(0, 85, 185);
  font-weight: bold;
}

.no-border {
  border: none;
}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useAuthStore } from '../../../../stores/auth'
import axios from 'axios'
import logoUrl from '../../../../assets/logo.png'

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
const username = ref('')
const authStore = useAuthStore()

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

  const fotosOrdenadas = [...fotos].sort((a, b) => {
    if (a.orden === null && b.orden === null) return 0
    if (a.orden === null) return 1
    if (b.orden === null) return -1
    return a.orden - b.orden
  })

  const primerasTres = fotosOrdenadas.slice(0, 4)
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
  pdf.save('ficha-propiedad.pdf')
}

onMounted(async () => {
  await authStore.fetchPermissions()

  if (!authStore.user) {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(import.meta.env.VITE_API_AUTH_URL + '/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      authStore.user = { username: res.data.username }
    } catch (e) {
      console.error("Error cargando nombre de usuario", e)
    }
  }

  username.value = authStore.user?.username || 'Usuario'
})

defineExpose({ generarPdf })
</script>
