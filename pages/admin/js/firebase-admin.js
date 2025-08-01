// ==========================================================================
// FIREBASE ADMIN - LIFESTYLEFITNESSCODE DASHBOARD
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
            loadUsersData(),
            loadSessionsData(),
            loadAIConversationsData()
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
            
            console.log('✅ Dati Firebase caricati:', {
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
 * Carica dati utenti da quiz_results con sistema avatar
 */
async function loadUsersData() {
    try {
        const quizSnapshot = await getDocs(query(
            collection(db, 'quiz_results'), 
            orderBy('timestamp', 'desc')
        ));
        
        firebaseData.allUsers = [];
        
        quizSnapshot.forEach(doc => {
            const data = doc.data();
            
            // Determina quadrante e livello coscienza
            const quadrant = determineQuadrant(data);
            const consciousnessLevel = determineConsciousnessLevel(data);
            const leadScore = calculateLeadScore(data);
            
            // Genera avatar automatico
            const avatarData = generateUserAvatar(data, quadrant, consciousnessLevel);
            
            const user = {
                id: doc.id,
                name: data.name || 'Nome non fornito',
                email: data.email || 'Email non fornita',
                phone: data.phone || data.whatsapp || data.telefono || null,
                registrationDate: data.timestamp ? data.timestamp.toDate() : new Date(),
                lastActivity: data.timestamp ? data.timestamp.toDate() : new Date(),
                
                // Status coaching
                currentWeek: data.currentWeek || 1,
                completedWeeks: data.completedWeeks || [],
                totalSessions: data.totalSessions || 0,
                hasStartedCoaching: data.hasStartedCoaching || false,
                
                // Profile data
                profileQuadrant: quadrant,
                consciousnessLevel: consciousnessLevel,
                leadScore: leadScore,
                
                // Avatar system
                avatar: avatarData,
                
                // Quiz data completi
                quizData: data,
                quizScore: calculateQuizCompleteness(data),
                source: 'quiz',
                
                // Profile metadata
                profileType: data.profile_type || data.profile || getProfileName(quadrant),
                goals: Array.isArray(data.goals) ? data.goals : [],
                challenges: Array.isArray(data.challenges) ? data.challenges : 
                           Array.isArray(data.obstacles) ? data.obstacles : [],
                
                // Additional data
                age: data.age || null,
                city: data.city || data.citta || null,
                experience: data.experience || data.esperienza || null,
                activityLevel: data.activity_level || data.livello_attivita || null,
                readinessLevel: data.readiness_level || data.livello_motivazione || null,
                commitmentLevel: data.commitment_level || data.livello_impegno || null,
                
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
        
        console.log('✅ Utenti caricati con avatar:', firebaseData.allUsers.length);
        return firebaseData.allUsers;
        
    } catch (error) {
        console.error('❌ Errore caricamento utenti:', error);
        throw error;
    }
}

/**
 * Carica sessioni coaching
 */
async function loadSessionsData() {
    try {
        const sessionsSnapshot = await getDocs(collection(db, 'coaching_sessions'));
        firebaseData.allSessions = [];
        
        sessionsSnapshot.forEach(doc => {
            const data = doc.data();
            firebaseData.allSessions.push({
                id: doc.id,
                userId: data.userId || data.user_id,
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
                duration: data.duration || 0,
                weekNumber: data.weekNumber || data.week_number || 1,
                questionsAnswered: data.questionsAnswered || data.questions_answered || 0,
                aiResponsesGenerated: data.aiResponsesGenerated || data.ai_responses || 0,
                sessionType: data.sessionType || data.session_type || 'coaching',
                completed: data.completed || false,
                notes: data.notes || '',
                ...data // Include all other fields
            });
        });
        
        console.log('✅ Sessioni caricate:', firebaseData.allSessions.length);
        return firebaseData.allSessions;
        
    } catch (error) {
        console.warn('⚠️ Collezione coaching_sessions non trovata');
        return [];
    }
}

/**
 * Carica conversazioni AI
 */
async function loadAIConversationsData() {
    try {
        // Try ai_conversations first
        let aiSnapshot;
        try {
            aiSnapshot = await getDocs(collection(db, 'ai_conversations'));
        } catch (e) {
            // Fallback to chatbot_conversations
            aiSnapshot = await getDocs(collection(db, 'chatbot_conversations'));
        }
        
        firebaseData.allAIConversations = [];
        
        aiSnapshot.forEach(doc => {
            const data = doc.data();
            firebaseData.allAIConversations.push({
                id: doc.id,
                userId: data.userId || data.user_id,
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
                messages: Array.isArray(data.messages) ? data.messages : [],
                insights: Array.isArray(data.insights) ? data.insights : [],
                homeworkGenerated: data.homeworkGenerated || false,
                customerName: data.customerName || data.customer_name || 'Anonimo',
                sessionComplete: data.sessionComplete || false,
                ...data // Include all other fields
            });
        });
        
        console.log('✅ Conversazioni AI caricate:', firebaseData.allAIConversations.length);
        return firebaseData.allAIConversations;
        
    } catch (error) {
        console.warn('⚠️ Nessuna collezione conversazioni AI trovata');
        return [];
    }
}

// ==========================================================================
// USER PROFILE ANALYSIS FUNCTIONS
// ==========================================================================

/**
 * Determina quadrante da dati quiz
 */
function determineQuadrant(quizData) {
    let competenceScore = 0;
    let motivationScore = 0;
    
    // Analisi competenza tecnica
    if (quizData.experience) {
        const exp = quizData.experience.toLowerCase();
        if (exp.includes('avanzato') || exp.includes('expert')) competenceScore += 2;
        else if (exp.includes('intermedio') || exp.includes('intermediate')) competenceScore += 1;
    }
    
    if (quizData.activity_level) {
        const activity = quizData.activity_level.toLowerCase();
        if (activity.includes('molto attivo') || activity.includes('very active')) competenceScore += 2;
        else if (activity.includes('moderatamente') || activity.includes('moderate')) competenceScore += 1;
    }
    
    // Analisi motivazione emotiva
    if (quizData.goals && Array.isArray(quizData.goals)) {
        motivationScore += Math.min(quizData.goals.length, 2);
    }
    
    if (quizData.readiness_level && quizData.readiness_level >= 4) motivationScore += 1;
    if (quizData.commitment_level && quizData.commitment_level >= 4) motivationScore += 1;
    
    // Determina quadrante finale
    if (competenceScore >= 2 && motivationScore >= 2) return 'Q1'; // Atleta in Crescita
    else if (competenceScore < 2 && motivationScore >= 2) return 'Q2'; // Esploratore Motivato
    else if (competenceScore >= 2 && motivationScore < 2) return 'Q3'; // Esperto Demotivato  
    else return 'Q4'; // Guerriero Determinato
}

/**
 * Determina livello coscienza
 */  
function determineConsciousnessLevel(quizData) {
    let level = 'Opportunista'; // Default
    
    if (quizData.goals && Array.isArray(quizData.goals)) {
        const goals = quizData.goals.join(' ').toLowerCase();
        
        if (goals.includes('comunità') || goals.includes('aiutare') || goals.includes('sociale') || 
            goals.includes('community') || goals.includes('help others')) {
            level = 'Pluralista';
        } else if (goals.includes('successo') || goals.includes('performance') || 
                   goals.includes('competizione') || goals.includes('success') || goals.includes('achieve')) {
            level = 'Achiever';
        } else if (goals.includes('salute') || goals.includes('stabilità') || 
                   goals.includes('routine') || goals.includes('health') || goals.includes('stability')) {
            level = 'Conformista';
        }
    }
    
    return level;
}

// ==========================================================================
// AVATAR GENERATION SYSTEM
// ==========================================================================

/**
 * Genera avatar automatico basato su dati utente
 */
function generateUserAvatar(userData, quadrant, consciousnessLevel) {
    const name = userData.name || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Colori basati su quadrante
    const quadrantColors = {
        'Q1': { bg: '#ea580c', accent: '#f97316', emoji: '🏆' }, // Atleta - Orange
        'Q2': { bg: '#2563eb', accent: '#3b82f6', emoji: '💪' }, // Esploratore - Blue
        'Q3': { bg: '#7c3aed', accent: '#8b5cf6', emoji: '🎯' }, // Esperto - Purple
        'Q4': { bg: '#16a34a', accent: '#22c55e', emoji: '🌱' }  // Guerriero - Green
    };
    
    // Avatar personalizzato basato su dati quiz
    const avatarStyle = getAvatarStyleFromQuiz(userData);
    const colors = quadrantColors[quadrant] || quadrantColors['Q4'];
    
    return {
        initials: initials,
        backgroundColor: colors.bg,
        accentColor: colors.accent,
        emoji: colors.emoji,
        style: avatarStyle,
        quadrant: quadrant,
        level: consciousnessLevel,
        
        // Avatar avanzato
        bodyType: getBodyTypeFromQuiz(userData),
        activity: getActivityAvatarFromQuiz(userData),
        mood: getMoodFromQuiz(userData),
        
        // Metadata
        generated: true,
        lastUpdated: new Date(),
        customizable: true
    };
}

/**
 * Determina stile avatar da dati quiz
 */
function getAvatarStyleFromQuiz(userData) {
    const experience = (userData.experience || '').toLowerCase();
    const activityLevel = (userData.activity_level || '').toLowerCase();
    
    if (experience.includes('avanzato') || activityLevel.includes('molto attivo')) {
        return 'athletic'; // Avatar atletico
    } else if (experience.includes('intermedio') || activityLevel.includes('moderato')) {
        return 'active';   // Avatar attivo
    } else {
        return 'beginner'; // Avatar principiante
    }
}

/**
 * Determina tipo corporeo da quiz
 */
function getBodyTypeFromQuiz(userData) {
    const goals = Array.isArray(userData.goals) ? userData.goals.join(' ').toLowerCase() : '';
    
    if (goals.includes('massa') || goals.includes('muscoli')) {
        return 'muscular';
    } else if (goals.includes('dimagrire') || goals.includes('peso')) {
        return 'slim';
    } else {
        return 'balanced';
    }
}

/**
 * Determina attività avatar da quiz
 */
function getActivityAvatarFromQuiz(userData) {
    const activityLevel = (userData.activity_level || '').toLowerCase();
    
    if (activityLevel.includes('molto attivo')) {
        return '🏃‍♂️'; // Running
    } else if (activityLevel.includes('moderato')) {
        return '🚶‍♂️'; // Walking
    } else {
        return '🧘‍♂️'; // Meditation
    }
}

/**
 * Determina mood da dati quiz
 */
function getMoodFromQuiz(userData) {
    const readiness = userData.readiness_level || 0;
    const commitment = userData.commitment_level || 0;
    const avgMotivation = (readiness + commitment) / 2;
    
    if (avgMotivation >= 4) {
        return 'motivated'; // 😄
    } else if (avgMotivation >= 3) {
        return 'neutral';   // 😐
    } else {
        return 'concerned'; // 😟
    }
}

/**
 * Calcola completezza quiz
 */
function calculateQuizCompleteness(quizData) {
    const requiredFields = [
        'name', 'email', 'age', 'experience', 'activity_level', 
        'goals', 'readiness_level', 'commitment_level'
    ];
    
    let filledFields = 0;
    requiredFields.forEach(field => {
        if (quizData[field] && quizData[field] !== '' && quizData[field] !== null) {
            filledFields++;
        }
    });
    
    return Math.round((filledFields / requiredFields.length) * 100);
}
function calculateLeadScore(quizData) {
    if (quizData.lead_score && quizData.lead_score > 0) return quizData.lead_score;
    
    let score = 0;
    
    // Score da esperienza (20 punti)
    if (quizData.experience) {
        const exp = quizData.experience.toLowerCase();
        if (exp.includes('avanzato') || exp.includes('expert')) score += 20;
        else if (exp.includes('intermedio') || exp.includes('intermediate')) score += 15;
        else if (exp.includes('principiante') || exp.includes('beginner')) score += 10;
    }
    
    // Score da obiettivi (25 punti)
    if (quizData.goals && Array.isArray(quizData.goals)) {
        score += Math.min(quizData.goals.length * 5, 25);
    }
    
    // Score da readiness (20 punti)
    if (quizData.readiness_level && !isNaN(quizData.readiness_level)) {
        score += Math.min(quizData.readiness_level * 4, 20);
    }
    
    // Score da commitment (15 punti)  
    if (quizData.commitment_level && !isNaN(quizData.commitment_level)) {
        score += Math.min(quizData.commitment_level * 3, 15);
    }
    
    // Score da completezza dati (20 punti)
    if (quizData.email) score += 10;
    if (quizData.name) score += 5;
    if (quizData.phone || quizData.whatsapp) score += 5;
    
    return Math.min(Math.max(score, 0), 100);
}

/**
 * Ottieni nome profilo user-friendly
 */
function getProfileName(quadrant) {
    const names = {
        'Q1': 'Atleta in Crescita',
        'Q2': 'Esploratore Motivato', 
        'Q3': 'Esperto Demotivato',
        'Q4': 'Guerriero Determinato'
    };
    return names[quadrant] || 'Profilo Indefinito';
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
// DATA ANALYTICS FUNCTIONS
// ==========================================================================

/**
 * Calcola KPI dashboard
 */
export function calculateDashboardKPIs() {
    const users = firebaseData.allUsers;
    const sessions = firebaseData.allSessions;
    const conversations = firebaseData.allAIConversations;
    
    const totalUsers = users.length;
    const qualifiedLeads = users.filter(u => (u.leadScore || 0) >= 70).length;
    const activeCoaching = users.filter(u => u.hasStartedCoaching).length;
    const completedPrograms = users.filter(u => 
        u.completedWeeks && u.completedWeeks.includes(7)
    ).length;
    
    const conversionRate = totalUsers > 0 ? 
        Math.round((activeCoaching / totalUsers) * 100) : 0;
    
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => 
        s.timestamp.toDateString() === today
    ).length;
    
    const totalConversations = conversations.length;
    const todayConversations = conversations.filter(c => 
        c.timestamp.toDateString() === today
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
    
    // Calcola da dati utenti
    users.forEach(user => {
        const currentWeek = user.currentWeek || 1;
        const completedWeeks = user.completedWeeks || [];
        
        // Settimane iniziate
        for (let week = 1; week <= Math.min(currentWeek, 7); week++) {
            weekStats[week].started++;
        }
        
        // Settimane completate
        completedWeeks.forEach(week => {
            if (week >= 1 && week <= 7 && weekStats[week]) {
                weekStats[week].completed++;
            }
        });
    });
    
    // Calcola durata media dalle sessioni
    sessions.forEach(session => {
        const week = session.weekNumber;
        if (week >= 1 && week <= 7 && weekStats[week]) {
            weekStats[week].totalSessions++;
            weekStats[week].avgDuration += session.duration || 0;
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
        c.timestamp.toDateString() === today
    ).length;
    
    const homeworkGenerated = conversations.filter(c => 
        c.homeworkGenerated
    ).length;
    
    const avgMessages = totalConversations > 0 ? 
        Math.round(conversations.reduce((sum, conv) => 
            sum + (conv.messages?.length || 0), 0) / totalConversations) : 0;
    
    return {
        totalConversations,
        todayConversations,
        homeworkGenerated,
        avgMessages
    };
}

// ==========================================================================
// EXPORT FUNCTIONS
// ==========================================================================

/**
 * Calcola metriche avatar
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
    
    return {
        quadrantDistribution,
        avatarStyles,
        avgQuizCompleteness,
        customizedAvatars,
        generatedAvatars,
        totalAvatars: customizedAvatars + generatedAvatars
    };
}

/**
 * Genera CSV potenziato con dati avatar
 */
export function generateUsersCSVAdvanced(users) {
    const headers = [
        'Nome', 'Email', 'Telefono', 'Registrazione', 'Ultima Attività',
        'Lead Score', 'Quiz Score', 'Profilo', 'Quadrante', 'Livello Coscienza', 
        'Avatar Emoji', 'Avatar Style', 'Esperienza', 'Livello Attività',
        'Motivazione', 'Impegno', 'Età', 'Città', 'Obiettivi', 'Sfide',
        'Settimane Completate', 'Coaching Iniziato', 'Note'
    ];
    
    const rows = users.map(user => {
        const completedWeeks = user.completedWeeks ? user.completedWeeks.length : 0;
        
        return [
            user.name || '',
            user.email || '',
            user.phone || '',
            user.registrationDate ? user.registrationDate.toLocaleDateString('it-IT') : '',
            user.lastActivity ? user.lastActivity.toLocaleDateString('it-IT') : '',
            Math.round(user.leadScore || 0),
            user.quizScore || 0,
            user.profileType || '',
            user.profileQuadrant || '',
            user.consciousnessLevel || '',
            user.avatar ? user.avatar.emoji : '',
            user.avatar ? user.avatar.style : '',
            user.experience || '',
            user.activityLevel || '',
            user.readinessLevel || '',
            user.commitmentLevel || '',
            user.age || '',
            user.city || '',
            Array.isArray(user.goals) ? user.goals.join('; ') : '',
            Array.isArray(user.challenges) ? user.challenges.join('; ') : '',
            completedWeeks,
            user.hasStartedCoaching ? 'Sì' : 'No',
            user.notes || ''
        ];
    });
    
    return [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
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
 * Inizializza sistema Firebase
 */
export function initializeFirebaseAdmin() {
    console.log('🚀 Inizializzazione Firebase Admin...');
    
    // Load initial data
    loadAllFirebaseData();
    
    // Start auto-refresh (5 minutes)
    startAutoRefresh(5);
    
    console.log('✅ Firebase Admin inizializzato');
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
    generateUsersCSV,
    formatDate,
    formatDateTime,
    daysBetween,
    firebaseData
};

console.log('🔥 Firebase Admin module caricato');