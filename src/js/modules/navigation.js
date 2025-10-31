import { NAV_OFFSET } from '../constants.js';

function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkElements = navLinks ? navLinks.querySelectorAll('a') : [];

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
}

function initSectionObserver() {
    const navLinkElements = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const sectionId = entry.target.getAttribute('id');
            navLinkElements.forEach(link => {
                link.classList.toggle('is-active', link.getAttribute('data-nav') === sectionId);
            });
        });
    }, {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.1
    });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // The loader has a skip link with href="#main-content"
            if (targetId === '#main-content') {
                // get the element with id "main-content"
                const target = document.getElementById('main-content');
                if (target) {
                    target.focus();
                    window.scrollTo({ top: Math.max(target.offsetTop - NAV_OFFSET, 0), behavior: 'smooth' });
                }
                return;
            }
            const target = document.querySelector(targetId);
            if (!target) return;

            window.scrollTo({ top: Math.max(target.offsetTop - NAV_OFFSET, 0), behavior: 'smooth' });
        });
    });
}


export function initNavigation() {
    initHamburgerMenu();
    initSectionObserver();
    initSmoothScroll();
}
