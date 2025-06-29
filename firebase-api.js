/**
 * Recupera le conversazioni chatbot da Firebase (fallback)
 * @returns {Array} Array delle conversazioni
 */
export async function getChatbotConversations() {
    try {
        if (!db) {
            await initFirebase();
        }
        
        // 🔥 FIX: Cambiato da 'chatbot_conversations' a 'conversations'
        const querySnapshot = await db.collection('conversations').get();
        const conversations = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Estrai il primo messaggio utente per l'anteprima
            const firstUserMessage = data.messages?.find(msg => msg.role === 'user')?.message || 'Nessun messaggio';
            
            conversations.push({
                id: doc.id,
                lastMessageSnippet: firstUserMessage.substring(0, 100) + '...',
                topic: data.topic || 'Non classificato',
                timestamp: data.dateCreated || data.lastMessageAt || new Date(),
                messages: data.messages || [],
                customer: data.customerName || 'Cliente Anonimo',
                phone: data.customerPhone || null,
                sentiment: data.sentiment || 'Neutro',
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