// unified-session-manager.js - Sistema sessione persistente unificato per TribuCoach
// 🎯 Risolve problemi di persistenza dati e login

class UnifiedSessionManager {
    constructor() {
        this.sessionKey = 'tribucoach_session';
        this.userKey = 'tribucoach_user';
        this.authKey = 'tribucoach_auth';
        this.dataKey = 'tribucoach_dashboard_data';
        
        this.currentUser = null;
        this.sessionData = {};
        this.dashboardData = {};
        this.authListeners = [];
        
        console.log('🔐 Unified Session Manager inizializzato');
        this.init();
    }

    async init() {
        console.log('🚀 Inizializzazione sessione unificata...');
        
        // 1. Recupera sessione esistente
        await this.loadExistingSession();
        
        // 2. Recupera dati dashboard
        await this.loadDashboardData();
        
        // 3. Valida e ripristina stato
        await this.validateAndRestoreState();
        
        // 4. Setup auto-save
        this.setupAutoSave();
        
        console.log('✅ Sessione unificata pronta:', {
            user: this.currentUser ? this.currentUser.email : 'nessuno',
            sessionValid: !!this.sessionData.isValid,
            dataLoaded: Object.keys(this.dashboardData).length
        });
    }

    // 🔄 CARICAMENTO SESSIONE ESISTENTE
    async loadExistingSession() {
        try {
            // Prova localStorage prima (permanente)
            const savedSession = localStorage.getItem(this.sessionKey);
            const savedUser = localStorage.getItem(this.userKey);
            const savedAuth = localStorage.getItem(this.authKey);
            
            if (savedSession && savedUser) {
                this.sessionData = JSON.parse(savedSession);
                this.currentUser = JSON.parse(savedUser);
                
                // Valida timestamp sessione
                const sessionAge = Date.now() - this.sessionData.loginTime;
                const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 giorni
                
                if (sessionAge < maxAge) {
                    this.sessionData.isValid = true;
                    this.sessionData.lastActivity = Date.now();
                    
                    console.log('✅ Sessione ripristinata:', {
                        user: this.currentUser.email,
                        age: Math.round(sessionAge / (1000 * 60 * 60)) + ' ore',
                        valid: true
                    });
                    
                    // Aggiorna auth state
                    this.updateAuthState(this.currentUser);
                    return true;
                } else {
                    console.log('⏰ Sessione scaduta, cleanup...');
                    this.clearSession();
                }
            }
            
            // Fallback sessionStorage
            const tempSession = sessionStorage.getItem(this.sessionKey);
            if (tempSession) {
                const tempData = JSON.parse(tempSession);
                console.log('🔄 Fallback sessione temporanea:', tempData);
                this.sessionData = tempData;
                this.sessionData.isValid = true;
                return true;
            }
            
        } catch (error) {
            console.error('❌ Errore caricamento sessione:', error);
            this.clearSession();
        }
        
        return false;
    }

    // 📊 CARICAMENTO DATI DASHBOARD
    async loadDashboardData() {
        try {
            const savedData = localStorage.getItem(this.dataKey);
            if (savedData) {
                this.dashboardData = JSON.parse(savedData);
                console.log('📊 Dati dashboard ripristinati:', Object.keys(this.dashboardData));
                
                // Verifica età dati
                if (this.dashboardData.lastUpdate) {
                    const dataAge = Date.now() - this.dashboardData.lastUpdate;
                    const maxDataAge = 24 * 60 * 60 * 1000; // 24 ore
                    
                    if (dataAge > maxDataAge) {
                        console.log('📡 Dati dashboard obsoleti, refresh necessario');
                        this.dashboardData.needsRefresh = true;
                    }
                }
            }
        } catch (error) {
            console.error('❌ Errore caricamento dati dashboard:', error);
            this.dashboardData = {};
        }
    }

    // ✅ VALIDAZIONE E RIPRISTINO STATO
    async validateAndRestoreState() {
        if (this.currentUser && this.sessionData.isValid) {
            // Notifica componenti che l'utente è loggato
            this.notifyAuthListeners(this.currentUser);
            
            // Ripristina stato UI se necessario
            this.restoreUIState();
            
            // Auto-refresh dati se obsoleti
            if (this.dashboardData.needsRefresh) {
                setTimeout(() => {
                    this.refreshDashboardData();
                }, 1000);
            }
        }
    }

    // 🎯 LOGIN UNIFICATO
    async login(email, password, rememberMe = true) {
        console.log('🔐 Login tentativo:', email, rememberMe ? '(persistente)' : '(sessione)');
        
        try {
            // Simula autenticazione (in produzione userai Firebase Auth)
            const user = await this.authenticateUser(email, password);
            
            if (user) {
                this.currentUser = user;
                this.sessionData = {
                    isValid: true,
                    loginTime: Date.now(),
                    lastActivity: Date.now(),
                    rememberMe: rememberMe,
                    loginMethod: 'email_password'
                };
                
                // Salva sessione
                this.saveSession(rememberMe);
                
                // Notifica listeners
                this.notifyAuthListeners(this.currentUser);
                
                // Carica dati utente
                await this.loadUserData();
                
                console.log('✅ Login completato:', user.email);
                return { success: true, user: user };
                
            } else {
                throw new Error('Credenziali non valide');
            }
            
        } catch (error) {
            console.error('❌ Errore login:', error);
            return { success: false, error: error.message };
        }
    }

    // 🚪 LOGOUT UNIFICATO
    async logout() {
        console.log('🚪 Logout in corso...');
        
        try {
            // Salva dati importanti prima del logout
            await this.saveDashboardData();
            
            // Clear session
            this.currentUser = null;
            this.sessionData = { isValid: false };
            
            // Clear storage
            this.clearSession();
            
            // Notifica listeners
            this.notifyAuthListeners(null);
            
            console.log('✅ Logout completato');
            return { success: true };
            
        } catch (error) {
            console.error('❌ Errore logout:', error);
            return { success: false, error: error.message };
        }
    }

    // 💾 SALVATAGGIO SESSIONE
    saveSession(persistent = true) {
        try {
            const sessionStr = JSON.stringify(this.sessionData);
            const userStr = JSON.stringify(this.currentUser);
            
            if (persistent) {
                // Salva in localStorage (permanente)
                localStorage.setItem(this.sessionKey, sessionStr);
                localStorage.setItem(this.userKey, userStr);
                localStorage.setItem(this.authKey, JSON.stringify({
                    isAuthenticated: true,
                    lastLogin: Date.now()
                }));
                console.log('💾 Sessione salvata (permanente)');
            } else {
                // Salva solo in sessionStorage (temporanea)
                sessionStorage.setItem(this.sessionKey, sessionStr);
                sessionStorage.setItem(this.userKey, userStr);
                console.log('💾 Sessione salvata (temporanea)');
            }
            
        } catch (error) {
            console.error('❌ Errore salvataggio sessione:', error);
        }
    }

    // 📊 SALVATAGGIO DATI DASHBOARD
    async saveDashboardData() {
        try {
            this.dashboardData.lastUpdate = Date.now();
            this.dashboardData.userId = this.currentUser?.uid || null;
            
            localStorage.setItem(this.dataKey, JSON.stringify(this.dashboardData));
            console.log('📊 Dati dashboard salvati');
            
        } catch (error) {
            console.error('❌ Errore salvataggio dati dashboard:', error);
        }
    }

    // 🧹 PULIZIA SESSIONE
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.authKey);
        sessionStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.userKey);
        
        this.currentUser = null;
        this.sessionData = { isValid: false };
        
        console.log('🧹 Sessione pulita');
    }

    // 🔄 AUTO-SAVE PERIODICO
    setupAutoSave() {
        // Salva sessione ogni 5 minuti se attiva
        setInterval(() => {
            if (this.sessionData.isValid) {
                this.sessionData.lastActivity = Date.now();
                this.saveSession(this.sessionData.rememberMe);
            }
        }, 5 * 60 * 1000);
        
        // Salva dati dashboard ogni 2 minuti
        setInterval(() => {
            if (this.currentUser) {
                this.saveDashboardData();
            }
        }, 2 * 60 * 1000);
        
        console.log('⏰ Auto-save attivato');
    }

    // 👤 CARICAMENTO DATI UTENTE
    async loadUserData() {
        if (!this.currentUser) return;
        
        try {
            console.log('👤 Caricamento dati utente...');
            
            // Simula caricamento dati specifici utente
            const userData = {
                profile: {
                    name: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                    email: this.currentUser.email,
                    joinDate: this.currentUser.metadata?.creationTime || new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                },
                preferences: {
                    dashboard: {
                        autoRefresh: true,
                        refreshInterval: 60000,
                        theme: 'dark'
                    }
                },
                stats: {
                    loginCount: (this.dashboardData.loginCount || 0) + 1,
                    totalSessions: (this.dashboardData.totalSessions || 0) + 1
                }
            };
            
            // Merge con dati esistenti
            this.dashboardData = { ...this.dashboardData, ...userData };
            
            console.log('✅ Dati utente caricati');
            
        } catch (error) {
            console.error('❌ Errore caricamento dati utente:', error);
        }
    }

    // 🔐 AUTENTICAZIONE DEMO
    async authenticateUser(email, password) {
        // Demo users (in produzione userai Firebase Auth)
        const demoUsers = [
            {
                uid: 'demo-user-001',
                email: 'demo@tribucoach.com',
                password: 'demo123',
                displayName: 'Demo User',
                emailVerified: true,
                metadata: {
                    creationTime: '2024-01-15T10:00:00Z',
                    lastSignInTime: new Date().toISOString()
                }
            },
            {
                uid: 'andrea-coach-001',
                email: 'andrea@tribucoach.com',
                password: 'coach123',
                displayName: 'Andrea Padoan',
                emailVerified: true,
                metadata: {
                    creationTime: '2024-01-01T09:00:00Z',
                    lastSignInTime: new Date().toISOString()
                }
            }
        ];
        
        // Simula delay di rete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Rimuovi password dal risultato
            const { password: _, ...safeUser } = user;
            safeUser.metadata.lastSignInTime = new Date().toISOString();
            return safeUser;
        }
        
        return null;
    }

    // 📡 REFRESH DATI DASHBOARD
    async refreshDashboardData() {
        console.log('📡 Refresh dati dashboard...');
        
        try {
            // Qui chiameresti le tue API Firebase
            // Per ora simuliamo nuovi dati
            const newData = {
                lastRefresh: Date.now(),
                metrics: {
                    totalQuizzes: Math.floor(Math.random() * 100),
                    totalChats: Math.floor(Math.random() * 50),
                    qualifiedLeads: Math.floor(Math.random() * 25)
                },
                needsRefresh: false
            };
            
            this.dashboardData = { ...this.dashboardData, ...newData };
            await this.saveDashboardData();
            
            // Notifica componenti del refresh
            this.notifyDataRefresh();
            
            console.log('✅ Dati dashboard aggiornati');
            
        } catch (error) {
            console.error('❌ Errore refresh dashboard:', error);
        }
    }

    // 🎨 RIPRISTINO STATO UI
    restoreUIState() {
        try {
            // Ripristina elementi UI basati sui dati utente
            if (this.currentUser) {
                // Nome utente
                const userNameElements = document.querySelectorAll('[data-user-name]');
                userNameElements.forEach(el => {
                    el.textContent = this.currentUser.displayName || this.currentUser.email;
                });
                
                // Email utente
                const userEmailElements = document.querySelectorAll('[data-user-email]');
                userEmailElements.forEach(el => {
                    el.textContent = this.currentUser.email;
                });
                
                // Stato login
                const loginElements = document.querySelectorAll('[data-login-state]');
                loginElements.forEach(el => {
                    el.classList.add('logged-in');
                    el.classList.remove('logged-out');
                });
            }
            
            console.log('🎨 Stato UI ripristinato');
            
        } catch (error) {
            console.error('❌ Errore ripristino UI:', error);
        }
    }

    // 📢 GESTIONE LISTENERS
    onAuthStateChanged(callback) {
        this.authListeners.push(callback);
        
        // Chiama immediatamente con stato corrente
        setTimeout(() => callback(this.currentUser), 50);
        
        // Ritorna funzione di unsubscribe
        return () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
                this.authListeners.splice(index, 1);
            }
        };
    }

    notifyAuthListeners(user) {
        this.authListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('❌ Errore in auth listener:', error);
            }
        });
    }

    notifyDataRefresh() {
        // Dispatch custom event per notify altri componenti
        window.dispatchEvent(new CustomEvent('tribucoachDataRefresh', {
            detail: { data: this.dashboardData }
        }));
    }

    // 🔍 GETTERS PUBBLICI
    get user() {
        return this.currentUser;
    }

    get isAuthenticated() {
        return this.sessionData.isValid && !!this.currentUser;
    }

    get sessionInfo() {
        return {
            isValid: this.sessionData.isValid,
            loginTime: this.sessionData.loginTime,
            lastActivity: this.sessionData.lastActivity,
            loginMethod: this.sessionData.loginMethod,
            rememberMe: this.sessionData.rememberMe
        };
    }

    get userData() {
        return this.dashboardData;
    }

    // 🔧 METODI UTILI
    updateUserData(newData) {
        this.dashboardData = { ...this.dashboardData, ...newData };
        this.saveDashboardData();
    }

    extendSession() {
        if (this.sessionData.isValid) {
            this.sessionData.lastActivity = Date.now();
            this.saveSession(this.sessionData.rememberMe);
        }
    }

    getSessionAge() {
        if (this.sessionData.loginTime) {
            return Date.now() - this.sessionData.loginTime;
        }
        return 0;
    }
}

// 🌟 INIZIALIZZAZIONE GLOBALE
const sessionManager = new UnifiedSessionManager();

// 📤 EXPORT PER COMPATIBILITÀ
export { sessionManager };

// 🌐 RENDI DISPONIBILE GLOBALMENTE
window.sessionManager = sessionManager;
window.tribucoachSession = sessionManager;

// 🎯 FUNZIONI HELPER GLOBALI
window.loginUser = (email, password, remember) => sessionManager.login(email, password, remember);
window.logoutUser = () => sessionManager.logout();
window.getCurrentUser = () => sessionManager.user;
window.isUserAuthenticated = () => sessionManager.isAuthenticated;
window.getUserData = () => sessionManager.userData;
window.updateUserData = (data) => sessionManager.updateUserData(data);

// 🔄 AUTO-RESTORE AL CARICAMENTO PAGINA
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TribuCoach Session Manager pronto!');
    console.log('👤 Utente corrente:', sessionManager.user?.email || 'nessuno');
    console.log('🔐 Autenticato:', sessionManager.isAuthenticated);
    
    // Se utente loggato, mostra info
    if (sessionManager.isAuthenticated) {
        const sessionAge = Math.round(sessionManager.getSessionAge() / (1000 * 60));
        console.log(`⏰ Sessione attiva da ${sessionAge} minuti`);
    }
});

console.log('✅ Unified Session Manager caricato - Persistenza dati garantita!');
