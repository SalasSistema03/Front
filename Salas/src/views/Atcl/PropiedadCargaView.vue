<template>
    <NavComponent titulo="Propiedad Carga"></NavComponent>
    <div class="px-3">
        <form class="row" autocomplete="off">
            <div class="col-md-6 row">
                <div class="form-group col-md-4 px-1">
                    <label for="input-calle" class="form-label">Calle</label>
                    <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle">
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

                <div class="form-group col-md-4 px-1">
                    <label for="input-piso" class="form-label">Inmueble</label>
                    <select name="inmueble" id="input-inmueble" class="form-select form-select-sm">
                        <option value="0">No</option>
                        <option value="1">Si</option>
                    </select>
                </div>
                <div class="form-group col-md-4 px-1">
                    <label for="input-numero-propiedad" class="form-label">Zona</label>
                    <select class="form-select form-select-sm" id="input-zona" name="input-zona">
                        <option value="0">Zona 1</option>
                        <option value="1">Zona 2</option>
                        <option value="2">Zona 3</option>
                    </select>
                </div>
                <div class="form-group col-md-4 px-1">
                    <label for="input-numero-propiedad" class="form-label">Provincia</label>
                    <select class="form-select form-select-sm" name="provincia" id="input-provincia">
                        <option value="0">Buenos Aires</option>
                        <option value="1">Córdoba</option>
                        <option value="2">Santa Fe</option>
                    </select>
                </div>

                <div class="form-group col-md-3 px-1">
                    <label for="input-llave" class="form-label">Llave</label>
                    <input type="number" class="form-control form-control-sm" id="input-llave" placeholder="Llave">
                </div>
                <div class="form-group col-md-9 px-1 pt-3">
                    <!-- <label for="input-observaciones" class="form-label"></label> -->
                    <textarea class="form-control form-control-sm" id="input-observaciones"
                        placeholder="Observaciones de Llaves">
                    </textarea>
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
                        placeholder="Observaciones de Cartel">
                    </textarea>
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

            </div>
            <div class="col-md-6 row">
                <!-- <div class="form-group col-md-12">
                    <label for="input-calle" class="form-label">Subir Fotos y Documentacion</label>
                    <input type="file" class="form-control form-select " id="fotos" name="fotos[]"
                        accept="image/*,application/pdf,video/*" multiple="">
                </div> -->


                <!-- tengo que adaptar este codigo para que ande con vue3 y bootstrap5 -->

                <div class="col-md-3 d-flex justify-content-center  ">
                    <div class="row g-1">
                        <!-- Campo para seleccionar múltiples fotos -->
                        <div class="col-md-12">
                            <label for="fotos" class="form-label ">Subir Fotos y Documentos</label>
                            <input type="file" class="form-control form-select " id="fotos" name="fotos[]"
                                accept="image/*,application/pdf,video/*" multiple @change="onFilesSelected">
                        </div>
                    </div>
                </div>

                <!-- esto no se muestra -->

                <div class="col-md-3">
                    <!-- Formulario de carga de varias fotos con detalles y previsualización dentro de un carrusel -->
                    <div class="container col-md-12">

                        <!-- Mensajes de depuración: indica si hay slides y miniaturas -->
                        <div v-if="!slides.length" class="text-muted small mb-2">No hay archivos cargados</div>
                        <div v-else class="mb-2 small">Archivos cargados: {{ slides.length }}</div>
                        <div class="d-flex gap-2 mb-2" v-if="slides.length">
                          <img v-for="(s,i) in slides" v-if="s.type==='image'" :key="i" :src="s.url" style="height:48px; width:auto; object-fit:cover; border:1px solid #ccc;" />
                          <div v-for="(s,i) in slides" v-if="s.type==='pdf'" :key="'pdf-'+i" class="small text-muted">PDF</div>
                          <div v-for="(s,i) in slides" v-if="s.type==='video'" :key="'vid-'+i" class="small text-muted">VIDEO</div>
                        </div>

                        <!-- Contenedor del Carrusel (oculto si no hay archivos) -->
                        <div id="fotosCarrusel" class="carousel slide h-50" data-bs-ride="carousel" v-if="slides.length">
                            <div class="carousel-inner " id="fotosDetalles">
                                <div class="carousel-item" :class="{ active: index === 0 }" v-for="(s, index) in slides" :key="index">
                                    <template v-if="s.type === 'image'">
                                        <img :src="s.url" class="d-block w-100" :alt="`Archivo ${index + 1}`" style="max-height:220px; object-fit:cover;" />
                                    </template>
                                    <template v-else-if="s.type === 'pdf'">
                                        <iframe :src="s.url" width="100%" height="220" style="border:none;"></iframe>
                                    </template>
                                    <template v-else-if="s.type === 'video'">
                                        <video class="d-block w-100" style="max-height:220px; object-fit:cover;" controls>
                                            <source :src="s.url" :type="s.fileType" />
                                            Tu navegador no soporta la etiqueta de video.
                                        </video>
                                    </template>

                                    <div class="carousel-caption d-none d-md-block">
                                        <textarea class="form-control" v-model="s.descripcion" rows="2" placeholder="Condición"></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- Controles del Carrusel -->
                            <button class="carousel-control-prev" type="button" data-bs-target="#fotosCarrusel"
                                data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#fotosCarrusel"
                                data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>

                    </div>


                </div>















            </div>
            <div class="col-md-12 row mt-4 d-flex justify-content-center">
                <button class="btn btn-primary w-50">Cargar Propiedad</button>
            </div>
        </form>
    </div>
    <ModalPropiedadComodidades></ModalPropiedadComodidades>
    <ModalPropiedadDescripcion></ModalPropiedadDescripcion>
    <ModalPropiedadVenta></ModalPropiedadVenta>
    <ModalPropiedadAlquiler></ModalPropiedadAlquiler>

</template>

<script>
import NavComponent from '../../components/NavComponent.vue'
import ModalPropiedadComodidades from '../../components/Atcl/Propiedad/ModalPropiedadComodidades.vue'
import ModalPropiedadDescripcion from '../../components/Atcl/Propiedad/ModalPropiedadDescripcion.vue'
import ModalPropiedadVenta from '../../components/Atcl/Propiedad/ModalPropiedadVenta.vue'
import ModalPropiedadAlquiler from '../../components/Atcl/Propiedad/ModalPropiedadAlquiler.vue'
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
            slides: []
        }
    },
    methods: {
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
        }
    }
}


</script>
