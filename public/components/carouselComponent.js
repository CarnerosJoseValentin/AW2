export function createCarousel(containerId, images) {
  console.log('createCarousel called with:', containerId, images);

  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  console.log('Container found:', container);

  const carouselHTML = `
    <div class="relative w-full max-w-[290px] h-[290px] mx-auto" style="perspective: 1500px;">
      <div class="absolute w-full h-full" style="transform-style: preserve-3d; animation: carousel 12s infinite cubic-bezier(0.77, 0, 0.175, 1);">
        ${images.map((src, index) => `
          <div class="absolute inset-0 w-full h-full shadow-lg rounded-lg overflow-hidden"
               style="transform-origin: center; 
                      transform: rotateY(${index * 120}deg) translateZ(300px);">
            <img src="${src}" alt="Carousel image ${index + 1}" class="w-full h-full object-cover">
          </div>
        `).join('')}
      </div>
    </div>
  `;

  console.log('Carousel HTML:', carouselHTML);

  container.innerHTML = carouselHTML;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes carousel {
      0%, 17.5% { transform: translateZ(-200px) rotateY(0); }
      27.5%, 45% { transform: translateZ(-200px) rotateY(-120deg); }
      55%, 72.5% { transform: translateZ(-200px) rotateY(-240deg); }
      82.5%, 100% { transform: translateZ(-200px) rotateY(-360deg); }
    }
  `;
  document.head.appendChild(style);

  console.log('Carousel styles added to head');
}