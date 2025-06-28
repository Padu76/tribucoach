// firebase-api.js - Funzioni per interagire con Firebase Firestore
import { db } from './firebase-config.js'; // Assicurati che firebase-config.js sia corretto
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    orderBy,
    limit,
    serverTimestamp,
    arrayUnion,
    onSnapshot,
    where,
    getDoc // *** Importante: Assicurati che getDoc sia qui! ***
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
        console.log('📊 Recupero quiz results da Firebase...');
        const q = query(collection(db, 'quiz_results'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('✅ Quiz results caricati:', results.length);
        return results;
    } catch (error) {
        console.error('❌ Errore caricamento quiz results:', error);
        throw error;
    }
}

export async function getQuizResultById(id) {
    try {
        console.log('🔍 Recupero quiz result per ID:', id);
        const docRef = doc(db, 'quiz_results', id);
        const docSnap = await getDoc(docRef); // getDoc deve essere importato sopra
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("Nessun documento quiz trovato con ID:", id);
            return null;
        }
    } catch (error) {
        console.error("❌ Errore nel recupero del documento quiz:", error);
        throw error;
    }
}


// === GESTIONE CHATBOT CONVERSATIONS ===
export async function getChatbotConversations() {
    try {
        console.log('💬 Recupero conversazioni chatbot dalla collezione: chatbot_conversations...');
        // Modificato per puntare alla collezione 'chatbot_conversations'
        const q = query(collection(db, 'chatbot_conversations'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('✅ Conversazioni caricate:', results.length);
        return results;
    } catch (error) {
        console.error('❌ Errore caricamento conversazioni chatbot:', error);
        // Restituisci un array vuoto o ri-lancia l'errore a seconda della gestione desiderata
        return [];
    }
}

// === GESTIONE UTENTI (se hai una collezione utenti separata) ===
export async function getUsers() {
    try {
        console.log('👤 Recupero utenti...');
        // Devi sostituire 'users' con il nome della tua collezione utenti reale, se esiste.
        // Ad esempio: 'app_users', 'customers', ecc.
        const q = query(collection(db, 'users')); // Assumendo una collezione 'users'
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('✅ Utenti caricati:', results.length);
        return results;
    } catch (error) {
        console.error('❌ Errore caricamento utenti:', error);
        return [];
    }
}

// === FUNZIONI AGGIUNTIVE (Esempio) ===

// Puoi aggiungere qui altre funzioni se necessario

// === TEST DI CONNESSIONE ===
export async function testConnection() {
    try {
        console.log('🔍 Test connessione Firebase API...');
        // Test su una collezione esistente per verificare la connessione
        const testQuery = query(collection(db, 'quiz_results'), limit(1));
        const snapshot = await getDocs(testQuery);
        console.log('✅ Connessione API OK - Documenti trovati:', snapshot.size);
        return true;
    } catch (error) {
        console.error('❌ Errore connessione API Firebase:', error);
        return false;
    }
}