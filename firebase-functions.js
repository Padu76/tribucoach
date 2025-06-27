// firebase-functions.js - Funzioni helper per TribuCoach
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
    onSnapshot,
    serverTimestamp,
    arrayUnion
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'; // VERSIONE CORRETTA

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

// === GESTIONE LEADS ===
export async function getLeads() {
    try {
        const leadsCol = collection(db, 'leads');
        const leadSnapshot = await getDocs(leadsCol);
        const leadsList = leadSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return leadsList;
    } catch (error) {
        console.error('❌ Errore recupero leads:', error);
        throw error;
    }
}

export async function updateLead(leadId, newData) {
    try {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, newData);
        console.log('✅ Lead aggiornato con ID:', leadId);
        return true;
    } catch (error) {
        console.error('❌ Errore aggiornamento lead:', error);
        throw error;
    }
}

export async function deleteLead(leadId) {
    try {
        await deleteDoc(doc(db, 'leads', leadId));
        console.log('✅ Lead eliminato con ID:', leadId);
        return true;
    } catch (error) {
        console.error('❌ Errore eliminazione lead:', error);
        throw error;
    }
}

// Funzione per calcolare il punteggio lead in base alle risposte del quiz
export function calculateLeadScore(quizAnswers) {
    let score = 0;

    // Esempio di logica di punteggio (adatta alle tue esigenze)
    // Più domande rilevanti aggiungi, più preciso sarà il punteggio
    if (quizAnswers.goal && quizAnswers.goal.includes('Perdita di peso')) score += 20;
    if (quizAnswers.goal && quizAnswers.goal.includes('Massa muscolare')) score += 15;
    if (quizAnswers.goal && quizAnswers.goal.includes('Miglioramento performance')) score += 10;

    if (quizAnswers.budget === 'Alto (>€100/mese)') score += 30;
    else if (quizAnswers.budget === 'Medio (€50-100/mese)') score += 15;
    else if (quizAnswers.budget === 'Basso (<€50/mese)') score += 5;

    if (quizAnswers.timeAvailability === 'Molto disponibile (>5 ore/settimana)') score += 25;
    else if (quizAnswers.timeAvailability === 'Abbastanza disponibile (3-5 ore/settimana)') score += 10;
    else if (quizAnswers.timeAvailability === 'Poco disponibile (<3 ore/settimana)') score += 5;

    // Assicurati che il punteggio non superi 100
    return Math.min(score, 100);
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
        return true;
    } catch (error) {
        console.error('❌ Errore aggiunta nota lead:', error);
        throw error;
    }
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

export async function getAllQuizResults() {
    try {
        console.log('📊 Recupero tutti i quiz results...');
        const q = query(collection(db, 'quiz_results'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return results;
    } catch (error) {
        console.error('❌ Errore recupero quiz results:', error);
        throw error;
    }
}