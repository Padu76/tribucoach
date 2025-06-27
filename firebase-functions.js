// firebase-functions.js - Funzioni helper per TribuCoach
import { db, analytics } from './firebase.js'; // Questo importa le istanze inizializzate da firebase.js
import { // Queste importazioni devono essere dalla CDN
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
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

import { logEvent } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js';


// === GESTIONE QUIZ RESULTS ===
export async function saveQuizResult(quizData) {
    try {
        const docRef = await addDoc(collection(db, 'quiz_results'), {
            ...quizData,
            timestamp: serverTimestamp(),
            lead_score: calculateLeadScore(quizData)
        });
        
        // Log analytics
        logEvent(analytics, 'quiz_completed', {
            profile_type: quizData.profile,
            score: calculateLeadScore(quizData)
        });
        
        return docRef.id;
    } catch (error) {
        console.error('Errore salvataggio quiz:', error);
        throw error;
    }
}

export function calculateLeadScore(quizData) {
    let score = 0;
    
    // Base score per profilo
    switch(quizData.profile) {
        case 'Atleta': score += 30; break;
        case 'Guerriero': score += 25; break;
        case 'Nuovo Esploratore': score += 15; break;
    }
    
    // Score basato su obiettivi
    if (quizData.goals.includes('aumento_massa_muscolare')) score += 10;
    if (quizData.goals.includes('perdita_peso_grasso')) score += 10;
    if (quizData.goals.includes('aumento_forza')) score += 8;
    if (quizData.goals.includes('tonificazione_generale')) score += 7;
    if (quizData.goals.includes('miglioramento_resistenza')) score += 5;
    if (quizData.goals.includes('benessere_salute')) score += 5;

    // Score basato sull'esperienza (più un principiante è motivato a iniziare, più è un buon lead)
    switch(quizData.experience) {
        case 'principiante': score += 15; break; // I principianti motivati sono ottimi lead
        case 'intermedio': score += 10; break;
        case 'avanzato': score += 5; break;
    }

    // Score basato sulla frequenza (più si allena, più è impegnato)
    switch(quizData.frequency) {
        case '5-6': score += 10; break;
        case '3-4': score += 7; break;
        case '1-2': score += 3; break;
    }

    // Score basato sul luogo di allenamento (indica flessibilità o necessità specifica)
    switch(quizData.place) {
        case 'palestra': score += 5; break;
        case 'casa': score += 3; break;
        case 'all_aperto': score += 3; break;
        case 'misto': score += 7; break;
    }

    // Aggiustamenti finali o bonus
    // Esempio: bonus se ha un obiettivo specifico come "aumento forza" E si allena in "palestra"
    if (quizData.goals.includes('aumento_forza') && quizData.place === 'palestra') {
        score += 3;
    }
    
    // Assicurati che il punteggio non superi 100
    return Math.min(score, 100);
}


// === GESTIONE LEAD ===
export async function getLeads() {
    try {
        const q = query(
            collection(db, 'leads'),
            orderBy('score', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const leads = [];
        querySnapshot.forEach((doc) => {
            leads.push({ id: doc.id, ...doc.data() });
        });
        return leads;
    } catch (error) {
        console.error("Errore nel recupero dei leads:", error);
        throw error;
    }
}

export async function updateLeadStatus(leadId, newStatus) {
    try {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, {
            status: newStatus,
            updatedAt: serverTimestamp()
        });
        console.log(`Stato lead ${leadId} aggiornato a ${newStatus}`);
    } catch (error) {
        console.error("Errore nell'aggiornamento dello stato del lead:", error);
        throw error;
    }
}

export async function deleteLead(leadId) {
    try {
        await deleteDoc(doc(db, 'leads', leadId));
        console.log(`Lead ${leadId} eliminato.`);
    } catch (error) {
        console.error("Errore nell'eliminazione del lead:", error);
        throw error;
    }
}


// === METRICHE DASHBOARD ===
export async function getQuizMetrics() {
    try {
        // Query per il numero totale di quiz completati
        const quizSnapshot = await getDocs(collection(db, 'quiz_results'));
        const totalQuizzes = quizSnapshot.size;

        // Query per l'età media
        let totalAge = 0;
        let quizCountWithAge = 0;
        quizSnapshot.forEach(doc => {
            const age = doc.data().age;
            if (typeof age === 'number' && !isNaN(age)) {
                totalAge += age;
                quizCountWithAge++;
            }
        });
        const averageAge = quizCountWithAge > 0 ? (totalAge / quizCountWithAge).toFixed(1) : 0;

        // Query per i 3 obiettivi più comuni
        const goalCounts = {};
        quizSnapshot.forEach(doc => {
            const goals = doc.data().goals;
            if (Array.isArray(goals)) {
                goals.forEach(goal => {
                    goalCounts[goal] = (goalCounts[goal] || 0) + 1;
                });
            }
        });

        const sortedGoals = Object.entries(goalCounts).sort(([, countA], [, countB]) => countB - countA);
        const topGoals = sortedGoals.slice(0, 3).map(([goal, count]) => ({ goal, count }));

        // Query per i 3 profili più comuni
        const profileCounts = {};
        quizSnapshot.forEach(doc => {
            const profile = doc.data().profile;
            if (profile) {
                profileCounts[profile] = (profileCounts[profile] || 0) + 1;
            }
        });

        const sortedProfiles = Object.entries(profileCounts).sort(([, countA], [, countB]) => countB - countA);
        const topProfiles = sortedProfiles.slice(0, 3).map(([profile, count]) => ({ profile, count }));

        // Totale lead score
        let totalLeadScore = 0;
        let leadCountWithScore = 0;
        quizSnapshot.forEach(doc => {
            const score = doc.data().lead_score;
            if (typeof score === 'number' && !isNaN(score)) {
                totalLeadScore += score;
                leadCountWithScore++;
            }
        });
        const averageLeadScore = leadCountWithScore > 0 ? (totalLeadScore / leadCountWithScore).toFixed(1) : 0;
        
        return {
            totalQuizzes,
            averageAge: parseFloat(averageAge),
            topGoals,
            topProfiles,
            averageLeadScore: parseFloat(averageLeadScore)
        };
    } catch (error) {
        console.error("Errore nel recupero delle metriche del quiz:", error);
        throw error;
    }
}

export async function saveMetrics(metricsData) {
    try {
        const docRef = await addDoc(collection(db, 'metrics'), {
            ...metricsData,
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Errore salvataggio metriche:', error);
        throw error;
    }
}

export async function getLatestMetrics() {
    try {
        const q = query(
            collection(db, 'metrics'),
            orderBy('timestamp', 'desc'),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        }
        return null;
    } catch (error) {
        console.error("Errore nel recupero delle metriche più recenti:", error);
        throw error;
    }
}

// === LISTENER REAL-TIME ===
export function setupQuizListener(callback) {
    const q = query(
        collection(db, 'quiz_results'),
        orderBy('timestamp', 'desc'),
        limit(10)
    );
    
    return onSnapshot(q, callback);
}

export function setupLeadsListener(callback) {
    const q = query(
        collection(db, 'leads'),
        orderBy('score', 'desc')
    );
    
    return onSnapshot(q, callback);
}

export function setupMetricsListener(callback) {
    const q = query(
        collection(db, 'metrics'),
        orderBy('timestamp', 'desc'),
        limit(1)
    );
    
    return onSnapshot(q, callback);
}

// === UTILITY FUNCTIONS ===
export function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('it-IT');
}

export function calculateTrend(current, previous) {
    if (!previous) return { value: 0, isPositive: true };
    
    const change = ((current - previous) / previous) * 100;
    return {
        value: Math.abs(change).toFixed(1),
        isPositive: change >= 0
    };
}

export function getProfileIcon(profileType) {
    switch(profileType) {
        case 'Nuovo Esploratore': return '🌱';
        case 'Guerriero': return '💪';
        case 'Atleta': return '🏆';
        default: return '👤';
    }
}