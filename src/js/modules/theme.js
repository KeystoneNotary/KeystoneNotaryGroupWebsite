import { themeConfig } from '../config.js';

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

    document.querySelectorAll('.theme-option').forEach(option => {
        const optionTheme = option.getAttribute('data-theme-option');
        option.classList.toggle('active', optionTheme === theme);
    });

    localStorage.setItem('theme', theme);
}

function toggleThemePanel() {
    const panel = document.querySelector('.theme-panel');
    const toggle = document.querySelector('.theme-toggle');
    if (!panel || !toggle) return;

    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
}

function closeThemePanel() {
    const panel = document.querySelector('.theme-panel');
    const toggle = document.querySelector('.theme-toggle');
    if (!panel || !toggle) return;
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
}

function bindThemeControls() {
    const toggle = document.querySelector('.theme-toggle');
    const panel = document.querySelector('.theme-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleThemePanel();
    });

    panel.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme-option');
            applyTheme(theme);
            closeThemePanel();
        });
    });

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !toggle.contains(event.target)) {
            closeThemePanel();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeThemePanel();
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
