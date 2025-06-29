// webhook-chatbase.js - Endpoint per sincronizzare Chatbase con Firebase
// Da hostare su Vercel, Netlify o server Node.js

const admin = require('firebase-admin');

// Inizializza Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "tribucoach-a2254",
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        databaseURL: "https://tribucoach-a2254-default-rtdb.firebaseio.com"
    });
}

const db = admin.firestore();

/**
 * 🎯 WEBHOOK PRINCIPALE: Riceve conversazioni da Chatbase
 */
async function handleChatbaseWebhook(req, res) {
    // Verifica metodo HTTP
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('📨 Webhook ricevuto da Chatbase:', JSON.stringify(req.body, null, 2));

        // Verifica presenza dati
        if (!req.body || !req.body.conversation) {
            return res.status(400).json({ error: 'Dati conversazione mancanti' });
        }

        const conversationData = req.body.conversation;
        
        // 🔧 TRASFORMA I DATI PER FIREBASE
        const firebaseConversation = {
            // ID univoco conversazione
            chatbaseId: conversationData.id || generateUniqueId(),
            
            // Informazioni cliente
            customerName: extractCustomerName(conversationData.messages) || 'Cliente Anonimo',
            customerPhone: extractCustomerPhone(conversationData.messages) || null,
            
            // Metadati conversazione
            topic: extractTopic(conversationData.messages) || 'Generale',
            source: 'Chatbase Webhook',
            
            // Timestamp
            dateCreated: conversationData.created_at || new Date().toISOString(),
            lastMessageAt: conversationData.updated_at || new Date().toISOString(),
            
            // Messaggi completi
            messages: transformMessages(conversationData.messages || []),
            
            // Statistiche
            messageCount: conversationData.messages?.length || 0,
            
            // Webhook metadata
            webhookReceivedAt: new Date().toISOString(),
            rawData: conversationData // Per debug
        };

        // 🔥 SALVA SU FIREBASE
        const docId = firebaseConversation.chatbaseId;
        await db.collection('conversations').doc(docId).set(firebaseConversation, { merge: true });
        
        console.log(`✅ Conversazione ${docId} salvata su Firebase`);

        // Risposta successo
        res.status(200).json({
            success: true,
            message: 'Conversazione sincronizzata con successo',
            conversationId: docId,
            messageCount: firebaseConversation.messageCount
        });

    } catch (error) {
        console.error('❌ Errore webhook:', error);
        res.status(500).json({
            error: 'Errore interno del server',
            message: error.message
        });
    }
}

/**
 * 🧠 Estrae il nome del cliente dai messaggi
 */
function extractCustomerName(messages) {
    if (!messages || messages.length === 0) return null;
    
    const userMessages = messages
        .filter(msg => msg.role === 'user' || msg.type === 'user')
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
            if (match) {
                let name = match[1].trim();
                name = name.replace(/\b(qui|ciao|salve|sono|io)\b/gi, '').trim();
                if (name.length >= 2) {
                    return name;
                }
            }
        }
    }
    
    return null;
}

/**
 * 📱 Estrae il telefono del cliente dai messaggi
 */
function extractCustomerPhone(messages) {
    if (!messages || messages.length === 0) return null;
    
    const userMessages = messages
        .filter(msg => msg.role === 'user' || msg.type === 'user')
        .map(msg => msg.content || msg.message || msg.text || '');
    
    for (const message of userMessages) {
        // Pattern per telefoni
        const phonePatterns = [
            /(?:telefono|cellulare|numero|contatto|chiamami|tel)[:\s]*([+]?[0-9\s\-\.]{8,15})/i,
            /([+]?39[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4})/,
            /([0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4})/
        ];
        
        for (const pattern of phonePatterns) {
            const match = message.match(pattern);
            if (match) {
                const phone = match[1].replace(/[\s\-\.]/g, '');
                if (phone.length >= 8 && phone.length <= 15) {
                    return phone;
                }
            }
        }
    }
    
    return null;
}

/**
 * 🎯 Estrae l'argomento principale dai messaggi
 */
function extractTopic(messages) {
    if (!messages || messages.length === 0) return 'Generale';
    
    const allText = messages
        .filter(msg => msg.role === 'user' || msg.type === 'user')
        .map(msg => (msg.content || msg.message || msg.text || '').toLowerCase())
        .join(' ');
    
    const topics = {
        'Allenamento Glutei': ['glutei', 'sedere', 'lato b'],
        'Allenamento': ['allenamento', 'esercizi', 'workout', 'palestra', 'training', 'fitness'],
        'Alimentazione': ['dieta', 'alimentazione', 'cibo', 'nutrizione', 'mangiare', 'calorie'],
        'Motivazione': ['motivazione', 'difficoltà', 'aiuto', 'supporto', 'scoraggiato'],
        'Obiettivi': ['obiettivo', 'perdere peso', 'dimagrire', 'massa', 'tonificare'],
        'Prezzi': ['prezzo', 'costo', 'quanto', 'tariffe', 'pagamento'],
        'Programmi': ['programma', 'piano', 'scheda', 'routine']
    };
    
    for (const [topic, keywords] of Object.entries(topics)) {
        if (keywords.some(keyword => allText.includes(keyword))) {
            return topic;
        }
    }
    
    return 'Generale';
}

/**
 * 🔄 Trasforma i messaggi nel formato Firebase
 */
function transformMessages(messages) {
    if (!messages || messages.length === 0) return [];
    
    return messages.map((msg, index) => ({
        id: index,
        role: msg.role || (msg.type === 'user' ? 'user' : 'assistant'),
        sender: msg.role || (msg.type === 'user' ? 'user' : 'assistant'),
        message: msg.content || msg.message || msg.text || '',
        text: msg.content || msg.message || msg.text || '',
        timestamp: msg.created_at || msg.timestamp || new Date().toISOString(),
        source: 'Chatbase'
    }));
}

/**
 * 🆔 Genera ID univoco
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export per deploy
module.exports = { handleChatbaseWebhook };

// Per Vercel
if (typeof module !== 'undefined' && module.exports) {
    module.exports.default = handleChatbaseWebhook;
}