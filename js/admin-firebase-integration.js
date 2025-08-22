// admin-firebase-integration.js - Integrazione Firebase con Admin Dashboard
// Utilizza il sistema Firebase esistente + Session Manager

class AdminFirebaseIntegration {
    constructor() {
        this.firebaseAuth = null;
        this.firebaseDB = null;
        this.isInitialized = false;
        this.currentUser = null;
        
        console.log('🔥 Admin Firebase Integration inizializzato');
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Caricamento Firebase per Admin Dashboard...');
            
            // 1. Importa Firebase Config esistente
            const firebaseModule = await import('../api/firebase-config.js');
            this.firebaseAuth = firebaseModule.auth;
            this.firebaseDB = firebaseModule.db;
            
            console.log('✅ Firebase Config caricato');
            
            // 2. Verifica Session Manager
            await this.waitForSessionManager();
            
            // 3. Auto-login Firebase se Session Manager ha utente
            await this.autoLoginFromSession();
            
            // 4. Setup listeners
            this.setupAuthListener();
            
            this.isInitialized = true;
            console.log('✅ Admin Firebase Integration pronto');
            
            // 5. Notifica pronto
            window.dispatchEvent(new CustomEvent('adminFirebaseReady', {
                detail: { 
                    authenticated: !!this.currentUser,
                    user: this.currentUser 
                }
            }));
            
        } catch (error) {
            console.error('❌ Errore inizializzazione Admin Firebase:', error);
            this.initializeFallback();
        }
    }

    async waitForSessionManager() {
        console.log('⏳ Aspetto Session Manager...');
        
        let attempts = 0;
        while (!window.sessionManager && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.sessionManager) {
            console.log('🔗 Session Manager trovato');
        } else {
            console.warn('⚠️ Session Manager non disponibile');
        }
    }

    async autoLoginFromSession() {
        try {
            // Verifica se Session Manager ha utente autenticato
            if (!window.sessionManager || !window.isUserAuthenticated()) {
                console.log('👤 Nessun utente nel Session Manager');
                return;
            }

            const sessionUser = window.getCurrentUser();
            if (!sessionUser?.email) {
                console.log('👤 Dati utente incompleti');
                return;
            }

            console.log('🔄 Auto-login Firebase per admin:', sessionUser.email);

            // Prova login con credenziali conosciute
            const credentials = this.getKnownCredentials(sessionUser.email);
            
            if (credentials) {
                await this.loginWithFirebase(credentials.email, credentials.password);
            } else {
                // Crea utente Firebase se non esiste
                await this.createOrLoginFirebaseUser(sessionUser);
            }
            
        } catch (error) {
            console.error('❌ Errore auto-login Firebase:', error);
        }
    }

    getKnownCredentials(email) {
        // Credenziali note per admin
        const knownUsers = {
            'admin@tribu.com': 'tribu2025',
            'andrea@tribucoach.com': 'coach123',
            'admin@tribucoach.com': 'admin123',
            'demo@tribucoach.com': 'demo123'
        };
        
        if (knownUsers[email]) {
            return { email, password: knownUsers[email] };
        }
        
        return null;
    }

    async loginWithFirebase(email, password) {
        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js');
            
            const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
            this.currentUser = userCredential.user;
            
            console.log('✅ Firebase Auth completato per admin:', email);
            return { success: true, user: this.currentUser };
            
        } catch (error) {
            console.warn('⚠️ Login Firebase fallito, provo creazione utente:', error.code);
            
            if (error.code === 'auth/user-not-found') {
                return await this.createFirebaseUser(email, password);
            }
            
            throw error;
        }
    }

    async createFirebaseUser(email, password) {
        try {
            const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js');
            
            const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
            this.currentUser = userCredential.user;
            
            // Aggiorna profilo con nome dal Session Manager
            const sessionUser = window.getCurrentUser();
            if (sessionUser?.displayName) {
                await updateProfile(this.currentUser, {
                    displayName: sessionUser.displayName
                });
            }
            
            console.log('✅ Utente Firebase creato per admin:', email);
            return { success: true, user: this.currentUser };
            
        } catch (error) {
            console.error('❌ Errore creazione utente Firebase:', error);
            throw error;
        }
    }

    async createOrLoginFirebaseUser(sessionUser) {
        try {
            // Genera password temporanea basata su email
            const tempPassword = this.generateTempPassword(sessionUser.email);
            
            // Prova login, se fallisce crea utente
            try {
                await this.loginWithFirebase(sessionUser.email, tempPassword);
            } catch (error) {
                if (error.code === 'auth/user-not-found') {
                    await this.createFirebaseUser(sessionUser.email, tempPassword);
                } else {
                    throw error;
                }
            }
            
        } catch (error) {
            console.error('❌ Errore gestione utente Firebase:', error);
        }
    }

    generateTempPassword(email) {
        // Genera password consistente basata su email
        const hash = email.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        return 'temp' + Math.abs(hash).toString().substring(0, 8);
    }

    setupAuthListener() {
        if (!this.firebaseAuth) return;
        
        const { onAuthStateChanged } = this.firebaseAuth.app.options;
        
        // Listen Firebase auth changes
        import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js')
            .then(({ onAuthStateChanged }) => {
                onAuthStateChanged(this.firebaseAuth, (user) => {
                    this.currentUser = user;
                    
                    if (user) {
                        console.log('🔥 Firebase Auth State: Logged in as', user.email);
                        this.updateAuthUI(true, user);
                    } else {
                        console.log('🔥 Firebase Auth State: Logged out');
                        this.updateAuthUI(false, null);
                    }
                });
            });
    }

    updateAuthUI(isAuthenticated, user) {
        // Aggiorna indicatori UI Firebase
        const indicators = document.querySelectorAll('[data-firebase-status]');
        indicators.forEach(el => {
            if (isAuthenticated) {
                el.textContent = `🔥 Firebase: ${user.email}`;
                el.style.color = '#4CAF50';
                el.classList.add('firebase-connected');
            } else {
                el.textContent = '🔥 Firebase: Disconnesso';
                el.style.color = '#f44336';
                el.classList.remove('firebase-connected');
            }
        });

        // Aggiorna status nella connection bar
        if (window.updateConnectionStatus) {
            const status = isAuthenticated ? 
                `🔥 Firebase Auth: ${user.email}` : 
                '🔥 Firebase: Auth richiesta';
            const color = isAuthenticated ? '#4CAF50' : '#ff9800';
            
            window.updateConnectionStatus(status, color);
        }
    }

    async initializeFallback() {
        console.log('🔄 Inizializzazione fallback Firebase...');
        
        try {
            // Usa demo auth system se Firebase fallisce
            const demoAuth = await import('../api/demo-auth-system.js');
            this.firebaseAuth = demoAuth.auth;
            this.firebaseDB = demoAuth.db;
            
            console.log('✅ Fallback Demo Auth attivo');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('❌ Anche fallback fallito:', error);
        }
    }

    // Metodi pubblici per dashboard admin
    async logout() {
        try {
            if (this.firebaseAuth && this.currentUser) {
                const { signOut } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js');
                await signOut(this.firebaseAuth);
            }
            
            this.currentUser = null;
            console.log('🚪 Firebase logout completato');
            
        } catch (error) {
            console.error('❌ Errore logout Firebase:', error);
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getUser() {
        return this.currentUser;
    }

    getDB() {
        return this.firebaseDB;
    }

    async testConnection() {
        try {
            if (!this.firebaseDB) {
                throw new Error('Database non inizializzato');
            }

            // Test con una query semplice
            const { collection, query, limit, getDocs } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js');
            
            const testQuery = query(collection(this.firebaseDB, 'quiz_results'), limit(1));
            const snapshot = await getDocs(testQuery);
            
            console.log('✅ Test connessione Firebase OK');
            return { success: true, docs: snapshot.size };
            
        } catch (error) {
            console.error('❌ Test connessione Firebase fallito:', error);
            return { success: false, error: error.message };
        }
    }

    // Wrapper per le funzioni Firebase esistenti
    async importFirebaseFunctions() {
        try {
            const functions = await import('../api/firebase-functions.js');
            
            // Esponi funzioni come metodi della classe
            this.getAllQuizResults = functions.getAllQuizResults;
            this.getLeads = functions.getLeads;
            this.getMetrics = functions.getMetrics;
            this.setupQuizListener = functions.setupQuizListener;
            this.setupLeadsListener = functions.setupLeadsListener;
            
            console.log('✅ Firebase Functions importate');
            return functions;
            
        } catch (error) {
            console.error('❌ Errore import Firebase Functions:', error);
            return null;
        }
    }
}

// Inizializzazione globale
let adminFirebaseIntegration = null;

// Funzione di inizializzazione
async function initAdminFirebase() {
    if (adminFirebaseIntegration) {
        return adminFirebaseIntegration;
    }
    
    console.log('🔥 Inizializzazione Admin Firebase Integration...');
    
    adminFirebaseIntegration = new AdminFirebaseIntegration();
    
    // Aspetta inizializzazione
    return new Promise((resolve) => {
        const checkReady = () => {
            if (adminFirebaseIntegration.isInitialized) {
                resolve(adminFirebaseIntegration);
            } else {
                setTimeout(checkReady, 100);
            }
        };
        checkReady();
    });
}

// Esposizione globale
window.initAdminFirebase = initAdminFirebase;
window.adminFirebaseIntegration = adminFirebaseIntegration;

// Funzioni helper globali
window.isFirebaseReady = () => adminFirebaseIntegration?.isInitialized || false;
window.getFirebaseDB = () => adminFirebaseIntegration?.getDB();
window.testFirebaseConnection = () => adminFirebaseIntegration?.testConnection();

// Auto-inizializzazione se siamo in admin dashboard
if (window.location.pathname.includes('admin-dashboard')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initAdminFirebase, 1000);
    });
}

console.log('✅ Admin Firebase Integration module loaded!');