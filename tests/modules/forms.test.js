
import { describe, test, beforeEach, afterEach, expect, vi } from 'vitest';
import { validateContactForm, showError, showSuccessMessage } from '../../src/js/modules/forms.js';

// Mock constants used by the forms module
vi.mock('../../src/js/constants.js', () => ({
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ERROR_DURATION: 10, // Use short duration for tests
    SUCCESS_DURATION: 10
}));

describe('Contact form helpers', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '<form id="contactForm"><div aria-live="polite"></div></form>';
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('validateContactForm accepts valid payload', () => {
        const form = document.getElementById('contactForm');
        const payload = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            message: 'I need a notary for loan documents.'
        };
        expect(validateContactForm(payload, form)).toBe(true);
    });

    test('validateContactForm rejects invalid email and calls showError', () => {
        const form = document.getElementById('contactForm');
        const payload = {
            name: 'Jane Doe',
            email: 'invalid-email',
            message: 'I need assistance.'
        };
        expect(validateContactForm(payload, form)).toBe(false);
        expect(form.querySelector('.form-message.error')).not.toBeNull();
        expect(form.querySelector('.form-message.error').textContent).toBe('Please enter a valid email address');
    });

    test('showError inserts an error element that removes itself', () => {
        const form = document.getElementById('contactForm');
        showError('Test error', form);
        expect(form.querySelector('.form-message.error').textContent).toBe('Test error');

        // Fast-forward time
        vi.advanceTimersByTime(20);
        expect(form.querySelector('.form-message.error')).toBeNull();
    });

    test('showSuccessMessage inserts a success element that removes itself', () => {
        const form = document.getElementById('contactForm');
        showSuccessMessage('Success!', form);
        expect(form.querySelector('.form-message.success').textContent).toBe('Success!');

        // Fast-forward time
        vi.advanceTimersByTime(20);
        expect(form.querySelector('.form-message.success')).toBeNull();
    });
});
