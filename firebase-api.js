import { db } from './firebase.js'; // Assicurati sia presente in alto al file
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
