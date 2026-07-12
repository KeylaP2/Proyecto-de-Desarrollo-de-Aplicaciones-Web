const contadorCarrito = document.getElementById('contador-carrito');
const enlaceCarrito = document.querySelector('.cart-btn');
const botonesAgregar = document.querySelectorAll('.add-btn');
const filtrosMarca = document.querySelectorAll('.filter-group input[type="radio"]');
const tarjetasProductos = document.querySelectorAll('.product-card');
const CLAVE_CARRITO = 'carritoSoloTenis';
let modalCarrito;

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
    return carrito.some(producto => producto.id === idProducto);
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

function obtenerProductoDesdeTarjeta(tarjeta, indice) {
    const nombre = tarjeta.querySelector('h3')?.textContent.trim() || `Producto ${indice + 1}`;
    const precioTexto = tarjeta.querySelector('.price')?.textContent.trim() || '0';
    const marca = tarjeta.dataset.brand || '';

    return {
        id: `${marca}-${nombre}`.toLowerCase().replace(/\s+/g, '-'),
        nombre,
        marca,
        precio: obtenerPrecioNumerico(precioTexto),
        cantidad: 1
    };
}

function procesarAñadirCarrito(evento) {
    const botonSeleccionado = evento.currentTarget;
    const tarjeta = botonSeleccionado.closest('.product-card');

    if (!tarjeta) {
        return;
    }

    const indiceProducto = Array.from(tarjetasProductos).indexOf(tarjeta);
    const producto = obtenerProductoDesdeTarjeta(tarjeta, indiceProducto);
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push(producto);
    }

    guardarCarrito();
    actualizarNumeroContador();
    actualizarEstadoBotones();
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
