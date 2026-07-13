const ADMIN_API_URL = `http://${window.location.hostname}:3000/api/admin`;
const formularioAdmin = document.getElementById('admin-login-form');
const mensajeAdmin = document.getElementById('admin-login-message');
const passwordAdmin = document.getElementById('admin-password');

async function comprobarSesionAdmin() {
    const response = await fetch(`${ADMIN_API_URL}/me`, { credentials: 'include' }).catch(() => null);
    if (!response?.ok) return;

    const resultado = await response.json().catch(() => ({}));
    if (resultado.data) window.location.replace('admin.html');
}

document.getElementById('toggle-admin-password').addEventListener('click', evento => {
    const visible = passwordAdmin.type === 'text';
    passwordAdmin.type = visible ? 'password' : 'text';
    evento.currentTarget.textContent = visible ? 'Ver' : 'Ocultar';
});

formularioAdmin.addEventListener('submit', async evento => {
    evento.preventDefault();
    mensajeAdmin.textContent = '';
    const boton = formularioAdmin.querySelector('button[type="submit"]');
    boton.disabled = true;
    boton.textContent = 'Verificando…';
    try {
        const response = await csrfFetch(`${ADMIN_API_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('admin-email').value.trim(),
                password: passwordAdmin.value
            })
        });
        const resultado = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(resultado.message || 'No fue posible iniciar sesión.');
        window.location.replace('admin.html');
    } catch (error) {
        mensajeAdmin.textContent = error.message;
    } finally {
        boton.disabled = false;
        boton.textContent = 'Entrar al panel';
    }
});

comprobarSesionAdmin();
