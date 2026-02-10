<template>
    <NavComponent titulo="Busqueda Propiedad"></NavComponent>
    <div>
        <div class="px-3 pb-3 atcl_contenedor_busqueda_propiedad">
            <form class="row" autocomplete="off" @submit.prevent="filtrar">

                <div class="form-group col-md-2 px-1">
                    <label for="input-tipo" class="form-label">Busqueda</label>
                    <select class="form-select form-select-sm" v-model="busqueda">
                        <option value="">-Seleccione-</option>
                        <option value="1">Venta</option>
                        <option value="2">Alquiler</option>
                    </select>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-codigo" class="form-label">Codigo</label>
                    <input type="number" class="form-control form-control-sm" placeholder="N°" v-model="codigo">
                </div>

                <!-- 🔥 INPUT DE CALLE CON COMPOSABLE -->
                <div class="form-group col-md-4 px-1">
                    <label for="input-calle" class="form-label">Calle</label>
                    <div class="position-relative">
                        <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
                            v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarLista"
                            @blur="ocultarSugerencias">

                        <!-- Lista de sugerencias -->
                        <ul v-if="mostrarSugerencias && callesFiltradas.length"
                            class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm "
                            style="z-index: 1000; max-height: 200px; overflow-y: auto;">
                            <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalle(calle)"
                                class="px-3 py-2 cursor-pointer hover:bg-light ">
                                {{ calle.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="form-group col-md-2 px-1">
                    <label for="input-Inmueble" class="form-label">Tipo Inmueble</label>
                    <div class="position-relative">
                        <input type="text" class="form-control form-control-sm" placeholder="Buscar tipo inmueble..."
                            v-model="busquedaInmuebles" @focus="abrirInmuebles" @blur="cerrarInmuebles">

                        <div v-if="mostrarInmuebles"
                            class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                            style="max-height: 150px; overflow-y: auto; z-index: 1000;"
                            @mousedown.prevent="abrirInmuebles">
                            <div v-for="inmueble in inmuebleFiltrados" :key="inmueble.id" class="form-check ">
                                <input class="form-check-input" type="checkbox" :value="inmueble.id"
                                    v-model="inmueblesSeleccionados" :id="`inmueble-${inmueble.id}`">
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
                <div class="form-group col-md-1 px-1 ">
                    <label for="" class="form-label">Mascotas</label>
                    <select class="form-select form-select-sm" v-model="mascotas">
                        <option value="">-</option>
                        <option value="SI">Si</option>
                        <option value="NO">No</option>
                    </select>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-habitaciones" class="form-label">Habitaciones</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Habitaciones"
                        v-model="habitaciones">
                </div>

                <div class="form-group col-md-2 px-1">
                    <label for="input-zona" class="form-label">Zona</label>
                    <div class="position-relative">
                        <input type="text" class="form-control form-control-sm" placeholder="Buscar zona..."
                            v-model="busquedaZonas" @focus="abrirZonas" @blur="cerrarZonas">

                        <div v-if="mostrarZonas"
                            class="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-sm"
                            style="max-height: 150px; overflow-y: auto; z-index: 1000;" @mousedown.prevent="abrirZonas">
                            <div v-for="zona in zonasFiltradas" :key="zona.id" class="form-check ">
                                <input class="form-check-input" type="checkbox" :value="zona.id"
                                    v-model="zonasSeleccionadas" :id="`zona-${zona.id}`">
                                <label class="form-check-label" :for="`zona-${zona.id}`">
                                    {{ zona.name }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-desde" class="form-label">$desde</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Inicio" v-model="desde">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-hasta" class="form-label">$hasta</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Tope" v-model="hasta">
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

                <div class="form-group col-md-1 px-1 align-self-end">
                    <button type="submit" class="btn btn-primary btn-sm w-100">Filtrar</button>
                </div>
                <div class="form-group col-md-1 px-1 align-self-end" @reset.prevent="reset">
                    <button type="reset" class="btn btn-secondary btn-sm w-100">Limpiar</button>
                </div>
                <div class="form-group col-1 mt-3">
                    <div class="form-check form-switch mt-3">
                        <input class="form-check-input mt-2" type="checkbox" value="" id="" v-model="ampliar" />
                        <label class="form-check-label" for=""> Ampliar </label>
                    </div>
                </div>

            </form>
        </div>
        <div class="table-responsive atcl_contenedor_tabla px-3 pt-1">
            <table class="table table-striped table-hover atcl_tabla_busqueda_propiedad">
                <thead>
                    <tr>
                        <th>C.V</th>
                        <th>C.A</th>
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
                <tbody class="" v-for="propiedad in propiedades" :key="propiedad.id">
                    <tr>
                        <td>{{ propiedad.cod_venta || '-' }}</td>
                        <td>{{ propiedad.cod_alquiler  || '-' }}</td>
                        <td>{{ propiedad.calle|| '-' }} {{ propiedad.numero_calle || '-' }}</td>
                         <td>{{ propiedad.zona || '-' }}</td>
                         <td>{{ propiedad.tipo || '-' }}</td>
                         <td>{{ propiedad.cantidad_dormitorios || '-' }}</td>
                         <td>{{ propiedad.banios || '-' }}</td>
                         <td>{{ propiedad.cochera || '-' }}</td>
                         <td>{{ propiedad.mascota || '-' }}</td>
                         <td>{{ propiedad.precio_alquiler || '-' }}</td>
                         <td>{{ propiedad.precio_venta || '-' }}</td>
                        <td><button class="btn btn-primary btn-sm w-100" @click="verPropiedad(propiedad)">Ver</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import NavComponent from '../../components/NavComponent.vue'
import { useCalleAutocomplete } from '../../composables/atcl/useCalleAutocomplete'
import { getInmueble, getZonas, getProvincias, buscarPropiedad } from '../../Services/api/Atcl/AtclApi'


export default {
    components: {
        NavComponent
    },

    setup() {
        const {

            callesFiltradas,
            mostrarSugerencias,
            calleSeleccionada,
            calleId,
            cargarCalles,
            filtrarCalles,
            seleccionarCalle,
            ocultarSugerencias,
            mostrarLista
        } = useCalleAutocomplete()

        return {
            callesFiltradas,
            mostrarSugerencias,
            calleSeleccionada,
            calleId,
            cargarCalles,
            filtrarCalles,
            seleccionarCalle,
            ocultarSugerencias,
            mostrarLista
        }
    },

    data() {
        return {
            inmuebles: [],
            zonas: [],
            zonasSeleccionadas: [],
            busquedaZonas: '',
            inmueblesSeleccionados: [],
            busquedaInmuebles: '',
            mostrarInmuebles: false,
            mostrarZonas: false,
            cerrarInmueblesTimeoutId: null,
            cerrarZonasTimeoutId: null,

            busqueda: '',
            codigo: '',
            calleId: null,
            inmueblesSeleccionados: [],
            zonasSeleccionadas: [],
            cochera: '',
            mascotas: '',
            habitaciones: '',
            desde: '',
            hasta: '',
            orden: '',
            ampliar: '',
            propiedades: [], // Para guardar los resultados de la búsqueda
        }
    },
    async mounted() {
        await this.cargarCalles()
        await this.cargarInmuebles()
        await this.cargarZonas()
    },
    computed: {
        zonasFiltradas() {
            if (!this.busquedaZonas) return this.zonas
            return this.zonas.filter(zona =>
                zona.name.toLowerCase().includes(this.busquedaZonas.toLowerCase())
            )
        },
        inmuebleFiltrados() {
            if (!this.busquedaInmuebles) return this.inmuebles
            return this.inmuebles.filter(inmueble =>
                inmueble.inmueble.toLowerCase().includes(this.busquedaInmuebles.toLowerCase())
            )
        }
    },
    methods: {
        abrirInmuebles() {
            if (this.cerrarInmueblesTimeoutId) {
                clearTimeout(this.cerrarInmueblesTimeoutId)
                this.cerrarInmueblesTimeoutId = null
            }
            this.mostrarInmuebles = true
        },
        cerrarInmuebles() {
            if (this.cerrarInmueblesTimeoutId) clearTimeout(this.cerrarInmueblesTimeoutId)
            this.cerrarInmueblesTimeoutId = setTimeout(() => {
                this.mostrarInmuebles = false
            }, 250)
        },
        abrirZonas() {
            if (this.cerrarZonasTimeoutId) {
                clearTimeout(this.cerrarZonasTimeoutId)
                this.cerrarZonasTimeoutId = null
            }
            this.mostrarZonas = true
        },
        cerrarZonas() {
            if (this.cerrarZonasTimeoutId) clearTimeout(this.cerrarZonasTimeoutId)
            this.cerrarZonasTimeoutId = setTimeout(() => {
                this.mostrarZonas = false
            }, 250)
        },
        async cargarInmuebles() {
            try {
                const response = await getInmueble()
                this.inmuebles = response.data
            } catch (error) {
                console.error('Error cargando inmuebles:', error)
            }
        },
        async cargarZonas() {
            try {
                const response = await getZonas()
                this.zonas = response.data
            } catch (error) {
                console.error('error cargando zonas:', error)
            }
        },
        async filtrar() {
            const filtros = {
                busqueda: this.busqueda || null,
                codigo: this.codigo || null,
                calle_id: this.calleId || null,
                inmuebles: this.inmueblesSeleccionados.length ? this.inmueblesSeleccionados : null,
                zonas: this.zonasSeleccionadas.length ? this.zonasSeleccionadas : null,
                cochera: this.cochera || null,
                mascotas: this.mascotas || null,
                habitaciones: this.habitaciones || null,
                desde: this.desde || null,
                hasta: this.hasta || null,
                orden: this.orden || null,
                ampliar: this.ampliar ? 1 : 0
            }
             
             const response = await buscarPropiedad(filtros)
             console.log("Respuesta recibida:", response)
             this.propiedades = response.data 
        },
        verPropiedad(propiedad) {
            this.$router.push(`/propiedad-detalle/${propiedad.id}`)
        }
    },
}
</script>
