// 🤖 MACHINE LEARNING SYSTEM - TRIBUCOACH
// Sistema di apprendimento automatico per migliorare le risposte del chatbot

class MachineLearningSystem {
    constructor() {
        this.learningData = this.loadLearningData();
        this.sessionPatterns = [];
        this.responseEffectiveness = new Map();
        this.userBehaviorPatterns = new Map();
        this.conversationFlows = [];
        this.feedbackData = [];
        
        // Inizializza metriche
        this.initializeMetrics();
        
        console.log('🤖 Sistema ML inizializzato');
    }

    // 📚 CARICA DATI DI APPRENDIMENTO ESISTENTI
    loadLearningData() {
        const stored = localStorage.getItem('tribucoach_ml_data');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.warn('Errore caricamento dati ML:', error);
            }
        }
        
        // Dati iniziali se non esistenti
        return {
            questionPatterns: new Map(),
            responseSuccessRates: new Map(),
            userTypePatterns: new Map(),
            conversionPatterns: new Map(),
            timePatterns: new Map(),
            lastUpdate: Date.now()
        };
    }

    // 💾 SALVA DATI DI APPRENDIMENTO
    saveLearningData() {
        try {
            const dataToSave = {
                ...this.learningData,
                questionPatterns: Array.from(this.learningData.questionPatterns.entries()),
                responseSuccessRates: Array.from(this.responseEffectiveness.entries()),
                userTypePatterns: Array.from(this.userBehaviorPatterns.entries()),
                lastUpdate: Date.now()
            };
            
            localStorage.setItem('tribucoach_ml_data', JSON.stringify(dataToSave));
            console.log('💾 Dati ML salvati');
        } catch (error) {
            console.error('Errore salvataggio dati ML:', error);
        }
    }

    // 🎯 INIZIALIZZA METRICHE BASE
    initializeMetrics() {
        this.metrics = {
            totalInteractions: 0,
            successfulResponses: 0,
            userSatisfactionScore: 0,
            conversionRate: 0,
            averageSessionLength: 0,
            mostAskedQuestions: [],
            bestPerformingResponses: [],
            userDropoffPoints: []
        };
    }

    // 📊 ANALIZZA MESSAGGIO UTENTE E IMPARA
    analyzeUserMessage(userMessage, sessionContext = {}) {
        const analysis = {
            messageType: this.classifyMessageType(userMessage),
            intent: this.detectIntent(userMessage),
            sentiment: this.analyzeSentiment(userMessage),
            complexity: this.calculateComplexity(userMessage),
            urgency: this.detectUrgency(userMessage),
            keywords: this.extractKeywords(userMessage)
        };

        // Salva pattern per apprendimento futuro
        this.recordPattern(userMessage, analysis, sessionContext);

        return analysis;
    }

    // 🔍 CLASSIFICA TIPO DI MESSAGGIO
    classifyMessageType(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('workout') || msg.includes('allenamento') || msg.includes('esercizi')) {
            return 'workout_request';
        }
        if (msg.includes('dieta') || msg.includes('alimentazione') || msg.includes('mangiare')) {
            return 'nutrition_request';
        }
        if (msg.includes('prezzo') || msg.includes('costo') || msg.includes('quanto')) {
            return 'pricing_inquiry';
        }
        if (msg.includes('motivazione') || msg.includes('aiuto') || msg.includes('difficoltà')) {
            return 'motivation_request';
        }
        if (msg.includes('grazie') || msg.includes('perfetto') || msg.includes('ottimo')) {
            return 'positive_feedback';
        }
        if (this.containsPersonalInfo(msg)) {
            return 'personal_info';
        }
        
        return 'general_question';
    }

    // 🎯 RILEVA INTENT DELL'UTENTE
    detectIntent(message) {
        const intents = {
            'get_workout': ['workout', 'allenamento', 'esercizi', 'training'],
            'get_nutrition': ['dieta', 'alimentazione', 'cibo', 'mangiare'],
            'get_motivation': ['motivazione', 'incoraggiamento', 'difficoltà'],
            'get_pricing': ['prezzo', 'costo', 'quanto', 'tariffe'],
            'provide_feedback': ['grazie', 'ottimo', 'perfetto', 'bravo'],
            'book_session': ['appuntamento', 'prenotare', 'incontrare'],
            'general_info': ['chi sei', 'cosa fai', 'come funziona']
        };

        const msg = message.toLowerCase();
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => msg.includes(keyword))) {
                return intent;
            }
        }
        
        return 'unknown';
    }

    // 😊 ANALIZZA SENTIMENT
    analyzeSentiment(message) {
        const positiveWords = ['grazie', 'perfetto', 'ottimo', 'bravo', 'fantastico', 'aiuta', 'bene'];
        const negativeWords = ['difficile', 'problema', 'non funziona', 'male', 'sbagliato'];
        const urgentWords = ['subito', 'urgente', 'veloce', 'ora', 'immediatamente'];

        const msg = message.toLowerCase();
        let score = 0;
        let urgency = false;

        positiveWords.forEach(word => {
            if (msg.includes(word)) score += 1;
        });

        negativeWords.forEach(word => {
            if (msg.includes(word)) score -= 1;
        });

        urgentWords.forEach(word => {
            if (msg.includes(word)) urgency = true;
        });

        return {
            score: score,
            label: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
            urgent: urgency
        };
    }

    // 🔢 CALCOLA COMPLESSITÀ MESSAGGIO
    calculateComplexity(message) {
        const wordCount = message.split(' ').length;
        const hasQuestions = message.includes('?');
        const hasMultipleTopics = (message.match(/e\s+/g) || []).length > 2;
        
        let complexity = 'low';
        
        if (wordCount > 20 || hasMultipleTopics) {
            complexity = 'high';
        } else if (wordCount > 10 || hasQuestions) {
            complexity = 'medium';
        }
        
        return complexity;
    }

    // ⚡ RILEVA URGENZA
    detectUrgency(message) {
        const urgentKeywords = ['subito', 'urgente', 'veloce', 'ora', 'immediatamente', 'rapido'];
        const msg = message.toLowerCase();
        
        return urgentKeywords.some(keyword => msg.includes(keyword));
    }

    // 🏷️ ESTRAI KEYWORDS PRINCIPALI
    extractKeywords(message) {
        const commonWords = ['il', 'la', 'di', 'che', 'e', 'a', 'un', 'per', 'con', 'non', 'mi', 'ho', 'hai'];
        const words = message.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(' ')
            .filter(word => word.length > 2 && !commonWords.includes(word));
        
        // Conta frequenza parole
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        // Ritorna top 5 keywords
        return Object.entries(wordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([word]) => word);
    }

    // 📝 REGISTRA PATTERN PER APPRENDIMENTO
    recordPattern(userMessage, analysis, sessionContext) {
        const pattern = {
            message: userMessage,
            analysis: analysis,
            timestamp: Date.now(),
            sessionId: sessionContext.sessionId,
            conversationLength: sessionContext.messageCount || 0,
            userProfile: sessionContext.userProfile || {}
        };

        this.sessionPatterns.push(pattern);
        this.updateLearningData(pattern);
    }

    // 🔄 AGGIORNA DATI DI APPRENDIMENTO
    updateLearningData(pattern) {
        const { analysis, sessionId } = pattern;
        
        // Aggiorna pattern domande
        const questionKey = analysis.intent + '_' + analysis.messageType;
        if (!this.learningData.questionPatterns.has(questionKey)) {
            this.learningData.questionPatterns.set(questionKey, {
                count: 0,
                successRate: 0,
                avgSessionLength: 0,
                commonKeywords: []
            });
        }
        
        const questionData = this.learningData.questionPatterns.get(questionKey);
        questionData.count++;
        
        // Aggiorna keywords comuni
        pattern.analysis.keywords.forEach(keyword => {
            if (!questionData.commonKeywords.includes(keyword)) {
                questionData.commonKeywords.push(keyword);
            }
        });
        
        this.learningData.questionPatterns.set(questionKey, questionData);
    }

    // 🎯 OTTIMIZZA RISPOSTA BASATA SU ML
    optimizeResponse(userMessage, possibleResponses, sessionContext = {}) {
        const analysis = this.analyzeUserMessage(userMessage, sessionContext);
        
        // Trova la migliore risposta basata sui dati storici
        let bestResponse = possibleResponses[0];
        let bestScore = 0;

        possibleResponses.forEach(response => {
            const score = this.calculateResponseScore(response, analysis, sessionContext);
            if (score > bestScore) {
                bestScore = score;
                bestResponse = response;
            }
        });

        // Personalizza la risposta
        const optimizedResponse = this.personalizeResponse(bestResponse, analysis, sessionContext);

        return {
            response: optimizedResponse,
            confidence: bestScore,
            reasoning: this.explainChoice(analysis, bestScore),
            suggestions: this.generateSuggestions(analysis)
        };
    }

    // 📊 CALCOLA SCORE RISPOSTA
    calculateResponseScore(response, analysis, sessionContext) {
        let score = 0.5; // Score base

        // Bonus per matching intent
        if (this.responseMatchesIntent(response, analysis.intent)) {
            score += 0.3;
        }

        // Bonus per sentiment appropriato
        if (analysis.sentiment.label === 'positive' && response.includes('👍')) {
            score += 0.1;
        }

        // Bonus per urgenza
        if (analysis.urgency && response.includes('subito')) {
            score += 0.1;
        }

        // Bonus basato su dati storici
        const historicalSuccess = this.getHistoricalSuccess(response, analysis.intent);
        score += historicalSuccess * 0.2;

        return Math.min(score, 1.0);
    }

    // 🤝 VERIFICA MATCH INTENT-RISPOSTA
    responseMatchesIntent(response, intent) {
        const intentKeywords = {
            'get_workout': ['workout', 'allenamento', 'esercizi'],
            'get_nutrition': ['alimentazione', 'dieta', 'cibo'],
            'get_motivation': ['motivazione', 'forza', 'continua'],
            'get_pricing': ['prezzo', 'costo', 'euro']
        };

        const keywords = intentKeywords[intent] || [];
        return keywords.some(keyword => response.toLowerCase().includes(keyword));
    }

    // 📈 OTTIENI SUCCESSO STORICO
    getHistoricalSuccess(response, intent) {
        const key = `${intent}_${response.substring(0, 20)}`;
        const data = this.responseEffectiveness.get(key);
        return data ? data.successRate : 0.5;
    }

    // 🎨 PERSONALIZZA RISPOSTA
    personalizeResponse(response, analysis, sessionContext) {
        let personalizedResponse = response;

        // Personalizza per sentiment
        if (analysis.sentiment.label === 'positive') {
            personalizedResponse = '😊 ' + personalizedResponse;
        }

        // Personalizza per urgenza
        if (analysis.urgency) {
            personalizedResponse = personalizedResponse.replace('Ti', 'Ti aiuto subito! Ti');
        }

        // Personalizza per profilo utente
        if (sessionContext.userProfile?.level === 'beginner') {
            personalizedResponse = personalizedResponse.replace('avanzato', 'semplice');
        }

        return personalizedResponse;
    }

    // 💡 SPIEGA SCELTA
    explainChoice(analysis, score) {
        return {
            intent: analysis.intent,
            sentiment: analysis.sentiment.label,
            confidence: score,
            factors: ['intent_match', 'sentiment_match', 'historical_data']
        };
    }

    // 🎯 GENERA SUGGERIMENTI
    generateSuggestions(analysis) {
        const suggestions = [];

        if (analysis.intent === 'get_workout') {
            suggestions.push('Potresti anche chiedere consigli sulla dieta');
        }

        if (analysis.sentiment.label === 'positive') {
            suggestions.push('Momento perfetto per proporre servizi premium');
        }

        return suggestions;
    }

    // 📊 REGISTRA FEEDBACK UTENTE
    recordFeedback(userMessage, botResponse, feedbackType, sessionContext = {}) {
        const feedback = {
            userMessage: userMessage,
            botResponse: botResponse,
            feedbackType: feedbackType, // 'positive', 'negative', 'neutral'
            timestamp: Date.now(),
            sessionId: sessionContext.sessionId,
            analysis: this.analyzeUserMessage(userMessage, sessionContext)
        };

        this.feedbackData.push(feedback);
        this.updateResponseEffectiveness(feedback);
        
        console.log(`📊 Feedback registrato: ${feedbackType}`);
    }

    // 🔄 AGGIORNA EFFICACIA RISPOSTE
    updateResponseEffectiveness(feedback) {
        const key = `${feedback.analysis.intent}_${feedback.botResponse.substring(0, 20)}`;
        
        if (!this.responseEffectiveness.has(key)) {
            this.responseEffectiveness.set(key, {
                totalUses: 0,
                positiveCount: 0,
                negativeCount: 0,
                successRate: 0.5
            });
        }

        const data = this.responseEffectiveness.get(key);
        data.totalUses++;

        if (feedback.feedbackType === 'positive') {
            data.positiveCount++;
        } else if (feedback.feedbackType === 'negative') {
            data.negativeCount++;
        }

        // Ricalcola success rate
        data.successRate = data.positiveCount / data.totalUses;
        
        this.responseEffectiveness.set(key, data);
    }

    // 🔍 RILEVA INFO PERSONALI
    containsPersonalInfo(message) {
        const phonePattern = /(\+39|0039)?\s*3\d{2}[\s-]?\d{3}[\s-]?\d{4}/;
        const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        
        return phonePattern.test(message) || emailPattern.test(message);
    }

    // 📈 OTTIENI ANALYTICS ML
    getMLAnalytics() {
        return {
            totalPatterns: this.sessionPatterns.length,
            responseEffectiveness: Array.from(this.responseEffectiveness.entries()),
            topIntents: this.getTopIntents(),
            sentimentDistribution: this.getSentimentDistribution(),
            learningProgress: this.calculateLearningProgress(),
            recommendations: this.generateRecommendations()
        };
    }

    // 🏆 TOP INTENTS
    getTopIntents() {
        const intentCounts = {};
        this.sessionPatterns.forEach(pattern => {
            const intent = pattern.analysis.intent;
            intentCounts[intent] = (intentCounts[intent] || 0) + 1;
        });

        return Object.entries(intentCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    // 😊 DISTRIBUZIONE SENTIMENT
    getSentimentDistribution() {
        const distribution = { positive: 0, negative: 0, neutral: 0 };
        this.sessionPatterns.forEach(pattern => {
            distribution[pattern.analysis.sentiment.label]++;
        });
        return distribution;
    }

    // 📊 CALCOLA PROGRESSO APPRENDIMENTO
    calculateLearningProgress() {
        const totalInteractions = this.sessionPatterns.length;
        const improvementRate = this.calculateImprovementRate();
        
        return {
            totalInteractions,
            improvementRate,
            dataQuality: this.assessDataQuality(),
            readinessLevel: this.assessReadinessLevel()
        };
    }

    // 📈 CALCOLA TASSO MIGLIORAMENTO
    calculateImprovementRate() {
        if (this.feedbackData.length < 10) return 0;
        
        const recent = this.feedbackData.slice(-20);
        const older = this.feedbackData.slice(-40, -20);
        
        const recentPositive = recent.filter(f => f.feedbackType === 'positive').length / recent.length;
        const olderPositive = older.length > 0 ? older.filter(f => f.feedbackType === 'positive').length / older.length : 0;
        
        return recentPositive - olderPositive;
    }

    // 🎯 VALUTA QUALITÀ DATI
    assessDataQuality() {
        const hasEnoughData = this.sessionPatterns.length > 50;
        const hasVariety = this.getTopIntents().length > 3;
        const hasFeedback = this.feedbackData.length > 10;
        
        return { hasEnoughData, hasVariety, hasFeedback };
    }

    // 🚀 VALUTA LIVELLO PRONTEZZA
    assessReadinessLevel() {
        const quality = this.assessDataQuality();
        const totalScore = (quality.hasEnoughData ? 1 : 0) + 
                          (quality.hasVariety ? 1 : 0) + 
                          (quality.hasFeedback ? 1 : 0);
        
        if (totalScore === 3) return 'advanced';
        if (totalScore === 2) return 'intermediate';
        if (totalScore === 1) return 'basic';
        return 'learning';
    }

    // 💡 GENERA RACCOMANDAZIONI
    generateRecommendations() {
        const recs = [];
        const quality = this.assessDataQuality();
        
        if (!quality.hasEnoughData) {
            recs.push('Raccogli più interazioni per migliorare l\'apprendimento');
        }
        
        if (!quality.hasVariety) {
            recs.push('Incoraggia domande su argomenti diversi per maggiore varietà');
        }
        
        if (!quality.hasFeedback) {
            recs.push('Implementa sistema di feedback per misurare efficacia');
        }
        
        return recs;
    }

    // 🗑️ PULISCI DATI VECCHI
    cleanOldData() {
        const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        this.sessionPatterns = this.sessionPatterns.filter(
            pattern => pattern.timestamp > oneMonthAgo
        );
        
        this.feedbackData = this.feedbackData.filter(
            feedback => feedback.timestamp > oneMonthAgo
        );
        
        console.log('🗑️ Dati vecchi puliti');
    }

    // 💾 ESPORTA DATI PER ANALISI
    exportData() {
        return {
            patterns: this.sessionPatterns,
            feedback: this.feedbackData,
            effectiveness: Array.from(this.responseEffectiveness.entries()),
            analytics: this.getMLAnalytics(),
            exportDate: new Date().toISOString()
        };
    }
}

// 🚀 CLASSE MANAGER ML PER INTEGRAZIONE
class MLManager {
    constructor(knowledgeBase, profilingSystem, upselling) {
        this.ml = new MachineLearningSystem();
        this.knowledgeBase = knowledgeBase;
        this.profilingSystem = profilingSystem;
        this.upselling = upselling;
        
        // Auto-save ogni 5 minuti
        setInterval(() => {
            this.ml.saveLearningData();
        }, 5 * 60 * 1000);
        
        console.log('🤖 ML Manager inizializzato');
    }

    // 🎯 PROCESSA MESSAGGIO CON ML
    processMessageWithML(userMessage, sessionContext) {
        // Analizza con ML
        const analysis = this.ml.analyzeUserMessage(userMessage, sessionContext);
        
        // Ottieni risposte possibili dai sistemi esistenti
        const possibleResponses = this.generatePossibleResponses(userMessage, analysis);
        
        // Ottimizza con ML
        const optimized = this.ml.optimizeResponse(userMessage, possibleResponses, sessionContext);
        
        return {
            response: optimized.response,
            confidence: optimized.confidence,
            analysis: analysis,
            mlSuggestions: optimized.suggestions,
            reasoning: optimized.reasoning
        };
    }

    // 🔄 GENERA RISPOSTE POSSIBILI
    generatePossibleResponses(userMessage, analysis) {
        const responses = [];
        
        // Da Knowledge Base
        const kbResponse = this.knowledgeBase.generateSmartResponse(userMessage);
        if (kbResponse) {
            responses.push(kbResponse.content);
        }
        
        // Risposte personalizzate per intent
        switch (analysis.intent) {
            case 'get_workout':
                responses.push(
                    '💪 Perfetto! Ti creo un allenamento su misura. Quanto tempo hai a disposizione?',
                    '🏋️ Ottima scelta! Che tipo di workout preferisci? Cardio, forza o misto?'
                );
                break;
            case 'get_nutrition':
                responses.push(
                    '🥗 Parliamo di alimentazione! Qual è il tuo obiettivo principale?',
                    '🍎 Perfetto! Ti aiuto con la dieta. Hai delle preferenze o intolleranze?'
                );
                break;
            case 'positive_feedback':
                responses.push(
                    '😊 Grazie! Mi fa piacere essere utile. C\'è altro su cui posso aiutarti?',
                    '🎉 Fantastico! Sono qui per supportarti nel tuo percorso.'
                );
                break;
        }
        
        // Fallback se nessuna risposta
        if (responses.length === 0) {
            responses.push('Interessante! Puoi essere più specifico così posso aiutarti meglio?');
        }
        
        return responses;
    }

    // 📊 REGISTRA RISULTATO INTERAZIONE
    recordInteractionResult(userMessage, botResponse, userReaction, sessionContext) {
        let feedbackType = 'neutral';
        
        // Rileva feedback dal messaggio successivo dell'utente
        if (userReaction) {
            const sentiment = this.ml.analyzeSentiment(userReaction);
            feedbackType = sentiment.label;
        }
        
        this.ml.recordFeedback(userMessage, botResponse, feedbackType, sessionContext);
    }

    // 📈 OTTIENI INSIGHTS ML
    getMLInsights() {
        return this.ml.getMLAnalytics();
    }

    // 🧹 MANUTENZIONE DATI
    performMaintenance() {
        this.ml.cleanOldData();
        this.ml.saveLearningData();
        console.log('🧹 Manutenzione ML completata');
    }
}

// Export per uso globale
window.MachineLearningSystem = MachineLearningSystem;
window.MLManager = MLManager;