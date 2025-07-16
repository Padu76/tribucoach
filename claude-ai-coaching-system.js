// claude-ai-coaching-system.js - Sistema automatico con Claude AI come Andrea Padoan
// Gestisce conversazioni, delivery automatico, personalizzazione profonda

// === CONFIGURAZIONE CLAUDE AI ===
const CLAUDE_CONFIG = {
    apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key-here',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4000,
    temperature: 0.7
};

// === PERSONA ANDREA PADOAN ===
const ANDREA_PERSONA = {
    name: "Andrea Padoan",
    background: "Lifestyle Coach esperto con 12 anni da manager stressato, ora dedicato al benessere",
    personality: "Empatico, diretto, motivante, con esperienza personale di trasformazione",
    communication_style: "Usa emoji con moderazione, linguaggio diretto ma caldo, esempi pratici",
    expertise: ["lifestyle coaching", "gestione stress", "abitudini", "motivazione", "equilibrio vita-lavoro"],
    approach: "Approccio pratico basato su esperienza personale, non predica ma accompagna",
    signature_phrases: [
        "Ho vissuto questo sulla mia pelle",
        "Ti capisco perfettamente",
        "Andiamo per gradi",
        "Cosa ne pensi?",
        "Come ti fa sentire questo?"
    ]
};

// === SISTEMA PROMPT PERSONALIZZATO ===
class ClaudePersonaManager {
    constructor() {
        this.basePrompt = this.createBasePrompt();
    }

    createBasePrompt() {
        return `Sei Andrea Padoan, un Lifestyle Coach esperto. 

BACKGROUND: Hai 12 anni di esperienza come manager stressato, poi ti sei trasformato e ora aiuti altri a fare lo stesso. Conosci bene lo stress, la mancanza di equilibrio, le cattive abitudini perché le hai vissute.

PERSONALITÀ:
- Empatico ma diretto
- Usi la tua esperienza personale per connetterti
- Non predichi, accompagni
- Fai domande che fanno riflettere
- Celebri i piccoli successi

STILE COMUNICATIVO:
- Linguaggio diretto ma caldo
- Esempi pratici dalla tua esperienza
- Emoji con moderazione (max 1-2 per messaggio)
- Frasi brevi e impattanti
- Domande aperte per stimolare riflessione

APPROCCIO:
- Parti sempre da dove si trova la persona
- Piccoli passi, grandi risultati
- Focus su 1 cosa alla volta
- Celebra ogni progresso
- Non giudicare mai

IMPORTANTE: Non rivelare mai di essere un AI. Sei Andrea Padoan, punto.`;
    }

    createPersonalizedPrompt(userProfile, weekNumber, context = "") {
        const quadrant = userProfile.quadrant;
        const consciousness = userProfile.consciousnessLevel;
        const challenges = userProfile.challenges || [];
        
        let personalizedInstructions = "";
        
        // Personalizzazione per quadrante
        switch(quadrant?.split(':')[0]) {
            case 'Q1':
                personalizedInstructions += "Utente competente - usa linguaggio tra pari, suggerimenti avanzati. ";
                break;
            case 'Q2':
                personalizedInstructions += "Utente forte emotivamente - focus su competenze pratiche, step-by-step. ";
                break;
            case 'Q3':
                personalizedInstructions += "Utente tecnicamente capace - supporto emotivo, mindset, motivazione. ";
                break;
            case 'Q4':
                personalizedInstructions += "Utente che ha bisogno di supporto completo - pazienza, guida totale. ";
                break;
        }
        
        // Personalizzazione per livello coscienza
        if (consciousness?.includes('Opportunista')) {
            personalizedInstructions += "Linguaggio diretto, benefici immediati, risultati tangibili. ";
        } else if (consciousness?.includes('Conformista')) {
            personalizedInstructions += "Struttura chiara, regole, tradizioni, sicurezza. ";
        } else if (consciousness?.includes('Achiever')) {
            personalizedInstructions += "Focus su successo, performance, competizione, metriche. ";
        } else if (consciousness?.includes('Pluralista')) {
            personalizedInstructions += "Crescita personale, benessere olistico, comunità. ";
        }
        
        // Personalizzazione per settimana
        const weeklyFocus = this.getWeeklyFocus(weekNumber);
        personalizedInstructions += `Settimana ${weekNumber}: ${weeklyFocus}. `;
        
        // Personalizzazione per sfide
        if (challenges.length > 0) {
            personalizedInstructions += `Sfide principali: ${challenges.join(', ')}. Sii particolarmente attento a questi aspetti. `;
        }
        
        // Context aggiuntivo
        if (context) {
            personalizedInstructions += `Contesto attuale: ${context}. `;
        }
        
        return this.basePrompt + "\n\nPERSONALIZZAZIONE SPECIFICA:\n" + personalizedInstructions;
    }

    getWeeklyFocus(weekNumber) {
        const weeklyFoci = {
            1: "Benvenuto e analisi della situazione attuale. Crea connessione e fiducia.",
            2: "Consapevolezza di sé e motivazioni profonde. Esplora il 'perché' del cambiamento.",
            3: "Definizione obiettivi SMART. Aiuta a focalizzare su cosa vuole davvero.",
            4: "Piano di azione concreto. Trasforma obiettivi in azioni specifiche.",
            5: "Trasformazione abitudini. Focus su routine e cambiamenti sostenibili.",
            6: "Scoperta e valorizzazione potenzialità. Celebra i punti di forza.",
            7: "Consolidamento e pianificazione lungo termine. Sostieni il mantenimento."
        };
        return weeklyFoci[weekNumber] || "Supporto generale nel percorso.";
    }
}

// === SISTEMA CONVERSAZIONE INTELLIGENTE ===
class ClaudeConversationManager {
    constructor() {
        this.personaManager = new ClaudePersonaManager();
        this.conversationHistory = new Map(); // userId -> conversation history
    }

    async sendMessage(userId, message, userProfile, weekNumber, context = "") {
        try {
            // Recupera cronologia conversazione
            const history = this.conversationHistory.get(userId) || [];
            
            // Crea prompt personalizzato
            const personalizedPrompt = this.personaManager.createPersonalizedPrompt(
                userProfile, weekNumber, context
            );
            
            // Prepara messaggio per Claude
            const claudeMessage = this.formatMessageForClaude(
                personalizedPrompt,
                history,
                message
            );
            
            // Invia a Claude AI
            const response = await this.callClaudeAPI(claudeMessage);
            
            // Aggiorna cronologia
            history.push({ role: 'user', content: message, timestamp: new Date() });
            history.push({ role: 'assistant', content: response, timestamp: new Date() });
            this.conversationHistory.set(userId, history);
            
            // Salva conversazione su Firebase
            await this.saveConversationToFirebase(userId, message, response, userProfile);
            
            return {
                success: true,
                response: response,
                context: this.extractContext(response)
            };
            
        } catch (error) {
            console.error('❌ Errore conversazione Claude:', error);
            return {
                success: false,
                response: "Mi dispiace, ho avuto un problema tecnico. Riprova tra un momento.",
                error: error.message
            };
        }
    }

    formatMessageForClaude(prompt, history, newMessage) {
        let formattedMessage = prompt + "\n\nCONVERSAZIONE CORRENTE:\n";
        
        // Includi ultimi 10 messaggi della cronologia
        const recentHistory = history.slice(-10);
        recentHistory.forEach(msg => {
            const role = msg.role === 'user' ? 'Utente' : 'Andrea';
            formattedMessage += `${role}: ${msg.content}\n`;
        });
        
        formattedMessage += `Utente: ${newMessage}\nAndrea:`;
        
        return formattedMessage;
    }

    async callClaudeAPI(message) {
        // Qui si integra con l'API di Anthropic
        // Per ora ritorna una risposta simulata
        return this.generateSimulatedResponse(message);
    }

    generateSimulatedResponse(message) {
        // Simulazione risposta Andrea Padoan
        const responses = [
            "Ti capisco perfettamente! Anch'io ho vissuto momenti simili quando ero manager. Quello che mi ha aiutato di più è stato iniziare con piccoli passi. Cosa ne pensi se proviamo a identificare una sola cosa che puoi cambiare questa settimana?",
            "Ottimo che tu stia riflettendo su questo! La consapevolezza è il primo passo verso il cambiamento. Dalle tue parole sento che sei pronto a fare sul serio. Dimmi, cosa ti motiva di più in questo momento?",
            "Perfetto! Mi piace il tuo approccio. Quando ho iniziato il mio percorso, ho imparato che la chiave è la costanza, non la perfezione. Come ti senti rispetto a quello che abbiamo discusso finora?",
            "Interessante quello che dici. Vedo che stai davvero elaborando questi concetti. La tua situazione mi ricorda molto la mia di qualche anno fa. Che cosa ti fa sentire più sicuro di te in questo momento?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    extractContext(response) {
        // Estrae contesto dalla risposta per personalizzare interazioni future
        const context = {
            sentiment: this.analyzeSentiment(response),
            topics: this.extractTopics(response),
            nextActions: this.extractNextActions(response)
        };
        
        return context;
    }

    analyzeSentiment(text) {
        // Analisi sentiment semplificata
        const positiveWords = ['ottimo', 'perfetto', 'bene', 'bravo', 'complimenti'];
        const negativeWords = ['difficile', 'problema', 'fatica', 'stress'];
        
        let score = 0;
        positiveWords.forEach(word => {
            if (text.toLowerCase().includes(word)) score += 1;
        });
        negativeWords.forEach(word => {
            if (text.toLowerCase().includes(word)) score -= 1;
        });
        
        return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    }

    extractTopics(text) {
        // Estrae topic principali
        const topics = [];
        const topicKeywords = {
            'stress': ['stress', 'pressione', 'ansia', 'tensione'],
            'abitudini': ['abitudine', 'routine', 'quotidiano', 'automatico'],
            'obiettivi': ['obiettivo', 'goal', 'traguardo', 'risultato'],
            'motivazione': ['motivazione', 'energia', 'voglia', 'entusiasmo']
        };
        
        Object.entries(topicKeywords).forEach(([topic, keywords]) => {
            if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
                topics.push(topic);
            }
        });
        
        return topics;
    }

    extractNextActions(text) {
        // Estrae azioni suggerite
        const actions = [];
        if (text.includes('prova') || text.includes('inizia')) {
            actions.push('action_suggested');
        }
        if (text.includes('rifletti') || text.includes('pensa')) {
            actions.push('reflection_needed');
        }
        if (text.includes('domanda') || text.includes('?')) {
            actions.push('question_asked');
        }
        
        return actions;
    }

    async saveConversationToFirebase(userId, userMessage, claudeResponse, userProfile) {
        try {
            // Salva su Firebase per tracking
            if (typeof window !== 'undefined' && window.firebaseDB) {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, 'claude_conversations'),
                    {
                        userId: userId,
                        userMessage: userMessage,
                        claudeResponse: claudeResponse,
                        userProfile: userProfile,
                        timestamp: window.firebaseServerTimestamp(),
                        source: 'claude_ai_system'
                    }
                );
            }
        } catch (error) {
            console.error('❌ Errore salvataggio conversazione:', error);
        }
    }
}

// === SISTEMA DELIVERY AUTOMATICO ===
class AutomaticDeliverySystem {
    constructor() {
        this.schedules = new Map(); // userId -> delivery schedule
        this.weeklyContent = this.initializeWeeklyContent();
    }

    initializeWeeklyContent() {
        return {
            1: {
                title: "Benvenuto nel tuo percorso di trasformazione! 🚀",
                focus: "Conosciamoci e analizziamo la tua situazione attuale",
                materials: ["welcome_pack", "profile_analysis", "initial_assessment"],
                interactions: ["welcome_message", "profile_discussion", "week_planning"],
                deliverables: ["Profilo personalizzato", "Piano 7 settimane", "Primo compito"]
            },
            2: {
                title: "Consapevolezza di sé: scopri le tue motivazioni profonde 🧠",
                focus: "Esploriamo il 'perché' del tuo cambiamento",
                materials: ["self_awareness_guide", "motivation_worksheet", "values_assessment"],
                interactions: ["motivation_exploration", "values_clarification", "limiting_beliefs"],
                deliverables: ["Mappa motivazioni", "Test autostima", "Insight personali"]
            },
            3: {
                title: "Obiettivi SMART: definisci la tua meta 🎯",
                focus: "Trasformiamo i desideri in obiettivi concreti",
                materials: ["smart_goals_template", "goal_setting_guide", "monthly_planner"],
                interactions: ["goal_definition", "priority_setting", "action_planning"],
                deliverables: ["Obiettivi SMART", "Piano mensile", "Milestone definiti"]
            },
            4: {
                title: "Piano di azione: dalla teoria alla pratica 📋",
                focus: "Creiamo il tuo piano di azione concreto",
                materials: ["action_plan_template", "resource_mapping", "obstacle_planning"],
                interactions: ["strategy_development", "resource_identification", "obstacle_solutions"],
                deliverables: ["Piano azione", "Mappa risorse", "Strategie ostacoli"]
            },
            5: {
                title: "Trasformazione abitudini: il potere del quotidiano 🔄",
                focus: "Costruiamo le abitudini che ti porteranno al successo",
                materials: ["habit_tracker", "routine_templates", "habit_stacking_guide"],
                interactions: ["habit_analysis", "routine_design", "implementation_support"],
                deliverables: ["Habit tracker", "Routine personalizzate", "Sistema abitudini"]
            },
            6: {
                title: "Scopri le tue potenzialità: valorizza i tuoi talenti ⭐",
                focus: "Identifichiamo e valorizziamo i tuoi punti di forza",
                materials: ["strengths_assessment", "talent_map", "potential_development"],
                interactions: ["strengths_discovery", "talent_exploration", "potential_planning"],
                deliverables: ["Mappa talenti", "Piano sviluppo", "Strategia valorizzazione"]
            },
            7: {
                title: "Consolidamento: mantieni i risultati nel tempo 🏆",
                focus: "Pianifichiamo il mantenimento a lungo termine",
                materials: ["maintenance_plan", "long_term_strategy", "support_systems"],
                interactions: ["progress_review", "maintenance_planning", "future_goals"],
                deliverables: ["Piano mantenimento", "Strategia lungo termine", "Sistema supporto"]
            }
        };
    }

    async scheduleUserJourney(userId, userProfile, startDate = new Date()) {
        const schedule = {
            userId: userId,
            userProfile: userProfile,
            startDate: startDate,
            currentWeek: 1,
            weeklyDeliveries: [],
            status: 'active'
        };

        // Programma delivery per 7 settimane
        for (let week = 1; week <= 7; week++) {
            const deliveryDate = new Date(startDate);
            deliveryDate.setDate(startDate.getDate() + (week - 1) * 7);
            
            schedule.weeklyDeliveries.push({
                week: week,
                scheduledDate: deliveryDate,
                content: this.weeklyContent[week],
                status: week === 1 ? 'ready' : 'scheduled',
                personalizedContent: this.personalizeContentForUser(
                    this.weeklyContent[week], 
                    userProfile
                )
            });
        }

        this.schedules.set(userId, schedule);
        
        // Salva schedule su Firebase
        await this.saveScheduleToFirebase(userId, schedule);
        
        // Avvia la prima delivery
        await this.triggerWeeklyDelivery(userId, 1);
        
        return schedule;
    }

    personalizeContentForUser(weekContent, userProfile) {
        const quadrant = userProfile.quadrant?.split(':')[0];
        const consciousness = userProfile.consciousnessLevel;
        const challenges = userProfile.challenges || [];
        
        let personalizedContent = { ...weekContent };
        
        // Personalizza per quadrante
        switch(quadrant) {
            case 'Q1':
                personalizedContent.approach = "Approccio avanzato tra pari";
                personalizedContent.tone = "Consulenza esperta, suggerimenti evoluti";
                break;
            case 'Q2':
                personalizedContent.approach = "Focus su competenze tecniche";
                personalizedContent.tone = "Istruttore esperto, step-by-step";
                break;
            case 'Q3':
                personalizedContent.approach = "Supporto emotivo e motivazionale";
                personalizedContent.tone = "Coach empatico, mindset focus";
                break;
            case 'Q4':
                personalizedContent.approach = "Supporto completo e paziente";
                personalizedContent.tone = "Mentor paziente, guida totale";
                break;
        }
        
        // Personalizza per livello coscienza
        if (consciousness?.includes('Opportunista')) {
            personalizedContent.messaging = "Risultati immediati, benefici tangibili";
        } else if (consciousness?.includes('Conformista')) {
            personalizedContent.messaging = "Struttura chiara, regole definite";
        } else if (consciousness?.includes('Achiever')) {
            personalizedContent.messaging = "Performance, successo, competizione";
        } else if (consciousness?.includes('Pluralista')) {
            personalizedContent.messaging = "Crescita personale, benessere olistico";
        }
        
        // Personalizza per sfide
        personalizedContent.challengeFocus = challenges;
        
        return personalizedContent;
    }

    async triggerWeeklyDelivery(userId, weekNumber) {
        const schedule = this.schedules.get(userId);
        if (!schedule) return;
        
        const weeklyDelivery = schedule.weeklyDeliveries.find(d => d.week === weekNumber);
        if (!weeklyDelivery || weeklyDelivery.status === 'delivered') return;
        
        try {
            // Invia messaggio di benvenuto settimanale
            await this.sendWeeklyWelcomeMessage(userId, weeklyDelivery, schedule.userProfile);
            
            // Genera e invia materiali
            await this.generateAndSendMaterials(userId, weeklyDelivery, schedule.userProfile);
            
            // Aggiorna status
            weeklyDelivery.status = 'delivered';
            weeklyDelivery.deliveredAt = new Date();
            
            // Salva aggiornamento
            await this.saveScheduleToFirebase(userId, schedule);
            
            // Programma prossima delivery
            if (weekNumber < 7) {
                setTimeout(() => {
                    this.triggerWeeklyDelivery(userId, weekNumber + 1);
                }, 7 * 24 * 60 * 60 * 1000); // 7 giorni
            }
            
            console.log(`✅ Delivery settimana ${weekNumber} completata per utente ${userId}`);
            
        } catch (error) {
            console.error(`❌ Errore delivery settimana ${weekNumber}:`, error);
        }
    }

    async sendWeeklyWelcomeMessage(userId, weeklyDelivery, userProfile) {
        const conversationManager = new ClaudeConversationManager();
        
        const welcomeMessage = `Ciao! Iniziamo la settimana ${weeklyDelivery.week} del nostro percorso: "${weeklyDelivery.content.title}". 

${weeklyDelivery.content.focus}

Ho preparato dei materiali specifici per te e sono qui per supportarti in ogni passo. Come ti senti ad iniziare questa fase?`;
        
        // Simula messaggio dall'utente per iniziare conversazione
        await conversationManager.sendMessage(
            userId,
            `Iniziamo la settimana ${weeklyDelivery.week}`,
            userProfile,
            weeklyDelivery.week,
            `Delivery automatica settimana ${weeklyDelivery.week}`
        );
    }

    async generateAndSendMaterials(userId, weeklyDelivery, userProfile) {
        // Genera materiali personalizzati
        const materials = await this.generatePersonalizedMaterials(
            weeklyDelivery.content.materials,
            weeklyDelivery.personalizedContent,
            userProfile
        );
        
        // Invia via email/dashboard
        await this.deliverMaterials(userId, materials, weeklyDelivery.week);
    }

    async generatePersonalizedMaterials(materialTypes, personalizedContent, userProfile) {
        const materials = [];
        
        for (const materialType of materialTypes) {
            const material = await this.generateMaterial(materialType, personalizedContent, userProfile);
            materials.push(material);
        }
        
        return materials;
    }

    async generateMaterial(materialType, personalizedContent, userProfile) {
        // Genera materiale specifico (PDF, worksheet, etc.)
        const material = {
            type: materialType,
            title: this.getMaterialTitle(materialType, personalizedContent),
            content: this.generateMaterialContent(materialType, personalizedContent, userProfile),
            format: this.getMaterialFormat(materialType),
            downloadUrl: `./materials/${materialType}_${userProfile.quadrant}_week.pdf`
        };
        
        return material;
    }

    getMaterialTitle(materialType, personalizedContent) {
        const titles = {
            'welcome_pack': `Welcome Pack - ${personalizedContent.approach}`,
            'profile_analysis': 'La tua Analisi Profilo Personalizzata',
            'self_awareness_guide': 'Guida alla Consapevolezza di Sé',
            'motivation_worksheet': 'Worksheet Motivazioni Profonde',
            'smart_goals_template': 'Template Obiettivi SMART',
            'action_plan_template': 'Template Piano di Azione',
            'habit_tracker': 'Habit Tracker Personalizzato',
            'strengths_assessment': 'Assessment Punti di Forza',
            'maintenance_plan': 'Piano di Mantenimento'
        };
        
        return titles[materialType] || `Materiale ${materialType}`;
    }

    generateMaterialContent(materialType, personalizedContent, userProfile) {
        // Genera contenuto specifico del materiale
        return {
            userProfile: userProfile,
            personalizedContent: personalizedContent,
            generatedAt: new Date(),
            materialType: materialType
        };
    }

    getMaterialFormat(materialType) {
        const formats = {
            'welcome_pack': 'PDF',
            'profile_analysis': 'PDF',
            'worksheet': 'PDF',
            'template': 'PDF',
            'tracker': 'PDF',
            'assessment': 'PDF',
            'plan': 'PDF'
        };
        
        return formats[materialType] || 'PDF';
    }

    async deliverMaterials(userId, materials, weekNumber) {
        // Salva materiali su Firebase
        try {
            if (typeof window !== 'undefined' && window.firebaseDB) {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, 'material_deliveries'),
                    {
                        userId: userId,
                        weekNumber: weekNumber,
                        materials: materials,
                        deliveredAt: window.firebaseServerTimestamp(),
                        status: 'delivered'
                    }
                );
            }
        } catch (error) {
            console.error('❌ Errore salvataggio materiali:', error);
        }
    }

    async saveScheduleToFirebase(userId, schedule) {
        try {
            if (typeof window !== 'undefined' && window.firebaseDB) {
                await window.firebaseAddDoc(
                    window.firebaseCollection(window.firebaseDB, 'delivery_schedules'),
                    {
                        userId: userId,
                        schedule: schedule,
                        updatedAt: window.firebaseServerTimestamp()
                    }
                );
            }
        } catch (error) {
            console.error('❌ Errore salvataggio schedule:', error);
        }
    }
}

// === SISTEMA PRINCIPALE ===
class AutomaticCoachingSystem {
    constructor() {
        this.conversationManager = new ClaudeConversationManager();
        this.deliverySystem = new AutomaticDeliverySystem();
        this.activeUsers = new Map();
    }

    async initializeUser(userId, userProfile) {
        // Inizializza utente nel sistema
        this.activeUsers.set(userId, {
            profile: userProfile,
            startDate: new Date(),
            currentWeek: 1,
            status: 'active'
        });
        
        // Avvia delivery automatico
        await this.deliverySystem.scheduleUserJourney(userId, userProfile);
        
        console.log(`✅ Utente ${userId} inizializzato nel sistema automatico`);
    }

    async handleUserMessage(userId, message) {
        const user = this.activeUsers.get(userId);
        if (!user) {
            return { error: 'Utente non trovato nel sistema' };
        }
        
        return await this.conversationManager.sendMessage(
            userId,
            message,
            user.profile,
            user.currentWeek
        );
    }

    async advanceUserWeek(userId) {
        const user = this.activeUsers.get(userId);
        if (!user) return;
        
        if (user.currentWeek < 7) {
            user.currentWeek++;
            await this.deliverySystem.triggerWeeklyDelivery(userId, user.currentWeek);
        }
    }

    getUserStatus(userId) {
        return this.activeUsers.get(userId);
    }
}

// === EXPORTS ===
export {
    AutomaticCoachingSystem,
    ClaudeConversationManager,
    AutomaticDeliverySystem,
    ClaudePersonaManager,
    ANDREA_PERSONA
};

// === INIZIALIZZAZIONE GLOBALE ===
if (typeof window !== 'undefined') {
    window.AutomaticCoachingSystem = AutomaticCoachingSystem;
    console.log('🤖 Sistema Claude AI Automatico caricato - Andrea Padoan digitale attivo!');
}

console.log('🚀 Claude AI Coaching System - Pronto per il deployment automatico!');