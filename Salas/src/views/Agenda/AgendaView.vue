<template>
    <div>
        <NavComponent />
        <div class="px-3 form-group">
            <div class="row">
                <div class="col-md-2 mb-2 agenda_barra_lateral ">
                    <div>
                        <input class="form-control " type="date">
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-primary btn-sm w-100" type="button">
                            Ventas
                        </button>
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-primary btn-sm w-100" type="button">
                            Alquiler
                        </button>
                    </div>
                </div>
                <div class="col-md-10 mb-2 agenda_tabla">
                    <h6>Sector</h6>
                    <div class="tabla-scroll-container">
                        <table class="table table-striped table-hover table-sm">
                        <thead>
                            <tr>
                                <th>HORA</th>
                                <th>Asesor 1</th>
                                <th>Asesor 2</th>
                                <th>Asesor 3</th>
                                <th>Asesor 4</th>
                                <th>Asesor 5</th>
                                <th>Asesor 6</th>
                                <th>Asesor 7</th>
                                <th>Asesor 8</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>07:00</td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="modal" data-bs-target="#modalAgenda">Asesor 1</button></td>

                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 2</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 3</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 4</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 5</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 6</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 7</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 8</button></td>
                            </tr>
                            <tr>
                                <td>07:15</td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 1</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 2</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 3</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 4</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 5</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 6</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 7</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 8</button></td>
                            </tr>
                            <tr>
                                <td>07:30</td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 1</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 2</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 3</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 4</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 5</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 6</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 7</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 8</button></td>
                            </tr>
                            <tr>
                                <td>08:00</td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 1</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 2</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 3</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 4</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 5</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 6</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 7</button></td>
                                <td><button type="button" class="btn btn-primary btn-sm w-100">Asesor 8</button></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ModalAgenda></ModalAgenda>
</template>
<script>
import NavComponent from '../../components/NavComponent.vue'
import ModalAgenda from '../../components/Agenda/ModalAgenda.vue'
export default {
    components: {
        NavComponent,
        ModalAgenda
    }
}
</script>