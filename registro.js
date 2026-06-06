// 1. Selección de elementos mediante ID
const formulario = document.getElementById('registro-form');
const inputNombre = document.getElementById('firstname');
const inputApellido = document.getElementById('lastname');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const inputConfirmPassword = document.getElementById('confirm-password');
const inputPhone = document.getElementById('phone');
const selectDay = document.getElementById('day');
const selectMonth = document.getElementById('month');
const selectYear = document.getElementById('year');
const radiosGender = document.getElementsByName('gender');

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

function validarConfirmarPassword(input, inputBase, elementoError) {
    if (input.value.trim() === '') {
        return validarCampoVacio(input, elementoError, 'Debes confirmar la contraseña.');
    } else if (input.value !== inputBase.value) {
        elementoError.innerHTML = 'Las contraseñas no coinciden.';
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

function validarFecha(elementoError) {
    if (selectDay.value === '' || selectMonth.value === '' || selectYear.value === '') {
        elementoError.innerHTML = 'La fecha de nacimiento está incompleta.';
        selectDay.classList.add('input-error');
        selectMonth.classList.add('input-error');
        selectYear.classList.add('input-error');
        return false;
    } else {
        elementoError.innerHTML = '';
        selectDay.classList.remove('input-error');
        selectMonth.classList.remove('input-error');
        selectYear.classList.remove('input-error');
        selectDay.classList.add('input-success');
        selectMonth.classList.add('input-success');
        selectYear.classList.add('input-success');
        return true;
    }
}

function validarGenero(elementoError) {
    let seleccionado = false;
    for (const radio of radiosGender) {
        if (radio.checked) {
            seleccionado = true;
            break;
        }
    }
    if (!seleccionado) {
        elementoError.innerHTML = 'Debes seleccionar un género.';
        return false;
    } else {
        elementoError.innerHTML = '';
        return true;
    }
}

// 3. Eventos en tiempo real (Se ejecutan mientras el usuario escribe)
inputNombre.addEventListener('input', () => validarCampoVacio(inputNombre, document.getElementById('error-firstname'), 'El nombre es obligatorio.'));
inputApellido.addEventListener('input', () => validarCampoVacio(inputApellido, document.getElementById('error-lastname'), 'El apellido es obligatorio.'));
inputEmail.addEventListener('input', () => validarEmail(inputEmail, document.getElementById('error-email')));
inputPassword.addEventListener('input', () => {
    validarPassword(inputPassword, document.getElementById('error-password'));
    if (inputConfirmPassword.value.length > 0) {
        validarConfirmarPassword(inputConfirmPassword, inputPassword, document.getElementById('error-confirm-password'));
    }
});
inputConfirmPassword.addEventListener('input', () => validarConfirmarPassword(inputConfirmPassword, inputPassword, document.getElementById('error-confirm-password')));
inputPhone.addEventListener('input', () => validarCampoVacio(inputPhone, document.getElementById('error-phone'), 'El teléfono es obligatorio.'));

selectDay.addEventListener('change', () => validarFecha(document.getElementById('error-fecha')));
selectMonth.addEventListener('change', () => validarFecha(document.getElementById('error-fecha')));
selectYear.addEventListener('change', () => validarFecha(document.getElementById('error-fecha')));

for (const radio of radiosGender) {
    radio.addEventListener('change', () => validarGenero(document.getElementById('error-gender')));
}

// 4. Manejo del envío del formulario (Submit) y Persistencia de datos
formulario.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que la página se recargue

    // Ejecución de todas las validaciones antes de guardar
    const esNombreValido = validarCampoVacio(inputNombre, document.getElementById('error-firstname'), 'El nombre es obligatorio.');
    const esApellidoValido = validarCampoVacio(inputApellido, document.getElementById('error-lastname'), 'El apellido es obligatorio.');
    const esEmailValido = validarEmail(inputEmail, document.getElementById('error-email'));
    const esPasswordValido = validarPassword(inputPassword, document.getElementById('error-password'));
    const esConfirmPasswordValido = validarConfirmarPassword(inputConfirmPassword, inputPassword, document.getElementById('error-confirm-password'));
    const esTelefonoValido = validarCampoVacio(inputPhone, document.getElementById('error-phone'), 'El teléfono es obligatorio.');
    const esFechaValida = validarFecha(document.getElementById('error-fecha'));
    const esGeneroValido = validarGenero(document.getElementById('error-gender'));

    const contenedorExito = document.getElementById('form-mensaje');

    // Si todo pasa con éxito, se crea el objeto y se guarda de forma persistente
    if (esNombreValido && esApellidoValido && esEmailValido && esPasswordValido && esConfirmPasswordValido && esTelefonoValido && esFechaValida && esGeneroValido) {

        let generoSeleccionado = '';
        for (const radio of radiosGender) {
            if (radio.checked) {
                generoSeleccionado = radio.value;
                break;
            }
        }

        // Creamos el objeto con los datos del nuevo usuario
        const nuevoUsuario = {
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            correo: inputEmail.value.trim(),
            password: inputPassword.value.trim(),
            telefono: inputPhone.value.trim()
        };

        // Guardamos el objeto en LocalStorage convirtiéndolo a texto plano
        localStorage.setItem('usuarioRegistrado', JSON.stringify(nuevoUsuario));

        // Mostramos el mensaje de éxito dinámicamente
        contenedorExito.innerHTML = `<p class="msg-exito" style="color: green;">¡Registro completado con éxito, ${nuevoUsuario.nombre}! Datos persistidos.</p>`;

        formulario.reset(); // Resetea el formulario de forma interactiva

        // Aqui se limpian los estilos visuales de éxito de los bordes
        const inputs = [inputNombre, inputApellido, inputEmail, inputPassword, inputConfirmPassword, inputPhone, selectDay, selectMonth, selectYear];
        inputs.forEach(input => {
            input.classList.remove('input-success');
            input.classList.remove('input-error');
        });
    } else {
        contenedorExito.innerHTML = ''; // Borra el éxito si se generan nuevos errores
    }
});

// Renderizar la lista de usuarios
const usuariosSection = document.getElementById('usuarios-registrados-section');
const listaUsuarios = document.getElementById('lista-usuarios');

function renderUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    if (usuarios.length > 0) {
        usuariosSection.style.display = 'block';
        listaUsuarios.innerHTML = '';
        usuarios.forEach((usuario, index) => {
            const li = document.createElement('li');
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid #eee';
            li.style.marginBottom = '5px';
            li.innerHTML = `<strong>${usuario.nombre} ${usuario.apellido}</strong><br>
                            <small>${usuario.correo} - ${usuario.telefono}</small><br>
                            <small>Fecha: ${usuario.fechaNacimiento} | Género: ${usuario.genero}</small>`;
            listaUsuarios.appendChild(li);
        });
    } else {
        usuariosSection.style.display = 'none';
    }
}

// Renderizar al cargar la página
document.addEventListener('DOMContentLoaded', renderUsuarios);
