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
        
        // Aggiorna opportunità business
        this.updateBusinessOpportunities();
        
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

    // === NUOVA SEZIONE: BUSINESS OPPORTUNITIES ANALYSIS ===
    updateBusinessOpportunities() {
        const container = document.getElementById('business-opportunities');
        if (!container) return;
        
        const opportunities = this.analyzeBusinessOpportunities();
        
        const opportunitiesHTML = opportunities.map(opp => `
            <div class="opportunity-card">
                <h4>${opp.title}<span class="priority ${opp.priority}">${opp.priority.toUpperCase()}</span></h4>
                <p>${opp.description}</p>
                <div style="margin-top: 10px;">
                    <strong>Azione suggerita:</strong> ${opp.action}
                </div>
                ${opp.leads ? `<div style="margin-top: 5px;"><strong>Lead coinvolti:</strong> ${opp.leads}</div>` : ''}
            </div>
        `).join('');
        
        container.innerHTML = opportunitiesHTML || '<div class="no-data">Analizzando opportunità business...</div>';
    }

    analyzeBusinessOpportunities() {
        const opportunities = [];
        
        if (!this.data.quizResults || this.data.quizResults.length === 0) {
            return [{
                title: "📊 Dati Insufficienti",
                description: "Serve più tempo per raccogliere dati e identificare pattern.",
                priority: "low",
                action: "Continuare a raccogliere quiz per almeno una settimana."
            }];
        }
        
        // Analisi 1: Lead ad alto punteggio non contattati
        const highScoreLeads = this.data.quizResults.filter(quiz => {
            const score = quiz.score || quiz.lead_score || 0;
            return score >= 70 && !quiz.contacted;
        });
        
        if (highScoreLeads.length > 0) {
            opportunities.push({
                title: `🎯 ${highScoreLeads.length} Lead Premium Non Contattati`,
                description: `Lead con punteggio 70+ pronti per conversione immediata.`,
                priority: "high",
                action: "Contattare entro 24h con offerta personalizzata.",
                leads: highScoreLeads.map(l => l.name).join(', ')
            });
        }
        
        // Analisi 2: Obiettivi più comuni = opportunità di gruppo
        const goalsAnalysis = {};
        this.data.quizResults.forEach(quiz => {
            if (quiz.goals && Array.isArray(quiz.goals)) {
                quiz.goals.forEach(goal => {
                    goalsAnalysis[goal] = (goalsAnalysis[goal] || 0) + 1;
                });
            }
        });
        
        const topGoal = Object.entries(goalsAnalysis).sort(([,a], [,b]) => b - a)[0];
        if (topGoal && topGoal[1] >= 3) {
            opportunities.push({
                title: `💪 Programma Specializzato "${topGoal[0]}"`,
                description: `${topGoal[1]} persone interessate allo stesso obiettivo.`,
                priority: "medium",
                action: "Creare corso di gruppo o programma specifico.",
                leads: `${topGoal[1]} persone interessate`
            });
        }
        
        // Analisi 3: Ostacoli comuni = soluzioni mirate
        const obstaclesAnalysis = {};
        this.data.quizResults.forEach(quiz => {
            if (quiz.obstacles && Array.isArray(quiz.obstacles)) {
                quiz.obstacles.forEach(obstacle => {
                    obstaclesAnalysis[obstacle] = (obstaclesAnalysis[obstacle] || 0) + 1;
                });
            }
        });
        
        const topObstacle = Object.entries(obstaclesAnalysis).sort(([,a], [,b]) => b - a)[0];
        if (topObstacle && topObstacle[1] >= 2) {
            opportunities.push({
                title: `🔧 Soluzione per "${topObstacle[0]}"`,
                description: `${topObstacle[1]} persone hanno lo stesso problema.`,
                priority: "medium",
                action: "Creare contenuto/servizio che risolve questo ostacolo specifico.",
                leads: `${topObstacle[1]} persone con questo problema`
            });
        }
        
        // Analisi 4: Preferenze allenamento
        const trainingAnalysis = {};
        this.data.quizResults.forEach(quiz => {
            const training = quiz.training_style || quiz.personalTrainerUsage;
            if (training) {
                trainingAnalysis[training] = (trainingAnalysis[training] || 0) + 1;
            }
        });
        
        const soloTrainers = trainingAnalysis['Mi alleno da solo'] || 0;
        const withPT = trainingAnalysis['Con personal trainer'] || 0;
        
        if (soloTrainers > withPT && soloTrainers >= 2) {
            opportunities.push({
                title: `🏃‍♂️ Mercato "Self-Trainers"`,
                description: `${soloTrainers} persone si allenano da sole - opportunità coaching online.`,
                priority: "medium",
                action: "Sviluppare programmi di coaching a distanza o app.",
                leads: `${soloTrainers} self-trainers`
            });
        }
        
        // Analisi 5: Fasce d'età
        const ageAnalysis = {};
        this.data.quizResults.forEach(quiz => {
            if (quiz.age) {
                const ageGroup = quiz.age < 25 ? '18-25' : 
                              quiz.age < 35 ? '25-35' : 
                              quiz.age < 45 ? '35-45' : '45+';
                ageAnalysis[ageGroup] = (ageAnalysis[ageGroup] || 0) + 1;
            }
        });
        
        const dominantAge = Object.entries(ageAnalysis).sort(([,a], [,b]) => b - a)[0];
        if (dominantAge && dominantAge[1] >= 3) {
            opportunities.push({
                title: `👥 Target Demografico ${dominantAge[0]} anni`,
                description: `${dominantAge[1]} lead nella fascia ${dominantAge[0]} - segmento dominante.`,
                priority: "low",
                action: "Personalizzare marketing e contenuti per questa fascia d'età.",
                leads: `${dominantAge[1]} persone ${dominantAge[0]} anni`
            });
        }
        
        return opportunities.slice(0, 5); // Max 5 opportunità
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
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">Nessun quiz completato ancora</td></tr>';
            return;
        }
        
        const rows = quizResults.slice(0, 20).map(quiz => {
            const score = quiz.score || quiz.lead_score || 0;
            const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
            const icon = this.getProfileIcon(quiz.profile);
            
            // Estrai dati utili dal quiz
            const goals = Array.isArray(quiz.goals) ? quiz.goals.slice(0, 2).join(', ') : (quiz.goals || 'N/A');
            const obstacles = Array.isArray(quiz.obstacles) ? quiz.obstacles.slice(0, 2).join(', ') : (quiz.obstacles || 'N/A');
            const trainingStyle = quiz.training_style || quiz.personalTrainerUsage || 'N/A';
            const activityLevel = quiz.activity_level || quiz.frequency || 'N/A';
            
            return `
                <tr>
                    <td>${quiz.name || 'N/A'}</td>
                    <td>${quiz.whatsapp || quiz.email || 'N/A'}</td>
                    <td>${quiz.age || 'N/A'}</td>
                    <td>${icon} ${quiz.profile || 'N/A'}</td>
                    <td><span class="lead-score ${scoreClass}">${score}</span></td>
                    <td title="${goals}">${goals.length > 30 ? goals.substring(0, 30) + '...' : goals}</td>
                    <td>${trainingStyle}</td>
                    <td title="${obstacles}">${obstacles.length > 20 ? obstacles.substring(0, 20) + '...' : obstacles}</td>
                    <td>${activityLevel}</td>
                    <td>${this.formatDateTime(quiz.timestamp)}</td>
                    <td>
                        <button class="action-btn" onclick="contactLeadWhatsApp('${quiz.whatsapp || quiz.email}', '${quiz.name}', '${quiz.profile}')">WhatsApp</button>
                        <button class="action-btn" onclick="viewLeadDetails('${quiz.id}')" style="background: #4CAF50; margin-left: 5px;">Dettagli</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rows;
    }

    updateEventsDisplay(events) {
        const container = document.getElementById('recent-events');
        if (!container) return;
        
        // Filtra eventi più interessanti per business
        const businessEvents = events.filter(event => {
            const relevantTypes = [
                'quiz_completed',
                'page_view', 
                'session_start',
                'form_field_focus',
                'user_interaction',
                'chatbot_conversation_completed',
                'lead_whatsapp_contact'
            ];
            return relevantTypes.includes(event.event_type);
        });
        
        const eventsHTML = businessEvents.slice(0, 8).map(event => {
            let description = '';
            let icon = '📊';
            
            switch(event.event_type) {
                case 'quiz_completed':
                    description = `Quiz completato - Profilo: ${event.event_data?.profile || 'N/A'}`;
                    icon = '🎯';
                    break;
                case 'page_view':
                    description = `Visita pagina: ${event.event_data?.page || event.page_url?.split('/').pop() || 'Home'}`;
                    icon = '👁️';
                    break;
                case 'session_start':
                    description = `Nuova sessione da: ${event.event_data?.referrer ? new URL(event.event_data.referrer).hostname : 'Diretto'}`;
                    icon = '🚀';
                    break;
                case 'form_field_focus':
                    description = `Interesse form: ${event.event_data?.field_name || 'Campo contatto'}`;
                    icon = '✏️';
                    break;
                case 'user_interaction':
                    description = `Click: ${event.event_data?.element || event.event_data?.type || 'Elemento UI'}`;
                    icon = '👆';
                    break;
                case 'chatbot_conversation_completed':
                    description = `Chat completata - Sentiment: ${event.event_data?.sentiment || 'neutrale'}`;
                    icon = '💬';
                    break;
                case 'lead_whatsapp_contact':
                    description = `Contatto WhatsApp: ${event.event_data?.name || 'Lead'}`;
                    icon = '📱';
                    break;
                default:
                    description = event.event_type.replace(/_/g, ' ');
                    break;
            }
            
            return `
                <div class="event-item">
                    <span class="event-type">${icon} ${description}</span>
                    <span class="event-time">${this.formatDateTime(event.created_at)}</span>
                </div>
            `;
        }).join('');
        
        container.innerHTML = eventsHTML || '<div class="no-data">Nessun evento business recente</div>';
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