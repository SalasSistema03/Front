<template>
    <NavComponent titulo="Propiedad Update"></NavComponent>
    <div class="px-3">
        <form class="row d-flex align-items-start px-3" autocomplete="off">
            <div class="col-md-6 row">
                <div class="form-group col-md-4 px-1">
                    <label for="input-calle" class="form-label">Calle</label>
                    <div class="position-relative">
                        <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
                            v-model="calleSeleccionada" @input="filtrarCalles" @focus="mostrarSugerencias = true"
                            @blur="ocultarSugerencias">

                        <!-- Lista de sugerencias -->
                        <ul v-if="mostrarSugerencias && callesFiltradas.length"
                            class="position-absolute w-100 list-unstyled bg-white border border-top-0 shadow-sm"
                            style="z-index: 1000; max-height: 200px; overflow-y: auto;">
                            <li v-for="calle in callesFiltradas" :key="calle.id" @mousedown="seleccionarCalle(calle)"
                                class="px-3 py-2 cursor-pointer hover:bg-light">
                                {{ calle.name }}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class=" form-group col-md-2 px-1">
                    <label for="input-altura" class="form-label">Altura</label>
                    <input type="number" class="form-control form-control-sm" id="input-altura" placeholder="Altura">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-piso" class="form-label">PH</label>
                    <select name="input-ph" id="input-ph" class="form-select form-select-sm">
                        <option value="0">No</option>
                        <option value="1">Si</option>
                    </select>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-piso" class="form-label">Piso</label>
                    <input type="number" class="form-control form-control-sm" id="input-piso" placeholder="Piso">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="select-tipo-propiedad" class="form-label">Dto</label>
                    <input type="text" class="form-control form-control-sm" id="select-tipo-propiedad"
                        placeholder="Dto">
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-piso" class="form-label">Inmueble</label>
                    <select class="form-select form-select-sm">
                        <option value="">Seleccione</option>
                        <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
                            {{ inmueble.inmueble }}
                        </option>
                    </select>
                </div>
                <div class="form-group col-md-4 px-1">
                    <label for="input-numero-propiedad" class="form-label">Zona</label>
                    <select class="form-select form-select-sm" id="input-zona" name="input-zona">
                        <option value="">Seleccione</option>
                        <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
                            {{ zona.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group col-md-5 px-1">
                    <label for="input-numero-propiedad" class="form-label">Provincia</label>
                    <select class="form-select form-select-sm" name="provincia" id="input-provincia">
                        <option value="">Seleccione</option>
                        <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
                            {{ provincia.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-llave" class="form-label">Llave</label>
                    <input type="number" class="form-control form-control-sm" id="input-llave" placeholder="Llave">
                </div>
                <div class="form-group col-md-9 px-1 pt-3">
                    <!-- <label for="input-observaciones" class="form-label"></label> -->
                    <textarea class="form-control form-control-sm" id="input-observaciones"
                        placeholder="Observaciones de Llaves"></textarea>
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-numero-propiedad" class="form-label">Cartel</label>
                    <select class="form-select form-select-sm" name="cartel" id="input-cartel">
                        <option value="0">Si</option>
                        <option value="1">No</option>

                    </select>
                </div>
                <div class="form-group col-md-9 px-1 pt-3">
                    <textarea class="form-control form-control-sm" id="input-observaciones-cartel"
                        placeholder="Observaciones de Cartel"></textarea>
                </div>
                <div class="form-group col-md-6 px-1 pt-2">
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalComodidades">
                        Comodidades
                    </button>
                </div>
                <div class="form-group col-md-6 px-1 pt-2">
                    <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalDescripcion">
                        Descripcion
                    </button>
                </div>

                <div class="form-group col-md-6 px-1 pt-2">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalVentas">
                        Venta
                    </button>
                </div>
                <div class="form-group col-md-6 px-1 pt-2">
                    <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalAlquiler">
                        Alquiler
                    </button>
                </div>
                <div class="col-md-12 row mt-4 d-flex justify-content-center">
                    <button class="btn btn-primary w-50">Cargar Propiedad</button>
                </div>
            </div>

            <div class="col-md-6 row">
                <!-- INPUT -->
                <div class="form-group col-md-12">
                    <label class="form-label">Subir Archivos</label>
                    <input type="file" multiple class="form-control form-control-sm"
                        accept="image/*,video/*,application/pdf" @change="handleFiles" />
                </div>

                <!-- PREVISUALIZACIÓN CON TABS -->
                <div class="col-md-12 mt-2 " v-if="hasFiles">
                    <div class="card text-center ">
                        <div class="card-header">
                            <ul class="nav nav-tabs card-header-tabs ">
                                <li class="nav-item">
                                    <a class="nav-link" :class="{ active: activeTab === 'images' }"
                                        @click="activeTab = 'images'" href="#" v-if="images.length">
                                        📷 Imágenes ({{ images.length }})
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" :class="{ active: activeTab === 'videos' }"
                                        @click="activeTab = 'videos'" href="#" v-if="videos.length">
                                        🎥 Videos ({{ videos.length }})
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" :class="{ active: activeTab === 'pdfs' }"
                                        @click="activeTab = 'pdfs'" href="#" v-if="pdfs.length">
                                        📄 PDFs ({{ pdfs.length }})
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body ">
                            <!-- ===================== -->
                            <!-- 📷 CARRUSEL IMÁGENES -->
                            <!-- ===================== -->
                            <div v-if="activeTab === 'images' && images.length">
                                <div id="carouselImages" class="carousel slide " data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        <div v-for="(img, index) in images" :key="index" class="carousel-item"
                                            :class="{ active: index === 0 }">
                                            <img :src="img.url"
                                                class="d-block w-100 preview-media atcl_cargar_multimedia_tamaño" />
                                            <!-- Comentario -->
                                            <input class="form-control mt-2"
                                                placeholder="Comentario para esta imagen..." v-model="img.comment" />
                                        </div>
                                    </div>
                                    <!-- Controles -->
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselImages"
                                        data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselImages"
                                        data-bs-slide="next">
                                        <span class="carousel-control-next-icon"></span>
                                    </button>
                                </div>
                            </div>

                            <!-- ===================== -->
                            <!-- 🎥 CARRUSEL VIDEOS -->
                            <!-- ===================== -->
                            <div v-if="activeTab === 'videos' && videos.length">
                                <div id="carouselVideos" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        <div v-for="(vid, index) in videos" :key="index" class="carousel-item"
                                            :class="{ active: index === 0 }">
                                            <video controls
                                                class="d-block w-100 preview-media atcl_cargar_multimedia_tamaño">
                                                <source :src="vid.url" />
                                            </video>
                                            <!-- Comentario -->
                                            <input class="form-control mt-2" placeholder="Comentario para este video..."
                                                v-model="vid.comment" />
                                        </div>
                                    </div>
                                    <!-- Controles -->
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselVideos"
                                        data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselVideos"
                                        data-bs-slide="next">
                                        <span class="carousel-control-next-icon"></span>
                                    </button>
                                </div>
                            </div>

                            <!-- ===================== -->
                            <!-- 📄 CARRUSEL PDF -->
                            <!-- ===================== -->
                            <div v-if="activeTab === 'pdfs' && pdfs.length">
                                <div id="carouselPDF" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        <div v-for="(pdf, index) in pdfs" :key="index" class="carousel-item"
                                            :class="{ active: index === 0 }">
                                            <iframe :src="pdf.url"
                                                class="w-100 preview-media atcl_cargar_multimedia_tamaño"></iframe>
                                            <!-- Comentario -->
                                            <input class="form-control mt-2" placeholder="Comentario para este PDF..."
                                                v-model="pdf.comment" />
                                        </div>
                                    </div>
                                    <!-- Controles -->
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselPDF"
                                        data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselPDF"
                                        data-bs-slide="next">
                                        <span class="carousel-control-next-icon"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </form>
    </div>
</template>

<script>
import NavComponent from '@/components/NavComponent.vue'

export default {
    name: 'PropiedadUpdateView',
    components: {
        NavComponent
    }
}
</script>