import { describe, test, beforeEach, afterEach, expect } from 'vitest';
import AIChatAgent from '../src/js/ai-chat.js';

describe('AIChatAgent responsive behaviors', () => {
    let agent;

    beforeEach(() => {
        window.localStorage?.clear();
        if (window.__aiChatAgentInstance) {
            delete window.__aiChatAgentInstance;
        }
        document.body.innerHTML = '';
        document.body.classList.remove('ai-chat-open');
        agent = new AIChatAgent();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        document.body.classList.remove('ai-chat-open');
        if (window.__aiChatAgentInstance) {
            delete window.__aiChatAgentInstance;
        }
        document.querySelectorAll('.ai-chat-overlay, .ai-chat-widget').forEach(el => el.remove());
    });

    test('toggleChat manages body scroll locking', () => {
        agent.toggleChat(true);
        expect(document.body.classList.contains('ai-chat-open')).toBe(true);

        agent.toggleChat(false);
        expect(document.body.classList.contains('ai-chat-open')).toBe(false);
    });

    test('overlay click closes the chat panel and handles missing overlay gracefully', () => {
        agent.toggleChat(true);
        let overlay = document.querySelector('.ai-chat-overlay');

        expect(overlay).not.toBeNull();
        overlay.click();

        expect(agent.isOpen).toBe(false);
        expect(document.body.classList.contains('ai-chat-open')).toBe(false);

        agent.toggleChat(true);
        overlay = document.querySelector('.ai-chat-overlay');
        expect(overlay).not.toBeNull();
        overlay.remove();

        expect(() => {
            const missingOverlay = document.querySelector('.ai-chat-overlay');
            if (missingOverlay) {
                missingOverlay.click();
            }
        }).not.toThrow();

        expect(agent.isOpen).toBe(true);
        expect(document.body.classList.contains('ai-chat-open')).toBe(true);

        agent.toggleChat(false);
    });

    test('toggleChat updates accessibility attributes', () => {
        const toggle = document.querySelector('.ai-chat-toggle');
        const panel = document.querySelector('.ai-chat-panel');

        agent.toggleChat(true);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(toggle.getAttribute('aria-label')).toBe('Close chat');
        expect(panel.getAttribute('aria-hidden')).toBe('false');

        agent.toggleChat(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(toggle.getAttribute('aria-label')).toBe('Open chat');
        expect(panel.getAttribute('aria-hidden')).toBe('true');
    });
    test('handles missing panel without throwing errors', () => {
        const panel = document.querySelector('.ai-chat-panel');
        expect(panel).not.toBeNull();
        panel.remove();
        agent.panel = null;

        expect(() => agent.toggleChat(true)).not.toThrow();
        expect(agent.isOpen).toBe(true);

        expect(() => agent.toggleChat(false)).not.toThrow();
        expect(agent.isOpen).toBe(false);
    });

    test('sendMessage exits early when input is missing', async () => {
        const input = document.querySelector('#aiChatInput');
        expect(input).not.toBeNull();
        input.remove();
        agent.input = null;

        await expect(agent.sendMessage()).resolves.toBeUndefined();
        expect(agent.messages).toHaveLength(0);
    });
});
