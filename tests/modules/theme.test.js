
import { describe, test, beforeEach, expect, vi } from 'vitest';
import { applyTheme, initTheme, bindThemeControls } from '../../src/js/modules/theme.js';

// Mock the constants module
vi.mock('../../src/js/constants.js', () => ({
  themeConfig: [
    { id: 'dark', icon: '🌙' },
    { id: 'neutral', icon: '🌗' },
    { id: 'light', icon: '☀️' }
  ]
}));

describe('Theme controls', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button class="theme-toggle" aria-expanded="false"><span class="theme-icon"></span></button>
            <div class="theme-panel">
                <button class="theme-option" data-theme-option="dark"></button>
                <button class="theme-option" data-theme-option="neutral"></button>
                <button class="theme-option" data-theme-option="light"></button>
            </div>
        `;
        localStorage.clear();
        // Set data-theme to something to ensure it gets removed for dark theme
        document.documentElement.setAttribute('data-theme', 'light');
    });

    test('applyTheme updates DOM and localStorage', () => {
        applyTheme('neutral');
        expect(document.documentElement.getAttribute('data-theme')).toBe('neutral');
        expect(localStorage.getItem('theme')).toBe('neutral');
        expect(document.querySelector('.theme-option.active').getAttribute('data-theme-option')).toBe('neutral');
    });

    test('applyTheme handles dark theme correctly by removing attribute', () => {
        applyTheme('dark');
        expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('initTheme applies stored preference', () => {
        localStorage.setItem('theme', 'light');
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(document.querySelector('.theme-option.active').getAttribute('data-theme-option')).toBe('light');
    });

    test('bindThemeControls toggles panel and applies selection', () => {
        bindThemeControls();
        const toggle = document.querySelector('.theme-toggle');
        const panel = document.querySelector('.theme-panel');

        toggle.click();
        expect(panel.classList.contains('open')).toBe(true);

        panel.querySelector('[data-theme-option="neutral"]').click();
        expect(localStorage.getItem('theme')).toBe('neutral');
        expect(panel.classList.contains('open')).toBe(false);
    });
});
