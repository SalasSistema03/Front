import Swal from 'sweetalert2';

export const alertas = {
    success(title, text = '') {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
            color: '#00af9af5',
            iconColor: '#0055b9'
        });
    },
    error(title, text = '') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
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