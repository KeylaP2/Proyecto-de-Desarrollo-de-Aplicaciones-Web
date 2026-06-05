// 1. Selección de elementos mediante ID
const formulario = document.getElementById('registration-form');
const inputNombre = document.getElementById('firstname');
const inputApellido = document.getElementById('lastname');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const inputPhone = document.getElementById('phone');

// 2. Funciones de validación individuales (Uso de innerHTML y classList)
function validarCampoVacio(input, elementoError, mensaje) {
    if (input.value.trim() === '') {
        elementoError.innerHTML = mensaje;
        input.classList.add('input-error');
        input.classList.remove('input-success');
        return false;
    } else {
        elementoError.innerHTML = '';
        input.classList.remove('input-error');
        input.classList.add('input-success');
        return true;
    }
}

function validarEmail(input, elementoError) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.value.trim() === '') {
        return validarCampoVacio(input, elementoError, 'El correo electrónico es obligatorio.');
    } else if (!regexEmail.test(input.value.trim())) {
        elementoError.innerHTML = 'Formato de correo inválido (ejemplo@correo.com).';
        input.classList.add('input-error');
        input.classList.remove('input-success');
        return false;
    } else {
        elementoError.innerHTML = '';
        input.classList.remove('input-error');
        input.classList.add('input-success');
        return true;
    }
}

function validarPassword(input, elementoError) {
    if (input.value.trim() === '') {
        return validarCampoVacio(input, elementoError, 'La contraseña es obligatoria.');
    } else if (input.value.length < 6) {
        elementoError.innerHTML = 'La contraseña debe tener al menos 6 caracteres.';
        input.classList.add('input-error');
        input.classList.remove('input-success');
        return false;
    } else {
        elementoError.innerHTML = '';
        input.classList.remove('input-error');
        input.classList.add('input-success');
        return true;
    }
}

// 3. Eventos en tiempo real (Se ejecutan mientras el usuario escribe)
inputNombre.addEventListener('input', () => validarCampoVacio(inputNombre, document.getElementById('error-firstname'), 'El nombre es obligatorio.'));
inputApellido.addEventListener('input', () => validarCampoVacio(inputApellido, document.getElementById('error-lastname'), 'El apellido es obligatorio.'));
inputEmail.addEventListener('input', () => validarEmail(inputEmail, document.getElementById('error-email')));
inputPassword.addEventListener('input', () => validarPassword(inputPassword, document.getElementById('error-password')));
inputPhone.addEventListener('input', () => validarCampoVacio(inputPhone, document.getElementById('error-phone'), 'El teléfono es obligatorio.'));

// 4. Manejo del envío del formulario (Submit) y Persistencia de datos
formulario.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    // Ejecución de todas las validaciones antes de guardar
    const esNombreValido = validarCampoVacio(inputNombre, document.getElementById('error-firstname'), 'El nombre es obligatorio.');
    const esApellidoValido = validarCampoVacio(inputApellido, document.getElementById('error-lastname'), 'El apellido es obligatorio.');
    const esEmailValido = validarEmail(inputEmail, document.getElementById('error-email'));
    const esPasswordValido = validarPassword(inputPassword, document.getElementById('error-password'));
    const esTelefonoValido = validarCampoVacio(inputPhone, document.getElementById('error-phone'), 'El teléfono es obligatorio.');

    const contenedorExito = document.getElementById('success-message');

    // Si todo pasa con éxito, se crea el objeto y se guarda de forma persistente
    if (esNombreValido && esApellidoValido && esEmailValido && esPasswordValido && esTelefonoValido) {
        
        // Creamos el objeto con los datos del nuevo cliente
        const nuevoUsuario = {
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            correo: inputEmail.value.trim(),
            telefono: inputPhone.value.trim()
        };

        // Guardamos el objeto en LocalStorage convirtiéndolo a texto plano
        localStorage.setItem('usuarioRegistrado', JSON.stringify(nuevoUsuario));

        // Mostramos el mensaje de éxito dinámicamente en el <output>
        contenedorExito.innerHTML = `<p class="msg-exito">¡Registro completado con éxito, ${nuevoUsuario.nombre}! Datos persistidos.</p>`;
        
        formulario.reset(); // Resetea el formulario de forma interactiva
        
        // Limpiamos los estilos visuales de éxito de los bordes
        const inputs = [inputNombre, inputApellido, inputEmail, inputPassword, inputPhone];
        inputs.forEach(input => input.classList.remove('input-success'));
    } else {
        contenedorExito.innerHTML = ''; // Borra el éxito si se generan nuevos errores
    }
});