// firebase-functions.js - Funzioni helper per TribuCoach Dashboard
import { db } from './firebase.js';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot, // AGGIUNTO per listener in tempo reale
    serverTimestamp,
    arrayUnion
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// === GESTIONE QUIZ RESULTS ===
export async function saveQuizResult(quizData) {
    try {
        const docRef = await addDoc(collection(db, 'quiz_results'), {
            ...quizData,
            timestamp: serverTimestamp()
        });

        console.log('✅ Quiz salvato con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore salvataggio quiz:', error);
        throw error;
    }
}

export async function getAllQuizResults() {
    try {
        console.log('📊 Recupero tutti i quiz results...');
        const q = query(collection(db, 'quiz_results'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        console.log(`📊 Quiz trovati: ${results.length}`);
        return results;
    } catch (error) {
        console.error('❌ Errore recupero quiz:', error);
        return [];
    }
}

// === GESTIONE LEADS ===
// Questa funzione dovrebbe essere aggiornata per salvare i leads derivati dai quiz
export async function saveLead(leadData) {
    try {
        const docRef = await addDoc(collection(db, 'leads'), {
            ...leadData,
            timestamp: serverTimestamp()
        });
        console.log('✅ Lead salvato con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore salvataggio lead:', error);
        throw error;
    }
}

export async function getLeads() {
    try {
        console.log('🤝 Recupero tutti i leads...');
        const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const leads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        console.log(`🤝 Leads trovati: ${leads.length}`);
        return leads;
    } catch (error) {
        console.error('❌ Errore recupero leads:', error);
        return [];
    }
}

export function setupLeadsListener(callback) {
    console.log('👂 Configurazione listener in tempo reale per leads...');
    const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const leads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        console.log(`🔄 Aggiornamento in tempo reale: ${leads.length} leads.`);
        callback(leads);
    }, (error) => {
        console.error('❌ Errore listener leads:', error);
    });
    return unsubscribe;
}

// === GESTIONE CONVERSAZIONI CHATBOT (NUOVE FUNZIONI) ===
export async function getChatbotConversations() {
    try {
        console.log('💬 Recupero tutte le conversazioni chatbot da Firestore...');
        // Ordina per timestamp in ordine decrescente (più recenti prima)
        const q = query(collection(db, 'chatbot_conversations'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const conversations = snapshot.docs.map(doc => ({
            id: doc.id, // L'ID del documento è l'ID della conversazione di Chatbase
            ...doc.data(),
            // Assicurati che i timestamp siano oggetti Date per una facile manipolazione nel frontend
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        console.log(`💬 Conversazioni chatbot trovate: ${conversations.length}`);
        return conversations;
    } catch (error) {
        console.error('❌ Errore recupero conversazioni chatbot da Firestore:', error);
        return [];
    }
}

// Funzione per impostare un listener in tempo reale sulle conversazioni (opzionale ma consigliato per dashboard)
export function setupChatbotConversationsListener(callback) {
    console.log('👂 Configurazione listener in tempo reale per conversazioni chatbot...');
    const q = query(collection(db, 'chatbot_conversations'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        console.log(`🔄 Aggiornamento in tempo reale: ${conversations.length} conversazioni chatbot.`);
        callback(conversations);
    }, (error) => {
        console.error('❌ Errore listener conversazioni chatbot:', error);
    });
    return unsubscribe;
}


// === FUNZIONI DI UTILITY ===
export function formatDateTime(date) {
    if (!date) return 'N/D';
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Date(date).toLocaleString('it-IT', options);
}

export function calculateLeadScore(quizData) {
    let score = 0;
    if (quizData) {
        // Logica di scoring basata sui dati del quiz
        // Esempio:
        if (quizData.goals?.includes('Preparazione atletica specifica')) score += 30;
        if (quizData.goals?.includes('Aumentare massa muscolare')) score += 25;
        if (quizData.goals?.includes('Perdere peso e dimagrire')) score += 20;
        if (quizData.activity_level === 'Molto attivo (5+ allenamenti intensi)') score += 20;
        if (quizData.training_style === 'Con personal trainer') score += 15;
        if (quizData.diet === 'Eccellente (molto attento, pianifico i pasti, pochi sgarri)') score += 10;
    }

    return Math.min(Math.max(score, 0), 100);
}

export function getProfileIcon(email) {
    if (!email) {
        return 'https://via.placeholder.com/40/007bff/FFFFFF?text=U'; // Icona generica se non c'è email
    }
    // Esempio: Icona basata sulla prima lettera dell'email
    const firstLetter = email.charAt(0).toUpperCase();
    const bgColor = '#007bff'; // Un colore di sfondo
    const textColor = 'FFFFFF'; // Colore del testo
    return `https://via.placeholder.com/40/${bgColor.substring(1)}/${textColor}?text=${firstLetter}`;
}

// === FUNZIONI DI DEBUG ===
export async function testConnection() {
    try {
        console.log('🔍 Test connessione Firebase...');
        const testQuery = query(collection(db, 'quiz_results'), limit(1));
        const snapshot = await getDocs(testQuery);
        console.log('✅ Connessione OK - Documenti trovati:', snapshot.size);
        return true;
    } catch (error) {
        console.error('❌ Errore connessione Firebase:', error);
        return false;
    }
}

// === NOTE LEAD ===
export async function addLeadNote(leadId, noteContent) {
    try {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, {
            notes: arrayUnion({
                content: noteContent,
                timestamp: serverTimestamp()
            })
        });
        console.log('✅ Nota aggiunta al lead con ID:', leadId);
        return true;
    } catch (error) {
        console.error('❌ Errore aggiunta nota lead:', error);
        return false;
    }
}