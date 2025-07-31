// firebase-lifestyle-integration.js - Sistema completo per Lifestyle Coaching
// Integrazione con Firebase esistente di TribuCoach + SISTEMA AVATAR

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
    serverTimestamp,
    getDocs
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// === CONFIGURAZIONE LIFESTYLE ===
const LIFESTYLE_COLLECTIONS = {
    profiles: 'lifestyle_profiles',
    progress: 'lifestyle_progress',
    goals: 'lifestyle_goals',
    sessions: 'coaching_sessions',
    avatars: 'user_avatars' // 🎯 NUOVO: Collection avatar utenti
};

// === 🎨 SISTEMA AVATAR - NUOVE FUNZIONI ===

// Avatar predefiniti per utenti
const AVATAR_PRESETS = [
    { id: 'avatar_1', name: 'Determinato', emoji: '💪', colors: { primary: '#3b82f6', secondary: '#1e40af' } },
    { id: 'avatar_2', name: 'Motivato', emoji: '🚀', colors: { primary: '#10b981', secondary: '#059669' } },
    { id: 'avatar_3', name: 'Energico', emoji: '⚡', colors: { primary: '#f59e0b', secondary: '#d97706' } },
    { id: 'avatar_4', name: 'Positivo', emoji: '🌟', colors: { primary: '#8b5cf6', secondary: '#7c3aed' } },
    { id: 'avatar_5', name: 'Guerriero', emoji: '🏆', colors: { primary: '#ef4444', secondary: '#dc2626' } },
    { id: 'avatar_6', name: 'Zen', emoji: '🧘', colors: { primary: '#06b6d4', secondary: '#0891b2' } },
    { id: 'avatar_7', name: 'Esploratore', emoji: '🗺️', colors: { primary: '#84cc16', secondary: '#65a30d' } },
    { id: 'avatar_8', name: 'Creativo', emoji: '🎨', colors: { primary: '#ec4899', secondary: '#db2777' } },
    { id: 'avatar_9', name: 'Leader', emoji: '👑', colors: { primary: '#f97316', secondary: '#ea580c' } },
    { id: 'avatar_10', name: 'Equilibrato', emoji: '⚖️', colors: { primary: '#6366f1', secondary: '#4f46e5' } }
];

// Messaggi dinamici di Andrea basati sui progressi
const ANDREA_MESSAGES = {
    welcome: {
        title: "Benvenuto nel tuo percorso!",
        message: "Ciao! Sono Andrea, il tuo coach personale. Insieme trasformeremo la tua vita in 7 settimane straordinarie!",
        icon: "👋"
    },
    week_1_2: {
        title: "Ottimo inizio!",
        message: "Stai costruendo basi solide! Le prime settimane sono fondamentali. Continua così, i risultati arriveranno!",
        icon: "🌱"
    },
    week_3_4: {
        title: "Momento di crescita!",
        message: "Fantástico progresso! Stai entrando nella fase più trasformativa. La tua determinazione mi impressiona!",
        icon: "🚀"
    },
    week_5_6: {
        title: "Sei in volo!",
        message: "Incredibile! Stai davvero trasformando la tua vita. I cambiamenti sono evidenti, continua su questa strada!",
        icon: "⭐"
    },
    week_7: {
        title: "Quasi alla meta!",
        message: "Sei arrivato all'ultima settimana! I risultati parlano da soli. Pronto per il grande finale?",
        icon: "🏆"
    },
    completed: {
        title: "Congratulazioni!",
        message: "Hai completato il percorso! Ora sei una versione migliore di te stesso. Continua a crescere!",
        icon: "🎉"
    },
    low_activity: {
        title: "Ti aspetto!",
        message: "Non ti vedo da un po'... Ricorda che ogni piccolo passo conta. Sono qui quando sei pronto a riprendere!",
        icon: "💙"
    },
    high_engagement: {
        title: "Sei un campione!",
        message: "Il tuo impegno è straordinario! Con questa dedizione raggiungerai qualsiasi obiettivo. Fiero di te!",
        icon: "🔥"
    }
};

// === SALVATAGGIO AVATAR UTENTE ===
export async function saveUserAvatar(userId, avatarData) {
    try {
        console.log('🎨 Salvataggio avatar utente...', { userId, avatarData });
        
        const avatarDoc = {
            userId: userId,
            avatarId: avatarData.avatarId,
            customizations: avatarData.customizations || {},
            timestamp: serverTimestamp(),
            lastUpdated: serverTimestamp()
        };
        
        // Cerca avatar esistente per l'utente
        const q = query(
            collection(db, LIFESTYLE_COLLECTIONS.avatars),
            where('userId', '==', userId),
            limit(1)
        );
        
        const existingAvatar = await getDocs(q);
        
        if (!existingAvatar.empty) {
            // Aggiorna avatar esistente
            const docRef = existingAvatar.docs[0].ref;
            await updateDoc(docRef, {
                ...avatarDoc,
                id: existingAvatar.docs[0].id
            });
            
            console.log('✅ Avatar utente aggiornato');
            return existingAvatar.docs[0].id;
        } else {
            // Crea nuovo avatar
            const docRef = await addDoc(collection(db, LIFESTYLE_COLLECTIONS.avatars), avatarDoc);
            console.log('✅ Nuovo avatar utente creato:', docRef.id);
            return docRef.id;
        }
        
    } catch (error) {
        console.error('❌ Errore salvataggio avatar:', error);
        throw error;
    }
}

// === RECUPERO AVATAR UTENTE ===
export async function getUserAvatar(userId) {
    try {
        console.log('🔍 Recupero avatar per utente:', userId);
        
        const q = query(
            collection(db, LIFESTYLE_COLLECTIONS.avatars),
            where('userId', '==', userId),
            orderBy('lastUpdated', 'desc'),
            limit(1)
        );
        
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            console.log('⚠️ Nessun avatar trovato - ritorno default');
            return getDefaultAvatar();
        }
        
        const doc = snapshot.docs[0];
        const avatarData = {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        };
        
        // Arricchisci con dati del preset
        const preset = AVATAR_PRESETS.find(p => p.id === avatarData.avatarId);
        if (preset) {
            avatarData.preset = preset;
        }
        
        console.log('✅ Avatar recuperato:', avatarData.id);
        return avatarData;
        
    } catch (error) {
        console.error('❌ Errore recupero avatar:', error);
        return getDefaultAvatar();
    }
}

// === AVATAR DEFAULT ===
function getDefaultAvatar() {
    return {
        id: 'default',
        userId: 'guest',
        avatarId: 'avatar_1',
        preset: AVATAR_PRESETS[0],
        customizations: {},
        isDefault: true
    };
}

// === GENERA MESSAGGIO ANDREA DINAMICO ===
export async function getAndreaMessage(userId) {
    try {
        console.log('💬 Generazione messaggio Andrea per:', userId);
        
        // Recupera profilo e progressi utente
        const profile = await getLifestyleProfile(userId);
        const progress = await getLifestyleProgress(userId);
        
        let messageKey = 'welcome';
        
        if (profile && progress.length > 0) {
            const lastActivity = progress[0]?.timestamp || new Date();
            const daysSinceActivity = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24));
            
            // Determina tipo messaggio basato sui progressi
            const completedWeeks = progress.filter(p => p.type === 'week_completed').length;
            const totalActivities = progress.length;
            
            if (daysSinceActivity > 7) {
                messageKey = 'low_activity';
            } else if (totalActivities > 20) {
                messageKey = 'high_engagement';
            } else if (completedWeeks >= 7) {
                messageKey = 'completed';
            } else if (completedWeeks >= 6) {
                messageKey = 'week_7';
            } else if (completedWeeks >= 4) {
                messageKey = 'week_5_6';
            } else if (completedWeeks >= 2) {
                messageKey = 'week_3_4';
            } else if (completedWeeks >= 1) {
                messageKey = 'week_1_2';
            }
        }
        
        const message = ANDREA_MESSAGES[messageKey] || ANDREA_MESSAGES.welcome;
        
        console.log('✅ Messaggio Andrea generato:', messageKey);
        return {
            ...message,
            messageType: messageKey,
            personalizedFor: userId,
            timestamp: new Date()
        };
        
    } catch (error) {
        console.error('❌ Errore generazione messaggio Andrea:', error);
        return ANDREA_MESSAGES.welcome;
    }
}

// === LISTA AVATAR DISPONIBILI ===
export function getAvailableAvatars() {
    return AVATAR_PRESETS.map(avatar => ({
        ...avatar,
        preview: generateAvatarPreview(avatar)
    }));
}

// === GENERA PREVIEW AVATAR ===
function generateAvatarPreview(avatar) {
    return {
        emoji: avatar.emoji,
        name: avatar.name,
        primaryColor: avatar.colors.primary,
        secondaryColor: avatar.colors.secondary,
        style: `background: linear-gradient(135deg, ${avatar.colors.primary} 0%, ${avatar.colors.secondary} 100%)`
    };
}

// === STATISTICHE AVATAR ===
export async function getAvatarStats() {
    try {
        const snapshot = await getDocs(collection(db, LIFESTYLE_COLLECTIONS.avatars));
        
        const stats = {
            totalUsers: snapshot.size,
            avatarDistribution: {},
            recentChanges: 0
        };
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Conta distribuzione avatar
            if (data.avatarId) {
                stats.avatarDistribution[data.avatarId] = 
                    (stats.avatarDistribution[data.avatarId] || 0) + 1;
            }
            
            // Conta cambiamenti recenti
            if (data.lastUpdated && data.lastUpdated.toDate() > oneWeekAgo) {
                stats.recentChanges++;
            }
        });
        
        // Trova avatar più popolare
        stats.mostPopular = Object.entries(stats.avatarDistribution)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'avatar_1';
        
        return stats;
        
    } catch (error) {
        console.error('❌ Errore statistiche avatar:', error);
        return { totalUsers: 0, avatarDistribution: {}, recentChanges: 0 };
    }
}

// === SALVATAGGIO PROFILO LIFESTYLE (AGGIORNATO CON AVATAR) ===
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
            insights: extractProfileInsights(profileData),
            
            // 🎨 NUOVO: Avatar di default per nuovo utente
            hasCustomAvatar: false,
            defaultAvatar: 'avatar_1'
        };
        
        const docRef = await addDoc(collection(db, LIFESTYLE_COLLECTIONS.profiles), extendedProfile);
        
        console.log('✅ Profilo lifestyle salvato con ID:', docRef.id);
        
        // 🎨 NUOVO: Crea avatar di default per nuovo utente
        await saveUserAvatar(extendedProfile.userId, {
            avatarId: 'avatar_1',
            customizations: {}
        });
        
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
            recentActivity: [],
            avatarStats: await getAvatarStats() // 🎨 NUOVO: Statistiche avatar
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

// === 🎨 EXPORTS AGGIORNATI CON SISTEMA AVATAR ===
export {
    LIFESTYLE_COLLECTIONS,
    AVATAR_PRESETS,
    ANDREA_MESSAGES,
    saveLifestyleProfile,
    getLifestyleProfile,
    saveLifestyleProgress,
    getLifestyleProgress,
    getLifestyleGoals,
    updateLifestyleGoal,
    setupLifestyleListener,
    integrateWithExistingSystem,
    getLifestyleDashboardData,
    // 🎨 NUOVE FUNZIONI AVATAR
    saveUserAvatar,
    getUserAvatar,
    getAndreaMessage,
    getAvailableAvatars,
    getAvatarStats
};

console.log('🎯 Firebase Lifestyle Integration + Avatar System caricato - Pronto per uso!');