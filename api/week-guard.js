// week-guard.js - Protezione universale per tutte le pagine week-X.html
// Sistema di auth leggero e veloce per le settimane di coaching

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
    checked: false
};

// === PROTEZIONE PRINCIPALE ===
export async function protectWeekPage() {
    if (WEEK_GUARD_CONFIG.debug) {
        console.log('🛡️ Week Guard: Inizializzazione protezione...');
    }

    // Mostra loading minimo se configurato
    if (WEEK_GUARD_CONFIG.showLoading) {
        showMinimalLoading();
    }

    try {
        // Controllo auth veloce
        const isAuthorized = await checkAuthWithTimeout();
        
        if (!isAuthorized) {
            redirectToLogin();
            return false;
        }

        // Nasconde loading e mostra contenuto
        hideLoadingAndShowContent();
        
        // Inizializza features week
        initializeWeekFeatures();
        
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

// === CONTROLLO AUTH CON TIMEOUT ===
function checkAuthWithTimeout() {
    return new Promise((resolve) => {
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
                ">Controllo credenziali...</p>
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
                <div style="font-size: 3rem; margin-bottom: 1.5rem;">🔐</div>
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
    
    // Aggiungi listener per cleanup
    setupCleanupListeners();
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
        const pathParts = window.location.pathname.split('/');
        const filename = pathParts[pathParts.length - 1];
        const weekMatch = filename.match(/week-(\d+)/);
        
        if (weekMatch) {
            const weekNumber = weekMatch[1];
            
            // Track con Google Analytics se disponibile
            if (window.gtag) {
                window.gtag('event', 'week_access', {
                    week_number: weekNumber,
                    user_id: authState.user?.uid
                });
            }
            
            // Log per debug
            if (WEEK_GUARD_CONFIG.debug) {
                console.log(`📊 Week ${weekNumber} accessed by user:`, authState.user?.email);
            }
        }
    } catch (error) {
        console.error('❌ Error tracking week access:', error);
    }
}

// === LOGOUT HANDLER ===
async function handleLogout() {
    try {
        await auth.signOut();
        
        // Clear storage
        localStorage.removeItem('userSession');
        sessionStorage.clear();
        
        // Redirect
        window.location.href = '../index.html';
        
    } catch (error) {
        console.error('❌ Logout error:', error);
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
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !authState.checked) {
            // Re-check auth when page becomes visible
            protectWeekPage();
        }
    });
}

// === UTILITY FUNCTIONS ===
export function getCurrentUser() {
    return authState.user;
}

export function isAuthenticated() {
    return authState.isAuthenticated;
}

export function getWeekNumber() {
    const pathParts = window.location.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    const weekMatch = filename.match(/week-(\d+)/);
    return weekMatch ? parseInt(weekMatch[1]) : null;
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
    getWeekNumber,
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
        getWeekNumber
    };
    
    console.log('🔧 Week Guard debug helpers available at window.weekGuard');
}

console.log('🛡️ Week Guard Universal Protection loaded!');