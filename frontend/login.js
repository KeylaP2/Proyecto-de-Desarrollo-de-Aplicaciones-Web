const formularioLogin = document.getElementById("login-form");
const mensajeLogin = document.getElementById("login-mensaje");
const API_LOGIN_URL = `http://${window.location.hostname}:3000/api/auth/login`;

formularioLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const boton = formularioLogin.querySelector("button[type='submit']");
    mensajeLogin.className = "small text-center";
    mensajeLogin.textContent = "";
    boton.disabled = true;
    try {
        const response = await fetch(API_LOGIN_URL, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
        const resultado = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(resultado.message || "No fue posible iniciar sesión.");
        mensajeLogin.classList.add("msg-exito");
        const esAdministrador = resultado.data.role === "admin";
        mensajeLogin.textContent = esAdministrador
            ? "Acceso administrativo correcto. Abriendo el panel..."
            : `Bienvenido/a, ${resultado.data.nombre}. Redirigiendo...`;
        window.setTimeout(() => {
            window.location.href = esAdministrador ? "admin.html" : "index.html";
        }, 500);
    } catch (error) {
        mensajeLogin.classList.add("msg-error");
        mensajeLogin.textContent = error.message;
        boton.disabled = false;
    }
});
