// Dashboard.js - Versione con fix minimale per visualizzazione messaggi

class ChatbotDashboard {
    constructor() {
        this.conversations = [];
        this.currentConversation = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inizializzazione Dashboard...');
        await this.loadConversations();
        this.setupEventListeners();
        console.log('✅ Dashboard inizializzata');
    }

    async loadConversations() {
        try {
            console.log('📡 Caricamento conversazioni...');
            this.showLoading(true);
            
            // Usa la funzione esistente che già funziona
            this.conversations = await window.firebase.getAllConversations();
            console.log(`💬 Caricate ${this.conversations.length} conversazioni`);
            
            this.renderConversationsTable();
            
        } catch (error) {
            console.error('❌ Errore caricamento conversazioni:', error);
            this.showError('Errore nel caricamento delle conversazioni');
        } finally {
            this.showLoading(false);
        }
    }

    renderConversationsTable() {
        const tbody = document.querySelector('#conversationsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.conversations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        <i class="fas fa-inbox"></i> Nessuna conversazione trovata
                    </td>
                </tr>
            `;
            return;
        }

        // Ordina per data più recente
        const sortedConversations = [...this.conversations].sort((a, b) => {
            const dateA = new Date(a.lastActivity || a.timestamp || a.dateCreated || 0);
            const dateB = new Date(b.lastActivity || b.timestamp || b.dateCreated || 0);
            return dateB - dateA;
        });

        sortedConversations.forEach(conv => {
            const row = this.createConversationRow(conv);
            tbody.appendChild(row);
        });

        console.log(`✅ Renderizzate ${sortedConversations.length} righe`);
    }

    createConversationRow(conversation) {
        const row = document.createElement('tr');
        
        // Estrae informazioni (compatibile con struttura esistente)
        const id = conversation.id || 'N/A';
        const shortId = id.length > 10 ? id.substring(0, 10) + '...' : id;
        const customerName = conversation.customerName || conversation.customer || 'Cliente Anonimo';
        const phone = conversation.phone || conversation.customerPhone || 'N/A';
        const topic = conversation.topic || 'Generale';
        const messagesCount = conversation.messages ? conversation.messages.length : 0;
        
        // Formatta data ultima attività
        const lastActivity = this.formatDate(conversation.lastActivity || conversation.timestamp || conversation.dateCreated);
        
        // Ottieni ultimo messaggio
        const lastMessage = this.getLastMessage(conversation);

        row.innerHTML = `
            <td><small class="text-muted">${shortId}</small></td>
            <td>
                <strong>${customerName}</strong>
                ${phone !== 'N/A' ? `<br><small class="text-muted">${phone}</small>` : ''}
            </td>
            <td><span class="badge badge-info">${topic}</span></td>
            <td><small>${lastMessage}</small></td>
            <td>
                <small class="text-muted">${lastActivity}</small>
                <br><small class="text-info">${messagesCount} messaggi</small>
            </td>
            <td>
                <button class="btn btn-primary btn-sm view-conversation" data-conversation-id="${id}">
                    <i class="fas fa-eye"></i> Vedi Conversazione
                </button>
            </td>
        `;

        return row;
    }

    getLastMessage(conversation) {
        if (!conversation.messages || conversation.messages.length === 0) {
            return conversation.lastMessageSnippet || 'Nessun messaggio';
        }

        const lastMsg = conversation.messages[conversation.messages.length - 1];
        let text = lastMsg.text || lastMsg.message || lastMsg.content || 'Messaggio vuoto';
        
        if (text.length > 50) {
            text = text.substring(0, 50) + '...';
        }

        return text;
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data non valida';
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-conversation')) {
                const conversationId = e.target.closest('.view-conversation').dataset.conversationId;
                this.showConversationModal(conversationId);
            }
        });

        const refreshBtn = document.getElementById('refreshConversations');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadConversations();
            });
        }

        const searchInput = document.getElementById('searchConversations');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterConversations(e.target.value);
            });
        }
    }

    async showConversationModal(conversationId) {
        try {
            console.log(`🔍 Apertura conversazione: ${conversationId}`);
            
            const conversation = this.conversations.find(c => c.id === conversationId);
            if (!conversation) {
                this.showError('Conversazione non trovata');
                return;
            }

            this.currentConversation = conversation;
            this.updateConversationModal(conversation);
            
            const modal = document.getElementById('conversationModal');
            if (modal) {
                $(modal).modal('show');
            }
            
        } catch (error) {
            console.error('❌ Errore apertura conversazione:', error);
            this.showError('Errore nell\'apertura della conversazione');
        }
    }

    updateConversationModal(conversation) {
        // Aggiorna header del modal
        const elements = {
            'modalConversationId': conversation.id || 'N/A',
            'modalCustomerName': conversation.customerName || conversation.customer || 'Cliente Anonimo',
            'modalPhone': conversation.phone || conversation.customerPhone || 'N/A',
            'modalTopic': conversation.topic || 'Generale',
            'modalCreatedAt': this.formatDate(conversation.createdAt || conversation.dateCreated || conversation.timestamp),
            'modalMessageCount': conversation.messages ? conversation.messages.length : 0
        };

        // Aggiorna gli elementi DOM
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // 🔥 FIX PRINCIPALE: Renderizza i messaggi correttamente
        this.renderMessages(conversation.messages || []);
    }

    renderMessages(messages) {
        const container = document.getElementById('messagesContainer');
        if (!container) {
            console.error('❌ Container messaggi non trovato');
            return;
        }

        container.innerHTML = '';

        if (messages.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> Nessun messaggio in questa conversazione
                </div>
            `;
            return;
        }

        console.log(`🔧 Rendering ${messages.length} messaggi:`, messages);

        messages.forEach((message, index) => {
            const messageElement = this.createMessageElement(message, index);
            container.appendChild(messageElement);
        });

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
        console.log(`✅ Renderizzati ${messages.length} messaggi`);
    }

    createMessageElement(message, index) {
        const div = document.createElement('div');
        div.className = 'message-item mb-3';

        // 🔥 FIX: Gestisce diversi formati di messaggi
        const isUser = message.sender === 'user' || 
                      message.role === 'user' || 
                      message.type === 'user' ||
                      message.from === 'user';
        
        const senderClass = isUser ? 'user-message' : 'bot-message';
        const senderLabel = isUser ? 'Utente' : 'Bot';
        const senderIcon = isUser ? 'fa-user' : 'fa-robot';

        // 🔥 FIX: Estrae il testo del messaggio da diversi campi possibili
        const messageText = message.text || 
                           message.message || 
                           message.content || 
                           message.body || 
                           'Messaggio vuoto';

        // Formatta timestamp
        const timestamp = this.formatDate(
            message.timestamp || 
            message.createdAt || 
            message.date || 
            message.time
        );

        div.innerHTML = `
            <div class="card ${senderClass}" style="margin-bottom: 10px;">
                <div class="card-header d-flex justify-content-between align-items-center" 
                     style="background-color: ${isUser ? '#e3f2fd' : '#f5f5f5'};">
                    <span>
                        <i class="fas ${senderIcon}"></i> ${senderLabel}
                    </span>
                    <small class="text-muted">${timestamp}</small>
                </div>
                <div class="card-body" style="padding: 10px;">
                    <p class="card-text" style="margin: 0; white-space: pre-wrap;">${this.escapeHtml(messageText)}</p>
                </div>
            </div>
        `;

        return div;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    filterConversations(searchTerm) {
        const rows = document.querySelectorAll('#conversationsTable tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const shouldShow = text.includes(term);
            row.style.display = shouldShow ? '' : 'none';
        });
    }

    showLoading(show) {
        const loadingElement = document.getElementById('loadingSpinner');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        console.error('❌ Errore:', message);
        if (typeof toastr !== 'undefined') {
            toastr.error(message);
        } else {
            alert('Errore: ' + message);
        }
    }

    showSuccess(message) {
        console.log('✅ Successo:', message);
        if (typeof toastr !== 'undefined') {
            toastr.success(message);
        }
    }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inizializzazione Dashboard Chatbot...');
    window.chatbotDashboard = new ChatbotDashboard();
});

// Funzioni helper globali
window.refreshDashboard = () => {
    if (window.chatbotDashboard) {
        window.chatbotDashboard.loadConversations();
    }
};