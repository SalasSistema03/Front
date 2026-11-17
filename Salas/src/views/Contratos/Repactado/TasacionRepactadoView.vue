<template>
  <NavComponent />

  <main class="tasacion-repactado-page container-fluid px-2 px-md-3 pb-3">
    <div class="tasacion-repactado-heading d-flex align-items-center gap-2 mb-3">
      <div class="tasacion-repactado-heading-icon">
        <i class="bi bi-clipboard2-check"></i>
      </div>
      <div>
        <h1 class="h5 mb-1">Tasación de Repactado</h1>
        <p class="mb-0 text-muted small">Ficha de la propiedad y valores de referencia</p>
      </div>
    </div>

    <section class="card shadow-sm mb-3" aria-labelledby="datos-propiedad-heading">
      <div class="card-header d-flex align-items-center card-header-tasaciones">
        <i class="bi bi-house-door me-2"></i>
        <p id="datos-propiedad-heading" class="mb-0">Datos de la propiedad</p>
      </div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-6 col-md-3 tasacion-repactado-field">
            <label for="provincia" class="form-label">Provincia</label>
            <input id="provincia" class="form-control form-control-sm" placeholder="Sin datos" readonly>
          </div>
          <div class="col-6 col-md-3 tasacion-repactado-field">
            <label for="localidad" class="form-label">Localidad</label>
            <input id="localidad" class="form-control form-control-sm" placeholder="Sin datos" readonly>
          </div>
          <div class="col-6 col-md-3 tasacion-repactado-field">
            <label for="zona" class="form-label">Zona</label>
            <input id="zona" class="form-control form-control-sm" placeholder="Sin datos" readonly>
          </div>
          <div class="col-6 col-md-3 tasacion-repactado-field">
            <label for="inmueble" class="form-label">Inmueble</label>
            <input id="inmueble" class="form-control form-control-sm" placeholder="Sin datos" readonly>
          </div>

          <div class="col-12 col-md-6 tasacion-repactado-field">
            <label for="calle" class="form-label">Calle</label>
            <input id="calle" class="form-control form-control-sm" placeholder="Sin datos" readonly>
          </div>
          <div class="col-6 col-md-2 tasacion-repactado-field">
            <label for="numero" class="form-label">N.º</label>
            <input id="numero" class="form-control form-control-sm" placeholder="—" readonly>
          </div>
          <div class="col-4 col-md-1 tasacion-repactado-field">
            <label for="piso" class="form-label">Piso</label>
            <input id="piso" class="form-control form-control-sm" placeholder="—" readonly>
          </div>
          <div class="col-4 col-md-1 tasacion-repactado-field">
            <label for="departamento" class="form-label">Dto.</label>
            <input id="departamento" class="form-control form-control-sm" placeholder="—" readonly>
          </div>
          <div class="col-4 col-md-2 tasacion-repactado-field">
            <label for="ph" class="form-label">PH</label>
            <input id="ph" class="form-control form-control-sm" placeholder="—" readonly>
          </div>
        </div>
      </div>
    </section>

    <section class="card shadow-sm mb-3" aria-labelledby="gestion-heading">
      <div class="card-header d-flex align-items-center card-header-tasaciones">
        <i class="bi bi-ui-checks-grid me-2"></i>
        <p id="gestion-heading" class="mb-0">Gestión de la propiedad</p>
      </div>
      <div class="card-body">
        <div class="row g-2">
          <div class="col-12 col-sm-4">
            <button type="button" class="btn btn-outline-primary w-100 tasacion-repactado-action"
              @click="abrirModal('comodidades')">
              <i class="bi bi-grid me-2"></i>Comodidades
            </button>
          </div>
          <div class="col-12 col-sm-4">
            <button type="button" class="btn btn-outline-primary w-100 tasacion-repactado-action"
              @click="abrirModal('descripcion')">
              <i class="bi bi-card-text me-2"></i>Descripción
            </button>
          </div>
          <div class="col-12 col-sm-4">
            <button type="button" class="btn btn-outline-primary w-100 tasacion-repactado-action"
              @click="abrirModal('propietarios')">
              <i class="bi bi-people me-2"></i>Propietarios
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-3" aria-label="Valores de tasación">
      <div class="col-12 col-lg-6">
        <article class="card shadow-sm h-100 tasacion-repactado-value-card tasacion-repactado-value-card--venta">
          <div class="card-body d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
            <div class="flex-grow-1">
              <h2 class="h6 mb-2"><i class="bi bi-cash-coin me-2 text-primary"></i>Tasación de venta</h2>
              <label for="precio-venta" class="form-label small text-muted mb-1">Precio de tasación</label>
              <div class="input-group">
                <span class="input-group-text">U$S</span>
                <input id="precio-venta" class="form-control" placeholder="Sin tasar" readonly>
              </div>
            </div>
            <button type="button" class="btn btn-primary flex-shrink-0"
              @click="abrirModal('venta')">
              <i class="bi bi-eye me-1"></i>Ver tasación
            </button>
          </div>
        </article>
      </div>

      <div class="col-12 col-lg-6">
        <article class="card shadow-sm h-100 tasacion-repactado-value-card tasacion-repactado-value-card--alquiler">
          <div class="card-body d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
            <div class="flex-grow-1">
              <h2 class="h6 mb-2"><i class="bi bi-house-check me-2 text-success"></i>Tasación de alquiler</h2>
              <label for="precio-alquiler" class="form-label small text-muted mb-1">Precio de tasación</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input id="precio-alquiler" class="form-control" placeholder="Sin tasar" readonly>
              </div>
            </div>
            <button type="button" class="btn btn-success text-white flex-shrink-0"
              @click="abrirModal('alquiler')">
              <i class="bi bi-eye me-1"></i>Ver tasación
            </button>
          </div>
        </article>
      </div>
    </section>

    <BaseModal :show="modalActivo !== null" size="lg" @close="modalActivo = null">
      <template #title>
        <i :class="modalActual.icono" class="me-2"></i>{{ modalActual.titulo }}
      </template>
      <template #body>
        <div v-if="modalActivo === 'venta' || modalActivo === 'alquiler'" class="row g-3">
          <div class="col-12 col-md-6 tasacion-repactado-field">
            <label class="form-label">Precio de tasación</label>
            <div class="input-group">
              <span class="input-group-text">{{ modalActivo === 'venta' ? 'U$S' : '$' }}</span>
              <input class="form-control" placeholder="Sin tasar" readonly>
            </div>
          </div>
          <div class="col-12">
            <p class="text-muted small mb-0">
              El precio se mostrará cuando se asocie una propiedad a esta tasación.
            </p>
          </div>
        </div>
        <div v-else class="tasacion-repactado-empty-state">
          <i :class="modalActual.icono"></i>
          <p class="mb-0">{{ modalActual.mensaje }}</p>
        </div>
      </template>
    </BaseModal>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import NavComponent from '@/components/NavComponent.vue'

const modalActivo = ref(null)

const modales = {
  comodidades: {
    titulo: 'Comodidades',
    icono: 'bi bi-grid',
    mensaje: 'Las comodidades aparecerán cuando se asocie una propiedad.',
  },
  descripcion: {
    titulo: 'Descripción',
    icono: 'bi bi-card-text',
    mensaje: 'La descripción aparecerá cuando se asocie una propiedad.',
  },
  propietarios: {
    titulo: 'Propietarios',
    icono: 'bi bi-people',
    mensaje: 'Los propietarios aparecerán cuando se asocie una propiedad.',
  },
  venta: {
    titulo: 'Tasación de venta',
    icono: 'bi bi-cash-coin',
  },
  alquiler: {
    titulo: 'Tasación de alquiler',
    icono: 'bi bi-house-check',
  },
}

const modalActual = computed(() => modalActivo.value ? modales[modalActivo.value] : { titulo: '', icono: '' })

const abrirModal = (modal) => {
  modalActivo.value = modal
}
</script>
