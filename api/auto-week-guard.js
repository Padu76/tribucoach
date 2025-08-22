// auto-week-guard.js - Sistema Auto-Inject integrato con Session Manager
// Si attiva automaticamente su tutte le pagine week-*.html e salva progress

import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

class AutoWeekGuard {
    constructor() {
        this.isWeekPage = this.detectWeekPage();
        this.user = null;
        this.authTimeout = null;
        this.sessionManager = null;
        
        if (this.isWeekPage) {
            console.log('🛡️ Auto Week Guard attivato per:', window.location.pathname);
            this.init();
        }
    }

    detectWeekPage() {
        const path = window.location.pathname.toLowerCase();
        const isWeek = path.includes('/modules/week-') || 
                      path.includes('week-') ||
                      /week-[1-7]\.html/.test(path);
        
        console.log('🔍 Detecting week page:', path, '→', isWeek);
        return isWeek;
    }

    init() {
        // Inizializza session manager
        this.initSessionManager();
        
        // Mostra loading minimo
        this.showMiniLoader();
        
        // Timeout di sicurezza (3 secondi)
        this.authTimeout = setTimeout(() => {
            console.log('⏰ Auth timeout - redirect al login');
            this.redirectToLogin();
        }, 3000);

        // Controlla autenticazione
        this.checkAuth();
    }

    // 🎯 INIZIALIZZAZIONE SESSION MANAGER
    initSessionManager() {
        try {
            // Cerca session manager globale
            this.sessionManager = window.sessionManager || window.tribucoachSession;
            
            if (this.sessionManager) {
                console.log('✅ Session Manager collegato ai week guard');
                
                // Listener per cambio auth state
                this.sessionManager.onAuthStateChanged((user) => {
                    if (user && !this.user) {
                        console.log('🔄 Session Manager: User detected', user.email);
                        this.user = user;
                        this.onAuthSuccess();
                    }
                });
            } else {
                console.warn('⚠️ Session Manager non trovato, usando solo Firebase Auth');
            }
        } catch (error) {
            console.error('❌ Errore init session manager:', error);
        }
    }

    showMiniLoader() {
        // Loader minimale che non disturba
        const loader = document.createElement('div');
        loader.id = 'week-auth-loader';
        loader.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(79, 70, 229, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: opacity 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        loader.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 14px; height: 14px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Verifica accesso...
            </div>
        `;
        
        // Aggiungi CSS per animazione
        if (!document.getElementById('week-guard-styles')) {
            const style = document.createElement('style');
            style.id = 'week-guard-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(loader);
    }

    hideMiniLoader() {
        const loader = document.getElementById('week-auth-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }

    checkAuth() {
        // Prova prima con session manager se disponibile
        if (this.sessionManager && this.sessionManager.isAuthenticated) {
            console.log('✅ Autenticazione via Session Manager');
            this.user = this.sessionManager.user;
            this.onAuthSuccess();
            return;
        }

        // Fallback Firebase Auth
        onAuthStateChanged(auth, (user) => {
            if (this.authTimeout) {
                clearTimeout(this.authTimeout);
                this.authTimeout = null;
            }

            if (user) {
                console.log('✅ Utente autenticato:', user.email);
                this.user = user;
                
                // Sincronizza con session manager se disponibile
                if (this.sessionManager && !this.sessionManager.isAuthenticated) {
                    this.syncWithSessionManager(user);
                }
                
                this.onAuthSuccess();
            } else {
                console.log('❌ Utente non autenticato');
                this.redirectToLogin();
            }
        });
    }

    // 🔄 SINCRONIZZAZIONE CON SESSION MANAGER
    async syncWithSessionManager(user) {
        try {
            if (this.sessionManager) {
                // Aggiorna session manager con utente Firebase
                this.sessionManager.currentUser = user;
                this.sessionManager.sessionData.isValid = true;
                this.sessionManager.sessionData.lastActivity = Date.now();
                
                // Salva sessione
                this.sessionManager.saveSession(true);
                
                console.log('🔄 Session Manager sincronizzato con Firebase Auth');
            }
        } catch (error) {
            console.error('❌ Errore sincronizzazione session manager:', error);
        }
    }

    onAuthSuccess() {
        this.hideMiniLoader();
        this.injectUserFeatures();
        this.trackWeekAccess();
        this.saveWeekProgress();
    }

    // 💾 SALVATAGGIO PROGRESS SETTIMANA
    saveWeekProgress() {
        try {
            const weekNumber = this.getWeekNumber();
            if (!weekNumber) return;

            const progressData = {
                weekAccess: {
                    [`week_${weekNumber}`]: {
                        accessed: true,
                        accessTime: new Date().toISOString(),
                        accessCount: this.getAccessCount(weekNumber) + 1,
                        userAgent: navigator.userAgent,
                        url: window.location.href
                    }
                },
                lastWeekAccessed: weekNumber,
                totalWeeksAccessed: this.getTotalWeeksAccessed() + (this.isFirstTimeAccess(weekNumber) ? 1 : 0)
            };

            // Salva via session manager se disponibile
            if (this.sessionManager) {
                this.sessionManager.updateUserData(progressData);
                console.log('💾 Progress Week', weekNumber, 'salvato via Session Manager');
            } else {
                // Fallback localStorage
                const existing = JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
                const updated = { ...existing, ...progressData };
                localStorage.setItem('tribucoach_week_progress', JSON.stringify(updated));
                console.log('💾 Progress Week', weekNumber, 'salvato via localStorage');
            }

        } catch (error) {
            console.error('❌ Errore salvataggio progress:', error);
        }
    }

    // 📊 UTILITY PROGRESS
    getWeekNumber() {
        const weekMatch = window.location.pathname.match(/week-(\d+)/);
        return weekMatch ? parseInt(weekMatch[1]) : null;
    }

    getAccessCount(weekNumber) {
        try {
            const data = this.sessionManager ? 
                        this.sessionManager.userData : 
                        JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
            
            return data.weekAccess?.[`week_${weekNumber}`]?.accessCount || 0;
        } catch {
            return 0;
        }
    }

    getTotalWeeksAccessed() {
        try {
            const data = this.sessionManager ? 
                        this.sessionManager.userData : 
                        JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
            
            return data.totalWeeksAccessed || 0;
        } catch {
            return 0;
        }
    }

    isFirstTimeAccess(weekNumber) {
        try {
            const data = this.sessionManager ? 
                        this.sessionManager.userData : 
                        JSON.parse(localStorage.getItem('tribucoach_week_progress') || '{}');
            
            return !data.weekAccess?.[`week_${weekNumber}`]?.accessed;
        } catch {
            return true;
        }
    }

    injectUserFeatures() {
        // Cerca header o navbar esistente per iniettare logout
        const header = document.querySelector('header, .header, .navbar, nav') || 
                      document.querySelector('.dashboard-header, .page-header');
        
        if (header && !document.getElementById('injected-user-controls')) {
            this.injectUserControls(header);
        }

        // Mostra info utente se c'è uno slot
        this.injectUserInfo();
        
        // Aggiungi progress indicator
        this.injectProgressIndicator();
    }

    // 📈 INDICATORE PROGRESS
    injectProgressIndicator() {
        const weekNumber = this.getWeekNumber();
        if (!weekNumber) return;

        const totalWeeks = this.getTotalWeeksAccessed();
        const accessCount = this.getAccessCount(weekNumber);

        const progressIndicator = document.createElement('div');
        progressIndicator.id = 'week-progress-indicator';
        progressIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 10px 16px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        progressIndicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                📊 Week ${weekNumber} • Visita #${accessCount + 1} • ${totalWeeks} settimane esplorate
            </div>
        `;

        document.body.appendChild(progressIndicator);

        // Auto-hide dopo 5 secondi
        setTimeout(() => {
            progressIndicator.style.opacity = '0';
            setTimeout(() => progressIndicator.remove(), 300);
        }, 5000);
    }

    injectUserControls(header) {
        const userControls = document.createElement('div');
        userControls.id = 'injected-user-controls';
        userControls.style.cssText = `
            position: absolute;
            top: 15px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 8px 16px;
            border-radius: 25px;
            border: 1px solid rgba(255,255,255,0.2);
            font-size: 14px;
            z-index: 1000;
        `;

        userControls.innerHTML = `
            <span style="color: rgba(255,255,255,0.9); font-weight: 500;">
                👋 ${this.user.displayName || this.user.email.split('@')[0]}
            </span>
            <button id="week-logout-btn" style="
                background: rgba(239, 68, 68, 0.8);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(239, 68, 68, 1)'" 
               onmouseout="this.style.background='rgba(239, 68, 68, 0.8)'">
                Logout
            </button>
        `;

        header.style.position = 'relative';
        header.appendChild(userControls);

        // Event listener per logout
        document.getElementById('week-logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    injectUserInfo() {
        // Cerca elementi con classe user-name, username, etc. per popolarli
        const userElements = document.querySelectorAll('.user-name, .username, .user-display, [data-user-name]');
        
        userElements.forEach(el => {
            if (!el.textContent.trim()) {
                el.textContent = this.user.displayName || this.user.email.split('@')[0];
            }
        });

        // Cerca elementi email
        const emailElements = document.querySelectorAll('.user-email, [data-user-email]');
        emailElements.forEach(el => {
            if (!el.textContent.trim()) {
                el.textContent = this.user.email;
            }
        });
    }

    trackWeekAccess() {
        try {
            // Estrai numero settimana
            const weekNumber = this.getWeekNumber();

            if (weekNumber) {
                console.log('📊 Tracciando accesso Week', weekNumber, 'per', this.user.email);
                
                // Google Analytics se disponibile
                if (window.gtag) {
                    gtag('event', 'week_access', {
                        week_number: weekNumber,
                        user_id: this.user.uid,
                        user_email: this.user.email,
                        access_count: this.getAccessCount(weekNumber) + 1
                    });
                }

                // Custom event per altri sistemi di tracking
                window.dispatchEvent(new CustomEvent('tribucoachWeekAccess', {
                    detail: {
                        weekNumber,
                        user: this.user,
                        accessCount: this.getAccessCount(weekNumber) + 1,
                        totalWeeksAccessed: this.getTotalWeeksAccessed()
                    }
                }));
            }
        } catch (error) {
            console.warn('⚠️ Errore nel tracking:', error);
        }
    }

    async handleLogout() {
        try {
            const logoutBtn = document.getElementById('week-logout-btn');
            if (logoutBtn) {
                logoutBtn.innerHTML = '<div style="width: 12px; height: 12px; border: 2px solid #fff; border-top: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
                logoutBtn.disabled = true;
            }

            // Logout unificato
            if (this.sessionManager) {
                // Usa session manager per logout completo
                await this.sessionManager.logout();
                console.log('🔄 Logout via Session Manager completato');
            } else {
                // Fallback Firebase Auth
                await auth.signOut();
                console.log('🔄 Logout via Firebase Auth completato');
            }
            
            // Cleanup storage tradizionale (backward compatibility)
            sessionStorage.clear();
            localStorage.removeItem('lifestyleCoachUser');
            
            console.log('👋 Logout completato');
            
            // Redirect dopo breve delay
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 500);

        } catch (error) {
            console.error('❌ Errore logout:', error);
            alert('Errore durante il logout. Riprova.');
            
            // Reset button
            const logoutBtn = document.getElementById('week-logout-btn');
            if (logoutBtn) {
                logoutBtn.innerHTML = 'Logout';
                logoutBtn.disabled = false;
            }
        }
    }

    redirectToLogin() {
        this.hideMiniLoader();
        
        // Salva pagina corrente per redirect post-login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
        
        console.log('🔄 Redirect al login, salvataggio pagina:', window.location.pathname);
        
        // Redirect
        window.location.href = '/login.html';
    }

    // 📊 METODI PUBBLICI PER STATS
    getWeekStats() {
        const weekNumber = this.getWeekNumber();
        return {
            currentWeek: weekNumber,
            accessCount: this.getAccessCount(weekNumber),
            totalWeeksAccessed: this.getTotalWeeksAccessed(),
            isFirstAccess: this.isFirstTimeAccess(weekNumber),
            userData: this.sessionManager ? this.sessionManager.userData : null
        };
    }
}

// Auto-inizializzazione quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.autoWeekGuard = new AutoWeekGuard();
    });
} else {
    window.autoWeekGuard = new AutoWeekGuard();
}

// Export per uso manuale se necessario
window.AutoWeekGuard = AutoWeekGuard;

console.log('🛡️ Auto Week Guard con Session Manager Integration caricato!');