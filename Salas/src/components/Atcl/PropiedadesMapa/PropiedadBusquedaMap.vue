<template>
  <div class="">
    <div class="row p-0 m-0 h-100">

      <!-- IZQUIERDA: FORMULARIO DE FILTROS -->
      <div class="col-2 cuadromapabusqueda">
        <div class="card shadow-sm ">
          <div class="card-body p-3">
            <h6 class="fw-bold mb-3 text-primary border-bottom pb-2">
              <i class="bi bi-funnel"></i> Filtros de Búsqueda
            </h6>
            
            <form @submit.prevent="aplicarFiltros" class="row">              
              <!-- Operación -->
              <div class="col-12 form-group mb-2">
                <label class="form-label fw-bold small text-muted mb-1">Operación</label>
                <select v-model="filtros.busqueda" class="form-select form-select-sm shadow-sm" @change="aplicarFiltros">
                  <option value="">Todas</option>
                  <option value="1">Venta</option>
                  <option value="2">Alquiler</option>
                </select>
              </div>

              <!-- Tipo de Inmueble (Catálogo Dinámico) -->
              <div class="col-12 form-group mb-2">
                <label class="form-label fw-bold small text-muted mb-1">Tipo de Inmueble</label>
                <!-- Tu scope permite array, lo mandamos en la posición 0 -->
                <select v-model="filtros.inmuebles[0]" class="form-select form-select-sm shadow-sm" @change="aplicarFiltros">
                  <option value="">Todos</option>
                  <option v-for="tipo in catalogos.tipos_inmueble" :key="tipo.id" :value="tipo.id">
                    {{ tipo.name || tipo.inmueble }} 
                  </option>
                </select>
              </div>

              <!-- Zona (Catálogo Dinámico) -->
              <div class="col-12 form-group mb-2">
                <label class="form-label fw-bold small text-muted mb-1">Zona</label>
                <!-- Tu scope permite array, lo mandamos en la posición 0 -->
                <select v-model="filtros.zonas[0]" class="form-select form-select-sm shadow-sm" @change="aplicarFiltros">
                  <option value="">Todas las zonas</option>
                  <option v-for="zona in catalogos.zonas" :key="zona.id" :value="zona.id">
                    {{ zona.name }}
                  </option>
                </select>
              </div>

              <!-- Habitaciones y Cochera -->
              <div class="col-12 row form-group g-2 mb-2">
                <div class="col-6">
                  <label class="form-label fw-bold small text-muted mb-1">Dormitorios</label>
                  <input type="number" v-model="filtros.habitaciones" class="form-control form-control-sm shadow-sm" placeholder="Ej: 2" @keyup.enter="aplicarFiltros"/>
                </div>
                <div class="col-6">
                  <label class="form-label fw-bold small text-muted mb-1">Cochera</label>
                  <select v-model="filtros.cochera" class="form-select form-select-sm shadow-sm" @change="aplicarFiltros">
                    <option value="">-</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>

              <!-- Mascotas -->
              <!-- <div class="form-group mb-2">
                <label class="form-label fw-bold small text-muted mb-1">Mascotas permitidas</label>
                <select v-model="filtros.mascotas" class="form-select form-select-sm shadow-sm" @change="aplicarFiltros">
                  <option value="">Indistinto</option>
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
              </div> -->

              <!-- Rango de Precios -->
              <div class="form-group mb-3">
                <label class="form-label fw-bold small text-muted mb-1">Precio Hasta</label>
                <!-- <div class="input-group input-group-sm mb-1 shadow-sm">
                  <span class="input-group-text">$</span>
                  <input type="number" v-model="filtros.desde" class="form-control" placeholder="Desde" @keyup.enter="aplicarFiltros">
                </div> -->
                <div class="input-group input-group-sm shadow-sm">
                  <span class="input-group-text">$</span>
                  <input type="number" v-model="filtros.hasta" class="form-control" placeholder="Hasta" @keyup.enter="aplicarFiltros">
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="row g-2 mt-1 border-top pt-1">
                <div class="col-12">
                  <button type="submit" class="btn btn-primary btn-sm w-100 fw-bold shadow-sm" :disabled="cargando">
                    {{ cargando ? 'Buscando...' : 'Aplicar Filtros' }}
                  </button>
                </div>
                <div class="col-12">
                  <button type="button" class="btn btn-outline-secondary btn-sm w-100" @click="limpiarFiltros">
                    Limpiar Filtros
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>

      <!-- DERECHA: MAPA (Aquí va el código de Leaflet que ya teníamos) -->
      <div class="col-10 cuadromapabusquedamap">
         <div id="mapa-inmuebles" class="w-100 h-100"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPropiedadesMapaService, getCatalogosMapaService } from '../../../Services/api/Atcl/AtclApi.js'; // Ajusta la ruta
// import { useToast } from '@/composables/useToast.js'; // Usa su composable de alertas si lo necesitas

// Importaciones de Leaflet
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';



// Fix para los iconos de Leaflet en Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Estado del componente
// const { showError } = useToast();
const cargando = ref(false);
const propiedades = ref([]);

// Estado para guardar las zonas y tipos de inmueble de la DB
const catalogos = ref({
  zonas: [],
  tipos_inmueble: []
});

// Filtros mapeados exactamente a tu scopeFiltrar de Laravel
const filtros = ref({
  busqueda: '',
  inmuebles: [], // Lo enviamos como array porque tu scope usa whereIn
  zonas: [],     // Lo enviamos como array porque tu scope usa whereIn
  habitaciones: '',
  cochera: '',
  mascotas: '',
  desde: '',
  hasta: '',
  ampliar: 1 // Para evitar que oculte las que no tienen estado definido
});

// Variables globales del mapa
let map = null;
let marcadoresLayer = null;

onMounted(async () => {
  inicializarMapa();
  await cargarCatalogos(); // Primero traemos las zonas e inmuebles
  aplicarFiltros();        // Luego cargamos los pines en el mapa
});

const cargarCatalogos = async () => {
  try {
    const response = await getCatalogosMapaService();
    if (response.data.success) {
      catalogos.value.zonas = response.data.zonas;
      catalogos.value.tipos_inmueble = response.data.tipos_inmueble;
    }
  } catch (error) {
    console.error("Error al cargar catálogos:", error);
  }
};

const inicializarMapa = () => {
  // Centrado en Santa Fe
  map = L.map('mapa-inmuebles').setView([-31.637321, -60.694612], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  marcadoresLayer = L.layerGroup().addTo(map);
};

const aplicarFiltros = async () => {
  cargando.value = true;
  try {
    // Clonamos los filtros para limpiar los arrays vacíos y no enviar basura en la URL
    const payload = { ...filtros.value };
    if (payload.inmuebles.length > 0 && !payload.inmuebles[0]) payload.inmuebles = [];
    if (payload.zonas.length > 0 && !payload.zonas[0]) payload.zonas = [];

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

    // ESCENARIO A: Múltiples propiedades (Mostramos el globo con el número)
    if (listaProps.length > 1) {
      // 1. Creamos el ícono personalizado con HTML
      const iconoAgrupado = L.divIcon({
        className: 'icono-transparente', // Le quitamos el fondo por defecto de Leaflet
        html: `<div class="pin-numero">${listaProps.length}</div>`,
        iconSize: [36, 36], // Tamaño del contenedor
        iconAnchor: [18, 18], // Centro del marcador
        popupAnchor: [0, -18] // Donde se abre el popup
      });

      // 2. Asignamos ese ícono al marcador
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
    // ESCENARIO B: Una sola propiedad (Mostramos el pin normal)
    else {
      marcador = L.marker([lat, lng]); // Usa el pin azul por defecto
      
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
    zonas: [],
    habitaciones: '',
    cochera: '',
    mascotas: '',
    desde: '',
    hasta: '',
    ampliar: 1
  };
  aplicarFiltros();
};

// 1. Función auxiliar para agrupar propiedades con la misma lat/lng
const agruparPorCoordenadas = (propiedadesArray) => {
  const agrupadas = {};
  
  propiedadesArray.forEach(prop => {
    if (prop.latitud && prop.longitud) {
      // Creamos una llave única con la latitud y longitud
      const key = `${prop.latitud},${prop.longitud}`;
      
      if (!agrupadas[key]) {
        agrupadas[key] = [];
      }
      // Metemos la propiedad en el grupo correspondiente
      agrupadas[key].push(prop);
    }
  });
  
  return agrupadas;
};
</script>

<style scoped>
/* Aseguramos que el mapa ocupe todo el espacio disponible y no se ponga por encima del navbar */
/* #mapa-inmuebles {
  min-height: 500px;
  z-index: 1;
} */


/* Ajustes menores para los estilos del popup de Leaflet integrado con Bootstrap */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
:deep(.leaflet-popup-content) {
  margin: 15px;
}


/* Limpia el estilo por defecto que Leaflet le pone a los divIcons */
:deep(.icono-transparente) {
  background: transparent;
  border: none;
}

/* El diseño del círculo con el número */
:deep(.pin-numero) {
  background-color: #007bff; /* Color primario (Azul) */
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  border: 3px solid white; /* Borde blanco para que resalte sobre las calles */
  box-shadow: 0 3px 6px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: transform 0.2s;
}

/* Pequeño efecto al pasar el mouse por encima */
:deep(.pin-numero:hover) {
  transform: scale(1.15);
  background-color: #0056b3;
}
</style>