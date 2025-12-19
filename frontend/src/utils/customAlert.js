import Swal from 'sweetalert2';


export const showSuccess = (message) => {
    Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        confirmButtonColor: '#3C3F36', 
        confirmButtonText: 'Great! 🐾',
        background: '#FFFBF7', 
        color: '#3C3F36'
    });
};

// 2. Error Message 
export const showError = (message) => {
    Swal.fire({
        title: 'Oops...',
        text: message,
        icon: 'error',
        confirmButtonColor: '#d33',
        background: '#FFFBF7',
        color: '#3C3F36'
    });
};


export const showConfirm = async (title, text) => {
    const result = await Swal.fire({
        title: title || 'Are you sure?',
        text: text || "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', 
        cancelButtonColor: '#3C3F36', 
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#FFFBF7',
        color: '#3C3F36',
        iconColor: '#A0522D'
    });
    return result.isConfirmed;
};