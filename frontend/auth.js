const AUTH_API_URL = `http://${window.location.hostname}:3000/api/auth`;
const ADMIN_AUTH_API_URL = `http://${window.location.hostname}:3000/api/admin`;
let tipoSesionActual = null;

function inicializarMenuMovil() {
    const navegacion = document.querySelector('.main-header .navbar');
    const contenedorCabecera = document.querySelector('.main-header .container');
    if (!navegacion || !contenedorCabecera) return;

    navegacion.id = 'main-navigation';

    const botonMenu = document.createElement('button');
    botonMenu.type = 'button';
    botonMenu.className = 'mobile-menu-toggle';
    botonMenu.setAttribute('aria-label', 'Abrir menú de navegación');
    botonMenu.setAttribute('aria-controls', navegacion.id);
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.innerHTML = '<span></span><span></span><span></span>';

    const fondo = document.createElement('button');
    fondo.type = 'button';
    fondo.className = 'mobile-menu-backdrop';
    fondo.setAttribute('aria-label', 'Cerrar menú');
    document.body.appendChild(fondo);
    contenedorCabecera.prepend(botonMenu);

    const cambiarMenu = abierto => {
        navegacion.classList.toggle('is-open', abierto);
        fondo.classList.toggle('is-open', abierto);
        botonMenu.classList.toggle('is-open', abierto);
        botonMenu.setAttribute('aria-expanded', String(abierto));
        botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        document.body.classList.toggle('mobile-menu-open', abierto);
    };

    botonMenu.addEventListener('click', () => cambiarMenu(!navegacion.classList.contains('is-open')));
    fondo.addEventListener('click', () => cambiarMenu(false));
    navegacion.querySelectorAll('a').forEach(enlace => enlace.addEventListener('click', () => cambiarMenu(false)));
    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape') cambiarMenu(false);
    });
}

async function obtenerSesion() {
    const responseUsuario = await fetch(`${AUTH_API_URL}/me`, { credentials: "include" });
    if (responseUsuario.ok) {
        const resultado = await responseUsuario.json();
        if (resultado.data) {
            tipoSesionActual = "usuario";
            return resultado.data;
        }
    }

    const responseAdmin = await fetch(`${ADMIN_AUTH_API_URL}/me`, { credentials: "include" });
    if (responseAdmin.ok) {
        const resultado = await responseAdmin.json();
        if (resultado.data) {
            tipoSesionActual = "admin";
            return resultado.data;
        }
    }

    tipoSesionActual = null;
    return null;
}

async function cerrarSesion() {
    try {
        const urlLogout = tipoSesionActual === "admin" ? ADMIN_AUTH_API_URL : AUTH_API_URL;
        await csrfFetch(`${urlLogout}/logout`, { method: "POST" });
    } finally {
        window.location.href = "index.html";
    }
}

async function actualizarNavegacionAuth() {
    const contenedor = document.getElementById("auth-navigation");
    if (!contenedor) return;

    const usuario = await obtenerSesion().catch(() => null);
    contenedor.textContent = "";
    document.querySelectorAll(".registro-link").forEach((enlace) => {
        enlace.hidden = Boolean(usuario);
    });
    document.querySelectorAll(".cart-btn").forEach((enlace) => {
        enlace.closest(".nav-item")?.removeAttribute("hidden");
    });

    if (usuario) {
        const bienvenida = document.createElement("span");
        bienvenida.className = "auth-name";
        bienvenida.textContent = tipoSesionActual === "admin"
            ? "Administrador"
            : `${usuario.nombre} ${usuario.apellido || ""}`.trim();

        if (tipoSesionActual === "admin") {
            const panel = document.createElement("a");
            panel.href = "admin.html";
            panel.className = "auth-action admin-panel-link";
            panel.textContent = "Volver al panel";
            contenedor.appendChild(panel);
        }

        const logout = document.createElement("button");
        logout.type = "button";
        logout.className = "auth-action nav-logout";
        logout.textContent = "Cerrar sesión";
        logout.addEventListener("click", cerrarSesion);
        contenedor.append(bienvenida, logout);
        document.dispatchEvent(new CustomEvent("sesion-cargada", {
            detail: usuario
        }));
        return;
    }

    const login = document.createElement("a");
    login.href = "login.html";
    login.className = "auth-action";
    login.textContent = "Iniciar sesión";
    contenedor.appendChild(login);
    document.dispatchEvent(new CustomEvent("sesion-cargada", { detail: null }));
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarMenuMovil();
    actualizarNavegacionAuth();
});
