// auth-guard.js - Sistema di protezione pagine per LifestyleFitnessCoach
// Protegge dashboard e moduli coaching da accessi non autorizzati

import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

// Variabili globali
let currentUser = null;
let authCheckComplete = false;
let redirectPath = null;

// Inizializzazione del guard
function initAuthGuard() {
    console.log('🛡️ Auth Guard inizializzato');
    
    // Salva la pagina corrente per redirect post-login
    redirectPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', redirectPath);
    
    // Mostra loading overlay
    showAuthOverlay();
    
    // Timeout di sicurezza (10 secondi)
    const timeout = setTimeout(() => {
        console.log('⏰ Auth timeout raggiunto');
        hideAuthOverlay();
        redirectToLogin('Timeout di autenticazione');
    }, 10000);
    
    // Controlla stato autenticazione
    onAuthStateChanged(auth, (user) => {
        clearTimeout(timeout);
        
        if (user && user.emailVerified) {
            console.log('✅ Utente autenticato:', user.email);
            currentUser = user;
            authCheckComplete = true;
            onAuthSuccess();
        } else if (user && !user.emailVerified) {
            console.log('📧 Email non verificata per:', user.email);
            redirectToEmailVerification();
        } else {
            console.log('❌ Utente non autenticato');
            redirectToLogin('Accesso richiesto');
        }
    }, (error) => {
        clearTimeout(timeout);
        console.error('❌ Errore controllo auth:', error);
        hideAuthOverlay();
        redirectToLogin('Errore di autenticazione');
    });
}

// Mostra overlay di caricamento
function showAuthOverlay() {
    // Rimuovi overlay esistente se presente
    const existingOverlay = document.getElementById('auth-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(44, 62, 80, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid #ff6b35; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <h3 style="margin: 0 0 10px 0; font-size: 1.4rem;">Verifica accesso...</h3>
            <p style="margin: 0; opacity: 0.8; font-size: 1rem;">Controllo delle credenziali in corso</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(overlay);
}

// Nasconde overlay di caricamento
function hideAuthOverlay() {
    const overlay = document.getElementById('auth-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    }
}

// Gestione successo autenticazione
function onAuthSuccess() {
    hideAuthOverlay();
    updateUserInterface();
    setupLogoutFunctionality();
    trackPageAccess();
    
    // Gestisci redirect post-login se necessario
    handlePostLoginRedirect();
}

// Aggiorna interfaccia utente con info utente
function updateUserInterface() {
    if (!currentUser) return;
    
    // Aggiorna elementi con classe user-info
    const userElements = document.querySelectorAll('.user-name, .username, .user-display, [data-user-name]');
    userElements.forEach(el => {
        el.textContent = currentUser.displayName || currentUser.email.split('@')[0];
    });
    
    // Aggiorna elementi email
    const emailElements = document.querySelectorAll('.user-email, [data-user-email]');
    emailElements.forEach(el => {
        el.textContent = currentUser.email;
    });
    
    // Aggiorna welcome message se presente
    const welcomeElements = document.querySelectorAll('.welcome-user');
    welcomeElements.forEach(el => {
        el.textContent = `Ciao ${currentUser.displayName || currentUser.email.split('@')[0]}!`;
    });
    
    console.log('✅ UI aggiornata con dati utente');
}

// Setup funzionalità logout
function setupLogoutFunctionality() {
    const logoutButtons = document.querySelectorAll('.logout-btn, [data-logout]');
    
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', handleLogout);
        btn.style.cursor = 'pointer';
    });
    
    // Aggiungi logout button se non presente
    if (logoutButtons.length === 0) {
        addLogoutButton();
    }
}

// Aggiungi logout button dinamicamente
function addLogoutButton() {
    const header = document.querySelector('header, .header, .dashboard-header, nav');
    if (!header) return;
    
    const logoutBtn = document.createElement('button');
    logoutBtn.innerHTML = '🚪 Logout';
    logoutBtn.className = 'dynamic-logout-btn';
    logoutBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        z-index: 1000;
    `;
    
    logoutBtn.addEventListener('mouseenter', () => {
        logoutBtn.style.background = 'rgba(239, 68, 68, 1)';
        logoutBtn.style.transform = 'translateY(-1px)';
    });
    
    logoutBtn.addEventListener('mouseleave', () => {
        logoutBtn.style.background = 'rgba(239, 68, 68, 0.9)';
        logoutBtn.style.transform = 'translateY(0)';
    });
    
    logoutBtn.addEventListener('click', handleLogout);
    
    header.style.position = 'relative';
    header.appendChild(logoutBtn);
}

// Gestione logout
async function handleLogout() {
    try {
        const logoutBtns = document.querySelectorAll('.logout-btn, [data-logout], .dynamic-logout-btn');
        
        // Mostra loading sui bottoni
        logoutBtns.forEach(btn => {
            btn.innerHTML = '<div style="width: 12px; height: 12px; border: 2px solid #fff; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
            btn.disabled = true;
        });
        
        console.log('🚪 Logout in corso...');
        
        // Logout da Firebase
        await auth.signOut();
        
        // Cleanup locale
        currentUser = null;
        authCheckComplete = false;
        
        // Clear storage
        sessionStorage.clear();
        localStorage.removeItem('lifestyleCoachUser');
        localStorage.removeItem('userProgress');
        
        console.log('✅ Logout completato');
        
        // Redirect dopo breve delay
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 500);
        
    } catch (error) {
        console.error('❌ Errore durante logout:', error);
        
        // Ripristina bottoni in caso di errore
        const logoutBtns = document.querySelectorAll('.logout-btn, [data-logout], .dynamic-logout-btn');
        logoutBtns.forEach(btn => {
            btn.innerHTML = '🚪 Logout';
            btn.disabled = false;
        });
        
        showErrorMessage('Errore durante il logout. Riprova.');
    }
}

// Tracking accesso pagina
function trackPageAccess() {
    if (!currentUser) return;
    
    try {
        const pageInfo = {
            userId: currentUser.uid,
            email: currentUser.email,
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        console.log('📊 Tracciando accesso pagina:', pageInfo);
        
        // Qui potresti integrare con Firebase Analytics
        if (window.gtag) {
            gtag('event', 'page_access', {
                page_path: pageInfo.page,
                user_id: pageInfo.userId
            });
        }
        
    } catch (error) {
        console.warn('⚠️ Errore nel tracking:', error);
    }
}

// Gestione redirect post-login
function handlePostLoginRedirect() {
    const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
    const currentPath = window.location.pathname;
    
    // Se siamo nella pagina di destinazione, rimuovi il redirect salvato
    if (savedRedirect && savedRedirect === currentPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        console.log('✅ Redirect completato, rimosso da sessione');
    }
}

// Redirect al login
function redirectToLogin(reason = '') {
    console.log('🔄 Redirect al login:', reason);
    
    // Salva pagina corrente per redirect post-login
    const currentPage = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentPage);
    
    // Mostra messaggio se fornito
    if (reason) {
        sessionStorage.setItem('loginMessage', reason);
    }
    
    // Redirect
    window.location.href = '/login.html';
}

// Redirect per email verification
function redirectToEmailVerification() {
    console.log('📧 Redirect per verifica email');
    sessionStorage.setItem('loginMessage', 'Verifica la tua email prima di accedere');
    window.location.href = '/login.html';
}

// Mostra messaggio di errore
function showErrorMessage(message) {
    // Rimuovi messaggi esistenti
    const existingError = document.getElementById('auth-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'auth-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.95);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Auto-remove dopo 5 secondi
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}

// Funzione per proteggere specifiche pagine
function guardPage(requiredRole = null) {
    console.log('🛡️ Protezione pagina attivata');
    
    if (!authCheckComplete) {
        initAuthGuard();
        return;
    }
    
    if (!currentUser) {
        redirectToLogin('Accesso richiesto');
        return;
    }
    
    // Controllo ruolo se specificato
    if (requiredRole) {
        // Qui potresti aggiungere logica per controllo ruoli
        console.log('🔐 Controllo ruolo:', requiredRole);
    }
    
    console.log('✅ Accesso autorizzato');
}

// Funzione per proteggere moduli coaching
function guardModulePage() {
    console.log('🎯 Protezione modulo coaching');
    guardPage();
}

// Funzione per proteggere dashboard
function guardDashboard() {
    console.log('📊 Protezione dashboard');
    guardPage();
}

// Funzione per proteggere area admin
function guardAdminPage() {
    console.log('👨‍💼 Protezione area admin');
    guardPage('admin');
}

// Ottieni utente corrente
function getCurrentUser() {
    return currentUser;
}

// Verifica se utente è autenticato
function isAuthenticated() {
    return authCheckComplete && currentUser !== null;
}

// Inizializzazione automatica quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGuard);
} else {
    initAuthGuard();
}

// Export delle funzioni principali (SINGOLO EXPORT)
export { 
    initAuthGuard,
    guardPage,
    guardModulePage,
    guardDashboard,
    guardAdminPage,
    getCurrentUser,
    isAuthenticated,
    handleLogout,
    handlePostLoginRedirect
};