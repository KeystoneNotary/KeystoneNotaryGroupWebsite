gsap.registerPlugin(ScrollTrigger);

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll progress
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    scrollProgress.style.transform = `scaleX(${scrollPercent})`;
});

// Hero parallax
gsap.to('.parallax-bg', {
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 300,
    scale: 1.2
});

// Hero content fade in
gsap.from('.hero-logo', {
    opacity: 0,
    y: -50,
    duration: 1.5,
    ease: 'power3.out'
});

gsap.from('.hero-content h1', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.hero-content p', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.cta-button', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.7,
    ease: 'power3.out'
});

// Service cards stagger animation
gsap.from('.service-card', {
    scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 100,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power3.out'
});

// Credentials parallax badge
gsap.to('.credential-badge', {
    scrollTrigger: {
        trigger: '.credentials-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    },
    y: -100,
    rotation: 15
});

// Credentials content reveal
gsap.from('.credentials-content', {
    scrollTrigger: {
        trigger: '.credentials-section',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    x: 100,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.credentials-content li', {
    scrollTrigger: {
        trigger: '.credentials-content',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    x: 50,
    stagger: 0.15,
    duration: 0.6,
    ease: 'power2.out'
});

// Contact form animation
gsap.from('.contact-form input, .contact-form textarea, .contact-form button', {
    scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 80%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out'
});

gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 80%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power3.out'
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Floating CTA show/hide
const floatingCta = document.querySelector('.floating-cta');

gsap.from(floatingCta, {
    scrollTrigger: {
        trigger: '.services-section',
        start: 'top center',
        toggleActions: 'play reverse play reverse'
    },
    scale: 0,
    duration: 0.5,
    ease: 'back.out'
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    if (validateForm(data)) {
        console.log('Form submitted:', data);
        showSuccessMessage();
        contactForm.reset();
    }
});

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    
    if (!data.name || data.name.trim().length < 2) {
        showError('Please enter a valid name');
        return false;
    }
    
    if (!emailRegex.test(data.email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    if (!phoneRegex.test(data.phone)) {
        showError('Please enter a valid phone number');
        return false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        showError('Please enter a message (minimum 10 characters)');
        return false;
    }
    
    return true;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message error';
    errorDiv.textContent = message;
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message success';
    successDiv.textContent = 'Thank you! Your message has been sent. We will contact you shortly.';
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    setTimeout(() => successDiv.remove(), 5000);
}
