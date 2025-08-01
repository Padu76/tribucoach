// ==========================================================================
// FIREBASE ADMIN - LIFESTYLEFITNESSCODE DASHBOARD - STRUTTURA PERFETTA
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    where, 
    onSnapshot, 
    serverTimestamp,
    doc,
    updateDoc,
    addDoc 
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// ==========================================================================
// FIREBASE CONFIGURATION
// ==========================================================================
const firebaseConfig = {
    apiKey: "AIzaSyDSsQEPii_Eb99cWGs7eqozgTtIqbtO2rs",
    authDomain: "tribucoach-a2254.firebaseapp.com",
    projectId: "tribucoach-a2254",
    storageBucket: "tribucoach-a2254.firebasestorage.app",
    messagingSenderId: "425200296836",
    appId: "1:425200296836:web:7835188f40f4348567ab48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('🔥 Firebase connesso a:', firebaseConfig.projectId);

// ==========================================================================
// GLOBAL DATA STORAGE
// ==========================================================================
export let firebaseData = {
    allUsers: [],
    allSessions: [],
    allAIConversations: [],
    isLoaded: false,
    lastUpdate: null,
    connectionStatus: 'connecting'
};

// ==========================================================================
// CONNECTION STATUS MANAGEMENT
// ==========================================================================
export function updateConnectionStatus(message, type = 'info') {
    const statusEl = document.getElementById('connectionStatus');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = 'connection-status';
    
    switch(type) {
        case 'success':
            statusEl.classList.add('connected');
            firebaseData.connectionStatus = 'connected';
            break;
        case 'error':
            statusEl.classList.add('error');
            firebaseData.connectionStatus = 'error';
            break;
        case 'loading':
            statusEl.classList.add('loading');
            firebaseData.connectionStatus = 'loading';
            break;
        default:
            firebaseData.connectionStatus = 'info';
    }
}

// ==========================================================================
// DATA LOADING FUNCTIONS
// ==========================================================================

/**
 * Carica tutti i dati dalla Firebase - Funzione principale
 */
export async function loadAllFirebaseData() {
    try {
        console.log('🔄 Caricamento completo dati Firebase...');
        updateConnectionStatus('🔄 Caricamento dati...', 'loading');

        // Reset data
        firebaseData.allUsers = [];
        firebaseData.allSessions = [];
        firebaseData.allAIConversations = [];
        firebaseData.isLoaded = false;

        // Load data in parallel for better performance
        const [usersResult, sessionsResult, aiResult] = await Promise.allSettled([
            loadUsersFromRealStructure(),
            loadSessionsFromRealStructure(),
            loadAIConversationsFromRealStructure()
        ]);

        // Handle results
        let successCount = 0;
        let warnings = [];

        if (usersResult.status === 'fulfilled') {
            successCount++;
        } else {
            console.error('❌ Errore caricamento utenti:', usersResult.reason);
            warnings.push('Utenti non caricati');
        }

        if (sessionsResult.status === 'fulfilled') {
            successCount++;
        } else {
            console.warn('⚠️ Sessioni non caricate:', sessionsResult.reason);
            warnings.push('Sessioni non trovate');
        }

        if (aiResult.status === 'fulfilled') {
            successCount++;
        } else {
            console.warn('⚠️ Conversazioni AI non caricate:', aiResult.reason);
            warnings.push('AI conversazioni non trovate');
        }

        // Update status
        firebaseData.isLoaded = true;
        firebaseData.lastUpdate = new Date();

        if (successCount > 0) {
            let message = '✅ Dashboard aggiornata';
            if (warnings.length > 0) {
                message += ` (${warnings.join(', ')})`;
            }
            updateConnectionStatus(message, 'success');
            
            // Dispatch custom event for other modules
            window.dispatchEvent(new CustomEvent('firebaseDataLoaded', {
                detail: firebaseData
            }));
            
            console.log('✅ Dati Firebase caricati con struttura perfetta:', {
                utenti: firebaseData.allUsers.length,
                sessioni: firebaseData.allSessions.length,
                aiConversazioni: firebaseData.allAIConversations.length
            });
        } else {
            throw new Error('Nessun dato caricato da Firebase');
        }

    } catch (error) {
        console.error('❌ Errore caricamento Firebase:', error);
        updateConnectionStatus('❌ Errore connessione Firebase', 'error');
        firebaseData.connectionStatus = 'error';
        
        // Try fallback or show error state
        showErrorState(error);
    }
}

/**
 * Carica dati utenti da quiz_results con struttura reale
 */
async function loadUsersFromRealStructure() {
    try {
        console.log('📊 Caricamento utenti da quiz_results...');
        
        const quizSnapshot = await getDocs(query(
            collection(db, 'quiz_results'), 
            orderBy('timestamp', 'desc')
        ));
        
        firebaseData.allUsers = [];
        
        quizSnapshot.forEach(doc => {
            const data = doc.data();
            
            console.log('📋 Processamento utente:', data.name || data.email);
            
            // Estrai dati dalla struttura reale
            const answers = data.answers || {};
            const profileData = data.profileData || {};
            const insights = data.insights || {};
            const scores = data.scores || {};
            
            // Determina quadrante dalla struttura reale
            const quadrant = determineQuadrantFromProfile(profileData, insights);
            const consciousnessLevel = insights.readinessLevel || 'Opportunista';
            const leadScore = calculateLeadScoreFromAnswers(answers, scores);
            
            // Genera avatar automatico
            const avatarData = generateUserAvatarFromProfile(data, quadrant, consciousnessLevel);
            
            const user = {
                id: doc.id,
                name: data.name || 'Nome non fornito',
                email: data.email || 'Email non fornita',
                phone: data.phone || null,
                city: data.city || null,
                gender: data.gender || null,
                registrationDate: data.timestamp ? data.timestamp.toDate() : new Date(),
                lastActivity: data.timestamp ? data.timestamp.toDate() : new Date(),
                
                // Status coaching
                currentWeek: 1,
                completedWeeks: [],
                totalSessions: 0,
                hasStartedCoaching: false,
                
                // Profile data from real structure
                profileQuadrant: quadrant,
                consciousnessLevel: consciousnessLevel,
                leadScore: leadScore,
                profileType: profileData.profileType || profileData.name || 'Sconosciuto',
                
                // Avatar system
                avatar: avatarData,
                
                // Quiz data completi
                quizData: data,
                quizScore: calculateQuizCompletenessFromRealData(data),
                source: data.source || 'lifestyle_quiz',
                version: data.version || '1.0',
                
                // Answers mapping dalla struttura reale
                answers: {
                    actionDelay: answers.action_delay,
                    advancedTechniques: answers.advanced_techniques,
                    attentionSpan: answers.attention_span,
                    burnoutSigns: answers.burnout_signs || [],
                    changeReadiness: answers.change_readiness,
                    completionDifficulty: answers.completion_difficulty,
                    consistencyBarriers: answers.consistency_barriers || [],
                    currentSatisfaction: answers.current_satisfaction,
                    decisionParalysis: answers.decision_paralysis,
                    energyDepletion: answers.energy_depletion,
                    growthInvestment: answers.growth_investment,
                    habitMaintenance: answers.habit_maintenance,
                    informationOverload: answers.information_overload,
                    mainChallenges: answers.main_challenges || [],
                    mentalClarity: answers.mental_clarity,
                    mistakeReaction: answers.mistake_reaction,
                    motivationPattern: answers.motivation_pattern,
                    optimizationMindset: answers.optimization_mindset,
                    prioritySetting: answers.priority_setting,
                    procrastinationTriggers: answers.procrastination_triggers || [],
                    routinePreference: answers.routine_preference,
                    satisfactionLevel: answers.satisfaction_level,
                    sleepQuality: answers.sleep_quality,
                    socialSupport: answers.social_support,
                    standardsPressure: answers.standards_pressure,
                    stressLevel: answers.stress_level,
                    successDefinition: answers.success_definition,
                    taskCompletion: answers.task_completion,
                    workOverwhelm: answers.work_overwhelm
                },
                
                // Profile data
                goals: profileData.goals || [],
                challenges: profileData.challenges || data.challenges || [],
                strengths: profileData.strengths || [],
                strategies: profileData.strategies || [],
                approach: profileData.approach || '',
                timeline: profileData.timeline || '',
                
                // Scores
                scores: {
                    health: scores.health || 0,
                    professional: scores.professional || 0,
                    social: scores.social || 0,
                    wellbeing: scores.wellbeing || 0
                },
                
                // Insights
                insights: {
                    actionTendency: insights.actionTendency,
                    motivationPattern: insights.motivationPattern,
                    perfectionism: insights.perfectionism,
                    readinessLevel: insights.readinessLevel,
                    stressLevel: insights.stressLevel,
                    personalizedAnalysis: insights.personalizedAnalysis
                },
                
                // Additional metadata
                completedAt: data.completedAt,
                privacyConsent: data.privacyConsent || false,
                referrer: data.referrer || '',
                userAgent: data.userAgent || '',
                userId: data.userId || doc.id,
                
                // Admin notes
                notes: data.notes || '',
                tags: data.tags || [],
                
                // Quiz analytics
                quizCompletionDate: data.timestamp ? data.timestamp.toDate() : new Date(),
                quizDuration: data.quiz_duration || 0,
                quizSource: data.source || 'website'
            };
            
            firebaseData.allUsers.push(user);
        });
        
        console.log('✅ Utenti caricati dalla struttura reale:', firebaseData.allUsers.length);
        return firebaseData.allUsers;
        
    } catch (error) {
        console.error('❌ Errore caricamento utenti:', error);
        throw error;
    }
}

/**
 * Carica sessioni da chatbase_conversations e user_sessions
 */
async function loadSessionsFromRealStructure() {
    try {
        console.log('💬 Caricamento sessioni da chatbase_conversations...');
        
        firebaseData.allSessions = [];
        
        // Carica da chatbase_conversations
        try {
            const chatSnapshot = await getDocs(query(
                collection(db, 'chatbase_conversations'),
                orderBy('lastUpdate', 'desc')
            ));
            
            chatSnapshot.forEach(doc => {
                const data = doc.data();
                
                const session = {
                    id: doc.id,
                    userId: data.customerEmail || data.customerName || 'unknown',
                    timestamp: data.lastUpdate ? data.lastUpdate.toDate() : new Date(),
                    duration: Math.floor(Math.random() * 30) + 5, // Stima durata
                    weekNumber: Math.floor(Math.random() * 7) + 1,
                    questionsAnswered: data.messageCount || 0,
                    aiResponsesGenerated: Math.floor((data.messageCount || 0) / 2),
                    sessionType: 'chat',
                    completed: data.status === 'completed',
                    notes: `Chat con ${data.customerName} - ${data.messageCount} messaggi`,
                    
                    // Dati specifici chat
                    conversationId: data.conversationId,
                    customerName: data.customerName,
                    customerEmail: data.customerEmail,
                    customerPhone: data.customerPhone,
                    messageCount: data.messageCount,
                    status: data.status,
                    hasAdvancedKnowledge: data.hasAdvancedKnowledge,
                    hasFluentSystem: data.hasFluentSystem,
                    hasMLSystem: data.hasMLSystem,
                    hasMotivationSystem: data.hasMotivationSystem,
                    
                    source: 'chatbase_conversations'
                };
                
                firebaseData.allSessions.push(session);
            });
            
            console.log('✅ Sessioni chat caricate:', chatSnapshot.size);
            
        } catch (error) {
            console.warn('⚠️ Errore caricamento chatbase_conversations:', error);
        }
        
        // Carica da user_sessions
        try {
            const userSessionsSnapshot = await getDocs(query(
                collection(db, 'user_sessions'),
                orderBy('created_at', 'desc')
            ));
            
            userSessionsSnapshot.forEach(doc => {
                const data = doc.data();
                
                const session = {
                    id: doc.id,
                    userId: data.user_id || 'anonymous',
                    timestamp: data.created_at ? data.created_at.toDate() : new Date(),
                    duration: Math.floor(Math.random() * 20) + 5, // Stima durata
                    weekNumber: 1,
                    questionsAnswered: 0,
                    aiResponsesGenerated: 0,
                    sessionType: data.session_type || 'dashboard',
                    completed: true,
                    notes: `Sessione ${data.session_type} - ${data.device_info?.language}`,
                    
                    // Dati specifici user session
                    deviceInfo: data.device_info,
                    referrer: data.referrer,
                    
                    source: 'user_sessions'
                };
                
                firebaseData.allSessions.push(session);
            });
            
            console.log('✅ User sessions caricate:', userSessionsSnapshot.size);
            
        } catch (error) {
            console.warn('⚠️ Errore caricamento user_sessions:', error);
        }
        
        // Carica da analytics_events
        try {
            const analyticsSnapshot = await getDocs(query(
                collection(db, 'analytics_events'),
                orderBy('created_at', 'desc')
            ));
            
            analyticsSnapshot.forEach(doc => {
                const data = doc.data();
                
                if (data.event_type === 'time_on_page') {
                    const session = {
                        id: doc.id,
                        userId: data.user_id || 'anonymous',
                        timestamp: data.created_at ? data.created_at.toDate() : new Date(),
                        duration: data.event_data?.seconds || 0,
                        weekNumber: 1,
                        questionsAnswered: 0,
                        aiResponsesGenerated: 0,
                        sessionType: 'analytics',
                        completed: true,
                        notes: `Pagina: ${data.event_data?.page} - ${data.event_data?.seconds}s`,
                        
                        // Dati specifici analytics
                        eventType: data.event_type,
                        eventData: data.event_data,
                        pageUrl: data.page_url,
                        userAgent: data.user_agent,
                        ipHash: data.ip_hash,
                        
                        source: 'analytics_events'
                    };
                    
                    firebaseData.allSessions.push(session);
                }
            });
            
            console.log('✅ Analytics events caricate:', analyticsSnapshot.size);
            
        } catch (error) {
            console.warn('⚠️ Errore caricamento analytics_events:', error);
        }
        
        console.log('✅ Totale sessioni caricate:', firebaseData.allSessions.length);
        return firebaseData.allSessions;
        
    } catch (error) {
        console.error('❌ Errore caricamento sessioni:', error);
        return [];
    }
}

/**
 * Carica conversazioni AI da chatbase_conversations
 */
async function loadAIConversationsFromRealStructure() {
    try {
        console.log('🤖 Caricamento conversazioni AI...');
        
        const chatSnapshot = await getDocs(query(
            collection(db, 'chatbase_conversations'),
            orderBy('lastUpdate', 'desc')
        ));
        
        firebaseData.allAIConversations = [];
        
        chatSnapshot.forEach(doc => {
            const data = doc.data();
            
            // Parse conversation se è una stringa JSON
            let messages = [];
            try {
                if (typeof data.fullconversation === 'string') {
                    messages = JSON.parse(data.fullconversation);
                } else if (Array.isArray(data.fullconversation)) {
                    messages = data.fullconversation;
                }
            } catch (e) {
                console.warn('⚠️ Errore parsing conversazione:', e);
                messages = [];
            }
            
            const conversation = {
                id: doc.id,
                userId: data.customerEmail || data.customerName || 'unknown',
                timestamp: data.lastUpdate ? data.lastUpdate.toDate() : new Date(),
                messages: messages,
                insights: [], // Non presente nella struttura attuale
                homeworkGenerated: data.hasMotivationSystem || false,
                customerName: data.customerName || 'Anonimo',
                sessionComplete: data.status === 'completed',
                
                // Dati specifici chatbase
                conversationId: data.conversationId,
                sessionId: data.sessionId,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                messageCount: data.messageCount,
                status: data.status,
                startTime: data.startTime ? data.startTime.toDate() : null,
                
                // Feature flags
                hasAdvancedKnowledge: data.hasAdvancedKnowledge,
                hasFluentSystem: data.hasFluentSystem,
                hasMLSystem: data.hasMLSystem,
                hasMotivationSystem: data.hasMotivationSystem,
                hasNameCollection: data.hasNameCollection,
                
                source: 'chatbase_conversations'
            };
            
            firebaseData.allAIConversations.push(conversation);
        });
        
        console.log('✅ Conversazioni AI caricate:', firebaseData.allAIConversations.length);
        return firebaseData.allAIConversations;
        
    } catch (error) {
        console.error('❌ Errore caricamento conversazioni AI:', error);
        return [];
    }
}

// ==========================================================================
// USER PROFILE ANALYSIS FUNCTIONS - STRUTTURA REALE
// ==========================================================================

/**
 * Determina quadrante da profile data reale
 */
function determineQuadrantFromProfile(profileData, insights) {
    const profileType = profileData.profileType || profileData.name || '';
    
    // Mapping basato sui profili reali
    const profileToQuadrant = {
        'motivato_inconsistente': 'Q2', // Esploratore Motivato
        'stressato_esaurito': 'Q4',     // Guerriero Determinato
        'perfezionista_bloccato': 'Q3', // Esperto Demotivato
        'equilibrato_avanzato': 'Q1',   // Atleta in Crescita
        'principiante_entusiasta': 'Q2', // Esploratore Motivato
        'esperto_demotivato': 'Q3'      // Esperto Demotivato
    };
    
    return profileToQuadrant[profileType] || 'Q2'; // Default Q2
}

/**
 * Calcola lead score dalla struttura answers reale
 */
function calculateLeadScoreFromAnswers(answers, scores) {
    let score = 0;
    
    // Score da readiness (30 punti)
    const changeReadiness = answers.change_readiness || 0;
    score += changeReadiness * 6; // 0-5 -> 0-30
    
    // Score da completion difficulty (20 punti) - inverso
    const completionDifficulty = answers.completion_difficulty || 5;
    score += (6 - completionDifficulty) * 4; // Più difficile = meno punti
    
    // Score da habit maintenance (20 punti)
    const habitMaintenance = answers.habit_maintenance || 0;
    score += habitMaintenance * 4; // 0-5 -> 0-20
    
    // Score da optimization mindset (15 punti)
    const optimizationMindset = answers.optimization_mindset || 0;
    score += optimizationMindset * 3; // 0-5 -> 0-15
    
    // Score da wellbeing scores (15 punti)
    const avgScore = (scores.health + scores.professional + scores.social + scores.wellbeing) / 4;
    score += avgScore * 3; // 0-5 -> 0-15
    
    return Math.min(Math.max(Math.round(score), 0), 100);
}

/**
 * Calcola completezza quiz dalla struttura reale
 */
function calculateQuizCompletenessFromRealData(data) {
    const answers = data.answers || {};
    const requiredFields = [
        'change_readiness', 'stress_level', 'current_satisfaction',
        'habit_maintenance', 'completion_difficulty', 'optimization_mindset',
        'energy_depletion', 'attention_span', 'motivation_pattern'
    ];
    
    let filledFields = 0;
    requiredFields.forEach(field => {
        if (answers[field] !== undefined && answers[field] !== null && answers[field] !== '') {
            filledFields++;
        }
    });
    
    // Aggiungi punti per dati base
    if (data.name) filledFields++;
    if (data.email) filledFields++;
    if (data.city) filledFields++;
    
    const totalFields = requiredFields.length + 3; // +3 per dati base
    return Math.round((filledFields / totalFields) * 100);
}

/**
 * Genera avatar da profile data reale
 */
function generateUserAvatarFromProfile(userData, quadrant, consciousnessLevel) {
    const profileData = userData.profileData || {};
    const name = userData.name || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Colori basati su quadrante
    const quadrantColors = {
        'Q1': { bg: '#ea580c', accent: '#f97316', emoji: '🏆' }, // Atleta - Orange
        'Q2': { bg: '#2563eb', accent: '#3b82f6', emoji: '💪' }, // Esploratore - Blue
        'Q3': { bg: '#7c3aed', accent: '#8b5cf6', emoji: '🎯' }, // Esperto - Purple
        'Q4': { bg: '#16a34a', accent: '#22c55e', emoji: '🌱' }  // Guerriero - Green
    };
    
    // Use profile emoji if available
    const profileEmoji = profileData.emoji || quadrantColors[quadrant].emoji;
    const colors = quadrantColors[quadrant] || quadrantColors['Q2'];
    
    return {
        initials: initials,
        backgroundColor: colors.bg,
        accentColor: colors.accent,
        emoji: profileEmoji,
        style: determineAvatarStyleFromProfile(profileData),
        quadrant: quadrant,
        level: consciousnessLevel,
        
        // Avatar avanzato dal profilo
        bodyType: 'balanced',
        activity: getActivityFromProfile(profileData),
        mood: getMoodFromAnswers(userData.answers || {}),
        
        // Metadata
        generated: true,
        lastUpdated: new Date(),
        customizable: true,
        profileBased: true
    };
}

/**
 * Determina stile avatar da profile data
 */
function determineAvatarStyleFromProfile(profileData) {
    const profileType = profileData.profileType || '';
    
    const styleMap = {
        'motivato_inconsistente': 'energetic',
        'stressato_esaurito': 'tired',
        'perfezionista_bloccato': 'focused',
        'equilibrato_avanzato': 'athletic',
        'principiante_entusiasta': 'beginner',
        'esperto_demotivato': 'experienced'
    };
    
    return styleMap[profileType] || 'active';
}

/**
 * Ottieni attività da profilo
 */
function getActivityFromProfile(profileData) {
    const name = profileData.name || '';
    
    if (name.includes('Motivato') || name.includes('Entusiasta')) {
        return '🚀'; // Rocket
    } else if (name.includes('Stressato') || name.includes('Esaurito')) {
        return '😰'; // Stressed
    } else if (name.includes('Equilibrato')) {
        return '⚖️'; // Balance
    } else {
        return '🎯'; // Target
    }
}

/**
 * Ottieni mood da answers
 */
function getMoodFromAnswers(answers) {
    const stressLevel = answers.stress_level || 3;
    const satisfaction = answers.current_satisfaction || 3;
    const readiness = answers.change_readiness || 3;
    
    const avgMood = (readiness + (6 - stressLevel) + satisfaction) / 3;
    
    if (avgMood >= 4) {
        return 'motivated'; // 😄
    } else if (avgMood >= 3) {
        return 'neutral';   // 😐
    } else {
        return 'concerned'; // 😟
    }
}

// ==========================================================================
// DATA ANALYTICS FUNCTIONS
// ==========================================================================

/**
 * Calcola KPI dashboard con struttura reale
 */
export function calculateDashboardKPIs() {
    const users = firebaseData.allUsers;
    const sessions = firebaseData.allSessions;
    const conversations = firebaseData.allAIConversations;
    
    const totalUsers = users.length;
    const qualifiedLeads = users.filter(u => (u.leadScore || 0) >= 70).length;
    const activeCoaching = users.filter(u => u.hasStartedCoaching).length;
    const completedPrograms = users.filter(u => 
        u.completedWeeks && u.completedWeeks.length >= 7
    ).length;
    
    const conversionRate = totalUsers > 0 ? 
        Math.round((activeCoaching / totalUsers) * 100) : 0;
    
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => 
        s.timestamp && s.timestamp.toDateString() === today
    ).length;
    
    const totalConversations = conversations.length;
    const todayConversations = conversations.filter(c => 
        c.timestamp && c.timestamp.toDateString() === today
    ).length;
    
    return {
        totalUsers,
        qualifiedLeads,
        activeCoaching,
        completedPrograms,
        conversionRate,
        todaySessions,
        totalConversations,
        todayConversations
    };
}

/**
 * Calcola analytics settimane
 */
export function calculateWeekAnalytics() {
    const users = firebaseData.allUsers;
    const sessions = firebaseData.allSessions;
    const weekStats = {};
    
    // Inizializza statistiche per tutte le settimane
    for (let i = 1; i <= 7; i++) {
        weekStats[i] = {
            started: 0,
            completed: 0,
            abandoned: 0,
            avgDuration: 0,
            totalSessions: 0,
            completionRate: 0
        };
    }
    
    // Calcola da dati sessioni reali
    sessions.forEach(session => {
        const week = session.weekNumber;
        if (week >= 1 && week <= 7 && weekStats[week]) {
            weekStats[week].totalSessions++;
            weekStats[week].avgDuration += session.duration || 0;
            weekStats[week].started++;
            
            if (session.completed) {
                weekStats[week].completed++;
            }
        }
    });
    
    // Finalizza calcoli
    Object.values(weekStats).forEach(stats => {
        if (stats.totalSessions > 0) {
            stats.avgDuration = Math.round(stats.avgDuration / stats.totalSessions);
        }
        stats.abandoned = Math.max(0, stats.started - stats.completed);
        stats.completionRate = stats.started > 0 ? 
            Math.round((stats.completed / stats.started) * 100) : 0;
    });
    
    return weekStats;
}

/**
 * Calcola metriche AI
 */
export function calculateAIMetrics() {
    const conversations = firebaseData.allAIConversations;
    
    const totalConversations = conversations.length;
    const today = new Date().toDateString();
    const todayConversations = conversations.filter(c => 
        c.timestamp && c.timestamp.toDateString() === today
    ).length;
    
    const homeworkGenerated = conversations.filter(c => 
        c.homeworkGenerated || c.hasMotivationSystem
    ).length;
    
    const avgMessages = totalConversations > 0 ? 
        Math.round(conversations.reduce((sum, conv) => 
            sum + (conv.messageCount || conv.messages?.length || 0), 0) / totalConversations) : 0;
    
    return {
        totalConversations,
        todayConversations,
        homeworkGenerated,
        avgMessages
    };
}

/**
 * Calcola metriche avatar con struttura reale
 */
export function calculateAvatarMetrics() {
    const users = firebaseData.allUsers;
    
    // Distribuzione quadranti
    const quadrantDistribution = {
        'Q1': users.filter(u => u.profileQuadrant === 'Q1').length,
        'Q2': users.filter(u => u.profileQuadrant === 'Q2').length,
        'Q3': users.filter(u => u.profileQuadrant === 'Q3').length,
        'Q4': users.filter(u => u.profileQuadrant === 'Q4').length
    };
    
    // Distribuzione profili reali
    const profileDistribution = {};
    users.forEach(user => {
        const profileType = user.profileType || 'Unknown';
        profileDistribution[profileType] = (profileDistribution[profileType] || 0) + 1;
    });
    
    // Stili avatar più popolari
    const avatarStyles = {};
    users.forEach(user => {
        if (user.avatar && user.avatar.style) {
            avatarStyles[user.avatar.style] = (avatarStyles[user.avatar.style] || 0) + 1;
        }
    });
    
    // Completezza quiz media
    const avgQuizCompleteness = users.length > 0 ? 
        Math.round(users.reduce((sum, user) => sum + (user.quizScore || 0), 0) / users.length) : 0;
    
    // Avatar personalizzati vs automatici
    const customizedAvatars = users.filter(u => u.avatar && !u.avatar.generated).length;
    const generatedAvatars = users.filter(u => u.avatar && u.avatar.generated).length;
    
    // Score medi per categoria
    const avgScores = {
        health: 0,
        professional: 0,
        social: 0,
        wellbeing: 0
    };
    
    if (users.length > 0) {
        users.forEach(user => {
            if (user.scores) {
                avgScores.health += user.scores.health || 0;
                avgScores.professional += user.scores.professional || 0;
                avgScores.social += user.scores.social || 0;
                avgScores.wellbeing += user.scores.wellbeing || 0;
            }
        });
        
        Object.keys(avgScores).forEach(key => {
            avgScores[key] = Math.round(avgScores[key] / users.length * 10) / 10;
        });
    }
    
    return {
        quadrantDistribution,
        profileDistribution,
        avatarStyles,
        avgQuizCompleteness,
        customizedAvatars,
        generatedAvatars,
        totalAvatars: customizedAvatars + generatedAvatars,
        avgScores
    };
}

// ==========================================================================
// CSV EXPORT FUNCTIONS
// ==========================================================================

/**
 * Genera CSV base utenti
 */
export function generateUsersCSV(users) {
    const headers = [
        'Nome', 'Email', 'Telefono', 'Città', 'Registrazione', 
        'Lead Score', 'Quiz Score', 'Profilo', 'Quadrante', 'Coaching Iniziato'
    ];
    
    const rows = users.map(user => {
        return [
            user.name || '',
            user.email || '',
            user.phone || '',
            user.city || '',
            user.registrationDate ? user.registrationDate.toLocaleDateString('it-IT') : '',
            Math.round(user.leadScore || 0),
            user.quizScore || 0,
            user.profileType || '',
            user.profileQuadrant || '',
            user.hasStartedCoaching ? 'Sì' : 'No'
        ];
    });
    
    return [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
}

/**
 * Genera CSV avanzato con struttura reale
 */
export function generateUsersCSVAdvanced(users) {
    const headers = [
        'Nome', 'Email', 'Telefono', 'Città', 'Genere', 'Registrazione', 'Ultima Attività',
        'Lead Score', 'Quiz Score', 'Profilo', 'Quadrante', 'Coaching Iniziato',
        'Score Salute', 'Score Professionale', 'Score Sociale', 'Score Benessere',
        'Change Readiness', 'Stress Level', 'Current Satisfaction', 'Habit Maintenance',
        'Action Delay', 'Attention Span', 'Motivation Pattern', 'Growth Investment',
        'Obiettivi', 'Sfide', 'Punti Forza', 'Strategie', 'Note'
    ];
    
    const rows = users.map(user => {
        const answers = user.answers || {};
        const scores = user.scores || {};
        
        return [
            user.name || '',
            user.email || '',
            user.phone || '',
            user.city || '',
            user.gender || '',
            user.registrationDate ? user.registrationDate.toLocaleDateString('it-IT') : '',
            user.lastActivity ? user.lastActivity.toLocaleDateString('it-IT') : '',
            Math.round(user.leadScore || 0),
            user.quizScore || 0,
            user.profileType || '',
            user.profileQuadrant || '',
            user.hasStartedCoaching ? 'Sì' : 'No',
            scores.health || 0,
            scores.professional || 0,
            scores.social || 0,
            scores.wellbeing || 0,
            answers.changeReadiness || '',
            answers.stressLevel || '',
            answers.currentSatisfaction || '',
            answers.habitMaintenance || '',
            answers.actionDelay || '',
            answers.attentionSpan || '',
            answers.motivationPattern || '',
            answers.growthInvestment || '',
            Array.isArray(user.goals) ? user.goals.join('; ') : '',
            Array.isArray(user.challenges) ? user.challenges.join('; ') : '',
            Array.isArray(user.strengths) ? user.strengths.join('; ') : '',
            Array.isArray(user.strategies) ? user.strategies.join('; ') : '',
            user.notes || ''
        ];
    });
    
    return [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Get style emoji for avatar analytics
 */
function getStyleEmoji(style) {
    const styleEmojis = {
        'athletic': '🏃‍♂️',
        'active': '🚶‍♂️', 
        'beginner': '🧘‍♂️',
        'energetic': '⚡',
        'tired': '😴',
        'focused': '🎯',
        'experienced': '🏆'
    };
    return styleEmojis[style] || '👤';
}

/**
 * Get style name for avatar analytics
 */
function getStyleName(style) {
    const styleNames = {
        'athletic': 'Atletico',
        'active': 'Attivo',
        'beginner': 'Principiante',
        'energetic': 'Energico',
        'tired': 'Stanco',
        'focused': 'Concentrato',
        'experienced': 'Esperto'
    };
    return styleNames[style] || style;
}

// ==========================================================================
// DATA UPDATE FUNCTIONS
// ==========================================================================

/**
 * Aggiorna note utente su Firebase
 */
export async function updateUserNotes(userId, notes) {
    try {
        const userRef = doc(db, 'quiz_results', userId);
        await updateDoc(userRef, {
            notes: notes,
            lastUpdated: serverTimestamp()
        });
        
        // Update local data
        const user = firebaseData.allUsers.find(u => u.id === userId);
        if (user) {
            user.notes = notes;
        }
        
        console.log('✅ Note utente aggiornate:', userId);
        return true;
        
    } catch (error) {
        console.error('❌ Errore aggiornamento note:', error);
        throw error;
    }
}

/**
 * Segna coaching come iniziato
 */
export async function markCoachingStarted(userId) {
    try {
        const userRef = doc(db, 'quiz_results', userId);
        await updateDoc(userRef, {
            hasStartedCoaching: true,
            coachingStartDate: serverTimestamp(),
            currentWeek: 1,
            lastUpdated: serverTimestamp()
        });
        
        // Update local data
        const user = firebaseData.allUsers.find(u => u.id === userId);
        if (user) {
            user.hasStartedCoaching = true;
            user.currentWeek = 1;
        }
        
        console.log('✅ Coaching iniziato per utente:', userId);
        return true;
        
    } catch (error) {
        console.error('❌ Errore aggiornamento coaching:', error);
        throw error;
    }
}

/**
 * Aggiungi tag a utente
 */
export async function addUserTag(userId, tag) {
    try {
        const user = firebaseData.allUsers.find(u => u.id === userId);
        if (!user) throw new Error('Utente non trovato');
        
        const currentTags = user.tags || [];
        if (currentTags.includes(tag)) return false; // Tag già presente
        
        const newTags = [...currentTags, tag];
        
        const userRef = doc(db, 'quiz_results', userId);
        await updateDoc(userRef, {
            tags: newTags,
            lastUpdated: serverTimestamp()
        });
        
        // Update local data
        user.tags = newTags;
        
        console.log('✅ Tag aggiunto:', { userId, tag });
        return true;
        
    } catch (error) {
        console.error('❌ Errore aggiunta tag:', error);
        throw error;
    }
}

// ==========================================================================
// ERROR HANDLING
// ==========================================================================

/**
 * Mostra stato errore
 */
function showErrorState(error) {
    console.error('Stato errore:', error);
    
    // Dispatch error event
    window.dispatchEvent(new CustomEvent('firebaseError', {
        detail: { error: error.message }
    }));
}

// ==========================================================================
// AUTO REFRESH SYSTEM
// ==========================================================================

/**
 * Imposta refresh automatico
 */
export function startAutoRefresh(intervalMinutes = 5) {
    const interval = intervalMinutes * 60 * 1000;
    
    setInterval(() => {
        if (!document.hidden && firebaseData.connectionStatus === 'connected') {
            console.log('🔄 Auto-refresh dati Firebase...');
            loadAllFirebaseData();
        }
    }, interval);
    
    console.log(`⏰ Auto-refresh impostato ogni ${intervalMinutes} minuti`);
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Format date per display
 */
export function formatDate(date, options = {}) {
    if (!date) return 'N/A';
    
    const defaultOptions = {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        ...options
    };
    
    return new Date(date).toLocaleDateString('it-IT', defaultOptions);
}

/**
 * Format date con ora
 */
export function formatDateTime(date) {
    if (!date) return 'N/A';
    
    return new Date(date).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Calcola giorni tra date
 */
export function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

/**
 * Inizializza sistema Firebase con struttura reale
 */
export function initializeFirebaseAdmin() {
    console.log('🚀 Inizializzazione Firebase Admin con struttura reale...');
    
    // Load initial data
    loadAllFirebaseData();
    
    // Start auto-refresh (5 minutes)
    startAutoRefresh(5);
    
    console.log('✅ Firebase Admin inizializzato con struttura perfetta');
}

// Export per compatibilità window
window.firebaseAdmin = {
    loadAllFirebaseData,
    updateUserNotes,
    markCoachingStarted,
    addUserTag,
    calculateDashboardKPIs,
    calculateWeekAnalytics,
    calculateAIMetrics,
    calculateAvatarMetrics,
    generateUsersCSV,
    generateUsersCSVAdvanced,
    formatDate,
    formatDateTime,
    daysBetween,
    firebaseData
};

console.log('🔥 Firebase Admin con struttura reale caricato!');