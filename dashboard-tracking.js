// dashboard-tracking.js - Estensione dashboard per tracking completo
import { db } from './firebase.js';
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// === DASHBOARD TRACKING DATA LOADER ===
export class DashboardTracker {
    constructor() {
        this.listeners = [];
        this.data = {
            users: [],
            conversations: [],
            sessions: [],
            events: [],
            metrics: [],
            quizResults: []
        };
    }

    // === INIZIALIZZAZIONE ===
    async initialize() {
        console.log('🔍 Inizializzazione Dashboard Tracker...');
        
        try {
            await this.loadInitialData();
            this.setupRealtimeListeners();
            this.updateDashboardMetrics();
            
            console.log('✅ Dashboard Tracker inizializzato');
        } catch (error) {
            console.error('❌ Errore inizializzazione tracker:', error);
        }
    }

    // === CARICAMENTO DATI INIZIALI ===
    async loadInitialData() {
        const [users, conversations, sessions, events, metrics, quizResults] = await Promise.all([
            this.getUsers(),
            this.getChatbotConversations(),
            this.getUserSessions(),
            this.getAnalyticsEvents(),
            this.getBusinessMetrics(),
            this.getQuizResults()
        ]);

        this.data = { users, conversations, sessions, events, metrics, quizResults };
        console.log('📊 Dati iniziali caricati:', {
            users: users.length,
            conversations: conversations.length,
            sessions: sessions.length,
            events: events.length,
            metrics: metrics.length,
            quizResults: quizResults.length
        });
    }

    // === GETTER DATI ===
    async getUsers(limit_count = 100) {
        try {
            const q = query(
                collection(db, 'users'),
                orderBy('created_at', 'desc'),
                limit(limit_count)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Errore recupero users:', error);
            return [];
        }
    }

    async getChatbotConversations(limit_count = 100) {
        try {
            const q = query(
                collection(db, 'chatbot_conversations'),
                orderBy('created_at', 'desc'),
                limit(limit_count)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Errore recupero conversations:', error);
            return [];
        }
    }

    async getUserSessions(limit_count = 200) {
        try {
            const q = query(
                collection(db, 'user_sessions'),
                orderBy('created_at', 'desc'),
                limit(limit_count)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Errore recupero sessions:', error);
            return [];
        }
    }

    async getAnalyticsEvents(limit_count = 500) {
        try {
            const q = query(
                collection(db, 'analytics_events'),
                orderBy('created_at', 'desc'),
                limit(limit_count)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Errore recupero events:', error);
            return [];
        }
    }

    async getQuizResults(limit_count = 100) {
        try {
            const q = query(
                collection(db, 'quiz_results'),
                orderBy('timestamp', 'desc'),
                limit(limit_count)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
        } catch (error) {
            console.error('❌ Errore recupero quiz results:', error);
            return [];
        }
    }

    async getBusinessMetrics(days = 30) {
        try {
            const q = query(
                collection(db, 'business_metrics'),
                orderBy('created_at', 'desc'),
                limit(days)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Errore recupero metrics:', error);
            return [];
        }
    }

    // === LISTENERS REAL-TIME ===
    setupRealtimeListeners() {
        // Listener per nuove conversazioni chatbot
        const conversationsListener = onSnapshot(
            query(collection(db, 'chatbot_conversations'), orderBy('created_at', 'desc'), limit(10)),
            (snapshot) => {
                console.log('💬 Nuove conversazioni chatbot:', snapshot.size);
                this.updateConversationsDisplay(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        // Listener per nuovi utenti
        const usersListener = onSnapshot(
            query(collection(db, 'users'), orderBy('created_at', 'desc'), limit(10)),
            (snapshot) => {
                console.log('👥 Aggiornamento utenti:', snapshot.size);
                this.updateUsersDisplay(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        // Listener per eventi real-time
        const eventsListener = onSnapshot(
            query(collection(db, 'analytics_events'), orderBy('created_at', 'desc'), limit(20)),
            (snapshot) => {
                console.log('📊 Nuovi eventi analytics:', snapshot.size);
                this.updateEventsDisplay(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        // Listener per quiz results
        const quizListener = onSnapshot(
            query(collection(db, 'quiz_results'), orderBy('timestamp', 'desc'), limit(10)),
            (snapshot) => {
                console.log('📊 Quiz results aggiornati:', snapshot.size);
                const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                this.data.quizResults = results;
                this.updateLeadsDisplay(results);
                this.updateDashboardMetrics();
            }
        );

        this.listeners = [conversationsListener, usersListener, eventsListener, quizListener];
    }

    // === METRICHE DASHBOARD ===
    updateDashboardMetrics() {
        const metrics = this.calculateMetrics();
        
        // Aggiorna elementi DOM
        this.updateElement('total-users', metrics.totalUsers);
        this.updateElement('total-conversations', metrics.totalConversations);
        this.updateElement('total-quizzes', metrics.totalQuizzes);
        this.updateElement('avg-conversation-duration', `${metrics.avgConversationDuration} min`);
        this.updateElement('conversion-rate', `${metrics.conversionRate}%`);
        this.updateElement('daily-active-users', metrics.dailyActiveUsers);
        
        // Aggiorna grafici
        this.updateConversationChart(metrics.conversationTrends);
        this.updateUserActivityChart(metrics.userActivity);
        this.updateTopicsChart(metrics.topTopics);
        
        console.log('📈 Metriche dashboard aggiornate:', metrics);
    }

    calculateMetrics() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const totalUsers = this.data.users.length;
        const totalConversations = this.data.conversations.length;
        const totalQuizzes = this.data.quizResults?.length || 0;
        
        // Quiz completati oggi
        const todayQuizzes = this.data.quizResults?.filter(quiz => 
            quiz.timestamp && quiz.timestamp >= today
        ).length || 0;
        
        // Conversazioni oggi
        const todayConversations = this.data.conversations.filter(conv => 
            conv.created_at && conv.created_at.toDate() >= today
        );
        
        // Utenti attivi oggi
        const dailyActiveUsers = new Set(
            this.data.sessions
                .filter(session => session.created_at && session.created_at.toDate() >= today)
                .map(session => session.user_id)
                .filter(Boolean)
        ).size;
        
        // Durata media conversazioni
        const avgConversationDuration = totalConversations > 0 ? 
            (this.data.conversations.reduce((sum, conv) => sum + (conv.duration_minutes || 0), 0) / totalConversations).toFixed(1) : 0;
        
        // Conversion rate (quiz completati che hanno prenotato consulenza)
        const consultationsBooked = this.data.quizResults?.filter(quiz => quiz.consultation_booked).length || 0;
        const conversionRate = totalQuizzes > 0 ? ((consultationsBooked / totalQuizzes) * 100).toFixed(1) : 0;
        
        // Topic più discussi
        const topicsCount = {};
        this.data.conversations.forEach(conv => {
            if (conv.topics_discussed) {
                conv.topics_discussed.forEach(topic => {
                    topicsCount[topic] = (topicsCount[topic] || 0) + 1;
                });
            }
        });
        
        const topTopics = Object.entries(topicsCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        return {
            totalUsers,
            totalConversations,
            totalQuizzes,
            todayQuizzes,
            dailyActiveUsers,
            avgConversationDuration,
            conversionRate,
            topTopics,
            conversationTrends: this.getConversationTrends(),
            userActivity: this.getUserActivityTrends()
        };
    }

    getConversationTrends() {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const count = this.data.conversations.filter(conv => 
                conv.created_at && 
                conv.created_at.toDate() >= date && 
                conv.created_at.toDate() < nextDay
            ).length;
            
            last7Days.push({
                date: date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
                conversations: count
            });
        }
        return last7Days;
    }

    getUserActivityTrends() {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const activeUsers = new Set(
                this.data.sessions
                    .filter(session => 
                        session.created_at && 
                        session.created_at.toDate() >= date && 
                        session.created_at.toDate() < nextDay
                    )
                    .map(session => session.user_id)
                    .filter(Boolean)
            ).size;
            
            last7Days.push({
                date: date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
                users: activeUsers
            });
        }
        return last7Days;
    }

    // === AGGIORNAMENTO DISPLAY ===
    updateConversationsDisplay(conversations) {
        const tbody = document.getElementById('conversations-table-body');
        if (!tbody) return;
        
        if (conversations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">Nessuna conversazione chatbot ancora</td></tr>';
            return;
        }
        
        const rows = conversations.slice(0, 10).map(conv => `
            <tr>
                <td>${conv.user_id || 'Anonimo'}</td>
                <td>${conv.messages_count || 0}</td>
                <td>${conv.duration_minutes || 0} min</td>
                <td>${conv.topics_discussed ? conv.topics_discussed.join(', ') : 'N/A'}</td>
                <td><span class="sentiment-${conv.sentiment || 'neutral'}">${conv.sentiment || 'neutral'}</span></td>
                <td>${this.formatDateTime(conv.created_at)}</td>
            </tr>
        `).join('');
        
        tbody.innerHTML = rows;
    }

    updateUsersDisplay(users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">Nessun utente tracciato ancora</td></tr>';
            return;
        }
        
        const rows = users.slice(0, 10).map(user => `
            <tr>
                <td>${user.name || 'N/A'}</td>
                <td>${user.whatsapp || user.email || 'N/A'}</td>
                <td>${user.source || 'N/A'}</td>
                <td>${user.total_sessions || 0}</td>
                <td>${user.quiz_completed ? '✅' : '❌'}</td>
                <td>${this.formatDateTime(user.created_at)}</td>
            </tr>
        `).join('');
        
        tbody.innerHTML = rows;
    }

    updateLeadsDisplay(quizResults) {
        const tbody = document.getElementById('leads-table-body');
        if (!tbody) return;
        
        if (!quizResults || quizResults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">Nessun quiz completato ancora</td></tr>';
            return;
        }
        
        const rows = quizResults.slice(0, 10).map(quiz => {
            const score = quiz.score || quiz.lead_score || 0;
            const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
            const icon = this.getProfileIcon(quiz.profile);
            
            return `
                <tr>
                    <td>${quiz.name || 'N/A'}</td>
                    <td>${quiz.whatsapp || quiz.email || 'N/A'}</td>
                    <td>${icon} ${quiz.profile || 'N/A'}</td>
                    <td><span class="lead-score ${scoreClass}">${score}</span></td>
                    <td>${this.formatDateTime(quiz.timestamp)}</td>
                    <td><button class="action-btn" onclick="contactLeadWhatsApp('${quiz.whatsapp || quiz.email}', '${quiz.name}', '${quiz.profile}')">WhatsApp</button></td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rows;
    }

    updateEventsDisplay(events) {
        const container = document.getElementById('recent-events');
        if (!container) return;
        
        const eventsHTML = events.slice(0, 5).map(event => `
            <div class="event-item">
                <span class="event-type">${event.event_type}</span>
                <span class="event-time">${this.formatDateTime(event.created_at)}</span>
            </div>
        `).join('');
        
        container.innerHTML = eventsHTML || '<div class="no-data">Nessun evento recente</div>';
    }

    // === GRAFICI ===
    updateConversationChart(data) {
        const container = document.getElementById('conversation-chart');
        if (!container) return;
        
        const maxValue = Math.max(...data.map(d => d.conversations));
        
        const chartHTML = data.map(item => `
            <div class="chart-bar">
                <div class="chart-label">${item.date}</div>
                <div class="chart-progress">
                    <div class="chart-fill" style="width: ${maxValue > 0 ? (item.conversations / maxValue) * 100 : 0}%"></div>
                </div>
                <div class="chart-value">${item.conversations}</div>
            </div>
        `).join('');
        
        container.innerHTML = chartHTML;
    }

    updateUserActivityChart(data) {
        const container = document.getElementById('user-activity-chart');
        if (!container) return;
        
        const maxValue = Math.max(...data.map(d => d.users));
        
        const chartHTML = data.map(item => `
            <div class="chart-bar">
                <div class="chart-label">${item.date}</div>
                <div class="chart-progress">
                    <div class="chart-fill" style="width: ${maxValue > 0 ? (item.users / maxValue) * 100 : 0}%"></div>
                </div>
                <div class="chart-value">${item.users}</div>
            </div>
        `).join('');
        
        container.innerHTML = chartHTML;
    }

    updateTopicsChart(topics) {
        const container = document.getElementById('topics-chart');
        if (!container) return;
        
        if (topics.length === 0) {
            container.innerHTML = '<div class="no-data">Nessun topic ancora</div>';
            return;
        }
        
        const maxValue = topics[0][1];
        
        const chartHTML = topics.map(([topic, count]) => `
            <div class="chart-bar">
                <div class="chart-label">${topic}</div>
                <div class="chart-progress">
                    <div class="chart-fill" style="width: ${(count / maxValue) * 100}%"></div>
                </div>
                <div class="chart-value">${count}</div>
            </div>
        `).join('');
        
        container.innerHTML = chartHTML;
    }

    // === UTILITY ===
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = content;
        }
    }

    formatDateTime(timestamp) {
        if (!timestamp) return 'N/A';
        
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleString('it-IT');
        } catch (error) {
            return 'Data non valida';
        }
    }

    getProfileIcon(profile) {
        switch(profile) {
            case 'Nuovo Esploratore': return '🌱';
            case 'Guerriero': return '⚔️'; 
            case 'Atleta': return '🏆';
            default: return '👤';
        }
    }

    // === CLEANUP ===
    destroy() {
        this.listeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.listeners = [];
        console.log('🧹 Dashboard Tracker cleanup completato');
    }
}

// === WEBHOOK ENDPOINT SIMULATOR ===
export class WebhookHandler {
    constructor(dashboardTracker) {
        this.tracker = dashboardTracker;
        this.setupWebhookSimulator();
    }

    setupWebhookSimulator() {
        console.log('🔗 Webhook handler configurato');
        
        window.simulateChatbotWebhook = (data) => {
            this.handleChatbaseWebhook(data);
        };
    }

    async handleChatbaseWebhook(webhookData) {
        try {
            console.log('📥 Webhook ricevuto:', webhookData);
            
            const conversationData = {
                user_id: webhookData.user_id || null,
                session_id: webhookData.conversation_id || `sim_${Date.now()}`,
                messages_count: webhookData.messages?.length || Math.floor(Math.random() * 20) + 1,
                duration_minutes: webhookData.duration || Math.floor(Math.random() * 30) + 1,
                topics_discussed: webhookData.topics || this.generateRandomTopics(),
                sentiment: webhookData.sentiment || this.generateRandomSentiment(),
                satisfaction_rating: webhookData.rating || Math.floor(Math.random() * 5) + 1,
                lead_generated: webhookData.lead_generated || Math.random() > 0.7
            };

            await this.tracker.trackChatbotConversation(conversationData);
            this.tracker.updateDashboardMetrics();
            
            console.log('✅ Webhook processato con successo');
            return { success: true };
            
        } catch (error) {
            console.error('❌ Errore processing webhook:', error);
            return { success: false, error: error.message };
        }
    }

    generateRandomTopics() {
        const allTopics = ['fitness', 'nutrition', 'goals', 'consultation', 'training', 'diet'];
        const numTopics = Math.floor(Math.random() * 3) + 1;
        return allTopics.sort(() => 0.5 - Math.random()).slice(0, numTopics);
    }

    generateRandomSentiment() {
        const sentiments = ['positive', 'neutral', 'negative'];
        return sentiments[Math.floor(Math.random() * sentiments.length)];
    }
}

// === INIZIALIZZAZIONE TRACKING AUTOMATICO ===
export function initializeDashboardTracking() {
    console.log('🚀 Inizializzazione Dashboard Tracking...');
    
    const tracker = new DashboardTracker();
    const webhookHandler = new WebhookHandler(tracker);
    
    tracker.initialize();
    
    setInterval(() => {
        tracker.updateDashboardMetrics();
    }, 5 * 60 * 1000);
    
    window.dashboardTracker = tracker;
    window.webhookHandler = webhookHandler;
    
    console.log('✅ Dashboard Tracking inizializzato');
    return { tracker, webhookHandler };
}

// === FUNZIONI DI TEST ===
export function testChatbotIntegration() {
    console.log('🧪 Test integrazione chatbot...');
    
    const testConversations = [
        {
            user_id: 'test_user_1',
            conversation_id: 'conv_001',
            messages: ['Ciao', 'Voglio perdere peso', 'Che allenamento mi consigli?'],
            duration: 15,
            topics: ['fitness', 'goals'],
            sentiment: 'positive',
            rating: 5,
            lead_generated: true
        },
        {
            user_id: 'test_user_2',
            conversation_id: 'conv_002',
            messages: ['Aiuto con la dieta', 'Cosa mangiare?'],
            duration: 8,
            topics: ['nutrition'],
            sentiment: 'neutral',
            rating: 4,
            lead_generated: false
        }
    ];
    
    testConversations.forEach((conv, index) => {
        setTimeout(() => {
            window.simulateChatbotWebhook(conv);
            console.log(`✅ Test conversation ${index + 1} simulata`);
        }, index * 2000);
    });
    
    console.log('🧪 Test avviati - controlla la dashboard per gli aggiornamenti');
}