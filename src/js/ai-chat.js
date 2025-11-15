// AI Chat Agent - Ready for Google Gemini API integration

import MemoryBank from './modules/memory/memory-bank.js';

const CHAT_MEMORY_CONFIG = Object.freeze({
    STORAGE_KEY: 'codex.memory.chat',
    MAX_ENTRIES: 150,
    DEFAULT_TTL_MS: 1000 * 60 * 60 * 24 * 21, // 21 days
    STALE_AFTER_MS: 1000 * 60 * 60 * 24 * 5, // Maintain a rolling window for lower-importance chat
    MIN_IMPORTANCE: 0.35
});

const CHAT_HISTORY_FALLBACK_KEY = 'aiChatHistory_fallback';
const CHAT_HISTORY_FALLBACK_LIMIT = 50;
const CHAT_HISTORY_RECENT_MESSAGES = 10;
const DAY_IN_MS = 1000 * 60 * 60 * 24;

const APPOINTMENT_REGEX = /appointment|schedule|apostille|mobile|travel|witness|loan|closing/i;
const CONTACT_REGEX = /call|phone|email|contact|website/i;
const USER_NEED_REGEX = /\?|need|help|urgent/i;
const ASSISTANT_SUMMARY_REGEX = /summary|recap|next steps|follow up/i;
const DOCUMENT_IMPORTANCE_REGEX = /appointment|schedule|document|travel|closing/i;
const ASSISTANT_TTL_REGEX = /summary|recap|notes/i;

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

class AIChatAgent {
    constructor() {
        this.isOpen = false;
        this.apiEndpoint = '/api/chat'; // Backend endpoint

        this.memoryBank = new MemoryBank({
            storageKey: CHAT_MEMORY_CONFIG.STORAGE_KEY,
            maxEntries: CHAT_MEMORY_CONFIG.MAX_ENTRIES,
            defaultTtlMs: CHAT_MEMORY_CONFIG.DEFAULT_TTL_MS,
            staleAfterMs: CHAT_MEMORY_CONFIG.STALE_AFTER_MS,
            minImportanceForRetention: CHAT_MEMORY_CONFIG.MIN_IMPORTANCE
        });

        this.messages = [];

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
                history: this.messages.slice(-CHAT_HISTORY_RECENT_MESSAGES)
            })
        });
        
        if (!response.ok) throw new Error('API call failed');
        return await response.json();
    }

    addMessage(role, content) {
        const timestamp = Date.now();
        const message = { role, content, timestamp };
        this.messages.push(message);
        this.persistMessage(message);

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

    loadChatHistory() {
        this.memoryBank.maintain();
        const stored = this.memoryBank.getMemories({
            category: 'chat',
            sortBy: 'createdAt',
            includeExpired: false
        });

        this.messages = stored.map((entry) => {
            let role = 'assistant';
            if (entry.metadata && typeof entry.metadata.role === 'string') {
                role = entry.metadata.role;
            } else if (Array.isArray(entry.tags) && entry.tags.length > 0) {
                const validRole = entry.tags.find((tag) => ['user', 'assistant'].includes(tag));
                if (validRole) {
                    role = validRole;
                }
            }

            return {
                role,
                content: entry.content,
                timestamp: entry.metadata?.timestamp ?? entry.createdAt
            };
        });

        this.messages.forEach((msg) => {
            if (!this.messagesContainer) {
                return;
            }
            const messageEl = document.createElement('div');
            messageEl.className = `ai-message ai-message-${msg.role}`;
            messageEl.textContent = msg.content;
            this.messagesContainer.appendChild(messageEl);
        });
    }

    persistMessage(message) {
        try {
            this.memoryBank.addMemory({
                content: message.content,
                category: 'chat',
                tags: [message.role],
                importance: this.estimateMessageImportance(message.content, message.role),
                ttlMs: this.getMessageTtl(message.role, message.content),
                metadata: {
                    role: message.role,
                    timestamp: message.timestamp
                },
                createdAt: message.timestamp
            });
        } catch (error) {
            console.error('AIChatAgent: Failed to persist chat memory', error);
            if (typeof localStorage === 'undefined') {
                return;
            }
            try {
                const fallbackHistory = JSON.parse(
                    localStorage.getItem(CHAT_HISTORY_FALLBACK_KEY) || '[]'
                );
                fallbackHistory.push(message);
                const trimmedHistory = fallbackHistory.slice(-CHAT_HISTORY_FALLBACK_LIMIT);
                localStorage.setItem(
                    CHAT_HISTORY_FALLBACK_KEY,
                    JSON.stringify(trimmedHistory)
                );
            } catch (fallbackError) {
                console.warn('AIChatAgent: Fallback persistence also failed', fallbackError);
            }
        }
    }

    estimateMessageImportance(content, role) {
        let score = role === 'user' ? 0.55 : 0.45;

        if (typeof content === 'string') {
            if (content.length > 160) {
                score += 0.1;
            } else if (content.length > 40) {
                score += 0.05;
            }

            if (APPOINTMENT_REGEX.test(content)) {
                score += 0.2;
            }

            if (CONTACT_REGEX.test(content)) {
                score += 0.1;
            }

            if (role === 'user' && USER_NEED_REGEX.test(content)) {
                score += 0.05;
            }

            if (role === 'assistant' && ASSISTANT_SUMMARY_REGEX.test(content)) {
                score += 0.05;
            }
        }

        return clampValue(score, 0.2, 1);
    }

    getMessageTtl(role, content) {
        let baseTtl = role === 'user' ? DAY_IN_MS * 28 : DAY_IN_MS * 21;

        if (typeof content === 'string' && DOCUMENT_IMPORTANCE_REGEX.test(content)) {
            baseTtl += DAY_IN_MS * 14;
        }

        if (role === 'assistant' && ASSISTANT_TTL_REGEX.test(content)) {
            baseTtl += DAY_IN_MS * 7;
        }

        return baseTtl;
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
