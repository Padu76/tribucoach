// auto-import.js - Sistema automatico per importare conversazioni da Chatbase
// Deploy su Netlify Functions per esecuzione automatica

const admin = require('firebase-admin');

// Inizializza Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "tribucoach-a2254",
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
    });
}

const db = admin.firestore();

/**
 * 🔄 FUNZIONE PRINCIPALE: Import automatico da Chatbase
 * Viene eseguita ogni ora da Netlify
 */
exports.handler = async (event, context) => {
    console.log('🚀 Avvio import automatico conversazioni...');
    
    try {
        // Simula import da Chatbase (senza API a pagamento)
        // In realtà processerà i dati già esistenti e li organizzerà
        
        const importResult = await processExistingConversations();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Import completato con successo',
                processed: importResult.processed,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Errore import automatico:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

/**
 * 📊 Processa e organizza conversazioni esistenti
 */
async function processExistingConversations() {
    try {
        // Leggi tutte le conversazioni esistenti
        const existingConversations = await db.collection('conversations').get();
        let processed = 0;

        for (const doc of existingConversations.docs) {
            const data = doc.data();
            
            // Verifica se ha bisogno di aggiornamenti
            if (needsUpdate(data)) {
                const updatedData = enhanceConversationData(data);
                
                await db.collection('conversations').doc(doc.id).update(updatedData);
                processed++;
                
                console.log(`✅ Aggiornata conversazione: ${doc.id}`);
            }
        }

        // Simula nuove conversazioni (da sostituire con vero import quando disponibile)
        await createSampleConversations();

        console.log(`📊 Processate ${processed} conversazioni esistenti`);
        return { processed };

    } catch (error) {
        console.error('❌ Errore processing conversazioni:', error);
        throw error;
    }
}

/**
 * 🔍 Verifica se conversazione ha bisogno di aggiornamenti
 */
function needsUpdate(conversationData) {
    // Aggiorna se mancano campi essenziali
    return !conversationData.topic || 
           !conversationData.lastActivity || 
           !conversationData.messageCount ||
           !conversationData.source;
}

/**
 * ⚡ Migliora i dati della conversazione
 */
function enhanceConversationData(data) {
    const updates = {
        lastUpdated: new Date().toISOString(),
        source: data.source || 'Firebase',
        messageCount: data.messages?.length || 0
    };

    // Estrai argomento se mancante
    if (!data.topic && data.messages?.length > 0) {
        updates.topic = extractTopic(data.messages);
    }

    // Estrai info cliente se mancanti
    if ((!data.customerName || data.customerName === 'Cliente Anonimo') && data.messages?.length > 0) {
        const contactInfo = extractContactInfo(data.messages);
        if (contactInfo.name) updates.customerName = contactInfo.name;
        if (contactInfo.phone) updates.customerPhone = contactInfo.phone;
    }

    // Aggiorna ultima attività
    if (!data.lastActivity && data.messages?.length > 0) {
        const lastMessage = data.messages[data.messages.length - 1];
        updates.lastActivity = lastMessage.timestamp || new Date().toISOString();
    }

    return updates;
}

/**
 * 🎯 Estrae argomento dai messaggi
 */
function extractTopic(messages) {
    const allText = messages
        .filter(msg => msg.role === 'user' || msg.sender === 'user')
        .map(msg => (msg.message || msg.text || msg.content || '').toLowerCase())
        .join(' ');

    const topics = {
        'Allenamento Glutei': ['glutei', 'sedere', 'lato b', 'fianchi'],
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
 * 📱 Estrae info contatto dai messaggi
 */
function extractContactInfo(messages) {
    let extractedName = null;
    let extractedPhone = null;

    const userMessages = messages
        .filter(msg => msg.role === 'user' || msg.sender === 'user')
        .map(msg => msg.message || msg.text || msg.content || '');

    for (const message of userMessages) {
        // Pattern per nomi
        if (!extractedName) {
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
                        extractedName = name;
                        break;
                    }
                }
            }
        }

        // Pattern per telefoni
        if (!extractedPhone) {
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
                        extractedPhone = phone;
                        break;
                    }
                }
            }
        }
    }

    return { name: extractedName, phone: extractedPhone };
}

/**
 * 🔄 Crea conversazioni di esempio (per simulare nuovi import)
 */
async function createSampleConversations() {
    try {
        // Solo se non ci sono conversazioni recenti (ultime 24h)
        const recentCheck = new Date();
        recentCheck.setHours(recentCheck.getHours() - 24);
        
        const recentConversations = await db.collection('conversations')
            .where('lastActivity', '>', recentCheck.toISOString())
            .get();

        // Se ci sono già conversazioni recenti, non aggiungerne di nuove
        if (recentConversations.size > 0) {
            console.log('📋 Conversazioni recenti già presenti, skip sample creation');
            return;
        }

        // Crea una conversazione di esempio ogni 6 ore
        const now = new Date();
        const conversationId = `auto_${now.getTime()}`;

        const sampleConversation = {
            id: conversationId,
            customerName: 'Cliente Auto-Import',
            customerPhone: null,
            topic: 'Sistema Automatico',
            source: 'Auto Import System',
            dateCreated: now.toISOString(),
            lastActivity: now.toISOString(),
            messages: [
                {
                    id: 0,
                    role: 'user',
                    message: 'Test sistema automatico import',
                    timestamp: now.toISOString()
                },
                {
                    id: 1,
                    role: 'assistant', 
                    message: 'Sistema di import automatico funzionante!',
                    timestamp: now.toISOString()
                }
            ],
            messageCount: 2,
            isActive: false,
            autoGenerated: true,
            lastUpdated: now.toISOString()
        };

        await db.collection('conversations').doc(conversationId).set(sampleConversation);
        console.log('✅ Conversazione di esempio creata:', conversationId);

    } catch (error) {
        console.error('❌ Errore creazione sample:', error);
    }
}