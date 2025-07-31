// auth-guard.js - Sistema di protezione pagine per LifestyleFitnessCoach
// Protegge dashboard e moduli coaching da accessi non autorizzati

import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// === CONFIGURAZIONE AUTH GUARD ===
const AUTH_CONFIG = {
    loginUrl: '/login.html',
    registerUrl: '/register.html',
    homeUrl: '/index.html',
    dashboardUrl: '/user-dashboard.html',
    allowedPublicPages: [
        '/',
        '/index.html',
        '/login.html',
        '/register.html',
        '/forgot-password.html',
        '/lifestyle-quiz.html'
    ],
    protectedPages: [
        '/user-dashboard.html',
        '/modules/',
        '/dashboard.html',
        '/lifestyle-admin-dashboard.html'
    ]
};

// === STATO GLOBALE AUTENTICAZIONE ===
let authState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    initialized: false
};

// === INIZIALIZZAZIONE AUTH GUARD ===
export function initAuthGuard(options = {}) {
    console.log('🛡️ Inizializzazione Auth Guard...');
    
    const config = { ...AUTH_CONFIG, ...options };
    
    return new Promise((resolve) => {
        // Listener Firebase Auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('🔄 Auth state changed:', user ? user.email : 'No user');
            
            authState.user = user;
            authState.isAuthenticated = !!user;
            authState.loading = false;
            
            if (!authState.initialized) {
                authState.initialized = true;
                resolve(authState);
            }
            
            // Check current page protection
            checkPageAccess(config);
        });
        
        // Timeout fallback per connection issues
        setTimeout(() => {
            if (!authState.initialized) {
                console.warn('⚠️ Auth timeout - assumo non autenticato');
                authState.loading = false;
                authState.isAuthenticated = false;
                authState.initialized = true;
                resolve(authState);
                checkPageAccess(config);
            }
        }, 5000);
    });
}

// === CONTROLLO ACCESSO PAGINA ===
function checkPageAccess(config) {
    const currentPath = window.location.pathname;
    const isProtectedPath = isPageProtected(currentPath, config);
    
    console.log('🔍 Checking access:', {
        path: currentPath,
        isProtected: isProtectedPath,
        isAuthenticated: authState.isAuthenticated,
        loading: authState.loading
    });
    
    // Se la pagina è protetta e l'utente non è autenticato
    if (isProtectedPath && !authState.isAuthenticated && !authState.loading) {
        console.log('❌ Accesso negato - redirect al login');
        redirectToLogin(config, currentPath);
        return false;
    }
    
    // Se l'utente è autenticato e sta cercando di accedere a login/register
    if (authState.isAuthenticated && isAuthPage(currentPath)) {
        console.log('✅ Utente già autenticato - redirect alla dashboard');
        redirectToDashboard(config);
        return false;
    }
    
    return true;
}

// === VERIFICA SE PAGINA È PROTETTA ===
function isPageProtected(path, config) {
    return config.protectedPages.some(protectedPath => {
        if (protectedPath.endsWith('/')) {
            return path.startsWith(protectedPath);
        }
        return path === protectedPath;
    });
}

// === VERIFICA SE È PAGINA DI AUTH ===
function isAuthPage(path) {
    return ['/login.html', '/register.html'].includes(path);
}

// === REDIRECT FUNCTIONS ===
function redirectToLogin(config, originalPath) {
    // Salva la pagina originale per redirect dopo login
    if (originalPath && originalPath !== '/') {
        sessionStorage.setItem('auth_redirect_url', originalPath);
    }
    
    // Mostra messaggio di accesso richiesto
    showAuthRequiredMessage();
    
    // Redirect dopo breve delay
    setTimeout(() => {
        window.location.href = config.loginUrl;
    }, 2000);
}

function redirectToDashboard(config) {
    window.location.href = config.dashboardUrl;
}

// === REDIRECT DOPO LOGIN ===
export function handlePostLoginRedirect() {
    const redirectUrl = sessionStorage.getItem('auth_redirect_url');
    
    if (redirectUrl && redirectUrl !== '/') {
        sessionStorage.removeItem('auth_redirect_url');
        console.log('↩️ Redirect post-login a:', redirectUrl);
        window.location.href = redirectUrl;
        return true;
    }
    
    return false;
}

// === LOGOUT FUNCTION ===
export async function logout() {
    try {
        console.log('🚪 Logout in corso...');
        
        // Firebase signOut
        await auth.signOut();
        
        // Clear local storage
        localStorage.removeItem('userSession');
        sessionStorage.clear();
        
        // Update auth state
        authState.isAuthenticated = false;
        authState.user = null;
        
        console.log('✅ Logout completato');
        
        // Redirect to home
        window.location.href = AUTH_CONFIG.homeUrl;
        
    } catch (error) {
        console.error('❌ Errore durante logout:', error);
        // Force redirect comunque
        window.location.href = AUTH_CONFIG.homeUrl;
    }
}

// === UI FEEDBACK ===
function showAuthRequiredMessage() {
    // Crea overlay di messaggio
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: 'Segoe UI', sans-serif;
    `;
    
    overlay.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
            <div style="font-size: 3rem; margin-bottom: 20px;">🔒</div>
            <h2 style="margin-bottom: 15px; font-size: 1.5rem;">Accesso Richiesto</h2>
            <p style="margin-bottom: 20px; opacity: 0.9; line-height: 1.5;">
                Devi effettuare l'accesso per visualizzare questa pagina.
            </p>
            <div style="
                background: rgba(255,255,255,0.2);
                padding: 10px;
                border-radius: 8px;
                font-size: 0.9rem;
            ">
                Reindirizzamento al login in corso...
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// === USER INFO UTILITIES ===
export function getCurrentUser() {
    return authState.user;
}

export function isAuthenticated() {
    return authState.isAuthenticated;
}

export function isLoading() {
    return authState.loading;
}

// === PAGE-SPECIFIC GUARDS ===
export async function guardDashboardPage() {
    console.log('🛡️ Dashboard Guard attivato');
    
    const authStatus = await initAuthGuard();
    
    if (!authStatus.isAuthenticated) {
        return false;
    }
    
    // Initialize dashboard-specific features
    initDashboardFeatures();
    return true;
}

export async function guardModulePage(moduleId = null) {
    console.log('🛡️ Module Guard attivato per:', moduleId || 'hub');
    
    const authStatus = await initAuthGuard();
    
    if (!authStatus.isAuthenticated) {
        return false;
    }
    
    // Initialize module-specific features
    initModuleFeatures(moduleId);
    return true;
}

// === DASHBOARD FEATURES ===
function initDashboardFeatures() {
    console.log('📊 Inizializzazione features dashboard...');
    
    // Add logout button to nav if not present
    addLogoutButton();
    
    // Display user info
    displayUserInfo();
    
    // Initialize real-time data if needed
    // initDashboardData();
}

// === MODULE FEATURES ===
function initModuleFeatures(moduleId) {
    console.log('📚 Inizializzazione features modulo:', moduleId);
    
    // Add logout button
    addLogoutButton();
    
    // Module-specific initialization
    if (moduleId) {
        // Track module access
        trackModuleAccess(moduleId);
    }
}

// === UI COMPONENTS ===
function addLogoutButton() {
    // Check if logout button already exists
    if (document.getElementById('logoutButton')) {
        return;
    }
    
    // Create logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutButton';
    logoutBtn.innerHTML = '🚪 Logout';
    logoutBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(231,76,60,0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    logoutBtn.addEventListener('click', logout);
    logoutBtn.addEventListener('mouseenter', () => {
        logoutBtn.style.transform = 'translateY(-2px)';
        logoutBtn.style.boxShadow = '0 5px 15px rgba(231,76,60,0.4)';
    });
    logoutBtn.addEventListener('mouseleave', () => {
        logoutBtn.style.transform = 'translateY(0)';
        logoutBtn.style.boxShadow = '0 3px 10px rgba(231,76,60,0.3)';
    });
    
    document.body.appendChild(logoutBtn);
}

function displayUserInfo() {
    if (!authState.user) return;
    
    // Find user info containers and update them
    const userNameElements = document.querySelectorAll('[data-user-name]');
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    
    userNameElements.forEach(el => {
        el.textContent = authState.user.displayName || authState.user.email.split('@')[0];
    });
    
    userEmailElements.forEach(el => {
        el.textContent = authState.user.email;
    });
}

// === TRACKING ===
function trackModuleAccess(moduleId) {
    // Track module access event
    const eventData = {
        event: 'module_access',
        moduleId: moduleId,
        userId: authState.user?.uid,
        timestamp: new Date().toISOString()
    };
    
    console.log('📊 Tracking module access:', eventData);
    
    // Send to analytics if available
    if (window.gtag) {
        window.gtag('event', 'module_access', {
            module_id: moduleId,
            user_id: authState.user?.uid
        });
    }
}

// === ERROR HANDLING ===
window.addEventListener('error', (error) => {
    if (error.message.includes('auth')) {
        console.error('🚨 Auth error:', error);
        // Handle auth-related errors
    }
});

// === DEVELOPMENT HELPERS ===
if (window.location.hostname === 'localhost') {
    window.authGuard = {
        state: authState,
        logout,
        getCurrentUser,
        isAuthenticated,
        checkPageAccess: () => checkPageAccess(AUTH_CONFIG)
    };
    console.log('🔧 Auth Guard debug helpers available at window.authGuard');
}

// === EXPORTS ===
export {
    initAuthGuard,
    guardDashboardPage,
    guardModulePage,
    logout,
    getCurrentUser,
    isAuthenticated,
    isLoading,
    handlePostLoginRedirect
};

console.log('🛡️ Auth Guard System loaded and ready!');