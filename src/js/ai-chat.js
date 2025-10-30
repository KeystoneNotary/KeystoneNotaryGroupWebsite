// AI Chat Agent - Ready for Google Gemini API integration

class AIChatAgent {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiEndpoint = '/api/chat'; // Backend endpoint
        
        this.widget = document.querySelector('.ai-chat-widget');
        this.panel = document.querySelector('.ai-chat-panel');
        this.overlay = document.querySelector('.ai-chat-overlay');
        this.toggleButton = document.querySelector('.ai-chat-toggle');
        this.closeButton = document.querySelector('.ai-chat-close');
        this.sendButton = document.getElementById('aiChatSend');
        this.input = document.getElementById('aiChatInput');
        this.messagesContainer = document.getElementById('aiChatMessages');

        this.loadChatHistory();
        this.attachEventListeners();
    }

    attachEventListeners() {
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggleChat());
        }
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.toggleChat(false));
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.toggleChat(false));
        }
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    }

    toggleChat(forceState = null) {
        const nextState = typeof forceState === 'boolean' ? forceState : !this.isOpen;

        if (nextState === this.isOpen) {
            return;
        }

        this.isOpen = nextState;

        if (this.panel) {
            this.panel.classList.toggle('open', this.isOpen);
        }
        if (this.overlay) {
            this.overlay.classList.toggle('visible', this.isOpen);
        }
        if (this.toggleButton) {
            this.toggleButton.setAttribute('aria-expanded', this.isOpen);
            this.toggleButton.setAttribute('aria-label', this.isOpen ? 'Close chat' : 'Open chat');
        }
        if (this.panel) {
            this.panel.setAttribute('aria-hidden', this.isOpen ? 'false' : 'true');
        }

        document.body.classList.toggle('ai-chat-open', this.isOpen);

        if (this.isOpen && this.messages.length === 0) {
            this.addMessage('assistant', 'Hello! I can help you with notary services and schedule appointments. What can I assist you with today?');
        }
    }

    async sendMessage() {
        if (!this.input) return;

        const message = this.input.value.trim();

        if (!message) return;

        this.addMessage('user', message);
        this.input.value = '';
        
        this.showTypingIndicator();
        
        try {
            const response = await this.callAI(message);
            this.hideTypingIndicator();
            this.addMessage('assistant', response.message);
            
            if (response.action === 'booking') {
                this.handleBookingFlow(response.data);
            }
        } catch (_error) {
            this.hideTypingIndicator();
            this.addMessage('assistant', "I apologize, but I'm having trouble connecting. Please try again or call us at (267) 309-9000.");
        }
    }

    async callAI(message) {
        // TODO: Replace with actual API call to backend
        // Backend will call Google Gemini API
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                history: this.messages.slice(-10)
            })
        });
        
        if (!response.ok) throw new Error('API call failed');
        return await response.json();
    }

    addMessage(role, content) {
        this.messages.push({ role, content, timestamp: Date.now() });
        this.saveChatHistory();

        if (!this.messagesContainer) {
            return;
        }
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ai-message-${role}`;
        messageEl.textContent = content;
        this.messagesContainer.appendChild(messageEl);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        if (!this.messagesContainer) {
            return;
        }
        const indicator = document.createElement('div');
        indicator.className = 'ai-typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        indicator.id = 'typingIndicator';
        this.messagesContainer.appendChild(indicator);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    handleBookingFlow(data) {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            this.toggleChat(false);
            bookingSection.scrollIntoView({ behavior: 'smooth' });

            if (data.date) {
                // Pre-fill booking calendar with suggested date
                console.log('Pre-filling booking with:', data);
            }
        }
    }

    saveChatHistory() {
        localStorage.setItem('aiChatHistory', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const saved = localStorage.getItem('aiChatHistory');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.messages.forEach(msg => {
                if (this.messagesContainer) {
                    const messageEl = document.createElement('div');
                    messageEl.className = `ai-message ai-message-${msg.role}`;
                    messageEl.textContent = msg.content;
                    this.messagesContainer.appendChild(messageEl);
                }
            });
        }
    }
}

// Initialize when DOM is ready
const initializeAIChatAgent = () => {
    if (!window.__aiChatAgentInstance) {
        window.__aiChatAgentInstance = new AIChatAgent();
    }
};

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAIChatAgent);
    } else {
        initializeAIChatAgent();
    }
}

export { AIChatAgent, initializeAIChatAgent };
export default AIChatAgent;