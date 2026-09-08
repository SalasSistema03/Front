<template>
  <div class="h-100">
    <div class="row p-0 m-0 h-100">

      <!-- IZQUIERDA: FORMULARIO DE FILTROS COMPACTO -->
      <div class="col-2 cuadromapabusqueda h-100 d-flex flex-column">
        <div class="card shadow-sm border-0 flex-grow-1">
          <div class="card-body p-2 d-flex flex-column">
            
            <h6 class="fw-bold mb-2 text-primary border-bottom pb-1 small text-uppercase">
              <i class="bi bi-funnel-fill"></i> Filtros
            </h6>
            
            <form @submit.prevent="aplicarFiltros" class="row g-1 flex-grow-1 align-content-start">              
              
              <!-- Operación (Ocupa todo el ancho) -->
              <div class="col-12 mb-1">
                <label class="form-label fw-bold mb-0 text-muted" style="font-size: 0.7rem;">Operación</label>
                <select v-model="filtros.busqueda" class="form-select form-select-sm shadow-sm text-center fw-bold" @change="onOperacionChange">
                  <option value="">TODAS</option>
                  <option value="1">VENTA</option>
                  <option value="2">ALQUILER</option>
                </select>
              </div>

              <!-- Estado Dinámico (Solo se muestra si seleccionó Venta o Alquiler) -->
              <!-- Estado Dinámico (Solo se muestra si seleccionó Venta o Alquiler) -->
              <div class="col-12 mb-1" v-if="filtros.busqueda !== ''">
                <label class="form-label fw-bold mb-0 text-muted" style="font-size: 0.7rem;">
                  Estado de {{ filtros.busqueda == '1' ? 'Venta' : 'Alquiler' }}
                </label>
                <select v-model="filtros.estado_operacion" class="form-select form-select-sm shadow-sm" @change="aplicarFiltros">
                  <!-- Por defecto (value=""), el script enviará los arrays [1, 2] -->
                  <option value="">Activos (1 y 2)</option>

                  <!-- Opciones exactas de estado_ventas -->
                  <template v-if="filtros.busqueda == '1'">
                    <option value="1">1 - EN VENTA</option>
                    <option value="2">2 - EN VENTA COMPARTIDA</option>
                    <option value="3">3 - FINALIZADA</option>
                    <option value="4">4 - BAJA TEMPORAL</option>
                    <option value="5">5 - RESET</option>
                    <option value="6">6 - RETIRADA</option>
                    <option value="7">7 - BAJA</option>
                  </template>

                  <!-- Opciones exactas de estado_alquileres -->
                  <template v-if="filtros.busqueda == '2'">
                    <option value="1">1 - EN ALQUILER</option>
                    <option value="2">2 - EN ALQUILER COMPARTIDO</option>
                    <option value="3">3 - ALQUILADA</option>
                    <option value="4">4 - BAJA TEMPORAL</option>
                    <option value="5">5 - RESET</option>
                    <option value="6">6 - PENDIENTE</option>
                    <option value="7">7 - BAJA</option>
                  </template>
                </select>
              </div>

              <!-- Tipo de Inmueble -->
              <div class="col-12 mb-1">
                <label class="form-label fw-bold mb-0 text-muted" style="font-size: 0.7rem;">Inmueble</label>
                <select v-model="filtros.inmuebles[0]" class="form-select form-select-sm shadow-sm" @change="aplicarFiltros">
                  <option value="">Todos</option>
                  <option v-for="tipo in catalogos.tipos_inmueble" :key="tipo.id" :value="tipo.id">
                    {{ tipo.name || tipo.inmueble }} 
                  </option>
                </select>
              </div>

              <!-- Fila dividida: Dormitorios y Cartel -->
              <div class="col-6 mb-1">
                <label class="form-label fw-bold mb-0 text-muted" style="font-size: 0.7rem;">Dorms.</label>
                <input type="number" v-model="filtros.habitaciones" class="form-control form-control-sm shadow-sm text-center" placeholder="Ej: 2" @keyup.enter="aplicarFiltros"/>
              </div>
              <div class="col-6 mb-1">
                <label class="form-label fw-bold mb-0 text-muted" style="font-size: 0.7rem;">Cartel</label>
                <select v-model="filtros.cartel" class="form-select form-select-sm shadow-sm text-center" @change="aplicarFiltros">
                  <option value="">-</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                  <option value="PENDIENTE">Pendiente</option>
                </select>
              </div>

              <!-- Fila dividida: Moneda y Precio Máximo -->
              <div class="col-5 mb-2">
                <label class="form-label fw-bold mb-0 text-muted" style="font-size: 0.7rem;">Moneda</label>
                <select v-model="filtros.moneda" class="form-select form-select-sm shadow-sm text-center" @change="aplicarFiltros">
                  <option value="">-</option>
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
              </div>
              <div class="col-7 mb-2">
                <label class="form-label fw-bold mb-0 text-muted" style="font-size: 0.7rem;">Precio Máx</label>
                <input type="number" v-model="filtros.hasta" class="form-control form-control-sm shadow-sm text-center" placeholder="Ej: 50000" @keyup.enter="aplicarFiltros">
              </div>

              <!-- Botones de Acción (Pegados al fondo) -->
              <div class="col-12 mt-auto pt-2 border-top">
                <div class="d-flex flex-column gap-1">
                  <button type="submit" class="btn btn-primary btn-sm w-100 fw-bold shadow-sm" :disabled="cargando">
                    <i class="bi bi-search"></i> {{ cargando ? 'Buscando...' : 'Aplicar' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-sm w-100 shadow-sm" @click="limpiarFiltros">
                    <i class="bi bi-eraser"></i> Limpiar
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>

      <!-- DERECHA: MAPA -->
      <div class="col-10 cuadromapabusquedamap p-0 m-0">
         <div id="mapa-inmuebles" class="w-100 h-100"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPropiedadesMapaService, getCatalogosMapaService } from '../../../Services/api/Atcl/AtclApi.js'; 

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

const cargando = ref(false);
const propiedades = ref([]);

const catalogos = ref({
  tipos_inmueble: []
});

// NUEVO: Filtros adaptados a tus peticiones
const filtros = ref({
  busqueda: '',
  inmuebles: [], 
  estado_operacion: '', // Controla el estado específico (1 o 2)
  habitaciones: '',
  cartel: '',
  moneda: '',
  hasta: ''
});

let map = null;
let marcadoresLayer = null;

onMounted(async () => {
  inicializarMapa();
  await cargarCatalogos(); 
  aplicarFiltros();        
});

const cargarCatalogos = async () => {
  try {
    const response = await getCatalogosMapaService();
    if (response.data.success) {
      catalogos.value.tipos_inmueble = response.data.tipos_inmueble;
    }
  } catch (error) {
    console.error("Error al cargar catálogos:", error);
  }
};

const inicializarMapa = () => {
  map = L.map('mapa-inmuebles').setView([-31.637321, -60.694612], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  marcadoresLayer = L.layerGroup().addTo(map);
};

// Se ejecuta al cambiar la operación (Venta o Alquiler)
const onOperacionChange = () => {
  filtros.value.estado_operacion = ''; // Resetea el combo dinámico
  aplicarFiltros();
};


const aplicarFiltros = async () => {
  cargando.value = true;
  try {
    const payload = { ...filtros.value };
    
    // Formatear array de inmuebles (si está vacío, limpiarlo)
    if (payload.inmuebles.length > 0 && !payload.inmuebles[0]) {
      payload.inmuebles = [];
    }

    // ESTADOS POR DEFECTO (Activos)
    payload.estados_venta = [1, 2];
    payload.estados_alquiler = [1, 2];

    // LÓGICA DE ESTADOS ESPECÍFICOS SEGÚN LA OPERACIÓN:
    if (payload.busqueda == '1') { // Si es solo VENTA
      payload.estados_alquiler = []; // Vaciamos los alquileres para evitar choques
      if (payload.estado_operacion) {
        payload.estados_venta = [parseInt(payload.estado_operacion)];
      }
    } else if (payload.busqueda == '2') { // Si es solo ALQUILER
      payload.estados_venta = []; // Vaciamos las ventas para evitar choques
      if (payload.estado_operacion) {
        payload.estados_alquiler = [parseInt(payload.estado_operacion)];
      }
    }
    
    // LIMPIEZA DE PAYLOAD: Eliminamos campos vacíos para no mandar basura al backend
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === null || (Array.isArray(payload[key]) && payload[key].length === 0)) {
        delete payload[key];
      }
    });

    const response = await getPropiedadesMapaService(payload);
    propiedades.value = response.data.data;
    dibujarPines();
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
  } finally {
    cargando.value = false;
  }
};

const dibujarPines = () => {
  marcadoresLayer.clearLayers();
  const propiedadesAgrupadas = agruparPorCoordenadas(propiedades.value);

  for (const coordenadas in propiedadesAgrupadas) {
    const listaProps = propiedadesAgrupadas[coordenadas];
    const [lat, lng] = coordenadas.split(',');
    
    let marcador;
    let popupHTML = '';

    if (listaProps.length > 1) {
      const iconoAgrupado = L.divIcon({
        className: 'icono-transparente',
        html: `<div class="pin-numero">${listaProps.length}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      marcador = L.marker([lat, lng], { icon: iconoAgrupado });
      
      const calleEdificio = listaProps[0].calle ? listaProps[0].calle.name : 'Dirección';
      const numeroEdificio = listaProps[0].numero_calle || '';
      
      popupHTML = `
        <div style="min-width: 220px;">
          <h6 class="fw-bold mb-1 text-primary"><i class="bi bi-building"></i> ${listaProps.length} Unidades Disponibles</h6>
          <p class="small text-muted mb-2 border-bottom pb-1"><i class="bi bi-geo-alt-fill"></i> ${calleEdificio} ${numeroEdificio}</p>
          <ul class="list-group list-group-flush small" style="max-height: 150px; overflow-y: auto;">
      `;
      
      listaProps.forEach(prop => {
        const tipo = prop.tipo_inmueble ? prop.tipo_inmueble.inmueble : 'Propiedad';
        const dorms = prop.cantidad_dormitorios ? `${prop.cantidad_dormitorios} dorm.` : 'Monoambiente';
        let badge = prop.cod_alquiler ? `<span class="badge bg-success">Alq</span>` : `<span class="badge bg-primary">Vta</span>`;
        
        popupHTML += `
          <li class="list-group-item px-1 py-1 d-flex justify-content-between align-items-center">
            <div>
              <strong>${tipo}</strong> (${dorms})<br>
              <a href="/propiedad-detalle/${prop.id}" target="_blank" class="text-decoration-none">Ver código ${prop.cod_alquiler || prop.cod_venta}</a>
            </div>
            ${badge}
          </li>
        `;
      });
      popupHTML += `</ul></div>`;
    } 
    else {
      marcador = L.marker([lat, lng]);
      
      const prop = listaProps[0];
      const tipo = prop.tipo_inmueble ? prop.tipo_inmueble.inmueble : 'Propiedad';
      const calle = prop.calle ? prop.calle.name : '';
      const numero = prop.numero_calle || '';
      
      let codigoHtml = '';
      if (prop.cod_alquiler) codigoHtml += `<span class="badge bg-success mb-1">Alq: ${prop.cod_alquiler}</span><br>`;
      if (prop.cod_venta) codigoHtml += `<span class="badge bg-primary">Venta: ${prop.cod_venta}</span>`;

      popupHTML = `
        <div style="min-width: 180px;">
          <h6 class="fw-bold mb-1">${tipo}</h6>
          <p class="small text-muted mb-2"><i class="bi bi-geo-alt-fill"></i> ${calle} ${numero}</p>
          <div>${codigoHtml}</div>
          <hr class="my-2">
          <a href="/propiedad-detalle/${prop.id}" class="btn btn-sm btn-outline-primary w-100" target="_blank">
            Ver Ficha
          </a>
        </div>
      `;
    }

    marcador.bindPopup(popupHTML);
    marcadoresLayer.addLayer(marcador);
  }
};

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    inmuebles: [],
    estado_operacion: '',
    habitaciones: '',
    cartel: '',
    moneda: '',
    hasta: ''
  };
  aplicarFiltros();
};

const agruparPorCoordenadas = (propiedadesArray) => {
  const agrupadas = {};
  propiedadesArray.forEach(prop => {
    if (prop.latitud && prop.longitud) {
      const key = `${prop.latitud},${prop.longitud}`;
      if (!agrupadas[key]) agrupadas[key] = [];
      agrupadas[key].push(prop);
    }
  });
  return agrupadas;
};
</script>

<style scoped>
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
:deep(.leaflet-popup-content) {
  margin: 15px;
}
:deep(.icono-transparente) {
  background: transparent;
  border: none;
}
:deep(.pin-numero) {
  background-color: #007bff; 
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  border: 3px solid white; 
  box-shadow: 0 3px 6px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: transform 0.2s;
}
:deep(.pin-numero:hover) {
  transform: scale(1.15);
  background-color: #0056b3;
}
</style>