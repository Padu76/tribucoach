// dashboard.js - TribuCoach Dashboard v2.0 con supporto 5 profili e insights avanzati
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
        this.charts = {}; // Store chart instances
        this.init();
    }

    async init() {
        console.log('🚀 Inizializzazione Dashboard v2.0...');
        
        this.updateConnectionStatus('connecting');
        
        try {
            // Carica dati iniziali
            await this.loadAllData();
            
            // Setup listeners real-time
            this.setupRealtimeListeners();
            
            // Setup event listeners UI
            this.setupEventListeners();
            
            this.updateConnectionStatus('connected');
            console.log('✅ Dashboard v2.0 inizializzata con successo');
            
        } catch (error) {
            console.error('❌ Errore inizializzazione dashboard:', error);
            this.updateConnectionStatus('error');
        }
    }

    async loadAllData() {
        console.log('📡 Caricamento dati...');
        
        // Carica quiz results con nuovo formato
        this.quizResults = await getAllQuizResults();
        console.log(`📊 Quiz caricati: ${this.quizResults.length}`);
        
        // Carica leads 
        this.leads = await getLeads();
        console.log(`👥 Leads caricati: ${this.leads.length}`);
        
        // 🔥 Carica conversazioni chatbot
        await this.loadChatConversations();
        
        // Aggiorna tutte le sezioni
        this.updateQuizTable();
        this.updateChatConversationsTable();
        this.updateMetrics();
        this.updateCharts();
        this.updateAdvancedInsights();
        this.updateActionableInsights();
        
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
            this.updateAdvancedInsights();
            this.updateActionableInsights();
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

    // 🔥 TABELLA QUIZ OTTIMIZZATA CON NUOVO LAYOUT
    updateQuizTable() {
        const tbody = document.getElementById('quiz-results-table-body');
        if (!tbody) return;

        if (this.quizResults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="no-data">Nessun risultato quiz trovato</td></tr>';
            return;
        }

        const rows = this.quizResults.map(result => {
            const score = this.calculateNewLeadScore(result);
            const profileInfo = this.getNewProfileInfo(result.profile);
            const timestamp = formatDateTime(result.timestamp);
            
            // Estrai dati per colonne ottimizzate
            const goals = this.extractGoals(result);
            const challenges = this.extractChallenges(result);
            const contact = result.whatsapp || result.email || 'N/A';
            
            // Score badge
            const scoreClass = score >= 80 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low';
            
            return `
                <tr class="data-row-main">
                    <td class="col-name"><strong>${result.name || 'N/A'}</strong></td>
                    <td class="col-age">${result.age || 'N/A'}</td>
                    <td class="col-contact" title="${contact}">${this.truncateText(contact, 20)}</td>
                    <td class="col-profile">
                        <span class="tag ${profileInfo.class}">${profileInfo.icon} ${profileInfo.short}</span>
                    </td>
                    <td class="col-score">
                        <span class="score-badge ${scoreClass}">${score}%</span>
                    </td>
                    <td class="col-goals" title="${goals.full}">${goals.short}</td>
                    <td class="col-challenges" title="${challenges.full}">${challenges.short}</td>
                    <td class="col-date">${this.formatShortDate(result.timestamp)}</td>
                    <td class="col-actions">
                        <button class="action-button details" onclick="showQuizDetails('${result.id}')">
                            👁️
                        </button>
                        ${result.whatsapp ? `
                            <button class="action-button whatsapp whatsapp-btn" data-phone="${result.whatsapp}">
                                📱
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = rows;
    }

    // 🔥 TABELLA CHATBOT MIGLIORATA
    updateChatConversationsTable() {
        const tbody = document.getElementById('chatbot-conversations-table-body');
        if (!tbody) return;

        if (this.chatConversations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">Nessuna conversazione chatbot trovata</td></tr>';
            return;
        }

        tbody.innerHTML = this.chatConversations.map(conversation => {
            const lastActivity = formatDateTime(conversation.lastActivity);
            const shortId = conversation.id.length > 8 ? conversation.id.substring(0, 8) + '...' : conversation.id;

            return `
                <tr>
                    <td><code style="font-size: 0.8rem;">${shortId}</code></td>
                    <td><strong>${this.truncateText(conversation.customerName || 'Anonimo', 15)}</strong></td>
                    <td>${conversation.phone || 'N/A'}</td>
                    <td><small>${this.truncateText(conversation.lastMessageSnippet || 'Nessun messaggio', 35)}</small></td>
                    <td><span class="tag">${conversation.topic || 'Generale'}</span></td>
                    <td style="font-size: 0.8rem;">${this.formatShortDate(conversation.lastActivity)}</td>
                    <td>
                        <button class="action-button details view-conversation-btn" data-conversation-id="${conversation.id}">
                            👁️
                        </button>
                        ${conversation.phone && conversation.phone !== 'N/A' ? `
                            <button class="action-button whatsapp whatsapp-btn" data-phone="${conversation.phone}">
                                📱
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // 🔥 METRICHE PRINCIPALI AGGIORNATE
    updateMetrics() {
        // Metriche base
        document.getElementById('totalQuizzes').textContent = this.quizResults.length;
        document.getElementById('totalChatConversations').textContent = this.chatConversations.length;
        
        // Score medio con nuovo calcolo
        const avgScore = this.quizResults.length > 0 
            ? Math.round(this.quizResults.reduce((sum, q) => sum + this.calculateNewLeadScore(q), 0) / this.quizResults.length)
            : 0;
        document.getElementById('avgQuizScore').textContent = `${avgScore}%`;
        
        // Lead premium (80+)
        const premiumLeads = this.quizResults.filter(q => this.calculateNewLeadScore(q) >= 80).length;
        document.getElementById('premiumLeadsCount').textContent = premiumLeads;
        
        // Quiz oggi
        const today = new Date().toDateString();
        const quizzesToday = this.quizResults.filter(q => {
            const quizDate = q.timestamp ? new Date(q.timestamp).toDateString() : null;
            return quizDate === today;
        }).length;
        document.getElementById('quizzesToday').textContent = quizzesToday;
    }

    // 🔥 ADVANCED INSIGHTS NUOVI
    updateAdvancedInsights() {
        this.updateHotLeads();
        this.updateProfileBreakdown();
        this.updateRevenuePotential();
        this.updateTimingAnalysis();
        this.updateTopChallenges();
        this.updateLeadQuality();
    }

    updateHotLeads() {
        const hotLeads = this.quizResults.filter(q => this.calculateNewLeadScore(q) >= 80);
        const hotLeadsCount = hotLeads.length;
        
        document.getElementById('hotLeadsCount').textContent = hotLeadsCount;
        
        // Progress bar
        const progressPercent = this.quizResults.length > 0 ? (hotLeadsCount / this.quizResults.length) * 100 : 0;
        document.getElementById('hotLeadsProgress').style.width = `${progressPercent}%`;
        
        // Lista hot leads
        const hotLeadsList = document.getElementById('hotLeadsList');
        if (hotLeadsCount > 0) {
            hotLeadsList.innerHTML = hotLeads.slice(0, 5).map(lead => `
                <div class="hot-lead-item">
                    <strong>${lead.name}</strong> - ${this.calculateNewLeadScore(lead)}%
                    <br><small>${lead.email || lead.whatsapp}</small>
                </div>
            `).join('');
        } else {
            hotLeadsList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Nessun hot lead al momento</div>';
        }
    }

    updateProfileBreakdown() {
        const profileCounts = {
            'Scudiero da Motivare': 0,
            'Guerriero Principiante': 0,
            'Atleta Determinato': 0,
            'Master Elite': 0,
            'Champion Pro': 0
        };

        this.quizResults.forEach(quiz => {
            const profile = quiz.profile || 'Non definito';
            if (profileCounts.hasOwnProperty(profile)) {
                profileCounts[profile]++;
            }
        });

        document.getElementById('scudieroCount').textContent = profileCounts['Scudiero da Motivare'];
        document.getElementById('guerrieroCount').textContent = profileCounts['Guerriero Principiante'];
        document.getElementById('atletaCount').textContent = profileCounts['Atleta Determinato'];
        document.getElementById('masterCount').textContent = profileCounts['Master Elite'];
        document.getElementById('championCount').textContent = profileCounts['Champion Pro'];

        // Profilo dominante
        const dominantProfile = Object.keys(profileCounts).reduce((a, b) => 
            profileCounts[a] > profileCounts[b] ? a : b
        );
        document.getElementById('dominantProfile').textContent = profileCounts[dominantProfile] > 0 ? dominantProfile : 'N/A';
    }

    updateRevenuePotential() {
        // Calcola revenue potenziale basato sui budget dichiarati
        const budgetMapping = {
            'budget_zero': 0,
            'budget_basso': 30, // €30/mese medio
            'budget_medio': 100, // €100/mese medio 
            'budget_alto': 225, // €225/mese medio
            'budget_premium': 400 // €400/mese medio
        };

        let totalRevenue = 0;
        let budgetCount = 0;

        this.quizResults.forEach(quiz => {
            const budget = quiz.budget;
            if (budget && budgetMapping[budget] !== undefined) {
                totalRevenue += budgetMapping[budget];
                budgetCount++;
            }
        });

        // Revenue mensile potenziale
        document.getElementById('revenueePotential').textContent = `€${totalRevenue.toLocaleString()}`;
        
        // Budget medio
        const avgBudget = budgetCount > 0 ? Math.round(totalRevenue / budgetCount) : 0;
        document.getElementById('avgBudget').textContent = `€${avgBudget}`;
        
        // Conversion rate stimato
        const conversionRate = this.quizResults.length > 0 ? Math.round((budgetCount / this.quizResults.length) * 100) : 0;
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;
    }

    updateTimingAnalysis() {
        // Analisi orari di picco per quiz
        const quizHours = this.quizResults
            .map(q => q.timestamp ? new Date(q.timestamp).getHours() : null)
            .filter(hour => hour !== null);
        
        let peakHour = 'N/A';
        if (quizHours.length > 0) {
            const hourCounts = quizHours.reduce((acc, hour) => {
                acc[hour] = (acc[hour] || 0) + 1;
                return acc;
            }, {});
            const peak = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);
            peakHour = `${peak}:00-${parseInt(peak) + 1}:00`;
        }
        document.getElementById('peakHour').textContent = peakHour;

        // Follow-up urgenti (quiz completati nelle ultime 24h)
        const last24h = new Date();
        last24h.setHours(last24h.getHours() - 24);
        const urgentFollowups = this.quizResults.filter(q => {
            return q.timestamp && new Date(q.timestamp) >= last24h;
        }).length;
        document.getElementById('urgentFollowups').textContent = urgentFollowups;

        // Trend settimanale
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const thisWeekQuizzes = this.quizResults.filter(q => {
            return q.timestamp && new Date(q.timestamp) >= lastWeek;
        }).length;
        
        const prevWeek = new Date();
        prevWeek.setDate(prevWeek.getDate() - 14);
        const prevWeekQuizzes = this.quizResults.filter(q => {
            const qDate = new Date(q.timestamp);
            return q.timestamp && qDate >= prevWeek && qDate < lastWeek;
        }).length;
        
        const weeklyTrend = document.getElementById('weeklyTrend');
        if (prevWeekQuizzes > 0) {
            const change = ((thisWeekQuizzes - prevWeekQuizzes) / prevWeekQuizzes) * 100;
            const arrow = change >= 0 ? '↗' : '↘';
            const color = change >= 0 ? '#4CAF50' : '#f44336';
            weeklyTrend.textContent = `${arrow} ${change >= 0 ? '+' : ''}${Math.round(change)}% questa settimana`;
            weeklyTrend.style.color = color;
        } else {
            weeklyTrend.textContent = '📊 Dati insufficienti';
            weeklyTrend.style.color = '#999';
        }
    }

    updateTopChallenges() {
        // Analizza le sfide più comuni
        const challengeCounts = {};
        
        this.quizResults.forEach(quiz => {
            const challenges = quiz.main_challenges || quiz.challenges || [];
            if (Array.isArray(challenges)) {
                challenges.forEach(challenge => {
                    challengeCounts[challenge] = (challengeCounts[challenge] || 0) + 1;
                });
            }
        });

        const sortedChallenges = Object.entries(challengeCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);

        const challengesContainer = document.getElementById('topChallenges');
        if (sortedChallenges.length > 0) {
            challengesContainer.innerHTML = sortedChallenges.map(([challenge, count]) => `
                <div class="metric-small">
                    🚧 <strong>${this.translateChallenge(challenge)}:</strong> ${count} persone
                </div>
            `).join('');
        } else {
            challengesContainer.innerHTML = '<div class="metric-small">📊 Nessuna sfida identificata ancora</div>';
        }
    }

    updateLeadQuality() {
        const premiumLeads = this.quizResults.filter(q => this.calculateNewLeadScore(q) >= 80).length;
        const qualifiedLeads = this.quizResults.filter(q => this.calculateNewLeadScore(q) >= 60).length;
        
        document.getElementById('premiumCount').textContent = premiumLeads;
        document.getElementById('qualifiedCount').textContent = qualifiedLeads;
        
        // Progress bar qualità
        const qualityPercent = this.quizResults.length > 0 ? (qualifiedLeads / this.quizResults.length) * 100 : 0;
        document.getElementById('qualityProgress').style.width = `${qualityPercent}%`;
    }

    // 🔥 ACTIONABLE INSIGHTS
    updateActionableInsights() {
        // Cerca elementi che potrebbero non esistere ancora nella versione HTML attuale
        const priorityElement = document.getElementById('priorityLeadsText');
        if (priorityElement) {
            const hotLeads = this.quizResults.filter(q => this.calculateNewLeadScore(q) >= 80);
            const priorityText = hotLeads.length > 0 
                ? `${hotLeads.length} lead ad alta priorità da contattare immediatamente.`
                : 'Tutti i lead sono stati processati.';
            priorityElement.textContent = priorityText;
        }
    }

    // 🔥 GRAFICI AGGIORNATI
    updateCharts() {
        console.log('📊 Aggiornamento grafici avanzati...');
        
        this.createProfileChart();
        this.createGoalsChart();
        this.createChatTopicsChart();
        this.createTrendChart();
    }

    createProfileChart() {
        const ctx = document.getElementById('profileChart');
        if (!ctx) return;

        const profileCounts = this.getProfileCounts();
        
        if (this.charts.profileChart) {
            this.charts.profileChart.destroy();
        }

        this.charts.profileChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(profileCounts),
                datasets: [{
                    data: Object.values(profileCounts),
                    backgroundColor: [
                        '#9C27B0', // Scudiero
                        '#4CAF50', // Guerriero
                        '#2196F3', // Atleta
                        '#FF9800', // Master
                        '#F44336'  // Champion
                    ],
                    borderWidth: 3,
                    borderColor: '#2a2a2a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { 
                            color: '#fff',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    createGoalsChart() {
        const ctx = document.getElementById('goalChart');
        if (!ctx) return;

        const goalCounts = {};
        this.quizResults.forEach(quiz => {
            const goals = quiz.goals || [];
            if (Array.isArray(goals)) {
                goals.forEach(goal => {
                    const translated = this.translateGoal(goal);
                    goalCounts[translated] = (goalCounts[translated] || 0) + 1;
                });
            }
        });

        const sortedGoals = Object.entries(goalCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6);

        if (this.charts.goalChart) {
            this.charts.goalChart.destroy();
        }

        this.charts.goalChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedGoals.map(([goal]) => this.truncateText(goal, 20)),
                datasets: [{
                    label: 'Numero di Lead',
                    data: sortedGoals.map(([, count]) => count),
                    backgroundColor: '#ff6600',
                    borderColor: '#ff9933',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff' },
                        grid: { color: '#444' }
                    },
                    x: {
                        ticks: { 
                            color: '#fff',
                            maxRotation: 45,
                            font: { size: 10 }
                        },
                        grid: { color: '#444' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }

    createChatTopicsChart() {
        const ctx = document.getElementById('chatTopicChart');
        if (!ctx) return;

        const topicCounts = this.chatConversations.reduce((acc, conv) => {
            const topic = conv.topic || 'Generale';
            acc[topic] = (acc[topic] || 0) + 1;
            return acc;
        }, {});

        if (this.charts.chatTopicChart) {
            this.charts.chatTopicChart.destroy();
        }

        this.charts.chatTopicChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(topicCounts),
                datasets: [{
                    data: Object.values(topicCounts),
                    backgroundColor: [
                        '#ff6600', '#25D366', '#4CAF50',
                        '#2196F3', '#ff9800', '#9C27B0', '#795548'
                    ],
                    borderWidth: 2,
                    borderColor: '#2a2a2a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        // Calcola trend degli ultimi 7 giorni
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const quizCount = this.quizResults.filter(q => {
                const qDate = new Date(q.timestamp);
                return q.timestamp && qDate >= date && qDate < nextDay;
            }).length;
            
            const chatCount = this.chatConversations.filter(c => {
                const cDate = new Date(c.lastActivity);
                return c.lastActivity && cDate >= date && cDate < nextDay;
            }).length;
            
            last7Days.push({
                date: date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
                quiz: quizCount,
                chat: chatCount
            });
        }

        if (this.charts.trendChart) {
            this.charts.trendChart.destroy();
        }

        this.charts.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(d => d.date),
                datasets: [
                    {
                        label: 'Quiz Completati',
                        data: last7Days.map(d => d.quiz),
                        borderColor: '#ff6600',
                        backgroundColor: 'rgba(255, 102, 0, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Conversazioni Chat',
                        data: last7Days.map(d => d.chat),
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff' },
                        grid: { color: '#444' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { color: '#444' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }

    // 🔥 HELPER FUNCTIONS NUOVE
    calculateNewLeadScore(quiz) {
        // Usa il lead score esistente se disponibile, altrimenti calcola
        if (quiz.lead_score || quiz.score) {
            return quiz.lead_score || quiz.score;
        }

        // Calcolo semplificato compatibile con quiz vecchi e nuovi
        let score = 0;

        // Score base per esperienza (25 punti)
        if (quiz.experience === 'professionista' || quiz.experience === 'avanzato') score += 25;
        else if (quiz.experience === 'intermedio') score += 15;
        else score += 10;

        // Score per frequenza (15 punti)
        if (quiz.frequency && quiz.frequency.includes('6+') || quiz.frequency === '5-6') score += 15;
        else if (quiz.frequency && quiz.frequency.includes('3-4')) score += 10;
        else score += 5;

        // Score per obiettivi (15 punti)
        const goals = quiz.goals || [];
        if (Array.isArray(goals)) {
            score += Math.min(goals.length * 3, 15);
        }

        // Score per budget (15 punti)
        if (quiz.budget && quiz.budget.includes('premium')) score += 15;
        else if (quiz.budget && quiz.budget.includes('alto')) score += 12;
        else if (quiz.budget && quiz.budget.includes('medio')) score += 8;
        else score += 5;

        // Score per completezza dati (10 punti)
        if (quiz.whatsapp && quiz.whatsapp.length > 0) score += 5;
        if (quiz.email && quiz.email.length > 0) score += 3;
        if (quiz.name && quiz.name.length > 0) score += 2;

        // Score per età (bonus giovani/target) (10 punti)
        if (quiz.age >= 25 && quiz.age <= 45) score += 10;
        else if (quiz.age >= 18 && quiz.age <= 55) score += 5;

        // Score per supporto/sfide (10 punti)
        const challenges = quiz.main_challenges || quiz.challenges || quiz.obstacles || [];
        if (Array.isArray(challenges) && challenges.length > 0) score += 5;

        const support = quiz.support_needs || [];
        if (Array.isArray(support) && support.length > 0) score += 5;

        return Math.min(Math.max(score, 0), 100);
    }

    getNewProfileInfo(profile) {
        const profileMap = {
            'Scudiero da Motivare': { icon: '🛡️', short: 'Scudiero', class: 'profile-scudiero' },
            'Guerriero Principiante': { icon: '🌱', short: 'Guerriero', class: 'profile-guerriero' },
            'Atleta Determinato': { icon: '💪', short: 'Atleta', class: 'profile-atleta' },
            'Master Elite': { icon: '🏆', short: 'Master', class: 'profile-master' },
            'Champion Pro': { icon: '👑', short: 'Champion', class: 'profile-champion' },
            // Compatibilità con profili vecchi
            'Nuovo Esploratore': { icon: '🌱', short: 'Esploratore', class: 'profile-guerriero' },
            'Guerriero Determinato': { icon: '💪', short: 'Guerriero', class: 'profile-atleta' },
            'Atleta Avanzato': { icon: '🏆', short: 'Atleta', class: 'profile-master' }
        };
        
        return profileMap[profile] || { icon: '👤', short: 'N/A', class: '' };
    }

    extractGoals(quiz) {
        const goals = quiz.goals || [];
        const goalsList = Array.isArray(goals) ? goals.map(g => this.translateGoal(g)) : [goals];
        const full = goalsList.join(', ');
        const short = goalsList.length > 2 ? `${goalsList.slice(0, 2).join(', ')}...` : full;
        return { full, short };
    }

    extractChallenges(quiz) {
        const challenges = quiz.main_challenges || quiz.challenges || quiz.obstacles || [];
        const challengesList = Array.isArray(challenges) ? challenges.map(c => this.translateChallenge(c)) : [challenges];
        const full = challengesList.join(', ');
        const short = challengesList.length > 1 ? `${challengesList[0]}...` : full;
        return { full, short };
    }

    translateGoal(goal) {
        const translations = {
            'perdere_peso': 'Perdere Peso',
            'aumentare_massa': 'Massa Muscolare',
            'tonificare': 'Tonificare',
            'forza': 'Aumentare Forza',
            'resistenza': 'Resistenza',
            'salute': 'Salute Generale',
            'autostima': 'Autostima',
            'performance_sportiva': 'Performance Sport',
            // Compatibilità con vecchi goal
            'Perdita Peso': 'Perdere Peso',
            'Aumento Massa Muscolare': 'Massa Muscolare',
            'Preparazione atletica specifica': 'Performance Sport'
        };
        return translations[goal] || goal;
    }

    translateChallenge(challenge) {
        const translations = {
            'mancanza_tempo': 'Tempo',
            'poca_motivazione': 'Motivazione',
            'non_so_cosa_fare': 'Conoscenza',
            'costanza': 'Costanza',
            'risultati_lenti': 'Risultati',
            'paura_giudizio': 'Giudizio Altri',
            'problemi_fisici': 'Problemi Fisici',
            'budget_limitato': 'Budget',
            // Compatibilità con vecchi ostacoli
            'Mancanza di tempo': 'Tempo',
            'Difficoltà a rimanere motivato': 'Motivazione',
            'Non so cosa fare o come farlo': 'Conoscenza'
        };
        return translations[challenge] || challenge;
    }

    getProfileCounts() {
        const counts = {
            'Scudiero da Motivare': 0,
            'Guerriero Principiante': 0,
            'Atleta Determinato': 0,
            'Master Elite': 0,
            'Champion Pro': 0
        };

        this.quizResults.forEach(quiz => {
            const profile = quiz.profile || 'Non definito';
            if (counts.hasOwnProperty(profile)) {
                counts[profile]++;
            } else {
                // Mapping per vecchi profili
                if (profile.includes('Esploratore') || profile.includes('Principiante')) {
                    counts['Guerriero Principiante']++;
                } else if (profile.includes('Guerriero') || profile.includes('Determinato')) {
                    counts['Atleta Determinato']++;
                } else if (profile.includes('Atleta') || profile.includes('Avanzato')) {
                    counts['Master Elite']++;
                }
            }
        });

        return counts;
    }

    truncateText(text, maxLength) {
        if (!text || text === 'N/A') return text;
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    formatShortDate(timestamp) {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('it-IT', { 
                day: '2-digit', 
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'N/A';
        }
    }

    // 🔥 MODAL CONVERSATION
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

    updateConnectionStatus(status) {
        const statusEl = document.getElementById('connection-status');
        if (!statusEl) return;
        
        statusEl.className = `connection-status status-${status}`;
        
        switch(status) {
            case 'connected':
                statusEl.textContent = '✅ Dashboard v2.0 Connessa';
                setTimeout(() => {
                    statusEl.style.display = 'none';
                }, 3000);
                break;
            case 'connecting':
                statusEl.textContent = '⏳ Inizializzazione Dashboard v2.0...';
                break;
            case 'error':
                statusEl.textContent = '❌ Errore di connessione';
                break;
        }
    }

    updateLastUpdateTime() {
        const element = document.getElementById('last-update');
        if (element) {
            element.textContent = new Date().toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

    // Cleanup
    destroy() {
        if (this.unsubscribeQuiz) this.unsubscribeQuiz();
        if (this.unsubscribeLeads) this.unsubscribeLeads();
        
        // Distruggi tutti i grafici
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// 🔥 FUNZIONI GLOBALI AGGIORNATE
window.showQuizDetails = (quizId) => {
    console.log('🔍 Mostra dettagli quiz:', quizId);
    
    if (!window.chatbotDashboard) {
        alert('Dashboard non inizializzata');
        return;
    }
    
    const quiz = window.chatbotDashboard.quizResults.find(q => q.id === quizId);
    if (!quiz) {
        alert('Quiz non trovato');
        return;
    }

    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modal-body-content');
    
    const score = window.chatbotDashboard.calculateNewLeadScore(quiz);
    const profileInfo = window.chatbotDashboard.getNewProfileInfo(quiz.profile);
    const timestamp = formatDateTime(quiz.timestamp);

    modalBody.innerHTML = `
        <h3>🎯 Analisi Completa Lead - ${quiz.name}</h3>
        
        <div class="conversation-header">
            <p><strong>👤 Nome:</strong> ${quiz.name || 'N/A'}</p>
            <p><strong>📧 Email:</strong> ${quiz.email || 'N/A'}</p>
            <p><strong>📱 WhatsApp:</strong> ${quiz.whatsapp || 'N/A'}</p>
            <p><strong>🎂 Età:</strong> ${quiz.age || 'N/A'} anni</p>
            <p><strong>⚧ Genere:</strong> ${quiz.gender || 'N/A'}</p>
            <p><strong>🏙️ Città:</strong> ${quiz.city || 'N/A'}</p>
            <p><strong>📅 Data Quiz:</strong> ${timestamp}</p>
            <p><strong>🏆 Lead Score:</strong> <span style="color: ${score >= 80 ? '#4CAF50' : score >= 60 ? '#ff9800' : '#f44336'}; font-weight: bold; font-size: 1.2rem;">${score}%</span></p>
        </div>

        <div class="conversation-messages">
            <h4>${profileInfo.icon} Profilo Fitness: ${quiz.profile || 'N/A'}</h4>
            <div class="messages-container">
                <p><strong>💪 Esperienza:</strong> ${quiz.experience || 'N/A'}</p>
                <p><strong>🤔 Tentativi Passati:</strong> ${quiz.past_attempts || 'N/A'}</p>
                <p><strong>😊 Autostima:</strong> ${quiz.self_confidence || 'N/A'}</p>
                <p><strong>💰 Budget:</strong> ${quiz.budget ? quiz.budget.replace('budget_', '').replace('_', ' ') : 'N/A'}</p>
                <p><strong>⏰ Disponibilità:</strong> ${quiz.time_available || 'N/A'}</p>
                <p><strong>📅 Frequenza:</strong> ${quiz.frequency || 'N/A'}</p>
            </div>
        </div>

        <div class="conversation-messages">
            <h4>🎯 Obiettivi & Motivazioni</h4>
            <div class="messages-container">
                <p><strong>🎪 Obiettivi Principali:</strong></p>
                <ul style="color: #eee; margin-left: 20px; margin-top: 10px;">
                    ${Array.isArray(quiz.goals) 
                        ? quiz.goals.map(goal => `<li>${window.chatbotDashboard.translateGoal(goal)}</li>`).join('')
                        : `<li>${quiz.goals || 'N/A'}</li>`
                    }
                </ul>
                
                <p style="margin-top: 15px;"><strong>💝 Motivazione Principale:</strong> ${quiz.main_motivation || 'N/A'}</p>
                <p><strong>⏰ Aspettative Temporali:</strong> ${quiz.time_expectations || 'N/A'}</p>
            </div>
        </div>

        <div class="conversation-messages">
            <h4>🚧 Sfide & Supporto</h4>
            <div class="messages-container">
                <p><strong>🚧 Sfide Principali:</strong></p>
                <ul style="color: #eee; margin-left: 20px; margin-top: 10px;">
                    ${Array.isArray(quiz.main_challenges) 
                        ? quiz.main_challenges.map(challenge => `<li>${window.chatbotDashboard.translateChallenge(challenge)}</li>`).join('')
                        : `<li>${quiz.main_challenges || quiz.obstacles || 'N/A'}</li>`
                    }
                </ul>
                
                <p style="margin-top: 15px;"><strong>🤝 Supporto Richiesto:</strong></p>
                <ul style="color: #eee; margin-left: 20px; margin-top: 10px;">
                    ${Array.isArray(quiz.support_needs) 
                        ? quiz.support_needs.map(support => `<li>${support.replace('_', ' ')}</li>`).join('')
                        : `<li>${quiz.support_needs || 'N/A'}</li>`
                    }
                </ul>
            </div>
        </div>

        ${quiz.final_message && quiz.final_message.length > 0 ? `
            <div class="conversation-messages">
                <h4>📝 Messaggio Personale</h4>
                <div class="messages-container">
                    <p style="font-style: italic; color: #ccc; line-height: 1.6; background: rgba(255,102,0,0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #ff6600;">
                        "${quiz.final_message}"
                    </p>
                </div>
            </div>
        ` : ''}

        <div class="conversation-actions">
            ${quiz.whatsapp ? `
                <button class="action-button whatsapp whatsapp-btn" data-phone="${quiz.whatsapp}">
                    📱 Contatta WhatsApp
                </button>
            ` : ''}
            ${quiz.email ? `
                <button class="action-button" onclick="window.open('mailto:${quiz.email}?subject=TribuCoach - Il tuo percorso fitness personalizzato&body=Ciao ${quiz.name}, ho visto il tuo quiz e vorrei aiutarti a raggiungere i tuoi obiettivi...', '_blank')">
                    📧 Invia Email
                </button>
            ` : ''}
            <button class="action-button details" onclick="navigator.clipboard.writeText('${quiz.whatsapp || quiz.email || quiz.name}')">
                📋 Copia Contatto
            </button>
            <button class="action-button" style="background: ${score >= 80 ? '#4CAF50' : score >= 60 ? '#FF9800' : '#f44336'};">
                🏆 Score: ${score}%
            </button>
        </div>
    `;

    modal.style.display = 'flex';
};

window.closeModal = () => {
    document.getElementById('detailsModal').style.display = 'none';
};

// 🚀 INIZIALIZZAZIONE DASHBOARD V2.0
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inizializzazione TribuCoach Dashboard v2.0...');
    window.chatbotDashboard = new ChatbotDashboard();
});

// Cleanup quando la pagina viene chiusa
window.addEventListener('beforeunload', () => {
    if (window.chatbotDashboard) {
        window.chatbotDashboard.destroy();
    }
});