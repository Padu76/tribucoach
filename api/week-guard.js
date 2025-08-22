// week-guard.js - Protezione universale integrata con Session Manager
// Sistema di auth unificato per le settimane di coaching con persistenza dati

import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// === CONFIGURAZIONE PROTEZIONE ===
const WEEK_GUARD_CONFIG = {
    loginUrl: '../login.html',
    moduleHubUrl: '../modules/module-hub.html',
    timeout: 3000, // 3 secondi timeout per connessione
    showLoading: true,
    debug: false
};

// === STATO AUTH ===
let authState = {
    isAuthenticated: false,
    user: null,
    checked: false,
    sessionManager: null
};

// === PROTEZIONE PRINCIPALE ===
export async function protectWeekPage() {
    if (WEEK_GUARD_CONFIG.debug) {
        console.log('🛡️ Week Guard: Inizializzazione protezione...');
    }

    // Inizializza session manager
    await initializeSessionManager();

    // Mostra loading minimo se configurato
    if (WEEK_GUARD_CONFIG.showLoading) {
        showMinimalLoading();
    }

    try {
        // Controllo auth veloce con session manager
        const isAuthorized = await checkAuthWithSessionManager();
        
        if (!isAuthorized) {
            redirectToLogin();
            return false;
        }

        // Nasconde loading e mostra contenuto
        hideLoadingAndShowContent();
        
        // Inizializza features week
        initializeWeekFeatures();
        
        // Salva progress
        saveWeekProgress();
        
        if (WEEK_GUARD_CONFIG.debug) {
            console.log('✅ Week Guard: Protezione completata');
        }
        
        return true;

    } catch (error) {
        console.error('❌ Week Guard Error:', error);
        redirectToLogin();
        return false;
    }
}

// 🎯 INIZIALIZZAZIONE SESSION MANAGER
async function initializeSessionManager() {
    try {
        // Attendi che session manager sia disponibile
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!window.sessionManager && !window.tribucoachSession && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        authState.sessionManager = window.sessionManager || window.tribucoachSession;
        
        if (authState.sessionManager) {
            console.log('✅ Session Manager collegato a Week Guard');
            
            // Listener per cambio auth state
            authState.sessionManager.onAuthStateChanged((user) => {
                if (user && !authState.user) {
                    console.log('🔄 Session Manager: User detected', user.email);
                    authState.user = user;
                    authState.isAuthenticated = true;
                    authState.checked = true;
                }
            });
        } else {
            console.warn('⚠️ Session Manager non trovato, usando solo Firebase Auth');
        }
    } catch (error) {
        console.error('❌ Errore init session manager:', error);
    }
}

// === CONTROLLO AUTH CON SESSION MANAGER ===
function checkAuthWithSessionManager() {
    return new Promise((resolve) => {
        // Prova prima con session manager se disponibile
        if (authState.sessionManager && authState.sessionManager.isAuthenticated) {
            console.log('✅ Autenticazione via Session Manager');
            authState.user = authState.sessionManager.user;
            authState.isAuthenticated = true;
            authState.checked = true;
            resolve(true);
            return;
        }

        // Fallback Firebase Auth con timeout
        const timeoutId = setTimeout(() => {
            if (WEEK_GUARD_CONFIG.debug) {
                console.warn('⏰ Week Guard: Timeout auth check');
            }
            resolve(false);
        }, WEEK_GUARD_CONFIG.timeout);

        onAuthStateChanged(auth, (user) => {
            clearTimeout(timeoutId);
            
            authState.user = user;
            authState.isAuthenticated = !!user;
            authState.checked = true;
            
            if (user && authState.sessionManager && !authState.sessionManager.isAuthenticated) {
                // Sincronizza con session manager
                syncWithSessionManager(user);
            }
            
            if (WEEK_GUARD_CONFIG.debug) {
                console.log('🔍 Week Guard: Auth state:', user ? user.email : 'No user');
            }
            
            resolve(!!user);
        }, (error) => {
            clearTimeout(timeoutId);
            console.error('❌ Week Guard: Auth error:', error);
            resolve(false);
        });
    });
}

// 🔄 SINCRONIZZAZIONE CON SESSION MANAGER
async function syncWithSessionManager(user) {
    try {
        if (authState.sessionManager) {
            // Aggiorna session manager con utente Firebase
            authState.sessionManager.currentUser = user;
            authState.sessionManager.sessionData.isValid = true;
            authState.sessionManager.sessionData.lastActivity = Date.now();
            
            // Salva sessione
            authState.sessionManager.saveSession(true);
            
            console.log('🔄 Session Manager sincronizzato con Firebase Auth');
        }
    } catch (error) {
        console.error('❌ Errore sincronizzazione session manager:', error);
    }
}

// 💾 SALVATAGGIO PROGRESS SETTIMANA
function saveWeekProgress() {
    try {
        const weekNumber = getWeekNumber();
        if (!weekNumber) return;

        const progressData = {
            weekAccess: {
                [`week_${weekNumber}`]: {
                    accessed: true,
                    accessTime: new Date().toISOString(),
                    accessCount: getAccessCount(weekNumber) + 1,
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    sessionId: generateSessionId(),
                    protectionMethod: authState.sessionManager ? 'session_manager' : 'firebase_auth'
                }
            },
            lastWeekAccessed: weekNumber,
            totalWeeksAccessed: getTotalWeeksAccessed() + (isFirstTimeAccess(weekNumber) ? 1 : 0),
            lastUpdate: Date.now()
        };

        // Salva via session manager se disponibile
        if (authState.sessionManager) {
            authState.sessionManager.updateUserData(progressData);
            console.log('💾 Progress Week', weekNumber, 'salvato via Session Manager');
        } else {
            // Fallback localStorage
            const existing = JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
            const updated = { ...existing, ...progressData };
            localStorage.setItem('tribucoach_week_progress', JSON.stringify(updated));
            console.log('💾 Progress Week', weekNumber, 'salvato via localStorage');
        }

        // Dispatch evento per altri componenti
        window.dispatchEvent(new CustomEvent('weekProgressSaved', {
            detail: { weekNumber, progressData, user: authState.user }
        }));

    } catch (error) {
        console.error('❌ Errore salvataggio progress:', error);
    }
}

// 📊 UTILITY FUNCTIONS PROGRESS
function getWeekNumber() {
    const pathParts = window.location.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    const weekMatch = filename.match(/week-(\d+)/);
    return weekMatch ? parseInt(weekMatch[1]) : null;
}

function getAccessCount(weekNumber) {
    try {
        const data = authState.sessionManager ? 
                    authState.sessionManager.userData : 
                    JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
        
        return data.weekAccess?.[`week_${weekNumber}`]?.accessCount || 0;
    } catch {
        return 0;
    }
}

function getTotalWeeksAccessed() {
    try {
        const data = authState.sessionManager ? 
                    authState.sessionManager.userData : 
                    JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
        
        return data.totalWeeksAccessed || 0;
    } catch {
        return 0;
    }
}

function isFirstTimeAccess(weekNumber) {
    try {
        const data = authState.sessionManager ? 
                    authState.sessionManager.userData : 
                    JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
        
        return !data.weekAccess?.[`week_${weekNumber}`]?.accessed;
    } catch {
        return true;
    }
}

function generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// === LOADING MINIMO ===
function showMinimalLoading() {
    // Crea overlay leggero solo se non esiste
    if (document.getElementById('weekGuardLoading')) return;
    
    const loadingHTML = `
        <div id="weekGuardLoading" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(248, 250, 252, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(2px);
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 300px;
            ">
                <div style="
                    width: 32px;
                    height: 32px;
                    border: 3px solid #f1f5f9;
                    border-top: 3px solid #ea580c;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <h3 style="
                    color: #1e293b;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    font-family: 'Segoe UI', sans-serif;
                ">🛡️ Verifica Accesso</h3>
                <p style="
                    color: #64748b;
                    font-size: 0.9rem;
                    margin: 0;
                    font-family: 'Segoe UI', sans-serif;
                ">Controllo credenziali e caricamento dati...</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
}

// === NASCONDE LOADING E MOSTRA CONTENUTO ===
function hideLoadingAndShowContent() {
    // Rimuovi loading
    const loading = document.getElementById('weekGuardLoading');
    if (loading) {
        loading.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => loading.remove(), 300);
    }
    
    // Mostra contenuto principale con transizione
    const mainContent = document.body;
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 100);
    }
    
    // Aggiungi classe loaded se esiste container specifico
    const containers = [
        '.main-container',
        '.week-container', 
        '.content-container',
        'main'
    ];
    
    containers.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            container.classList.add('loaded');
        }
    });
}

// === REDIRECT AL LOGIN ===
function redirectToLogin() {
    // Salva pagina corrente per redirect post-login
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('auth_redirect_url', currentPath);
    
    // Mostra messaggio e redirect
    showAuthRequiredMessage();
    
    setTimeout(() => {
        window.location.href = WEEK_GUARD_CONFIG.loginUrl;
    }, 2000);
}

// === MESSAGGIO AUTH RICHIESTO ===
function showAuthRequiredMessage() {
    const messageHTML = `
        <div id="authRequiredMessage" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(30, 41, 59, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            color: white;
            font-family: 'Segoe UI', sans-serif;
        ">
            <div style="
                background: linear-gradient(135deg, #1e293b 0%, #ea580c 100%);
                padding: 3rem;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                animation: slideIn 0.5s ease-out;
            ">
                <div style="font-size: 3rem; margin-bottom: 1.5rem;">🔒</div>
                <h2 style="margin-bottom: 1rem; font-size: 1.5rem;">Accesso Richiesto</h2>
                <p style="margin-bottom: 1.5rem; opacity: 0.9; line-height: 1.5;">
                    Devi effettuare l'accesso per accedere al contenuto di coaching.
                </p>
                <div style="
                    background: rgba(255,255,255,0.2);
                    padding: 1rem;
                    border-radius: 10px;
                    font-size: 0.9rem;
                ">
                    Reindirizzamento al login...
                </div>
            </div>
        </div>
        <style>
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', messageHTML);
}

// === INIZIALIZZA FEATURES WEEK ===
function initializeWeekFeatures() {
    // Aggiungi logout button se non presente
    addLogoutButton();
    
    // Mostra info utente se possibile
    displayUserInfo();
    
    // Inizializza tracking accesso modulo
    trackWeekAccess();
    
    // Aggiungi progress indicator
    addProgressIndicator();
    
    // Aggiungi listener per cleanup
    setupCleanupListeners();
}

// 📈 INDICATORE PROGRESS
function addProgressIndicator() {
    const weekNumber = getWeekNumber();
    if (!weekNumber) return;

    const totalWeeks = getTotalWeeksAccessed();
    const accessCount = getAccessCount(weekNumber);
    const isFirstAccess = isFirstTimeAccess(weekNumber);

    const progressIndicator = document.createElement('div');
    progressIndicator.id = 'week-progress-indicator';
    progressIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: ${isFirstAccess ? 'rgba(34, 197, 94, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        padding: 12px 18px;
        border-radius: 25px;
        font-size: 13px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        backdrop-filter: blur(10px);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        transition: all 0.3s ease;
        cursor: pointer;
    `;

    const statusIcon = isFirstAccess ? '🎉' : '📊';
    const statusText = isFirstAccess ? 'Prima visita!' : `Visita #${accessCount + 1}`;

    progressIndicator.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            ${statusIcon} Week ${weekNumber} • ${statusText} • ${totalWeeks} settimane esplorate
        </div>
    `;

    // Click per mostrare stats dettagliate
    progressIndicator.addEventListener('click', showDetailedStats);

    document.body.appendChild(progressIndicator);

    // Auto-hide dopo 7 secondi
    setTimeout(() => {
        progressIndicator.style.opacity = '0';
        progressIndicator.style.transform = 'translateY(10px)';
        setTimeout(() => progressIndicator.remove(), 300);
    }, 7000);
}

// 📊 STATS DETTAGLIATE
function showDetailedStats() {
    const stats = {
        currentWeek: getWeekNumber(),
        accessCount: getAccessCount(getWeekNumber()),
        totalWeeksAccessed: getTotalWeeksAccessed(),
        isFirstAccess: isFirstTimeAccess(getWeekNumber()),
        userData: authState.sessionManager ? authState.sessionManager.userData : null,
        user: authState.user
    };

    console.log('📊 Week Stats:', stats);
    
    // Mostra toast con stats
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(17, 24, 39, 0.95);
        color: white;
        padding: 16px;
        border-radius: 12px;
        font-size: 12px;
        font-family: monospace;
        z-index: 10002;
        max-width: 300px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    `;

    toast.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: bold;">📊 Progress Stats</div>
        <div>Week corrente: ${stats.currentWeek}</div>
        <div>Accessi: ${stats.accessCount + 1}</div>
        <div>Settimane esplorate: ${stats.totalWeeksAccessed}</div>
        <div>Utente: ${stats.user?.email || 'N/A'}</div>
        <div>Storage: ${authState.sessionManager ? 'Session Manager' : 'localStorage'}</div>
    `;

    document.body.appendChild(toast);

    // Auto-remove dopo 5 secondi
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// === AGGIUNGI LOGOUT BUTTON ===
function addLogoutButton() {
    // Controlla se esiste già 
    if (document.getElementById('weekGuardLogout')) return;
    
    // Cerca container header esistente
    const headerSelectors = [
        '.header-content .session-info',
        '.header .session-info', 
        '.session-info',
        'header nav',
        'header'
    ];
    
    let targetContainer = null;
    for (const selector of headerSelectors) {
        targetContainer = document.querySelector(selector);
        if (targetContainer) break;
    }
    
    // Crea logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'weekGuardLogout';
    logoutBtn.innerHTML = '🚪 Logout';
    logoutBtn.style.cssText = `
        background: rgba(231, 76, 60, 0.8);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: 1rem;
    `;
    
    logoutBtn.addEventListener('click', handleLogout);
    logoutBtn.addEventListener('mouseenter', () => {
        logoutBtn.style.background = 'rgba(231, 76, 60, 1)';
    });
    logoutBtn.addEventListener('mouseleave', () => {
        logoutBtn.style.background = 'rgba(231, 76, 60, 0.8)';
    });
    
    // Aggiungi al container appropriato
    if (targetContainer) {
        targetContainer.appendChild(logoutBtn);
    } else {
        // Fallback: posizione fissa
        logoutBtn.style.position = 'fixed';
        logoutBtn.style.top = '20px';
        logoutBtn.style.right = '20px';
        logoutBtn.style.zIndex = '1000';
        document.body.appendChild(logoutBtn);
    }
}

// === MOSTRA INFO UTENTE ===
function displayUserInfo() {
    if (!authState.user) return;
    
    // Cerca elementi per info utente
    const userNameElements = document.querySelectorAll('[data-user-name]');
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    
    const userName = authState.user.displayName || authState.user.email.split('@')[0];
    const userEmail = authState.user.email;
    
    userNameElements.forEach(el => {
        el.textContent = userName;
    });
    
    userEmailElements.forEach(el => {
        el.textContent = userEmail;
    });
    
    // Aggiungi info nella header se esiste spazio
    const headerInfo = document.querySelector('.header-content');
    if (headerInfo && !document.getElementById('weekGuardUserInfo')) {
        const userInfo = document.createElement('div');
        userInfo.id = 'weekGuardUserInfo';
        userInfo.innerHTML = `👤 ${userName}`;
        userInfo.style.cssText = `
            background: rgba(255,255,255,0.15);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            color: white;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        headerInfo.appendChild(userInfo);
    }
}

// === TRACKING ACCESSO ===
function trackWeekAccess() {
    try {
        const weekNumber = getWeekNumber();
        
        if (weekNumber) {
            const trackingData = {
                week_number: weekNumber,
                user_id: authState.user?.uid,
                user_email: authState.user?.email,
                access_count: getAccessCount(weekNumber) + 1,
                total_weeks_accessed: getTotalWeeksAccessed(),
                is_first_access: isFirstTimeAccess(weekNumber),
                session_manager_active: !!authState.sessionManager,
                timestamp: new Date().toISOString()
            };

            // Track con Google Analytics se disponibile
            if (window.gtag) {
                window.gtag('event', 'week_access', trackingData);
            }

            // Custom event per altri sistemi di tracking
            window.dispatchEvent(new CustomEvent('tribucoachWeekAccess', {
                detail: trackingData
            }));
            
            // Log per debug
            if (WEEK_GUARD_CONFIG.debug) {
                console.log(`📊 Week ${weekNumber} accessed:`, trackingData);
            }
        }
    } catch (error) {
        console.error('❌ Error tracking week access:', error);
    }
}

// === LOGOUT HANDLER ===
async function handleLogout() {
    try {
        const logoutBtn = document.getElementById('weekGuardLogout');
        if (logoutBtn) {
            logoutBtn.innerHTML = '🔄 Disconnessione...';
            logoutBtn.disabled = true;
        }

        // Logout unificato
        if (authState.sessionManager) {
            // Usa session manager per logout completo
            await authState.sessionManager.logout();
            console.log('🔄 Logout via Session Manager completato');
        } else {
            // Fallback Firebase Auth
            await auth.signOut();
            console.log('🔄 Logout via Firebase Auth completato');
        }
        
        // Clear storage tradizionale (backward compatibility)
        localStorage.removeItem('userSession');
        localStorage.removeItem('tribucoach_week_progress');
        sessionStorage.clear();
        
        // Reset stato auth
        authState.isAuthenticated = false;
        authState.user = null;
        authState.checked = false;
        
        console.log('👋 Logout completato da Week Guard');
        
        // Redirect
        window.location.href = '../index.html';
        
    } catch (error) {
        console.error('❌ Logout error:', error);
        
        // Reset button
        const logoutBtn = document.getElementById('weekGuardLogout');
        if (logoutBtn) {
            logoutBtn.innerHTML = '🚪 Logout';
            logoutBtn.disabled = false;
        }
        
        // Force redirect comunque
        window.location.href = '../index.html';
    }
}

// === CLEANUP LISTENERS ===
function setupCleanupListeners() {
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        const loading = document.getElementById('weekGuardLoading');
        if (loading) loading.remove();
        
        const message = document.getElementById('authRequiredMessage');
        if (message) message.remove();
        
        // Salva ultimo accesso se possibile
        if (authState.sessionManager) {
            authState.sessionManager.extendSession();
        }
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !authState.checked) {
            // Re-check auth when page becomes visible
            protectWeekPage();
        }
    });

    // Estendi sessione su attività utente
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            if (authState.sessionManager && authState.isAuthenticated) {
                authState.sessionManager.extendSession();
            }
        }, { passive: true, once: false });
    });
}

// === UTILITY FUNCTIONS PUBBLICHE ===
export function getCurrentUser() {
    return authState.user;
}

export function isAuthenticated() {
    return authState.isAuthenticated;
}

export { getWeekNumber };

export function getWeekStats() {
    const weekNumber = getWeekNumber();
    return {
        currentWeek: weekNumber,
        accessCount: getAccessCount(weekNumber),
        totalWeeksAccessed: getTotalWeeksAccessed(),
        isFirstAccess: isFirstTimeAccess(weekNumber),
        userData: authState.sessionManager ? authState.sessionManager.userData : null,
        sessionManagerActive: !!authState.sessionManager
    };
}

// === CONFIGURAZIONE PERSONALIZZABILE ===
export function configureWeekGuard(options = {}) {
    Object.assign(WEEK_GUARD_CONFIG, options);
}

// === AUTO-INIZIALIZZAZIONE ===
// Inizializza automaticamente quando il DOM è pronto
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectWeekPage);
    } else {
        // DOM già caricato
        protectWeekPage();
    }
}

// === EXPORTS ===
export {
    protectWeekPage,
    getCurrentUser,
    isAuthenticated,
    getWeekStats,
    configureWeekGuard,
    handleLogout
};

// === DEBUG HELPERS ===
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.weekGuard = {
        state: authState,
        config: WEEK_GUARD_CONFIG,
        protect: protectWeekPage,
        logout: handleLogout,
        getCurrentUser,
        isAuthenticated,
        getWeekNumber,
        getWeekStats,
        sessionManager: () => authState.sessionManager
    };
    
    console.log('🔧 Week Guard debug helpers available at window.weekGuard');
}

console.log('🛡️ Week Guard Universal Protection con Session Manager Integration loaded!');