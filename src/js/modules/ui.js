import { LOADER_DELAY, SCROLL_THRESHOLD } from '../constants.js';

function initMobileViewportHeight() {
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVH();
    window.addEventListener('resize', setVH);
}

function initLoader() {
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, LOADER_DELAY);
        }
    });
}

function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTop = document.querySelector('.back-to-top');
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const shouldReduceMotion = () => reduceMotionQuery.matches;

    if (scrollProgress && backToTop) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
            scrollProgress.style.transform = `scaleX(${scrollPercent})`;

            if (scrollTop > SCROLL_THRESHOLD) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: shouldReduceMotion() ? 'auto' : 'smooth' });
        });
    }
}

function initFaqAccordion() {
    function toggleFAQ(button) {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            const trigger = item.querySelector('.faq-question');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        if (!isActive) {
            faqItem.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        } else {
            button.setAttribute('aria-expanded', 'false');
        }
    }

    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => toggleFAQ(button));
    });
}

export function initUI() {
    initMobileViewportHeight();
    initLoader();
    initScrollProgress();
    initFaqAccordion();
}
