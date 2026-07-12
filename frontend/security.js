const SECURITY_API_URL = `http://${window.location.hostname}:3000/api/security`;
let csrfTokenCache = null;

async function obtenerTokenCsrf(forzar = false) {
    if (csrfTokenCache && !forzar) return csrfTokenCache;
    const response = await fetch(`${SECURITY_API_URL}/csrf`, { credentials: 'include' });
    if (!response.ok) throw new Error('No se pudo iniciar la protección de seguridad.');
    const resultado = await response.json();
    csrfTokenCache = resultado.data.csrfToken;
    return csrfTokenCache;
}

async function csrfFetch(url, opciones = {}, reintentar = true) {
    const metodo = String(opciones.method || 'GET').toUpperCase();
    if (['GET', 'HEAD', 'OPTIONS'].includes(metodo)) {
        return fetch(url, { credentials: 'include', ...opciones });
    }
    const token = await obtenerTokenCsrf();
    const headers = new Headers(opciones.headers || {});
    headers.set('X-CSRF-Token', token);
    const response = await fetch(url, { credentials: 'include', ...opciones, headers });
    if (response.status === 403 && reintentar) {
        const resultado = await response.clone().json().catch(() => ({}));
        if (resultado.code === 'CSRF_INVALID') {
            await obtenerTokenCsrf(true);
            return csrfFetch(url, opciones, false);
        }
    }
    return response;
}

window.csrfFetch = csrfFetch;
