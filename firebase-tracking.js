// firebase-tracking.js - Sistema di tracking completo per TribuCoach
import { db } from './firebase.js';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    increment,
    arrayUnion
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// === STRUTTURA COLLECTIONS FIREBASE ===
/*
COLLECTIONS PRINCIPALI:

1. users
   - id: user_id (hash email)
   - email: string
   - name: string
   - source: string ("quiz", "chatbot", "landing")
   - profile: string (dal quiz)
   - score: number (dal quiz)
   - created_at: timestamp
   - last_activity: timestamp
   - total_sessions: number
   - quiz_completed: boolean
   - consultation_booked: boolean

2. chatbot_conversations
   - id: auto-generated
   - user_id: string
   - session_id: string
   - messages_count: number
   - duration_minutes: number
   - topics_discussed: array
   - sentiment: string ("positive", "neutral", "negative")
   - satisfaction_rating: number (1-5)
   - lead_generated: boolean
   - created_at: timestamp
   - updated_at: timestamp

3. user_sessions
   - id: auto-generated
   - user_id: string
   - session_type: string ("quiz", "chatbot", "landing_visit")
   - duration_seconds: number
   - pages_visited: array
   - actions_taken: array
   - referrer: string
   - device_info: object
   - created_at: timestamp

4. analytics_events
   - id: auto-generated
   - user_id: string (optional)
   - event_type: string
   - event_data: object
   - page_url: string
   - user_agent: string
   - ip_hash: string (privacy-safe)
   - created_at: timestamp

5. business_metrics
   - id: date (YYYY-MM-DD)
   - total_visitors: number
   - quiz_completions: number
   - chatbot_interactions: number
   - consultations_booked: number
   - conversion_rate: number
   - avg_session_duration: number
   - top_topics: array
   - created_at: timestamp
   - updated_at: timestamp
*/

// === USER TRACKING ===
export async function trackUser(userData) {
    try {
        const userId = generateUserId(userData.email);
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            // Aggiorna utente esistente
            await updateDoc(userRef, {
                last_activity: serverTimestamp(),
                total_sessions: increment(1),
                ...userData
            });
        } else {
            // Crea nuovo utente
            await updateDoc(userRef, {
                ...userData,
                user_id: userId,
                created_at: serverTimestamp(),
                last_activity: serverTimestamp(),
                total_sessions: 1,
                quiz_completed: userData.source === 'quiz',
                consultation_booked: false
            });
        }
        
        console.log('✅ User tracked:', userId);
        return userId;
    } catch (error) {
        console.error('❌ Errore tracking user:', error);
        throw error;
    }
}

// === CHATBOT TRACKING ===
export async function trackChatbotConversation(conversationData) {
    try {
        const docRef = await addDoc(collection(db, 'chatbot_conversations'), {
            ...conversationData,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        });
        
        // Aggiorna metriche utente se presente
        if (conversationData.user_id) {
            await updateUserActivity(conversationData.user_id, 'chatbot_conversation');
        }
        
        console.log('✅ Chatbot conversation tracked:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore tracking chatbot:', error);
        throw error;
    }
}

// === SESSION TRACKING ===
export async function trackSession(sessionData) {
    try {
        const docRef = await addDoc(collection(db, 'user_sessions'), {
            ...sessionData,
            created_at: serverTimestamp()
        });
        
        console.log('✅ Session tracked:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore tracking session:', error);
        throw error;
    }
}

// === EVENTI ANALYTICS ===
export async function trackEvent(eventType, eventData = {}, userId = null) {
    try {
        const docRef = await addDoc(collection(db, 'analytics_events'), {
            user_id: userId,
            event_type: eventType,
            event_data: eventData,
            page_url: window.location.href,
            user_agent: navigator.userAgent,
            ip_hash: await generateIpHash(), // Privacy-safe
            created_at: serverTimestamp()
        });
        
        console.log('✅ Event tracked:', eventType);
        return docRef.id;
    } catch (error) {
        console.error('❌ Errore tracking event:', error);
        throw error;
    }
}

// === METRICHE BUSINESS ===
export async function updateBusinessMetrics() {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const metricsRef = doc(db, 'business_metrics', today);
        
        // Calcola metriche del giorno
        const metrics = await calculateDailyMetrics();
        
        await updateDoc(metricsRef, {
            ...metrics,
            updated_at: serverTimestamp()
        });
        
        console.log('✅ Business metrics updated for:', today);
        return metrics;
    } catch (error) {
        console.error('❌ Errore updating business metrics:', error);
        throw error;
    }
}

// === UTILITY FUNCTIONS ===
function generateUserId(email) {
    // Crea hash privacy-safe dell'email
    return btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
}

async function generateIpHash() {
    // Privacy-safe IP hashing (non salviamo IP reali)
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return btoa(data.ip).substring(0, 10); // Hash parziale per privacy
    } catch {
        return 'unknown';
    }
}

async function updateUserActivity(userId, activityType) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            last_activity: serverTimestamp(),
            [`activity_${activityType}`]: increment(1)
        });
    } catch (error) {
        console.error('❌ Errore updating user activity:', error);
    }
}

async function calculateDailyMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
        // Query per metriche giornaliere
        const [visitors, quizzes, chats, consultations] = await Promise.all([
            getDocs(query(collection(db, 'user_sessions'), where('created_at', '>=', today))),
            getDocs(query(collection(db, 'quiz_results'), where('timestamp', '>=', today))),
            getDocs(query(collection(db, 'chatbot_conversations'), where('created_at', '>=', today))),
            getDocs(query(collection(db, 'users'), where('consultation_booked', '==', true)))
        ]);
        
        const totalVisitors = new Set(visitors.docs.map(doc => doc.data().user_id)).size;
        const quizCompletions = quizzes.size;
        const chatbotInteractions = chats.size;
        const consultationsBooked = consultations.size;
        
        return {
            total_visitors: totalVisitors,
            quiz_completions: quizCompletions,
            chatbot_interactions: chatbotInteractions,
            consultations_booked: consultationsBooked,
            conversion_rate: totalVisitors > 0 ? (consultationsBooked / totalVisitors * 100).toFixed(2) : 0,
            created_at: serverTimestamp()
        };
    } catch (error) {
        console.error('❌ Errore calculating metrics:', error);
        return {};
    }
}

// === WEBHOOK HANDLERS (per Chatbase) ===
export async function handleChatbaseWebhook(webhookData) {
    try {
        const conversationData = {
            user_id: webhookData.user_id || null,
            session_id: webhookData.conversation_id,
            messages_count: webhookData.messages?.length || 0,
            duration_minutes: calculateDuration(webhookData.start_time, webhookData.end_time),
            topics_discussed: extractTopics(webhookData.messages),
            sentiment: analyzeSentiment(webhookData.messages),
            satisfaction_rating: webhookData.rating || null,
            lead_generated: checkLeadGeneration(webhookData.messages)
        };
        
        await trackChatbotConversation(conversationData);
        await trackEvent('chatbot_conversation_completed', conversationData, conversationData.user_id);
        
        return { success: true };
    } catch (error) {
        console.error('❌ Errore webhook handler:', error);
        return { success: false, error: error.message };
    }
}

// === ANALYTICS HELPERS ===
function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    return Math.round((new Date(endTime) - new Date(startTime)) / 60000); // minuti
}

function extractTopics(messages) {
    if (!messages) return [];
    
    const topics = [];
    const keywords = {
        'fitness': ['allenamento', 'workout', 'esercizi', 'palestra'],
        'nutrition': ['alimentazione', 'dieta', 'cibo', 'nutrizione'],
        'goals': ['obiettivi', 'goal', 'target', 'risultati'],
        'consultation': ['consulenza', 'appuntamento', 'incontro', 'personal']
    };
    
    messages.forEach(msg => {
        const text = msg.content?.toLowerCase() || '';
        Object.entries(keywords).forEach(([topic, words]) => {
            if (words.some(word => text.includes(word)) && !topics.includes(topic)) {
                topics.push(topic);
            }
        });
    });
    
    return topics;
}

function analyzeSentiment(messages) {
    // Semplice sentiment analysis basata su parole chiave
    if (!messages) return 'neutral';
    
    const positiveWords = ['grazie', 'perfetto', 'ottimo', 'bene', 'fantastico'];
    const negativeWords = ['problema', 'difficile', 'male', 'non funziona'];
    
    let score = 0;
    messages.forEach(msg => {
        const text = msg.content?.toLowerCase() || '';
        positiveWords.forEach(word => {
            if (text.includes(word)) score += 1;
        });
        negativeWords.forEach(word => {
            if (text.includes(word)) score -= 1;
        });
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
}

function checkLeadGeneration(messages) {
    if (!messages) return false;
    
    const leadIndicators = ['consulenza', 'contatto', 'email', 'telefono', 'appuntamento'];
    return messages.some(msg => 
        leadIndicators.some(indicator => 
            msg.content?.toLowerCase().includes(indicator)
        )
    );
}

// === AUTO-TRACKING INIZIALIZZAZIONE ===
export function initializeTracking() {
    console.log('🔍 Inizializzazione tracking TribuCoach...');
    
    // Auto-track page views
    trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer,
        title: document.title
    });
    
    // Auto-track quiz completion (se nella pagina quiz)
    if (window.location.pathname.includes('quiz')) {
        // Il tracking del quiz è già implementato nel quiz.html
        console.log('📊 Quiz tracking attivo');
    }
    
    // Auto-track session start
    const sessionData = {
        session_type: getSessionType(),
        user_id: getUserIdFromStorage(),
        device_info: {
            screen: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        referrer: document.referrer
    };
    
    trackSession(sessionData);
    
    console.log('✅ Tracking inizializzato');
}

function getSessionType() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('quiz')) return 'quiz';
    if (path.includes('chat')) return 'chatbot';
    if (path.includes('dashboard')) return 'dashboard';
    return 'landing_visit';
}

function getUserIdFromStorage() {
    // Cerca user ID in localStorage o sessionStorage
    return localStorage.getItem('tribucoach_user_id') || 
           sessionStorage.getItem('tribucoach_user_id') || 
           null;
}

// === EXPORT DELLE FUNZIONI PRINCIPALI ===
export {
    trackUser,
    trackChatbotConversation,
    trackSession,
    trackEvent,
    updateBusinessMetrics,
    handleChatbaseWebhook
};