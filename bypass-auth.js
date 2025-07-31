// bypass-auth.js - Sistema di bypass completo per saltare autenticazione
// Permette accesso diretto a tutti i contenuti senza login

console.log('🚫 BYPASS AUTH SYSTEM ATTIVATO - Accesso libero a tutti i contenuti');

// Utente mock per compatibilità
const mockUser = {
    uid: 'bypass-user-001',
    email: 'bypass@tribucoach.com',
    displayName: 'Utente Bypass',
    emailVerified: true,
    metadata: {
        creationTime: '2024-01-01T00:00:00Z',
        lastSignInTime: new Date().toISOString()
    }
};

// Funzioni di bypass che sostituiscono tutte le auth functions
export function initAuthGuard() {
    console.log('🚫 Auth Guard BYPASSATO');
    // Non fa nulla - accesso sempre permesso
}

export function guardPage() {
    console.log('🚫 Guard Page BYPASSATO');
    // Non fa nulla - accesso sempre permesso
}

export function guardModulePage() {
    console.log('🚫 Guard Module BYPASSATO');
    // Non fa nulla - accesso sempre permesso
}

export function guardDashboard() {
    console.log('🚫 Guard Dashboard BYPASSATO');
    // Non fa nulla - accesso sempre permesso
}

export function guardDashboardPage() {
    console.log('🚫 Guard Dashboard Page BYPASSATO');
    // Non fa nulla - accesso sempre permesso
}

export function guardAdminPage() {
    console.log('🚫 Guard Admin BYPASSATO');
    // Non fa nulla - accesso sempre permesso
}

export function getCurrentUser() {
    console.log('🚫 Get Current User BYPASSATO - Ritorno utente mock');
    return mockUser;
}

export function isAuthenticated() {
    console.log('🚫 Is Authenticated BYPASSATO - Sempre true');
    return true;
}

export function handleLogout() {
    console.log('🚫 Logout BYPASSATO - Redirect a homepage');
    window.location.href = '/index.html';
}

// Alias per compatibilità con nomi diversi
export const logout = handleLogout;
export const signOut = handleLogout;

export function handlePostLoginRedirect() {
    console.log('🚫 Post Login Redirect BYPASSATO');
    // Non fa nulla
}

// Auth object mock per compatibilità Firebase
export const auth = {
    currentUser: mockUser,
    onAuthStateChanged: (callback) => {
        console.log('🚫 onAuthStateChanged BYPASSATO');
        // Chiama subito il callback con utente mock
        setTimeout(() => callback(mockUser), 100);
        return () => {}; // Unsubscribe function
    },
    signInWithEmailAndPassword: async () => {
        console.log('🚫 signInWithEmailAndPassword BYPASSATO');
        return { user: mockUser };
    },
    createUserWithEmailAndPassword: async () => {
        console.log('🚫 createUserWithEmailAndPassword BYPASSATO');
        return { user: mockUser };
    },
    sendPasswordResetEmail: async () => {
        console.log('🚫 sendPasswordResetEmail BYPASSATO');
        return;
    },
    signOut: handleLogout
};

// Database mock per compatibilità
export const db = {
    doc: () => ({
        get: async () => ({
            exists: () => true,
            data: () => ({
                wellnessScore: 850,
                currentStreak: 15,
                createdAt: new Date().toISOString()
            })
        })
    }),
    collection: () => ({
        where: () => ({
            getDocs: async () => ({
                forEach: (callback) => {
                    // Simula alcuni documenti
                    for (let i = 0; i < 3; i++) {
                        callback({
                            id: `bypass-doc-${i}`,
                            data: () => ({
                                type: i % 2 === 0 ? 'week' : 'lesson',
                                completed: true,
                                userId: mockUser.uid,
                                timestamp: new Date().toISOString()
                            })
                        });
                    }
                }
            })
        })
    })
};

// Funzioni Firestore mock
export const doc = db.doc;
export const collection = db.collection;
export const query = (collection, ...constraints) => collection;
export const where = (field, operator, value) => ({ getDocs: db.collection().where().getDocs });
export const getDocs = async (query) => query.getDocs ? await query.getDocs() : { forEach: () => {} };
export const getDoc = async (docRef) => docRef.get ? await docRef.get() : { exists: () => false, data: () => ({}) };

// Firebase Auth functions mock
export const signInWithEmailAndPassword = auth.signInWithEmailAndPassword;
export const createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword;
export const sendPasswordResetEmail = auth.sendPasswordResetEmail;
export const onAuthStateChanged = auth.onAuthStateChanged;

// Aggiorna UI automaticamente per mostrare utente bypass
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Aggiorna elementi user name
        const userElements = document.querySelectorAll('.user-name, .username, .user-display, [data-user-name]');
        userElements.forEach(el => {
            el.textContent = mockUser.displayName;
        });

        // Aggiorna elementi email
        const emailElements = document.querySelectorAll('.user-email, [data-user-email]');
        emailElements.forEach(el => {
            el.textContent = mockUser.email;
        });

        // Aggiorna welcome messages
        const welcomeElements = document.querySelectorAll('.welcome-user');
        welcomeElements.forEach(el => {
            el.textContent = `Ciao ${mockUser.displayName}!`;
        });

        // Setup logout buttons
        const logoutButtons = document.querySelectorAll('.logout-btn, [data-logout]');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', handleLogout);
        });

        console.log('🚫 UI aggiornata con utente bypass');
    }, 500);
});

// Banner di notifica bypass
function showBypassBanner() {
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(45deg, #ff9800, #ff5722);
        color: white;
        padding: 8px;
        text-align: center;
        font-size: 0.85rem;
        font-weight: 600;
        z-index: 10001;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    banner.innerHTML = '🚫 MODALITÀ BYPASS ATTIVA - Accesso libero senza autenticazione';
    
    document.body.appendChild(banner);
    
    // Sposta il contenuto della pagina in basso per fare spazio al banner
    document.body.style.paddingTop = '40px';
}

// Mostra banner quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBypassBanner);
} else {
    showBypassBanner();
}

console.log('🚫 BYPASS AUTH SYSTEM CARICATO');
console.log('🚫 Tutti i controlli di autenticazione sono disabilitati');
console.log('🚫 Accesso diretto a dashboard, moduli e tutte le funzionalità');

export default {
    auth,
    db,
    mockUser,
    bypassMode: true
};