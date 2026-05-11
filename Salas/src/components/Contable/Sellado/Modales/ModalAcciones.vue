<template>
    <BaseModal :show="estaAbierto" size="md" @close="$emit('cerrarModalAcciones')">

        <template #title>Acciones</template>

        <template #body>
            <div class="row d-flex justify-content-center">
                <div class="col-12 col-md-6">
                    <button class="btn btn-primary" :disabled="cargando || registros.length === 0"
                        @click="prepararTextoYExportar">
                        <span v-if="cargando">Cargando...</span>
                        <span v-else>Exportar ({{ registros.length }} registros)</span>
                    </button>
                </div>
                <div class="col-12 col-md-6">
                    <button class="btn btn-danger" @click="eliminarRegistro()">
                        <span>Eliminar Registros</span>
                    </button>
                </div>

            </div>
        </template>

        <template #footer>
        </template>
    </BaseModal>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from '../../../base/BaseModal.vue';
import { exportarRegistrosService , eliminarRegistroService } from '../../../../Services/api/Contable/selladoApi.js'
import { alertas } from '../../../../utils/alertas.js'

const registros = ref([]);
const cargando = ref(false);

defineProps({
    estaAbierto: Boolean
});
const emit = defineEmits(['cerrarModalAcciones', 'recargarTablaDatos']);

onMounted(() => {
    obtenerRegistros();
});


const obtenerRegistros = async () => {
    cargando.value = true;
    try {
        const response = await exportarRegistrosService();
        console.log("holaaaa",response.data.registros)
        // Verifica si tu API devuelve los datos en .data o .data.data
        registros.value = response.data.registros;
    } catch (err) {
        alertas.error('Error De conexion ' + (err.response?.data?.message || err.message));
        //alert("Error al obtener registros: " + (err.response?.data?.message || err.message));
    } finally {
        cargando.value = false;
    }
};


const prepararTextoYExportar = () => {
    if (registros.value.length === 0) {
        alertas.error("No hay datos para exportar");
        return;
    }

    // 1. Definimos los encabezados
    const encabezados = [
        "Folio", "Nombre", "Informe", "Fecha Inicio", "Tipo Contrato",
        "Monto Vivienda", "Monto Comercio", "Hojas",
        "Fecha Carga", "Inq/Prop"
    ];

    // 2. Procesamos las filas
    const filas = registros.value.map(reg => {
        return [
            reg.folio,
            // Reemplazamos cualquier punto y coma interno para no romper las columnas
            (reg.nombre || "").toString().replace(/;/g, ","), 
            reg.informe,
            reg.fecha_Inicio,
            reg.tipo_Contrato,
            // Usamos punto decimal para que Excel lo tome como número
            reg.monto_Vivienda ?? 0,
            reg.monto_Comercial ?? 0,
            reg.hojas,
            reg.fecha_Carga,
            reg.inq_Prop
        ].join(";");
    });

    // 3. EL TRUCO: Agregamos "sep=;" al inicio para que Excel sepa separar las columnas
    // Y el prefijo \ufeff para que reconozca los acentos (UTF-8)
    const contenido = "sep=;\n" + encabezados.join(";") + "\n" + filas.join("\n");

    // 4. Creamos el Blob con codificación UTF-8
    const blob = new Blob(["\ufeff" + contenido], { 
        type: "text/csv;charset=utf-8;" 
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `reporte_sellado.csv`;
    link.click();

    URL.revokeObjectURL(url);
};




const eliminarRegistro = async () => {
    // 1. Esperamos la respuesta del usuario
    const result = await alertas.confirmar(
        '¿Desea eliminar todos los registros?',
        'Se borrarán permanentemente de la base de datos.'
    );

    // 2. Si el usuario hizo clic en "Sí, eliminar"
    if (result.isConfirmed) {
        try {
            // AQUÍ VA TU LÓGICA REAL (Ej: llamada a axios / api)
            // await api.delete(`/registros/${id}`);

            // 3. Mostrás el éxito
           const resultado = await eliminarRegistroService();
           if (resultado.status === 200) {
               alertas.success('¡Eliminado!', 'Los registros fueron eliminados correctamente.');
               obtenerRegistros();
               //estaAbierto = false;
               emit('cerrarModalAcciones');
               emit('recargarTablaDatos');
           }

        } catch (error) {
            alertas.error('Error', 'No se pudo eliminar el registro.');
        }
    } else {
        // Opcional: El usuario canceló
        console.log('Eliminación cancelada');
    }
};
</script>