// firebase-tracking.js - Sistema di tracking TribuCoach
// Updated: Rimossa integrazione Chatbase, ora usa OpenAI diretto

// === IMPORTS ===
import { db } from './firebase.js';
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
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// === CONFIGURAZIONE ===
const TRACKING_CONFIG = {
    enableAnalytics: true,
    enableUserSessions: true,
    enableQuizTracking: true,
    enableChatTracking: true, // Ora via OpenAI Functions
    enableConversions: true
};

// === TRACKING SESSIONI UTENTE ===
export function initUserTracking() {
    console.log('🔄 Inizializzazione tracking utente...');
    
    try {
        // Genera session ID unico
        const sessionId = generateSessionId();
        
        // Salva session data
        const sessionData = {
            sessionId: sessionId,
            startTime: new Date(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            currentPage: window.location.pathname,
            timestamp: serverTimestamp()
        };
        
        // Salva sessione
        saveUserSession(sessionData);
        
        // Track page views
        trackPageView();
        
        console.log('✅ User tracking inizializzato:', sessionId);
        return sessionId;
        
    } catch (error) {
        console.error('❌ Errore inizializzazione tracking:', error);
        return null;
    }
}

async function saveUserSession(sessionData) {
    try {
        await addDoc(collection(db, 'user_sessions'), sessionData);
        console.log('📊 Sessione utente salvata');
    } catch (error) {
        console.error('❌ Errore salvataggio sessione:', error);
    }
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// === TRACKING QUIZ ===
export async function trackQuizStart(quizType = 'fitness') {
    try {
        const eventData = {
            event: 'quiz_started',
            quizType: quizType,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId(),
            page: window.location.pathname
        };
        
        await addDoc(collection(db, 'analytics_events'), eventData);
        console.log('📊 Quiz start tracked');
    } catch (error) {
        console.error('❌ Errore tracking quiz start:', error);
    }
}

export async function trackQuizCompletion(quizData, results) {
    try {
        const eventData = {
            event: 'quiz_completed',
            quizData: quizData,
            results: results,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId(),
            completionTime: new Date()
        };
        
        await addDoc(collection(db, 'analytics_events'), eventData);
        console.log('📊 Quiz completion tracked');
    } catch (error) {
        console.error('❌ Errore tracking quiz completion:', error);
    }
}

// === TRACKING CONVERSAZIONI (OpenAI Integration) ===
export async function trackChatStart() {
    try {
        const eventData = {
            event: 'chat_started',
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId(),
            source: 'openai_direct'
        };
        
        await addDoc(collection(db, 'analytics_events'), eventData);
        console.log('💬 Chat start tracked');
    } catch (error) {
        console.error('❌ Errore tracking chat start:', error);
    }
}

export async function trackChatMessage(messageData) {
    try {
        const eventData = {
            event: 'chat_message',
            messageType: messageData.role,
            messageLength: messageData.content.length,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId(),
            conversationId: messageData.conversationId
        };
        
        await addDoc(collection(db, 'analytics_events'), eventData);
        console.log('💬 Chat message tracked');
    } catch (error) {
        console.error('❌ Errore tracking chat message:', error);
    }
}

// === TRACKING CONVERSIONI ===
export async function trackLeadConversion(leadData) {
    try {
        const eventData = {
            event: 'lead_conversion',
            leadData: leadData,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId(),
            source: leadData.source || 'unknown'
        };
        
        await addDoc(collection(db, 'analytics_events'), eventData);
        console.log('🎯 Lead conversion tracked');
    } catch (error) {
        console.error('❌ Errore tracking conversion:', error);
    }
}

export async function trackFormSubmission(formType, formData) {
    try {
        const eventData = {
            event: 'form_submission',
            formType: formType,
            formData: formData,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId()
        };
        
        await addDoc(collection(db, 'analytics_events'), eventData);
        console.log('📝 Form submission tracked');
    } catch (error) {
        console.error('❌ Errore tracking form:', error);
    }
}

// === TRACKING NAVIGAZIONE ===
export function trackPageView() {
    try {
        const eventData = {
            event: 'page_view',
            page: window.location.pathname,
            title: document.title,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId()
        };
        
        addDoc(collection(db, 'analytics_events'), eventData);
        console.log('📄 Page view tracked:', window.location.pathname);
    } catch (error) {
        console.error('❌ Errore tracking page view:', error);
    }
}

export function trackButtonClick(buttonName, buttonLocation) {
    try {
        const eventData = {
            event: 'button_click',
            buttonName: buttonName,
            buttonLocation: buttonLocation,
            timestamp: serverTimestamp(),
            sessionId: getCurrentSessionId(),
            page: window.location.pathname
        };
        
        addDoc(collection(db, 'analytics_events'), eventData);
        console.log('🔘 Button click tracked:', buttonName);
    } catch (error) {
        console.error('❌ Errore tracking button click:', error);
    }
}

// === ANALYTICS E METRICHE ===
export async function getAnalyticsData(timeRange = '7d') {
    try {
        console.log('📊 Recupero analytics data...');
        
        const startDate = getDateFromRange(timeRange);
        const q = query(
            collection(db, 'analytics_events'),
            where('timestamp', '>=', startDate),
            orderBy('timestamp', 'desc'),
            limit(1000)
        );
        
        const snapshot = await getDocs(q);
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        console.log(`📊 Analytics recuperati: ${events.length} eventi`);
        return processAnalyticsData(events);
        
    } catch (error) {
        console.error('❌ Errore recupero analytics:', error);
        return null;
    }
}

function processAnalyticsData(events) {
    const analytics = {
        totalEvents: events.length,
        uniqueSessions: new Set(events.map(e => e.sessionId)).size,
        eventsByType: {},
        dailyStats: {},
        conversionFunnel: {
            pageViews: 0,
            quizStarts: 0,
            quizCompletions: 0,
            chatStarts: 0,
            leadConversions: 0
        }
    };
    
    // Processa eventi
    events.forEach(event => {
        // Count by type
        analytics.eventsByType[event.event] = (analytics.eventsByType[event.event] || 0) + 1;
        
        // Daily stats
        const day = event.timestamp.toDateString();
        if (!analytics.dailyStats[day]) {
            analytics.dailyStats[day] = { events: 0, sessions: new Set() };
        }
        analytics.dailyStats[day].events++;
        analytics.dailyStats[day].sessions.add(event.sessionId);
        
        // Conversion funnel
        switch(event.event) {
            case 'page_view': analytics.conversionFunnel.pageViews++; break;
            case 'quiz_started': analytics.conversionFunnel.quizStarts++; break;
            case 'quiz_completed': analytics.conversionFunnel.quizCompletions++; break;
            case 'chat_started': analytics.conversionFunnel.chatStarts++; break;
            case 'lead_conversion': analytics.conversionFunnel.leadConversions++; break;
        }
    });
    
    // Calcola conversion rates
    analytics.conversionRates = {
        quizCompletion: analytics.conversionFunnel.quizStarts > 0 ? 
            (analytics.conversionFunnel.quizCompletions / analytics.conversionFunnel.quizStarts * 100).toFixed(1) : 0,
        leadConversion: analytics.conversionFunnel.pageViews > 0 ? 
            (analytics.conversionFunnel.leadConversions / analytics.conversionFunnel.pageViews * 100).toFixed(1) : 0
    };
    
    return analytics;
}

function getDateFromRange(range) {
    const now = new Date();
    switch(range) {
        case '1d': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
}

// === UTILITY FUNCTIONS ===
function getCurrentSessionId() {
    return sessionStorage.getItem('tribucoach_session_id') || 'unknown';
}

export function setSessionId(sessionId) {
    sessionStorage.setItem('tribucoach_session_id', sessionId);
}

// === PAGE NAVIGATION TRACKING ===
export function initNavigationTracking() {
    // Track initial page load
    trackPageView();
    
    // Track navigation changes (SPA)
    let currentPath = window.location.pathname;
    
    // Listen for URL changes
    setInterval(() => {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;
            trackPageView();
        }
    }, 1000);
    
    // Track clicks on important elements
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        // Track CTA clicks
        if (target.classList.contains('cta-primary') || target.classList.contains('cta-secondary')) {
            trackButtonClick(target.textContent.trim(), target.className);
        }
        
        // Track navigation clicks
        if (target.tagName === 'A' && target.href) {
            trackButtonClick(`Link: ${target.textContent.trim()}`, 'navigation');
        }
    });
}

// === CHATBASE INTEGRATION REMOVED ===
// Il sistema ora usa direttamente OpenAI + Firebase Functions
// Le conversazioni vengono salvate automaticamente tramite chatWithOpenAI function
console.log('🔄 Firebase Tracking attivo - Chatbase integration rimossa, ora usa OpenAI diretto');

// === EXPORTS ===
export {
    TRACKING_CONFIG,
    initUserTracking,
    initNavigationTracking,
    trackQuizStart,
    trackQuizCompletion,
    trackChatStart,
    trackChatMessage,
    trackLeadConversion,
    trackFormSubmission,
    trackPageView,
    trackButtonClick,
    getAnalyticsData
};

// === AUTO-INIT ===
// Inizializza tracking quando il modulo viene caricato
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const sessionId = initUserTracking();
        if (sessionId) {
            setSessionId(sessionId);
            initNavigationTracking();
        }
    });
}