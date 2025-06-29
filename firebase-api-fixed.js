// firebase-api.js - API Firebase + Chatbase per TribuCoach Dashboard

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
export async function testConnection() {
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
export async function getAllQuizResults() {
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
export async function getQuizResultById(quizId) {
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
 * 🔥 FIX: Recupera le conversazioni chatbot da Firebase (collezione corretta)
 * @returns {Array} Array delle conversazioni
 */
export async function getChatbotConversations() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        // 🔥 FIX PRINCIPALE: Cambiato da 'chatbot_conversations' a 'conversations'
        const querySnapshot = await db.collection('conversations').get();
        const conversations = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // 🔧 Gestione migliorata dei messaggi e metadati
            let firstUserMessage = 'Nessun messaggio';
            if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
                const userMsg = data.messages.find(msg => msg.role === 'user');
                if (userMsg) {
                    firstUserMessage = userMsg.message || userMsg.content || 'Messaggio non disponibile';
                }
            }
            
            // 🔧 Gestione timestamp
            let timestamp = new Date();
            if (data.dateCreated) {
                if (data.dateCreated.seconds) {
                    timestamp = new Date(data.dateCreated.seconds * 1000);
                } else {
                    timestamp = new Date(data.dateCreated);
                }
            } else if (data.lastMessageAt) {
                if (data.lastMessageAt.seconds) {
                    timestamp = new Date(data.lastMessageAt.seconds * 1000);
                } else {
                    timestamp = new Date(data.lastMessageAt);
                }
            }
            
            conversations.push({
                id: doc.id,
                lastMessageSnippet: firstUserMessage.substring(0, 100) + (firstUserMessage.length > 100 ? '...' : ''),
                topic: data.topic || 'Non classificato',
                timestamp: timestamp,
                messages: data.messages || [],
                customer: data.customerName || 'Cliente Anonimo',
                phone: data.customerPhone || null,
                sentiment: data.sentiment || 'Neutro',
                source: data.source || 'Firebase',
                totalMessages: data.totalMessages || (data.messages ? data.messages.length : 0),
                chatbaseId: data.chatbaseId || doc.id
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
export async function getChatbotConversationsFromAPI(filters = {}) {
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
            // 🔥 ESTRAI AUTOMATICAMENTE NOME E TELEFONO
            const contactInfo = extractContactInfo(conv.messages);
            
            return {
                id: conv.id,
                lastMessageSnippet: conv.messages?.length > 0 
                    ? conv.messages[conv.messages.length - 1].content?.substring(0, 100) + '...'
                    : 'Nessun messaggio',
                topic: extractTopicFromMessages(conv.messages) || 'Argomento generico',
                timestamp: new Date(conv.created_at),
                messages: conv.messages || [],
                customer: contactInfo.name || conv.customer || 'Anonimo',
                phone: contactInfo.phone || null, // 🔥 NUOVO CAMPO
                source: conv.source || 'API'
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
 * 🧠 Estrae l'argomento principale dai messaggi
 * @param {Array} messages - Array dei messaggi
 * @returns {string} Argomento rilevato
 */
function extractTopicFromMessages(messages) {
    if (!messages || messages.length === 0) return null;
    
    const allText = messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content.toLowerCase())
        .join(' ');
    
    const topics = {
        'Allenamento Glutei': ['glutei', 'glute', 'ponte', 'squat glutei', 'culo', 'sedere'],
        'Allenamento Spalle': ['spalle', 'shoulder', 'deltoidi', 'alzate laterali', 'press spalle'],
        'Allenamento Braccia': ['braccia', 'bicipiti', 'tricipiti', 'curl', 'flessioni'],
        'Allenamento Generale': ['allenamento', 'esercizi', 'workout', 'palestra', 'training', 'fitness', 'muscoli'],
        'Alimentazione': ['dieta', 'alimentazione', 'cibo', 'nutrizione', 'mangiare', 'calorie', 'proteine'],
        'Motivazione': ['motivazione', 'motivami', 'difficoltà', 'aiuto', 'supporto', 'scoraggiato', 'stanco', 'non riesco'],
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
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content);
    
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
                // Pulisci il nome (rimuovi parole comuni)
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
                extractedPhone = match[1].replace(/[\s\-\.]/g, ''); // Rimuovi spazi e trattini
                // Validazione base
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
 * 🔥 NUOVA: Funzione per creare conversazioni demo se necessario
 * @returns {boolean} True se le conversazioni demo sono state create
 */
export async function createDemoConversations() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        const demoConversations = [
            {
                chatbaseId: 'demo-001',
                messages: [
                    { role: 'user', message: 'Ciao, mi chiamo Laura Bianchi' },
                    { role: 'assistant', message: 'Ciao Laura! Come posso aiutarti?' },
                    { role: 'user', message: 'Il mio numero è 348-555-0123' },
                    { role: 'user', message: 'Vorrei consigli per glutei sodi' }
                ],
                topic: 'Allenamento Glutei',
                sentiment: 'Positivo',
                customerName: 'Laura Bianchi',
                customerPhone: '348-555-0123',
                totalMessages: 4,
                dateCreated: new Date(),
                source: 'demo-data'
            },
            {
                chatbaseId: 'demo-002',
                messages: [
                    { role: 'user', message: 'Non riesco più ad allenarmi costantemente' },
                    { role: 'assistant', message: 'Capisco la difficoltà. Cosa ti blocca?' },
                    { role: 'user', message: 'Sono sempre stanca dopo il lavoro' }
                ],
                topic: 'Motivazione',
                sentiment: 'Negativo',
                customerName: null,
                customerPhone: null,
                totalMessages: 3,
                dateCreated: new Date(),
                source: 'demo-data'
            }
        ];
        
        for (const conv of demoConversations) {
            await db.collection('conversations').add(conv);
        }
        
        console.log('✅ Conversazioni demo create');
        return true;
    } catch (error) {
        console.error('❌ Errore creazione conversazioni demo:', error);
        return false;
    }
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

// 🔥 INIZIALIZZAZIONE AUTOMATICA
(async function autoInit() {
    try {
        const initialized = await initFirebase();
        if (initialized) {
            console.log('🔧 Firebase API inizializzato:', {
                firebase: '✅',
                chatbase: config.hasValidChatbaseConfig ? '✅' : '⚠️ Configura le credenziali',
                chatbotId: CHATBOT_ID
            });
        }
    } catch (error) {
        console.error('❌ Errore inizializzazione automatica:', error);
    }
})();