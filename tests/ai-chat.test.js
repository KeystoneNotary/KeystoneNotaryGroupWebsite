const AIChatAgent = require('../js/ai-chat.js');

describe('AIChatAgent responsive behaviors', () => {
    let agent;

    beforeEach(() => {
        document.body.innerHTML = '';
        document.body.classList.remove('ai-chat-open');
        agent = new AIChatAgent();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        document.body.classList.remove('ai-chat-open');
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
