import { NAV_OFFSET } from '../constants.js';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('[data-nav-overlay]');
    const navLinkElements = navLinks ? Array.from(navLinks.querySelectorAll('a')) : [];
    const navCollapseMedia = window.matchMedia('(max-width: 768px)');
    let previouslyFocusedElement = null;

    if (!hamburger || !navLinks) {
        return;
    }

    const setNavHiddenState = (isHidden) => {
        if (isHidden) {
            navLinks.setAttribute('aria-hidden', 'true');
            if ('inert' in navLinks) {
                navLinks.inert = true;
            }
        } else {
            navLinks.removeAttribute('aria-hidden');
            if ('inert' in navLinks) {
                navLinks.inert = false;
            }
        }
    };

    const closeMenu = ({ restoreFocus = true } = {}) => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation');
        navLinks.classList.remove('active');
        if (navCollapseMedia.matches) {
            setNavHiddenState(true);
        }
        document.body.classList.remove('nav-open');
        if (navOverlay) {
            navOverlay.classList.remove('is-active');
        }
        document.removeEventListener('keydown', handleKeyDown);
        if (restoreFocus && previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
        previouslyFocusedElement = null;
    };

    const focusFirstLink = () => {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const focusable = navLinks.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!focusable.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const openMenu = () => {
        previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close navigation');
        navLinks.classList.add('active');
        if (navCollapseMedia.matches) {
            setNavHiddenState(false);
        }
        document.body.classList.add('nav-open');
        if (navOverlay) {
            navOverlay.classList.add('is-active');
        }
        document.addEventListener('keydown', handleKeyDown);
        requestAnimationFrame(focusFirstLink);
    };

    const toggleMenu = () => {
        const isActive = hamburger.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    hamburger.addEventListener('click', toggleMenu);

    if (navOverlay) {
        navOverlay.addEventListener('click', () => closeMenu({ restoreFocus: true }));
    }

    navLinkElements.forEach(link => {
        link.addEventListener('click', () => closeMenu({ restoreFocus: false }));
    });

    const handleMediaChange = (event) => {
        if (!event.matches) {
            document.body.classList.remove('nav-open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation');
            navLinks.classList.remove('active');
            setNavHiddenState(false);
            if (navOverlay) {
                navOverlay.classList.remove('is-active');
            }
            document.removeEventListener('keydown', handleKeyDown);
        } else {
            setNavHiddenState(true);
        }
    };

    handleMediaChange(navCollapseMedia);
    if (typeof navCollapseMedia.addEventListener === 'function') {
        navCollapseMedia.addEventListener('change', handleMediaChange);
    } else {
        navCollapseMedia.addListener(handleMediaChange);
    }
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
