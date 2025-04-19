// Analytics setup
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-TE3FHFGW3S');

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Navbar scroll behavior
const navbar = document.querySelector('.navbar');
let lastScroll = window.pageYOffset;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
        if (currentScroll > lastScroll) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    }
    lastScroll = currentScroll;
});

// Profile picture animation
window.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('profilePicture');
    if (img) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.8) rotate(-10deg)';
        
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '-50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('timeline-event')) {
                entry.target.style.transitionDelay = entry.target.dataset.delay || '0ms';
            }
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    // Timeline events
    const events = document.querySelectorAll('.timeline-event');
    events.forEach((event, index) => {
        event.dataset.delay = `${index * 200}ms`;
        observer.observe(event);
    });

    // Social cards
    const cards = document.querySelectorAll('.social-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });
});

// Enhanced cursor trail effect
const cursor = document.querySelector('.cursor-trail');
const cursorTrail = Array.from({ length: 5 }, () => {
    const div = document.createElement('div');
    div.className = 'cursor-trail';
    document.body.appendChild(div);
    return div;
});

let mouseX = 0;
let mouseY = 0;
let trailPositions = Array(5).fill({ x: 0, y: 0 });

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateTrail() {
    // Update positions
    trailPositions.pop();
    trailPositions.unshift({ x: mouseX, y: mouseY });
    
    // Update trail elements
    cursorTrail.forEach((dot, index) => {
        const pos = trailPositions[index];
        const scale = 1 - (index * 0.2);
        const alpha = 1 - (index * 0.2);
        
        dot.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
        dot.style.opacity = alpha;
    });
    
    requestAnimationFrame(updateTrail);
}

updateTrail();

// Back to top button
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.transform = 'scale(1)';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'scale(0.8)';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Logo slider clone for infinite scroll
document.addEventListener('DOMContentLoaded', () => {
    const logoSlider = document.querySelector('.logo-slider');
    const logoGroup = document.querySelector('.logo-group');
    
    if (logoSlider && logoGroup) {
        const clone = logoGroup.cloneNode(true);
        logoSlider.appendChild(clone);
    }
});

// Interactive Background with connected particles
class NetworkBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-js';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const numberOfParticles = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 100);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                baseX: Math.random() * this.canvas.width,
                baseY: Math.random() * this.canvas.height,
                density: (Math.random() * 30) + 1,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: (Math.random() - 0.5) * 2
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Move particles
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.velocityX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.velocityY *= -1;
            }
            
            // Mouse interaction
            if (this.mouse.x != null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const angleX = dx / distance;
                    const angleY = dy / distance;
                    particle.x -= angleX * force * 5;
                    particle.y -= angleY * force * 5;
                }
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(37, 99, 235, 0.5)';
            this.ctx.fill();
        });
        
        this.drawConnections();
        requestAnimationFrame(() => this.animate());
    }
}

// Remove previous particle initialization if it exists
const existingCanvas = document.getElementById('particles-js');
if (existingCanvas) {
    existingCanvas.remove();
}

// Initialize network background
new NetworkBackground();

// Robotics Jokes System
const roboticsJokes = [
    "If you ever feel useless, just remember: An over-discharged LiPo is still technically a battery.",
    "I told my robot, \"You still have so much potential!\"\nIt said, \"Bro, I'm at 2.9V per cell... stop lying.\"",
    "An over-discharged LiPo is like a gifted student who never slept —\nBurned out, unstable, and full of wasted potential.",
    "Told my robot to navigate using ROS 2...\nNow it publishes its anxiety and subscribes to bad decisions.",
    "I tried debugging a ROS 2 launch file.\nNow I'm 4 hours older, 3 terminals deeper, and questioning all my parameters in life.",
    "Configured navigation in ROS 2…\nRobot made it 2 meters, gave up, and started broadcasting emotional damage.",
    "Running Humble on my robot.\nNow it's very humble about its capabilities.",
    "Flashed new firmware to the robot.\nNow it thinks it's a blender.",
    "Robot started spinning uncontrollably after a debug session.\nI told my team it's \"just stress testing the chassis.\"",
    "Put the robot in debug mode.\nNow it's just sitting there… judging me.",
    "Maturity is when you name your bugs, because at this point…\nThey've been with you longer than some of your friends.",
    "Maturity is when you stop chasing perfection,\nand start chasing the one log file that might tell you why the IMU is upside down again."
];

let currentJokeIndex = -1;

function showNextJoke() {
    const jokeText = document.getElementById('jokeText');
    const jokeCard = document.getElementById('jokeCard');
    
    // Get next joke
    currentJokeIndex = (currentJokeIndex + 1) % roboticsJokes.length;
    
    // Add exit animation
    jokeCard.style.transform = 'translateY(10px)';
    jokeText.style.opacity = '0';
    
    // Change joke text and animate in after a short delay
    setTimeout(() => {
        jokeText.innerText = roboticsJokes[currentJokeIndex];
        jokeCard.style.transform = 'translateY(0)';
        jokeText.style.opacity = '1';
    }, 500);
}

// Start showing jokes immediately and set interval
showNextJoke();
setInterval(showNextJoke, 10000); // Changed to 10 seconds for better readability

// Scroll reveal animation
function createScrollReveal() {
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });
}

// Dynamic active link updating
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    createScrollReveal();
    updateActiveLink();
    // Timeline events
    const events = document.querySelectorAll('.timeline-event');
    events.forEach((event, index) => {
        event.dataset.delay = `${index * 200}ms`;
        observer.observe(event);
    });

    // Social cards
    const cards = document.querySelectorAll('.social-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    // Profile picture animation
    const img = document.getElementById('profilePicture');
    if (img) {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.8) rotate(-10deg)';
        
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }

    // Logo slider clone for infinite scroll
    const logoSlider = document.querySelector('.logo-slider');
    const logoGroup = document.querySelector('.logo-group');
    
    if (logoSlider && logoGroup) {
        const clone = logoGroup.cloneNode(true);
        logoSlider.appendChild(clone);
    }
});