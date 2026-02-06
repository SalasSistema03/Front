<template>
    <NavComponent titulo="Busqueda Propiedad"></NavComponent>
    <div>
        <div class="px-3 pb-3 atcl_contenedor_busqueda_propiedad">
            <form class="row" autocomplete="off">

                <div class="form-group col-md-2 px-1">
                    <label for="input-tipo" class="form-label">Busqueda</label>
                    <select name="busqueda" class="form-select form-select-sm">
                        <option value="0">-Seleccione-</option>
                        <option value="1">Venta</option>
                        <option value="2">Alquiler</option>
                    </select>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-codigo" class="form-label">Codigo</label>
                    <input type="number" class="form-control form-control-sm" placeholder="N°">
                </div>
                <div class="form-group col-md-3 px-1">
                    <label for="input-calle" class="form-label">Calle</label>
                    <input type="text" class="form-control form-control-sm" placeholder="Calle">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-Inmueble" class="form-label">Tipo Inmueble</label>
                    <select name="tipoInmueble" id="input-Inmueble" class="form-select form-select-sm">
                        <option value="0">-Seleccione-</option>
                        <option value="1">Casa</option>
                        <option value="2">Departamento</option>
                    </select>
                </div>
                <div class="form-group col-md-1 px-1">
                    <label for="input-numero-propiedad" class="form-label">Cochera</label>
                    <select class="form-select form-select-sm">
                        <option value="0">-</option>
                        <option value="1">Si</option>
                        <option value="2">No</option>
                    </select>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-habitaciones" class="form-label">Habitaciones</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Habitaciones">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-zona" class="form-label">Zona</label>
                    <select name="zona" id="input-zona" class="form-select form-select-sm">
                        <option value="0">-Seleccione-</option>
                        <option value="1">Norte</option>
                        <option value="2">Sur</option>
                        <option value="3">Este</option>
                        <option value="4">Oeste</option>
                    </select>
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-desde" class="form-label">$desde</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Inicio">
                </div>
                <div class="form-group col-md-2 px-1">
                    <label for="input-hasta" class="form-label">$hasta</label>
                    <input type="number" class="form-control form-control-sm" placeholder="Tope">
                </div>
                <div class="form-group col-md-2 px-1 align-self-end">
                    <label for="">Ordenar por</label>
                    <select name="ordenarPor" id="input-ordenarPor" class="form-select form-select-sm">
                        <option value="0">-Seleccione-</option>
                        <option value="1">Precio</option>
                        <option value="2">Fecha</option>
                    </select>
                </div>
                <div class="form-group col-md-1 px-1 align-self-end">
                    <button type="submit" class="btn btn-primary btn-sm w-100">Filtrar</button>
                </div>
                <div class="form-group col-md-1 px-1 align-self-end">
                    <button type="reset" class="btn btn-secondary btn-sm w-100">Limpiar</button>
                </div>
                <div class="form-group col-1 mt-3">
                    <div class="form-check form-switch mt-3">
                        <input class="form-check-input mt-2" type="checkbox" value="" id="" />
                        <label class="form-check-label" for=""> Ampliar </label>
                    </div>
                </div>

            </form>
        </div>
        <div class="table-responsive atcl_contenedor_tabla px-3 pt-1">
            <table class="table table-striped table-hover atcl_tabla_busqueda_propiedad">
                <thead>
                    <tr>
                        <th>C.V</th>
                        <th>C.A</th>
                        <th>Direccion</th>
                        <th>Zona</th>
                        <th>Inmueble</th>
                        <th>Dorm.</th>
                        <th>Baños</th>
                        <th>Cochera</th>
                        <th>Mascotas</th>
                        <th>P. Alquiler</th>
                        <th>P. Venta</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody class="">
                    <tr>
                        <td>1</td>
                        <td>10</td>
                        <td>Calle Falsa</td>
                        <td>Centro</td>
                        <td>Departamento</td>
                        <td>2</td>
                        <td>1</td>
                        <td>Si</td>
                        <td>Si</td>
                        <td>1</td>
                        <td>2</td>
                        <td><button class = "btn btn-primary btn-sm w-100">Ver</button></td>

                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import NavComponent from '../../components/NavComponent.vue'
export default {
    components: {
        NavComponent
    }
}

</script>