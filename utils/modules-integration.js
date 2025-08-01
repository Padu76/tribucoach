// 🔧 SCRIPT INTEGRAZIONE MODULI - Sistema AI v2.0
// Integra il Sistema AI Personalizzato nei moduli settimanali esistenti
// File: utils/modules-integration.js

// === CONFIGURAZIONE MODULI ===
const WEEKLY_MODULES_CONFIG = {
    1: {
        title: "Incontro Conoscitivo",
        focus: "Conoscenza approfondita e prime consapevolezze",
        coaching_style: "esplorativo_accogliente",
        ai_personality: "curioso_empatico",
        key_objectives: [
            "Creare connessione autentica",
            "Esplorare storia personale",
            "Identificare motivazioni profonde",
            "Definire prime consapevolezze"
        ],
        coaching_questions: {
            opening: "Ho letto tutte le tue risposte con grande attenzione. C'è qualcosa di molto autentico che emerge dalla tua storia.",
            exploration: [
                "Se tra un anno dovessi guardare indietro a questo momento, cosa vorresti essere riuscito a scoprire di te stesso?",
                "Quella forza che ti ha permesso di ottenere i tuoi successi passati, dove si trova ora?",
                "Se questa situazione che vivi fosse perfetta per insegnarti qualcosa, cosa ti starebbe insegnando?"
            ],
            closing: "Quale piccola azione puoi fare domani che onori questa nuova consapevolezza?"
        },
        homework_templates: {
            base: [
                "Rifletti 10 minuti al giorno sulle consapevolezze emerse",
                "Tieni un diario delle scoperte quotidiane"
            ],
            personalized_by_profile: {
                stressato_esaurito: [
                    "Dedica 5 minuti di respirazione profonda ogni mattina",
                    "Identifica UN momento di pausa quotidiana non negoziabile"
                ],
                procrastinatore_bloccato: [
                    "Fai UNA micro-azione verso il tuo obiettivo ogni giorno",
                    "Celebra ogni piccolo completamento"
                ],
                perfezionista_insoddisfatto: [
                    "Pratica il 'buono abbastanza' in una piccola cosa al giorno",
                    "Elenca 3 progressi quotidiani, anche piccolissimi"
                ]
                // ... continua per altri profili
            }
        }
    },
    
    2: {
        title: "Consapevolezza di Sé", 
        focus: "Esplorazione motivazioni profonde e autostima",
        coaching_style: "introspettivo_riflessivo",
        ai_personality: "profondo_intuitivo",
        key_objectives: [
            "Esplorare motivazioni autentiche",
            "Identificare credenze limitanti", 
            "Sviluppare auto-consapevolezza",
            "Lavorare sull'autostima"
        ],
        coaching_questions: {
            opening: "Dopo la settimana di riflessione, cosa è emerso di nuovo su di te?",
            exploration: [
                "Quali sono le voci nella tua testa che ti limitano di più?",
                "Se dovessi descrivere la versione migliore di te stesso, come sarebbe?",
                "Cosa ti impedisce di credere completamente in te stesso?"
            ],
            closing: "Come puoi iniziare a coltivare una relazione più amorevole con te stesso?"
        }
    }
    
    // Altri moduli seguiranno lo stesso pattern
};

// === INTEGRATORE MODULI ===
class ModulesIntegrator {
    constructor() {
        this.aiSystem = null;
        this.currentWeek = 1;
        this.userProfile = null;
        this.moduleConfig = null;
        this.isInitialized = false;
    }

    async initialize(weekNumber = 1) {
        try {
            console.log(`🔧 Inizializzazione integrazione modulo settimana ${weekNumber}...`);
            
            this.currentWeek = weekNumber;
            this.moduleConfig = WEEKLY_MODULES_CONFIG[weekNumber];
            
            if (!this.moduleConfig) {
                throw new Error(`Configurazione mancante per settimana ${weekNumber}`);
            }

            // Carica profilo utente
            await this.loadUserProfile();
            
            // Inizializza Sistema AI Integrato
            await this.initializeAISystem();
            
            // Sostituisci sistema chat esistente
            this.replaceExistingChatSystem();
            
            // Personalizza contenuti modulo
            this.personalizeModuleContent();
            
            this.isInitialized = true;
            console.log(`✅ Integrazione modulo settimana ${weekNumber} completata`);
            
            return true;
            
        } catch (error) {
            console.error('❌ Errore inizializzazione integrazione:', error);
            return false;
        }
    }

    async loadUserProfile() {
        try {
            // Carica dati quiz lifestyle
            const quizData = localStorage.getItem('lifestyleQuizResults');
            if (quizData) {
                this.userProfile = JSON.parse(quizData);
                console.log('✅ Profilo utente caricato:', this.userProfile.profileType);
            } else {
                // Profilo fallback se non disponibile
                this.userProfile = {
                    profileType: 'motivato_inconsistente',
                    name: 'Amico/a',
                    challenges: [],
                    scores: { wellbeing: 3, health: 3, professional: 3, social: 3 }
                };
                console.log('⚠️ Profilo fallback utilizzato');
            }
        } catch (error) {
            console.error('❌ Errore caricamento profilo:', error);
            // Usa profilo minimo
            this.userProfile = { profileType: 'motivato_inconsistente', name: 'Amico/a' };
        }
    }

    async initializeAISystem() {
        if (!window.IntegratedAISystem) {
            throw new Error('Sistema AI Integrato non disponibile');
        }

        if (!window.AISystemIntegrator) {
            throw new Error('AISystemIntegrator non disponibile');
        }

        const userId = localStorage.getItem('lifestyleUserId') || this.generateUserId();
        localStorage.setItem('lifestyleUserId', userId);

        // Inizializza con dati quiz se disponibili
        if (this.userProfile.profileType) {
            this.aiSystem = await window.AISystemIntegrator.initializeFromQuizData(userId, this.userProfile);
        } else {
            this.aiSystem = await window.AISystemIntegrator.initializeFromUserData(userId, this.userProfile);
        }

        // Configura per settimana corrente
        this.aiSystem.setCurrentWeek(this.currentWeek);
        
        console.log('🤖 Sistema AI inizializzato per settimana', this.currentWeek);
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    replaceExistingChatSystem() {
        // Trova e sostituisci funzioni chat esistenti
        this.replaceChatFunctions();
        
        // Aggiorna UI chat se presente
        this.updateChatInterface();
        
        // Sostituisci getCoachingResponse se presente
        if (window.getCoachingResponse) {
            window.getCoachingResponse = (message) => this.getPersonalizedCoachingResponse(message);
        }
        
        // Sostituisci sendChatMessage se presente
        if (window.sendChatMessage) {
            window.sendChatMessage = () => this.handlePersonalizedChatMessage();
        }
        
        console.log('✅ Sistema chat esistente sostituito con AI v2.0');
    }

    replaceChatFunctions() {
        // Override della funzione sendChatMessage globale
        const originalSendChatMessage = window.sendChatMessage;
        
        window.sendChatMessage = async () => {
            const input = document.getElementById('chatInput');
            if (!input) return;
            
            const message = input.value.trim();
            if (!message) return;
            
            // Aggiungi messaggio utente alla UI
            this.addMessageToUI(message, 'user');
            input.value = '';
            
            try {
                // Usa Sistema AI Integrato v2.0
                const response = await this.aiSystem.sendMessage(message);
                
                if (response.success) {
                    setTimeout(() => {
                        this.addMessageToUI(response.response, 'coach');
                        this.logPersonalizationInfo(response);
                    }, 1500);
                } else {
                    throw new Error(response.error || 'Errore risposta AI');
                }
                
            } catch (error) {
                console.error('❌ Errore chat personalizzata:', error);
                setTimeout(() => {
                    this.addMessageToUI(this.getFallbackResponse(message), 'coach');
                }, 1000);
            }
        };
        
        // Override generateFirstCoachingQuestion se presente
        if (window.generateFirstCoachingQuestion) {
            window.generateFirstCoachingQuestion = () => this.generatePersonalizedOpeningQuestion();
        }
    }

    async getPersonalizedCoachingResponse(userMessage) {
        if (!this.aiSystem) {
            return this.getFallbackResponse(userMessage);
        }

        try {
            const response = await this.aiSystem.sendMessage(userMessage);
            
            if (response.success) {
                this.logPersonalizationInfo(response);
                return response.response;
            } else {
                throw new Error(response.error);
            }
            
        } catch (error) {
            console.error('❌ Errore risposta personalizzata:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    async handlePersonalizedChatMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Aggiungi alla UI
        this.addMessageToUI(message, 'user');
        input.value = '';
        
        // Ottieni risposta personalizzata
        const response = await this.getPersonalizedCoachingResponse(message);
        
        setTimeout(() => {
            this.addMessageToUI(response, 'coach');
        }, 1500);
    }

    addMessageToUI(content, sender) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const now = new Date();
        const time = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${time}</div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    updateChatInterface() {
        // Aggiorna indicatori stato chat per mostrare personalizzazione
        const statusElement = document.querySelector('.chat-status span');
        if (statusElement) {
            const profileName = window.LIFESTYLE_PROFILES_CONFIG[this.userProfile.profileType]?.name || 'Utente';
            statusElement.textContent = `Andrea è pronto per il coaching personalizzato (Profilo: ${profileName})`;
        }
        
        // Aggiorna placeholder input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            const placeholders = {
                stressato_esaurito: "Prenditi tutto il tempo che serve per rispondere, non c'è fretta...",
                procrastinatore_bloccato: "Dimmi quello che ti viene in mente, anche se non è perfetto...",
                perfezionista_insoddisfatto: "Non serve la risposta perfetta, dimmi quello che senti...",
                dispersivo_confuso: "Concentrati su UN pensiero e condividilo con me...",
                motivato_inconsistente: "Condividi con me quello che provi in questo momento...",
                equilibrato_ottimizzatore: "Dimmi come vedi la situazione dal tuo punto di vista..."
            };
            
            chatInput.placeholder = placeholders[this.userProfile.profileType] || 
                                   "Condividi i tuoi pensieri con Andrea...";
        }
    }

    generatePersonalizedOpeningQuestion() {
        if (!this.moduleConfig || !this.userProfile) {
            return this.getGenericOpeningQuestion();
        }

        const config = this.moduleConfig;
        const profile = this.userProfile;
        
        // Costruisci domanda di apertura personalizzata
        let openingQuestion = config.coaching_questions.opening;
        
        // Personalizza per profilo
        const profileConfig = window.LIFESTYLE_PROFILES_CONFIG[profile.profileType];
        if (profileConfig) {
            openingQuestion += ` Vedo che il tuo profilo è "${profileConfig.name}" e questo mi dice molto su di te.`;
        }
        
        // Aggiungi riferimento ai dati del quiz se disponibili
        if (profile.challenges && profile.challenges.length > 0) {
            openingQuestion += ` So che le tue sfide principali sono: ${profile.challenges.join(', ')}.`;
        }
        
        // Aggiungi domanda esplorativa personalizzata
        const explorationQuestions = config.coaching_questions.exploration;
        const selectedQuestion = explorationQuestions[Math.floor(Math.random() * explorationQuestions.length)];
        
        openingQuestion += `\n\n${selectedQuestion}`;
        
        // Aggiungi messaggio alla UI
        this.addMessageToUI(openingQuestion, 'coach');
        
        return openingQuestion;
    }

    getGenericOpeningQuestion() {
        return "Ciao! Sono molto felice di iniziare questo percorso di coaching con te. Dimmi, cosa ti ha portato fin qui oggi?";
    }

    personalizeModuleContent() {
        // Personalizza titoli e contenuti basati sul profilo
        this.personalizeWelcomeSection();
        this.personalizeCoachingIntro();
        this.personalizeHomework();
        
        console.log('✅ Contenuti modulo personalizzati per profilo:', this.userProfile.profileType);
    }

    personalizeWelcomeSection() {
        const welcomeSection = document.querySelector('.welcome-section');
        if (!welcomeSection) return;
        
        const welcomeTitle = welcomeSection.querySelector('.welcome-title');
        const welcomeSubtitle = welcomeSection.querySelector('.welcome-subtitle');
        
        if (welcomeTitle && this.userProfile.name) {
            welcomeTitle.textContent = `Benvenuto/a ${this.userProfile.name} nella Tua Prima Sessione! 🎉`;
        }
        
        if (welcomeSubtitle) {
            const profileName = window.LIFESTYLE_PROFILES_CONFIG[this.userProfile.profileType]?.name || 'Il Tuo Profilo';
            welcomeSubtitle.textContent = `${this.moduleConfig.title} - Personalizzato per ${profileName}`;
        }
    }

    personalizeCoachingIntro() {
        const coachingIntro = document.querySelector('.coaching-intro');
        if (!coachingIntro) return;
        
        const introParagraph = coachingIntro.querySelector('p');
        if (introParagraph) {
            const profileConfig = window.LIFESTYLE_PROFILES_CONFIG[this.userProfile.profileType];
            if (profileConfig) {
                introParagraph.innerHTML = `
                    Ho analizzato il tuo profilo <strong>"${profileConfig.name}"</strong> e le tue risposte del quiz.
                    Il mio approccio con te sarà <strong>${profileConfig.communication_style}</strong>.
                    Attraverso <strong>domande potenti personalizzate</strong> ti aiuterò a ${this.moduleConfig.focus}.
                    Non ci sono risposte giuste o sbagliate, solo la tua autentica verità.
                `;
            }
        }
    }

    personalizeHomework() {
        const homeworkList = document.getElementById('personalizedHomework');
        if (!homeworkList) return;
        
        const homework = this.generatePersonalizedHomework();
        homeworkList.innerHTML = homework.map(item => `<li>${item}</li>`).join('');
    }

    generatePersonalizedHomework() {
        const config = this.moduleConfig;
        const profile = this.userProfile.profileType;
        
        let homework = [...config.homework_templates.base];
        
        // Aggiungi compiti personalizzati per profilo
        if (config.homework_templates.personalized_by_profile[profile]) {
            homework.push(...config.homework_templates.personalized_by_profile[profile]);
        }
        
        // Aggiungi compiti basati sui punteggi del quiz
        if (this.userProfile.scores) {
            Object.entries(this.userProfile.scores).forEach(([area, score]) => {
                if (score <= 2) {
                    homework.push(`Dedica attenzione extra all'area "${area}" (punteggio basso: ${score}/5)`);
                }
            });
        }
        
        // Compiti basati sulle sfide del profilo
        if (this.userProfile.challenges) {
            this.userProfile.challenges.forEach(challenge => {
                const challengeSpecificTasks = this.getChallengeSpecificHomework(challenge);
                homework.push(...challengeSpecificTasks);
            });
        }
        
        return homework;
    }

    getChallengeSpecificHomework(challenge) {
        const challengeTasks = {
            'stress': ['Pratica 5 minuti di respirazione profonda ogni mattina'],
            'procrastination': ['Completa UNA micro-azione ogni giorno verso il tuo obiettivo'],
            'perfectionism': ['Pratica il "buono abbastanza" in una cosa piccola ogni giorno'],
            'focus': ['Dedica 15 minuti di attenzione concentrata su una sola attività'],
            'consistency': ['Crea un tracker visivo per una nuova abitudine'],
            'energy': ['Identifica e elimina UNA cosa che ti svuota ogni giorno'],
            'time': ['Pianifica la sera prima le 3 priorità del giorno dopo'],
            'balance': ['Proteggi 30 minuti al giorno per te stesso, non negoziabili']
        };
        
        return challengeTasks[challenge] || [`Lavora consapevolmente sulla sfida: ${challenge}`];
    }

    getFallbackResponse(userMessage) {
        // Fallback personalizzato per profilo
        const profileConfig = window.LIFESTYLE_PROFILES_CONFIG[this.userProfile.profileType];
        
        if (profileConfig && profileConfig.conversation_starters) {
            const starters = profileConfig.conversation_starters;
            return starters[Math.floor(Math.random() * starters.length)];
        }
        
        return "Ti ascolto con attenzione. Puoi dirmi di più su questo?";
    }

    logPersonalizationInfo(response) {
        if (response.analysis) {
            console.log('🎯 Personalizzazione attiva:', {
                profilo: this.userProfile.profileType,
                settimana: this.currentWeek,
                sentiment: response.analysis.sentiment,
                topics: response.analysis.topics,
                confidence: response.confidence
            });
        }
    }

    // === METODI DI UTILITÀ ===
    
    getPersonalizationData() {
        return {
            userProfile: this.userProfile,
            currentWeek: this.currentWeek,
            moduleConfig: this.moduleConfig,
            aiSystemStats: this.aiSystem ? this.aiSystem.getPersonalizationInsights() : null
        };
    }

    async updateUserProfile(newProfileData) {
        this.userProfile = { ...this.userProfile, ...newProfileData };
        
        if (this.aiSystem) {
            this.aiSystem.updateUserProfile(this.userProfile);
        }
        
        // Ri-personalizza contenuti
        this.personalizeModuleContent();
    }

    resetModuleSession() {
        if (this.aiSystem) {
            this.aiSystem.resetConversation();
        }
        
        // Pulisci UI chat
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) {
            chatContainer.innerHTML = '';
        }
    }

    exportSessionData() {
        return {
            moduleData: {
                week: this.currentWeek,
                config: this.moduleConfig,
                userProfile: this.userProfile
            },
            aiData: this.aiSystem ? this.aiSystem.exportConversationData() : null,
            timestamp: new Date().toISOString()
        };
    }
}

// === AUTOLOADER PER MODULI ===
class ModuleAutoLoader {
    static async loadForCurrentPage() {
        // Rileva automaticamente la settimana dalla URL o dal contenuto
        const weekNumber = ModuleAutoLoader.detectWeekNumber();
        
        if (weekNumber) {
            console.log(`🔧 Auto-loading integrazione per settimana ${weekNumber}...`);
            
            const integrator = new ModulesIntegrator();
            const success = await integrator.initialize(weekNumber);
            
            if (success) {
                // Rendi disponibile globalmente
                window.moduleIntegrator = integrator;
                console.log('✅ Integrazione auto-caricata con successo!');
                
                // Trigger evento personalizzato
                window.dispatchEvent(new CustomEvent('moduleIntegrationReady', {
                    detail: { week: weekNumber, integrator }
                }));
                
                return integrator;
            } else {
                console.error('❌ Fallimento auto-loading integrazione');
                return null;
            }
        } else {
            console.log('ℹ️ Nessuna settimana rilevata, skip auto-loading');
            return null;
        }
    }

    static detectWeekNumber() {
        // Metodo 1: URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const weekParam = urlParams.get('week');
        if (weekParam) {
            return parseInt(weekParam);
        }
        
        // Metodo 2: Nome file
        const pathname = window.location.pathname;
        const weekMatch = pathname.match(/week-(\d+)\.html/);
        if (weekMatch) {
            return parseInt(weekMatch[1]);
        }
        
        // Metodo 3: Title della pagina
        const title = document.title;
        const titleMatch = title.match(/Settimana (\d+)/);
        if (titleMatch) {
            return parseInt(titleMatch[1]);
        }
        
        // Metodo 4: Header content
        const headerContent = document.querySelector('.header .logo, h1, .week-number');
        if (headerContent) {
            const headerMatch = headerContent.textContent.match(/(\d+)/);
            if (headerMatch) {
                return parseInt(headerMatch[1]);
            }
        }
        
        return null;
    }

    static waitForDependencies() {
        return new Promise((resolve) => {
            const checkDependencies = () => {
                if (window.IntegratedAISystem && window.AISystemIntegrator && window.LIFESTYLE_PROFILES_CONFIG) {
                    resolve(true);
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }
}

// === INIZIALIZZAZIONE AUTOMATICA ===
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔧 Avvio auto-loader integrazione moduli...');
    
    try {
        // Aspetta che le dipendenze siano caricate
        await ModuleAutoLoader.waitForDependencies();
        
        // Auto-load per la pagina corrente
        const integrator = await ModuleAutoLoader.loadForCurrentPage();
        
        if (integrator) {
            console.log('🎉 Sistema AI v2.0 integrato con successo nel modulo!');
        }
        
    } catch (error) {
        console.error('❌ Errore inizializzazione auto-loader:', error);
    }
});

// === EXPORTS ===
if (typeof window !== 'undefined') {
    window.ModulesIntegrator = ModulesIntegrator;
    window.ModuleAutoLoader = ModuleAutoLoader;
    
    console.log('🔧 Script integrazione moduli caricato - Pronto per la personalizzazione AI!');
}

export { ModulesIntegrator, ModuleAutoLoader, WEEKLY_MODULES_CONFIG };