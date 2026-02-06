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
                    <form action="" class=" form-group atcl_tabla_propietarios row">
                        <div class="col-md-12 ">
                            <label for="" class="form-label ">Agregar Propietarios</label>
                        </div>
                        <div class="col-md-6 p-1">
                            <input type="text" class="form-control form-control-sm" id="input-propietarios"
                                placeholder="Propietarios">
                        </div>
                        <div class="col-md-3 pt-1">
                            <button type="submit" class="btn btn-primary btn-sm w-100">Asignar Propietario</button>
                        </div>
                        <div class="col-md-3 pt-1">
                            <button type="button" class="btn btn-secondary btn-sm w-100" data-bs-toggle="modal"
                                data-bs-target="#modalCargaPersona">
                                Cargar Persona  
                            </button>
                        </div>
                    </form>
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
                                <tr>
                                    <td>Juan Manuel Perez</td>
                                    <td>
                                        <textarea class=" form-control text-center" 
                                        rows="1" 
                                        placeholder="Escribe una nota...">
                                        </textarea>
                                    </td>
                                    <td>No</td>
                                    <td>09/10/2022</td>
                                    <td>
                                        <button type="button" class="btn btn-danger btn-sm w-100">Eliminar</button>
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
export default {
    components: {
        ModalCargaPersona
    }
}

</script>