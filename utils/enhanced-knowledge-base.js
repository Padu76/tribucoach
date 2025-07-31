// 🧠 KNOWLEDGE BASE POTENZIATO - TRIBUCOACH
// Sistema intelligente per risposte specifiche e contestuali

class EnhancedKnowledgeBase {
    constructor() {
        this.initializeKnowledgeBase();
        this.initializeWorkouts();
        this.initializeMotivationalContent();
        this.initializeProfilingSystem();
    }

    initializeKnowledgeBase() {
        // 🏋️ ALLENAMENTO - Q&A dal database originale
        this.allenamentoQA = [
            {
                keywords: ['durata', 'quanto', 'tempo', 'minuti', 'ore'],
                question: "Quanto deve durare un allenamento efficace?",
                answer: "Bastano anche 30 minuti se fatti bene. L'importante è l'intensità e la costanza. Meglio poco ma spesso che tanto e una volta ogni tanto."
            },
            {
                keywords: ['mattina', 'sera', 'orario', 'quando'],
                question: "Meglio allenarsi la mattina o la sera?",
                answer: "Quello che conta è che tu lo faccia. Se puoi scegliere, allenarsi al mattina ti dà energia per tutta la giornata. Ma anche dopo il lavoro va benissimo."
            },
            {
                keywords: ['risultati', 'progressi', 'non vedo', 'sbaglio'],
                question: "Mi alleno ma non vedo risultati. Cosa sbaglio?",
                answer: "I risultati non si vedono subito. Se ti alleni bene, mangi pulito e dormi, i cambiamenti arrivano. A volte serve solo tempo e coerenza."
            },
            {
                keywords: ['palestra', 'casa', 'dove', 'serve'],
                question: "Serve davvero andare in palestra o basta casa?",
                answer: "Puoi allenarti ovunque. Se hai voglia e metodo, anche a casa con il corpo libero fai progressi reali."
            },
            {
                keywords: ['sudare', 'sudore', 'fradicio'],
                question: "Quanto devo sudare per dire che mi sono allenato bene?",
                answer: "Il sudore non è una misura del risultato. Conta la qualità dell'allenamento, non quanto sei fradicio alla fine."
            },
            {
                keywords: ['camminare', 'passi', 'passeggiata'],
                question: "È utile camminare anche se faccio palestra?",
                answer: "Camminare è oro. Aiuta il recupero, brucia grassi, migliora l'umore. Fallo ogni giorno, anche se ti alleni già."
            },
            {
                keywords: ['cambiare', 'variare', 'routine'],
                question: "Devo cambiare allenamento ogni settimana?",
                answer: "No. Serve continuità. Cambia solo quando il corpo si adatta troppo e non cresci più. Fino ad allora, martella su quello che funziona."
            }
        ];

        // 🥗 ALIMENTAZIONE - Q&A dal database
        this.alimentazioneQA = [
            {
                keywords: ['pasti', 'frequenza', 'quanti'],
                question: "Meglio tanti pasti piccoli o pochi grandi?",
                answer: "Conta il totale della giornata. Se mangi bene e stai dentro i tuoi fabbisogni, puoi scegliere il formato che preferisci."
            },
            {
                keywords: ['cucinare', 'cucina', 'non so'],
                question: "Si può mangiare bene senza cucinare?",
                answer: "Certo! Basta scegliere cibi semplici e bilanciati. Uova, tonno, frutta, pane integrale... non serve essere chef per mangiare sano."
            },
            {
                keywords: ['digiuno', 'intermittente', 'saltare'],
                question: "Che ne pensi dei digiuni intermittenti?",
                answer: "Funzionano se fatti con criterio. Ma non sono magici. L'importante è cosa mangi nel lungo periodo, non solo quando digerisci."
            },
            {
                keywords: ['pesare', 'bilancia', 'grammi'],
                question: "Serve pesare tutto per stare in forma?",
                answer: "Solo se hai obiettivi molto precisi. In generale, basta educare l'occhio e usare il buon senso. No stress, no bilancina 24/7."
            },
            {
                keywords: ['pizza', 'sgarro', 'cheat'],
                question: "Posso mangiare la pizza?",
                answer: "Ovviamente sì! Il segreto è la frequenza, non la demonizzazione. Mangia, goditela e torna in carreggiata il giorno dopo."
            },
            {
                keywords: ['costo', 'spesa', 'soldi', 'caro'],
                question: "Mangiare sano costa troppo?",
                answer: "Non è vero. Comprare base, cucinare semplice e ridurre sprechi ti fa risparmiare. Mangiare male costa di più... in salute e soldi."
            },
            {
                keywords: ['sera', 'cena', 'appesantire'],
                question: "Cosa posso mangiare la sera senza appesantirmi?",
                answer: "Un piatto di proteine leggere (uova, pesce, pollo) con verdure e magari una fetta di pane integrale. Leggero ma completo."
            }
        ];

        // 🔥 MOTIVAZIONE - Q&A dal database
        this.motivazioneQA = [
            {
                keywords: ['iniziare', 'cominciare', 'voglia'],
                question: "Come trovo la voglia di iniziare?",
                answer: "Non cercare la motivazione. Inizia. Anche con poco. L'azione genera motivazione, non il contrario."
            },
            {
                keywords: ['giù', 'male', 'sconforto', 'depresso'],
                question: "Cosa faccio quando mi sento giù e non ho voglia?",
                answer: "Muoviti lo stesso. Anche solo 5 minuti. Il movimento sblocca tutto. E alla fine ti sentirai meglio, sempre."
            },
            {
                keywords: ['costante', 'costanza', 'continuare'],
                question: "Come faccio a restare costante?",
                answer: "Non puntare alla perfezione. Punta alla continuità. Anche se salti un giorno, non mollare tutto. Riprendi e vai avanti."
            },
            {
                keywords: ['perso', 'slancio', 'ripartire'],
                question: "Ho perso slancio, come riparto?",
                answer: "Fai un mini piano da 3 giorni. Obiettivi piccoli, chiari. Ritrovi ritmo, fiducia e voglia. Funziona sempre."
            },
            {
                keywords: ['calo', 'momenti', 'normale'],
                question: "È normale avere momenti di calo?",
                answer: "Certo. Tutti li abbiamo. L'importante è non farti fermare. Accetta il momento e riparti appena puoi. Resilienza prima di tutto."
            },
            {
                keywords: ['confronto', 'altri', 'paragone'],
                question: "Mi confronto sempre con chi è più in forma. Sbaglio?",
                answer: "Sì. Il confronto uccide l'entusiasmo. Guarda solo te stesso ieri. Se oggi sei meglio, hai vinto."
            },
            {
                keywords: ['uguale', 'stesso', 'cambiamento'],
                question: "Mi alleno ma mi sento uguale. Ha senso continuare?",
                answer: "Il cambiamento avviene dentro prima che fuori. La forza mentale arriva prima dei muscoli. E tu stai già cambiando."
            }
        ];

        // 🎯 OBIETTIVI SPECIFICI - Nuova sezione
        this.obiettiviSpecifici = {
            dimagrimento: {
                keywords: ['dimagrire', 'perdere peso', 'grasso', 'dieta'],
                content: {
                    allenamento: "Per dimagrire: combina cardio (3x settimana) + pesi (2x settimana). Il muscle building accelera il metabolismo!",
                    alimentazione: "Deficit calorico moderato: -300/500 cal al giorno. Proteine alte (1.6g/kg), riduci carboidrati semplici.",
                    timing: "Risultati visibili in 4-6 settimane con costanza. Non farti scoraggiare dalle prime 2 settimane!"
                }
            },
            massa: {
                keywords: ['massa', 'muscoli', 'grosso', 'volume'],
                content: {
                    allenamento: "Focus sui pesi: 4x settimana, carichi progressivi, 8-12 rep per ipertrofia. Compound movements prioritari.",
                    alimentazione: "Surplus calorico: +300/500 cal. Proteine 2g/kg, carboidrati attorno all'allenamento.",
                    timing: "Prime settimane: forza. Massa visibile da settimana 6-8. Serve pazienza e costanza!"
                }
            },
            definizione: {
                keywords: ['definire', 'asciugare', 'addominali', 'tono'],
                content: {
                    allenamento: "Pesi + cardio HIIT. Mantieni la massa con pesi, brucia grasso con intensità.",
                    alimentazione: "Deficit leggero, proteine ALTE (2g/kg), ciclizza i carbo nei giorni di allenamento.",
                    timing: "La definizione si vede nelle ultime 4 settimane. Non mollare quando sembra che non succeda nulla!"
                }
            }
        };

        // ⏰ GESTIONE TEMPO - Nuova sezione
        this.gestioneTempo = {
            '10min': {
                title: "💥 WORKOUT LAMPO - 10 MINUTI",
                content: `🔥 3 giri di:
• 20 Squat
• 10 Flessioni (anche sulle ginocchia)
• 30 sec Plank
• 15 Jumping Jack

⏱️ Riposo 30 sec tra i giri
Questo è tutto! Semplice, veloce, efficace.`
            },
            '15min': {
                title: "🏠 WORKOUT CASA - 15 MINUTI",
                content: `💥 Fai 3 giri di:
• 15 Squat
• 10 Flessioni
• 20 sec Plank
• 10 Burpees modificati
• 15 Affondi alternati

⏱️ Riposo 1 min tra i giri
Intenso ma breve! Perfetto per chi ha poco tempo.`
            },
            '30min': {
                title: "🏠 WORKOUT CASA - 30 MINUTI",
                content: `🔥 ROUND 1 (10 min) - Forza:
• 4 serie da 12 Squat + 8 Flessioni
• Riposo 30 sec tra serie

🔥 ROUND 2 (10 min) - Cardio:
• 8 Burpees + 20 Jumping Jack + 30 sec Mountain Climber
• Ripeti 4 volte

🔥 ROUND 3 (10 min) - Core:
• 45 sec Plank + 15 Crunches + 10 Russian Twist
• Ripeti 3 volte`
            },
            'palestra': {
                title: "🏋️ WORKOUT PALESTRA - TOTAL BODY",
                content: `💪 PARTE 1 - Gambe (15 min):
• Squat con bilanciere: 4x8-10
• Leg Press: 3x12
• Affondi con manubri: 3x10 per gamba

🔥 PARTE 2 - Busto (15 min):
• Panca piana: 4x8-10
• Lat Machine: 3x10
• Shoulder Press: 3x10

⚡ PARTE 3 - Cardio finale (10 min):
• 5 min tapis roulant intensità moderata
• 5 min cyclette o ellittica`
            }
        };

        // 🏥 PROBLEMI COMUNI - Nuova sezione
        this.problemiComuni = {
            'mal di schiena': {
                keywords: ['schiena', 'lombare', 'dolore schiena'],
                content: "Per il mal di schiena: rinforza il core (plank, bird dog), stretching psoas, evita carichi eccessivi. Se persiste, consulta un fisioterapista."
            },
            'ginocchia': {
                keywords: ['ginocchio', 'ginocchia', 'dolore ginocchio'],
                content: "Ginocchia delicate: evita squat profondi, rinforza quadricipiti, lavora sulla mobilità caviglie. Preferisci leg press a squat libero inizialmente."
            },
            'spalle': {
                keywords: ['spalla', 'spalle', 'dolore spalla'],
                content: "Problemi alle spalle: focus su mobilità (stretching pettorali), rinforza extrarotatori, evita lanci sopra la testa finché non migliori."
            },
            'poco tempo': {
                keywords: ['tempo', 'fretta', 'veloce', 'rapido'],
                content: "Poco tempo? HIIT 15-20 min, 3x settimana. Compound movements (squat, deadlift, push-up). Qualità > quantità sempre!"
            }
        };

        // 📱 TECNOLOGIA - Nuova sezione
        this.tecnologia = {
            'app allenamento': {
                keywords: ['app', 'applicazione', 'smartphone'],
                content: "App consigliate: MyFitnessPal (alimentazione), Freeletics (workout), Strava (corsa), Seven (7 min workout). Ma ricorda: l'app migliore è la costanza!"
            },
            'tracker': {
                keywords: ['tracker', 'smartwatch', 'passi'],
                content: "Tracker utili per motivazione e dati. Focus su: passi (10k obiettivo), battito cardiaco, sonno. Non ossessionarti coi numeri, ascolta il corpo!"
            },
            'youtube': {
                keywords: ['video', 'youtube', 'tutorial'],
                content: "YouTube ottimo per imparare. Cerca canali certificati, segui sempre la forma corretta. Mai sacrificare tecnica per seguire video troppo intensi!"
            }
        };

        // 💪 CONSIGLI FITNESS dal database
        this.consiglifitness = [
            "Allenati almeno 3 volte a settimana, ma resta attivo ogni giorno.",
            "La costanza batte l'intensità. Meglio 20 min al giorno che 2 ore una volta.",
            "Se non riesci ad andare in palestra, fai 3 esercizi a corpo libero.",
            "Punta prima alla tecnica, poi al carico.",
            "Inizia l'allenamento con ciò che ti piace: crea routine positive.",
            "Cammina dopo i pasti: aiuta digestione e glicemia.",
            "Riscaldamento e mobilità valgono tanto quanto l'allenamento.",
            "Stretching breve ogni sera: migliora recupero e qualità del sonno.",
            "Se salti un giorno, non punirti. Riprendi e basta.",
            "Il riposo è parte dell'allenamento. Dormi bene."
        ];

        // 🥦 CONSIGLI ALIMENTARI dal database
        this.consigliAlimentari = [
            "Mangia cibi il più possibile \"non etichettati\": semplici, veri, freschi.",
            "Ogni pasto dovrebbe contenere proteine, fibre e grassi buoni.",
            "Evita zuccheri liquidi: succhi, bibite, energy drink.",
            "Fai colazione con proteine e grassi, non solo zuccheri.",
            "Pasti semplici e ripetibili: meglio sano che perfetto.",
            "Evita di arrivare affamato: prepara spuntini strategici.",
            "Bevi almeno 2 litri di acqua al giorno (o di più se ti alleni).",
            "Se mangi fuori, punta su piatti bilanciati: carne + verdure + patate.",
            "Leggi sempre le etichette: meno ingredienti, meglio è.",
            "Nessun cibo è proibito. Ma tutto va dosato."
        ];

        // 📢 FRASI MOTIVAZIONALI dal database
        this.frasiMotivazionali = [
            "Non aspettare la motivazione. Inizia. Lei ti raggiungerà.",
            "Ogni allenamento è un passo in più verso la tua versione migliore.",
            "La stanchezza non è fisica. È mentale. Allenati e riaccendi l'energia.",
            "Smettila di cercare scuse. Cerca risultati.",
            "Mangiare bene non è sacrificio. È rispetto per il tuo futuro.",
            "Se vuoi cambiare corpo, cambia prima le abitudini.",
            "Ti alleni per avere più tempo, più energia, più vita.",
            "Il miglior investimento è su te stesso: salute, forza, lucidità.",
            "Anche un allenamento corto è meglio di nessuno. Muoviti.",
            "Nessuno si pente mai di essersi allenato. Fallo."
        ];
    }

    // 🧠 SISTEMA DI RICERCA INTELLIGENTE
    findBestMatch(userMessage, categories = ['all']) {
        const message = userMessage.toLowerCase();
        let bestMatch = null;
        let maxScore = 0;

        // Funzione per calcolare score di match
        const calculateScore = (keywords, content) => {
            let score = 0;
            keywords.forEach(keyword => {
                if (message.includes(keyword.toLowerCase())) {
                    score += keyword.length; // Parole più lunghe = match più specifico
                }
            });
            return score;
        };

        // Cerca in tutte le categorie se non specificato
        if (categories.includes('all') || categories.includes('allenamento')) {
            this.allenamentoQA.forEach(item => {
                const score = calculateScore(item.keywords, item.answer);
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = {
                        type: 'allenamento',
                        content: item.answer,
                        confidence: score
                    };
                }
            });
        }

        if (categories.includes('all') || categories.includes('alimentazione')) {
            this.alimentazioneQA.forEach(item => {
                const score = calculateScore(item.keywords, item.answer);
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = {
                        type: 'alimentazione', 
                        content: item.answer,
                        confidence: score
                    };
                }
            });
        }

        if (categories.includes('all') || categories.includes('motivazione')) {
            this.motivazioneQA.forEach(item => {
                const score = calculateScore(item.keywords, item.answer);
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = {
                        type: 'motivazione',
                        content: item.answer,
                        confidence: score
                    };
                }
            });
        }

        return bestMatch;
    }

    // 🎯 IDENTIFICA OBIETTIVO SPECIFICO
    identifyGoal(userMessage) {
        const message = userMessage.toLowerCase();
        
        for (const [goal, data] of Object.entries(this.obiettiviSpecifici)) {
            const score = data.keywords.reduce((acc, keyword) => {
                return acc + (message.includes(keyword) ? keyword.length : 0);
            }, 0);
            
            if (score > 0) {
                return {
                    goal: goal,
                    data: data.content,
                    confidence: score
                };
            }
        }
        return null;
    }

    // ⏰ IDENTIFICA TEMPO DISPONIBILE
    identifyTimeAvailable(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('10') || message.includes('dieci') || message.includes('veloce') || message.includes('rapido')) {
            return this.gestioneTempo['10min'];
        }
        if (message.includes('15') || message.includes('quindici')) {
            return this.gestioneTempo['15min'];
        }
        if (message.includes('30') || message.includes('trenta') || message.includes('mezz')) {
            return this.gestioneTempo['30min'];
        }
        if (message.includes('palestra') || message.includes('attrezzi')) {
            return this.gestioneTempo['palestra'];
        }
        
        // Default per richieste generiche di allenamento
        return this.gestioneTempo['15min'];
    }

    // 🏥 IDENTIFICA PROBLEMI FISICI
    identifyPhysicalIssue(userMessage) {
        const message = userMessage.toLowerCase();
        
        for (const [issue, data] of Object.entries(this.problemiComuni)) {
            const score = data.keywords.reduce((acc, keyword) => {
                return acc + (message.includes(keyword) ? 1 : 0);
            }, 0);
            
            if (score > 0) {
                return {
                    issue: issue,
                    advice: data.content,
                    confidence: score
                };
            }
        }
        return null;
    }

    // 📱 IDENTIFICA RICHIESTE TECNOLOGIA
    identifyTechRequest(userMessage) {
        const message = userMessage.toLowerCase();
        
        for (const [tech, data] of Object.entries(this.tecnologia)) {
            const score = data.keywords.reduce((acc, keyword) => {
                return acc + (message.includes(keyword) ? 1 : 0);
            }, 0);
            
            if (score > 0) {
                return {
                    type: tech,
                    content: data.content,
                    confidence: score
                };
            }
        }
        return null;
    }

    // 🎲 CONTENUTO RANDOM
    getRandomMotivation() {
        const random = Math.floor(Math.random() * this.frasiMotivazionali.length);
        return this.frasiMotivazionali[random];
    }

    getRandomFitnessTip() {
        const random = Math.floor(Math.random() * this.consiglifitness.length);
        return this.consiglifitness[random];
    }

    getRandomNutritionTip() {
        const random = Math.floor(Math.random() * this.consigliAlimentari.length);
        return this.consigliAlimentari[random];
    }

    // 🎯 FUNZIONE PRINCIPALE - GENERA RISPOSTA INTELLIGENTE
    generateSmartResponse(userMessage, userProfile = null) {
        const message = userMessage.toLowerCase();
        
        console.log('🧠 Analizzando messaggio:', message);

        // 1. Controlla richieste di workout specifico
        if (message.includes('workout') || message.includes('allenamento') || 
            message.includes('esercizi') || message.includes('allenarmi')) {
            
            const timeMatch = this.identifyTimeAvailable(userMessage);
            const physicalIssue = this.identifyPhysicalIssue(userMessage);
            
            let response = timeMatch.title + '\n\n' + timeMatch.content;
            
            if (physicalIssue) {
                response += '\n\n⚠️ ATTENZIONE: ' + physicalIssue.advice;
            }
            
            return {
                type: 'workout',
                content: response,
                confidence: 'high'
            };
        }

        // 2. Controlla richieste obiettivi specifici
        const goalMatch = this.identifyGoal(userMessage);
        if (goalMatch && goalMatch.confidence > 5) {
            return {
                type: 'goal_specific',
                content: `🎯 PERFETTO! Per ${goalMatch.goal.toUpperCase()}:\n\n🏋️ **ALLENAMENTO:** ${goalMatch.data.allenamento}\n\n🥗 **ALIMENTAZIONE:** ${goalMatch.data.alimentazione}\n\n⏰ **TIMING:** ${goalMatch.data.timing}`,
                confidence: 'high'
            };
        }

        // 3. Controlla richieste tecnologia
        const techMatch = this.identifyTechRequest(userMessage);
        if (techMatch && techMatch.confidence > 0) {
            return {
                type: 'technology',
                content: `📱 ${techMatch.content}`,
                confidence: 'high'
            };
        }

        // 4. Controlla problemi fisici specifici
        const physicalMatch = this.identifyPhysicalIssue(userMessage);
        if (physicalMatch && physicalMatch.confidence > 0) {
            return {
                type: 'physical_issue',
                content: `🏥 **${physicalMatch.issue.toUpperCase()}**\n\n${physicalMatch.advice}`,
                confidence: 'high'
            };
        }

        // 5. Cerca match generale nel database Q&A
        const generalMatch = this.findBestMatch(userMessage);
        if (generalMatch && generalMatch.confidence > 3) {
            let response = generalMatch.content;
            
            // Aggiungi contenuto extra basato sul tipo
            if (generalMatch.type === 'motivazione') {
                response += '\n\n💪 ' + this.getRandomMotivation();
            } else if (generalMatch.type === 'allenamento') {
                response += '\n\n🏋️ TIP: ' + this.getRandomFitnessTip();
            } else if (generalMatch.type === 'alimentazione') {
                response += '\n\n🥗 TIP: ' + this.getRandomNutritionTip();
            }
            
            return {
                type: generalMatch.type,
                content: response,
                confidence: 'medium'
            };
        }

        // 6. Contenuto motivazionale random per richieste vaghe
        if (message.includes('motivazione') || message.includes('aiuto') || 
            message.includes('supporto') || message.includes('incoraggiamento')) {
            return {
                type: 'motivation',
                content: `🔥 ${this.getRandomMotivation()}\n\n💪 Ricorda: ogni piccolo passo conta. Anche oggi puoi fare qualcosa per il tuo benessere!`,
                confidence: 'medium'
            };
        }

        // 7. Risposta di fallback
        return null; // Lascia che il sistema fluido o il backend gestiscano
    }

    // 📊 ANALYTICS
    getKnowledgeBaseStats() {
        return {
            totalQA: this.allenamentoQA.length + this.alimentazioneQA.length + this.motivazioneQA.length,
            categories: {
                allenamento: this.allenamentoQA.length,
                alimentazione: this.alimentazioneQA.length,
                motivazione: this.motivazioneQA.length,
                obiettivi: Object.keys(this.obiettiviSpecifici).length,
                workout: Object.keys(this.gestioneTempo).length,
                problemi: Object.keys(this.problemiComuni).length,
                tecnologia: Object.keys(this.tecnologia).length
            },
            tips: {
                fitness: this.consiglifitness.length,
                nutrition: this.consigliAlimentari.length,
                motivation: this.frasiMotivazionali.length
            }
        };
    }

    initializeWorkouts() {
        // Già implementato in gestioneTempo
    }

    initializeMotivationalContent() {
        // Già implementato in frasiMotivazionali
    }

    initializeProfilingSystem() {
        // Implementato nella prossima versione
    }
}

// 🚀 SISTEMA DI PROFILING AVANZATO (Punto 3)
class AdvancedProfilingSystem {
    constructor() {
        this.userProfiles = new Map();
        this.profileCategories = this.initializeProfileCategories();
    }

    initializeProfileCategories() {
        return {
            'nuovo_esploratore': {
                characteristics: ['principiante', 'inizio', 'primo', 'mai fatto', 'nuovo'],
                preferences: {
                    workoutDuration: '10-15min',
                    intensity: 'bassa',
                    equipment: 'corpo_libero',
                    goals: 'abitudine'
                },
                customContent: {
                    motivation: "Perfetto! Ogni esperto è stato principiante. Il primo passo è sempre il più importante!",
                    tips: "Inizia con poco: 2-3 volte a settimana, 15 minuti massimo. La costanza batte l'intensità."
                }
            },
            'guerriero_in_crescita': {
                characteristics: ['intermedio', 'qualche mese', 'migliorare', 'crescere'],
                preferences: {
                    workoutDuration: '20-30min',
                    intensity: 'media',
                    equipment: 'misto',
                    goals: 'progressione'
                },
                customContent: {
                    motivation: "Grande! Sei nella fase più bella: hai le basi e vuoi crescere. È il momento di spingere!",
                    tips: "Ora puoi aumentare intensità e varietà. Traccia i progressi e sfida te stesso ogni settimana."
                }
            },
            'atleta_motivato': {
                characteristics: ['avanzato', 'esperto', 'anni', 'competizione', 'performance'],
                preferences: {
                    workoutDuration: '45-60min',
                    intensity: 'alta',
                    equipment: 'completo',
                    goals: 'performance'
                },
                customContent: {
                    motivation: "Wow! Sei un vero atleta. Il tuo approccio disciplinato è ispirazione per tutti!",
                    tips: "Focus su periodizzazione, recupero ottimale e dettagli tecnici. La perfezione è nei particolari."
                }
            }
        };
    }

    // Analizza messaggio e determina profilo
    analyzeUserProfile(userMessage, conversationHistory = []) {
        const message = userMessage.toLowerCase();
        let profileScores = {};

        // Inizializza scores
        Object.keys(this.profileCategories).forEach(profile => {
            profileScores[profile] = 0;
        });

        // Analizza keywords del messaggio attuale
        Object.entries(this.profileCategories).forEach(([profile, data]) => {
            data.characteristics.forEach(char => {
                if (message.includes(char)) {
                    profileScores[profile] += 2;
                }
            });
        });

        // Analizza storico conversazione per pattern
        conversationHistory.forEach(msg => {
            if (msg.role === 'user') {
                const msgLower = msg.content.toLowerCase();
                
                // Pattern principiante
                if (msgLower.includes('non so') || msgLower.includes('come si fa') || 
                    msgLower.includes('primo') || msgLower.includes('inizio')) {
                    profileScores['nuovo_esploratore'] += 1;
                }
                
                // Pattern intermedio
                if (msgLower.includes('migliorare') || msgLower.includes('prossimo livello') ||
                    msgLower.includes('progressi')) {
                    profileScores['guerriero_in_crescita'] += 1;
                }
                
                // Pattern avanzato
                if (msgLower.includes('tecnica') || msgLower.includes('programma') ||
                    msgLower.includes('periodizzazione') || msgLower.includes('performance')) {
                    profileScores['atleta_motivato'] += 1;
                }
            }
        });

        // Determina profilo con score più alto
        const bestProfile = Object.entries(profileScores).reduce((a, b) => 
            profileScores[a[0]] > profileScores[b[0]] ? a : b
        )[0];

        return {
            profile: bestProfile,
            confidence: profileScores[bestProfile],
            allScores: profileScores,
            preferences: this.profileCategories[bestProfile].preferences,
            customContent: this.profileCategories[bestProfile].customContent
        };
    }

    // Personalizza contenuto basato su profilo
    personalizeContent(content, userProfile) {
        if (!userProfile || !userProfile.profile) return content;

        const profile = this.profileCategories[userProfile.profile];
        
        // Aggiungi consigli personalizzati
        let personalizedContent = content;
        
        if (content.includes('workout') || content.includes('allenamento')) {
            personalizedContent += `\n\n🎯 **Per il tuo livello (${userProfile.profile.replace('_', ' ')}):**\n${profile.customContent.tips}`;
        }
        
        if (content.includes('motivazione') || userProfile.confidence < 2) {
            personalizedContent += `\n\n💪 ${profile.customContent.motivation}`;
        }

        return personalizedContent;
    }

    // Salva profilo utente
    saveUserProfile(sessionId, profileData) {
        this.userProfiles.set(sessionId, {
            ...profileData,
            lastUpdate: new Date(),
            interactionCount: (this.userProfiles.get(sessionId)?.interactionCount || 0) + 1
        });
    }

    // Recupera profilo utente
    getUserProfile(sessionId) {
        return this.userProfiles.get(sessionId) || null;
    }
}

// 🚀 SISTEMA UPSELLING NATURALE (Punto 4)
class NaturalUpselling {
    constructor() {
        this.engagementThresholds = {
            interested: 3, // 3+ interazioni positive
            engaged: 5,    // 5+ interazioni + ha fatto workout
            qualified: 7   // 7+ interazioni + interesse servizi
        };
        this.userEngagement = new Map();
    }

    // Traccia engagement utente
    trackEngagement(sessionId, action, content) {
        if (!this.userEngagement.has(sessionId)) {
            this.userEngagement.set(sessionId, {
                interactions: 0,
                positiveResponses: 0,
                workoutRequests: 0,
                serviceInterest: 0,
                lastInteraction: new Date(),
                actions: []
            });
        }

        const engagement = this.userEngagement.get(sessionId);
        engagement.interactions++;
        engagement.lastInteraction = new Date();
        engagement.actions.push({action, content, timestamp: new Date()});

        // Classifica azioni
        if (action === 'positive_response') engagement.positiveResponses++;
        if (action === 'workout_request') engagement.workoutRequests++;
        if (action === 'service_inquiry') engagement.serviceInterest++;

        this.userEngagement.set(sessionId, engagement);
    }

    // Determina se è il momento per upselling
    shouldShowUpselling(sessionId) {
        const engagement = this.userEngagement.get(sessionId);
        if (!engagement) return false;

        const score = engagement.positiveResponses + 
                     (engagement.workoutRequests * 2) + 
                     (engagement.serviceInterest * 3);

        return {
            ready: score >= this.engagementThresholds.interested,
            level: score >= this.engagementThresholds.qualified ? 'qualified' : 
                   score >= this.engagementThresholds.engaged ? 'engaged' : 'interested',
            score: score,
            engagement: engagement
        };
    }

    // Genera messaggio upselling personalizzato
    generateUpselling(sessionId, currentContent, userProfile = null) {
        const upsellCheck = this.shouldShowUpselling(sessionId);
        if (!upsellCheck.ready) return null;

        const engagement = upsellCheck.engagement;
        let upsellMessage = '';

        switch (upsellCheck.level) {
            case 'qualified':
                upsellMessage = `🎯 Vedo che sei davvero motivato! Con ${engagement.interactions} conversazioni e la tua dedizione, sei pronto per il passo successivo.

💪 **PERSONAL TRAINING PERSONALIZZATO:**
✅ Programmi su misura per i tuoi obiettivi
✅ Supporto diretto con me, Andrea Padoan  
✅ Risultati garantiti in 4-6 settimane

💬 Vuoi saperne di più? Scrivimi su WhatsApp: https://wa.me/3478881515`;
                break;

            case 'engaged':
                upsellMessage = `💪 Complimenti! Hai già fatto ${engagement.workoutRequests} workout con me. Sei sulla strada giusta!

🚀 Se vuoi **ACCELERARE I RISULTATI**, considera il mio coaching personalizzato:
• Programmi specifici per te
• Follow-up settimanali
• Risultati più veloci

Interessato? Chiedimi di più! 😊`;
                break;

            case 'interested':
                upsellMessage = `😊 Mi fa piacere che i miei consigli ti siano utili!

💡 **LO SAPEVI?** Oltre al coach virtuale, offro anche:
📋 Programmi personalizzati
🏋️ Personal training a Verona
📱 Follow-up costante

Vuoi saperne di più sui miei servizi? Chiedimi pure! 💪`;
                break;
        }

        return upsellMessage;
    }
}

// 📦 EXPORT per integrazione
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        EnhancedKnowledgeBase, 
        AdvancedProfilingSystem, 
        NaturalUpselling 
    };
}

// 🧪 TEST RAPIDO (uncomment per testare)
/*
console.log('🧪 TESTING ENHANCED KNOWLEDGE BASE...');

const kb = new EnhancedKnowledgeBase();
const profiling = new AdvancedProfilingSystem();
const upselling = new NaturalUpselling();

console.log('📊 Knowledge Base Stats:', kb.getKnowledgeBaseStats());

// Test ricerche
console.log('\n🔍 Test: "ho mal di schiena"');
console.log(kb.generateSmartResponse("ho mal di schiena"));

console.log('\n🔍 Test: "voglio dimagrire"');  
console.log(kb.generateSmartResponse("voglio dimagrire"));

console.log('\n🔍 Test: "allenamento 15 minuti"');
console.log(kb.generateSmartResponse("allenamento 15 minuti"));

console.log('\n🔍 Test profiling: "sono principiante"');
console.log(profiling.analyzeUserProfile("sono principiante, non ho mai fatto nulla"));

console.log('\n✅ Testing completato!');
*/