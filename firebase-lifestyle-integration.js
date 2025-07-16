// firebase-lifestyle-integration.js - Sistema completo per Lifestyle Coaching
// Integrazione con Firebase esistente di TribuCoach

import { db } from './firebase.js';
import {
    collection,
    addDoc,
    getDoc,
    updateDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// === CONFIGURAZIONE LIFESTYLE ===
const LIFESTYLE_COLLECTIONS = {
    profiles: 'lifestyle_profiles',
    progress: 'lifestyle_progress',
    goals: 'lifestyle_goals',
    sessions: 'coaching_sessions'
};

// === SALVATAGGIO PROFILO LIFESTYLE ===
export async function saveLifestyleProfile(profileData) {
    try {
        console.log('💾 Salvataggio profilo lifestyle...', profileData);
        
        // Estendi il profilo con metadati
        const extendedProfile = {
            ...profileData,
            timestamp: serverTimestamp(),
            source: 'lifestyle_quiz',
            version: '1.0',
            status: 'active',
            
            // Genera user ID se non presente
            userId: profileData.userId || generateUserId(),
            
            // Calcola lead score
            leadScore: calculateLifestyleLeadScore(profileData),
            
            // Estrai insights
            insights: extractProfileInsights(profileData)
        };
        
        const docRef = await addDoc(collection(db, LIFESTYLE_COLLECTIONS.profiles), extendedProfile);
        
        console.log('✅ Profilo lifestyle salvato con ID:', docRef.id);
        
        // Tracking dell'evento
        await trackLifestyleEvent('profile_created', {
            profileId: docRef.id,
            quadrant: profileData.quadrant,
            consciousnessLevel: profileData.consciousnessLevel,
            readinessLevel: profileData.readinessLevel
        });
        
        // Genera obiettivi automatici
        await generateInitialGoals(docRef.id, profileData);
        
        return docRef.id;
        
    } catch (error) {
        console.error('❌ Errore salvataggio profilo lifestyle:', error);
        throw error;
    }
}

// === RECUPERO PROFILO LIFESTYLE ===
export async function getLifestyleProfile(userId) {
    try {
        console.log('🔍 Recupero profilo lifestyle per utente:', userId);
        
        const q = query(
            collection(db, LIFESTYLE_COLLECTIONS.profiles),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(1)
        );
        
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            console.log('⚠️ Nessun profilo lifestyle trovato');
            return null;
        }
        
        const doc = snapshot.docs[0];
        const profileData = {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        };
        
        console.log('✅ Profilo lifestyle recuperato:', profileData.id);
        return profileData;
        
    } catch (error) {
        console.error('❌ Errore recupero profilo lifestyle:', error);
        return null;
    }
}

// === CALCOLO LEAD SCORE LIFESTYLE ===
function calculateLifestyleLeadScore(profileData) {
    let score = 0;
    
    // Score basato su readiness level (30 punti max)
    if (profileData.readinessLevel) {
        score += profileData.readinessLevel * 6; // 5 = 30 punti
    }
    
    // Score basato su quadrant (25 punti max)
    if (profileData.quadrant) {
        if (profileData.quadrant.includes('Q4')) score += 25; // Coaching completo
        else if (profileData.quadrant.includes('Q3')) score += 20; // Coaching emotivo
        else if (profileData.quadrant.includes('Q2')) score += 15; // Training tecnico
        else if (profileData.quadrant.includes('Q1')) score += 10; // Coaching opzionale
    }
    
    // Score basato su livello di coscienza (20 punti max)
    if (profileData.consciousnessLevel) {
        if (profileData.consciousnessLevel.includes('Pluralista')) score += 20;
        else if (profileData.consciousnessLevel.includes('Achiever')) score += 15;
        else if (profileData.consciousnessLevel.includes('Conformista')) score += 10;
        else if (profileData.consciousnessLevel.includes('Opportunista')) score += 5;
    }
    
    // Score basato su sfide multiple (15 punti max)
    if (profileData.challenges && profileData.challenges.length > 0) {
        score += Math.min(profileData.challenges.length * 3, 15);
    }
    
    // Score basato su punteggi benessere (10 punti max)
    if (profileData.scores) {
        const avgScore = Object.values(profileData.scores).reduce((a, b) => a + b, 0) / Object.keys(profileData.scores).length;
        if (avgScore < 3) score += 10; // Basso benessere = più interesse
        else if (avgScore < 4) score += 5;
    }
    
    return Math.min(Math.max(score, 0), 100);
}

// === ESTRAZIONE INSIGHTS ===
function extractProfileInsights(profileData) {
    const insights = {
        primaryFocus: [],
        recommendations: [],
        riskFactors: [],
        opportunities: []
    };
    
    // Analizza quadrant per focus primario
    if (profileData.quadrant) {
        if (profileData.quadrant.includes('Q4')) {
            insights.primaryFocus.push('Coaching completo', 'Supporto tecnico ed emotivo');
        } else if (profileData.quadrant.includes('Q3')) {
            insights.primaryFocus.push('Gestione emotiva', 'Mindset e motivazione');
        } else if (profileData.quadrant.includes('Q2')) {
            insights.primaryFocus.push('Competenze pratiche', 'Training specifico');
        }
    }
    
    // Analizza sfide per raccomandazioni
    if (profileData.challenges) {
        profileData.challenges.forEach(challenge => {
            switch(challenge) {
                case 'procrastination':
                    insights.recommendations.push('Tecniche anti-procrastinazione');
                    break;
                case 'low_energy':
                    insights.recommendations.push('Ottimizzazione energia');
                    break;
                case 'anxiety':
                    insights.recommendations.push('Gestione stress e ansia');
                    break;
                case 'low_self_esteem':
                    insights.recommendations.push('Sviluppo autostima');
                    break;
            }
        });
    }
    
    // Analizza punteggi per risk factors
    if (profileData.scores) {
        Object.entries(profileData.scores).forEach(([area, score]) => {
            if (score <= 2) {
                insights.riskFactors.push(`${area} critico (${score}/5)`);
            }
        });
    }
    
    // Opportunità basate su readiness
    if (profileData.readinessLevel >= 4) {
        insights.opportunities.push('Alta motivazione', 'Pronto per cambiamento');
    }
    
    return insights;
}

// === GENERAZIONE OBIETTIVI AUTOMATICI ===
async function generateInitialGoals(profileId, profileData) {
    try {
        const goals = [];
        
        // Obiettivi basati sui punteggi più bassi
        if (profileData.scores) {
            Object.entries(profileData.scores).forEach(([area, score]) => {
                if (score <= 3) {
                    goals.push({
                        title: `Migliorare ${area}`,
                        description: `Lavorare sull'area ${area} (punteggio attuale: ${score}/5)`,
                        targetScore: Math.min(score + 2, 5),
                        priority: score <= 2 ? 'high' : 'medium',
                        status: 'active',
                        category: area
                    });
                }
            });
        }
        
        // Obiettivi basati sulle sfide
        if (profileData.challenges) {
            profileData.challenges.forEach(challenge => {
                const goalMap = {
                    'procrastination': 'Superare la procrastinazione',
                    'low_energy': 'Aumentare i livelli di energia',
                    'anxiety': 'Gestire stress e ansia',
                    'low_self_esteem': 'Sviluppare autostima'
                };
                
                if (goalMap[challenge]) {
                    goals.push({
                        title: goalMap[challenge],
                        description: `Obiettivo specifico per affrontare: ${challenge}`,
                        priority: 'high',
                        status: 'active',
                        category: 'challenges'
                    });
                }
            });
        }
        
        // Salva obiettivi
        const goalPromises = goals.map(goal => 
            addDoc(collection(db, LIFESTYLE_COLLECTIONS.goals), {
                ...goal,
                profileId: profileId,
                timestamp: serverTimestamp(),
                createdBy: 'system'
            })
        );
        
        await Promise.all(goalPromises);
        console.log(`✅ Generati ${goals.length} obiettivi automatici`);
        
    } catch (error) {
        console.error('❌ Errore generazione obiettivi:', error);
    }
}

// === TRACKING EVENTI LIFESTYLE ===
async function trackLifestyleEvent(eventType, eventData) {
    try {
        const trackingData = {
            event: `lifestyle_${eventType}`,
            eventData: eventData,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId(),
            source: 'lifestyle_system'
        };
        
        await addDoc(collection(db, 'analytics_events'), trackingData);
        console.log(`📊 Evento lifestyle tracciato: ${eventType}`);
        
    } catch (error) {
        console.error('❌ Errore tracking evento lifestyle:', error);
    }
}

// === SALVATAGGIO PROGRESSI ===
export async function saveLifestyleProgress(profileId, progressData) {
    try {
        const progressDoc = {
            profileId: profileId,
            ...progressData,
            timestamp: serverTimestamp(),
            source: 'user_update'
        };
        
        const docRef = await addDoc(collection(db, LIFESTYLE_COLLECTIONS.progress), progressDoc);
        
        // Tracking del progresso
        await trackLifestyleEvent('progress_updated', {
            profileId: profileId,
            progressType: progressData.type,
            value: progressData.value
        });
        
        return docRef.id;
        
    } catch (error) {
        console.error('❌ Errore salvataggio progresso:', error);
        throw error;
    }
}

// === RECUPERO PROGRESSI ===
export async function getLifestyleProgress(profileId) {
    try {
        const q = query(
            collection(db, LIFESTYLE_COLLECTIONS.progress),
            where('profileId', '==', profileId),
            orderBy('timestamp', 'desc'),
            limit(50)
        );
        
        const snapshot = await getDocs(q);
        const progress = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        return progress;
        
    } catch (error) {
        console.error('❌ Errore recupero progressi:', error);
        return [];
    }
}

// === RECUPERO OBIETTIVI ===
export async function getLifestyleGoals(profileId) {
    try {
        const q = query(
            collection(db, LIFESTYLE_COLLECTIONS.goals),
            where('profileId', '==', profileId),
            orderBy('timestamp', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const goals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        return goals;
        
    } catch (error) {
        console.error('❌ Errore recupero obiettivi:', error);
        return [];
    }
}

// === AGGIORNAMENTO OBIETTIVO ===
export async function updateLifestyleGoal(goalId, updates) {
    try {
        const goalRef = doc(db, LIFESTYLE_COLLECTIONS.goals, goalId);
        await updateDoc(goalRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        
        // Tracking dell'aggiornamento
        await trackLifestyleEvent('goal_updated', {
            goalId: goalId,
            updates: updates
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Errore aggiornamento obiettivo:', error);
        throw error;
    }
}

// === LISTENER REAL-TIME PER DASHBOARD ===
export function setupLifestyleListener(userId, callback) {
    console.log('🔄 Attivando listener lifestyle per utente:', userId);
    
    try {
        const q = query(
            collection(db, LIFESTYLE_COLLECTIONS.profiles),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(1)
        );
        
        return onSnapshot(q, (snapshot) => {
            console.log(`📊 Lifestyle listener: ${snapshot.size} profili ricevuti`);
            
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const profileData = {
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() || new Date()
                };
                callback(profileData);
            } else {
                callback(null);
            }
        }, (error) => {
            console.error('❌ Errore listener lifestyle:', error);
            callback(null);
        });
        
    } catch (error) {
        console.error('❌ Errore setup listener lifestyle:', error);
        return () => {};
    }
}

// === INTEGRAZIONE CON SISTEMA ESISTENTE ===
export async function integrateWithExistingSystem(profileData) {
    try {
        // Crea lead entry nel sistema esistente
        const leadData = {
            name: profileData.name || 'Utente Lifestyle',
            email: profileData.email || '',
            phone: profileData.phone || '',
            source: 'lifestyle_quiz',
            leadScore: profileData.leadScore || 0,
            status: 'new',
            
            // Dati specifici lifestyle
            quadrant: profileData.quadrant,
            consciousnessLevel: profileData.consciousnessLevel,
            readinessLevel: profileData.readinessLevel,
            challenges: profileData.challenges,
            scores: profileData.scores,
            
            timestamp: serverTimestamp()
        };
        
        // Salva nel sistema leads esistente
        const leadRef = await addDoc(collection(db, 'leads'), leadData);
        
        // Collega profilo al lead
        await updateDoc(doc(db, LIFESTYLE_COLLECTIONS.profiles, profileData.id), {
            linkedLeadId: leadRef.id
        });
        
        console.log('✅ Integrazione con sistema esistente completata');
        return leadRef.id;
        
    } catch (error) {
        console.error('❌ Errore integrazione sistema esistente:', error);
        throw error;
    }
}

// === UTILITY FUNCTIONS ===
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getCurrentSessionId() {
    return sessionStorage.getItem('tribucoach_session_id') || 'unknown';
}

// === DASHBOARD ANALYTICS ===
export async function getLifestyleDashboardData() {
    try {
        const data = {
            totalProfiles: 0,
            activeGoals: 0,
            completedGoals: 0,
            averageReadiness: 0,
            quadrantDistribution: {},
            recentActivity: []
        };
        
        // Conta profili totali
        const profilesSnapshot = await getDocs(collection(db, LIFESTYLE_COLLECTIONS.profiles));
        data.totalProfiles = profilesSnapshot.size;
        
        // Analizza distribuzione quadranti e readiness
        let totalReadiness = 0;
        profilesSnapshot.forEach(doc => {
            const profile = doc.data();
            
            if (profile.readinessLevel) {
                totalReadiness += profile.readinessLevel;
            }
            
            if (profile.quadrant) {
                const quadrant = profile.quadrant.split(':')[0]; // Es: 'Q1' da 'Q1: Coaching Opzionale'
                data.quadrantDistribution[quadrant] = (data.quadrantDistribution[quadrant] || 0) + 1;
            }
        });
        
        data.averageReadiness = data.totalProfiles > 0 ? 
            (totalReadiness / data.totalProfiles).toFixed(1) : 0;
        
        // Conta obiettivi
        const goalsSnapshot = await getDocs(collection(db, LIFESTYLE_COLLECTIONS.goals));
        goalsSnapshot.forEach(doc => {
            const goal = doc.data();
            if (goal.status === 'active') {
                data.activeGoals++;
            } else if (goal.status === 'completed') {
                data.completedGoals++;
            }
        });
        
        // Attività recente
        const recentQuery = query(
            collection(db, LIFESTYLE_COLLECTIONS.progress),
            orderBy('timestamp', 'desc'),
            limit(10)
        );
        
        const recentSnapshot = await getDocs(recentQuery);
        data.recentActivity = recentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        return data;
        
    } catch (error) {
        console.error('❌ Errore recupero dati dashboard:', error);
        return null;
    }
}

// === EXPORTS ===
export {
    LIFESTYLE_COLLECTIONS,
    saveLifestyleProfile,
    getLifestyleProfile,
    saveLifestyleProgress,
    getLifestyleProgress,
    getLifestyleGoals,
    updateLifestyleGoal,
    setupLifestyleListener,
    integrateWithExistingSystem,
    getLifestyleDashboardData
};

console.log('🎯 Firebase Lifestyle Integration caricato - Pronto per uso!');