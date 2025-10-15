// AI Chat Agent - Ready for Google Gemini API integration

class AIChatAgent {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.apiEndpoint = '/api/chat'; // Backend endpoint
        this.init();
    }

    init() {
        this.createChatWidget();
        this.loadChatHistory();
        this.attachEventListeners();
    }

    createChatWidget() {
        const widget = document.createElement('div');
        widget.className = 'ai-chat-widget';
        widget.innerHTML = `
            <button class="ai-chat-toggle" aria-label="Open chat">
                <span class="chat-icon">💬</span>
            </button>
            <div class="ai-chat-panel">
                <div class="ai-chat-header">
                    <h3>Notary Assistant</h3>
                    <button class="ai-chat-close" aria-label="Close chat">×</button>
                </div>
                <div class="ai-chat-messages" id="aiChatMessages"></div>
                <div class="ai-chat-input-wrapper">
                    <input type="text" class="ai-chat-input" placeholder="Ask about our services..." id="aiChatInput">
                    <button class="ai-chat-send" id="aiChatSend">
                        <span>→</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
    }

    attachEventListeners() {
        const toggle = document.querySelector('.ai-chat-toggle');
        const close = document.querySelector('.ai-chat-close');
        const send = document.getElementById('aiChatSend');
        const input = document.getElementById('aiChatInput');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const panel = document.querySelector('.ai-chat-panel');
        panel.classList.toggle('open', this.isOpen);
        
        if (this.isOpen && this.messages.length === 0) {
            this.addMessage('assistant', 'Hello! I can help you with notary services and schedule appointments. What can I assist you with today?');
        }
    }

    async sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        
        this.showTypingIndicator();
        
        try {
            const response = await this.callAI(message);
            this.hideTypingIndicator();
            this.addMessage('assistant', response.message);
            
            if (response.action === 'booking') {
                this.handleBookingFlow(response.data);
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('assistant', 'I apologize, but I\'m having trouble connecting. Please try again or call us at (123) 456-7890.');
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
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = `ai-message ai-message-${role}`;
        messageEl.textContent = content;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ role, content, timestamp: Date.now() });
        this.saveChatHistory();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiChatMessages');
        const indicator = document.createElement('div');
        indicator.className = 'ai-typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        indicator.id = 'typingIndicator';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    handleBookingFlow(data) {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            this.toggleChat();
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
                const messagesContainer = document.getElementById('aiChatMessages');
                if (messagesContainer) {
                    const messageEl = document.createElement('div');
                    messageEl.className = `ai-message ai-message-${msg.role}`;
                    messageEl.textContent = msg.content;
                    messagesContainer.appendChild(messageEl);
                }
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AIChatAgent());
} else {
    new AIChatAgent();
}
