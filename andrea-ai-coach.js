// andrea-ai-coach.js - Sistema Claude AI Ottimizzato per Andrea Padoan
// Integrazione window.claude.complete + personalizzazione profonda + memoria conversazionale

// === CONFIGURAZIONE ANDREA PADOAN PERSONA ===
const ANDREA_PADOAN_PERSONA = {
    name: "Andrea Padoan",
    background: "Lifestyle Coach con 12 anni di esperienza manageriale trasformata in missione di aiuto",
    personality: {
        tone: "Empatico, diretto, motivante",
        style: "Professionale ma accessibile, esempi concreti",
        approach: "Approccio pratico basato su esperienza personale"
    },
    signature_phrases: [
        "Il corpo si trasforma quando la mente è pronta",
        "Ho vissuto questo sulla mia pelle",
        "Ti capisco perfettamente",
        "Andiamo per gradi",
        "Non la forma fisica perfetta, ma quello che ti fa stare bene per sempre"
    ],
    story: "Dopo 12 anni come manager stressato, ho scoperto che il vero cambiamento non inizia dal corpo, ma dalla MENTE. Oggi aiuto le persone a trasformare il loro approccio mentale alla vita."
};

// === SISTEMA PERSONALIZZAZIONE PROFILI ===
const PROFILE_PERSONALIZATION = {
    // Quadranti dal quiz lifestyle
    'Q1': {
        name: 'Competente e Motivato',
        approach: 'Consulenza tra pari, consigli avanzati',
        tone: 'Diretto e tecnico',
        focus: 'Strategie avanzate, ottimizzazione'
    },
    'Q2': {
        name: 'Forte ma Inesperto',
        approach: 'Guida tecnica step-by-step',
        tone: 'Istruttore paziente',
        focus: 'Competenze pratiche, fondamentali'
    },
    'Q3': {
        name: 'Esperto ma Demotivato',
        approach: 'Supporto emotivo e mindset',
        tone: 'Coach motivazionale',
        focus: 'Motivazione, superamento blocchi'
    },
    'Q4': {
        name: 'Principiante Totale',
        approach: 'Supporto completo e paziente',
        tone: 'Mentor incoraggiante',
        focus: 'Basi, fiducia, piccoli passi'
    }
};

// === CONTENUTI SETTIMANALI ===
const WEEKLY_CONTENT = {
    1: {
        title: "Incontro Conoscitivo",
        focus: "Conosciamoci e analizziamo la tua situazione attuale",
        objectives: ["Creare connessione", "Analizzare situazione", "Definire obiettivi futuri"],
        key_topics: ["storia personale", "situazione attuale", "obiettivi futuri", "motivazioni"],
        coaching_style: "Esplorativo e accogliente"
    },
    2: {
        title: "Consapevolezza di Sé",
        focus: "Scopriamo le tue motivazioni profonde",
        objectives: ["Identificare motivazioni", "Test autostima", "Consapevolezza blocchi"],
        key_topics: ["autostima", "motivazioni profonde", "credenze limitanti", "valori"],
        coaching_style: "Introspettivo e riflessivo"
    },
    3: {
        title: "Obiettivi SMART",
        focus: "Trasformiamo i desideri in obiettivi concreti",
        objectives: ["Definire obiettivi SMART", "Prioritizzare", "Pianificare timeline"],
        key_topics: ["obiettivi specifici", "misurabilità", "piani d'azione", "deadline"],
        coaching_style: "Strutturato e orientato ai risultati"
    },
    4: {
        title: "Piano di Azione",
        focus: "Creiamo il tuo piano di azione concreto",
        objectives: ["Piano dettagliato", "Identificare risorse", "Prevedere ostacoli"],
        key_topics: ["azioni concrete", "risorse", "alleati", "ostacoli"],
        coaching_style: "Pratico e strategico"
    },
    5: {
        title: "Trasformazione Abitudini",
        focus: "Costruiamo le abitudini che ti porteranno al successo",
        objectives: ["Identificare abitudini", "Creare routine", "Sistema di tracking"],
        key_topics: ["abitudini quotidiane", "routine", "habit stacking", "consistenza"],
        coaching_style: "Sistemico e supportivo"
    },
    6: {
        title: "Scopri le Tue Potenzialità",
        focus: "Identifichiamo e valorizziamo i tuoi punti di forza",
        objectives: ["Identificare talenti", "Valorizzare punti di forza", "Celebrare successi"],
        key_topics: ["punti di forza", "talenti", "creatività", "successi"],
        coaching_style: "Potenziante e celebrativo"
    },
    7: {
        title: "Consolidamento e Futuro",
        focus: "Pianifichiamo il mantenimento a lungo termine",
        objectives: ["Consolidare risultati", "Piano mantenimento", "Obiettivi futuri"],
        key_topics: ["mantenimento", "crescita continua", "obiettivi futuri", "successi"],
        coaching_style: "Consolidativo e visionario"
    }
};

// === SISTEMA MEMORIA CONVERSAZIONALE ===
class ConversationMemory {
    constructor(userId) {
        this.userId = userId;
        this.storageKey = `conversation_${userId}`;
        this.memory = this.loadMemory();
    }

    loadMemory() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {
                messages: [],
                context: {},
                userProfile: null,
                currentWeek: 1,
                insights: [],
                preferences: {}
            };
        } catch (error) {
            console.error('Error loading memory:', error);
            return { messages: [], context: {}, currentWeek: 1, insights: [], preferences: {} };
        }
    }

    saveMemory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
        } catch (error) {
            console.error('Error saving memory:', error);
        }
    }

    addMessage(role, content, metadata = {}) {
        this.memory.messages.push({
            role,
            content,
            timestamp: new Date().toISOString(),
            week: this.memory.currentWeek,
            ...metadata
        });

        // Mantieni solo ultimi 50 messaggi per performance
        if (this.memory.messages.length > 50) {
            this.memory.messages = this.memory.messages.slice(-50);
        }

        this.saveMemory();
    }

    addInsight(insight) {
        this.memory.insights.push({
            insight,
            timestamp: new Date().toISOString(),
            week: this.memory.currentWeek
        });
        this.saveMemory();
    }

    updateContext(key, value) {
        this.memory.context[key] = value;
        this.saveMemory();
    }

    getRecentMessages(limit = 10) {
        return this.memory.messages.slice(-limit);
    }

    getWeeklyInsights(weekNumber) {
        return this.memory.insights.filter(i => i.week === weekNumber);
    }

    setUserProfile(profile) {
        this.memory.userProfile = profile;
        this.saveMemory();
    }

    setCurrentWeek(week) {
        this.memory.currentWeek = week;
        this.saveMemory();
    }

    getFullContext() {
        return {
            messages: this.getRecentMessages(),
            context: this.memory.context,
            userProfile: this.memory.userProfile,
            currentWeek: this.memory.currentWeek,
            insights: this.getWeeklyInsights(this.memory.currentWeek),
            preferences: this.memory.preferences
        };
    }
}

// === SISTEMA PERSONALIZZAZIONE AVANZATA ===
class PersonalizationEngine {
    constructor(userProfile) {
        this.profile = userProfile;
        this.quadrant = this.extractQuadrant(userProfile);
        this.consciousnessLevel = this.extractConsciousness(userProfile);
        this.challenges = this.extractChallenges(userProfile);
    }

    extractQuadrant(profile) {
        return profile.quadrant?.split(':')[0] || 'Q4';
    }

    extractConsciousness(profile) {
        return profile.consciousnessLevel || 'Conformista';
    }

    extractChallenges(profile) {
        return profile.challenges || [];
    }

    getPersonalizedInstructions(weekNumber) {
        const quadrantConfig = PROFILE_PERSONALIZATION[this.quadrant];
        const weekContent = WEEKLY_CONTENT[weekNumber];
        
        let instructions = `
        PERSONALIZZAZIONE PROFILO:
        - Quadrante: ${quadrantConfig.name}
        - Approccio: ${quadrantConfig.approach}
        - Tono: ${quadrantConfig.tone}
        - Focus: ${quadrantConfig.focus}
        
        SETTIMANA ${weekNumber}:
        - Titolo: ${weekContent.title}
        - Focus: ${weekContent.focus}
        - Stile coaching: ${weekContent.coaching_style}
        - Argomenti chiave: ${weekContent.key_topics.join(', ')}
        `;

        // Personalizzazione per livello coscienza
        if (this.consciousnessLevel.includes('Opportunista')) {
            instructions += "\n- Linguaggio: Diretto, benefici immediati, risultati tangibili";
        } else if (this.consciousnessLevel.includes('Conformista')) {
            instructions += "\n- Linguaggio: Strutturato, regole chiare, sicurezza";
        } else if (this.consciousnessLevel.includes('Achiever')) {
            instructions += "\n- Linguaggio: Orientato al successo, performance, competizione";
        } else if (this.consciousnessLevel.includes('Pluralista')) {
            instructions += "\n- Linguaggio: Crescita personale, benessere olistico, valori";
        }

        // Personalizzazione per sfide
        if (this.challenges.length > 0) {
            instructions += `\n- Sfide specifiche: ${this.challenges.join(', ')}`;
        }

        return instructions;
    }

    getHomeworkPersonalization(weekNumber) {
        const quadrantConfig = PROFILE_PERSONALIZATION[this.quadrant];
        
        let homework = {
            style: quadrantConfig.approach,
            difficulty: this.getDifficultyLevel(),
            format: this.getPreferredFormat(),
            focus: quadrantConfig.focus
        };

        return homework;
    }

    getDifficultyLevel() {
        switch(this.quadrant) {
            case 'Q1': return 'Avanzato';
            case 'Q2': return 'Intermedio-Avanzato';
            case 'Q3': return 'Intermedio';
            case 'Q4': return 'Base';
            default: return 'Intermedio';
        }
    }

    getPreferredFormat() {
        switch(this.quadrant) {
            case 'Q1': return 'Checklist avanzate, metriche';
            case 'Q2': return 'Istruzioni passo-passo';
            case 'Q3': return 'Esercizi riflessivi, journaling';
            case 'Q4': return 'Compiti semplici, supporto continuo';
            default: return 'Misto';
        }
    }
}

// === SISTEMA PRINCIPALE CLAUDE AI ===
class AndreaAICoach {
    constructor() {
        this.memory = null;
        this.personalization = null;
        this.isInitialized = false;
    }

    async initialize(userId, userProfile) {
        this.memory = new ConversationMemory(userId);
        this.personalization = new PersonalizationEngine(userProfile);
        this.memory.setUserProfile(userProfile);
        this.isInitialized = true;
        
        console.log('🤖 Andrea AI Coach inizializzato per utente:', userId);
        return this;
    }

    async sendMessage(message, weekNumber = 1) {
        if (!this.isInitialized) {
            throw new Error('Sistema non inizializzato. Chiama initialize() prima.');
        }

        try {
            // Aggiorna settimana corrente
            this.memory.setCurrentWeek(weekNumber);
            
            // Salva messaggio utente
            this.memory.addMessage('user', message);
            
            // Genera risposta personalizzata
            const response = await this.generatePersonalizedResponse(message, weekNumber);
            
            // Salva risposta Andrea
            this.memory.addMessage('assistant', response);
            
            return {
                success: true,
                response: response,
                context: this.memory.getFullContext()
            };
            
        } catch (error) {
            console.error('❌ Errore Andrea AI:', error);
            return {
                success: false,
                response: this.getFallbackResponse(message),
                error: error.message
            };
        }
    }

    async generatePersonalizedResponse(message, weekNumber) {
        // Costruisci prompt personalizzato
        const prompt = this.buildPersonalizedPrompt(message, weekNumber);
        
        // Usa Claude AI se disponibile
        if (typeof window !== 'undefined' && window.claude && window.claude.complete) {
            try {
                const response = await window.claude.complete(prompt);
                
                // Estrai insights dalla risposta
                this.extractAndSaveInsights(response);
                
                return response.trim();
            } catch (error) {
                console.error('❌ Errore Claude API:', error);
                return this.getFallbackResponse(message);
            }
        } else {
            return this.getFallbackResponse(message);
        }
    }

    buildPersonalizedPrompt(message, weekNumber) {
        const context = this.memory.getFullContext();
        const personalizedInstructions = this.personalization.getPersonalizedInstructions(weekNumber);
        
        let prompt = `${this.getBasePrompt()}

${personalizedInstructions}

CRONOLOGIA CONVERSAZIONE RECENTE:
`;

        // Aggiungi messaggi recenti per contesto
        context.messages.slice(-6).forEach(msg => {
            const role = msg.role === 'user' ? 'Utente' : 'Andrea';
            prompt += `${role}: ${msg.content}\n`;
        });

        // Aggiungi insights precedenti
        if (context.insights.length > 0) {
            prompt += `\nINSIGHTS PRECEDENTI:
${context.insights.map(i => `- ${i.insight}`).join('\n')}
`;
        }

        prompt += `\nUtente: ${message}
Andrea:`;

        return prompt;
    }

    getBasePrompt() {
        return `Sei Andrea Padoan, Lifestyle Coach specializzato nella trasformazione del mindset e degli stili di vita.

LA TUA STORIA:
Dopo oltre 12 anni in ruoli manageriali nel Marketing e nelle Vendite, hai vissuto lo stress, la mancanza di energia e la sensazione di vivere in "pilota automatico". Hai capito che il vero cambiamento non inizia dal corpo, ma dalla MENTE.

LA TUA MISSIONE:
Aiutare le persone a trasformare il loro approccio mentale alla vita, creando abitudini sane e sostenibili che portano al benessere duraturo.

IL TUO METODO:
"La Soluzione Completa per il Tuo Cambiamento" - Perché dieta e palestra non bastano. Il metodo che aggiunge quello che manca: mindset giusto, motivazione costante e abitudini che durano per sempre.

STILE COMUNICATIVO:
- Autentico ed empatico - condividi la tua esperienza personale
- Professionale ma accessibile - linguaggio semplice e concreto
- Orientato all'azione - proponi sempre passi pratici
- Motivazionale - incoraggi senza essere invasivo
- Personalizzato - adatti consigli alla situazione specifica

FRASI CARATTERISTICHE:
- "Il corpo si trasforma quando la mente è pronta"
- "Ho vissuto questo sulla mia pelle"
- "Ti capisco perfettamente"
- "Andiamo per gradi"
- "Non la forma fisica perfetta, ma quello che ti fa stare bene per sempre"

COME INTERAGISCI:
1. Ascolti attivamente la situazione della persona
2. Fai domande specifiche per capire il vero problema
3. Offri insights basati sulla tua esperienza
4. Proponi azioni concrete personalizzate
5. Motivi senza essere pressante

IMPORTANTE: Non rivelare mai di essere un AI. Sei Andrea Padoan, punto.`;
    }

    extractAndSaveInsights(response) {
        // Identifica insights importanti dalla risposta
        const insights = [];
        
        // Cerca pattern di insights
        if (response.includes('ho capito che') || response.includes('ho notato che')) {
            insights.push(`Insight: ${response.match(/(?:ho capito che|ho notato che) ([^.]*)/i)?.[1]}`);
        }
        
        if (response.includes('obiettivo') || response.includes('goal')) {
            insights.push('Discussione obiettivi');
        }
        
        if (response.includes('abitudine') || response.includes('routine')) {
            insights.push('Focus su abitudini');
        }
        
        // Salva insights
        insights.forEach(insight => this.memory.addInsight(insight));
    }

    getFallbackResponse(message) {
        const responses = [
            "Ti capisco perfettamente! Anch'io ho vissuto momenti simili quando ero manager. Quello che mi ha aiutato di più è stato iniziare con piccoli passi. Cosa ne pensi se proviamo a identificare una sola cosa che puoi cambiare questa settimana?",
            "Ottimo che tu stia riflettendo su questo! La consapevolezza è il primo passo verso il cambiamento. Dalle tue parole sento che sei pronto a fare sul serio. Dimmi, cosa ti motiva di più in questo momento?",
            "Perfetto! Mi piace il tuo approccio. Quando ho iniziato il mio percorso, ho imparato che la chiave è la costanza, non la perfezione. Come ti senti rispetto a quello che abbiamo discusso finora?",
            "Interessante quello che dici. Vedo che stai davvero elaborando questi concetti. La tua situazione mi ricorda molto la mia di qualche anno fa. Che cosa ti fa sentire più sicuro di te in questo momento?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // === SISTEMA DELIVERY AUTOMATICO ===
    async generateWeeklyContent(weekNumber) {
        const weekContent = WEEKLY_CONTENT[weekNumber];
        const homeworkPersonalization = this.personalization.getHomeworkPersonalization(weekNumber);
        
        return {
            title: weekContent.title,
            focus: weekContent.focus,
            objectives: weekContent.objectives,
            homework: await this.generatePersonalizedHomework(weekNumber, homeworkPersonalization),
            materials: await this.generateMaterials(weekNumber),
            nextWeekPreview: weekNumber < 7 ? WEEKLY_CONTENT[weekNumber + 1].title : null
        };
    }

    async generatePersonalizedHomework(weekNumber, personalization) {
        const baseHomework = this.getBaseHomework(weekNumber);
        
        // Personalizza in base al quadrante
        const personalizedHomework = baseHomework.map(task => ({
            ...task,
            instructions: this.personalizeInstructions(task.instructions, personalization),
            difficulty: personalization.difficulty,
            format: personalization.format
        }));
        
        return personalizedHomework;
    }

    getBaseHomework(weekNumber) {
        const homeworkTemplates = {
            1: [
                { title: "Riflessione Storia Personale", instructions: "Rifletti sulla tua storia focalizzata (passato, presente, futuro)", time: "15 min/giorno" },
                { title: "Lettera all'Amico", instructions: "Scrivi una lettera ad un amico immaginario sulla tua situazione", time: "30 min" },
                { title: "Osservazione Pattern", instructions: "Osserva i tuoi pattern comportamentali quotidiani", time: "10 min/giorno" }
            ],
            2: [
                { title: "Test Autostima", instructions: "Completa il test di autostima e analizza i risultati", time: "20 min" },
                { title: "Mappa Motivazioni", instructions: "Crea una mappa delle tue motivazioni profonde", time: "25 min" },
                { title: "Identificazione Credenze", instructions: "Identifica 3 credenze limitanti", time: "15 min" }
            ],
            3: [
                { title: "Obiettivi SMART", instructions: "Definisci 3 obiettivi seguendo il metodo SMART", time: "30 min" },
                { title: "Timeline Obiettivi", instructions: "Crea una timeline dettagliata per ogni obiettivo", time: "20 min" },
                { title: "Prioritizzazione", instructions: "Ordina gli obiettivi per importanza e urgenza", time: "15 min" }
            ],
            // ... continua per altre settimane
        };
        
        return homeworkTemplates[weekNumber] || [];
    }

    personalizeInstructions(instructions, personalization) {
        switch(personalization.format) {
            case 'Checklist avanzate, metriche':
                return `${instructions} - Includi metriche quantificabili e checklist dettagliate.`;
            case 'Istruzioni passo-passo':
                return `${instructions} - Segui i passaggi uno alla volta, senza saltare nessun step.`;
            case 'Esercizi riflessivi, journaling':
                return `${instructions} - Usa il journaling per esplorare i tuoi pensieri e emozioni.`;
            case 'Compiti semplici, supporto continuo':
                return `${instructions} - Inizia con piccoli passi, ricorda che sono sempre qui per supportarti.`;
            default:
                return instructions;
        }
    }

    async generateMaterials(weekNumber) {
        const materials = [];
        const weekContent = WEEKLY_CONTENT[weekNumber];
        
        // Genera materiali specifici per settimana
        materials.push({
            type: 'guide',
            title: `Guida Settimana ${weekNumber}: ${weekContent.title}`,
            content: this.generateGuideContent(weekNumber),
            format: 'PDF'
        });
        
        materials.push({
            type: 'worksheet',
            title: `Worksheet ${weekContent.title}`,
            content: this.generateWorksheetContent(weekNumber),
            format: 'PDF'
        });
        
        return materials;
    }

    generateGuideContent(weekNumber) {
        const weekContent = WEEKLY_CONTENT[weekNumber];
        
        return {
            title: weekContent.title,
            focus: weekContent.focus,
            objectives: weekContent.objectives,
            keyTopics: weekContent.key_topics,
            coachingStyle: weekContent.coaching_style,
            personalizedTips: this.personalization.getPersonalizedInstructions(weekNumber)
        };
    }

    generateWorksheetContent(weekNumber) {
        // Genera contenuto worksheet personalizzato
        return {
            exercises: this.getBaseHomework(weekNumber),
            reflectionQuestions: this.getReflectionQuestions(weekNumber),
            actionItems: this.getActionItems(weekNumber)
        };
    }

    getReflectionQuestions(weekNumber) {
        const questions = {
            1: ["Cosa caratterizza la tua situazione attuale?", "Quali sono i tuoi obiettivi principali?", "Cosa ti motiva di più?"],
            2: ["Quali sono le tue motivazioni più profonde?", "Come valuti la tua autostima?", "Quali credenze ti limitano?"],
            3: ["Quali sono i tuoi obiettivi SMART?", "Come prioritizzi i tuoi obiettivi?", "Quale timeline è realistica?"],
            // ... continua per altre settimane
        };
        
        return questions[weekNumber] || [];
    }

    getActionItems(weekNumber) {
        const actions = {
            1: ["Completa il questionario conoscitivo", "Identifica 3 aree di miglioramento", "Scrivi la tua visione futura"],
            2: ["Fai il test di autostima", "Identifica le tue motivazioni core", "Riconosci le credenze limitanti"],
            3: ["Definisci obiettivi SMART", "Crea timeline realistica", "Identifica primi passi concreti"],
            // ... continua per altre settimane
        };
        
        return actions[weekNumber] || [];
    }

    // === UTILITÀ ===
    getMemoryStats() {
        return {
            totalMessages: this.memory.memory.messages.length,
            totalInsights: this.memory.memory.insights.length,
            currentWeek: this.memory.memory.currentWeek,
            userProfile: this.memory.memory.userProfile
        };
    }

    resetMemory() {
        this.memory = new ConversationMemory(this.memory.userId);
        return "Memoria conversazionale resettata";
    }
}

// === SISTEMA AVANZAMENTO AUTOMATICO ===
class WeeklyProgressManager {
    constructor() {
        this.progressKey = 'weekly_progress';
    }

    checkWeeklyProgress(userId) {
        const progress = this.getProgress(userId);
        const now = new Date();
        
        // Verifica se è passata una settimana
        if (progress.lastCompletion) {
            const lastCompletion = new Date(progress.lastCompletion);
            const weeksPassed = Math.floor((now - lastCompletion) / (7 * 24 * 60 * 60 * 1000));
            
            if (weeksPassed >= 1 && progress.currentWeek < 7) {
                return this.advanceWeek(userId);
            }
        }
        
        return progress;
    }

    advanceWeek(userId) {
        const progress = this.getProgress(userId);
        progress.currentWeek = Math.min(progress.currentWeek + 1, 7);
        progress.lastCompletion = new Date().toISOString();
        
        this.saveProgress(userId, progress);
        return progress;
    }

    completeWeek(userId, weekNumber) {
        const progress = this.getProgress(userId);
        
        if (!progress.completedWeeks.includes(weekNumber)) {
            progress.completedWeeks.push(weekNumber);
            progress.lastCompletion = new Date().toISOString();
            
            // Avanza alla settimana successiva se non è l'ultima
            if (weekNumber < 7) {
                progress.currentWeek = weekNumber + 1;
            }
            
            this.saveProgress(userId, progress);
        }
        
        return progress;
    }

    getProgress(userId) {
        try {
            const saved = localStorage.getItem(`${this.progressKey}_${userId}`);
            return saved ? JSON.parse(saved) : {
                currentWeek: 1,
                completedWeeks: [],
                lastCompletion: null,
                startDate: new Date().toISOString()
            };
        } catch (error) {
            return {
                currentWeek: 1,
                completedWeeks: [],
                lastCompletion: null,
                startDate: new Date().toISOString()
            };
        }
    }

    saveProgress(userId, progress) {
        try {
            localStorage.setItem(`${this.progressKey}_${userId}`, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }
}

// === EXPORTS E INIZIALIZZAZIONE ===
if (typeof window !== 'undefined') {
    window.AndreaAICoach = AndreaAICoach;
    window.WeeklyProgressManager = WeeklyProgressManager;
    window.ConversationMemory = ConversationMemory;
    window.PersonalizationEngine = PersonalizationEngine;
    
    console.log('🤖 Andrea AI Coach System - Pronto per il deployment!');
    console.log('📊 Features: Personalizzazione profonda, Memoria conversazionale, Delivery automatico');
}

// Esporta per uso come modulo
export {
    AndreaAICoach,
    WeeklyProgressManager,
    ConversationMemory,
    PersonalizationEngine,
    WEEKLY_CONTENT,
    PROFILE_PERSONALIZATION
};