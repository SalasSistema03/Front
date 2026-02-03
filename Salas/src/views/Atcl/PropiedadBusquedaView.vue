<template>
    <NavComponent titulo="Busqueda Propiedad"></NavComponent>
    <div class="px-3">
        <form class="row" autocomplete="off">
            <div class="col-md-6 row">
                <div class="form-group col-md-4 px-1">
                    <label for="input-calle" class="form-label">Calle</label>
                    <input type="text" class="form-control form-control-sm" id="input-calle" placeholder="Calle">
                </div>
            </div>
        </form>
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