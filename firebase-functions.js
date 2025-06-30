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
        console.error('❌ Errore recupero quiz results:', error);
        return [];
    }
}

// === GESTIONE LEADS ===
export async function getLeads() {
    try {
        console.log('👥 Recupero tutti i leads...');
        const leadsCol = collection(db, 'leads');
        const leadSnapshot = await getDocs(leadsCol);
        const leadsList = leadSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        console.log(`👥 Leads trovati: ${leadsList.length}`);
        return leadsList;
    } catch (error) {
        console.error('❌ Errore recupero leads:', error);
        return [];
    }
}

export async function addLead(leadData) {
    try {
        const docRef = await addDoc(collection(db, 'leads'), {
            ...leadData,
            timestamp: serverTimestamp()
        });
        console.log('✅ Lead aggiunto con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore aggiunta lead:', error);
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

export async function getMetrics() {
    try {
        console.log('📈 Recupero metrics...');
        const q = query(collection(db, 'metrics'), orderBy('timestamp', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        console.log(`📈 Metrics trovati: ${results.length}`);
        return results;
    } catch (error) {
        console.error('❌ Errore recupero metrics:', error);
        return [];
    }
}

// === LISTENERS REAL-TIME ===
export function setupQuizListener(callback) {
    console.log('🔄 Attivando listener per quiz_results...');
    
    try {
        const q = query(
            collection(db, 'quiz_results'),
            orderBy('timestamp', 'desc'),
            limit(100)
        );
        
        return onSnapshot(q, (snapshot) => {
            console.log(`📊 Quiz listener: ${snapshot.size} documenti ricevuti`);
            const results = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            callback(results);
        }, (error) => {
            console.error('❌ Errore listener quiz:', error);
            // Ritorna array vuoto in caso di errore
            callback([]);
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
            limit(100)
        );
        
        return onSnapshot(q, (snapshot) => {
            console.log(`👥 Leads listener: ${snapshot.size} documenti ricevuti`);
            const results = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            callback(results);
        }, (error) => {
            console.error('❌ Errore listener leads:', error);
            callback([]);
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
            console.log(`📈 Metrics listener: ${snapshot.size} documenti ricevuti`);
            const results = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            callback(results);
        }, (error) => {
            console.error('❌ Errore listener metrics:', error);
            callback([]);
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
        const date = timestamp instanceof Date ? timestamp : 
                    timestamp.toDate ? timestamp.toDate() : 
                    new Date(timestamp);
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
        case 'Guerriero Determinato': return '💪';
        case 'Atleta Avanzato': return '🏆';
        case 'Guerriero': return '⚔️';
        case 'Atleta': return '🏆';
        default: return '👤';
    }
}

// === CALCOLO LEAD SCORE ===
export function calculateLeadScore(quizData) {
    let score = 0;
    
    // Se già presente, ritorna quello esistente
    if (quizData.score || quizData.lead_score) {
        return quizData.score || quizData.lead_score;
    }
    
    // Score basato su esperienza (30 punti max)
    switch(quizData.experience) {
        case 'avanzato': 
        case 'Avanzato': score += 30; break;
        case 'intermedio': 
        case 'Intermedio': score += 20; break;
        case 'principiante': 
        case 'Principiante Assoluto': score += 10; break;
    }
    
    // Score basato su obiettivi (25 punti max)
    if (quizData.goals && Array.isArray(quizData.goals)) {
        score += Math.min(quizData.goals.length * 4, 20);
        if (quizData.goals.includes('perdere_peso') || quizData.goals.includes('Perdita Peso')) score += 3;
        if (quizData.goals.includes('aumentare_massa') || quizData.goals.includes('Aumento Massa Muscolare')) score += 2;
    }
    
    // Score basato su frequenza (20 punti max)
    switch(quizData.frequency) {
        case '5+':
        case '5-6': score += 20; break;
        case '3-4': score += 15; break;
        case '1-2': score += 10; break;
    }
    
    // Score basato su sfide/ostacoli (15 punti max)
    if (quizData.challenges && Array.isArray(quizData.challenges)) {
        score += Math.min(quizData.challenges.length * 2, 10);
    }
    if (quizData.obstacles && Array.isArray(quizData.obstacles)) {
        score += Math.min(quizData.obstacles.length * 2, 10);
    }
    
    // Bonus completezza dati (10 punti max)
    if (quizData.email && quizData.email.length > 0) score += 5;
    if (quizData.name && quizData.name.length > 0) score += 3;
    if (quizData.city && quizData.city.length > 0) score += 2;
    
    // Score per livello attività
    if (quizData.activity_level) {
        switch(quizData.activity_level) {
            case 'Molto attivo': score += 15; break;
            case 'Moderatamente attivo': score += 10; break;
            case 'Lievemente attivo': score += 5; break;
        }
    }
    
    // Compatibilità con vecchi quiz
    if (quizData.goals?.includes('Preparazione atletica specifica')) score += 30;
    if (quizData.goals?.includes('Aumentare massa muscolare')) score += 25;
    if (quizData.goals?.includes('Perdere peso e dimagrire')) score += 20;
    if (quizData.training_style === 'Con personal trainer') score += 15;
    if (quizData.diet === 'Eccellente (molto attento, pianifico i pasti, pochi sgarri)') score += 10;
    
    return Math.min(Math.max(score, 0), 100);
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
        return true;
    } catch (error) {
        console.error('❌ Errore aggiunta nota lead:', error);
        throw error;
    }
}