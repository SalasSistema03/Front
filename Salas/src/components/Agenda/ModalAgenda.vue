<template>


<!-- Modal -->
<div class="modal fade" id="modalAgenda" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalAgendaLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="modalAgendaLabel">Agenda</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body agenda_modal">
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
                <textarea name="descripcion" id="descripcion" class="form-control" readonly rows="2" placeholder="Escribe una nota..."></textarea>
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
            <!-- <div class="col-md-7">
                <label for="">Calle</label>
                <input type="text" class="form-control" readonly value="Calle Falsa">
            </div> -->

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
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>

</template>