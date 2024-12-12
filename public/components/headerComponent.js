document.addEventListener('DOMContentLoaded', function() {
    const header = document.createElement('header');
    header.className = 'w-full relative';

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'flex justify-center items-center px-4 relative';

    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'flex-grow flex justify-center';

    const logoLink = document.createElement('a');
    logoLink.href = '../pages/home.html'; 
    logoLink.className = 'cursor-pointer';

    const logo = document.createElement('img');
    logo.src = '../img/others/logo.png';
    logo.alt = 'Logo de la tienda';
    logo.className = 'w-70 h-60 mt-5 pt-8';

    logoLink.appendChild(logo);

    const logoutContainer = document.createElement('div');
    logoutContainer.className = 'absolute right-4 top-1/2 transform -translate-y-1/2';

    const logoutIcon = document.createElement('i');
    logoutIcon.className = 'fas fa-door-open mr-2 text-xl';

    const logoutText = document.createElement('span');
    logoutText.textContent = 'Salir';
    logoutText.className = 'text-lg font-bold';

    const logoutLink = document.createElement('a');
    logoutLink.href = '../index.html';
    logoutLink.className =
        'flex items-center text-gray-600 hover:text-gray-800 p-2 rounded hover:bg-gray-200 transition-colors duration-300';
    logoutLink.addEventListener('click', () => { sessionStorage.clear() && localStorage.clear(); });    
    logoutLink.appendChild(logoutIcon);
    logoutLink.appendChild(logoutText);

    logoutContainer.appendChild(logoutLink);

    logoWrapper.appendChild(logoLink);
    contentWrapper.appendChild(logoWrapper);
    contentWrapper.appendChild(logoutContainer);
    header.appendChild(contentWrapper);

    document.body.prepend(header);

    
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 640px) {
            header > div {
                justify-content: space-between !important;
                padding-left: 0.5rem !important;
                padding-right: 0.5rem !important;
            }
            header img {
                width: 170px !important;
                height: 130px !important;
                margin-top: 0.5rem !important;
                padding-top: 0.5rem !important;
            }
            header .absolute {
                position: static !important;
                transform: none !important;
            }
            header .fa-door-open {
                font-size: 1.75rem !important;
            }
            header .text-lg {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
});