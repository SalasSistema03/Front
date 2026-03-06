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
            color: '#007bff',
            iconColor: '#007bff'
        });
    },
    error(title, text = '') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
            color: '#155724',
            iconColor: '#f27474'
        });
    },

    async confirmar(title = '¿Estás seguro?', text = 'Esta acción no se puede deshacer') {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true // Pone el botón de cancelar a la izquierda (estilo Windows/Web estándar)
        });
    }
    
};