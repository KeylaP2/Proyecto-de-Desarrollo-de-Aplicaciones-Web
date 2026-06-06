// Seleccionar elementos del DOM
const contadorCarrito = document.getElementById('contador-carrito');
const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');

// Inicializar carrito desde LocalStorage o como arreglo vacío
let carrito = JSON.parse(localStorage.getItem('carritoSoloTenis')) || [];

// Actualizar el número total de artículos en la interfaz
function actualizarNumeroContador() {
    const totalArticulos = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    contadorCarrito.innerHTML = totalArticulos;
}

// Lógica para añadir un producto al arreglo del carrito
function procesarAñadirCarrito(evento) {
    const botonSeleccionado = evento.target;
    
    // Obtener datos del producto desde los atributos del HTML
    const id = botonSeleccionado.getAttribute('data-id');
    const nombre = botonSeleccionado.getAttribute('data-nombre');
    const precio = parseFloat(botonSeleccionado.getAttribute('data-precio'));

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

    // Feedback visual temporal en el botón
    const textoOriginal = botonSeleccionado.innerHTML;
    botonSeleccionado.innerHTML = '¡Añadido! ✓';
    setTimeout(() => {
        botonSeleccionado.innerHTML = textoOriginal;
    }, 1000);
}

// Asignar evento click a todos los botones del catálogo
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', procesarAñadirCarrito);
});

// Renderizar estado del contador al cargar la página
actualizarNumeroContador();