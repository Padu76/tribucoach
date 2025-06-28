// firebase-api.js - API Firebase + Chatbase per TribuCoach Dashboard

// Configurazione Firebase - CREDENZIALI REALI TRIBUCOACH
const firebaseConfig = {
    apiKey: "AIzaSyDTJgM-2FQBSjqTMQ-Ioxf1lM1eSJq1f0I",
    authDomain: "tribucoach-a2254.firebaseapp.com",
    projectId: "tribucoach-a2254",
    storageBucket: "tribucoach-a2254.firebasestorage.app",
    messagingSenderId: "425200296836",
    appId: "1:425200296836:web:af4f3e79f612604ee2b3d1"
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
        // Usa Firebase compat
        if (typeof firebase !== 'undefined') {
            app = firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('✅ Firebase inizializzato con compat SDK');
            return true;
        } else {
            console.error('❌ Firebase SDK non disponibile');
            return false;
        }
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
        
        console.log('🔍 Test connessione Firebase reale...');
        
        // Test di connessione reale con il database
        const testCollection = db.collection('quiz_results');
        await testCollection.limit(1).get();
        
        console.log('✅ Connessione Firebase REALE stabilita!');
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
        
        console.log('📊 Recuperando dati quiz REALI da Firebase...');
        
        const querySnapshot = await db.collection('quiz_results').get();
        const results = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            results.push({
                id: doc.id,
                ...data
            });
        });
        
        console.log(`📊 Recuperati ${results.length} risultati quiz REALI da Firebase`);
        return results;
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
        if (!db) {
            await initializeFirebase();
        }
        
        console.log('🔍 Recuperando quiz ID:', quizId);
        
        const docRef = db.collection('quiz_results').doc(quizId);
        const doc = await docRef.get();
        
        if (doc.exists) {
            const data = doc.data();
            return {
                id: doc.id,
                ...data
            };
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
        if (!db) {
            await initializeFirebase();
        }
        
        console.log('💬 Recuperando conversazioni REALI da Firebase...');
        
        const querySnapshot = await db.collection('chatbot_conversations').get();
        const conversations = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            conversations.push({
                id: doc.id,
                lastMessageSnippet: data.last_message?.substring(0, 100) + '...' || 'N/A',
                topic: data.topic || 'Generale',
                timestamp: data.timestamp || new Date(),
                messages: data.messages || [],
                customer: data.customer_name || 'Anonimo',
                source: data.source || 'Firebase'
            });
        });
        
        console.log(`💬 Recuperate ${conversations.length} conversazioni REALI da Firebase`);
        return conversations;
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