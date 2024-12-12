import { createCarousel } from './carouselComponent.js';

document.addEventListener('DOMContentLoaded', function() {
    function createMissionVisionBlock() {
        const block = document.createElement('div');
        block.className = 'bg-black bg-opacity-80 p-6 rounded-lg shadow-lg h-full flex items-center justify-center';

        const text = document.createElement('p');
        text.className = 'text-white text-lg font-serif italic text-center';
        text.style.lineHeight = '1.8';
        text.innerHTML = `
            En el corazón de nuestra empresa late la pasión por vestir al hombre moderno con distinción y elegancia. 
            Nuestra misión es ofrecer prendas de vestir masculinas que no solo realcen la apariencia, sino que también 
            inspiren confianza y autenticidad en cada caballero que las porta. Con un ojo puesto en la tradición 
            y otro en la innovación, nos esforzamos por crear colecciones que fusionen la artesanía clásica con 
            las tendencias contemporáneas.<br><br>
            Visualizamos un futuro donde cada hombre pueda expresar su individualidad a través de su vestimenta, 
            sin comprometer la calidad ni el estilo. Aspiramos a ser reconocidos no solo como una marca de moda, 
            sino como un compañero de confianza en el viaje de cada hombre hacia su mejor versión. 
            Nuestro compromiso con la excelencia, la sostenibilidad y el servicio personalizado nos impulsa 
            a redefinir constantemente los estándares de la moda masculina, creando un legado de elegancia 
            que perdure a través de las generaciones.
        `;

        block.appendChild(text);
        return block;
    }

    function createCarouselBlock() {
        const block = document.createElement('div');
        block.className = 'bg-black bg-opacity-80 p-6 rounded-lg shadow-lg h-full flex items-center justify-center';

        const carouselContainer = document.createElement('div');
        carouselContainer.id = 'carouselContainer';
        carouselContainer.className = 'w-full h-full flex items-center justify-center';

        block.appendChild(carouselContainer);

        setTimeout(() => {
            const images = [
                '../img/slider/slider1.png',
                '../img/slider/slider2.png',
                '../img/slider/slider3.png'
            ];
            createCarousel('carouselContainer', images);
        }, 0);

        return block;
    }

    const mainSection = document.createElement('section');
    mainSection.className = 'w-full py-8 px-4 md:px-8 lg:px-16 xl:px-24 mt-12';

    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';

    container.appendChild(createCarouselBlock());
    container.appendChild(createMissionVisionBlock());

    mainSection.appendChild(container);

    const navbar = document.querySelector('nav');
    if (navbar) {
        navbar.insertAdjacentElement('afterend', mainSection);
    } else {
        document.body.prepend(mainSection);
    }
});