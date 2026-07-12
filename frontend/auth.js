const AUTH_API_URL = `http://${window.location.hostname}:3000/api/auth`;

async function obtenerSesion() {
    const response = await fetch(`${AUTH_API_URL}/me`, { credentials: "include" });
    if (!response.ok) return null;
    const resultado = await response.json();
    return resultado.data || null;
}

async function cerrarSesion() {
    try {
        await fetch(`${AUTH_API_URL}/logout`, { method: "POST", credentials: "include" });
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

    if (usuario) {
        const bienvenida = document.createElement("span");
        bienvenida.className = "auth-name";
        bienvenida.textContent = `${usuario.nombre} ${usuario.apellido || ""}`.trim();

        const logout = document.createElement("button");
        logout.type = "button";
        logout.className = "auth-action nav-logout";
        logout.textContent = "Cerrar sesión";
        logout.addEventListener("click", cerrarSesion);
        contenedor.append(bienvenida, logout);
        document.dispatchEvent(new CustomEvent("sesion-cargada", { detail: usuario }));
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
