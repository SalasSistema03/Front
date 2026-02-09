<template>
    <div class="modal fade" id="modalPropietarios" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalVideosLabel" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen-xxl-down atcl_foto_modal_high px-3">
            <div class=" modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalVideosLabel">Editar Propietarios</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body ">
                    <div class=" form-group atcl_tabla_propietarios row">
                        <!-- <div class="col-md-12 ">
                            <label for="" class="form-label ">Agregar Propietarios</label>
                        </div> -->
                        <div class="col-md-6 p-1 position-relative">
                            <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                placeholder="Buscar por apellido o DNI..." v-model="busqueda" @input="buscar">
                            
                            <!-- Sugerencias de búsqueda -->
                            <ul v-if="sugerencias.length > 0" class="list-group position-absolute w-100 shadow-sm sugerencias-lista" style="z-index: 1000; max-height: 200px; overflow-y: auto;">
                                <li v-for="persona in sugerencias" :key="persona.id" 
                                    class="list-group-item list-group-item-action cursor-pointer py-1 small"
                                    @click="seleccionarPersona(persona)">
                                    {{ persona.apellido }}, {{ persona.nombre }} - {{ persona.documento || 'Sin DNI' }}
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-3 pt-1">
                            <button type="button" class="btn btn-primary btn-sm w-100" @click="asignarPropietario">Asignar Propietario</button>
                        </div>
                        <div class="col-md-3 pt-1">
                            <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                                data-bs-target="#modalCargaPersona">
                                Cargar Persona  
                            </button>
                        </div>
                    </div>
                    <hr>

                    <div class="table-responsive atcl_contenedor_tabla px-3 pt-3">
                        <table class="table table-striped table-hover atcl_tabla_busqueda_propiedad">
                            <thead>
                                <tr>
                                    <th>Nombre y Apellido</th>
                                    <th>Motivo</th>
                                    <th>Baja</th>
                                    <th>Fecha</th>
                                    <th>-</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in propietarios" :key="index">
                                    <td>{{ item.persona.apellido }}, {{ item.persona.nombre }}</td>
                                    <td>
                                        <textarea class=" form-control text-center" 
                                        rows="1" 
                                        placeholder="Escribe una nota..."
                                        v-model="item.persona.notes"
                                        @input="emitirCambios" disabled>
                                        </textarea>
                                    </td>
                                    <td>{{ item.baja ? 'Si' : 'No' }}</td>
                                    <!-- quiero que la fecha de nacimiento se muestre en formato dd/MM/yyyy -->
                                    <td>{{ item.persona.fecha_nacimiento }}</td>
                                    <td>
                                        <button type="button" class="btn btn-danger btn-sm w-50" @click="eliminarPropietario(index)">Quitar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>



                </div>
            </div>
        </div>
    </div>
    <ModalCargaPersona></ModalCargaPersona>
</template>

<script>
import ModalCargaPersona from './ModalCargaPersona.vue'
import { buscaPersona } from '../../../Services/api/Atcl/AtclApi'

export default {
    components: {
        ModalCargaPersona
    },
    data() {
        return {
            busqueda: '',
            sugerencias: [],
            personaSeleccionada: null,
            timeout: null,
            propietarios: []
        }
    },
    methods: {
        
        buscar() {
            clearTimeout(this.timeout);
            
            if (this.busqueda.length < 3) {
                this.sugerencias = [];
                return;
            }

            this.timeout = setTimeout(async () => {
                try {
                    // Determinar si la búsqueda es DNI (numérico) o Apellido
                    const params = isNaN(this.busqueda) 
                        ? { apellido: this.busqueda } 
                        : { dni: this.busqueda };

                    const response = await buscaPersona(params);
                    this.sugerencias = response.data;
                } catch (error) {
                    console.error('Error al buscar persona:', error);
                }
            }, 300);
        },
        seleccionarPersona(persona) {
            this.personaSeleccionada = persona;
            console.log(this.personaSeleccionada);
            this.busqueda = `${persona.apellido}, ${persona.nombre} - ${persona.documento}`;
            this.sugerencias = [];
        },
        asignarPropietario() {
            if (!this.personaSeleccionada) return;

            // Evitar duplicados
            const existe = this.propietarios.some(p => p.persona.id === this.personaSeleccionada.id);
            if (existe) {
                alert('Esta persona ya está asignada como propietario');
                return;
            }

            const nuevoPropietario = {
                persona: { ...this.personaSeleccionada },
                motivo: '',
                baja: false,
                fecha: new Date().toLocaleDateString('es-AR')
            };

            this.propietarios.push(nuevoPropietario);
            
            // Limpiar búsqueda
            this.busqueda = '';
            this.personaSeleccionada = null;
            
            this.emitirCambios();
        },
        eliminarPropietario(index) {
            this.propietarios.splice(index, 1);
            this.emitirCambios();
        },
        emitirCambios() {
            this.$emit('update:propietario', [...this.propietarios]);
        }
    }
}

</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
.sugerencias-lista {
    top: 100%;
    left: 0;
}
</style>