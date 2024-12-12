let cargarProductos;
let filtrarProductos;

(function() {
    let todosLosProductos = [];
    const CACHE_KEY = 'productos_cache';
    const CACHE_DURATION = 1000 * 60 * 5; 

    function esPaginaProductos() {
        return window.location.pathname.includes('productos.html');
    }

    cargarProductos = async function(categoria = null) {
        if (!esPaginaProductos()) return;
        
        try {
            let url = "http://localhost:3000/productos/all";
            if (categoria) {
                url = `http://localhost:3000/productos/buscarProductoPorCategoria/${categoria}`;
            }

            const cachedData = getCachedData(categoria);
            if (cachedData) {
                todosLosProductos = cachedData;
                mostrarProductos(todosLosProductos);
                return;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            todosLosProductos = await response.json();
            setCachedData(todosLosProductos, categoria);
            mostrarProductos(todosLosProductos);
        } catch (error) {
            console.error('Error:', error);
            mostrarError('No se pudieron cargar los productos. Por favor, intente más tarde.');
        }
    }

    filtrarProductos = function(categoria) {
        cargarProductos(categoria === 'Todas' ? null : categoria);
    }

    function getCachedData(categoria) {
        const cacheKey = categoria ? `${CACHE_KEY}_${categoria}` : CACHE_KEY;
        const cachedItem = localStorage.getItem(cacheKey);
        if (!cachedItem) return null;

        const { timestamp, data } = JSON.parse(cachedItem);
        if (Date.now() - timestamp > CACHE_DURATION) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return data;
    }

    function setCachedData(data, categoria) {
        const cacheItem = {
            timestamp: Date.now(),
            data: data
        };
        const cacheKey = categoria ? `${CACHE_KEY}_${categoria}` : CACHE_KEY;
        localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    }

    function mostrarProductos(productos) {
        const contenedor = document.getElementById('productosGrid');
        if (!contenedor) {
            console.error('No se encontró el elemento productosGrid');
            return;
        }
        contenedor.innerHTML = '';

        productos.forEach(producto => {
            const tarjeta = crearTarjetaProducto(producto);
            contenedor.appendChild(tarjeta);
        });

        contenedor.style.opacity = 0;
        setTimeout(() => {
            contenedor.style.transition = 'opacity 0.5s ease-in-out';
            contenedor.style.opacity = 1;
        }, 10);

        inicializarLazyLoading();
    }

    function crearTarjetaProducto(producto) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'bg-black bg-opacity-70 rounded-lg shadow-md p-4 flex flex-col h-full';
        tarjeta.innerHTML = `
            <div class="relative pt-[100%] mb-4 overflow-hidden rounded">
                <img 
                    data-src="/${producto.imagen}" 
                    alt="${producto.nombre}" 
                    class="absolute top-0 left-0 w-full h-full object-cover lazy"
                >
            </div>
            <h3 class="text-lg font-semibold text-white text-center">${producto.nombre}</h3>
            <p class="text-white mb-2 flex-grow text-center">${producto.desc}</p>
            <p class="text-accent2 font-bold text-center">$${producto.precio.toFixed(2)}</p>
            <button class="mt-2 block text-center text-gold text-lg transition-all duration-300 ease-in-out border-2 border-gold hover:text-black hover:bg-gold hover:shadow-lg hover:scale-105 hover:font-bold py-2 px-4 rounded w-full agregarAlCarrito" data-id="${producto.id_producto}">Agregar al carrito</button>
        `;
        return tarjeta;
    }

    function inicializarLazyLoading() {
        const imagenes = document.querySelectorAll('img.lazy');
        const opciones = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observador = new IntersectionObserver((entradas, observador) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    const imagen = entrada.target;
                    imagen.src = imagen.dataset.src;
                    imagen.classList.remove('lazy');
                    observador.unobserve(imagen);
                }
            });
        }, opciones);

        imagenes.forEach(imagen => observador.observe(imagen));
    }

    function mostrarError(mensaje) {
        const contenedor = document.getElementById('productosGrid');
        if (contenedor) {
            contenedor.innerHTML = `<p class="text-red-500">${mensaje}</p>`;
        } else {
            console.error('No se encontró el elemento productosGrid');
        }
    }

    function inicializarPaginaProductos() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoria = urlParams.get('categoria');
        if (categoria) {
            cargarProductos(categoria);
        } else {
            cargarProductos();
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (esPaginaProductos()) {
            inicializarPaginaProductos();
        }
    });
})();

export { cargarProductos, filtrarProductos };