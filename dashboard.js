// dashboard.js - TribuCoach Dashboard con supporto conversazioni chatbot
import { 
    getAllQuizResults, 
    getLeads, 
    setupQuizListener, 
    setupLeadsListener,
    formatDateTime,
    calculateLeadScore,
    getProfileIcon
} from './firebase-functions.js';

class ChatbotDashboard {
    constructor() {
        this.quizResults = [];
        this.chatConversations = [];
        this.leads = [];
        this.unsubscribeQuiz = null;
        this.unsubscribeLeads = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inizializzazione Dashboard...');
        
        this.updateConnectionStatus('connecting');
        
        try {
            // Carica dati iniziali
            await this.loadAllData();
            
            // Setup listeners real-time
            this.setupRealtimeListeners();
            
            // Setup event listeners UI
            this.setupEventListeners();
            
            this.updateConnectionStatus('connected');
            console.log('✅ Dashboard inizializzata con successo');
            
        } catch (error) {
            console.error('❌ Errore inizializzazione dashboard:', error);
            this.updateConnectionStatus('error');
        }
    }

    async loadAllData() {
        console.log('📡 Caricamento dati...');
        
        // Carica quiz results
        this.quizResults = await getAllQuizResults();
        console.log(`📊 Quiz caricati: ${this.quizResults.length}`);
        
        // Carica leads 
        this.leads = await getLeads();
        console.log(`👥 Leads caricati: ${this.leads.length}`);
        
        // 🔥 Carica conversazioni chatbot usando firebase-api.js
        await this.loadChatConversations();
        
        // Aggiorna tutte le sezioni
        this.updateQuizTable();
        this.updateChatConversationsTable();
        this.updateMetrics();
        this.updateCharts();
        this.updateInsights();
        
        this.updateLastUpdateTime();
    }

    async loadChatConversations() {
        try {
            console.log('💬 Caricamento conversazioni chatbot...');
            
            // Aspetta che firebase-api.js sia caricato
            let attempts = 0;
            while (!window.firebaseAPI && attempts < 100) {
                console.log(`⏳ Tentativo ${attempts + 1}/100 - Aspetto firebase-api.js...`);
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }
            
            if (window.firebaseAPI && window.firebaseAPI.getAllConversations) {
                console.log('✅ firebase-api.js trovato, carico conversazioni...');
                this.chatConversations = await window.firebaseAPI.getAllConversations();
                console.log(`💬 Conversazioni caricate: ${this.chatConversations.length}`);
            } else {
                console.error('❌ firebase-api.js NON TROVATO dopo 100 tentativi');
                console.log('🔍 Variabili window disponibili:', Object.keys(window).filter(k => k.toLowerCase().includes('firebase')));
                this.chatConversations = [];
            }
        } catch (error) {
            console.error('❌ Errore caricamento conversazioni:', error);
            this.chatConversations = [];
        }
    }

    setupRealtimeListeners() {
        console.log('🔄 Configurazione listeners real-time...');
        
        // Quiz listener
        this.unsubscribeQuiz = setupQuizListener((results) => {
            this.quizResults = results;
            this.updateQuizTable();
            this.updateMetrics();
            this.updateCharts();
            this.updateInsights();
            this.updateLastUpdateTime();
        });
        
        // Leads listener  
        this.unsubscribeLeads = setupLeadsListener((leads) => {
            this.leads = leads;
            this.updateMetrics();
            this.updateLastUpdateTime();
        });
    }

    setupEventListeners() {
        // Gestione click sui pulsanti delle conversazioni
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-conversation-btn')) {
                const conversationId = e.target.closest('.view-conversation-btn').dataset.conversationId;
                this.showConversationModal(conversationId);
            }
            
            if (e.target.closest('.whatsapp-btn')) {
                const phone = e.target.closest('.whatsapp-btn').dataset.phone;
                this.openWhatsApp(phone);
            }
        });

        // Chiusura modal
        window.closeModal = () => {
            document.getElementById('detailsModal').style.display = 'none';
        };

        // Click fuori dal modal per chiudere
        document.getElementById('detailsModal').addEventListener('click', (e) => {
            if (e.target.id === 'detailsModal') {
                window.closeModal();
            }
        });
    }

    updateQuizTable() {
        const tbody = document.getElementById('quiz-results-table-body');
        if (!tbody) return;

        if (this.quizResults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="12" class="no-data">Nessun risultato quiz trovato</td></tr>';
            return;
        }

        tbody.innerHTML = this.quizResults.map(result => {
            const score = calculateLeadScore(result);
            const profileIcon = getProfileIcon(result.profile_type);
            const timestamp = formatDateTime(result.timestamp);

            return `
                <tr>
                    <td><strong>${result.name || 'N/A'}</strong></td>
                    <td>${result.age || 'N/A'}</td>
                    <td>${result.email || 'N/A'}</td>
                    <td>${result.whatsapp || 'N/A'}</td>
                    <td>${result.gender || 'N/A'}</td>
                    <td>${profileIcon} ${result.profile_type || 'N/A'}</td>
                    <td>${Array.isArray(result.goals) ? result.goals.slice(0,2).join(', ') : result.goals || 'N/A'}</td>
                    <td>${result.training_style || 'N/A'}</td>
                    <td>${Array.isArray(result.obstacles) ? result.obstacles.slice(0,2).join(', ') : result.obstacles || 'N/A'}</td>
                    <td><span style="color: ${score >= 70 ? '#4CAF50' : score >= 50 ? '#ff9800' : '#f44336'}">${score}%</span></td>
                    <td>${timestamp}</td>
                    <td>
                        <button class="action-button" onclick="showQuizDetails('${result.id}')">
                            👁️ Dettagli
                        </button>
                        ${result.whatsapp ? `
                            <button class="action-button whatsapp whatsapp-btn" data-phone="${result.whatsapp}">
                                📱 WhatsApp
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateChatConversationsTable() {
        const tbody = document.getElementById('chatbot-conversations-table-body');
        if (!tbody) return;

        if (this.chatConversations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Nessuna conversazione chatbot trovata</td></tr>';
            return;
        }

        tbody.innerHTML = this.chatConversations.map(conversation => {
            const lastActivity = formatDateTime(conversation.lastActivity);
            const shortId = conversation.id.length > 10 ? conversation.id.substring(0, 10) + '...' : conversation.id;

            return `
                <tr>
                    <td><code>${shortId}</code></td>
                    <td><strong>${conversation.customerName || 'Cliente Anonimo'}</strong></td>
                    <td>${conversation.phone || 'N/A'}</td>
                    <td><small>${conversation.lastMessageSnippet || 'Nessun messaggio'}</small></td>
                    <td><span style="background: #ff6600; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${conversation.topic || 'Generale'}</span></td>
                    <td>${lastActivity}</td>
                    <td>
                        <button class="action-button view-conversation-btn" data-conversation-id="${conversation.id}">
                            👁️ Vedi Conversazione
                        </button>
                        ${conversation.phone && conversation.phone !== 'N/A' ? `
                            <button class="action-button whatsapp whatsapp-btn" data-phone="${conversation.phone}">
                                📱 WhatsApp
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    showConversationModal(conversationId) {
        console.log(`🔍 Apertura conversazione: ${conversationId}`);
        
        const conversation = this.chatConversations.find(c => c.id === conversationId);
        if (!conversation) {
            alert('Conversazione non trovata');
            return;
        }

        const modal = document.getElementById('detailsModal');
        const modalBody = document.getElementById('modal-body-content');

        modalBody.innerHTML = `
            <h3>💬 Dettagli Conversazione Chatbot</h3>
            
            <div class="conversation-header">
                <p><strong>ID Conversazione:</strong> ${conversation.id}</p>
                <p><strong>Cliente:</strong> ${conversation.customerName || 'Cliente Anonimo'}</p>
                <p><strong>Telefono:</strong> ${conversation.phone || 'N/A'}</p>
                <p><strong>Argomento:</strong> ${conversation.topic || 'Generale'}</p>
                <p><strong>Data Creazione:</strong> ${formatDateTime(conversation.createdAt)}</p>
                <p><strong>Ultima Attività:</strong> ${formatDateTime(conversation.lastActivity)}</p>
                <p><strong>Numero Messaggi:</strong> ${conversation.messages ? conversation.messages.length : 0}</p>
                <p><strong>Fonte:</strong> ${conversation.source || 'N/A'}</p>
            </div>

            <div class="conversation-messages">
                <h4>📝 Cronologia Messaggi</h4>
                <div class="messages-container">
                    ${this.renderConversationMessages(conversation.messages || [])}
                </div>
            </div>

            <div class="conversation-actions">
                ${conversation.phone && conversation.phone !== 'N/A' ? `
                    <button class="action-button whatsapp whatsapp-btn" data-phone="${conversation.phone}">
                        📱 Contatta via WhatsApp
                    </button>
                ` : ''}
                <button class="action-button" onclick="navigator.clipboard.writeText('${conversation.id}')">
                    📋 Copia ID Conversazione
                </button>
            </div>
        `;

        modal.style.display = 'flex';
    }

    renderConversationMessages(messages) {
        if (!messages || messages.length === 0) {
            return '<p class="no-messages">❌ Nessun messaggio in questa conversazione</p>';
        }

        return messages.map((message, index) => {
            // Determina il tipo di messaggio
            const isUser = message.role === 'user' || 
                          message.sender === 'user' || 
                          message.type === 'user' ||
                          message.from === 'user';
            
            const messageClass = isUser ? 'user-message' : 'assistant-message';
            const icon = isUser ? '👤' : '🤖';
            const role = isUser ? 'Utente' : 'Assistente';
            
            // Estrae il testo del messaggio
            const messageText = message.text || 
                               message.message || 
                               message.content || 
                               message.body || 
                               'Messaggio vuoto';
            
            // Formatta timestamp
            const timestamp = formatDateTime(
                message.timestamp || 
                message.createdAt || 
                message.date || 
                message.time
            );

            return `
                <div class="message-bubble ${messageClass}">
                    <div class="message-header">
                        <span class="message-icon">${icon}</span>
                        <span class="message-role">${role}</span>
                        <span class="message-time">${timestamp}</span>
                    </div>
                    <div class="message-content">${this.escapeHtml(messageText)}</div>
                </div>
            `;
        }).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    openWhatsApp(phone) {
        if (!phone || phone === 'N/A') {
            alert('Numero di telefono non disponibile');
            return;
        }
        
        // Pulisce il numero
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}`;
        window.open(whatsappUrl, '_blank');
    }

    updateMetrics() {
        // Metriche principali
        document.getElementById('totalQuizzes').textContent = this.quizResults.length;
        document.getElementById('totalChatConversations').textContent = this.chatConversations.length;
        
        // Score medio
        const avgScore = this.quizResults.length > 0 
            ? Math.round(this.quizResults.reduce((sum, q) => sum + calculateLeadScore(q), 0) / this.quizResults.length)
            : 0;
        document.getElementById('avgQuizScore').textContent = `${avgScore}%`;
        
        // KPI
        document.getElementById('kpiTotalQuizzes').textContent = this.quizResults.length;
        document.getElementById('kpiTotalChatConversations').textContent = this.chatConversations.length;
        
        // High score leads
        const highScoreLeads = this.quizResults.filter(q => calculateLeadScore(q) >= 70).length;
        document.getElementById('highScoreLeads').textContent = highScoreLeads;
    }

    updateCharts() {
        // Placeholder per i grafici - implementa se necessario
        console.log('📊 Aggiornamento grafici...');
    }

    updateInsights() {
        // Qualified leads
        const qualifiedCount = this.quizResults.filter(q => calculateLeadScore(q) >= 70).length;
        document.getElementById('qualifiedLeadsCount').textContent = qualifiedCount;

        // Most popular goal
        const goals = this.quizResults.flatMap(q => Array.isArray(q.goals) ? q.goals : [q.goals]).filter(Boolean);
        const goalCounts = goals.reduce((acc, goal) => {
            acc[goal] = (acc[goal] || 0) + 1;
            return acc;
        }, {});
        const mostPopularGoal = Object.keys(goalCounts).reduce((a, b) => goalCounts[a] > goalCounts[b] ? a : b, 'N/A');
        document.getElementById('mostPopularGoal').textContent = mostPopularGoal;

        // Most common obstacle
        const obstacles = this.quizResults.flatMap(q => Array.isArray(q.obstacles) ? q.obstacles : [q.obstacles]).filter(Boolean);
        const obstacleCounts = obstacles.reduce((acc, obstacle) => {
            acc[obstacle] = (acc[obstacle] || 0) + 1;
            return acc;
        }, {});
        const mostCommonObstacle = Object.keys(obstacleCounts).reduce((a, b) => obstacleCounts[a] > obstacleCounts[b] ? a : b, 'N/A');
        document.getElementById('mostCommonObstacle').textContent = mostCommonObstacle;
    }

    updateConnectionStatus(status) {
        const statusEl = document.getElementById('connection-status');
        statusEl.className = `connection-status status-${status}`;
        
        switch(status) {
            case 'connected':
                statusEl.textContent = '✅ Connesso a Firebase';
                break;
            case 'connecting':
                statusEl.textContent = '⏳ Connessione in corso...';
                break;
            case 'error':
                statusEl.textContent = '❌ Errore di connessione';
                break;
        }
    }

    updateLastUpdateTime() {
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString('it-IT');
    }

    // Cleanup
    destroy() {
        if (this.unsubscribeQuiz) this.unsubscribeQuiz();
        if (this.unsubscribeLeads) this.unsubscribeLeads();
    }
}

// Funzioni globali per il HTML
window.showQuizDetails = (quizId) => {
    console.log('Mostra dettagli quiz:', quizId);
    // Implementa se necessario
};

window.closeModal = () => {
    document.getElementById('detailsModal').style.display = 'none';
};

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inizializzazione Dashboard TribuCoach...');
    window.chatbotDashboard = new ChatbotDashboard();
});

// Cleanup quando la pagina viene chiusa
window.addEventListener('beforeunload', () => {
    if (window.chatbotDashboard) {
        window.chatbotDashboard.destroy();
    }
});