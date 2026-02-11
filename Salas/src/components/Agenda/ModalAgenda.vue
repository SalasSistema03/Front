<template>


    <!-- Modal -->
    <div class="modal fade" id="modalAgenda" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="modalAgendaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header pb-1">
                    <h1 class="modal-title fs-5" id="modalAgendaLabel">Agenda</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body agenda_modal pt-1 pb-3">
                    <form class="row form-group ">
                        <div class="col-md-3">
                            <label for="">Usuario</label>
                            <input type="text" class="form-control" readonly value="Asesor 1">
                        </div>
                        <div class="col-md-3">
                            <label for="">Fecha</label>
                            <input type="date" class="form-control" readonly>
                        </div>
                        <div class="col-md-3">
                            <label for="">H. Inicio</label>
                            <input type="text" class="form-control" readonly value="07:00">
                        </div>
                        <div class="col-md-3">
                            <label for="">H. Fin</label>
                            <input type="text" class="form-control" readonly value="07:15">
                        </div>
                        <div>
                            <label for="">Descripcion</label>
                            <textarea name="descripcion" id="descripcion" class="form-control" readonly rows="2"
                                placeholder="Escribe una nota..."></textarea>
                        </div>
                        <div class="col-md-5">
                            <label for="">Busca Propiedad por</label>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Codigo</option>
                                <option value="1">Calle</option>

                            </select>
                        </div>
                        <div class="col-md-7">
                            <label for="">Codigo</label>
                            <input type="number" class="form-control" readonly value="123456">
                        </div>
                        <div class="col-md-7">
                            <label for="">Calle</label>
                            <input type="text" class="form-control" readonly value="Calle Falsa">
                        </div>

                        <div class="col-md-7">
                            <label for="">Nombre Cliente</label>
                            <input type="text" class="form-control" readonly value="Juan Pérez">
                        </div>
                        <div class="col-md-5">
                            <label for="">Telefono</label>
                            <input type="text" class="form-control" readonly value="123456789">
                        </div>



                    </form>
                </div>
                <div class=" d-flex justify-content-end pb-1">
                    <div class="col-md-3 px-1">
                        <button type="button" class="btn btn-secondary btn-sm w-100"
                            data-bs-dismiss="modal">Cerrar</button>
                    </div>
                    <div class="col-md-3 px-1">
                        <button type="button" class="btn btn-primary btn-sm w-100">Guardar</button>
                    </div>
                    <div class="col-md-3 px-1">
                        <button type="button" class="btn btn-danger btn-sm w-100">Borrar</button>
                    </div>

                </div>
                <div >
                    <table class="table table-striped agenda_tabla_general">
                        <thead>
                            <tr class="agenda_titulo_tabla_modal text-center">
                                <th>Fecha</th>
                                <th>Inmueble</th>
                                <th>Asesor</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody class="agenda_cuerpo_tabla_modal text-center">
                            <tr>
                                <td>2024-06-01 09:00Hs</td>
                                <td>Aristobulo del Valle 9100 A</td>
                                <td>1000</td>
                                <td>
                                    Activo
                                </td>
                            </tr>
                            <tr>
                                <td>2024-06-01 09:00Hs</td>
                                <td>Aristobulo del Valle 9100 A</td>
                                <td>1000</td>
                                <td>
                                    Activo
                                </td>
                            </tr>
                            <tr>
                                <td>2024-06-01 09:00Hs</td>
                                <td>Aristobulo del Valle 9100 A</td>
                                <td>1000</td>
                                <td>
                                    Activo
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>