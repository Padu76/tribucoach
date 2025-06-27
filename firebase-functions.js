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
            ...quizData,
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

export function calculateLeadScore(quizData) {
    let score = 0;
    
    // 1. Score basato su esperienza
    switch(quizData.experience) {
        case 'principiante': score += 10; break; 
        case 'intermedio': score += 20; break;   
        case 'avanzato': score += 30; break;     
    }
    
    // 2. Score basato su obiettivi (ogni obiettivo aggiunge punti)
    if (quizData.goals?.includes('aumento_massa_muscolare')) score += 15;
    if (quizData.goals?.includes('perdita_peso_grasso')) score += 15;
    if (quizData.goals?.includes('aumento_forza')) score += 10;
    if (quizData.goals?.includes('tonificazione_generale')) score += 8;
    if (quizData.goals?.includes('miglioramento_resistenza')) score += 8;
    if (quizData.goals?.includes('benessere_salute')) score += 5;

    // 3. Score basato su frequenza di allenamento desiderata
    switch(quizData.frequency) {
        case '1-2': score += 5; break;
        case '3-4': score += 15; break;
        case '5-6': score += 25; break;
    }

    // 4. Score basato sul luogo di allenamento preferito 
    switch(quizData.place) {
        case 'palestra': score += 5; break; 
        case 'casa': score += 3; break;     
        case 'all_aperto': score += 3; break; 
        case 'misto': score += 7; break;    
    }

    // 5. Score basato sulla motivazione (le motivazioni intrinseche valgono di più)
    switch(quizData.motivation) {
        case 'salute_benessere': score += 10; break;
        case 'aspetto_fisico': score += 7; break;
        case 'performance_sportiva': score += 8; break;
        case 'stile_vita_attivo': score += 6; break;
    }

    // 6. Score basato sulle abitudini alimentari (più consapevoli = punteggio più alto)
    switch(quizData.diet) {
        case 'equilibrata_consapevole': score += 10; break;
        case 'a_volte_sgarro': score += 5; break;
        case 'non_ci_penso_molto': score += 2; break;
    }

    // 7. Score basato sulle esperienze passate (successo indica maggiore propensione a seguire un piano)
    switch(quizData.pastExperience) {
        case 'si_con_successo': score += 8; break;
        case 'si_interrotto_senza_risultati': score += 4; break;
        case 'no_mai_strutturato': score += 2; break;
    }

    // 8. Score basato sul livello di attività quotidiana (più attivo = migliore base di partenza)
    switch(quizData.dailyActivity) {
        case 'molto_attivo': score += 7; break;
        case 'moderatamente_attivo': score += 4; break;
        case 'sedentario': score += 1; break;
    }
    
    // Clamp score to a maximum of 100 and minimum of 0
    return Math.min(Math.max(score, 0), 100); 
}

// === GESTIONE LEAD ===
export async function createLead(leadData) {
    try {
        const docRef = await addDoc(collection(db, 'leads'), {
            ...leadData,
            created_at: serverTimestamp(),
            status: 'nuovo',
            last_contact: null,
            notes: []
        });
        
        logEvent(analytics, 'lead_created', {
            source: leadData.source || 'quiz',
            score: leadData.score
        });
        
        return docRef.id;
    } catch (error) {
        console.error('Errore creazione lead:', error);
        throw error;
    }
}

export async function updateLeadStatus(leadId, newStatus, notes = '') {
    try {
        const leadRef = doc(db, 'leads', leadId);
        await updateDoc(leadRef, {
            status: newStatus,
            last_contact: serverTimestamp(),
            ...(notes && { 
                notes: arrayUnion({
                    note: notes,
                    timestamp: serverTimestamp()
                })
            })
        });
        
        logEvent(analytics, 'lead_updated', {
            lead_id: leadId,
            new_status: newStatus
        });
        
    } catch (error) {
        console.error('Errore aggiornamento lead:', error);
        throw error;
    }
}

export async function getHotLeads() {
    try {
        const leadsRef = collection(db, 'leads');
        const hotLeadsQuery = query(
            leadsRef, 
            where('score', '>=', 80),
            orderBy('score', 'desc')
        );
        
        const snapshot = await getDocs(hotLeadsQuery);
        const leads = [];
        
        snapshot.forEach(doc => {
            leads.push({ id: doc.id, ...doc.data() });
        });
        
        return leads;
    } catch (error) {
        console.error('Errore recupero hot leads:', error);
        return [];
    }
}

// === GESTIONE METRICHE ===
export async function updateDailyMetrics() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Conta quiz completati oggi
        const quizQuery = query(
            collection(db, 'quiz_results'),
            where('timestamp', '>=', new Date(today))
        );
        const quizSnapshot = await getDocs(quizQuery);
        const quizCount = quizSnapshot.size;
        
        // Conta lead creati oggi
        const leadsQuery = query(
            collection(db, 'leads'),
            where('created_at', '>=', new Date(today))
        );
        const leadsSnapshot = await getDocs(leadsQuery);
        const leadsCount = leadsSnapshot.size;
        
        // Conta conversioni
        const conversionsQuery = query(
            collection(db, 'conversions'),
            where('date', '>=', new Date(today))
        );
        const conversionsSnapshot = await getDocs(conversionsQuery);
        const conversionsCount = conversionsSnapshot.size;
        
        // Calcola revenue
        let revenue = 0;
        conversionsSnapshot.forEach(doc => {
            revenue += doc.data().amount || 0;
        });
        
        // Salva metriche
        await addDoc(collection(db, 'metrics'), {
            date: today,
            users_today: Math.floor(Math.random() * 20) + 40, // Simulated per ora
            quiz_completed: quizCount,
            hot_leads: leadsSnapshot.docs.filter(doc => doc.data().score >= 80).length,
            conversions: conversionsCount,
            revenue: revenue,
            conversion_rate: leadsCount > 0 ? (conversionsCount / leadsCount * 100).toFixed(1) : 0,
            timestamp: serverTimestamp()
        });
        
        logEvent(analytics, 'metrics_updated', {
            quiz_count: quizCount,
            leads_count: leadsCount,
            conversions: conversionsCount
        });
        
    } catch (error) {
        console.error('Errore aggiornamento metriche:', error);
        throw error;
    }
}

// === GESTIONE CONTENUTI ===
export async function trackContentRequest(contentType, userId = null) {
    try {
        await addDoc(collection(db, 'content_requests'), {
            content_type: contentType,
            user_id: userId,
            timestamp: serverTimestamp()
        });
        
        logEvent(analytics, 'content_requested', {
            content_type: contentType
        });
        
    } catch (error) {
        console.error('Errore tracking contenuto:', error);
    }
}

export async function getContentPerformance() {
    try {
        const requestsRef = collection(db, 'content_requests');
        const snapshot = await getDocs(requestsRef);
        
        const contentStats = {};
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const type = data.content_type;
            
            if (!contentStats[type]) {
                contentStats[type] = { requests: 0, conversions: 0 };
            }
            
            contentStats[type].requests++;
        });
        
        // Calcola conversion rate (simplified)
        Object.keys(contentStats).forEach(type => {
            contentStats[type].conversion_rate = Math.floor(Math.random() * 25) + 5; // Simulated per ora
        });
        
        return contentStats;
    } catch (error) {
        console.error('Errore performance contenuti:', error);
        return {};
    }
}

// === GESTIONE ALERT ===
export async function createAlert(alertData) {
    try {
        await addDoc(collection(db, 'alerts'), {
            ...alertData,
            created_at: serverTimestamp(),
            active: true,
            priority: alertData.priority || 1
        });
        
        logEvent(analytics, 'alert_created', {
            alert_type: alertData.type
        });
        
    } catch (error) {
        console.error('Errore creazione alert:', error);
    }
}

export async function checkAndCreateAlerts() {
    try {
        // Alert per hot leads non contattati
        const hotLeads = await getHotLeads();
        const now = new Date();
        
        for (const lead of hotLeads) {
            const lastContact = lead.last_contact?.toDate();
            const hoursSinceContact = lastContact ? 
                (now - lastContact) / (1000 * 60 * 60) : 
                (now - lead.created_at.toDate()) / (1000 * 60 * 60);
            
            if (hoursSinceContact > 4) { // 4 ore senza contatto
                await createAlert({
                    type: 'hot_lead_urgent',
                    title: 'Lead Caldo da Contattare',
                    message: `${lead.name} ha score ${lead.score} e non è stato contattato da ${Math.floor(hoursSinceContact)} ore`,
                    icon: '🔥',
                    priority: 3,
                    lead_id: lead.id
                });
            }
        }
        
        // Alert per trend contenuti
        const contentPerf = await getContentPerformance();
        const topContent = Object.entries(contentPerf)
            .sort((a, b) => b[1].requests - a[1].requests)[0];
        
        if (topContent && topContent[1].requests > 50) {
            await createAlert({
                type: 'content_trend',
                title: 'Trend Contenuto Positivo',
                message: `"${topContent[0]}" ha ${topContent[1].requests} richieste. Considera contenuti simili.`,
                icon: '📈',
                priority: 2
            });
        }
        
    } catch (error) {
        console.error('Errore check alert:', error);
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
        default: return '👤';
    }
}

export function getScoreColor(score) {
    if (score >= 80) return 'hot';
    if (score >= 60) return 'warm';
    return 'cold';
}