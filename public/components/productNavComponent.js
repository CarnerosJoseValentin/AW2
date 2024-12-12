import { filtrarProductos } from '../script/productos.js';

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.createElement('nav');
    navbar.className = 'w-full bg-black sticky top-0 z-20 container mx-auto my-4 md:my-8 font-serif'; 

    const container = document.createElement('div');
    container.className = 'container mx-auto px-4 py-2'; 

    const menuToggle = document.createElement('button');
    menuToggle.className = 'md:hidden text-gold text-2xl w-full text-left pb-2';
    menuToggle.textContent = '☰ Categorías';

    const menuContent = document.createElement('div');
    menuContent.className = 'hidden md:flex md:flex-row md:justify-center md:space-x-4 md:space-y-0 space-y-2';

    const categorias = ['Todas', 'Pantalones', 'Camisas', 'Sacos', 'Zapatos'];

    categorias.forEach(categoria => {
        const link = document.createElement('a');
        link.href = '#'; 
        link.textContent = categoria;
        link.className = `
            block md:inline-block text-gold text-lg 
            transition-all duration-300 ease-in-out
            hover:text-white hover:bg-gold hover:shadow-lg 
            hover:scale-105 hover:font-bold
            py-1 px-4 rounded
        `;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filtrarProductos(categoria === 'Todas' ? '' : categoria.toLowerCase());
        });
        menuContent.appendChild(link);
    });

    menuToggle.addEventListener('click', () => {
        menuContent.classList.toggle('hidden');
    });

    container.appendChild(menuToggle);
    container.appendChild(menuContent);
    navbar.appendChild(container);
    document.getElementById('productNav').appendChild(navbar);
});