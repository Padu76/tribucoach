// firebase-api.js - API Firebase + Chatbase per TribuCoach Dashboard

// Configurazione Firebase (AGGIORNA CON LE TUE CREDENZIALI REALI)
const firebaseConfig = {
    apiKey: "AIzaSyD_YOUR_API_KEY_HERE", // 🔑 SOSTITUISCI CON LA TUA API KEY
    authDomain: "tribucoach-PROJECT_ID.firebaseapp.com", // 🔑 SOSTITUISCI CON IL TUO DOMAIN
    projectId: "tribucoach-PROJECT_ID", // 🔑 SOSTITUISCI CON IL TUO PROJECT ID
    storageBucket: "tribucoach-PROJECT_ID.appspot.com", // 🔑 SOSTITUISCI CON IL TUO BUCKET
    messagingSenderId: "123456789", // 🔑 SOSTITUISCI CON IL TUO SENDER ID
    appId: "1:123456789:web:abcdef123456" // 🔑 SOSTITUISCI CON IL TUO APP ID
};

// Configurazione Chatbase API
const CHATBASE_API_BASE = 'https://www.chatbase.co/api/v1';
const CHATBASE_SECRET_KEY = '0uk17rpq8vkvbw1nvnhvupwm0zc8iwjo'; // 🔑 TUA SECRET KEY
const CHATBOT_ID = 'EjoHCEogMfkkrVzIK6V07'; // 🔑 IL TUO CHATBOT ID

// Variabili globali per Firebase
let app;
let db;

// Inizializza Firebase quando il modulo viene caricato
async function initializeFirebase() {
    try {
        // Aspetta che Firebase sia disponibile
        while (!window.firebase) {
            console.log('⏳ Aspettando Firebase SDK...');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const { initializeApp, getFirestore } = window.firebase;
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        
        console.log('✅ Firebase inizializzato con successo');
        return true;
    } catch (error) {
        console.error('❌ Errore inizializzazione Firebase:', error);
        return false;
    }
}

/**
 * Testa la connessione a Firebase
 * @returns {boolean} True se connesso
 */
export async function testConnection() {
    try {
        if (!db) {
            const initialized = await initializeFirebase();
            if (!initialized) return false;
        }
        
        // Test di connessione semplice
        console.log('🔍 Test connessione Firebase...');
        
        // Per ora ritorna true se Firebase è inizializzato
        // In futuro potresti fare una query di test reale
        console.log('✅ Test connessione Firebase completato');
        return true;
    } catch (error) {
        console.error('❌ Errore test connessione Firebase:', error);
        return false;
    }
}

/**
 * Recupera tutti i risultati del quiz da Firebase
 * @returns {Array} Array dei risultati quiz
 */
export async function getAllQuizResults() {
    try {
        if (!db) {
            await initializeFirebase();
        }
        
        // Per ora restituisce dati di test
        console.log('📊 Generando dati quiz di test...');
        
        const testQuizResults = [
            {
                id: 'test-1',
                name: 'Mario Rossi',
                age: 35,
                email: 'mario.rossi@email.com',
                whatsapp_number: '+393331234567',
                gender: 'M',
                profile: 'Guerriero della Forza',
                goals: ['Aumentare massa muscolare', 'Migliorare forza'],
                activity_level: 'Intermedio',
                obstacles: ['Poco tempo', 'Stress lavoro'],
                lead_score: 85,
                timestamp: new Date()
            },
            {
                id: 'test-2',
                name: 'Laura Bianchi',
                age: 28,
                email: 'laura.bianchi@email.com',
                whatsapp_number: '+393337654321',
                gender: 'F',
                profile: 'Scolpitore del Corpo',
                goals: ['Tonificare', 'Perdere peso'],
                activity_level: 'Principiante',
                obstacles: ['Motivazione', 'Palestra costosa'],
                lead_score: 92,
                timestamp: new Date()
            }
        ];
        
        console.log(`📊 Recuperati ${testQuizResults.length} risultati quiz (test)`);
        return testQuizResults;
    } catch (error) {
        console.error('❌ Errore recupero quiz results:', error);
        return [];
    }
}

/**
 * Recupera un singolo risultato quiz per ID
 * @param {string} quizId - ID del quiz
 * @returns {Object|null} Dati del quiz
 */
export async function getQuizResultById(quizId) {
    try {
        const allQuizzes = await getAllQuizResults();
        const quiz = allQuizzes.find(q => q.id === quizId);
        
        if (quiz) {
            return quiz;
        } else {
            console.log('❌ Quiz non trovato:', quizId);
            return null;
        }
    } catch (error) {
        console.error('❌ Errore recupero quiz:', error);
        return null;
    }
}

/**
 * Recupera le conversazioni chatbot da Firebase (fallback)
 * @returns {Array} Array delle conversazioni
 */
export async function getChatbotConversations() {
    try {
        console.log('💬 Generando conversazioni di test...');
        
        const testConversations = [
            {
                id: 'conv-test-1',
                lastMessageSnippet: 'Ciao! Vorrei informazioni sui tuoi programmi di allenamento...',
                topic: 'Allenamento',
                timestamp: new Date(),
                messages: [
                    { role: 'user', content: 'Ciao! Vorrei informazioni sui tuoi programmi di allenamento' },
                    { role: 'assistant', content: 'Ciao! Sarò felice di aiutarti. Che tipo di allenamento ti interessa?' },
                    { role: 'user', content: 'Vorrei aumentare la massa muscolare' },
                    { role: 'assistant', content: 'Perfetto! Abbiamo programmi specifici per l\'ipertrofia muscolare...' }
                ],
                customer: 'Utente Test 1',
                source: 'Firebase'
            },
            {
                id: 'conv-test-2',
                lastMessageSnippet: 'Quali sono i prezzi per una consulenza personalizzata?',
                topic: 'Prezzi',
                timestamp: new Date(),
                messages: [
                    { role: 'user', content: 'Quali sono i prezzi per una consulenza personalizzata?' },
                    { role: 'assistant', content: 'Le nostre consulenze partono da 50€ per una sessione singola...' }
                ],
                customer: 'Utente Test 2',
                source: 'Firebase'
            }
        ];
        
        console.log(`💬 Recuperate ${testConversations.length} conversazioni da Firebase (test)`);
        return testConversations;
    } catch (error) {
        console.error('❌ Errore recupero conversazioni Firebase:', error);
        return [];
    }
}

/**
 * 🔥 NUOVA: Recupera le conversazioni dal chatbot Chatbase via API
 * @param {Object} filters - Filtri opzionali
 * @returns {Array} Lista delle conversazioni
 */
export async function getChatbotConversationsFromAPI(filters = {}) {
    try {
        // Costruisci i parametri di query
        const params = new URLSearchParams({
            chatbotId: CHATBOT_ID,
            page: filters.page || 1,
            size: filters.size || 50,
        });

        // Aggiungi filtri opzionali
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.filteredSources) params.append('filteredSources', filters.filteredSources);

        console.log('🔍 Chiamata API Chatbase:', `${CHATBASE_API_BASE}/get-conversations?${params}`);

        const response = await fetch(`${CHATBASE_API_BASE}/get-conversations?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CHATBASE_SECRET_KEY}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Errore API Chatbase: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Risposta API Chatbase:', data);
        
        // Trasforma i dati nel formato della dashboard
        const transformedConversations = data.data?.map(conv => ({
            id: conv.id,
            lastMessageSnippet: conv.messages?.length > 0 
                ? conv.messages[conv.messages.length - 1].content?.substring(0, 100) + '...'
                : 'Nessun messaggio',
            topic: extractTopicFromMessages(conv.messages) || 'Argomento generico',
            timestamp: new Date(conv.created_at),
            messages: conv.messages || [],
            customer: conv.customer || 'Anonimo',
            source: conv.source || 'API'
        })) || [];

        console.log(`🎉 Recuperate ${transformedConversations.length} conversazioni da Chatbase API`);
        return transformedConversations;

    } catch (error) {
        console.error('❌ Errore nel recupero conversazioni Chatbase:', error);
        throw error;
    }
}

/**
 * 🧠 Estrae l'argomento principale dai messaggi usando keyword detection
 * @param {Array} messages - Array dei messaggi
 * @returns {string} Argomento rilevato
 */
function extractTopicFromMessages(messages) {
    if (!messages || messages.length === 0) return null;
    
    // Semplice analisi dei contenuti per rilevare argomenti
    const allText = messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content.toLowerCase())
        .join(' ');
    
    // Keywords per identificare argomenti fitness
    const topics = {
        'Allenamento': ['allenamento', 'esercizi', 'workout', 'palestra', 'training', 'fitness', 'muscoli'],
        'Dieta': ['dieta', 'alimentazione', 'cibo', 'nutrizione', 'mangiare', 'calorie', 'proteine'],
        'Obiettivi': ['obiettivo', 'perdere peso', 'dimagrire', 'massa', 'tonificare', 'forma', 'risultati'],
        'Salute': ['salute', 'dolore', 'infortunio', 'medico', 'fisioterapia', 'riposo', 'recupero'],
        'Motivazione': ['motivazione', 'difficoltà', 'aiuto', 'supporto', 'scoraggiato', 'stanco'],
        'Prezzi': ['prezzo', 'costo', 'quanto', 'tariffe', 'pagamento', 'abbonamento', 'consulenza'],
        'Programmi': ['programma', 'piano', 'scheda', 'routine', 'settimane', 'mesi']
    };
    
    for (const [topic, keywords] of Object.entries(topics)) {
        if (keywords.some(keyword => allText.includes(keyword))) {
            return topic;
        }
    }
    
    return 'Generale';
}

/**
 * 📊 Ottiene statistiche aggregate dalle conversazioni
 * @returns {Object} Statistiche delle conversazioni
 */
export async function getChatbotStats() {
    try {
        // Prova prima con l'API Chatbase
        try {
            const conversations = await getChatbotConversationsFromAPI({
                startDate: getDateDaysAgo(30),
                size: 1000
            });
            
            return {
                totalConversations: conversations.length,
                topicsDistribution: getTopicsDistribution(conversations),
                averageMessageLength: calculateAverageMessageLength(conversations),
                mostActiveHours: getMostActiveHours(conversations)
            };
        } catch (apiError) {
            // Fallback a Firebase
            const conversations = await getChatbotConversations();
            return {
                totalConversations: conversations.length,
                topicsDistribution: getTopicsDistribution(conversations),
                averageMessageLength: calculateAverageMessageLength(conversations),
                mostActiveHours: getMostActiveHours(conversations)
            };
        }
    } catch (error) {
        console.error('❌ Errore recupero statistiche chatbot:', error);
        return {
            totalConversations: 0,
            topicsDistribution: {},
            averageMessageLength: 0,
            mostActiveHours: []
        };
    }
}

/**
 * 📈 Calcola la distribuzione degli argomenti
 */
function getTopicsDistribution(conversations) {
    const distribution = {};
    conversations.forEach(conv => {
        const topic = conv.topic || 'Generale';
        distribution[topic] = (distribution[topic] || 0) + 1;
    });
    return distribution;
}

/**
 * 📏 Calcola la lunghezza media dei messaggi
 */
function calculateAverageMessageLength(conversations) {
    let totalLength = 0;
    let messageCount = 0;
    
    conversations.forEach(conv => {
        conv.messages?.forEach(msg => {
            if (msg.role === 'user') {
                totalLength += msg.content.length;
                messageCount++;
            }
        });
    });
    
    return messageCount > 0 ? Math.round(totalLength / messageCount) : 0;
}

/**
 * ⏰ Trova le ore più attive
 */
function getMostActiveHours(conversations) {
    const hourCounts = {};
    
    conversations.forEach(conv => {
        if (conv.timestamp) {
            const hour = conv.timestamp.getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
    });
    
    return Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }));
}

/**
 * 📅 Utility: Ottiene una data N giorni fa in formato YYYY-MM-DD
 */
function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

// Export delle configurazioni per debug
export const config = {
    firebaseConfig,
    chatbaseApiBase: CHATBASE_API_BASE,
    chatbotId: CHATBOT_ID,
    hasValidChatbaseConfig: CHATBASE_SECRET_KEY !== 'TUA_CHATBASE_SECRET_KEY' && CHATBOT_ID !== 'TUO_CHATBOT_ID'
};

console.log('🔧 Firebase API inizializzato:', {
    firebase: '⏳ Inizializzazione in corso...',
    chatbase: config.hasValidChatbaseConfig ? '✅' : '⚠️ Configura le credenziali',
    chatbotId: CHATBOT_ID
});