<template>
  <NavComponent titulo="Busqueda Propiedad"></NavComponent>
  <div>
    <div class="px-3 pb-3">
      <form class="row" autocomplete="off" @submit.prevent="filtrar">
        <div class="form-group col-md-2 px-1">
          <label for="input-tipo" class="form-label"
            >Busqueda <span class="text-danger">*</span></label
          >
          <select class="form-select form-select-sm" v-model="busqueda">
            <option value="">-Seleccione-</option>
            <option value="1">Venta</option>
            <option value="2">Alquiler</option>
            <option value="3">Folio</option>
          </select>
        </div>
        <div class="form-group col-md-2 px-1">
          <label for="input-codigo" class="form-label">Codigo</label>
          <input
            type="number"
            class="form-control form-control-sm"
            placeholder="N°"
            v-model="codigo"
          />
        </div>

        <!--  INPUT DE CALLE CON COMPOSABLE -->
        <div class="form-group col-md-4 px-1">
          <label for="input-calle" class="form-label">Calle</label>
          <div class="position-relative">
            <input
              type="text"
              class="form-control form-control-sm"
              id="input-calle"
              placeholder="Calle"
              v-model="calleSeleccionada"
              @input="filtrarCalles"
              @focus="mostrarLista"
              @blur="ocultarSugerencias"
            />

            <!-- Lista de sugerencias -->
            <ul
              v-if="mostrarSugerencias && callesFiltradas.length"
              class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm busqueda-select"
            >
              <li
                v-for="calle in callesFiltradas"
                :key="calle.id"
                @mousedown="seleccionarCalle(calle)"
                class="px-3 py-2 cursor-pointer hover:bg-light"
              >
                {{ calle.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="form-group col-md-2 px-1">
          <label for="input-Inmueble" class="form-label">Tipo Inmueble</label>
          <div class="position-relative" ref="inmuebleDropdownRef">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Buscar tipo inmueble..."
              v-model="valorInputInmuebles"
              @click="abrirInmuebles"
            />

            <div
              v-if="mostrarInmuebles"
              class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
              style="max-height: 150px; overflow-y: auto; z-index: 1000"
            >
              <div
                v-for="inmueble in inmuebleFiltrados"
                :key="inmueble.id"
                class="form-check atcl_opcion_seleccionable"
                :class="{ atcl_opcion_marcada: inmueblesSeleccionados.includes(inmueble.id) }"
                @click="onFilaInmuebleClick($event, inmueble.id)"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="inmueble.id"
                  v-model="inmueblesSeleccionados"
                  :id="`inmueble-${inmueble.id}`"
                />
                <label class="form-check-label" :for="`inmueble-${inmueble.id}`">
                  {{ inmueble.inmueble }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group col-md-1 px-1">
          <label for="input-numero-propiedad" class="form-label">Cochera</label>
          <select class="form-select form-select-sm" v-model="cochera">
            <option value="">-</option>
            <option value="SI">Si</option>
            <option value="NO">No</option>
          </select>
        </div>
        <div class="form-group col-md-1 px-1">
          <label for="" class="form-label">Mascotas</label>
          <select class="form-select form-select-sm" v-model="mascotas">
            <option value="">-</option>
            <option value="SI">Si</option>
            <option value="NO">No</option>
          </select>
        </div>
        <div class="form-group col-md-2 px-1">
          <label for="input-habitaciones" class="form-label">Habitaciones</label>
          <input
            type="number"
            class="form-control form-control-sm"
            placeholder="Habitaciones"
            v-model="habitaciones"
          />
        </div>

        <div class="form-group col-md-2 px-1">
          <label for="input-zona" class="form-label">Zona</label>
          <div class="position-relative" ref="zonaDropdownRef">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Buscar zona..."
              v-model="valorInputZonas"
              @click="abrirZonas"
            />

            <div
              v-if="mostrarZonas"
              class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
              style="max-height: 150px; overflow-y: auto; z-index: 1000"
            >
              <div
                v-for="zona in zonasFiltradas"
                :key="zona.id"
                class="form-check atcl_opcion_seleccionable"
                :class="{ atcl_opcion_marcada: zonasSeleccionadas.includes(zona.id) }"
                @click="onFilaZonaClick($event, zona.id)"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="zona.id"
                  v-model="zonasSeleccionadas"
                  :id="`zona-${zona.id}`"
                />
                <label class="form-check-label" :for="`zona-${zona.id}`">
                  {{ zona.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group col-md-2 px-1">
          <label for="input-desde" class="form-label">$desde</label>
          <input
            type="number"
            class="form-control form-control-sm"
            placeholder="Inicio"
            v-model="desde"
          />
        </div>
        <div class="form-group col-md-2 px-1">
          <label for="input-hasta" class="form-label">$hasta</label>
          <input
            type="number"
            class="form-control form-control-sm"
            placeholder="Tope"
            v-model="hasta"
          />
        </div>
        <div class="form-group col-md-2 px-1 align-self-end">
          <label for="">Ordenar por</label>
          <select class="form-select form-select-sm" v-model="orden">
            <option value="">Sin orden</option>
            <option value="precio_asc">Precio (menor a mayor)</option>
            <option value="precio_desc">Precio (mayor a menor)</option>
            <option value="cochera">Cochera</option>
            <option value="habitaciones">Habitaciones</option>
            <option value="tipo">Tipo de inmueble</option>
            <option value="zona">Zona</option>
            <option value="calle">Calle</option>
            <option value="banio">Baños</option>
          </select>
        </div>

        <div class="form-group col-md-1 px-1 align-self-end mt-2">
          <button type="submit" class="btn btn-primary btn-sm w-100">Filtrar</button>
        </div>
        <div class="form-group col-md-1 px-1 align-self-end mt-2" @click="limpiarCampos">
          <button type="button" class="btn btn-secondary btn-sm w-100">Limpiar</button>
        </div>
        <div class="form-group col-1 mt-2">
          <div class="form-check form-switch mt-3">
            <input class="form-check-input mt-2" type="checkbox" value="" id="" v-model="ampliar" />
            <label class="form-check-label" for=""> Ampliar </label>
          </div>
        </div>
      </form>
    </div>
    <div class="table-responsive atcl_contenedor_tabla px-3">
      <table class="table table-striped table-hover atcl_tabla_busqueda_propiedad">
        <thead>
          <tr>
            <th>C.V</th>
            <th>C.A</th>
            <th>Folio</th>
            <th>Direccion</th>
            <th>Zona</th>
            <th>Inmueble</th>
            <th>Dorm.</th>
            <th>Baños</th>
            <th>Cochera</th>
            <th>Mascotas</th>
            <th>P. Alquiler</th>
            <th>P. Venta</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody v-if="buscando">
          <tr>
            <td colspan="13" class="busqueda-propiedad-estado">
              <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
              <span>Buscando propiedades...</span>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="haBuscado && !propiedades.length">
          <tr>
            <td colspan="13" class="busqueda-propiedad-estado text-muted">
              No se encontraron propiedades con los filtros seleccionados.
            </td>
          </tr>
        </tbody>
        <tbody v-else v-for="propiedad in propiedades" :key="propiedad.id">
          <tr>
            <td class="">{{ propiedad.cod_venta || '' }}</td>
            <td
              :class="{
                atcl_tabla_busqueda_propiedad_estados_alquilada:
                  propiedad.estado_alquiler === 'ALQUILADA',
                atcl_tabla_busqueda_propiedad_estados_en_alquiler:
                  propiedad.estado_alquiler === 'EN ALQUILER',
                atcl_tabla_busqueda_propiedad_estados_pendiente:
                  propiedad.estado_alquiler === 'PENDIENTE',
                atcl_tabla_busqueda_propiedad_estados_reset: propiedad.estado_alquiler === 'RESET',
                atcl_tabla_busqueda_propiedad_estados_en_alquiler_compartido:
                  propiedad.estado_alquiler === 'EN ALQUILER COMPARTIDO',
              }"
            >
              {{ propiedad.cod_alquiler || '-' }}
            </td>
            <td>
              {{
                propiedad.folio && propiedad.folio.length > 0
                  ? propiedad.folio
                      .map((f) =>
                        f.empresa_id === 2
                          ? 'C ' + f.folio
                          : f.empresa_id === 3
                            ? 'T ' + f.folio
                            : f.folio,
                      )
                      .join(', ')
                  : '-'
              }}
            </td>
            <td class="atcl_tabla_busqueda_propiedad_calle">
              {{ propiedad.calle || '-' }}
              {{ propiedad.numero_calle || '-' }}
              {{ propiedad.piso ? `- P ${propiedad.piso}` : '' }}
              {{ propiedad.departamento ? `Dpto. ${propiedad.departamento}` : '' }}
            </td>
            <td>{{ propiedad.zona || '' }}</td>
            <td>{{ propiedad.tipo || '' }}</td>
            <td>{{ propiedad.cantidad_dormitorios ?? '' }}</td>
            <td>{{ propiedad.banios || '' }}</td>
            <td>{{ propiedad.cochera || '-' }}</td>
            <td>{{ propiedad.mascota || '-' }}</td>
            <td>{{ formatMoneda(propiedad.precio_alquiler_pesos, propiedad.precio_alquiler_dolar) }}</td>
<td>{{ formatMoneda(propiedad.precio_venta_pesos, propiedad.precio_venta_dolar) }}</td>
            <td>
              <button class="btn btn-primary btn-sm w-100" @click="verPropiedad(propiedad)">
                Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import NavComponent from '../../components/NavComponent.vue'
import { usePropiedadBusqueda } from '../../composables/atcl/usePropiedadBusqueda'

// Devuelve el array "real" tanto si el composable lo expone como ref() o como reactive()/array plano
function comoArray(valor) {
  return Array.isArray(valor) ? valor : valor.value
}

export default {
  components: {
    NavComponent,
  },

  setup() {
    const base = usePropiedadBusqueda()

    // ---------- Tipo Inmueble ----------
    const mostrarInmuebles = ref(false)
    const inmuebleDropdownRef = ref(null)

    const abrirInmuebles = () => {
      mostrarInmuebles.value = true
    }

    const formatMoneda = (pesos, dolar) => {
  if (pesos) return `$${new Intl.NumberFormat('es-AR').format(pesos)}`
  if (dolar) return `U$D ${new Intl.NumberFormat('es-AR').format(dolar)}`
  return ''
}
    const onFilaInmuebleClick = (event, id) => {
      const tag = event.target.tagName.toLowerCase()
      // Si el click fue justo sobre el checkbox o el label, el navegador ya lo maneja solo (evita doble toggle)
      if (tag === 'input' || tag === 'label') return

      const seleccionados = comoArray(base.inmueblesSeleccionados)
      const idx = seleccionados.indexOf(id)
      if (idx === -1) {
        seleccionados.push(id)
      } else {
        seleccionados.splice(idx, 1)
      }
    }

    // ---------- Zona ----------
    const mostrarZonas = ref(false)
    const zonaDropdownRef = ref(null)

    const abrirZonas = () => {
      mostrarZonas.value = true
    }

    const onFilaZonaClick = (event, id) => {
      const tag = event.target.tagName.toLowerCase()
      if (tag === 'input' || tag === 'label') return

      const seleccionadas = comoArray(base.zonasSeleccionadas)
      const idx = seleccionadas.indexOf(id)
      if (idx === -1) {
        seleccionadas.push(id)
      } else {
        seleccionadas.splice(idx, 1)
      }
    }

    // ---------- Cerrar los desplegables SOLO al hacer click afuera ----------
    const manejarClickFuera = (event) => {
      if (inmuebleDropdownRef.value && !inmuebleDropdownRef.value.contains(event.target)) {
        mostrarInmuebles.value = false
      }
      if (zonaDropdownRef.value && !zonaDropdownRef.value.contains(event.target)) {
        mostrarZonas.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', manejarClickFuera)
    })
    onUnmounted(() => {
      document.removeEventListener('click', manejarClickFuera)
    })

    return {
      ...base,
      mostrarInmuebles,
      inmuebleDropdownRef,
      abrirInmuebles,
      onFilaInmuebleClick,
      mostrarZonas,
      zonaDropdownRef,
      abrirZonas,
      onFilaZonaClick,
       formatMoneda
    }
  },
}
</script>

<style scoped>
.atcl_opcion_seleccionable {
  cursor: pointer;
}

.atcl_opcion_marcada {
  background-color: #d6ebff;
}
</style>
