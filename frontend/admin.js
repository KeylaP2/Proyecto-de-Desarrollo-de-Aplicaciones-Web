const ADMIN_API_URL = `http://${window.location.hostname}:3000/api/admin`;
const cuerpoTabla = document.getElementById('users-table-body');
const modalUsuario = document.getElementById('user-modal');
const formularioUsuario = document.getElementById('user-admin-form');
const mensajePanel = document.getElementById('admin-panel-message');
const mensajeFormulario = document.getElementById('user-form-message');
const buscador = document.getElementById('admin-search');
let usuariosAdmin = [];
let usuarioEnEdicion = null;

function escaparFecha(fecha) {
    if (!fecha) return 'No especificada';
    const [year, month, day] = fecha.slice(0, 10).split('-');
    return year && month && day ? `${day}/${month}/${year}` : fecha;
}

function crearCelda(texto, etiqueta) {
    const celda = document.createElement('td');
    celda.dataset.label = etiqueta;
    celda.textContent = texto;
    return celda;
}

function renderizarUsuarios() {
    const termino = buscador.value.trim().toLowerCase();
    const visibles = usuariosAdmin.filter(usuario => [usuario.nombre, usuario.apellido, usuario.email, usuario.telefono]
        .some(valor => String(valor || '').toLowerCase().includes(termino)));
    cuerpoTabla.textContent = '';
    document.getElementById('total-users').textContent = usuariosAdmin.length;
    document.getElementById('visible-users').textContent = visibles.length;
    document.getElementById('admin-empty').hidden = visibles.length !== 0;

    visibles.forEach(usuario => {
        const fila = document.createElement('tr');
        const identidad = document.createElement('td');
        identidad.dataset.label = 'Usuario';
        const iniciales = `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`.toUpperCase();
        const avatar = document.createElement('span');
        avatar.className = 'user-avatar';
        avatar.textContent = iniciales || 'U';
        const nombre = document.createElement('div');
        const nombreFuerte = document.createElement('strong');
        nombreFuerte.textContent = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
        const id = document.createElement('small');
        id.textContent = `ID #${usuario.id}`;
        nombre.append(nombreFuerte, id);
        identidad.append(avatar, nombre);

        const contacto = document.createElement('td');
        contacto.dataset.label = 'Contacto';
        const correo = document.createElement('strong');
        correo.textContent = usuario.email || usuario.correo || '';
        const telefono = document.createElement('small');
        telefono.textContent = usuario.telefono || 'Sin teléfono';
        contacto.append(correo, telefono);

        const genero = crearCelda(usuario.genero || 'No especificado', 'Género');
        const acciones = document.createElement('td');
        acciones.dataset.label = 'Acciones';
        acciones.className = 'admin-actions';
        const editar = document.createElement('button');
        editar.type = 'button';
        editar.className = 'admin-edit';
        editar.textContent = 'Editar';
        editar.addEventListener('click', () => abrirModalUsuario(usuario));
        const eliminar = document.createElement('button');
        eliminar.type = 'button';
        eliminar.className = 'admin-delete';
        eliminar.textContent = 'Eliminar';
        eliminar.addEventListener('click', () => eliminarUsuario(usuario));
        acciones.append(editar, eliminar);

        fila.append(
            identidad,
            contacto,
            crearCelda(escaparFecha(usuario.fecha_nacimiento || usuario.fechaNacimiento), 'Nacimiento'),
            genero,
            crearCelda(escaparFecha(usuario.created_at), 'Registro'),
            acciones
        );
        cuerpoTabla.appendChild(fila);
    });
}

async function solicitudAdmin(ruta, opciones = {}) {
    const response = await csrfFetch(`${ADMIN_API_URL}${ruta}`, opciones);
    if (response.status === 401) {
        window.location.replace('admin-login.html');
        throw new Error('La sesión administrativa expiró.');
    }
    const resultado = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(resultado.message || 'No fue posible completar la operación.');
    return resultado;
}

async function cargarUsuarios() {
    mensajePanel.textContent = 'Cargando usuarios…';
    try {
        const resultado = await solicitudAdmin('/usuarios');
        usuariosAdmin = Array.isArray(resultado.data) ? resultado.data : [];
        renderizarUsuarios();
        mensajePanel.textContent = '';
    } catch (error) {
        mensajePanel.textContent = error.message;
    }
}

function abrirModalUsuario(usuario = null) {
    usuarioEnEdicion = usuario;
    formularioUsuario.reset();
    mensajeFormulario.textContent = '';
    document.getElementById('user-modal-title').textContent = usuario ? 'Editar usuario' : 'Nuevo usuario';
    const password = formularioUsuario.elements.password;
    password.required = !usuario;
    if (usuario) {
        formularioUsuario.elements.nombre.value = usuario.nombre || '';
        formularioUsuario.elements.apellido.value = usuario.apellido || '';
        formularioUsuario.elements.email.value = usuario.email || usuario.correo || '';
        formularioUsuario.elements.telefono.value = usuario.telefono || '';
        formularioUsuario.elements.fechaNacimiento.value = (usuario.fecha_nacimiento || usuario.fechaNacimiento || '').slice(0, 10);
        formularioUsuario.elements.genero.value = usuario.genero || '';
    }
    modalUsuario.classList.add('is-open');
    modalUsuario.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    formularioUsuario.elements.nombre.focus();
}

function cerrarModalUsuario() {
    modalUsuario.classList.remove('is-open');
    modalUsuario.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    usuarioEnEdicion = null;
}

async function eliminarUsuario(usuario) {
    if (!window.confirm(`¿Eliminar permanentemente a ${usuario.nombre} ${usuario.apellido}? Esta acción no se puede deshacer.`)) return;
    try {
        await solicitudAdmin(`/usuarios/${usuario.id}`, { method: 'DELETE' });
        mensajePanel.textContent = 'Usuario eliminado correctamente.';
        await cargarUsuarios();
    } catch (error) {
        mensajePanel.textContent = error.message;
    }
}

formularioUsuario.addEventListener('submit', async evento => {
    evento.preventDefault();
    const boton = formularioUsuario.querySelector('button[type="submit"]');
    boton.disabled = true;
    mensajeFormulario.textContent = '';
    const datos = Object.fromEntries(new FormData(formularioUsuario));
    if (!datos.password) delete datos.password;
    try {
        await solicitudAdmin(usuarioEnEdicion ? `/usuarios/${usuarioEnEdicion.id}` : '/usuarios', {
            method: usuarioEnEdicion ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        cerrarModalUsuario();
        await cargarUsuarios();
    } catch (error) {
        mensajeFormulario.textContent = error.message;
    } finally {
        boton.disabled = false;
    }
});

document.getElementById('admin-logout').addEventListener('click', async () => {
    await csrfFetch(`${ADMIN_API_URL}/logout`, { method: 'POST' }).catch(() => null);
    window.location.replace('admin-login.html');
});
document.getElementById('new-user').addEventListener('click', () => abrirModalUsuario());
document.getElementById('refresh-users').addEventListener('click', cargarUsuarios);
document.querySelector('.admin-modal-close').addEventListener('click', cerrarModalUsuario);
document.querySelector('.admin-cancel').addEventListener('click', cerrarModalUsuario);
modalUsuario.addEventListener('click', evento => { if (evento.target === modalUsuario) cerrarModalUsuario(); });
buscador.addEventListener('input', renderizarUsuarios);
document.addEventListener('keydown', evento => { if (evento.key === 'Escape' && modalUsuario.classList.contains('is-open')) cerrarModalUsuario(); });

(async () => {
    try {
        const sesion = await solicitudAdmin('/me');
        document.getElementById('admin-session-email').textContent = sesion.data.email;
        await cargarUsuarios();
    } catch (error) {
        mensajePanel.textContent = error.message;
    }
})();
