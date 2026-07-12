const contadorCarrito = document.getElementById('contador-carrito');
const enlaceCarrito = document.querySelector('.cart-btn');
const botonesAgregar = document.querySelectorAll('.add-btn');
const filtrosMarca = document.querySelectorAll('.filter-group input[type="radio"]');
const tarjetasProductos = document.querySelectorAll('.product-card');
const CLAVE_CARRITO = 'carritoSoloTenis';
const API_CARRITO_URL = `http://${window.location.hostname}:3000/api/carrito`;
const WHATSAPP_PEDIDOS = '18496556858';
const TALLAS_DISPONIBLES = ['38', '39', '40', '41', '42', '43', '44'];
const GENEROS_DISPONIBLES = ['Hombre', 'Mujer', 'Unisex'];
const STOCK_PREDETERMINADO = 12;
const DETALLES_POR_MARCA = {
    nike: { material: 'Cuero y textil de alta resistencia', suela: 'Goma con tracción urbana', uso: 'Casual y estilo urbano', ajuste: 'Cordones, ajuste regular' },
    jordan: { material: 'Cuero premium y paneles textiles', suela: 'Goma con patrón de tracción', uso: 'Lifestyle y colección', ajuste: 'Cordones, soporte acolchado' },
    adidas: { material: 'Exterior sintético y textil', suela: 'Goma de gran adherencia', uso: 'Casual y uso diario', ajuste: 'Cordones, ajuste cómodo' },
    reebok: { material: 'Cuero suave y forro textil', suela: 'Goma resistente a la abrasión', uso: 'Casual y caminata', ajuste: 'Cordones, corte bajo' },
    converse: { material: 'Lona resistente y detalles de goma', suela: 'Goma vulcanizada', uso: 'Casual y estilo clásico', ajuste: 'Cordones, perfil flexible' },
    'new balance': { material: 'Gamuza, cuero y malla', suela: 'Goma con amortiguación', uso: 'Casual y caminata', ajuste: 'Cordones, ajuste regular' },
    'alexander mcqueen': { material: 'Cuero premium', suela: 'Goma elevada tipo plataforma', uso: 'Moda y ocasiones especiales', ajuste: 'Cordones, horma amplia' },
    asics: { material: 'Malla transpirable y refuerzos sintéticos', suela: 'Goma con amortiguación GEL', uso: 'Running y uso diario', ajuste: 'Cordones, soporte ergonómico' }
};
let modalCarrito;
let modalConfiguracion;
let modalDetalles;
let indiceImagenDetalle = 0;
let imagenesDetalle = [];
let usuarioAutenticado = null;

let carrito = [];

function actualizarNumeroContador() {
    const totalArticulos = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);

    if (contadorCarrito) {
        contadorCarrito.textContent = totalArticulos;
    } else if (enlaceCarrito) {
        enlaceCarrito.textContent = `Carrito (${totalArticulos})`;
    }
}

function productoEstaEnCarrito(idProducto) {
    return carrito.some(producto => producto.productoBaseId === idProducto || producto.id === idProducto);
}

function actualizarEstadoBotones() {
    botonesAgregar.forEach((boton, indice) => {
        const tarjeta = boton.closest('.product-card');

        if (!tarjeta) {
            return;
        }

        const producto = obtenerProductoDesdeTarjeta(tarjeta, indice);
        const agregado = productoEstaEnCarrito(producto.id);

        boton.textContent = agregado ? 'Añadido ✓' : 'Añadir';
        boton.classList.toggle('is-added', agregado);
    });
}

async function guardarCarrito() {
    if (!usuarioAutenticado) return;

    try {
        const response = await csrfFetch(API_CARRITO_URL, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: carrito })
        });
        if (!response.ok) throw new Error('No se pudo guardar el carrito.');
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
    }
}

async function cargarCarritoDelUsuario(usuario) {
    usuarioAutenticado = usuario;
    carrito = [];
    localStorage.removeItem(CLAVE_CARRITO);

    if (usuario) {
        try {
            const response = await fetch(API_CARRITO_URL, { credentials: 'include' });
            if (!response.ok) throw new Error('No se pudo cargar el carrito.');
            const resultado = await response.json();
            carrito = Array.isArray(resultado.data) ? resultado.data : [];
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
        }
    }

    actualizarNumeroContador();
    actualizarEstadoBotones();
}

function obtenerPrecioNumerico(textoPrecio) {
    return Number(textoPrecio.replace(/[^\d.]/g, '')) || 0;
}

function esUrlImagenValida(url) {
    if (typeof url !== 'string' || !url.trim()) return false;
    try {
        const direccion = new URL(url, window.location.href);
        return ['http:', 'https:', 'data:', 'blob:'].includes(direccion.protocol);
    } catch {
        return false;
    }
}

function normalizarImagenes(imagenes) {
    return [...new Set((imagenes || []).filter(esUrlImagenValida))];
}

function obtenerFichaProducto(producto) {
    const detallesMarca = DETALLES_POR_MARCA[producto.marca] || {
        material: 'Materiales seleccionados para comodidad y durabilidad',
        suela: 'Goma de alta resistencia',
        uso: 'Casual y uso diario',
        ajuste: 'Cordones, ajuste regular'
    };
    const codigo = `STRD-${producto.productoBaseId.replace(/[^a-z0-9]/g, '').slice(0, 8).toUpperCase()}`;
    return {
        ...detallesMarca,
        codigo,
        color: 'Según la combinación mostrada',
        origen: 'Producto importado',
        descripcion: `${producto.nombre} es un modelo ${producto.categoria?.toLowerCase() || 'casual'} de ${producto.marca || 'SoloTenisRD'}, seleccionado por su equilibrio entre comodidad, diseño y resistencia. Su construcción ofrece soporte para acompañarte durante todo el día.`
    };
}

function obtenerProductoDesdeTarjeta(tarjeta, indice, talla = '', genero = '') {
    const nombre = tarjeta.querySelector('h3')?.textContent.trim() || `Producto ${indice + 1}`;
    const precioTexto = tarjeta.querySelector('.price')?.textContent.trim() || '0';
    const marca = tarjeta.dataset.brand || '';
    const imagenPrincipal = tarjeta.querySelector('.product-img')?.src || '';
    const imagenesAdicionales = (tarjeta.dataset.images || '')
        .split('|')
        .map(imagen => imagen.trim())
        .filter(Boolean);
    const imagenes = normalizarImagenes([imagenPrincipal, ...imagenesAdicionales]);
    const productoBaseId = `${marca}-${nombre}`.toLowerCase().replace(/\s+/g, '-');

    return {
        id: talla && genero ? `${productoBaseId}-${genero}-${talla}`.toLowerCase().replace(/\s+/g, '-') : productoBaseId,
        productoBaseId,
        nombre,
        marca,
        categoria: tarjeta.querySelector('.category')?.textContent.trim() || 'Tenis',
        imagen: imagenPrincipal,
        imagenes,
        precio: obtenerPrecioNumerico(precioTexto),
        talla,
        genero,
        stock: Number(tarjeta.dataset.stock) || STOCK_PREDETERMINADO,
        cantidad: 1
    };
}

function completarDatosProducto(producto) {
    const tarjeta = Array.from(tarjetasProductos).find((elemento, indice) => {
        const datos = obtenerProductoDesdeTarjeta(elemento, indice);
        return datos.productoBaseId === producto.productoBaseId || datos.id === producto.productoBaseId;
    });

    if (!tarjeta) {
        return {
            ...producto,
            categoria: producto.categoria || 'Tenis',
            imagenes: producto.imagenes?.length ? producto.imagenes : [producto.imagen].filter(Boolean)
        };
    }

    const datosTarjeta = obtenerProductoDesdeTarjeta(tarjeta, Array.from(tarjetasProductos).indexOf(tarjeta));
    return {
        ...datosTarjeta,
        ...producto,
        imagen: producto.imagen || datosTarjeta.imagen,
        imagenes: producto.imagenes?.length ? producto.imagenes : datosTarjeta.imagenes,
        categoria: producto.categoria || datosTarjeta.categoria
    };
}

function crearModalDetalles() {
    const modal = document.createElement('section');
    modal.className = 'cart-modal product-detail-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <article class="product-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button type="button" class="cart-close detail-close" aria-label="Cerrar detalles">×</button>
            <section class="product-gallery" aria-label="Galería del producto">
                <button type="button" class="gallery-control gallery-previous" aria-label="Imagen anterior">‹</button>
                <img class="detail-image" src="" alt="">
                <button type="button" class="gallery-control gallery-next" aria-label="Imagen siguiente">›</button>
                <span class="gallery-counter" aria-live="polite"></span>
                <span class="gallery-help">Usa las flechas para navegar</span>
            </section>
            <section class="product-detail-content">
                <div class="detail-labels">
                    <span class="detail-category"></span>
                    <span class="detail-availability">● Disponible</span>
                </div>
                <h2 id="detail-title"></h2>
                <div class="detail-meta"><span class="detail-brand"></span><span class="detail-sku"></span></div>
                <p class="detail-description"></p>
                <dl class="detail-specifications">
                    <div><dt>Precio</dt><dd class="detail-price"></dd></div>
                    <div><dt>Género</dt><dd class="detail-gender"></dd></div>
                    <div><dt>Talla</dt><dd class="detail-size"></dd></div>
                    <div><dt>Disponibles</dt><dd class="detail-stock"></dd></div>
                </dl>
                <section class="detail-features" aria-labelledby="features-title">
                    <h3 id="features-title">Características</h3>
                    <dl>
                        <div><dt>Material</dt><dd class="detail-material"></dd></div>
                        <div><dt>Suela</dt><dd class="detail-sole"></dd></div>
                        <div><dt>Color</dt><dd class="detail-color"></dd></div>
                        <div><dt>Uso recomendado</dt><dd class="detail-use"></dd></div>
                        <div><dt>Ajuste</dt><dd class="detail-fit"></dd></div>
                        <div><dt>Procedencia</dt><dd class="detail-origin"></dd></div>
                    </dl>
                </section>
                <section class="detail-benefits" aria-label="Beneficios de compra">
                    <article><span aria-hidden="true">✓</span><div><strong>Compra segura</strong><small>Tu información está protegida</small></div></article>
                    <article><span aria-hidden="true">↺</span><div><strong>Cambios disponibles</strong><small>Conserva el producto sin uso</small></div></article>
                    <article><span aria-hidden="true">✦</span><div><strong>Producto seleccionado</strong><small>Calidad verificada por SoloTenisRD</small></div></article>
                </section>
                <p class="detail-care"><strong>Cuidado:</strong> limpiar a mano con paño húmedo, jabón neutro y secar a la sombra.</p>
            </section>
        </article>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.detail-close').addEventListener('click', cerrarDetalles);
    modal.querySelector('.gallery-previous').addEventListener('click', () => cambiarImagenDetalle(-1));
    modal.querySelector('.gallery-next').addEventListener('click', () => cambiarImagenDetalle(1));
    modal.querySelector('.detail-image').addEventListener('error', manejarErrorImagenDetalle);
    modal.addEventListener('click', evento => {
        if (evento.target === modal) cerrarDetalles();
    });
    return modal;
}

function manejarErrorImagenDetalle() {
    if (!imagenesDetalle.length) return;
    imagenesDetalle.splice(indiceImagenDetalle, 1);
    if (indiceImagenDetalle >= imagenesDetalle.length) indiceImagenDetalle = 0;
    actualizarImagenDetalle();
}

function actualizarImagenDetalle() {
    if (!modalDetalles) return;
    const imagen = modalDetalles.querySelector('.detail-image');
    const galeria = modalDetalles.querySelector('.product-gallery');
    const contador = modalDetalles.querySelector('.gallery-counter');
    if (!imagenesDetalle.length) {
        imagen.hidden = true;
        imagen.removeAttribute('src');
        galeria.classList.add('without-image');
        contador.hidden = true;
        modalDetalles.querySelectorAll('.gallery-control').forEach(control => { control.hidden = true; });
        return;
    }
    imagen.hidden = false;
    galeria.classList.remove('without-image');
    imagen.src = imagenesDetalle[indiceImagenDetalle];
    contador.hidden = false;
    contador.textContent = `${indiceImagenDetalle + 1} / ${imagenesDetalle.length}`;
    modalDetalles.querySelectorAll('.gallery-control').forEach(control => {
        control.hidden = imagenesDetalle.length <= 1;
    });
}

function cambiarImagenDetalle(direccion) {
    if (imagenesDetalle.length <= 1) return;
    indiceImagenDetalle = (indiceImagenDetalle + direccion + imagenesDetalle.length) % imagenesDetalle.length;
    actualizarImagenDetalle();
}

function abrirDetallesProducto(productoOriginal) {
    const producto = completarDatosProducto(productoOriginal);
    const ficha = obtenerFichaProducto(producto);
    if (!modalDetalles) modalDetalles = crearModalDetalles();

    imagenesDetalle = normalizarImagenes(producto.imagenes?.length ? producto.imagenes : [producto.imagen]);
    indiceImagenDetalle = 0;
    const imagen = modalDetalles.querySelector('.detail-image');
    imagen.alt = `Vista ampliada de ${producto.nombre}`;
    modalDetalles.querySelector('#detail-title').textContent = producto.nombre;
    modalDetalles.querySelector('.detail-category').textContent = producto.categoria || 'Tenis';
    modalDetalles.querySelector('.detail-brand').textContent = (producto.marca || 'SoloTenisRD').toUpperCase();
    modalDetalles.querySelector('.detail-sku').textContent = `Código: ${ficha.codigo}`;
    modalDetalles.querySelector('.detail-description').textContent = ficha.descripcion;
    modalDetalles.querySelector('.detail-price').textContent = formatearPrecio(producto.precio);
    modalDetalles.querySelector('.detail-gender').textContent = producto.genero || 'Disponible en varias opciones';
    modalDetalles.querySelector('.detail-size').textContent = producto.talla || 'Consulta las tallas disponibles';
    modalDetalles.querySelector('.detail-stock').textContent = `${obtenerStockDisponible(producto)} pares`;
    modalDetalles.querySelector('.detail-material').textContent = ficha.material;
    modalDetalles.querySelector('.detail-sole').textContent = ficha.suela;
    modalDetalles.querySelector('.detail-color').textContent = ficha.color;
    modalDetalles.querySelector('.detail-use').textContent = ficha.uso;
    modalDetalles.querySelector('.detail-fit').textContent = ficha.ajuste;
    modalDetalles.querySelector('.detail-origin').textContent = ficha.origen;
    const disponible = obtenerStockDisponible(producto) > 0;
    const estado = modalDetalles.querySelector('.detail-availability');
    estado.textContent = disponible ? '● Disponible' : '● Agotado';
    estado.classList.toggle('is-sold-out', !disponible);
    actualizarImagenDetalle();
    modalDetalles.classList.add('is-open');
    modalDetalles.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function cerrarDetalles() {
    if (!modalDetalles) return;
    modalDetalles.classList.remove('is-open');
    modalDetalles.setAttribute('aria-hidden', 'true');
    if (!modalCarrito?.classList.contains('is-open')) document.body.classList.remove('modal-open');
}

function obtenerCantidadEnCarrito(productoBaseId) {
    return carrito.reduce((total, producto) => {
        const esMismoProducto = producto.productoBaseId === productoBaseId || producto.id === productoBaseId;
        return total + (esMismoProducto ? producto.cantidad : 0);
    }, 0);
}

function obtenerStockDisponible(producto) {
    const stock = Number(producto.stock) || STOCK_PREDETERMINADO;
    return Math.max(0, stock - obtenerCantidadEnCarrito(producto.productoBaseId));
}

function crearModalConfiguracion() {
    const modal = document.createElement('section');
    modal.className = 'cart-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <article class="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="product-config-title">
            <header class="cart-header">
                <h2 id="product-config-title">Personaliza tu tenis</h2>
                <button type="button" class="cart-close" aria-label="Cerrar selección">×</button>
            </header>
            <form class="product-config-form p-3">
                <p class="product-config-name fw-bold mb-3"></p>
                <label class="form-label" for="seleccion-genero">Género</label>
                <select class="form-select mb-3" id="seleccion-genero" required></select>
                <label class="form-label" for="seleccion-talla">Talla (US)</label>
                <select class="form-select mb-3" id="seleccion-talla" required></select>
                <p class="stock-disponible text-muted mb-3"></p>
                <p class="config-error text-danger small" aria-live="polite"></p>
                <button type="submit" class="btn btn-dark w-100">Añadir al carrito</button>
            </form>
        </article>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.cart-close').addEventListener('click', cerrarConfiguracion);
    modal.addEventListener('click', evento => {
        if (evento.target === modal) cerrarConfiguracion();
    });
    modal.querySelector('.product-config-form').addEventListener('submit', confirmarProductoConfigurado);
    return modal;
}

function cerrarConfiguracion() {
    if (!modalConfiguracion) return;
    modalConfiguracion.classList.remove('is-open');
    modalConfiguracion.setAttribute('aria-hidden', 'true');
}

function llenarOpciones(select, opciones, placeholder) {
    select.textContent = '';
    const opcionInicial = document.createElement('option');
    opcionInicial.value = '';
    opcionInicial.textContent = placeholder;
    opcionInicial.disabled = true;
    opcionInicial.selected = true;
    select.appendChild(opcionInicial);

    opciones.forEach(opcion => {
        const elemento = document.createElement('option');
        elemento.value = opcion;
        elemento.textContent = opcion;
        select.appendChild(elemento);
    });
}

function abrirConfiguracionProducto(tarjeta) {
    const indiceProducto = Array.from(tarjetasProductos).indexOf(tarjeta);
    const producto = obtenerProductoDesdeTarjeta(tarjeta, indiceProducto);

    if (!modalConfiguracion) modalConfiguracion = crearModalConfiguracion();

    modalConfiguracion.dataset.productoBaseId = producto.productoBaseId;
    modalConfiguracion.querySelector('.product-config-name').textContent = producto.nombre;
    llenarOpciones(modalConfiguracion.querySelector('#seleccion-genero'), GENEROS_DISPONIBLES, 'Selecciona un género');
    llenarOpciones(modalConfiguracion.querySelector('#seleccion-talla'), TALLAS_DISPONIBLES, 'Selecciona una talla');
    modalConfiguracion.querySelector('.config-error').textContent = '';
    modalConfiguracion.querySelector('.stock-disponible').textContent = `Stock disponible: ${obtenerStockDisponible(producto)} pares`;
    modalConfiguracion.classList.add('is-open');
    modalConfiguracion.setAttribute('aria-hidden', 'false');
}

function procesarAñadirCarrito(evento) {
    if (!usuarioAutenticado) {
        window.alert('Inicia sesión para añadir productos y guardar tu carrito.');
        window.location.href = 'login.html';
        return;
    }

    const tarjeta = evento.currentTarget.closest('.product-card');

    if (!tarjeta) {
        return;
    }

    abrirConfiguracionProducto(tarjeta);
}

function confirmarProductoConfigurado(evento) {
    evento.preventDefault();
    const genero = modalConfiguracion.querySelector('#seleccion-genero').value;
    const talla = modalConfiguracion.querySelector('#seleccion-talla').value;
    const errorConfiguracion = modalConfiguracion.querySelector('.config-error');
    const tarjeta = Array.from(tarjetasProductos).find(producto => {
        const indice = Array.from(tarjetasProductos).indexOf(producto);
        return obtenerProductoDesdeTarjeta(producto, indice).productoBaseId === modalConfiguracion.dataset.productoBaseId;
    });

    if (!genero || !talla || !tarjeta) {
        errorConfiguracion.textContent = 'Selecciona el género y la talla para continuar.';
        return;
    }

    const indiceProducto = Array.from(tarjetasProductos).indexOf(tarjeta);
    const producto = obtenerProductoDesdeTarjeta(tarjeta, indiceProducto, talla, genero);

    if (obtenerStockDisponible(producto) <= 0) {
        errorConfiguracion.textContent = 'Este modelo ya no tiene stock disponible.';
        return;
    }

    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(producto);
    }

    guardarCarrito();
    actualizarNumeroContador();
    actualizarEstadoBotones();
    cerrarConfiguracion();
}

function obtenerMarcasSeleccionadas() {
    const filtroSeleccionado = Array.from(filtrosMarca).find(filtro => filtro.checked);
    return filtroSeleccionado?.value ? [filtroSeleccionado.value] : [];
}

function aplicarFiltros() {
    const marcasSeleccionadas = obtenerMarcasSeleccionadas();

    tarjetasProductos.forEach(tarjeta => {
        const marcaProducto = tarjeta.dataset.brand || '';
        const debeMostrarse = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(marcaProducto);
        const columnaProducto = tarjeta.closest('.product-card-wrapper') || tarjeta;
        columnaProducto.style.display = debeMostrarse ? '' : 'none';
    });
}

function formatearPrecio(valor) {
    return `$${valor.toLocaleString('es-DO')}`;
}

function calcularTotalCarrito() {
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
}

function generarCodigoPedido() {
    const fecha = new Date();
    const partes = [
        fecha.getFullYear(),
        String(fecha.getMonth() + 1).padStart(2, '0'),
        String(fecha.getDate()).padStart(2, '0'),
        String(fecha.getHours()).padStart(2, '0'),
        String(fecha.getMinutes()).padStart(2, '0')
    ];
    return `STRD-${partes.join('')}`;
}

function generarMensajePedidoWhatsapp() {
    const codigo = generarCodigoPedido();
    const cliente = usuarioAutenticado
        ? `${usuarioAutenticado.nombre || ''} ${usuarioAutenticado.apellido || ''}`.trim()
        : 'Cliente';
    const lineasProductos = carrito.flatMap((producto, indice) => [
        `*${indice + 1}. ${producto.nombre}*`,
        `Marca: ${(producto.marca || 'SoloTenisRD').toUpperCase()}`,
        `Género: ${producto.genero || 'No especificado'} | Talla: ${producto.talla || 'No especificada'}`,
        `Cantidad: ${producto.cantidad} × ${formatearPrecio(producto.precio)}`,
        `Subtotal: *${formatearPrecio(producto.precio * producto.cantidad)}*`,
        ''
    ]);

    return [
        '👟 *NUEVO PEDIDO — SoloTenisRD*',
        `Pedido: *${codigo}*`,
        `Cliente: ${cliente}`,
        usuarioAutenticado?.email ? `Correo: ${usuarioAutenticado.email}` : null,
        '',
        '🛍️ *ARTÍCULOS*',
        ...lineasProductos,
        `💰 *TOTAL: ${formatearPrecio(calcularTotalCarrito())}*`,
        '',
        '📍 Por favor, indícame la dirección de entrega, un teléfono de contacto y el método de pago disponible.',
        '',
        'Quedo atento/a a la confirmación del pedido. ¡Gracias!'
    ].filter(linea => linea !== null).join('\n');
}

function comprarPorWhatsapp() {
    if (!carrito.length) {
        window.alert('Tu carrito está vacío. Agrega al menos un producto para comprar.');
        return;
    }

    const mensaje = generarMensajePedidoWhatsapp();
    const urlWhatsapp = `https://wa.me/${WHATSAPP_PEDIDOS}?text=${encodeURIComponent(mensaje)}`;
    const ventanaWhatsapp = window.open(urlWhatsapp, '_blank', 'noopener,noreferrer');

    if (!ventanaWhatsapp) {
        window.location.href = urlWhatsapp;
    }
}

function crearModalCarrito() {
    const modal = document.createElement('section');
    modal.className = 'cart-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <article class="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <header class="cart-header">
                <h2 id="cart-title">Carrito</h2>
                <button type="button" class="cart-close" aria-label="Cerrar carrito">×</button>
            </header>
            <section class="cart-items"></section>
            <footer class="cart-footer">
                <strong class="cart-total"></strong>
                <div class="cart-footer-actions">
                    <button type="button" class="cart-clear">Vaciar carrito</button>
                    <button type="button" class="cart-checkout">
                        <svg aria-hidden="true" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3A12.8 12.8 0 0 0 5 22.4L3.2 29l6.8-1.8A13 13 0 1 0 16 3Zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 .9 1-3.8-.3-.4A10.5 10.5 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.8.2l-1 1.2c-.2.3-.4.3-.7.1-2-.9-3.3-1.7-4.6-4-.4-.7.4-.6 1.1-2 .1-.3.1-.5 0-.7l-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-.3.4-1.3 1.3-1.3 3.2s1.4 3.7 1.6 4c.2.2 2.7 4.1 6.5 5.7 2.4 1 3.4 1.1 4.6.9.7-.1 1.9-.8 2.1-1.5.3-.8.3-1.4.2-1.5-.2-.3-.4-.4-.7-.5Z"/></svg>
                        Comprar por WhatsApp
                    </button>
                </div>
            </footer>
        </article>
    `;
    document.body.appendChild(modal);
    return modal;
}

function cerrarCarrito() {
    if (!modalCarrito) {
        return;
    }

    modalCarrito.classList.remove('is-open');
    modalCarrito.setAttribute('aria-hidden', 'true');
    if (!modalDetalles?.classList.contains('is-open')) document.body.classList.remove('modal-open');
}

function eliminarProductoDelCarrito(idProducto) {
    carrito = carrito.filter(producto => producto.id !== idProducto);
    guardarCarrito();
    actualizarNumeroContador();
    actualizarEstadoBotones();
    renderizarCarrito();
}

function cambiarCantidadProducto(idProducto, cambio) {
    const producto = carrito.find(item => item.id === idProducto);

    if (!producto) {
        return;
    }

    if (cambio > 0 && obtenerStockDisponible(producto) <= 0) {
        window.alert('No hay más unidades disponibles de este modelo.');
        return;
    }

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        eliminarProductoDelCarrito(idProducto);
        return;
    }

    guardarCarrito();
    actualizarNumeroContador();
    actualizarEstadoBotones();
    renderizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarNumeroContador();
    actualizarEstadoBotones();
    renderizarCarrito();
}

function renderizarCarrito() {
    if (!modalCarrito) {
        modalCarrito = crearModalCarrito();
    }

    const contenedorItems = modalCarrito.querySelector('.cart-items');
    const totalCarrito = modalCarrito.querySelector('.cart-total');
    const botonVaciar = modalCarrito.querySelector('.cart-clear');
    const botonComprar = modalCarrito.querySelector('.cart-checkout');

    contenedorItems.textContent = '';

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement('article');
        mensajeVacio.className = 'cart-empty';
        mensajeVacio.innerHTML = `
            <strong>Tu carrito está vacío</strong>
            <span>Agrega tus tenis favoritos para verlos aquí.</span>
        `;
        contenedorItems.appendChild(mensajeVacio);
        totalCarrito.textContent = 'Total: $0';
        botonVaciar.disabled = true;
        botonComprar.disabled = true;
        return;
    }

    carrito.forEach(productoGuardado => {
        const producto = completarDatosProducto(productoGuardado);
        const item = document.createElement('article');
        item.className = 'cart-item';

        const botonImagen = document.createElement('button');
        botonImagen.type = 'button';
        botonImagen.className = 'cart-product-image-button';
        botonImagen.setAttribute('aria-label', `Ver imagen completa de ${producto.nombre}`);

        if (producto.imagen) {
            const imagen = document.createElement('img');
            imagen.className = 'cart-product-image';
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;
            imagen.loading = 'lazy';
            imagen.addEventListener('error', () => {
                botonImagen.classList.add('without-image');
                botonImagen.textContent = 'Imagen no disponible';
                botonImagen.disabled = true;
            }, { once: true });
            botonImagen.appendChild(imagen);
            botonImagen.addEventListener('click', () => abrirDetallesProducto(producto));
        } else {
            botonImagen.classList.add('without-image');
            botonImagen.textContent = 'Sin imagen';
            botonImagen.disabled = true;
        }

        const informacion = document.createElement('section');
        informacion.className = 'cart-product-info';

        const nombre = document.createElement('strong');
        nombre.textContent = producto.nombre;

        const marca = document.createElement('small');
        marca.textContent = producto.marca ? producto.marca.toUpperCase() : 'TENIS';

        const variante = document.createElement('small');
        variante.textContent = `Género: ${producto.genero || 'No especificado'} | Talla: ${producto.talla || 'No especificada'} | Stock restante: ${obtenerStockDisponible(producto)}`;

        const precioUnitario = document.createElement('span');
        precioUnitario.className = 'cart-unit-price';
        precioUnitario.textContent = formatearPrecio(producto.precio);

        const botonDetalles = document.createElement('button');
        botonDetalles.type = 'button';
        botonDetalles.className = 'cart-details';
        botonDetalles.textContent = 'Ver detalles';
        botonDetalles.addEventListener('click', () => abrirDetallesProducto(producto));

        const controlesCantidad = document.createElement('section');
        controlesCantidad.className = 'cart-quantity';

        const botonRestar = document.createElement('button');
        botonRestar.type = 'button';
        botonRestar.textContent = '−';
        botonRestar.setAttribute('aria-label', `Disminuir cantidad de ${producto.nombre}`);
        botonRestar.addEventListener('click', () => cambiarCantidadProducto(producto.id, -1));

        const cantidad = document.createElement('span');
        cantidad.textContent = producto.cantidad;

        const botonSumar = document.createElement('button');
        botonSumar.type = 'button';
        botonSumar.textContent = '+';
        botonSumar.setAttribute('aria-label', `Aumentar cantidad de ${producto.nombre}`);
        botonSumar.addEventListener('click', () => cambiarCantidadProducto(producto.id, 1));

        const subtotal = document.createElement('span');
        subtotal.className = 'cart-subtotal';
        subtotal.textContent = formatearPrecio(producto.precio * producto.cantidad);

        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'cart-remove';
        botonEliminar.textContent = 'Quitar';
        botonEliminar.addEventListener('click', () => eliminarProductoDelCarrito(producto.id));

        informacion.appendChild(nombre);
        informacion.appendChild(marca);
        informacion.appendChild(variante);
        informacion.appendChild(precioUnitario);
        informacion.appendChild(botonDetalles);
        controlesCantidad.appendChild(botonRestar);
        controlesCantidad.appendChild(cantidad);
        controlesCantidad.appendChild(botonSumar);
        item.appendChild(botonImagen);
        item.appendChild(informacion);
        item.appendChild(controlesCantidad);
        item.appendChild(subtotal);
        item.appendChild(botonEliminar);
        contenedorItems.appendChild(item);
    });

    totalCarrito.textContent = `Total: ${formatearPrecio(calcularTotalCarrito())}`;
    botonVaciar.disabled = false;
    botonComprar.disabled = false;
}

function abrirCarrito() {
    if (!modalCarrito) {
        modalCarrito = crearModalCarrito();

        modalCarrito.querySelector('.cart-close').addEventListener('click', cerrarCarrito);
        modalCarrito.querySelector('.cart-clear').addEventListener('click', vaciarCarrito);
        modalCarrito.querySelector('.cart-checkout').addEventListener('click', comprarPorWhatsapp);
        modalCarrito.addEventListener('click', evento => {
            if (evento.target === modalCarrito) {
                cerrarCarrito();
            }
        });
    }

    renderizarCarrito();
    modalCarrito.classList.add('is-open');
    modalCarrito.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

botonesAgregar.forEach(boton => {
    boton.addEventListener('click', procesarAñadirCarrito);
});

tarjetasProductos.forEach((tarjeta, indice) => {
    const imagen = tarjeta.querySelector('.product-img');
    if (!imagen) return;
    imagen.tabIndex = 0;
    imagen.setAttribute('role', 'button');
    imagen.setAttribute('aria-label', `Ver detalles e imagen completa de ${imagen.alt}`);
    const abrir = () => abrirDetallesProducto(obtenerProductoDesdeTarjeta(tarjeta, indice));
    imagen.addEventListener('click', abrir);
    imagen.addEventListener('keydown', evento => {
        if (evento.key === 'Enter' || evento.key === ' ') {
            evento.preventDefault();
            abrir();
        }
    });
});

document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') {
        if (modalDetalles?.classList.contains('is-open')) cerrarDetalles();
        else if (modalCarrito?.classList.contains('is-open')) cerrarCarrito();
        else if (modalConfiguracion?.classList.contains('is-open')) cerrarConfiguracion();
    }
    if (modalDetalles?.classList.contains('is-open') && evento.key === 'ArrowLeft') cambiarImagenDetalle(-1);
    if (modalDetalles?.classList.contains('is-open') && evento.key === 'ArrowRight') cambiarImagenDetalle(1);
});

filtrosMarca.forEach(filtro => {
    filtro.addEventListener('change', aplicarFiltros);
});

if (enlaceCarrito) {
    enlaceCarrito.addEventListener('click', evento => {
        evento.preventDefault();
        if (!usuarioAutenticado) {
            window.alert('Inicia sesión para ver tu carrito.');
            window.location.href = 'login.html';
            return;
        }
        abrirCarrito();
    });
}

document.addEventListener('sesion-cargada', evento => {
    cargarCarritoDelUsuario(evento.detail);
});

actualizarNumeroContador();
actualizarEstadoBotones();
aplicarFiltros();
