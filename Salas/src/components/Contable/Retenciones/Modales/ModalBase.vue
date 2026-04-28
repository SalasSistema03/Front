<template>
    <BaseModal :show="modaleBase" size="md" @close="$emit('cerrarModalBase')">

        <template #title>Base y Porcentuale</template>

        <template #body>
            <form action="" autocomplete="off">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <label class="form-label small mb-1" for="modal_base">Base</label>
                        <input type="number" class="form-control" id="modal_base">
                        <div id="baseHelp" class="form-text">Es la base mínima para calcular la retención
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-label small mb-1"  for="modal_porcentual">Porcentual</label>
                        <input type="number" class="form-control" id="modal_porcentual" >
                        <div id="porcentualHelp" class="form-text">Es el porcentual que aplica para la
                            retención
                        </div>
                    </div>

                </div>
            </form>
        </template>


        <template #footer>
            <button id="modal_boton_b_p_calculo" type="submit" class="btn btn-primary">Guardar</button>
        </template>
    </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue';

defineProps({
    modaleBase: Boolean
});
const emit = defineEmits(['cerrarModalBase']);
</script>