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
      <div class="col-10 cuadromapabusquedamap p-0 m-0 position-relative">
         <div id="mapa-inmuebles" class="w-100 h-100"></div>
         <div class="leyenda-operaciones" aria-label="Referencias de operaciones">
           <span><i class="leyenda-pin pin-venta"></i> Venta</span>
           <span><i class="leyenda-pin pin-alquiler"></i> Alquiler</span>
           <span><i class="leyenda-pin pin-ambas"></i> Venta y alquiler</span>
           <span><i class="leyenda-pin pin-venta-alquilada"></i>Venta y Alquilada</span>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPropiedadesMapaService, getCatalogosMapaService } from '../../../Services/api/Atcl/AtclApi.js'; 

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const tieneCodigo = codigo => codigo !== null && codigo !== undefined && codigo !== '';

const esVentaActiva = propiedad =>
  tieneCodigo(propiedad.cod_venta) && [1, 2].includes(Number(propiedad.id_estado_venta));

const esAlquilada = propiedad => Number(propiedad.id_estado_alquiler) === 3;

const estaAlquiladaYEnVenta = propiedad =>
  esAlquilada(propiedad) && esVentaActiva(propiedad);

const etiquetasOperacion = {
  venta: 'En venta',
  alquiler: 'En alquiler',
  ambas: 'En venta y alquiler',
  'venta-alquilada': 'Alquilada y en venta'
};

const tiposOperacion = Object.keys(etiquetasOperacion);

const tipoOperacion = propiedad => {
  const tieneVenta = tieneCodigo(propiedad.cod_venta);
  const tieneAlquiler = tieneCodigo(propiedad.cod_alquiler);

  if (estaAlquiladaYEnVenta(propiedad)) return 'venta-alquilada';
  if (tieneVenta && tieneAlquiler) return 'ambas';
  return tieneAlquiler ? 'alquiler' : 'venta';
};

const resumirOperaciones = propiedadesGrupo => {
  const conteos = Object.fromEntries(tiposOperacion.map(tipo => [tipo, 0]));
  propiedadesGrupo.forEach(propiedad => {
    conteos[tipoOperacion(propiedad)] += 1;
  });

  return tiposOperacion
    .filter(tipo => conteos[tipo] > 0)
    .map(tipo => ({ tipo, cantidad: conteos[tipo] }));
};

const crearIconoOperacion = tipo => L.divIcon({
  className: `icono-operacion pin-${tipo}`,
  html: '<svg viewBox="0 0 32 42" aria-hidden="true"><path class="pin-forma" d="M16 0C7.16 0 0 7.16 0 16c0 11.5 16 26 16 26s16-14.5 16-26C32 7.16 24.84 0 16 0zm0 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/></svg>',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -38]
});

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
      const resumen = resumirOperaciones(listaProps);
      const anchoIcono = Math.max(40, resumen.length * 25 + (resumen.length - 1) * 3);
      const indicadores = resumen.map(({ tipo, cantidad }) =>
        `<span class="pin-estado pin-${tipo}" aria-label="${etiquetasOperacion[tipo]}: ${cantidad}" title="${etiquetasOperacion[tipo]}: ${cantidad}"><span class="pin-estado-color" aria-hidden="true"></span><span>${cantidad}</span></span>`
      ).join('');
      const iconoAgrupado = L.divIcon({
        className: 'icono-transparente pin-grupo',
        html: `<div class="pin-grupo-resumen"><div class="pin-numero">${listaProps.length}</div><div class="pin-estados">${indicadores}</div></div>`,
        iconSize: [anchoIcono, 58],
        iconAnchor: [Math.round(anchoIcono / 2), 18],
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
        const codigos = [];
        if (tieneCodigo(prop.cod_venta)) codigos.push(`Venta: ${prop.cod_venta}`);
        if (tieneCodigo(prop.cod_alquiler)) codigos.push(`Alq: ${prop.cod_alquiler}`);
        const badges = codigos.map(codigo => {
          const esAlquiler = codigo.startsWith('Alq:');
          return `<span class="badge ${esAlquiler ? 'bg-success' : 'bg-primary'}">${codigo}</span>`;
        }).join(' ');
        const codigosTexto = codigos.map(codigo => codigo.replace(/^(Venta|Alq): /, '')).join(' / ');
        const estadoAlquilerHtml = esAlquilada(prop)
          ? '<span class="badge bg-warning text-dark">Alquilada</span>'
          : '';
        
        popupHTML += `
          <li class="list-group-item px-1 py-1 d-flex justify-content-between align-items-center">
            <div>
              <strong>${tipo}</strong> (${dorms})<br>
              <a href="/propiedad-detalle/${prop.id}" target="_blank" class="text-decoration-none">Ver código ${codigosTexto}</a>
            </div>
            <div class="d-flex flex-column gap-1">${badges}${estadoAlquilerHtml}</div>
          </li>
        `;
      });
      popupHTML += `</ul></div>`;
    } 
    else {
      const prop = listaProps[0];
      marcador = L.marker([lat, lng], { icon: crearIconoOperacion(tipoOperacion(prop)) });
      const tipo = prop.tipo_inmueble ? prop.tipo_inmueble.inmueble : 'Propiedad';
      const calle = prop.calle ? prop.calle.name : '';
      const numero = prop.numero_calle || '';
      
      let codigoHtml = '';
      if (tieneCodigo(prop.cod_venta)) codigoHtml += `<span class="badge bg-primary mb-1">Venta: ${prop.cod_venta}</span>`;
      if (tieneCodigo(prop.cod_alquiler)) codigoHtml += `<br><span class="badge bg-success ">Alq: ${prop.cod_alquiler}</span><br>`;
      if (esAlquilada(prop)) codigoHtml += '<span class="badge bg-warning text-dark mb-1"> - Alquilada - </span>';
      
      

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
    if (prop.latitud != null && prop.longitud != null) {
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
</style>