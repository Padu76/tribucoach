// 📊 SISTEMA ANALYTICS DASHBOARD + FEEDBACK LOOP
// Integrazione con sistema esistente TribuCoach

class AnalyticsDashboard {
    constructor() {
        this.analytics = {
            conversations: {
                total: 0,
                today: 0,
                thisWeek: 0,
                thisMonth: 0,
                avgDuration: 0,
                avgMessages: 0
            },
            responses: {
                total: 0,
                positive: 0,
                negative: 0,
                neutral: 0,
                avgResponseTime: 0
            },
            feedback: {
                thumbsUp: 0,
                thumbsDown: 0,
                detailedFeedback: [],
                avgRating: 0
            },
            mlPerformance: {
                mlResponses: 0,
                standardResponses: 0,
                mlAccuracy: 0,
                learningRate: 0
            },
            userEngagement: {
                returningUsers: 0,
                bounceRate: 0,
                sessionDepth: 0,
                peakHours: {}
            }
        };
        
        this.feedbackQueue = [];
        this.sessionAnalytics = new Map();
        this.realtimeMetrics = new Map();
        
        console.log('📊 Analytics Dashboard inizializzato');
        this.initializeRealtimeTracking();
    }

    // 🚀 INIZIALIZZA TRACKING IN TEMPO REALE
    initializeRealtimeTracking() {
        // Track page load
        this.trackEvent('page_load', {
            timestamp: new Date(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });

        // Track user activity
        this.setupActivityTracking();
        
        // Inizializza dashboard UI se presente
        this.initializeDashboardUI();
    }

    // 📋 SETUP ACTIVITY TRACKING
    setupActivityTracking() {
        // Track scroll
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                this.trackEvent('scroll', { percent: scrollPercent });
            }, 100);
        });

        // Track clicks su elementi chiave
        document.addEventListener('click', (e) => {
            const element = e.target;
            if (element.matches('.main-cta, .secondary-btn, .ebook-btn, #chatButton')) {
                this.trackEvent('cta_click', {
                    element: element.className,
                    text: element.textContent.trim(),
                    timestamp: new Date()
                });
            }
        });

        // Track time on page
        this.pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.pageStartTime;
            this.trackEvent('page_exit', { timeSpent: timeOnPage });
        });
    }

    // 📊 TRACK CONVERSAZIONE
    trackConversation(conversationData) {
        const sessionId = conversationData.sessionId || 'unknown';
        
        if (!this.sessionAnalytics.has(sessionId)) {
            this.sessionAnalytics.set(sessionId, {
                startTime: new Date(),
                messages: [],
                feedback: [],
                mlUsage: 0,
                standardUsage: 0,
                userSatisfaction: null
            });
        }

        const session = this.sessionAnalytics.get(sessionId);
        
        // Update conversation metrics
        this.analytics.conversations.total++;
        this.updateTimeBasedMetrics('conversations');
        
        // Track message
        if (conversationData.message) {
            session.messages.push({
                role: conversationData.role,
                content: conversationData.content,
                timestamp: new Date(),
                mlEnhanced: conversationData.mlEnhanced || false,
                responseTime: conversationData.responseTime || 0
            });

            // Update ML vs Standard usage
            if (conversationData.mlEnhanced) {
                session.mlUsage++;
                this.analytics.mlPerformance.mlResponses++;
            } else {
                session.standardUsage++;
                this.analytics.mlPerformance.standardResponses++;
            }

            // Update response metrics
            this.analytics.responses.total++;
            if (conversationData.responseTime) {
                this.updateAverageResponseTime(conversationData.responseTime);
            }
        }

        // Update realtime dashboard
        this.updateRealtimeDashboard();
    }

    // 👍👎 SISTEMA FEEDBACK
    addFeedbackToMessage(messageIndex, feedbackType, details = null) {
        const feedback = {
            messageIndex,
            type: feedbackType, // 'positive', 'negative', 'neutral'
            timestamp: new Date(),
            details: details,
            sessionId: this.getCurrentSessionId()
        };

        this.feedbackQueue.push(feedback);
        
        // Update feedback analytics
        this.analytics.feedback[feedbackType === 'positive' ? 'thumbsUp' : 'thumbsDown']++;
        this.analytics.feedback.detailedFeedback.push(feedback);
        
        // Calculate new average rating
        this.calculateAverageRating();
        
        // Process feedback for ML learning
        this.processFeedbackForLearning(feedback);
        
        console.log('👍 Feedback registrato:', feedback);
        this.updateRealtimeDashboard();
        
        return feedback;
    }

    // 🧠 PROCESSA FEEDBACK PER ML LEARNING
    processFeedbackForLearning(feedback) {
        // Se disponibile, invia feedback al sistema ML
        if (window.mlManager) {
            try {
                window.mlManager.processFeedback(feedback);
                console.log('🤖 Feedback inviato al sistema ML');
            } catch (error) {
                console.warn('⚠️ Errore invio feedback a ML:', error);
            }
        }

        // Analisi pattern feedback negativi
        if (feedback.type === 'negative') {
            this.analyzeNegativeFeedback(feedback);
        }
    }

    // 📈 ANALISI SENTIMENT
    analyzeSentiment(messageContent) {
        const positiveWords = ['grazie', 'perfetto', 'ottimo', 'bene', 'fantastico', 'eccellente', 'bravo', 'utile', 'chiaro'];
        const negativeWords = ['male', 'sbagliato', 'non', 'errore', 'problema', 'difficile', 'confuso', 'inutile'];
        
        const words = messageContent.toLowerCase().split(/\s+/);
        let sentiment = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) sentiment += 1;
            if (negativeWords.includes(word)) sentiment -= 1;
        });
        
        let sentimentLabel = 'neutral';
        if (sentiment > 0) sentimentLabel = 'positive';
        if (sentiment < 0) sentimentLabel = 'negative';
        
        // Update analytics
        this.analytics.responses[sentimentLabel]++;
        
        return {
            score: sentiment,
            label: sentimentLabel,
            confidence: Math.min(Math.abs(sentiment) / words.length, 1)
        };
    }

    // 📊 METRICHE REAL-TIME
    getRealtimeMetrics() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return {
            live: {
                activeUsers: this.getActiveUsers(),
                messagesPerHour: this.getMessagesPerHour(),
                avgSessionTime: this.getAverageSessionTime(),
                currentHour: now.getHours()
            },
            today: {
                conversations: this.analytics.conversations.today,
                feedback: this.getTodayFeedback(),
                mlUsage: this.getTodayMLUsage(),
                topIssues: this.getTodayTopIssues()
            },
            performance: {
                mlAccuracy: this.calculateMLAccuracy(),
                responseTime: this.analytics.responses.avgResponseTime,
                satisfactionRate: this.calculateSatisfactionRate(),
                learningProgress: this.getLearningProgress()
            }
        };
    }

    // 🎯 ANALYTICS ACTIONABLE
    getActionableInsights() {
        const metrics = this.getRealtimeMetrics();
        const insights = [];

        // Analisi soddisfazione
        if (metrics.performance.satisfactionRate < 70) {
            insights.push({
                type: 'warning',
                title: 'Soddisfazione Utenti Bassa',
                message: `Soddisfazione al ${metrics.performance.satisfactionRate}%. Rivedere risposte più comuni.`,
                action: 'Analizza feedback negativi recenti'
            });
        }

        // Analisi ML Performance
        if (metrics.performance.mlAccuracy < 60) {
            insights.push({
                type: 'info',
                title: 'Sistema ML in Apprendimento',
                message: `Accuratezza ML al ${metrics.performance.mlAccuracy}%. Sistema in fase di ottimizzazione.`,
                action: 'Continua training con più feedback'
            });
        }

        // Picco di attività
        if (metrics.live.messagesPerHour > 50) {
            insights.push({
                type: 'success',
                title: 'Picco di Attività',
                message: `${metrics.live.messagesPerHour} messaggi/ora. Sistema performante.`,
                action: 'Monitora performance server'
            });
        }

        return insights;
    }

    // 🎨 DASHBOARD UI MANAGEMENT
    initializeDashboardUI() {
        // Crea dashboard widget se non esiste
        if (!document.getElementById('analytics-widget')) {
            this.createDashboardWidget();
        }
        
        // Update ogni 30 secondi
        setInterval(() => {
            this.updateRealtimeDashboard();
        }, 30000);
    }

    createDashboardWidget() {
        const widget = document.createElement('div');
        widget.id = 'analytics-widget';
        widget.innerHTML = `
            <div class="analytics-widget" style="
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                border: 2px solid #ff6600;
                border-radius: 15px;
                padding: 15px;
                color: white;
                font-family: 'Inter', sans-serif;
                font-size: 0.8rem;
                min-width: 200px;
                z-index: 999;
                box-shadow: 0 8px 25px rgba(255, 102, 0, 0.3);
                backdrop-filter: blur(10px);
                display: none;
            ">
                <div class="widget-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    color: #ff6600;
                    font-weight: bold;
                ">
                    <span>📊 Analytics Live</span>
                    <button id="toggle-analytics" style="
                        background: none;
                        border: none;
                        color: #ff6600;
                        cursor: pointer;
                        font-size: 1.2rem;
                    ">📈</button>
                </div>
                <div id="analytics-content">
                    <div class="metric-row" style="margin-bottom: 8px;">
                        <span>💬 Conversazioni:</span>
                        <span id="live-conversations">0</span>
                    </div>
                    <div class="metric-row" style="margin-bottom: 8px;">
                        <span>👍 Soddisfazione:</span>
                        <span id="live-satisfaction">0%</span>
                    </div>
                    <div class="metric-row" style="margin-bottom: 8px;">
                        <span>🤖 ML Usage:</span>
                        <span id="live-ml-usage">0%</span>
                    </div>
                    <div class="metric-row">
                        <span>⚡ Resp. Time:</span>
                        <span id="live-response-time">0s</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Toggle visibility
        document.getElementById('toggle-analytics').addEventListener('click', () => {
            const content = document.getElementById('analytics-content');
            const isVisible = content.style.display !== 'none';
            content.style.display = isVisible ? 'none' : 'block';
            widget.querySelector('.analytics-widget').style.display = 'block';
        });
        
        // Show widget after 5 seconds
        setTimeout(() => {
            widget.querySelector('.analytics-widget').style.display = 'block';
        }, 5000);
    }

    updateRealtimeDashboard() {
        const metrics = this.getRealtimeMetrics();
        
        // Update widget se presente
        const liveConversations = document.getElementById('live-conversations');
        const liveSatisfaction = document.getElementById('live-satisfaction');
        const liveMLUsage = document.getElementById('live-ml-usage');
        const liveResponseTime = document.getElementById('live-response-time');
        
        if (liveConversations) liveConversations.textContent = metrics.today.conversations;
        if (liveSatisfaction) liveSatisfaction.textContent = Math.round(metrics.performance.satisfactionRate) + '%';
        if (liveMLUsage) liveMLUsage.textContent = Math.round(metrics.today.mlUsage) + '%';
        if (liveResponseTime) liveResponseTime.textContent = metrics.performance.responseTime + 's';
        
        // Update dashboard page se presente
        this.updateDashboardPage(metrics);
    }

    updateDashboardPage(metrics) {
        // Update dashboard.html metrics
        const dashboardMetrics = document.querySelectorAll('.metric-card p');
        if (dashboardMetrics.length >= 4) {
            if (dashboardMetrics[0]) dashboardMetrics[0].textContent = metrics.today.conversations;
            if (dashboardMetrics[1]) dashboardMetrics[1].textContent = Math.round(metrics.performance.satisfactionRate) + '%';
            if (dashboardMetrics[2]) dashboardMetrics[2].textContent = metrics.live.activeUsers;
            if (dashboardMetrics[3]) dashboardMetrics[3].textContent = Math.round(metrics.performance.mlAccuracy) + '%';
        }
    }

    // 🔧 METODI HELPER
    updateTimeBasedMetrics(type) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        this.analytics[type].today++;
        this.analytics[type].thisWeek++;
        this.analytics[type].thisMonth++;
    }

    updateAverageResponseTime(newTime) {
        const current = this.analytics.responses.avgResponseTime;
        const total = this.analytics.responses.total;
        this.analytics.responses.avgResponseTime = Math.round(
            ((current * (total - 1)) + newTime) / total
        );
    }

    calculateAverageRating() {
        const total = this.analytics.feedback.thumbsUp + this.analytics.feedback.thumbsDown;
        if (total === 0) return 0;
        
        this.analytics.feedback.avgRating = 
            Math.round((this.analytics.feedback.thumbsUp / total) * 100);
    }

    calculateSatisfactionRate() {
        const positive = this.analytics.responses.positive;
        const total = this.analytics.responses.total;
        return total > 0 ? Math.round((positive / total) * 100) : 0;
    }

    calculateMLAccuracy() {
        const mlTotal = this.analytics.mlPerformance.mlResponses;
        const positiveML = this.analytics.feedback.detailedFeedback
            .filter(f => f.type === 'positive').length;
        
        return mlTotal > 0 ? Math.round((positiveML / mlTotal) * 100) : 0;
    }

    getActiveUsers() {
        const now = Date.now();
        const activeThreshold = 5 * 60 * 1000; // 5 minuti
        
        return Array.from(this.sessionAnalytics.values())
            .filter(session => 
                session.messages.length > 0 && 
                (now - session.startTime.getTime()) < activeThreshold
            ).length;
    }

    getMessagesPerHour() {
        const hourAgo = Date.now() - (60 * 60 * 1000);
        let messageCount = 0;
        
        this.sessionAnalytics.forEach(session => {
            messageCount += session.messages.filter(msg => 
                msg.timestamp.getTime() > hourAgo
            ).length;
        });
        
        return messageCount;
    }

    getAverageSessionTime() {
        const sessions = Array.from(this.sessionAnalytics.values());
        if (sessions.length === 0) return 0;
        
        const totalTime = sessions.reduce((sum, session) => {
            const sessionTime = Date.now() - session.startTime.getTime();
            return sum + sessionTime;
        }, 0);
        
        return Math.round(totalTime / sessions.length / 1000); // secondi
    }

    getTodayFeedback() {
        const today = new Date().toDateString();
        return this.analytics.feedback.detailedFeedback
            .filter(f => f.timestamp.toDateString() === today).length;
    }

    getTodayMLUsage() {
        const today = new Date().toDateString();
        let mlMessages = 0;
        let totalMessages = 0;
        
        this.sessionAnalytics.forEach(session => {
            session.messages.forEach(msg => {
                if (msg.timestamp.toDateString() === today) {
                    totalMessages++;
                    if (msg.mlEnhanced) mlMessages++;
                }
            });
        });
        
        return totalMessages > 0 ? (mlMessages / totalMessages) * 100 : 0;
    }

    getCurrentSessionId() {
        return sessionStorage.getItem('tribucoach_session') || 'unknown';
    }

    // 📥 EXPORT ANALYTICS
    exportAnalytics(format = 'json') {
        const data = {
            timestamp: new Date(),
            analytics: this.analytics,
            realtimeMetrics: this.getRealtimeMetrics(),
            actionableInsights: this.getActionableInsights(),
            sessionsData: Array.from(this.sessionAnalytics.entries())
        };
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tribucoach-analytics-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        return data;
    }

    // 🎯 API PUBBLICA
    getAnalytics() {
        return {
            ...this.analytics,
            realtime: this.getRealtimeMetrics(),
            insights: this.getActionableInsights()
        };
    }

    // 👍👎 AGGIUNGI FEEDBACK BUTTONS AI MESSAGGI
    addFeedbackButtons(messageElement, messageIndex) {
        if (messageElement.querySelector('.feedback-buttons')) return; // Già presenti
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback-buttons';
        feedbackDiv.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 8px;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        feedbackDiv.innerHTML = `
            <button class="feedback-btn positive" onclick="analyticsManager.addFeedbackToMessage(${messageIndex}, 'positive')" style="
                background: none;
                border: none;
                color: #4CAF50;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            " title="Risposta utile">👍</button>
            
            <button class="feedback-btn negative" onclick="analyticsManager.addFeedbackToMessage(${messageIndex}, 'negative')" style="
                background: none;
                border: none;
                color: #f44336;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            " title="Risposta non utile">👎</button>
        `;
        
        // Hover effects
        feedbackDiv.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
                btn.style.transform = 'scale(1.1)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'none';
                btn.style.transform = 'scale(1)';
            });
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.style.background = btn.classList.contains('positive') ? 
                    'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)';
                btn.disabled = true;
                
                // Hide other button
                const otherBtn = feedbackDiv.querySelector(
                    btn.classList.contains('positive') ? '.negative' : '.positive'
                );
                if (otherBtn) otherBtn.style.display = 'none';
                
                // Show thanks message
                setTimeout(() => {
                    const thanks = document.createElement('span');
                    thanks.textContent = '✨ Grazie!';
                    thanks.style.cssText = `
                        color: #ff6600;
                        font-size: 0.8rem;
                        margin-left: 10px;
                        animation: fadeIn 0.3s ease;
                    `;
                    feedbackDiv.appendChild(thanks);
                }, 200);
            });
        });
        
        messageElement.querySelector('.message-bubble').appendChild(feedbackDiv);
    }
}

// 🎨 CSS per animazioni
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .feedback-buttons {
        animation: fadeIn 0.3s ease;
    }
    
    .analytics-widget {
        animation: slideInRight 0.5s ease;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// 🚀 INIZIALIZZA ANALYTICS MANAGER
window.analyticsManager = new AnalyticsDashboard();

console.log('📊 Sistema Analytics Dashboard + Feedback caricato!');
console.log('💡 Funzioni disponibili:');
console.log('   📈 analyticsManager.getAnalytics() - metriche complete');
console.log('   👍 analyticsManager.addFeedbackToMessage(index, type) - feedback manuale');
console.log('   📥 analyticsManager.exportAnalytics() - export dati');