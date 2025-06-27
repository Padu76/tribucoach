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

export async function addLead(leadData) {
    try {
        const docRef = await addDoc(collection(db, 'leads'), {
            ...leadData, // Mantiene i dati esistenti
            timestamp: serverTimestamp() // AGGIUNTA: Aggiunge il timestamp del server per la consistenza
        });
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore aggiunta lead:', error);
        throw error;
    }
}

export async function updateLead(id, newData) {
    try {
        const leadRef = doc(db, 'leads', id);
        await updateDoc(leadRef, newData);
    } catch (error) {
        console.error('❌ Errore aggiornamento lead:', error);
        throw error;
    }
}

export async function deleteLead(id) {
    try {
        const leadRef = doc(db, 'leads', id);
        await deleteDoc(leadRef);
    } catch (error) {
        console.error('❌ Errore eliminazione lead:', error);
        throw error;
    }
}

// === GESTIONE METRICS ===
export async function saveMetrics(metricsData) {
    try {
        const docRef = await addDoc(collection(db, 'metrics'), {
            ...metricsData,
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore salvataggio metrics:', error);
        throw error;
    }
}

// === LISTENERS REAL-TIME ===
export function setupQuizListener(callback) {
    console.log('🔄 Attivando listener per quiz_results...');

    try {
        const q = query(
            collection(db, 'quiz_results'),
            orderBy('timestamp', 'desc'),
            limit(50)  // Aumentato il limite per vedere più dati
        );

        return onSnapshot(q, (snapshot) => {
            console.log('📊 Dati quiz ricevuti:', snapshot.size, 'documenti');
            callback(snapshot);
        }, (error) => {
            console.error('❌ Errore listener quiz:', error);
        });
    } catch (error) {
        console.error('❌ Errore setup listener quiz:', error);
        return () => {}; // Funzione vuota per unsubscribe
    }
}

export function setupLeadsListener(callback) {
    console.log('🔄 Attivando listener per leads...');

    try {
        const q = query(
            collection(db, 'leads'),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        return onSnapshot(q, (snapshot) => {
            console.log('👥 Dati leads ricevuti:', snapshot.size, 'documenti');
            callback(snapshot);
        }, (error) => {
            console.error('❌ Errore listener leads:', error);
        });
    } catch (error) {
        console.error('❌ Errore setup listener leads:', error);
        return () => {};
    }
}

export function setupMetricsListener(callback) {
    console.log('🔄 Attivando listener per metrics...');

    try {
        const q = query(
            collection(db, 'metrics'),
            orderBy('timestamp', 'desc'),
            limit(10)
        );

        return onSnapshot(q, (snapshot) => {
            console.log('📈 Dati metrics ricevuti:', snapshot.size, 'documenti');
            callback(snapshot);
        }, (error) => {
            console.error('❌ Errore listener metrics:', error);
        });
    } catch (error) {
        console.error('❌ Errore setup listener metrics:', error);
        return () => {};
    }
}

// === UTILITY FUNCTIONS ===
export function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';

    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('it-IT');
    } catch (error) {
        console.error('❌ Errore formattazione data:', error);
        return 'Data non valida';
    }
}

export function calculateTrend(current, previous) {
    if (!previous || previous === 0) return { value: 0, isPositive: true };

    const change = ((current - previous) / previous) * 100;
    return {
        value: Math.abs(change).toFixed(1),
        isPositive: change >= 0
    };
}

export function getProfileIcon(profileType) {
    switch(profileType) {
        case 'Nuovo Esploratore': return '🌱';
        case 'Guerriero': return '⚔️';
        case 'Atleta': return '🏆';
        default: return '👤';
    }
}

// === CALCOLO LEAD SCORE (SINCRONIZZATO CON QUIZ) ===
export function calculateLeadScore(quizData) {
    let score = 0;

    // Punteggio basato su Obiettivi Principali (goals)
    if (quizData.goals?.includes('perdita_peso_grasso') || quizData.goals?.includes('Perdere peso e dimagrire')) score += 20;
    if (quizData.goals?.includes('aumento_massa_muscolare') || quizData.goals?.includes('Aumentare massa muscolare')) score += 25;
    if (quizData.goals?.includes('tonificazione_generale') || quizData.goals?.includes('Definire il corpo')) score += 15;
    if (quizData.goals?.includes('aumento_forza') || quizData.goals?.includes('Migliorare la forza')) score += 10;
    if (quizData.goals?.includes('miglioramento_resistenza') || quizData.goals?.includes('Migliorare la resistenza')) score += 10;
    if (quizData.goals?.includes('benessere_salute') || quizData.goals?.includes('Avere più energia e benessere')) score += 5;
    if (quizData.goals?.includes('Preparazione atletica specifica')) score += 30;

    // Punteggio basato su Attività Fisica
    if (quizData.activity_level === 'Molto attivo (5+ allenamenti intensi)') score += 20;
    if (quizData.activity_level === 'Moderatamente attivo (3-4 allenamenti)') score += 15;
    if (quizData.activity_level === 'Leggermente attivo (1-2 allenamenti leggeri)') score += 5;

    // Punteggio basato su Alimentazione
    if (quizData.diet === 'Eccellente (molto attento, pianifico i pasti, pochi sgarri)') score += 10;
    if (quizData.diet === 'Buona (generalmente equilibrata e consapevole)') score += 7;
    if (quizData.diet === 'Discreta (cerco di mangiare sano, ma con sgarri)') score += 3;

    // Punteggio basato su Personal Trainer
    if (quizData.training_style === 'Con personal trainer') score += 8;
    if (quizData.training_style === 'Entrambi') score += 12;
    if (quizData.training_style === 'Mi alleno da solo') score += 5;

    // Punteggio basato su Durata Allenamento
    if (quizData.workout_duration === 'Più di un\'ora') score += 10;
    if (quizData.workout_duration === '45-60 minuti') score += 8;
    if (quizData.workout_duration === '30-45 minuti') score += 5;

    // Punteggio basato su Ostacoli
    if (quizData.obstacles?.includes('Non ho ostacoli particolari')) score += 10;
    if (quizData.obstacles?.includes('Mancanza di motivazione')) score -= 5;

    // Assicurati che il punteggio sia tra 0 e 100
    return Math.min(Math.max(score, 0), 100);
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
        console.log('📊 Quiz trovati:', results.length);
        return results;
    } catch (error) {
        console.error('❌ Errore recupero quiz:', error);
        return [];
    }
}