<template>
    <NavComponent titulo="Propiedad Carga"></NavComponent>
    <div class="px-3">
        <div class="row">
            <div class="col-md-6 row form-group d-flex align-items-end justify-content-center">
                <div class="col-md-5 mt-0">
                    <label class="form-label " for="input-calle">
                        Calle
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="- - -" readonly
                        :value="propiedad?.calle.name">
                </div>
                <div class="col-md-3 mt-0">
                    <label class="form-label " for="input-altura">
                        N°
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="-" readonly
                        :value="propiedad?.numero_calle">
                </div>
                <div class="col-md-2 mt-0">
                    <label class="form-label " for="input-piso">
                        PH
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="-" readonly
                        :value="propiedad?.ph">
                </div>
                <div class="col-md-2 mt-0">
                    <label class="form-label " for="input-piso">
                        Piso
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="-" readonly
                        :value="propiedad?.piso">
                </div>

                <div class="col-md-3 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Dto
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="-" readonly
                        :value="propiedad?.dto">
                </div>
                <div class="col-md-4 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Inmueble
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="- -" readonly
                        :value="propiedad?.tipo_inmueble?.inmueble">
                </div>
                <div class="col-md-5 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Zona
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="- - - -" readonly
                        :value="propiedad?.zona?.name">
                </div>

                <div class="col-md-4 mt-0">
                    <label class="form-label " for="input-numero-propiedad">
                        Provincia
                    </label>
                    <input type="text" class="form-control form-control-sm" placeholder="Buenos Aires" readonly
                        :value="propiedad?.provincia?.name">
                </div>
                <!-- <div class="col-md-4 mt-2 text-center">
                    <button class="btn btn-primary btn-sm w-100 " data-bs-toggle="modal">
                        Llave
                    </button>
                </div> -->
                <div class="col-md-4 px-1">
                    <button type="button" class="btn btnSalas btn-mx mt-3 w-100" data-bs-toggle="popover"
                        data-bs-placement="right" data-bs-custom-class="custom-popover"
                        :data-bs-title="'Comentario Cartel'" :data-bs-content="comentarioCartel">
                        <i class="bi bi-info-circle"></i> Cartel - {{ cartelDisplay }}

                    </button>
                </div>

                <div class="col-md-4 px-1">
                    <button type="button" class="btn btnSalas btn-mx mt-3 w-100" data-bs-toggle="popover"
                        data-bs-placement="right" data-bs-custom-class="custom-popover"
                        :data-bs-title="'Comentario Llave'" :data-bs-content="comentarioLlave">
                        <i class="bi bi-info-circle"></i> Llave - {{ llaveDisplay }}
                    </button>
                </div>
                <!-- <div class="col-md-4 mt-2 text-center">
                    <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal">
                        Cartel
                    </button>
                </div> -->

                <div class="col-md-4 mt-3 text-center">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalPropietarios">
                        Propietarios
                    </button>
                </div>
                <div class="col-md-4 mt-3 text-center">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalDescripcion">
                        Descripcion
                    </button>
                </div>
                <div class="col-md-4 mt-3 text-center">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalComodidades">
                        Comodidades
                    </button>
                </div>

                <div class="col-md-12 row mt-3 d-flex justify-content-center align-items-center">
                    <div class="col-md-6  text-center">
                        <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="">
                            Descargar
                        </button>
                    </div>
                    <div class="col-md-6  text-center">
                        <button type="button" class="btn btn-light btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="#">
                            Modificar
                        </button>
                    </div>
                </div>
                <div class="col-md-12 row mt-3 d-flex justify-content-center align-items-center">
                    <div class="col-md-3  text-center">
                        <label for="">Codigo V. </label>
                    </div>
                    <div class="col-md-3  text-center">
                        <input type="text " class="form-control form-control-sm" placeholder="Sin Codigo" readonly
                            :value="propiedad?.cod_venta">
                    </div>
                    <div class="col-md-6  text-center">

                        <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="#modalVentas">
                            Informacion Ventas
                        </button>
                    </div>
                </div>

                <div class="col-md-12 row mt-3 d-flex justify-content-center align-items-center">
                    <div class="col-md-3  text-center">
                        <label for="">Codigo A. </label>
                    </div>
                    <div class="col-md-3  text-center">
                        <input type="text " class="form-control form-control-sm" placeholder="Sin Codigo" readonly
                            :value="propiedad?.cod_alquiler">
                    </div>
                    <div class="col-md-6  text-center">

                        <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                            data-bs-target="#modalAlquiler">
                            Informacion Alquiler
                        </button>
                    </div>
                </div>





            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <ul class="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <a class="nav-link active" id="fotos-tab" data-bs-toggle="tab" href="#fotos" role="tab"
                                    aria-controls="fotos" aria-selected="true">Fotos</a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="documentos-tab" data-bs-toggle="tab" href="#documentos"
                                    role="tab" aria-controls="documentos" aria-selected="false">Documentación</a>
                            </li>
                            <li class="nav-item" role="presentation">
                                <a class="nav-link" id="videos-tab" data-bs-toggle="tab" href="#videos" role="tab"
                                    aria-controls="videos" aria-selected="false">Videos</a>
                            </li>
                        </ul>
                    </div>

                    <div class="card-body p-0">
                        <div class="tab-content" id="myTabContent">

                            <!-- ==================== SECCIÓN DE FOTOS ==================== -->
                            <div class="tab-pane fade show active" id="fotos" role="tabpanel"
                                aria-labelledby="fotos-tab">

                                <!-- Carrusel cuando HAY fotos -->
                                <div v-if="propiedad?.fotos && propiedad.fotos.length > 0" id="carouselFotos"
                                    class="carousel slide" data-bs-ride="carousel" style="height: 345px;">

                                    <!-- Indicadores -->
                                    <div class="carousel-indicators">
                                        <button v-for="(foto, index) in propiedad.fotos" :key="'indicator-' + index"
                                            type="button" data-bs-target="#carouselFotos" :data-bs-slide-to="index"
                                            :class="{ 'active': index === 0 }">
                                        </button>
                                    </div>

                                    <!-- Items del carrusel -->
                                    <div class="carousel-inner h-100">
                                        <div v-for="(foto, index) in propiedad.fotos" :key="'foto-' + index"
                                            class="carousel-item h-100" :class="{ 'active': index === 0 }">

                                            <div class="d-flex flex-column h-100">
                                                <div class="flex-grow-1" style="overflow: hidden;">
                                                    <img :src="'http://localhost' + foto.url" class="w-100 h-100"
                                                        :alt="'Imagen de propiedad ' + (index + 1)"
                                                        style="object-fit: cover; cursor: pointer;"
                                                        @click="openModal(index)">
                                                </div>

                                                <div class="p-2 bg-white" v-if="foto.notes">
                                                    <input type="text" class="form-control" :value="foto.notes"
                                                        disabled>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Controles -->
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselFotos"
                                        data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselFotos"
                                        data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>

                                <!-- Mensaje cuando NO hay fotos -->
                                <div v-else class="text-center d-flex align-items-center justify-content-center"
                                    style="height: 345px;">
                                    Sin Fotos
                                </div>
                            </div>

                            <!-- ==================== SECCIÓN DE DOCUMENTOS ==================== -->
                               <div class="tab-pane fade" id="documentos" role="tabpanel" aria-labelledby="documentos-tab">
                                <div class="list-group" style="overflow-y: auto; max-height: 400px;">

                                    <div v-for="(documento, index) in propiedad?.documentacion" :key="'doc-' + index"
                                        class="list-group-item d-flex flex-column h-100">

                                        <div class="flex-grow-1" style="overflow: hidden;">
                                            <embed :src="'http://localhost' + documento.url" type="application/pdf" class="w-100"
                                                height="300px">
                                        </div>

                                        <div class="p-2 bg-white" v-if="documento.notes">
                                            <input type="text" class="form-control" :value="documento.notes" disabled>
                                        </div>
                                    </div>

                                   
                                    <div v-if="!propiedad?.documentacion || propiedad?.documentacion.length === 0"
                                        class="text-center  d-flex align-items-center justify-content-center" style="height: 345px;">
                                        Sin documentos
                                    </div>
                                      
                                </div>
                            </div>  

                            <!-- ==================== SECCIÓN DE VIDEOS ==================== -->
                                 <div class="tab-pane fade" id="videos" role="tabpanel" aria-labelledby="videos-tab">
                                <div class="list-group" style="overflow-y: auto; max-height: 400px;">

                                    <div v-for="(video, index) in propiedad?.video" :key="'video-' + index"
                                        class="list-group-item d-flex flex-column h-100">

                                        <div class="flex-grow-1" style="overflow: hidden;">
                                            <video controls class="w-100" height="300px">
                                                <source :src="'http://localhost' + video.url" type="video/mp4">
                                                Tu navegador no soporta la etiqueta de video.
                                            </video>
                                        </div>

                                        <div class="p-2 bg-white" v-if="video.notes">
                                            <input type="text" class="form-control" :value="video.notes" disabled>
                                        </div>
                                    </div>

                                    <div v-if="!propiedad?.video || propiedad?.video.length === 0"
                                        class="text-center  d-flex align-items-center justify-content-center" style="height: 345px;">
                                        Sin Videos
                                    </div>
                                </div>
                            </div>  

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <ModalPropiedadComodidades :propiedad="propiedad" />
    <ModalPropiedadDescripcion :propiedad="propiedad" />
    <ModalPropiedadVenta :propiedad="propiedad" />
    <ModalPropiedadAlquiler :propiedad="propiedad" />
    <ModalCondicionAlquiler :propiedad="propiedad" />
    <ModalPropiedadPropietario :propiedad="propiedad" />
</template>
<script>
import NavComponent from '../../components/NavComponent.vue'
import { muestraPropiedad } from '../../Services/api/Atcl/AtclApi'
import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
import ModalCondicionAlquiler from '../../components/Atcl/Propiedad/ModalCondicionAlquiler.vue'
import ModalPropiedadPropietario from '../../components/Atcl/Propiedad/ModalPropiedadPropietario.vue'

export default {
    components: {
        NavComponent,
        ModalPropiedadComodidades,
        ModalPropiedadDescripcion,
        ModalPropiedadVenta,
        ModalPropiedadAlquiler,
        ModalCondicionAlquiler,
        ModalPropiedadPropietario
    },
    data() {
        return {
            propiedad: null,
            loading: true,
            error: null
        }
    },
    computed: {
        llaveDisplay() {
            return this.propiedad?.llave === 1 ? 'SI' : 'NO'
        },
        cartelDisplay() {
            return this.propiedad?.cartel === 'SI' ? 'SI' : 'NO'
        },
        comentarioLlave() {
            return this.propiedad?.comentario_llave || 'Sin comentario'
        },
        comentarioCartel() {
            return this.propiedad?.comentario_autorizacion || 'Sin comentario'
        }
    },
    async mounted() {
        await this.mostrarPropiedad()
        // Inicializar popovers después de que el DOM esté listo
        this.$nextTick(() => {
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl)
            })
        })
    },
    methods: {
        async mostrarPropiedad() {
            try {
                // Obtiene el ID de la URL (ej: /propiedad-detalle/825)
                const id = this.$route.params.id
                console.log('ID de la propiedad:', id)

                // Llama a la API pasando el ID como parámetro
                const response = await muestraPropiedad({ id: id })
                this.propiedad = response.data
                console.log('Propiedad encontrada:', this.propiedad)
            } catch (error) {
                console.error('Error cargando propiedad:', error)
                this.error = 'No se pudo cargar la propiedad'
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
