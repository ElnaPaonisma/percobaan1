document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelector('.carousel-inner');
    const totalSlides = slides.children.length;
    let currentIndex = 0;

    function showSlide(index) {
        slides.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    setInterval(nextSlide, 3000);
});
