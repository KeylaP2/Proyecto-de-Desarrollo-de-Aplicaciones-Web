// Seleccionar elementos del DOM
const contadorCarrito = document.getElementById('contador-carrito');
const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');

// Inicializar carrito desde LocalStorage o como arreglo vacío
let carrito = [];

try {
    const carritoGuardado = JSON.parse(localStorage.getItem('carritoSoloTenis')) || [];
    carrito = Array.isArray(carritoGuardado) ? carritoGuardado : [];
} catch (error) {
    carrito = [];
}

// Actualizar el número total de artículos en la interfaz
function actualizarNumeroContador() {
    const totalArticulos = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);

    if (contadorCarrito) {
        contadorCarrito.textContent = totalArticulos;
    }
}

// Lógica para añadir un producto al arreglo del carrito
function procesarAñadirCarrito(evento) {
    const botonSeleccionado = evento.currentTarget;

    // Obtener datos del producto desde los atributos del HTML
    const id = botonSeleccionado.getAttribute('data-id');
    const nombre = botonSeleccionado.getAttribute('data-nombre');
    const precio = parseFloat(botonSeleccionado.getAttribute('data-precio'));

    if (!id || !nombre || Number.isNaN(precio)) {
        return;
    }

    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        // Crear objeto del nuevo producto y agregarlo al arreglo
        const nuevoTenis = { id, nombre, precio, cantidad: 1 };
        carrito.push(nuevoTenis);
    }

    // Guardar estado actualizado en LocalStorage
    localStorage.setItem('carritoSoloTenis', JSON.stringify(carrito));

    actualizarNumeroContador();

    // Feedback visual temporal en el boton
    const textoOriginal = botonSeleccionado.textContent;
    botonSeleccionado.textContent = '¡Añadido! ✓';

    setTimeout(() => {
        botonSeleccionado.textContent = textoOriginal;
    }, 1000);
}

// Asignar evento click a todos los botones del catálogo
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', procesarAñadirCarrito);
});

// Renderizar estado del contador al cargar la página
actualizarNumeroContador();
