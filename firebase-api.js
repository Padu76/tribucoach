// firebase-api.js - COMPLETO con integrazione Firestore
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, limit, doc, writeBatch, serverTimestamp, where } from 'firebase/firestore';

const CHATBASE_API_KEY = 'cb-65WEWJ5sO5BQqJxe2D9Nz'; 
const CHATBOT_ID = '6XGJOBdCvLj0SagfRG96p';

// ✅ FUNCTION AGGIORNATA: Legge da API E salva su Firestore
export async function getChatbotConversationsFromAPI() {
  console.log('🚀 Inizio recupero conversazioni da Chatbase API...');
  
  try {
    // 1. FETCH dalle API Chatbase
    const response = await fetch('https://www.chatbase.co/api/v1/get-conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHATBASE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatbotId: CHATBOT_ID,
        page: 1,
        limit: 50 // Recupera ultime 50 conversazioni
      })
    });

    if (!response.ok) {
      throw new Error(`Errore API Chatbase: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Dati ricevuti da Chatbase:', data);

    // 2. CONTROLLA se ci sono conversazioni
    if (!data.conversations || data.conversations.length === 0) {
      console.log('⚠️ Nessuna conversazione trovata');
      return { success: true, imported: 0, message: 'Nessuna nuova conversazione' };
    }

    // 3. PREPARA i dati per Firestore (formato compatibile con dashboard)
    const conversationsToSave = [];
    
    for (const conversation of data.conversations) {
      // Estrai informazioni dal cliente
      const customerName = extractCustomerName(conversation.messages) || 'Cliente Anonimo';
      const customerPhone = extractCustomerPhone(conversation.messages) || null;
      const customerEmail = extractCustomerEmail(conversation.messages) || null;
      
      // Formatta per la dashboard
      const firestoreDoc = {
        // Campi richiesti dalla dashboard
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        topic: conversation.topic || 'Conversazione generale',
        messages: conversation.messages || [],
        
        // Metadati
        chatbaseId: conversation.id,
        timestamp: serverTimestamp(),
        lastMessageAt: conversation.lastMessageAt ? new Date(conversation.lastMessageAt) : new Date(),
        source: 'chatbase-api',
        importedAt: new Date().toISOString(),
        
        // Campi aggiuntivi utili
        messagesCount: conversation.messages ? conversation.messages.length : 0,
        status: conversation.status || 'active'
      };
      
      conversationsToSave.push(firestoreDoc);
    }

    // 4. VERIFICA duplicati (controlla se conversation esiste già)
    const existingQuery = query(
      collection(db, 'chatbot_conversations'),
      where('source', '==', 'chatbase-api'),
      limit(100)
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    const existingIds = new Set();
    existingSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.chatbaseId) {
        existingIds.add(data.chatbaseId);
      }
    });

    // 5. FILTRA conversazioni nuove
    const newConversations = conversationsToSave.filter(conv => 
      !existingIds.has(conv.chatbaseId)
    );

    if (newConversations.length === 0) {
      console.log('✅ Nessuna nuova conversazione da importare');
      return { success: true, imported: 0, message: 'Tutte le conversazioni sono già presenti' };
    }

    // 6. SALVA in batch su Firestore
    console.log(`💾 Salvataggio ${newConversations.length} nuove conversazioni su Firestore...`);
    
    const batch = writeBatch(db);
    const chatbotCollection = collection(db, 'chatbot_conversations');
    
    newConversations.forEach(conversation => {
      const docRef = doc(chatbotCollection);
      batch.set(docRef, conversation);
    });
    
    await batch.commit();
    
    console.log(`✅ ${newConversations.length} conversazioni salvate con successo!`);
    
    return {
      success: true,
      imported: newConversations.length,
      total: data.conversations.length,
      message: `Importate ${newConversations.length} nuove conversazioni`
    };

  } catch (error) {
    console.error('❌ Errore durante import da Chatbase:', error);
    return {
      success: false,
      error: error.message,
      imported: 0
    };
  }
}

// ✅ UTILITY: Estrae nome cliente dai messaggi
function extractCustomerName(messages) {
  if (!messages || !Array.isArray(messages)) return null;
  
  for (const message of messages) {
    if (message.role === 'user' && message.content) {
      // Pattern per riconoscere il nome
      const patterns = [
        /(?:mi chiamo|sono|il mio nome è)\s+([a-zA-ZÀ-ÿ\s]{2,25})/i,
        /(?:nome|chiamami)\s+([a-zA-ZÀ-ÿ\s]{2,25})/i
      ];
      
      for (const pattern of patterns) {
        const match = message.content.match(pattern);
        if (match) {
          return match[1].trim();
        }
      }
    }
  }
  
  // Fallback: usa primo messaggio utente se breve
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage && firstUserMessage.content && firstUserMessage.content.length < 30) {
    return firstUserMessage.content.trim();
  }
  
  return null;
}

// ✅ UTILITY: Estrae telefono dai messaggi
function extractCustomerPhone(messages) {
  if (!messages || !Array.isArray(messages)) return null;
  
  for (const message of messages) {
    if (message.role === 'user' && message.content) {
      // Pattern per numeri di telefono
      const patterns = [
        /(\+39\s?)?(\d{3}[\s-]?\d{3}[\s-]?\d{4})/,
        /(\+39\s?)?(\d{10})/,
        /(39\s?)(\d{10})/
      ];
      
      for (const pattern of patterns) {
        const match = message.content.match(pattern);
        if (match) {
          let phone = match[0].replace(/[\s-]/g, '');
          if (!phone.startsWith('+39')) {
            phone = '+39' + phone.replace(/^39/, '');
          }
          return phone;
        }
      }
    }
  }
  
  return null;
}

// ✅ UTILITY: Estrae email dai messaggi
function extractCustomerEmail(messages) {
  if (!messages || !Array.isArray(messages)) return null;
  
  for (const message of messages) {
    if (message.role === 'user' && message.content) {
      const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
      const match = message.content.match(emailPattern);
      if (match) {
        return match[1];
      }
    }
  }
  
  return null;
}

// ✅ FUNCTION: Trigger import manuale (per testing)
export async function triggerManualImport() {
  console.log('🔧 Trigger import manuale...');
  return await getChatbotConversationsFromAPI();
}

// ✅ FUNCTION: Verifica connessione API
export async function testChatbaseConnection() {
  try {
    const response = await fetch('https://www.chatbase.co/api/v1/get-conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHATBASE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatbotId: CHATBOT_ID,
        page: 1,
        limit: 1
      })
    });

    return {
      success: response.ok,
      status: response.status,
      message: response.ok ? 'Connessione OK' : 'Errore connessione'
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ✅ FUNCTION: Statistiche import
export async function getImportStats() {
  try {
    const q = query(
      collection(db, 'chatbot_conversations'),
      where('source', '==', 'chatbase-api'),
      orderBy('importedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const conversations = [];
    
    snapshot.forEach(doc => {
      conversations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      total: conversations.length,
      lastImport: conversations.length > 0 ? conversations[0].importedAt : null,
      conversations: conversations.slice(0, 10) // Ultime 10
    };
    
  } catch (error) {
    console.error('Errore statistiche:', error);
    return { total: 0, lastImport: null, conversations: [] };
  }
}