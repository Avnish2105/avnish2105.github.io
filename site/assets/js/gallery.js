// Lightbox for gallery.html. Uses the native <dialog>: showModal() gives focus
// handling, Escape-to-close and an inert page behind it; focus returns to the
// tile that opened it.
const lightbox = document.querySelector('.lightbox');

if (lightbox && typeof lightbox.showModal === 'function') {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('figcaption');
    const closeButton = lightbox.querySelector('.close-lightbox');

    document.querySelectorAll('.gallery-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const img = tile.querySelector('img');
            const caption = tile.querySelector('.caption');
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            lightbox.showModal();
        });
    });

    closeButton.addEventListener('click', () => lightbox.close());

    // Tap or click outside the photo closes it
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.tagName === 'FIGURE') lightbox.close();
    });

    lightbox.addEventListener('close', () => {
        lightboxImg.removeAttribute('src');
    });
} else {
    // No <dialog> support: tiles stay as plain, non-interactive photos.
    document.querySelectorAll('.gallery-tile').forEach(tile => { tile.disabled = true; });
}
