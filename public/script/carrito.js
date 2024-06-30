import { realizarCompra } from './compra.js';

const CARRITO_KEY = 'carrito_compras';

export function inicializarCarrito() {
    actualizarVistaCarrito();
    document.getElementById('comprarBtn').addEventListener('click', realizarCompra);
}

export function agregarAlCarrito(idProducto) {
    let carrito = obtenerCarrito();
    const productoEnCarrito = carrito.find(item => item.id_producto === idProducto);
    
    if (productoEnCarrito) {
        productoEnCarrito.cant++;
    } else {
        carrito.push({ id_producto: idProducto, cant: 1 });
    }
    
    guardarCarrito(carrito);
    actualizarVistaCarrito();
}

export function eliminarDelCarrito(idProducto) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id_producto !== idProducto);
    guardarCarrito(carrito);
    actualizarVistaCarrito();
}

export function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem(CARRITO_KEY);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

async function actualizarVistaCarrito() {
    const carrito = obtenerCarrito();
    const carritoElement = document.getElementById('carrito');
    carritoElement.innerHTML = '';
    let total = 0;

    for (const item of carrito) {
        const producto = await obtenerDetallesProducto(item.id_producto);
        const subtotal = producto.precio * item.cant;
        total += subtotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center mb-2';
        itemElement.innerHTML = `
            <span>${producto.nombre} (x${item.cant})</span>
            <span>$${subtotal.toFixed(2)}</span>
            <button class="eliminarDelCarrito" data-id="${item.id_producto}">X</button>
        `;
        carritoElement.appendChild(itemElement);
    }

    document.getElementById('totalCarrito').textContent = total.toFixed(2);

    document.querySelectorAll('.eliminarDelCarrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const idProducto = parseInt(e.target.dataset.id);
            eliminarDelCarrito(idProducto);
        });
    });
}

async function obtenerDetallesProducto(idProducto) {
    try {
        const response = await fetch(`/productos/buscarProductoPorId/${idProducto}`);
        if (!response.ok) {
            throw new Error('Error al obtener detalles del producto');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export function vaciarCarrito() {
    localStorage.removeItem(CARRITO_KEY);
    actualizarVistaCarrito();
}