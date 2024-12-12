document.addEventListener('DOMContentLoaded', createFooterComponent);

function createFooterComponent() {
    const footer = document.createElement('footer');
    footer.className = 'bg-black text-white py-8 px-4 text-center font-serif';

    const whatsappNumber = '+5493584127584';
    const whatsappMessage = encodeURIComponent('Hola! Gracias por comunicarte con Elegance Threads\nTe invitamos a ver nuestra colección de prendas exclusivas y realizar tu pedido desde el siguiente link\n👉🏻 https://www.elegancethreads.com.ar\n⏰ La demora en la entrega puede ser de hasta 7 días hábiles, dependiendo del stock.\nLas compras superiores a $80.000 tienen envío gratis');

    const content = `
        <div class="max-w-2xl mx-auto">
            <div class="mb-6">
                <a href="https://www.facebook.com/tu-pagina" target="_blank" class="inline-block mx-2 transition-transform hover:scale-110">
                    <i class="fab fa-facebook-f text-2xl hover:text-[#3b5998]"></i>
                </a>
                <a href="https://www.instagram.com/tu-pagina" target="_blank" class="inline-block mx-2 transition-transform hover:scale-110">
                    <i class="fab fa-instagram text-2xl hover:text-[#C13584]"></i>
                </a>
                <a href="https://wa.me/${whatsappNumber}?text=${whatsappMessage}" target="_blank" class="inline-block mx-2 transition-transform hover:scale-110">
                    <i class="fab fa-whatsapp text-2xl hover:text-[#25D366]"></i>
                </a>
            </div>
            <div class="mb-4">
                <p>Contacto: info@elegancethreads.com</p>
                <p>Teléfono: (123) 456-7890</p>
            </div>
            <div>
                <a href="/politicas-de-privacidad" class="underline hover:text-gray-300">Políticas de Privacidad</a>
            </div>
        </div>
    `;

    footer.innerHTML = content;

    document.body.appendChild(footer);
}