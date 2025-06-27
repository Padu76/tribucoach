// firebase-functions.js - Funzioni helper per TribuCoach
import { db, analytics } from './firebase.js';
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
    arrayUnion // Import arrayUnion for updating notes
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'; // Aggiornato percorso CDN
import { logEvent } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js'; // Aggiornato percorso CDN

// === GESTIONE QUIZ RESULTS ===
export async function saveQuizResult(quizData) {
    try {
        // lead_score and profile are already calculated in quiz.html before calling this function
        const docRef = await addDoc(collection(db, 'quiz_results'), {
            ...quizData, // This will save all fields from quizData, including new ones
            timestamp: serverTimestamp()
        });
        
        // Log analytics
        logEvent(analytics, 'quiz_completed', {
            profile_type: quizData.profile, // Use the profile type already determined
            score: quizData.lead_score      // Use the score already determined
        });
        
        return docRef.id;
    } catch (error) {
        console.error('Errore salvataggio quiz:', error);
        throw error;
    }
}

// === LOGICA DI CALCOLO DEL PUNTEGGIO LEAD (AGGIORNATA) ===
export function calculateLeadScore(quizData) {
    let score = 0;

    // Punteggio basato su Obiettivi Principali (goals)
    // Ho mantenuto la logica per i vecchi valori e aggiunto i nuovi
    if (quizData.goals?.includes('perdita_peso_grasso')) score += 20;
    if (quizData.goals?.includes('aumento_massa_muscolare')) score += 25;
    if (quizData.goals?.includes('tonificazione_generale')) score += 15;
    if (quizData.goals?.includes('aumento_forza')) score += 10;
    if (quizData.goals?.includes('miglioramento_resistenza')) score += 10;
    if (quizData.goals?.includes('benessere_salute')) score += 5;

    // Punteggio basato su Frequenza di allenamento (frequency)
    switch(quizData.frequency) {
        case '5-6': score += 20; break;
        case '3-4': score += 15; break;
        case '1-2': score += 5; break;
    }

    // Punteggio basato sul Luogo di allenamento (place)
    switch(quizData.place) {
        case 'palestra': score += 10; break;
        case 'casa': score += 5; break;
        case 'all_aperto': score += 7; break;
        case 'misto': score += 12; break;
    }

    // Punteggio basato su Esperienza (experience)
    switch(quizData.experience) {
        case 'avanzato': score += 20; break;
        case 'intermedio': score += 15; break;
        case 'principiante': score += 10; break;
    }

    // Punteggio basato sugli Ostacoli (obstacles) - Esempio: un punteggio bonus se non ci sono ostacoli maggiori
    // O una penalità/bonus in base al tipo di ostacolo (da definire)
    if (!quizData.obstacles || quizData.obstacles.length === 0) {
        score += 5; // Bonus per chi non ha grandi ostacoli
    } else {
        // Esempio: penalità per mancanza di motivazione
        if (quizData.obstacles.includes('mancanza_motivazione')) score -= 5;
        // Puoi aggiungere logica specifica per ogni ostacolo
    }

    // Punteggio basato sulla Motivazione (motivation)
    switch(quizData.motivation) {
        case 'salute_benessere': score += 10; break;
        case 'aspetto_fisico': score += 8; break;
        case 'performance_sportiva': score += 12; break;
        case 'stile_vita_attivo': score += 7; break;
    }

    // Punteggio basato su Abitudini Alimentari (diet)
    switch(quizData.diet) {
        case 'equilibrata_consapevole': score += 10; break;
        case 'a_volte_sgarro': score += 5; break;
        case 'non_ci_penso_molto': score += 0; break;
    }

    // Punteggio basato su Attività Fisica Quotidiana (dailyActivity)
    switch(quizData.dailyActivity) {
        case 'molto_attivo': score += 10; break;
        case 'moderatamente_attivo': score += 5; break;
        case 'sedentario': score += 2; break;
    }

    // Punteggio basato su Attività Preferite (preferredActivities) - Esempio: bonus per attività ad alta intensità
    if (quizData.preferredActivities?.includes('palestra')) score += 5;
    if (quizData.preferredActivities?.includes('corsa')) score += 3;
    // Aggiungi altri bonus specifici per attività se desiderato

    // Punteggio basato su Utilizzo Personal Trainer (personalTrainerUsage)
    switch(quizData.personalTrainerUsage) {
        case 'con_pt': score += 5; break; // Già con PT, forse più consapevole
        case 'da_solo': score += 8; break; // Cerca una guida
        case 'entrambi': score += 7; break;
    }

    // Punteggio basato sulla Durata Media Allenamento (avgWorkoutDuration)
    switch(quizData.avgWorkoutDuration) {
        case 'piu_un_ora': score += 10; break;
        case '45-60': score += 8; break;
        case '30-45': score += 5; break;
        case 'meno_30': score += 2; break;
    }

    // Punteggio basato su Abitudine Colazione (breakfastHabit)
    switch(quizData.breakfastHabit) {
        case 'si_ogni_giorno': score += 5; break;
        case 'qualche_volta': score += 2; break;
        case 'mai_colazione': score += 0; break;
    }

    // Punteggio basato su Consumo Integratori (supplementsUsage)
    switch(quizData.supplementsUsage) {
        case 'si_regolarmente': score += 3; break;
        case 'a_volte': score += 1; break;
        case 'no_integratori': score += 0; break;
    }

    // Punteggio basato su Frequenza Pasti Fuori Casa (eatOutFrequency)
    switch(quizData.eatOutFrequency) {
        case 'mai_fuori': score += 5; break;
        case '1-2_volte': score += 3; break;
        case '3-4_volte': score += 1; break;
        case '5_piu_volte': score += -5; break; // Penalità per troppi pasti fuori
    }

    // Punteggio basato su Gestione Stress (stressManagement)
    switch(quizData.stressManagement) {
        case 'si_ogni_giorno': score += 5; break;
        case 'si_qualche_volta': score += 3; break;
        case 'no_stress': score += 0; break;
    }

    // Punteggio basato su Equilibrio Vita-Lavoro (workLifeBalance)
    switch(quizData.workLifeBalance) {
        case 'si_molto_soddisfatto': score += 5; break;
        case 'abbastanza': score += 3; break;
        case 'poco': score += 1; break;
        case 'per_niente': score += 0; break;
    }

    // Punteggio basato su Pause Attive (activeBreaks)
    switch(quizData.activeBreaks) {
        case 'ogni_ora': score += 5; break;
        case 'piu_volte_giorno': score += 3; break;
        case 'una_volta_giorno': score += 1; break;
        case 'mai_pause': score += 0; break;
    }

    // Punteggio basato su Risvegli Notturni (wakeUpAtNight)
    switch(quizData.wakeUpAtNight) {
        case 'mai_svegliarsi': score += 5; break;
        case 'raramente': score += 3; break;
        case 'spesso': score += -2; break;
        case 'sempre': score += -5; break; // Penalità per sonno interrotto
    }

    // Punteggio basato su Motivazione Principale (mainMotivationNew)
    switch(quizData.mainMotivationNew) {
        case 'obiettivi_personali': score += 10; break;
        case 'salute_generale': score += 8; break;
        case 'energia_quotidiana': score += 7; break;
        case 'prevenire_malattie': score += 6; break;
        case 'sentirsi_bene': score += 5; break;
        case 'aspetto_fisico': score += 9; break;
    }
    
    // Assicurati che il punteggio non superi 100 e non sia negativo
    return Math.min(Math.max(score, 0), 100); 
}


// === GESTIONE LEAD (OLD FUNCTIONS, ASSUMED UNCHANGED) ===
export async function getLeads() {
    try {
        const leadsCol = collection(db, 'leads');
        const leadSnapshot = await getDocs(leadsCol);
        const leadsList = leadSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return leadsList;
    } catch (error) {
        console.error('Errore recupero leads:', error);
        throw error;
    }
}

export async function addLead(leadData) {
    try {
        const docRef = await addDoc(collection(db, 'leads'), leadData);
        return docRef.id;
    } catch (error) {
        console.error('Errore aggiunta lead:', error);
        throw error;
    }
}

export async function updateLead(id, newData) {
    try {
        const leadRef = doc(db, 'leads', id);
        await updateDoc(leadRef, newData);
    } catch (error) {
        console.error('Errore aggiornamento lead:', error);
        throw error;
    }
}

export async function deleteLead(id) {
    try {
        const leadRef = doc(db, 'leads', id);
        await deleteDoc(leadRef);
    } catch (error) {
        console.error('Errore eliminazione lead:', error);
        throw error;
    }
}

// === GESTIONE METRICS (OLD FUNCTIONS, ASSUMED UNCHANGED) ===
export async function saveMetrics(metricsData) {
    try {
        const docRef = await addDoc(collection(db, 'metrics'), {
            ...metricsData,
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Errore salvataggio metrics:', error);
        throw error;
    }
}

// === LISTENERS REAL-TIME ===
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
        // Aggiungi icone per altri profili se necessari
        default: return '👤'; // Icona di default
    }
}

// === NOTE LEAD (AGGIUNTA FUNZIONE) ===
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
        console.error('Errore aggiunta nota lead:', error);
        throw error;
    }
}