import Swal from 'sweetalert2';


const showSuccessAlert = () => {
  Swal.fire({
    icon: 'success',
    title: 'Orden creada exitosamente',
    text: 'Tu orden ha sido procesada correctamente. ¡Gracias por tu compra!',
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'swal2-sm',
    },
    timer: 5000, 
  });
};


const showErrorAlert = () => {
  Swal.fire({
    icon: 'error',
    title: 'Error al crear orden',
    text: 'Hubo un problema al procesar tu orden. Por favor, inténtalo nuevamente más tarde.',
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'swal2-sm',
    },
  });
};

export { showSuccessAlert, showErrorAlert };
