// 🎯 SISTEMA RACCOLTA DATI FLUIDA - TRIBUCOACH
// Sistema conversazionale per raccogliere nome e telefono in modo naturale

class FluentDataCollector {
    constructor() {
        this.userData = {
            hasName: false,
            name: '',
            hasGoal: false,
            goal: '',
            hasPhone: false,
            phone: '',
            interactionCount: 0,
            lastInteraction: Date.now(),
            valueGiven: [], // workout, consigli forniti
            interestLevel: 'low', // low, medium, high
            conversationStage: 'initial', // initial, engaged, qualified, converted
            sessionId: this.generateSessionId()
        };
        
        this.conversationHistory = [];
        this.initializePatterns();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializePatterns() {
        // 🔍 PATTERN RECOGNITION - Interesse utente
        this.interestTriggers = [
            'workout', 'allenamento', 'esercizi', 'voglio iniziare', 
            'ho bisogno', 'aiuto', 'consigli', 'programma', 'piano', 
            'risultati', 'dimagrire', 'tonificare', 'massa', 'forma',
            'palestra', 'casa', 'tempo', 'come faccio'
        ];

        this.positiveResponses = [
            'grazie', 'ottimo', 'perfetto', 'fatto', 'provato', 
            'mi piace', 'funziona', 'bene', 'fantastico', 'bravo',
            'utile', 'interessante', 'continua', 'ancora', 'altro'
        ];

        this.goalKeywords = {
            'perdere peso': ['dimagrire', 'perdere', 'peso', 'grasso', 'calorie'],
            'tonificare': ['tonificare', 'definire', 'scolpire', 'asciugare'],
            'massa muscolare': ['massa', 'muscoli', 'grosso', 'volume', 'ipertrofia'],
            'energia': ['energia', 'stanchezza', 'vitalità', 'forza'],
            'salute': ['salute', 'benessere', 'stare meglio', 'forma fisica']
        };

        // 🎭 VARIAZIONI FRASI per Naturalezza
        this.nameRequests = [
            "Sono Andrea Padoan! E tu come ti chiami? 😊",
            "Mi presento: sono Andrea, il tuo coach virtuale. Tu sei...? 🤝",
            "Piacere di conoscerti! Io sono Andrea, e tu come ti chiami?",
            "Dimmi il tuo nome così personalizzo i consigli per te! 😊",
            "Hey! Sono Andrea. Come posso chiamarti? 💪"
        ];

        this.phoneRequests = [
            "Per inviarti il programma completo, qual è il tuo WhatsApp? 📱",
            "Dammi il tuo numero e ti mando tutto su WhatsApp! 📲", 
            "Il tuo WhatsApp? Ti invio il piano personalizzato! 💪",
            "Numero WhatsApp per seguire i tuoi progressi? 📱",
            "WhatsApp per il follow-up personalizzato? (Zero spam!) ✅"
        ];
    }

    // 🧠 ANALISI MESSAGGIO UTENTE
    analyzeUserMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        return {
            showsInterest: this.interestTriggers.some(trigger => 
                lowerMessage.includes(trigger)
            ),
            isPositive: this.positiveResponses.some(response => 
                lowerMessage.includes(response)
            ),
            containsGoal: this.detectGoal(lowerMessage),
            containsName: this.extractName(message),
            containsPhone: this.extractPhone(message),
            urgencyLevel: this.detectUrgency(lowerMessage)
        };
    }

    detectGoal(message) {
        for (const [goal, keywords] of Object.entries(this.goalKeywords)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return goal;
            }
        }
        return null;
    }

    extractName(message) {
        // Pattern semplificato per nomi
        const namePatterns = [
            /(?:sono|mi chiamo|il mio nome è)\s+([a-zA-Z]+)/i,
            /^([a-zA-Z]+)$/,
            /ciao,?\s*([a-zA-Z]+)/i
        ];
        
        for (const pattern of namePatterns) {
            const match = message.match(pattern);
            if (match && match[1] && match[1].length > 1) {
                return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
            }
        }
        return null;
    }

    extractPhone(message) {
        // Pattern per numeri di telefono italiani
        const phonePattern = /(?:\+39|0039)?\s*3\d{2}\s*\d{3}\s*\d{4}|\d{10}/;
        const match = message.match(phonePattern);
        return match ? match[0].replace(/\s/g, '') : null;
    }

    detectUrgency(message) {
        const urgentWords = ['subito', 'veloce', 'rapido', 'urgente', 'presto'];
        return urgentWords.some(word => message.includes(word)) ? 'high' : 'medium';
    }

    // 🎯 LOGICA PRINCIPALE - Gestione Conversazione
    processMessage(userMessage) {
        const analysis = this.analyzeUserMessage(userMessage);
        this.updateUserData(analysis);
        
        // Aggiorna conversazione
        this.conversationHistory.push({
            timestamp: Date.now(),
            userMessage: userMessage,
            analysis: analysis
        });
        
        this.userData.interactionCount++;
        this.userData.lastInteraction = Date.now();
        
        // Determina risposta appropriata
        return this.generateResponse(analysis, userMessage);
    }

    updateUserData(analysis) {
        // Aggiorna interesse
        if (analysis.showsInterest) {
            this.userData.interestLevel = 'medium';
        }
        
        if (analysis.isPositive && this.userData.interestLevel === 'medium') {
            this.userData.interestLevel = 'high';
        }

        // Salva nome se trovato
        if (analysis.containsName && !this.userData.hasName) {
            this.userData.name = analysis.containsName;
            this.userData.hasName = true;
            this.userData.conversationStage = 'engaged';
        }

        // Salva obiettivo
        if (analysis.containsGoal && !this.userData.hasGoal) {
            this.userData.goal = analysis.containsGoal;
            this.userData.hasGoal = true;
        }

        // Salva telefono
        if (analysis.containsPhone && !this.userData.hasPhone) {
            this.userData.phone = analysis.containsPhone;
            this.userData.hasPhone = true;
            this.userData.conversationStage = 'converted';
        }
    }

    generateResponse(analysis, userMessage) {
        // 🎯 PRIORITÀ RISPOSTA

        // 1. Se utente ha fornito telefono
        if (analysis.containsPhone) {
            return this.handlePhoneProvided(analysis.containsPhone);
        }

        // 2. Se utente ha fornito nome
        if (analysis.containsName) {
            return this.handleNameProvided(analysis.containsName);
        }

        // 3. Se è il momento di chiedere telefono
        if (this.shouldAskPhone()) {
            return this.askForPhone();
        }

        // 4. Se è il momento di chiedere nome
        if (this.shouldAskName()) {
            return this.askForName();
        }

        // 5. Se utente mostra interesse, dai valore
        if (analysis.showsInterest) {
            return this.provideValue(analysis);
        }

        // 6. Risposta standard
        return this.getStandardResponse(userMessage);
    }

    // 🔍 CONDIZIONI per Raccolta Dati
    shouldAskName() {
        return !this.userData.hasName && 
               this.userData.interactionCount >= 2 && 
               this.userData.valueGiven.length > 0 &&
               this.userData.interestLevel !== 'low';
    }

    shouldAskPhone() {
        return this.userData.hasName && 
               this.userData.hasGoal && 
               this.userData.interestLevel === 'high' && 
               !this.userData.hasPhone &&
               this.userData.interactionCount >= 3;
    }

    // 💪 FORNISCI VALORE PRIMA
    provideValue(analysis) {
        const valueContent = this.selectValueContent(analysis);
        this.userData.valueGiven.push(valueContent.type);
        
        return {
            message: valueContent.content,
            action: 'value_provided',
            userData: this.userData
        };
    }

    selectValueContent(analysis) {
        // Basato su keywords del messaggio, fornisci contenuto specifico
        const message = analysis.originalMessage || '';
        
        if (message.includes('workout') || message.includes('allenamento')) {
            return {
                type: 'workout',
                content: `🔥 Perfetto! Ti mando un workout da 15 minuti che spacca:

💥 Fai 3 giri di:
• 20 Squat
• 10 Flessioni (anche sulle ginocchia)
• 30 sec Plank  
• 15 Jumping Jack

⏱️ Riposo 30 sec tra i giri

Provalo e dimmi com'è andata! 💪`
            };
        }
        
        if (message.includes('mangiare') || message.includes('dieta')) {
            return {
                type: 'nutrition',
                content: `🥗 Ecco il consiglio alimentare del giorno:

CENA PERFETTA:
• Proteine magre (pollo, pesce, uova)
• Verdure a volontà
• Una porzione di carboidrati (riso, patate)
• Zero bevande zuccherate

Esempio: Salmone + broccoli + riso integrale 👌

Semplice e efficace! Hai qualche preferenza alimentare?`
            };
        }

        if (message.includes('motivazione') || message.includes('voglia')) {
            return {
                type: 'motivation',
                content: `🔥 MOTIVAZIONE INSTANT:

"Non aspettare la motivazione. Inizia. Lei ti raggiungerà."

💪 Il segreto? Anche solo 5 minuti di movimento cambiano tutto. 
Il tuo corpo produce endorfine, la mente si schiarisce, l'energia torna.

Anche oggi che non hai voglia: fai UNA cosa. Un esercizio. Una camminata. 
L'azione genera motivazione, non il contrario! 

Cosa puoi fare NEI PROSSIMI 5 MINUTI? 🎯`
            };
        }

        // Default: workout rapido
        return {
            type: 'quick_workout',
            content: `💥 WORKOUT LAMPO - 10 minuti:

🔥 3 giri di:
• 20 Squat
• 10 Flessioni  
• 30 sec Plank
• 15 Jumping Jack

Questo è tutto! Semplice, veloce, efficace.
Fallo e dimmi com'è andata! 😉`
        };
    }

    // 🎭 RACCOLTA NOME
    askForName() {
        const randomRequest = this.nameRequests[
            Math.floor(Math.random() * this.nameRequests.length)
        ];
        
        return {
            message: `💪 Fantastico! Mi fa piacere che ti interessino i miei consigli.

${randomRequest}

Così posso personalizzare tutto per te! 🎯`,
            action: 'asking_name',
            userData: this.userData
        };
    }

    handleNameProvided(name) {
        this.userData.name = name;
        this.userData.hasName = true;
        this.userData.conversationStage = 'engaged';
        
        return {
            message: `Piacere di conoscerti ${name}! 🤝

Dimmi: qual è il tuo obiettivo principale?

🎯 Scegli quello che ti rappresenta di più:
• "Perdere peso"
• "Tonificare e definire"
• "Aumentare massa muscolare" 
• "Avere più energia"
• "Stare meglio in generale"

Così ti do consigli specifici per te! 💪`,
            action: 'name_collected',
            userData: this.userData
        };
    }

    // 📱 RACCOLTA TELEFONO
    askForPhone() {
        const randomRequest = this.phoneRequests[
            Math.floor(Math.random() * this.phoneRequests.length)
        ];
        
        const userName = this.userData.name ? ` ${this.userData.name}` : '';
        const userGoal = this.userData.goal || 'i tuoi obiettivi';
        
        return {
            message: `Perfetto${userName}! 🎯

Ti sto preparando un piano personalizzato per "${userGoal}":

✅ Workout specifici per te
✅ Consigli alimentari mirati  
✅ Tracking progressi settimanale
✅ Motivazione costante

${randomRequest}

(Promesso: zero spam, solo contenuti di valore che ti aiutano davvero!) ✅`,
            action: 'asking_phone',
            userData: this.userData
        };
    }

    handlePhoneProvided(phone) {
        this.userData.phone = phone;
        this.userData.hasPhone = true;
        this.userData.conversationStage = 'converted';
        
        const userName = this.userData.name ? ` ${this.userData.name}` : '';
        
        return {
            message: `🎉 Perfetto${userName}!

Il tuo numero ${phone} è stato salvato.

🚀 COSA SUCCEDE ORA:
✅ Riceverai il piano personalizzato entro 24h
✅ Check-in settimanali sui progressi  
✅ Accesso ai contenuti premium
✅ Supporto diretto con me

💪 Intanto, per iniziare subito:
Fai il workout che ti ho mandato e mandami una foto/video! 
Voglio vedere la tua determinazione! 🔥

Benvenuto nella TribuCoach! 🏆`,
            action: 'phone_collected',
            userData: this.userData,
            leadGenerated: true
        };
    }

    // 📊 RISPOSTA STANDARD
    getStandardResponse(userMessage) {
        // Analizza il messaggio per dare risposta appropriata dal database
        return {
            message: `Ciao! Sono qui per aiutarti su benessere, motivazione e allenamento 💪

Puoi chiedermi:
• "Dammi un workout da casa"  
• "Consigli per l'alimentazione"
• "Ho bisogno di motivazione"

Cosa ti serve oggi? 😊`,
            action: 'standard_response',
            userData: this.userData
        };
    }

    // 📈 ANALYTICS e TRACKING
    getAnalytics() {
        return {
            sessionId: this.userData.sessionId,
            stage: this.userData.conversationStage,
            interactionCount: this.userData.interactionCount,
            valueProvided: this.userData.valueGiven,
            interestLevel: this.userData.interestLevel,
            leadData: {
                hasName: this.userData.hasName,
                hasGoal: this.userData.hasGoal, 
                hasPhone: this.userData.hasPhone,
                name: this.userData.name,
                goal: this.userData.goal,
                phone: this.userData.phone
            },
            conversionFunnel: {
                initial: true,
                engaged: this.userData.hasName,
                qualified: this.userData.hasName && this.userData.hasGoal,
                converted: this.userData.hasPhone
            }
        };
    }

    // 🔄 FOLLOW-UP AUTOMATICO
    generateFollowUp() {
        const daysSinceLastInteraction = 
            (Date.now() - this.userData.lastInteraction) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastInteraction >= 3 && !this.userData.hasPhone) {
            const userName = this.userData.name ? ` ${this.userData.name}` : '';
            
            return {
                message: `👋 Ciao${userName}! È da qualche giorno che non ci sentiamo.

Come stanno andando:
• Gli allenamenti che ti ho consigliato?
• L'alimentazione?
• La motivazione?

💪 Se hai bisogno di nuovi esercizi o supporto, sono sempre qui!

🔥 NOVITÀ: Ho preparato un programma specifico per persone motivate come te.
Interessato a saperne di più? 😊`,
                action: 'follow_up',
                userData: this.userData
            };
        }
        
        return null;
    }

    // 💾 SALVA/CARICA STATO
    exportUserData() {
        return JSON.stringify(this.userData);
    }

    importUserData(jsonData) {
        try {
            this.userData = JSON.parse(jsonData);
            return true;
        } catch (error) {
            console.error('Errore import dati:', error);
            return false;
        }
    }
}

// 🚀 ESEMPIO DI UTILIZZO
const collector = new FluentDataCollector();

// Simulazione conversazione
function simulateConversation() {
    console.log('=== SIMULAZIONE CONVERSAZIONE ===\n');
    
    const messages = [
        "Ciao, ho bisogno di un allenamento da casa",
        "Grazie! L'ho provato, molto utile",
        "Marco",
        "Voglio perdere peso",
        "347 888 1515"
    ];
    
    messages.forEach((msg, index) => {
        console.log(`USER: ${msg}`);
        const response = collector.processMessage(msg);
        console.log(`BOT: ${response.message}\n`);
        console.log(`[Analytics: ${response.action}]\n`);
        
        if (index === messages.length - 1) {
            console.log('=== DATI FINALI RACCOLTI ===');
            console.log(JSON.stringify(collector.getAnalytics(), null, 2));
        }
    });
}

// Esegui simulazione (decommenta per testare)
// simulateConversation();

// 📤 EXPORT per integrazione
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FluentDataCollector;
}