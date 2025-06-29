// firebase-api.js - API Firebase + Chatbase per TribuCoach Dashboard
// Versione browser-compatible

// 🔥 SOLUZIONE: Aspetta che Firebase sia disponibile dal CDN
function waitForFirebase() {
    return new Promise((resolve) => {
        function check() {
            if (typeof firebase !== 'undefined') {
                resolve();
            } else {
                setTimeout(check, 100);
            }
        }
        check();
    });
}

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
const CHATBASE_SECRET_KEY = '0uk17rpq8vkvbw1nvnhvupwm0zc8iwjo';
const CHATBOT_ID = 'EjoHCEogMfkkrVzIK6V07';

// Variabili globali Firebase
let app;
let db;

// Inizializza Firebase
async function initFirebase() {
    try {
        await waitForFirebase();
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
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
async function testConnection() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        const testCollection = db.collection('quiz_results');
        await testCollection.limit(1).get();
        console.log('✅ Connessione Firebase stabilita');
        return true;
    } catch (error) {
        console.error('❌ Errore connessione Firebase:', error);
        return false;
    }
}

/**
 * Recupera tutti i risultati del quiz da Firebase
 * @returns {Array} Array dei risultati quiz
 */
async function getAllQuizResults() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        const querySnapshot = await db.collection('quiz_results').get();
        const results = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            results.push({
                id: doc.id,
                ...data
            });
        });
        
        console.log(`📊 Recuperati ${results.length} risultati quiz`);
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
async function getQuizResultById(quizId) {
    try {
        if (!db) {
            await initFirebase();
        }
        
        const docRef = db.collection('quiz_results').doc(quizId);
        const doc = await docRef.get();
        
        if (doc.exists) {
            return {
                id: doc.id,
                ...doc.data()
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
async function getChatbotConversations() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        const querySnapshot = await db.collection('conversations').get();
        const conversations = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Estrai il primo messaggio utente per l'anteprima
            const firstUserMessage = data.messages?.find(msg => msg.role === 'user')?.message || 'Nessun messaggio';
            
            conversations.push({
                id: doc.id,
                customerName: data.customerName || 'Cliente Anonimo',
                phone: data.customerPhone || 'N/A',
                topic: data.topic || extractTopicFromMessages(data.messages) || 'Non classificato',
                lastActivity: data.lastMessageAt || data.dateCreated || new Date().toISOString(),
                createdAt: data.dateCreated || new Date().toISOString(),
                messages: data.messages || [],
                lastMessageSnippet: firstUserMessage.substring(0, 100) + '...',
                sentiment: data.sentiment || 'Neutro',
                source: 'Firebase'
            });
        });
        
        console.log(`💬 Recuperate ${conversations.length} conversazioni da Firebase`);
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
async function getChatbotConversationsFromAPI(filters = {}) {
    try {
        const params = new URLSearchParams({
            chatbotId: CHATBOT_ID,
            page: filters.page || 1,
            size: filters.size || 50,
        });

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
        
        const transformedConversations = data.data?.map(conv => {
            const contactInfo = extractContactInfo(conv.messages);
            
            return {
                id: conv.id,
                customerName: contactInfo.name || conv.customer || 'Cliente Anonimo',
                phone: contactInfo.phone || 'N/A',
                topic: extractTopicFromMessages(conv.messages) || 'Argomento generico',
                lastActivity: conv.updated_at || conv.created_at,
                createdAt: conv.created_at,
                messages: conv.messages || [],
                lastMessageSnippet: conv.messages?.length > 0 
                    ? conv.messages[conv.messages.length - 1].content?.substring(0, 100) + '...'
                    : 'Nessun messaggio',
                source: 'Chatbase API'
            };
        }) || [];

        console.log(`🎉 Recuperate ${transformedConversations.length} conversazioni da Chatbase API`);
        return transformedConversations;

    } catch (error) {
        console.error('❌ Errore nel recupero conversazioni Chatbase:', error);
        throw error;
    }
}

/**
 * 🚀 FUNZIONE PRINCIPALE: Recupera tutte le conversazioni (Firebase + API)
 * @returns {Array} Array combinato delle conversazioni
 */
async function getAllConversations() {
    try {
        console.log('🔄 Recupero conversazioni da tutte le fonti...');
        
        let allConversations = [];
        
        // Prova prima con Firebase
        try {
            const firebaseConversations = await getChatbotConversations();
            allConversations = [...firebaseConversations];
            console.log(`📊 Firebase: ${firebaseConversations.length} conversazioni`);
        } catch (firebaseError) {
            console.warn('⚠️ Firebase non disponibile:', firebaseError.message);
        }
        
        // Poi prova con Chatbase API
        try {
            const apiConversations = await getChatbotConversationsFromAPI();
            allConversations = [...allConversations, ...apiConversations];
            console.log(`🌐 API: ${apiConversations.length} conversazioni`);
        } catch (apiError) {
            console.warn('⚠️ API Chatbase non disponibile:', apiError.message);
        }
        
        // Rimuovi duplicati basati su ID
        const uniqueConversations = allConversations.reduce((acc, conv) => {
            if (!acc.find(existing => existing.id === conv.id)) {
                acc.push(conv);
            }
            return acc;
        }, []);
        
        console.log(`✅ Totale conversazioni uniche: ${uniqueConversations.length}`);
        return uniqueConversations;
        
    } catch (error) {
        console.error('❌ Errore nel recupero conversazioni:', error);
        return [];
    }
}

/**
 * 🧠 Estrae l'argomento principale dai messaggi
 * @param {Array} messages - Array dei messaggi
 * @returns {string} Argomento rilevato
 */
function extractTopicFromMessages(messages) {
    if (!messages || messages.length === 0) return null;
    
    const allText = messages
        .filter(msg => msg.role === 'user' || msg.sender === 'user')
        .map(msg => (msg.content || msg.message || msg.text || '').toLowerCase())
        .join(' ');
    
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
 * 🔥 NUOVA: Estrae nome e telefono dai messaggi della conversazione
 * @param {Array} messages - Array dei messaggi
 * @returns {Object} {name: string, phone: string}
 */
function extractContactInfo(messages) {
    if (!messages || messages.length === 0) return { name: null, phone: null };
    
    let extractedName = null;
    let extractedPhone = null;
    
    // Cerca nei messaggi dell'utente
    const userMessages = messages
        .filter(msg => msg.role === 'user' || msg.sender === 'user')
        .map(msg => msg.content || msg.message || msg.text || '');
    
    for (const message of userMessages) {
        // Pattern per nomi
        const namePatterns = [
            /(?:mi chiamo|sono|il mio nome è|nome)\s+([a-zA-ZÀ-ÿ\s]{2,30})/i,
            /^([a-zA-ZÀ-ÿ]{2,20})\s*[,.]?\s*(?:qui|ciao|salve)/i,
            /ciao\s+([a-zA-ZÀ-ÿ]{2,20})/i
        ];
        
        for (const pattern of namePatterns) {
            const match = message.match(pattern);
            if (match && !extractedName) {
                extractedName = match[1].trim();
                extractedName = extractedName.replace(/\b(qui|ciao|salve|sono|io)\b/gi, '').trim();
                if (extractedName.length < 2) extractedName = null;
                break;
            }
        }
        
        // Pattern per telefoni
        const phonePatterns = [
            /(?:telefono|cellulare|numero|contatto|chiamami|tel)[:\s]*([+]?[0-9\s\-\.]{8,15})/i,
            /([+]?39[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4})/,
            /([0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4})/,
            /([+][0-9]{1,3}[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,4}[\s\-]?[0-9]{3,4})/
        ];
        
        for (const pattern of phonePatterns) {
            const match = message.match(pattern);
            if (match && !extractedPhone) {
                extractedPhone = match[1].replace(/[\s\-\.]/g, '');
                if (extractedPhone.length >= 8 && extractedPhone.length <= 15) {
                    break;
                } else {
                    extractedPhone = null;
                }
            }
        }
    }
    
    return { 
        name: extractedName, 
        phone: extractedPhone 
    };
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
const config = {
    firebaseConfig,
    chatbaseApiBase: CHATBASE_API_BASE,
    chatbotId: CHATBOT_ID,
    hasValidChatbaseConfig: CHATBASE_SECRET_KEY !== 'TUA_CHATBASE_SECRET_KEY' && CHATBOT_ID !== 'TUO_CHATBOT_ID'
};

// 🚀 ESPONI LE FUNZIONI GLOBALMENTE PER IL BROWSER
window.firebaseAPI = {
    testConnection,
    getAllQuizResults,
    getQuizResultById,
    getChatbotConversations,
    getChatbotConversationsFromAPI,
    getAllConversations, // 🎯 QUESTA È LA FUNZIONE PRINCIPALE!
    extractTopicFromMessages,
    extractContactInfo,
    config,
    // Auto-inizializzazione
    init: initFirebase
};

// Auto-inizializzazione quando il script viene caricato
(async () => {
    try {
        await initFirebase();
        console.log('🎉 FirebaseAPI pronto per l\'uso!');
    } catch (error) {
        console.error('❌ Errore inizializzazione automatica:', error);
    }
})();

console.log('🔧 Firebase API inizializzato:', {
    firebase: '✅',
    chatbase: config.hasValidChatbaseConfig ? '✅' : '⚠️ Configura le credenziali',
    chatbotId: CHATBOT_ID,
    methodsAvailable: Object.keys(window.firebaseAPI || {})
});