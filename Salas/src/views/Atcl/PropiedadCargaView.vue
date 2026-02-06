<template>
    <NavComponent titulo="Propiedad Carga"></NavComponent>
    <div class="px-3">
        <form @submit.prevent="handleSubmit" class="row d-flex align-items-start px-3" autocomplete="off" novalidate>
            <div class="col-md-6 row">
                <div class="form-group col-md-4 px-1">
                    <label for="input-calle" class="form-label">Calle</label>
                    <div class="position-relative">
                        <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle"
                            v-model="formData.calleSeleccionada" @input="filtrarCalles"
                            @focus="mostrarSugerencias = true" @blur="ocultarSugerencias">

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

                <div class="form-group col-md-2 px-1">
                    <label for="input-altura" class="form-label">Altura</label>
                    <input type="number" class="form-control form-control-sm" id="input-altura" placeholder="Altura"
                        v-model="formData.altura">
                </div>

                <div class="form-group col-md-2 px-1">
                    <label for="input-ph" class="form-label">PH</label>
                    <select name="input-ph" id="input-ph" class="form-select form-select-sm" v-model="formData.ph">
                        <option value="NO">No</option>
                        <option value="SI">Si</option>
                    </select>
                </div>

                <div class="form-group col-md-2 px-1">
                    <label for="input-piso" class="form-label">Piso</label>
                    <input type="number" class="form-control form-control-sm" id="input-piso" placeholder="Piso"
                        v-model="formData.piso">
                </div>

                <div class="form-group col-md-2 px-1">
                    <label for="input-dto" class="form-label">Dto</label>
                    <input type="text" class="form-control form-control-sm" id="input-dto" placeholder="Dto"
                        v-model="formData.dto">
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-inmueble" class="form-label">Inmueble</label>
                    <select class="form-select form-select-sm" id="input-inmueble" v-model="formData.inmueble_id">
                        <option value="">Seleccione</option>
                        <option v-for="inmueble in inmuebles" :key="inmueble.id" :value="inmueble.id">
                            {{ inmueble.inmueble }}
                        </option>
                    </select>
                </div>

                <div class="form-group col-md-4 px-1">
                    <label for="input-zona" class="form-label">Zona</label>
                    <select class="form-select form-select-sm" id="input-zona" name="input-zona"
                        v-model="formData.zona_id">
                        <option value="">Seleccione</option>
                        <option v-for="zona in zonas" :key="zona.id" :value="zona.id">
                            {{ zona.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group col-md-5 px-1">
                    <label for="input-provincia" class="form-label">Provincia</label>
                    <select class="form-select form-select-sm" name="provincia" id="input-provincia"
                        v-model="formData.provincia_id">
                        <option value="">Seleccione</option>
                        <option v-for="provincia in provincias" :key="provincia.id" :value="provincia.id">
                            {{ provincia.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-llave" class="form-label">Llave</label>
                    <input type="number" class="form-control form-control-sm" id="input-llave" placeholder="Llave"
                        v-model="formData.llave">
                </div>

                <div class="form-group col-md-9 px-1 pt-3">
                    <textarea class="form-control form-control-sm" id="input-observaciones"
                        placeholder="Observaciones de Llaves" v-model="formData.observaciones_llaves"></textarea>
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-cartel" class="form-label">Cartel</label>
                    <select class="form-select form-select-sm" name="cartel" id="input-cartel"
                        v-model="formData.cartel">
                        <option value="SI">Si</option>
                        <option value="NO">No</option>
                    </select>
                </div>

                <div class="form-group col-md-9 px-1 pt-3">
                    <textarea class="form-control form-control-sm" id="input-observaciones-cartel"
                        placeholder="Observaciones de Cartel" v-model="formData.observaciones_cartel"></textarea>
                </div>

                <div class="form-group col-md-6 px-1 pt-2">
                    <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalComodidades">
                        Comodidades
                    </button>
                </div>

                <div class="form-group col-md-6 px-1 pt-2">
                    <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal"
                        data-bs-target="#modalDescripcion">
                        Descripción
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
                    <button type="submit" class="btn btn-primary w-50" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Cargando...' : 'Cargar Propiedad' }}
                    </button>
                </div>
            </div>

            <div class="col-md-6 row">
                <!-- INPUT -->
                <div class="form-group col-md-12">
                    <label class="form-label">Subir Archivos</label>
                    <input type="file" multiple class="form-control form-control-sm"
                        accept="image/jpg,image/jpeg,video/mov,video/mp4,video/MOV,application/pdf"
                        @change="handleFiles" ref="fileInput" />
                </div>

                <!-- PREVISUALIZACIÓN CON TABS -->
                <div class="col-md-12 mt-2" v-if="hasFiles">
                    <div class="card text-center">
                        <div class="card-header">
                            <ul class="nav nav-tabs card-header-tabs">
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
                        <div class="card-body">
                            <!-- ===================== -->
                            <!-- 📷 CARRUSEL IMÁGENES -->
                            <!-- ===================== -->
                            <div v-if="activeTab === 'images' && images.length">
                                <div id="carouselImages" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        <div v-for="(img, index) in images" :key="index" class="carousel-item"
                                            :class="{ active: index === 0 }">
                                            <img :src="img.url"
                                                class="d-block w-100 preview-media atcl_cargar_multimedia_tamaño" />
                                            <input class="form-control mt-2"
                                                placeholder="Comentario para esta imagen..." v-model="img.comment" />
                                        </div>
                                    </div>
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
                                            <input class="form-control mt-2" placeholder="Comentario para este video..."
                                                v-model="vid.comment" />
                                        </div>
                                    </div>
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
                                            <input class="form-control mt-2" placeholder="Comentario para este PDF..."
                                                v-model="pdf.comment" />
                                        </div>
                                    </div>
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
            <ModalPropiedadComodidades :estados-generales="estadosGenerales"
                @update:comodidades="formData.comodidades = $event"></ModalPropiedadComodidades>

            <ModalPropiedadDescripcion @update:descripcion="formData.descripcion = $event"></ModalPropiedadDescripcion>

            <ModalPropiedadVenta :estados-venta="estadosVenta" :captadores-internos="captadoresInternos"
                :asesores="asesores" @update:venta="formData.venta = $event"></ModalPropiedadVenta>

            <ModalPropiedadAlquiler :estados-alquiler="estadosAlquiler" @update:alquiler="formData.alquiler = $event">
            </ModalPropiedadAlquiler>

            <ModalCondicionAlquiler @update:condicion_alquiler="formData.condicion_alquiler = $event">
            </ModalCondicionAlquiler>





        </form>
    </div>


</template>

<script>
import NavComponent from '../../components/NavComponent.vue'
import { getUser } from '../../Services/api/Usuario/userApi'
import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
import ModalCondicionAlquiler from '../../components/Atcl/Propiedad/ModalCondicionAlquiler.vue'
import {
    getInmueble,
    getZonas,
    getProvincias,
    getEstadoGeneral,
    getEstadoVenta,
    getEstadoAlquiler,
    getCalles,
    getAsesor,
    getCaptadorInterno,
    guardarPropiedad
} from '../../Services/api/Atcl/AtclApi'
import Swal from 'sweetalert2'
import { useToast } from '../../composables/useToast'

export default {
    components: {
        NavComponent,
        ModalPropiedadComodidades,
        ModalPropiedadDescripcion,
        ModalPropiedadVenta,
        ModalPropiedadAlquiler,
        ModalCondicionAlquiler
    },
    setup() {
        const { showWarning, showError } = useToast()
        return { showWarning, showError }
    },
    data() {
        return {
            // Datos del formulario principal
            formData: {
                calleSeleccionada: '',
                calle_id: null,
                altura: '',
                ph: '0',
                piso: '',
                dto: '',
                inmueble_id: '',
                zona_id: '',
                provincia_id: '',
                llave: '',
                observaciones_llaves: '',
                cartel: '1',
                observaciones_cartel: '',
                comodidades: {},
                descripcion: {},
                venta: {},
                alquiler: {},
                condicion_alquiler: {}
            },

            // Catálogos
            inmuebles: [],
            zonas: [],
            provincias: [],
            estadosGenerales: [],
            estadosVenta: [],
            estadosAlquiler: [],
            calles: [],
            asesores: [],
            captadoresInternos: [],

            // Autocompletado de calles
            callesFiltradas: [],
            mostrarSugerencias: false,

            // Archivos multimedia
            images: [],
            videos: [],
            pdfs: [],
            activeTab: 'images',

            // Estado del formulario
            isSubmitting: false
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
            } catch (error) {
                console.error('Error cargando inmuebles:', error);
            }
        },
        async cargarZonas() {
            try {
                const response = await getZonas();
                this.zonas = response.data;
            } catch (error) {
                console.error('Error cargando zonas:', error);
            }
        },
        async cargarProvincias() {
            try {
                const response = await getProvincias();
                this.provincias = response.data;
            } catch (error) {
                console.error('Error cargando provincias:', error);
            }
        },
        async cargarEstadosGenerales() {
            try {
                const response = await getEstadoGeneral();
                this.estadosGenerales = response.data;
            } catch (error) {
                console.error('Error cargando estados generales:', error);
            }
        },
        async cargarEstadosVenta() {
            try {
                const response = await getEstadoVenta();
                this.estadosVenta = response.data;
            } catch (error) {
                console.error('Error cargando estados venta:', error);
            }
        },
        async cargarAsesores() {
            try {
                const response = await getAsesor();
                this.asesores = response.data.original || response.data;
            } catch (error) {
                console.error('Error cargando asesores:', error);
            }
        },
        async cargarCaptadoresInternos() {
            try {
                const response = await getCaptadorInterno();
                this.captadoresInternos = response.data.original || response.data;
            } catch (error) {
                console.error('Error cargando captadores internos:', error);
            }
        },
        async cargarEstadosAlquiler() {
            try {
                const response = await getEstadoAlquiler();
                this.estadosAlquiler = response.data;
            } catch (error) {
                console.error('Error cargando estados alquiler:', error);
            }
        },
        async cargarCalles() {
            try {
                const response = await getCalles();
                this.calles = response.data;
            } catch (error) {
                console.error('Error cargando calles:', error);
            }
        },

        // Autocompletado de calles
        filtrarCalles() {
            const texto = this.formData.calleSeleccionada.toLowerCase();
            if (texto.length === 0) {
                this.callesFiltradas = [];
                return;
            }

            this.callesFiltradas = this.calles.filter(calle =>
                calle.name.toLowerCase().includes(texto)
            ).slice(0, 10);
        },
        seleccionarCalle(calle) {
            this.formData.calleSeleccionada = calle.name;
            this.formData.calle_id = calle.id;
            this.mostrarSugerencias = false;
            this.callesFiltradas = [];
        },
        ocultarSugerencias() {
            setTimeout(() => {
                this.mostrarSugerencias = false;
            }, 200);
        },

        // Manejo de archivos
        handleFiles(event) {
            const files = Array.from(event.target.files)
            const allowedTypes = ["image/jpg", "image/jpeg", "application/pdf", "video/mp4", "video/mov"];
            
            const hasInvalidFiles = files.some(file => !allowedTypes.includes(file.type));

            if (hasInvalidFiles) {
                this.showWarning('Uno o más archivos no tienen un formato permitido (Solo JPG, JPEG, PDF, MP4 o MOV).');
                event.target.value = '';
                return;
            }

            // Limpiar previews anteriores
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

            // Establecer el tab activo
            if (this.images.length > 0) {
                this.activeTab = 'images'
            } else if (this.videos.length > 0) {
                this.activeTab = 'videos'
            } else if (this.pdfs.length > 0) {
                this.activeTab = 'pdfs'
            }
        },

        // Enviar formulario
        async handleSubmit() {
          /*   // Validación básica
            if (!this.formData.calleSeleccionada) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Por favor selecciona una calle'
                });
                return;
            }

            if (!this.formData.inmueble_id) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campo requerido',
                    text: 'Por favor selecciona un tipo de inmueble'
                });
                return;
            } */

            this.isSubmitting = true;

            try {
                // Crear FormData para enviar archivos
                const formDataToSend = new FormData();
                

                // Agregar campos del formulario (excluyendo calleSeleccionada)
                Object.keys(this.formData).forEach(key => {
                    if (key === 'calleSeleccionada') {
                        return; // No enviar este campo
                    }
                    if (typeof this.formData[key] === 'object' && this.formData[key] !== null) {
                        // Para objetos (comodidades, descripcion, venta, alquiler)
                        formDataToSend.append(key, JSON.stringify(this.formData[key]));
                    } else {
                        formDataToSend.append(key, this.formData[key] || '');
                    }
                });

                // Agregar imágenes
                this.images.forEach((img, index) => {
                    formDataToSend.append(`images[${index}]`, img.file);
                    formDataToSend.append(`images_comments[${index}]`, img.comment);
                });

                // Agregar videos
                this.videos.forEach((vid, index) => {
                    formDataToSend.append(`videos[${index}]`, vid.file);
                    formDataToSend.append(`videos_comments[${index}]`, vid.comment);
                });

                // Agregar PDFs
                this.pdfs.forEach((pdf, index) => {
                    formDataToSend.append(`pdfs[${index}]`, pdf.file);
                    formDataToSend.append(`pdfs_comments[${index}]`, pdf.comment);
                });

                // Enviar a la API
                // El ID puede ser 0 para nueva propiedad o un ID específico para editar
                //const propiedadId = this.$route.params.id || 0;


                const id_usuario = await getUser( localStorage.getItem('token') )
                /* console.log('aaaaaaaaaaaa',id_usuario.data.id); */
                const response = await guardarPropiedad(id_usuario.data.id, formDataToSend);

                if (response.data.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: response.data.message,
                        timer: 2000
                    });

                    // Limpiar formulario
                    /* this.resetForm(); */
                }
            } catch (error) {
                /* console.error('Error al guardar propiedad:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Ocurrió un error al guardar la propiedad'
                }); */
               
                 this.showError(error.response?.data?.message || 'Ocurrió un error al guardar la propiedad'); 
                
               
            } finally {
                this.isSubmitting = false;
            }
        },

        // Resetear formulario
        /* resetForm() {
            this.formData = {
                calleSeleccionada: '',
                calle_id: null,
                altura: '',
                ph: '0',
                piso: '',
                dto: '',
                inmueble_id: '',
                zona_id: '',
                provincia_id: '',
                llave: '',
                observaciones_llaves: '',
                cartel: '1',
                observaciones_cartel: '',
                comodidades: {},
                descripcion: {},
                venta: {},
                alquiler: {},
                condicion_alquiler: {}
            };

            this.images = [];
            this.videos = [];
            this.pdfs = [];

            // Limpiar input de archivos
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        } */
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

.cursor-pointer {
    cursor: pointer;
}

.hover\:bg-light:hover {
    background-color: #f8f9fa !important;
}
</style>