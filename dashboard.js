// Dashboard per gestione conversazioni chatbot
// Versione aggiornata compatibile con firebase-api.js

class ChatbotDashboard {
    constructor() {
        this.conversations = [];
        this.currentConversation = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inizializzazione Dashboard...');
        
        // Aspetta che Firebase sia pronto - usa la variabile corretta
        this.firebaseAPI = window.firebase;
        
        if (!this.firebaseAPI || !this.firebaseAPI.getAllConversations) {
            console.error('❌ Firebase API non trovata o metodo getAllConversations mancante');
            console.log('🔍 Firebase disponibile:', this.firebaseAPI);
            console.log('🔍 Metodi disponibili:', this.firebaseAPI ? Object.keys(this.firebaseAPI) : 'N/A');
            this.showError('Firebase API non disponibile');
            return;
        }
        
        console.log('✅ Firebase API trovata:', this.firebaseAPI);

        // Carica le conversazioni
        await this.loadConversations();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Dashboard inizializzata');
    }

    async loadConversations() {
        try {
            console.log('📡 Caricamento conversazioni...');
            this.showLoading(true);
            
            // Usa l'API Firebase trovata
            this.conversations = await this.firebaseAPI.getAllConversations();
            
            console.log(`💬 Caricate ${this.conversations.length} conversazioni`);
            
            // Renderizza la tabella
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
        if (!tbody) {
            console.error('❌ Tabella conversazioni non trovata');
            return;
        }

        // Pulisce la tabella
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
            const dateA = new Date(a.lastActivity || a.createdAt || 0);
            const dateB = new Date(b.lastActivity || b.createdAt || 0);
            return dateB - dateA;
        });

        // Renderizza ogni conversazione
        sortedConversations.forEach(conv => {
            const row = this.createConversationRow(conv);
            tbody.appendChild(row);
        });

        console.log(`✅ Renderizzate ${sortedConversations.length} righe`);
    }

    createConversationRow(conversation) {
        const row = document.createElement('tr');
        
        // Estrae informazioni
        const id = conversation.id || 'N/A';
        const shortId = id.length > 10 ? id.substring(0, 10) + '...' : id;
        const customerName = conversation.customerName || 'Cliente Anonimo';
        const phone = conversation.phone || 'N/A';
        const topic = conversation.topic || 'Generale';
        const messagesCount = conversation.messages ? conversation.messages.length : 0;
        
        // Formatta data ultima attività
        const lastActivity = this.formatDate(conversation.lastActivity || conversation.createdAt);
        
        // Ottieni ultimo messaggio
        const lastMessage = this.getLastMessage(conversation);

        row.innerHTML = `
            <td>
                <small class="text-muted">${shortId}</small>
            </td>
            <td>
                <strong>${customerName}</strong>
                ${phone !== 'N/A' ? `<br><small class="text-muted">${phone}</small>` : ''}
            </td>
            <td>
                <span class="badge badge-info">${topic}</span>
            </td>
            <td>
                <small>${lastMessage}</small>
            </td>
            <td>
                <small class="text-muted">${lastActivity}</small>
                <br><small class="text-info">${messagesCount} messaggi</small>
            </td>
            <td>
                <button class="btn btn-primary btn-sm view-conversation" 
                        data-conversation-id="${id}">
                    <i class="fas fa-eye"></i> Vedi Conversazione
                </button>
                <button class="btn btn-secondary btn-sm export-conversation" 
                        data-conversation-id="${id}">
                    <i class="fas fa-download"></i> Esporta
                </button>
            </td>
        `;

        return row;
    }

    getLastMessage(conversation) {
        if (!conversation.messages || conversation.messages.length === 0) {
            return 'Nessun messaggio';
        }

        const lastMsg = conversation.messages[conversation.messages.length - 1];
        let text = lastMsg.text || lastMsg.message || 'Messaggio vuoto';
        
        // Trunca se troppo lungo
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
        // Event delegation per i pulsanti dinamici
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-conversation')) {
                const conversationId = e.target.closest('.view-conversation').dataset.conversationId;
                this.showConversationModal(conversationId);
            }
            
            if (e.target.closest('.export-conversation')) {
                const conversationId = e.target.closest('.export-conversation').dataset.conversationId;
                this.exportConversation(conversationId);
            }
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshConversations');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadConversations();
            });
        }

        // Search input
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
            
            // Trova la conversazione
            const conversation = this.conversations.find(c => c.id === conversationId);
            if (!conversation) {
                console.error('❌ Conversazione non trovata:', conversationId);
                this.showError('Conversazione non trovata');
                return;
            }

            this.currentConversation = conversation;
            
            // Aggiorna il modal
            this.updateConversationModal(conversation);
            
            // Mostra il modal
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
        document.getElementById('modalConversationId').textContent = conversation.id || 'N/A';
        document.getElementById('modalCustomerName').textContent = conversation.customerName || 'Cliente Anonimo';
        document.getElementById('modalPhone').textContent = conversation.phone || 'N/A';
        document.getElementById('modalTopic').textContent = conversation.topic || 'Generale';
        document.getElementById('modalCreatedAt').textContent = this.formatDate(conversation.createdAt);
        document.getElementById('modalMessageCount').textContent = conversation.messages ? conversation.messages.length : 0;

        // Renderizza i messaggi
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

        // Determina il tipo di messaggio
        const isUser = message.sender === 'user' || message.type === 'user';
        const senderClass = isUser ? 'user-message' : 'bot-message';
        const senderLabel = isUser ? 'Utente' : 'Bot';
        const senderIcon = isUser ? 'fa-user' : 'fa-robot';

        // Formatta timestamp
        const timestamp = this.formatDate(message.timestamp || message.createdAt);

        // Testo del messaggio
        const messageText = message.text || message.message || 'Messaggio vuoto';

        div.innerHTML = `
            <div class="card ${senderClass}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>
                        <i class="fas ${senderIcon}"></i> ${senderLabel}
                    </span>
                    <small class="text-muted">${timestamp}</small>
                </div>
                <div class="card-body">
                    <p class="card-text">${this.escapeHtml(messageText)}</p>
                    ${message.metadata ? `<small class="text-muted">Metadata: ${JSON.stringify(message.metadata)}</small>` : ''}
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

    exportConversation(conversationId) {
        try {
            const conversation = this.conversations.find(c => c.id === conversationId);
            if (!conversation) {
                console.error('❌ Conversazione non trovata per export:', conversationId);
                return;
            }

            const dataStr = JSON.stringify(conversation, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `conversazione_${conversationId}_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            console.log('✅ Conversazione esportata:', conversationId);
            
        } catch (error) {
            console.error('❌ Errore export conversazione:', error);
            this.showError('Errore nell\'esportazione');
        }
    }

    showLoading(show) {
        const loadingElement = document.getElementById('loadingSpinner');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        console.error('❌ Errore:', message);
        
        // Mostra toast di errore se disponibile
        if (typeof toastr !== 'undefined') {
            toastr.error(message);
        } else {
            alert('Errore: ' + message);
        }
    }

    showSuccess(message) {
        console.log('✅ Successo:', message);
        
        // Mostra toast di successo se disponibile
        if (typeof toastr !== 'undefined') {
            toastr.success(message);
        }
    }
}

// Inizializza la dashboard quando il DOM è pronto
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

window.exportAllConversations = () => {
    if (window.chatbotDashboard && window.chatbotDashboard.conversations) {
        try {
            const dataStr = JSON.stringify(window.chatbotDashboard.conversations, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `tutte_conversazioni_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            console.log('✅ Tutte le conversazioni esportate');
            
        } catch (error) {
            console.error('❌ Errore export totale:', error);
        }
    }
};