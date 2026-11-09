// Lightbox for gallery.html
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
const closeButton = lightbox.querySelector('.close-lightbox');

document.querySelectorAll('.gallery-item, .dual-image').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
    });
});

closeButton.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
    }
});
