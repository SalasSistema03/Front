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
import { getRegistrosService, eliminarRegistroService } from '../../../../Services/api/Contable/selladoApi.js'
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
        const response = await getRegistrosService();
        console.log(response.data.data.registros);
        // Verifica si tu API devuelve los datos en .data o .data.data
        registros.value = response.data.data.registros || response.data;
    } catch (err) {
        alertas.error('Error De conexion ' + (err.response?.data?.message || err.message));
        //alert("Error al obtener registros: " + (err.response?.data?.message || err.message));
    } finally {
        cargando.value = false;
    }
};

/* const prepararTextoYExportar = () => {
    if (registros.value.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    // Convertimos el array de objetos a un string legible
    // Ejemplo: "ID: 1 - Nombre: Registro A \n ID: 2 - Nombre: Registro B"
    const contenidoTexto = registros.value.map(reg => {
        // Aquí personalizas qué campos quieres ver. Ejemplo:
        return `${reg.folio} ; ${reg.infrome} ; ${reg.fecha_inicio} ; ${reg.tipo_contrato} ; ${reg.monto_alquiler_vivienda} ; ${reg.monto_alquiler_comercio} ; ${reg.hojas} ; ${reg.fecha_carga} ; ${reg.inq_prop} `;
    }).join('\n'); // El .join('\n') añade un salto de línea entre cada registro

    // Llamamos a tu función original con el texto procesado
    exportarArchivo(contenidoTexto, 'reporte_registros.txt');
}; */

const prepararTextoYExportar = () => {
    if (registros.value.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    // Encabezados (primera fila)
    const encabezados = [
        "Folio",
        "Informe",
        "Fecha Inicio",
        "Tipo Contrato",
        "Monto Vivienda",
        "Monto Comercio",
        "Hojas",
        "Fecha Carga",
        "Inq/Prop"
    ];

    // Convertimos los registros en filas separadas por ;
    const filas = registros.value.map(reg => [
        reg.folio,
        reg.informe, // corregido
        reg.fecha_inicio,
        reg.tipo_contrato,
        reg.monto_alquiler_vivienda ?? 0,
        reg.monto_alquiler_comercio ?? 0,
        reg.hojas,
        reg.fecha_carga,
        reg.inq_prop
    ].join(";")
    );

    // Unimos todo
    const contenido = [encabezados.join(";"), ...filas].join("\n");

    // Creamos Blob tipo CSV
    const blob = new Blob([contenido], { 
        type: "text/csv;charset=utf-8;" 
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "reporte_registros.csv";
    link.click();

    URL.revokeObjectURL(url);
};

const exportarArchivo = (texto, nombreArchivo) => {
    // 1. Creamos el Blob con el contenido y el tipo de archivo
    const blob = new Blob([texto], { type: 'text/plain' });

    // 2. Creamos una URL temporal para ese objeto
    const url = window.URL.createObjectURL(blob);

    // 3. Creamos un elemento <a> invisible
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;

    // 4. Simulamos el clic y limpiamos
    link.click();
    window.URL.revokeObjectURL(url);
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