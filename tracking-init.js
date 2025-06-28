// tracking-init.js - Inizializzazione completa sistema tracking TribuCoach
import { initializeTracking, trackUser, trackEvent } from './firebase-tracking.js';
import { initializeDashboardTracking, testChatbotIntegration } from './dashboard-tracking.js';

// === CONFIGURAZIONE GLOBALE ===
const TRACKING_CONFIG = {
    autoTrack: true,
    enableRealtime: true,
    debugMode: true,
    trackingInterval: 30000, // 30 secondi
    sessionTimeout: 1800000  // 30 minuti
};

// === CLASSE PRINCIPALE TRACKING MANAGER ===
class TribuCoachTracker {
    constructor(config = TRACKING_CONFIG) {
        this.config = config;
        this.isInitialized = false;
        this.currentSession = null;
        this.trackingTimers = [];
        
        console.log('🔧 TribuCoach Tracker creato con config:', config);
    }

    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️ Tracker già inizializzato');
            return;
        }

        try {
            console.log('🚀 Inizializzazione TribuCoach Tracker...');

            // 1. Inizializza tracking base
            initializeTracking();

            // 2. Inizializza dashboard tracking se siamo nella dashboard
            if (this.isDashboardPage()) {
                const { tracker, webhookHandler } = initializeDashboardTracking();
                this.dashboardTracker = tracker;
                this.webhookHandler = webhookHandler;
            }

            // 3. Setup session tracking
            await this.initializeSession();

            // 4. Setup auto-tracking
            if (this.config.autoTrack) {
                this.setupAutoTracking();
            }

            // 5. Setup page tracking
            this.setupPageTracking();

            // 6. Setup user interaction tracking
            this.setupInteractionTracking();

            this.isInitialized = true;
            console.log('✅ TribuCoach Tracker inizializzato con successo');

            // Test automatico se in debug mode
            if (this.config.debugMode && this.isDashboardPage()) {
                setTimeout(() => {
                    console.log('🧪 Avvio test automatico...');
                    testChatbotIntegration();
                }, 3000);
            }

        } catch (error) {
            console.error('❌ Errore inizializzazione tracker:', error);
        }
    }

    // === SESSION MANAGEMENT ===
    async initializeSession() {
        this.currentSession = {
            id: this.generateSessionId(),
            startTime: new Date(),
            pageViews: 0,
            interactions: 0,
            userId: this.getCurrentUserId()
        };

        // Track session start
        await trackEvent('session_start', {
            session_id: this.currentSession.id,
            page: window.location.pathname,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        }, this.currentSession.userId);

        console.log('📊 Sessione inizializzata:', this.currentSession.id);
    }

    // === AUTO-TRACKING SETUP ===
    setupAutoTracking() {
        // Track scroll depth
        let maxScroll = 0;
        const trackScroll = () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll >= 25 && maxScroll % 25 === 0) { // 25%, 50%, 75%, 100%
                    trackEvent('scroll_depth', { percent: maxScroll }, this.currentSession?.userId);
                }
            }
        };
        window.addEventListener('scroll', trackScroll);

        // Track time on page
        const startTime = Date.now();
        const trackTimeOnPage = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            trackEvent('time_on_page', { 
                seconds: timeSpent,
                page: window.location.pathname 
            }, this.currentSession?.userId);
        };

        // Track ogni 30 secondi
        const timeTracker = setInterval(trackTimeOnPage, this.config.trackingInterval);
        this.trackingTimers.push(timeTracker);

        // Track before page unload
        window.addEventListener('beforeunload', () => {
            trackTimeOnPage();
            this.endSession();
        });

        console.log('⏱️ Auto-tracking attivato');
    }

    // === PAGE TRACKING ===
    setupPageTracking() {
        // Track page view
        trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title,
            url: window.location.href
        }, this.currentSession?.userId);

        this.currentSession.pageViews++;

        // Track page type
        const pageType = this.getPageType();
        if (pageType) {
            trackEvent('page_type_view', { 
                type: pageType,
                page: window.location.pathname 
            }, this.currentSession?.userId);
        }

        console.log('📄 Page tracking attivato per:', pageType);
    }

    // === INTERACTION TRACKING ===
    setupInteractionTracking() {
        // Track clicks su elementi importanti
        document.addEventListener('click', (event) => {
            const element = event.target;
            let trackData = null;

            // CTA buttons
            if (element.classList.contains('cta-btn') || element.classList.contains('cta-primary') || element.classList.contains('cta-secondary')) {
                trackData = {
                    type: 'cta_click',
                    element: element.textContent?.trim(),
                    href: element.href || null
                };
            }
            // Quiz buttons
            else if (element.classList.contains('answer-btn') || element.classList.contains('continue-btn')) {
                trackData = {
                    type: 'quiz_interaction',
                    element: element.textContent?.trim(),
                    question_number: this.getQuizQuestionNumber()
                };
            }
            // Form submissions
            else if (element.type === 'submit') {
                trackData = {
                    type: 'form_submit',
                    form: element.closest('form')?.id || 'unknown'
                };
            }
            // External links
            else if (element.tagName === 'A' && element.href && !element.href.startsWith(window.location.origin)) {
                trackData = {
                    type: 'external_link_click',
                    url: element.href,
                    text: element.textContent?.trim()
                };
            }

            if (trackData) {
                trackEvent('user_interaction', trackData, this.currentSession?.userId);
                this.currentSession.interactions++;
                console.log('👆 Interaction tracked:', trackData.type);
            }
        });

        // Track form focus (interesse)
        document.addEventListener('focus', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                trackEvent('form_field_focus', {
                    field_type: event.target.type,
                    field_name: event.target.name || event.target.id,
                    form: event.target.closest('form')?.id || 'unknown'
                }, this.currentSession?.userId);
            }
        }, true);

        console.log('🖱️ Interaction tracking attivato');
    }

    // === USER IDENTIFICATION ===
    identifyUser(userData) {
        const userId = trackUser(userData);
        this.currentSession.userId = userId;
        
        // Salva in localStorage per persistenza
        localStorage.setItem('tribucoach_user_id', userId);
        
        console.log('👤 Utente identificato:', userId);
        return userId;
    }

    getCurrentUserId() {
        return localStorage.getItem('tribucoach_user_id') || 
               sessionStorage.getItem('tribucoach_user_id') || 
               null;
    }

    // === UTILITY METHODS ===
    getPageType() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('quiz')) return 'quiz';
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('chat')) return 'chatbot';
        if (path === '/' || path.includes('index')) return 'landing';
        return 'other';
    }

    isDashboardPage() {
        return window.location.pathname.toLowerCase().includes('dashboard');
    }

    getQuizQuestionNumber() {
        // Cerca elementi che indicano il numero della domanda
        const questionElement = document.querySelector('h2');
        if (questionElement) {
            const match = questionElement.textContent.match(/(\d+)\./);
            return match ? parseInt(match[1]) : null;
        }
        return null;
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // === SESSION END ===
    endSession() {
        if (!this.currentSession) return;

        const duration = Date.now() - this.currentSession.startTime.getTime();
        
        trackEvent('session_end', {
            session_id: this.currentSession.id,
            duration_ms: duration,
            page_views: this.currentSession.pageViews,
            interactions: this.currentSession.interactions
        }, this.currentSession.userId);

        console.log('🏁 Sessione terminata:', {
            id: this.currentSession.id,
            duration: Math.round(duration / 1000) + 's',
            pageViews: this.currentSession.pageViews,
            interactions: this.currentSession.interactions
        });
    }

    // === CLEANUP ===
    destroy() {
        // Clear timers
        this.trackingTimers.forEach(timer => clearInterval(timer));
        this.trackingTimers = [];

        // End session
        this.endSession();

        // Cleanup dashboard tracker
        if (this.dashboardTracker) {
            this.dashboardTracker.destroy();
        }

        this.isInitialized = false;
        console.log('🧹 TribuCoach Tracker distrutto');
    }
}

// === INIZIALIZZAZIONE AUTOMATICA ===
let globalTracker = null;

function initializeTribuCoachTracking(config = TRACKING_CONFIG) {
    if (globalTracker) {
        console.log('⚠️ Tracker già esistente');
        return globalTracker;
    }

    globalTracker = new TribuCoachTracker(config);
    
    // Inizializza quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            globalTracker.initialize();
        });
    } else {
        globalTracker.initialize();
    }

    // Rendi disponibile globalmente per debug
    window.tribuCoachTracker = globalTracker;

    return globalTracker;
}

// === FUNZIONI DI CONVENIENZA ===
function trackUserAction(action, data = {}) {
    if (globalTracker && globalTracker.isInitialized) {
        trackEvent(action, data, globalTracker.currentSession?.userId);
    }
}

function identifyCurrentUser(userData) {
    if (globalTracker) {
        return globalTracker.identifyUser(userData);
    }
}

function getSessionData() {
    return globalTracker?.currentSession || null;
}

// === AUTO-INIT SE SCRIPT CARICATO ===
// Inizializzazione automatica
document.addEventListener('DOMContentLoaded', () => {
    if (!globalTracker) {
        console.log('🎯 Auto-inizializzazione TribuCoach Tracking...');
        initializeTribuCoachTracking();
    }
});

// === EXPORT ===
export default initializeTribuCoachTracking;
export { TribuCoachTracker, trackUserAction, identifyCurrentUser, getSessionData };