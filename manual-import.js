// manual-import.js - Trigger manuale per import conversazioni
// Netlify Function per eseguire import quando richiesto

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
 * 🚀 IMPORT MANUALE - Da chiamare dalla dashboard
 */
exports.handler = async (event, context) => {
    console.log('🔄 Import manuale avviato...');
    
    try {
        // Verifica metodo HTTP
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        // Esegui import
        const result = await executeManualImport();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'Import manuale completato',
                data: result,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('❌ Errore import manuale:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

/**
 * ⚡ Esegue import manuale con creazione di conversazioni di test
 */
async function executeManualImport() {
    try {
        const results = {
            processed: 0,
            created: 0,
            updated: 0
        };

        // 1. Aggiorna conversazioni esistenti
        const existingConversations = await db.collection('conversations').get();
        
        for (const doc of existingConversations.docs) {
            const data = doc.data();
            
            if (needsEnhancement(data)) {
                const enhancements = enhanceConversationData(data);
                await db.collection('conversations').doc(doc.id).update(enhancements);
                results.updated++;
            }
            results.processed++;
        }

        // 2. Crea nuova conversazione di test
        const newConversation = await createTestConversation();
        if (newConversation) {
            results.created++;
        }

        console.log('📊 Import manuale completato:', results);
        return results;

    } catch (error) {
        console.error('❌ Errore execute manual import:', error);
        throw error;
    }
}

/**
 * 🔍 Verifica se conversazione ha bisogno di miglioramenti
 */
function needsEnhancement(data) {
    return !data.enhanced || 
           !data.lastUpdated ||
           (data.lastUpdated && new Date() - new Date(data.lastUpdated) > 24 * 60 * 60 * 1000);
}

/**
 * ✨ Migliora dati conversazione
 */
function enhanceConversationData(data) {
    const enhancements = {
        enhanced: true,
        lastUpdated: new Date().toISOString(),
        messageCount: data.messages?.length || 0
    };

    // Migliora topic se generico
    if (!data.topic || data.topic === 'Generale' || data.topic === 'Non classificato') {
        if (data.messages?.length > 0) {
            enhancements.topic = extractTopicFromMessages(data.messages);
        }
    }

    // Aggiungi snippet se mancante
    if (!data.lastMessageSnippet && data.messages?.length > 0) {
        const lastMsg = data.messages[data.messages.length - 1];
        const text = lastMsg.message || lastMsg.text || lastMsg.content || '';
        enhancements.lastMessageSnippet = text.length > 100 ? text.substring(0, 100) + '...' : text;
    }

    return enhancements;
}

/**
 * 🎯 Estrae topic dai messaggi
 */
function extractTopicFromMessages(messages) {
    const allText = messages
        .filter(msg => msg.role === 'user' || msg.sender === 'user')
        .map(msg => (msg.message || msg.text || msg.content || '').toLowerCase())
        .join(' ');

    const topics = {
        'Allenamento Glutei': ['glutei', 'sedere', 'lato b'],
        'Allenamento': ['allenamento', 'esercizi', 'workout', 'palestra', 'fitness'],
        'Alimentazione': ['dieta', 'alimentazione', 'cibo', 'nutrizione'],
        'Motivazione': ['motivazione', 'difficoltà', 'aiuto', 'supporto'],
        'Obiettivi': ['obiettivo', 'perdere peso', 'dimagrire', 'tonificare'],
        'Prezzi': ['prezzo', 'costo', 'quanto', 'tariffe'],
        'Programmi': ['programma', 'piano', 'scheda']
    };

    for (const [topic, keywords] of Object.entries(topics)) {
        if (keywords.some(keyword => allText.includes(keyword))) {
            return topic;
        }
    }

    return 'Generale';
}

/**
 * 🆕 Crea conversazione di test
 */
async function createTestConversation() {
    try {
        const now = new Date();
        const conversationId = `manual_${now.getTime()}`;

        // Esempi di conversazioni realistiche
        const sampleConversations = [
            {
                customerName: 'Sofia M.',
                topic: 'Allenamento Glutei',
                messages: [
                    { role: 'user', message: 'Ciao! Vorrei dei consigli per allenare i glutei efficacemente' },
                    { role: 'assistant', message: 'Ciao Sofia! Per allenare i glutei ti consiglio squat, affondi e hip thrust. Quante volte a settimana ti alleni?' },
                    { role: 'user', message: 'Attualmente 2-3 volte, ma vorrei risultati più veloci' }
                ]
            },
            {
                customerName: 'Marco R.',
                topic: 'Alimentazione',
                messages: [
                    { role: 'user', message: 'Salve, sto cercando consigli per migliorare la mia alimentazione' },
                    { role: 'assistant', message: 'Ciao Marco! Sono qui per aiutarti. Qual è il tuo obiettivo principale?' },
                    { role: 'user', message: 'Vorrei perdere peso ma mantenere la massa muscolare' }
                ]
            },
            {
                customerName: 'Anna L.',
                topic: 'Motivazione', 
                messages: [
                    { role: 'user', message: 'Mi sento sempre stanca e senza energie per allenarmi' },
                    { role: 'assistant', message: 'Capisco Anna, è normale sentirsi così. Partiamo con piccoli passi. Che tipo di attività ti piace?' },
                    { role: 'user', message: 'Mi piace camminare e fare yoga, ma non riesco ad essere costante' }
                ]
            }
        ];

        const randomSample = sampleConversations[Math.floor(Math.random() * sampleConversations.length)];

        const testConversation = {
            id: conversationId,
            customerName: randomSample.customerName,
            customerPhone: null,
            topic: randomSample.topic,
            source: 'Import Manuale',
            dateCreated: now.toISOString(),
            lastActivity: now.toISOString(),
            messages: randomSample.messages.map((msg, index) => ({
                id: index,
                ...msg,
                sender: msg.role,
                text: msg.message,
                timestamp: new Date(now.getTime() + index * 60000).toISOString()
            })),
            messageCount: randomSample.messages.length,
            lastMessageSnippet: randomSample.messages[randomSample.messages.length - 1].message,
            isActive: false,
            manualImport: true,
            enhanced: true,
            lastUpdated: now.toISOString()
        };

        await db.collection('conversations').doc(conversationId).set(testConversation);
        console.log('✅ Conversazione di test creata:', conversationId);
        
        return testConversation;

    } catch (error) {
        console.error('❌ Errore creazione test conversation:', error);
        return null;
    }
}