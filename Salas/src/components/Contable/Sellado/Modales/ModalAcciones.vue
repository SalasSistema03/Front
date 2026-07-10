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
import { exportarRegistrosService, eliminarRegistroService } from '../../../../Services/api/Contable/selladoApi.js'
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
        console.log("holaaaa", response.data.registros)
        // Verifica si tu API devuelve los datos en .data o .data.data
        registros.value = response.data.registros;
    } catch (err) {
        alertas.error('Error De conexion ' + (err.response?.data?.message || err.message));
        //alert("Error al obtener registros: " + (err.response?.data?.message || err.message));
    } finally {
        cargando.value = false;
    }
};


// Función para que Excel en español entienda los números y decimales
const formatoExcel = (valor) => {
    if (!valor) return "0,00";
    // Fuerza 2 decimales y cambia el punto por coma (ej: 1500.50 -> "1500,50")
    return Number(valor).toFixed(2).replace('.', ',');
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

        // Obtenemos el tipo de contrato y lo pasamos a mayúsculas para evitar errores
        // (Usamos el OR || por si tu backend lo manda con mayúscula o minúscula)
        const tipoContrato = String(reg.tipo_contrato || reg.tipo_Contrato || '').toUpperCase();

        // Obtenemos el monto real (buscamos la variable general del contrato primero)
        const montoTotal = reg.monto_contrato || reg.monto_Vivienda || reg.monto_Comercial || 0;

        // Variables limpias para el Excel
        let montoViviendaExcel = 0;
        let montoComercioExcel = 0;

        // LÓGICA DE DISTRIBUCIÓN
        if (tipoContrato === 'VIVIENDA' || tipoContrato === '1') {
            montoViviendaExcel = montoTotal;
        } else {
            // Si es COMERCIO, COCHERA, 2 o 3, va a la columna comercial
            montoComercioExcel = montoTotal;
        }

        return [
            reg.folio,
            (reg.nombre || "").toString().replace(/;/g, ","), 
            reg.informe,
            reg.fecha_Inicio || reg.fecha_inicio,
            reg.tipo_contrato || reg.tipo_Contrato,
            formatoExcel(montoViviendaExcel), // <--- ACÁ APLICAMOS EL FORMATO
            formatoExcel(montoComercioExcel), // <--- Y ACÁ TAMBIÉN
            reg.hojas,
            reg.fecha_Carga || reg.fecha_carga,
            reg.inq_Prop || reg.inq_prop
        ].join(";");
    });

    // 3. Agregamos "sep=;" al inicio para Excel y \ufeff para los acentos UTF-8
    const contenido = "sep=;\n" + encabezados.join(";") + "\n" + filas.join("\n");

    // 4. Creamos el Blob
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