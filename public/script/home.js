document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const sliderContent = slider.querySelector('div');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    const slideWidth = slider.clientWidth;
    let currentIndex = 0;

    function showSlide(index) {
        sliderContent.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % 5;
        showSlide(currentIndex);
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + 5) % 5;
        showSlide(currentIndex);
    }

    nextBtn.addEventListener('click', showNextSlide);
    prevBtn.addEventListener('click', showPrevSlide);


    setInterval(showNextSlide, 5000);
});