import Swal from 'sweetalert2';

export const alertas = {
    success(title, text = '') {
        Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            toast: true,
            position: 'bottom-end',
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
    
};