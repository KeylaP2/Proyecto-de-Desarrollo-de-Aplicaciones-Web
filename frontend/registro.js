// 1. Selección de elementos mediante ID
const formulario = document.getElementById('registro-form');
const inputNombre = document.getElementById('firstname');
const inputApellido = document.getElementById('lastname');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const inputConfirmPassword = document.getElementById('confirm-password');
const inputPhone = document.getElementById('phone');
const inputFechaNacimiento = document.getElementById('birthdate');
const radiosGender = document.getElementsByName('gender');
const botonesPassword = document.querySelectorAll('[data-password-toggle]');
const API_URL = `http://${window.location.hostname}:3000/api/usuarios`;

function mostrarError(elementoError, mensaje) {
    elementoError.textContent = mensaje;
}

function limpiarError(elementoError) {
    elementoError.textContent = '';
}

function marcarCampoValido(input) {
    input.classList.remove('input-error');
    input.classList.add('input-success');
}

function marcarCampoInvalido(input) {
    input.classList.add('input-error');
    input.classList.remove('input-success');
}

function formatearFechaISO(fecha) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function configurarFechaNacimiento() {
    const yearActual = new Date().getFullYear();
    const fechaMinima = new Date(yearActual - 100, 0, 1);

    inputFechaNacimiento.max = formatearFechaISO(new Date());
    inputFechaNacimiento.min = formatearFechaISO(fechaMinima);
}

configurarFechaNacimiento();

function ocultarPasswords() {
    botonesPassword.forEach(boton => {
        const input = document.getElementById(boton.dataset.passwordToggle);
        if (!input) return;

        input.type = 'password';
        boton.setAttribute('aria-label', boton.dataset.passwordToggle === 'password' ? 'Mostrar contraseña' : 'Mostrar confirmación de contraseña');
        boton.setAttribute('aria-pressed', 'false');
        boton.disabled = false;
        boton.dataset.revelado = 'false';
        boton.classList.remove('is-visible');
    });
}

botonesPassword.forEach(boton => {
    const input = document.getElementById(boton.dataset.passwordToggle);

    boton.setAttribute('aria-pressed', 'false');
    boton.dataset.revelado = 'false';
    boton.classList.toggle('is-visible', Boolean(input?.value));

    input?.addEventListener('input', () => {
        const tieneValor = input.value.length > 0;
        boton.classList.toggle('is-visible', tieneValor && boton.dataset.revelado !== 'true');

        if (!tieneValor) {
            input.type = 'password';
            boton.disabled = false;
            boton.dataset.revelado = 'false';
            boton.setAttribute('aria-label', boton.dataset.passwordToggle === 'password' ? 'Mostrar contraseña' : 'Mostrar confirmación de contraseña');
            boton.setAttribute('aria-pressed', 'false');
        }
    });

    input?.addEventListener('blur', () => {
        if (input.type === 'text') {
            input.type = 'password';
            boton.setAttribute('aria-pressed', 'false');
        }
    });

    boton.addEventListener('click', () => {
        if (!input) return;

        input.type = 'text';
        boton.dataset.revelado = 'true';
        boton.classList.remove('is-visible');
        boton.setAttribute('aria-label', 'Contraseña revelada');
        boton.setAttribute('aria-pressed', 'true');

        input.focus();
    });
});

// 2. Funciones de validación individuales
function validarCampoVacio(input, elementoError, mensaje) {
    if (input.value.trim() === '') {
        mostrarError(elementoError, mensaje);
        marcarCampoInvalido(input);
        return false;
    }

    limpiarError(elementoError);
    marcarCampoValido(input);
    return true;
}

function validarEmail(input, elementoError) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const correo = input.value.trim();

    if (correo === '') {
        return validarCampoVacio(input, elementoError, 'El correo electrónico es obligatorio.');
    } else if (!regexEmail.test(correo)) {
        mostrarError(elementoError, 'Formato de correo inválido (ejemplo@correo.com).');
        marcarCampoInvalido(input);
        return false;
    }

    limpiarError(elementoError);
    marcarCampoValido(input);
    return true;
}

function validarPassword(input, elementoError) {
    if (input.value.trim() === '') {
        return validarCampoVacio(input, elementoError, 'La contraseña es obligatoria.');
    } else if (input.value.length < 8) {
        mostrarError(elementoError, 'La contraseña debe tener al menos 6 caracteres.');
        marcarCampoInvalido(input);
        return false;
    }

    limpiarError(elementoError);
    marcarCampoValido(input);
    return true;
}

function validarConfirmarPassword(input, inputBase, elementoError) {
    if (input.value.trim() === '') {
        return validarCampoVacio(input, elementoError, 'Debes confirmar la contraseña.');
    } else if (input.value !== inputBase.value) {
        mostrarError(elementoError, 'Las contraseñas no coinciden.');
        marcarCampoInvalido(input);
        return false;
    }

    limpiarError(elementoError);
    marcarCampoValido(input);
    return true;
}

function validarTelefono(input, elementoError) {
    const telefono = input.value.trim();
    const regexTelefonoRD = /^(809|829|849)\d{7}$/;

    if (telefono === '') {
        return validarCampoVacio(input, elementoError, 'El teléfono es obligatorio.');
    } else if (!regexTelefonoRD.test(telefono)) {
        mostrarError(elementoError, 'El teléfono debe tener 10 dígitos y empezar con 809, 829 o 849.');
        marcarCampoInvalido(input);
        return false;
    }

    limpiarError(elementoError);
    marcarCampoValido(input);
    return true;
}

function validarFecha(input, elementoError) {
    if (input.value === '') {
        mostrarError(elementoError, 'La fecha de nacimiento es obligatoria.');
        marcarCampoInvalido(input);
        return false;
    }

    const fecha = new Date(`${input.value}T00:00:00`);

    if (Number.isNaN(fecha.getTime())) {
        mostrarError(elementoError, 'La fecha de nacimiento no es válida.');
        marcarCampoInvalido(input);
        return false;
    } else if (input.max && input.value > input.max) {
        mostrarError(elementoError, 'La fecha de nacimiento no puede ser futura.');
        marcarCampoInvalido(input);
        return false;
    } else if (input.min && input.value < input.min) {
        mostrarError(elementoError, 'Selecciona una fecha de nacimiento válida.');
        marcarCampoInvalido(input);
        return false;
    }

    limpiarError(elementoError);
    marcarCampoValido(input);
    return true;
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
        mostrarError(elementoError, 'Debes seleccionar un género.');
        return false;
    }

    limpiarError(elementoError);
    return true;
}

// 3. Eventos en tiempo real
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
inputPhone.addEventListener('input', () => {
    inputPhone.value = inputPhone.value.replace(/\D/g, '').slice(0, 10);
    validarTelefono(inputPhone, document.getElementById('error-phone'));
});

inputFechaNacimiento.addEventListener('change', () => validarFecha(inputFechaNacimiento, document.getElementById('error-fecha')));
inputFechaNacimiento.addEventListener('input', () => validarFecha(inputFechaNacimiento, document.getElementById('error-fecha')));

for (const radio of radiosGender) {
    radio.addEventListener('change', () => validarGenero(document.getElementById('error-gender')));
}

// 4. Manejo del envío del formulario y persistencia de datos
formulario.addEventListener('submit', async function (event) {
    event.preventDefault();

    const esNombreValido = validarCampoVacio(inputNombre, document.getElementById('error-firstname'), 'El nombre es obligatorio.');
    const esApellidoValido = validarCampoVacio(inputApellido, document.getElementById('error-lastname'), 'El apellido es obligatorio.');
    const esEmailValido = validarEmail(inputEmail, document.getElementById('error-email'));
    const esPasswordValido = validarPassword(inputPassword, document.getElementById('error-password'));
    const esConfirmPasswordValido = validarConfirmarPassword(inputConfirmPassword, inputPassword, document.getElementById('error-confirm-password'));
    const esTelefonoValido = validarTelefono(inputPhone, document.getElementById('error-phone'));
    const esFechaValida = validarFecha(inputFechaNacimiento, document.getElementById('error-fecha'));
    const esGeneroValido = validarGenero(document.getElementById('error-gender'));
    const contenedorExito = document.getElementById('form-mensaje');

    contenedorExito.textContent = '';

    if (esNombreValido && esApellidoValido && esEmailValido && esPasswordValido && esConfirmPasswordValido && esTelefonoValido && esFechaValida && esGeneroValido) {
        let generoSeleccionado = '';

        for (const radio of radiosGender) {
            if (radio.checked) {
                generoSeleccionado = radio.value;
                break;
            }
        }

        const fechaNacimiento = inputFechaNacimiento.value;
        const datosUsuario = {
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            correo: inputEmail.value.trim(),
            email: inputEmail.value.trim(),
            password: inputPassword.value.trim(),
            telefono: inputPhone.value.trim(),
            fechaNacimiento,
            genero: generoSeleccionado
        };

        try {
            const response = await csrfFetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            });

            if (!response.ok) {
                const errorRespuesta = await response.json().catch(() => ({}));
                throw new Error(errorRespuesta.message || errorRespuesta.mensaje || 'No se pudo registrar el usuario.');
            }

            const resultado = await response.json();
            const usuarioGuardado = resultado.data || resultado;
            const mensajeExito = document.createElement('p');
            mensajeExito.className = 'msg-exito';
            mensajeExito.style.color = 'green';
            mensajeExito.textContent = `¡Registro completado con éxito, ${usuarioGuardado.nombre}!`;
            contenedorExito.appendChild(mensajeExito);
            limpiarEstadoFormulario();
        } catch (error) {
            const mensajeError = document.createElement('p');
            mensajeError.className = 'msg-error';
            mensajeError.style.color = 'red';
            mensajeError.textContent = error.message;
            contenedorExito.appendChild(mensajeError);
        }
    }
});

function limpiarEstadoFormulario() {
    formulario.reset();
    ocultarPasswords();
    const inputs = [inputNombre, inputApellido, inputEmail, inputPassword, inputConfirmPassword, inputPhone, inputFechaNacimiento];
    inputs.forEach(input => {
        input.classList.remove('input-success', 'input-error');
    });

    document.querySelectorAll('.error-msg').forEach(elemento => {
        elemento.textContent = '';
    });
}
