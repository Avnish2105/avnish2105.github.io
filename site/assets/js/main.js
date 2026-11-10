// Home page behaviour. Analytics lives in analytics.js, the navbar and
// back-to-top button in nav.js (shared), the 3D robot in robot.js.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Logo marquee: duplicate the group once so the CSS loop is seamless.
const logoSlider = document.querySelector('.logo-slider');
const logoGroup = document.querySelector('.logo-group');
if (logoSlider && logoGroup) {
    const clone = logoGroup.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    logoSlider.appendChild(clone);
}

// Copy email button
const copyBtn = document.getElementById('copyEmail');
if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(copyBtn.dataset.email);
            copyBtn.textContent = 'Copied';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            copyBtn.textContent = 'Press Ctrl+C';
        }
    });
} else if (copyBtn) {
    copyBtn.hidden = true;
}

// Cursor spotlight on cards
if (finePointer && !reduceMotion) {
    document.querySelectorAll('.spot').forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}

// Count-up for the stats strip
function countUp(el) {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const duration = 1200;
    function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// Timeline line draws with scroll progress
const timeline = document.getElementById('timeline');
function updateTimeline() {
    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const mid = window.innerHeight * 0.6;
    const p = Math.min(Math.max((mid - r.top) / r.height, 0), 1);
    timeline.style.setProperty('--progress', p.toFixed(3));
}

if (reduceMotion) {
    // Content is shown as-is; SMIL animations are paused.
    document.querySelectorAll('svg').forEach(svg => svg.pauseAnimations && svg.pauseAnimations());
} else {
    document.body.classList.add('reveal-on');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('in');
            const num = el.querySelector('.stat-num[data-count]');
            if (num) countUp(num);
            revealObserver.unobserve(el);
            // Once revealed, hand transitions back to the element's own hover styles
            setTimeout(() => {
                el.classList.remove('reveal', 'in');
                el.style.transitionDelay = '';
            }, 1400);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Stagger siblings that reveal together
    document.querySelectorAll('.reveal').forEach(el => {
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const i = siblings.indexOf(el);
        if (i > 0) el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
        revealObserver.observe(el);
    });

    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline);
    updateTimeline();
}
