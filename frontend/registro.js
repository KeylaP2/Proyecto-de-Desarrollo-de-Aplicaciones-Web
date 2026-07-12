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
const API_URL = 'http://localhost:3000/api/usuarios';
const botonEnviar = formulario.querySelector('button[type="submit"]');
const botonCancelarEdicion = document.getElementById('cancelar-edicion');
let idUsuarioEnEdicion = null;

async function obtenerUsuariosRegistrados() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('No se pudo cargar la lista de usuarios.');
        const resultado = await response.json();
        return Array.isArray(resultado.data) ? resultado.data : [];
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
}

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

function crearSaltoLinea() {
    return document.createElement('br');
}

function poblarSelect(select, inicio, fin, pad = false) {
    const placeholder = select.options[0];
    select.textContent = '';
    select.appendChild(placeholder);

    for (let valor = inicio; valor <= fin; valor++) {
        const option = document.createElement('option');
        option.value = pad ? String(valor).padStart(2, '0') : String(valor);
        option.textContent = option.value;
        select.appendChild(option);
    }
}

function poblarFechaNacimiento() {
    const yearActual = new Date().getFullYear();
    poblarSelect(selectDay, 1, 31, true);
    poblarSelect(selectMonth, 1, 12, true);
    poblarSelect(selectYear, yearActual - 100, yearActual);
}

poblarFechaNacimiento();

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
    } else if (input.value.length < 6) {
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

function validarFecha(elementoError) {
    if (selectDay.value === '' || selectMonth.value === '' || selectYear.value === '') {
        mostrarError(elementoError, 'La fecha de nacimiento está incompleta.');
        marcarCampoInvalido(selectDay);
        marcarCampoInvalido(selectMonth);
        marcarCampoInvalido(selectYear);
        return false;
    }

    const day = Number(selectDay.value);
    const month = Number(selectMonth.value);
    const year = Number(selectYear.value);
    const fecha = new Date(year, month - 1, day);
    const fechaEsReal = fecha.getFullYear() === year && fecha.getMonth() === month - 1 && fecha.getDate() === day;

    if (!fechaEsReal) {
        mostrarError(elementoError, 'La fecha de nacimiento no es válida.');
        marcarCampoInvalido(selectDay);
        marcarCampoInvalido(selectMonth);
        marcarCampoInvalido(selectYear);
        return false;
    } else if (fecha > new Date()) {
        mostrarError(elementoError, 'La fecha de nacimiento no puede ser futura.');
        marcarCampoInvalido(selectDay);
        marcarCampoInvalido(selectMonth);
        marcarCampoInvalido(selectYear);
        return false;
    }

    limpiarError(elementoError);
    marcarCampoValido(selectDay);
    marcarCampoValido(selectMonth);
    marcarCampoValido(selectYear);
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

selectDay.addEventListener('change', () => validarFecha(document.getElementById('error-fecha')));
selectMonth.addEventListener('change', () => validarFecha(document.getElementById('error-fecha')));
selectYear.addEventListener('change', () => validarFecha(document.getElementById('error-fecha')));

for (const radio of radiosGender) {
    radio.addEventListener('change', () => validarGenero(document.getElementById('error-gender')));
}

// 4. Manejo del envío del formulario y persistencia de datos
formulario.addEventListener('submit', async function (event) {
    event.preventDefault();

    const esEdicion = idUsuarioEnEdicion !== null;
    const seEstaCambiandoPassword = inputPassword.value.trim() !== '' || inputConfirmPassword.value.trim() !== '';
    const esNombreValido = validarCampoVacio(inputNombre, document.getElementById('error-firstname'), 'El nombre es obligatorio.');
    const esApellidoValido = validarCampoVacio(inputApellido, document.getElementById('error-lastname'), 'El apellido es obligatorio.');
    const esEmailValido = validarEmail(inputEmail, document.getElementById('error-email'));
    const esPasswordValido = !esEdicion || seEstaCambiandoPassword
        ? validarPassword(inputPassword, document.getElementById('error-password'))
        : true;
    const esConfirmPasswordValido = !esEdicion || seEstaCambiandoPassword
        ? validarConfirmarPassword(inputConfirmPassword, inputPassword, document.getElementById('error-confirm-password'))
        : true;
    const esTelefonoValido = validarTelefono(inputPhone, document.getElementById('error-phone'));
    const esFechaValida = validarFecha(document.getElementById('error-fecha'));
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

        const fechaNacimiento = `${selectYear.value}-${selectMonth.value}-${selectDay.value}`;
        const datosUsuario = {
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            correo: inputEmail.value.trim(),
            email: inputEmail.value.trim(),
            ...(seEstaCambiandoPassword && { password: inputPassword.value.trim() }),
            telefono: inputPhone.value.trim(),
            fechaNacimiento,
            genero: generoSeleccionado
        };

        try {
            const response = await fetch(esEdicion ? `${API_URL}/${idUsuarioEnEdicion}` : API_URL, {
                method: esEdicion ? 'PUT' : 'POST',
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
            mensajeExito.textContent = esEdicion
                ? `¡Los datos de ${usuarioGuardado.nombre} fueron actualizados correctamente!`
                : `¡Registro completado con éxito, ${usuarioGuardado.nombre}!`;
            contenedorExito.appendChild(mensajeExito);

            renderUsuarios();
            cancelarEdicion();
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
    const inputs = [inputNombre, inputApellido, inputEmail, inputPassword, inputConfirmPassword, inputPhone, selectDay, selectMonth, selectYear];
    inputs.forEach(input => {
        input.classList.remove('input-success', 'input-error');
    });

    document.querySelectorAll('.error-msg').forEach(elemento => {
        elemento.textContent = '';
    });
}

function cancelarEdicion() {
    idUsuarioEnEdicion = null;
    limpiarEstadoFormulario();
    botonEnviar.textContent = 'Sign Up';
    botonCancelarEdicion.classList.add('d-none');
}

function cargarUsuarioEnFormulario(usuario) {
    idUsuarioEnEdicion = usuario.id;
    inputNombre.value = usuario.nombre || '';
    inputApellido.value = usuario.apellido || '';
    inputEmail.value = usuario.email || usuario.correo || '';
    inputPhone.value = usuario.telefono || '';

    const fechaNacimiento = usuario.fechaNacimiento || usuario.fecha_nacimiento || '';
    const [year, month, day] = fechaNacimiento.split('-');
    selectYear.value = year || '';
    selectMonth.value = month || '';
    selectDay.value = day || '';

    for (const radio of radiosGender) {
        radio.checked = radio.value === usuario.genero;
    }

    inputPassword.value = '';
    inputConfirmPassword.value = '';
    botonEnviar.textContent = 'Actualizar usuario';
    botonCancelarEdicion.classList.remove('d-none');
    document.getElementById('form-mensaje').textContent = 'Edita los datos necesarios. Deja la contraseña vacía si deseas conservar la actual.';
    formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function eliminarUsuario(usuario) {
    const confirmar = window.confirm(`¿Deseas eliminar a ${usuario.nombre} ${usuario.apellido}?`);

    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/${usuario.id}`, { method: 'DELETE' });

        if (!response.ok) {
            const errorRespuesta = await response.json().catch(() => ({}));
            throw new Error(errorRespuesta.message || 'No se pudo eliminar el usuario.');
        }

        if (idUsuarioEnEdicion === usuario.id) cancelarEdicion();
        await renderUsuarios();
    } catch (error) {
        const contenedorMensaje = document.getElementById('form-mensaje');
        contenedorMensaje.textContent = error.message;
        contenedorMensaje.className = 'my-3 text-center fw-bold msg-error';
    }
}

botonCancelarEdicion.addEventListener('click', cancelarEdicion);

// Renderizar la lista de usuarios
const usuariosSection = document.getElementById('usuarios-registrados-section');
const listaUsuarios = document.getElementById('lista-usuarios');

function formatearFecha(fecha) {
    if (!fecha) return '';
    const partes = fecha.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return fecha;
}

async function renderUsuarios() {
    const usuarios = await obtenerUsuariosRegistrados();

    if (usuarios.length > 0) {
        usuariosSection.style.display = 'block';
        listaUsuarios.textContent = '';

        usuarios.forEach(usuario => {
            const nombre = usuario.nombre || '';
            const apellido = usuario.apellido || '';
            const correo = usuario.correo || '';
            const telefono = usuario.telefono || '';
            const fechaNacimiento = usuario.fechaNacimiento || usuario.fecha_nacimiento || '';
            const genero = usuario.genero || '';
            const li = document.createElement('li');
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid #eee';
            li.style.marginBottom = '5px';

            const nombreCompleto = document.createElement('strong');
            nombreCompleto.textContent = `${nombre} ${apellido}`;

            const contacto = document.createElement('small');
            contacto.textContent = `${correo} - ${telefono}`;

            const datosPersonales = document.createElement('small');
            datosPersonales.textContent = `Fecha: ${formatearFecha(fechaNacimiento)} | Género: ${genero}`;

            li.appendChild(nombreCompleto);
            li.appendChild(crearSaltoLinea());
            li.appendChild(contacto);
            li.appendChild(crearSaltoLinea());
            li.appendChild(datosPersonales);

            const acciones = document.createElement('div');
            acciones.className = 'd-flex gap-2 mt-2';

            const botonEditar = document.createElement('button');
            botonEditar.type = 'button';
            botonEditar.className = 'btn btn-sm btn-outline-primary';
            botonEditar.textContent = 'Editar';
            botonEditar.addEventListener('click', () => cargarUsuarioEnFormulario(usuario));

            const botonEliminar = document.createElement('button');
            botonEliminar.type = 'button';
            botonEliminar.className = 'btn btn-sm btn-outline-danger';
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.addEventListener('click', () => eliminarUsuario(usuario));

            acciones.appendChild(botonEditar);
            acciones.appendChild(botonEliminar);
            li.appendChild(acciones);
            listaUsuarios.appendChild(li);
        });
    } else {
        usuariosSection.style.display = 'none';
        listaUsuarios.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', renderUsuarios);
