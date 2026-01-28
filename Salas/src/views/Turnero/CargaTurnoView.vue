<template>
    <NavComponent />
    <div class="conteiner">
        <div class="row p-2">
            <form action="" class="col-md-6">
                <div class="card text-center">
                    <div class="card-header turnero_card_header">
                        <h6>Turno</h6>
                    </div>
                    <div class="card-body">
                        <div class="form-group row">
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold" for="">Identificador</label>
                                <select class="form-select form-select-sm" id="">
                                    <option value="">Seleccione</option>
                                    <option value="">DNI</option>
                                    <option value="">Folio</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold" for="">Numero</label>
                                <input type="number" class="form-control form-control-sm" id="">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-semibold" for="">Sector</label>
                                <select class="form-select form-select-sm" id="">
                                    <option value="">Seleccione</option>
                                    <option value="">Sector 1</option>
                                    <option value="">Sector 2</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="submit" class="btn btn-primary btn-sm w-100">Cargar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import NavComponent from '../../components/NavComponent.vue'
</script>