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
    serverTimestamp 
} from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

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
    if (quizData.goals?.includes('perdere_peso')) score += 20;
    if (quizData.goals?.includes('aumentare_massa')) score += 25;
    if (quizData.goals?.includes('migliorare_forma')) score += 15;
    
    // Score basato su disponibilità tempo
    if (quizData.time_available >= 60) score += 15;
    else if (quizData.time_available >= 30) score += 10;
    else score += 5;
    
    // Score basato su esperienza
    if (quizData.experience === 'esperto') score += 20;
    else if (quizData.experience === 'intermedio') score += 15;
    else score += 10;
    
    return Math.min(score, 100); // Max 100
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