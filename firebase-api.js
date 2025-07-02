import { db } from './firebase.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

/**
 * 🔥 Recupera le conversazioni dal chatbot Chatbase via API e salva su Firestore
 * @param {Object} filters - Filtri opzionali
 * @returns {Array} Lista delle conversazioni
 */
async function getChatbotConversationsFromAPI(filters = {}) {
    try {
        const CHATBASE_API_BASE = 'https://www.chatbase.co/api/v1';
        const CHATBASE_SECRET_KEY = '0uk17rpq8vkvbw1nvnhvupwm0zc8iwjo';
        const CHATBOT_ID = 'EjoHCEogMfkkrVzIK6V07';

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

        // SALVATAGGIO SU FIRESTORE
        for (const conv of transformedConversations) {
            try {
                const docRef = doc(db, 'chatbase_conversations', conv.id);
                await setDoc(docRef, conv, { merge: true });
                console.log(`✅ Conversazione salvata su Firestore: ${conv.id}`);
            } catch (error) {
                console.error(`❌ Errore salvataggio conv ${conv.id}:`, error);
            }
        }

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
 * 🔥 Estrae nome e telefono dai messaggi della conversazione
 * @param {Array} messages - Array dei messaggi
 * @returns {Object} {name: string, phone: string}
 */
function extractContactInfo(messages) {
    if (!messages || messages.length === 0) return { name: null, phone: null };

    let extractedName = null;
    let extractedPhone = null;

    const userMessages = messages
        .filter(msg => msg.role === 'user' || msg.sender === 'user')
        .map(msg => msg.content || msg.message || msg.text || '');

    for (const message of userMessages) {
        const namePatterns = [
            /(?:mi chiamo|sono|il mio nome è|nome)\s+([a-zA-ZÀ-ÿ\s]{2,30})/i,
            /^([a-zA-ZÀ-ÿ]{2,20})\s*[,.]?\s*(?:qui|ciao|salve)?/i,
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

    return { name: extractedName, phone: extractedPhone };
}

// Espone le funzioni globalmente per poterle chiamare da console
window.firebaseAPI = {
    getChatbotConversationsFromAPI
};
