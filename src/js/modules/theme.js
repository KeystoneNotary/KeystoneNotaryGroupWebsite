import { themeConfig } from '../constants.js';

/**
 * Apply theme to document and update UI
 * @param {string} theme - Theme ID ('dark', 'neutral', or 'light')
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }

    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        const config = themeConfig.find(option => option.id === theme);
        themeIcon.textContent = config ? config.icon : '🌙';
    }

    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const optionTheme = option.getAttribute('data-theme-option');
        const isActive = optionTheme === theme;
        option.classList.toggle('active', isActive);
        option.setAttribute('aria-checked', String(isActive));
        option.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    localStorage.setItem('theme', theme);
}

function bindThemeControls() {
    const toggle = document.querySelector('.theme-toggle');
    const panel = document.querySelector('.theme-panel');
    if (!toggle || !panel) return;

    const options = Array.from(panel.querySelectorAll('.theme-option'));

    options.forEach((option, index) => {
        option.dataset.index = String(index);
        if (!option.hasAttribute('tabindex')) {
            option.setAttribute('tabindex', index === 0 ? '0' : '-1');
        }
    });

    const focusOption = (index) => {
        const option = options[index];
        if (option) {
            option.focus();
        }
    };

    const getActiveIndex = () => {
        return options.findIndex(option => option.getAttribute('aria-checked') === 'true' || option.classList.contains('active'));
    };

    const openPanel = () => {
        panel.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        const activeIndex = getActiveIndex();
        const targetIndex = activeIndex >= 0 ? activeIndex : 0;
        requestAnimationFrame(() => focusOption(targetIndex));
    };

    const closePanel = ({ restoreFocus = true } = {}) => {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        if (restoreFocus) {
            toggle.focus();
        }
    };

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        if (panel.classList.contains('open')) {
            closePanel({ restoreFocus: false });
        } else {
            openPanel();
        }
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme-option');
            applyTheme(theme);
            closePanel();
        });

        option.addEventListener('keydown', (event) => {
            const currentIndex = parseInt(option.dataset.index || '0', 10);
            if (Number.isNaN(currentIndex)) {
                return;
            }

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                const nextIndex = (currentIndex + 1) % options.length;
                focusOption(nextIndex);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                const prevIndex = (currentIndex - 1 + options.length) % options.length;
                focusOption(prevIndex);
            } else if (event.key === 'Home') {
                event.preventDefault();
                focusOption(0);
            } else if (event.key === 'End') {
                event.preventDefault();
                focusOption(options.length - 1);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                closePanel();
            } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const theme = option.getAttribute('data-theme-option');
                applyTheme(theme);
                closePanel();
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (panel.classList.contains('open') && !panel.contains(event.target) && !toggle.contains(event.target)) {
        if (panel.classList.contains('open') && 
            !event.target.closest('.theme-panel') && 
            !event.target.closest('.theme-toggle')) {
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && panel.classList.contains('open')) {
            closePanel();
        }
    });
}

/**
 * Initialize theme from localStorage or default
 */
export function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    bindThemeControls();
}

// Export for testing
export { applyTheme, bindThemeControls };
