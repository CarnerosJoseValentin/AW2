const categoriesComponent = (() => {
    const categories = [
        { name: 'PANTALONES', image: '../img/cards/pantalonesCard.png', link: '../pages/productos.html?categoria=Pantalones' },
        { name: 'CAMISAS', image: '../img/cards/camisaCard.png', link: '../pages/productos.html?categoria=Camisas' },
        { name: 'SACOS', image: '../img/cards/sacosCard.png', link: '../pages/productos.html?categoria=Sacos' },
        { name: 'ZAPATOS', image: '../img/cards/zapatosCard.png', link: '../pages/productos.html?categoria=Zapatos' }
    ];

    function createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'relative overflow-hidden rounded-lg border-2 border-gold cursor-pointer transition-transform duration-300 hover:scale-105';
        card.style.aspectRatio = '16 / 9';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'w-full h-full';
        imageContainer.style.backgroundImage = `url('${category.image}')`;
        imageContainer.style.backgroundSize = 'contain';
        imageContainer.style.backgroundPosition = 'center';
        imageContainer.style.backgroundRepeat = 'no-repeat';

        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100';

        const name = document.createElement('span');
        name.textContent = category.name;
        name.className = 'text-white text-xl font-bold font-serif';

        overlay.appendChild(name);
        card.appendChild(imageContainer);
        card.appendChild(overlay);

        card.addEventListener('click', () => {
            const categoryName = category.link.split('=').pop();
            window.location.href = category.link;
        });

        return card;
    }

    function render() {
        const section = document.createElement('section');
        section.className = 'w-full py-8 px-4 md:px-8 lg:px-16 xl:px-24 mt-12';

        const innerContainer = document.createElement('div');
        innerContainer.className = 'bg-black bg-opacity-80 text-white rounded-lg overflow-hidden p-6';

        const title = document.createElement('h2');
        title.className = 'text-2xl font-serif text-center mb-6';
        title.textContent = 'CATEGORIAS';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';

        categories.forEach(category => {
            gridContainer.appendChild(createCategoryCard(category));
        });

        innerContainer.appendChild(title);
        innerContainer.appendChild(gridContainer);
        section.appendChild(innerContainer);

        return section;
    }

    return { render };
})();

document.addEventListener('DOMContentLoaded', () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.after(categoriesComponent.render());
    }
});