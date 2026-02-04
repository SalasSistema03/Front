<template>
    <NavComponent titulo="Propiedad Carga"></NavComponent>
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
                    <input
                        type="file"
                        multiple
                        class="form-control form-control-sm"
                        accept="image/*,video/*,application/pdf"
                        @change="handleFiles"
                    />
                </div>

                <!-- PREVISUALIZACIÓN CON TABS -->
                <div class="col-md-12 mt-2 " v-if="hasFiles">
                    <div class="card text-center ">
                        <div class="card-header">
                            <ul class="nav nav-tabs card-header-tabs ">
                                <li class="nav-item">
                                    <a 
                                        class="nav-link" 
                                        :class="{ active: activeTab === 'images' }"
                                        @click="activeTab = 'images'"
                                        href="#"
                                        v-if="images.length"
                                    >
                                        📷 Imágenes ({{ images.length }})
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a 
                                        class="nav-link" 
                                        :class="{ active: activeTab === 'videos' }"
                                        @click="activeTab = 'videos'"
                                        href="#"
                                        v-if="videos.length"
                                    >
                                        🎥 Videos ({{ videos.length }})
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a 
                                        class="nav-link" 
                                        :class="{ active: activeTab === 'pdfs' }"
                                        @click="activeTab = 'pdfs'"
                                        href="#"
                                        v-if="pdfs.length"
                                    >
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
                                <div
                                    id="carouselImages"
                                    class="carousel slide "
                                    data-bs-ride="carousel"
                                >
                                    <div class="carousel-inner">
                                        <div
                                            v-for="(img, index) in images"
                                            :key="index"
                                            class="carousel-item"
                                            :class="{ active: index === 0 }"
                                        >
                                            <img :src="img.url" class="d-block w-100 preview-media atcl_cargar_multimedia_tamaño" />
                                            <!-- Comentario -->
                                            <input
                                                class="form-control mt-2"
                                                placeholder="Comentario para esta imagen..."
                                                v-model="img.comment"
                                            />
                                        </div>
                                    </div>
                                    <!-- Controles -->
                                    <button class="carousel-control-prev" type="button"
                                        data-bs-target="#carouselImages" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </button>
                                    <button class="carousel-control-next" type="button"
                                        data-bs-target="#carouselImages" data-bs-slide="next">
                                        <span class="carousel-control-next-icon"></span>
                                    </button>
                                </div>
                            </div>

                            <!-- ===================== -->
                            <!-- 🎥 CARRUSEL VIDEOS -->
                            <!-- ===================== -->
                            <div v-if="activeTab === 'videos' && videos.length">
                                <div
                                    id="carouselVideos"
                                    class="carousel slide"
                                    data-bs-ride="carousel"
                                >
                                    <div class="carousel-inner">
                                        <div
                                            v-for="(vid, index) in videos"
                                            :key="index"
                                            class="carousel-item"
                                            :class="{ active: index === 0 }"
                                        >
                                            <video controls class="d-block w-100 preview-media atcl_cargar_multimedia_tamaño">
                                                <source :src="vid.url" />
                                            </video>
                                            <!-- Comentario -->
                                            <input
                                                class="form-control mt-2"
                                                placeholder="Comentario para este video..."
                                                v-model="vid.comment"
                                            />
                                        </div>
                                    </div>
                                    <!-- Controles -->
                                    <button class="carousel-control-prev" type="button"
                                        data-bs-target="#carouselVideos" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </button>
                                    <button class="carousel-control-next" type="button"
                                        data-bs-target="#carouselVideos" data-bs-slide="next">
                                        <span class="carousel-control-next-icon"></span>
                                    </button>
                                </div>
                            </div>

                            <!-- ===================== -->
                            <!-- 📄 CARRUSEL PDF -->
                            <!-- ===================== -->
                            <div v-if="activeTab === 'pdfs' && pdfs.length">
                                <div
                                    id="carouselPDF"
                                    class="carousel slide"
                                    data-bs-ride="carousel"
                                >
                                    <div class="carousel-inner">
                                        <div
                                            v-for="(pdf, index) in pdfs"
                                            :key="index"
                                            class="carousel-item"
                                            :class="{ active: index === 0 }"
                                        >
                                            <iframe
                                                :src="pdf.url"
                                                class="w-100 preview-media atcl_cargar_multimedia_tamaño"
                                            ></iframe>
                                            <!-- Comentario -->
                                            <input
                                                class="form-control mt-2"
                                                placeholder="Comentario para este PDF..."
                                                v-model="pdf.comment"
                                            />
                                        </div>
                                    </div>
                                    <!-- Controles -->
                                    <button class="carousel-control-prev" type="button"
                                        data-bs-target="#carouselPDF" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon"></span>
                                    </button>
                                    <button class="carousel-control-next" type="button"
                                        data-bs-target="#carouselPDF" data-bs-slide="next">
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
    <ModalPropiedadComodidades :estados-generales="estadosGenerales"></ModalPropiedadComodidades>
    <ModalPropiedadDescripcion></ModalPropiedadDescripcion>
    <ModalPropiedadVenta :estados-venta="estadosVenta" :captadores-internos="captadoresInternos" :asesores="asesores"></ModalPropiedadVenta>
    <ModalPropiedadAlquiler :estados-alquiler="estadosAlquiler"></ModalPropiedadAlquiler>

</template>

<script>
import NavComponent from '../../components/NavComponent.vue'
import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
import { getInmueble, getZonas, getProvincias, getEstadoGeneral, getEstadoVenta, getEstadoAlquiler,
    getCalles, getAsesor, getCaptadorInterno } from '../../Services/api/Atcl/AtclApi'
import { onMounted, ref, computed } from 'vue'

export default {
    components: {
        NavComponent,
        ModalPropiedadComodidades,
        ModalPropiedadDescripcion,
        ModalPropiedadVenta,
        ModalPropiedadAlquiler
    },
    data() {
        return {
            slides: [],
            inmuebles: [],
            zonas: [],
            provincias: [],
            estadosGenerales: [],
            estadosVenta: [],
            estadosAlquiler: [],
            calles: [],
            asesores: [],
            captadoresInternos: [],
            // Variables para autocompletado de calles
            calleSeleccionada: '',
            callesFiltradas: [],
            mostrarSugerencias: false,
            // Variables para archivos
            images: [],
            videos: [],
            pdfs: [],
            // Variable para controlar el tab activo
            activeTab: 'images'
            
        }
    },
    computed: {
        hasFiles() {
            return this.images.length || this.videos.length || this.pdfs.length
        }
    },
    methods: {
        async cargarInmuebles() {
            try {
                const response = await getInmueble();
                this.inmuebles = response.data;
                //console.log('Inmuebles cargados:', this.inmuebles);
            } catch (error) {
                //console.error('Error cargando inmuebles:', error);
            }
        },
        async cargarZonas() {
            try {
                const response = await getZonas();
                this.zonas = response.data;
                //console.log('Zonas cargadas:', this.zonas);
            } catch (error) {
                //console.error('Error cargando zonas:', error);
            }
        },
        async cargarProvincias() {
            try {
                const response = await getProvincias();
                this.provincias = response.data;
                //console.log('Provincias cargadas:', this.provincias);
            } catch (error) {
                //console.error('Error cargando provincias:', error);
            }
        },
        async cargarEstadosGenerales() {
            try {
                const response = await getEstadoGeneral();
                this.estadosGenerales = response.data;
                //console.log('Estados generales cargados:', this.estadosGenerales);
            } catch (error) {
                //console.error('Error cargando estados generales:', error);
            }
        },
        async cargarEstadosVenta() {
            try {
                const response = await getEstadoVenta();
                this.estadosVenta = response.data;
                //console.log('Estados venta cargados:', this.estadosVenta);
            } catch (error) {
                //console.error('Error cargando estados venta:', error);
            }
        },
         async cargarAsesores() {
             try {
                 const response = await getAsesor();
                 this.asesores = response.data.original || response.data;
                 console.log('Asesores cargados:', this.asesores);
             } catch (error) {
                 console.error('Error cargando asesores:', error);
             }
         },
        async cargarCaptadoresInternos() {
            try {
                const response = await getCaptadorInterno();
                this.captadoresInternos = response.data.original || response.data;
                //console.log('Captadores internos cargados:', this.captadoresInternos);
            } catch (error) {
                console.error('Error cargando captadores internos:', error);
            }
        },
        async cargarEstadosAlquiler() {
            try {
                const response = await getEstadoAlquiler();
                this.estadosAlquiler = response.data;
                //console.log('Estados alquiler cargados:', this.estadosAlquiler);
            } catch (error) {
                //console.error('Error cargando estados alquiler:', error);
            }
        },
        async cargarCalles() {
            try {
                const response = await getCalles();
                this.calles = response.data;
                //console.log('Calles cargadas:', this.calles);
            } catch (error) {
                //console.error('Error cargando calles:', error);
            }
        },
        // Métodos para autocompletado de calles
        filtrarCalles() {
            const texto = this.calleSeleccionada.toLowerCase();
            if (texto.length === 0) {
                this.callesFiltradas = [];
                return;
            }

            this.callesFiltradas = this.calles.filter(calle =>
                calle.name.toLowerCase().includes(texto)
            ).slice(0, 10); // Limitar a 10 resultados
        },
        seleccionarCalle(calle) {
            this.calleSeleccionada = calle.name;
            this.mostrarSugerencias = false;
            this.callesFiltradas = [];
        },
        ocultarSugerencias() {
            // Pequeño delay para permitir el click en la sugerencia
            setTimeout(() => {
                this.mostrarSugerencias = false;
            }, 200);
        },
        // Método para manejar archivos
        handleFiles(event) {
            const files = Array.from(event.target.files)

            // limpiar previews anteriores
            this.images = []
            this.videos = []
            this.pdfs = []

            files.forEach((file) => {
                const url = URL.createObjectURL(file)

                const item = {
                    file,
                    url,
                    comment: ""
                }

                if (file.type.startsWith("image/")) {
                    this.images.push(item)
                }
                else if (file.type.startsWith("video/")) {
                    this.videos.push(item)
                }
                else if (file.type === "application/pdf") {
                    this.pdfs.push(item)
                }
            })

            // Establecer el tab activo según los archivos cargados
            if (this.images.length > 0) {
                this.activeTab = 'images'
            } else if (this.videos.length > 0) {
                this.activeTab = 'videos'
            } else if (this.pdfs.length > 0) {
                this.activeTab = 'pdfs'
            }
        },
        showData() {
            console.log("IMÁGENES:", this.images)
            console.log("VIDEOS:", this.videos)
            console.log("PDFs:", this.pdfs)
        },
        onFilesSelected(event) {
            const archivos = Array.from(event.target.files || []);
            console.log('onFilesSelected', { total: archivos.length });

            // Reset slides
            this.slides = [];

            archivos.forEach((file, i) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let tipo = 'image';
                    if (file.type === 'application/pdf') tipo = 'pdf';
                    else if (file.type && file.type.startsWith('video/')) tipo = 'video';

                    this.slides.push({
                        url: e.target.result,
                        type: tipo,
                        fileType: file.type,
                        descripcion: ''
                    });

                    // After adding, initialize carousel safely
                    this.$nextTick(() => {
                        const el = document.getElementById('fotosCarrusel');
                        if (!el) {
                            console.warn('fotosCarrusel element not found after rendering');
                            return;
                        }
                        const Carousel = window.bootstrap && (window.bootstrap.Carousel || window.bootstrap.Carousel);
                        try {
                            if (Carousel) {
                                // Dispose previous instance if exists to force rebuild
                                if (typeof Carousel.getInstance === 'function') {
                                    const prev = Carousel.getInstance(el);
                                    if (prev && typeof prev.dispose === 'function') prev.dispose();
                                    const inst = new Carousel(el);
                                    if (typeof inst.to === 'function') inst.to(0);
                                } else if (typeof Carousel.getOrCreateInstance === 'function') {
                                    const inst = Carousel.getOrCreateInstance(el);
                                    if (typeof inst.to === 'function') inst.to(0);
                                } else {
                                    new Carousel(el);
                                }
                            } else {
                                console.warn('Bootstrap Carousel constructor not found on window.bootstrap');
                            }
                        } catch (err) {
                            console.error('Error initializing Bootstrap Carousel:', err);
                        }
                    });
                };
                reader.readAsDataURL(file);
            });
        },
        handleSubmit: async () =>{
            console.log("borrar")
        }
    },
    mounted() {
        this.cargarInmuebles();
        this.cargarZonas();
        this.cargarProvincias();
        this.cargarEstadosGenerales();
        this.cargarEstadosVenta();
        this.cargarEstadosAlquiler();
        this.cargarCalles();
         this.cargarAsesores();
        this.cargarCaptadoresInternos();
    }
}


</script>

<style scoped>
.preview-img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #ddd;
}

.preview-media {
    height: 350px;
    object-fit: contain;
    background: #f8f9fa;
    border-radius: 10px;
}
</style>
