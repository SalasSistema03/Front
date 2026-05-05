import Swal from 'sweetalert2';

export const alertas = {
    // Configuración base para evitar repetir código
    baseOptions: {
        toast: true,
        position: 'bottom-end', // <--- Esto las ubica abajo a la derecha
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#fff',
    },

    success(title, text = '') {
        Swal.fire({
            ...this.baseOptions,
            icon: 'success',
            title: title,
            text: text,
            color: '#00af9af5',
            iconColor: '#0055b9'
        });
    },

    error(title, text = '') {
        Swal.fire({
            ...this.baseOptions,
            icon: 'error',
            title: title,
            text: text,
            color: '#ff0000',
            iconColor: '#0055b9'
        });
    },

    async confirmar(title = '¿Estás seguro?', text = 'Esta acción no se puede deshacer') {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0055b9',
            cancelButtonColor: '#ff0000',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true // Pone el botón de cancelar a la izquierda (estilo Windows/Web estándar)
        });
    }
};