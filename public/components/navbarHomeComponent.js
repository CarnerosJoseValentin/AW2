document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.createElement('nav');
    navbar.className = 'w-full bg-black sticky top-0 z-20 container mx-auto my-20 font-serif'; 

    const container = document.createElement('div');
    container.className = 'container mx-auto px-4 py-2'; 

    const link = document.createElement('a');
    link.href = '../pages/productos.html'; 
    link.className = `
        block text-center text-gold text-lg 
        transition-all duration-300 ease-in-out
        hover:text-white hover:bg-gold hover:shadow-lg 
        hover:scale-105 hover:font-bold
        py-1 px-4 rounded
    `;
    link.textContent = 'NUESTROS PRODUCTOS';

    container.appendChild(link);
    navbar.appendChild(container);

    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', navbar);

    const mainContent = document.querySelector('body > *:not(header):not(nav)');
    if (mainContent) {
        mainContent.style.paddingTop = '40px';
    }
});