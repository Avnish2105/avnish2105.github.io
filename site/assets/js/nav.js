// Shared on every page: the navbar hides on scroll down and returns on scroll
// up (frees screen space on phones), plus the back-to-top button where present.

(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTopBtn');
    let lastScroll = window.scrollY;
    let ticking = false;

    function update() {
        ticking = false;
        const y = window.scrollY;
        // Ignore tiny moves (iOS rubber-band, address bar resize)
        if (navbar && Math.abs(y - lastScroll) > 4) {
            const hide = y > 120 && y > lastScroll && !navbar.classList.contains('menu-open')
                && !navbar.contains(document.activeElement);
            navbar.classList.toggle('nav-hidden', hide);
        }
        if (backToTopBtn) backToTopBtn.classList.toggle('show', y > 600);
        if (Math.abs(y - lastScroll) > 4) lastScroll = y;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });

    // Show the navbar again when keyboard focus moves into it
    if (navbar) {
        navbar.addEventListener('focusin', () => navbar.classList.remove('nav-hidden'));
    }

    // Phones: collapse the links behind a Menu button. The button is added
    // here so pages without JS keep the plain wrapped links.
    const links = navbar && navbar.querySelector('.nav-links');
    if (links) {
        links.id = links.id || 'site-menu';
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-controls', links.id);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span class="nav-toggle-icon" aria-hidden="true"></span><span class="nav-toggle-text">Menu</span>';
        links.parentNode.insertBefore(toggle, links);
        navbar.classList.add('has-toggle');

        const label = toggle.querySelector('.nav-toggle-text');
        const isOpen = () => navbar.classList.contains('menu-open');
        const setOpen = (open) => {
            navbar.classList.toggle('menu-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            label.textContent = open ? 'Close' : 'Menu';
        };

        toggle.addEventListener('click', () => setOpen(!isOpen()));
        links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('click', (e) => { if (isOpen() && !navbar.contains(e.target)) setOpen(false); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen()) {
                setOpen(false);
                toggle.focus();
            }
        });
        // Back to desktop width: reset so the panel isn't stuck open
        window.matchMedia('(max-width: 720px)').addEventListener('change', (e) => { if (!e.matches) setOpen(false); });
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }
})();
