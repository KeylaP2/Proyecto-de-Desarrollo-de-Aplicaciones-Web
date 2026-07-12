const contadorCarrito = document.getElementById('contador-carrito');
const enlaceCarrito = document.querySelector('.cart-btn');
const botonesAgregar = document.querySelectorAll('.add-btn');
const filtrosMarca = document.querySelectorAll('.filter-group input[type="radio"]');
const tarjetasProductos = document.querySelectorAll('.product-card');
const CLAVE_CARRITO = 'carritoSoloTenis';
const TALLAS_DISPONIBLES = ['38', '39', '40', '41', '42', '43', '44'];
const GENEROS_DISPONIBLES = ['Hombre', 'Mujer', 'Unisex'];
const STOCK_PREDETERMINADO = 12;
let modalCarrito;
let modalConfiguracion;

let carrito = [];

try {
    const carritoGuardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    carrito = Array.isArray(carritoGuardado) ? carritoGuardado : [];
} catch (error) {
    carrito = [];
}

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

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function obtenerPrecioNumerico(textoPrecio) {
    return Number(textoPrecio.replace(/[^\d.]/g, '')) || 0;
}

function obtenerProductoDesdeTarjeta(tarjeta, indice, talla = '', genero = '') {
    const nombre = tarjeta.querySelector('h3')?.textContent.trim() || `Producto ${indice + 1}`;
    const precioTexto = tarjeta.querySelector('.price')?.textContent.trim() || '0';
    const marca = tarjeta.dataset.brand || '';
    const productoBaseId = `${marca}-${nombre}`.toLowerCase().replace(/\s+/g, '-');

    return {
        id: talla && genero ? `${productoBaseId}-${genero}-${talla}`.toLowerCase().replace(/\s+/g, '-') : productoBaseId,
        productoBaseId,
        nombre,
        marca,
        precio: obtenerPrecioNumerico(precioTexto),
        talla,
        genero,
        stock: Number(tarjeta.dataset.stock) || STOCK_PREDETERMINADO,
        cantidad: 1
    };
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
                <button type="button" class="cart-clear">Vaciar carrito</button>
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
        return;
    }

    carrito.forEach(producto => {
        const item = document.createElement('article');
        item.className = 'cart-item';

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
        controlesCantidad.appendChild(botonRestar);
        controlesCantidad.appendChild(cantidad);
        controlesCantidad.appendChild(botonSumar);
        item.appendChild(informacion);
        item.appendChild(controlesCantidad);
        item.appendChild(subtotal);
        item.appendChild(botonEliminar);
        contenedorItems.appendChild(item);
    });

    totalCarrito.textContent = `Total: ${formatearPrecio(calcularTotalCarrito())}`;
    botonVaciar.disabled = false;
}

function abrirCarrito() {
    if (!modalCarrito) {
        modalCarrito = crearModalCarrito();

        modalCarrito.querySelector('.cart-close').addEventListener('click', cerrarCarrito);
        modalCarrito.querySelector('.cart-clear').addEventListener('click', vaciarCarrito);
        modalCarrito.addEventListener('click', evento => {
            if (evento.target === modalCarrito) {
                cerrarCarrito();
            }
        });
    }

    renderizarCarrito();
    modalCarrito.classList.add('is-open');
    modalCarrito.setAttribute('aria-hidden', 'false');
}

botonesAgregar.forEach(boton => {
    boton.addEventListener('click', procesarAñadirCarrito);
});

filtrosMarca.forEach(filtro => {
    filtro.addEventListener('change', aplicarFiltros);
});

if (enlaceCarrito) {
    enlaceCarrito.addEventListener('click', evento => {
        evento.preventDefault();
        abrirCarrito();
    });
}

actualizarNumeroContador();
actualizarEstadoBotones();
aplicarFiltros();
