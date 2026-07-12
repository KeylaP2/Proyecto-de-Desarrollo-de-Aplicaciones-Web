const AUTH_API_URL = `http://${window.location.hostname}:3000/api/auth`;
const ADMIN_AUTH_API_URL = `http://${window.location.hostname}:3000/api/admin`;
let tipoSesionActual = null;

async function obtenerSesion() {
    const responseUsuario = await fetch(`${AUTH_API_URL}/me`, { credentials: "include" });
    if (responseUsuario.ok) {
        const resultado = await responseUsuario.json();
        tipoSesionActual = "usuario";
        return resultado.data || null;
    }

    const responseAdmin = await fetch(`${ADMIN_AUTH_API_URL}/me`, { credentials: "include" });
    if (responseAdmin.ok) {
        const resultado = await responseAdmin.json();
        tipoSesionActual = "admin";
        return resultado.data || null;
    }

    tipoSesionActual = null;
    return null;
}

async function cerrarSesion() {
    try {
        const urlLogout = tipoSesionActual === "admin" ? ADMIN_AUTH_API_URL : AUTH_API_URL;
        await fetch(`${urlLogout}/logout`, { method: "POST", credentials: "include" });
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

document.addEventListener("DOMContentLoaded", actualizarNavegacionAuth);
