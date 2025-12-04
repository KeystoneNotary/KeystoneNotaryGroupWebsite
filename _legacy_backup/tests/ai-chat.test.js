import { describe, test, beforeEach, afterEach, expect } from 'vitest';
import { AIChatAgent } from '../src/js/ai-chat.js';

const setupAIChatDOM = () => {
    document.body.innerHTML = `
        <div class="ai-chat-overlay"></div>
        <div class="ai-chat-widget">
            <button class="ai-chat-toggle" aria-expanded="false" aria-label="Open chat"></button>
            <div class="ai-chat-panel" aria-hidden="true">
                <div class="ai-chat-header">
                    <h3>Assistant</h3>
                    <button class="ai-chat-close" aria-label="Close chat"></button>
                </div>
                <div id="aiChatMessages"></div>
                <div id="aiChatStatus" aria-live="polite" aria-atomic="true"></div>
                <div class="ai-chat-input-wrapper">
                    <input type="text" id="aiChatInput" placeholder="Type your message...">
                    <button id="aiChatSend">Send</button>
                </div>
            </div>
        </div>
    `;
};

describe('AIChatAgent responsive behaviors', () => {
    let agent;

    beforeEach(() => {
        setupAIChatDOM();
        localStorage.clear();
        if (window.__aiChatAgentInstance) {
            delete window.__aiChatAgentInstance;
        }
        document.body.classList.remove('ai-chat-open');
        agent = new AIChatAgent();
    });

    afterEach(() => {
        // Clean up global state not handled by jsdom
        if (window.__aiChatAgentInstance) {
            delete window.__aiChatAgentInstance;
        }
    });

    test('toggleChat manages body scroll locking', () => {
        agent.toggleChat(true);
        expect(document.body.classList.contains('ai-chat-open')).toBe(true);

        agent.toggleChat(false);
        expect(document.body.classList.contains('ai-chat-open')).toBe(false);
    });

    test('overlay click closes the chat panel', () => {
        agent.toggleChat(true);
        const overlay = document.querySelector('.ai-chat-overlay');
        expect(overlay).not.toBeNull();
        overlay.click();
        expect(agent.isOpen).toBe(false);
        expect(document.body.classList.contains('ai-chat-open')).toBe(false);
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
});