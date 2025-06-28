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
 * Recupera le conversazioni chatbot da Firebase (fallback)
 * @returns {Array} Array delle conversazioni
 */
export async function getChatbotConversations() {
    try {
        if (!db) {
            await initFirebase();
        }
        
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
    firebase: '✅',
    chatbase: config.hasValidChatbaseConfig ? '✅' : '⚠️ Configura le credenziali',
    chatbotId: CHATBOT_ID
});

// === 🔍 FUNZIONI DI DEBUG ===

/**
 * 🔍 DEBUG: Mostra tutte le collezioni disponibili in Firestore
 */
export async function debugListCollections() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        console.log('🔍 === DEBUG FIRESTORE COLLECTIONS ===');
        
        const collectionsToCheck = [
            'quiz_results',
            'chatbot_conversations', 
            'conversations',
            'chat_messages',
            'leads',
            'users',
            'messages'
        ];
        
        for (const collectionName of collectionsToCheck) {
            try {
                const snapshot = await db.collection(collectionName).limit(5).get();
                console.log(`📁 Collezione "${collectionName}": ${snapshot.size} documenti`);
                
                if (snapshot.size > 0) {
                    snapshot.forEach((doc, index) => {
                        console.log(`  📄 Doc ${index + 1}:`, {
                            id: doc.id,
                            data: doc.data()
                        });
                    });
                }
            } catch (error) {
                console.log(`❌ Collezione "${collectionName}": Non esiste o errore`);
            }
        }
        
        console.log('🔍 === FINE DEBUG COLLECTIONS ===');
        
    } catch (error) {
        console.error('❌ Errore debug collezioni:', error);
    }
}

/**
 * 🔍 DEBUG: Analizza la struttura dei dati nelle conversazioni
 */
export async function debugChatbotData() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        console.log('🔍 === DEBUG CHATBOT DATA ===');
        
        const snapshot = await db.collection('chatbot_conversations').limit(10).get();
        
        if (snapshot.size === 0) {
            console.log('⚠️ NESSUNA conversazione trovata in Firebase!');
            console.log('💡 Le conversazioni potrebbero essere:');
            console.log('   1. Solo su Chatbase (non salvate in Firebase)');
            console.log('   2. In una collezione con nome diverso');
            console.log('   3. Non ancora configurate per il salvataggio');
        } else {
            console.log(`✅ Trovate ${snapshot.size} conversazioni in Firebase:`);
            
            snapshot.forEach((doc, index) => {
                const data = doc.data();
                console.log(`📄 Conversazione ${index + 1}:`, {
                    id: doc.id,
                    customer_name: data.customer_name,
                    last_message: data.last_message ? data.last_message.substring(0, 100) : 'N/A',
                    topic: data.topic,
                    timestamp: data.timestamp,
                    messages_count: data.messages ? data.messages.length : 0,
                    source: data.source
                });
            });
        }
        
        console.log('🔍 === FINE DEBUG CHATBOT DATA ===');
        
    } catch (error) {
        console.error('❌ Errore debug chatbot data:', error);
    }
}

/**
 * 🔍 DEBUG: Testa la connessione API Chatbase
 */
export async function debugChatbaseAPI() {
    try {
        console.log('🔍 === DEBUG CHATBASE API ===');
        console.log('🔧 Configurazione:', {
            chatbotId: CHATBOT_ID,
            hasSecretKey: CHATBASE_SECRET_KEY !== 'TUA_CHATBASE_SECRET_KEY'
        });
        
        const conversations = await getChatbotConversationsFromAPI({
            size: 3
        });
        
        console.log(`✅ API Chatbase funziona: ${conversations.length} conversazioni`);
        
        if (conversations.length > 0) {
            conversations.forEach((conv, index) => {
                console.log(`📱 Conversazione API ${index + 1}:`, {
                    id: conv.id,
                    customer: conv.customer,
                    phone: conv.phone,
                    topic: conv.topic,
                    messages_count: conv.messages ? conv.messages.length : 0,
                    timestamp: conv.timestamp
                });
                
                if (conv.messages && conv.messages.length > 0) {
                    console.log(`   📝 Primi messaggi:`, conv.messages.slice(0, 3));
                }
            });
        }
        
        console.log('🔍 === FINE DEBUG CHATBASE API ===');
        
    } catch (error) {
        console.error('❌ Errore debug Chatbase API:', error);
    }
}

/**
 * 🔍 DEBUG: Funzione completa per verificare tutto
 */
export async function debugEverything() {
    console.log('🚀 === INIZIO DEBUG COMPLETO ===');
    
    await debugListCollections();
    await debugChatbotData();
    await debugChatbaseAPI();
    
    console.log('🎯 === FINE DEBUG COMPLETO ===');
    console.log('💡 Controlla i log sopra per capire la situazione dei dati!');
}

// Esporta le funzioni debug globalmente
window.debugFirestore = {
    listCollections: debugListCollections,
    chatbotData: debugChatbotData, 
    chatbaseAPI: debugChatbaseAPI,
    everything: debugEverything
};