let todosLosProductos = [];
const CACHE_KEY = 'productos_cache';
const CACHE_DURATION = 1000 * 60 * 5; 

export async function cargarProductos() {
    try {
        const cachedData = getCachedData();
        if (cachedData) {
            todosLosProductos = cachedData;
            mostrarProductos(todosLosProductos);
            return;
        }

        const response = await fetch('/productos/all');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        todosLosProductos = await response.json();
        setCachedData(todosLosProductos);
        mostrarProductos(todosLosProductos);
    } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudieron cargar los productos. Por favor, intente más tarde.');
    }
}

function getCachedData() {
    const cachedItem = localStorage.getItem(CACHE_KEY);
    if (!cachedItem) return null;

    const { timestamp, data } = JSON.parse(cachedItem);
    if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
    }

    return data;
}

function setCachedData(data) {
    const cacheItem = {
        timestamp: Date.now(),
        data: data
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheItem));
}

export function filtrarProductos(categoria) {
    const productosFiltrados = categoria 
        ? todosLosProductos.filter(producto => producto.categoria.toLowerCase() === categoria.toLowerCase())
        : todosLosProductos;
    
    mostrarProductos(productosFiltrados);
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('productosGrid');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const tarjeta = crearTarjetaProducto(producto);
        contenedor.appendChild(tarjeta);
    });

    // Efecto visual de fade-in
    contenedor.style.opacity = 0;
    setTimeout(() => {
        contenedor.style.transition = 'opacity 0.5s ease-in-out';
        contenedor.style.opacity = 1;
    }, 10);


    inicializarLazyLoading();
}


function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col h-full';
    tarjeta.innerHTML = `
        <div class="relative pt-[100%] mb-4 overflow-hidden rounded">
            <img 
                data-src="/${producto.imagen}" 
                alt="${producto.nombre}" 
                class="absolute top-0 left-0 w-full h-full object-cover lazy"
            >
        </div>
        <h3 class="text-lg font-semibold">${producto.nombre}</h3>
        <p class="text-gray-600 mb-2 flex-grow">${producto.desc}</p>
        <p class="text-accent2 font-bold">$${producto.precio.toFixed(2)}</p>
        <button class="mt-2 bg-primary text-white p-2 rounded w-full agregarAlCarrito" data-id="${producto.id_producto}">Agregar al carrito</button>
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
    contenedor.innerHTML = `<p class="text-red-500">${mensaje}</p>`;
}

