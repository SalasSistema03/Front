<template>
  <div></div>
</template>

<!-- <style scoped>
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
</style> -->

<script setup>
import { GenerarPdfFichaPropiedad } from '@/Services/api/Atcl/AtclApi'
import { defineProps } from 'vue'
const props = defineProps({
  propiedad: {
    type: Object,
    default: null
  },
  ubicacion: {
    type: String,
  }
})

const generarPdf = async () => {
  try {
    const response = await GenerarPdfFichaPropiedad({
      propiedad: props.propiedad,
      ubicacion: props.ubicacion
    });

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000)
  } catch (error) {
    console.error("Error al generar PDF en servidor", error);
  }
}
defineExpose({ generarPdf })
</script>
