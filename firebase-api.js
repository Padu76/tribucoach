// firebase-api.js - API Functions per TribuCoach Dashboard
import { db } from './firebase-config.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// === CONFIGURAZIONE ANTI-QUOTA ===
const QUERY_LIMITS = {
    quiz_results: 50,      // Limitiamo a 50 quiz recenti
    leads: 50,
    conversations: 30,
    events: 20,
    users: 30
};

let lastFetchTime = {};
const CACHE_DURATION = 30000; // 30 secondi cache

// === UTILITY PER CACHE ===
function shouldFetch(collectionName) {
    const now = Date.now();
    const lastFetch = lastFetchTime[collectionName] || 0;
    return (now - lastFetch) > CACHE_DURATION;
}

function updateFetchTime(collectionName) {
    lastFetchTime[collectionName] = Date.now();
}

// === QUIZ RESULTS ===
export async function getAllQuizResults() {
    try {
        if (!shouldFetch('quiz_results')) {
            console.log('📊 Quiz results cache valida, salto fetch');
            return [];
        }

        console.log('📊 Recupero quiz results da Firebase...');
        const q = query(
            collection(db, 'quiz_results'),
            orderBy('timestamp', 'desc'),
            limit(QUERY_LIMITS.quiz_results)
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        updateFetchTime('quiz_results');
        console.log(`✅ Quiz results caricati: ${results.length}`);
        return results;
    } catch (error) {
        console.error('❌ Errore recupero quiz results:', error);
        return [];
    }
}

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

// === LEADS ===
export async function getLeads() {
    try {
        if (!shouldFetch('leads')) {
            console.log('👥 Leads cache valida, salto fetch');
            return [];
        }

        console.log('👥 Recupero leads da Firebase...');
        const q = query(
            collection(db, 'leads'),
            orderBy('timestamp', 'desc'),
            limit(QUERY_LIMITS.leads)
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        updateFetchTime('leads');
        console.log(`✅ Leads caricati: ${results.length}`);
        return results;
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

// === CONVERSAZIONI CHATBOT ===
export async function getChatbotConversations() {
    try {
        if (!shouldFetch('conversations')) {
            console.log('💬 Conversations cache valida, salto fetch');
            return [];
        }

        console.log('💬 Recupero conversazioni chatbot...');
        const q = query(
            collection(db, 'chatbot_conversations'),
            orderBy('created_at', 'desc'),
            limit(QUERY_LIMITS.conversations)
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            created_at: doc.data().created_at?.toDate() || new Date()
        }));
        
        updateFetchTime('conversations');
        console.log(`✅ Conversazioni caricate: ${results.length}`);
        return results;
    } catch (error) {
        console.error('❌ Errore recupero conversazioni:', error);
        return [];
    }
}

// === UTENTI ===
export async function getUsers() {
    try {
        if (!shouldFetch('users')) {
            console.log('👤 Users cache valida, salto fetch');
            return [];
        }

        console.log('👤 Recupero utenti...');
        const q = query(
            collection(db, 'users'),
            orderBy('created_at', 'desc'),
            limit(QUERY_LIMITS.users)
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            created_at: doc.data().created_at?.toDate() || new Date()
        }));
        
        updateFetchTime('users');
        console.log(`✅ Utenti caricati: ${results.length}`);
        return results;
    } catch (error) {
        console.error('❌ Errore recupero utenti:', error);
        return [];
    }
}

// === LISTENERS REAL-TIME (OTTIMIZZATI) ===
export function setupQuizListener(callback, useRealtime = false) {
    if (!useRealtime) {
        // Modalità polling invece di real-time per ridurre quota
        const pollInterval = setInterval(async () => {
            try {
                const results = await getAllQuizResults();
                callback(results);
            } catch (error) {
                console.error('❌ Errore polling quiz:', error);
            }
        }, 60000); // Poll ogni minuto invece di real-time

        // Ritorna funzione per fermare polling
        return () => clearInterval(pollInterval);
    } else {
        // Real-time listener (usa con cautela)
        console.log('🔄 Attivando listener real-time per quiz...');
        const q = query(
            collection(db, 'quiz_results'),
            orderBy('timestamp', 'desc'),
            limit(10) // Limit molto basso per real-time
        );
        
        return onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            callback(results);
        }, (error) => {
            console.error('❌ Errore listener quiz:', error);
            callback([]);
        });
    }
}

// === BATCH OPERATIONS ===
export async function batchSaveQuizResults(quizArray) {
    try {
        const batch = writeBatch(db);
        const quizCollection = collection(db, 'quiz_results');
        
        quizArray.forEach((quiz) => {
            const docRef = doc(quizCollection);
            batch.set(docRef, {
                ...quiz,
                timestamp: serverTimestamp()
            });
        });
        
        await batch.commit();
        console.log(`✅ Batch salvato: ${quizArray.length} quiz`);
        return true;
    } catch (error) {
        console.error('❌ Errore batch save:', error);
        throw error;
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

export function calculateLeadScore(quizData) {
    let score = quizData.score || quizData.lead_score || 0;
    
    // Se il punteggio non è presente, calcolalo
    if (!score) {
        if (quizData.goals?.includes('Preparazione atletica specifica')) score += 30;
        if (quizData.goals?.includes('Aumentare massa muscolare')) score += 25;
        if (quizData.goals?.includes('Perdere peso e dimagrire')) score += 20;
        if (quizData.activity_level === 'Molto attivo (5+ allenamenti intensi)') score += 20;
        if (quizData.training_style === 'Con personal trainer') score += 15;
        if (quizData.diet === 'Eccellente (molto attento, pianifico i pasti, pochi sgarri)') score += 10;
    }
    
    return Math.min(Math.max(score, 0), 100);
}

export function getProfileIcon(profile) {
    switch(profile) {
        case 'Nuovo Esploratore': return '🌱';
        case 'Guerriero': return '⚔️';
        case 'Atleta': return '🏆';
        default: return '👤';
    }
}

// === TEST CONNECTION ===
export async function testConnection() {
    try {
        console.log('🔍 Test connessione Firebase API...');
        // Test molto leggero
        const testQuery = query(collection(db, 'quiz_results'), limit(1));
        const snapshot = await getDocs(testQuery);
        console.log('✅ Connessione API OK - Documenti trovati:', snapshot.size);
        return true;
    } catch (error) {
        console.error('❌ Errore connessione Firebase API:', error);
        return false;
    }
}

// === CLEAR CACHE ===
export function clearCache() {
    lastFetchTime = {};
    console.log('🧹 Cache Firebase pulita');
}