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

    // Mengatur gaya kontainer awal
    const container = document.querySelector('.container');
    container.style.transition = 'transform 0.5s ease'; // Menambahkan efek transisi
    let containerVisible = true; // Menyimpan status kontainer (terlihat atau tidak)

    // Mengatur perubahan gaya kontainer saat digeser
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100 && containerVisible) { // Jika posisi scroll melewati ambang batas dan kontainer masih terlihat
            container.style.transform = 'translateY(-100%)'; // Menggeser kontainer ke atas sehingga tidak terlihat
            containerVisible = false; // Menandai bahwa kontainer tidak terlihat
        } else if (window.scrollY <= 100 && !containerVisible) { // Jika posisi scroll kembali di atas ambang batas dan kontainer tidak terlihat
            container.style.transform = 'translateY(0%)'; // Mengembalikan kontainer ke posisi semula
            containerVisible = true; // Menandai bahwa kontainer kembali terlihat
        }
    });
});
