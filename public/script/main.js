import { inicializarLogin } from './login.js';
import { cargarProductos } from './productos.js';
import { inicializarCarrito, agregarAlCarrito, actualizarVisibilidadCarrito } from './carrito.js';
import { realizarCompra } from './compra.js';

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('loginForm')) {
        inicializarLogin();
    }
    
    if (window.location.pathname.includes('productos.html')) {
        cargarProductos();
    }
    
    inicializarCarrito();
    actualizarVisibilidadCarrito();
    
    const comprarBtn = document.getElementById('comprarBtn');
    if (comprarBtn) {
        comprarBtn.addEventListener('click', realizarCompra);
    }

    const productosGrid = document.getElementById('productosGrid');
    if (productosGrid) {
        productosGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('agregarAlCarrito')) {
                const idProducto = parseInt(e.target.dataset.id);
                agregarAlCarrito(idProducto);
            }
        });
    }
});