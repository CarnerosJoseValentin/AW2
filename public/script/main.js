import { inicializarLogin } from './login.js';
import { cargarProductos, filtrarProductos } from './productos.js';
import { inicializarCarrito, agregarAlCarrito } from './carrito.js';
import { realizarCompra } from './compra.js';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        inicializarLogin();
    }
    cargarProductos();
    inicializarCarrito();

    const categoriaFilter = document.getElementById('categoriaFilter');
    categoriaFilter.addEventListener('change', (e) => {
        filtrarProductos(e.target.value);
    });

    const comprarBtn = document.getElementById('comprarBtn');
    comprarBtn.addEventListener('click', realizarCompra);

    document.getElementById('productosGrid').addEventListener('click', (e) => {
        if (e.target.classList.contains('agregarAlCarrito')) {
            const idProducto = parseInt(e.target.dataset.id);
            agregarAlCarrito(idProducto);
        }
    });
});